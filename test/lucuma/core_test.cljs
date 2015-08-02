(ns lucuma.core-test
  (:require [cljs.test :refer-macros [deftest is use-fixtures]]
            [lucuma.core :as l :refer-macros [defcustomelement]])
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
  (is (empty? (l/ignored-keys {:mixins []})))
  (is (empty? (l/ignored-keys {:mixins [] :properties {}})))
  (is (= #{:mixinss} (l/ignored-keys {:mixinss [] :properties {}}))))

(deftest validate-definition
  (is (thrown? js/Error (l/register "")))
  (is (thrown? js/Error (l/register {:unknown-key nil}))))

(defcustomelement test-prototype-1)
(defcustomelement test-prototype-2
  :extends :button)
(defcustomelement test-prototype-3
  :prototype test-prototype-2)
(defcustomelement test-prototype-4
  :prototype js/HTMLButtonElement.prototype)
(defcustomelement test-prototype-definition-1
  :prototype test-prototype-3)
(defcustomelement test-prototype-definition-2
  :prototype :test-prototype-polymer
  :extends :button)
(defcustomelement test-prototype-definition-3
  :mixins [test-prototype-2])
(defcustomelement test-prototype-definition-6
  :prototype test-prototype-1)
(defcustomelement test-prototype-definition-7
  :properties {:property1 "default" :property2 "default" :property3 "default"})
(defcustomelement test-prototype-definition-8
  :mixins [test-prototype-definition-7]
  :properties {:property2 "another-default"})
#_
(defcustomelement test-prototype-definition-9
  :mixins [test-prototype-definition-8]
  :properties {:property3 "another-default"})
(defcustomelement test-prototype-definition-10
  :mixins [{:properties {:property1 "value1" :property2 "value1"}} {:properties {:property1 "value2"}}]
  :properties {:property2 "value"})
#_
(defcustomelement test-prototype-definition-11
  :mixins [#(update-in % [:properties :property] inc)]
  :properties {:property 1})

(defcustomelement test-prototype-definition-fail-1
  :prototype :test-prototype-polymer)

(deftest collect-mixins
  (is (= [{1 1} {2 2}] (l/collect-mixins {:mixins [{1 1} {2 2}]})))
  (is (= [{1 1}] (l/collect-mixins {:prototype {1 1}})))
  (is (= [{1 1}] (l/collect-mixins {:extends {1 1}})))
  (let [m1 {2 2}
        m2 {1 1 :mixins [m1]}]
  (is (= {2 2} (first (l/collect-mixins {:mixins [m2]}))))
  (is (= 2 (count (l/collect-mixins {:mixins [(fn []) (fn [])]}))))))

(defcustomelement mixin-1
  :mixins [{:properties {:property "value"}}])
(defcustomelement mixin-2
  :mixins [{:properties {:property "value"}}]
  :properties {:property "overridden-value"})
(def defaults {:properties {:property "value"}})
(defcustomelement mixin-3
  :mixins [defaults])
(def defaults-with-mixins
  {:mixins [defaults]})
(def other-defaults-with-mixins
  {:mixins [defaults]
   :properties {:property "overridden-value"}})
(defcustomelement mixin-4
  :mixins [defaults-with-mixins])
(defcustomelement mixin-5
  :mixins [other-defaults-with-mixins])
(defcustomelement mixin-6
  :mixins [#(assoc-in % [:properties :property2] 1)
           #(update-in % [:properties :property1] inc)
           #(assoc % :mixins [mixin-5])]
  :properties {:property1 1})
(defcustomelement mixin-7
  :mixins [{:properties {:property1 ""}}]
  :properties {:property2 1})

(deftest mixins
  (is (= "value" (get-in mixin-1 [:properties :property])))
  (is (= "overridden-value" (get-in mixin-2 [:properties :property])))
  (is (= "value" (get-in mixin-3 [:properties :property])))
  (is (= "value" (get-in mixin-4 [:properties :property])))
  (is (= "overridden-value" (get-in mixin-5 [:properties :property])))
  (is (= 2 (get-in mixin-6 [:properties :property1])))
  (is (= 1 (get-in mixin-6 [:properties :property2])))
  (is (= "overridden-value" (get-in mixin-6 [:properties :property])))
  (is (= 2 (count (get-in mixin-7 [:properties])))))

(defcustomelement test-extends-1)
(defcustomelement test-extends-2
  :prototype :div)
(defcustomelement test-extends-3
  :prototype test-extends-1)
(defcustomelement test-extends-4
  :prototype test-extends-2)
(defcustomelement test-extends-5
                 ;TODO fix :prototype :non-lucu-element
  :extends :div)
(defcustomelement test-extends-6
  :prototype test-extends-4)
(defcustomelement test-extends-fail-1
  :prototype :non-lucu-element)

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
  (is (instance? js/HTMLElement (.createElement js/document "test-prototype-1")))
  (is (not (instance? js/HTMLButtonElement (.createElement js/document "test-prototype-2"))))
  (is (instance? js/HTMLButtonElement (.createElement js/document "button" "test-prototype-2")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "button" "test-prototype-3")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "test-prototype-4"))))

(defcustomelement test-register)

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

(defcustomelement test-on-created-1
  :properties {:property 1}
  :on-created (fn [el m] (l/set-property! el :property (inc (:property m)))))
(defcustomelement test-on-created-2
  :mixins [{:on-created #(.appendChild % (.createTextNode js/document "1"))}]
  :on-created #(.appendChild % (.createTextNode js/document "2")))
(defcustomelement test-on-created-3
  :prototype test-on-created-1
  :on-created (fn [el m] (l/set-property! el :property (inc (:property m)))))

(deftest on-created
  (is (= 2 (l/get-property (.createElement js/document "test-on-created-1") :property)))
  (is (= "12" (.-textContent (.createElement js/document "test-on-created-2"))))
  (is (= 2 (l/get-property (.createElement js/document "test-on-created-3") :property))))

(defn on-changed-inc
  [el cs]
  (let [c (first cs)]
    (.setAttribute el (str "data-" (name (:property c))) (inc (:new-value c)))))

(defcustomelement test-on-changed-1
  :on-property-changed on-changed-inc
  :properties {:property 1})

(deftest on-changed
  (let [el (.createElement js/document "test-on-changed-1")]
    (l/set-property! el :property 2)
    (is (= "3" (.getAttribute el "data-property")))))

(def test-created-callback1-called (atom false))
(def test-attached-callback1-called (atom false))
(def test-detached-callback1-called (atom false))
(def test-changed-callback1-called (atom 0))

#_
(defcustomelement test-callback-1
  :on-created #(reset! test-created-callback1-called true)
  :on-attached #(reset! test-attached-callback1-called true)
  :on-detached #(reset! test-detached-callback1-called true)
  :on-property-changed #(swap! test-changed-callback1-called inc)
  :properties {:property1 "default1" :property2 "default2"})

#_
(deftest ^:async callback-append
  (reset! test-created-callback1-called false)
  (reset! test-attached-callback1-called false)
  (reset! test-detached-callback1-called false)
  (reset! test-changed-callback1-called 0)
  (let [el (.createElement js/document "test-callback-1")]
    (is (= true @test-created-callback1-called))
    (is (= false @test-attached-callback1-called))
    (.appendChild (.getElementById js/document tests-node) el)
    (js/setTimeout #(do
                     (is (= true @test-attached-callback1-called))
                     (is (= false @test-detached-callback1-called))
                     (is (= 0 @test-changed-callback1-called))
                     (done)) 100)))

#_
(deftest ^:async callback-set-attribute
  (reset! test-created-callback1-called false)
  (reset! test-attached-callback1-called false)
  (reset! test-detached-callback1-called false)
  (reset! test-changed-callback1-called 0)
  (let [el (.createElement js/document "test-callback-1")]
    (is (= true @test-created-callback1-called))
    (is (= false @test-attached-callback1-called))
    (.appendChild (.getElementById js/document tests-node) el)
    (.setAttribute el "property1" "value1")
    (js/setTimeout #(do
                     (is (= true @test-attached-callback1-called))
                     (is (= false @test-detached-callback1-called))
                     (is (= 1 @test-changed-callback1-called))
                     (done)) 100)))

#_
(deftest ^:async callback-set-property
  (reset! test-created-callback1-called false)
  (reset! test-attached-callback1-called false)
  (reset! test-detached-callback1-called false)
  (reset! test-changed-callback1-called 0)
  (let [el (.createElement js/document "test-callback-1")]
    (is (= true @test-created-callback1-called))
    (is (= false @test-attached-callback1-called))
    (.appendChild (.getElementById js/document tests-node) el)
    (l/set-property! el :property2 "value2")
    (js/setTimeout #(do
                     (is (= true @test-attached-callback1-called))
                     (is (= false @test-detached-callback1-called))
                     (is (= 1 @test-changed-callback1-called))
                     (done)) 100)))

#_
(deftest ^:async callback-set-property
  (reset! test-created-callback1-called false)
  (reset! test-attached-callback1-called false)
  (reset! test-detached-callback1-called false)
  (reset! test-changed-callback1-called 0)
  (let [el (.createElement js/document "test-callback-1")]
    (is (= true @test-created-callback1-called))
    (is (= false @test-attached-callback1-called))
    (.appendChild (.getElementById js/document tests-node) el)
    (l/set-properties! el {:property1 "value1" :property2 "value2"})
    (js/setTimeout #(do
                     (is (= true @test-attached-callback1-called))
                     (is (= false @test-detached-callback1-called))
                     (is (= 1 @test-changed-callback1-called))
                     (done)) 100)))

#_
(deftest ^:async callback-remove-child
  (reset! test-created-callback1-called false)
  (reset! test-attached-callback1-called false)
  (reset! test-detached-callback1-called false)
  (reset! test-changed-callback1-called 0)
  (let [el (.createElement js/document "test-callback-1")]
    (is (= true @test-created-callback1-called))
    (is (= false @test-attached-callback1-called))
    (.appendChild (.getElementById js/document tests-node) el)
    (.removeChild (.getElementById js/document tests-node) el)
    (js/setTimeout #(do
                     (is (= true @test-attached-callback1-called))
                     (is (= true @test-detached-callback1-called))
                     (is (= 0 @test-changed-callback1-called))
                     (done)) 100)))

