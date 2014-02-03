(ns lucuma.attribute-test
  (:require [cemerick.cljs.test :as t :refer-macros [deftest is]]
            [lucuma.attribute :as att])
  (:refer-clojure :exclude [get]))

(deftest property->attribute
  (is (= "" (att/property->attribute nil)))
  (is (= "string" (att/property->attribute "string")))
  (is (= "5.2" (att/property->attribute 5.2)))
  (is (= "true" (att/property->attribute true))))

(deftest attribute->property
  (is (= "string" (att/attribute->property [js/String "string"])))
  (is (= nil (att/attribute->property [js/String nil])))
  (is (= "" (att/attribute->property [js/String ""])))
  (is (= 5.2 (att/attribute->property [js/Number "5.2"])))
  (is (= nil (att/attribute->property [js/Number nil])))
  (is (= true (att/attribute->property [js/Boolean "true"])))
  (is (= nil (att/attribute->property [js/Boolean nil]))))

(defn create-element
  [n m]
  (let [el (.createElement js/document n)]
    (doseq [kv m]
      (.setAttribute el (name (key kv)) (val kv)))
    el))

(deftest attributes
  (is (= {:a "a" :b "b"} (att/attributes (create-element "div" {:a "a" :b "b"})))))

(deftest get
  (is (= "value" (att/get (create-element "div" {:key "value"}) :key js/String)))
  (is (= true (att/get (create-element "div" {:key "true"}) :key js/Boolean)))
  (is (= nil (att/get (create-element "div" {}) :unknown-key js/String))))
