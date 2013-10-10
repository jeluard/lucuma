(ns lucuma.examples
  (:require [lucuma :refer [register render-content render-style]]
            [lucuma.event :refer [fire]]
            [lucuma.range-with-threshold :refer [lucu-range-with-threshold]]
            [lucuma.overlay :refer [lucu-overlay]]
            [lucuma.flipbox :refer [lucu-flipbox]]
            [dommy.core :refer [prepend!]]
            [garden.core :refer [css]])
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
  :content [:button "Hello styled!"]
  :style "button { background: blue; color: white; border: 0; border-radius: 4px;}")

(defmethod render-style ::vector [v] (css v))

(defwebcomponent ex-style-garden
  :content [:button "Hello garden!"]
  :style [:button {:background "#3d7c45" :color "white" :border 0 :border-radius "4px"}])

(defwebcomponent ex-style-scope
  :content [:span {:class "icon-exclamation-sign"} "Hello style scope!"]
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
  :base-type "button"
  :content [:span {:class "icon-exclamation-sign"} [:content]]
  :style [:button {:color "red"}]
  :apply-author-styles true)

(defn ^:export register-all
  []
  (register ex-hello)
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
  (register lucu-flipbox))
