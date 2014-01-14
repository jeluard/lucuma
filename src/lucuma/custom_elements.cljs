(ns lucuma.custom-elements
  (:require [lucuma.attribute :as att]
            [lucuma.util :as u]))

(def ^:private forbidden-names #{"annotation-xml" "color-profile" "font-face" "font-face-src" "font-face-uri" "font-face-format" "font-face-name" "missing-glyph"})

(defn ^:export supported?
  "Returns true if current platform support Custom Elements."
  []
  (exists? (.-createElement js/document)))

(defn valid-name?
  "Returns true if provided name is a valid Custom Element name."
  [s]
  (when s
    (and (not= -1 (.indexOf s "-"))
         (not (contains? forbidden-names s)))))

(defn- create-prototype
  "Creates a Custom Element prototype from a map definition."
  [m]
  (let [{:keys [prototype properties created-fn entered-view-fn attached-fn detached-fn]} m
        ce-prototype (if (seq properties) (.create js/Object prototype (clj->js (att/properties properties))) (.create js/Object prototype))]
    (when created-fn (set! (.-createdCallback ce-prototype) (u/wrap-with-callback-this-value created-fn)))
    (when entered-view-fn (set! (.-enteredViewCallback ce-prototype) (u/wrap-with-callback-this-value entered-view-fn)))
    (when attached-fn (set! (.-detachedCallback ce-prototype) (u/wrap-with-callback-this-value attached-fn)))
    (when detached-fn (set! (.-attachedCallback ce-prototype) (u/wrap-with-callback-this-value detached-fn)))
    ce-prototype))

(defn register
  "Registers a Custom Element from an abstract definition."
  [n p e]
  {:pre [(valid-name? n)]}
  (.registerElement js/document n (clj->js (merge {:prototype p} (when e {:extends e})))))

;; chrome tests: https://chromium.googlesource.com/chromium/blink/+/master/LayoutTests/fast/dom/custom/
;; https://github.com/w3c/web-platform-tests
