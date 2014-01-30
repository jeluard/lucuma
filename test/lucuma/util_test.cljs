(ns lucuma.util-test
  (:require [cemerick.cljs.test :as t :refer-macros [deftest is testing]]
            [lucuma.util :as u]))

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

(deftest wrap-to-javascript
  (is (not (= {} ((u/wrap-to-javascript identity) #js {}))))
  (is (= {} (js->clj ((u/wrap-to-javascript identity) #js {}))))
  (is (= "1" ((u/wrap-to-javascript #(get % "a")) #js {"a" "1"}))))

(deftest valid-standard-element-name
  (is (not (u/valid-standard-element-name? nil)))
  (is (u/valid-standard-element-name? "a"))
  (is (u/valid-standard-element-name? "aa"))
  (is (not (u/valid-standard-element-name? "my-component"))))
