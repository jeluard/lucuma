(ns lucuma.custom-elements
  (:require [lucuma.attribute :as att]
            [lucuma.util :as u]))

(def ^:private forbidden-names #{"annotation-xml" "color-profile" "font-face" "font-face-src" "font-face-uri" "font-face-format" "font-face-name" "missing-glyph"})

(defn valid-name?
  "return true if provided name is a valid Custom Element name"
  [s]
  (when s
    (and (not= -1 (.indexOf s "-"))
         (not (contains? forbidden-names s)))))

(defn find-prototype
  [t]
  (if t
    (.getPrototypeOf js/Object (.createElement js/document t))
    (.-prototype js/HTMLElement)))

(defn- create-prototype
  "create a Custom Element prototype from a map definition"
  [m]
  (let [{:keys [prototype properties created-fn entered-view-fn left-view-fn attribute-changed-fn]} m
        properties (att/properties properties)
        prototype (if (seq properties) (.create js/Object prototype (clj->js properties)) (.create js/Object prototype))]
    (when created-fn (set! (.-createdCallback prototype) (u/wrap-with-callback-this-value created-fn)))
    (when entered-view-fn (set! (.-enteredViewCallback prototype) (u/wrap-with-callback-this-value entered-view-fn)))
    (when left-view-fn (set! (.-leftViewCallback prototype) (u/wrap-with-callback-this-value left-view-fn)))
    (when attribute-changed-fn (set! (.-attributeChangedCallback prototype) (u/wrap-with-callback-this-value attribute-changed-fn)))
    prototype))

(defn register
  "register a Custom Element from an abstract definition"
  [n p extends]
  {:pre [(valid-name? n)]}
  (.register js/document n (clj->js (merge {:prototype p} (when extends {:extends extends})))))

;; chrome tests: https://chromium.googlesource.com/chromium/blink/+/master/LayoutTests/fast/dom/custom/
;; https://github.com/w3c/web-platform-tests
