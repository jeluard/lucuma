(ns lucuma
  (:require [clojure.string :as string]
            [lucuma.custom-elements :as ce]
            [lucuma.polymer :as p]
            [lucuma.shadow-dom :as sd]
            [lucuma.template-element :as te]
            [lucuma.util :as u]))

(def ^:private registry (atom {}))

(defn valid-standard-element-name? [n] (when n (= -1 (.indexOf n "-"))))

(deftype LucumaElement [])
(defn lucuma-element? [el] (instance? LucumaElement el))

(defn- create-lucuma-prototype
  [base-prototype]
  (set! (.-prototype LucumaElement) base-prototype)
  (.-prototype LucumaElement))

;;
;; content / style rendering
;;

(defmulti render-content
  "Renders 'content' to something that can be added to the DOM."
  ;; Hack to workaround browsers where document.createElement('template').constructor != HTMLTemplateElement but still document.createElement('template') instanceof HTMLTemplateElement
  ;; see https://github.com/Polymer/TemplateBinding/issues/139
  ;; (type c)
  (fn [c] (if (instance? js/HTMLTemplateElement c) js/HTMLTemplateElement (type c))))

(defmethod render-content js/String [s] s)
(when (te/supported?)
  (defmethod render-content js/HTMLTemplateElement [t] (.cloneNode (.-content t) true)))

(defmulti append-content!
  "Appends rendered 'content' to provided ShadowRoot."
  (fn [_ e] (if (instance? js/HTMLElement e) js/HTMLElement (type e))))

(defmethod append-content! js/String [sr s] (set! (.-innerHTML sr) s))

(derive js/HTMLElement ::node)
(derive js/DocumentFragment ::node)

(defmethod append-content! ::node [sr e] (.appendChild sr e))

(defmulti render-style
  "Renders 'style' to something that can be added to the DOM."
  type)

(defmethod render-style js/String [s] s)

(defn- render-style-map
  [s]
  (if (map? s)
    (update-in s [:content] render-style)
    {:content (render-style s)}))

(defmulti append-style!
  "Appends rendered 'style' to provided 'style' element."
  (fn [_ e] (type e)))

(defmethod append-style! js/String [el c] (set! (.-textContent el) c))

(defn- append-style-map!
  [sr m]
  (let [el (.createElement js/document "style")
        {:keys [media title content]} m]
      (when media (set! (.-media el) media))
      (when title (set! (.-title el) title))
    (append-style! el content)
    (.appendChild sr el)))

(defn invoke-if-fn [o el] (if (fn? o) (o el) o))

(defn- render-then-append!
  [render-fn append-fn! el o]
  (when-let [o (if (fn? o) (o el) o)]
    (letfn [(append [el o] (when-let [v (invoke-if-fn o el)] (when-let [r (render-fn v)] (append-fn! el r))))]
      (if (list? o)
        (doseq [o o] (append el o))
        (append el o)))))

(defn shadow-root
  "Returns lucuma ShadowRoot for an element."
  [el]
  (.-shadowRoot el)) ;; TODO is this always right?

(defn- create-shadow-root!
  [el m]
  (let [{:keys [style content]} m]
    (when (or style content)
      (let [sr (sd/create el m)]
        (when style (render-then-append! render-style-map append-style-map! sr style))
        (when content (render-then-append! render-content append-content! sr content))
        sr))))

;;
;; listener support
;;

(defn- adjust-listener
  [el e o n]
  (if-let [f (u/str->fn (or o n))]
    (if (nil? o)
      (.addEventListener el e f)
      (.removeEventListener el e f))
    (.log js/console (str "Could not access listener fn: " (or o n)))))

(defn- event->handler [h] (str "on" (name h)))
(defn- handler->event [a] (.substr a 2))

(defn- attribute-changed
  [el a o n attributes handlers]
  (cond
    (contains? handlers a) (let [e (handler->event a)]
                             (adjust-listener el e o n))))

