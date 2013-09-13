(ns lucuma.examples
  (:require [lucuma.custom-elements :refer [register render-content]]
            [lucuma.overlay :refer [lucu-overlay]]
            [lucuma.range-with-threshold :refer [lucu-range-with-threshold]])
  (:require-macros [lucuma :refer [defwebcomponent]]
                   [dommy.macros :refer [node]]))

(defwebcomponent ex-hello
  :content "Hello world!")

(defwebcomponent ex-lifecycle
  :created-fn #(.log js/console  (str % " has been created"))
  :entered-document-fn #(.log js/console  (str % " has been inserted in the document"))
  :left-document-fn #(.log js/console % " (str has been removed from the document"))

(defwebcomponent ex-content-template
  :content (dommy.macros/sel1 :#template-id))

(derive PersistentVector ::vector)
(defmethod render-content ::vector [v] (node v))

(defwebcomponent ex-content-hiccup
  :content [:div "Hello hiccup!"])

(defwebcomponent ex-style
  :content "<div>Hello styled!</div>"
  :style "div { background: green; }")

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
