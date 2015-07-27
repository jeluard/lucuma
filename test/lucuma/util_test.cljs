(ns lucuma.util-test
  (:require [cljs.test :refer-macros [deftest is]]
            [lucuma.util :as u]))

(deftest wrap-to-javascript
  (is (not (= {} ((u/wrap-to-javascript identity) #js {}))))
  (is (= {} (js->clj ((u/wrap-to-javascript identity) #js {}))))
  (is (= "1" ((u/wrap-to-javascript #(get % "a")) #js {"a" "1"}))))

(deftest valid-standard-element-name
  (is (not (u/valid-standard-element-name? nil)))
  (is (u/valid-standard-element-name? "a"))
  (is (u/valid-standard-element-name? "aa"))
  (is (not (u/valid-standard-element-name? "my-element"))))
