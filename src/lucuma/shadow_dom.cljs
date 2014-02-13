(ns lucuma.shadow-dom)

(defn ^:export supported?
  "Returns true if current platform supports Shadow DOM."
  []
  (exists? (.-createShadowRoot (.createElement js/document "div"))))

;; Chrome tests: https://chromium.googlesource.com/chromium/blink/+/master/LayoutTests/fast/dom/shadow/
;; W3C tests: https://github.com/w3c/web-platform-tests/tree/master/shadow-dom
