(ns lucuma.util-test
  (:require [cemerick.cljs.test :as t]
            [lucuma.util :as u])
  (:require-macros [cemerick.cljs.test :refer [deftest is testing]]))

(defn ^:export two [] 2)

(deftest str->fn
  (is (= 2 ((u/str->fn "lucuma.util-test.two()")))))
