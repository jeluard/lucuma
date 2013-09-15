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

(def ^:private current-ns (atom nil))

(def ^:private report-counters (atom {}))

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

(defn- issues
  [r]
  (+ (or (:error r) 0) (or (:fail r) 0)))

(defn- failed-ns?
  [n]
  (let [r (get @report-counters n)]
    (not= 0 (reduce + (map issues (vals r))))))

(defn- failed-test?
  [n t]
  (let [r (get-in @report-counters [n t])]
    (not= 0 (issues r))))

(defmethod report :begin-test-ns
  [m]
  (reset! current-ns (s/replace (str (:ns m)) #"\." "-"))
  (dommy/add-class! (sel1 :#tests-results) "panel-group")
  (dommy/append! (sel1 :#tests-results) [:div {:class "panel panel-default"}
                                         [:div {:id (str "collapse-" @current-ns "-header") :class "panel-heading test-ns-running"}
                                          [:h4 {:class "panel-title"}
                                           [:a {:class "accordion-toggle" :data-toggle "collapse" :data-parent "#tests-results" :href (str "#collapse-" @current-ns)}
                                            @current-ns]]]
                                         [:div {:id (str "collapse-" @current-ns) :class "panel-collapse collapse"}]]))

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
  (let [n (str (:name (meta (:var m))))]
    (dommy/remove-class! (sel-test n) "test-running")
    (dommy/add-class! (sel-test n) (if (failed-test? @current-ns n) "test-fail" "test-pass"))
    (dommy/insert-after! [:i {:class (if (failed-test? @current-ns n) "icon-remove" "icon-ok")}] (sel-test-header n))))

(defn- append-test-result
  [m n c]
  (dommy/append! (sel-test n) [:li {:class c}
                                 [:em {:class "test-message"} (:message m)]
                                 [:span {:class "test-result"}
                                  [:span {:class "test-expected-value"}
                                   [:span "expected:"]
                                   [:code {:class "language-clojure"} (str (:expected m))]]
                                  [:span {:class "test-actual-value"}
                                   [:span "but got:"]
                                   [:code {:class "language-clojure"} (str (:actual m))]]]]))

(defmethod report :pass
  [m]
  (let [n (str (first *testing-vars*))]
    (swap! report-counters update-in [@current-ns n :pass] (fnil inc 0))
    (append-test-result m n "test-pass")))

(defmethod report :error [m]
  (let [n (str (first *testing-vars*))]
    (swap! report-counters update-in [@current-ns n :error] (fnil inc 0))
    (append-test-result m n "test-error")))

(defmethod report :fail
  [m]
  (let [n (str (first *testing-vars*))]
    (swap! report-counters update-in [@current-ns n :fail] (fnil inc 0))
    (append-test-result m n "test-fail")))

(defmethod report :summary [m]
  (dommy/append! (sel1 :#tests-results) [:script "Prism.highlightAll()"]))

(defn ^:export run-all-tests
  []
  (t/run-all-tests))
