(ns lucuma.custom-elements
  (:require [lucuma.shadow-dom :as sd])
  (:refer-clojure :exclude [name])
  (:use-macros [dommy.macros :only [node]]))

(defprotocol HiccupRenderer
  (render [_ hiccup]))

;;https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/custom/index.html#concepts
(def forbidden-names #{"annotation-xml" "color-profile" "font-face" "font-face-src" "font-face-uri" "font-face-format" "font-face-name" "missing-glyph"})

(defn valid-name?
  [name]
  (and (.contains name "-")
       (not (contains? forbidden-names name))))

(defn- set-callback!
  [proto p f]
  (when f
    (aset proto p f)))

(defmulti set-content! (fn [_ c] (type c)))

(defmethod set-content! js/String [sr s] (aset sr "innerHTML" s))

(defmethod set-content! PersistentVector [sr v] (.appendChild sr (node v)))

(defmethod set-content! js/HTMLTemplateElement [sr t] (.appendChild sr (.cloneNode (aget t "content") true)))

(defmulti set-style! (fn [_ c] (type c)))

(defmethod set-style! js/String [sr s] (let [style (.createElement js/document "style")]
                                         (aset style "innerHTML" s)
                                         (.appendChild sr style)))

(defn- initialize
  [e content style reset-style-inheritance apply-author-styles]
  (when content
    (let [sr (sd/create e reset-style-inheritance apply-author-styles)]
      (when content (set-content! sr content))
      (when style (set-style! sr style)))))

(defn- find-prototype
  [t]
  (if t
    (if (instance? js/HTMLElement t)
      (.-prototype t)
      (.getPrototypeOf js/Object (.createElement js/document t)))
    (.-prototype js/HTMLElement)))

(defn create-prototype
  [m]
  (let [{:keys [base-type content style reset-style-inheritance apply-author-styles created-fn entered-document-fn left-document-fn attribute-changed-fn fns]} m
        proto (.create js/Object (find-prototype base-type))]
    (set-callback! proto "createdCallback" #(this-as this (do (initialize this content style reset-style-inheritance apply-author-styles) (when created-fn (created-fn)))))
    (set-callback! proto "enteredDocumentCallback" entered-document-fn)
    (set-callback! proto "leftDocumentCallback" left-document-fn)
    (set-callback! proto "attributeChangedCallback" attribute-changed-fn)
    (doseq [f fns]
      (set-callback! proto (key f) (val f)))
    proto))

(defn register
  ([name proto] (register name proto nil))
  ([name proto extends] {:pre [(valid-name? name)]} (.register js/document name (clj->js (merge {:prototype proto} (when extends {:extends extends}))))))

(defn create
  ([name] (create name nil))
  ([name is] (.createElement js/document name is)))
