(ns lucuma.core
  (:require [cljs.analyzer :refer [*cljs-ns*]]))

(defn define-specification
  [n m]
  (let [o {:name (name n) :ns (name *cljs-ns*)}]
    `(def ~(vary-meta n assoc :export true) (merge-mixins (merge ~m ~o)))))

(defmacro defcustomelement
  "Specify a Custom Element as keyword / value pairs.

   (defcustomelement my-button
     :properties {:prop1 nil})"
  [n & kvs]
  (define-specification n (apply hash-map kvs)))
