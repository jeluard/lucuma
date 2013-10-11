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
  (fire el :threshold-cross {:type :breached :value v :threshold t}))

(defn- clear-threshold
  [el v]
  (remove-threshold-crossed-class el)
  (fire el :threshold-cross {:type :cleared :value v}))

(defn- fire-event-on-threshold-cross
  [el min-threshold max-threshold]
  (let [value (or (aget el "value") (aget el "impl" "value"))] ;; TODO get polymer GeneratedWrapper. Bug?
    (cond
      (> min-threshold value) (breach-threshold el value min-threshold)
      (> value max-threshold) (breach-threshold el value max-threshold)
      :default (clear-threshold el value))))

(defn initialize
  [el min-threshold max-threshold]
  (.addEventListener el "change" #(fire-event-on-threshold-cross (aget % "target") min-threshold max-threshold) false))

(defwebcomponent lucu-range-with-threshold
  :extends "input"
  :style "input[type='range'] .threshold-crossed { background-color: red; }"
  :created-fn #(initialize % (or (att/get-attr % "min-threshold") 10) (or (att/get-attr % "max-threshold") 30))
  :handlers #{:threshold-cross})

;; Chrome doesn't support dynamically created shadow root on input element so the style is not applied.
;; https://code.google.com/p/chromium/issues/detail?id=263940
