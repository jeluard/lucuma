(ns lucuma.custom-elements
  (:require [lucuma.shadow-dom :as sd])
  (:refer-clojure :exclude [name]))

;;https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/custom/index.html#concepts
(def ^:private forbidden-names #{"annotation-xml" "color-profile" "font-face" "font-face-src" "font-face-uri" "font-face-format" "font-face-name" "missing-glyph"})

(defn valid-name?
  "return true if provided name is a valid Custom Element name"
  [name]
  (and (not= -1 (.indexOf name "-"))
       (not (contains? forbidden-names name))))

(defmulti render-content
  "render content value to something that can be added to the DOM via append!"
  ;; Hack to workaround browsers where document.createElement('template').constructor != HTMLTemplateElement but still document.createElement('template') instanceof HTMLTemplateElement
  ;; (type c)
  (fn [c] (if (instance? js/HTMLTemplateElement c) js/HTMLTemplateElement (type c))))

(defmethod render-content js/String [s] s)

(defmethod render-content js/HTMLTemplateElement [t] (.cloneNode (aget t "content") true))

(defmethod render-content :default [c] (throw (str "No render-content implementation for " c) (ex-info {:type (type c)})))

(defmulti render-style
  "render style value to something that can be added to the DOM via append!"
  type)

(defmethod render-style js/String [s] (let [style (.createElement js/document "style")]
                                        (aset style "innerHTML" s)
                                        style))

(defmethod render-style :default [s] (throw (str "No render-style implementation for " s) (ex-info {:type (type s)})))

(defmulti append!
  "append an element to provided ShadowRoot so that it is interpreted as HTML"
  (fn [_ e] (if (instance? js/HTMLElement e) js/HTMLElement (type e))))

(defmethod append! js/String [sr s] (aset sr "innerHTML" s))

(defmethod append! js/HTMLElement [sr e] (.appendChild sr e))

(defmethod append! js/DocumentFragment [sr e] (.appendChild sr e))

(defmethod append! :default [sr e] (throw (str "No append! implementation for " e) (ex-info {:type (type e)})))

(defn- render-then-append!
  [sr render-fn c]
  (if-let [rc (render-fn c)]
    (append! sr rc)))

(defn- initialize
  [e content style reset-style-inheritance apply-author-styles]
  (when (or content style)
    (let [sr (sd/create e reset-style-inheritance apply-author-styles)]
      (when content (render-then-append! sr render-content content))
      (when style (render-then-append! sr render-style style)))))

(defn- find-prototype
  [t]
  (if t
    (if (instance? js/HTMLElement t)
      (.-prototype t)
      (.getPrototypeOf js/Object (.createElement js/document t)))
    (.-prototype js/HTMLElement)))

(defn- wrap-with-this-argument
  [f]
  (fn [& args] (this-as e (apply f (conj args e)))))

(defn- set-callback!
  [proto name f]
  (when f (aset proto name (wrap-with-this-argument f))))

(defn- initialize-and-set-callback!
  [f m]
  (fn []
    (do
      (let [{:keys [content style reset-style-inheritance apply-author-styles]} m]
        (this-as e (initialize e content style reset-style-inheritance apply-author-styles)))
      (when f
        ((wrap-with-this-argument f))))))

(defn create-prototype
  "create a Custom Element prototype from a map definition"
  [m]
  (let [{:keys [base-type created-fn entered-document-fn left-document-fn attribute-changed-fn]} m
        proto (.create js/Object (find-prototype base-type))]
    (aset proto "createdCallback" (initialize-and-set-callback! created-fn m))
    (set-callback! proto "enteredDocumentCallback" entered-document-fn)
    (set-callback! proto "leftDocumentCallback" left-document-fn)
    (set-callback! proto "attributeChangedCallback" attribute-changed-fn)
    proto))

(defn register
  "register a Custom Element from an abstract definition"
  ([m] (register (:name m) (create-prototype m) (:extends m)))
  ([name proto] (register name proto nil))
  ([name proto extends] {:pre [(valid-name? name)]} (.register js/document name (clj->js (merge {:prototype proto} (when extends {:extends extends}))))))

(defn create
  "create an HTML element from it's name. 'is' value is used as second argument to document.createElement"
  ([name] (create name nil))
  ([name is] (.createElement js/document name is)))
