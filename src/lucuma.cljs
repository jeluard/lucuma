(ns lucuma
  (:require [clojure.string :as string]
            [lucuma.attribute :as att]
            [lucuma.custom-elements :as ce]
            [lucuma.event :as e]
            [lucuma.polymer :as p]
            [lucuma.shadow-dom :as sd]
            [lucuma.util :as u])
  (:refer-clojure :exclude [methods]))

;;
;; Element manipulation
;;

;; property definition manipulation

(defn- get-property-definition-default
  [os]
  (if (map? os)
    (:default os)
    os))

(defn- get-property-definition-type
  [os]
  (or (:type os)
      (let [d (get-property-definition-default os)]
        (if-not (nil? d)
          (type (clj->js d))
          js/Object))))

(defn- val-or-default [os k d] (let [v (k os)] (if (not (nil? v)) v d)))
(defn- type-one-of? [os st] (not-any? st [(get-property-definition-type os)]))
(defn- property-definition-attributes? [os] (val-or-default os :attributes? (type-one-of? os #{js/Function js/Object})))
(defn- property-definition-events? [os] (val-or-default os :events? (type-one-of? os #{js/Function})))

;; Property access

(def ^:private registry (atom {}))

(def ^:private lucuma-properties-holder-name "lucuma")
(def ^:private properties-holder-name "properties")

(defn- install-lucuma-properties-holder! [p] (aset p lucuma-properties-holder-name #js {}))

(defn- get-lucuma-property [el n] (aget el lucuma-properties-holder-name n))
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
  "Returns the definition for an element."
  [el]
  ((element-name el) @registry))

(defn registered?
  "Returns true if type is already registered."
  [t]
  (contains? @registry t))

(defn lucuma-element?
  "Returns true if element is a Lucuma element."
  [el]
  (when el
    (exists? (aget el lucuma-properties-holder-name))))

(defn property-exists?
  "Returns true if property exists."
  [el k]
  (if (lucuma-element? el)
    (contains? (:properties (get-definition el)) k)
    false))

(defn- install-properties-holder! [p] (set-lucuma-property! p properties-holder-name #js {}))

(defn get-property
  "Gets the value of a named property."
  [el k]
  (when (lucuma-element? el)
    (aget el lucuma-properties-holder-name properties-holder-name (name k))))

(defn get-properties
  "Returns a map of all properties associated to their values."
  [el]
  (into {} (for [k (.keys js/Object (aget el lucuma-properties-holder-name properties-holder-name))]
             [k (get-property el k)])))

(defn- lookup-options
  [el k]
  (if-let [d (get-definition el)]
    (get-in d [:properties k])
    (throw (ex-info (str "Could not find definition for " (name (element-name el))) {}))))

(defn- correct-type?
  [t v]
  (if (= t js/Object)
    (instance? t v)
    (= t (type v))))

(defn set-property!
  "Sets the value of a named property."
  ([el k v] (set-property! el k v true true))
  ([el k v consider-attributes? consider-events?] (set-property! el (lookup-options el k) k v consider-attributes? consider-events?))
  ([el os k v consider-attributes? consider-events?]
   (when (and (lucuma-element? el) k (property-exists? el k))
     (let [et (get-property-definition-type os)]
        (when (and (not (nil? v)) (not (correct-type? et v)))
          (throw (ex-info (str "Expected value of type " et " but got <" v ">") {:property (name k)}))))
     (aset el lucuma-properties-holder-name properties-holder-name (name k) v)
     (when (or consider-attributes? consider-events?)
       (when (and consider-attributes? (property-definition-attributes? os))
         (att/set! el k v))
       (when (and consider-events? (property-definition-events? os))
         (e/fire el k {:old-value (get-property el k) :new-value v}))))))

(defn set-properties!
  "Sets all properties."
  [el m]
  (doseq [[k v] m]
    (set-property! el k v)))

;;
;; document / style rendering
;;

(defn render-then-install-map!
  "Calls render-fn then install-fn on :content."
  [sr m render-fn install-fn]
  (let [rc (render-fn (:content m))]
    (install-fn sr rc m)))

(defn- render-then-install!
  "Dispatches based on :document value.
   Node instances will be directly appended, list passed recursively to this fn,
   map render then installed and others encapsulated in a map as value of :content."
  [sr o render-fn install-fn]
  (cond
   (instance? js/Node o) (.appendChild sr (.cloneNode o true))
   (list? o) (doseq [e o] (render-then-install! sr e render-fn install-fn))
   (map? o) (render-then-install-map! sr o render-fn install-fn)
   :else (render-then-install-map! sr {:content o} render-fn install-fn)))

;; document

(defmulti render-document
  "Renders 'document' to something that can be added to the DOM."
  type)

(defmethod render-document js/String [s] s)

(derive js/HTMLElement ::node)
(derive js/DocumentFragment ::node)

(defmulti install-rendered-document! ;; TODO rename to attach/detach? wait for final Custom Element spec
  "Installs rendered 'document' to provided ShadowRoot."
  (fn [_ e] (if (instance? js/HTMLElement e) js/HTMLElement (type e))))

(defmethod install-rendered-document! js/String [sr s] (set! (.-innerHTML sr) s))
(defmethod install-rendered-document! ::node [sr e] (.appendChild sr e))

(defmulti uninstall-rendered-document!
  "Uninstalls rendered 'document' to provided ShadowRoot."
  (fn [_ e] (if (instance? js/HTMLElement e) js/HTMLElement (type e))))

(defmethod uninstall-rendered-document! js/String [sr s] (set! (.-innerHTML sr) ""))
(defmethod uninstall-rendered-document! ::node [sr e] (.removeChild sr e))

(defn on-match-media
  "Listens to matchMedia on calls methods depending on matches value."
  [s m-fn nm-fn]
  (let [m (.matchMedia js/window s)]
    (.addListener m #(if (.-matches m) (m-fn) (nm-fn)))
    (when (.-matches m) (m-fn))))

(defn- call-when-defined! [sr m t] (when-let [f (t m)] (f (.-host sr))))

(defn install-document!
  "Dynamically installs/uninstalls document based on matching media."
  [sr rc m]
  (letfn [(install! []
                   (call-when-defined! sr m :on-attached)
                   (install-rendered-document! sr rc))
          (uninstall! []
                   (call-when-defined! sr m :on-detached)
                   (uninstall-rendered-document! sr rc))]
    (let [media (:media m)]
      (if media
        (on-match-media media install! uninstall!)
        (install!)))))

;; style

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
  [sr rc m]
  (let [el (create-style-element (:media m) (:title m))]
    (install-rendered-style! el rc)
    (.appendChild sr el)))

;;
;; ShadowRoot support
;;

(def ^private lucuma-shadow-root-property "lucuma")

(defn shadow-root
  "Returns lucuma ShadowRoot of element."
  [el]
  (when (lucuma-element? el)
    (let [sr (.-shadowRoot el)]
      (when-not (aget sr lucuma-shadow-root-property) (throw (ex-info "Could not locate Lucuma ShadowRoot" {})))
      sr))) ;; This might require some logic if we don't access the right ShadowRoot.

(defn host
  "Returns the host of an element inside a custom element, walking parents as needed; otherwise returns null."
  [el]
  (loop [el el
         pel nil]
    (if (exists? (.-host el))
      (.-host el)
      (when-let [pel (.-parentNode el)] (recur pel el)))))

(defn- create-shadow-root!
  "Creates and appends a ShadowRoot to 'el' if either `:style` or `:document` is provided."
  [el m]
  (let [{:keys [style document]} m]
    (when (or style document)
      (let [sr (sd/create el m)]
        (aset sr lucuma-shadow-root-property "")
        (when style (render-then-install! sr style render-style install-style!))
        (when document (render-then-install! sr document render-document install-document!))
        sr))))

;;
;; prototype creation
;;

(defn- host-type
  "Returns type from host element.

  e.g.
   :host :div => :div
   :host [:div {:key :value}] => :div
   :host {:key :value} => nil"
  [h]
  (when-let [t (cond (vector? h) (first h) (keyword? h) h)]
    t))

(defn- host-attributes
  "Returns attributes from host element.

  e.g.
   :host :div => nil
   :host [:div {:key :value}] => {:key :value}
   :host {:key :value} => {:key :value}"
  [h]
  (cond
   (vector? h) (second h)
   (map? h) h))

(declare definition->el-id)

(defn- host-type->extends
  "Returns extended type from host element.

  e.g.
   'div' => nil
   'lucu-element' => nil (when lucu-element does not extend any element)
   'lucu-element' => 'div' (when lucu-element extends div, recursively finds the root extended element)
   'non-lucu-element' => ::not-found'"
  [t]
  (cond
   (u/valid-standard-element-name? t) nil
   (contains? @registry t) (first (definition->el-id (t @registry)))
   ;;TODO polymer: https://github.com/Polymer/polymer/commit/e269582047fb4d384a48c9890906bf06742a932b
   :else ::not-found))

(defn- definition->el-id
  "Returns [type, extended-type] from host/extends element.

  e.g.
   :host nil => nil
   :host :div => ['div' nil]
   :host :lucu-element => ['lucu-element' nil]  (when lucu-element does not extend any element)
   :host :lucu-element => ['div' 'lucu-element'] (when lucu-element extends div, recursively finds the root extended element)
   :host :non-lucu-element => exception thrown
   :host :non-lucu-element :extends :div => ['div' 'non-lucu-element']"
  [m]
  (when-let [t (host-type (:host m))]
    (let [ei (host-type->extends t)
          eic (when (not= ei ::not-found) ei)
          ep (when-let [e (:extends m)] e)
          e (or eic ep)]
      (when (and eic ep)
        (throw (ex-info "Infered extends value but a value for :extends was supplied" {:type t :inferred ei :provided ep})))
      (when (and (not ep) (= ei ::not-found))
        (throw (ex-info "Could not infer extends value and no value for :extends supplied" {:type t})))
      (if e [e t] [t nil]))))

(defn- create-element
  [n is]
  (if is
    (.createElement js/document (name n) (name is))
    (.createElement js/document (name n))))

(defn- initialize!
  "Initializes a custom element instance."
  [el f m]
  ;; Set host attributes extracted from :host element
  (doseq [a (host-attributes (:host m))]
    (.setAttribute el (name (key a)) (str (val a))))
  ;; Set default properties values
  (let [as (att/attributes el)]
    (doseq [p (:properties m)]
      (let [[k os] p
            a (when (property-definition-attributes? os)
                (att/attribute->property [(get-property-definition-type os) (k as)]))]
        ;; Matching attribute value overrides eventual default
        (set-property! el os k (or a (get-property-definition-default os)) true false))))
  ;; Install ShadowRoot and shim if needed (only first instance of each type)
  (when-let [sr (create-shadow-root! el m)]
    (when (p/shadow-css-needed?)
      (when-not (get-lucuma-property el "style_shimed")
        (p/shim-styling! sr (:name m) (host-type (:host m)))
        (set-lucuma-property! el "style_shimed" true))))
  (when f (u/call-with-first-argument f el)))

(defn- merge-properties
  [p g s]
  (apply merge (map #(hash-map (keyword %) (att/property-definition (partial g (keyword %)) (partial s (keyword %))))
                    (map key p))))

(defn- attribute-changed
  "Updates property based on associated attribute change."
  [el a o n os]
  (when os ;; Attribute changed is a property defined by our component
    (let [v (att/attribute->property [(get-property-definition-type os) n])]
      (when-not (= v (get-property el a));; Value is different from current value: this is not a change due to a property change
        (if (property-definition-attributes? os)
          (set-property! el os a v false true)
          (u/warn (str "Changing attribute for " (name a) " but its attributes? is false.")))))))

(def ^:private default-element (.createElement js/document "div")) ;; div does not define any extra property / method

(defn- validate-property-name!
  ;; TODO allow overriding of non read-only property?
  "Ensures a property name is valid."
  [parent-el n]
  (when (not (u/valid-identifier? n))
    (throw (ex-info (str "Invalid property name <" n ">") {:property n})))
  (when (exists? (aget (or parent-el default-element) n))
    (throw (ex-info (str "Property <" n "> is already defined") {:property n}))))

(defn validate-property-definition!
  "Ensures a property definition is sound. Throws a js/Error if not."
  [n o]
  (when (map? o)
    (when-not (contains? o :default)
      (throw (ex-info (str "No default for <" n ">") {:property n})))
    (if-let [t (get-property-definition-type o)]
      (let [d (get-property-definition-default o)]
        (if d
          (when (not (correct-type? t d))
            (throw (ex-info (str "Type from default value and type hint are different for <" n ">") {:property n})))))
      (throw (ex-info (str "Default can't be inferred for <" n ">") {:property n})))))

(defn- create-ce-prototype
  "Creates a Custom Element prototype from a map definition."
  [m]
  (let [{:keys [host on-created properties methods]} m
        on-created #(initialize! % on-created m)
        on-attribute-changed #(attribute-changed %1 (keyword %2) %3 %4 ((keyword %2) properties))
        parent-el (when-let [[n is] (definition->el-id m)] (create-element n is))
        parent-prototype (if parent-el (.getPrototypeOf js/Object parent-el) (.-prototype js/HTMLElement))
        prototype (ce/create-prototype
                      (merge m {:prototype parent-prototype
                                :properties (merge-properties properties
                                                              #(clj->js (get-property %2 %1))
                                                              #(set-property! %2 %1 (js->clj %3)))
                                :on-created on-created :on-attribute-changed on-attribute-changed}))]
    (install-lucuma-properties-holder! prototype)
    (install-properties-holder! prototype)
    ;; Validate property definitions
    (doseq [property properties]
      (let [n (name (key property))
            os (val property)]
        (validate-property-name! parent-el n)
        (validate-property-definition! n os)))
    ;; Install methods
    (doseq [method methods]
      (let [n (name (key method))]
        (validate-property-name! parent-el n)
        (aset prototype n (u/wrap-with-callback-this-value (u/wrap-to-javascript (val method))))))
    prototype))

(defn- default-constructor-name
  "Generates a default constructor name for an element.

  e.g.
   my-element => MYElement
   my-lucu-element => MYLucuElement"
  [n]
  (when n
    (let [v (string/split n #"-")]
      (str (string/upper-case (first v)) (string/join (map string/capitalize (subvec v 1)))))))

(def all-keys
  #{:name :ns :constructor :host :extends :document :style :properties :methods :handlers
    :on-created :on-attached :on-detached :reset-style-inheritance})

(defn ignored-keys
  "Returns a set of ignored keys."
  [m]
  (set (filter #(not (contains? all-keys %)) (keys m))))

(defn register
  "Registers a new Custom Element from its definition.
   Returns true if registration was successful, false if the definition was already registered."
  [m]
  ;;Validate the definition
  (assert (map? m) (ex-info "Definition must be a map" {}))
  (assert (not (seq (ignored-keys m))) (str "Definition contains unknown keys " (ignored-keys m)))
  (let [n (:name m)
        k (keyword n)]
    (if (registered? k)
      false
      (do
        (swap! registry assoc k m)
        (let [cf (ce/register n (create-ce-prototype m) (first (definition->el-id m)))]
          (if-let [goog-ns (u/*ns*->goog-ns (:ns m))]
            (when-let [c (:constructor m (default-constructor-name n))]
              (aset goog-ns c cf))
            (u/warn (str "Couldn't export constructor for " n " as ns " (:ns m) " is inaccessible"))))
        true))))

(defn on-elements-upgraded
  "Executes function when all elements are upgraded.
   This is needed as polymer upgrades elements asynchronously."
  [f]
  (if (p/custom-element-polyfilled?)
    (.addEventListener js/document "WebComponentsReady" f)
    (f)))

(set! (.-onElementsUpgraded js/lucuma) on-elements-upgraded)
