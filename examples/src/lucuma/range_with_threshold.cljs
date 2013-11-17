(ns lucuma.range-with-threshold
  (:require [lucuma.attribute :as att]
            [lucuma.event :refer [fire]])
  (:require-macros [lucuma :refer [defwebcomponent]])
  (:refer-clojure :exclude [min max]))

(def ^:private previous-value (atom nil))

(defn- add-threshold-crossed-class [el] (.add (.-classList el) "threshold-crossed"))
(defn- remove-threshold-crossed-class [el] (.remove (.-classList el) "threshold-crossed"))

(defn- breach-threshold
  [el v]
  (add-threshold-crossed-class el)
  (fire el :threshold-cross {:type ::breached :value v}))

(defn- clear-threshold
  [el v]
  (remove-threshold-crossed-class el)
  (fire el :threshold-cross {:type ::cleared :value v}))

(defn within-boundaries
  [v min max]
  (and (>= v min) (<= v max)))

(defn threshold-crossed-type
  [o c min max]
  (cond
   (and (not (within-boundaries o min max)) (within-boundaries c min max))
   :cleared
   (and (within-boundaries o min max) (not (within-boundaries c min max)))
   :breached
   (or
    (and (< o min) (> c max))
    (and (< c min) (> o max)))
   :breached))

(defn- fire-event-on-threshold-cross
  [el min-threshold max-threshold]
  (let [c (or (aget el "value") (aget el "impl" "value"))
        o @previous-value]
    (case (threshold-crossed-type o c min-threshold max-threshold)
      :cleared (clear-threshold el c)
      :breached (breach-threshold el c)
      nil)
    (reset! previous-value c)))

(defn initialize
  [el min-threshold max-threshold]
  (let [v (or (aget el "value") (aget el "impl" "value"))]
    (reset! previous-value v))
  (.addEventListener el "change" #(fire-event-on-threshold-cross (aget % "target") min-threshold max-threshold) false))

(defwebcomponent lucu-range-with-threshold
  :host :input
  ;;:style ":host(.threshold-crossed) {background: blue;}"
  :created-fn #(initialize % (or (att/get-attr % :min-threshold) 15) (or (att/get-attr % :max-threshold) 85))
  :attributes #{:min-threshold :max-threshold}
  :handlers #{:threshold-cross})
