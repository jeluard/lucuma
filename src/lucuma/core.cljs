(ns lucuma.core
  (:require [clojure.string :as string]
            [lucuma.attribute :as att]
            [lucuma.custom-elements :as ce]
            [lucuma.util :as u])
  (:refer-clojure :exclude [methods])
  (:require-macros lucuma.core))

; Property access

(def ^:private registry (atom {}))

(def ^:private lucuma-properties-holder-name "lucuma")
(def ^:private properties-holder-name "properties")

(defn- install-lucuma-properties-holder! [p] (aset p lucuma-properties-holder-name #js {}))

(defn- get-lucuma-property! [el n] (aget el lucuma-properties-holder-name n))
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

(defn- fire-event
  [el n m]
  (let [ev (js/Event. (name n))]
    (aset ev "detail" (clj->js m))
    (.dispatchEvent el ev)))

(defn changes->map
  "Returns a map of changed values"
  [s]
  (reduce #(merge %1 {(:property %2) (:new-value %2)}) {} s))

(defn- set-properties*
  [el m pv ps consider-attributes? initialization?]
  (doseq [[k v] m]
    (let [os (k (:properties ps))]
      (if os
        (let [et (:type os)]
          (if (and (not (nil? v)) (not (= et (infer-type-from-value v))))
            (throw (ex-info (str "Expected value of type " et " but got " (infer-type-from-value v) " (<" v ">) for " k) {:property (name k) :target el})))))
      (when os
        (if (and initialization? (property-definition-events? os))
          (fire-event el k {:old-value (k pv) :new-value v}))
        (aset el lucuma-properties-holder-name properties-holder-name (name k) v))
      ; Set attribute after property is set to prevent a double call to set-properties*
      (if (or (not os) (and consider-attributes? (property-definition-attributes? os)))
        (att/set! el k v)))))

(defn on-property-changed
  [el ps m pv]
  (if-let [f (:on-property-changed ps)]
    (let [s (for [[k v] m] {:property k :old-value (k pv) :new-value v})]
      (f el s))))

(defn set-properties!
  "Sets all properties."
  ([el m] (set-properties! el m true false))
  ([el m consider-attributes? initialization?] (set-properties! el m (get-definition (element-name el)) consider-attributes? initialization?))
  ([el m ps consider-attributes? initialization?]
    (if (lucuma-element? el)
      (let [pv (get-properties el)]
        (set-properties* el m pv ps consider-attributes? initialization?)
        (if (not initialization?)
          (on-property-changed el ps m pv))))))

(defn set-property!
  "Sets the value of a named property."
  ([el k v] (set-properties! el {k v}))
  ([el os k v consider-attributes? initialization?]
    (set-properties! el {k v} os consider-attributes? initialization?)))

(defn host
  "Returns the host of an element inside a custom element, walking parents as needed; otherwise returns null."
  [el]
  (if el
    (if (lucuma-element? el)
      el
      (if-let [pel (.-parentNode el)] (recur pel)))))

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
    (cond
      (map? t) (let [p (prototype t)] (if (map? p) (host-type->extends p) p))
      (u/valid-standard-element-name? (name t)) t
      :else
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
  [el m ps]
  ; Set default properties values
  (install-lucuma-properties-holder! el)
  (install-properties-holder! el)
  (set-properties! el m ps true true))

(defn- property-name->js-property-name [s] (.replace (name s) "-" "_"))
(defn- js-property-name->property-name [s] (.replace (name s) "_" "-"))

(defn- merge-properties
  [p g s]
  (apply merge (map #(hash-map (keyword (property-name->js-property-name %)) (att/property-definition (partial g (keyword (js-property-name->property-name %))) (partial s (keyword (js-property-name->property-name %)))))
                    (map key p))))

(defn- attribute-changed
  "Updates property based on associated attribute change."
  [el k _ nv m]
  (if-let [os (get-in m [:properties k])] ; Attribute changed is a property defined by our element
    (let [v (att/attribute->property [(:type os) nv])]
      (if (not= v (get-property el k)) ; Value is different from current value: this is not a change due to a property change
        (if (property-definition-attributes? os) ; Property is managed by lucuma
          (set-property! el m k v false false)
          (u/warn (str "Changing attribute for " (name k) " but its attributes? is false.")))))))

(defn prototype-of
  [o]
  (cond
    (nil? o) (.-prototype js/HTMLElement)
    (or (string? o) (keyword? o)) (.getPrototypeOf js/Object (create-element o))
    (map? o) (prototype-of (:name o))
    (instance? js/HTMLElement o) o))

(defn- call-callback-when-defined
  [m k el]
  (if-let [f (k m)]
    (f el)))

(defn- create-prototype
  "Creates a Custom Element prototype from a map definition."
  [{:keys [properties methods] :as m} prototype]
  (let [on-created #(let [mp (property-values properties (att/attributes %))]
                     (initialize-instance! % mp m)
                     (if-let [f (:on-created m)]
                       (f % mp)))
        on-attribute-changed (fn [el a ov nv _]
                               (attribute-changed el (keyword (js-property-name->property-name a)) ov nv m))
        prototype (ce/create-prototype
                      (merge m {:prototype (prototype-of prototype)
                                :properties (merge-properties properties
                                                              #(clj->js (get-property %2 %1))
                                                              #(set-property! %2 %1 (js->clj %3 :keywordize-keys true)))
                                :on-created on-created :on-attribute-changed on-attribute-changed
                                ; Propagate through prototype chain
                                :on-attached #(call-callback-when-defined m :on-attached %)
                                :on-detached #(call-callback-when-defined m :on-detached %)}))]
    ; Install methods
    (doseq [[k v] methods]
      (aset prototype (name k) (u/wrap-with-callback-this-value (u/wrap-to-javascript v))))
    prototype))

(def ^:private default-element (.createElement js/document "div")) ; div does not define any extra property / method

(defn- validate-property-name!
  "Ensures a property name is valid."
  [el n m]
  (if-not (u/valid-identifier? n)
    (throw (ex-info (str "Invalid property name <" n ">") {:property n})))
  (if (and (exists? (aget el n)) (not (:override? m)))
    (throw (ex-info (str "Property <" n "> is already defined. Add `:override? true` to force the override.") {:property n}))))

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
  #{:name :ns :prototype :extends :mixins :properties :methods
    :on-created :on-attached :on-detached :on-property-changed})

(defn ignored-keys
  "Returns a set of ignored keys."
  [m]
  (set (filter #(not (contains? all-keys %)) (keys m))))

(defn register
  "Registers a new Custom Element from its definition.
   Returns true if registration was successful, falsey value if the definition was already registered."
  ([m]
   {:pre [(map? m)]}
   (let [n (:name m)]
     (if-not (registered? n)
       (let [{:keys [properties methods]} m
             prototype (prototype m)]
         ; Validate property / method names
         (doseq [[o m] (concat properties methods)]
           (validate-property-name! (or (if (keyword? prototype) (create-element prototype)) default-element) (name o) m))
         (let [um (assoc m :properties (into {} (for [[k v] properties]
                                                  [k (or (validate-property-definition! k v) v)])))]
           (swap! registry assoc n um)
           (ce/register n (create-prototype um prototype) (:extends m)))
         true))))
  ([m1 m2 & ms]
    (register m1)
    (register m2)
    (doseq [m ms]
      (register m))))

(defn default-mixin-combiner
  [r l]
  "Combines map by merging them.
   Combines function by creating a new function that first calls the old one then the new one.
   For all others types the new value takes precedence."
  (cond
    (map? l) (merge r l)
    (fn? l)  (fn [& args] (if r (apply r args)) (apply l args))
    :else (or l r)))

(defn map-without-mixins
  [m]
  (if (map? m)
    (dissoc m :mixins (if (map? (:prototype m)) :prototype))
    m))

(defn collect-mixins
  [m]
  (let [mxs (filterv identity (conj (vec (:mixins m)) (:prototype m) (:extends m)))]
    (if (seq mxs)
      (apply conj
             (reduce #(if-let [pmxs (collect-mixins %2)]
                       (apply conj %1 pmxs)
                       %1) [] mxs)
             (mapv map-without-mixins mxs)))))

(defn merge-mixins
  [m]
  (if-let [mxs (collect-mixins m)]
    (let [mm (reduce #(merge-with (or (:mixin-combiner m) default-mixin-combiner) (map-without-mixins %1) (map-without-mixins %2)) (conj (filterv map? mxs) m))
          fns (filter fn? mxs)]
      (if (seq fns)
        (reduce #(%2 %1) mm fns)
        mm))
    m))
