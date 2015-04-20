(ns lucuma.core
  (:require [clojure.string :as string]
            [lucuma.attribute :as att]
            [lucuma.custom-elements :as ce]
            [lucuma.event :as e]
            [lucuma.shadow-dom :as sd]
            [lucuma.util :as u])
  (:refer-clojure :exclude [methods]))

; Property access

(def ^:private registry (atom {}))

(def ^:private lucuma-properties-holder-name "lucuma")
(def ^:private properties-holder-name "properties")

(defn- install-lucuma-properties-holder! [p] (aset p lucuma-properties-holder-name #js {}))

(defn- set-lucuma-property! [el n v] (aset el lucuma-properties-holder-name n v))

(defn- element? [el] (instance? js/Element el))

(defn element-name
  "Returns an element name. Supports both custom and regular element."
  [el]
  (if (element? el)
    (keyword (or (.getAttribute el "is") (string/lower-case (.-tagName el))))))

(defn get-definition
  "Returns the definition for an element type."
  [s]
  (if s
    (get @registry (name s))))

(defn registered?
  "Returns true if type is already registered."
  [s]
  (contains? @registry (name s)))

(defn lucuma-element?
  "Returns true if element is a Lucuma element."
  [el]
  (if el
    (exists? (aget el lucuma-properties-holder-name))))

(defn- install-properties-holder! [p] (set-lucuma-property! p properties-holder-name #js {}))

(defn get-property
  "Gets the value of a named property."
  [el k]
  (if (lucuma-element? el)
    (aget el lucuma-properties-holder-name properties-holder-name (name k))))

(defn get-properties
  "Returns a map of all properties associated to their values."
  [el]
  (into {} (if (lucuma-element? el)
             (for [s (.keys js/Object (aget el lucuma-properties-holder-name properties-holder-name))
                   :let [k (keyword s)]]
               [k (get-property el k)]))))

(defn- prototype [m] (or (:prototype m) (:extends m)))

(defn- val-or-default [os k d] (let [v (k os)] (if (not (nil? v)) v d)))
(defn- type-not-one-of? [os st] (not-any? st [(:type os)]))
(defn- property-definition-attributes? [os] (val-or-default os :attributes? (type-not-one-of? os #{:object})))
(defn- property-definition-events? [os] (val-or-default os :events? true))

(defn- infer-type-from-value
  "Returns inferred type from ClojureScript value."
  [o]
  (if-not (nil? o)
    (cond
      (number? o) :number
      (string? o) :string
      (or (true? o) (false? o)) :boolean
      (keyword? o) :keyword
      :else :object)
    :object))

(defn- call-callback-when-defined
  [ds k el & args]
  (doseq [d ds]
    (if-let [f (k d)]
      (u/call-with-first-argument f el args))))

(defn- definition-chains
  [m]
  (if m
    (cons m (definition-chains (get-definition (prototype m))))
    (list)))

(defn- aggregated-properties
  [el]
  (apply merge (map :properties (definition-chains (get-definition (element-name el))))))

(defn set-properties!
  "Sets all properties."
  ([el m] (set-properties! el m (aggregated-properties el) true false))
  ([el m ps consider-attributes? initialization?]
    (if (lucuma-element? el)
      (let [pv (get-properties el)]
        (doseq [[k v] m
                :let [os (k ps)]]
          (let [et (:type os)]
            (if (and (not (nil? v)) (not (= et (infer-type-from-value v))))
              (throw (ex-info (str "Expected value of type " et " but got " (infer-type-from-value v) " (<" v ">) for " k) {:property (name k)}))))
          (if (and consider-attributes? (property-definition-attributes? os))
            (att/set! el k v))
          (if (and initialization? (property-definition-events? os))
            (e/fire el k {:old-value (k pv) :new-value v}))
          (aset el lucuma-properties-holder-name properties-holder-name (name k) v))
        (if-not initialization?
          (let [ps (for [[k v] m] {:property k :old-value (k pv) :new-value v})]
            (call-callback-when-defined (definition-chains (get-definition (element-name el))) :on-changed el ps)))))))

(defn set-property!
  "Sets the value of a named property."
  ([el k v] (set-property! el (aggregated-properties el) k v true false))
  ([el os k v consider-attributes? initialization?]
    (set-properties! el {k v} os consider-attributes? initialization?)))

; ShadowRoot support

(def ^:private lucuma-shadow-root-property "lucuma")

(defn shadow-root
  "Returns lucuma ShadowRoot of element."
  ([el] (shadow-root el (element-name el)))
  ([el n]
   (if (and (lucuma-element? el) n)
     (some #(if (= (name n) (aget % lucuma-shadow-root-property)) %) (sd/shadow-roots el)))))

(defn host
  "Returns the host of an element inside a custom element, walking parents as needed; otherwise returns null."
  [el]
  (if el
    (if (or (lucuma-element? el) (exists? (.-host el)))
      (or (.-host el) el)
      (if-let [pel (.-parentNode el)] (recur pel)))))

(defn- create-shadow-root
  "Creates and appends a ShadowRoot."
  [el]
  (let [sr (.createShadowRoot el)]
    (aset sr lucuma-shadow-root-property (name (element-name el)))
    sr))

; Prototype creation

(defn- host-type->extends
  "Returns extended type from host element.

  e.g.
   :div => :div
   :lucu-element => nil (when lucu-element does not extend any element)
   :lucu-element => :div (when lucu-element extends div, recursively finds the root extended element)
   :non-lucu-element => throw exception"
  [t]
  (if t
    (if (u/valid-standard-element-name? (name t))
      t
      (if-let [m (get-definition t)]
        (host-type->extends (prototype m))
        (throw (ex-info (str "Could not infer extends for <" (name t) ">") {}))))))

(defn- create-element
  [extends]
  (let [n (name extends)
        e (host-type->extends extends)]
    (if (and e (not= extends e))
      (.createElement js/document (name e) n)
      (.createElement js/document n))))

(defn create-content-root
  [el requires-shadow-dom?]
  (if (and requires-shadow-dom? (not (sd/supported?)))
    (throw (ex-info "ShadowDOM not supported but required" {})))
  (if requires-shadow-dom?
    (create-shadow-root el)
    el))

(defn content-root
  [el]
  (or (shadow-root el) el))

(defn- install-document!
  [el d]
  (cond
    (element? d) (.appendChild el d)
    (string? d) (set! (.-innerHTML el) d)))

(defn- create-style-element
  "Creates a style element."
  [media title]
  (let [el (.createElement js/document "style")]
    (if media (set! (.-media el) media))
    (if title (set! (.-title el) title))
    el))

(defn- install-style!
  "Appends a new style element encapsulating redendered style."
  [el o]
  (let [{:keys [media title content]} (if (map? o) o {:content o})
        sel (create-style-element media title)]
    (set! (.-textContent sel) content)
    (.appendChild el sel)))

(defn property-values
  [ps as]
  (into {}
        (for [p ps]
          (let [[k os] p
                a (if (and (contains? as k) (property-definition-attributes? os))
                    (att/attribute->property [(:type os) (k as)]))]
            ; Matching attribute value overrides eventual default
            [k (or a (:default os))]))))

(defn- initialize-instance!
  "Initializes a custom element instance."
  [el {:keys [style document properties requires-shadow-dom?]}]
  ; Set default properties values
  (install-lucuma-properties-holder! el)
  (install-properties-holder! el)
  (let [ps (property-values properties (att/attributes el))]
    (set-properties! el ps (aggregated-properties el) true true)
    (if (or style document)
      (let [r (create-content-root el requires-shadow-dom?)]
        (if document
          (install-document! r document))
        (if style
          (install-style! r style))))))

(defn- merge-properties
  [p g s]
  (apply merge (map #(hash-map (keyword %) (att/property-definition (partial g (keyword %)) (partial s (keyword %))))
                    (map key p))))

(defn- attribute-changed
  "Updates property based on associated attribute change."
  [el k _ nv properties]
  (if-let [os (k properties)] ; Attribute changed is a property defined by our component
    (let [v (att/attribute->property [(:type os) nv])]
      (if (not= v (get-property el k)) ; Value is different from current value: this is not a change due to a property change
        (if (property-definition-attributes? os) ; Property is managed by lucuma
          (set-property! el properties k v false false)
          (u/warn (str "Changing attribute for " (name k) " but its attributes? is false.")))))))

(def ^:private default-element (.createElement js/document "div")) ; div does not define any extra property / method

(defn prototype-of
  [o]
  (cond
    (nil? o) (.-prototype js/HTMLElement)
    (keyword? o) (.getPrototypeOf js/Object (create-element o))
    :else o))

(defn- create-prototype
  "Creates a Custom Element prototype from a map definition."
  [{:keys [properties methods] :as m} prototype ds]
  (let [on-created #(doseq [d ds]
                     (initialize-instance! % d)
                     (if-let [f (:on-created d)]
                       (u/call-with-first-argument f %)))
        on-attribute-changed (fn [el a ov nv _]
                               (attribute-changed el (keyword a) ov nv properties))
        prototype (ce/create-prototype
                      (merge m {:prototype (prototype-of prototype)
                                :properties (merge-properties properties
                                                              #(clj->js (get-property %2 %1))
                                                              #(set-property! %2 %1 (js->clj %3)))
                                :on-created on-created :on-attribute-changed on-attribute-changed
                                ; Propagate through prototype chain
                                :on-attached #(call-callback-when-defined ds :on-attached %)
                                :on-detached #(call-callback-when-defined ds :on-detached %)}))]
    ; Install methods
    (doseq [[k v] methods]
      (aset prototype (name k) (u/wrap-with-callback-this-value (u/wrap-to-javascript v))))
    prototype))

(defn- validate-property-name!
  "Ensures a property name is valid."
  [el n]
  (if-not (u/valid-identifier? n)
    (throw (ex-info (str "Invalid property name <" n ">") {:property n})))
  (if (exists? (aget el n))
    (throw (ex-info (str "Property <" n "> is already defined") {:property n}))))

(defn validate-property-definition!
  "Ensures a property definition is sound. Throws a js/Error if not.
   Returns a map definition of the input object, creating the map or injecting the default type when needed.
   Returns nil if the input map is unchanged."
  [n o]
  (let [m (if (map? o) o {:default o})]
    ; Make sure map definition contains a default value.
    (if-not (contains? m :default)
      (throw (ex-info (str "No default for <" n ">") {:property n})))
    (let [d (:default m)
          it (infer-type-from-value d)]
      (if (contains? m :type)
        ; Make sure default matches type. nil is valid for any type.
        (if (and (not (nil? d)) (not= it (:type m)))
          (throw (ex-info (str "Type from default value and type hint are different for <" n ">") {:property n})))
        ; Merge type and returns updated map.
        (merge m {:type it})))))

(def all-keys
  #{:name :ns :prototype :extends :mixins :document :style :properties :methods
    :on-created :on-attached :on-detached :on-changed :requires-shadow-dom?})

(defn ignored-keys
  "Returns a set of ignored keys."
  [m]
  (set (filter #(not (contains? all-keys %)) (keys m))))

(defn register
  "Registers a new Custom Element from its definition.
   Returns true if registration was successful, falsey value if the definition was already registered."
  ([m] (register (:name m) m))
  ([n m]
   {:pre [(map? m) (not (seq (ignored-keys m)))]}
    (if-not (registered? n)
      (let [{:keys [properties methods]} m
            prototype (prototype m)]
        ; Validate property / method names
        (doseq [[o _] (concat properties methods)]
          (validate-property-name! (or (if (keyword? prototype) (create-element prototype)) default-element) (name o)))
        (let [um (assoc m :properties (into {} (for [[k v] properties]
                                                 [k (or (validate-property-definition! n v) v)])))
              ds (definition-chains um)]
          (swap! registry assoc n um)
          (ce/register n (create-prototype um prototype ds) (some :extends ds)))
        true)))
  ([m1 m2 & ms]
    (register m1)
    (register m2)
    (doseq [m ms]
      (register m))))

(defn merge-map-definition
  [m1 m2]
  (let [ps (merge (:properties m1) (:properties m2))
        ms (merge (:methods m1) (:methods m2))]
    (merge m1 m2 (if ps {:properties ps}) (if ms {:methods ms}))))

(defn collect-mixins
  [m]
  (if-let [mxs (:mixins m)]
    (apply conj
           (reduce #(if-let [pmxs (collect-mixins %2)]
                     (apply conj (mapv (fn [o] (if (map? o) (dissoc o :mixins))) %1) pmxs)
                     %1) [] mxs)
           mxs)))

(defn merge-mixins
  [m]
  (if-let [mxs (collect-mixins m)]
    (let [mm (reduce merge-map-definition (conj (filterv map? mxs) m))
          fns (filter fn? mxs)]
      (if (seq fns)
        (reduce #(%2 %1) mm fns)
        mm))
    m))