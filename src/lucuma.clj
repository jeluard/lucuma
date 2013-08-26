(ns lucuma)

(defmacro defwebcomponent
  [n & m]
  (let [args (apply hash-map m)]
    `(lucuma.custom-elements/register ~(name n) (lucuma.custom-elements/create-prototype ~args) ~(:extends m))))