(defcustomelement test-property-1
  :properties {:property nil
               :some-property ""})
(defcustomelement test-property-2
  :properties {:property1 "1"
               :property2 {:default 1 :type :number}
               :property-3 ""
               :property4 {:default "" :read-only? true}})

(defcustomelement test-property-fail-1
  :properties {:invalid_property_name nil})
(defcustomelement test-property-fail-2
  :properties {:id nil})
(defcustomelement test-property-fail-3
  :extends :img
  :properties {:src nil})
(defcustomelement test-property-fail-4
  :extends :img
  :properties {:src {:default nil :override? true}})

(deftest property-name
  (is (l/register test-property-1))
  (is (thrown? js/Error (l/register test-property-fail-1)))
  (is (thrown? js/Error (l/register test-property-fail-2)))
  (is (thrown? js/Error (l/register test-property-fail-3)))
  (is (true? (l/register test-property-fail-4))))

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
    (is (thrown? js/Error (l/set-property! el :property2 "")))
    (is (= "" (l/get-property el :property-3)))
    (l/set-property! el :property-3 "updated")
    (is (= "updated" (l/get-property el :property-3)))
    (is (= "updated" (aget el "property_3")))
    (aset el "property_3" "updated2")
    (is (= "updated2" (l/get-property el :property-3)))
    (l/set-property! el :undefined-property 1)
    (is (= "1" (.getAttribute el "undefined-property")))
    (is (= nil (l/get-property el :undefined-property)))
    (is (= nil (aget el "undefine_property")))
    (is (thrown? js/Error (l/set-property! el :property4 "updating read-only property")))
    (is (thrown? js/Error (aset el "property4" "updating read-only property")))))

