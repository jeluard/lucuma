(ns lucuma.core
  (:require [clojure.string :as string]
            [cljs.analyzer :refer [*cljs-ns*]]))

(defn- split-args
  "Split the given key-values into a pair of arguments and remaining key values."
  [kvs]
   (if (vector? (first kvs))
     [(first kvs) (apply hash-map (rest kvs))]
     [[] (apply hash-map kvs)]))

(defn merge-map-definition
  [m1 m2]
  `(let [ps# (merge (:properties ~m1) (:properties ~m2))
        ms# (merge (:methods ~m1) (:methods ~m2))]
    (merge (dissoc ~m1 :properties :methods) (dissoc ~m2 :properties :methods)
           (if ps# {:properties ps#}) (if ms# {:methods ms#}))))

(defn merge-mixin
  [m o]
  (cond
    (fn? o) `(o m)
    (map? o) (merge-map-definition m o)))

(defn merge-mixins
  [m]
  (if-let [mxs (:mixins m)]
    (reduce merge-mixin (conj mxs m))
    m))

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
        m (merge-mixins (merge kvs default))]
    (if (seq args)
      `(defn ~(vary-meta n assoc :export true) [~@args] ~m)
      `(def ~(vary-meta n assoc :export true) ~m))))