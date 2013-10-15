(ns lucuma
  (:require [clojure.string :as string]
            [cljs.analyzer :refer [*cljs-ns*]]))

(defmacro defwebcomponent
  [n & m]
  `(def ~(vary-meta n assoc :export true) (merge {:name ~(name n) :ns ~(str *cljs-ns*)} ~(apply hash-map m))))
