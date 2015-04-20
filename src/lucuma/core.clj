(ns lucuma.core
  (:require [cljs.analyzer :refer [*cljs-ns*]]))

(defn- split-args
  "Split the given key-values into a pair of arguments and remaining key values."
  [kvs]
   (if (vector? (first kvs))
     [(first kvs) (apply hash-map (rest kvs))]
     [[] (apply hash-map kvs)]))

(defmacro defwebcomponent
  "Specify a Web Component as keyword / value pairs.

  When first argument is a vector its values are interpreted as arguments
  that can be used by pair values and `defwebcomponent` defines a function whose return type is map.
  Otherwise `defwebcomponent` defines a map.

  (defwebcomponent my-button
    [title]
    :extends :button)"
  [n & c]
  (let [[args kvs] (split-args c)
        default {:name (name n) :ns (name *cljs-ns*)}
        m (merge kvs default)]
    (if (seq args)
      `(defn ~(vary-meta n assoc :export true) [~@args] (merge-mixins ~m))
      `(def ~(vary-meta n assoc :export true) (merge-mixins ~m)))))