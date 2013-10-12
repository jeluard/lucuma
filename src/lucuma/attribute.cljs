(ns lucuma.attribute
  (:require [lucuma.util :as u]))

(defn get-attr
  [el n]
  (if (.hasAttribute el (name n))
    (.getAttribute el (name n))
    nil))

(defn set-attr!
  [el n v]
  (if v
    (.setAttribute el (name n) v)
    (.removeAttribute el (name n))))

(defn- as-property
  [n]
  {:configurable true :enumerable true :get (u/wrap-with-callback-this-value #(get-attr % n)) :set (u/wrap-with-callback-this-value #(set-attr! %1 n %2))})

(defn properties
  [attributes]
  (clj->js (apply merge (map #(hash-map (keyword %) (as-property %)) attributes))))