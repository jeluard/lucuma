(ns lucuma
  (:require [clojure.string :as string]
            [lucuma.custom-elements :as ce]
            [lucuma.polymer :as p]
            [lucuma.shadow-dom :as sd]
            [lucuma.template-element :as te]
            [lucuma.util :as u]))

(defn lucuma-element? [el] (exists? (.-lucuma_definition el)))

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

(defn- render-then-append!
  [render-fn append-fn! el o]
  (when-let [o (if (fn? o) (o el) o)]
    (letfn [(value [o] (if (fn? o) (o el) o))
            (append [el o] (when-let [v (value o)] (when-let [r (render-fn v)] (append-fn! el r))))]
      (if (list? o)
        (doseq [o o] (append el o))
        (append el o)))))

(defn- create-shadow-root!
  [el m]
  (let [{:keys [style content]} m]
    (when (or style content)
      (let [sr (sd/create el m)]
        (when style (render-then-append! render-style-map append-style-map! sr style))
        (when content (render-then-append! render-content append-content! sr content))))))

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

(defn- initialize!
  [el f m attributes handlers]
  (doseq [attribute (array-seq (.-attributes el))]
    (attribute-changed el (.-name attribute) nil (.-value attribute) attributes handlers))
  (create-shadow-root! el m)
  (p/install-shadow-css-shim-when-needed (.-shadowRoot el) (:name m) (:base-type m))
  (when f (u/call-with-first-argument f el)))

(defn- create-ce-prototype
  "Creates a Custom Element prototype from a map definition."
  [m]
  (let [{:keys [base-type created-fn attributes methods handlers]} m
        attributes (set (map name attributes))
        handlers (set (map event->handler handlers))
        created-fn #(initialize! % created-fn m attributes handlers)
        attribute-changed-fn #(attribute-changed %1 %2 %3 %4 attributes handlers)
        base-type (when base-type (name base-type))
        prototype (ce/create-prototype (merge m {:prototype (ce/find-prototype base-type) :properties (concat attributes handlers) :created-fn created-fn :attribute-changed-fn attribute-changed-fn}))]
    (doseq [method methods]
      (aset prototype (name (key method)) (u/wrap-with-callback-this-value (val method))))
    (set! (.-lucuma_definition prototype) m)
    prototype))

(defn- default-constructor-name
  [n]
  (when (not (nil? n))
    (let [v (string/split n #"-")]
      (str (string/upper-case (get v 0)) (string/join (map string/capitalize (subvec v 1)))))))

(defn register
  "Registers a new Custom Element from its definition. Returns true if succesful, false otherwise (e.g. already registered)."
  [m]
  (try
    (let [n (:name m)
          cf (ce/register n (create-ce-prototype m) (:base-type m))
          goog-ns (u/*ns*->goog-ns (:ns m))]
      (if goog-ns
        (when-let [c (:constructor m (default-constructor-name n))] (aset goog-ns c cf))
        (u/warn (str "Couldn't export constructor for " n " as ns " (:ns m) " is inaccessible")))
      true)
    (catch js/DomException e false)))
