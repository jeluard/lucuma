(ns lucuma.examples
  (:require [lucuma :refer [register render-document render-style]]
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
  :document "Hello world!")

(comment
(defwebcomponent ex-hello
  :document "Hello world!")

(register ex-hello)

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
(defmethod render-document ::vector [v] (node v))

(defwebcomponent ex-document-hiccup
  :document [:div "Hello hiccup!"])

(defwebcomponent ex-style
  :document [:span "Hello styled!"]
  :style "span { background: blue; color: white; border: 0; border-radius: 4px;}")

(defmethod render-style ::vector [v] (css v))

(defwebcomponent ex-style-garden
  :document [:span "Hello garden!"]
  :style [:span {:background "#3d7c45" :color "white" :border 0 :border-radius (px 4)}])

(defwebcomponent ex-style-media-queries
  :document [:span "Hello media queries!"]
  :style {:media "screen and (min-width: 800px)" :title "Large Screen" :content [:span {:border "1px dotted black;"}]})

(defwebcomponent ex-properties
  :properties {:property1 "default"
               :property2 {:default 1 :type js/Number :events? true :attributes? true}})

(defwebcomponent ex-methods
  :methods {:method (fn [] {:key "value"})})

(defwebcomponent ex-extend
  :host :div
  :document [:span {:class "fa fa-exclamation"} [:content]])

(defwebcomponent ex-extend-with-attributes
  :host [:div {:type "button"}])

(def default
  {:document [:div "Hello reuse!"]
   :properties {:property "value"}})

(defwebcomponent ex-reuse
  [value]
  default
  :properties {:threshold value})

(defn ^:export register-all
  []
  (register ex-hello)
  (register ex-lifecycle)
  (register ex-document-hiccup)
  (register ex-style)
  (register ex-style-garden)
  (register ex-style-media-queries)
  (register ex-properties)
  (register ex-methods)
  (register ex-extend)
  (register ex-extend-with-attributes)
  (register (ex-reuse 15))

  (register lucu-range-with-threshold)
  (register lucu-overlay)
  (register lucu-flipbox)
  (register lucu-example)
  (register lucu-usage))
