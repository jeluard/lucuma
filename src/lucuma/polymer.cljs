(ns lucuma.polymer)

(defn ^:export installed?
  "Returns true if polymer polyfill is installed in current platform."
  []
  (exists? js/ShadowDOMPolyfill))

(defn install-shadow-css-shim-when-needed
  "Make sure styles do not leak when using polymer polyfill.
  See https://github.com/Polymer/ShadowDOM/issues/260."
  [sr n base-type]
  (when js/ShadowDOMPolyfill
    (if base-type
      (.shimStyling js/Platform.ShadowCSS sr n (name base-type))
      (.shimStyling js/Platform.ShadowCSS sr n))))
