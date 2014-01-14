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
  (let [{:keys [prototype properties on-created on-attribute-changed on-attached on-detached]} m
        ce-prototype (if (seq properties) (.create js/Object prototype (clj->js (att/properties properties))) (.create js/Object prototype))]
    (when on-created (set! (.-createdCallback ce-prototype) (u/wrap-with-callback-this-value on-created)))
    (when on-attached (set! (.-attachedCallback ce-prototype) (u/wrap-with-callback-this-value on-attached)))
    (when on-detached (set! (.-detachedCallback ce-prototype) (u/wrap-with-callback-this-value on-detached)))
    (when on-attribute-changed (set! (.-attributeChangedCallback ce-prototype) (u/wrap-with-callback-this-value on-attribute-changed)))
    ce-prototype))

(defn register
  "Registers a Custom Element from an abstract definition."
  [n p e]
  {:pre [(valid-name? n)]}
  (.registerElement js/document n (clj->js (merge {:prototype p} (when e {:extends e})))))

;; chrome tests: https://chromium.googlesource.com/chromium/blink/+/master/LayoutTests/fast/dom/custom/
;; https://github.com/w3c/web-platform-tests
