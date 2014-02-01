(ns lucuma
  (:require [clojure.string :as string]
            [lucuma.custom-elements :as ce]
            [lucuma.polymer :as p]
            [lucuma.shadow-dom :as sd]
            [lucuma.util :as u])
  (:refer-clojure :exclude [methods]))

(def ^:private registry (atom {}))

;;
;; Lucuma prototype
;;

(deftype LucumaElement [])
(defn lucuma-element? [el] (instance? LucumaElement el))

(defn- create-lucuma-prototype
  "Adds LucumaElement to the prototype chain."
  [base-prototype]
  (set! (.-prototype LucumaElement) base-prototype)
  (.-prototype LucumaElement))

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

(defmulti install-rendered-document!
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

(defn shadow-root
  "Returns lucuma ShadowRoot for an element."
  [el]
  (.-shadowRoot el)) ;; TODO is this always right?

(defn- create-shadow-root!
  "Creates and appends a ShadowRoot to 'el' if either `:style` or `:document` is provided."
  [el m]
  (let [{:keys [style document]} m]
    (when (or style document)
      (let [sr (sd/create el m)]
        (when style (render-then-install! sr style render-style install-style!))
        (when document (render-then-install! sr document render-document install-document!))
        sr))))

;;
;; listener support
;;

(defn- adjust-listener
  [el e o n]
  (if-let [f (u/str->fn (or o n))]
    (if (nil? o)
      (.addEventListener el e f)
      (.removeEventListener el e f))
    (.log js/console (str "Could not access listener fn: " (or o n)))))

(defn- event->handler [h] (str "on" (name h)))
(defn- handler->event [a] (.substr a 2))

(defn- attribute-changed
  [el a o n attributes handlers]
  (cond
    (contains? handlers a) (let [e (handler->event a)]
                             (adjust-listener el e o n))))

;;
;; Lucuma properties access
;;

(def ^:private property-holder-name "lucuma")
(defn install-property-holder! [p] (aset p property-holder-name #js {}))
(defn get-property [el n] (aget el property-holder-name n))
(defn set-property [el n v] (aset el property-holder-name n v))

;;
;; prototype creation
;;

(defn- host-type
  "Returns type from host element.

  e.g.
   :host :div => 'div'
   :host [:div {:key :value}] => 'div'
   :host {:key :value} => nil"
  [h]
  (when-let [t (cond (vector? h) (first h) (keyword? h) (name h))]
    (name t)))

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
   (contains? @registry t) (first (definition->el-id (get @registry t)))
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
          ep (when-let [e (:extends m)] (name e))
          e (or eic ep)]
      (when (and eic ep)
        (throw (ex-info "Infered extends value but a value for :extends was supplied" {:type t :inferred ei :provided ep})))
      (when (and (not ep) (= ei ::not-found))
        (throw (ex-info "Could not infer extends value and no value for :extends supplied" {:type t})))
      (if e [e t] [t nil]))))

(defn- create-element
  [n is]
  (if is
    (.createElement js/document n is)
    (.createElement js/document n)))

(defn- type->prototype
  "Returns prototype of an element from name and extension."
  [n is]
  (if n
    (.getPrototypeOf js/Object (create-element n is))
    (.-prototype js/HTMLElement)))

(defn- initialize!
  "Initializes a custom element instance."
  [el f m attributes handlers]
  ;;
  (doseq [attribute (array-seq (.-attributes el))]
    (attribute-changed el (.-name attribute) nil (.-value attribute) attributes handlers))
  ;; Set host attributes extracted from :host element
  (doseq [a (host-attributes (:host m))]
    (.setAttribute el (name (key a)) (str (val a))))
  ;; Install ShadowRoot and shim if needed (only first instance of each type)
  (when-let [sr (create-shadow-root! el m)]
    (when (p/shadow-css-needed?)
      (when-not (get-property el "style_shimed")
        (p/shim-styling! sr (:name m) (host-type (:host m)))
        (set-property el "style_shimed" true))))
  (when f (u/call-with-first-argument f el)))

(defn- create-ce-prototype
  "Creates a Custom Element prototype from a map definition."
  [m]
  (let [{:keys [host on-created attributes methods handlers]} m
        attributes (set (map name attributes))
        handlers (set (map event->handler handlers))
        on-created #(initialize! % on-created m attributes handlers)
        on-attribute-changed #(attribute-changed %1 %2 %3 %4 attributes handlers)
        prototype (ce/create-prototype
                      (merge m {:prototype (create-lucuma-prototype (apply type->prototype (definition->el-id m)))
                                :properties (concat attributes handlers) :on-created on-created :on-attribute-changed on-attribute-changed}))]
    ;; Install methods
    (doseq [method methods]
      (u/safe-aset prototype (name (key method)) (u/wrap-with-callback-this-value (u/wrap-to-javascript (val method)))))
    (install-property-holder! prototype)
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
  #{:name :ns :constructor :host :extends :document :style :attributes :methods :handlers
    :on-created :on-attached :on-detached :reset-style-inheritance})

(defn ignored-keys
  "Returns a set of ignored keys."
  [m]
  (set (filter #(not (contains? all-keys %)) (keys m))))

(defn register
  "Registers a new Custom Element from its definition."
  [m]
  {:pre [(map? m)]}
  (let [n (:name m)
        cf (ce/register n (create-ce-prototype m) (first (definition->el-id m)))]
    (if-let [goog-ns (u/*ns*->goog-ns (:ns m))]
      (when-let [c (:constructor m (default-constructor-name n))]
        (u/safe-aset goog-ns c cf))
      (u/warn (str "Couldn't export constructor for " n " as ns " (:ns m) " is inaccessible")))
    (swap! registry assoc n m)))
