(ns lucuma.example
  (:require [clojure.string :as str]
            [cljs.reader :refer [read-string]]
            [lucuma.attribute :as attr]
            [lucuma.polymer :as p]
            [dommy.core :refer [set-value!]]
            [garden.stylesheet :refer [at-media]]
            [garden.units :refer [px]])
  (:require-macros [lucuma :refer [defwebcomponent]]
                   [dommy.macros :refer [sel1]]))

(defn header
  [s]
  {:content (str "'" (str/upper-case s) "'") :font-size (px 12) :font-weight "bold" :letter-spacing (px 1)
   :position "absolute" :top (px 15) :left (px 15) :color "#bbb"})

(def source
  {:position "relative" :padding "45px 15px 15px" :margin 0 :max-height (px 300)
   :background-color "#fafafa" :border-radius 0 :border-width 0})

(def style
  [[(keyword "pre[class*='language-']") {:margin 0}]
   [(keyword "code[class*='language-']") {:margin 0 :padding 0}]
   [:.example-live {:position "relative" :padding "40px 0 10px 15px" :margin 0 :background-color "#fafafa"
                    :border-color "#e5e5e5 #eee #eee" :border-style "solid" :border-width "1px 0"}
    [:&:after (header "live")]
    (at-media {:screen true :min-width (px 768)}
              [:& {:margin-left 0 :margin-right 0 :background-color "#fff" :box-shadow "none"
                   :border-width (px 1) :border-color "#ddd" :border-radius "4px 4px 0 0"}])]
   [:.example-markup source
    [:&:after (header "html")]]
   [:.example-cljs (merge source {:border-radius "0 0 4px 4px"})
    [:&:after (header "cljs")]]])

(def owner "jeluard")
(def repo "lucuma")

(defn sha-url [owner repo n] (str "https://api.github.com/repos/" owner "/" repo "/contents/examples/src/lucuma/" n))
(defn blob-url [owner repo n] (str "https://api.github.com/repos/" owner "/" repo "/git/blobs/" n))

(defn onsuccess
  [r f]
  (fn [] (when (and (= (.-readyState r) 4) (= (.-status r) 200))
           (f (js/JSON.parse (.-responseText r))))))

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
           (let [sha (aget json "sha")]
             (fetch (blob-url owner repo sha) #(f (js/window.atob (str/replace (aget % "content") "\n" ""))))))))

(defn escape-html
  [s]
  (-> (.createElement js/document "div")
      (.appendChild (.createTextNode js/document s))
      (.-parentNode)
      (.-innerHTML)))

(defn register-mutation-observer
  [el f]
  (let [el (if (p/installed?) (sel1 (.-shadowRoot el) :.example-live) el);; Bug?
        mo (js/MutationObserver. f)]
    (.observe mo el (clj->js {:attributes true :characterData true :subtree true}))))

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
  (let [m (sel1 (.-shadowRoot el) :.language-markup)]
    (set! (.-innerHTML m) (create-markup el))
    (js/Prism.highlightElement m)))

(defn set-source!
  [el s]
  (let [m (sel1 (.-shadowRoot el) :.language-clojure)]
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

(fetch-source "examples.cljs" #(set-usages! % @usages))

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

(defn content
  [el]
  (list [:div {:class "example-live"} [:content {:select "*"}]]
        [:pre {:class "example-markup"} [:code {:class "language-markup"}]]
        [:pre {:class "example-cljs"} [:code {:class "language-clojure"}]]))

(defwebcomponent lucu-example
  :base-type :section
  :content content
  :style style
  :apply-author-styles true
  :created-fn created-example)

(defwebcomponent lucu-usage
  :base-type :section
  :content content
  :style style
  :apply-author-styles true
  :created-fn created-usage)
