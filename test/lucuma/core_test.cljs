(ns lucuma.core-test
  (:require [cemerick.cljs.test :as t :refer-macros [deftest done is use-fixtures]]
            [lucuma.core :as l :refer-macros [defwebcomponent]]
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

(defwebcomponent test-sr-1
  :requires-shadow-dom? true)
(defwebcomponent test-sr-2
  :document "<span></span>"
  :requires-shadow-dom? true)
(defwebcomponent test-sr-3
  :style "* {background: red;}"
  :requires-shadow-dom? true)

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
    (is (not (nil? (l/host (.-firstChild (l/shadow-root (.createElement js/document "test-sr-2")))))))))

(defwebcomponent test-prototype-1)
(defwebcomponent test-prototype-2
  :extends :button)
(defwebcomponent test-prototype-3
  :prototype test-prototype-2)
(defwebcomponent test-prototype-4
  :prototype js/HTMLButtonElement.prototype)
(defwebcomponent test-prototype-definition-1
  :prototype test-prototype-3)
(defwebcomponent test-prototype-definition-2
  :prototype :test-prototype-polymer
  :extends :button)
(defwebcomponent test-prototype-definition-3
  :mixins [test-prototype-2])
(defwebcomponent test-prototype-definition-4
  [arg]
  :document (inc arg))
(defwebcomponent test-prototype-definition-5
  [arg]
  :mixins [test-prototype-2]
  :document (inc arg))
(defwebcomponent test-prototype-definition-6
  :prototype test-prototype-1)
(defwebcomponent test-prototype-definition-7
  :properties {:property1 "default" :property2 "default" :property3 "default"})
(defwebcomponent test-prototype-definition-8
  :mixins [test-prototype-definition-7]
  :properties {:property2 "another-default"})
#_
(defwebcomponent test-prototype-definition-9
  :mixins [test-prototype-definition-8]
  :properties {:property3 "another-default"})
(defwebcomponent test-prototype-definition-10
  :mixins [{:properties {:property1 "value1" :property2 "value1"}} {:properties {:property1 "value2"}}]
  :properties {:property2 "value"})
