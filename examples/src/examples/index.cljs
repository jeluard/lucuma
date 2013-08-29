(ns examples.index
  (:require [lucuma.custom-elements :refer [register]]
            [examples.range-with-threshold :refer [lucu-range-with-threshold]]))

(.log js/console "index")

(.addEventListener js/document "DOMContentLoaded"
  (fn []
    (.log js/console "ContenLoaded")
    (register lucu-range-with-threshold)
    (.log js/console "registered")

    ))
