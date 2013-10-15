(ns lucuma.util-test
  (:require [cemerick.cljs.test :as t]
            [lucuma.util :as u])
  (:require-macros [cemerick.cljs.test :refer [deftest is testing]]))

(defn ^:export two [] 2)

(when (aget js/window "lucuma") ;; Fails on SlimerJS. Disable tests.
  (deftest resolve-goog-ns
    (is (not (nil? (u/resolve-goog-ns (list "lucuma")))))
    (is (not (nil? (u/resolve-goog-ns (list "lucuma" "util-test")))))
    (is (not (nil? (u/resolve-goog-ns (list "lucuma" "util_test")))))
    (is (not (nil? (aget (u/resolve-goog-ns (list "lucuma" "util_test")) "two"))))
    (is (not (u/resolve-goog-ns (list "lucuma" "non-existent")))))

  (deftest str->fn
    (is (not (nil? (u/str->fn "lucuma.util_test.two"))))
    (is (= 2 ((u/str->fn "lucuma.util_test.two"))))
    (is (= 2 ((u/str->fn "lucuma.util_test.two()"))))))