(ns lucuma-test
  (:require [cemerick.cljs.test :as t :refer-macros [deftest is use-fixtures]]
            [lucuma :as l :refer-macros [defwebcomponent]])
  (:refer-clojure :exclude [methods]))

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
  (is (empty? (l/ignored-keys {:document ""})))
  (is (empty? (l/ignored-keys {:document "" :style ""})))
  (is (= #{:documemt} (l/ignored-keys {:documemt "" :style ""}))))

(deftest validate-definition
  (is (thrown? js/Error (l/register "")))
  (is (thrown? js/Error (l/register {:unknown-key nil}))))

(defwebcomponent test-sr-1
  :ns nil)
(defwebcomponent test-sr-2
  :ns nil
  :document "hello")
(defwebcomponent test-sr-3
  :ns nil
  :style "* {background: red;}")

(deftest create-shadow-root-when-needed
  (is (nil? (.-shadowRoot (by-id "test-sr-1"))))
  (is (not (nil? (.-shadowRoot (by-id "test-sr-2")))))
  (is (not (nil? (.-shadowRoot (by-id "test-sr-3"))))))

(defwebcomponent test-prototype-1
  :ns nil)
(defwebcomponent test-prototype-2
  :ns nil
  :host :button)
(defwebcomponent test-prototype-3
  :ns nil
  :host :test-prototype-2)
(defwebcomponent test-prototype-4
  :ns nil
  :host :test-prototype-3)
(defwebcomponent test-prototype-5
  :ns nil
  :host :test-prototype-polymer
  :extends :button)
(defwebcomponent test-prototype-6
  test-prototype-2
  :ns nil)
(defwebcomponent test-prototype-7
  [arg]
  :ns nil
  :document (inc arg))
(defwebcomponent test-prototype-8
  [arg]
  test-prototype-2
  :ns nil
  :document (inc arg))
(defwebcomponent test-prototype-9
  :ns nil
  :host :test-prototype-1)

(defwebcomponent test-prototype-fail-1
  :ns nil
  :host :test-prototype-polymer)
(defwebcomponent test-prototype-fail-2
  :ns nil
  :host :test-prototype-2
  :extends :div)

(deftest webcomponent-reuse
  (is (= :button (:host test-prototype-6)))
  (is (= :button (:host (test-prototype-8 0)))))

(deftest webcomponent-as-fn
  (is (= 2 (:document (test-prototype-7 1)))))

(deftest definition->el-id
  (is (= nil (l/definition->el-id test-prototype-1)))
  (is (= [:button nil] (l/definition->el-id test-prototype-2)))
  (is (= [:button :test-prototype-2] (l/definition->el-id test-prototype-3)))
  (is (= [:button :test-prototype-3] (l/definition->el-id test-prototype-4)))
  (is (= [:button :test-prototype-polymer] (l/definition->el-id test-prototype-5)))
  (is (= [:test-prototype-1 nil] (l/definition->el-id test-prototype-9)))
  (is (thrown? js/Error (l/definition->el-id test-prototype-fail-1)))
  (is (thrown? js/Error (l/definition->el-id test-prototype-fail-2))))

(deftest type->prototype
  (is (= (.-prototype js/HTMLElement) (l/type->prototype nil nil)))
  (is (= (.-prototype js/HTMLButtonElement) (l/type->prototype "button" nil))))

(deftest extends-right-prototype
  (is (instance? js/HTMLUnknownElement (.createElement js/document "unknown")))
  (is (instance? js/HTMLElement (.createElement js/document "test-unknown")))
  #_(is (not (instance? js/HTMLUnknownElement (.createElement js/document "test-unknown"))))
  (is (instance? js/HTMLElement (.createElement js/document "test-prototype-1")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "button" "test-prototype-2")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "button" "test-prototype-3"))))

(deftest element-name
  (is (= :button (l/element-name (.createElement js/document "button"))))
  (is (= :test-prototype-1 (l/element-name (.createElement js/document "test-prototype-1"))))
  (is (= :test-prototype-2 (l/element-name (.createElement js/document "button" "test-prototype-2")))))

(defwebcomponent test-register
  :ns nil)

(deftest register-is-idempotent
  (is (true? (l/register test-register)) "first registration")
  (is (false? (l/register test-register)) "second registration")
  (is (thrown? js/Error (l/register nil)))
  (is (thrown? js/Error (l/register (fn [] nil)))))

(deftest is-lucuma-element
  (is (not (l/lucuma-element? nil)))
  (is (not (l/lucuma-element? (.createElement js/document "div"))))
  (is (l/lucuma-element? (.createElement js/document "test-prototype-1")))
  (is (not (l/lucuma-element? (.createElement js/document "test-prototype-2"))))
  (is (l/lucuma-element? (.createElement js/document "button" "test-prototype-2")))
  (is (not (l/lucuma-element? (.createElement js/document "test-prototype-3"))))
  (is (l/lucuma-element? (.createElement js/document "button" "test-prototype-3"))))

