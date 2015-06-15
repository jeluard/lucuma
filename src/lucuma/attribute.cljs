(ns lucuma.attribute
  (:require [clojure.string :as string]
            [cljs.reader :refer [read-string]]
            [lucuma.util :as u])
  (:refer-clojure :exclude [get]))

; attribute <-> property conversion

(defmulti property->attribute type)

(defmethod property->attribute Keyword [o] (string/replace-first (str o) #":" ""))
(defmethod property->attribute js/Boolean [b] (if (true? b) ""))
(defmethod property->attribute js/String [s] (if-not (empty? s) s))
(defmethod property->attribute :default [o] (if o (str o)))

(defmulti attribute->property first)

(defmethod attribute->property :string [[_ s]] (if-not (empty? s) s))
(defmethod attribute->property :keyword [[_ k]] (keyword k))
(defmethod attribute->property :boolean [[_ b]] (cond (nil? b) false (identical? "" b) true :else (read-string b)))
(defmethod attribute->property :number [[_ n]] (if-not (empty? n) (read-string n)))
(defmethod attribute->property :default [v] (.log js/console (str "Can't convert attribute of type <" (first v) ">")))

; attribute accessors

(defn get
  "Gets the value of a named attribute. Converts its value via property->attribute."
  [el n t]
  (let [n (name n)]
    (if (= t :boolean)
      (.hasAttribute el n)
      (if (.hasAttribute el n)
        (attribute->property [t (.getAttribute el n)])
        nil))))

(defn set!
  "Sets the value of a named attribute. Converts its value via attribute->property.
   If the value is not nil and not false, attribute is set; otherwise it is removed."
  [el n v]
  (let [n (name n)]
    (if (and v (not= v false))
      (if-let [s (property->attribute v)]
        (.setAttribute el n s))
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
