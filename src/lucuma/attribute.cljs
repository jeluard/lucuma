(ns lucuma.attribute)

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
