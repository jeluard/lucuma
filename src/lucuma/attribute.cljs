(ns lucuma.attribute)
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
