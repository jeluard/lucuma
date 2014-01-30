(ns lucuma.util
  (:require [clojure.string :as string]))

(defn- resolve-goog-ns
  [parts]
  (loop [parts parts
         ctx js/window]
    (if (empty? parts)
      ctx
      (recur (rest parts) (aget ctx (string/replace (first parts) #"-" "_"))))))

(defn *ns*->goog-ns
  [n]
  (resolve-goog-ns (string/split n #"\.")))

(defn str->fn
  [s]
  (if-let [f (second (re-find #"([^\(]*)(?:\([A-z]*\))?;?$" s))]
    (let [parts (string/split f #"\.")]
      (aget (resolve-goog-ns (butlast parts)) (last parts)))))

(defn call-with-first-argument
  "inject arg as first argument to f"
  ([f arg] (call-with-first-argument f arg nil))
  ([f arg args] (apply f (apply conj [] arg args))))

(defn wrap-with-callback-this-value
  [f]
  (fn [& args] (this-as this (call-with-first-argument f this args))))

(defn wrap-to-javascript
  [f]
  (fn [& args]
    (clj->js (apply f (map js->clj args)))))

(defn exists-property?
  [o n]
  (exists? (aget o n)))

(defn set-property!
  [o n v]
  (when (exists-property? o n)
    (throw (ex-info "Property already defined" {:object o :property n})))
  (aset o n v)
  (.log js/console (str n))
  (.log js/console (exists-property? o n))
  (when (not (exists-property? o n))
    (throw (ex-info "Invalid property name" {:object o :property n}))))

(defn warn
  [s]
  (.warn js/console (clj->js s)))
