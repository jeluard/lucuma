(ns lucuma)

(defmacro defwebcomponent
  [n & m]
  (let [args (apply hash-map m)]
    `(register ~(name n) (create-prototype ~args) ~(:extends m))))
