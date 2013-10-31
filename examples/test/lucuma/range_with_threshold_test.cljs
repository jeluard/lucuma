(ns lucuma.range-with-threshold-test
  (:require [cemerick.cljs.test :as t]
            [lucuma.range-with-threshold :as r])
  (:require-macros [cemerick.cljs.test :refer [deftest is testing]]))

(deftest boundaries
  (is (= true (r/within-boundaries 10 10 20)))
  (is (= true (r/within-boundaries 15 10 20)))
  (is (= true (r/within-boundaries 20 10 20)))
  (is (= false (r/within-boundaries 0 10 20)))
  (is (= false (r/within-boundaries 30 10 20))))

(deftest threshold-crossed-type
  (is (= nil (r/threshold-crossed-type 0 5 10 30)))
  (is (= nil (r/threshold-crossed-type 20 25 10 30)))
  (is (= :breached (r/threshold-crossed-type 15 5 10 30)))
  (is (= :breached (r/threshold-crossed-type 15 50 10 30)))
  (is (= :cleared (r/threshold-crossed-type 5 10 10 30)))
  (is (= :cleared (r/threshold-crossed-type 5 15 10 30)))
  (is (= :breached (r/threshold-crossed-type 5 50 10 30))))
