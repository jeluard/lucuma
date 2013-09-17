(ns lucuma.test.browser-runner
  (:require [clojure.string :as s]
            [dommy.core :as dommy]
            [lucuma.overlay :as o]
            [lucuma.event-test :as et]
            [cemerick.cljs.test :refer [report *testing-vars* *testing-contexts*] :as t])
  (:require-macros [dommy.macros :refer [sel1]]))

(def ^:private current-ns (atom nil))
(def ^:private report-details (atom {}))

(defn- sel-current-ns [] (.getElementById js/document (str "collapse-" @current-ns)))
(defn- sel-current-ns-header [] (.getElementById js/document (str "collapse-" @current-ns "-header")))
(defn- sel-test [t] (.item (.getElementsByClassName (sel-current-ns) t) 0))
(defn- sel-test-header [t] (.-firstChild (sel-test t)))

(defn- or-0 [r t] (or (get r t) 0))
(defn- passes [r] (or-0 r :pass))
(defn- failures [r] (or-0 r :fail))
(defn- errors [r] (or-0 r :error))
(defn- issues [r] (+ (failures r) (errors r)))
(defn- tests [r] (+ (passes r) (issues r)))

(defn- reports
  ([] @report-details)
  ([n] (get @report-details n))
  ([n t] (get-in @report-details [n t])))

(defn- agg-ns [r f] (reduce + (map f (vals r))))

(defn- all-reports
  []
  (letfn [(agg [t] (reduce + (map #(agg-ns % t) (vals (reports)))))]
    (merge {} {:pass (agg :pass)} {:fail (agg :fail)} {:error (agg :error)})))

(defn- elapsed [r] (- (.getTime (:end-time r)) (.getTime (:start-time r))))

(defn- failed-ns?
  [n]
  (let [r (reports n)]
    (not= 0 (reduce + (map issues (vals r))))))

(defn- failed-test?
  [n t]
  (let [r (reports n t)]
    (not= 0 (issues r))))

(defmethod report :begin-test-ns
  [m]
  (reset! current-ns (s/replace (str (:ns m)) #"\." "-"))
  (swap! report-details assoc-in [@current-ns :start-time] (js/Date.))
  (dommy/add-class! (sel1 :#tests-results) "panel-group")
  (dommy/append! (sel1 :#tests-results) [:div {:class "panel panel-default"}
                                         [:div {:id (str "collapse-" @current-ns "-header") :class "panel-heading test-ns-running"}
                                          [:h4 {:class "panel-title"}
                                           [:a {:class "accordion-toggle" :data-toggle "collapse" :data-parent "#tests-results" :href (str "#collapse-" @current-ns)}
                                            @current-ns]]]
                                         [:div {:id (str "collapse-" @current-ns) :class "panel-collapse collapse"}]]))

(defmethod report :end-test-ns
  [m]
  (swap! report-details assoc-in [@current-ns :end-time] (js/Date.))
  (dommy/remove-class! (sel-current-ns-header) "test-ns-running")
  (dommy/add-class! (sel-current-ns-header) (if (failed-ns? @current-ns) "test-ns-fail" "test-ns-pass"))
  (let [r (reports @current-ns)
        title (str (agg-ns r tests) " tests (" (agg-ns r failures) " failures, " (agg-ns r errors) " errors) executed in " (elapsed r) "ms")]
    (dommy/append! (sel-current-ns-header) [:i {:class (if (failed-ns? @current-ns) "icon-remove" "icon-ok") :data-toggle "tooltip" :data-placement "right" :title title}])))

(defmethod report :begin-test-var [m]
  (let [n (str (:name (meta (:var m))))]
    (swap! report-details assoc-in [@current-ns n :start-time] (js/Date.))
    (dommy/append! (sel-current-ns) [:ul {:class (str n " panel-body test-running")} [:h4 n]])))

(defmethod report :end-test-var
  [m]
  (let [n (str (:name (meta (:var m))))]
    (swap! report-details assoc-in [@current-ns n :end-time] (js/Date.))
    (dommy/remove-class! (sel-test n) "test-running")
    (dommy/add-class! (sel-test n) (if (failed-test? @current-ns n) "test-fail" "test-pass"))
    (dommy/insert-after! [:i {:class (if (failed-test? @current-ns n) "icon-remove" "icon-ok") :data-toggle "tooltip" :data-placement "right" :title (str "executed in " (elapsed (reports @current-ns n)) "ms")}] (sel-test-header n))))

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

(defn- report-var
  [m t c]
  (let [n (str (first *testing-vars*))]
    (swap! report-details update-in [@current-ns n t] (fnil inc 0))
    (append-test-result m n c)))

(defmethod report :pass [m] (report-var m :pass "test-pass"))
(defmethod report :error [m] (report-var m :error "test-error"))
(defmethod report :fail [m] (report-var m :fail "test-fail"))

(defmethod report :summary
  [m]
  (dommy/append! (sel1 :#tests-results) [:script "Prism.highlightAll(); $('#tests-results').tooltip({selector: \"[data-toggle=tooltip]\"});"])
  (let [r (all-reports)]
    (dommy/insert-before! [:span {:id "tests-results-label"} (str (tests r) " tests run (" (:fail r) " failures, " (:error r) " errors)")] (sel1 :#tests-results)))
  (reset! report-details {}))

(defn ^:export run-all-tests
  []
  (.start (.create js/Ladda (sel1 :#tests-btn)))
  (if-let [tr (sel1 :#tests-results)]
    (dommy/clear! tr))
  (if-let [trl (sel1 :#tests-results-label)]
    (dommy/remove! trl))
  (t/run-all-tests)
  (.stopAll js/Ladda))
