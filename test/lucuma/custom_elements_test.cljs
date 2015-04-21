(ns lucuma.custom-elements-test
  (:require [cemerick.cljs.test :as t]
            [lucuma.custom-elements :as ce]
            cljsjs.document-register-element)
  (:require-macros [cemerick.cljs.test :refer [deftest is testing]]))

(deftest supported
  (is (ce/supported?)))

(deftest names
  (is (ce/valid-name? "ex-name"))
  (is (ce/valid-name? "ex-name-name"))
  (is (not (ce/valid-name? nil)))
  (is (not (ce/valid-name? "name")))
  (is (not (ce/valid-name? "ex_name")))
  (is (not (ce/valid-name? "color-profile"))))
