(ns lucuma.overlay
  (:require [lucuma.event :refer [fire]]
            [dommy.core :as dommy]
            [garden.color :refer [rgba]]
            [garden.units :refer [px]])
  (:require-macros [lucuma :refer [defwebcomponent]]
                   [dommy.macros :refer [sel1]]))

(def style [[:body {:overflow "visible" :overflow-y "scroll"}]
            [:.overlay-backdrop-active [:body {:overflow "hidden"}]]
            [:.b-overlay-backdrop {:background-color (rgba 252 252 252 0.7) :position "fixed" :top 0 :left 0 :right 0 :bottom 0 :z-index 998
                                   :overflow-x "auto" :overflow-y "scroll" :display "none"}]
            [:.b-overlay-backdrop-close {:color "#aaa" :font-size (px 30) :width (px 30) :height (px 30) :text-align "center" :border "0" :position "fixed"
                                         :top (px 10) :right (px 10) :cursor "pointer"}]
            [:.b-overlay-body {:border "1px solid #cccccc" :z-index 999 :-moz-box-shadow "-1px 1px 1px rgba(0,0,0,.2)" :-webkit-box-shadow "0 2px 4px rgba(0,0,0,.2)"
                               :box-shadow "0 2px 4px rgba(0, 0, 0,.2)" :background "#ffffff" :position "static" :margin "60px auto" :padding (px 60)}]
            [:.q-overlay {:width (px 600)}]])

(defn- display! [el t] (aset el "style" "display" t))

(defn- backdrop [el] (.querySelector (.-shadowRoot el)  ".q-b-overlay-backdrop"))

(defn hide
  [el]
  (display! (backdrop el) "none")
  (fire el "hide"))

(defn show
  [el]
  (display! (backdrop el) "block")
  (dommy/add-class! (sel1 :html) :overlay-backdrop-active)
  (.addEventListener el "click" #(hide el))
  (fire el "show"))

(defwebcomponent lucu-overlay
  :content [:div {:class "b-overlay-backdrop q-b-overlay-backdrop"}
            [:div {:class "b-overlay-backdrop-close q-b-overlay-backdrop-close" :title "Press ESC to close"} "x"]
            [:div {:class "b-overlay-body q-overlay"} [:content]]]
  :style style
  :methods {:show show :hide hide})
