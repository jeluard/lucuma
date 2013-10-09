//Default extern files as defined by google closure can be found here: https://code.google.com/p/closure-compiler/source/browse/externs/

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
