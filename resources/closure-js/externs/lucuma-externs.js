//Default externs files as defined by google closure can be found here: https://code.google.com/p/closure-compiler/source/browse/externs/

/**
 * @param {string} type
 * @param {Object} options
 * @return {function}
 * @see https://dvcs.w3.org/hg/webcomponents/raw-file/default/spec/custom/index.html#dfn-document-register
 */
DOMImplementation.prototype.register = function(type, options) {};

/**
 * @return {ShadowRoot}
 * @see https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#api-partial-element-create-shadow-root
 */
Element.prototype.createShadowRoot = function() {};

var ShadowRoot = {};

/**
 * @type {bool}
 * @see https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#api-shadow-root-apply-author-styles
 */
ShadowRoot.prototype.applyAuthorStyles;

/**
 * @type {bool}
 * @see https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#api-shadow-root-reset-style-inheritance
 */
ShadowRoot.prototype.resetStyleInheritance;

var HTMLTemplateElement = {};

/**
 * @type {DocumentFragment}
 * @see https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/templates/index.html#api-html-template-element-content
 */
HTMLTemplateElement.prototype.content;

var lucuma = {};
var lucuma.LucumaElement = {};

/**
 * @type {string}
 */
LucumaElement.prototype.ns;

/**
 * @type {Object}
 */
LucumaElement.prototype.chan;

/**
 * @see https://dvcs.w3.org/hg/webcomponents/raw-file/default/spec/custom/index.html#dfn-created-callback
 */
LucumaElement.prototype.createdCallback = function() {};

/**
 * @see https://dvcs.w3.org/hg/webcomponents/raw-file/default/spec/custom/index.html#dfn-entered-view-callback
 */
LucumaElement.prototype.enteredViewCallback = function() {};

/**
 * @see https://dvcs.w3.org/hg/webcomponents/raw-file/default/spec/custom/index.html#dfn-left-view-callback
 */
LucumaElement.prototype.leftViewCallback = function() {};

/**
 * @param {string} name
 * @param {Object} oldValue
 * @param {Object} newValue
 * @see https://dvcs.w3.org/hg/webcomponents/raw-file/default/spec/custom/index.html#dfn-attribute-changed-callback
 */
LucumaElement.prototype.attributeChangedCallback = function(name, oldValue, newValue) {};
