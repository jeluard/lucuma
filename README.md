# Lucuma [![Travis CI status](https://secure.travis-ci.org/jeluard/lucuma.png)](http://travis-ci.org/#!/jeluard/lucuma/builds)

A Web Components library for ClojureScript.

Lucuma is conceptually similar to [polymer](http://www.polymer-project.org/), [x-tags](http://www.x-tags.org/) or dart's [web-ui](https://www.dartlang.org/articles/web-ui/) and builds on top of [Custom Elements](https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/custom/index.html), [Shadow DOM](https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html) and [HTML Templates](https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/templates/index.html).

__Disclaimer__

Technologies involved are pre-alpha (specs are not frozen yet). Use cautiously! It works great on evergreen browsers when using [polymer polyfill](http://www.polymer-project.org/getting-the-code.html).
Check the [compatibility matrix](http://www.polymer-project.org/compatibility.html) for more details.

[Install](#install) | [Use](#use) | [Examples](/examples) | [Links](#links) | [License](#license)

## Install

Lucuma is available in Clojars. Add `[lucuma "0.1.0-SNAPSHOT"]` dependency to your `project.clj`.

## Use

### Custom Element definition

```clojure
;;First define your new element
(use 'lucuma.custom-elements)
(def proto (create-prototype {:content "Hello world!"})

;;then register it

(register "my-element" proto)

;;alternatively you can use the defwebcomponent macro

(use 'lucuma)
(defwebcomponent my-element
  :content "Hello World!")

(register my-element)
```

Once your Web Component is registered you can use it programmatically:

```clojure
;;append a my-element node to body
(.appendChild js/document.body (.createElement js/document "my-element"))

;;or using dommy and hiccup syntax
(dommy/append! (dommy/sel1 :body) [:my-element])
```

Alternatively you can directly use it as an html element:

```html
<!doctype html>
<html>
  <body>
    <my-element></my-element>
  </body>
</html>
```

### Lifecycle

You can hook function using following keys:

* `created-fn` will be called when the element is created via `document.createElement`
* `entered-document-fn` will be called each time the element is inserted in the document
* `left-document-fn` will be called each time the element is removed from the document

All functions receive as unique argument the targeted element.

```clojure
(defwebcomponent my-element
  :created-fn #(.log js/console (str % " has been created"))
  :entered-document-fn #(.log js/console (str % " has been inserted in the document"))
  :left-document-fn #(.log js/console % " (str has been removed from the document")))

(register my-element)

(def e (.createElement js/document "my-element") ;; => `created-fn` is called
(.appendChild js/document.body e) ;; => `entered-document-fn` is called
(.removeChild js/document.body e) ;; => `left-document-fn` is called
```

### Content definition

Content is first rendered with the `render-content` multimethod then appended via the `append!` multimethod, both applied in a row.
Out of the box `render-content` has implementations for String and HTMLTemplateElement and `append!` implementations for String, any HTMLElement and DocumentFragment.

HTML template can be directly used as content:

```html
<html>
  ...
  <template id="template-id">
    Hello world!
  </template>
  ...
</html>
```

```clojure
(defwebcomponent my-element
  :content (dommy.macros/sel1 :#template-id))
```

Add support to hiccup style vector by providing a custom render-content implementation:

```clojure
;; Use dommy.macros/node to render hiccup style vector as a DocumentFragment.

(derive PersistentVector ::vector)
(defmethod render-content ::vector [v] (node v))

(defwebcomponent my-element
  :content [:div "Hello world!"])
```

### Style definition

Style is first rendered with the `render-style` multimethod then appended via the `append!` multimethod, both applied in a row.
Out of the box `render-style` has implementations for String.

```clojure
(defwebcomponent my-element
  :style "div {background: green;}")
```

### Extend base type

Existing element can be extended ...

```clojure
(defcomponent my-button
  :base-type "button" ;; or js/HTMLButtonElement
  :style "button {background: red;}")
```

```html
<html>
  ...
  <button is="my-button">Hello world!</button>
  ...
</html>
```

`base-type` value can be an element name or a concrete prototype extending HTMLElement. It defaults to HTMLElement.

## Links

### Introdution

* http://www.w3.org/TR/components-intro/
* webcomponentsshift.com
* https://speakerdeck.com/stopsatgreen/web-components-getting-started

### Web Components library

* http://mozilla.github.io/brick/
* http://registry.x-tags.org/
* http://www.polymer-project.org/docs/elements/
* http://customelements.io/

### To go further

* http://www.html5rocks.com/en/tutorials/webcomponents/customelements/
* http://www.html5rocks.com/en/tutorials/webcomponents/template/
* http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/
* http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-201/
* http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-301/

## Native browser support

Browsers are [implementing](http://jonrimmer.github.io/are-we-componentized-yet/) Web Components technologies furiously those days. Still you have to enable their support manually.

### Chrome Canary

Check chrome progress [here](http://www.chromestatus.com/features).

Enable native Custom Elements support via the [enable-experimental-web-platform-features](chrome://flags/#enable-experimental-web-platform-features) flag.


## License

Copyright © 2013 Julien Eluard.

Distributed under the Eclipse Public License, the same as Clojure.
