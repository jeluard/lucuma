(ns lucuma.attribute
  (:require [lucuma.util :as u]))
  ;;(:require-macros [cljs.core.typed :refer [ann]])

;;(ann get-attr [js/HTMLElement (U String Keyword) -> (U nil String)])
(defn get-attr
  [el n]
  (let [n (name n)]
    (if (.hasAttribute el n)
      (.getAttribute el n)
      nil)))

(defn set-attr!
  [el n v]
  (let [n (name n)]
    (if v
      (.setAttribute el n v)
      (.removeAttribute el n))))

(defn- as-property
  [n]
  {:configurable true :enumerable true :get (u/wrap-with-callback-this-value #(get-attr % n)) :set (u/wrap-with-callback-this-value #(set-attr! %1 n %2))})

(defn properties
  [attributes]
  (apply merge (map #(hash-map (keyword %) (as-property %)) attributes)))
