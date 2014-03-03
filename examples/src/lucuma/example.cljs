(ns lucuma.example
  (:require [clojure.string :as str]
            [lucuma :as l :refer-macros [defwebcomponent]]
            [lucuma.polymer :as p]
            [garden.stylesheet :refer [at-import]]
            [garden.units :refer [px]])
  (:require-macros [dommy.macros :refer [sel1]]))

(defn header
  [s]
  {:content (str "'" (str/upper-case s) "'") :font-size (px 12) :font-weight :bold :letter-spacing (px 1)
   :position :absolute :top (px 15) :left (px 15) :color "#bbb"})

(def source
  {:position :relative :padding [[(px 45) (px 15) (px 15)]] :margin 0 :max-height (px 300)
   :background-color "#fafafa" :border-radius 0 :border-width 0})

(def style
  [[:.example-live {:position :relative :padding [[(px 40) 0 (px 10) (px 15)]] :margin-left 0 :margin-right 0
                    :background-color "#fff"
                    :border-color "#ddd" :border-style :solid :border-width (px 1) :border-radius [[(px 4) (px 4) 0 0]]}
    [:&:after (header "live")]]
   [(keyword "pre[class*='language-'].example-markup") source
    [:&:after (header "html")]]
   [(keyword "pre[class*='language-'].example-cljs") (merge source {:border-radius [[0 0 (px 4) (px 4)]]})
    [:&:after (header "cljs")]
    [:code {:overflow-wrap :normal}]]])

(def owner "jeluard")
(def repo "lucuma")

(defn sha-url [owner repo n] (str "https://api.github.com/repos/" owner "/" repo "/contents/examples/src/lucuma/" n))
(defn blob-url [owner repo n] (str "https://api.github.com/repos/" owner "/" repo "/git/blobs/" n))

(defn onsuccess
  [r f]
  (fn [] (when (and (= (.-readyState r) 4) (= (.-status r) 200))
           (f (.-responseText r)))))

(defn fetch
  [url f]
  (let [r (js/XMLHttpRequest.)]
    (set! (.-onreadystatechange r)
          (onsuccess r f))
    (.open r "GET" url true)
    (.send r nil)))

(defn fetch-source
  [n f]
  (fetch (sha-url owner repo n)
         (fn [json]
           (let [sha (aget (js/JSON.parse json) "sha")]
             (fetch (blob-url owner repo sha) #(f (js/window.atob (str/replace (aget (js/JSON.parse %) "content") "\n" ""))))))))

(defn escape-html
  [s]
  (-> (.createElement js/document "div")
      (.appendChild (.createTextNode js/document s))
      (.-parentNode)
      (.-innerHTML)))

(defn register-mutation-observer
  [el f]
  (let [mo (js/MutationObserver. f)]
    (.observe mo el (clj->js {:attributes true :characterData true :subtree true :childList true}))))

(defn first-meaningful-line
  [ls]
  (loop [ls ls]
    (let [l (first ls)]
      (if (empty? (str/trim l))
        (recur (rest ls))
        l))))

(defn count-spaces
  [s]
  (loop [c 0
         l (first-meaningful-line (str/split-lines s))]
    (if (and (not (empty? l)) (= " " (.charAt l 0)))
      (recur (inc c) (.substr l 1))
      c)))

(defn normalized-content
  [s]
  (let [c (count-spaces s)]
    (if (> c 4)
      (-> s
          (str/replace (re-pattern (str "[ ]{" c "}")) "")
          (str/replace (re-pattern (str "[ ]{" (- c 2) "}")) ""))
      s)))

(defn create-markup
  [el]
  (normalized-content (escape-html (str/replace-first (.-innerHTML el) "\n" ""))))

(defn set-markup!
  [el]
  (let [m (sel1 (l/shadow-root el) :.language-markup)]
    (set! (.-innerHTML m) (create-markup el))
    (js/Prism.highlightElement m)))

(defn set-source!
  [el s]
  (let [m (sel1 (l/shadow-root el) :.language-clojure)]
    (set! (.-innerHTML m) s)
    (js/Prism.highlightElement m)))

(defn created-example
  [el]
  (set-markup! el)
  (register-mutation-observer el #(set-markup! el))
  (if-let [n (l/get-property el :file)]
    (fetch-source n #(set-source! el %))
    (.warn js/console "Failed to lookup 'file' attribute.")))

(def usages (atom {}))

(defn set-usages!
  [u m]
  (let [l (str/split-lines u)]
    (doseq [kv m]
      (let [k (key kv)
            v (val kv)]
        (set-source! k (str/join "\n" (subvec l (- (:from v) 1) (:to v))))))))

(defn created-usage
  [el]
  (set-markup! el)
  (register-mutation-observer el #(set-markup! el))
  (let [from (l/get-property el :line_from)
        to (l/get-property el :line_to)]
    (if (and (number? from) (number? to))
      (swap! usages assoc el {:from from :to to})
      (.warn js/console "Failed to lookup 'line_from' or 'line_to' attribute."))))

(def document
  (list [:div {:class "example-live"} [:content {:select "*"}]]
        [:pre {:class "example-markup"} [:code {:class "language-markup"}]]
        [:pre {:class "example-cljs"} [:code {:class "language-clojure"}]]))

(def base
  {:host :section
   :document document
   :style (list
           ;; Workaround https://github.com/Polymer/polymer-dev/issues/7
           (when-not (p/shadow-css-needed?)
             [(at-import "http://netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css")
              (at-import "assets/prism.css")])
           style)})

(defwebcomponent lucu-example
  base
  :on-created created-example
  :properties {:file ""})

(defwebcomponent lucu-usage
  base
  :on-created created-usage
  :properties {:line_from {:default nil :type :number}
               :line_to {:default nil :type :number}})

(.addEventListener js/document "DOMContentLoaded"
                   (fn [] (fetch-source "usages.cljs" #(set-usages! % @usages))))
