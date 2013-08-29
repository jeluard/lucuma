(ns lucuma.event)

(defn create-event
  [n m can-bubble cancelable]
  (let [ev (.createEvent js/document "CustomEvent")]
    (.initCustomEvent ev n can-bubble cancelable (clj->js m))))

(defn fire
  ([el n m] (fire el n m false false))
  ([el n m can-bubble cancelable] (.dispatchEvent el (create-event n m can-bubble cancelable))))
