(ns lucuma.polymer
  (:require [lucuma.custom-elements :as ce]
            [lucuma.shadow-dom :as sd]))

(defn custom-element-polyfilled?
  "Returns true if current Custom Element support is polyfilled."
  []
  (and
    (ce/supported?)
    true));; TODO find a way to detect polyfill support

(defn shadow-dom-polyfilled?
  "Returns true if current ShadowDOM support is polyfilled."
  []
  (and
    (sd/supported?)
    (not (exists? (.-createShadowRoot js/document.documentElement)))))

(defn shadow-css-needed?
  "Returns true if Shadow CSS polyfill is installed in current platform."
  []
  (and (exists? js/Platform) (exists? js/Platform.ShadowCSS)))

;; Disabled for now as there are some additionals constrains
;; http://www.polymer-project.org/docs/polymer/styling.html#strictstyling
(when (shadow-css-needed?)
  (set! (.-strictStyling js/Platform.ShadowCSS) false))

(defn shim-styling!
  "Ensures styles do not leak when using polymer polyfill.

  See:
   * https://github.com/Polymer/ShadowDOM/issues/260
   * https://github.com/Polymer/platform-dev/blob/master/src/ShadowCSS.js"
  [sr n base-type]
  (if base-type
    (.shimStyling js/Platform.ShadowCSS sr n (name base-type))
    (.shimStyling js/Platform.ShadowCSS sr n)))
