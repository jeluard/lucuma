(ns lucuma
  (:require [clojure.string :as string]
            [lucuma.attribute :as att]
            [lucuma.custom-elements :as ce]
            [lucuma.event :as e]
            [lucuma.shadow-dom :as sd]
            [lucuma.util :as u])
  (:refer-clojure :exclude [methods]))

;
; Element manipulation
;

; Property access

(def ^:private registry (atom {}))

(def ^:private lucuma-properties-holder-name "lucuma")
(def ^:private properties-holder-name "properties")

(defn- install-lucuma-properties-holder! [p] (aset p lucuma-properties-holder-name #js {}))

(defn- set-lucuma-property! [el n v] (aset el lucuma-properties-holder-name n v))

(defn- element?
  [el]
  (when el
    (instance? js/Element el)))

(defn element-name
  "Returns an element name. Supports both custom and regular element."
  [el]
  (when (element? el)
    (keyword (or (.getAttribute el "is") (string/lower-case (.-tagName el))))))

(defn get-definition
  "Returns the definition for an element type."
  [t]
  (when (keyword? t)
    (t @registry)))

(defn registered?
  "Returns true if type is already registered."
  [t]
  (contains? @registry t))

(defn lucuma-element?
  "Returns true if element is a Lucuma element."
  [el]
  (when el
    (exists? (aget el lucuma-properties-holder-name))))

(defn- install-properties-holder! [p] (set-lucuma-property! p properties-holder-name #js {}))

(defn get-property
  "Gets the value of a named property."
  [el k]
  (when (lucuma-element? el)
    (aget el lucuma-properties-holder-name properties-holder-name (name k))))

(defn get-properties
  "Returns a map of all properties associated to their values."
  [el]
  (into {} (when (lucuma-element? el)
             (for [k (.keys js/Object (aget el lucuma-properties-holder-name properties-holder-name))]
               [k (get-property el k)]))))

(defn- prototype [m] (or (:prototype m) (:extends m)))

(defn- val-or-default [os k d] (let [v (k os)] (if (not (nil? v)) v d)))
(defn- type-not-one-of? [os st] (not-any? st [(:type os)]))
(defn- property-definition-attributes? [os] (val-or-default os :attributes? (type-not-one-of? os #{:object})))
(defn- property-definition-events? [os] (val-or-default os :events? true))

(defn- expected-type?
  "Returns true if provided ClojureScript value matches expected type (as :number, :boolean)."
  [t v]
  (let [tv (type v)]
    (condp = t
      :number (= js/Number tv)
      :string (= js/String tv)
      :boolean (= js/Boolean tv)
      :keyword (= Keyword tv)
      :object (instance? js/Object v)
      false)))

(defn- call-callback-when-defined
  [ds k el & args]
  (doseq [d ds]
    (when-let [f (k d)]
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
    (when (and (lucuma-element? el))
      (doseq [[k v] m
              :let [os (k ps)]]
        (let [et (:type os)]
          (when (and (not (nil? v)) (not (expected-type? et v)))
            (throw (ex-info (str "Expected value of type " et " but got <" v ">") {:property (name k)}))))
        (when (and consider-attributes? (property-definition-attributes? os))
          (att/set! el k v))
        (when (and initialization? (property-definition-events? os))
          (e/fire el k {:old-value (get-property el k) :new-value v}))
        (aset el lucuma-properties-holder-name properties-holder-name (name k) v))
      (when-not initialization?
        (let [ps (for [[k v] m] {:property k :old (get-property el k) :new v})]
          (call-callback-when-defined (definition-chains (get-definition (element-name el))) :on-changed el ps))))))

(defn set-property!
  "Sets the value of a named property."
  ([el k v] (set-property! el (aggregated-properties el) k v true false))
  ([el os k v consider-attributes? initialization?]
    (set-properties! el {k v} os consider-attributes? initialization?)))

;
; document / style rendering
;

(defn render-then-install-map!
  "Calls render-fn then install-fn on :content."
  [h m render-fn install-fn]
  (let [rc (render-fn (:content m))]
    (install-fn h rc m)))

(defn- render-then-install!
  "Dispatches based on :document / :style value.
   Node instances will be directly appended, list passed recursively to this fn,
   map render then installed and others encapsulated in a map as value of :content."
  [h o render-fn install-fn]
  (cond
   (instance? js/Node o) (.appendChild h (.cloneNode o true))
   (list? o) (doseq [e (filter identity o)] (render-then-install! h e render-fn install-fn))
   (map? o) (render-then-install-map! h o render-fn install-fn)
   :else (render-then-install-map! h {:content o} render-fn install-fn)))

; document

(defmulti render-document
  "Renders 'document' to something that can be added to the DOM."
  type)

(defmethod render-document js/String [s] s)

(derive js/Element ::node)
(derive js/DocumentFragment ::node)

(defmulti install-rendered-document!
  "Installs rendered 'document'."
  (fn [_ e] (if (instance? js/Element e) js/Element (type e))))

(defmethod install-rendered-document! js/String [h s] (let [el (.createElement js/document "div")]
                                                         (set! (.-innerHTML el) s)
                                                         (.appendChild h el)))
(defmethod install-rendered-document! ::node [h el] (.appendChild h el))

(defn install-document!
  "Installs document."
  [h rc _]
  (install-rendered-document! h rc))

; style

(defmulti render-style
  "Renders 'style' to something that can be added to the DOM."
  type)

(defmethod render-style js/String [s] s)

(defmulti install-rendered-style!
  "Installs rendered 'style' to provided 'style' element."
  (fn [_ e] (type e)))

(defmethod install-rendered-style! js/String [el c] (set! (.-textContent el) c))

(defn- create-style-element
  "Creates a style element."
  [media title]
  (let [el (.createElement js/document "style")]
    (when media (set! (.-media el) media))
    (when title (set! (.-title el) title))
    el))

(defn install-style!
  "Appends a new style element encapsulating redendered style."
  [h rc {:keys [media title]}]
  (let [el (create-style-element media title)]
    (install-rendered-style! el rc)
    (.appendChild h el)))

;
; ShadowRoot support
;

(def ^:private lucuma-shadow-root-property "lucuma")

(defn shadow-root
  "Returns lucuma ShadowRoot of element."
  ([el] (shadow-root el (element-name el)))
  ([el n]
   (when (and (lucuma-element? el) n)
     (some #(when (= (name n) (aget % lucuma-shadow-root-property)) %) (sd/shadow-roots el)))))

(defn host
  "Returns the host of an element inside a custom element, walking parents as needed; otherwise returns null."
  [el]
  (when el
    (loop [el el
           pel nil]
      (if (exists? (.-host el))
        (.-host el)
        (when-let [pel (.-parentNode el)] (recur pel el))))))

(defn- create-shadow-root
  "Creates and appends a ShadowRoot."
  [el]
  (let [sr (.createShadowRoot el)]
    (aset sr lucuma-shadow-root-property (name (element-name el)))
    sr))

;
; Prototype creation
;

(defn- host-type->extends
  "Returns extended type from host element.

  e.g.
   :div => :div
   :lucu-element => nil (when lucu-element does not extend any element)
   :lucu-element => :div (when lucu-element extends div, recursively finds the root extended element)
   :non-lucu-element => throw exception"
  [t]
  (when t
    (if (u/valid-standard-element-name? (name t))
      t
      (cond
        (registered? t)
        (let [m (get-definition t)]
          (host-type->extends (prototype m)))
        :else (throw (ex-info (str "Could not infer extends for <" (name t) ">") {}))))))

(defn- create-element
  [extends]
  (let [n (name extends)
        e (host-type->extends extends)]
    (if (and e (not= extends e))
      (.createElement js/document (name e) n)
      (.createElement js/document n))))

(defn create-content-holder
  [el requires-shadow-dom?]
  (let [shadow-dom-supported (sd/supported?)]
    (when (and requires-shadow-dom? (not shadow-dom-supported))
      (throw (ex-info "ShadowDOM not supported but required" {})))
    (if shadow-dom-supported
      (create-shadow-root el)
      el)))

(defn property-values
  [ps as]
  (into {}
        (for [p ps]
          (let [[k os] p
                a (when (and (contains? as k) (property-definition-attributes? os))
                    (att/attribute->property [(:type os) (k as)]))]
            ; Matching attribute value overrides eventual default
            [k (or a (:default os))]))))

(defn- initialize-instance!
  "Initializes a custom element instance."
  [el {:keys [style document properties requires-shadow-dom?]}]
  ; Set default properties values
  (let [ps (property-values properties (att/attributes el))]
    (set-properties! el ps (aggregated-properties el) true true)
    (when (or style document)
      (let [h (create-content-holder el requires-shadow-dom?)]
        (when style (render-then-install! h style render-style install-style!))
        (when document
          (let [document (if (fn? document) (document ps) document)]
            (render-then-install! h document render-document install-document!)))))))

(defn- merge-properties
  [p g s]
  (apply merge (map #(hash-map (keyword %) (att/property-definition (partial g (keyword %)) (partial s (keyword %))))
                    (map key p))))

(defn- attribute-changed
  "Updates property based on associated attribute change."
  [el ds k ov nv properties]
  (when-let [os (k properties)] ; Attribute changed is a property defined by our component
    (when (not= (att/attribute->property [(:type os) nv]) (get-property el k)) ; Value is different from current value: this is not a change due to a property change
      (if (property-definition-attributes? os) ; Property is managed by lucuma
        (set-property! el {k os} k nv false false)
        (u/warn (str "Changing attribute for " (name k) " but its attributes? is false."))))))

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
  (let [on-created #(do (doseq [d ds]
                          (initialize-instance! % d)
                          (when-let [f (:on-created d)]
                            (u/call-with-first-argument f %))))
        on-attribute-changed (fn [el a ov nv ns]
                               (let [k (keyword a)]
                                 (attribute-changed el ds k ov nv properties)))
        prototype (ce/create-prototype
                      (merge m {:prototype (prototype-of prototype)
                                :properties (merge-properties properties
                                                              #(clj->js (get-property %2 %1))
                                                              #(set-property! %2 %1 (js->clj %3)))
                                :on-created on-created :on-attribute-changed on-attribute-changed
                                ; Propagate through prototype chain
                                :on-attached #(call-callback-when-defined ds :on-attached %)
                                :on-detached #(call-callback-when-defined ds :on-detached %)}))]
    (install-lucuma-properties-holder! prototype)
    (install-properties-holder! prototype)
    ; Install methods
    (doseq [[k v] methods]
      (aset prototype (name k) (u/wrap-with-callback-this-value (u/wrap-to-javascript v))))
    prototype))

(defn- validate-property-name!
  "Ensures a property name is valid."
  [el n]
  (when-not (u/valid-identifier? n)
    (throw (ex-info (str "Invalid property name <" n ">") {:property n})))
  (when (exists? (aget el n))
    (throw (ex-info (str "Property <" n "> is already defined") {:property n}))))

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

(defn validate-property-definition!
  "Ensures a property definition is sound. Throws a js/Error if not.
   Returns a map definition of the input object, creating the map or injecting the default type when needed.
   Returns nil if the input map is unchanged."
  [n o]
  (let [m (if (map? o) o {:default o})]
    ; Make sure map definition contains a default value.
    (when-not (contains? m :default)
      (throw (ex-info (str "No default for <" n ">") {:property n})))
    (let [d (:default m)
          it (infer-type-from-value d)]
      (if (contains? m :type)
        ; Make sure default matches type. nil is valid for any type.
        (when (and (not (nil? d)) (not= it (:type m)))
          (throw (ex-info (str "Type from default value and type hint are different for <" n ">") {:property n})))
        ; Merge type and returns updated map.
        (merge m {:type it})))))

(def all-keys
  #{:name :ns :prototype :extends :document :style :properties :methods
    :on-created :on-attached :on-detached :on-changed :requires-shadow-dom?})

(defn ignored-keys
  "Returns a set of ignored keys."
  [m]
  (set (filter #(not (contains? all-keys %)) (keys m))))

(defn register
  "Registers a new Custom Element from its definition.
   Returns true if registration was successful, falsey value if the definition was already registered."
  [m]
  ; Validate the definition
  (assert (map? m) (ex-info "Definition must be a map" {}))
  (assert (not (seq (ignored-keys m))) (str "Definition contains unknown keys " (ignored-keys m)))
  (let [n (:name m)
        k (keyword n)]
    (when-not (registered? k)
      (let [{:keys [properties methods]} m
            prototype (prototype m)]
        ; Validate property / method names
        (doseq [[o _] (concat properties methods)]
          (validate-property-name! (or (when (keyword? prototype) (create-element prototype)) default-element) (name o)))
        (let [um (assoc m :properties (into {} (for [[k v] properties]
                                                 [k (or (validate-property-definition! n v) v)])))
              ds (definition-chains um)]
          (swap! registry assoc k um)
          (ce/register n (create-prototype um prototype ds) (some :extends ds))))
        true)))
