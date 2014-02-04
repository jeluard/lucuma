(ns lucuma.shadow-dom)

(defn ^:export supported?
  "Returns true if current platform supports Shadow DOM."
  []
  (exists? (.-createShadowRoot (.createElement js/document "div"))))

(defn create
  "Creates (and implicitely appends) a ShadowRoot to an element."
  ([el] (create el {}))
  ([el m]
   (let [{:keys [reset-style-inheritance]} m
         sr (.createShadowRoot el)]
     (when reset-style-inheritance (set! (.-resetStyleInheritance sr) reset-style-inheritance))
     sr)))

;; Chrome tests: https://chromium.googlesource.com/chromium/blink/+/master/LayoutTests/fast/dom/shadow/
;; W3C tests: https://github.com/w3c/web-platform-tests/tree/master/shadow-dom
