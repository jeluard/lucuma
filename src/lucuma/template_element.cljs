(ns lucuma.template-element)

(defn ^:export supported?
  "Returns true if current platform support Template Element."
  []
  (exists? js/HTMLTemplateElement))
