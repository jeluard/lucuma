# Lucuma [![License](http://img.shields.io/badge/license-EPL-blue.svg?style=flat)](https://www.eclipse.org/legal/epl-v10.html) [![Build Status](http://img.shields.io/travis/jeluard/lucuma.svg?style=flat)](http://travis-ci.org/#!/jeluard/lucuma/builds)

[Getting Started](#getting-started) | [Usage](#usage) | [Browser support](#browser-support)

A [Custom Elements](http://www.w3.org/TR/custom-elements/) library for ClojureScript. Lucuma helps with creating native reusable HTML elements.

[![Clojars Project](http://clojars.org/lucuma/latest-version.svg)](http://clojars.org/lucuma).

## Getting Started

First define your custom element

```clojure
(ns your.ns
  (:require [lucuma :as l :refer-macros [defcustomelement]]))

(defcustomelement my-element
  :on-created #(set! (.-textContent %) "Hello World!")
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

Once a Custom Element is defined and registered in the current document a new HTML tag is available (named after the var). It can be inserted in the DOM as any regular HTML element (including programmatically).

### Lifecycle

Custom Elements define callbacks that hook on element lifecycle.

You can hook functions to the element lifecycle using following keys:

* **on-created** called when an instance of the element is created (e.g. via `document.createElement`)
* **on-attached** called after an instance of the element is attached to the DOM
* **on-detached** called after an instance of the element is detached from the DOM
* **on-property-changed** called each time a property/attribute is changed (multi changes via **set-properties!** will trigger a single **on-property-changed**)

All functions receive as first argument the element instance.

**on-created** receives as second argument a map of consolidated properties (see documentation [later](#properties)) values.

**on-property-changed** receives as second argument a list of changes as map (`{:property :property-name :old-value "old" :new-value "new"}`).

```clojure
(defcustomelement my-element
  :on-created #(println %1 "created")
  :on-attached #(println % "attached")
  :on-detached #(println % "detached")
  :on-property-changed #(println %1 " got some changes" %2))
```

### Properties

Per instance properties can be accessed via JavaScript getter/setter and ClojureScript **get-property** / **set-property!**. When accessed via JavaScript values are properly converted in both directions.
A property can be defined as a map with keys **default**, **type** (can be *:number*, *:boolean*, *:string*, *:keyword* or *:object*), **events?** and **attributes?** or as a single value (which will serve as default).

A property can be exported as HTML attribute if **attributes?** is set to true (default to true for *:number*, *:boolean* and *:string*). When created as an HTML element, attribute values will override defaults.

Changes to a property will fire DOM style events if **events?** is set to true (default to true for *:number*, *:boolean*, *:string* and *:object*).

A property can be defined as read only if **read-only?** is set to true (default to false).

Note that properties name follow clojure naming convention (dash-based) but are accessed using underscore-based convention from JavaScript.

```clojure
(defcustomelement my-element
  :properties {:property-1 "default"
               :property-2 {:default 1 :type :number :events? true :attributes? true}})
```

The **on-created** callback receives as second argument a map of consolidated property values (with element attributes overriding property defaults).

```clojure
(defcustomelement my-element
  :on-created #(println "Created with properties" %2)
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

(defcustomelement my-element
  :methods {:method some-method})
```

```javascript
var el = document.querySelector("my-element");
el.method(); /* calls (some-method el) */
```

### Extension

Existing element can inherit capacity from other elements via prototype inheritance. **prototype** value can be a keyword referencing valid HTML element (including Custom ones) or an existing prototype.

```clojure
(defcustomelement my-element
  :prototype :div)

(defcustomelement my-other-element
  :prototype js/HTMLButtonElement.prototype)
```

If extending a Custom Element created via `defcustomelement` directly reference the var. Their definition will then properly be merged as would happen if it was used as a mixin.

```clojure
(defcustomelement my-element
  :prototype :div)

(defcustomelement my-extended-element
  :prototype my-element)
```

### Reuse via mixins

To improve element reuse defcustomelement has advanced syntax allowing to introduce parametrization and reuse existing definition.

**mixins** allows to provide shared definition by providing a list of map and/or function. All maps are first merged in order with the definition map itself (definition being merged last)
then all functions are applied in order with the first function receiving the consolidated map as argument and all subsequents the result of previous function invocation.
The final map definition is then the result of last function invocation.

```clojure
(def default
  {:properties {:property1 "value" :property2 2}})

(defcustomelement my-element
  :mixins [default #(update-in % [:properties :property2] inc)]
  :properties {:threshold 1})
```

## Browser support

Support for Custom Elements is appearing in recent browser releases. Some descent polyfill can be used for other browsers:

* [WebComponents.org](http://webcomponents.org/polyfills/custom-elements/#polyfill-details) provides a Custom Elements polyfill for evergreen browsers
* [document-register-element](https://github.com/WebReflection/document-register-element/) provides a Custom Elements polyfill for older browsers and is pretty small

`document-register-element` is also available as a [CLJSJS package](https://github.com/cljsjs/packages/tree/master/document-register-element) so it can be used as simply as:

```clojure
(ns application.core
  (:require cljsjs.document-register-element))
```

For production environment you can also add the following snippet to your document head:

```javascript
function init () {
  // this code calls (l/register ..)
}

var supported = 'registerElement' in document;
if (!supported) {
  var polyfill = document.createElement("script");
  polyfill.onload = init();
  polyfill.src = "..."; // your polyfill URL, like "//cdnjs.cloudflare.com/ajax/libs/document-register-element/$LATEST_VERSION$/document-register-element.js"
  document.head.appendChild(polyfill);
} else {
  load();
}
```

## License

Copyright © 2014-2015 Julien Eluard.

Distributed under the Eclipse Public License, the same as Clojure.
