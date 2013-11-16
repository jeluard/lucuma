(ns lucuma-test
  (:require [cemerick.cljs.test :as t]
            [lucuma :as l])
  (:require-macros [cemerick.cljs.test :refer [deftest is use-fixtures]]
                   [lucuma :refer [defwebcomponent]]))

(defn ^:export append
  ([t] (append t nil nil))
  ([t is id]
   (let [id (or id t)
         el (if is (.createElement js/document t is) (.createElement js/document t))]
    (set! (.-id el) id)
    (.appendChild js/document.body el))))

(defn- by-id [id] (.getElementById js/document id))

(deftest default-constructor-names
  (is (= "EXName" (l/default-constructor-name "ex-name")))
  (is (= "EXComplexName" (l/default-constructor-name "ex-complex-name"))))

(defwebcomponent test-sr-1)
(defwebcomponent test-sr-2
  :content "hello")
(defwebcomponent test-sr-3
  :style "* {background: red;}")

(deftest create-shadow-root-when-needed
  (is (nil? (.-shadowRoot (by-id "test-sr-1"))))
  (is (not (nil? (.-shadowRoot (by-id "test-sr-2")))))
  (is (not (nil? (.-shadowRoot (by-id "test-sr-3"))))))

(defwebcomponent test-prototype-1)
(defwebcomponent test-prototype-2
  :base-type :button)
(defwebcomponent test-prototype-3
  :base-type :test-prototype-2)

(deftest extends-right-prototype
  (is (instance? js/HTMLUnknownElement (.createElement js/document "unknown")))
  (is (instance? js/HTMLElement (.createElement js/document "test-unknown")))
  (is (not (instance? js/HTMLUnknownElement (.createElement js/document "test-unknown"))))
  (is (instance? js/HTMLElement (.createElement js/document "test-prototype-1")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "test-prototype-2")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "test-prototype-3"))))

(defwebcomponent test-register)

(deftest register-is-idempotent
  (is (true? (l/register test-register)) "first registration")
  (is (false? (l/register test-register)) "second registration"))

(deftest is-lucuma-element
  (is (l/lucuma-element? (.createElement js/document "test-prototype-1")))
  (is (l/lucuma-element? (.createElement js/document "test-prototype-2")))
  (is (l/lucuma-element? (.createElement js/document "test-prototype-3"))))

(defwebcomponent test-host-attributes
  :host-attributes {:a "A" :b #(count (.-nodeName %))})

(deftest host-attributes
  (is (= "A" (.getAttribute (by-id "test-host-attributes") "a")))
  (is (= (str (count "test-host-attributes")) (.getAttribute (by-id "test-host-attributes") "b"))))

(defn wrap-registration
  [f]
  (l/register test-sr-1)
  (l/register test-sr-2)
  (l/register test-sr-3)
  (append "test-sr-1")
  (append "test-sr-2")
  (append "test-sr-3")

  (l/register test-prototype-1)
  (l/register test-prototype-2)
  (l/register test-prototype-3)

  (l/register test-host-attributes)
  (append "test-host-attributes")

  (f))

(use-fixtures :once wrap-registration)
