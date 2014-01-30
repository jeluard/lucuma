(ns lucuma
  (:require [clojure.string :as string]
            [lucuma.custom-elements :as ce]
            [lucuma.polymer :as p]
            [lucuma.shadow-dom :as sd]
            [lucuma.util :as u])
  (:refer-clojure :exclude [methods]))

(def ^:private registry (atom {}))

;;
;; Lucuma prototype
;;

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
  type)

(defmethod render-content js/String [s] s)

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

(defn- render-then-append!
  [render-fn append-fn! el o]
  (when-let [o (if (fn? o) (o el) o)]
    (letfn [(append [el o] (when-let [r (render-fn o)] (append-fn! el r)))]
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

;;
;; prototype creation
;;

(defn- host-type
  [h]
  "Returns type from host element.

  e.g.
   :host :div => 'div'
   :host [:div {:key :value}] => 'div'
   :host {:key :value} => nil"
  (when-let [t (cond (vector? h) (first h) (keyword? h) (name h))]
    (name t)))

(defn- host-attributes
  [h]
  "Returns attributes from host element.

  e.g.
   :host :div => nil
   :host [:div {:key :value}] => {:key :value}
   :host {:key :value} => {:key :value}"
  (cond
   (vector? h) (second h)
   (map? h) h))

(declare definition->el-id)

(defn- host-type->extends
  "Returns extended type from host element.

  e.g.
   'div' => nil
   'lucu-element' => nil (when lucu-element does not extend any element)
   'lucu-element' => 'div' (when lucu-element extends div, recursively finds the root extended element)
   'non-lucu-element' => ::not-found'"
  [t]
  (cond
   (u/valid-standard-element-name? t) nil
   (contains? @registry t) (first (definition->el-id (get @registry t)))
   ;;TODO polymer: https://github.com/Polymer/polymer/commit/e269582047fb4d384a48c9890906bf06742a932b
   :else ::not-found))

(defn- definition->el-id
  [m]
  "Returns [type, extended-type] from host/extends element.

  e.g.
   :host nil => nil
   :host :div => ['div' nil]
   :host :lucu-element => ['lucu-element' nil]  (when lucu-element does not extend any element)
   :host :lucu-element => ['div' 'lucu-element'] (when lucu-element extends div, recursively finds the root extended element)
   :host :non-lucu-element => exception thrown
   :host :non-lucu-element :extends :div => ['div' 'non-lucu-element']"
  (when-let [t (host-type (:host m))]
    (let [ei (host-type->extends t)
          eic (when (not= ei ::not-found) ei)
          ep (when-let [e (:extends m)] (name e))
          e (or eic ep)]
      (when (and eic ep)
        (throw (ex-info "Infered extends value but a value for :extends was supplied" {:type t :inferred ei :provided ep})))
      (when (and (not ep) (= ei ::not-found))
        (throw (ex-info "Could not infer extends value and no value for :extends supplied" {:type t})))
      (if e [e t] [t nil]))))

(defn- create-element
  [n is]
  (if is
    (.createElement js/document n is)
    (.createElement js/document n)))

(defn- type->prototype
  [n is]
  (if n
    (.getPrototypeOf js/Object (create-element n is))
    (.-prototype js/HTMLElement)))

(defn- initialize!
  [el f m attributes handlers]
  ;;
  (doseq [attribute (array-seq (.-attributes el))]
    (attribute-changed el (.-name attribute) nil (.-value attribute) attributes handlers))
  ;; Set host attributes extracted from :host element
  (doseq [a (host-attributes (:host m))]
    (.setAttribute el (name (key a)) (str (val a))))
  ;; Install ShadowDOM and shim if needed
  (let [sr (create-shadow-root! el m)]
    (p/shim-styling-when-needed sr (:name m) (host-type (:host m))))
  (when f (u/call-with-first-argument f el)))

(defn- create-ce-prototype
  "Creates a Custom Element prototype from a map definition."
  [m]
  (let [{:keys [host on-created attributes methods handlers]} m
        attributes (set (map name attributes))
        handlers (set (map event->handler handlers))
        on-created #(initialize! % on-created m attributes handlers)
        on-attribute-changed #(attribute-changed %1 %2 %3 %4 attributes handlers)
        prototype (ce/create-prototype
                      (merge m {:prototype (create-lucuma-prototype (apply type->prototype (definition->el-id m)))
                                :properties (concat attributes handlers) :on-created on-created :on-attribute-changed on-attribute-changed}))]
    (doseq [method methods]
      (u/safe-aset prototype (name (key method)) (u/wrap-with-callback-this-value (u/wrap-to-javascript (val method)))))
    prototype))

(defn- default-constructor-name
  [n]
  (when n
    (let [v (string/split n #"-")]
      (str (string/upper-case (first v)) (string/join (map string/capitalize (subvec v 1)))))))

(def all-keys
  #{:name :ns :constructor :host :extends :content :style :attributes :methods :handlers
    :on-created :on-attached :on-detached :reset-style-inheritance})

(defn ignored-keys
  "Returns a set of ignored keys."
  [m]
  (set (filter #(not (contains? all-keys %)) (keys m))))

(defn register
  "Registers a new Custom Element from its definition."
  [m]
  {:pre [(map? m)]}
  (let [n (:name m)
        cf (ce/register n (create-ce-prototype m) (first (definition->el-id m)))]
    (if-let [goog-ns (u/*ns*->goog-ns (:ns m))]
      (when-let [c (:constructor m (default-constructor-name n))]
        (u/safe-aset goog-ns c cf))
      (u/warn (str "Couldn't export constructor for " n " as ns " (:ns m) " is inaccessible")))
    (swap! registry assoc n m)))
