(ns lucuma.example
  (:require [clojure.string :as str]
            [cljs.reader :refer [read-string]]
            [lucuma :refer [shadow-root]]
            [lucuma.attribute :as attr]
            [lucuma.polymer :as p]
            [dommy.core :refer [set-value!]]
            [garden.stylesheet :refer [at-media]]
            [garden.units :refer [px]])
  (:require-macros [lucuma :refer [defwebcomponent]]
                   [dommy.macros :refer [sel1]]))

(defn header
  [s]
  {:content (str "'" (str/upper-case s) "'") :font-size (px 12) :font-weight :bold :letter-spacing (px 1)
   :position :absolute :top (px 15) :left (px 15) :color "#bbb"})

(def source
  {:position :relative :padding [[(px 45) (px 15) (px 15)]] :margin 0 :max-height (px 300)
   :background-color "#fafafa" :border-radius 0 :border-width 0})

(def style
  [[(keyword "pre[class*='language-']") {:margin 0}]
   [(keyword "code[class*='language-']") {:margin 0 :padding 0}]
   [:.example-live {:position :relative :padding [[(px 40) 0 (px 10) (px 15)]] :margin-left 0 :margin-right 0
                    :background-color "#fff"
                    :border-color "#ddd" :border-style :solid :border-width (px 1) :border-radius [[(px 4) (px 4) 0 0]]}
    [:&:after (header "live")]]
   [:.example-markup source
    [:&:after (header "html")]]
   [:.example-cljs (merge source {:border-radius [[0 0 (px 4) (px 4)]]})
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

(def bootstrap-style (.createElement js/document "style"))
(fetch "http://netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css"
       (fn [s]
         (set! (.-textContent bootstrap-style) s)))

(def prism-style (.createElement js/document "style"))
(fetch "assets/prism.css"
       (fn [s]
         (set! (.-textContent prism-style) s)))

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
  (let [m (sel1 (shadow-root el) :.language-markup)]
    (set! (.-innerHTML m) (create-markup el))
    (js/Prism.highlightElement m)))

(defn set-source!
  [el s]
  (let [m (sel1 (shadow-root el) :.language-clojure)]
    (set! (.-innerHTML m) s)
    (js/Prism.highlightElement m)))

(defn created-example
  [el]
  (set-markup! el)
  (register-mutation-observer el #(set-markup! el))
  (if-let [n (attr/get-attr el "file")]
    (fetch-source n #(set-source! el %))
    (.warn js/console "Failed to lookup 'name' attribute.")))

(def usages (atom {}))

(defn set-usages!
  [u m]
  (let [l (str/split-lines u)]
    (doseq [kv m]
      (let [k (key kv)
            v (val kv)]
        (set-source! k (str/join "\n" (subvec l (- (:from v) 1) (:to v))))))))

(defn as-int
  [s]
  (when s
    (let [i (read-string s)]
      (if (number? i)
        i
        (throw (ex-info "" {:value s}))))))

(defn created-usage
  [el]
  (set-markup! el)
  (register-mutation-observer el #(set-markup! el))
  (let [from (as-int (attr/get-attr el "line-from"))
        to (as-int (attr/get-attr el "line-to"))]
    (if (and (number? from) (number? to))
      (swap! usages assoc el {:from from :to to})
      (.warn js/console "Failed to lookup 'from' or 'to' attribute."))))

(def document
  (list [:div {:class "example-live"} [:content {:select "*"}]]
        [:pre {:class "example-markup"} [:code {:class "language-markup"}]]
        [:pre {:class "example-cljs"} [:code {:class "language-clojure"}]]))

(def base
  {:host :section
   :document document
   :style (list bootstrap-style prism-style style)})

(defwebcomponent lucu-example
  base
  :on-created created-example)

(defwebcomponent lucu-usage
  base
  :on-created created-usage)

;; TODO make more generic (i.e. also work without polymer)
(.addEventListener js/document "WebComponentsReady"
                   (fn [] (fetch-source "examples.cljs" #(set-usages! % @usages))))
