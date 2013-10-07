(ns lucuma
  (:require [clojure.string :as string]
            [cljs.analyzer :refer [*cljs-ns*]]))

(defmacro defwebcomponent
  [n & m]
  `(def ~n (merge {:name ~(name n) :ns ~(str *cljs-ns*)} ~(apply hash-map m))))
