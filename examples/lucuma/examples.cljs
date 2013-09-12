(ns lucuma.examples
  (:require [lucuma.custom-elements :refer [register]]
            [lucuma.overlay :refer [lucu-overlay]]
            [lucuma.range-with-threshold :refer [lucu-range-with-threshold]])
  (:require-macros [lucuma :refer [defwebcomponent]]))

(defwebcomponent ex-hello
  :content "hello-world")

(defn ^:export register
  []
  (register ex-hello)
  (register lucu-range-with-threshold)
  (register lucu-overlay))
