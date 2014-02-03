(ns lucuma.attribute
  (:require [cljs.reader :refer [read-string]]
            [lucuma.util :as u])
  (:refer-clojure :exclude [get]))

;;
;; attribute <-> property conversion
;;

(defmulti attribute->property type)

(defmethod attribute->property :default [o] (str o))

(defmulti property->attribute type)

(defmethod property->attribute :default [o] (read-string o))

;;
;; attribute accessors
;;

(defn get
  "Gets the value of a named attribute. Converts its value via property->attribute."
  [el n]
  (let [n (name n)]
    (if (.hasAttribute el n)
      (property->attribute (.getAttribute el n))
      nil)))

(defn set!
  "Sets the value of a named attribute. Converts its value via attribute->property.
   If the value is not nil and not false, attribute is set; otherwise it is removed."
  [el n v]
  (let [n (name n)]
    (if (and v (not= v false))
      (.setAttribute el n (attribute->property v))
      (.removeAttribute el n))))

(defn property-definition
  "Returns a property definition from getter/setter."
  [get-fn set-fn]
  {:configurable false :enumerable true
   :get (u/wrap-with-callback-this-value get-fn) :set (u/wrap-with-callback-this-value set-fn)})
