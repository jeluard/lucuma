(ns lucuma.polymer)

(defn shadow-dom-installed?
  "Returns true if Shadow DOM polyfill is installed in current platform."
  []
  (= "polyfill" js/Platform.flags.shadow))

(defn shadow-css-installed?
  "Returns true if Shadow CSS polyfill is installed in current platform."
  []
  (exists? js/Platform.ShadowCSS))

(when (shadow-dom-installed?)
  (set! (.-strictStyling js/Platform.ShadowCSS) true))

(defn shim-styling-when-needed
  "Ensures styles do not leak when using polymer polyfill.

  See:
   * https://github.com/Polymer/ShadowDOM/issues/260
   * https://github.com/Polymer/platform-dev/blob/master/src/ShadowCSS.js"
  [sr n base-type]
  (when (shadow-css-installed?)
    (if base-type
      (.shimStyling js/Platform.ShadowCSS sr n (name base-type))
      (.shimStyling js/Platform.ShadowCSS sr n))))
