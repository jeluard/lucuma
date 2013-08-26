(ns lucuma.util)

(defn- set-if-not-nil!
  [e s v]
  (when v
    (aset e s v)))
