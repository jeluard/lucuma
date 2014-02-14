(ns lucuma.shadow-dom)

(defn ^:export supported?
  "Returns true if current platform supports Shadow DOM."
  []
  (exists? (.-createShadowRoot (.createElement js/document "div"))))

(defn shadow-roots
  "Returns all ShadowRoot of an element, from most recent to oldest."
  ([el]
   (when el
     (when-let [sr (.-shadowRoot el)]
       (cons sr (shadow-roots el sr)))))
  ([el sr]
   (when (and el sr)
     (when-let [osr (.-olderShadowRoot sr)]
       (cons osr (lazy-seq (shadow-roots el osr)))))))

;; Chrome tests: https://chromium.googlesource.com/chromium/blink/+/master/LayoutTests/fast/dom/shadow/
;; W3C tests: https://github.com/w3c/web-platform-tests/tree/master/shadow-dom
