(ns lucuma.examples
  (:require [dommy.core :refer [prepend!]]
            [lucuma.custom-elements :refer [register render-content]]
            [lucuma.overlay :refer [lucu-overlay]]
            [lucuma.range-with-threshold :refer [lucu-range-with-threshold]])
  (:require-macros [lucuma :refer [defwebcomponent]]
                   [dommy.macros :refer [node sel1]]))

(defwebcomponent ex-hello
  :content "Hello world!")

(defwebcomponent ex-lifecycle
  :created-fn #(prepend! (sel1 :#lifecycle-events) [:li "element created"])
  :entered-view-fn #(prepend! (sel1 :#lifecycle-events) [:li "element entered view"])
  :left-view-fn #(prepend! (sel1 :#lifecycle-events) [:li "element left view"]))

(defwebcomponent ex-content-template
  :content #(sel1 :#template-id))

(derive PersistentVector ::vector)
(defmethod render-content ::vector [v] (node v))

(defwebcomponent ex-content-hiccup
  :content [:div "Hello hiccup!"])

(defwebcomponent ex-style
  :content "<button>Hello styled!</button>"
  :style "button { background: #3d7c45; color: white; border: 0; border-radius: 4px;}")

(defwebcomponent ex-extend
  :base-type "button" ;; or js/HTMLButtonElement
  :style "@host { :scope {background: red;}}")

(defn ^:export register-all
  []
  (register ex-hello)
  (register ex-lifecycle)
  (register ex-content-template)
  (register ex-content-hiccup)
  (register ex-style)
  (register ex-extend)

  (register lucu-range-with-threshold)
  (register lucu-overlay))
