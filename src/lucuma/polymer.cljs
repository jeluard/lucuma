(ns lucuma.polymer)

(defn ^:export shadow-dom-installed?
  "Returns true if Shadow DOM polyfill is installed in current platform."
  []
  (= "polyfill" js/Platform.flags.shadow))

(defn ^:export shadow-css-installed?
  "Returns true if Shadow CSS polyfill is installed in current platform."
  []
  (exists? js/Platform.ShadowCSS))

(defn shim-styling-when-needed
  "Make sure styles do not leak when using polymer polyfill.
  See https://github.com/Polymer/ShadowDOM/issues/260."
  [sr n base-type]
  (when (shadow-css-installed?)
    (if base-type
      (.shimStyling js/Platform.ShadowCSS sr n (name base-type))
      (.shimStyling js/Platform.ShadowCSS sr n))))
