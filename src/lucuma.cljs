(ns lucuma
  (:require [lucuma.custom-elements :as ce]
            [lucuma.shadow-dom :as sd]
            [lucuma.util :as u]
            [clojure.string :as string]))

(deftype LucumaElement [])

(defn lucuma-element?
  [el]
  (instance? LucumaElement el))

(defn- create-lucuma-prototype
  [base-prototype]
  (set! (.-prototype LucumaElement) base-prototype)
  (.-prototype LucumaElement))

(defn- install-shadow-css-shim-when-needed
  "Make sure styles do not leak when using polymer polyfill.
  See https://github.com/Polymer/ShadowDOM/issues/260."
  [sr n base-type]
  (when js/ShadowDOMPolyfill
    (if base-type
      (.shimStyling js/Platform.ShadowCSS sr n (name base-type))
      (.shimStyling js/Platform.ShadowCSS sr n))))

(defmulti render-content
  "render 'content' to something that can be added to the DOM"
  ;; Hack to workaround browsers where document.createElement('template').constructor != HTMLTemplateElement but still document.createElement('template') instanceof HTMLTemplateElement
  ;; see https://github.com/Polymer/TemplateBinding/issues/139
  ;; (type c)
  (fn [c] (if (instance? js/HTMLTemplateElement c) js/HTMLTemplateElement (type c))))

(defmethod render-content js/String [s] s)
(when (exists? js/HTMLTemplateElement)
  (defmethod render-content js/HTMLTemplateElement [t] (.cloneNode (.-content t) true)))

(defmulti append-content!
  "append rendered 'content' to provided ShadowRoot"
  (fn [_ e] (if (instance? js/HTMLElement e) js/HTMLElement (type e))))

(derive js/HTMLElement ::node)
(derive js/DocumentFragment ::node)

(defmethod append-content! js/String [sr s] (set! (.-innerHTML sr) s))
(defmethod append-content! ::node [sr e] (.appendChild sr e))

(defn- render-then-append-content!
  [sr c]
  (if-let [rc (render-content c)]
    (if (coll? rc)
      (doseq [el rc] (append-content! sr el))
      (append-content! sr rc))))

(defmulti render-style
  "render 'style' to something that can be added to the DOM"
  type)

(defmethod render-style js/String [s] s)

(defmulti set-style!
  "append rendered 'style' to provided ShadowRoot"
  (fn [_ e] (type e)))

(defmethod set-style! js/String
  [sr s]
  (let [style (.createElement js/document "style")]
    (set! (.-textContent style) s)
    (.appendChild sr style)))

(defn- render-then-set-style!
  [sr c]
  (if-let [rs (render-style c)]
    (set-style! sr rs)))

(defn- create-shadow-root!
  [e content style m]
  (when (or style content)
    (let [sr (sd/create e m)]
      (when style (render-then-set-style! sr (u/invoke-if-fn style)))
      (when content (render-then-append-content! sr (u/invoke-if-fn content))))))

(defn- adjust-listener
  [el e o n]
  (let [f (u/str->fn (or o n))]
    (if (nil? o)
      (.addEventListener el e f)
      (.removeEventListener el e f))))

(defn- event->handler [h] (str "on" (name h)))
(defn- handler->event [a] (.substr a 2))

(defn attribute-changed
  [el a o n attributes handlers]
  (cond
    (contains? handlers a) (let [e (handler->event a)]
                             (adjust-listener el e o n))))

(defn- initialize!
  [el f m attributes handlers]
  (let [{:keys [content style]} m]
    (doseq [attribute (array-seq (.-attributes el))]
      (attribute-changed el (.-name attribute) nil (.-value attribute) attributes handlers))
    (create-shadow-root! el content style m)
    (when style (install-shadow-css-shim-when-needed (.-shadowRoot el) (:name m) (:base-type m)))
    (when f (u/call-with-first-argument f el))))

(defn- create-prototype
  "create a Custom Element prototype from a map definition"
  [m]
  (let [{:keys [base-type created-fn attributes methods handlers]} m
        attributes (set (map name attributes))
        handlers (set (map event->handler handlers))
        created-fn #(initialize! % created-fn m attributes handlers)
        attribute-changed-fn #(attribute-changed %1 %2 %3 %4 attributes handlers)
        base-type (when base-type (name base-type))
        p (create-lucuma-prototype (ce/find-prototype base-type))
        prototype (ce/create-prototype (merge m {:prototype p :properties (concat attributes handlers) :created-fn created-fn :attribute-changed-fn attribute-changed-fn}))]
    (doseq [method methods]
      (aset prototype (name (key method)) (u/wrap-with-callback-this-value (val method))))
    prototype))

(defn- default-constructor-name
  [n]
  (when (not (nil? n))
    (let [v (string/split n #"-")]
      (str (string/upper-case (get v 0)) (string/join (map string/capitalize (subvec v 1)))))))

(defn register
  [m]
  (let [n (:name m)
        c (:constructor m (default-constructor-name n))
        cf (ce/register n (create-prototype m) (:base-type m))
        goog-ns (u/*ns*->goog-ns (:ns m))]
    (if goog-ns
      (when c (aset goog-ns c cf))
      (u/warn (str "Couldn't export constructor for " n " as ns " (:ns m) " is inaccessible")))))
