(ns lucuma.range-with-threshold
  (:require [lucuma :as l :refer-macros [defwebcomponent]]
            [lucuma.attribute :as att]
            [lucuma.event :refer [fire]]
            [dommy.core :as dommy]))

(def ^:private previous-value (atom nil))

(defn- breach-threshold
  [el v]
  (l/set-property! el :threshold_crossed true)
  (fire el :threshold-cross {:type ::breached :value v}))

(defn- clear-threshold
  [el v]
  (l/set-property! el :threshold_crossed false)
  (fire el :threshold-cross {:type ::cleared :value v}))

(defn- within-boundaries [v mn mx] (and (>= v mn) (<= v mx)))

(defn- threshold-crossed-type
  [o c mn mx]
  (cond
   (and (not (within-boundaries o mn mx)) (within-boundaries c mn mx))
   :cleared
   (and (within-boundaries o mn mx) (not (within-boundaries c mn mx)))
   :breached
   (or
    (and (< o mn) (> c mx))
    (and (< c mn) (> o mx)))
   :breached))

(defn- fire-event-on-threshold-cross
  [el]
  (let [c (.-value el)
        o @previous-value
        mn (l/get-property el :min_threshold)
        mx (l/get-property el :max_threshold)]
    (case (threshold-crossed-type o c mn mx)
      :cleared (clear-threshold el c)
      :breached (breach-threshold el c)
      nil)
    (reset! previous-value c)))

(defn initialize
  [el]
  (reset! previous-value (.-value el))
  (dommy/listen! el :change #(fire-event-on-threshold-cross (.-target %))))

(defwebcomponent lucu-range-with-threshold
  :host :input
  ;; TODO ShadowRoot with existing element overrides native one?
  ;;:style ":host(.threshold-crossed) {background: blue;}"
  :on-created #(initialize %)
  :properties {:min_threshold 15 :max_threshold 85 :threshold_crossed {:default nil :type js/Boolean}})
