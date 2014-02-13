(ns lucuma.shadow-dom-test
  (:require [cemerick.cljs.test :as t]
            [lucuma.shadow-dom :as sd])
  (:require-macros [cemerick.cljs.test :refer [deftest is]]))

(deftest supported
  (is (sd/supported?)))