(deftest attributes-update
  (let [el (.createElement js/document "test-property-2")]
    (is (= "1" (.getAttribute el "property1")))
    (.setAttribute el "property1" "2")
    (is (= "2" (.getAttribute el "property1")))
    ; TODO fix with async
    #_
    (is (= "2" (l/get-property el :property1)))))

(defcustomelement test-method-1
  :methods {:method1 (fn [] 1)
            :method2 (fn [] {:key "value"})
            :method3 (fn [_ o] (get o "key"))
            :method4 (fn [& args] args)})
(defcustomelement test-method-2
  :methods {:invalid_method_name nil})
(defcustomelement test-method-3
  :methods {:constructor nil})

(deftest methods
  (is (= 1 (.method1 (.createElement js/document "test-method-1"))))
  (is (= "value" (aget (.method2 (.createElement js/document "test-method-1")) "key")))
  (is (= "value" (.method3 (.createElement js/document "test-method-1") #js {:key "value"})))
  (is (not (nil? (first (.method4 (.createElement js/document "test-method-1"))))))
  (is (nil? (second (.method4 (.createElement js/document "test-method-1")))))
  (is (thrown? js/Error (l/register test-method-2)))
  (is (thrown? js/Error (l/register test-method-3))))

(defcustomelement test-extension-1
  :on-created #(l/set-property! % :property1 "2")
  :properties {:property1 "1"}
  :methods {:method1 (fn [] 1)})
(defcustomelement test-extension-2
  :prototype test-extension-1)
(defcustomelement test-extension-3
  :prototype test-extension-2)

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

  (l/register test-on-created-1)
  (l/register test-on-created-2)
  (l/register test-on-created-3)

  (l/register test-on-changed-1)

  (l/register test-prototype-1)
  (l/register test-prototype-2)
  (l/register test-prototype-3)
  (l/register test-prototype-4)

  (l/register test-extends-1)
  (l/register test-extends-2)
  (l/register test-extends-3)
  (l/register test-extends-4)
  (l/register test-extends-5)
  (l/register test-extends-6)

  #_(l/register test-callback-1)

  (l/register test-property-2)

  (l/register test-method-1)

  (l/register test-extension-1)
  (l/register test-extension-2)
  (l/register test-extension-3)

  (f)

  (delete-tests-node))

(use-fixtures :once wrap-registration)
