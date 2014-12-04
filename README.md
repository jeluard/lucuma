# Lucuma [![License](http://img.shields.io/badge/license-EPL-blue.svg?style=flat)](https://www.eclipse.org/legal/epl-v10.html) [![Build Status](http://img.shields.io/travis/jeluard/lucuma.svg?style=flat)](http://travis-ci.org/#!/jeluard/lucuma/builds) [![Dependency Status](https://www.versioneye.com/user/projects/53975c7c83add7f33c00000d/badge.svg?style=flat)](https://www.versioneye.com/user/projects/53975c7c83add7f33c00000d)

[Getting Started](#getting-started) | [Usage](#usage) | [Browser support](#browser-support)

A [Web Components](http://webcomponents.org/) library for ClojureScript. Lucuma helps with creating reusable HTML elements encapsulating document, style and logic.

Lucuma is available in clojars as `[lucuma "0.3.0"]`.

## Getting Started

Define your custom element

```clojure
(defwebcomponent my-element
  :document "Hello!"
  :style "* {color: green;}"
  :properties {:threshold 10})
```

Register it

```clojure           
(register my-element)
```

Manipulate it like any HTML element

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

Once a Web Component is defined and registered in the current document a new HTML tag is available (named after the Web Component). It can be inserted in the DOM as any regular HTML element (including programmatically).

For encapsulation purpose document and style are optionally appended to a Shadow DOM.

### Lifecycle

Custom Elements define lifecycle callbacks that hook on element instance creation, DOM attachment and detachment.

You can hook functions to the element lifecycle using following keys:

* **on-created** called when an instance of the element is created (e.g. via document.createElement)
* **on-attached** called after an instance of the element is attached to the DOM
* **on-detached** called after an instance of the element is detached from the DOM

All functions receive as unique argument the element instance.

```clojure
(defwebcomponent my-element
  :document "Hello!"
  :on-created #(println % "created")
  :on-attached #(println % "attached")
  :on-detached #(println % "detached"))
```

### Document

Document of a Web Component comes from the **document** value that will be rendered based on its type then appended to the element. This process is triggered per instance during the creation phase.

The rendering process consists of:

1. call **render-document** multimethod (dispatch on document type) to generate the rendered html
2. call **install-rendered-document!** multimethod (dispatch on rendered document type) to insert document in the Custom Element.

**render-document** has implementations for *String*. 
**install-rendered-document!** have implementations for *String*, any *HTMLElement* and *DocumentFragment*.

Multiple document can be defined by providing a list as value. Each list value goes through the complete process as if it was defined as main document value.

```clojure
(defwebcomponent my-element
  :document (list "some" "content"))
```

#### ShadowDOM

If the current browser supports ShadowDOM document and style will be encapsulated in a lucuma specific ShadowRoot.
Usage of a ShadowDOM can be required when defining an element using **requires-shadow-dom?**. In this case the element registration will fail if the browser does not support ShadowDOM.

ShadowDOM provides a number of extra capacities and prevent name /id clashes.

#### Custom rendering

As rendering is delegated to the **render-document** multimethod custom logic can be hooked. A common use-case is to use a hiccup implementation (such as [hipo](https://github.com/jeluard/hipo)) to render vectors.

```clojure
(ns ...
  (:require-macros [hipo :refer [create]]))

(derive PersistentVector ::vector)
(defmethod render-document ::vector [v] (node v))

(defmethod render-document ::vector [v] (create v))

(defwebcomponent my-element
  :document [:div "content"])
```

### Style

Style is treated similarly to document.

The rendering process consists of:

1. call **render-style** multimethod (dispatch on document type) to generate the rendered style
2. call **install-rendered-style!** multimethod (dispatch on rendered style type) to insert style element in the DOM

**render-style** has implementations for *String*. 
**install-rendered-style!** has an implementation for *String*.

As for document, multiple style can be defined by providing a list as value.

```clojure
(defwebcomponent my-element
  :document "content"
  :style "span { background: blue; color: white; border: 0; border-radius: 4px;}")
```

#### Custom logic support

As rendering is delegated to the **render-style** multimethod custom logic can be hooked. A common use-case is to use a [garden](https://github.com/noprompt/garden) to render vectors.

```clojure
(derive PersistentVector ::vector)
(defmethod render-style ::vector [v] (node v))

(defmethod render-style ::vector [v] (garden/css v))

(defwebcomponent my-element
  :document "content"
  :style [:span {:background "#3d7c45" :color "white" :border 0 :border-radius (px 4)}])
```

#### Media Queries

Style can be defined as map allowing to provide **title** and **media** value on top of the **content**. Those values will be used when creating the style element and directly managed by the browser.

```clojure
(defwebcomponent my-element
  :document "content"
  :style {:media "screen and (min-width: 800px)" :title "Large Screen"
          :content [:span {:border "1px dotted black;"}]})
```

### Properties

Per instance properties can be accessed via JavaScript getter/setter and ClojureScript **get-property** / **set-property!**. When accessed via JavaScript values are properly converted in both directions. 
A property can be defined as a map with keys **default**, **type** (can be *:number*, *:boolean*, *:string*, *:keyword* or *:object*), **events?** and **attributes?** or as a single value (which will serve as default).

A property can be exported as HTML attribute if **attributes?** is set to true (default to true for *:number**, *:boolean* and *:string*). When created as an HTML element, attribute values will override defaults.

Changes to a property will fire DOM style events if **events?** is set to true (default to true for *:number*, *:boolean*, *:string* and *:object*).

```clojure
(defwebcomponent my-element
  :properties {:property1 "default"
               :property2 {:default 1 :type :number :events? true :attributes? true}})
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

Existing element can be inherit capacity from other elements via prototype inheritance. **prototype** value can be a keyword referencing valid HTML element (including Custom ones) or an existing prototype.

```clojure
(defwebcomponent my-element
  :prototype :div
  :document "content")

(defwebcomponent my-other-element
  :prototype js/HTMLButtonElement.prototype
  :document "content")
```

Alternatively a Custom Element can extend an existing element. **extends** value must be a keyword referencing valid HTML element (including Custom ones).
When both **prototype** and **extends** are provided **prototype** must include **extends** prototype in its prototype chain. If only **extends** is provided its prototype will be used directly.

The HTML element must then be declared using the following syntax:

```clojure
(defwebcomponent time-ago
  :extends :time)
```

```html
<time is="time-ago"></time>
```

```clojure
(defwebcomponent my-element
  :host [:div {:type "button"}]
  :document "content")
```

### Reuse

To improve element reuse defwebcomponent has advanced syntax allowing to introduce parametrization and reuse existing definition.

By providing a vector as first element of a defwebcomponent arguments can be defined that can then be used in the element definition. defwebcomponent type will then be a function that returns a map upon invocation. This map will have to be registered (as opposed to the defwebcomponent itself).

Also by providing a map as first element of a defwebcomponent (or second if vector are used) definitions of this map will be used as default.

```clojure
(def default
  {:document [:div "Hello reuse!"]
   :properties {:property "value"}})

(defwebcomponent my-element
  [value]
  default
  :properties {:threshold value})

(register (my-element 15))
```

## Browser support

Support for Custom Elements / ShadowDOM is appearing in recent browser releases. Some descent polyfill can be used for older browser:

* [WebComponents.org](http://webcomponents.org/polyfills/) polyfills both Custom Elements / ShadowDOM for evergreen browsers
* [document-register-element](https://github.com/WebReflection/document-register-element/) polyfill Custom Elements for pretty much all browsers and is pretty small

## License

Copyright © 2014 Julien Eluard.

Distributed under the Eclipse Public License, the same as Clojure.
