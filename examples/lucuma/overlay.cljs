(ns lucuma.overlay
  (:require [lucuma.event :refer [fire]]
            [dommy.core :as dommy])
  (:require-macros [lucuma :refer [defwebcomponent]]
                   [dommy.macros :refer [sel1]]))

(def style
       "body {
          overflow: visible;
          overflow-y: scroll;
        }
        .overlay-backdrop-active body {
          overflow: hidden;
        }

        .b-overlay-backdrop {
          background-color: rgba(252, 252, 252, 0.7);
          -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr=#B3FCFCFC, endColorstr=#B3FCFCFC)\";
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 998;
          overflow-x: auto;
          overflow-y: scroll;
          display: none;
        }

        .b-overlay-backdrop-close {
          color: #aaa;
          font-size: 30px;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 0;
          position: fixed;
          top: 10px;
          right: 10px;
          cursor: pointer;
        }

        .b-overlay-body {
          border: 1px solid #cccccc;
          z-index: 999;
          -moz-box-shadow: -1px 1px 1px rgba(0,0,0,.2);
          -webkit-box-shadow: 0 2px 4px rgba(0,0,0,.2);
          box-shadow: 0 2px 4px rgba(0,0,0,.2);
          background: #ffffff;
          position: static;
          margin: 60px auto;
          padding: 60px;
        }")

(defn shadow-root
  [el]
  (.firstChild el))

(defn display!
  [el t]
  (doto el (-> .-style .-display (set! t))))

(defn backdrop
  [el]
  (sel1 (shadow-root el) :.q-b-overlay-backdrop))

(defn show
  [el]
  (display! (backdrop el) "block")
  (dommy/add-class! (sel1 :html) :overlay-backdrop-active)
  (fire el "show"))

(defn hide
  [el]
  (display! (backdrop el) "none")
  (fire el "hide"))

(defwebcomponent lucu-overlay

  :content [:div {:class ["b-overlay-backdrop" "q-b-overlay-backdrop"]}
            [:div {:class ["b-overlay-backdrop-close" "q-b-overlay-backdrop-close"] :title "Press ESC to close"} "x"]
            [:div {:class ["b-overlay-body" "q-overlay"]} [:content]]]
  :style style)
