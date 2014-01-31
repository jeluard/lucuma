(ns lucuma.examples
  (:require [lucuma :refer [register render-content render-style]]
            [lucuma.event :refer [fire]]
            [lucuma.range-with-threshold :refer [lucu-range-with-threshold]]
            [lucuma.overlay :refer [lucu-overlay]]
            [lucuma.flipbox :refer [lucu-flipbox]]
            [lucuma.example :refer [lucu-example lucu-usage]]
            [dommy.core :refer [prepend!]]
            [garden.core :refer [css]]
            [garden.units :refer [px]])
  (:require-macros [lucuma :refer [defwebcomponent]]
                   [dommy.macros :refer [node sel1]]))

(defwebcomponent ex-hello
  :content "Hello world!")

(comment
(defwebcomponent ex-hello
  :document "Hello world!")
(defwebcomponent ex-hello
  :document (document "Hello world!"))

(register ex-hello)

;; Name can be explicitely provided.
(register (merge ex-hello {:name "my-hello-with-custom-name"}))

;; Append a 'ex-hello' node to body.
(.appendChild js/document.body (.createElement js/document "ex-hello"))

;; Alternatively using hiccup syntax and dommy.
(dommy/append! (dommy/sel1 :body) [:ex-hello])
)

(defwebcomponent ex-lifecycle
  :on-created #(prepend! (sel1 :#lifecycle-events) [:li "element created"])
  :on-attached #(prepend! (sel1 :#lifecycle-events) [:li "element attached"])
  :on-detached #(prepend! (sel1 :#lifecycle-events) [:li "element detached"]))

(derive PersistentVector ::vector)
(defmethod render-content ::vector [v] (node v))

(defwebcomponent ex-content-hiccup
  :content [:div "Hello hiccup!"])

(defwebcomponent ex-style
  :content [:span "Hello styled!"]
  :style "span { background: blue; color: white; border: 0; border-radius: 4px;}")

(defmethod render-style ::vector [v] (css v))

(defwebcomponent ex-style-garden
  :content [:span "Hello garden!"]
  :style [:span {:background "#3d7c45" :color "white" :border 0 :border-radius (px 4)}])

(defwebcomponent ex-style-scope
  :content [:span {:class "fa fa-exclamation"} "Hello style scope!"])

(defwebcomponent ex-attributes
  :attributes #{:attribute})

(defwebcomponent ex-methods
  :methods {:method (fn [] {:key "value"})})

(defn ^:export fire-event
  [id]
  (fire (sel1 (keyword id)) :event {:msg "Sent from CLJS"}))

(defwebcomponent ex-events
  :handlers #{:event})

(defwebcomponent ex-constructor
  :constructor "CustomConstructor"
  :content [:div "Hello constructor!"])

(defwebcomponent ex-extend
  :host :div
  :content [:span {:class "fa fa-exclamation"} [:content]])

(defn ^:export register-all
  []
  (register ex-hello)
  (register (merge ex-hello {:name "my-hello-with-custom-name"}))
  (register ex-lifecycle)
  (register ex-content-hiccup)
  (register ex-style)
  (register ex-style-garden)
  (register ex-style-scope)
  (register ex-extend)
  (register ex-attributes)
  (register ex-methods)
  (register ex-events)
  (register ex-constructor)

  (register lucu-range-with-threshold)
  (register lucu-overlay)
  (register lucu-flipbox)
  (register lucu-example)
  (register lucu-usage))
