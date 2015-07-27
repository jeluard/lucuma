(ns lucuma.custom-elements-test
  (:require [cljs.test :refer-macros [deftest is]]
            [lucuma.custom-elements :as ce]
            cljsjs.document-register-element))

(deftest supported
  (is (ce/supported?)))

(deftest names
  (is (ce/valid-name? "ex-name"))
  (is (ce/valid-name? "ex-name-name"))
  (is (not (ce/valid-name? nil)))
  (is (not (ce/valid-name? "name")))
  (is (not (ce/valid-name? "ex_name")))
  (is (not (ce/valid-name? "color-profile"))))
