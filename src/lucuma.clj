(ns lucuma
  (:require [clojure.string :as string]
            [cljs.analyzer :refer [*cljs-ns*]]))

(defn- split-args
  "Split the given key-values into a pair of arguments and remaining key values."
  [kvs]
   (if (vector? (first kvs))
     [(first kvs) (rest kvs)]
     [[] kvs]))

(defmacro defwebcomponent
  "Specify a Web Component as key / value pairs.

  When first argument is a vector its values are interpreted as arguments
  that can be used by pair values and `defwebcomponent` defines a function whose return type is map.
  Otherwise `defwebcomponent` defines a map.

  A static map can be referenced after the vector argument (or if absent as first argument)
  that will be merged in defined map.

  (defwebcomponent my-button
    [title]
    :host [:button {:title title}])

  (def defaults {:style [:button {:background-color :red}})

  (defwebcomponent my-div
    defaults
    :host :div)"
  [n & c]
  (let [[args kvs] (split-args c)
        default {:name (name n) :ns (name *cljs-ns*)}
        m (if (keyword? (first kvs))
             (merge default (apply hash-map kvs))
             `(let [bkvs# ~(first kvs)
                    kvs# ~(apply hash-map (rest kvs))
                    ps# (merge (:properties bkvs#) (:properties kvs#))
                    ms# (merge (:methods bkvs#) (:methods kvs#))]
                (merge (dissoc bkvs# :properties :methods) ~default (dissoc kvs# :properties :methods)
                       (when ps# {:properties ps#}) (when ms# {:methods ms#}))))]
    (if (empty? args)
      `(def ~(vary-meta n assoc :export true) ~m)
      `(defn ~(vary-meta n assoc :export true) [~@args] ~m))))
