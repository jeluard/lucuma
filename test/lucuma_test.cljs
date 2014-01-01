(ns lucuma-test
  (:require [cemerick.cljs.test :as t]
            [lucuma :as l])
  (:require-macros [cemerick.cljs.test :refer [deftest is use-fixtures]]
                   [lucuma :refer [defwebcomponent]]))

(def ^:private tests-node "tests-appends")

(defn append-tests-node
  []
  (let [el (.createElement js/document "div")]
    (set! (.-id el) tests-node)
    (.appendChild js/document.body el)))

(defn delete-tests-node
  []
  (let [el (.getElementById js/document tests-node)]
    (.remove el)))

(defn append
  ([t] (append t nil nil))
  ([t is id]
   (let [id (or id t)
         el (if is (.createElement js/document t is) (.createElement js/document t))]
    (set! (.-id el) id)
    (.appendChild (.getElementById js/document tests-node) el))))

(defn- by-id [id] (.getElementById js/document id))

(deftest default-constructor-names
  (is (= "EXName" (l/default-constructor-name "ex-name")))
  (is (= "EXComplexName" (l/default-constructor-name "ex-complex-name"))))

(deftest ignored-keys
  (is (empty? (l/ignored-keys {:content ""})))
  (is (empty? (l/ignored-keys {:content "" :style ""})))
  (is (= #{:comtent} (l/ignored-keys {:comtent "" :style ""}))))

(defwebcomponent test-sr-1)
(defwebcomponent test-sr-2
  :content "hello")
(defwebcomponent test-sr-3
  :style "* {background: red;}")

(deftest create-shadow-root
  (is (not (nil? (.-shadowRoot (by-id "test-sr-1")))))
  (is (not (nil? (.-shadowRoot (by-id "test-sr-2")))))
  (is (not (nil? (.-shadowRoot (by-id "test-sr-3"))))))

(defwebcomponent test-prototype-1)
(defwebcomponent test-prototype-2
  :host :button)
(defwebcomponent test-prototype-3
  :host :test-prototype-2)
(defwebcomponent test-prototype-4
  :host :test-prototype-3)
(defwebcomponent test-prototype-5
  :host :test-prototype-polymer
  :extends :button)

(deftest definition->el-id
  (is (= nil (l/definition->el-id test-prototype-1)))
  (is (= ["button" nil] (l/definition->el-id test-prototype-2)))
  (is (= ["button" "test-prototype-2"] (l/definition->el-id test-prototype-3)))
  (is (= ["button" "test-prototype-3"] (l/definition->el-id test-prototype-4)))
  (is (= ["button" "test-prototype-polymer"] (l/definition->el-id test-prototype-5))))

(deftest definition->prototype
  (is (= (.-prototype js/HTMLElement) (l/definition->prototype test-prototype-1)))
  (is (= (.-prototype js/HTMLButtonElement) (l/definition->prototype test-prototype-2))))

(deftest extends-right-prototype
  (is (instance? js/HTMLUnknownElement (.createElement js/document "unknown")))
  (is (instance? js/HTMLElement (.createElement js/document "test-unknown")))
  (is (not (instance? js/HTMLUnknownElement (.createElement js/document "test-unknown"))))
  (is (instance? js/HTMLElement (.createElement js/document "test-prototype-1")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "button" "test-prototype-2")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "button" "test-prototype-3"))))

(defwebcomponent test-register)

(deftest register-is-idempotent
  (is (true? (l/register test-register)) "first registration")
  (is (false? (l/register test-register)) "second registration"))

(deftest valid-standard-element-name
  (is (not (l/valid-standard-element-name? nil)))
  (is (l/valid-standard-element-name? "a"))
  (is (l/valid-standard-element-name? "aa"))
  (is (not (l/valid-standard-element-name? "my-component"))))

(deftest is-lucuma-element
  (is (l/lucuma-element? (.createElement js/document "test-prototype-1")))
  (is (l/lucuma-element? (.createElement js/document "test-prototype-2")))
  (is (l/lucuma-element? (.createElement js/document "test-prototype-3"))))

(deftest parse-host-type
  (is (nil? (l/host-type nil)))
  (is (= "div" (l/host-type "div")))
  (is (= "div" (l/host-type :div)))
  (is (nil? (l/host-type {:att ""})))
  (is (= "div" (l/host-type [:div {:att ""}]))))

(deftest parse-host-attributes
  (is (nil? (l/host-attributes nil)))
  (is (nil? (l/host-attributes :div)))
  (is (= {:att ""} (l/host-attributes {:att ""})))
  (is (= {:att ""} (l/host-attributes [:div {:att ""}]))))

(defwebcomponent test-host-attributes
  :host {:a "A" :b :B :c #(count (.-nodeName %))})

(deftest host-attributes
  (is (= "A" (.getAttribute (by-id "test-host-attributes") "a")))
  (is (= "B" (.getAttribute (by-id "test-host-attributes") "b")))
  (is (= (str (count "test-host-attributes")) (.getAttribute (by-id "test-host-attributes") "c"))))

(defn wrap-registration
  [f]
  (append-tests-node)

  (l/register test-sr-1)
  (l/register test-sr-2)
  (l/register test-sr-3)
  (append "test-sr-1")
  (append "test-sr-2")
  (append "test-sr-3")

  (l/register test-prototype-1)
  (l/register test-prototype-2)
  (l/register test-prototype-3)
  (l/register test-prototype-4)
  (l/register test-prototype-5)

  (l/register test-host-attributes)
  (append "test-host-attributes")

  (f)

  (delete-tests-node))

(use-fixtures :once wrap-registration)
