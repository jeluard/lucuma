(ns lucuma
  (:require [lucuma.attribute :as att]
            [lucuma.custom-elements :as ce]
            [lucuma.shadow-dom :as sd]
            [lucuma.util :as u]))

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
      (.shimStyling js/Platform.ShadowCSS sr n base-type)
      (.shimStyling js/Platform.ShadowCSS sr n))))

(defmulti render-content
  "render 'content' to something that can be added to the DOM"
  ;; Hack to workaround browsers where document.createElement('template').constructor != HTMLTemplateElement but still document.createElement('template') instanceof HTMLTemplateElement
  ;; see https://github.com/Polymer/TemplateBinding/issues/139
  ;; (type c)
  (fn [c] (if (instance? js/HTMLTemplateElement c) js/HTMLTemplateElement (type c))))

(defmethod render-content js/String [s] s)
(defmethod render-content js/HTMLTemplateElement [t] (.cloneNode (.-content t) true))
(defmethod render-content :default [c] (throw (str "No render-content implementation for " c) (ex-info {:type (type c)})))

(defmulti append-content!
  "append rendered 'content' to provided ShadowRoot"
  (fn [_ e] (if (instance? js/HTMLElement e) js/HTMLElement (type e))))

(defmethod append-content! js/String [sr s] (set! (.-innerHTML sr) s))
(defmethod append-content! js/HTMLElement [sr e] (.appendChild sr e))
(defmethod append-content! js/DocumentFragment [sr e] (.appendChild sr e))
(defmethod append-content! :default [sr e] (throw (str "No append! implementation for " e) (ex-info {:type (type e)})))

(defmulti render-style
  "render 'style' to something that can be added to the DOM"
  type)

(defmethod render-style js/String [s] s)
(defmethod render-style :default [s] (throw (str "No render-style implementation for " s) (ex-info {:type (type s)})))

(defmulti append-style!
  "append rendered 'style' to provided ShadowRoot"
  (fn [_ e] (if (instance? js/HTMLElement e) js/HTMLElement (type e))))

(defmethod append-style! js/String
  [sr s]
  (let [style (.createElement js/document "style")]
    (set! (.-textContent style) s)
    (.appendChild sr style)))

(defn- render-then-append!
  [sr render-fn append-fn c]
  (if-let [rc (render-fn c)]
    (append-fn sr rc)))

(defn- create-shadow-root!
  [e content style m]
  (when (or style content)
    (let [sr (sd/create e m)]
      (when style (render-then-append! sr render-style append-style! (u/invoke-if-fn style)))
      (when content (render-then-append! sr render-content append-content! (u/invoke-if-fn content))))))

(defn- adjust-listener
  [el e o n]
  (let [v (or o n)
        f (u/str->fn v)]
    (if (nil? o)
      (.addEventListener el e f)
      (.removeEventListener el e f))))

(defn- event->handler [h] (str "on" (name h)))
(defn- handler->event [a] (.substr a 2))

(defn attribute-change
  [el a o n attributes handlers]
  (cond
    (contains? handlers a) (let [e (handler->event a)]
                             (adjust-listener el e o n))))

(defn- attribute-changed-fn
  [attributes handlers]
  (fn [el a o n]
    (attribute-change el a o n attributes handlers)))

(defn- initialize!
  [el f m attributes handlers]
  (let [{:keys [content style]} m]
    (doseq [attribute (array-seq (.-attributes el))]
      (attribute-change el (.-name attribute) nil (.-value attribute) attributes handlers))
    (create-shadow-root! el content style m)
    (when style (install-shadow-css-shim-when-needed (.-shadowRoot el) (:name m) (:base-type m)))
    (when f (u/call-with-this-argument f el))))

(defn- create-prototype
  "create a Custom Element prototype from a map definition"
  [m]
  (let [{:keys [base-type created-fn entered-view-fn left-view-fn attributes methods handlers]} m
        attributes (set (map name attributes))
        handlers (set (map event->handler handlers))
        properties (att/properties (concat attributes handlers))
        lucuma-prototype (create-lucuma-prototype (ce/find-prototype base-type))
        prototype (if properties (.create js/Object lucuma-prototype properties) (.create js/Object lucuma-prototype))]
    (set! (.-ns prototype) (:ns m))
    (set! (.-createdCallback prototype) (u/wrap-with-callback-this-value #(initialize! % created-fn m attributes handlers)))
    (set! (.-enteredViewCallback prototype) (u/wrap-with-callback-this-value entered-view-fn))
    (set! (.-leftViewCallback prototype) (u/wrap-with-callback-this-value left-view-fn))
    (set! (.-attributeChangedCallback prototype) (u/wrap-with-callback-this-value (attribute-changed-fn attributes handlers)))
    (doseq [method methods]
      (aset prototype (name (key method)) (u/wrap-with-callback-this-value (val method))))
    prototype))

(defn register
  "register a Custom Element from an abstract definition"
  ([m] (register (:name m) m))
  ([n m]
   {:pre [(ce/valid-name? n)]}
   (let [p (create-prototype m)]
     (.register js/document n (clj->js (merge {:prototype p} (when (:base-type m) {:extends (:base-type m)}))))
     (let [c (get m :constructor (ce/default-constructor-name n))]
       (when c (aset (u/*ns*->goog-ns (:ns m)) c (.-constructor p)))))))