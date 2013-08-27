(ns lucuma)

(defmacro defwebcomponent
  [n & m]
  `(def ~n (merge {:name ~(name n)} ~(apply hash-map m))))
