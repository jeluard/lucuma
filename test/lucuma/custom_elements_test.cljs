(ns lucuma.custom-elements-test
  (:require [lucuma.custom-elements :refer [valid-name?]]
            [cemerick.cljs.test :as t])
  (:require-macros [cemerick.cljs.test :refer [deftest is testing]]))

(deftest names
  (is (valid-name? "ex-name"))
  (is (valid-name? "ex-name-name"))
  (is (not (valid-name? "name")))
  (is (not (valid-name? "ex_name")))
  (is (not (valid-name? "color-profile"))))

(deftest register
  nil)

(deftest create
  nil)
