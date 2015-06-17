# Lucuma [![License](http://img.shields.io/badge/license-EPL-blue.svg?style=flat)](https://www.eclipse.org/legal/epl-v10.html) [![Build Status](http://img.shields.io/travis/jeluard/lucuma.svg?style=flat)](http://travis-ci.org/#!/jeluard/lucuma/builds)

[Getting Started](#getting-started) | [Usage](#usage) | [Browser support](#browser-support)

A [Web Components](http://webcomponents.org/) library for ClojureScript. Lucuma helps with creating reusable HTML elements encapsulating document, style and logic.

[![Clojars Project](http://clojars.org/lucuma/latest-version.svg)](http://clojars.org/lucuma).

## Getting Started

First define your custom element

```clojure
(ns your.ns
  (:require [lucuma :as l :refer-macros [defwebcomponent]]))

(defwebcomponent my-element
  :document "Hello!"
  :properties {:threshold 10})
```

Then register it

```clojure
(ns your.ns
  (:require [lucuma.core :as l]))

(l/register my-element)
```

Finally manipulate it like any HTML element

```javascript
<my-element threshold="15"></my-element>
<!-- Can be instantiated programmatically too. -->
<script>
  var el = document.createElement("my-element");
  el.threshold = 15;
  document.body.appendChild(el);
</script>
```

## Usage

### Custom Element definition

Custom elements are defined as maps of keyword / value. This map serves as the abstract definition for the element prototype.

Once a Web Component is defined and registered in the current document a new HTML tag is available (named after the var). It can be inserted in the DOM as any regular HTML element (including programmatically).

### Lifecycle

Custom Elements define callbacks that hook on element lifecycle.

You can hook functions to the element lifecycle using following keys:

* **on-created** called when an instance of the element is created (e.g. via `document.createElement`)
* **on-attached** called after an instance of the element is attached to the DOM
* **on-detached** called after an instance of the element is detached from the DOM
* **on-property-changed** called each time a property/attribute is changed (multi changes via **set-properties!** will trigger a single **on-property-changed**)

All functions receive as first argument the element instance.

**on-created** receives as second argument a map of consolidated properties (see documentation [later](#properties)) values. It can return a map containing a value for **document** and **on-property-changed** that will be used for this specific element instance.

**on-property-changed** receives as second argument a list of changes as map (`{:property :property-name :old-value "old" :new-value "new"}`).

```clojure
(defwebcomponent my-element
  :on-created #(do (println %1 "created") {:document (str "<div>" (count %2) " properties</div>")})
  :on-attached #(println % "attached")
  :on-detached #(println % "detached")
  :on-property-changed #(println %1 " got some changes" %2))
```

### Document

The document of a Web Component comes from the **document** value that will be appended to the element instance. This process is triggered per instance during the creation phase.

**document** value can be either a String or a Node instance.

```clojure
(defwebcomponent my-element
  :document "<div>some content</div>")
```

### Properties

Per instance properties can be accessed via JavaScript getter/setter and ClojureScript **get-property** / **set-property!**. When accessed via JavaScript values are properly converted in both directions. 
A property can be defined as a map with keys **default**, **type** (can be *:number*, *:boolean*, *:string*, *:keyword* or *:object*), **events?** and **attributes?** or as a single value (which will serve as default).

A property can be exported as HTML attribute if **attributes?** is set to true (default to true for *:number*, *:boolean* and *:string*). When created as an HTML element, attribute values will override defaults.

Changes to a property will fire DOM style events if **events?** is set to true (default to true for *:number*, *:boolean*, *:string* and *:object*).

Note that properties name follow clojure naming convention (dash-based) but are accessed using underscore-based convention from JavaScript.

```clojure
(defwebcomponent my-element
  :properties {:property-1 "default"
               :property-2 {:default 1 :type :number :events? true :attributes? true}})
```

The **on-created** callback receives as second argument a map of consolidated property values (with element attributes overriding property defaults).

```clojure
(defwebcomponent my-element
  :on-created #(println "Created with properties" m)
  :properties {:property "default"})
```

```html
<my-element property="overridden-value"></my-element>
<!-- on-created callback will receive {:property "overridden-value"} -->
```

### Methods

Regular ClojureScript functions can directly manipulate element instances. You can also expose those functions to JavaScript users by explicitly listing those functions and assigning them a name that will be attached to the element prototype.

Note that ClojureScript functions will receive the right element instance as first parameter when invoked as a result of the invocation of the associated JavaScript method.

```clojure
(defn some-method
  [el]
  ...)

(defwebcomponent my-element
  :methods {:method some-method})
```

```javascript
var el = document.querySelector("my-element");
el.method(); /* calls (some-method el) */
```

### Extension

Existing element can inherit capacity from other elements via prototype inheritance. **prototype** value can be a keyword referencing valid HTML element (including Custom ones) or an existing prototype.

```clojure
(defwebcomponent my-element
  :prototype :div)

(defwebcomponent my-other-element
  :prototype js/HTMLButtonElement.prototype)
```

If extending a Custom Element created via `defwebcomponent` directly reference the var. Their definition will then properly be merged as would happen if it was used as a mixin.

```clojure
(defwebcomponent my-element
  :prototype :div)

(defwebcomponent my-extended-element
  :prototype my-element)
```

### Reuse via mixins

To improve element reuse defwebcomponent has advanced syntax allowing to introduce parametrization and reuse existing definition.

By providing a vector as first element of a defwebcomponent arguments can be defined that can then be used in the element definition. defwebcomponent type will then be a function that returns a map upon invocation. This map will have to be registered (as opposed to the defwebcomponent itself).

```clojure
(defwebcomponent my-element
  [value]
  :properties {:default-threshold value})

(register (my-element 15))
```

**mixins** allows to provide shared definition by providing a list of map and/or function. All maps are first merged in order with the definition map itself (definition being merged last)
then all functions are applied in order with the first function receiving the consolidated map as argument and all subsequents the result of previous function invocation.
The final map definition is then the result of last function invocation.

```clojure
(def default
  {:document "<div>some content</div>"
   :properties {:property1 "value" :property2 2}})

(defwebcomponent my-element
  [value]
  :mixins [default #(update-in % [:properties :property2] inc)]
  :properties {:threshold value})
```

## Browser support

```javascript
var supported = 'registerElement' in document;
if (!supported) {
  var polyfill = document.createElement("script");
  polyfill.onload = load();
  polyfill.src = "";
  document.head.appendChild(polyfill);
} else {
  load();
}
```

Support for Custom Elements is appearing in recent browser releases. Some descent polyfill can be used for older browser:

* [WebComponents.org](http://webcomponents.org/polyfills/) polyfills Custom Elements for evergreen browsers
* [document-register-element](https://github.com/WebReflection/document-register-element/) polyfill Custom Elements for pretty much all browsers and is pretty small

## License

Copyright © 2014-2015 Julien Eluard.

Distributed under the Eclipse Public License, the same as Clojure.
