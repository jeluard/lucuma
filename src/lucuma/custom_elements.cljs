(ns lucuma.custom-elements
  (:require [lucuma.util :as u]))

(def ^:private forbidden-names #{"annotation-xml" "color-profile" "font-face" "font-face-src" "font-face-uri" "font-face-format" "font-face-name" "missing-glyph"})

(defn ^:export supported?
  "Returns true if current platform support Custom Elements."
  []
  (exists? (.-registerElement js/document)))

(defn valid-name?
  "Returns true if provided name is a valid Custom Element name."
  [s]
  (when s
    (and (not= -1 (.indexOf s "-"))
         (not (contains? forbidden-names s)))))

(defn- install-callback
  [p c n]
  (when c
    (aset p n (u/wrap-with-callback-this-value c))))

(defn- create-prototype
  "Creates a Custom Element prototype from a map definition."
  [{:keys [prototype properties on-created on-attribute-changed on-attached on-detached]}]
  (let [ce-prototype (if (seq properties)
                       (.create js/Object prototype (clj->js properties))
                       (.create js/Object prototype))]
    (install-callback ce-prototype on-created "createdCallback")
    (install-callback ce-prototype on-attached "attachedCallback")
    (install-callback ce-prototype on-detached "detachedCallback")
    (install-callback ce-prototype on-attribute-changed "attributeChangedCallback")
    ce-prototype))

(defn register
  "Registers a Custom Element from an abstract definition."
  [n p e]
  {:pre [(valid-name? n)]}
  (.registerElement js/document n (clj->js (merge {:prototype p} (when e {:extends e})))))

;; Chrome tests: https://chromium.googlesource.com/chromium/blink/+/master/LayoutTests/fast/dom/custom/
;; W3C tests: https://github.com/w3c/web-platform-tests
