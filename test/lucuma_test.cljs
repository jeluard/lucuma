(ns lucuma-test
  (:require [cemerick.cljs.test :as t]
            [lucuma :as l])
  (:require-macros [cemerick.cljs.test :refer [deftest is testing]]))

(deftest default-constructor-names
  (is (= "EXName" (l/default-constructor-name "ex-name")))
  (is (= "EXComplexName" (l/default-constructor-name "ex-complex-name"))))