(ns lucuma.example
  (:require-macros [lucuma :refer [defwebcomponent]]))

(def ^:private live [:div {:class "example-live"} [:content {:select ".example-live"}]])

(defn- markup
  [s]
  [:pre {:class "example-markup"} [:code {:class "language-markup"} s]])

(defn- cljs
  [s]
  [:pre {:class "example-cljs"} [:code {:class "language-clojure"} s]])

(defwebcomponent lucu-example
  :content [[:div {:class "example-live"} [:content {:select ".example-live"}]]
            [:pre {:class "example-markup"} [:code {:class "language-markup"}]]
            [:pre {:class "example-cljs"} [:code {:class "language-clojure"}]]])