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
  :base-type "button"
  :style "@host { :scope {background: red;}}")

(defn alert-fn
  [el]
  (.alert js/window  (str "Hello " el " !")))

(defwebcomponent ex-methods
  :methods {:alert alert-fn})

(defn ^:export register-all
  []
  (register ex-hello)
  (register ex-lifecycle)
  (register ex-content-template)
  (register ex-content-hiccup)
  (register ex-style)
  (register ex-extend)
  (register ex-methods)

  (register lucu-range-with-threshold)
  (register lucu-overlay))