#_
(defwebcomponent test-prototype-definition-11
  :mixins [#(update-in % [:properties :property] inc)]
  :properties {:property 1})

(defwebcomponent test-prototype-definition-fail-1
  :prototype :test-prototype-polymer)

(deftest collect-mixins
  (is (= [{1 1} {2 2}] (l/collect-mixins {:mixins [{1 1} {2 2}]})))
  (is (= [{1 1}] (l/collect-mixins {:prototype {1 1}})))
  (is (= [{1 1}] (l/collect-mixins {:extends {1 1}})))
  (let [m1 {2 2}
        m2 {1 1 :mixins [m1]}]
  (is (= {2 2} (first (l/collect-mixins {:mixins [m2]}))))
  (is (= 2 (count (l/collect-mixins {:mixins [(fn []) (fn [])]}))))))

(defwebcomponent mixin-1
  :mixins [{:properties {:property "value"}}])
(defwebcomponent mixin-2
  :mixins [{:properties {:property "value"}}]
  :properties {:property "overridden-value"})
(def defaults {:properties {:property "value"}})
(defwebcomponent mixin-3
  :mixins [defaults])
(def defaults-with-mixins
  {:mixins [defaults]})
(def other-defaults-with-mixins
  {:mixins [defaults]
   :properties {:property "overridden-value"}})
(defwebcomponent mixin-4
  :mixins [defaults-with-mixins])
(defwebcomponent mixin-5
  :mixins [other-defaults-with-mixins])
(defwebcomponent mixin-6
  :mixins [#(assoc-in % [:properties :property2] 1)
           #(update-in % [:properties :property] inc)]
  :properties {:property 1})

(deftest mixins
  (is (= "value" (get-in mixin-1 [:properties :property])))
  (is (= "overridden-value" (get-in mixin-2 [:properties :property])))
  (is (= "value" (get-in mixin-3 [:properties :property])))
  (is (= "value" (get-in mixin-4 [:properties :property])))
  (is (= "overridden-value" (get-in mixin-5 [:properties :property])))
  (is (= 2 (get-in mixin-6 [:properties :property])))
  (is (= 1 (get-in mixin-6 [:properties :property2]))))

#_
(deftest mixins
  (is (= :button (:extends test-prototype-definition-3)))
  (is (= :button (:extends (test-prototype-definition-5 0))))
  (is (= "default" (get-in test-prototype-definition-8 [:properties :property1])))
  (is (= "another-default" (get-in test-prototype-definition-8 [:properties :property2])))
  #_(is (= "default" (get-in test-prototype-definition-9 [:properties :property1])))
  #_(is (= "another-default" (get-in test-prototype-definition-9 [:properties :property2])))
  #_(is (= "another-default" (get-in test-prototype-definition-9 [:properties :property3])))
  (is (= "value2" (get-in test-prototype-definition-10 [:properties :property1])))
  (is (= "value" (get-in test-prototype-definition-10 [:properties :property2])))
  #_(is (= 3 (get-in test-prototype-definition-11 [:properties :property]))))

(defwebcomponent test-extends-1)
(defwebcomponent test-extends-2
  :prototype :div)
(defwebcomponent test-extends-3
  :prototype test-extends-1)
(defwebcomponent test-extends-4
  :prototype test-extends-2)
(defwebcomponent test-extends-5
                 ;TODO fix :prototype :non-lucu-element
  :extends :div)
(defwebcomponent test-extends-6
  :prototype test-extends-4)
(defwebcomponent test-extends-fail-1
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
  (is (not (instance? js/HTMLUnknownElement (.createElement js/document "test-unknown"))))
  (is (instance? js/HTMLElement (.createElement js/document "test-prototype-1")))
  (is (not (instance? js/HTMLButtonElement (.createElement js/document "test-prototype-2"))))
  (is (instance? js/HTMLButtonElement (.createElement js/document "button" "test-prototype-2")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "button" "test-prototype-3")))
  (is (instance? js/HTMLButtonElement (.createElement js/document "test-prototype-4"))))

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
  :document "<span id='style1'></span>"
  :style "#style1 {color: rgb(255, 0, 0);}")

(defwebcomponent test-style-2
  :document "<span id='style2'></span>"
  :style {:media "all" :content "#style2 {color: rgb(255, 0, 0);}"})

(deftest style
  (is (= "rgb(255, 0, 0)" (.-color (.getComputedStyle js/window (by-id "style1")))))
  (is (= "rgb(255, 0, 0)" (.-color (.getComputedStyle js/window (by-id "style2"))))))

(defwebcomponent test-attribute-1
  :attributes {:attribute 1})

(deftest attributes
  (is (= "1" (.getAttribute (.createElement js/document "test-attribute-1") "attribute"))))

(defwebcomponent test-on-created-1
  :on-created (fn [] {:document "content"}))
(defwebcomponent test-on-created-2
  :properties {:property 1}
  :on-created (fn [el m] (l/set-property! el :property (inc (:property m)))))
(defwebcomponent test-on-created-3
  :on-created (fn [] {:invalid-property ""}))
(defwebcomponent test-on-created-4
  :document "content"
  :on-created (fn [] {:document "content"}))

(deftest on-created
  (is (= "content" (.-innerHTML (.createElement js/document "test-on-created-1"))))
  (is (= 2 (l/get-property (.createElement js/document "test-on-created-2") :property)))
  (is (thrown? js/Error (.createElement js/document "test-on-created-3")))
  (is (thrown? js/Error (.createElement js/document "test-on-created-4"))))

(defn on-changed-inc
  [el cs]
  (let [c (first cs)]
    (.setAttribute el (str "data-" (name (:property c))) (inc (:new-value c)))))

(defwebcomponent test-on-changed-1
  :on-changed on-changed-inc
  :properties {:property 1})
(defwebcomponent test-on-changed-2
  :on-created (fn [_] {:on-changed on-changed-inc})
  :properties {:property 1})

(deftest on-changed
  (let [el (.createElement js/document "test-on-changed-1")]
    (l/set-property! el :property 2)
    (is (= "3" (.getAttribute el "data-property"))))
  (let [el (.createElement js/document "test-on-changed-2")]
    (l/set-property! el :property 2)
    (is (= "3" (.getAttribute el "data-property")))))

(def test-created-callback1-called (atom false))
(def test-attached-callback1-called (atom false))
(def test-detached-callback1-called (atom false))
(def test-changed-callback1-called (atom 0))

#_
(defwebcomponent test-callback-1
  :on-created #(reset! test-created-callback1-called true)
  :on-attached #(reset! test-attached-callback1-called true)
  :on-detached #(reset! test-detached-callback1-called true)
  :on-changed #(swap! test-changed-callback1-called inc)
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

(defwebcomponent test-property-1
  :properties {:property nil
               :some-property ""})
(defwebcomponent test-property-2
  :properties {:property1 "1"
               :property2 {:default 1 :type :number}
               :property-3 ""})

(defwebcomponent test-property-fail-1
  :properties {:invalid_property_name nil})
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
    (is (thrown? js/Error (l/set-property! el :property2 "")))
    (is (= "" (l/get-property el :property-3)))
    (l/set-property! el :property-3 "updated")
    (is (= "updated" (l/get-property el :property-3)))
    (is (= "updated" (aget el "property_3")))
    (aset el "property_3" "updated2")
    (is (= "updated2" (l/get-property el :property-3)))
    (is (thrown? js/Error (l/set-property! el :property-inexistant "")))))

(deftest attributes-update
  (let [el (.createElement js/document "test-property-2")]
    (is (= "1" (.getAttribute el "property1")))
    (.setAttribute el "property1" "2")
    (is (= "2" (.getAttribute el "property1")))
    (is (= "2" (l/get-property el :property1)))))

(defwebcomponent test-method-1
  :methods {:method1 (fn [] 1)
            :method2 (fn [] {:key "value"})
            :method3 (fn [_ o] (get o "key"))
            :method4 (fn [& args] args)})
(defwebcomponent test-method-2
  :methods {:invalid_method_name nil})
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
  :prototype test-extension-1)
(defwebcomponent test-extension-3
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

  (when (sd/supported?)
    (l/register test-sr-1)
    (l/register test-sr-2)
    (l/register test-sr-3)
    (append "test-sr-1")
    (append "test-sr-2")
    (append "test-sr-3"))

  (l/register test-style-1)
  (l/register test-style-2)
  (append "test-style-1")
  (append "test-style-2")

  (l/register test-attribute-1)

  (l/register test-on-created-1)
  (l/register test-on-created-2)
  (l/register test-on-created-3)
  (l/register test-on-created-4)

  (l/register test-on-changed-1)
  (l/register test-on-changed-2)

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
