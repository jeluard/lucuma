(ns lucuma.core
  (:require [cljs.analyzer :refer [*cljs-ns*]]
            [clojure.tools.macro :refer [name-with-attributes]]))

(defmacro defcustomelement
  "Specify a Custom Element as keyword / value pairs.

   (defcustomelement my-button
     :properties {:prop1 nil})"
  [n & kvs]
  (let [[n kvs] (name-with-attributes n kvs)
        default {:name (name n) :ns (name *cljs-ns*)}
        m (merge (apply hash-map kvs) default)]
    `(def ~(vary-meta n assoc :export true) (merge-mixins ~m))))
