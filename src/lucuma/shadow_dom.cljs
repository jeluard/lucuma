(ns lucuma.shadow-dom)

;;http://www.w3.org/TR/shadow-dom/
;;ShadowRoot.olderShadowRoot
;;http://html5-demos.appspot.com/static/shadowdom-visualizer/index.html
;;http://updates.html5rocks.com/2013/03/Visualizing-Shadow-DOM-Concepts

(defn create
  [e reset-style-inheritance apply-author-styles]
  (let [sr (.createShadowRoot e)]
    (when reset-style-inheritance (aset sr "resetStyleInheritance" true))
    (when apply-author-styles (aset sr "applyAuthorStyles" true))
    sr))

