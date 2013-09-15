(ns lucuma.custom-elements-test
  (:require-macros [cemerick.cljs.test :refer [deftest is testing]])
  (:require [cemerick.cljs.test :as t]))

(deftest first-test
  (is (= true true) "my first test")
  (is (= true true) "my second test"))
