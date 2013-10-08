(ns lucuma.event)

(defn create-event
  [n m bubbles cancelable]
  (if (and (empty? m) (not bubbles) (not cancelable))
    (js/CustomEvent. (name n))
    (js/CustomEvent. (name n) (clj->js {:bubbles bubbles :cancelable cancelable :detail m}))))

(defn fire
  ([el n] (fire el n {}))
  ([el n m] (fire el n m false false))
  ([el n m bubbles cancelable] (.dispatchEvent el (create-event n m bubbles cancelable))))
