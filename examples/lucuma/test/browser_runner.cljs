(ns lucuma.test.browser-runner
  (:require [dommy.core :as dommy]
            [lucuma.overlay :as o]
            [lucuma.event-test :as et]
            [cemerick.cljs.test :refer [report *testing-vars* *testing-contexts*] :as t])
  (:require-macros [dommy.macros :refer [sel1]]))

(defn- log
  [s]
  (.log js/console (clj->js s)))

(def current-ns (atom nil))

(defn- sel-test
  ([] (.getElementById js/document @current-ns))
  ([t] (.item (.getElementsByClassName (sel-test) t) "0")))

(defmethod report :begin-test-ns
  [m]
  (reset! current-ns (:ns m))
  (dommy/append! (sel1 :#tests-results) [:div {:id (:ns m)} [:h3 (str (:ns m))]]))

(defmethod report :end-test-ns
  [m]
  (dommy/add-class! (sel-test) "test-ns-done"))

(defmethod report :begin-test-var [m]
  (let [n (:name (meta (:var m)))]
    (dommy/append! (sel-test) [:ul {:class n} [:h4 (str n)]])))

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
    (dommy/append! (sel-test n) [:li (str "fail " (:message m))])))

(defmethod report :pass [m]
  (log (re-matches #"^#[\w]+$" "#a.b"))
  (let [n (first *testing-vars*)]
    (dommy/append! (sel-test n) [:li (str "success " (:message m))])))

(defn ^:export run-all-tests
  []
  (t/run-all-tests))
