(ns lucuma.attribute
  (:require [clojure.string :as string]
            [cljs.reader :refer [read-string]]
            [lucuma.util :as u])
  (:refer-clojure :exclude [get]))

;;
;; attribute <-> property conversion
;;

(defmulti property->attribute type)

(defmethod property->attribute Keyword [o] (string/replace-first (str o) #":" ""))
(defmethod property->attribute :default [o] (str o))

(defmulti attribute->property first)

(defn- read-non-empty-string
  [s]
  (when-not (empty? s)
    (read-string s)))

(defmethod attribute->property :string [v] (second v))
(defmethod attribute->property :keyword [v] (keyword (second v)))
(defmethod attribute->property :boolean [v] (read-non-empty-string (second v)))
(defmethod attribute->property :number [v] (read-non-empty-string (second v)))

;;
;; attribute accessors
;;

(defn get
  "Gets the value of a named attribute. Converts its value via property->attribute."
  [el n t]
  (let [n (name n)]
    (if (.hasAttribute el n)
      (attribute->property [t (.getAttribute el n)])
      nil)))

(defn set!
  "Sets the value of a named attribute. Converts its value via attribute->property.
   If the value is not nil and not false, attribute is set; otherwise it is removed."
  [el n v]
  (let [n (name n)]
    (if (and v (not= v false))
      (.setAttribute el n (if (= v true) "" (property->attribute v)))
      (.removeAttribute el n))))

(defn property-definition
  "Returns a property definition from getter/setter."
  [get-fn set-fn]
  {:configurable false :enumerable true
   :get (u/wrap-with-callback-this-value get-fn) :set (u/wrap-with-callback-this-value set-fn)})

(defn attributes
  [el]
  "Returns a map of element attributes."
  (into {} (for [attribute (array-seq (.-attributes el))]
             [(keyword (.-name attribute)) (.-value attribute)])))
