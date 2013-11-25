(ns lucuma.polymer)

(defn ^:export shadow-dom-installed?
  "Returns true if Shadow DOM polyfill is installed in current platform."
  []
  (= "polymer" js/Platform.flags.shadow))

(defn install-shadow-css-shim-when-needed
  "Make sure styles do not leak when using polymer polyfill.
  See https://github.com/Polymer/ShadowDOM/issues/260."
  [sr n base-type]
  (when js/Platform.ShadowCSS
    (if base-type
      (.shimStyling js/Platform.ShadowCSS sr n (name base-type))
      (.shimStyling js/Platform.ShadowCSS sr n))))
