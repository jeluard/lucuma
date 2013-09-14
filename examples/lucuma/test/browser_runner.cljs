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

(defn- sel-test-from-current-ns
  [t]
  (.item (.getElementsByClassName (sel-current-ns) t) "0"))

(defmethod report :begin-test-ns
  [m]
  (reset! current-ns (s/replace (str (:ns m)) #"\." "-"))
  (dommy/append! (sel1 :#tests-results) [:div {:id "accordion" :class "panel-group"}
                                         [:div {:class "panel panel-default"}
                                          [:div {:id (str "collapse-" @current-ns "-header") :class "panel-heading"}
                                           [:h4 {:class "panel-title"}
                                            [:a {:class "accordion-toggle" :data-toggle "collapse" :data-parent "#accordion" :href (str "#collapse-" @current-ns)}
                                             @current-ns]]]
                                          [:div {:id (str "collapse-" @current-ns) :class "panel-collapse collapse"}]]]))

(defn failed?
  [n]
  false)

;;TODO add in to first failing ns
(defmethod report :end-test-ns
  [m]
  (dommy/add-class! (sel-current-ns-header) (if (failed? @current-ns) "test-ns-fail" "test-ns-pass"))
  (dommy/append! (sel-current-ns-header) [:i {:class "icon-ok"}]))

(defmethod report :begin-test-var [m]
  (let [n (:name (meta (:var m)))]
    (dommy/append! (sel-current-ns) [:ul {:class (str n " panel-body")} [:h4 (str n)]])))

(defmethod report :end-test-var [m])

(defmethod report :summary [m])

;;begin/end-test-var
;;:var

;;begin/end-test-ns
;;:ns

;;error, fail, pass
;;:var :message :actual :expected

(defmethod report :error [m])

(defmethod report :fail [m]
  (let [n (first *testing-vars*)]
    (dommy/append! (sel-test-from-current-ns n) [:li {:class "test-failure"} (str "fail " (:message m))])))

(defmethod report :pass [m]
  (let [n (first *testing-vars*)]
    (dommy/append! (sel-test-from-current-ns n) [:li {:class "test-success"} (str "success " (:message m))])))

(defn ^:export run-all-tests
  []
  (t/run-all-tests))
