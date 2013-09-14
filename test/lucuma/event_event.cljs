(ns lucuma.event-test
  (:require-macros [cemerick.cljs.test :refer [deftest is testing]])
  (:require [cemerick.cljs.test :as t]))

(deftest some-test
  (testing "111"
    (is (= true true) "my first test")
    (is (= true false) "my second test")))

(deftest some-test2
  (testing "112"
    (testing "212"
      (is (= true true) "my first test")
      (is (= true false) "my second test"))))
