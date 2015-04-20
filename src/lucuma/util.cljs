(ns lucuma.util
  (:require [clojure.string :as string]))

(defn call-with-first-argument
  "Injects arg as first argument to f."
  ([f arg] (call-with-first-argument f arg nil))
  ([f arg args] (apply f (apply conj [] arg args))))

(defn wrap-with-callback-this-value
  [f]
  (fn [& args] (this-as this (call-with-first-argument f this args))))

(defn wrap-to-javascript
  [f]
  (fn [& args]
    (clj->js (apply f (map js->clj args)))))

(defn valid-identifier?
  "Returns true if provided string is a valid JavaScript identifier.
  Rulls out a number a false negative for simplicity sake.

  More info: http://mathiasbynens.be/notes/javascript-identifiers

  Note that _ is forbidden but - is allowed. Translation between both is done at the JS <-> CLJS layer."
  [s]
  (not (nil? (re-matches #"^[a-zA-Z\-$][0-9a-zA-Z\-$]*$" s))))

(defn valid-standard-element-name? [n] (when n (= -1 (.indexOf (name n) "-"))))

(defn warn
  [s]
  (.warn js/console (clj->js s)))
