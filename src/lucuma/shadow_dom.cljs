(ns lucuma.shadow-dom)

(defn create
  ([el] (create el {}))
  ([el m]
   (let [{:keys [apply-author-styles reset-style-inheritance]} m
         sr (.createShadowRoot el)]
     (when apply-author-styles (set! (.-applyAuthorStyles sr) apply-author-styles))
     (when reset-style-inheritance (set! (.-resetStyleInheritance sr) reset-style-inheritance))
     sr)))

;; Chrome tests: https://chromium.googlesource.com/chromium/blink/+/master/LayoutTests/fast/dom/shadow/
;; W3C tests: https://github.com/w3c/web-platform-tests/tree/master/shadow-dom