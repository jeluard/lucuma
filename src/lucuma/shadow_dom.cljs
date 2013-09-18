(ns lucuma.shadow-dom)

;;http://html5-demos.appspot.com/static/shadowdom-visualizer/index.html
;;http://updates.html5rocks.com/2013/03/Visualizing-Shadow-DOM-Concepts
;; chrome tests: https://chromium.googlesource.com/chromium/blink/+/master/LayoutTests/fast/dom/shadow/

(defn create
  [el reset-style-inheritance apply-author-styles]
  (let [sr (.createShadowRoot el)]
    (when reset-style-inheritance (aset sr "resetStyleInheritance" true))
    (when apply-author-styles (aset sr "applyAuthorStyles" true))
    sr))