(defn- host-type
  [h]
  {:post [(or (nil? %) (string? %))]}
  (when-let [t (if (vector? h) (first h) h)]
    (cond
     (keyword? t) (name t)
     (string? t) t)))

(defn- host-attributes
  [h]
  {:post [(or (nil? %) (map? %))]}
  (cond
   (vector? h) (second h)
   (map? h) h))

(defn- initialize!
  [el f m attributes handlers]
  ;;
  (doseq [attribute (array-seq (.-attributes el))]
    (attribute-changed el (.-name attribute) nil (.-value attribute) attributes handlers))
  ;; Set host attributes extracted from :host element
  (doseq [a (host-attributes (:host m))]
    (.setAttribute el (name (key a)) (let [v (invoke-if-fn (val a) el)] (if (keyword? v) (name v) (str v)))))
  (let [sr (create-shadow-root! el m)]
    (p/shim-styling-when-needed sr (:name m) (host-type (:host m))))
  (when f (u/call-with-first-argument f el)))

(defn- create-element
  [n is]
  (if is
    (.createElement js/document n is)
    (.createElement js/document n)))

(declare definition->el-id)

(defn- host-type->extends
  [t e]
  (cond
   (valid-standard-element-name? t) t
   (contains? @registry t) (first (definition->el-id (get @registry t)))
   ;;TODO polymer: https://github.com/Polymer/polymer/commit/e269582047fb4d384a48c9890906bf06742a932b
   e e))

(defn- definition->el-id
  [m]
  (when-let [t (host-type (:host m))]
    (let [e (when-let [e (:extends m)] (name e))]
      [(host-type->extends t e) (when (not (valid-standard-element-name? t)) t)])))

(defn- definition->prototype
  [m]
  (if-let [[t e] (definition->el-id m)]
    (.getPrototypeOf js/Object (create-element t e))
    (.-prototype js/HTMLElement)))

(defn- create-ce-prototype
  "Creates a Custom Element prototype from a map definition."
  [m]
  (let [{:keys [host on-created attributes methods handlers]} m
        attributes (set (map name attributes))
        handlers (set (map event->handler handlers))
        on-created #(initialize! % on-created m attributes handlers)
        on-attribute-changed #(attribute-changed %1 %2 %3 %4 attributes handlers)
        prototype (definition->prototype m)
        ce-prototype (ce/create-prototype
                      (merge m {:prototype (create-lucuma-prototype prototype)
                                :properties (concat attributes handlers) :on-created on-created :on-attribute-changed on-attribute-changed}))]
    (doseq [method methods]
      (aset ce-prototype (name (key method)) (u/wrap-with-callback-this-value (val method))))
    ce-prototype))

(defn- default-constructor-name
  [n]
  (when (not (nil? n))
    (let [v (string/split n #"-")]
      (str (string/upper-case (first v)) (string/join (map string/capitalize (subvec v 1)))))))

(def all-keys
  #{:name :ns :constructor :host :extends :content :style :attributes :methods :handlers
    :on-created :on-attached :on-detached :apply-author-styles :reset-style-inheritance})

(defn ignored-keys
  "Returns a set of ignored keys."
  [m]
  (set (filter #(not (contains? all-keys %)) (keys m))))

(defn register
  "Registers a new Custom Element from its definition. Returns true if succesful, false otherwise (e.g. already registered)."
  [m]
  (try
    (let [n (:name m)
          cf (ce/register n (create-ce-prototype m) (first (definition->el-id m)))
          goog-ns (u/*ns*->goog-ns (:ns m))]
      (if goog-ns
        (when-let [c (:constructor m (default-constructor-name n))] (aset goog-ns c cf))
        (u/warn (str "Couldn't export constructor for " n " as ns " (:ns m) " is inaccessible")))
      (swap! registry assoc n m)
      true)
    (catch js/Error e false)))