(deftest property-definition
  (is (nil? (l/validate-property-definition! "name" "default")))
  (is (nil? (l/validate-property-definition! "name" nil)))
  (is (thrown? js/Error (l/validate-property-definition! "name" {})))
  (is (thrown? js/Error (l/validate-property-definition! "name" {:type js/String})))
  (is (nil? (l/validate-property-definition! "name" {:default "default"})))
  (is (nil? (l/validate-property-definition! "name" {:default nil :type js/String})))
  (is (nil? (l/validate-property-definition! "name" {:default nil :type js/Object})))
  (is (nil? (l/validate-property-definition! "name" {:default (atom true) :type js/Object})))
  (is (nil? (l/validate-property-definition! "name" {:default :label :type js/Object})))
  (is (nil? (l/validate-property-definition! "name" {:default "default" :type js/String})))
  (is (thrown? js/Error (l/validate-property-definition! "name" {:default "default" :type js/Boolean}))))

(deftest get-property-definition-default
  (is (= "" (l/get-property-definition-default {:default ""})))
  (is (= "" (l/get-property-definition-default ""))))

(deftest get-property-definition-type
  (is (= js/String (l/get-property-definition-type {:default ""})))
  (is (= js/String (l/get-property-definition-type {:type js/String :default nil})))
  (is (= js/Boolean (l/get-property-definition-type {:default false})))
  (is (= js/Object (l/get-property-definition-type {:default {}})))
  (is (= js/Object (l/get-property-definition-type {:default nil}))))

(deftest property-definition-attributes?
  (is (= true (l/property-definition-attributes? {:attributes? true})))
  (is (= false (l/property-definition-attributes? {:attributes? false})))
  (is (= false (l/property-definition-attributes? {:type js/Function})))
  (is (= true (l/property-definition-attributes? {:type js/Boolean})))
  (is (= false (l/property-definition-attributes? {:attributes? false :type js/Boolean}))))

(deftest property-definition-events?
  (is (= true (l/property-definition-events? {:events? true})))
  (is (= false (l/property-definition-events? {:events? false})))
  (is (= false (l/property-definition-events? {:type js/Function})))
  (is (= true (l/property-definition-events? {:type js/Boolean})))
  (is (= false (l/property-definition-events? {:events? false :type js/Boolean}))))

(defwebcomponent test-method-1
  :methods {:method1 (fn [] 1)
            :method2 (fn [] {:key "value"})
            :method3 (fn [_ o] (get o "key"))
            :method4 (fn [& args] args)})

(defwebcomponent test-method-2
  :methods {:invalid-method-name nil})

(defwebcomponent test-method-3
  :methods {:constructor nil})

(deftest methods
  (is (= 1 (.method1 (.createElement js/document "test-method-1"))))
  (is (= "value" (aget (.method2 (.createElement js/document "test-method-1")) "key")))
  (is (= "value" (.method3 (.createElement js/document "test-method-1") #js {:key "value"})))
  (is (not (nil? (first (.method4 (.createElement js/document "test-method-1"))))))
  (is (nil? (second (.method4 (.createElement js/document "test-method-1")))))
  (is (thrown? js/Error (l/register test-method-2)))
  ;; TODO fix?
  #_(is (thrown? js/Error (l/register test-method-3))))

(defwebcomponent test-constructor-1)
(defwebcomponent test-constructor-2
  :ns "lucuma")
(defwebcomponent test-constructor-3
  :ns "lucuma"
  :constructor "Constructor")
(defwebcomponent test-constructor-4
  :ns nil)

(deftest constructors
  (is (exists? js/lucuma_test.TESTConstructor1))
  (is (exists? js/lucuma.TESTConstructor2))
  (is (exists? js/lucuma.Constructor))
  (is (not (exists? js/lucuma_test.TESTConstructor4))))

(deftest parse-host-type
  (is (nil? (l/host-type nil)))
  (is (= :div (l/host-type :div)))
  (is (nil? (l/host-type {:att ""})))
  (is (= :div (l/host-type [:div {:att ""}]))))

(deftest parse-host-attributes
  (is (nil? (l/host-attributes nil)))
  (is (nil? (l/host-attributes :div)))
  (is (= {:att ""} (l/host-attributes {:att ""})))
  (is (= {:att ""} (l/host-attributes [:div {:att ""}]))))

(defwebcomponent test-host-attributes
  :ns nil
  :host {:a "A"})

(deftest host-attributes
  (is (= "A" (.getAttribute (by-id "test-host-attributes") "a"))))

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
  (l/register test-prototype-6)
  (l/register (test-prototype-7 1))
  (l/register (test-prototype-8 1))

  ;; TODO fails on Chrome Canary
  ;;(l/register test-prototype-9)

  (l/register test-method-1)

  (l/register test-constructor-1)
  (l/register test-constructor-2)
  (l/register test-constructor-3)
  (l/register test-constructor-4)

  (l/register test-host-attributes)
  (append "test-host-attributes")

  (f)

  (delete-tests-node))

(use-fixtures :once wrap-registration)
