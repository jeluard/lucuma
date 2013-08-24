# Lucuma [![Travis CI status](https://secure.travis-ci.org/jeluard/lucuma.png)](http://travis-ci.org/#!/jeluard/lucuma/builds)

A Web Components library for ClojureScript.

Lucuma is similar conceptually to [polymer](http://www.polymer-project.org/), [x-tags](http://www.x-tags.org/) or dart's [web-ui](https://www.dartlang.org/articles/web-ui/).

Lucuma builds on top of [Custom Elements](https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/custom/index.html), [Shadow DOM](https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html) and [HTML Templates](https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/templates/index.html).

__Disclaimer__ technologies involved are pre-alpha (specs are not frozen yet). Use cautiously! It works great on evergreen browsers when using [polymer polyfill](http://www.polymer-project.org/getting-the-code.html).
Check the [compatibility matrix](http://www.polymer-project.org/compatibility.html) for more details.

## Installation

`lucuma` is available in Clojars. Add `[lucuma "0.1.0-SNAPSHOT"] `:dependency` to your `project.clj`.

## Usage

```clojure
(def proto (prototype {:content "Hello world!"})
(register 'my-element' proto)

;;alternatively you can use the defwebcomponent macro
(defwebcomponent my-element
  :content "Hello World!")
```

Once your Web Component is registered you can use it either programmatically:

```
;;append a my-element node to body
(.appendChild js/document.body (.createElement js/document "my-element"))
;;or using dommy and hiccup syntax
(dommy/append! (dommy/sel1 :body) [:my-element])
```

or simply add the node `<my-element></my-element>` directly to your document.

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
