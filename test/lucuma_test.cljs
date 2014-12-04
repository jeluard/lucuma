(ns lucuma-test
  (:require [cemerick.cljs.test :as t :refer-macros [deftest is use-fixtures]]
            [lucuma :as l :refer-macros [defwebcomponent]]
            [lucuma.shadow-dom :as sd])
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

(deftest ignored-keys
  (is (empty? (l/ignored-keys {:document ""})))
  (is (empty? (l/ignored-keys {:document "" :style ""})))
  (is (= #{:documemt} (l/ignored-keys {:documemt "" :style ""}))))

(deftest validate-definition
  (is (thrown? js/Error (l/register "")))
  (is (thrown? js/Error (l/register {:unknown-key nil}))))

(defwebcomponent test-sr-1)
(defwebcomponent test-sr-2
  :document "hello")
(defwebcomponent test-sr-3
  :style "* {background: red;}")

(when (sd/supported?)
  (deftest create-shadow-root-when-needed
    (is (nil? (.-shadowRoot (by-id "test-sr-1"))))
    (is (not (nil? (.-shadowRoot (by-id "test-sr-2")))))
    (is (not (nil? (.-shadowRoot (by-id "test-sr-3"))))))

  (deftest shadow-root
    (is (nil? (l/shadow-root (.createElement js/document "div"))))
    (is (nil? (l/shadow-root (.createElement js/document "test-sr-1"))))
    (is (not (nil? (l/shadow-root (.createElement js/document "test-sr-2")))))
    (is (not (nil? (l/shadow-root (.createElementNS js/document "http://www.w3.org/1999/xhtml" "test-sr-2")))))
    (is (not (nil? (l/shadow-root (.createElement js/document "test-sr-2") :test-sr-2))))
    (is (nil? (l/shadow-root (.createElement js/document "test-sr-2") :wrong-element-name))))

  (deftest host
    (is (nil? (l/host nil)))
    (is (nil? (l/host (.createElement js/document "div"))))
    (is (not (nil? (l/host (l/shadow-root (.createElement js/document "test-sr-2"))))))
    (is (not (nil? (l/host (.-firstChild (l/shadow-root (.createElement js/document "test-sr-2"))))))))

  (deftest style
    (is (= "rgb(255, 0, 0)" (.-color (.getComputedStyle js/window (.getElementById (l/shadow-root (by-id "test-style-1")) "id")))))))

(defwebcomponent test-prototype-1)
(defwebcomponent test-prototype-2
  :prototype :button)
(defwebcomponent test-prototype-3
  :extends :test-prototype-2)

(defwebcomponent test-prototype-definition-1
  :extends :test-prototype-3)
(defwebcomponent test-prototype-definition-2
  :prototype :test-prototype-polymer
  :extends :button)
(defwebcomponent test-prototype-definition-3
  test-prototype-2)
(defwebcomponent test-prototype-definition-4
  [arg]
  :document (inc arg))
(defwebcomponent test-prototype-definition-5
  [arg]
  test-prototype-2
  :document (inc arg))
(defwebcomponent test-prototype-definition-6
  :extends :test-prototype-1)
(defwebcomponent test-prototype-definition-7
  :properties {:property1 "default" :property2 "default"})
(defwebcomponent test-prototype-definition-8
  test-prototype-definition-7
  :properties {:property2 "another-default"})

(defwebcomponent test-prototype-definition-fail-1
  :extends :test-prototype-polymer)

(deftest webcomponent-reuse
  (is (= :button (:prototype test-prototype-definition-3)))
  (is (= "default" (get-in test-prototype-definition-8 [:properties :property1])))
  (is (= "another-default" (get-in test-prototype-definition-8 [:properties :property2])))
  (is (= :button (:prototype (test-prototype-definition-5 0)))))

(deftest webcomponent-as-fn
  (is (= 2 (:document (test-prototype-definition-4 1)))))

(defwebcomponent test-extends-1)
(defwebcomponent test-extends-2
  :extends :div)
(defwebcomponent test-extends-3
  :extends :test-extends-1)
(defwebcomponent test-extends-4
  :extends :test-extends-2)
(defwebcomponent test-extends-5
                 ;:extends :non-lucu-element
  :extends :div)
(defwebcomponent test-extends-6
  :extends :test-extends-4)
(defwebcomponent test-extends-fail-1
  :extends :non-lucu-element)

(deftest host-type->extends
  (is (nil? (l/host-type->extends nil)))
  (is (= :div (l/host-type->extends :div)))
  (is (nil? (l/host-type->extends :test-extends-1)))
  (is (= :div (l/host-type->extends :test-extends-2)))
  (is (nil? (l/host-type->extends :test-extends-3)))
  (is (= :div (l/host-type->extends :test-extends-4)))
  (is (= :div (l/host-type->extends :test-extends-5)))
  (is (= :div (l/host-type->extends :test-extends-6)))
  (is (thrown? js/Error (l/host-type->extends :test-extends-fail-1))))

(deftest extends-right-prototype
  (is (instance? js/HTMLUnknownElement (.createElement js/document "unknown")))
  (is (instance? js/HTMLElement (.createElement js/document "test-unknown")))
  (is (not (instance? js/HTMLUnknownElement (.createElement js/document "test-unknown"))))
  (is (instance? js/HTMLElement (.createElement js/document "test-prototype-1")))
  (is (not (instance? js/HTMLButtonElement (.createElement js/document "test-prototype-2"))))
  (is (instance? js/HTMLButtonElement (.createElement js/document "button" "test-prototype-2")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "button" "test-prototype-3"))))

(defwebcomponent test-register)

(deftest register-is-idempotent
  (is (true? (l/register test-register)) "first registration")
  (is (not (true? (l/register test-register))) "second registration")
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

(deftest element-name
  (is (= nil (l/element-name nil)))
  (is (= :div (l/element-name (.createElement js/document "div"))))
  (is (= :test-prototype-1 (l/element-name (.createElement js/document "test-prototype-1"))))
  (is (= :test-prototype-2 (l/element-name (.createElement js/document "button" "test-prototype-2")))))

(deftest property-definition
  (is (l/validate-property-definition! "name" "default"))
  (is (l/validate-property-definition! "name" nil))
  (is (l/validate-property-definition! "name" {:default "default"}))
  (is (nil? (l/validate-property-definition! "name" {:default false :type :boolean})))
  (is (nil? (l/validate-property-definition! "name" {:default 5 :type :number})))
  (is (nil? (l/validate-property-definition! "name" {:default nil :type :object})))
  (is (nil? (l/validate-property-definition! "name" {:default nil :type :keyword})))
  (is (nil? (l/validate-property-definition! "name" {:default (atom true) :type :object})))
  (is (nil? (l/validate-property-definition! "name" {:default :keyword :type :keyword})))
  (is (nil? (l/validate-property-definition! "name" {:default "default" :type :string})))
  (is (thrown? js/Error (l/validate-property-definition! "name" {:default "default" :type :boolean})))
  (is (thrown? js/Error (l/validate-property-definition! "name" {})))
  (is (thrown? js/Error (l/validate-property-definition! "name" {:type :string}))))

(deftest property-definition-attributes
  (is (= true (l/property-definition-attributes? {:attributes? true :type :object})))
  (is (= false (l/property-definition-attributes? {:attributes? false :type :object})))
  (is (= false (l/property-definition-attributes? {:type :object})))
  (is (= false (l/property-definition-attributes? {:attributes? false :type :object}))))

(deftest property-definition-events
  (is (= true (l/property-definition-events? {:events? true})))
  (is (= false (l/property-definition-events? {:events? false})))
  (is (= true (l/property-definition-events? {:type :boolean})))
  (is (= false (l/property-definition-events? {:events? false :type :boolean}))))

(defwebcomponent test-style-1
  :document "<span id='id'></div>"
  :style "#id {color: rgb(255, 0, 0);}")

(def test-created-callback1-called (atom false))
(def test-attached-callback1-called (atom false))
(def test-detached-callback1-called (atom false))

(defwebcomponent test-callback-1
  :on-created #(reset! test-created-callback1-called true)
  :on-attached #(reset! test-attached-callback1-called true)
  :on-detached #(reset! test-detached-callback1-called true))

(deftest callbacks ; TODO make async
  (is (false? @test-created-callback1-called))
  (let [el (.createElement js/document "test-callback-1")]
    (is (true? @test-created-callback1-called))
    (is (false? @test-attached-callback1-called))
    (.appendChild (.getElementById js/document tests-node) el)
    (is (true? @test-attached-callback1-called))
    (is (false? @test-detached-callback1-called))
    (reset! test-attached-callback1-called false)
    (.removeChild (.getElementById js/document tests-node) el)
    (is (true? @test-detached-callback1-called))
    (reset! test-detached-callback1-called false)
    (.appendChild (.getElementById js/document tests-node) el)
    (is (true? @test-attached-callback1-called))
    (is (false? @test-detached-callback1-called))))

(defwebcomponent test-property-1
  :properties {:property nil})
(defwebcomponent test-property-2
  :properties {:property1 "1"
               :property2 {:default 1 :type :number}})

(defwebcomponent test-property-fail-1
  :properties {:invalid-property-name nil})
(defwebcomponent test-property-fail-2
  :properties {:id nil})
(defwebcomponent test-property-fail-3
  :extends :img
  :properties {:src nil})

(deftest property-name
  (is (l/register test-property-1))
  (is (thrown? js/Error (l/register test-property-fail-1)))
  (is (thrown? js/Error (l/register test-property-fail-2)))
  (is (thrown? js/Error (l/register test-property-fail-3))))

(deftest properties
  (is (nil? (.-property (.createElement js/document "test-property-1")))))

(deftest properties-update
  (let [el (.createElement js/document "test-property-2")]
    (is (= "1" (l/get-property el :property1)))
    (l/set-property! el :property1 "2")
    (is (= "2" (l/get-property el :property1)))
    (is (thrown? js/Error (l/set-property! el :property1 1)))
    (is (= 1 (l/get-property el :property2)))
    (l/set-property! el :property2 2)
    (is (= 2 (l/get-property el :property2)))
    (is (thrown? js/Error (l/set-property! el :property2 "")))))

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
  (is (thrown? js/Error (l/register test-method-3))))

(defwebcomponent test-extension-1
  :on-created #(l/set-property! % :property1 "2")
  :properties {:property1 "1"}
  :methods {:method1 (fn [] 1)})
(defwebcomponent test-extension-2
  :prototype :test-extension-1)
(defwebcomponent test-extension-3
  :prototype :test-extension-2)

(deftest extension
   (let [el (.createElement js/document "test-extension-1")]
     (is (exists? (.-property1 el)))
     (is (= "2" (l/get-property el :property1)))
     (is (exists? (.-method1 el))))
   (let [el (.createElement js/document "test-extension-2")]
     (is (exists? (.-property1 el)))
     (is (= "2" (l/get-property el :property1)))
     (is (exists? (.-method1 el))))
   (let [el (.createElement js/document "test-extension-3")]
     (is (exists? (.-property1 el)))
     (is (= "2" (l/get-property el :property1)))
     (is (exists? (.-method1 el)))))

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

  (l/register test-extends-1)
  (l/register test-extends-2)
  (l/register test-extends-3)
  (l/register test-extends-4)
  (l/register test-extends-5)
  (l/register test-extends-6)

  (l/register test-style-1)
  (append "test-style-1")

  (l/register test-callback-1)

  (l/register test-property-2)

  (l/register test-method-1)

  (l/register test-extension-1)
  (l/register test-extension-2)
  (l/register test-extension-3)

  (f)

  (delete-tests-node))

(use-fixtures :once wrap-registration)
