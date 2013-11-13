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
  :content "Hello world!")

(register ex-hello)

;; Name can be explicitely provided.
(register (merge ex-hello {:name "my-hello-with-custom-name"}))

;; Append a 'ex-hello' node to body.
(.appendChild js/document.body (.createElement js/document "ex-hello"))

;; Alternatively using hiccup syntax and dommy.
(dommy/append! (dommy/sel1 :body) [:ex-hello])
)

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
  :content [:span "Hello styled!"]
  :style "span { background: blue; color: white; border: 0; border-radius: 4px;}")

(defmethod render-style ::vector [v] (css v))

(defwebcomponent ex-style-garden
  :content [:span "Hello garden!"]
  :style [:span {:background "#3d7c45" :color "white" :border 0 :border-radius (px 4)}])

(defwebcomponent ex-style-scope
  :content [:span {:class "fa fa-exclamation"} "Hello style scope!"]
  :apply-author-styles true)

(defwebcomponent ex-attributes
  :attributes #{:attribute})

(defn alert
  [el]
  (.alert js/window  (str "Hello methods from '" (.-id el) "' !")))

(defwebcomponent ex-methods
  :methods {:method alert})

(defn ^:export fire-event
  [id]
  (fire (sel1 (keyword id)) :event {:msg "Sent from CLJS"}))

(defwebcomponent ex-events
  :handlers #{:event})

(defwebcomponent ex-constructor
  :constructor "CustomConstructor"
  :content [:div "Hello constructor!"])

(defwebcomponent ex-extend
  :base-type :div
  :content [:span {:class "fa fa-exclamation"} [:content]]
  :apply-author-styles true)

(defn ^:export register-all
  []
  (register ex-hello)
  (register (merge ex-hello {:name "my-hello-with-custom-name"}))
  (register ex-lifecycle)
  (register ex-content-template)
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
