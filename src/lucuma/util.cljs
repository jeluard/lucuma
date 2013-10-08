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
  (if-let [f (second (re-find #"([A-z]*)(?:\([A-z]*\))?;?$" s))]
    (let [parts (string/split f #"\.")]
      (aget (resolve-goog-ns (butlast parts)) (last parts)))))
