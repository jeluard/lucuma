(ns lucuma.template-element-test
  (:require [cemerick.cljs.test :as t]
            [lucuma.template-element :as te])
  (:require-macros [cemerick.cljs.test :refer [deftest is testing]]))

(deftest supported
  (is (te/supported?)))
