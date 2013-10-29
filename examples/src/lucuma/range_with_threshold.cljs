(ns lucuma.range-with-threshold
  (:require [lucuma.attribute :as att]
            [lucuma.event :refer [fire]])
  (:require-macros [lucuma :refer [defwebcomponent]]))

(def ^:private previous-value (atom nil))

(defn- add-threshold-crossed-class [el] (.add (.-classList el) "threshold-crossed"))
(defn- remove-threshold-crossed-class [el] (.remove (.-classList el) "threshold-crossed"))

(defn- breach-threshold
  [el v t]
  (add-threshold-crossed-class el)
  (fire el :threshold-cross {:type ::breached :value v :threshold t}))

(defn- clear-threshold
  [el v]
  (remove-threshold-crossed-class el)
  (fire el :threshold-cross {:type ::cleared :value v}))

(defn- fire-event-on-threshold-cross
  [el min-threshold max-threshold]
  (let [c (or (aget el "value") (aget el "impl" "value"))
        o @previous-value]
    (cond
      (or
        (and (< o min-threshold) (>= c min-threshold))
        (and (> o max-threshold) (<= c max-threshold))) (clear-threshold el c)
      (and (> o min-threshold) (< o max-threshold) (<= c min-threshold)) (breach-threshold el c min-threshold)
      (and (> o min-threshold) (< o max-threshold) (>= c max-threshold)) (breach-threshold el c max-threshold))
    (reset! previous-value c)))

(defn initialize
  [el min-threshold max-threshold]
  (let [v (or (aget el "value") (aget el "impl" "value"))]
    (reset! previous-value v))
  (.addEventListener el "change" #(fire-event-on-threshold-cross (aget % "target") min-threshold max-threshold) false))

(defwebcomponent lucu-range-with-threshold
  :base-type :input
  :created-fn #(initialize % (or (att/get-attr % :min-threshold) 10) (or (att/get-attr % :max-threshold) 30))
  :attributes #{:min-threshold :max-threshold}
  :handlers #{:threshold-cross})
