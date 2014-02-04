(ns lucuma.polymer-test
  (:require [cemerick.cljs.test :as t]
            [lucuma.polymer :as p])
  (:require-macros [cemerick.cljs.test :refer [deftest is]]))

(deftest custom-element-polyfilled
  (is (not (nil? (p/custom-element-polyfilled?)))))

(deftest shadow-dom-polyfilled
  (is (not (nil? (nil? (p/shadow-dom-polyfilled?))))))

(deftest shadow-css-needed
  (is (not (nil? (nil? (p/shadow-css-needed?))))))
