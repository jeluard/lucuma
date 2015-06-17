(ns lucuma.core
  (:require [cljs.analyzer :refer [*cljs-ns*]]
            [clojure.tools.macro :refer [name-with-attributes]]))

(defn- split-args
  "Split the given key-values into a pair of arguments and remaining key values."
  [kvs]
   (if (vector? (first kvs))
     [(first kvs) (apply hash-map (rest kvs))]
     [[] (apply hash-map kvs)]))

(defmacro defcustomelement
  "Specify a Custom Element as keyword / value pairs.

  When first argument is a vector its values are interpreted as arguments
  that can be used by pair values and `defcustomelement` defines a function whose return type is map.
  Otherwise `defcustomelement` defines a map.

  (defcustomelement my-button
    [title]
    :extends :button)"
  [n & c]
  (let [[n c] (name-with-attributes n c)
        [args kvs] (split-args c)
        default {:name (name n) :ns (name *cljs-ns*)}
        m (merge kvs default)]
    (if (seq args)
      `(defn ~(vary-meta n assoc :export true) [~@args] (merge-mixins ~m))
      `(def ~(vary-meta n assoc :export true) (merge-mixins ~m)))))