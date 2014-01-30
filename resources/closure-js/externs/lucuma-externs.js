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
DOMImplementation.prototype.register = function(type, options) {};

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

var ShadowRoot = {};

/**
 * @type {bool}
 * @see http://w3c.github.io/webcomponents/spec/shadow/#widl-ShadowRoot-resetStyleInheritance
 */
ShadowRoot.prototype.resetStyleInheritance;

/**
 * Lucuma prototypes
 */

var lucuma = {};

/**
 * @see http://w3c.github.io/webcomponents/spec/custom/#dfn-created-callback
 */
lucuma.LucumaElement.prototype.createdCallback = function() {};

/**
 * @see http://w3c.github.io/webcomponents/spec/custom/#dfn-entered-view-callback
 */
lucuma.LucumaElement.prototype.attachedCallback = function() {};

/**
 * @see http://w3c.github.io/webcomponents/spec/custom/#dfn-left-view-callback
 */
lucuma.LucumaElement.prototype.detachedCallback = function() {};

/**
 * @param {string} name
 * @param {Object} oldValue
 * @param {Object} newValue
 * @see http://w3c.github.io/webcomponents/spec/custom/#dfn-attribute-changed-callback
 */
lucuma.LucumaElement.prototype.attributeChangedCallback = function(name, oldValue, newValue) {};


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
