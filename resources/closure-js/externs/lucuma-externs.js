//Default externs files as defined by google closure can be found here: https://code.google.com/p/closure-compiler/source/browse/externs/

/**
 * Extensions to DOM prototypes
 */

/**
 * @param {string} type
 * @param {Object} options
 * @return {function}
 * @see http://w3c.github.io/webcomponents/spec/custom/#dfn-document-registerElement
 */
DOMImplementation.prototype.registerElement = function(type, options) {};

/**
 * @type {ShadowRoot}
 * @see http://w3c.github.io/webcomponents/spec/shadow/#widl-Element-shadowRoot
 */
Element.prototype.shadowRoot;

/**
 * @return {ShadowRoot}
 * @see http://w3c.github.io/webcomponents/spec/shadow/#widl-Element-createShadowRoot-ShadowRoot
 */
Element.prototype.createShadowRoot = function() {};

/* http://w3c.github.io/webcomponents/spec/custom/#types-of-callback */
Element.prototype.createdCallback = function() {};
Element.prototype.attachedCallback = function() {};
Element.prototype.detachedCallback = function() {};
Element.prototype.attributeChangedCallback = function(name, oldValue, newValue) {};

var ShadowRoot = {};

/**
 * @type {Element}
 * @see http://w3c.github.io/webcomponents/spec/shadow/#widl-ShadowRoot-host
 */
ShadowRoot.prototype.host;

/**
 * @type {bool}
 * @see http://w3c.github.io/webcomponents/spec/shadow/#widl-ShadowRoot-resetStyleInheritance
 */
ShadowRoot.prototype.resetStyleInheritance;

/**
 * Polymer polyfill prototypes
 */

var Platform = {};
Platform.flags.shadow;
Platform.ShadowCSS.strictStyling;
Platform.ShadowCSS.prototype.shimStyling = function(root, name) {};
Platform.ShadowCSS.prototype.shimStyling = function(root, name, extendsName) {};

var MutationObserver = {};
MutationObserver.prototype.observe = function(el, options) {};

/**
 * Lucuma
 */

var lucuma = {};
lucuma.onElementsUpgraded = function() {};
