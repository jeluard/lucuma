(ns lucuma.test.browser-runner
  (:require [dommy.core :as dommy]
            [lucuma.overlay :as o]
            [lucuma.event-test :as et]
            [cemerick.cljs.test :refer [report *testing-vars* *testing-contexts*] :as t])
  (:require-macros [dommy.macros :refer [sel1]]))

(defn- log
  [s]
  (.log js/console (clj->js s)))

(defmethod report :begin-test-ns [m]
  (log (str "begin " m))
  (dommy/append! (sel1 :#tests) [:div {:id (:ns m)} (str (:ns m))]))

(defmethod report :end-test-ns [m]
  (log (str "end " m))
  )

(defmethod report :begin-test-var [m]
  (log (str ":begin " (:name (meta (:var m)))))
  )

(defmethod report :end-test-var [m]
  (log (str ":end " (:name (meta (:var m))) " " *testing-vars* " " *testing-contexts*))
  )

(defmethod report :summary [m]
  (log m))

;;begin/end-test-var
;;:var

;;begin/end-test-ns
;;:ns

;;error, fail, pass
;;:var :message :actual :expected

(defmethod report :error [m]
  (log m))

(defmethod report :fail [m]
  (log (str ":fail " (:name (meta (:var m))) " " *testing-vars* " " *testing-contexts*)))

(defmethod report :pass [m]
  (log (str ":pass " (:name (meta (:var m))) " " *testing-vars* " " *testing-contexts* " " (:message m))))

(defn ^:export run-all-tests
  []
  (t/run-all-tests))
