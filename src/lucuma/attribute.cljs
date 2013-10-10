(ns lucuma.attribute
  (:require [lucuma.util :as u]))

(defn get-attribute
  [el n]
  (if (.hasAttribute el n)
    (.getAttribute el n)
    nil))

(defn set-attribute
  [el n v]
  (if v
    (.setAttribute el n v)
    (.removeAttribute el n)))

(defn- as-property
  [n]
  {:configurable true :enumerable true :get (u/wrap-with-callback-this-value #(get-attribute % n)) :set (u/wrap-with-callback-this-value #(set-attribute %1 n %2))})

(defn properties
  [attributes]
  (clj->js (apply merge (map #(hash-map (keyword %) (as-property %)) attributes))))