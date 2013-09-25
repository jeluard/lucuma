(ns lucuma.custom-elements
  (:require [lucuma.shadow-dom :as sd])
  (:refer-clojure :exclude [methods]))

;; chrome tests: https://chromium.googlesource.com/chromium/blink/+/master/LayoutTests/fast/dom/custom/

(def ^:private forbidden-names #{"annotation-xml" "color-profile" "font-face" "font-face-src" "font-face-uri" "font-face-format" "font-face-name" "missing-glyph"})

(defn valid-name?
  "return true if provided name is a valid Custom Element name"
  [s]
  (and (not= -1 (.indexOf s "-"))
       (not (contains? forbidden-names s))))

(defmulti render-content
  "render 'content' to something that can be added to the DOM"
  ;; Hack to workaround browsers where document.createElement('template').constructor != HTMLTemplateElement but still document.createElement('template') instanceof HTMLTemplateElement
  ;; see https://github.com/Polymer/TemplateBinding/issues/139
  ;; (type c)
  (fn [c] (if (instance? js/HTMLTemplateElement c) js/HTMLTemplateElement (type c))))

(defmethod render-content js/String [s] s)
(defmethod render-content js/HTMLTemplateElement [t] (.cloneNode (aget t "content") true))
(defmethod render-content :default [c] (throw (str "No render-content implementation for " c) (ex-info {:type (type c)})))

(defmulti append-content!
  "append rendered 'content' to provided ShadowRoot"
  (fn [_ e] (if (instance? js/HTMLElement e) js/HTMLElement (type e))))

(defmethod append-content! js/String [sr s] (aset sr "innerHTML" s))
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
    (aset style "textContent" s)
    (.appendChild sr style)))

(defn- render-then-append!
  [sr render-fn append-fn c]
  (if-let [rc (render-fn c)]
    (append-fn sr rc)))

(defn- invoke-if-fn
  [o]
  (if (fn? o) (o) o))

(defn- initialize
  [e content style reset-style-inheritance apply-author-styles]
  (when (or style content)
    (let [sr (sd/create e reset-style-inheritance apply-author-styles)]
      (when style (render-then-append! sr render-style append-style! (invoke-if-fn style)))
      (when content (render-then-append! sr render-content append-content! (invoke-if-fn content))))))

(defn- find-prototype
  [t]
  (if t
    (.getPrototypeOf js/Object (.createElement js/document t))
    (.-prototype js/HTMLElement)))

(defn- call-with-this-argument
  [f this args]
  (apply f (conj args this)))

(defn- wrap-with-callback-this-value
  [f]
  (fn [& args] (this-as this (call-with-this-argument f this args))))

(defn- set-callback!
  [proto n f]
  (when f (aset proto n (wrap-with-callback-this-value f))))

(defn- install-shadow-css-shim-when-needed
  "Make sure styles do not leak when using polymer polyfill.
  See https://github.com/Polymer/ShadowDOM/issues/260."
  [sr n base-type]
  (when js/ShadowDOMPolyfill
    (if base-type
      (.shimStyling js/Platform.ShadowCSS sr n base-type)
      (.shimStyling js/Platform.ShadowCSS sr n))))

(defn- initialize-and-set-callback!
  [f m]
  (fn []
    (this-as
      this
      (do
        (let [{:keys [content style reset-style-inheritance apply-author-styles]} m]
          (initialize this content style reset-style-inheritance apply-author-styles)
          (when style (install-shadow-css-shim-when-needed (.-shadowRoot this) (:name m) (:base-type m))))
        (when f
          (call-with-this-argument f this []))))))

(defn- attribute-changed-fn
  [el o n]
  (.log js/console (str o " " n)))

(defn- create-prototype
  "create a Custom Element prototype from a map definition"
  [m]
  (let [{:keys [base-type created-fn entered-view-fn left-view-fn methods]} m
        proto (.create js/Object (find-prototype base-type))]
    (aset proto "createdCallback" (initialize-and-set-callback! created-fn m))
    (set-callback! proto "enteredViewCallback" entered-view-fn)
    (set-callback! proto "leftViewCallback" left-view-fn)
    (set-callback! proto "attributeChangedCallback" attribute-changed-fn)
    (doseq [method methods]
      (aset proto (name (key method)) (wrap-with-callback-this-value (val method))))
    proto))

(defn register
  "register a Custom Element from an abstract definition"
  ([m] (register (:name m) m))
  ([n m] {:pre [(valid-name? n)]} (.register js/document n (clj->js (merge {:prototype (create-prototype m)} (when (:base-type m) {:extends (:base-type m)}))))))

(defn create
  "create an HTML element from it's name. 'is' value is used as second argument to document.createElement"
  ([n] (create n nil))
  ([n is] (.createElement js/document n is)))
