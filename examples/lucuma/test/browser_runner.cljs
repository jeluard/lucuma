(ns lucuma.test.browser-runner
  (:require [clojure.string :as s]
            [dommy.core :as dommy]
            [lucuma.overlay :as o]
            [lucuma.event-test :as et]
            [cemerick.cljs.test :refer [report *testing-vars* *testing-contexts*] :as t])
  (:require-macros [dommy.macros :refer [sel1]]))

(defn- log
  [s]
  (.log js/console (clj->js s)))

(def current-ns (atom nil))

(defn- sel-current-ns
  []
  (.getElementById js/document (str "collapse-" @current-ns)))

(defn- sel-current-ns-header
  []
  (.getElementById js/document (str "collapse-" @current-ns "-header")))

(defn- sel-test
  [t]
  (.item (.getElementsByClassName (sel-current-ns) t) 0))

(defn- sel-test-header
  [t]
  (.-firstChild (sel-test t)))

(defn failed-ns?
  [n]
  false)

(defn failed-test?
  [n t]
  true)

(defmethod report :begin-test-ns
  [m]
  (reset! current-ns (s/replace (str (:ns m)) #"\." "-"))
  (dommy/append! (sel1 :#tests-results) [:div {:id "accordion" :class "panel-group"}
                                         [:div {:class "panel panel-default"}
                                          [:div {:id (str "collapse-" @current-ns "-header") :class "panel-heading test-ns-running"}
                                           [:h4 {:class "panel-title"}
                                            [:a {:class "accordion-toggle" :data-toggle "collapse" :data-parent "#accordion" :href (str "#collapse-" @current-ns)}
                                             @current-ns]]]
                                          [:div {:id (str "collapse-" @current-ns) :class "panel-collapse collapse"}]]]))

(defmethod report :end-test-ns
  [m]
  (dommy/remove-class! (sel-current-ns-header) "test-ns-running")
  (dommy/add-class! (sel-current-ns-header) (if (failed-ns? @current-ns) "test-ns-fail" "test-ns-pass"))
  (dommy/append! (sel-current-ns-header) [:i {:class (if (failed-ns? @current-ns) "icon-remove" "icon-ok")}]))

(defmethod report :begin-test-var [m]
  (let [n (:name (meta (:var m)))]
    (dommy/append! (sel-current-ns) [:ul {:class (str n " panel-body test-running")} [:h4 (str n)]])))

(defmethod report :end-test-var
  [m]
  (let [n (:name (meta (:var m)))]
    (dommy/remove-class! (sel-test n) "test-running")
    (dommy/add-class! (sel-test n) (if (failed-test? @current-ns n) "test-fail" "test-pass"))
    (dommy/insert-after! [:i {:class (if (failed-test? @current-ns n) "icon-remove" "icon-ok")}] (sel-test-header n))))

(defmethod report :summary [m])

;;begin/end-test-var
;;:var

;;begin/end-test-ns
;;:ns

;;error, fail, pass
;;:var :message :actual :expected

(defmethod report :pass
  [m]
  (let [n (first *testing-vars*)]
    (dommy/append! (sel-test n) [:li {:class "test-pass"}
                                 [:span {:class "test-message"} (:message m)]
                                 [:span {:class "test-expected-value"} (str "expected: " (:expected m))]
                                 [:span {:class "test-actual-value"} (str "actual:" (:actual m))]])))

(defmethod report :error [m]
  (let [n (first *testing-vars*)]
    (dommy/append! (sel-test n) [:li {:class "test-error"}
                                 [:span {:class "test-message"} (:message m)]
                                 [:span {:class "test-expected-value"} (str "expected: " (:expected m))]
                                 [:span {:class "test-actual-value"} (str (:actual m))]])))

(defmethod report :fail
  [m]
  (let [n (first *testing-vars*)]
    (dommy/append! (sel-test n) [:li {:class "test-fail"}
                                 [:span {:class "test-message"} (:message m)]
                                 [:span {:class "test-expected-value"} (str "expected: " (:expected m))]
                                 [:span {:class "test-actual-value"} (str (:actual m))]])))

(defn ^:export run-all-tests
  []
  (t/run-all-tests))
