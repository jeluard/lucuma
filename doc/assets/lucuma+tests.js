var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    var d;
    a = a.replace(/\\/g, "/");
    for(var e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = !0;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if(a.instance_) {
      return a.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a
  }
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return"undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
  if(goog.inHtmlDocument_()) {
    var b = goog.global.document;
    if("complete" == b.readyState) {
      if(/\bdeps.js$/.test(a)) {
        return!1
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    b.write('\x3cscript type\x3d"text/javascript" src\x3d"' + a + '"\x3e\x3c/script\x3e');
    return!0
  }
  return!1
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for(var g in d.requires[e]) {
          if(!goog.isProvided_(g)) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e))
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
};
goog.isDef = function(a) {
  return void 0 !== a
};
goog.isNull = function(a) {
  return null === a
};
goog.isDefAndNotNull = function(a) {
  return null != a
};
goog.isArray = function(a) {
  return"array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return"array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
  return"string" == typeof a
};
goog.isBoolean = function(a) {
  return"boolean" == typeof a
};
goog.isNumber = function(a) {
  return"number" == typeof a
};
goog.isFunction = function(a) {
  return"function" == goog.typeOf(a)
};
goog.isObject = function(a) {
  var b = typeof a;
  return"object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ \x3d 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d = function(a) {
    a = a.split("-");
    for(var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$");
    a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.getMsgWithFallback = function(a, b) {
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = !0
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.subs = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$");
    a = a.replace(/\%s/, d)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "\x3cbr /\x3e" : "\x3cbr\x3e")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "\x26amp;").replace(goog.string.ltRe_, "\x26lt;").replace(goog.string.gtRe_, "\x26gt;").replace(goog.string.quotRe_, "\x26quot;")
  }
  if(!goog.string.allRe_.test(a)) {
    return a
  }
  -1 != a.indexOf("\x26") && (a = a.replace(goog.string.amperRe_, "\x26amp;"));
  -1 != a.indexOf("\x3c") && (a = a.replace(goog.string.ltRe_, "\x26lt;"));
  -1 != a.indexOf("\x3e") && (a = a.replace(goog.string.gtRe_, "\x26gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "\x26quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "\x26") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = {"\x26amp;":"\x26", "\x26lt;":"\x3c", "\x26gt;":"\x3e", "\x26quot;":'"'}, c = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, e) {
    var f = b[a];
    if(f) {
      return f
    }
    if("#" == e.charAt(0)) {
      var g = Number("0" + e.substr(1));
      isNaN(g) || (f = String.fromCharCode(g))
    }
    f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
    return b[a] = f
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"\x26";
      case "lt":
        return"\x3c";
      case "gt":
        return"\x3e";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " \x26#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(31 < c && 127 > c) {
    b = a
  }else {
    if(256 > c) {
      if(b = "\\x", 16 > c || 256 < c) {
        b += "0"
      }
    }else {
      b = "\\u", 4096 > c && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b)
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && (b < a.length && 0 < c) && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", k = e[g] || "", l = RegExp("(\\d*)(\\D*)", "g"), m = RegExp("(\\d*)(\\D*)", "g");
    do {
      var n = l.exec(h) || ["", "", ""], p = m.exec(k) || ["", "", ""];
      if(0 == n[0].length && 0 == p[0].length) {
        break
      }
      var c = 0 == n[1].length ? 0 : parseInt(n[1], 10), r = 0 == p[1].length ? 0 : parseInt(p[1], 10), c = goog.string.compareElements_(c, r) || goog.string.compareElements_(0 == n[2].length, 0 == p[2].length) || goog.string.compareElements_(n[2], p[2])
    }while(0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  })
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase()
  })
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.debug = {};
goog.debug.Error = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    var e = e + (": " + c), f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1
  }
  for(;0 <= c;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.count = function(a, b, c) {
  var d = 0;
  goog.array.forEach(a, function(a, f, g) {
    b.call(c, a, f, g) && ++d
  }, c);
  return d
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var k = f + g >> 1, l;
    l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
    0 < l ? f = k + 1 : (g = k, h = !l)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for(var d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(0 < e || 0 == e && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for(var e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for(var d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if(0 != f) {
      return f
    }
  }
  return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b) {
  for(var c = {}, d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    goog.isDef(f) && (c[f] || (c[f] = [])).push(e)
  }
  return c
};
goog.array.toObject = function(a, b, c) {
  var d = {};
  goog.array.forEach(a, function(e, f) {
    d[b.call(c, e, f, a)] = e
  });
  return d
};
goog.array.range = function(a, b, c) {
  var d = [], e = 0, f = a;
  c = c || 1;
  void 0 !== b && (e = a, f = b);
  if(0 > c * (f - e)) {
    return[]
  }
  if(0 < c) {
    for(a = e;a < f;a += c) {
      d.push(a)
    }
  }else {
    for(a = e;a > f;a += c) {
      d.push(a)
    }
  }
  return d
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && (a = a[d[c]], goog.isDef(a));c++) {
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
goog.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b
};
goog.object.isImmutableView = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a)
};
goog.string.StringBuffer = function(a, b) {
  null != a && this.append.apply(this, arguments)
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(a) {
  this.buffer_ = "" + a
};
goog.string.StringBuffer.prototype.append = function(a, b, c) {
  this.buffer_ += a;
  if(null != b) {
    for(var d = 1;d < arguments.length;d++) {
      this.buffer_ += arguments[d]
    }
  }
  return this
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = ""
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_
};
var cljs = {core:{}};
cljs.core._STAR_unchecked_if_STAR_ = !1;
cljs.core._STAR_print_fn_STAR_ = function(a) {
  throw Error("No *print-fn* fn set for evaluation environment");
};
cljs.core.set_print_fn_BANG_ = function(a) {
  return cljs.core._STAR_print_fn_STAR_ = a
};
cljs.core._STAR_flush_on_newline_STAR_ = !0;
cljs.core._STAR_print_readably_STAR_ = !0;
cljs.core._STAR_print_meta_STAR_ = !1;
cljs.core._STAR_print_dup_STAR_ = !1;
cljs.core.pr_opts = function() {
  return cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "flush-on-newline", "flush-on-newline", 4338025857), cljs.core._STAR_flush_on_newline_STAR_, new cljs.core.Keyword(null, "readably", "readably", 4441712502), cljs.core._STAR_print_readably_STAR_, new cljs.core.Keyword(null, "meta", "meta", 1017252215), cljs.core._STAR_print_meta_STAR_, new cljs.core.Keyword(null, "dup", "dup", 1014004081), cljs.core._STAR_print_dup_STAR_], !0)
};
cljs.core.truth_ = function(a) {
  return null != a && !1 !== a
};
cljs.core.not_native = null;
cljs.core.identical_QMARK_ = function(a, b) {
  return a === b
};
cljs.core.nil_QMARK_ = function(a) {
  return null == a
};
cljs.core.array_QMARK_ = function(a) {
  return a instanceof Array
};
cljs.core.number_QMARK_ = function(a) {
  return"number" === typeof a
};
cljs.core.not = function(a) {
  return cljs.core.truth_(a) ? !1 : !0
};
cljs.core.string_QMARK_ = function(a) {
  return goog.isString(a)
};
cljs.core.type_satisfies_ = function(a, b) {
  return a[goog.typeOf(null == b ? null : b)] ? !0 : a._ ? !0 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? !1 : null
};
cljs.core.is_proto_ = function(a) {
  return a.constructor.prototype === a
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.type = function(a) {
  return null == a ? null : a.constructor
};
cljs.core.missing_protocol = function(a, b) {
  var c = cljs.core.type.call(null, b), c = cljs.core.truth_(cljs.core.truth_(c) ? c.cljs$lang$type : c) ? c.cljs$lang$ctorStr : goog.typeOf(b);
  return Error(["No protocol method ", a, " defined for type ", c, ": ", b].join(""))
};
cljs.core.type__GT_str = function(a) {
  var b = a.cljs$lang$ctorStr;
  return cljs.core.truth_(b) ? b : "" + cljs.core.str(a)
};
cljs.core.aclone = function(a) {
  return a.slice()
};
cljs.core.array = function(a) {
  return Array.prototype.slice.call(arguments)
};
cljs.core.make_array = function() {
  var a = null, b = function(b, d) {
    return a.call(null, d)
  }, a = function(a, d) {
    switch(arguments.length) {
      case 1:
        return Array(a);
      case 2:
        return b.call(this, a, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return Array(a)
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  return a
}();
cljs.core.aget = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.apply.call(null, a, a.call(null, b, c), d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 2:
        return a[d];
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a[b]
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.aset = function() {
  var a = null, b = function() {
    var b = function(b, c, d, h) {
      return cljs.core.apply.call(null, a, b[c], d, h)
    }, d = function(a, d, g, h) {
      var k = null;
      3 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, d, g, k)
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.next(a);
      var h = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, h, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e, f) {
    switch(arguments.length) {
      case 3:
        return a[d] = e;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, e, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = function(a, b, e) {
    return a[b] = e
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.alength = function(a) {
  return a.length
};
cljs.core.into_array = function() {
  var a = null, b = function(b) {
    return a.call(null, null, b)
  }, c = function(a, b) {
    return cljs.core.reduce.call(null, function(a, b) {
      a.push(b);
      return a
    }, [], b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.Fn = {};
cljs.core.IFn = {};
cljs.core._invoke = function() {
  var a = null, b = function(a) {
    if(a ? a.cljs$core$IFn$_invoke$arity$1 : a) {
      return a.cljs$core$IFn$_invoke$arity$1(a)
    }
    var b;
    b = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!b && (b = cljs.core._invoke._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return b.call(null, a)
  }, c = function(a, b) {
    if(a ? a.cljs$core$IFn$_invoke$arity$2 : a) {
      return a.cljs$core$IFn$_invoke$arity$2(a, b)
    }
    var c;
    c = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._invoke._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return c.call(null, a, b)
  }, d = function(a, b, c) {
    if(a ? a.cljs$core$IFn$_invoke$arity$3 : a) {
      return a.cljs$core$IFn$_invoke$arity$3(a, b, c)
    }
    var d;
    d = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!d && (d = cljs.core._invoke._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return d.call(null, a, b, c)
  }, e = function(a, b, c, d) {
    if(a ? a.cljs$core$IFn$_invoke$arity$4 : a) {
      return a.cljs$core$IFn$_invoke$arity$4(a, b, c, d)
    }
    var e;
    e = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!e && (e = cljs.core._invoke._, !e)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return e.call(null, a, b, c, d)
  }, f = function(a, b, c, d, e) {
    if(a ? a.cljs$core$IFn$_invoke$arity$5 : a) {
      return a.cljs$core$IFn$_invoke$arity$5(a, b, c, d, e)
    }
    var f;
    f = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!f && (f = cljs.core._invoke._, !f)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return f.call(null, a, b, c, d, e)
  }, g = function(a, b, c, d, e, f) {
    if(a ? a.cljs$core$IFn$_invoke$arity$6 : a) {
      return a.cljs$core$IFn$_invoke$arity$6(a, b, c, d, e, f)
    }
    var g;
    g = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._invoke._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return g.call(null, a, b, c, d, e, f)
  }, h = function(a, b, c, d, e, f, g) {
    if(a ? a.cljs$core$IFn$_invoke$arity$7 : a) {
      return a.cljs$core$IFn$_invoke$arity$7(a, b, c, d, e, f, g)
    }
    var h;
    h = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!h && (h = cljs.core._invoke._, !h)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return h.call(null, a, b, c, d, e, f, g)
  }, k = function(a, b, c, d, e, f, g, h) {
    if(a ? a.cljs$core$IFn$_invoke$arity$8 : a) {
      return a.cljs$core$IFn$_invoke$arity$8(a, b, c, d, e, f, g, h)
    }
    var k;
    k = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!k && (k = cljs.core._invoke._, !k)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return k.call(null, a, b, c, d, e, f, g, h)
  }, l = function(a, b, c, d, e, f, g, h, k) {
    if(a ? a.cljs$core$IFn$_invoke$arity$9 : a) {
      return a.cljs$core$IFn$_invoke$arity$9(a, b, c, d, e, f, g, h, k)
    }
    var m;
    m = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!m && (m = cljs.core._invoke._, !m)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return m.call(null, a, b, c, d, e, f, g, h, k)
  }, m = function(a, b, c, d, e, f, g, h, k, m) {
    if(a ? a.cljs$core$IFn$_invoke$arity$10 : a) {
      return a.cljs$core$IFn$_invoke$arity$10(a, b, c, d, e, f, g, h, k, m)
    }
    var l;
    l = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!l && (l = cljs.core._invoke._, !l)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return l.call(null, a, b, c, d, e, f, g, h, k, m)
  }, n = function(a, b, c, d, e, f, g, h, k, m, l) {
    if(a ? a.cljs$core$IFn$_invoke$arity$11 : a) {
      return a.cljs$core$IFn$_invoke$arity$11(a, b, c, d, e, f, g, h, k, m, l)
    }
    var p;
    p = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!p && (p = cljs.core._invoke._, !p)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return p.call(null, a, b, c, d, e, f, g, h, k, m, l)
  }, p = function(a, b, c, d, e, f, g, h, k, m, l, p) {
    if(a ? a.cljs$core$IFn$_invoke$arity$12 : a) {
      return a.cljs$core$IFn$_invoke$arity$12(a, b, c, d, e, f, g, h, k, m, l, p)
    }
    var n;
    n = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!n && (n = cljs.core._invoke._, !n)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return n.call(null, a, b, c, d, e, f, g, h, k, m, l, p)
  }, r = function(a, b, c, d, e, f, g, h, k, m, l, p, n) {
    if(a ? a.cljs$core$IFn$_invoke$arity$13 : a) {
      return a.cljs$core$IFn$_invoke$arity$13(a, b, c, d, e, f, g, h, k, m, l, p, n)
    }
    var s;
    s = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!s && (s = cljs.core._invoke._, !s)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return s.call(null, a, b, c, d, e, f, g, h, k, m, l, p, n)
  }, s = function(a, b, c, d, e, f, g, h, k, m, l, p, n, s) {
    if(a ? a.cljs$core$IFn$_invoke$arity$14 : a) {
      return a.cljs$core$IFn$_invoke$arity$14(a, b, c, d, e, f, g, h, k, m, l, p, n, s)
    }
    var q;
    q = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!q && (q = cljs.core._invoke._, !q)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return q.call(null, a, b, c, d, e, f, g, h, k, m, l, p, n, s)
  }, q = function(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q) {
    if(a ? a.cljs$core$IFn$_invoke$arity$15 : a) {
      return a.cljs$core$IFn$_invoke$arity$15(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q)
    }
    var r;
    r = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!r && (r = cljs.core._invoke._, !r)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return r.call(null, a, b, c, d, e, f, g, h, k, m, l, p, n, s, q)
  }, t = function(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r) {
    if(a ? a.cljs$core$IFn$_invoke$arity$16 : a) {
      return a.cljs$core$IFn$_invoke$arity$16(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r)
    }
    var t;
    t = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!t && (t = cljs.core._invoke._, !t)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return t.call(null, a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r)
  }, u = function(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t) {
    if(a ? a.cljs$core$IFn$_invoke$arity$17 : a) {
      return a.cljs$core$IFn$_invoke$arity$17(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t)
    }
    var v;
    v = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!v && (v = cljs.core._invoke._, !v)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return v.call(null, a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t)
  }, v = function(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v) {
    if(a ? a.cljs$core$IFn$_invoke$arity$18 : a) {
      return a.cljs$core$IFn$_invoke$arity$18(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v)
    }
    var u;
    u = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!u && (u = cljs.core._invoke._, !u)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return u.call(null, a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v)
  }, w = function(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v, u) {
    if(a ? a.cljs$core$IFn$_invoke$arity$19 : a) {
      return a.cljs$core$IFn$_invoke$arity$19(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v, u)
    }
    var w;
    w = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!w && (w = cljs.core._invoke._, !w)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return w.call(null, a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v, u)
  }, x = function(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v, u, w) {
    if(a ? a.cljs$core$IFn$_invoke$arity$20 : a) {
      return a.cljs$core$IFn$_invoke$arity$20(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v, u, w)
    }
    var x;
    x = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!x && (x = cljs.core._invoke._, !x)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return x.call(null, a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v, u, w)
  }, N = function(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v, u, w, x) {
    if(a ? a.cljs$core$IFn$_invoke$arity$21 : a) {
      return a.cljs$core$IFn$_invoke$arity$21(a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v, u, w, x)
    }
    var N;
    N = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!N && (N = cljs.core._invoke._, !N)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return N.call(null, a, b, c, d, e, f, g, h, k, m, l, p, n, s, q, r, t, v, u, w, x)
  }, a = function(a, y, A, B, E, G, H, I, K, z, C, F, D, P, Q, J, L, O, M, U, S) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, y);
      case 3:
        return d.call(this, a, y, A);
      case 4:
        return e.call(this, a, y, A, B);
      case 5:
        return f.call(this, a, y, A, B, E);
      case 6:
        return g.call(this, a, y, A, B, E, G);
      case 7:
        return h.call(this, a, y, A, B, E, G, H);
      case 8:
        return k.call(this, a, y, A, B, E, G, H, I);
      case 9:
        return l.call(this, a, y, A, B, E, G, H, I, K);
      case 10:
        return m.call(this, a, y, A, B, E, G, H, I, K, z);
      case 11:
        return n.call(this, a, y, A, B, E, G, H, I, K, z, C);
      case 12:
        return p.call(this, a, y, A, B, E, G, H, I, K, z, C, F);
      case 13:
        return r.call(this, a, y, A, B, E, G, H, I, K, z, C, F, D);
      case 14:
        return s.call(this, a, y, A, B, E, G, H, I, K, z, C, F, D, P);
      case 15:
        return q.call(this, a, y, A, B, E, G, H, I, K, z, C, F, D, P, Q);
      case 16:
        return t.call(this, a, y, A, B, E, G, H, I, K, z, C, F, D, P, Q, J);
      case 17:
        return u.call(this, a, y, A, B, E, G, H, I, K, z, C, F, D, P, Q, J, L);
      case 18:
        return v.call(this, a, y, A, B, E, G, H, I, K, z, C, F, D, P, Q, J, L, O);
      case 19:
        return w.call(this, a, y, A, B, E, G, H, I, K, z, C, F, D, P, Q, J, L, O, M);
      case 20:
        return x.call(this, a, y, A, B, E, G, H, I, K, z, C, F, D, P, Q, J, L, O, M, U);
      case 21:
        return N.call(this, a, y, A, B, E, G, H, I, K, z, C, F, D, P, Q, J, L, O, M, U, S)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$5 = f;
  a.cljs$core$IFn$_invoke$arity$6 = g;
  a.cljs$core$IFn$_invoke$arity$7 = h;
  a.cljs$core$IFn$_invoke$arity$8 = k;
  a.cljs$core$IFn$_invoke$arity$9 = l;
  a.cljs$core$IFn$_invoke$arity$10 = m;
  a.cljs$core$IFn$_invoke$arity$11 = n;
  a.cljs$core$IFn$_invoke$arity$12 = p;
  a.cljs$core$IFn$_invoke$arity$13 = r;
  a.cljs$core$IFn$_invoke$arity$14 = s;
  a.cljs$core$IFn$_invoke$arity$15 = q;
  a.cljs$core$IFn$_invoke$arity$16 = t;
  a.cljs$core$IFn$_invoke$arity$17 = u;
  a.cljs$core$IFn$_invoke$arity$18 = v;
  a.cljs$core$IFn$_invoke$arity$19 = w;
  a.cljs$core$IFn$_invoke$arity$20 = x;
  a.cljs$core$IFn$_invoke$arity$21 = N;
  return a
}();
cljs.core.ICounted = {};
cljs.core._count = function(a) {
  if(a ? a.cljs$core$ICounted$_count$arity$1 : a) {
    return a.cljs$core$ICounted$_count$arity$1(a)
  }
  var b;
  b = cljs.core._count[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._count._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ICounted.-count", a);
  }
  return b.call(null, a)
};
cljs.core.IEmptyableCollection = {};
cljs.core._empty = function(a) {
  if(a ? a.cljs$core$IEmptyableCollection$_empty$arity$1 : a) {
    return a.cljs$core$IEmptyableCollection$_empty$arity$1(a)
  }
  var b;
  b = cljs.core._empty[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._empty._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", a);
  }
  return b.call(null, a)
};
cljs.core.ICollection = {};
cljs.core._conj = function(a, b) {
  if(a ? a.cljs$core$ICollection$_conj$arity$2 : a) {
    return a.cljs$core$ICollection$_conj$arity$2(a, b)
  }
  var c;
  c = cljs.core._conj[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._conj._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ICollection.-conj", a);
  }
  return c.call(null, a, b)
};
cljs.core.IIndexed = {};
cljs.core._nth = function() {
  var a = null, b = function(a, b) {
    if(a ? a.cljs$core$IIndexed$_nth$arity$2 : a) {
      return a.cljs$core$IIndexed$_nth$arity$2(a, b)
    }
    var c;
    c = cljs.core._nth[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._nth._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
    }
    return c.call(null, a, b)
  }, c = function(a, b, c) {
    if(a ? a.cljs$core$IIndexed$_nth$arity$3 : a) {
      return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
    }
    var g;
    g = cljs.core._nth[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._nth._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
    }
    return g.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.ASeq = {};
cljs.core.ISeq = {};
cljs.core._first = function(a) {
  if(a ? a.cljs$core$ISeq$_first$arity$1 : a) {
    return a.cljs$core$ISeq$_first$arity$1(a)
  }
  var b;
  b = cljs.core._first[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeq.-first", a);
  }
  return b.call(null, a)
};
cljs.core._rest = function(a) {
  if(a ? a.cljs$core$ISeq$_rest$arity$1 : a) {
    return a.cljs$core$ISeq$_rest$arity$1(a)
  }
  var b;
  b = cljs.core._rest[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._rest._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeq.-rest", a);
  }
  return b.call(null, a)
};
cljs.core.INext = {};
cljs.core._next = function(a) {
  if(a ? a.cljs$core$INext$_next$arity$1 : a) {
    return a.cljs$core$INext$_next$arity$1(a)
  }
  var b;
  b = cljs.core._next[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._next._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INext.-next", a);
  }
  return b.call(null, a)
};
cljs.core.ILookup = {};
cljs.core._lookup = function() {
  var a = null, b = function(a, b) {
    if(a ? a.cljs$core$ILookup$_lookup$arity$2 : a) {
      return a.cljs$core$ILookup$_lookup$arity$2(a, b)
    }
    var c;
    c = cljs.core._lookup[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._lookup._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
    }
    return c.call(null, a, b)
  }, c = function(a, b, c) {
    if(a ? a.cljs$core$ILookup$_lookup$arity$3 : a) {
      return a.cljs$core$ILookup$_lookup$arity$3(a, b, c)
    }
    var g;
    g = cljs.core._lookup[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._lookup._, !g)) {
      throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
    }
    return g.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = function(a, b) {
  if(a ? a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 : a) {
    return a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(a, b)
  }
  var c;
  c = cljs.core._contains_key_QMARK_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._contains_key_QMARK_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", a);
  }
  return c.call(null, a, b)
};
cljs.core._assoc = function(a, b, c) {
  if(a ? a.cljs$core$IAssociative$_assoc$arity$3 : a) {
    return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._assoc[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IMap = {};
cljs.core._dissoc = function(a, b) {
  if(a ? a.cljs$core$IMap$_dissoc$arity$2 : a) {
    return a.cljs$core$IMap$_dissoc$arity$2(a, b)
  }
  var c;
  c = cljs.core._dissoc[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._dissoc._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", a);
  }
  return c.call(null, a, b)
};
cljs.core.IMapEntry = {};
cljs.core._key = function(a) {
  if(a ? a.cljs$core$IMapEntry$_key$arity$1 : a) {
    return a.cljs$core$IMapEntry$_key$arity$1(a)
  }
  var b;
  b = cljs.core._key[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._key._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMapEntry.-key", a);
  }
  return b.call(null, a)
};
cljs.core._val = function(a) {
  if(a ? a.cljs$core$IMapEntry$_val$arity$1 : a) {
    return a.cljs$core$IMapEntry$_val$arity$1(a)
  }
  var b;
  b = cljs.core._val[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._val._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMapEntry.-val", a);
  }
  return b.call(null, a)
};
cljs.core.ISet = {};
cljs.core._disjoin = function(a, b) {
  if(a ? a.cljs$core$ISet$_disjoin$arity$2 : a) {
    return a.cljs$core$ISet$_disjoin$arity$2(a, b)
  }
  var c;
  c = cljs.core._disjoin[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._disjoin._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", a);
  }
  return c.call(null, a, b)
};
cljs.core.IStack = {};
cljs.core._peek = function(a) {
  if(a ? a.cljs$core$IStack$_peek$arity$1 : a) {
    return a.cljs$core$IStack$_peek$arity$1(a)
  }
  var b;
  b = cljs.core._peek[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._peek._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IStack.-peek", a);
  }
  return b.call(null, a)
};
cljs.core._pop = function(a) {
  if(a ? a.cljs$core$IStack$_pop$arity$1 : a) {
    return a.cljs$core$IStack$_pop$arity$1(a)
  }
  var b;
  b = cljs.core._pop[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._pop._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IStack.-pop", a);
  }
  return b.call(null, a)
};
cljs.core.IVector = {};
cljs.core._assoc_n = function(a, b, c) {
  if(a ? a.cljs$core$IVector$_assoc_n$arity$3 : a) {
    return a.cljs$core$IVector$_assoc_n$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._assoc_n[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc_n._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IDeref = {};
cljs.core._deref = function(a) {
  if(a ? a.cljs$core$IDeref$_deref$arity$1 : a) {
    return a.cljs$core$IDeref$_deref$arity$1(a)
  }
  var b;
  b = cljs.core._deref[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._deref._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IDeref.-deref", a);
  }
  return b.call(null, a)
};
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = function(a, b, c) {
  if(a ? a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3 : a) {
    return a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._deref_with_timeout[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._deref_with_timeout._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IMeta = {};
cljs.core._meta = function(a) {
  if(a ? a.cljs$core$IMeta$_meta$arity$1 : a) {
    return a.cljs$core$IMeta$_meta$arity$1(a)
  }
  var b;
  b = cljs.core._meta[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._meta._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMeta.-meta", a);
  }
  return b.call(null, a)
};
cljs.core.IWithMeta = {};
cljs.core._with_meta = function(a, b) {
  if(a ? a.cljs$core$IWithMeta$_with_meta$arity$2 : a) {
    return a.cljs$core$IWithMeta$_with_meta$arity$2(a, b)
  }
  var c;
  c = cljs.core._with_meta[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._with_meta._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", a);
  }
  return c.call(null, a, b)
};
cljs.core.IReduce = {};
cljs.core._reduce = function() {
  var a = null, b = function(a, b) {
    if(a ? a.cljs$core$IReduce$_reduce$arity$2 : a) {
      return a.cljs$core$IReduce$_reduce$arity$2(a, b)
    }
    var c;
    c = cljs.core._reduce[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._reduce._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
    }
    return c.call(null, a, b)
  }, c = function(a, b, c) {
    if(a ? a.cljs$core$IReduce$_reduce$arity$3 : a) {
      return a.cljs$core$IReduce$_reduce$arity$3(a, b, c)
    }
    var g;
    g = cljs.core._reduce[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._reduce._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
    }
    return g.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.IKVReduce = {};
cljs.core._kv_reduce = function(a, b, c) {
  if(a ? a.cljs$core$IKVReduce$_kv_reduce$arity$3 : a) {
    return a.cljs$core$IKVReduce$_kv_reduce$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._kv_reduce[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._kv_reduce._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IKVReduce.-kv-reduce", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IEquiv = {};
cljs.core._equiv = function(a, b) {
  if(a ? a.cljs$core$IEquiv$_equiv$arity$2 : a) {
    return a.cljs$core$IEquiv$_equiv$arity$2(a, b)
  }
  var c;
  c = cljs.core._equiv[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._equiv._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", a);
  }
  return c.call(null, a, b)
};
cljs.core.IHash = {};
cljs.core._hash = function(a) {
  if(a ? a.cljs$core$IHash$_hash$arity$1 : a) {
    return a.cljs$core$IHash$_hash$arity$1(a)
  }
  var b;
  b = cljs.core._hash[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._hash._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IHash.-hash", a);
  }
  return b.call(null, a)
};
cljs.core.ISeqable = {};
cljs.core._seq = function(a) {
  if(a ? a.cljs$core$ISeqable$_seq$arity$1 : a) {
    return a.cljs$core$ISeqable$_seq$arity$1(a)
  }
  var b;
  b = cljs.core._seq[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._seq._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", a);
  }
  return b.call(null, a)
};
cljs.core.ISequential = {};
cljs.core.IList = {};
cljs.core.IRecord = {};
cljs.core.IReversible = {};
cljs.core._rseq = function(a) {
  if(a ? a.cljs$core$IReversible$_rseq$arity$1 : a) {
    return a.cljs$core$IReversible$_rseq$arity$1(a)
  }
  var b;
  b = cljs.core._rseq[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._rseq._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IReversible.-rseq", a);
  }
  return b.call(null, a)
};
cljs.core.ISorted = {};
cljs.core._sorted_seq = function(a, b) {
  if(a ? a.cljs$core$ISorted$_sorted_seq$arity$2 : a) {
    return a.cljs$core$ISorted$_sorted_seq$arity$2(a, b)
  }
  var c;
  c = cljs.core._sorted_seq[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._sorted_seq._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq", a);
  }
  return c.call(null, a, b)
};
cljs.core._sorted_seq_from = function(a, b, c) {
  if(a ? a.cljs$core$ISorted$_sorted_seq_from$arity$3 : a) {
    return a.cljs$core$ISorted$_sorted_seq_from$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._sorted_seq_from[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._sorted_seq_from._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq-from", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._entry_key = function(a, b) {
  if(a ? a.cljs$core$ISorted$_entry_key$arity$2 : a) {
    return a.cljs$core$ISorted$_entry_key$arity$2(a, b)
  }
  var c;
  c = cljs.core._entry_key[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._entry_key._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-entry-key", a);
  }
  return c.call(null, a, b)
};
cljs.core._comparator = function(a) {
  if(a ? a.cljs$core$ISorted$_comparator$arity$1 : a) {
    return a.cljs$core$ISorted$_comparator$arity$1(a)
  }
  var b;
  b = cljs.core._comparator[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._comparator._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-comparator", a);
  }
  return b.call(null, a)
};
cljs.core.IWriter = {};
cljs.core._write = function(a, b) {
  if(a ? a.cljs$core$IWriter$_write$arity$2 : a) {
    return a.cljs$core$IWriter$_write$arity$2(a, b)
  }
  var c;
  c = cljs.core._write[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._write._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWriter.-write", a);
  }
  return c.call(null, a, b)
};
cljs.core._flush = function(a) {
  if(a ? a.cljs$core$IWriter$_flush$arity$1 : a) {
    return a.cljs$core$IWriter$_flush$arity$1(a)
  }
  var b;
  b = cljs.core._flush[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._flush._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IWriter.-flush", a);
  }
  return b.call(null, a)
};
cljs.core.IPrintWithWriter = {};
cljs.core._pr_writer = function(a, b, c) {
  if(a ? a.cljs$core$IPrintWithWriter$_pr_writer$arity$3 : a) {
    return a.cljs$core$IPrintWithWriter$_pr_writer$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._pr_writer[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._pr_writer._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IPrintWithWriter.-pr-writer", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = function(a) {
  if(a ? a.cljs$core$IPending$_realized_QMARK_$arity$1 : a) {
    return a.cljs$core$IPending$_realized_QMARK_$arity$1(a)
  }
  var b;
  b = cljs.core._realized_QMARK_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._realized_QMARK_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IPending.-realized?", a);
  }
  return b.call(null, a)
};
cljs.core.IWatchable = {};
cljs.core._notify_watches = function(a, b, c) {
  if(a ? a.cljs$core$IWatchable$_notify_watches$arity$3 : a) {
    return a.cljs$core$IWatchable$_notify_watches$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._notify_watches[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._notify_watches._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._add_watch = function(a, b, c) {
  if(a ? a.cljs$core$IWatchable$_add_watch$arity$3 : a) {
    return a.cljs$core$IWatchable$_add_watch$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._add_watch[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._add_watch._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._remove_watch = function(a, b) {
  if(a ? a.cljs$core$IWatchable$_remove_watch$arity$2 : a) {
    return a.cljs$core$IWatchable$_remove_watch$arity$2(a, b)
  }
  var c;
  c = cljs.core._remove_watch[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._remove_watch._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", a);
  }
  return c.call(null, a, b)
};
cljs.core.IEditableCollection = {};
cljs.core._as_transient = function(a) {
  if(a ? a.cljs$core$IEditableCollection$_as_transient$arity$1 : a) {
    return a.cljs$core$IEditableCollection$_as_transient$arity$1(a)
  }
  var b;
  b = cljs.core._as_transient[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._as_transient._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEditableCollection.-as-transient", a);
  }
  return b.call(null, a)
};
cljs.core.ITransientCollection = {};
cljs.core._conj_BANG_ = function(a, b) {
  if(a ? a.cljs$core$ITransientCollection$_conj_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientCollection$_conj_BANG_$arity$2(a, b)
  }
  var c;
  c = cljs.core._conj_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._conj_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientCollection.-conj!", a);
  }
  return c.call(null, a, b)
};
cljs.core._persistent_BANG_ = function(a) {
  if(a ? a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 : a) {
    return a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(a)
  }
  var b;
  b = cljs.core._persistent_BANG_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._persistent_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ITransientCollection.-persistent!", a);
  }
  return b.call(null, a)
};
cljs.core.ITransientAssociative = {};
cljs.core._assoc_BANG_ = function(a, b, c) {
  if(a ? a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 : a) {
    return a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._assoc_BANG_[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ITransientAssociative.-assoc!", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.ITransientMap = {};
cljs.core._dissoc_BANG_ = function(a, b) {
  if(a ? a.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(a, b)
  }
  var c;
  c = cljs.core._dissoc_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._dissoc_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientMap.-dissoc!", a);
  }
  return c.call(null, a, b)
};
cljs.core.ITransientVector = {};
cljs.core._assoc_n_BANG_ = function(a, b, c) {
  if(a ? a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 : a) {
    return a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._assoc_n_BANG_[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc_n_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ITransientVector.-assoc-n!", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._pop_BANG_ = function(a) {
  if(a ? a.cljs$core$ITransientVector$_pop_BANG_$arity$1 : a) {
    return a.cljs$core$ITransientVector$_pop_BANG_$arity$1(a)
  }
  var b;
  b = cljs.core._pop_BANG_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._pop_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ITransientVector.-pop!", a);
  }
  return b.call(null, a)
};
cljs.core.ITransientSet = {};
cljs.core._disjoin_BANG_ = function(a, b) {
  if(a ? a.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(a, b)
  }
  var c;
  c = cljs.core._disjoin_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._disjoin_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientSet.-disjoin!", a);
  }
  return c.call(null, a, b)
};
cljs.core.IComparable = {};
cljs.core._compare = function(a, b) {
  if(a ? a.cljs$core$IComparable$_compare$arity$2 : a) {
    return a.cljs$core$IComparable$_compare$arity$2(a, b)
  }
  var c;
  c = cljs.core._compare[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._compare._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IComparable.-compare", a);
  }
  return c.call(null, a, b)
};
cljs.core.IChunk = {};
cljs.core._drop_first = function(a) {
  if(a ? a.cljs$core$IChunk$_drop_first$arity$1 : a) {
    return a.cljs$core$IChunk$_drop_first$arity$1(a)
  }
  var b;
  b = cljs.core._drop_first[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._drop_first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunk.-drop-first", a);
  }
  return b.call(null, a)
};
cljs.core.IChunkedSeq = {};
cljs.core._chunked_first = function(a) {
  if(a ? a.cljs$core$IChunkedSeq$_chunked_first$arity$1 : a) {
    return a.cljs$core$IChunkedSeq$_chunked_first$arity$1(a)
  }
  var b;
  b = cljs.core._chunked_first[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._chunked_first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-first", a);
  }
  return b.call(null, a)
};
cljs.core._chunked_rest = function(a) {
  if(a ? a.cljs$core$IChunkedSeq$_chunked_rest$arity$1 : a) {
    return a.cljs$core$IChunkedSeq$_chunked_rest$arity$1(a)
  }
  var b;
  b = cljs.core._chunked_rest[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._chunked_rest._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-rest", a);
  }
  return b.call(null, a)
};
cljs.core.IChunkedNext = {};
cljs.core._chunked_next = function(a) {
  if(a ? a.cljs$core$IChunkedNext$_chunked_next$arity$1 : a) {
    return a.cljs$core$IChunkedNext$_chunked_next$arity$1(a)
  }
  var b;
  b = cljs.core._chunked_next[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._chunked_next._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedNext.-chunked-next", a);
  }
  return b.call(null, a)
};
cljs.core.INamed = {};
cljs.core._name = function(a) {
  if(a ? a.cljs$core$INamed$_name$arity$1 : a) {
    return a.cljs$core$INamed$_name$arity$1(a)
  }
  var b;
  b = cljs.core._name[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._name._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INamed.-name", a);
  }
  return b.call(null, a)
};
cljs.core._namespace = function(a) {
  if(a ? a.cljs$core$INamed$_namespace$arity$1 : a) {
    return a.cljs$core$INamed$_namespace$arity$1(a)
  }
  var b;
  b = cljs.core._namespace[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._namespace._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INamed.-namespace", a);
  }
  return b.call(null, a)
};
cljs.core.StringBufferWriter = function(a) {
  this.sb = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1073741824
};
cljs.core.StringBufferWriter.cljs$lang$type = !0;
cljs.core.StringBufferWriter.cljs$lang$ctorStr = "cljs.core/StringBufferWriter";
cljs.core.StringBufferWriter.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/StringBufferWriter")
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_write$arity$2 = function(a, b) {
  return this.sb.append(b)
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_flush$arity$1 = function(a) {
  return null
};
cljs.core.__GT_StringBufferWriter = function(a) {
  return new cljs.core.StringBufferWriter(a)
};
cljs.core.pr_str_STAR_ = function(a) {
  var b = new goog.string.StringBuffer, c = new cljs.core.StringBufferWriter(b);
  cljs.core._pr_writer.call(null, a, c, cljs.core.pr_opts.call(null));
  cljs.core._flush.call(null, c);
  return"" + cljs.core.str(b)
};
cljs.core.instance_QMARK_ = function(a, b) {
  return b instanceof a
};
cljs.core.symbol_QMARK_ = function(a) {
  return a instanceof cljs.core.Symbol
};
cljs.core.hash_symbol = function(a) {
  return cljs.core.hash_combine.call(null, cljs.core.hash.call(null, a.ns), cljs.core.hash.call(null, a.name))
};
cljs.core.Symbol = function(a, b, c, d, e) {
  this.ns = a;
  this.name = b;
  this.str = c;
  this._hash = d;
  this._meta = e;
  this.cljs$lang$protocol_mask$partition0$ = 2154168321;
  this.cljs$lang$protocol_mask$partition1$ = 4096
};
cljs.core.Symbol.cljs$lang$type = !0;
cljs.core.Symbol.cljs$lang$ctorStr = "cljs.core/Symbol";
cljs.core.Symbol.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Symbol")
};
cljs.core.Symbol.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, this.str)
};
cljs.core.Symbol.prototype.cljs$core$INamed$_name$arity$1 = function(a) {
  return this.name
};
cljs.core.Symbol.prototype.cljs$core$INamed$_namespace$arity$1 = function(a) {
  return this.ns
};
cljs.core.Symbol.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this._hash;
  return null != b ? b : this._hash = a = cljs.core.hash_symbol.call(null, a)
};
cljs.core.Symbol.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Symbol(this.ns, this.name, this.str, this._hash, b)
};
cljs.core.Symbol.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta
};
cljs.core.Symbol.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, c, this, null);
      case 3:
        return cljs.core._lookup.call(null, c, this, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.Symbol.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.Symbol.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof cljs.core.Symbol ? this.str === b.str : !1
};
cljs.core.Symbol.prototype.toString = function() {
  return this.str
};
cljs.core.__GT_Symbol = function(a, b, c, d, e) {
  return new cljs.core.Symbol(a, b, c, d, e)
};
cljs.core.symbol = function() {
  var a = null, b = function(b) {
    return b instanceof cljs.core.Symbol ? b : a.call(null, null, b)
  }, c = function(a, b) {
    var c = null != a ? [cljs.core.str(a), cljs.core.str("/"), cljs.core.str(b)].join("") : b;
    return new cljs.core.Symbol(a, b, c, null, null)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.seq = function(a) {
  if(null == a) {
    return null
  }
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 8388608) ? b : a.cljs$core$ISeqable$, b = b ? !0 : !1) : b = !1;
  if(b) {
    return cljs.core._seq.call(null, a)
  }
  if(a instanceof Array || "string" === typeof a) {
    return 0 === a.length ? null : new cljs.core.IndexedSeq(a, 0)
  }
  if(cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, a)) {
    return cljs.core._seq.call(null, a)
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error([cljs.core.str(a), cljs.core.str("is not ISeqable")].join(""));
  }
  return null
};
cljs.core.first = function(a) {
  if(null == a) {
    return null
  }
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$, b = b ? !0 : !1) : b = !1;
  if(b) {
    return cljs.core._first.call(null, a)
  }
  a = cljs.core.seq.call(null, a);
  return null == a ? null : cljs.core._first.call(null, a)
};
cljs.core.rest = function(a) {
  if(null != a) {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$, b = b ? !0 : !1) : b = !1;
    if(b) {
      return cljs.core._rest.call(null, a)
    }
    a = cljs.core.seq.call(null, a);
    return null != a ? cljs.core._rest.call(null, a) : cljs.core.List.EMPTY
  }
  return cljs.core.List.EMPTY
};
cljs.core.next = function(a) {
  if(null == a) {
    a = null
  }else {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$, b = b ? !0 : !1) : b = !1;
    a = b ? cljs.core._next.call(null, a) : cljs.core.seq.call(null, cljs.core.rest.call(null, a))
  }
  return a
};
cljs.core._EQ_ = function() {
  var a = null, b = function(a, b) {
    var c = a === b;
    return c ? c : cljs.core._equiv.call(null, a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.call(null, b, c))) {
          if(cljs.core.next.call(null, d)) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
          }else {
            return a.call(null, c, cljs.core.first.call(null, d))
          }
        }else {
          return!1
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.IHash["null"] = !0;
cljs.core._hash["null"] = function(a) {
  return 0
};
cljs.core.INext["null"] = !0;
cljs.core._next["null"] = function(a) {
  return null
};
cljs.core.IKVReduce["null"] = !0;
cljs.core._kv_reduce["null"] = function(a, b, c) {
  return c
};
cljs.core.ISet["null"] = !0;
cljs.core._disjoin["null"] = function(a, b) {
  return null
};
cljs.core.ICounted["null"] = !0;
cljs.core._count["null"] = function(a) {
  return 0
};
cljs.core.IStack["null"] = !0;
cljs.core._peek["null"] = function(a) {
  return null
};
cljs.core._pop["null"] = function(a) {
  return null
};
cljs.core.IEquiv["null"] = !0;
cljs.core._equiv["null"] = function(a, b) {
  return null == b
};
cljs.core.IWithMeta["null"] = !0;
cljs.core._with_meta["null"] = function(a, b) {
  return null
};
cljs.core.IMeta["null"] = !0;
cljs.core._meta["null"] = function(a) {
  return null
};
cljs.core.IEmptyableCollection["null"] = !0;
cljs.core._empty["null"] = function(a) {
  return null
};
cljs.core.IMap["null"] = !0;
cljs.core._dissoc["null"] = function(a, b) {
  return null
};
Date.prototype.cljs$core$IEquiv$ = !0;
Date.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = b instanceof Date;
  return c ? a.toString() === b.toString() : c
};
cljs.core.IHash.number = !0;
cljs.core._hash.number = function(a) {
  return Math.floor(a) % 2147483647
};
cljs.core.IEquiv.number = !0;
cljs.core._equiv.number = function(a, b) {
  return a === b
};
cljs.core.IHash["boolean"] = !0;
cljs.core._hash["boolean"] = function(a) {
  return!0 === a ? 1 : 0
};
cljs.core.IMeta["function"] = !0;
cljs.core._meta["function"] = function(a) {
  return null
};
cljs.core.Fn["function"] = !0;
cljs.core.IHash._ = !0;
cljs.core._hash._ = function(a) {
  return goog.getUid(a)
};
cljs.core.inc = function(a) {
  return a + 1
};
cljs.core.Reduced = function(a) {
  this.val = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32768
};
cljs.core.Reduced.cljs$lang$type = !0;
cljs.core.Reduced.cljs$lang$ctorStr = "cljs.core/Reduced";
cljs.core.Reduced.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Reduced")
};
cljs.core.Reduced.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  return this.val
};
cljs.core.__GT_Reduced = function(a) {
  return new cljs.core.Reduced(a)
};
cljs.core.reduced = function(a) {
  return new cljs.core.Reduced(a)
};
cljs.core.reduced_QMARK_ = function(a) {
  return a instanceof cljs.core.Reduced
};
cljs.core.ci_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core._count.call(null, a);
    if(0 === c) {
      return b.call(null)
    }
    for(var d = cljs.core._nth.call(null, a, 0), k = 1;;) {
      if(k < c) {
        d = b.call(null, d, cljs.core._nth.call(null, a, k));
        if(cljs.core.reduced_QMARK_.call(null, d)) {
          return cljs.core.deref.call(null, d)
        }
        k += 1
      }else {
        return d
      }
    }
  }, c = function(a, b, c) {
    for(var d = cljs.core._count.call(null, a), k = 0;;) {
      if(k < d) {
        c = b.call(null, c, cljs.core._nth.call(null, a, k));
        if(cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c)
        }
        k += 1
      }else {
        return c
      }
    }
  }, d = function(a, b, c, d) {
    for(var k = cljs.core._count.call(null, a);;) {
      if(d < k) {
        c = b.call(null, c, cljs.core._nth.call(null, a, d));
        if(cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c)
        }
        d += 1
      }else {
        return c
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.array_reduce = function() {
  var a = null, b = function(a, b) {
    var c = a.length;
    if(0 === a.length) {
      return b.call(null)
    }
    for(var d = a[0], k = 1;;) {
      if(k < c) {
        d = b.call(null, d, a[k]);
        if(cljs.core.reduced_QMARK_.call(null, d)) {
          return cljs.core.deref.call(null, d)
        }
        k += 1
      }else {
        return d
      }
    }
  }, c = function(a, b, c) {
    for(var d = a.length, k = 0;;) {
      if(k < d) {
        c = b.call(null, c, a[k]);
        if(cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c)
        }
        k += 1
      }else {
        return c
      }
    }
  }, d = function(a, b, c, d) {
    for(var k = a.length;;) {
      if(d < k) {
        c = b.call(null, c, a[d]);
        if(cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c)
        }
        d += 1
      }else {
        return c
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.counted_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 2) ? b : a.cljs$core$ICounted$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ICounted, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, a)
};
cljs.core.indexed_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 16) ? b : a.cljs$core$IIndexed$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, a)
};
cljs.core.IndexedSeq = function(a, b) {
  this.arr = a;
  this.i = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 166199550
};
cljs.core.IndexedSeq.cljs$lang$type = !0;
cljs.core.IndexedSeq.cljs$lang$ctorStr = "cljs.core/IndexedSeq";
cljs.core.IndexedSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/IndexedSeq")
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.i + 1 < this.arr.length ? new cljs.core.IndexedSeq(this.arr, this.i + 1) : null
};
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  var b = a.cljs$core$ICounted$_count$arity$1(a);
  return 0 < b ? new cljs.core.RSeq(a, b - 1, null) : cljs.core.List.EMPTY
};
cljs.core.IndexedSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.array_reduce.call(null, this.arr, b, this.arr[this.i], this.i + 1)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.array_reduce.call(null, this.arr, b, c, this.i)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.arr.length - this.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.arr[this.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.i + 1 < this.arr.length ? new cljs.core.IndexedSeq(this.arr, this.i + 1) : cljs.core.list.call(null)
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  var c = b + this.i;
  return c < this.arr.length ? this.arr[c] : null
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = b + this.i;
  return a < this.arr.length ? this.arr[a] : c
};
cljs.core.IndexedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.List.EMPTY
};
cljs.core.__GT_IndexedSeq = function(a, b) {
  return new cljs.core.IndexedSeq(a, b)
};
cljs.core.prim_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0)
  }, c = function(a, b) {
    return b < a.length ? new cljs.core.IndexedSeq(a, b) : null
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.array_seq = function() {
  var a = null, b = function(a) {
    return cljs.core.prim_seq.call(null, a, 0)
  }, c = function(a, b) {
    return cljs.core.prim_seq.call(null, a, b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.RSeq = function(a, b, c) {
  this.ci = a;
  this.i = b;
  this.meta = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374862
};
cljs.core.RSeq.cljs$lang$type = !0;
cljs.core.RSeq.cljs$lang$ctorStr = "cljs.core/RSeq";
cljs.core.RSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/RSeq")
};
cljs.core.RSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.RSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.RSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.RSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.RSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.RSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.RSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.i + 1
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core._nth.call(null, this.ci, this.i)
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 0 < this.i ? new cljs.core.RSeq(this.ci, this.i - 1, null) : cljs.core.List.EMPTY
};
cljs.core.RSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.RSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.RSeq(this.ci, this.i, b)
};
cljs.core.RSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.RSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_RSeq = function(a, b, c) {
  return new cljs.core.RSeq(a, b, c)
};
cljs.core.second = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a))
};
cljs.core.ffirst = function(a) {
  return cljs.core.first.call(null, cljs.core.first.call(null, a))
};
cljs.core.nfirst = function(a) {
  return cljs.core.next.call(null, cljs.core.first.call(null, a))
};
cljs.core.fnext = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a))
};
cljs.core.nnext = function(a) {
  return cljs.core.next.call(null, cljs.core.next.call(null, a))
};
cljs.core.last = function(a) {
  for(;;) {
    var b = cljs.core.next.call(null, a);
    if(null != b) {
      a = b
    }else {
      return cljs.core.first.call(null, a)
    }
  }
};
cljs.core.IEquiv._ = !0;
cljs.core._equiv._ = function(a, b) {
  return a === b
};
cljs.core.conj = function() {
  var a = null, b = function(a, b) {
    return null != a ? cljs.core._conj.call(null, a, b) : cljs.core.list.call(null, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(d)) {
          b = a.call(null, b, c), c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return a.call(null, b, c)
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.empty = function(a) {
  return cljs.core._empty.call(null, a)
};
cljs.core.accumulating_seq_count = function(a) {
  a = cljs.core.seq.call(null, a);
  for(var b = 0;;) {
    if(cljs.core.counted_QMARK_.call(null, a)) {
      return b + cljs.core._count.call(null, a)
    }
    a = cljs.core.next.call(null, a);
    b += 1
  }
};
cljs.core.count = function(a) {
  if(null != a) {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 2) ? b : a.cljs$core$ICounted$, b = b ? !0 : !1) : b = !1;
    a = b ? cljs.core._count.call(null, a) : a instanceof Array ? a.length : "string" === typeof a ? a.length : cljs.core.type_satisfies_.call(null, cljs.core.ICounted, a) ? cljs.core._count.call(null, a) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.accumulating_seq_count.call(null, a) : null
  }else {
    a = 0
  }
  return a
};
cljs.core.linear_traversal_nth = function() {
  var a = null, b = function(a, b) {
    for(;;) {
      if(null == a) {
        throw Error("Index out of bounds");
      }
      if(0 === b) {
        if(cljs.core.seq.call(null, a)) {
          return cljs.core.first.call(null, a)
        }
        throw Error("Index out of bounds");
      }
      if(cljs.core.indexed_QMARK_.call(null, a)) {
        return cljs.core._nth.call(null, a, b)
      }
      if(cljs.core.seq.call(null, a)) {
        var c = cljs.core.next.call(null, a), g = b - 1;
        a = c;
        b = g
      }else {
        if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
          throw Error("Index out of bounds");
        }
        return null
      }
    }
  }, c = function(a, b, c) {
    for(;;) {
      if(null == a) {
        return c
      }
      if(0 === b) {
        return cljs.core.seq.call(null, a) ? cljs.core.first.call(null, a) : c
      }
      if(cljs.core.indexed_QMARK_.call(null, a)) {
        return cljs.core._nth.call(null, a, b, c)
      }
      if(cljs.core.seq.call(null, a)) {
        a = cljs.core.next.call(null, a), b -= 1
      }else {
        return new cljs.core.Keyword(null, "else", "else", 1017020587) ? c : null
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.nth = function() {
  var a = null, b = function(a, b) {
    if(null == a) {
      return null
    }
    if(function() {
      if(a) {
        var b;
        b = (b = a.cljs$lang$protocol_mask$partition0$ & 16) ? b : a.cljs$core$IIndexed$;
        return b ? !0 : !1
      }
      return!1
    }()) {
      return cljs.core._nth.call(null, a, Math.floor(b))
    }
    if(a instanceof Array || "string" === typeof a) {
      return b < a.length ? a[b] : null
    }
    if(cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, a)) {
      return cljs.core._nth.call(null, a, b)
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      if(function() {
        if(a) {
          var b;
          b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$;
          return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
        }
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
      }()) {
        return cljs.core.linear_traversal_nth.call(null, a, Math.floor(b))
      }
      throw Error([cljs.core.str("nth not supported on this type "), cljs.core.str(cljs.core.type__GT_str.call(null, cljs.core.type.call(null, a)))].join(""));
    }
    return null
  }, c = function(a, b, c) {
    if(null != a) {
      if(function() {
        if(a) {
          var b;
          b = (b = a.cljs$lang$protocol_mask$partition0$ & 16) ? b : a.cljs$core$IIndexed$;
          return b ? !0 : !1
        }
        return!1
      }()) {
        return cljs.core._nth.call(null, a, Math.floor(b), c)
      }
      if(a instanceof Array || "string" === typeof a) {
        return b < a.length ? a[b] : c
      }
      if(cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, a)) {
        return cljs.core._nth.call(null, a, b)
      }
      if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
        if(function() {
          if(a) {
            var b;
            b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$;
            return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
          }
          return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
        }()) {
          return cljs.core.linear_traversal_nth.call(null, a, Math.floor(b), c)
        }
        throw Error([cljs.core.str("nth not supported on this type "), cljs.core.str(cljs.core.type__GT_str.call(null, cljs.core.type.call(null, a)))].join(""));
      }
      return null
    }
    return c
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.get = function() {
  var a = null, b = function(a, b) {
    if(null == a) {
      return null
    }
    var c;
    a ? (c = (c = a.cljs$lang$protocol_mask$partition0$ & 256) ? c : a.cljs$core$ILookup$, c = c ? !0 : !1) : c = !1;
    if(c) {
      return cljs.core._lookup.call(null, a, b)
    }
    if(a instanceof Array || "string" === typeof a) {
      return b < a.length ? a[b] : null
    }
    if(cljs.core.type_satisfies_.call(null, cljs.core.ILookup, a)) {
      return cljs.core._lookup.call(null, a, b)
    }
    new cljs.core.Keyword(null, "else", "else", 1017020587);
    return null
  }, c = function(a, b, c) {
    if(null != a) {
      var g;
      a ? (g = (g = a.cljs$lang$protocol_mask$partition0$ & 256) ? g : a.cljs$core$ILookup$, g = g ? !0 : !1) : g = !1;
      a = g ? cljs.core._lookup.call(null, a, b, c) : a instanceof Array ? b < a.length ? a[b] : c : "string" === typeof a ? b < a.length ? a[b] : c : cljs.core.type_satisfies_.call(null, cljs.core.ILookup, a) ? cljs.core._lookup.call(null, a, b, c) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? c : null
    }else {
      a = c
    }
    return a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.assoc = function() {
  var a = null, b = function(a, b, c) {
    return null != a ? cljs.core._assoc.call(null, a, b, c) : cljs.core.hash_map.call(null, b, c)
  }, c = function() {
    var b = function(b, c, d, e) {
      for(;;) {
        if(b = a.call(null, b, c, d), cljs.core.truth_(e)) {
          c = cljs.core.first.call(null, e), d = cljs.core.second.call(null, e), e = cljs.core.nnext.call(null, e)
        }else {
          return b
        }
      }
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l)
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.dissoc = function() {
  var a = null, b = function(a, b) {
    return cljs.core._dissoc.call(null, a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(b = a.call(null, b, c), cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return b
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.fn_QMARK_ = function(a) {
  var b = goog.isFunction(a);
  return b ? b : a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$Fn$) ? !0 : a.cljs$lang$protocol_mask$partition$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.Fn, a) : cljs.core.type_satisfies_.call(null, cljs.core.Fn, a)
};
cljs.core.with_meta = function with_meta(b, c) {
  return function() {
    var c = cljs.core.fn_QMARK_.call(null, b);
    c && (b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 262144) ? c : b.cljs$core$IWithMeta$, c = c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IWithMeta, b)) : c = cljs.core.type_satisfies_.call(null, cljs.core.IWithMeta, b), c = !c);
    return c
  }() ? with_meta.call(null, function() {
    "undefined" === typeof cljs.core.t8635 && (cljs.core.t8635 = {}, cljs.core.t8635 = function(b, c, f, g) {
      this.meta = b;
      this.o = c;
      this.with_meta = f;
      this.meta8636 = g;
      this.cljs$lang$protocol_mask$partition1$ = 0;
      this.cljs$lang$protocol_mask$partition0$ = 393217
    }, cljs.core.t8635.cljs$lang$type = !0, cljs.core.t8635.cljs$lang$ctorStr = "cljs.core/t8635", cljs.core.t8635.cljs$lang$ctorPrWriter = function(b, c, f) {
      return cljs.core._write.call(null, c, "cljs.core/t8635")
    }, cljs.core.t8635.prototype.call = function() {
      var b = function(b, c) {
        return cljs.core.apply.call(null, b.o, c)
      }, c = function(c, e) {
        c = this;
        var h = null;
        1 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
        return b.call(this, c, h)
      };
      c.cljs$lang$maxFixedArity = 1;
      c.cljs$lang$applyTo = function(c) {
        var e = cljs.core.first(c);
        c = cljs.core.rest(c);
        return b(e, c)
      };
      c.cljs$core$IFn$_invoke$arity$variadic = b;
      return c
    }(), cljs.core.t8635.prototype.apply = function(b, c) {
      b = this;
      return b.call.apply(b, [b].concat(c.slice()))
    }, cljs.core.t8635.prototype.cljs$core$Fn$ = !0, cljs.core.t8635.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
      return this.meta8636
    }, cljs.core.t8635.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
      return new cljs.core.t8635(this.meta, this.o, this.with_meta, c)
    }, cljs.core.__GT_t8635 = function(b, c, f, g) {
      return new cljs.core.t8635(b, c, f, g)
    });
    return new cljs.core.t8635(c, b, with_meta, null)
  }(), c) : cljs.core._with_meta.call(null, b, c)
};
cljs.core.meta = function(a) {
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 131072) ? b : a.cljs$core$IMeta$, b = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IMeta, a)) : b = cljs.core.type_satisfies_.call(null, cljs.core.IMeta, a);
  return b ? cljs.core._meta.call(null, a) : null
};
cljs.core.peek = function(a) {
  return cljs.core._peek.call(null, a)
};
cljs.core.pop = function(a) {
  return cljs.core._pop.call(null, a)
};
cljs.core.disj = function() {
  var a = null, b = function(a, b) {
    return cljs.core._disjoin.call(null, a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(b = a.call(null, b, c), cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return b
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.string_hash_cache = {};
cljs.core.string_hash_cache_count = 0;
cljs.core.add_to_string_hash_cache = function(a) {
  var b = goog.string.hashCode(a);
  cljs.core.string_hash_cache[a] = b;
  cljs.core.string_hash_cache_count += 1;
  return b
};
cljs.core.check_string_hash_cache = function(a) {
  255 < cljs.core.string_hash_cache_count && (cljs.core.string_hash_cache = {}, cljs.core.string_hash_cache_count = 0);
  var b = cljs.core.string_hash_cache[a];
  return"number" === typeof b ? b : cljs.core.add_to_string_hash_cache.call(null, a)
};
cljs.core.hash = function() {
  var a = null, b = function(b) {
    return a.call(null, b, !0)
  }, c = function(a, b) {
    var c = goog.isString(a);
    return(c ? b : c) ? cljs.core.check_string_hash_cache.call(null, a) : cljs.core._hash.call(null, a)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.empty_QMARK_ = function(a) {
  var b = null == a;
  return b ? b : cljs.core.not.call(null, cljs.core.seq.call(null, a))
};
cljs.core.coll_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 8) ? b : a.cljs$core$ICollection$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ICollection, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, a)
};
cljs.core.set_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 4096) ? b : a.cljs$core$ISet$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISet, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ISet, a)
};
cljs.core.associative_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 512) ? b : a.cljs$core$IAssociative$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, a)
};
cljs.core.sequential_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 16777216) ? b : a.cljs$core$ISequential$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISequential, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, a)
};
cljs.core.reduceable_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 524288) ? b : a.cljs$core$IReduce$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IReduce, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, a)
};
cljs.core.map_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 1024) ? b : a.cljs$core$IMap$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IMap, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IMap, a)
};
cljs.core.vector_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 16384) ? b : a.cljs$core$IVector$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IVector, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IVector, a)
};
cljs.core.chunked_seq_QMARK_ = function(a) {
  if(a) {
    var b = a.cljs$lang$protocol_mask$partition1$ & 512;
    a = b ? b : a.cljs$core$IChunkedSeq$;
    return a ? !0 : !1
  }
  return!1
};
cljs.core.js_obj = function() {
  var a = null, b = function() {
    var a = function(a) {
      return cljs.core.apply.call(null, goog.object.create, a)
    }, b = function(b) {
      var d = null;
      0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return a.call(this, d)
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      b = cljs.core.seq(b);
      return a(b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a) {
    switch(arguments.length) {
      case 0:
        return{};
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return{}
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.js_keys = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d, e) {
    return b.push(d)
  });
  return b
};
cljs.core.js_delete = function(a, b) {
  return delete a[b]
};
cljs.core.array_copy = function(a, b, c, d, e) {
  for(;;) {
    if(0 === e) {
      return c
    }
    c[d] = a[b];
    d += 1;
    e -= 1;
    b += 1
  }
};
cljs.core.array_copy_downward = function(a, b, c, d, e) {
  b += e - 1;
  for(d += e - 1;;) {
    if(0 === e) {
      return c
    }
    c[d] = a[b];
    d -= 1;
    e -= 1;
    b -= 1
  }
};
cljs.core.lookup_sentinel = {};
cljs.core.false_QMARK_ = function(a) {
  return!1 === a
};
cljs.core.true_QMARK_ = function(a) {
  return!0 === a
};
cljs.core.undefined_QMARK_ = function(a) {
  return void 0 === a
};
cljs.core.seq_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
};
cljs.core.seqable_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 8388608) ? b : a.cljs$core$ISeqable$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, a)
};
cljs.core.boolean$ = function(a) {
  return cljs.core.truth_(a) ? !0 : !1
};
cljs.core.ifn_QMARK_ = function(a) {
  var b = cljs.core.fn_QMARK_.call(null, a);
  return b ? b : a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 1) ? b : a.cljs$core$IFn$, b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IFn, a)) : cljs.core.type_satisfies_.call(null, cljs.core.IFn, a)
};
cljs.core.integer_QMARK_ = function(a) {
  var b = "number" === typeof a;
  return b && (b = !isNaN(a)) ? (b = Infinity !== a) ? parseFloat(a) === parseInt(a, 10) : b : b
};
cljs.core.contains_QMARK_ = function(a, b) {
  return cljs.core.get.call(null, a, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? !1 : !0
};
cljs.core.find = function(a, b) {
  var c;
  if(c = null != a) {
    c = (c = cljs.core.associative_QMARK_.call(null, a)) ? cljs.core.contains_QMARK_.call(null, a, b) : c
  }
  return c ? cljs.core.PersistentVector.fromArray([b, cljs.core.get.call(null, a, b)], !0) : null
};
cljs.core.distinct_QMARK_ = function() {
  var a = null, b = function(a, b) {
    return!cljs.core._EQ_.call(null, a, b)
  }, c = function() {
    var a = function(a, b, c) {
      if(cljs.core._EQ_.call(null, a, b)) {
        return!1
      }
      a = cljs.core.PersistentHashSet.fromArray([b, null, a, null], !0);
      for(b = c;;) {
        var d = cljs.core.first.call(null, b);
        c = cljs.core.next.call(null, b);
        if(cljs.core.truth_(b)) {
          if(cljs.core.contains_QMARK_.call(null, a, d)) {
            return!1
          }
          a = cljs.core.conj.call(null, a, d);
          b = c
        }else {
          return!0
        }
      }
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.compare = function(a, b) {
  if(a === b) {
    return 0
  }
  if(null == a) {
    return-1
  }
  if(null == b) {
    return 1
  }
  if(cljs.core.type.call(null, a) === cljs.core.type.call(null, b)) {
    var c;
    a ? (c = (c = a.cljs$lang$protocol_mask$partition1$ & 2048) ? c : a.cljs$core$IComparable$, c = c ? !0 : !1) : c = !1;
    return c ? cljs.core._compare.call(null, a, b) : goog.array.defaultCompare(a, b)
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error("compare on non-nil objects of different types");
  }
  return null
};
cljs.core.compare_indexed = function() {
  var a = null, b = function(b, c) {
    var f = cljs.core.count.call(null, b), g = cljs.core.count.call(null, c);
    return f < g ? -1 : f > g ? 1 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? a.call(null, b, c, f, 0) : null
  }, c = function(a, b, c, g) {
    for(;;) {
      var h = cljs.core.compare.call(null, cljs.core.nth.call(null, a, g), cljs.core.nth.call(null, b, g)), k;
      k = (k = 0 === h) ? g + 1 < c : k;
      if(k) {
        g += 1
      }else {
        return h
      }
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
cljs.core.fn__GT_comparator = function(a) {
  return cljs.core._EQ_.call(null, a, cljs.core.compare) ? cljs.core.compare : function(b, c) {
    var d = a.call(null, b, c);
    return"number" === typeof d ? d : cljs.core.truth_(d) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : 0
  }
};
cljs.core.sort = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.compare, b)
  }, c = function(a, b) {
    if(cljs.core.seq.call(null, b)) {
      var c = cljs.core.to_array.call(null, b);
      goog.array.stableSort(c, cljs.core.fn__GT_comparator.call(null, a));
      return cljs.core.seq.call(null, c)
    }
    return cljs.core.List.EMPTY
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.sort_by = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, cljs.core.compare, c)
  }, c = function(a, b, c) {
    return cljs.core.sort.call(null, function(c, f) {
      return cljs.core.fn__GT_comparator.call(null, b).call(null, a.call(null, c), a.call(null, f))
    }, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.seq_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core.seq.call(null, b);
    return c ? cljs.core.reduce.call(null, a, cljs.core.first.call(null, c), cljs.core.next.call(null, c)) : a.call(null)
  }, c = function(a, b, c) {
    for(c = cljs.core.seq.call(null, c);;) {
      if(c) {
        b = a.call(null, b, cljs.core.first.call(null, c));
        if(cljs.core.reduced_QMARK_.call(null, b)) {
          return cljs.core.deref.call(null, b)
        }
        c = cljs.core.next.call(null, c)
      }else {
        return b
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.shuffle = function(a) {
  a = cljs.core.to_array.call(null, a);
  goog.array.shuffle(a);
  return cljs.core.vec.call(null, a)
};
cljs.core.reduce = function() {
  var a = null, b = function(a, b) {
    var c;
    b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 524288) ? c : b.cljs$core$IReduce$, c = c ? !0 : !1) : c = !1;
    return c ? cljs.core._reduce.call(null, b, a) : b instanceof Array ? cljs.core.array_reduce.call(null, b, a) : "string" === typeof b ? cljs.core.array_reduce.call(null, b, a) : cljs.core.type_satisfies_.call(null, cljs.core.IReduce, b) ? cljs.core._reduce.call(null, b, a) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.seq_reduce.call(null, a, b) : null
  }, c = function(a, b, c) {
    var g;
    c ? (g = (g = c.cljs$lang$protocol_mask$partition0$ & 524288) ? g : c.cljs$core$IReduce$, g = g ? !0 : !1) : g = !1;
    return g ? cljs.core._reduce.call(null, c, a, b) : c instanceof Array ? cljs.core.array_reduce.call(null, c, a, b) : "string" === typeof c ? cljs.core.array_reduce.call(null, c, a, b) : cljs.core.type_satisfies_.call(null, cljs.core.IReduce, c) ? cljs.core._reduce.call(null, c, a, b) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.seq_reduce.call(null, a, b, c) : null
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.reduce_kv = function(a, b, c) {
  return cljs.core._kv_reduce.call(null, c, a, b)
};
cljs.core._PLUS_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b + c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b - c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._STAR_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b * c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._SLASH_ = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b)
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, a.call(null, b, c), d)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / e;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a / b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._LT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a < b) {
          if(cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b < cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a < d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a < b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._LT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a <= b) {
          if(cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b <= cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a <= d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a <= b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._GT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a > b) {
          if(cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b > cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a > d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a > b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._GT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a >= b) {
          if(cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b >= cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a >= d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a >= b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.dec = function(a) {
  return a - 1
};
cljs.core.max = function() {
  var a = null, b = function(a, b) {
    return a > b ? a : b
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b > c ? b : c, d)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.min = function() {
  var a = null, b = function(a, b) {
    return a < b ? a : b
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b < c ? b : c, d)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.byte$ = function(a) {
  return a
};
cljs.core.char$ = function(a) {
  if("number" === typeof a) {
    return String.fromCharCode(a)
  }
  var b;
  b = (b = "string" === typeof a) ? 1 === a.length : b;
  if(b) {
    return a
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error("Argument to char must be a character or number");
  }
  return null
};
cljs.core.short$ = function(a) {
  return a
};
cljs.core.float$ = function(a) {
  return a
};
cljs.core.double$ = function(a) {
  return a
};
cljs.core.unchecked_byte = function(a) {
  return a
};
cljs.core.unchecked_char = function(a) {
  return a
};
cljs.core.unchecked_short = function(a) {
  return a
};
cljs.core.unchecked_float = function(a) {
  return a
};
cljs.core.unchecked_double = function(a) {
  return a
};
cljs.core.unchecked_add = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b + c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_add_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b + c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_dec = function(a) {
  return a - 1
};
cljs.core.unchecked_dec_int = function(a) {
  return a - 1
};
cljs.core.unchecked_divide_int = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b)
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, a.call(null, b, c), d)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / e;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a / b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_inc = function(a) {
  return a + 1
};
cljs.core.unchecked_inc_int = function(a) {
  return a + 1
};
cljs.core.unchecked_multiply = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b * c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_multiply_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b * c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_negate = function(a) {
  return-a
};
cljs.core.unchecked_negate_int = function(a) {
  return-a
};
cljs.core.unchecked_remainder_int = function(a, b) {
  return cljs.core.mod.call(null, a, b)
};
cljs.core.unchecked_substract = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b - c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_substract_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b - c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.fix = function(a) {
  return 0 <= a ? Math.floor.call(null, a) : Math.ceil.call(null, a)
};
cljs.core.int$ = function(a) {
  return a | 0
};
cljs.core.unchecked_int = function(a) {
  return cljs.core.fix.call(null, a)
};
cljs.core.long$ = function(a) {
  return cljs.core.fix.call(null, a)
};
cljs.core.unchecked_long = function(a) {
  return cljs.core.fix.call(null, a)
};
cljs.core.booleans = function(a) {
  return a
};
cljs.core.bytes = function(a) {
  return a
};
cljs.core.chars = function(a) {
  return a
};
cljs.core.shorts = function(a) {
  return a
};
cljs.core.ints = function(a) {
  return a
};
cljs.core.floats = function(a) {
  return a
};
cljs.core.doubles = function(a) {
  return a
};
cljs.core.longs = function(a) {
  return a
};
cljs.core.js_mod = function(a, b) {
  return a % b
};
cljs.core.mod = function(a, b) {
  return(a % b + b) % b
};
cljs.core.quot = function(a, b) {
  return cljs.core.fix.call(null, (a - a % b) / b)
};
cljs.core.rem = function(a, b) {
  var c = cljs.core.quot.call(null, a, b);
  return a - b * c
};
cljs.core.rand = function() {
  var a = null, b = function() {
    return Math.random.call(null)
  }, c = function(b) {
    return b * a.call(null)
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.rand_int = function(a) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, a))
};
cljs.core.bit_xor = function(a, b) {
  return a ^ b
};
cljs.core.bit_and = function(a, b) {
  return a & b
};
cljs.core.bit_or = function(a, b) {
  return a | b
};
cljs.core.bit_and_not = function(a, b) {
  return a & ~b
};
cljs.core.bit_clear = function(a, b) {
  return a & ~(1 << b)
};
cljs.core.bit_flip = function(a, b) {
  return a ^ 1 << b
};
cljs.core.bit_not = function(a) {
  return~a
};
cljs.core.bit_set = function(a, b) {
  return a | 1 << b
};
cljs.core.bit_test = function(a, b) {
  return 0 != (a & 1 << b)
};
cljs.core.bit_shift_left = function(a, b) {
  return a << b
};
cljs.core.bit_shift_right = function(a, b) {
  return a >> b
};
cljs.core.bit_shift_right_zero_fill = function(a, b) {
  return a >>> b
};
cljs.core.bit_count = function(a) {
  a -= a >> 1 & 1431655765;
  a = (a & 858993459) + (a >> 2 & 858993459);
  return 16843009 * (a + (a >> 4) & 252645135) >> 24
};
cljs.core._EQ__EQ_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._equiv.call(null, a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.call(null, b, c))) {
          if(cljs.core.next.call(null, d)) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
          }else {
            return a.call(null, c, cljs.core.first.call(null, d))
          }
        }else {
          return!1
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.pos_QMARK_ = function(a) {
  return 0 < a
};
cljs.core.zero_QMARK_ = function(a) {
  return 0 === a
};
cljs.core.neg_QMARK_ = function(a) {
  return 0 > a
};
cljs.core.nthnext = function(a, b) {
  for(var c = b, d = cljs.core.seq.call(null, a);;) {
    if(cljs.core.truth_(function() {
      var a = d;
      return a ? 0 < c : a
    }())) {
      var e = c - 1, f = cljs.core.next.call(null, d), c = e, d = f
    }else {
      return d
    }
  }
};
cljs.core.str = function() {
  var a = null, b = function(a) {
    return null == a ? "" : a.toString()
  }, c = function() {
    var b = function(b, c) {
      return function(b, c) {
        for(;;) {
          if(cljs.core.truth_(c)) {
            var d = b.append(a.call(null, cljs.core.first.call(null, c))), e = cljs.core.next.call(null, c);
            b = d;
            c = e
          }else {
            return b.toString()
          }
        }
      }.call(null, new goog.string.StringBuffer(a.call(null, b)), c)
    }, c = function(a, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e)
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return""
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.subs = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return a.substring(c);
      case 3:
        return a.substring(c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return a.substring(c)
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return a.substring(c, d)
  };
  return a
}();
cljs.core.equiv_sequential = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.sequential_QMARK_.call(null, b) ? function() {
    for(var c = cljs.core.seq.call(null, a), d = cljs.core.seq.call(null, b);;) {
      if(null == c) {
        return null == d
      }
      if(null == d) {
        return!1
      }
      if(cljs.core._EQ_.call(null, cljs.core.first.call(null, c), cljs.core.first.call(null, d))) {
        c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d)
      }else {
        return new cljs.core.Keyword(null, "else", "else", 1017020587) ? !1 : null
      }
    }
  }() : null)
};
cljs.core.hash_combine = function(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2)
};
cljs.core.hash_coll = function(a) {
  return cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.hash_combine.call(null, a, cljs.core.hash.call(null, c, !1))
  }, cljs.core.hash.call(null, cljs.core.first.call(null, a), !1), cljs.core.next.call(null, a))
};
cljs.core.hash_imap = function(a) {
  var b = 0;
  for(a = cljs.core.seq.call(null, a);;) {
    if(a) {
      var c = cljs.core.first.call(null, a), b = (b + (cljs.core.hash.call(null, cljs.core.key.call(null, c)) ^ cljs.core.hash.call(null, cljs.core.val.call(null, c)))) % 4503599627370496;
      a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
cljs.core.hash_iset = function(a) {
  var b = 0;
  for(a = cljs.core.seq.call(null, a);;) {
    if(a) {
      var c = cljs.core.first.call(null, a), b = (b + cljs.core.hash.call(null, c)) % 4503599627370496;
      a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
cljs.core.extend_object_BANG_ = function(a, b) {
  for(var c = cljs.core.seq.call(null, b), d = null, e = 0, f = 0;;) {
    if(f < e) {
      var g = cljs.core._nth.call(null, d, f), h = cljs.core.nth.call(null, g, 0, null), g = cljs.core.nth.call(null, g, 1, null), h = cljs.core.name.call(null, h);
      a[h] = g;
      f += 1
    }else {
      if(c = cljs.core.seq.call(null, c)) {
        cljs.core.chunked_seq_QMARK_.call(null, c) ? (e = cljs.core.chunk_first.call(null, c), c = cljs.core.chunk_rest.call(null, c), d = e, e = cljs.core.count.call(null, e)) : (e = cljs.core.first.call(null, c), d = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), d = cljs.core.name.call(null, d), a[d] = e, c = cljs.core.next.call(null, c), d = null, e = 0), f = 0
      }else {
        break
      }
    }
  }
  return a
};
cljs.core.List = function(a, b, c, d, e) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.count = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65937646
};
cljs.core.List.cljs$lang$type = !0;
cljs.core.List.cljs$lang$ctorStr = "cljs.core/List";
cljs.core.List.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/List")
};
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.List.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return 1 === this.count ? null : this.rest
};
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, a, this.count + 1, null)
};
cljs.core.List.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.List.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.List.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.count
};
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return a.cljs$core$ISeq$_rest$arity$1(a)
};
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 1 === this.count ? cljs.core.List.EMPTY : this.rest
};
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.List(b, this.first, this.rest, this.count, this.__hash)
};
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.List.EMPTY
};
cljs.core.__GT_List = function(a, b, c, d, e) {
  return new cljs.core.List(a, b, c, d, e)
};
cljs.core.EmptyList = function(a) {
  this.meta = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65937614
};
cljs.core.EmptyList.cljs$lang$type = !0;
cljs.core.EmptyList.cljs$lang$ctorStr = "cljs.core/EmptyList";
cljs.core.EmptyList.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/EmptyList")
};
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, null, 1, null)
};
cljs.core.EmptyList.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.EmptyList.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.EmptyList.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  throw Error("Can't pop empty list");
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.List.EMPTY
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.EmptyList(b)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return a
};
cljs.core.__GT_EmptyList = function(a) {
  return new cljs.core.EmptyList(a)
};
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 134217728) ? b : a.cljs$core$IReversible$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IReversible, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IReversible, a)
};
cljs.core.rseq = function(a) {
  return cljs.core._rseq.call(null, a)
};
cljs.core.reverse = function(a) {
  return cljs.core.reversible_QMARK_.call(null, a) ? cljs.core.rseq.call(null, a) : cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a)
};
cljs.core.list = function() {
  var a = function(a) {
    var b;
    if(a instanceof cljs.core.IndexedSeq) {
      b = a.arr
    }else {
      a: {
        for(b = [];;) {
          if(null != a) {
            b.push(cljs.core._first.call(null, a)), a = cljs.core._next.call(null, a)
          }else {
            break a
          }
        }
        b = void 0
      }
    }
    a = b.length;
    for(var e = cljs.core.List.EMPTY;;) {
      if(0 < a) {
        var f = a - 1, e = cljs.core._conj.call(null, e, b[a - 1]);
        a = f
      }else {
        return e
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.Cons = function(a, b, c, d) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65929452
};
cljs.core.Cons.cljs$lang$type = !0;
cljs.core.Cons.cljs$lang$ctorStr = "cljs.core/Cons";
cljs.core.Cons.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Cons")
};
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.Cons.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return null == this.rest ? null : cljs.core._seq.call(null, this.rest)
};
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.Cons(null, b, a, this.__hash)
};
cljs.core.Cons.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.Cons.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.Cons.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null == this.rest ? cljs.core.List.EMPTY : this.rest
};
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Cons(b, this.first, this.rest, this.__hash)
};
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_Cons = function(a, b, c, d) {
  return new cljs.core.Cons(a, b, c, d)
};
cljs.core.cons = function(a, b) {
  return function() {
    var a = null == b;
    return a ? a : b ? (a = (a = b.cljs$lang$protocol_mask$partition0$ & 64) ? a : b.cljs$core$ISeq$, a ? !0 : !1) : !1
  }() ? new cljs.core.Cons(null, a, b, null) : new cljs.core.Cons(null, a, cljs.core.seq.call(null, b), null)
};
cljs.core.list_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 33554432) ? b : a.cljs$core$IList$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IList, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IList, a)
};
cljs.core.IHash.string = !0;
cljs.core._hash.string = function(a) {
  return goog.string.hashCode(a)
};
cljs.core.Keyword = function(a, b, c, d) {
  this.ns = a;
  this.name = b;
  this.fqn = c;
  this._hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 2153775105;
  this.cljs$lang$protocol_mask$partition1$ = 4096
};
cljs.core.Keyword.cljs$lang$type = !0;
cljs.core.Keyword.cljs$lang$ctorStr = "cljs.core/Keyword";
cljs.core.Keyword.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Keyword")
};
cljs.core.Keyword.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, [cljs.core.str(":"), cljs.core.str(this.fqn)].join(""))
};
cljs.core.Keyword.prototype.cljs$core$INamed$_name$arity$1 = function(a) {
  return this.name
};
cljs.core.Keyword.prototype.cljs$core$INamed$_namespace$arity$1 = function(a) {
  return this.ns
};
cljs.core.Keyword.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  null == this._hash && (this._hash = cljs.core.hash_combine.call(null, cljs.core.hash.call(null, this.ns), cljs.core.hash.call(null, this.name)) + 2654435769);
  return this._hash
};
cljs.core.Keyword.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        null == c ? e = null : (c ? (e = (e = c.cljs$lang$protocol_mask$partition0$ & 256) ? e : c.cljs$core$ILookup$, e = e ? !0 : c.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ILookup, c)) : e = cljs.core.type_satisfies_.call(null, cljs.core.ILookup, c), e = e ? cljs.core._lookup.call(null, c, this, null) : null);
        return e;
      case 3:
        return null == c ? e = d : (c ? (e = (e = c.cljs$lang$protocol_mask$partition0$ & 256) ? e : c.cljs$core$ILookup$, e = e ? !0 : c.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ILookup, c)) : e = cljs.core.type_satisfies_.call(null, cljs.core.ILookup, c), e = e ? cljs.core._lookup.call(null, c, this, d) : d), e
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.Keyword.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.Keyword.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof cljs.core.Keyword ? this.fqn === b.fqn : !1
};
cljs.core.Keyword.prototype.toString = function() {
  return[cljs.core.str(":"), cljs.core.str(this.fqn)].join("")
};
cljs.core.__GT_Keyword = function(a, b, c, d) {
  return new cljs.core.Keyword(a, b, c, d)
};
cljs.core.keyword_QMARK_ = function(a) {
  return a instanceof cljs.core.Keyword
};
cljs.core.keyword_identical_QMARK_ = function(a, b) {
  if(a === b) {
    return!0
  }
  var c;
  c = (c = a instanceof cljs.core.Keyword) ? b instanceof cljs.core.Keyword : c;
  return c ? a.fqn === b.fqn : !1
};
cljs.core.keyword = function() {
  var a = null, b = function(a) {
    return a instanceof cljs.core.Keyword ? a : a instanceof cljs.core.Symbol ? new cljs.core.Keyword(null, cljs.core.name.call(null, a), cljs.core.name.call(null, a), null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.Keyword(null, a, a, null) : null
  }, c = function(a, b) {
    return new cljs.core.Keyword(a, b, [cljs.core.str(cljs.core.truth_(a) ? [cljs.core.str(a), cljs.core.str("/")].join("") : null), cljs.core.str(b)].join(""), null)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.LazySeq = function(a, b, c, d) {
  this.meta = a;
  this.fn = b;
  this.s = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988
};
cljs.core.LazySeq.cljs$lang$type = !0;
cljs.core.LazySeq.cljs$lang$ctorStr = "cljs.core/LazySeq";
cljs.core.LazySeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/LazySeq")
};
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.LazySeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  a.cljs$core$ISeqable$_seq$arity$1(a);
  return null == this.s ? null : cljs.core._next.call(null, this.s)
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.LazySeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.LazySeq.prototype.sval = function() {
  null != this.fn && (this.s = this.fn.call(null), this.fn = null);
  return this.s
};
cljs.core.LazySeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.LazySeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  a.sval();
  if(null == this.s) {
    return null
  }
  for(a = this.s;;) {
    if(a instanceof cljs.core.LazySeq) {
      a = a.sval()
    }else {
      return this.s = a, null == this.s ? null : cljs.core._seq.call(null, this.s)
    }
  }
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  a.cljs$core$ISeqable$_seq$arity$1(a);
  return null == this.s ? null : cljs.core._first.call(null, this.s)
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  a.cljs$core$ISeqable$_seq$arity$1(a);
  return null != this.s ? cljs.core._rest.call(null, this.s) : cljs.core.List.EMPTY
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.LazySeq(b, this.fn, this.s, this.__hash)
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_LazySeq = function(a, b, c, d) {
  return new cljs.core.LazySeq(a, b, c, d)
};
cljs.core.ChunkBuffer = function(a, b) {
  this.buf = a;
  this.end = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2
};
cljs.core.ChunkBuffer.cljs$lang$type = !0;
cljs.core.ChunkBuffer.cljs$lang$ctorStr = "cljs.core/ChunkBuffer";
cljs.core.ChunkBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkBuffer")
};
cljs.core.ChunkBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end
};
cljs.core.ChunkBuffer.prototype.add = function(a) {
  this.buf[this.end] = a;
  return this.end += 1
};
cljs.core.ChunkBuffer.prototype.chunk = function(a) {
  a = new cljs.core.ArrayChunk(this.buf, 0, this.end);
  this.buf = null;
  return a
};
cljs.core.__GT_ChunkBuffer = function(a, b) {
  return new cljs.core.ChunkBuffer(a, b)
};
cljs.core.chunk_buffer = function(a) {
  return new cljs.core.ChunkBuffer(Array(a), 0)
};
cljs.core.ArrayChunk = function(a, b, c) {
  this.arr = a;
  this.off = b;
  this.end = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 524306
};
cljs.core.ArrayChunk.cljs$lang$type = !0;
cljs.core.ArrayChunk.cljs$lang$ctorStr = "cljs.core/ArrayChunk";
cljs.core.ArrayChunk.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayChunk")
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.array_reduce.call(null, this.arr, b, this.arr[this.off], this.off + 1)
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.array_reduce.call(null, this.arr, b, c, this.off)
};
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$ = !0;
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$_drop_first$arity$1 = function(a) {
  if(this.off === this.end) {
    throw Error("-drop-first of empty chunk");
  }
  return new cljs.core.ArrayChunk(this.arr, this.off + 1, this.end)
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return this.arr[this.off + b]
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = (a = 0 <= b) ? b < this.end - this.off : a;
  return a ? this.arr[this.off + b] : c
};
cljs.core.ArrayChunk.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end - this.off
};
cljs.core.__GT_ArrayChunk = function(a, b, c) {
  return new cljs.core.ArrayChunk(a, b, c)
};
cljs.core.array_chunk = function() {
  var a = null, b = function(a) {
    return new cljs.core.ArrayChunk(a, 0, a.length)
  }, c = function(a, b) {
    return new cljs.core.ArrayChunk(a, b, a.length)
  }, d = function(a, b, c) {
    return new cljs.core.ArrayChunk(a, b, c)
  }, a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      case 3:
        return d.call(this, a, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  return a
}();
cljs.core.ChunkedCons = function(a, b, c, d) {
  this.chunk = a;
  this.more = b;
  this.meta = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 31850732;
  this.cljs$lang$protocol_mask$partition1$ = 1536
};
cljs.core.ChunkedCons.cljs$lang$type = !0;
cljs.core.ChunkedCons.cljs$lang$ctorStr = "cljs.core/ChunkedCons";
cljs.core.ChunkedCons.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkedCons")
};
cljs.core.ChunkedCons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.ChunkedCons.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  if(1 < cljs.core._count.call(null, this.chunk)) {
    return new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, this.chunk), this.more, this.meta, null)
  }
  a = cljs.core._seq.call(null, this.more);
  return null == a ? null : a
};
cljs.core.ChunkedCons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.ChunkedCons.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core._nth.call(null, this.chunk, 0)
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 1 < cljs.core._count.call(null, this.chunk) ? new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, this.chunk), this.more, this.meta, null) : null == this.more ? cljs.core.List.EMPTY : this.more
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(a) {
  return null == this.more ? null : this.more
};
cljs.core.ChunkedCons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.ChunkedCons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ChunkedCons(this.chunk, this.more, b, this.__hash)
};
cljs.core.ChunkedCons.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.ChunkedCons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(a) {
  return this.chunk
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(a) {
  return null == this.more ? cljs.core.List.EMPTY : this.more
};
cljs.core.__GT_ChunkedCons = function(a, b, c, d) {
  return new cljs.core.ChunkedCons(a, b, c, d)
};
cljs.core.chunk_cons = function(a, b) {
  return 0 === cljs.core._count.call(null, a) ? b : new cljs.core.ChunkedCons(a, b, null, null)
};
cljs.core.chunk_append = function(a, b) {
  return a.add(b)
};
cljs.core.chunk = function(a) {
  return a.chunk()
};
cljs.core.chunk_first = function(a) {
  return cljs.core._chunked_first.call(null, a)
};
cljs.core.chunk_rest = function(a) {
  return cljs.core._chunked_rest.call(null, a)
};
cljs.core.chunk_next = function(a) {
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition1$ & 1024) ? b : a.cljs$core$IChunkedNext$, b = b ? !0 : !1) : b = !1;
  return b ? cljs.core._chunked_next.call(null, a) : cljs.core.seq.call(null, cljs.core._chunked_rest.call(null, a))
};
cljs.core.to_array = function(a) {
  for(var b = [];;) {
    if(cljs.core.seq.call(null, a)) {
      b.push(cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
cljs.core.to_array_2d = function(a) {
  var b = Array(cljs.core.count.call(null, a)), c = 0;
  for(a = cljs.core.seq.call(null, a);;) {
    if(a) {
      b[c] = cljs.core.to_array.call(null, cljs.core.first.call(null, a)), c += 1, a = cljs.core.next.call(null, a)
    }else {
      break
    }
  }
  return b
};
cljs.core.int_array = function() {
  var a = null, b = function(b) {
    return"number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b)
  }, c = function(a, b) {
    var c = Array(a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var k = g + 1, l = cljs.core.next.call(null, h), g = k, h = l
        }else {
          return c
        }
      }
    }else {
      for(k = 0;;) {
        if(k < a) {
          c[k] = b, k += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.long_array = function() {
  var a = null, b = function(b) {
    return"number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b)
  }, c = function(a, b) {
    var c = Array(a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var k = g + 1, l = cljs.core.next.call(null, h), g = k, h = l
        }else {
          return c
        }
      }
    }else {
      for(k = 0;;) {
        if(k < a) {
          c[k] = b, k += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.double_array = function() {
  var a = null, b = function(b) {
    return"number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b)
  }, c = function(a, b) {
    var c = Array(a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var k = g + 1, l = cljs.core.next.call(null, h), g = k, h = l
        }else {
          return c
        }
      }
    }else {
      for(k = 0;;) {
        if(k < a) {
          c[k] = b, k += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.object_array = function() {
  var a = null, b = function(b) {
    return"number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b)
  }, c = function(a, b) {
    var c = Array(a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var k = g + 1, l = cljs.core.next.call(null, h), g = k, h = l
        }else {
          return c
        }
      }
    }else {
      for(k = 0;;) {
        if(k < a) {
          c[k] = b, k += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.bounded_count = function(a, b) {
  if(cljs.core.counted_QMARK_.call(null, a)) {
    return cljs.core.count.call(null, a)
  }
  for(var c = a, d = b, e = 0;;) {
    if(cljs.core.truth_(function() {
      var a = 0 < d;
      return a ? cljs.core.seq.call(null, c) : a
    }())) {
      var f = cljs.core.next.call(null, c), g = d - 1, e = e + 1, c = f, d = g
    }else {
      return e
    }
  }
};
cljs.core.spread = function spread(b) {
  return null == b ? null : null == cljs.core.next.call(null, b) ? cljs.core.seq.call(null, cljs.core.first.call(null, b)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.cons.call(null, cljs.core.first.call(null, b), spread.call(null, cljs.core.next.call(null, b))) : null
};
cljs.core.concat = function() {
  var a = null, b = function() {
    return new cljs.core.LazySeq(null, function() {
      return null
    }, null, null)
  }, c = function(a) {
    return new cljs.core.LazySeq(null, function() {
      return a
    }, null, null)
  }, d = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var d = cljs.core.seq.call(null, b);
      return d ? cljs.core.chunked_seq_QMARK_.call(null, d) ? cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, d), a.call(null, cljs.core.chunk_rest.call(null, d), c)) : cljs.core.cons.call(null, cljs.core.first.call(null, d), a.call(null, cljs.core.rest.call(null, d), c)) : c
    }, null, null)
  }, e = function() {
    var b = function(b, c, d) {
      return function n(a, b) {
        return new cljs.core.LazySeq(null, function() {
          var c = cljs.core.seq.call(null, a);
          return c ? cljs.core.chunked_seq_QMARK_.call(null, c) ? cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, c), n.call(null, cljs.core.chunk_rest.call(null, c), b)) : cljs.core.cons.call(null, cljs.core.first.call(null, c), n.call(null, cljs.core.rest.call(null, c), b)) : cljs.core.truth_(b) ? n.call(null, cljs.core.first.call(null, b), cljs.core.next.call(null, b)) : null
        }, null, null)
      }.call(null, a.call(null, b, c), d)
    }, c = function(a, c, d) {
      var e = null;
      2 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, e)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.list_STAR_ = function() {
  var a = null, b = function(a) {
    return cljs.core.seq.call(null, a)
  }, c = function(a, b) {
    return cljs.core.cons.call(null, a, b)
  }, d = function(a, b, c) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, c))
  }, e = function(a, b, c, d) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, d)))
  }, f = function() {
    var a = function(a, b, c, d, e) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, e)))))
    }, b = function(b, c, d, e, f) {
      var h = null;
      4 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, h)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, h, k, l, m) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, h);
      case 3:
        return d.call(this, a, h, k);
      case 4:
        return e.call(this, a, h, k, l);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.transient$ = function(a) {
  return cljs.core._as_transient.call(null, a)
};
cljs.core.persistent_BANG_ = function(a) {
  return cljs.core._persistent_BANG_.call(null, a)
};
cljs.core.conj_BANG_ = function(a, b) {
  return cljs.core._conj_BANG_.call(null, a, b)
};
cljs.core.assoc_BANG_ = function(a, b, c) {
  return cljs.core._assoc_BANG_.call(null, a, b, c)
};
cljs.core.dissoc_BANG_ = function(a, b) {
  return cljs.core._dissoc_BANG_.call(null, a, b)
};
cljs.core.pop_BANG_ = function(a) {
  return cljs.core._pop_BANG_.call(null, a)
};
cljs.core.disj_BANG_ = function(a, b) {
  return cljs.core._disjoin_BANG_.call(null, a, b)
};
cljs.core.apply_to = function(a, b, c) {
  var d = cljs.core.seq.call(null, c);
  if(0 === b) {
    return a.call(null)
  }
  c = cljs.core._first.call(null, d);
  var e = cljs.core._rest.call(null, d);
  if(1 === b) {
    return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c)
  }
  var d = cljs.core._first.call(null, e), f = cljs.core._rest.call(null, e);
  if(2 === b) {
    return a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(c, d) : a.call(null, c, d)
  }
  var e = cljs.core._first.call(null, f), g = cljs.core._rest.call(null, f);
  if(3 === b) {
    return a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(c, d, e) : a.call(null, c, d, e)
  }
  var f = cljs.core._first.call(null, g), h = cljs.core._rest.call(null, g);
  if(4 === b) {
    return a.cljs$core$IFn$_invoke$arity$4 ? a.cljs$core$IFn$_invoke$arity$4(c, d, e, f) : a.call(null, c, d, e, f)
  }
  g = cljs.core._first.call(null, h);
  h = cljs.core._rest.call(null, h);
  if(5 === b) {
    return a.cljs$core$IFn$_invoke$arity$5 ? a.cljs$core$IFn$_invoke$arity$5(c, d, e, f, g) : a.call(null, c, d, e, f, g)
  }
  a = cljs.core._first.call(null, h);
  var k = cljs.core._rest.call(null, h);
  if(6 === b) {
    return a.cljs$core$IFn$_invoke$arity$6 ? a.cljs$core$IFn$_invoke$arity$6(c, d, e, f, g, a) : a.call(null, c, d, e, f, g, a)
  }
  var h = cljs.core._first.call(null, k), l = cljs.core._rest.call(null, k);
  if(7 === b) {
    return a.cljs$core$IFn$_invoke$arity$7 ? a.cljs$core$IFn$_invoke$arity$7(c, d, e, f, g, a, h) : a.call(null, c, d, e, f, g, a, h)
  }
  var k = cljs.core._first.call(null, l), m = cljs.core._rest.call(null, l);
  if(8 === b) {
    return a.cljs$core$IFn$_invoke$arity$8 ? a.cljs$core$IFn$_invoke$arity$8(c, d, e, f, g, a, h, k) : a.call(null, c, d, e, f, g, a, h, k)
  }
  var l = cljs.core._first.call(null, m), n = cljs.core._rest.call(null, m);
  if(9 === b) {
    return a.cljs$core$IFn$_invoke$arity$9 ? a.cljs$core$IFn$_invoke$arity$9(c, d, e, f, g, a, h, k, l) : a.call(null, c, d, e, f, g, a, h, k, l)
  }
  var m = cljs.core._first.call(null, n), p = cljs.core._rest.call(null, n);
  if(10 === b) {
    return a.cljs$core$IFn$_invoke$arity$10 ? a.cljs$core$IFn$_invoke$arity$10(c, d, e, f, g, a, h, k, l, m) : a.call(null, c, d, e, f, g, a, h, k, l, m)
  }
  var n = cljs.core._first.call(null, p), r = cljs.core._rest.call(null, p);
  if(11 === b) {
    return a.cljs$core$IFn$_invoke$arity$11 ? a.cljs$core$IFn$_invoke$arity$11(c, d, e, f, g, a, h, k, l, m, n) : a.call(null, c, d, e, f, g, a, h, k, l, m, n)
  }
  var p = cljs.core._first.call(null, r), s = cljs.core._rest.call(null, r);
  if(12 === b) {
    return a.cljs$core$IFn$_invoke$arity$12 ? a.cljs$core$IFn$_invoke$arity$12(c, d, e, f, g, a, h, k, l, m, n, p) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p)
  }
  var r = cljs.core._first.call(null, s), q = cljs.core._rest.call(null, s);
  if(13 === b) {
    return a.cljs$core$IFn$_invoke$arity$13 ? a.cljs$core$IFn$_invoke$arity$13(c, d, e, f, g, a, h, k, l, m, n, p, r) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, r)
  }
  var s = cljs.core._first.call(null, q), t = cljs.core._rest.call(null, q);
  if(14 === b) {
    return a.cljs$core$IFn$_invoke$arity$14 ? a.cljs$core$IFn$_invoke$arity$14(c, d, e, f, g, a, h, k, l, m, n, p, r, s) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, r, s)
  }
  var q = cljs.core._first.call(null, t), u = cljs.core._rest.call(null, t);
  if(15 === b) {
    return a.cljs$core$IFn$_invoke$arity$15 ? a.cljs$core$IFn$_invoke$arity$15(c, d, e, f, g, a, h, k, l, m, n, p, r, s, q) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, r, s, q)
  }
  var t = cljs.core._first.call(null, u), v = cljs.core._rest.call(null, u);
  if(16 === b) {
    return a.cljs$core$IFn$_invoke$arity$16 ? a.cljs$core$IFn$_invoke$arity$16(c, d, e, f, g, a, h, k, l, m, n, p, r, s, q, t) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, r, s, q, t)
  }
  var u = cljs.core._first.call(null, v), w = cljs.core._rest.call(null, v);
  if(17 === b) {
    return a.cljs$core$IFn$_invoke$arity$17 ? a.cljs$core$IFn$_invoke$arity$17(c, d, e, f, g, a, h, k, l, m, n, p, r, s, q, t, u) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, r, s, q, t, u)
  }
  var v = cljs.core._first.call(null, w), x = cljs.core._rest.call(null, w);
  if(18 === b) {
    return a.cljs$core$IFn$_invoke$arity$18 ? a.cljs$core$IFn$_invoke$arity$18(c, d, e, f, g, a, h, k, l, m, n, p, r, s, q, t, u, v) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, r, s, q, t, u, v)
  }
  w = cljs.core._first.call(null, x);
  x = cljs.core._rest.call(null, x);
  if(19 === b) {
    return a.cljs$core$IFn$_invoke$arity$19 ? a.cljs$core$IFn$_invoke$arity$19(c, d, e, f, g, a, h, k, l, m, n, p, r, s, q, t, u, v, w) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, r, s, q, t, u, v, w)
  }
  var N = cljs.core._first.call(null, x);
  cljs.core._rest.call(null, x);
  if(20 === b) {
    return a.cljs$core$IFn$_invoke$arity$20 ? a.cljs$core$IFn$_invoke$arity$20(c, d, e, f, g, a, h, k, l, m, n, p, r, s, q, t, u, v, w, N) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, r, s, q, t, u, v, w, N)
  }
  throw Error("Only up to 20 arguments supported on functions");
};
cljs.core.apply = function() {
  var a = null, b = function(a, b) {
    var c = a.cljs$lang$maxFixedArity;
    if(a.cljs$lang$applyTo) {
      var d = cljs.core.bounded_count.call(null, b, c + 1);
      return d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)
    }
    return a.apply(a, cljs.core.to_array.call(null, b))
  }, c = function(a, b, c) {
    b = cljs.core.list_STAR_.call(null, b, c);
    c = a.cljs$lang$maxFixedArity;
    if(a.cljs$lang$applyTo) {
      var d = cljs.core.bounded_count.call(null, b, c + 1);
      return d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)
    }
    return a.apply(a, cljs.core.to_array.call(null, b))
  }, d = function(a, b, c, d) {
    b = cljs.core.list_STAR_.call(null, b, c, d);
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b))
  }, e = function(a, b, c, d, e) {
    b = cljs.core.list_STAR_.call(null, b, c, d, e);
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b))
  }, f = function() {
    var a = function(a, b, c, d, e, f) {
      b = cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.cons.call(null, e, cljs.core.spread.call(null, f)))));
      c = a.cljs$lang$maxFixedArity;
      return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b))
    }, b = function(b, c, d, e, f, h) {
      var s = null;
      5 < arguments.length && (s = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return a.call(this, b, c, d, e, f, s)
    };
    b.cljs$lang$maxFixedArity = 5;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.next(b);
      var h = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, h, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, h, k, l, m, n) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, h);
      case 3:
        return c.call(this, a, h, k);
      case 4:
        return d.call(this, a, h, k, l);
      case 5:
        return e.call(this, a, h, k, l, m);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, cljs.core.array_seq(arguments, 5))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.vary_meta = function() {
  var a = function(a, b, e) {
    return cljs.core.with_meta.call(null, a, cljs.core.apply.call(null, b, cljs.core.meta.call(null, a), e))
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.not_EQ_ = function() {
  var a = null, b = function(a, b) {
    return!cljs.core._EQ_.call(null, a, b)
  }, c = function() {
    var a = function(a, b, c) {
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, a, b, c))
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!1;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!1
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.not_empty = function(a) {
  return cljs.core.seq.call(null, a) ? a : null
};
cljs.core.every_QMARK_ = function(a, b) {
  for(;;) {
    if(null == cljs.core.seq.call(null, b)) {
      return!0
    }
    if(cljs.core.truth_(a.call(null, cljs.core.first.call(null, b)))) {
      var c = a, d = cljs.core.next.call(null, b);
      a = c;
      b = d
    }else {
      return new cljs.core.Keyword(null, "else", "else", 1017020587) ? !1 : null
    }
  }
};
cljs.core.not_every_QMARK_ = function(a, b) {
  return!cljs.core.every_QMARK_.call(null, a, b)
};
cljs.core.some = function(a, b) {
  for(;;) {
    if(cljs.core.seq.call(null, b)) {
      var c = a.call(null, cljs.core.first.call(null, b));
      if(cljs.core.truth_(c)) {
        return c
      }
      var c = a, d = cljs.core.next.call(null, b);
      a = c;
      b = d
    }else {
      return null
    }
  }
};
cljs.core.not_any_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.core.some.call(null, a, b))
};
cljs.core.even_QMARK_ = function(a) {
  if(cljs.core.integer_QMARK_.call(null, a)) {
    return 0 === (a & 1)
  }
  throw Error([cljs.core.str("Argument must be an integer: "), cljs.core.str(a)].join(""));
};
cljs.core.odd_QMARK_ = function(a) {
  return!cljs.core.even_QMARK_.call(null, a)
};
cljs.core.identity = function(a) {
  return a
};
cljs.core.complement = function(a) {
  return function() {
    var b = null, c = function() {
      var b = function(b, c, d) {
        return cljs.core.not.call(null, cljs.core.apply.call(null, a, b, c, d))
      }, c = function(a, c, e) {
        var k = null;
        2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return b.call(this, a, c, k)
      };
      c.cljs$lang$maxFixedArity = 2;
      c.cljs$lang$applyTo = function(a) {
        var c = cljs.core.first(a);
        a = cljs.core.next(a);
        var e = cljs.core.first(a);
        a = cljs.core.rest(a);
        return b(c, e, a)
      };
      c.cljs$core$IFn$_invoke$arity$variadic = b;
      return c
    }(), b = function(b, e, f) {
      switch(arguments.length) {
        case 0:
          return cljs.core.not.call(null, a.call(null));
        case 1:
          return cljs.core.not.call(null, a.call(null, b));
        case 2:
          return cljs.core.not.call(null, a.call(null, b, e));
        default:
          return c.cljs$core$IFn$_invoke$arity$variadic(b, e, cljs.core.array_seq(arguments, 2))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = c.cljs$lang$applyTo;
    return b
  }()
};
cljs.core.constantly = function(a) {
  return function() {
    var b = function(b) {
      0 < arguments.length && cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      return a
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      cljs.core.seq(b);
      return a
    };
    b.cljs$core$IFn$_invoke$arity$variadic = function(b) {
      return a
    };
    return b
  }()
};
cljs.core.comp = function() {
  var a = null, b = function() {
    return cljs.core.identity
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, e, h) {
          return a.call(null, cljs.core.apply.call(null, b, c, d, e, h))
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a)
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d
      }(), c = function(c, e, h, p) {
        switch(arguments.length) {
          case 0:
            return a.call(null, b.call(null));
          case 1:
            return a.call(null, b.call(null, c));
          case 2:
            return a.call(null, b.call(null, c, e));
          case 3:
            return a.call(null, b.call(null, c, e, h));
          default:
            return d.cljs$core$IFn$_invoke$arity$variadic(c, e, h, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        var d = function(d, e, k, m) {
          return a.call(null, b.call(null, cljs.core.apply.call(null, c, d, e, k, m)))
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a)
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e
      }(), d = function(d, k, p, r) {
        switch(arguments.length) {
          case 0:
            return a.call(null, b.call(null, c.call(null)));
          case 1:
            return a.call(null, b.call(null, c.call(null, d)));
          case 2:
            return a.call(null, b.call(null, c.call(null, d, k)));
          case 3:
            return a.call(null, b.call(null, c.call(null, d, k, p)));
          default:
            return e.cljs$core$IFn$_invoke$arity$variadic(d, k, p, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, a, b, c, d));
      return function() {
        var a = function(a) {
          a = cljs.core.apply.call(null, cljs.core.first.call(null, e), a);
          for(var b = cljs.core.next.call(null, e);;) {
            if(b) {
              a = cljs.core.first.call(null, b).call(null, a), b = cljs.core.next.call(null, b)
            }else {
              return a
            }
          }
        }, b = function(b) {
          var c = null;
          0 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return a.call(this, c)
        };
        b.cljs$lang$maxFixedArity = 0;
        b.cljs$lang$applyTo = function(b) {
          b = cljs.core.seq(b);
          return a(b)
        };
        b.cljs$core$IFn$_invoke$arity$variadic = a;
        return b
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a;
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.partial = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = function(c) {
        return cljs.core.apply.call(null, a, b, c)
      }, d = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return c.call(this, b)
      };
      d.cljs$lang$maxFixedArity = 0;
      d.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return c(a)
      };
      d.cljs$core$IFn$_invoke$arity$variadic = c;
      return d
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = function(d) {
        return cljs.core.apply.call(null, a, b, c, d)
      }, e = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return d.call(this, b)
      };
      e.cljs$lang$maxFixedArity = 0;
      e.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return d(a)
      };
      e.cljs$core$IFn$_invoke$arity$variadic = d;
      return e
    }()
  }, d = function(a, b, c, d) {
    return function() {
      var e = function(e) {
        return cljs.core.apply.call(null, a, b, c, d, e)
      }, m = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return e.call(this, b)
      };
      m.cljs$lang$maxFixedArity = 0;
      m.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return e(a)
      };
      m.cljs$core$IFn$_invoke$arity$variadic = e;
      return m
    }()
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return function() {
        var f = function(f) {
          return cljs.core.apply.call(null, a, b, c, d, cljs.core.concat.call(null, e, f))
        }, g = function(a) {
          var b = null;
          0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return f.call(this, b)
        };
        g.cljs$lang$maxFixedArity = 0;
        g.cljs$lang$applyTo = function(a) {
          a = cljs.core.seq(a);
          return f(a)
        };
        g.cljs$core$IFn$_invoke$arity$variadic = f;
        return g
      }()
    }, b = function(b, c, d, e, g) {
      var p = null;
      4 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, p)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.fnil = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, g, h) {
          return cljs.core.apply.call(null, a, null == c ? b : c, d, g, h)
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a)
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d
      }(), c = function(c, g, m, n) {
        switch(arguments.length) {
          case 1:
            return a.call(null, null == c ? b : c);
          case 2:
            return a.call(null, null == c ? b : c, g);
          case 3:
            return a.call(null, null == c ? b : c, g, m);
          default:
            return d.cljs$core$IFn$_invoke$arity$variadic(c, g, m, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = null, k = function() {
        var d = function(d, h, k, m) {
          return cljs.core.apply.call(null, a, null == d ? b : d, null == h ? c : h, k, m)
        }, h = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        h.cljs$lang$maxFixedArity = 3;
        h.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a)
        };
        h.cljs$core$IFn$_invoke$arity$variadic = d;
        return h
      }(), d = function(d, h, n, p) {
        switch(arguments.length) {
          case 2:
            return a.call(null, null == d ? b : d, null == h ? c : h);
          case 3:
            return a.call(null, null == d ? b : d, null == h ? c : h, n);
          default:
            return k.cljs$core$IFn$_invoke$arity$variadic(d, h, n, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = k.cljs$lang$applyTo;
      return d
    }()
  }, d = function(a, b, c, d) {
    return function() {
      var k = null, l = function() {
        var k = function(k, m, l, q) {
          return cljs.core.apply.call(null, a, null == k ? b : k, null == m ? c : m, null == l ? d : l, q)
        }, l = function(a, b, c, d) {
          var e = null;
          3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return k.call(this, a, b, c, e)
        };
        l.cljs$lang$maxFixedArity = 3;
        l.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return k(b, c, d, a)
        };
        l.cljs$core$IFn$_invoke$arity$variadic = k;
        return l
      }(), k = function(k, n, p, r) {
        switch(arguments.length) {
          case 2:
            return a.call(null, null == k ? b : k, null == n ? c : n);
          case 3:
            return a.call(null, null == k ? b : k, null == n ? c : n, null == p ? d : p);
          default:
            return l.cljs$core$IFn$_invoke$arity$variadic(k, n, p, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      k.cljs$lang$maxFixedArity = 3;
      k.cljs$lang$applyTo = l.cljs$lang$applyTo;
      return k
    }()
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.map_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, function() {
      var g = cljs.core.seq.call(null, f);
      if(g) {
        if(cljs.core.chunked_seq_QMARK_.call(null, g)) {
          for(var h = cljs.core.chunk_first.call(null, g), k = cljs.core.count.call(null, h), l = cljs.core.chunk_buffer.call(null, k), m = 0;;) {
            if(m < k) {
              cljs.core.chunk_append.call(null, l, a.call(null, b + m, cljs.core._nth.call(null, h, m))), m += 1
            }else {
              break
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, l), d.call(null, b + k, cljs.core.chunk_rest.call(null, g)))
        }
        return cljs.core.cons.call(null, a.call(null, b, cljs.core.first.call(null, g)), d.call(null, b + 1, cljs.core.rest.call(null, g)))
      }
      return null
    }, null, null)
  }.call(null, 0, b)
};
cljs.core.keep = function keep(b, c) {
  return new cljs.core.LazySeq(null, function() {
    var d = cljs.core.seq.call(null, c);
    if(d) {
      if(cljs.core.chunked_seq_QMARK_.call(null, d)) {
        for(var e = cljs.core.chunk_first.call(null, d), f = cljs.core.count.call(null, e), g = cljs.core.chunk_buffer.call(null, f), h = 0;;) {
          if(h < f) {
            var k = b.call(null, cljs.core._nth.call(null, e, h));
            null != k && cljs.core.chunk_append.call(null, g, k);
            h += 1
          }else {
            break
          }
        }
        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), keep.call(null, b, cljs.core.chunk_rest.call(null, d)))
      }
      e = b.call(null, cljs.core.first.call(null, d));
      return null == e ? keep.call(null, b, cljs.core.rest.call(null, d)) : cljs.core.cons.call(null, e, keep.call(null, b, cljs.core.rest.call(null, d)))
    }
    return null
  }, null, null)
};
cljs.core.keep_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, function() {
      var g = cljs.core.seq.call(null, f);
      if(g) {
        if(cljs.core.chunked_seq_QMARK_.call(null, g)) {
          for(var h = cljs.core.chunk_first.call(null, g), k = cljs.core.count.call(null, h), l = cljs.core.chunk_buffer.call(null, k), m = 0;;) {
            if(m < k) {
              var n = a.call(null, b + m, cljs.core._nth.call(null, h, m));
              null != n && cljs.core.chunk_append.call(null, l, n);
              m += 1
            }else {
              break
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, l), d.call(null, b + k, cljs.core.chunk_rest.call(null, g)))
        }
        h = a.call(null, b, cljs.core.first.call(null, g));
        return null == h ? d.call(null, b + 1, cljs.core.rest.call(null, g)) : cljs.core.cons.call(null, h, d.call(null, b + 1, cljs.core.rest.call(null, g)))
      }
      return null
    }, null, null)
  }.call(null, 0, b)
};
cljs.core.every_pred = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b) {
        return cljs.core.boolean$.call(null, a.call(null, b))
      }, d = function(b, c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, b);
          return cljs.core.truth_(d) ? a.call(null, c) : d
        }())
      }, e = function(b, c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, b);
          return cljs.core.truth_(e) ? (e = a.call(null, c), cljs.core.truth_(e) ? a.call(null, d) : e) : e
        }())
      }, m = function() {
        var c = function(c, d, e, h) {
          return cljs.core.boolean$.call(null, function() {
            var k = b.call(null, c, d, e);
            return cljs.core.truth_(k) ? cljs.core.every_QMARK_.call(null, a, h) : k
          }())
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a)
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return c.call(this, a);
          case 2:
            return d.call(this, a, b);
          case 3:
            return e.call(this, a, b, f);
          default:
            return m.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = m.cljs$lang$applyTo;
      b.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0
      };
      b.cljs$core$IFn$_invoke$arity$1 = c;
      b.cljs$core$IFn$_invoke$arity$2 = d;
      b.cljs$core$IFn$_invoke$arity$3 = e;
      b.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, c);
          return cljs.core.truth_(d) ? b.call(null, c) : d
        }())
      }, e = function(c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, c);
          return cljs.core.truth_(e) && (e = a.call(null, d), cljs.core.truth_(e)) ? (e = b.call(null, c), cljs.core.truth_(e) ? b.call(null, d) : e) : e
        }())
      }, m = function(c, d, e) {
        return cljs.core.boolean$.call(null, function() {
          var h = a.call(null, c);
          return cljs.core.truth_(h) && (h = a.call(null, d), cljs.core.truth_(h) && (h = a.call(null, e), cljs.core.truth_(h) && (h = b.call(null, c), cljs.core.truth_(h)))) ? (h = b.call(null, d), cljs.core.truth_(h) ? b.call(null, e) : h) : h
        }())
      }, n = function() {
        var d = function(d, e, k, m) {
          return cljs.core.boolean$.call(null, function() {
            var l = c.call(null, d, e, k);
            return cljs.core.truth_(l) ? cljs.core.every_QMARK_.call(null, function(c) {
              var d = a.call(null, c);
              return cljs.core.truth_(d) ? b.call(null, c) : d
            }, m) : l
          }())
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a)
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return m.call(this, a, b, c);
          default:
            return n.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = n.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0
      };
      c.cljs$core$IFn$_invoke$arity$1 = d;
      c.cljs$core$IFn$_invoke$arity$2 = e;
      c.cljs$core$IFn$_invoke$arity$3 = m;
      c.cljs$core$IFn$_invoke$arity$variadic = n.cljs$core$IFn$_invoke$arity$variadic;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, d);
          return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e
        }())
      }, m = function(d, e) {
        return cljs.core.boolean$.call(null, function() {
          var k = a.call(null, d);
          return cljs.core.truth_(k) && (k = b.call(null, d), cljs.core.truth_(k) && (k = c.call(null, d), cljs.core.truth_(k) && (k = a.call(null, e), cljs.core.truth_(k)))) ? (k = b.call(null, e), cljs.core.truth_(k) ? c.call(null, e) : k) : k
        }())
      }, n = function(d, e, k) {
        return cljs.core.boolean$.call(null, function() {
          var m = a.call(null, d);
          return cljs.core.truth_(m) && (m = b.call(null, d), cljs.core.truth_(m) && (m = c.call(null, d), cljs.core.truth_(m) && (m = a.call(null, e), cljs.core.truth_(m) && (m = b.call(null, e), cljs.core.truth_(m) && (m = c.call(null, e), cljs.core.truth_(m) && (m = a.call(null, k), cljs.core.truth_(m))))))) ? (m = b.call(null, k), cljs.core.truth_(m) ? c.call(null, k) : m) : m
        }())
      }, p = function() {
        var e = function(e, m, l, p) {
          return cljs.core.boolean$.call(null, function() {
            var n = d.call(null, e, m, l);
            return cljs.core.truth_(n) ? cljs.core.every_QMARK_.call(null, function(d) {
              var e = a.call(null, d);
              return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e
            }, p) : n
          }())
        }, m = function(a, b, c, d) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f)
        };
        m.cljs$lang$maxFixedArity = 3;
        m.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return e(b, c, d, a)
        };
        m.cljs$core$IFn$_invoke$arity$variadic = e;
        return m
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return e.call(this, a);
          case 2:
            return m.call(this, a, b);
          case 3:
            return n.call(this, a, b, c);
          default:
            return p.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = p.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0
      };
      d.cljs$core$IFn$_invoke$arity$1 = e;
      d.cljs$core$IFn$_invoke$arity$2 = m;
      d.cljs$core$IFn$_invoke$arity$3 = n;
      d.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.every_QMARK_.call(null, function(b) {
            return b.call(null, a)
          }, e)
        }, c = function(a, b) {
          return cljs.core.every_QMARK_.call(null, function(c) {
            var d = c.call(null, a);
            return cljs.core.truth_(d) ? c.call(null, b) : d
          }, e)
        }, d = function(a, b, c) {
          return cljs.core.every_QMARK_.call(null, function(d) {
            var e = d.call(null, a);
            return cljs.core.truth_(e) ? (e = d.call(null, b), cljs.core.truth_(e) ? d.call(null, c) : e) : e
          }, e)
        }, f = function() {
          var b = function(b, c, d, f) {
            return cljs.core.boolean$.call(null, function() {
              var g = a.call(null, b, c, d);
              return cljs.core.truth_(g) ? cljs.core.every_QMARK_.call(null, function(a) {
                return cljs.core.every_QMARK_.call(null, a, f)
              }, e) : g
            }())
          }, c = function(a, c, d, e) {
            var f = null;
            3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f)
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a);
            a = cljs.core.next(a);
            var d = cljs.core.first(a);
            a = cljs.core.next(a);
            var e = cljs.core.first(a);
            a = cljs.core.rest(a);
            return b(c, d, e, a)
          };
          c.cljs$core$IFn$_invoke$arity$variadic = b;
          return c
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return!0;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.cljs$core$IFn$_invoke$arity$variadic(a, e, g, cljs.core.array_seq(arguments, 3))
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        a.cljs$core$IFn$_invoke$arity$0 = function() {
          return!0
        };
        a.cljs$core$IFn$_invoke$arity$1 = b;
        a.cljs$core$IFn$_invoke$arity$2 = c;
        a.cljs$core$IFn$_invoke$arity$3 = d;
        a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.some_fn = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b) {
        return a.call(null, b)
      }, d = function(b, c) {
        var d = a.call(null, b);
        return cljs.core.truth_(d) ? d : a.call(null, c)
      }, e = function(b, c, d) {
        b = a.call(null, b);
        if(cljs.core.truth_(b)) {
          return b
        }
        c = a.call(null, c);
        return cljs.core.truth_(c) ? c : a.call(null, d)
      }, m = function() {
        var c = function(c, d, e, h) {
          c = b.call(null, c, d, e);
          return cljs.core.truth_(c) ? c : cljs.core.some.call(null, a, h)
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a)
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return c.call(this, a);
          case 2:
            return d.call(this, a, b);
          case 3:
            return e.call(this, a, b, f);
          default:
            return m.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = m.cljs$lang$applyTo;
      b.cljs$core$IFn$_invoke$arity$0 = function() {
        return null
      };
      b.cljs$core$IFn$_invoke$arity$1 = c;
      b.cljs$core$IFn$_invoke$arity$2 = d;
      b.cljs$core$IFn$_invoke$arity$3 = e;
      b.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        var d = a.call(null, c);
        return cljs.core.truth_(d) ? d : b.call(null, c)
      }, e = function(c, d) {
        var e = a.call(null, c);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = a.call(null, d);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.call(null, c);
        return cljs.core.truth_(e) ? e : b.call(null, d)
      }, m = function(c, d, e) {
        var h = a.call(null, c);
        if(cljs.core.truth_(h)) {
          return h
        }
        h = a.call(null, d);
        if(cljs.core.truth_(h)) {
          return h
        }
        h = a.call(null, e);
        if(cljs.core.truth_(h)) {
          return h
        }
        c = b.call(null, c);
        if(cljs.core.truth_(c)) {
          return c
        }
        d = b.call(null, d);
        return cljs.core.truth_(d) ? d : b.call(null, e)
      }, n = function() {
        var d = function(d, e, k, m) {
          d = c.call(null, d, e, k);
          return cljs.core.truth_(d) ? d : cljs.core.some.call(null, function(c) {
            var d = a.call(null, c);
            return cljs.core.truth_(d) ? d : b.call(null, c)
          }, m)
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a)
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return m.call(this, a, b, c);
          default:
            return n.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = n.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$0 = function() {
        return null
      };
      c.cljs$core$IFn$_invoke$arity$1 = d;
      c.cljs$core$IFn$_invoke$arity$2 = e;
      c.cljs$core$IFn$_invoke$arity$3 = m;
      c.cljs$core$IFn$_invoke$arity$variadic = n.cljs$core$IFn$_invoke$arity$variadic;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        var e = a.call(null, d);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.call(null, d);
        return cljs.core.truth_(e) ? e : c.call(null, d)
      }, m = function(d, e) {
        var k = a.call(null, d);
        if(cljs.core.truth_(k)) {
          return k
        }
        k = b.call(null, d);
        if(cljs.core.truth_(k)) {
          return k
        }
        k = c.call(null, d);
        if(cljs.core.truth_(k)) {
          return k
        }
        k = a.call(null, e);
        if(cljs.core.truth_(k)) {
          return k
        }
        k = b.call(null, e);
        return cljs.core.truth_(k) ? k : c.call(null, e)
      }, n = function(d, e, k) {
        var m = a.call(null, d);
        if(cljs.core.truth_(m)) {
          return m
        }
        m = b.call(null, d);
        if(cljs.core.truth_(m)) {
          return m
        }
        d = c.call(null, d);
        if(cljs.core.truth_(d)) {
          return d
        }
        d = a.call(null, e);
        if(cljs.core.truth_(d)) {
          return d
        }
        d = b.call(null, e);
        if(cljs.core.truth_(d)) {
          return d
        }
        e = c.call(null, e);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = a.call(null, k);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.call(null, k);
        return cljs.core.truth_(e) ? e : c.call(null, k)
      }, p = function() {
        var e = function(e, m, l, p) {
          e = d.call(null, e, m, l);
          return cljs.core.truth_(e) ? e : cljs.core.some.call(null, function(d) {
            var e = a.call(null, d);
            if(cljs.core.truth_(e)) {
              return e
            }
            e = b.call(null, d);
            return cljs.core.truth_(e) ? e : c.call(null, d)
          }, p)
        }, m = function(a, b, c, d) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f)
        };
        m.cljs$lang$maxFixedArity = 3;
        m.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return e(b, c, d, a)
        };
        m.cljs$core$IFn$_invoke$arity$variadic = e;
        return m
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return e.call(this, a);
          case 2:
            return m.call(this, a, b);
          case 3:
            return n.call(this, a, b, c);
          default:
            return p.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = p.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$0 = function() {
        return null
      };
      d.cljs$core$IFn$_invoke$arity$1 = e;
      d.cljs$core$IFn$_invoke$arity$2 = m;
      d.cljs$core$IFn$_invoke$arity$3 = n;
      d.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.some.call(null, function(b) {
            return b.call(null, a)
          }, e)
        }, c = function(a, b) {
          return cljs.core.some.call(null, function(c) {
            var d = c.call(null, a);
            return cljs.core.truth_(d) ? d : c.call(null, b)
          }, e)
        }, d = function(a, b, c) {
          return cljs.core.some.call(null, function(d) {
            var e = d.call(null, a);
            if(cljs.core.truth_(e)) {
              return e
            }
            e = d.call(null, b);
            return cljs.core.truth_(e) ? e : d.call(null, c)
          }, e)
        }, f = function() {
          var b = function(b, c, d, f) {
            b = a.call(null, b, c, d);
            return cljs.core.truth_(b) ? b : cljs.core.some.call(null, function(a) {
              return cljs.core.some.call(null, a, f)
            }, e)
          }, c = function(a, c, d, e) {
            var f = null;
            3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f)
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a);
            a = cljs.core.next(a);
            var d = cljs.core.first(a);
            a = cljs.core.next(a);
            var e = cljs.core.first(a);
            a = cljs.core.rest(a);
            return b(c, d, e, a)
          };
          c.cljs$core$IFn$_invoke$arity$variadic = b;
          return c
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return null;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.cljs$core$IFn$_invoke$arity$variadic(a, e, g, cljs.core.array_seq(arguments, 3))
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        a.cljs$core$IFn$_invoke$arity$0 = function() {
          return null
        };
        a.cljs$core$IFn$_invoke$arity$1 = b;
        a.cljs$core$IFn$_invoke$arity$2 = c;
        a.cljs$core$IFn$_invoke$arity$3 = d;
        a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.map = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var d = cljs.core.seq.call(null, c);
      if(d) {
        if(cljs.core.chunked_seq_QMARK_.call(null, d)) {
          for(var e = cljs.core.chunk_first.call(null, d), l = cljs.core.count.call(null, e), m = cljs.core.chunk_buffer.call(null, l), n = 0;;) {
            if(n < l) {
              cljs.core.chunk_append.call(null, m, b.call(null, cljs.core._nth.call(null, e, n))), n += 1
            }else {
              break
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, m), a.call(null, b, cljs.core.chunk_rest.call(null, d)))
        }
        return cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, d)), a.call(null, b, cljs.core.rest.call(null, d)))
      }
      return null
    }, null, null)
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, function() {
      var e = cljs.core.seq.call(null, c), l = cljs.core.seq.call(null, d);
      return(e ? l : e) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, e), cljs.core.first.call(null, l)), a.call(null, b, cljs.core.rest.call(null, e), cljs.core.rest.call(null, l))) : null
    }, null, null)
  }, d = function(b, c, d, e) {
    return new cljs.core.LazySeq(null, function() {
      var l = cljs.core.seq.call(null, c), m = cljs.core.seq.call(null, d), n = cljs.core.seq.call(null, e);
      return(l ? m ? n : m : l) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, l), cljs.core.first.call(null, m), cljs.core.first.call(null, n)), a.call(null, b, cljs.core.rest.call(null, l), cljs.core.rest.call(null, m), cljs.core.rest.call(null, n))) : null
    }, null, null)
  }, e = function() {
    var b = function(b, c, d, e, f) {
      return a.call(null, function(a) {
        return cljs.core.apply.call(null, b, a)
      }, function r(b) {
        return new cljs.core.LazySeq(null, function() {
          var c = a.call(null, cljs.core.seq, b);
          return cljs.core.every_QMARK_.call(null, cljs.core.identity, c) ? cljs.core.cons.call(null, a.call(null, cljs.core.first, c), r.call(null, a.call(null, cljs.core.rest, c))) : null
        }, null, null)
      }.call(null, cljs.core.conj.call(null, f, e, d, c)))
    }, c = function(a, c, d, e, g) {
      var p = null;
      4 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, a, c, d, e, p)
    };
    c.cljs$lang$maxFixedArity = 4;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, e, g, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.take = function take(b, c) {
  return new cljs.core.LazySeq(null, function() {
    if(0 < b) {
      var d = cljs.core.seq.call(null, c);
      return d ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take.call(null, b - 1, cljs.core.rest.call(null, d))) : null
    }
    return null
  }, null, null)
};
cljs.core.drop = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq.call(null, b);
      if(cljs.core.truth_(function() {
        var b = 0 < a;
        return b ? c : b
      }())) {
        var g = a - 1, h = cljs.core.rest.call(null, c);
        a = g;
        b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, function() {
    return c.call(null, a, b)
  }, null, null)
};
cljs.core.drop_last = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b)
  }, c = function(a, b) {
    return cljs.core.map.call(null, function(a, b) {
      return a
    }, b, cljs.core.drop.call(null, a, b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.take_last = function(a, b) {
  for(var c = cljs.core.seq.call(null, b), d = cljs.core.seq.call(null, cljs.core.drop.call(null, a, b));;) {
    if(d) {
      c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d)
    }else {
      return c
    }
  }
};
cljs.core.drop_while = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq.call(null, b);
      if(cljs.core.truth_(function() {
        var b = c;
        return b ? a.call(null, cljs.core.first.call(null, c)) : b
      }())) {
        var g = a, h = cljs.core.rest.call(null, c);
        a = g;
        b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, function() {
    return c.call(null, a, b)
  }, null, null)
};
cljs.core.cycle = function cycle(b) {
  return new cljs.core.LazySeq(null, function() {
    var c = cljs.core.seq.call(null, b);
    return c ? cljs.core.concat.call(null, c, cycle.call(null, c)) : null
  }, null, null)
};
cljs.core.split_at = function(a, b) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take.call(null, a, b), cljs.core.drop.call(null, a, b)], !0)
};
cljs.core.repeat = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, b, a.call(null, b))
    }, null, null)
  }, c = function(b, c) {
    return cljs.core.take.call(null, b, a.call(null, c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.replicate = function(a, b) {
  return cljs.core.take.call(null, a, cljs.core.repeat.call(null, b))
};
cljs.core.repeatedly = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, b.call(null), a.call(null, b))
    }, null, null)
  }, c = function(b, c) {
    return cljs.core.take.call(null, b, a.call(null, c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.iterate = function iterate(b, c) {
  return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, function() {
    return iterate.call(null, b, b.call(null, c))
  }, null, null))
};
cljs.core.interleave = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, b), g = cljs.core.seq.call(null, c);
      return(f ? g : f) ? cljs.core.cons.call(null, cljs.core.first.call(null, f), cljs.core.cons.call(null, cljs.core.first.call(null, g), a.call(null, cljs.core.rest.call(null, f), cljs.core.rest.call(null, g)))) : null
    }, null, null)
  }, c = function() {
    var b = function(b, c, d) {
      return new cljs.core.LazySeq(null, function() {
        var e = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, d, c, b));
        return cljs.core.every_QMARK_.call(null, cljs.core.identity, e) ? cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, e), cljs.core.apply.call(null, a, cljs.core.map.call(null, cljs.core.rest, e))) : null
      }, null, null)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.interpose = function(a, b) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, a), b))
};
cljs.core.flatten1 = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, a);
      return f ? cljs.core.cons.call(null, cljs.core.first.call(null, f), c.call(null, cljs.core.rest.call(null, f), e)) : cljs.core.seq.call(null, e) ? c.call(null, cljs.core.first.call(null, e), cljs.core.rest.call(null, e)) : null
    }, null, null)
  }.call(null, null, a)
};
cljs.core.mapcat = function() {
  var a = null, b = function(a, b) {
    return cljs.core.flatten1.call(null, cljs.core.map.call(null, a, b))
  }, c = function() {
    var a = function(a, b, c) {
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, a, b, c))
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.filter = function filter(b, c) {
  return new cljs.core.LazySeq(null, function() {
    var d = cljs.core.seq.call(null, c);
    if(d) {
      if(cljs.core.chunked_seq_QMARK_.call(null, d)) {
        for(var e = cljs.core.chunk_first.call(null, d), f = cljs.core.count.call(null, e), g = cljs.core.chunk_buffer.call(null, f), h = 0;;) {
          if(h < f) {
            cljs.core.truth_(b.call(null, cljs.core._nth.call(null, e, h))) && cljs.core.chunk_append.call(null, g, cljs.core._nth.call(null, e, h)), h += 1
          }else {
            break
          }
        }
        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), filter.call(null, b, cljs.core.chunk_rest.call(null, d)))
      }
      e = cljs.core.first.call(null, d);
      d = cljs.core.rest.call(null, d);
      return cljs.core.truth_(b.call(null, e)) ? cljs.core.cons.call(null, e, filter.call(null, b, d)) : filter.call(null, b, d)
    }
    return null
  }, null, null)
};
cljs.core.remove = function(a, b) {
  return cljs.core.filter.call(null, cljs.core.complement.call(null, a), b)
};
cljs.core.tree_seq = function(a, b, c) {
  return function e(c) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, c, cljs.core.truth_(a.call(null, c)) ? cljs.core.mapcat.call(null, e, b.call(null, c)) : null)
    }, null, null)
  }.call(null, c)
};
cljs.core.flatten = function(a) {
  return cljs.core.filter.call(null, function(a) {
    return!cljs.core.sequential_QMARK_.call(null, a)
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, a)))
};
cljs.core.into = function(a, b) {
  var c;
  null != a ? (a ? (c = (c = a.cljs$lang$protocol_mask$partition1$ & 4) ? c : a.cljs$core$IEditableCollection$, c = c ? !0 : !1) : c = !1, c = c ? cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core.transient$.call(null, a), b)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)) : c = cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, b);
  return c
};
cljs.core.mapv = function() {
  var a = null, b = function(a, b) {
    return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(b, c) {
      return cljs.core.conj_BANG_.call(null, b, a.call(null, c))
    }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), b))
  }, c = function(a, b, c) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, a, b, c))
  }, d = function(a, b, c, d) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, a, b, c, d))
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.apply.call(null, cljs.core.map, a, b, c, d, e))
    }, b = function(b, c, d, e, g) {
      var p = null;
      4 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, p)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.filterv = function(a, b) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(b, d) {
    return cljs.core.truth_(a.call(null, d)) ? cljs.core.conj_BANG_.call(null, b, d) : b
  }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), b))
};
cljs.core.partition = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, b, c)
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, function() {
      var h = cljs.core.seq.call(null, d);
      if(h) {
        var k = cljs.core.take.call(null, b, h);
        return b === cljs.core.count.call(null, k) ? cljs.core.cons.call(null, k, a.call(null, b, c, cljs.core.drop.call(null, c, h))) : null
      }
      return null
    }, null, null)
  }, d = function(b, c, d, h) {
    return new cljs.core.LazySeq(null, function() {
      var k = cljs.core.seq.call(null, h);
      if(k) {
        var l = cljs.core.take.call(null, b, k);
        return b === cljs.core.count.call(null, l) ? cljs.core.cons.call(null, l, a.call(null, b, c, d, cljs.core.drop.call(null, c, k))) : cljs.core.list.call(null, cljs.core.take.call(null, b, cljs.core.concat.call(null, l, d)))
      }
      return null
    }, null, null)
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.get_in = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null)
  }, c = function(a, b, c) {
    var g = cljs.core.lookup_sentinel;
    for(b = cljs.core.seq.call(null, b);;) {
      if(b) {
        var h;
        if(h = a) {
          var k = void 0;
          k = (k = h.cljs$lang$protocol_mask$partition0$ & 256) ? k : h.cljs$core$ILookup$;
          h = k ? !0 : h.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ILookup, h)
        }else {
          h = cljs.core.type_satisfies_.call(null, cljs.core.ILookup, h)
        }
        if(h) {
          a = cljs.core.get.call(null, a, cljs.core.first.call(null, b), g);
          if(g === a) {
            return c
          }
          b = cljs.core.next.call(null, b)
        }else {
          return c
        }
      }else {
        return a
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.assoc_in = function assoc_in(b, c, d) {
  var e = cljs.core.nth.call(null, c, 0, null);
  c = cljs.core.nthnext.call(null, c, 1);
  return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, e, assoc_in.call(null, cljs.core.get.call(null, b, e), c, d)) : cljs.core.assoc.call(null, b, e, d)
};
cljs.core.update_in = function() {
  var a = null, b = function(b, c, d) {
    var e = cljs.core.nth.call(null, c, 0, null);
    c = cljs.core.nthnext.call(null, c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core.get.call(null, b, e), c, d)) : cljs.core.assoc.call(null, b, e, d.call(null, cljs.core.get.call(null, b, e)))
  }, c = function(b, c, d, e) {
    var f = cljs.core.nth.call(null, c, 0, null);
    c = cljs.core.nthnext.call(null, c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, f, a.call(null, cljs.core.get.call(null, b, f), c, d, e)) : cljs.core.assoc.call(null, b, f, d.call(null, cljs.core.get.call(null, b, f), e))
  }, d = function(b, c, d, e, f) {
    var n = cljs.core.nth.call(null, c, 0, null);
    c = cljs.core.nthnext.call(null, c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, n, a.call(null, cljs.core.get.call(null, b, n), c, d, e, f)) : cljs.core.assoc.call(null, b, n, d.call(null, cljs.core.get.call(null, b, n), e, f))
  }, e = function(b, c, d, e, f, n) {
    var p = cljs.core.nth.call(null, c, 0, null);
    c = cljs.core.nthnext.call(null, c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, p, a.call(null, cljs.core.get.call(null, b, p), c, d, e, f, n)) : cljs.core.assoc.call(null, b, p, d.call(null, cljs.core.get.call(null, b, p), e, f, n))
  }, f = function() {
    var b = function(b, c, d, e, f, g, h) {
      var q = cljs.core.nth.call(null, c, 0, null);
      c = cljs.core.nthnext.call(null, c, 1);
      return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, q, cljs.core.apply.call(null, a, cljs.core.get.call(null, b, q), c, d, e, f, g, h)) : cljs.core.assoc.call(null, b, q, cljs.core.apply.call(null, d, cljs.core.get.call(null, b, q), e, f, g, h))
    }, c = function(a, c, d, e, f, h, s) {
      var q = null;
      6 < arguments.length && (q = cljs.core.array_seq(Array.prototype.slice.call(arguments, 6), 0));
      return b.call(this, a, c, d, e, f, h, q)
    };
    c.cljs$lang$maxFixedArity = 6;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var f = cljs.core.first(a);
      a = cljs.core.next(a);
      var h = cljs.core.first(a);
      a = cljs.core.next(a);
      var s = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, e, f, h, s, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, h, k, l, m, n, p) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, h, k);
      case 4:
        return c.call(this, a, h, k, l);
      case 5:
        return d.call(this, a, h, k, l, m);
      case 6:
        return e.call(this, a, h, k, l, m, n);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, n, cljs.core.array_seq(arguments, 6))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 6;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  a.cljs$core$IFn$_invoke$arity$6 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.VectorNode = function(a, b) {
  this.edit = a;
  this.arr = b
};
cljs.core.VectorNode.cljs$lang$type = !0;
cljs.core.VectorNode.cljs$lang$ctorStr = "cljs.core/VectorNode";
cljs.core.VectorNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/VectorNode")
};
cljs.core.__GT_VectorNode = function(a, b) {
  return new cljs.core.VectorNode(a, b)
};
cljs.core.pv_fresh_node = function(a) {
  return new cljs.core.VectorNode(a, Array(32))
};
cljs.core.pv_aget = function(a, b) {
  return a.arr[b]
};
cljs.core.pv_aset = function(a, b, c) {
  return a.arr[b] = c
};
cljs.core.pv_clone_node = function(a) {
  return new cljs.core.VectorNode(a.edit, a.arr.slice())
};
cljs.core.tail_off = function(a) {
  a = a.cnt;
  return 32 > a ? 0 : a - 1 >>> 5 << 5
};
cljs.core.new_path = function(a, b, c) {
  for(;;) {
    if(0 === b) {
      return c
    }
    var d = cljs.core.pv_fresh_node.call(null, a);
    cljs.core.pv_aset.call(null, d, 0, c);
    c = d;
    b -= 5
  }
};
cljs.core.push_tail = function push_tail(b, c, d, e) {
  var f = cljs.core.pv_clone_node.call(null, d), g = b.cnt - 1 >>> c & 31;
  5 === c ? cljs.core.pv_aset.call(null, f, g, e) : (d = cljs.core.pv_aget.call(null, d, g), b = null != d ? push_tail.call(null, b, c - 5, d, e) : cljs.core.new_path.call(null, null, c - 5, e), cljs.core.pv_aset.call(null, f, g, b));
  return f
};
cljs.core.vector_index_out_of_bounds = function(a, b) {
  throw Error([cljs.core.str("No item "), cljs.core.str(a), cljs.core.str(" in vector of length "), cljs.core.str(b)].join(""));
};
cljs.core.array_for = function(a, b) {
  var c;
  c = (c = 0 <= b) ? b < a.cnt : c;
  if(c) {
    if(b >= cljs.core.tail_off.call(null, a)) {
      return a.tail
    }
    c = a.root;
    for(var d = a.shift;;) {
      if(0 < d) {
        c = cljs.core.pv_aget.call(null, c, b >>> d & 31), d -= 5
      }else {
        return c.arr
      }
    }
  }else {
    return cljs.core.vector_index_out_of_bounds.call(null, b, a.cnt)
  }
};
cljs.core.do_assoc = function do_assoc(b, c, d, e, f) {
  var g = cljs.core.pv_clone_node.call(null, d);
  if(0 === c) {
    cljs.core.pv_aset.call(null, g, e & 31, f)
  }else {
    var h = e >>> c & 31;
    cljs.core.pv_aset.call(null, g, h, do_assoc.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, h), e, f))
  }
  return g
};
cljs.core.pop_tail = function pop_tail(b, c, d) {
  var e = b.cnt - 2 >>> c & 31;
  if(5 < c) {
    b = pop_tail.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, e));
    c = null == b;
    if(c ? 0 === e : c) {
      return null
    }
    d = cljs.core.pv_clone_node.call(null, d);
    cljs.core.pv_aset.call(null, d, e, b);
    return d
  }
  return 0 === e ? null : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (d = cljs.core.pv_clone_node.call(null, d), cljs.core.pv_aset.call(null, d, e, null), d) : null
};
cljs.core.PersistentVector = function(a, b, c, d, e, f) {
  this.meta = a;
  this.cnt = b;
  this.shift = c;
  this.root = d;
  this.tail = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 167668511
};
cljs.core.PersistentVector.cljs$lang$type = !0;
cljs.core.PersistentVector.cljs$lang$ctorStr = "cljs.core/PersistentVector";
cljs.core.PersistentVector.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentVector")
};
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientVector(this.cnt, this.shift, cljs.core.tv_editable_root.call(null, this.root), cljs.core.tv_editable_tail.call(null, this.tail))
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d;
  d = (d = 0 <= b) ? b < this.cnt : d;
  if(d) {
    return cljs.core.tail_off.call(null, a) <= b ? (a = this.tail.slice(), a[b & 31] = c, new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, this.root, a, null)) : new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, cljs.core.do_assoc.call(null, a, this.shift, this.root, b, c), this.tail, null)
  }
  if(b === this.cnt) {
    return a.cljs$core$ICollection$_conj$arity$2(a, c)
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error([cljs.core.str("Index "), cljs.core.str(b), cljs.core.str(" out of bounds  [0,"), cljs.core.str(this.cnt), cljs.core.str("]")].join(""));
  }
  return null
};
cljs.core.PersistentVector.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$IIndexed$_nth$arity$2(this, c);
      case 3:
        return this.cljs$core$IIndexed$_nth$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentVector.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  c = [0, c];
  for(var d = 0;;) {
    if(d < this.cnt) {
      var e = cljs.core.array_for.call(null, a, d), f = e.length;
      a: {
        for(var g = 0, h = c[1];;) {
          if(g < f) {
            if(h = b.call(null, h, g + d, e[g]), cljs.core.reduced_QMARK_.call(null, h)) {
              e = h;
              break a
            }else {
              g += 1
            }
          }else {
            c[0] = f;
            e = c[1] = h;
            break a
          }
        }
        e = void 0
      }
      if(cljs.core.reduced_QMARK_.call(null, e)) {
        return cljs.core.deref.call(null, e)
      }
      d += c[0]
    }else {
      return c[1]
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if(32 > this.cnt - cljs.core.tail_off.call(null, a)) {
    var c = this.tail.slice();
    c.push(b);
    return new cljs.core.PersistentVector(this.meta, this.cnt + 1, this.shift, this.root, c, null)
  }
  var d = this.cnt >>> 5 > 1 << this.shift, c = d ? this.shift + 5 : this.shift;
  d ? (d = cljs.core.pv_fresh_node.call(null, null), cljs.core.pv_aset.call(null, d, 0, this.root), cljs.core.pv_aset.call(null, d, 1, cljs.core.new_path.call(null, null, this.shift, new cljs.core.VectorNode(null, this.tail)))) : d = cljs.core.push_tail.call(null, a, this.shift, this.root, new cljs.core.VectorNode(null, this.tail));
  return new cljs.core.PersistentVector(this.meta, this.cnt + 1, c, d, [b], null)
};
cljs.core.PersistentVector.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < this.cnt ? new cljs.core.RSeq(a, this.cnt - 1, null) : cljs.core.List.EMPTY
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return a.cljs$core$IIndexed$_nth$arity$2(a, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return a.cljs$core$IIndexed$_nth$arity$2(a, 1)
};
cljs.core.PersistentVector.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 === this.cnt ? null : 32 > this.cnt ? cljs.core.array_seq.call(null, this.tail) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.chunked_seq.call(null, a, 0, 0) : null
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return 0 < this.cnt ? a.cljs$core$IIndexed$_nth$arity$2(a, this.cnt - 1) : null
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if(0 === this.cnt) {
    throw Error("Can't pop empty vector");
  }
  if(1 === this.cnt) {
    return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta)
  }
  if(1 < this.cnt - cljs.core.tail_off.call(null, a)) {
    return new cljs.core.PersistentVector(this.meta, this.cnt - 1, this.shift, this.root, this.tail.slice(0, -1), null)
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    var b = cljs.core.array_for.call(null, a, this.cnt - 2);
    a = cljs.core.pop_tail.call(null, a, this.shift, this.root);
    a = null == a ? cljs.core.PersistentVector.EMPTY_NODE : a;
    var c = this.cnt - 1, d;
    d = (d = 5 < this.shift) ? null == cljs.core.pv_aget.call(null, a, 1) : d;
    return d ? new cljs.core.PersistentVector(this.meta, c, this.shift - 5, cljs.core.pv_aget.call(null, a, 0), b, null) : new cljs.core.PersistentVector(this.meta, c, this.shift, a, b, null)
  }
  return null
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentVector(b, this.cnt, this.shift, this.root, this.tail, this.__hash)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return cljs.core.array_for.call(null, a, b)[b & 31]
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  var d;
  d = (d = 0 <= b) ? b < this.cnt : d;
  return d ? a.cljs$core$IIndexed$_nth$arity$2(a, b) : c
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta)
};
cljs.core.__GT_PersistentVector = function(a, b, c, d, e, f) {
  return new cljs.core.PersistentVector(a, b, c, d, e, f)
};
cljs.core.PersistentVector.EMPTY_NODE = new cljs.core.VectorNode(null, Array(32));
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, [], 0);
cljs.core.PersistentVector.fromArray = function(a, b) {
  var c = a.length, d = b ? a : a.slice();
  if(32 > c) {
    return new cljs.core.PersistentVector(null, c, 5, cljs.core.PersistentVector.EMPTY_NODE, d, null)
  }
  for(var e = d.slice(0, 32), f = new cljs.core.PersistentVector(null, 32, 5, cljs.core.PersistentVector.EMPTY_NODE, e, null), e = 32, g = cljs.core._as_transient.call(null, f);;) {
    if(e < c) {
      f = e + 1, g = cljs.core.conj_BANG_.call(null, g, d[e]), e = f
    }else {
      return cljs.core.persistent_BANG_.call(null, g)
    }
  }
};
cljs.core.vec = function(a) {
  return cljs.core._persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core._as_transient.call(null, cljs.core.PersistentVector.EMPTY), a))
};
cljs.core.vector = function() {
  var a = function(a) {
    return cljs.core.vec.call(null, a)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.ChunkedSeq = function(a, b, c, d, e, f) {
  this.vec = a;
  this.node = b;
  this.i = c;
  this.off = d;
  this.meta = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition0$ = 32243948;
  this.cljs$lang$protocol_mask$partition1$ = 1536
};
cljs.core.ChunkedSeq.cljs$lang$type = !0;
cljs.core.ChunkedSeq.cljs$lang$ctorStr = "cljs.core/ChunkedSeq";
cljs.core.ChunkedSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkedSeq")
};
cljs.core.ChunkedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.off + 1 < this.node.length ? (a = cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off + 1), null == a ? null : a) : a.cljs$core$IChunkedNext$_chunked_next$arity$1(a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.ChunkedSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, cljs.core.subvec.call(null, this.vec, this.i + this.off, cljs.core.count.call(null, this.vec)), b)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, cljs.core.subvec.call(null, this.vec, this.i + this.off, cljs.core.count.call(null, this.vec)), b, c)
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.node[this.off]
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.off + 1 < this.node.length ? (a = cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off + 1), null == a ? cljs.core.List.EMPTY : a) : a.cljs$core$IChunkedSeq$_chunked_rest$arity$1(a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(a) {
  a = this.node.length;
  a = this.i + a < cljs.core._count.call(null, this.vec) ? cljs.core.chunked_seq.call(null, this.vec, this.i + a, 0) : null;
  return null == a ? null : a
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off, b)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(a) {
  return cljs.core.array_chunk.call(null, this.node, this.off)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(a) {
  a = this.node.length;
  a = this.i + a < cljs.core._count.call(null, this.vec) ? cljs.core.chunked_seq.call(null, this.vec, this.i + a, 0) : null;
  return null == a ? cljs.core.List.EMPTY : a
};
cljs.core.__GT_ChunkedSeq = function(a, b, c, d, e, f) {
  return new cljs.core.ChunkedSeq(a, b, c, d, e, f)
};
cljs.core.chunked_seq = function() {
  var a = null, b = function(a, b, c) {
    return new cljs.core.ChunkedSeq(a, cljs.core.array_for.call(null, a, b), b, c, null, null)
  }, c = function(a, b, c, d) {
    return new cljs.core.ChunkedSeq(a, b, c, d, null, null)
  }, d = function(a, b, c, d, k) {
    return new cljs.core.ChunkedSeq(a, b, c, d, k, null)
  }, a = function(a, f, g, h, k) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, f, g);
      case 4:
        return c.call(this, a, f, g, h);
      case 5:
        return d.call(this, a, f, g, h, k)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  return a
}();
cljs.core.Subvec = function(a, b, c, d, e) {
  this.meta = a;
  this.v = b;
  this.start = c;
  this.end = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32400159
};
cljs.core.Subvec.cljs$lang$type = !0;
cljs.core.Subvec.cljs$lang$ctorStr = "cljs.core/Subvec";
cljs.core.Subvec.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Subvec")
};
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = this, e = d.start + b;
  return cljs.core.build_subvec.call(null, d.meta, cljs.core.assoc.call(null, d.v, e, c), d.start, function() {
    var a = d.end, b = e + 1;
    return a > b ? a : b
  }(), null)
};
cljs.core.Subvec.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$IIndexed$_nth$arity$2(this, c);
      case 3:
        return this.cljs$core$IIndexed$_nth$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.Subvec.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.build_subvec.call(null, this.meta, cljs.core._assoc_n.call(null, this.v, this.end, b), this.start, this.end + 1, null)
};
cljs.core.Subvec.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  return function d(a) {
    return a === b.end ? null : cljs.core.cons.call(null, cljs.core._nth.call(null, b.v, a), new cljs.core.LazySeq(null, function() {
      return d.call(null, a + 1)
    }, null, null))
  }.call(null, b.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end - this.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return cljs.core._nth.call(null, this.v, this.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if(this.start === this.end) {
    throw Error("Can't pop empty vector");
  }
  return cljs.core.build_subvec.call(null, this.meta, this.v, this.start, this.end - 1, null)
};
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.build_subvec.call(null, b, this.v, this.start, this.end, this.__hash)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  var c;
  c = (c = 0 > b) ? c : this.end <= this.start + b;
  return c ? cljs.core.vector_index_out_of_bounds.call(null, b, this.end - this.start) : cljs.core._nth.call(null, this.v, this.start + b)
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = (a = 0 > b) ? a : this.end <= this.start + b;
  return a ? c : cljs.core._nth.call(null, this.v, this.start + b, c)
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta)
};
cljs.core.__GT_Subvec = function(a, b, c, d, e) {
  return new cljs.core.Subvec(a, b, c, d, e)
};
cljs.core.build_subvec = function(a, b, c, d, e) {
  for(;;) {
    if(b instanceof cljs.core.Subvec) {
      var f = b.start + c, g = b.start + d;
      b = b.v;
      c = f;
      d = g
    }else {
      var h = cljs.core.count.call(null, b);
      if(function() {
        var a = 0 > c;
        return a || (a = 0 > d) ? a : (a = c > h) ? a : d > h
      }()) {
        throw Error("Index out of bounds");
      }
      return new cljs.core.Subvec(a, b, c, d, e)
    }
  }
};
cljs.core.subvec = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, cljs.core.count.call(null, b))
  }, c = function(a, b, c) {
    return cljs.core.build_subvec.call(null, null, a, b, c, null)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.tv_ensure_editable = function(a, b) {
  return a === b.edit ? b : new cljs.core.VectorNode(a, b.arr.slice())
};
cljs.core.tv_editable_root = function(a) {
  return new cljs.core.VectorNode({}, a.arr.slice())
};
cljs.core.tv_editable_tail = function(a) {
  var b = Array(32);
  cljs.core.array_copy.call(null, a, 0, b, 0, a.length);
  return b
};
cljs.core.tv_push_tail = function tv_push_tail(b, c, d, e) {
  var f = cljs.core.tv_ensure_editable.call(null, b.root.edit, d), g = b.cnt - 1 >>> c & 31;
  cljs.core.pv_aset.call(null, f, g, 5 === c ? e : function() {
    var d = cljs.core.pv_aget.call(null, f, g);
    return null != d ? tv_push_tail.call(null, b, c - 5, d, e) : cljs.core.new_path.call(null, b.root.edit, c - 5, e)
  }());
  return f
};
cljs.core.tv_pop_tail = function tv_pop_tail(b, c, d) {
  d = cljs.core.tv_ensure_editable.call(null, b.root.edit, d);
  var e = b.cnt - 2 >>> c & 31;
  if(5 < c) {
    b = tv_pop_tail.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, e));
    c = null == b;
    if(c ? 0 === e : c) {
      return null
    }
    cljs.core.pv_aset.call(null, d, e, b);
    return d
  }
  return 0 === e ? null : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (cljs.core.pv_aset.call(null, d, e, null), d) : null
};
cljs.core.editable_array_for = function(a, b) {
  var c;
  c = (c = 0 <= b) ? b < a.cnt : c;
  if(c) {
    if(b >= cljs.core.tail_off.call(null, a)) {
      return a.tail
    }
    for(var d = c = a.root, e = a.shift;;) {
      if(0 < e) {
        d = cljs.core.tv_ensure_editable.call(null, c.edit, cljs.core.pv_aget.call(null, d, b >>> e & 31)), e -= 5
      }else {
        return d.arr
      }
    }
  }else {
    throw Error([cljs.core.str("No item "), cljs.core.str(b), cljs.core.str(" in transient vector of length "), cljs.core.str(a.cnt)].join(""));
  }
};
cljs.core.TransientVector = function(a, b, c, d) {
  this.cnt = a;
  this.shift = b;
  this.root = c;
  this.tail = d;
  this.cljs$lang$protocol_mask$partition0$ = 275;
  this.cljs$lang$protocol_mask$partition1$ = 88
};
cljs.core.TransientVector.cljs$lang$type = !0;
cljs.core.TransientVector.cljs$lang$ctorStr = "cljs.core/TransientVector";
cljs.core.TransientVector.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientVector")
};
cljs.core.TransientVector.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.TransientVector.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if(this.root.edit) {
    return cljs.core.array_for.call(null, a, b)[b & 31]
  }
  throw Error("nth after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  var d;
  d = (d = 0 <= b) ? b < this.cnt : d;
  return d ? a.cljs$core$IIndexed$_nth$arity$2(a, b) : c
};
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if(this.root.edit) {
    return this.cnt
  }
  throw Error("count after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = function(a, b, c) {
  var d = this;
  if(d.root.edit) {
    if(function() {
      var a = 0 <= b;
      return a ? b < d.cnt : a
    }()) {
      if(cljs.core.tail_off.call(null, a) <= b) {
        d.tail[b & 31] = c
      }else {
        var e = function g(a, e) {
          var l = cljs.core.tv_ensure_editable.call(null, d.root.edit, e);
          if(0 === a) {
            cljs.core.pv_aset.call(null, l, b & 31, c)
          }else {
            var m = b >>> a & 31;
            cljs.core.pv_aset.call(null, l, m, g.call(null, a - 5, cljs.core.pv_aget.call(null, l, m)))
          }
          return l
        }.call(null, d.shift, d.root);
        d.root = e
      }
      return a
    }
    if(b === d.cnt) {
      return a.cljs$core$ITransientCollection$_conj_BANG_$arity$2(a, c)
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      throw Error([cljs.core.str("Index "), cljs.core.str(b), cljs.core.str(" out of bounds for TransientVector of length"), cljs.core.str(d.cnt)].join(""));
    }
    return null
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_pop_BANG_$arity$1 = function(a) {
  var b = this;
  if(b.root.edit) {
    if(0 === b.cnt) {
      throw Error("Can't pop empty vector");
    }
    if(1 === b.cnt) {
      return b.cnt = 0, a
    }
    if(0 < (b.cnt - 1 & 31)) {
      return b.cnt -= 1, a
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      var c = cljs.core.editable_array_for.call(null, a, b.cnt - 2), d = function() {
        var c = cljs.core.tv_pop_tail.call(null, a, b.shift, b.root);
        return null != c ? c : new cljs.core.VectorNode(b.root.edit, Array(32))
      }();
      if(function() {
        var a = 5 < b.shift;
        return a ? null == cljs.core.pv_aget.call(null, d, 1) : a
      }()) {
        var e = cljs.core.tv_ensure_editable.call(null, b.root.edit, cljs.core.pv_aget.call(null, d, 0));
        b.root = e;
        b.shift -= 5
      }else {
        b.root = d
      }
      b.cnt -= 1;
      b.tail = c;
      return a
    }
    return null
  }
  throw Error("pop! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  return a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(a, b, c)
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  if(this.root.edit) {
    if(32 > this.cnt - cljs.core.tail_off.call(null, a)) {
      this.tail[this.cnt & 31] = b
    }else {
      var c = new cljs.core.VectorNode(this.root.edit, this.tail), d = Array(32);
      d[0] = b;
      this.tail = d;
      if(this.cnt >>> 5 > 1 << this.shift) {
        var d = Array(32), e = this.shift + 5;
        d[0] = this.root;
        d[1] = cljs.core.new_path.call(null, this.root.edit, this.shift, c);
        this.root = new cljs.core.VectorNode(this.root.edit, d);
        this.shift = e
      }else {
        this.root = cljs.core.tv_push_tail.call(null, a, this.shift, this.root, c)
      }
    }
    this.cnt += 1;
    return a
  }
  throw Error("conj! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  if(this.root.edit) {
    this.root.edit = null;
    a = this.cnt - cljs.core.tail_off.call(null, a);
    var b = Array(a);
    cljs.core.array_copy.call(null, this.tail, 0, b, 0, a);
    return new cljs.core.PersistentVector(null, this.cnt, this.shift, this.root, b, null)
  }
  throw Error("persistent! called twice");
};
cljs.core.__GT_TransientVector = function(a, b, c, d) {
  return new cljs.core.TransientVector(a, b, c, d)
};
cljs.core.PersistentQueueSeq = function(a, b, c, d) {
  this.meta = a;
  this.front = b;
  this.rear = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572
};
cljs.core.PersistentQueueSeq.cljs$lang$type = !0;
cljs.core.PersistentQueueSeq.cljs$lang$ctorStr = "cljs.core/PersistentQueueSeq";
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, this.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  var b = cljs.core.next.call(null, this.front);
  return b ? new cljs.core.PersistentQueueSeq(this.meta, b, this.rear, null) : null == this.rear ? a.cljs$core$IEmptyableCollection$_empty$arity$1(a) : new cljs.core.PersistentQueueSeq(this.meta, this.rear, null, null)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueueSeq(b, this.front, this.rear, this.__hash)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_PersistentQueueSeq = function(a, b, c, d) {
  return new cljs.core.PersistentQueueSeq(a, b, c, d)
};
cljs.core.PersistentQueue = function(a, b, c, d, e) {
  this.meta = a;
  this.count = b;
  this.front = c;
  this.rear = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31858766
};
cljs.core.PersistentQueue.cljs$lang$type = !0;
cljs.core.PersistentQueue.cljs$lang$ctorStr = "cljs.core/PersistentQueue";
cljs.core.PersistentQueue.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentQueue")
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  var c = this;
  return cljs.core.truth_(c.front) ? new cljs.core.PersistentQueue(c.meta, c.count + 1, c.front, cljs.core.conj.call(null, function() {
    var a = c.rear;
    return cljs.core.truth_(a) ? a : cljs.core.PersistentVector.EMPTY
  }(), b), null) : new cljs.core.PersistentQueue(c.meta, c.count + 1, cljs.core.conj.call(null, c.front, b), cljs.core.PersistentVector.EMPTY, null)
};
cljs.core.PersistentQueue.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this, c = cljs.core.seq.call(null, b.rear);
  return cljs.core.truth_(function() {
    var a = b.front;
    return cljs.core.truth_(a) ? a : c
  }()) ? new cljs.core.PersistentQueueSeq(null, b.front, cljs.core.seq.call(null, c), null) : null
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return cljs.core.first.call(null, this.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core.truth_(this.front) ? (a = cljs.core.next.call(null, this.front)) ? new cljs.core.PersistentQueue(this.meta, this.count - 1, a, this.rear, null) : new cljs.core.PersistentQueue(this.meta, this.count - 1, cljs.core.seq.call(null, this.rear), cljs.core.PersistentVector.EMPTY, null) : a
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, this.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.rest.call(null, cljs.core.seq.call(null, a))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueue(b, this.count, this.front, this.rear, this.__hash)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentQueue.EMPTY
};
cljs.core.__GT_PersistentQueue = function(a, b, c, d, e) {
  return new cljs.core.PersistentQueue(a, b, c, d, e)
};
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.EMPTY, 0);
cljs.core.NeverEquiv = function() {
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2097152
};
cljs.core.NeverEquiv.cljs$lang$type = !0;
cljs.core.NeverEquiv.cljs$lang$ctorStr = "cljs.core/NeverEquiv";
cljs.core.NeverEquiv.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/NeverEquiv")
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return!1
};
cljs.core.__GT_NeverEquiv = function() {
  return new cljs.core.NeverEquiv
};
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.map_QMARK_.call(null, b) ? cljs.core.count.call(null, a) === cljs.core.count.call(null, b) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(a) {
    return cljs.core._EQ_.call(null, cljs.core.get.call(null, b, cljs.core.first.call(null, a), cljs.core.never_equiv), cljs.core.second.call(null, a))
  }, a)) : null : null)
};
cljs.core.scan_array = function(a, b, c) {
  for(var d = c.length, e = 0;;) {
    if(e < d) {
      if(b === c[e]) {
        return e
      }
      e += a
    }else {
      return null
    }
  }
};
cljs.core.obj_map_compare_keys = function(a, b) {
  var c = cljs.core.hash.call(null, a), d = cljs.core.hash.call(null, b);
  return c < d ? -1 : c > d ? 1 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? 0 : null
};
cljs.core.obj_map__GT_hash_map = function(a, b, c) {
  var d = a.keys, e = d.length, f = a.strobj;
  a = cljs.core.meta.call(null, a);
  for(var g = 0, h = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
    if(g < e) {
      var k = d[g], g = g + 1, h = cljs.core.assoc_BANG_.call(null, h, k, f[k])
    }else {
      return cljs.core.with_meta.call(null, cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, h, b, c)), a)
    }
  }
};
cljs.core.obj_clone = function(a, b) {
  for(var c = {}, d = b.length, e = 0;;) {
    if(e < d) {
      var f = b[e];
      c[f] = a[f];
      e += 1
    }else {
      break
    }
  }
  return c
};
cljs.core.ObjMap = function(a, b, c, d, e) {
  this.meta = a;
  this.keys = b;
  this.strobj = c;
  this.update_count = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.ObjMap.cljs$lang$type = !0;
cljs.core.ObjMap.cljs$lang$ctorStr = "cljs.core/ObjMap";
cljs.core.ObjMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ObjMap")
};
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.hash_map.call(null), a))
};
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = (a = goog.isString(b)) ? null != cljs.core.scan_array.call(null, 1, b, this.keys) : a;
  return a ? this.strobj[b] : c
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if(goog.isString(b)) {
    var d;
    d = (d = this.update_count > cljs.core.ObjMap.HASHMAP_THRESHOLD) ? d : this.keys.length >= cljs.core.ObjMap.HASHMAP_THRESHOLD;
    if(d) {
      return cljs.core.obj_map__GT_hash_map.call(null, a, b, c)
    }
    if(null != cljs.core.scan_array.call(null, 1, b, this.keys)) {
      return a = cljs.core.obj_clone.call(null, this.strobj, this.keys), a[b] = c, new cljs.core.ObjMap(this.meta, this.keys, a, this.update_count + 1, null)
    }
    a = cljs.core.obj_clone.call(null, this.strobj, this.keys);
    d = this.keys.slice();
    a[b] = c;
    d.push(b);
    return new cljs.core.ObjMap(this.meta, d, a, this.update_count + 1, null)
  }
  return cljs.core.obj_map__GT_hash_map.call(null, a, b, c)
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  var c;
  c = (c = goog.isString(b)) ? null != cljs.core.scan_array.call(null, 1, b, this.keys) : c;
  return c ? !0 : !1
};
cljs.core.ObjMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.ObjMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.ObjMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  for(a = this.keys.sort(cljs.core.obj_map_compare_keys);;) {
    if(cljs.core.seq.call(null, a)) {
      var d = cljs.core.first.call(null, a);
      c = b.call(null, c, d, this.strobj[d]);
      if(cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c)
      }
      a = cljs.core.rest.call(null, a)
    }else {
      return c
    }
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.ObjMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  return 0 < b.keys.length ? cljs.core.map.call(null, function(a) {
    return cljs.core.vector.call(null, a, b.strobj[a])
  }, b.keys.sort(cljs.core.obj_map_compare_keys)) : null
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ObjMap(b, this.keys, this.strobj, this.update_count, this.__hash)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c;
  c = (c = goog.isString(b)) ? null != cljs.core.scan_array.call(null, 1, b, this.keys) : c;
  if(c) {
    c = this.keys.slice();
    var d = cljs.core.obj_clone.call(null, this.strobj, this.keys);
    c.splice(cljs.core.scan_array.call(null, 1, b, c), 1);
    delete d[b];
    return new cljs.core.ObjMap(this.meta, c, d, this.update_count + 1, null)
  }
  return a
};
cljs.core.__GT_ObjMap = function(a, b, c, d, e) {
  return new cljs.core.ObjMap(a, b, c, d, e)
};
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], {}, 0, 0);
cljs.core.ObjMap.HASHMAP_THRESHOLD = 8;
cljs.core.ObjMap.fromObject = function(a, b) {
  return new cljs.core.ObjMap(null, a, b, 0, null)
};
cljs.core.array_map_index_of_nil_QMARK_ = function(a, b, c) {
  b = a.length;
  for(c = 0;;) {
    if(b <= c) {
      return-1
    }
    if(null == a[c]) {
      return c
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      c += 2
    }else {
      return null
    }
  }
};
cljs.core.array_map_index_of_keyword_QMARK_ = function(a, b, c) {
  b = a.length;
  c = c.fqn;
  for(var d = 0;;) {
    if(b <= d) {
      return-1
    }
    var e;
    e = a[d];
    var f = e instanceof cljs.core.Keyword;
    e = f ? c === e.fqn : f;
    if(e) {
      return d
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      d += 2
    }else {
      return null
    }
  }
};
cljs.core.array_map_index_of_symbol_QMARK_ = function(a, b, c) {
  b = a.length;
  c = c.str;
  for(var d = 0;;) {
    if(b <= d) {
      return-1
    }
    var e;
    e = a[d];
    var f = e instanceof cljs.core.Symbol;
    e = f ? c === e.str : f;
    if(e) {
      return d
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      d += 2
    }else {
      return null
    }
  }
};
cljs.core.array_map_index_of_identical_QMARK_ = function(a, b, c) {
  b = a.length;
  for(var d = 0;;) {
    if(b <= d) {
      return-1
    }
    if(c === a[d]) {
      return d
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      d += 2
    }else {
      return null
    }
  }
};
cljs.core.array_map_index_of_equiv_QMARK_ = function(a, b, c) {
  b = a.length;
  for(var d = 0;;) {
    if(b <= d) {
      return-1
    }
    if(cljs.core._EQ_.call(null, c, a[d])) {
      return d
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      d += 2
    }else {
      return null
    }
  }
};
cljs.core.array_map_index_of = function(a, b) {
  var c = a.arr;
  if(b instanceof cljs.core.Keyword) {
    return cljs.core.array_map_index_of_keyword_QMARK_.call(null, c, a, b)
  }
  var d = goog.isString(b);
  return(d ? d : "number" === typeof b) ? cljs.core.array_map_index_of_identical_QMARK_.call(null, c, a, b) : b instanceof cljs.core.Symbol ? cljs.core.array_map_index_of_symbol_QMARK_.call(null, c, a, b) : null == b ? cljs.core.array_map_index_of_nil_QMARK_.call(null, c, a, b) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.array_map_index_of_equiv_QMARK_.call(null, c, a, b) : null
};
cljs.core.array_map_extend_kv = function(a, b, c) {
  a = a.arr;
  for(var d = a.length, e = Array(d + 2), f = 0;;) {
    if(f < d) {
      e[f] = a[f], f += 1
    }else {
      break
    }
  }
  e[d] = b;
  e[d + 1] = c;
  return e
};
cljs.core.PersistentArrayMapSeq = function(a, b, c) {
  this.arr = a;
  this.i = b;
  this._meta = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374990
};
cljs.core.PersistentArrayMapSeq.cljs$lang$type = !0;
cljs.core.PersistentArrayMapSeq.cljs$lang$ctorStr = "cljs.core/PersistentArrayMapSeq";
cljs.core.PersistentArrayMapSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentArrayMapSeq")
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.i < this.arr.length - 2 ? new cljs.core.PersistentArrayMapSeq(this.arr, this.i + 2, this._meta) : null
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.PersistentArrayMapSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return(this.arr.length - this.i) / 2
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.PersistentVector.fromArray([this.arr[this.i], this.arr[this.i + 1]], !0)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.i < this.arr.length - 2 ? new cljs.core.PersistentArrayMapSeq(this.arr, this.i + 2, this._meta) : cljs.core.List.EMPTY
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentArrayMapSeq(this.arr, this.i, b)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this._meta)
};
cljs.core.__GT_PersistentArrayMapSeq = function(a, b, c) {
  return new cljs.core.PersistentArrayMapSeq(a, b, c)
};
cljs.core.persistent_array_map_seq = function(a, b, c) {
  return b <= a.length - 2 ? new cljs.core.PersistentArrayMapSeq(a, b, c) : null
};
cljs.core.PersistentArrayMap = function(a, b, c, d) {
  this.meta = a;
  this.cnt = b;
  this.arr = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.PersistentArrayMap.cljs$lang$type = !0;
cljs.core.PersistentArrayMap.cljs$lang$ctorStr = "cljs.core/PersistentArrayMap";
cljs.core.PersistentArrayMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentArrayMap")
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientArrayMap({}, this.arr.length, this.arr.slice())
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = cljs.core.array_map_index_of.call(null, a, b);
  return-1 === a ? c : this.arr[a + 1]
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = cljs.core.array_map_index_of.call(null, a, b);
  return-1 === d ? this.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD ? (c = cljs.core.array_map_extend_kv.call(null, a, b, c), new cljs.core.PersistentArrayMap(this.meta, this.cnt + 1, c, null)) : cljs.core._with_meta.call(null, cljs.core._assoc.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, a), b, c), this.meta) : c === this.arr[d + 1] ? a : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (a = this.arr.slice(), a[d + 1] = c, new cljs.core.PersistentArrayMap(this.meta, 
  this.cnt, a, null)) : null
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return-1 !== cljs.core.array_map_index_of.call(null, a, b)
};
cljs.core.PersistentArrayMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentArrayMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = this.arr.length;
  for(var d = 0;;) {
    if(d < a) {
      c = b.call(null, c, this.arr[d], this.arr[d + 1]);
      if(cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c)
      }
      d += 2
    }else {
      return c
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.PersistentArrayMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.persistent_array_map_seq.call(null, this.arr, 0, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentArrayMap(b, this.cnt, this.arr, this.__hash)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core._with_meta.call(null, cljs.core.PersistentArrayMap.EMPTY, this.meta)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if(0 <= cljs.core.array_map_index_of.call(null, a, b)) {
    var c = this.arr.length, d = c - 2;
    if(0 === d) {
      return a.cljs$core$IEmptyableCollection$_empty$arity$1(a)
    }
    for(var d = Array(d), e = 0, f = 0;;) {
      if(e >= c) {
        return new cljs.core.PersistentArrayMap(this.meta, this.cnt - 1, d, null)
      }
      if(cljs.core._EQ_.call(null, b, this.arr[e])) {
        e += 2
      }else {
        if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
          d[f] = this.arr[e], d[f + 1] = this.arr[e + 1], f += 2, e += 2
        }else {
          return null
        }
      }
    }
  }else {
    return a
  }
};
cljs.core.__GT_PersistentArrayMap = function(a, b, c, d) {
  return new cljs.core.PersistentArrayMap(a, b, c, d)
};
cljs.core.PersistentArrayMap.EMPTY = new cljs.core.PersistentArrayMap(null, 0, [], null);
cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD = 8;
cljs.core.PersistentArrayMap.fromArray = function(a, b) {
  var c = b ? a : a.slice();
  return new cljs.core.PersistentArrayMap(null, c.length / 2, c, null)
};
cljs.core.TransientArrayMap = function(a, b, c) {
  this.editable_QMARK_ = a;
  this.len = b;
  this.arr = c;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258
};
cljs.core.TransientArrayMap.cljs$lang$type = !0;
cljs.core.TransientArrayMap.cljs$lang$ctorStr = "cljs.core/TransientArrayMap";
cljs.core.TransientArrayMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientArrayMap")
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(a, b) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    var c = cljs.core.array_map_index_of.call(null, a, b);
    0 <= c && (this.arr[c] = this.arr[this.len - 2], this.arr[c + 1] = this.arr[this.len - 1], c = this.arr, c.pop(), c.pop(), this.len -= 2);
    return a
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    var d = cljs.core.array_map_index_of.call(null, a, b);
    if(-1 === d) {
      return this.len + 2 <= 2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD ? (this.len += 2, this.arr.push(b), this.arr.push(c), a) : cljs.core.assoc_BANG_.call(null, cljs.core.array__GT_transient_hash_map.call(null, this.len, this.arr), b, c)
    }
    c !== this.arr[d + 1] && (this.arr[d + 1] = c);
    return a
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    var c;
    b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 2048) ? c : b.cljs$core$IMapEntry$, c = c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, b)) : c = cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, b);
    if(c) {
      return a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(a, cljs.core.key.call(null, b), cljs.core.val.call(null, b))
    }
    c = cljs.core.seq.call(null, b);
    for(var d = a;;) {
      var e = cljs.core.first.call(null, c);
      if(cljs.core.truth_(e)) {
        c = cljs.core.next.call(null, c), d = d.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(d, cljs.core.key.call(null, e), cljs.core.val.call(null, e))
      }else {
        return d
      }
    }
  }else {
    throw Error("conj! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    return this.editable_QMARK_ = !1, new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, this.len, 2), this.arr, null)
  }
  throw Error("persistent! called twice");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    return a = cljs.core.array_map_index_of.call(null, a, b), -1 === a ? c : this.arr[a + 1]
  }
  throw Error("lookup after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    return cljs.core.quot.call(null, this.len, 2)
  }
  throw Error("count after persistent!");
};
cljs.core.__GT_TransientArrayMap = function(a, b, c) {
  return new cljs.core.TransientArrayMap(a, b, c)
};
cljs.core.array__GT_transient_hash_map = function(a, b) {
  for(var c = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY), d = 0;;) {
    if(d < a) {
      c = cljs.core.assoc_BANG_.call(null, c, b[d], b[d + 1]), d += 2
    }else {
      return c
    }
  }
};
cljs.core.Box = function(a) {
  this.val = a
};
cljs.core.Box.cljs$lang$type = !0;
cljs.core.Box.cljs$lang$ctorStr = "cljs.core/Box";
cljs.core.Box.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Box")
};
cljs.core.__GT_Box = function(a) {
  return new cljs.core.Box(a)
};
cljs.core.key_test = function(a, b) {
  return a === b ? !0 : cljs.core.keyword_identical_QMARK_.call(null, a, b) ? !0 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core._EQ_.call(null, a, b) : null
};
cljs.core.mask = function(a, b) {
  return a >>> b & 31
};
cljs.core.clone_and_set = function() {
  var a = null, b = function(a, b, c) {
    a = a.slice();
    a[b] = c;
    return a
  }, c = function(a, b, c, g, h) {
    a = a.slice();
    a[b] = c;
    a[g] = h;
    return a
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a
}();
cljs.core.remove_pair = function(a, b) {
  var c = Array(a.length - 2);
  cljs.core.array_copy.call(null, a, 0, c, 0, 2 * b);
  cljs.core.array_copy.call(null, a, 2 * (b + 1), c, 2 * b, c.length - 2 * b);
  return c
};
cljs.core.bitmap_indexed_node_index = function(a, b) {
  return cljs.core.bit_count.call(null, a & b - 1)
};
cljs.core.bitpos = function(a, b) {
  return 1 << (a >>> b & 31)
};
cljs.core.edit_and_set = function() {
  var a = null, b = function(a, b, c, g) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    return a
  }, c = function(a, b, c, g, h, k) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    a.arr[h] = k;
    return a
  }, a = function(a, e, f, g, h, k) {
    switch(arguments.length) {
      case 4:
        return b.call(this, a, e, f, g);
      case 6:
        return c.call(this, a, e, f, g, h, k)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$4 = b;
  a.cljs$core$IFn$_invoke$arity$6 = c;
  return a
}();
cljs.core.inode_kv_reduce = function(a, b, c) {
  for(var d = a.length, e = 0;;) {
    if(e < d) {
      var f = a[e];
      null != f ? c = b.call(null, c, f, a[e + 1]) : (f = a[e + 1], c = null != f ? f.kv_reduce(b, c) : c);
      if(cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c)
      }
      e += 2
    }else {
      return c
    }
  }
};
cljs.core.BitmapIndexedNode = function(a, b, c) {
  this.edit = a;
  this.bitmap = b;
  this.arr = c
};
cljs.core.BitmapIndexedNode.cljs$lang$type = !0;
cljs.core.BitmapIndexedNode.cljs$lang$ctorStr = "cljs.core/BitmapIndexedNode";
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/BitmapIndexedNode")
};
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = function(a, b, c) {
  if(this.bitmap === b) {
    return null
  }
  a = this.ensure_editable(a);
  var d = a.arr, e = d.length;
  a.bitmap ^= b;
  cljs.core.array_copy.call(null, d, 2 * (c + 1), d, 2 * c, e - 2 * (c + 1));
  d[e - 2] = null;
  d[e - 1] = null;
  return a
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = 1 << (c >>> b & 31), h = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, g);
  if(0 === (this.bitmap & g)) {
    var k = cljs.core.bit_count.call(null, this.bitmap);
    if(2 * k < this.arr.length) {
      return a = this.ensure_editable(a), b = a.arr, f.val = !0, cljs.core.array_copy_downward.call(null, b, 2 * h, b, 2 * (h + 1), 2 * (k - h)), b[2 * h] = d, b[2 * h + 1] = e, a.bitmap |= g, a
    }
    if(16 <= k) {
      h = Array(32);
      h[c >>> b & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f);
      for(e = d = 0;;) {
        if(32 > d) {
          0 !== (this.bitmap >>> d & 1) && (h[d] = null != this.arr[e] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, cljs.core.hash.call(null, this.arr[e]), this.arr[e], this.arr[e + 1], f) : this.arr[e + 1], e += 2), d += 1
        }else {
          break
        }
      }
      return new cljs.core.ArrayNode(a, k + 1, h)
    }
    return new cljs.core.Keyword(null, "else", "else", 1017020587) ? (b = Array(2 * (k + 4)), cljs.core.array_copy.call(null, this.arr, 0, b, 0, 2 * h), b[2 * h] = d, b[2 * h + 1] = e, cljs.core.array_copy.call(null, this.arr, 2 * h, b, 2 * (h + 1), 2 * (k - h)), f.val = !0, a = this.ensure_editable(a), a.arr = b, a.bitmap |= g, a) : null
  }
  k = this.arr[2 * h];
  g = this.arr[2 * h + 1];
  return null == k ? (k = g.inode_assoc_BANG_(a, b + 5, c, d, e, f), k === g ? this : cljs.core.edit_and_set.call(null, this, a, 2 * h + 1, k)) : cljs.core.key_test.call(null, d, k) ? e === g ? this : cljs.core.edit_and_set.call(null, this, a, 2 * h + 1, e) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (f.val = !0, cljs.core.edit_and_set.call(null, this, a, 2 * h, null, 2 * h + 1, cljs.core.create_node.call(null, a, b + 5, k, g, c, d, e))) : null
};
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.call(null, this.arr)
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = 1 << (c >>> b & 31);
  if(0 === (this.bitmap & f)) {
    return this
  }
  var g = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, f), h = this.arr[2 * g], k = this.arr[2 * g + 1];
  return null == h ? (b = k.inode_without_BANG_(a, b + 5, c, d, e), b === k ? this : null != b ? cljs.core.edit_and_set.call(null, this, a, 2 * g + 1, b) : this.bitmap === f ? null : new cljs.core.Keyword(null, "else", "else", 1017020587) ? this.edit_and_remove_pair(a, f, g) : null) : cljs.core.key_test.call(null, d, h) ? (e[0] = !0, this.edit_and_remove_pair(a, f, g)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? this : null
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(a) {
  if(a === this.edit) {
    return this
  }
  var b = cljs.core.bit_count.call(null, this.bitmap), c = Array(0 > b ? 4 : 2 * (b + 1));
  cljs.core.array_copy.call(null, this.arr, 0, c, 0, 2 * b);
  return new cljs.core.BitmapIndexedNode(a, this.bitmap, c)
};
cljs.core.BitmapIndexedNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.inode_kv_reduce.call(null, this.arr, a, b)
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if(0 === (this.bitmap & e)) {
    return d
  }
  var f = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1];
  return null == e ? f.inode_find(a + 5, b, c, d) : cljs.core.key_test.call(null, c, e) ? cljs.core.PersistentVector.fromArray([e, f], !0) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? d : null
};
cljs.core.BitmapIndexedNode.prototype.inode_without = function(a, b, c) {
  var d = 1 << (b >>> a & 31);
  if(0 === (this.bitmap & d)) {
    return this
  }
  var e = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, d), f = this.arr[2 * e], g = this.arr[2 * e + 1];
  return null == f ? (a = g.inode_without(a + 5, b, c), a === g ? this : null != a ? new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * e + 1, a)) : this.bitmap === d ? null : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair.call(null, this.arr, e)) : null) : cljs.core.key_test.call(null, c, f) ? new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair.call(null, 
  this.arr, e)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? this : null
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = 1 << (b >>> a & 31), g = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, f);
  if(0 === (this.bitmap & f)) {
    var h = cljs.core.bit_count.call(null, this.bitmap);
    if(16 <= h) {
      g = Array(32);
      g[b >>> a & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e);
      for(d = c = 0;;) {
        if(32 > c) {
          0 !== (this.bitmap >>> c & 1) && (g[c] = null != this.arr[d] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, cljs.core.hash.call(null, this.arr[d]), this.arr[d], this.arr[d + 1], e) : this.arr[d + 1], d += 2), c += 1
        }else {
          break
        }
      }
      return new cljs.core.ArrayNode(null, h + 1, g)
    }
    a = Array(2 * (h + 1));
    cljs.core.array_copy.call(null, this.arr, 0, a, 0, 2 * g);
    a[2 * g] = c;
    a[2 * g + 1] = d;
    cljs.core.array_copy.call(null, this.arr, 2 * g, a, 2 * (g + 1), 2 * (h - g));
    e.val = !0;
    return new cljs.core.BitmapIndexedNode(null, this.bitmap | f, a)
  }
  h = this.arr[2 * g];
  f = this.arr[2 * g + 1];
  return null == h ? (h = f.inode_assoc(a + 5, b, c, d, e), h === f ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g + 1, h))) : cljs.core.key_test.call(null, c, h) ? d === f ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g + 1, d)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (e.val = !0, new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, 
  this.arr, 2 * g, null, 2 * g + 1, cljs.core.create_node.call(null, a + 5, h, f, b, c, d)))) : null
};
cljs.core.BitmapIndexedNode.prototype.inode_lookup = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if(0 === (this.bitmap & e)) {
    return d
  }
  var f = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1];
  return null == e ? f.inode_lookup(a + 5, b, c, d) : cljs.core.key_test.call(null, c, e) ? f : new cljs.core.Keyword(null, "else", "else", 1017020587) ? d : null
};
cljs.core.__GT_BitmapIndexedNode = function(a, b, c) {
  return new cljs.core.BitmapIndexedNode(a, b, c)
};
cljs.core.BitmapIndexedNode.EMPTY = new cljs.core.BitmapIndexedNode(null, 0, []);
cljs.core.pack_array_node = function(a, b, c) {
  var d = a.arr;
  a = 2 * (a.cnt - 1);
  for(var e = Array(a), f = 0, g = 1, h = 0;;) {
    if(f < a) {
      var k;
      k = (k = f !== c) ? null != d[f] : k;
      k && (e[g] = d[f], g += 2, h |= 1 << f);
      f += 1
    }else {
      return new cljs.core.BitmapIndexedNode(b, h, e)
    }
  }
};
cljs.core.ArrayNode = function(a, b, c) {
  this.edit = a;
  this.cnt = b;
  this.arr = c
};
cljs.core.ArrayNode.cljs$lang$type = !0;
cljs.core.ArrayNode.cljs$lang$ctorStr = "cljs.core/ArrayNode";
cljs.core.ArrayNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayNode")
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = c >>> b & 31, h = this.arr[g];
  if(null == h) {
    return a = cljs.core.edit_and_set.call(null, this, a, g, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f)), a.cnt += 1, a
  }
  b = h.inode_assoc_BANG_(a, b + 5, c, d, e, f);
  return b === h ? this : cljs.core.edit_and_set.call(null, this, a, g, b)
};
cljs.core.ArrayNode.prototype.inode_seq = function() {
  return cljs.core.create_array_node_seq.call(null, this.arr)
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = c >>> b & 31, g = this.arr[f];
  if(null == g) {
    return this
  }
  b = g.inode_without_BANG_(a, b + 5, c, d, e);
  if(b === g) {
    return this
  }
  if(null == b) {
    if(8 >= this.cnt) {
      return cljs.core.pack_array_node.call(null, this, a, f)
    }
    a = cljs.core.edit_and_set.call(null, this, a, f, b);
    a.cnt -= 1;
    return a
  }
  return new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.edit_and_set.call(null, this, a, f, b) : null
};
cljs.core.ArrayNode.prototype.ensure_editable = function(a) {
  return a === this.edit ? this : new cljs.core.ArrayNode(a, this.cnt, this.arr.slice())
};
cljs.core.ArrayNode.prototype.kv_reduce = function(a, b) {
  for(var c = this.arr.length, d = 0, e = b;;) {
    if(d < c) {
      var f = this.arr[d];
      if(null != f && (e = f.kv_reduce(a, e), cljs.core.reduced_QMARK_.call(null, e))) {
        return cljs.core.deref.call(null, e)
      }
      d += 1
    }else {
      return e
    }
  }
};
cljs.core.ArrayNode.prototype.inode_find = function(a, b, c, d) {
  var e = this.arr[b >>> a & 31];
  return null != e ? e.inode_find(a + 5, b, c, d) : d
};
cljs.core.ArrayNode.prototype.inode_without = function(a, b, c) {
  var d = b >>> a & 31, e = this.arr[d];
  return null != e ? (a = e.inode_without(a + 5, b, c), a === e ? this : null == a ? 8 >= this.cnt ? cljs.core.pack_array_node.call(null, this, null, d) : new cljs.core.ArrayNode(null, this.cnt - 1, cljs.core.clone_and_set.call(null, this.arr, d, a)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.call(null, this.arr, d, a)) : null) : this
};
cljs.core.ArrayNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = b >>> a & 31, g = this.arr[f];
  if(null == g) {
    return new cljs.core.ArrayNode(null, this.cnt + 1, cljs.core.clone_and_set.call(null, this.arr, f, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e)))
  }
  a = g.inode_assoc(a + 5, b, c, d, e);
  return a === g ? this : new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.call(null, this.arr, f, a))
};
cljs.core.ArrayNode.prototype.inode_lookup = function(a, b, c, d) {
  var e = this.arr[b >>> a & 31];
  return null != e ? e.inode_lookup(a + 5, b, c, d) : d
};
cljs.core.__GT_ArrayNode = function(a, b, c) {
  return new cljs.core.ArrayNode(a, b, c)
};
cljs.core.hash_collision_node_find_index = function(a, b, c) {
  b *= 2;
  for(var d = 0;;) {
    if(d < b) {
      if(cljs.core.key_test.call(null, c, a[d])) {
        return d
      }
      d += 2
    }else {
      return-1
    }
  }
};
cljs.core.HashCollisionNode = function(a, b, c, d) {
  this.edit = a;
  this.collision_hash = b;
  this.cnt = c;
  this.arr = d
};
cljs.core.HashCollisionNode.cljs$lang$type = !0;
cljs.core.HashCollisionNode.cljs$lang$ctorStr = "cljs.core/HashCollisionNode";
cljs.core.HashCollisionNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/HashCollisionNode")
};
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  if(c === this.collision_hash) {
    b = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, d);
    if(-1 === b) {
      if(this.arr.length > 2 * this.cnt) {
        return a = cljs.core.edit_and_set.call(null, this, a, 2 * this.cnt, d, 2 * this.cnt + 1, e), f.val = !0, a.cnt += 1, a
      }
      b = this.arr.length;
      c = Array(b + 2);
      cljs.core.array_copy.call(null, this.arr, 0, c, 0, b);
      c[b] = d;
      c[b + 1] = e;
      f.val = !0;
      return this.ensure_editable_array(a, this.cnt + 1, c)
    }
    return this.arr[b + 1] === e ? this : cljs.core.edit_and_set.call(null, this, a, b + 1, e)
  }
  return(new cljs.core.BitmapIndexedNode(a, 1 << (this.collision_hash >>> b & 31), [null, this, null, null])).inode_assoc_BANG_(a, b, c, d, e, f)
};
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.call(null, this.arr)
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  b = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, d);
  if(-1 === b) {
    return this
  }
  e[0] = !0;
  if(1 === this.cnt) {
    return null
  }
  a = this.ensure_editable(a);
  e = a.arr;
  e[b] = e[2 * this.cnt - 2];
  e[b + 1] = e[2 * this.cnt - 1];
  e[2 * this.cnt - 1] = null;
  e[2 * this.cnt - 2] = null;
  a.cnt -= 1;
  return a
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function(a) {
  if(a === this.edit) {
    return this
  }
  var b = Array(2 * (this.cnt + 1));
  cljs.core.array_copy.call(null, this.arr, 0, b, 0, 2 * this.cnt);
  return new cljs.core.HashCollisionNode(a, this.collision_hash, this.cnt, b)
};
cljs.core.HashCollisionNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.inode_kv_reduce.call(null, this.arr, a, b)
};
cljs.core.HashCollisionNode.prototype.inode_find = function(a, b, c, d) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return 0 > a ? d : cljs.core.key_test.call(null, c, this.arr[a]) ? cljs.core.PersistentVector.fromArray([this.arr[a], this.arr[a + 1]], !0) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? d : null
};
cljs.core.HashCollisionNode.prototype.inode_without = function(a, b, c) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return-1 === a ? this : 1 === this.cnt ? null : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt - 1, cljs.core.remove_pair.call(null, this.arr, cljs.core.quot.call(null, a, 2))) : null
};
cljs.core.HashCollisionNode.prototype.inode_assoc = function(a, b, c, d, e) {
  return b === this.collision_hash ? (a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c), -1 === a ? (a = this.arr.length, b = Array(a + 2), cljs.core.array_copy.call(null, this.arr, 0, b, 0, a), b[a] = c, b[a + 1] = d, e.val = !0, new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt + 1, b)) : cljs.core._EQ_.call(null, this.arr[a], d) ? this : new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt, cljs.core.clone_and_set.call(null, this.arr, 
  a + 1, d))) : (new cljs.core.BitmapIndexedNode(null, 1 << (this.collision_hash >>> a & 31), [null, this])).inode_assoc(a, b, c, d, e)
};
cljs.core.HashCollisionNode.prototype.inode_lookup = function(a, b, c, d) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return 0 > a ? d : cljs.core.key_test.call(null, c, this.arr[a]) ? this.arr[a + 1] : new cljs.core.Keyword(null, "else", "else", 1017020587) ? d : null
};
cljs.core.HashCollisionNode.prototype.ensure_editable_array = function(a, b, c) {
  return a === this.edit ? (this.arr = c, this.cnt = b, this) : new cljs.core.HashCollisionNode(this.edit, this.collision_hash, b, c)
};
cljs.core.__GT_HashCollisionNode = function(a, b, c, d) {
  return new cljs.core.HashCollisionNode(a, b, c, d)
};
cljs.core.create_node = function() {
  var a = null, b = function(a, b, c, g, h, k) {
    var l = cljs.core.hash.call(null, b);
    if(l === g) {
      return new cljs.core.HashCollisionNode(null, l, 2, [b, c, h, k])
    }
    var m = new cljs.core.Box(!1);
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a, l, b, c, m).inode_assoc(a, g, h, k, m)
  }, c = function(a, b, c, g, h, k, l) {
    var m = cljs.core.hash.call(null, c);
    if(m === h) {
      return new cljs.core.HashCollisionNode(null, m, 2, [c, g, k, l])
    }
    var n = new cljs.core.Box(!1);
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b, m, c, g, n).inode_assoc_BANG_(a, b, h, k, l, n)
  }, a = function(a, e, f, g, h, k, l) {
    switch(arguments.length) {
      case 6:
        return b.call(this, a, e, f, g, h, k);
      case 7:
        return c.call(this, a, e, f, g, h, k, l)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$6 = b;
  a.cljs$core$IFn$_invoke$arity$7 = c;
  return a
}();
cljs.core.NodeSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374860
};
cljs.core.NodeSeq.cljs$lang$type = !0;
cljs.core.NodeSeq.cljs$lang$ctorStr = "cljs.core/NodeSeq";
cljs.core.NodeSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/NodeSeq")
};
cljs.core.NodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.NodeSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.NodeSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.NodeSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return null == this.s ? cljs.core.PersistentVector.fromArray([this.nodes[this.i], this.nodes[this.i + 1]], !0) : cljs.core.first.call(null, this.s)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null == this.s ? cljs.core.create_inode_seq.call(null, this.nodes, this.i + 2, null) : cljs.core.create_inode_seq.call(null, this.nodes, this.i, cljs.core.next.call(null, this.s))
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.NodeSeq(b, this.nodes, this.i, this.s, this.__hash)
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_NodeSeq = function(a, b, c, d, e) {
  return new cljs.core.NodeSeq(a, b, c, d, e)
};
cljs.core.create_inode_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0, null)
  }, c = function(a, b, c) {
    if(null == c) {
      for(c = a.length;;) {
        if(b < c) {
          if(null != a[b]) {
            return new cljs.core.NodeSeq(null, a, b, null, null)
          }
          var g = a[b + 1];
          if(cljs.core.truth_(g) && (g = g.inode_seq(), cljs.core.truth_(g))) {
            return new cljs.core.NodeSeq(null, a, b + 2, g, null)
          }
          b += 2
        }else {
          return null
        }
      }
    }else {
      return new cljs.core.NodeSeq(null, a, b, c, null)
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.ArrayNodeSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374860
};
cljs.core.ArrayNodeSeq.cljs$lang$type = !0;
cljs.core.ArrayNodeSeq.cljs$lang$ctorStr = "cljs.core/ArrayNodeSeq";
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayNodeSeq")
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.ArrayNodeSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, this.s)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.create_array_node_seq.call(null, null, this.nodes, this.i, cljs.core.next.call(null, this.s))
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ArrayNodeSeq(b, this.nodes, this.i, this.s, this.__hash)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_ArrayNodeSeq = function(a, b, c, d, e) {
  return new cljs.core.ArrayNodeSeq(a, b, c, d, e)
};
cljs.core.create_array_node_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, null, b, 0, null)
  }, c = function(a, b, c, g) {
    if(null == g) {
      for(g = b.length;;) {
        if(c < g) {
          var h = b[c];
          if(cljs.core.truth_(h) && (h = h.inode_seq(), cljs.core.truth_(h))) {
            return new cljs.core.ArrayNodeSeq(a, b, c + 1, h, null)
          }
          c += 1
        }else {
          return null
        }
      }
    }else {
      return new cljs.core.ArrayNodeSeq(a, b, c, g, null)
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
cljs.core.PersistentHashMap = function(a, b, c, d, e, f) {
  this.meta = a;
  this.cnt = b;
  this.root = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.PersistentHashMap.cljs$lang$type = !0;
cljs.core.PersistentHashMap.cljs$lang$ctorStr = "cljs.core/PersistentHashMap";
cljs.core.PersistentHashMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentHashMap")
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientHashMap({}, this.root, this.cnt, this.has_nil_QMARK_, this.nil_val)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : c : null == this.root ? c : new cljs.core.Keyword(null, "else", "else", 1017020587) ? this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, c) : null
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if(null == b) {
    var d;
    d = (d = this.has_nil_QMARK_) ? c === this.nil_val : d;
    return d ? a : new cljs.core.PersistentHashMap(this.meta, this.has_nil_QMARK_ ? this.cnt : this.cnt + 1, this.root, !0, c, null)
  }
  d = new cljs.core.Box(!1);
  c = (null == this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc(0, cljs.core.hash.call(null, b), b, c, d);
  return c === this.root ? a : new cljs.core.PersistentHashMap(this.meta, d.val ? this.cnt + 1 : this.cnt, c, this.has_nil_QMARK_, this.nil_val, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null == b ? this.has_nil_QMARK_ : null == this.root ? !1 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, cljs.core.lookup_sentinel) !== cljs.core.lookup_sentinel : null
};
cljs.core.PersistentHashMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentHashMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = this.has_nil_QMARK_ ? b.call(null, c, null, this.nil_val) : c;
  return cljs.core.reduced_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : null != this.root ? this.root.kv_reduce(b, a) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? a : null
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.cnt ? (a = null != this.root ? this.root.inode_seq() : null, this.has_nil_QMARK_ ? cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([null, this.nil_val], !0), a) : a) : null
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashMap(b, this.cnt, this.root, this.has_nil_QMARK_, this.nil_val, this.__hash)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core._with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, this.meta)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if(null == b) {
    return this.has_nil_QMARK_ ? new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, this.root, !1, null, null) : a
  }
  if(null == this.root) {
    return a
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    var c = this.root.inode_without(0, cljs.core.hash.call(null, b), b);
    return c === this.root ? a : new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, c, this.has_nil_QMARK_, this.nil_val, null)
  }
  return null
};
cljs.core.__GT_PersistentHashMap = function(a, b, c, d, e, f) {
  return new cljs.core.PersistentHashMap(a, b, c, d, e, f)
};
cljs.core.PersistentHashMap.EMPTY = new cljs.core.PersistentHashMap(null, 0, null, !1, null, 0);
cljs.core.PersistentHashMap.fromArrays = function(a, b) {
  for(var c = a.length, d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
    if(d < c) {
      var f = d + 1, e = cljs.core.assoc_BANG_.call(null, e, a[d], b[d]), d = f
    }else {
      return cljs.core.persistent_BANG_.call(null, e)
    }
  }
};
cljs.core.TransientHashMap = function(a, b, c, d, e) {
  this.edit = a;
  this.root = b;
  this.count = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258
};
cljs.core.TransientHashMap.cljs$lang$type = !0;
cljs.core.TransientHashMap.cljs$lang$ctorStr = "cljs.core/TransientHashMap";
cljs.core.TransientHashMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientHashMap")
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(a, b) {
  return a.without_BANG_(b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  return a.assoc_BANG_(b, c)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  return a.conj_BANG_(b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  return a.persistent_BANG_()
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : null : null == this.root ? null : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : c : null == this.root ? c : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, c)
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if(this.edit) {
    return this.count
  }
  throw Error("count after persistent!");
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(a) {
  if(this.edit) {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 2048) ? b : a.cljs$core$IMapEntry$, b = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, a)) : b = cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, a);
    if(b) {
      return this.assoc_BANG_(cljs.core.key.call(null, a), cljs.core.val.call(null, a))
    }
    a = cljs.core.seq.call(null, a);
    for(b = this;;) {
      var c = cljs.core.first.call(null, a);
      if(cljs.core.truth_(c)) {
        a = cljs.core.next.call(null, a), b = b.assoc_BANG_(cljs.core.key.call(null, c), cljs.core.val.call(null, c))
      }else {
        return b
      }
    }
  }else {
    throw Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(a, b) {
  if(this.edit) {
    if(null == a) {
      this.nil_val !== b && (this.nil_val = b), this.has_nil_QMARK_ || (this.count += 1, this.has_nil_QMARK_ = !0)
    }else {
      var c = new cljs.core.Box(!1), d = (null == this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc_BANG_(this.edit, 0, cljs.core.hash.call(null, a), a, b, c);
      d !== this.root && (this.root = d);
      c.val && (this.count += 1)
    }
    return this
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(a) {
  if(this.edit) {
    if(null == a) {
      this.has_nil_QMARK_ && (this.has_nil_QMARK_ = !1, this.nil_val = null, this.count -= 1)
    }else {
      if(null != this.root) {
        var b = new cljs.core.Box(!1);
        a = this.root.inode_without_BANG_(this.edit, 0, cljs.core.hash.call(null, a), a, b);
        a !== this.root && (this.root = a);
        cljs.core.truth_(b[0]) && (this.count -= 1)
      }
    }
    return this
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  if(this.edit) {
    return this.edit = null, new cljs.core.PersistentHashMap(null, this.count, this.root, this.has_nil_QMARK_, this.nil_val, null)
  }
  throw Error("persistent! called twice");
};
cljs.core.__GT_TransientHashMap = function(a, b, c, d, e) {
  return new cljs.core.TransientHashMap(a, b, c, d, e)
};
cljs.core.tree_map_seq_push = function(a, b, c) {
  for(var d = b;;) {
    if(null != a) {
      b = c ? a.left : a.right, d = cljs.core.conj.call(null, d, a), a = b
    }else {
      return d
    }
  }
};
cljs.core.PersistentTreeMapSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.stack = b;
  this.ascending_QMARK_ = c;
  this.cnt = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374862
};
cljs.core.PersistentTreeMapSeq.cljs$lang$type = !0;
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorStr = "cljs.core/PersistentTreeMapSeq";
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeMapSeq")
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 0 > this.cnt ? cljs.core.count.call(null, cljs.core.next.call(null, a)) + 1 : this.cnt
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.peek.call(null, this.stack)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  a = cljs.core.first.call(null, this.stack);
  a = cljs.core.tree_map_seq_push.call(null, this.ascending_QMARK_ ? a.right : a.left, cljs.core.next.call(null, this.stack), this.ascending_QMARK_);
  return null != a ? new cljs.core.PersistentTreeMapSeq(null, a, this.ascending_QMARK_, this.cnt - 1, null) : cljs.core.List.EMPTY
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMapSeq(b, this.stack, this.ascending_QMARK_, this.cnt, this.__hash)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_PersistentTreeMapSeq = function(a, b, c, d, e) {
  return new cljs.core.PersistentTreeMapSeq(a, b, c, d, e)
};
cljs.core.create_tree_map_seq = function(a, b, c) {
  return new cljs.core.PersistentTreeMapSeq(null, cljs.core.tree_map_seq_push.call(null, a, null, b), b, c, null)
};
cljs.core.balance_left = function(a, b, c, d) {
  return c instanceof cljs.core.RedNode ? c.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(c.key, c.val, c.left.blacken(), new cljs.core.BlackNode(a, b, c.right, d, null), null) : c.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(c.right.key, c.right.val, new cljs.core.BlackNode(c.key, c.val, c.left, c.right.left, null), new cljs.core.BlackNode(a, b, c.right.right, d, null), null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.BlackNode(a, b, c, d, 
  null) : null : new cljs.core.BlackNode(a, b, c, d, null)
};
cljs.core.balance_right = function(a, b, c, d) {
  return d instanceof cljs.core.RedNode ? d.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(a, b, c, d.left, null), d.right.blacken(), null) : d.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left, null), new cljs.core.BlackNode(d.key, d.val, d.left.right, d.right, null), null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.BlackNode(a, b, c, d, null) : 
  null : new cljs.core.BlackNode(a, b, c, d, null)
};
cljs.core.balance_left_del = function(a, b, c, d) {
  if(c instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(a, b, c.blacken(), d, null)
  }
  if(d instanceof cljs.core.BlackNode) {
    return cljs.core.balance_right.call(null, a, b, c, d.redden())
  }
  var e;
  e = (e = d instanceof cljs.core.RedNode) ? d.left instanceof cljs.core.BlackNode : e;
  if(e) {
    return new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left, null), cljs.core.balance_right.call(null, d.key, d.val, d.left.right, d.right.redden()), null)
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error("red-black tree invariant violation");
  }
  return null
};
cljs.core.balance_right_del = function(a, b, c, d) {
  if(d instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(a, b, c, d.blacken(), null)
  }
  if(c instanceof cljs.core.BlackNode) {
    return cljs.core.balance_left.call(null, a, b, c.redden(), d)
  }
  var e;
  e = (e = c instanceof cljs.core.RedNode) ? c.right instanceof cljs.core.BlackNode : e;
  if(e) {
    return new cljs.core.RedNode(c.right.key, c.right.val, cljs.core.balance_left.call(null, c.key, c.val, c.left.redden(), c.right.left), new cljs.core.BlackNode(a, b, c.right.right, d, null), null)
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error("red-black tree invariant violation");
  }
  return null
};
cljs.core.tree_map_kv_reduce = function tree_map_kv_reduce(b, c, d) {
  d = null != b.left ? tree_map_kv_reduce.call(null, b.left, c, d) : d;
  if(cljs.core.reduced_QMARK_.call(null, d)) {
    return cljs.core.deref.call(null, d)
  }
  d = c.call(null, d, b.key, b.val);
  if(cljs.core.reduced_QMARK_.call(null, d)) {
    return cljs.core.deref.call(null, d)
  }
  b = null != b.right ? tree_map_kv_reduce.call(null, b.right, c, d) : d;
  return cljs.core.reduced_QMARK_.call(null, b) ? cljs.core.deref.call(null, b) : b
};
cljs.core.BlackNode = function(a, b, c, d, e) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207
};
cljs.core.BlackNode.cljs$lang$type = !0;
cljs.core.BlackNode.cljs$lang$ctorStr = "cljs.core/BlackNode";
cljs.core.BlackNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/BlackNode")
};
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.BlackNode.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.BlackNode.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.PersistentVector.fromArray([this.key, this.val, b], !0)
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return this.key
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return this.val
};
cljs.core.BlackNode.prototype.add_right = function(a) {
  return a.balance_right(this)
};
cljs.core.BlackNode.prototype.redden = function() {
  return new cljs.core.RedNode(this.key, this.val, this.left, this.right, null)
};
cljs.core.BlackNode.prototype.remove_right = function(a) {
  return cljs.core.balance_right_del.call(null, this.key, this.val, this.left, a)
};
cljs.core.BlackNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.BlackNode(a, b, c, d, null)
};
cljs.core.BlackNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.tree_map_kv_reduce.call(null, this, a, b)
};
cljs.core.BlackNode.prototype.remove_left = function(a) {
  return cljs.core.balance_left_del.call(null, this.key, this.val, a, this.right)
};
cljs.core.BlackNode.prototype.add_left = function(a) {
  return a.balance_left(this)
};
cljs.core.BlackNode.prototype.balance_left = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, this, a.right, null)
};
cljs.core.BlackNode.prototype.balance_right = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, a.left, this, null)
};
cljs.core.BlackNode.prototype.blacken = function() {
  return this
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.list.call(null, this.key, this.val)
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.val
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core.PersistentVector.fromArray([this.key], !0)
};
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b)
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if(0 === b) {
    return this.key
  }
  if(1 === b) {
    return this.val
  }
  new cljs.core.Keyword(null, "else", "else", 1017020587);
  return null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : new cljs.core.Keyword(null, "else", "else", 1017020587) ? c : null
};
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentVector.EMPTY
};
cljs.core.__GT_BlackNode = function(a, b, c, d, e) {
  return new cljs.core.BlackNode(a, b, c, d, e)
};
cljs.core.RedNode = function(a, b, c, d, e) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207
};
cljs.core.RedNode.cljs$lang$type = !0;
cljs.core.RedNode.cljs$lang$ctorStr = "cljs.core/RedNode";
cljs.core.RedNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/RedNode")
};
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.RedNode.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.RedNode.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.PersistentVector.fromArray([this.key, this.val, b], !0)
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return this.key
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return this.val
};
cljs.core.RedNode.prototype.add_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a, null)
};
cljs.core.RedNode.prototype.redden = function() {
  throw Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.remove_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a, null)
};
cljs.core.RedNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.RedNode(a, b, c, d, null)
};
cljs.core.RedNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.tree_map_kv_reduce.call(null, this, a, b)
};
cljs.core.RedNode.prototype.remove_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right, null)
};
cljs.core.RedNode.prototype.add_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right, null)
};
cljs.core.RedNode.prototype.balance_left = function(a) {
  return this.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.key, this.val, this.left.blacken(), new cljs.core.BlackNode(a.key, a.val, this.right, a.right, null), null) : this.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.right.key, this.right.val, new cljs.core.BlackNode(this.key, this.val, this.left, this.right.left, null), new cljs.core.BlackNode(a.key, a.val, this.right.right, a.right, null), null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.BlackNode(a.key, 
  a.val, this, a.right, null) : null
};
cljs.core.RedNode.prototype.balance_right = function(a) {
  return this.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.key, this.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left, null), this.right.blacken(), null) : this.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.left.key, this.left.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left.left, null), new cljs.core.BlackNode(this.key, this.val, this.left.right, this.right, null), null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.BlackNode(a.key, 
  a.val, a.left, this, null) : null
};
cljs.core.RedNode.prototype.blacken = function() {
  return new cljs.core.BlackNode(this.key, this.val, this.left, this.right, null)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.list.call(null, this.key, this.val)
};
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2
};
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.val
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core.PersistentVector.fromArray([this.key], !0)
};
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b)
};
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if(0 === b) {
    return this.key
  }
  if(1 === b) {
    return this.val
  }
  new cljs.core.Keyword(null, "else", "else", 1017020587);
  return null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : new cljs.core.Keyword(null, "else", "else", 1017020587) ? c : null
};
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentVector.EMPTY
};
cljs.core.__GT_RedNode = function(a, b, c, d, e) {
  return new cljs.core.RedNode(a, b, c, d, e)
};
cljs.core.tree_map_add = function tree_map_add(b, c, d, e, f) {
  if(null == c) {
    return new cljs.core.RedNode(d, e, null, null, null)
  }
  var g = b.call(null, d, c.key);
  return 0 === g ? (f[0] = c, null) : 0 > g ? (b = tree_map_add.call(null, b, c.left, d, e, f), null != b ? c.add_left(b) : null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (b = tree_map_add.call(null, b, c.right, d, e, f), null != b ? c.add_right(b) : null) : null
};
cljs.core.tree_map_append = function tree_map_append(b, c) {
  if(null == b) {
    return c
  }
  if(null == c) {
    return b
  }
  if(b instanceof cljs.core.RedNode) {
    if(c instanceof cljs.core.RedNode) {
      var d = tree_map_append.call(null, b.right, c.left);
      return d instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.RedNode(b.key, b.val, b.left, d.left, null), new cljs.core.RedNode(c.key, c.val, d.right, c.right, null), null) : new cljs.core.RedNode(b.key, b.val, b.left, new cljs.core.RedNode(c.key, c.val, d, c.right, null), null)
    }
    return new cljs.core.RedNode(b.key, b.val, b.left, tree_map_append.call(null, b.right, c), null)
  }
  return c instanceof cljs.core.RedNode ? new cljs.core.RedNode(c.key, c.val, tree_map_append.call(null, b, c.left), c.right, null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (d = tree_map_append.call(null, b.right, c.left), d instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(b.key, b.val, b.left, d.left, null), new cljs.core.BlackNode(c.key, c.val, d.right, c.right, null), null) : cljs.core.balance_left_del.call(null, b.key, b.val, b.left, 
  new cljs.core.BlackNode(c.key, c.val, d, c.right, null))) : null
};
cljs.core.tree_map_remove = function tree_map_remove(b, c, d, e) {
  if(null != c) {
    var f = b.call(null, d, c.key);
    if(0 === f) {
      return e[0] = c, cljs.core.tree_map_append.call(null, c.left, c.right)
    }
    if(0 > f) {
      var g = tree_map_remove.call(null, b, c.left, d, e);
      return function() {
        var b = null != g;
        return b ? b : null != e[0]
      }() ? c.left instanceof cljs.core.BlackNode ? cljs.core.balance_left_del.call(null, c.key, c.val, g, c.right) : new cljs.core.RedNode(c.key, c.val, g, c.right, null) : null
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      return g = tree_map_remove.call(null, b, c.right, d, e), function() {
        var b = null != g;
        return b ? b : null != e[0]
      }() ? c.right instanceof cljs.core.BlackNode ? cljs.core.balance_right_del.call(null, c.key, c.val, c.left, g) : new cljs.core.RedNode(c.key, c.val, c.left, g, null) : null
    }
  }
  return null
};
cljs.core.tree_map_replace = function tree_map_replace(b, c, d, e) {
  var f = c.key, g = b.call(null, d, f);
  return 0 === g ? c.replace(f, e, c.left, c.right) : 0 > g ? c.replace(f, c.val, tree_map_replace.call(null, b, c.left, d, e), c.right) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? c.replace(f, c.val, c.left, tree_map_replace.call(null, b, c.right, d, e)) : null
};
cljs.core.PersistentTreeMap = function(a, b, c, d, e) {
  this.comp = a;
  this.tree = b;
  this.cnt = c;
  this.meta = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 418776847
};
cljs.core.PersistentTreeMap.cljs$lang$type = !0;
cljs.core.PersistentTreeMap.cljs$lang$ctorStr = "cljs.core/PersistentTreeMap";
cljs.core.PersistentTreeMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeMap")
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = a.entry_at(b);
  return null != a ? a.val : c
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = [null], e = cljs.core.tree_map_add.call(null, this.comp, this.tree, b, c, d);
  return null == e ? (d = cljs.core.nth.call(null, d, 0), cljs.core._EQ_.call(null, c, d.val) ? a : new cljs.core.PersistentTreeMap(this.comp, cljs.core.tree_map_replace.call(null, this.comp, this.tree, b, c), this.cnt, this.meta, null)) : new cljs.core.PersistentTreeMap(this.comp, e.blacken(), this.cnt + 1, this.meta, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null != a.entry_at(b)
};
cljs.core.PersistentTreeMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentTreeMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  return null != this.tree ? cljs.core.tree_map_kv_reduce.call(null, this.tree, b, c) : c
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, !1, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(a) {
  for(var b = this.tree;;) {
    if(null != b) {
      var c = this.comp.call(null, a, b.key);
      if(0 === c) {
        return b
      }
      if(0 > c) {
        b = b.left
      }else {
        if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
          b = b.right
        }else {
          return null
        }
      }
    }else {
      return null
    }
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, b, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  if(0 < this.cnt) {
    a = null;
    for(var d = this.tree;;) {
      if(null != d) {
        var e = this.comp.call(null, b, d.key);
        if(0 === e) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.call(null, a, d), c, -1, null)
        }
        if(cljs.core.truth_(c)) {
          0 > e ? (a = cljs.core.conj.call(null, a, d), d = d.left) : d = d.right
        }else {
          if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
            0 < e ? (a = cljs.core.conj.call(null, a, d), d = d.right) : d = d.left
          }else {
            return null
          }
        }
      }else {
        return null == a ? null : new cljs.core.PersistentTreeMapSeq(null, a, c, -1, null)
      }
    }
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return cljs.core.key.call(null, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function(a) {
  return this.comp
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, !0, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMap(this.comp, this.tree, this.cnt, b, this.__hash)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeMap.EMPTY, this.meta)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c = [null], d = cljs.core.tree_map_remove.call(null, this.comp, this.tree, b, c);
  return null == d ? null == cljs.core.nth.call(null, c, 0) ? a : new cljs.core.PersistentTreeMap(this.comp, null, 0, this.meta, null) : new cljs.core.PersistentTreeMap(this.comp, d.blacken(), this.cnt - 1, this.meta, null)
};
cljs.core.__GT_PersistentTreeMap = function(a, b, c, d, e) {
  return new cljs.core.PersistentTreeMap(a, b, c, d, e)
};
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null, 0);
cljs.core.hash_map = function() {
  var a = function(a) {
    a = cljs.core.seq.call(null, a);
    for(var b = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
      if(a) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc_BANG_.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a));
        a = e
      }else {
        return cljs.core.persistent_BANG_.call(null, b)
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.array_map = function() {
  var a = function(a) {
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, cljs.core.count.call(null, a), 2), cljs.core.apply.call(null, cljs.core.array, a), null)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.obj_map = function() {
  var a = function(a) {
    var b = [], e = {};
    for(a = cljs.core.seq.call(null, a);;) {
      if(a) {
        b.push(cljs.core.first.call(null, a)), e[cljs.core.first.call(null, a)] = cljs.core.second.call(null, a), a = cljs.core.nnext.call(null, a)
      }else {
        return cljs.core.ObjMap.fromObject.call(null, b, e)
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.sorted_map = function() {
  var a = function(a) {
    a = cljs.core.seq.call(null, a);
    for(var b = cljs.core.PersistentTreeMap.EMPTY;;) {
      if(a) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a));
        a = e
      }else {
        return b
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.sorted_map_by = function() {
  var a = function(a, b) {
    for(var e = cljs.core.seq.call(null, b), f = new cljs.core.PersistentTreeMap(cljs.core.fn__GT_comparator.call(null, a), null, 0, null, 0);;) {
      if(e) {
        var g = cljs.core.nnext.call(null, e), f = cljs.core.assoc.call(null, f, cljs.core.first.call(null, e), cljs.core.second.call(null, e)), e = g
      }else {
        return f
      }
    }
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.KeySeq = function(a, b) {
  this.mseq = a;
  this._meta = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988
};
cljs.core.KeySeq.cljs$lang$type = !0;
cljs.core.KeySeq.cljs$lang$ctorStr = "cljs.core/KeySeq";
cljs.core.KeySeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/KeySeq")
};
cljs.core.KeySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.KeySeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  if(a = this.mseq) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$;
    a = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.INext, a)
  }else {
    a = cljs.core.type_satisfies_.call(null, cljs.core.INext, a)
  }
  a = a ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null == a ? null : new cljs.core.KeySeq(a, this._meta)
};
cljs.core.KeySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.KeySeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.KeySeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.KeySeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.KeySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.KeySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  a = cljs.core._first.call(null, this.mseq);
  return cljs.core._key.call(null, a)
};
cljs.core.KeySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  if(a = this.mseq) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$;
    a = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.INext, a)
  }else {
    a = cljs.core.type_satisfies_.call(null, cljs.core.INext, a)
  }
  a = a ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null != a ? new cljs.core.KeySeq(a, this._meta) : cljs.core.List.EMPTY
};
cljs.core.KeySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.KeySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.KeySeq(this.mseq, b)
};
cljs.core.KeySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta
};
cljs.core.KeySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this._meta)
};
cljs.core.__GT_KeySeq = function(a, b) {
  return new cljs.core.KeySeq(a, b)
};
cljs.core.keys = function(a) {
  return(a = cljs.core.seq.call(null, a)) ? new cljs.core.KeySeq(a, null) : null
};
cljs.core.key = function(a) {
  return cljs.core._key.call(null, a)
};
cljs.core.ValSeq = function(a, b) {
  this.mseq = a;
  this._meta = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988
};
cljs.core.ValSeq.cljs$lang$type = !0;
cljs.core.ValSeq.cljs$lang$ctorStr = "cljs.core/ValSeq";
cljs.core.ValSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ValSeq")
};
cljs.core.ValSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.ValSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  if(a = this.mseq) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$;
    a = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.INext, a)
  }else {
    a = cljs.core.type_satisfies_.call(null, cljs.core.INext, a)
  }
  a = a ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null == a ? null : new cljs.core.ValSeq(a, this._meta)
};
cljs.core.ValSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.ValSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.ValSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, a)
};
cljs.core.ValSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, a)
};
cljs.core.ValSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ValSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  a = cljs.core._first.call(null, this.mseq);
  return cljs.core._val.call(null, a)
};
cljs.core.ValSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  if(a = this.mseq) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$;
    a = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.INext, a)
  }else {
    a = cljs.core.type_satisfies_.call(null, cljs.core.INext, a)
  }
  a = a ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null != a ? new cljs.core.ValSeq(a, this._meta) : cljs.core.List.EMPTY
};
cljs.core.ValSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.ValSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ValSeq(this.mseq, b)
};
cljs.core.ValSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta
};
cljs.core.ValSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this._meta)
};
cljs.core.__GT_ValSeq = function(a, b) {
  return new cljs.core.ValSeq(a, b)
};
cljs.core.vals = function(a) {
  return(a = cljs.core.seq.call(null, a)) ? new cljs.core.ValSeq(a, null) : null
};
cljs.core.val = function(a) {
  return cljs.core._val.call(null, a)
};
cljs.core.merge = function() {
  var a = function(a) {
    return cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, a)) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.conj.call(null, cljs.core.truth_(a) ? a : cljs.core.PersistentArrayMap.EMPTY, b)
    }, a) : null
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.merge_with = function() {
  var a = function(a, b) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, b))) {
      var e = function(a) {
        return function(b, c) {
          return cljs.core.reduce.call(null, a, cljs.core.truth_(b) ? b : cljs.core.PersistentArrayMap.EMPTY, cljs.core.seq.call(null, c))
        }
      }(function(b, d) {
        var e = cljs.core.first.call(null, d), k = cljs.core.second.call(null, d);
        return cljs.core.contains_QMARK_.call(null, b, e) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core.get.call(null, b, e), k)) : cljs.core.assoc.call(null, b, e, k)
      });
      return cljs.core.reduce.call(null, e, b)
    }
    return null
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.select_keys = function(a, b) {
  for(var c = cljs.core.PersistentArrayMap.EMPTY, d = cljs.core.seq.call(null, b);;) {
    if(d) {
      var e = cljs.core.first.call(null, d), f = cljs.core.get.call(null, a, e, new cljs.core.Keyword("cljs.core", "not-found", "cljs.core/not-found", 4155500789)), c = cljs.core.not_EQ_.call(null, f, new cljs.core.Keyword("cljs.core", "not-found", "cljs.core/not-found", 4155500789)) ? cljs.core.assoc.call(null, c, e, f) : c, d = cljs.core.next.call(null, d)
    }else {
      return c
    }
  }
};
cljs.core.PersistentHashSet = function(a, b, c) {
  this.meta = a;
  this.hash_map = b;
  this.__hash = c;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 15077647
};
cljs.core.PersistentHashSet.cljs$lang$type = !0;
cljs.core.PersistentHashSet.cljs$lang$ctorStr = "cljs.core/PersistentHashSet";
cljs.core.PersistentHashSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentHashSet")
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientHashSet(cljs.core._as_transient.call(null, this.hash_map))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_iset.call(null, a)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this.hash_map, b)) ? b : c
};
cljs.core.PersistentHashSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentHashSet.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(this.meta, cljs.core.assoc.call(null, this.hash_map, b, null), null)
};
cljs.core.PersistentHashSet.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.keys.call(null, this.hash_map)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(this.meta, cljs.core._dissoc.call(null, this.hash_map, b), null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core._count.call(null, this.hash_map)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = cljs.core.set_QMARK_.call(null, b);
  return c ? (c = cljs.core.count.call(null, a) === cljs.core.count.call(null, b)) ? cljs.core.every_QMARK_.call(null, function(b) {
    return cljs.core.contains_QMARK_.call(null, a, b)
  }, b) : c : c
};
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(b, this.hash_map, this.__hash)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentHashSet.EMPTY, this.meta)
};
cljs.core.__GT_PersistentHashSet = function(a, b, c) {
  return new cljs.core.PersistentHashSet(a, b, c)
};
cljs.core.PersistentHashSet.EMPTY = new cljs.core.PersistentHashSet(null, cljs.core.PersistentArrayMap.EMPTY, 0);
cljs.core.PersistentHashSet.fromArray = function(a, b) {
  var c = a.length;
  if(c / 2 <= cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
    return c = b ? a : a.slice(), new cljs.core.PersistentHashSet(null, cljs.core.PersistentArrayMap.fromArray.call(null, c, !0), null)
  }
  for(var d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
    if(d < c) {
      var f = d + 2, e = cljs.core.conj_BANG_.call(null, e, a[d]), d = f
    }else {
      return cljs.core.persistent_BANG_.call(null, e)
    }
  }
};
cljs.core.TransientHashSet = function(a) {
  this.transient_map = a;
  this.cljs$lang$protocol_mask$partition0$ = 259;
  this.cljs$lang$protocol_mask$partition1$ = 136
};
cljs.core.TransientHashSet.cljs$lang$type = !0;
cljs.core.TransientHashSet.cljs$lang$ctorStr = "cljs.core/TransientHashSet";
cljs.core.TransientHashSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientHashSet")
};
cljs.core.TransientHashSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        e = cljs.core._lookup.call(null, this.transient_map, c, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? null : c;
        return e;
      case 3:
        return e = cljs.core._lookup.call(null, this.transient_map, c, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? d : c, e
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.TransientHashSet.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._lookup.call(null, this.transient_map, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? c : b
};
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.count.call(null, this.transient_map)
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = function(a, b) {
  this.transient_map = cljs.core.dissoc_BANG_.call(null, this.transient_map, b);
  return a
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  this.transient_map = cljs.core.assoc_BANG_.call(null, this.transient_map, b, null);
  return a
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  return new cljs.core.PersistentHashSet(null, cljs.core.persistent_BANG_.call(null, this.transient_map), null)
};
cljs.core.__GT_TransientHashSet = function(a) {
  return new cljs.core.TransientHashSet(a)
};
cljs.core.PersistentTreeSet = function(a, b, c) {
  this.meta = a;
  this.tree_map = b;
  this.__hash = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 417730831
};
cljs.core.PersistentTreeSet.cljs$lang$type = !0;
cljs.core.PersistentTreeSet.cljs$lang$ctorStr = "cljs.core/PersistentTreeSet";
cljs.core.PersistentTreeSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeSet")
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_iset.call(null, a)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = this.tree_map.entry_at(b);
  return null != a ? a.key : c
};
cljs.core.PersistentTreeSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentTreeSet.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.assoc.call(null, this.tree_map, b, null), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core.rseq.call(null, this.tree_map))
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq.call(null, this.tree_map, b))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq_from.call(null, this.tree_map, b, c))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return b
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function(a) {
  return cljs.core._comparator.call(null, this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.keys.call(null, this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.dissoc.call(null, this.tree_map, b), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.count.call(null, this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = cljs.core.set_QMARK_.call(null, b);
  return c ? (c = cljs.core.count.call(null, a) === cljs.core.count.call(null, b)) ? cljs.core.every_QMARK_.call(null, function(b) {
    return cljs.core.contains_QMARK_.call(null, a, b)
  }, b) : c : c
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(b, this.tree_map, this.__hash)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeSet.EMPTY, this.meta)
};
cljs.core.__GT_PersistentTreeSet = function(a, b, c) {
  return new cljs.core.PersistentTreeSet(a, b, c)
};
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.PersistentTreeMap.EMPTY, 0);
cljs.core.set_from_indexed_seq = function(a) {
  a = a.arr;
  a: {
    for(var b = 0, c = cljs.core._as_transient.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
      if(b < a.length) {
        var d = b + 1, c = cljs.core._conj_BANG_.call(null, c, a[b]), b = d
      }else {
        a = c;
        break a
      }
    }
    a = void 0
  }
  return cljs.core._persistent_BANG_.call(null, a)
};
cljs.core.set = function(a) {
  a = cljs.core.seq.call(null, a);
  if(null == a) {
    return cljs.core.PersistentHashSet.EMPTY
  }
  if(a instanceof cljs.core.IndexedSeq) {
    return cljs.core.set_from_indexed_seq.call(null, a)
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    for(var b = cljs.core._as_transient.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
      if(null != a) {
        var c = cljs.core._next.call(null, a), b = cljs.core._conj_BANG_.call(null, b, cljs.core._first.call(null, a));
        a = c
      }else {
        return cljs.core._persistent_BANG_.call(null, b)
      }
    }
  }else {
    return null
  }
};
cljs.core.hash_set = function() {
  var a = null, b = function() {
    return cljs.core.PersistentHashSet.EMPTY
  }, c = function() {
    var a = function(a) {
      return cljs.core.set.call(null, a)
    }, b = function(b) {
      var c = null;
      0 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return a.call(this, c)
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      b = cljs.core.seq(b);
      return a(b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.sorted_set = function() {
  var a = function(a) {
    return cljs.core.reduce.call(null, cljs.core._conj, cljs.core.PersistentTreeSet.EMPTY, a)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.sorted_set_by = function() {
  var a = function(a, b) {
    return cljs.core.reduce.call(null, cljs.core._conj, new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map_by.call(null, a), 0), b)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.replace = function(a, b) {
  if(cljs.core.vector_QMARK_.call(null, b)) {
    var c = cljs.core.count.call(null, b);
    return cljs.core.reduce.call(null, function(b, c) {
      var f = cljs.core.find.call(null, a, cljs.core.nth.call(null, b, c));
      return cljs.core.truth_(f) ? cljs.core.assoc.call(null, b, c, cljs.core.second.call(null, f)) : b
    }, b, cljs.core.take.call(null, c, cljs.core.iterate.call(null, cljs.core.inc, 0)))
  }
  return cljs.core.map.call(null, function(b) {
    var c = cljs.core.find.call(null, a, b);
    return cljs.core.truth_(c) ? cljs.core.second.call(null, c) : b
  }, b)
};
cljs.core.distinct = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, function() {
      return function(a, d) {
        for(;;) {
          var e = a, k = cljs.core.nth.call(null, e, 0, null);
          if(e = cljs.core.seq.call(null, e)) {
            if(cljs.core.contains_QMARK_.call(null, d, k)) {
              k = cljs.core.rest.call(null, e), e = d, a = k, d = e
            }else {
              return cljs.core.cons.call(null, k, c.call(null, cljs.core.rest.call(null, e), cljs.core.conj.call(null, d, k)))
            }
          }else {
            return null
          }
        }
      }.call(null, a, e)
    }, null, null)
  }.call(null, a, cljs.core.PersistentHashSet.EMPTY)
};
cljs.core.butlast = function(a) {
  for(var b = cljs.core.PersistentVector.EMPTY;;) {
    if(cljs.core.next.call(null, a)) {
      b = cljs.core.conj.call(null, b, cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
    }else {
      return cljs.core.seq.call(null, b)
    }
  }
};
cljs.core.name = function(a) {
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition1$ & 4096) ? b : a.cljs$core$INamed$, b = b ? !0 : !1) : b = !1;
  if(b) {
    return cljs.core._name.call(null, a)
  }
  if("string" === typeof a) {
    return a
  }
  throw Error([cljs.core.str("Doesn't support name: "), cljs.core.str(a)].join(""));
};
cljs.core.namespace = function(a) {
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition1$ & 4096) ? b : a.cljs$core$INamed$, b = b ? !0 : !1) : b = !1;
  if(b) {
    return cljs.core._namespace.call(null, a)
  }
  throw Error([cljs.core.str("Doesn't support namespace: "), cljs.core.str(a)].join(""));
};
cljs.core.zipmap = function(a, b) {
  for(var c = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.seq.call(null, a), e = cljs.core.seq.call(null, b);;) {
    var f;
    f = (f = d) ? e : f;
    if(f) {
      c = cljs.core.assoc_BANG_.call(null, c, cljs.core.first.call(null, d), cljs.core.first.call(null, e)), d = cljs.core.next.call(null, d), e = cljs.core.next.call(null, e)
    }else {
      return cljs.core.persistent_BANG_.call(null, c)
    }
  }
};
cljs.core.max_key = function() {
  var a = null, b = function(a, b, c) {
    return a.call(null, b) > a.call(null, c) ? b : c
  }, c = function() {
    var b = function(b, c, d, e) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d)
      }, a.call(null, b, c, d), e)
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l)
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return e;
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return b
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.min_key = function() {
  var a = null, b = function(a, b, c) {
    return a.call(null, b) < a.call(null, c) ? b : c
  }, c = function() {
    var b = function(b, c, d, e) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d)
      }, a.call(null, b, c, d), e)
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l)
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return e;
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return b
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.partition_all = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, b, c)
  }, c = function(b, c, f) {
    return new cljs.core.LazySeq(null, function() {
      var g = cljs.core.seq.call(null, f);
      return g ? cljs.core.cons.call(null, cljs.core.take.call(null, b, g), a.call(null, b, c, cljs.core.drop.call(null, c, g))) : null
    }, null, null)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.take_while = function take_while(b, c) {
  return new cljs.core.LazySeq(null, function() {
    var d = cljs.core.seq.call(null, c);
    return d ? cljs.core.truth_(b.call(null, cljs.core.first.call(null, d))) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_while.call(null, b, cljs.core.rest.call(null, d))) : null : null
  }, null, null)
};
cljs.core.mk_bound_fn = function(a, b, c) {
  return function(d) {
    var e = cljs.core._comparator.call(null, a);
    return b.call(null, e.call(null, cljs.core._entry_key.call(null, a, d), c), 0)
  }
};
cljs.core.subseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn.call(null, a, b, c);
    return cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._GT_, null, cljs.core._GT__EQ_, null], !0).call(null, b)) ? (a = cljs.core._sorted_seq_from.call(null, a, c, !0), cljs.core.truth_(a) ? (b = cljs.core.nth.call(null, a, 0, null), cljs.core.truth_(g.call(null, b)) ? a : cljs.core.next.call(null, a)) : null) : cljs.core.take_while.call(null, g, cljs.core._sorted_seq.call(null, a, !0))
  }, c = function(a, b, c, g, h) {
    var k = cljs.core._sorted_seq_from.call(null, a, c, !0);
    if(cljs.core.truth_(k)) {
      var l = cljs.core.nth.call(null, k, 0, null);
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, a, g, h), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, a, b, c).call(null, l)) ? k : cljs.core.next.call(null, k))
    }
    return null
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a
}();
cljs.core.rsubseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn.call(null, a, b, c);
    return cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._LT_, null, cljs.core._LT__EQ_, null], !0).call(null, b)) ? (a = cljs.core._sorted_seq_from.call(null, a, c, !1), cljs.core.truth_(a) ? (b = cljs.core.nth.call(null, a, 0, null), cljs.core.truth_(g.call(null, b)) ? a : cljs.core.next.call(null, a)) : null) : cljs.core.take_while.call(null, g, cljs.core._sorted_seq.call(null, a, !1))
  }, c = function(a, b, c, g, h) {
    var k = cljs.core._sorted_seq_from.call(null, a, h, !1);
    if(cljs.core.truth_(k)) {
      var l = cljs.core.nth.call(null, k, 0, null);
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, a, b, c), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, a, g, h).call(null, l)) ? k : cljs.core.next.call(null, k))
    }
    return null
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a
}();
cljs.core.Range = function(a, b, c, d, e) {
  this.meta = a;
  this.start = b;
  this.end = c;
  this.step = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32375006
};
cljs.core.Range.cljs$lang$type = !0;
cljs.core.Range.cljs$lang$ctorStr = "cljs.core/Range";
cljs.core.Range.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Range")
};
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.Range.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return 0 < this.step ? this.start + this.step < this.end ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : null : this.start + this.step > this.end ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : null
};
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.Range.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.step ? this.start < this.end ? a : null : this.start > this.end ? a : null
};
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.not.call(null, a.cljs$core$ISeqable$_seq$arity$1(a)) ? 0 : Math.ceil((this.end - this.start) / this.step)
};
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null != a.cljs$core$ISeqable$_seq$arity$1(a) ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : cljs.core.List.EMPTY
};
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Range(b, this.start, this.end, this.step, this.__hash)
};
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if(b < a.cljs$core$ICounted$_count$arity$1(a)) {
    return this.start + b * this.step
  }
  var c;
  c = (c = this.start > this.end) ? 0 === this.step : c;
  if(c) {
    return this.start
  }
  throw Error("Index out of bounds");
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  if(b < a.cljs$core$ICounted$_count$arity$1(a)) {
    return this.start + b * this.step
  }
  a = (a = this.start > this.end) ? 0 === this.step : a;
  return a ? this.start : c
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_Range = function(a, b, c, d, e) {
  return new cljs.core.Range(a, b, c, d, e)
};
cljs.core.range = function() {
  var a = null, b = function() {
    return a.call(null, 0, Number.MAX_VALUE, 1)
  }, c = function(b) {
    return a.call(null, 0, b, 1)
  }, d = function(b, c) {
    return a.call(null, b, c, 1)
  }, e = function(a, b, c) {
    return new cljs.core.Range(null, a, b, c, null)
  }, a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      case 3:
        return e.call(this, a, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  a.cljs$core$IFn$_invoke$arity$3 = e;
  return a
}();
cljs.core.take_nth = function take_nth(b, c) {
  return new cljs.core.LazySeq(null, function() {
    var d = cljs.core.seq.call(null, c);
    return d ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_nth.call(null, b, cljs.core.drop.call(null, b, d))) : null
  }, null, null)
};
cljs.core.split_with = function(a, b) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take_while.call(null, a, b), cljs.core.drop_while.call(null, a, b)], !0)
};
cljs.core.partition_by = function partition_by(b, c) {
  return new cljs.core.LazySeq(null, function() {
    var d = cljs.core.seq.call(null, c);
    if(d) {
      var e = cljs.core.first.call(null, d), f = b.call(null, e), e = cljs.core.cons.call(null, e, cljs.core.take_while.call(null, function(c, d) {
        return function(c) {
          return cljs.core._EQ_.call(null, d, b.call(null, c))
        }
      }(e, f), cljs.core.next.call(null, d)));
      return cljs.core.cons.call(null, e, partition_by.call(null, b, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, e), d))))
    }
    return null
  }, null, null)
};
cljs.core.frequencies = function(a) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.assoc_BANG_.call(null, a, c, cljs.core.get.call(null, a, c, 0) + 1)
  }, cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY), a))
};
cljs.core.reductions = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, c);
      return f ? a.call(null, b, cljs.core.first.call(null, f), cljs.core.rest.call(null, f)) : cljs.core.list.call(null, b.call(null))
    }, null, null)
  }, c = function(b, c, f) {
    return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, function() {
      var g = cljs.core.seq.call(null, f);
      return g ? a.call(null, b, b.call(null, c, cljs.core.first.call(null, g)), cljs.core.rest.call(null, g)) : null
    }, null, null))
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.juxt = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function() {
        var b = function(b, c, d, e) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, b, c, d, e))
        }, c = function(a, c, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return b.call(this, a, c, d, f)
        };
        c.cljs$lang$maxFixedArity = 3;
        c.cljs$lang$applyTo = function(a) {
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return b(c, d, e, a)
        };
        c.cljs$core$IFn$_invoke$arity$variadic = b;
        return c
      }(), b = function(b, d, e, g) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, b));
          case 2:
            return cljs.core.vector.call(null, a.call(null, b, d));
          case 3:
            return cljs.core.vector.call(null, a.call(null, b, d, e));
          default:
            return c.cljs$core$IFn$_invoke$arity$variadic(b, d, e, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = c.cljs$lang$applyTo;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, e, h) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, c, d, e, h), cljs.core.apply.call(null, b, c, d, e, h))
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a)
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d
      }(), c = function(c, e, h, p) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null), b.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, c), b.call(null, c));
          case 2:
            return cljs.core.vector.call(null, a.call(null, c, e), b.call(null, c, e));
          case 3:
            return cljs.core.vector.call(null, a.call(null, c, e, h), b.call(null, c, e, h));
          default:
            return d.cljs$core$IFn$_invoke$arity$variadic(c, e, h, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        var d = function(d, e, k, m) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, d, e, k, m), cljs.core.apply.call(null, b, d, e, k, m), cljs.core.apply.call(null, c, d, e, k, m))
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a)
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e
      }(), d = function(d, k, p, r) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null), b.call(null), c.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, d), b.call(null, d), c.call(null, d));
          case 2:
            return cljs.core.vector.call(null, a.call(null, d, k), b.call(null, d, k), c.call(null, d, k));
          case 3:
            return cljs.core.vector.call(null, a.call(null, d, k, p), b.call(null, d, k, p), c.call(null, d, k, p));
          default:
            return e.cljs$core$IFn$_invoke$arity$variadic(d, k, p, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function() {
          return cljs.core.reduce.call(null, function(a, b) {
            return cljs.core.conj.call(null, a, b.call(null))
          }, cljs.core.PersistentVector.EMPTY, e)
        }, c = function(a) {
          return cljs.core.reduce.call(null, function(b, c) {
            return cljs.core.conj.call(null, b, c.call(null, a))
          }, cljs.core.PersistentVector.EMPTY, e)
        }, d = function(a, b) {
          return cljs.core.reduce.call(null, function(c, d) {
            return cljs.core.conj.call(null, c, d.call(null, a, b))
          }, cljs.core.PersistentVector.EMPTY, e)
        }, f = function(a, b, c) {
          return cljs.core.reduce.call(null, function(d, e) {
            return cljs.core.conj.call(null, d, e.call(null, a, b, c))
          }, cljs.core.PersistentVector.EMPTY, e)
        }, g = function() {
          var a = function(a, b, c, d) {
            return cljs.core.reduce.call(null, function(e, f) {
              return cljs.core.conj.call(null, e, cljs.core.apply.call(null, f, a, b, c, d))
            }, cljs.core.PersistentVector.EMPTY, e)
          }, b = function(b, c, d, e) {
            var f = null;
            3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return a.call(this, b, c, d, f)
          };
          b.cljs$lang$maxFixedArity = 3;
          b.cljs$lang$applyTo = function(b) {
            var c = cljs.core.first(b);
            b = cljs.core.next(b);
            var d = cljs.core.first(b);
            b = cljs.core.next(b);
            var e = cljs.core.first(b);
            b = cljs.core.rest(b);
            return a(c, d, e, b)
          };
          b.cljs$core$IFn$_invoke$arity$variadic = a;
          return b
        }(), a = function(a, e, h, k) {
          switch(arguments.length) {
            case 0:
              return b.call(this);
            case 1:
              return c.call(this, a);
            case 2:
              return d.call(this, a, e);
            case 3:
              return f.call(this, a, e, h);
            default:
              return g.cljs$core$IFn$_invoke$arity$variadic(a, e, h, cljs.core.array_seq(arguments, 3))
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = g.cljs$lang$applyTo;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.dorun = function() {
  var a = null, b = function(a) {
    for(;;) {
      if(cljs.core.seq.call(null, a)) {
        a = cljs.core.next.call(null, a)
      }else {
        return null
      }
    }
  }, c = function(a, b) {
    for(;;) {
      if(cljs.core.truth_(function() {
        var c = cljs.core.seq.call(null, b);
        return c ? 0 < a : c
      }())) {
        var c = a - 1, g = cljs.core.next.call(null, b);
        a = c;
        b = g
      }else {
        return null
      }
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.doall = function() {
  var a = null, b = function(a) {
    cljs.core.dorun.call(null, a);
    return a
  }, c = function(a, b) {
    cljs.core.dorun.call(null, a, b);
    return b
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.regexp_QMARK_ = function(a) {
  return a instanceof RegExp
};
cljs.core.re_matches = function(a, b) {
  var c = a.exec(b);
  return cljs.core._EQ_.call(null, cljs.core.first.call(null, c), b) ? 1 === cljs.core.count.call(null, c) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c) : null
};
cljs.core.re_find = function(a, b) {
  var c = a.exec(b);
  return null == c ? null : 1 === cljs.core.count.call(null, c) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c)
};
cljs.core.re_seq = function re_seq(b, c) {
  var d = cljs.core.re_find.call(null, b, c), e = c.search(b), f = cljs.core.coll_QMARK_.call(null, d) ? cljs.core.first.call(null, d) : d, g = cljs.core.subs.call(null, c, e + cljs.core.count.call(null, f));
  return cljs.core.truth_(d) ? new cljs.core.LazySeq(null, function() {
    return cljs.core.cons.call(null, d, re_seq.call(null, b, g))
  }, null, null) : null
};
cljs.core.re_pattern = function(a) {
  var b = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, a);
  cljs.core.nth.call(null, b, 0, null);
  a = cljs.core.nth.call(null, b, 1, null);
  b = cljs.core.nth.call(null, b, 2, null);
  return RegExp(b, a)
};
cljs.core.pr_sequential_writer = function(a, b, c, d, e, f, g) {
  cljs.core._write.call(null, a, c);
  cljs.core.seq.call(null, g) && b.call(null, cljs.core.first.call(null, g), a, f);
  c = cljs.core.seq.call(null, cljs.core.next.call(null, g));
  g = null;
  for(var h = 0, k = 0;;) {
    if(k < h) {
      var l = cljs.core._nth.call(null, g, k);
      cljs.core._write.call(null, a, d);
      b.call(null, l, a, f);
      k += 1
    }else {
      if(c = cljs.core.seq.call(null, c)) {
        g = c, cljs.core.chunked_seq_QMARK_.call(null, g) ? (c = cljs.core.chunk_first.call(null, g), k = cljs.core.chunk_rest.call(null, g), g = c, h = cljs.core.count.call(null, c), c = k) : (c = cljs.core.first.call(null, g), cljs.core._write.call(null, a, d), b.call(null, c, a, f), c = cljs.core.next.call(null, g), g = null, h = 0), k = 0
      }else {
        break
      }
    }
  }
  return cljs.core._write.call(null, a, e)
};
cljs.core.write_all = function() {
  var a = function(a, b) {
    for(var e = cljs.core.seq.call(null, b), f = null, g = 0, h = 0;;) {
      if(h < g) {
        var k = cljs.core._nth.call(null, f, h);
        cljs.core._write.call(null, a, k);
        h += 1
      }else {
        if(e = cljs.core.seq.call(null, e)) {
          f = e, cljs.core.chunked_seq_QMARK_.call(null, f) ? (e = cljs.core.chunk_first.call(null, f), g = cljs.core.chunk_rest.call(null, f), f = e, k = cljs.core.count.call(null, e), e = g, g = k) : (k = cljs.core.first.call(null, f), cljs.core._write.call(null, a, k), e = cljs.core.next.call(null, f), f = null, g = 0), h = 0
        }else {
          return null
        }
      }
    }
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.string_print = function(a) {
  cljs.core._STAR_print_fn_STAR_.call(null, a);
  return null
};
cljs.core.flush = function() {
  return null
};
cljs.core.char_escapes = {'"':'\\"', "\\":"\\\\", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t"};
cljs.core.quote_string = function(a) {
  return[cljs.core.str('"'), cljs.core.str(a.replace(RegExp('[\\\\"\b\f\n\r\t]', "g"), function(a) {
    return cljs.core.char_escapes[a]
  })), cljs.core.str('"')].join("")
};
cljs.core.pr_writer = function pr_writer(b, c, d) {
  if(null == b) {
    return cljs.core._write.call(null, c, "nil")
  }
  if(void 0 === b) {
    return cljs.core._write.call(null, c, "#\x3cundefined\x3e")
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    cljs.core.truth_(function() {
      var c = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "meta", "meta", 1017252215));
      return cljs.core.truth_(c) ? (b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 131072) ? c : b.cljs$core$IMeta$, c = c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IMeta, b)) : c = cljs.core.type_satisfies_.call(null, cljs.core.IMeta, b), cljs.core.truth_(c) ? cljs.core.meta.call(null, b) : c) : c
    }()) && (cljs.core._write.call(null, c, "^"), pr_writer.call(null, cljs.core.meta.call(null, b), c, d), cljs.core._write.call(null, c, " "));
    if(null == b) {
      return cljs.core._write.call(null, c, "nil")
    }
    if(b.cljs$lang$type) {
      return b.cljs$lang$ctorPrWriter(b, c, d)
    }
    if(function() {
      if(b) {
        var c;
        c = (c = b.cljs$lang$protocol_mask$partition0$ & 2147483648) ? c : b.cljs$core$IPrintWithWriter$;
        return c ? !0 : !1
      }
      return!1
    }()) {
      return cljs.core._pr_writer.call(null, b, c, d)
    }
    if(function() {
      var c = cljs.core.type.call(null, b) === Boolean;
      return c ? c : "number" === typeof b
    }()) {
      return cljs.core._write.call(null, c, "" + cljs.core.str(b))
    }
    if(b instanceof Array) {
      return cljs.core.pr_sequential_writer.call(null, c, pr_writer, "#\x3cArray [", ", ", "]\x3e", d, b)
    }
    if(goog.isString(b)) {
      return cljs.core.truth_((new cljs.core.Keyword(null, "readably", "readably", 4441712502)).call(null, d)) ? cljs.core._write.call(null, c, cljs.core.quote_string.call(null, b)) : cljs.core._write.call(null, c, b)
    }
    if(cljs.core.fn_QMARK_.call(null, b)) {
      return cljs.core.write_all.call(null, c, "#\x3c", "" + cljs.core.str(b), "\x3e")
    }
    if(b instanceof Date) {
      var e = function(b, c) {
        for(var d = "" + cljs.core.str(b);;) {
          if(cljs.core.count.call(null, d) < c) {
            d = [cljs.core.str("0"), cljs.core.str(d)].join("")
          }else {
            return d
          }
        }
      };
      return cljs.core.write_all.call(null, c, '#inst "', "" + cljs.core.str(b.getUTCFullYear()), "-", e.call(null, b.getUTCMonth() + 1, 2), "-", e.call(null, b.getUTCDate(), 2), "T", e.call(null, b.getUTCHours(), 2), ":", e.call(null, b.getUTCMinutes(), 2), ":", e.call(null, b.getUTCSeconds(), 2), ".", e.call(null, b.getUTCMilliseconds(), 3), "-", '00:00"')
    }
    return cljs.core.truth_(cljs.core.regexp_QMARK_.call(null, b)) ? cljs.core.write_all.call(null, c, '#"', b.source, '"') : function() {
      if(b) {
        var c;
        c = (c = b.cljs$lang$protocol_mask$partition0$ & 2147483648) ? c : b.cljs$core$IPrintWithWriter$;
        return c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IPrintWithWriter, b)
      }
      return cljs.core.type_satisfies_.call(null, cljs.core.IPrintWithWriter, b)
    }() ? cljs.core._pr_writer.call(null, b, c, d) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.write_all.call(null, c, "#\x3c", "" + cljs.core.str(b), "\x3e") : null
  }
  return null
};
cljs.core.pr_seq_writer = function(a, b, c) {
  cljs.core.pr_writer.call(null, cljs.core.first.call(null, a), b, c);
  a = cljs.core.seq.call(null, cljs.core.next.call(null, a));
  for(var d = null, e = 0, f = 0;;) {
    if(f < e) {
      var g = cljs.core._nth.call(null, d, f);
      cljs.core._write.call(null, b, " ");
      cljs.core.pr_writer.call(null, g, b, c);
      f += 1
    }else {
      if(a = cljs.core.seq.call(null, a)) {
        d = a, cljs.core.chunked_seq_QMARK_.call(null, d) ? (a = cljs.core.chunk_first.call(null, d), e = cljs.core.chunk_rest.call(null, d), d = a, g = cljs.core.count.call(null, a), a = e, e = g) : (g = cljs.core.first.call(null, d), cljs.core._write.call(null, b, " "), cljs.core.pr_writer.call(null, g, b, c), a = cljs.core.next.call(null, d), d = null, e = 0), f = 0
      }else {
        return null
      }
    }
  }
};
cljs.core.pr_sb_with_opts = function(a, b) {
  var c = new goog.string.StringBuffer, d = new cljs.core.StringBufferWriter(c);
  cljs.core.pr_seq_writer.call(null, a, d, b);
  cljs.core._flush.call(null, d);
  return c
};
cljs.core.pr_str_with_opts = function(a, b) {
  return cljs.core.empty_QMARK_.call(null, a) ? "" : "" + cljs.core.str(cljs.core.pr_sb_with_opts.call(null, a, b))
};
cljs.core.prn_str_with_opts = function(a, b) {
  if(cljs.core.empty_QMARK_.call(null, a)) {
    return"\n"
  }
  var c = cljs.core.pr_sb_with_opts.call(null, a, b);
  c.append("\n");
  return"" + cljs.core.str(c)
};
cljs.core.pr_with_opts = function(a, b) {
  return cljs.core.string_print.call(null, cljs.core.pr_str_with_opts.call(null, a, b))
};
cljs.core.newline = function(a) {
  cljs.core.string_print.call(null, "\n");
  return cljs.core.truth_(cljs.core.get.call(null, a, new cljs.core.Keyword(null, "flush-on-newline", "flush-on-newline", 4338025857))) ? cljs.core.flush.call(null) : null
};
cljs.core.pr_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.prn_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.pr = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.print = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 4441712502), !1))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.print_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 4441712502), !1))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.println = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 4441712502), !1));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.println_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 4441712502), !1))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.prn = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.KeySeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.KeySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#queue [", " ", "]", c, cljs.core.seq.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#{", " ", "}", c, a)
};
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#{", " ", "}", c, a)
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.List.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.List.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, "()")
};
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.ValSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ValSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentVector.prototype.cljs$core$IComparable$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_indexed.call(null, a, b)
};
cljs.core.Subvec.prototype.cljs$core$IComparable$ = !0;
cljs.core.Subvec.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_indexed.call(null, a, b)
};
cljs.core.Atom = function(a, b, c, d) {
  this.state = a;
  this.meta = b;
  this.validator = c;
  this.watches = d;
  this.cljs$lang$protocol_mask$partition0$ = 2153938944;
  this.cljs$lang$protocol_mask$partition1$ = 2
};
cljs.core.Atom.cljs$lang$type = !0;
cljs.core.Atom.cljs$lang$ctorStr = "cljs.core/Atom";
cljs.core.Atom.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Atom")
};
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid(a)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(a, b, c) {
  for(var d = cljs.core.seq.call(null, this.watches), e = null, f = 0, g = 0;;) {
    if(g < f) {
      var h = cljs.core._nth.call(null, e, g), k = cljs.core.nth.call(null, h, 0, null), h = cljs.core.nth.call(null, h, 1, null);
      h.call(null, k, a, b, c);
      g += 1
    }else {
      if(d = cljs.core.seq.call(null, d)) {
        cljs.core.chunked_seq_QMARK_.call(null, d) ? (e = cljs.core.chunk_first.call(null, d), d = cljs.core.chunk_rest.call(null, d), k = e, f = cljs.core.count.call(null, e), e = k) : (e = cljs.core.first.call(null, d), k = cljs.core.nth.call(null, e, 0, null), h = cljs.core.nth.call(null, e, 1, null), h.call(null, k, a, b, c), d = cljs.core.next.call(null, d), e = null, f = 0), g = 0
      }else {
        return null
      }
    }
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = function(a, b, c) {
  return a.watches = cljs.core.assoc.call(null, this.watches, b, c)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(a, b) {
  return a.watches = cljs.core.dissoc.call(null, this.watches, b)
};
cljs.core.Atom.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  cljs.core._write.call(null, b, "#\x3cAtom: ");
  cljs.core.pr_writer.call(null, this.state, b, c);
  return cljs.core._write.call(null, b, "\x3e")
};
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  return this.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return a === b
};
cljs.core.__GT_Atom = function(a, b, c, d) {
  return new cljs.core.Atom(a, b, c, d)
};
cljs.core.atom = function() {
  var a = null, b = function(a) {
    return new cljs.core.Atom(a, null, null, null)
  }, c = function() {
    var a = function(a, b) {
      var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "validator", "validator", 4199087812)), c = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "meta", "meta", 1017252215));
      return new cljs.core.Atom(a, c, d, null)
    }, b = function(b, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, e)
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.reset_BANG_ = function(a, b) {
  var c = a.validator;
  if(cljs.core.truth_(c) && !cljs.core.truth_(c.call(null, b))) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("Validator rejected reference state"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "validate", "validate", 1233162959, null), new cljs.core.Symbol(null, "new-value", "new-value", 972165309, null))))].join(""));
  }
  c = a.state;
  a.state = b;
  cljs.core._notify_watches.call(null, a, c, b);
  return b
};
cljs.core.swap_BANG_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state))
  }, c = function(a, b, c) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c))
  }, d = function(a, b, c, d) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c, d))
  }, e = function(a, b, c, d, e) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c, d, e))
  }, f = function() {
    var a = function(a, b, c, d, e, f) {
      return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, b, a.state, c, d, e, f))
    }, b = function(b, c, d, e, f, h) {
      var s = null;
      5 < arguments.length && (s = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return a.call(this, b, c, d, e, f, s)
    };
    b.cljs$lang$maxFixedArity = 5;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.next(b);
      var h = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, h, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, h, k, l, m, n) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, h);
      case 3:
        return c.call(this, a, h, k);
      case 4:
        return d.call(this, a, h, k, l);
      case 5:
        return e.call(this, a, h, k, l, m);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, cljs.core.array_seq(arguments, 5))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.compare_and_set_BANG_ = function(a, b, c) {
  return cljs.core._EQ_.call(null, a.state, b) ? (cljs.core.reset_BANG_.call(null, a, c), !0) : !1
};
cljs.core.deref = function(a) {
  return cljs.core._deref.call(null, a)
};
cljs.core.set_validator_BANG_ = function(a, b) {
  return a.validator = b
};
cljs.core.get_validator = function(a) {
  return a.validator
};
cljs.core.alter_meta_BANG_ = function() {
  var a = function(a, b, e) {
    return a.meta = cljs.core.apply.call(null, b, a.meta, e)
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.reset_meta_BANG_ = function(a, b) {
  return a.meta = b
};
cljs.core.add_watch = function(a, b, c) {
  return cljs.core._add_watch.call(null, a, b, c)
};
cljs.core.remove_watch = function(a, b) {
  return cljs.core._remove_watch.call(null, a, b)
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var a = null, b = function() {
    return a.call(null, "G__")
  }, c = function(a) {
    null == cljs.core.gensym_counter && (cljs.core.gensym_counter = cljs.core.atom.call(null, 0));
    return cljs.core.symbol.call(null, [cljs.core.str(a), cljs.core.str(cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc))].join(""))
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(a, b) {
  this.state = a;
  this.f = b;
  this.cljs$lang$protocol_mask$partition1$ = 1;
  this.cljs$lang$protocol_mask$partition0$ = 32768
};
cljs.core.Delay.cljs$lang$type = !0;
cljs.core.Delay.cljs$lang$ctorStr = "cljs.core/Delay";
cljs.core.Delay.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Delay")
};
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = function(a) {
  return(new cljs.core.Keyword(null, "done", "done", 1016993524)).call(null, cljs.core.deref.call(null, this.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  var b = this;
  return(new cljs.core.Keyword(null, "value", "value", 1125876963)).call(null, cljs.core.swap_BANG_.call(null, b.state, function(a) {
    a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
    var d = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "done", "done", 1016993524));
    return cljs.core.truth_(d) ? a : cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "done", "done", 1016993524), !0, new cljs.core.Keyword(null, "value", "value", 1125876963), b.f.call(null)], !0)
  }))
};
cljs.core.__GT_Delay = function(a, b) {
  return new cljs.core.Delay(a, b)
};
cljs.core.delay_QMARK_ = function(a) {
  return a instanceof cljs.core.Delay
};
cljs.core.force = function(a) {
  return cljs.core.delay_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : a
};
cljs.core.realized_QMARK_ = function(a) {
  return cljs.core._realized_QMARK_.call(null, a)
};
cljs.core.IEncodeJS = {};
cljs.core._clj__GT_js = function(a) {
  if(a ? a.cljs$core$IEncodeJS$_clj__GT_js$arity$1 : a) {
    return a.cljs$core$IEncodeJS$_clj__GT_js$arity$1(a)
  }
  var b;
  b = cljs.core._clj__GT_js[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._clj__GT_js._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeJS.-clj-\x3ejs", a);
  }
  return b.call(null, a)
};
cljs.core._key__GT_js = function(a) {
  if(a ? a.cljs$core$IEncodeJS$_key__GT_js$arity$1 : a) {
    return a.cljs$core$IEncodeJS$_key__GT_js$arity$1(a)
  }
  var b;
  b = cljs.core._key__GT_js[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._key__GT_js._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeJS.-key-\x3ejs", a);
  }
  return b.call(null, a)
};
cljs.core.key__GT_js = function(a) {
  return(a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$IEncodeJS$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_.call(null, cljs.core.IEncodeJS, a)) : cljs.core.type_satisfies_.call(null, cljs.core.IEncodeJS, a)) ? cljs.core._clj__GT_js.call(null, a) : function() {
    var b = "string" === typeof a;
    return b || (b = "number" === typeof a) ? b : (b = a instanceof cljs.core.Keyword) ? b : a instanceof cljs.core.Symbol
  }() ? cljs.core.clj__GT_js.call(null, a) : cljs.core.pr_str.call(null, a)
};
cljs.core.clj__GT_js = function clj__GT_js(b) {
  if(null == b) {
    return null
  }
  if(b ? cljs.core.truth_(cljs.core.truth_(null) ? null : b.cljs$core$IEncodeJS$) || (b.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_.call(null, cljs.core.IEncodeJS, b)) : cljs.core.type_satisfies_.call(null, cljs.core.IEncodeJS, b)) {
    return cljs.core._clj__GT_js.call(null, b)
  }
  if(b instanceof cljs.core.Keyword) {
    return cljs.core.name.call(null, b)
  }
  if(b instanceof cljs.core.Symbol) {
    return"" + cljs.core.str(b)
  }
  if(cljs.core.map_QMARK_.call(null, b)) {
    var c = {};
    b = cljs.core.seq.call(null, b);
    for(var d = null, e = 0, f = 0;;) {
      if(f < e) {
        var g = cljs.core._nth.call(null, d, f), h = cljs.core.nth.call(null, g, 0, null), g = cljs.core.nth.call(null, g, 1, null);
        c[cljs.core.key__GT_js.call(null, h)] = clj__GT_js.call(null, g);
        f += 1
      }else {
        if(b = cljs.core.seq.call(null, b)) {
          cljs.core.chunked_seq_QMARK_.call(null, b) ? (e = cljs.core.chunk_first.call(null, b), b = cljs.core.chunk_rest.call(null, b), d = e, e = cljs.core.count.call(null, e)) : (e = cljs.core.first.call(null, b), d = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), c[cljs.core.key__GT_js.call(null, d)] = clj__GT_js.call(null, e), b = cljs.core.next.call(null, b), d = null, e = 0), f = 0
        }else {
          break
        }
      }
    }
    return c
  }
  return cljs.core.coll_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.array, cljs.core.map.call(null, clj__GT_js, b)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? b : null
};
cljs.core.IEncodeClojure = {};
cljs.core._js__GT_clj = function(a, b) {
  if(a ? a.cljs$core$IEncodeClojure$_js__GT_clj$arity$2 : a) {
    return a.cljs$core$IEncodeClojure$_js__GT_clj$arity$2(a, b)
  }
  var c;
  c = cljs.core._js__GT_clj[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._js__GT_clj._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeClojure.-js-\x3eclj", a);
  }
  return c.call(null, a, b)
};
cljs.core.js__GT_clj = function() {
  var a = null, b = function(b) {
    return a.call(null, b, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "keywordize-keys", "keywordize-keys", 4191781672), !1], !0))
  }, c = function() {
    var a = function(a, b) {
      if(a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$IEncodeClojure$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_.call(null, cljs.core.IEncodeClojure, a)) : cljs.core.type_satisfies_.call(null, cljs.core.IEncodeClojure, a)) {
        return cljs.core._js__GT_clj.call(null, a, cljs.core.apply.call(null, cljs.core.array_map, b))
      }
      if(cljs.core.seq.call(null, b)) {
        var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "keywordize-keys", "keywordize-keys", 4191781672)), e = cljs.core.truth_(d) ? cljs.core.keyword : cljs.core.str;
        return function(a, b, c, d) {
          return function q(e) {
            return cljs.core.seq_QMARK_.call(null, e) ? cljs.core.doall.call(null, cljs.core.map.call(null, q, e)) : cljs.core.coll_QMARK_.call(null, e) ? cljs.core.into.call(null, cljs.core.empty.call(null, e), cljs.core.map.call(null, q, e)) : e instanceof Array ? cljs.core.vec.call(null, cljs.core.map.call(null, q, e)) : cljs.core.type.call(null, e) === Object ? cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, function() {
              return function(a, b, c, d) {
                return function T(f) {
                  return new cljs.core.LazySeq(null, function(a, b, c, d) {
                    return function() {
                      for(;;) {
                        var a = cljs.core.seq.call(null, f);
                        if(a) {
                          if(cljs.core.chunked_seq_QMARK_.call(null, a)) {
                            var b = cljs.core.chunk_first.call(null, a), c = cljs.core.count.call(null, b), g = cljs.core.chunk_buffer.call(null, c);
                            a: {
                              for(var h = 0;;) {
                                if(h < c) {
                                  var k = cljs.core._nth.call(null, b, h);
                                  cljs.core.chunk_append.call(null, g, cljs.core.PersistentVector.fromArray([d.call(null, k), q.call(null, e[k])], !0));
                                  h += 1
                                }else {
                                  b = !0;
                                  break a
                                }
                              }
                              b = void 0
                            }
                            return b ? cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), T.call(null, cljs.core.chunk_rest.call(null, a))) : cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), null)
                          }
                          g = cljs.core.first.call(null, a);
                          return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([d.call(null, g), q.call(null, e[g])], !0), T.call(null, cljs.core.rest.call(null, a)))
                        }
                        return null
                      }
                    }
                  }(a, b, c, d), null, null)
                }
              }(a, b, c, d).call(null, cljs.core.js_keys.call(null, e))
            }()) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? e : null
          }
        }(b, c, d, e).call(null, a)
      }
      return null
    }, b = function(b, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, e)
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.memoize = function(a) {
  var b = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY);
  return function() {
    var c = function(c) {
      var d = cljs.core.get.call(null, cljs.core.deref.call(null, b), c);
      if(cljs.core.truth_(d)) {
        return d
      }
      d = cljs.core.apply.call(null, a, c);
      cljs.core.swap_BANG_.call(null, b, cljs.core.assoc, c, d);
      return d
    }, d = function(a) {
      var b = null;
      0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return c.call(this, b)
    };
    d.cljs$lang$maxFixedArity = 0;
    d.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return c(a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = c;
    return d
  }()
};
cljs.core.trampoline = function() {
  var a = null, b = function(a) {
    for(;;) {
      if(a = a.call(null), !cljs.core.fn_QMARK_.call(null, a)) {
        return a
      }
    }
  }, c = function() {
    var b = function(b, c) {
      return a.call(null, function() {
        return cljs.core.apply.call(null, b, c)
      })
    }, c = function(a, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e)
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.rand = function() {
  var a = null, b = function() {
    return a.call(null, 1)
  }, c = function(a) {
    return Math.random.call(null) * a
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.rand_int = function(a) {
  return Math.floor.call(null, Math.random.call(null) * a)
};
cljs.core.rand_nth = function(a) {
  return cljs.core.nth.call(null, a, cljs.core.rand_int.call(null, cljs.core.count.call(null, a)))
};
cljs.core.group_by = function(a, b) {
  return cljs.core.reduce.call(null, function(b, d) {
    var e = a.call(null, d);
    return cljs.core.assoc.call(null, b, e, cljs.core.conj.call(null, cljs.core.get.call(null, b, e, cljs.core.PersistentVector.EMPTY), d))
  }, cljs.core.PersistentArrayMap.EMPTY, b)
};
cljs.core.make_hierarchy = function() {
  return cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "parents", "parents", 4515496059), cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "descendants", "descendants", 768214664), cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442), cljs.core.PersistentArrayMap.EMPTY], !0)
};
cljs.core._global_hierarchy = null;
cljs.core.get_global_hierarchy = function() {
  null == cljs.core._global_hierarchy && (cljs.core._global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null)));
  return cljs.core._global_hierarchy
};
cljs.core.swap_global_hierarchy_BANG_ = function() {
  var a = function(a, b) {
    return cljs.core.apply.call(null, cljs.core.swap_BANG_, cljs.core.get_global_hierarchy.call(null), a, b)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.isa_QMARK_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b, c)
  }, c = function(b, c, f) {
    var g = cljs.core._EQ_.call(null, c, f);
    if(!g && !(g = cljs.core.contains_QMARK_.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442)).call(null, b).call(null, c), f)) && (g = cljs.core.vector_QMARK_.call(null, f)) && (g = cljs.core.vector_QMARK_.call(null, c))) {
      if(g = cljs.core.count.call(null, f) === cljs.core.count.call(null, c)) {
        for(var g = !0, h = 0;;) {
          var k;
          k = (k = cljs.core.not.call(null, g)) ? k : h === cljs.core.count.call(null, f);
          if(k) {
            return g
          }
          g = a.call(null, b, c.call(null, h), f.call(null, h));
          h += 1
        }
      }else {
        return g
      }
    }else {
      return g
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.parents = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b)
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "parents", "parents", 4515496059)).call(null, a), b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.ancestors = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b)
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442)).call(null, a), b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.descendants = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b)
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "descendants", "descendants", 768214664)).call(null, a), b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.derive = function() {
  var a = null, b = function(b, c) {
    if(!cljs.core.truth_(cljs.core.namespace.call(null, c))) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "namespace", "namespace", -388313324, null), new cljs.core.Symbol(null, "parent", "parent", 1659011683, null))))].join(""));
    }
    cljs.core.swap_global_hierarchy_BANG_.call(null, a, b, c);
    return null
  }, c = function(a, b, c) {
    if(!cljs.core.not_EQ_.call(null, b, c)) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "not\x3d", "not\x3d", -1637144189, null), new cljs.core.Symbol(null, "tag", "tag", -1640416941, null), new cljs.core.Symbol(null, "parent", "parent", 1659011683, null))))].join(""));
    }
    var g = (new cljs.core.Keyword(null, "parents", "parents", 4515496059)).call(null, a), h = (new cljs.core.Keyword(null, "descendants", "descendants", 768214664)).call(null, a), k = (new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442)).call(null, a), l = function(a, b, c) {
      return function(d, e, f, g, h) {
        return cljs.core.reduce.call(null, function(a, b, c) {
          return function(a, b) {
            return cljs.core.assoc.call(null, a, b, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.get.call(null, h, b, cljs.core.PersistentHashSet.EMPTY), cljs.core.cons.call(null, g, h.call(null, g))))
          }
        }(a, b, c), d, cljs.core.cons.call(null, e, f.call(null, e)))
      }
    }(g, h, k);
    if(cljs.core.contains_QMARK_.call(null, g.call(null, b), c)) {
      b = null
    }else {
      if(cljs.core.contains_QMARK_.call(null, k.call(null, b), c)) {
        throw Error([cljs.core.str(b), cljs.core.str("already has"), cljs.core.str(c), cljs.core.str("as ancestor")].join(""));
      }
      if(cljs.core.contains_QMARK_.call(null, k.call(null, c), b)) {
        throw Error([cljs.core.str("Cyclic derivation:"), cljs.core.str(c), cljs.core.str("has"), cljs.core.str(b), cljs.core.str("as ancestor")].join(""));
      }
      b = cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "parents", "parents", 4515496059), cljs.core.assoc.call(null, (new cljs.core.Keyword(null, "parents", "parents", 4515496059)).call(null, a), b, cljs.core.conj.call(null, cljs.core.get.call(null, g, b, cljs.core.PersistentHashSet.EMPTY), c)), new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442), l.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442)).call(null, a), b, h, c, k), new cljs.core.Keyword(null, 
      "descendants", "descendants", 768214664), l.call(null, (new cljs.core.Keyword(null, "descendants", "descendants", 768214664)).call(null, a), c, k, b, h)], !0)
    }
    return cljs.core.truth_(b) ? b : a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.underive = function() {
  var a = null, b = function(b, c) {
    cljs.core.swap_global_hierarchy_BANG_.call(null, a, b, c);
    return null
  }, c = function(a, b, c) {
    var g = (new cljs.core.Keyword(null, "parents", "parents", 4515496059)).call(null, a), h = cljs.core.truth_(g.call(null, b)) ? cljs.core.disj.call(null, g.call(null, b), c) : cljs.core.PersistentHashSet.EMPTY, k = cljs.core.truth_(cljs.core.not_empty.call(null, h)) ? cljs.core.assoc.call(null, g, b, h) : cljs.core.dissoc.call(null, g, b), h = cljs.core.flatten.call(null, cljs.core.map.call(null, function(a, b, c) {
      return function(a) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, a), cljs.core.interpose.call(null, cljs.core.first.call(null, a), cljs.core.second.call(null, a)))
      }
    }(g, h, k), cljs.core.seq.call(null, k)));
    return cljs.core.contains_QMARK_.call(null, g.call(null, b), c) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.apply.call(null, cljs.core.derive, a, b)
    }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, h)) : a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.reset_cache = function(a, b, c, d) {
  cljs.core.swap_BANG_.call(null, a, function(a) {
    return cljs.core.deref.call(null, b)
  });
  return cljs.core.swap_BANG_.call(null, c, function(a) {
    return cljs.core.deref.call(null, d)
  })
};
cljs.core.prefers_STAR_ = function prefers_STAR_(b, c, d) {
  var e = cljs.core.deref.call(null, d).call(null, b), e = cljs.core.truth_(cljs.core.truth_(e) ? e.call(null, c) : e) ? !0 : null;
  if(cljs.core.truth_(e)) {
    return e
  }
  e = function() {
    for(var e = cljs.core.parents.call(null, c);;) {
      if(0 < cljs.core.count.call(null, e)) {
        cljs.core.truth_(prefers_STAR_.call(null, b, cljs.core.first.call(null, e), d)), e = cljs.core.rest.call(null, e)
      }else {
        return null
      }
    }
  }();
  if(cljs.core.truth_(e)) {
    return e
  }
  e = function() {
    for(var e = cljs.core.parents.call(null, b);;) {
      if(0 < cljs.core.count.call(null, e)) {
        cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, e), c, d)), e = cljs.core.rest.call(null, e)
      }else {
        return null
      }
    }
  }();
  return cljs.core.truth_(e) ? e : !1
};
cljs.core.dominates = function(a, b, c) {
  c = cljs.core.prefers_STAR_.call(null, a, b, c);
  return cljs.core.truth_(c) ? c : cljs.core.isa_QMARK_.call(null, a, b)
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(b, c, d, e, f, g, h) {
  var k = cljs.core.reduce.call(null, function(e, g) {
    var h = cljs.core.nth.call(null, g, 0, null);
    cljs.core.nth.call(null, g, 1, null);
    if(cljs.core.isa_QMARK_.call(null, cljs.core.deref.call(null, d), c, h)) {
      var k = cljs.core.truth_(function() {
        var b = null == e;
        return b ? b : cljs.core.dominates.call(null, h, cljs.core.first.call(null, e), f)
      }()) ? g : e;
      if(!cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, k), h, f))) {
        throw Error([cljs.core.str("Multiple methods in multimethod '"), cljs.core.str(b), cljs.core.str("' match dispatch value: "), cljs.core.str(c), cljs.core.str(" -\x3e "), cljs.core.str(h), cljs.core.str(" and "), cljs.core.str(cljs.core.first.call(null, k)), cljs.core.str(", and neither is preferred")].join(""));
      }
      return k
    }
    return e
  }, null, cljs.core.deref.call(null, e));
  if(cljs.core.truth_(k)) {
    if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, h), cljs.core.deref.call(null, d))) {
      return cljs.core.swap_BANG_.call(null, g, cljs.core.assoc, c, cljs.core.second.call(null, k)), cljs.core.second.call(null, k)
    }
    cljs.core.reset_cache.call(null, g, e, h, d);
    return find_and_cache_best_method.call(null, b, c, d, e, f, g, h)
  }
  return null
};
cljs.core.IMultiFn = {};
cljs.core._reset = function(a) {
  if(a ? a.cljs$core$IMultiFn$_reset$arity$1 : a) {
    return a.cljs$core$IMultiFn$_reset$arity$1(a)
  }
  var b;
  b = cljs.core._reset[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._reset._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", a);
  }
  return b.call(null, a)
};
cljs.core._add_method = function(a, b, c) {
  if(a ? a.cljs$core$IMultiFn$_add_method$arity$3 : a) {
    return a.cljs$core$IMultiFn$_add_method$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._add_method[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._add_method._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._remove_method = function(a, b) {
  if(a ? a.cljs$core$IMultiFn$_remove_method$arity$2 : a) {
    return a.cljs$core$IMultiFn$_remove_method$arity$2(a, b)
  }
  var c;
  c = cljs.core._remove_method[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._remove_method._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", a);
  }
  return c.call(null, a, b)
};
cljs.core._prefer_method = function(a, b, c) {
  if(a ? a.cljs$core$IMultiFn$_prefer_method$arity$3 : a) {
    return a.cljs$core$IMultiFn$_prefer_method$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._prefer_method[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._prefer_method._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._get_method = function(a, b) {
  if(a ? a.cljs$core$IMultiFn$_get_method$arity$2 : a) {
    return a.cljs$core$IMultiFn$_get_method$arity$2(a, b)
  }
  var c;
  c = cljs.core._get_method[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._get_method._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", a);
  }
  return c.call(null, a, b)
};
cljs.core._methods = function(a) {
  if(a ? a.cljs$core$IMultiFn$_methods$arity$1 : a) {
    return a.cljs$core$IMultiFn$_methods$arity$1(a)
  }
  var b;
  b = cljs.core._methods[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._methods._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", a);
  }
  return b.call(null, a)
};
cljs.core._prefers = function(a) {
  if(a ? a.cljs$core$IMultiFn$_prefers$arity$1 : a) {
    return a.cljs$core$IMultiFn$_prefers$arity$1(a)
  }
  var b;
  b = cljs.core._prefers[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._prefers._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", a);
  }
  return b.call(null, a)
};
cljs.core._dispatch = function(a, b) {
  if(a ? a.cljs$core$IMultiFn$_dispatch$arity$2 : a) {
    return a.cljs$core$IMultiFn$_dispatch$arity$2(a, b)
  }
  var c;
  c = cljs.core._dispatch[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._dispatch._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", a);
  }
  return c.call(null, a, b)
};
cljs.core.do_dispatch = function(a, b, c) {
  b = cljs.core.apply.call(null, b, c);
  a = cljs.core._get_method.call(null, a, b);
  if(!cljs.core.truth_(a)) {
    throw Error([cljs.core.str("No method in multimethod '"), cljs.core.str(cljs.core.name), cljs.core.str("' for dispatch value: "), cljs.core.str(b)].join(""));
  }
  return cljs.core.apply.call(null, a, c)
};
cljs.core.MultiFn = function(a, b, c, d, e, f, g, h) {
  this.name = a;
  this.dispatch_fn = b;
  this.default_dispatch_val = c;
  this.hierarchy = d;
  this.method_table = e;
  this.prefer_table = f;
  this.method_cache = g;
  this.cached_hierarchy = h;
  this.cljs$lang$protocol_mask$partition0$ = 4194304;
  this.cljs$lang$protocol_mask$partition1$ = 256
};
cljs.core.MultiFn.cljs$lang$type = !0;
cljs.core.MultiFn.cljs$lang$ctorStr = "cljs.core/MultiFn";
cljs.core.MultiFn.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/MultiFn")
};
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid(a)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(a) {
  cljs.core.swap_BANG_.call(null, this.method_table, function(a) {
    return cljs.core.PersistentArrayMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this.method_cache, function(a) {
    return cljs.core.PersistentArrayMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this.prefer_table, function(a) {
    return cljs.core.PersistentArrayMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this.cached_hierarchy, function(a) {
    return null
  });
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(a, b, c) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.assoc, b, c);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(a, b) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.dissoc, b);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(a, b) {
  cljs.core._EQ_.call(null, cljs.core.deref.call(null, this.cached_hierarchy), cljs.core.deref.call(null, this.hierarchy)) || cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  var c = cljs.core.deref.call(null, this.method_cache).call(null, b);
  if(cljs.core.truth_(c)) {
    return c
  }
  c = cljs.core.find_and_cache_best_method.call(null, this.name, b, this.hierarchy, this.method_table, this.prefer_table, this.method_cache, this.cached_hierarchy);
  return cljs.core.truth_(c) ? c : cljs.core.deref.call(null, this.method_table).call(null, this.default_dispatch_val)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null, b, c, this.prefer_table))) {
    throw Error([cljs.core.str("Preference conflict in multimethod '"), cljs.core.str(this.name), cljs.core.str("': "), cljs.core.str(c), cljs.core.str(" is already preferred to "), cljs.core.str(b)].join(""));
  }
  cljs.core.swap_BANG_.call(null, this.prefer_table, function(a) {
    return cljs.core.assoc.call(null, a, b, cljs.core.conj.call(null, cljs.core.get.call(null, a, b, cljs.core.PersistentHashSet.EMPTY), c))
  });
  return cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function(a) {
  return cljs.core.deref.call(null, this.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function(a) {
  return cljs.core.deref.call(null, this.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch$arity$2 = function(a, b) {
  return cljs.core.do_dispatch.call(null, a, this.dispatch_fn, b)
};
cljs.core.__GT_MultiFn = function(a, b, c, d, e, f, g, h) {
  return new cljs.core.MultiFn(a, b, c, d, e, f, g, h)
};
cljs.core.MultiFn.prototype.call = function() {
  var a = function(a, b) {
    return cljs.core._dispatch.call(null, this, b)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.MultiFn.prototype.apply = function(a, b) {
  return cljs.core._dispatch.call(null, this, b)
};
cljs.core.remove_all_methods = function(a) {
  return cljs.core._reset.call(null, a)
};
cljs.core.remove_method = function(a, b) {
  return cljs.core._remove_method.call(null, a, b)
};
cljs.core.prefer_method = function(a, b, c) {
  return cljs.core._prefer_method.call(null, a, b, c)
};
cljs.core.methods$ = function(a) {
  return cljs.core._methods.call(null, a)
};
cljs.core.get_method = function(a, b) {
  return cljs.core._get_method.call(null, a, b)
};
cljs.core.prefers = function(a) {
  return cljs.core._prefers.call(null, a)
};
cljs.core.UUID = function(a) {
  this.uuid = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2153775104
};
cljs.core.UUID.cljs$lang$type = !0;
cljs.core.UUID.cljs$lang$ctorStr = "cljs.core/UUID";
cljs.core.UUID.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/UUID")
};
cljs.core.UUID.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.string.hashCode(cljs.core.pr_str.call(null, a))
};
cljs.core.UUID.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, [cljs.core.str('#uuid "'), cljs.core.str(this.uuid), cljs.core.str('"')].join(""))
};
cljs.core.UUID.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = b instanceof cljs.core.UUID;
  return c ? this.uuid === b.uuid : c
};
cljs.core.__GT_UUID = function(a) {
  return new cljs.core.UUID(a)
};
cljs.core.ExceptionInfo = function(a, b, c) {
  this.message = a;
  this.data = b;
  this.cause = c
};
cljs.core.ExceptionInfo.cljs$lang$type = !0;
cljs.core.ExceptionInfo.cljs$lang$ctorStr = "cljs.core/ExceptionInfo";
cljs.core.ExceptionInfo.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ExceptionInfo")
};
cljs.core.__GT_ExceptionInfo = function(a, b, c) {
  return new cljs.core.ExceptionInfo(a, b, c)
};
cljs.core.ExceptionInfo.prototype = Error();
cljs.core.ExceptionInfo.prototype.constructor = cljs.core.ExceptionInfo;
cljs.core.ex_info = function() {
  var a = null, b = function(a, b) {
    return new cljs.core.ExceptionInfo(a, b, null)
  }, c = function(a, b, c) {
    return new cljs.core.ExceptionInfo(a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.ex_data = function(a) {
  return a instanceof cljs.core.ExceptionInfo ? a.data : null
};
cljs.core.ex_message = function(a) {
  return a instanceof Error ? a.message : null
};
cljs.core.ex_cause = function(a) {
  return a instanceof cljs.core.ExceptionInfo ? a.cause : null
};
cljs.core.comparator = function(a) {
  return function(b, c) {
    return cljs.core.truth_(a.call(null, b, c)) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? 0 : null
  }
};
cljs.core.special_symbol_QMARK_ = function(a) {
  return cljs.core.contains_QMARK_.call(null, cljs.core.PersistentHashSet.fromArray([new cljs.core.Symbol(null, "deftype*", "deftype*", -978581244, null), null, new cljs.core.Symbol(null, "new", "new", -1640422567, null), null, new cljs.core.Symbol(null, "try*", "try*", -1636962424, null), null, new cljs.core.Symbol(null, "quote", "quote", -1532577739, null), null, new cljs.core.Symbol(null, "\x26", "\x26", -1640531489, null), null, new cljs.core.Symbol(null, "set!", "set!", -1637004872, null), null, 
  new cljs.core.Symbol(null, "recur", "recur", -1532142362, null), null, new cljs.core.Symbol(null, ".", ".", -1640531481, null), null, new cljs.core.Symbol(null, "ns", "ns", -1640528002, null), null, new cljs.core.Symbol(null, "do", "do", -1640528316, null), null, new cljs.core.Symbol(null, "fn*", "fn*", -1640430053, null), null, new cljs.core.Symbol(null, "throw", "throw", -1530191713, null), null, new cljs.core.Symbol(null, "letfn*", "letfn*", 1548249632, null), null, new cljs.core.Symbol(null, 
  "js*", "js*", -1640426054, null), null, new cljs.core.Symbol(null, "defrecord*", "defrecord*", 774272013, null), null, new cljs.core.Symbol(null, "let*", "let*", -1637213400, null), null, new cljs.core.Symbol(null, "loop*", "loop*", -1537374273, null), null, new cljs.core.Symbol(null, "if", "if", -1640528170, null), null, new cljs.core.Symbol(null, "def", "def", -1640432194, null), null], !0), a)
};
var clojure = {string:{}};
clojure.string.seq_reverse = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a)
};
clojure.string.reverse = function(a) {
  return a.split("").reverse().join("")
};
clojure.string.replace = function(a, b, c) {
  if("string" === typeof b) {
    return a.replace(RegExp(goog.string.regExpEscape(b), "g"), c)
  }
  if(cljs.core.truth_(b.hasOwnProperty("source"))) {
    return a.replace(RegExp(b.source, "g"), c)
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw[cljs.core.str("Invalid match arg: "), cljs.core.str(b)].join("");
  }
  return null
};
clojure.string.replace_first = function(a, b, c) {
  return a.replace(b, c)
};
clojure.string.join = function() {
  var a = null, b = function(a) {
    return cljs.core.apply.call(null, cljs.core.str, a)
  }, c = function(a, b) {
    return cljs.core.apply.call(null, cljs.core.str, cljs.core.interpose.call(null, a, b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
clojure.string.upper_case = function(a) {
  return a.toUpperCase()
};
clojure.string.lower_case = function(a) {
  return a.toLowerCase()
};
clojure.string.capitalize = function(a) {
  return 2 > cljs.core.count.call(null, a) ? clojure.string.upper_case.call(null, a) : [cljs.core.str(clojure.string.upper_case.call(null, cljs.core.subs.call(null, a, 0, 1))), cljs.core.str(clojure.string.lower_case.call(null, cljs.core.subs.call(null, a, 1)))].join("")
};
clojure.string.pop_last_while_empty = function(a) {
  for(;;) {
    if(cljs.core._EQ_.call(null, "", cljs.core.peek.call(null, a))) {
      a = cljs.core.pop.call(null, a)
    }else {
      return a
    }
  }
};
clojure.string.discard_trailing_if_needed = function(a, b) {
  return cljs.core._EQ_.call(null, 0, a) ? clojure.string.pop_last_while_empty.call(null, b) : b
};
clojure.string.split_with_empty_regex = function(a, b) {
  var c;
  c = (c = 0 >= b) ? c : b >= 2 + cljs.core.count.call(null, a);
  if(c) {
    return cljs.core.conj.call(null, cljs.core.vec.call(null, cljs.core.cons.call(null, "", cljs.core.map.call(null, cljs.core.str, cljs.core.seq.call(null, a)))), "")
  }
  c = cljs.core._EQ_;
  if(c.call(null, 1, b)) {
    return cljs.core.vector.call(null, a)
  }
  if(c.call(null, 2, b)) {
    return cljs.core.vector.call(null, "", a)
  }
  c = b - 2;
  return cljs.core.conj.call(null, cljs.core.vec.call(null, cljs.core.cons.call(null, "", cljs.core.subvec.call(null, cljs.core.vec.call(null, cljs.core.map.call(null, cljs.core.str, cljs.core.seq.call(null, a))), 0, c))), cljs.core.subs.call(null, a, c))
};
clojure.string.split = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, 0)
  }, c = function(a, b, c) {
    return clojure.string.discard_trailing_if_needed.call(null, c, cljs.core._EQ_.call(null, "" + cljs.core.str(b), "/(?:)/") ? clojure.string.split_with_empty_regex.call(null, a, c) : 1 > c ? cljs.core.vec.call(null, ("" + cljs.core.str(a)).split(b)) : function() {
      for(var g = a, h = c, k = cljs.core.PersistentVector.EMPTY;;) {
        if(cljs.core._EQ_.call(null, h, 1)) {
          return cljs.core.conj.call(null, k, g)
        }
        var l = cljs.core.re_find.call(null, b, g);
        if(cljs.core.truth_(l)) {
          var m = l, l = g.indexOf(m), m = g.substring(l + cljs.core.count.call(null, m)), h = h - 1, k = cljs.core.conj.call(null, k, g.substring(0, l)), g = m
        }else {
          return cljs.core.conj.call(null, k, g)
        }
      }
    }())
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
clojure.string.split_lines = function(a) {
  return clojure.string.split.call(null, a, /\n|\r\n/)
};
clojure.string.trim = function(a) {
  return goog.string.trim(a)
};
clojure.string.triml = function(a) {
  return goog.string.trimLeft(a)
};
clojure.string.trimr = function(a) {
  return goog.string.trimRight(a)
};
clojure.string.trim_newline = function(a) {
  for(var b = a.length;;) {
    if(0 === b) {
      return""
    }
    var c = cljs.core.get.call(null, a, b - 1);
    var d = cljs.core._EQ_.call(null, c, "\n"), c = d ? d : cljs.core._EQ_.call(null, c, "\r");
    if(c) {
      b -= 1
    }else {
      return a.substring(0, b)
    }
  }
};
clojure.string.blank_QMARK_ = function(a) {
  return goog.string.isEmptySafe(a)
};
clojure.string.escape = function(a, b) {
  for(var c = new goog.string.StringBuffer, d = a.length, e = 0;;) {
    if(cljs.core._EQ_.call(null, d, e)) {
      return c.toString()
    }
    var f = a.charAt(e), g = cljs.core.get.call(null, b, f);
    cljs.core.truth_(g) ? c.append("" + cljs.core.str(g)) : c.append(f);
    e += 1
  }
};
cljs.core.async = {};
cljs.core.async.impl = {};
cljs.core.async.impl.protocols = {};
cljs.core.async.impl.protocols.MAX_QUEUE_SIZE = 1024;
cljs.core.async.impl.protocols.ReadPort = {};
cljs.core.async.impl.protocols.take_BANG_ = function(a, b) {
  if(a ? a.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 : a) {
    return a.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2(a, b)
  }
  var c;
  c = cljs.core.async.impl.protocols.take_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core.async.impl.protocols.take_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ReadPort.take!", a);
  }
  return c.call(null, a, b)
};
cljs.core.async.impl.protocols.WritePort = {};
cljs.core.async.impl.protocols.put_BANG_ = function(a, b, c) {
  if(a ? a.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 : a) {
    return a.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3(a, b, c)
  }
  var d;
  d = cljs.core.async.impl.protocols.put_BANG_[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core.async.impl.protocols.put_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "WritePort.put!", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.async.impl.protocols.Channel = {};
cljs.core.async.impl.protocols.close_BANG_ = function(a) {
  if(a ? a.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 : a) {
    return a.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.protocols.close_BANG_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.protocols.close_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "Channel.close!", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.protocols.Handler = {};
cljs.core.async.impl.protocols.active_QMARK_ = function(a) {
  if(a ? a.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 : a) {
    return a.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.protocols.active_QMARK_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.protocols.active_QMARK_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "Handler.active?", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.protocols.commit = function(a) {
  if(a ? a.cljs$core$async$impl$protocols$Handler$commit$arity$1 : a) {
    return a.cljs$core$async$impl$protocols$Handler$commit$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.protocols.commit[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.protocols.commit._, !b)) {
    throw cljs.core.missing_protocol.call(null, "Handler.commit", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.protocols.Buffer = {};
cljs.core.async.impl.protocols.full_QMARK_ = function(a) {
  if(a ? a.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1 : a) {
    return a.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.protocols.full_QMARK_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.protocols.full_QMARK_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "Buffer.full?", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.protocols.remove_BANG_ = function(a) {
  if(a ? a.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1 : a) {
    return a.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.protocols.remove_BANG_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.protocols.remove_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "Buffer.remove!", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.protocols.add_BANG_ = function(a, b) {
  if(a ? a.cljs$core$async$impl$protocols$Buffer$add_BANG_$arity$2 : a) {
    return a.cljs$core$async$impl$protocols$Buffer$add_BANG_$arity$2(a, b)
  }
  var c;
  c = cljs.core.async.impl.protocols.add_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core.async.impl.protocols.add_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "Buffer.add!", a);
  }
  return c.call(null, a, b)
};
cljs.core.async.impl.ioc_helpers = {};
cljs.core.async.impl.ioc_helpers.FN_IDX = 0;
cljs.core.async.impl.ioc_helpers.STATE_IDX = 1;
cljs.core.async.impl.ioc_helpers.VALUE_IDX = 2;
cljs.core.async.impl.ioc_helpers.BINDINGS_IDX = 3;
cljs.core.async.impl.ioc_helpers.USER_START_IDX = 4;
cljs.core.async.impl.ioc_helpers.aset_object = function(a, b, c) {
  return a[b][c]
};
cljs.core.async.impl.ioc_helpers.aget_object = function(a, b) {
  return a[b]
};
cljs.core.async.impl.ioc_helpers.finished_QMARK_ = function(a) {
  return cljs.core.keyword_identical_QMARK_.call(null, a[cljs.core.async.impl.ioc_helpers.STATE_IDX], new cljs.core.Keyword(null, "finished", "finished", 4635210724))
};
cljs.core.async.impl.ioc_helpers.fn_handler = function fn_handler(b) {
  "undefined" === typeof cljs.core.async.impl.ioc_helpers.t11402 && (cljs.core.async.impl.ioc_helpers.t11402 = {}, cljs.core.async.impl.ioc_helpers.t11402 = function(b, d, e) {
    this.f = b;
    this.fn_handler = d;
    this.meta11403 = e;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.impl.ioc_helpers.t11402.cljs$lang$type = !0, cljs.core.async.impl.ioc_helpers.t11402.cljs$lang$ctorStr = "cljs.core.async.impl.ioc-helpers/t11402", cljs.core.async.impl.ioc_helpers.t11402.cljs$lang$ctorPrWriter = function(b, d, e) {
    return cljs.core._write.call(null, d, "cljs.core.async.impl.ioc-helpers/t11402")
  }, cljs.core.async.impl.ioc_helpers.t11402.prototype.cljs$core$async$impl$protocols$Handler$ = !0, cljs.core.async.impl.ioc_helpers.t11402.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = function(b) {
    return!0
  }, cljs.core.async.impl.ioc_helpers.t11402.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = function(b) {
    return this.f
  }, cljs.core.async.impl.ioc_helpers.t11402.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta11403
  }, cljs.core.async.impl.ioc_helpers.t11402.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, d) {
    return new cljs.core.async.impl.ioc_helpers.t11402(this.f, this.fn_handler, d)
  }, cljs.core.async.impl.ioc_helpers.__GT_t11402 = function(b, d, e) {
    return new cljs.core.async.impl.ioc_helpers.t11402(b, d, e)
  });
  return new cljs.core.async.impl.ioc_helpers.t11402(b, fn_handler, null)
};
cljs.core.async.impl.ioc_helpers.run_state_machine = function(a) {
  return cljs.core.async.impl.ioc_helpers.aget_object.call(null, a, cljs.core.async.impl.ioc_helpers.FN_IDX).call(null, a)
};
cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped = function(a) {
  try {
    return cljs.core.async.impl.ioc_helpers.run_state_machine.call(null, a)
  }catch(b) {
    if(b instanceof Object) {
      throw cljs.core.async.impl.protocols.close_BANG_.call(null, cljs.core.async.impl.ioc_helpers.aget_object.call(null, a, cljs.core.async.impl.ioc_helpers.USER_START_IDX)), b;
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      throw b;
    }
    return null
  }
};
cljs.core.async.impl.ioc_helpers.take_BANG_ = function(a, b, c) {
  c = cljs.core.async.impl.protocols.take_BANG_.call(null, c, cljs.core.async.impl.ioc_helpers.fn_handler.call(null, function(c) {
    a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = c;
    a[cljs.core.async.impl.ioc_helpers.STATE_IDX] = b;
    return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, a)
  }));
  return cljs.core.truth_(c) ? (a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = cljs.core.deref.call(null, c), a[cljs.core.async.impl.ioc_helpers.STATE_IDX] = b, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
};
cljs.core.async.impl.ioc_helpers.put_BANG_ = function(a, b, c, d) {
  c = cljs.core.async.impl.protocols.put_BANG_.call(null, c, d, cljs.core.async.impl.ioc_helpers.fn_handler.call(null, function() {
    a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = null;
    a[cljs.core.async.impl.ioc_helpers.STATE_IDX] = b;
    return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, a)
  }));
  return cljs.core.truth_(c) ? (a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = cljs.core.deref.call(null, c), a[cljs.core.async.impl.ioc_helpers.STATE_IDX] = b, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
};
cljs.core.async.impl.ioc_helpers.ioc_alts_BANG_ = function() {
  var a = function(a, b, e, f) {
    f = cljs.core.seq_QMARK_.call(null, f) ? cljs.core.apply.call(null, cljs.core.hash_map, f) : f;
    a[cljs.core.async.impl.ioc_helpers.STATE_IDX] = b;
    b = cljs.core.async.do_alts.call(null, function(b) {
      a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = b;
      return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, a)
    }, e, f);
    return cljs.core.truth_(b) ? (a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = cljs.core.deref.call(null, b), new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
  }, b = function(b, d, e, f) {
    var g = null;
    3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return a.call(this, b, d, e, g)
  };
  b.cljs$lang$maxFixedArity = 3;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.next(b);
    var f = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, f, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.async.impl.ioc_helpers.return_chan = function(a, b) {
  var c = a[cljs.core.async.impl.ioc_helpers.USER_START_IDX];
  null != b && cljs.core.async.impl.protocols.put_BANG_.call(null, c, b, cljs.core.async.impl.ioc_helpers.fn_handler.call(null, function() {
    return null
  }));
  cljs.core.async.impl.protocols.close_BANG_.call(null, c);
  return c
};
cljs.core.async.impl.buffers = {};
cljs.core.async.impl.buffers.acopy = function(a, b, c, d, e) {
  for(var f = 0;;) {
    if(f < e) {
      c[d + f] = a[b + f], f += 1
    }else {
      return null
    }
  }
};
cljs.core.async.impl.buffers.RingBuffer = function(a, b, c, d) {
  this.head = a;
  this.tail = b;
  this.length = c;
  this.arr = d
};
cljs.core.async.impl.buffers.RingBuffer.cljs$lang$type = !0;
cljs.core.async.impl.buffers.RingBuffer.cljs$lang$ctorStr = "cljs.core.async.impl.buffers/RingBuffer";
cljs.core.async.impl.buffers.RingBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core.async.impl.buffers/RingBuffer")
};
cljs.core.async.impl.buffers.RingBuffer.prototype.pop = function() {
  if(0 === this.length) {
    return null
  }
  var a = this.arr[this.tail];
  this.arr[this.tail] = null;
  this.tail = (this.tail + 1) % this.arr.length;
  this.length -= 1;
  return a
};
cljs.core.async.impl.buffers.RingBuffer.prototype.unshift = function(a) {
  this.arr[this.head] = a;
  this.head = (this.head + 1) % this.arr.length;
  this.length += 1;
  return null
};
cljs.core.async.impl.buffers.RingBuffer.prototype.unbounded_unshift = function(a) {
  this.length + 1 === this.arr.length && this.resize();
  return this.unshift(a)
};
cljs.core.async.impl.buffers.RingBuffer.prototype.resize = function() {
  var a = Array(2 * this.arr.length);
  return this.tail < this.head ? (cljs.core.async.impl.buffers.acopy.call(null, this.arr, this.tail, a, 0, this.length), this.tail = 0, this.head = this.length, this.arr = a) : this.tail > this.head ? (cljs.core.async.impl.buffers.acopy.call(null, this.arr, this.tail, a, 0, this.arr.length - this.tail), cljs.core.async.impl.buffers.acopy.call(null, this.arr, 0, a, this.arr.length - this.tail, this.head), this.tail = 0, this.head = this.length, this.arr = a) : this.tail === this.head ? (this.head = 
  this.tail = 0, this.arr = a) : null
};
cljs.core.async.impl.buffers.RingBuffer.prototype.cleanup = function(a) {
  for(var b = this.length, c = 0;;) {
    if(c < b) {
      var d = this.pop();
      a.call(null, d) && this.unshift(d);
      c += 1
    }else {
      return null
    }
  }
};
cljs.core.async.impl.buffers.__GT_RingBuffer = function(a, b, c, d) {
  return new cljs.core.async.impl.buffers.RingBuffer(a, b, c, d)
};
cljs.core.async.impl.buffers.ring_buffer = function(a) {
  if(!(0 < a)) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("Can't create a ring buffer of size 0"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "\x3e", "\x3e", -1640531465, null), new cljs.core.Symbol(null, "n", "n", -1640531417, null), 0)))].join(""));
  }
  return new cljs.core.async.impl.buffers.RingBuffer(0, 0, 0, Array(a))
};
cljs.core.async.impl.buffers.FixedBuffer = function(a, b) {
  this.buf = a;
  this.n = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2
};
cljs.core.async.impl.buffers.FixedBuffer.cljs$lang$type = !0;
cljs.core.async.impl.buffers.FixedBuffer.cljs$lang$ctorStr = "cljs.core.async.impl.buffers/FixedBuffer";
cljs.core.async.impl.buffers.FixedBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core.async.impl.buffers/FixedBuffer")
};
cljs.core.async.impl.buffers.FixedBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.buf.length
};
cljs.core.async.impl.buffers.FixedBuffer.prototype.cljs$core$async$impl$protocols$Buffer$ = !0;
cljs.core.async.impl.buffers.FixedBuffer.prototype.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1 = function(a) {
  return this.buf.length === this.n
};
cljs.core.async.impl.buffers.FixedBuffer.prototype.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1 = function(a) {
  return this.buf.pop()
};
cljs.core.async.impl.buffers.FixedBuffer.prototype.cljs$core$async$impl$protocols$Buffer$add_BANG_$arity$2 = function(a, b) {
  if(!cljs.core.not.call(null, a.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1(a))) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("Can't add to a full buffer"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("impl", "full?", "impl/full?", -1337857039, null), new cljs.core.Symbol(null, "this", "this", -1636972457, null)))))].join(""));
  }
  return this.buf.unshift(b)
};
cljs.core.async.impl.buffers.__GT_FixedBuffer = function(a, b) {
  return new cljs.core.async.impl.buffers.FixedBuffer(a, b)
};
cljs.core.async.impl.buffers.fixed_buffer = function(a) {
  return new cljs.core.async.impl.buffers.FixedBuffer(cljs.core.async.impl.buffers.ring_buffer.call(null, a), a)
};
cljs.core.async.impl.buffers.DroppingBuffer = function(a, b) {
  this.buf = a;
  this.n = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2
};
cljs.core.async.impl.buffers.DroppingBuffer.cljs$lang$type = !0;
cljs.core.async.impl.buffers.DroppingBuffer.cljs$lang$ctorStr = "cljs.core.async.impl.buffers/DroppingBuffer";
cljs.core.async.impl.buffers.DroppingBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core.async.impl.buffers/DroppingBuffer")
};
cljs.core.async.impl.buffers.DroppingBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.buf.length
};
cljs.core.async.impl.buffers.DroppingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$ = !0;
cljs.core.async.impl.buffers.DroppingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1 = function(a) {
  return!1
};
cljs.core.async.impl.buffers.DroppingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1 = function(a) {
  return this.buf.pop()
};
cljs.core.async.impl.buffers.DroppingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$add_BANG_$arity$2 = function(a, b) {
  return this.buf.length === this.n ? null : this.buf.unshift(b)
};
cljs.core.async.impl.buffers.__GT_DroppingBuffer = function(a, b) {
  return new cljs.core.async.impl.buffers.DroppingBuffer(a, b)
};
cljs.core.async.impl.buffers.dropping_buffer = function(a) {
  return new cljs.core.async.impl.buffers.DroppingBuffer(cljs.core.async.impl.buffers.ring_buffer.call(null, a), a)
};
cljs.core.async.impl.buffers.SlidingBuffer = function(a, b) {
  this.buf = a;
  this.n = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2
};
cljs.core.async.impl.buffers.SlidingBuffer.cljs$lang$type = !0;
cljs.core.async.impl.buffers.SlidingBuffer.cljs$lang$ctorStr = "cljs.core.async.impl.buffers/SlidingBuffer";
cljs.core.async.impl.buffers.SlidingBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core.async.impl.buffers/SlidingBuffer")
};
cljs.core.async.impl.buffers.SlidingBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.buf.length
};
cljs.core.async.impl.buffers.SlidingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$ = !0;
cljs.core.async.impl.buffers.SlidingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1 = function(a) {
  return!1
};
cljs.core.async.impl.buffers.SlidingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1 = function(a) {
  return this.buf.pop()
};
cljs.core.async.impl.buffers.SlidingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$add_BANG_$arity$2 = function(a, b) {
  this.buf.length === this.n && a.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1(a);
  return this.buf.unshift(b)
};
cljs.core.async.impl.buffers.__GT_SlidingBuffer = function(a, b) {
  return new cljs.core.async.impl.buffers.SlidingBuffer(a, b)
};
cljs.core.async.impl.buffers.sliding_buffer = function(a) {
  return new cljs.core.async.impl.buffers.SlidingBuffer(cljs.core.async.impl.buffers.ring_buffer.call(null, a), a)
};
cljs.core.async.impl.dispatch = {};
cljs.core.async.impl.dispatch.message_channel = null;
cljs.core.async.impl.dispatch.tasks = cljs.core.async.impl.buffers.ring_buffer.call(null, 32);
cljs.core.async.impl.dispatch.running_QMARK_ = !1;
cljs.core.async.impl.dispatch.queued_QMARK_ = !1;
cljs.core.async.impl.dispatch.TASK_BATCH_SIZE = 1024;
cljs.core.async.impl.dispatch.process_messages = function() {
  cljs.core.async.impl.dispatch.running_QMARK_ = !0;
  cljs.core.async.impl.dispatch.queued_QMARK_ = !1;
  for(var a = 0;;) {
    var b = cljs.core.async.impl.dispatch.tasks.pop();
    if(null != b && (b.call(null), a < cljs.core.async.impl.dispatch.TASK_BATCH_SIZE)) {
      a += 1;
      continue
    }
    break
  }
  cljs.core.async.impl.dispatch.running_QMARK_ = !1;
  return 0 < cljs.core.async.impl.dispatch.tasks.length ? cljs.core.async.impl.dispatch.queue_dispatcher.call(null) : null
};
"undefined" !== typeof MessageChannel && (cljs.core.async.impl.dispatch.message_channel = new MessageChannel, cljs.core.async.impl.dispatch.message_channel.port1.onmessage = function(a) {
  return cljs.core.async.impl.dispatch.process_messages.call(null)
});
cljs.core.async.impl.dispatch.queue_dispatcher = function() {
  if(cljs.core.truth_(function() {
    var a = cljs.core.async.impl.dispatch.queued_QMARK_;
    return cljs.core.truth_(a) ? cljs.core.async.impl.dispatch.running_QMARK_ : a
  }())) {
    return null
  }
  cljs.core.async.impl.dispatch.queued_QMARK_ = !0;
  return"undefined" !== typeof MessageChannel ? cljs.core.async.impl.dispatch.message_channel.port2.postMessage(0) : "undefined" !== typeof setImmediate ? setImmediate(cljs.core.async.impl.dispatch.process_messages) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? setTimeout(cljs.core.async.impl.dispatch.process_messages, 0) : null
};
cljs.core.async.impl.dispatch.run = function(a) {
  cljs.core.async.impl.dispatch.tasks.unbounded_unshift(a);
  return cljs.core.async.impl.dispatch.queue_dispatcher.call(null)
};
cljs.core.async.impl.dispatch.queue_delay = function(a, b) {
  return setTimeout(a, b)
};
cljs.core.async.impl.channels = {};
cljs.core.async.impl.channels.box = function box(b) {
  "undefined" === typeof cljs.core.async.impl.channels.t11391 && (cljs.core.async.impl.channels.t11391 = {}, cljs.core.async.impl.channels.t11391 = function(b, d, e) {
    this.val = b;
    this.box = d;
    this.meta11392 = e;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 425984
  }, cljs.core.async.impl.channels.t11391.cljs$lang$type = !0, cljs.core.async.impl.channels.t11391.cljs$lang$ctorStr = "cljs.core.async.impl.channels/t11391", cljs.core.async.impl.channels.t11391.cljs$lang$ctorPrWriter = function(b, d, e) {
    return cljs.core._write.call(null, d, "cljs.core.async.impl.channels/t11391")
  }, cljs.core.async.impl.channels.t11391.prototype.cljs$core$IDeref$_deref$arity$1 = function(b) {
    return this.val
  }, cljs.core.async.impl.channels.t11391.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta11392
  }, cljs.core.async.impl.channels.t11391.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, d) {
    return new cljs.core.async.impl.channels.t11391(this.val, this.box, d)
  }, cljs.core.async.impl.channels.__GT_t11391 = function(b, d, e) {
    return new cljs.core.async.impl.channels.t11391(b, d, e)
  });
  return new cljs.core.async.impl.channels.t11391(b, box, null)
};
cljs.core.async.impl.channels.PutBox = function(a, b) {
  this.handler = a;
  this.val = b
};
cljs.core.async.impl.channels.PutBox.cljs$lang$type = !0;
cljs.core.async.impl.channels.PutBox.cljs$lang$ctorStr = "cljs.core.async.impl.channels/PutBox";
cljs.core.async.impl.channels.PutBox.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core.async.impl.channels/PutBox")
};
cljs.core.async.impl.channels.__GT_PutBox = function(a, b) {
  return new cljs.core.async.impl.channels.PutBox(a, b)
};
cljs.core.async.impl.channels.put_active_QMARK_ = function(a) {
  return cljs.core.async.impl.protocols.active_QMARK_.call(null, a.handler)
};
cljs.core.async.impl.channels.MAX_DIRTY = 64;
cljs.core.async.impl.channels.ManyToManyChannel = function(a, b, c, d, e, f) {
  this.takes = a;
  this.dirty_takes = b;
  this.puts = c;
  this.dirty_puts = d;
  this.buf = e;
  this.closed = f
};
cljs.core.async.impl.channels.ManyToManyChannel.cljs$lang$type = !0;
cljs.core.async.impl.channels.ManyToManyChannel.cljs$lang$ctorStr = "cljs.core.async.impl.channels/ManyToManyChannel";
cljs.core.async.impl.channels.ManyToManyChannel.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core.async.impl.channels/ManyToManyChannel")
};
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$Channel$ = !0;
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = function(a) {
  if(!this.closed) {
    for(this.closed = !0;;) {
      if(a = this.takes.pop(), null != a) {
        if(cljs.core.async.impl.protocols.active_QMARK_.call(null, a)) {
          var b = cljs.core.async.impl.protocols.commit.call(null, a);
          cljs.core.async.impl.dispatch.run.call(null, function(a, b) {
            return function() {
              return a.call(null, null)
            }
          }(b, a))
        }
      }else {
        break
      }
    }
  }
  return null
};
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$ReadPort$ = !0;
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = function(a, b) {
  if(cljs.core.async.impl.protocols.active_QMARK_.call(null, b)) {
    var c;
    c = (c = null != this.buf) ? 0 < cljs.core.count.call(null, this.buf) : c;
    if(c) {
      return cljs.core.async.impl.protocols.commit.call(null, b), cljs.core.async.impl.channels.box.call(null, cljs.core.async.impl.protocols.remove_BANG_.call(null, this.buf))
    }
    for(;;) {
      var d = this.puts.pop();
      if(null != d) {
        if(c = d.handler, d = d.val, cljs.core.async.impl.protocols.active_QMARK_.call(null, c)) {
          return c = cljs.core.async.impl.protocols.commit.call(null, c), cljs.core.async.impl.protocols.commit.call(null, b), cljs.core.async.impl.dispatch.run.call(null, c), cljs.core.async.impl.channels.box.call(null, d)
        }
      }else {
        if(this.closed) {
          return cljs.core.async.impl.protocols.commit.call(null, b), cljs.core.async.impl.channels.box.call(null, null)
        }
        this.dirty_takes > cljs.core.async.impl.channels.MAX_DIRTY ? (this.dirty_takes = 0, this.takes.cleanup(cljs.core.async.impl.protocols.active_QMARK_)) : this.dirty_takes += 1;
        if(!(this.takes.length < cljs.core.async.impl.protocols.MAX_QUEUE_SIZE)) {
          throw Error([cljs.core.str("Assert failed: "), cljs.core.str([cljs.core.str("No more than "), cljs.core.str(cljs.core.async.impl.protocols.MAX_QUEUE_SIZE), cljs.core.str(" pending takes are allowed on a single channel.")].join("")), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "\x3c", "\x3c", -1640531467, null), cljs.core.list(new cljs.core.Symbol(null, ".-length", ".-length", 1395928862, null), new cljs.core.Symbol(null, "takes", 
          "takes", -1530407291, null)), new cljs.core.Symbol("impl", "MAX-QUEUE-SIZE", "impl/MAX-QUEUE-SIZE", -1989946393, null))))].join(""));
        }
        this.takes.unbounded_unshift(b);
        return null
      }
    }
  }else {
    return null
  }
};
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$WritePort$ = !0;
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = function(a, b, c) {
  var d = this;
  if(null == b) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("Can't put nil in on a channel"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol(null, "nil?", "nil?", -1637150201, null), new cljs.core.Symbol(null, "val", "val", -1640415014, null)))))].join(""));
  }
  if((a = d.closed) ? a : !cljs.core.async.impl.protocols.active_QMARK_.call(null, c)) {
    return cljs.core.async.impl.channels.box.call(null, null)
  }
  for(;;) {
    if(a = d.takes.pop(), null != a) {
      if(cljs.core.async.impl.protocols.active_QMARK_.call(null, a)) {
        var e = cljs.core.async.impl.protocols.commit.call(null, a);
        c = cljs.core.async.impl.protocols.commit.call(null, c);
        cljs.core.async.impl.dispatch.run.call(null, function(a, c, d) {
          return function() {
            return a.call(null, b)
          }
        }(e, c, a));
        return cljs.core.async.impl.channels.box.call(null, null)
      }
    }else {
      if(function() {
        var a = null == d.buf;
        return a ? a : cljs.core.async.impl.protocols.full_QMARK_.call(null, d.buf)
      }()) {
        d.dirty_puts > cljs.core.async.impl.channels.MAX_DIRTY ? (d.dirty_puts = 0, d.puts.cleanup(cljs.core.async.impl.channels.put_active_QMARK_)) : d.dirty_puts += 1;
        if(!(d.puts.length < cljs.core.async.impl.protocols.MAX_QUEUE_SIZE)) {
          throw Error([cljs.core.str("Assert failed: "), cljs.core.str([cljs.core.str("No more than "), cljs.core.str(cljs.core.async.impl.protocols.MAX_QUEUE_SIZE), cljs.core.str(" pending puts are allowed on a single channel."), cljs.core.str(" Consider using a windowed buffer.")].join("")), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "\x3c", "\x3c", -1640531467, null), cljs.core.list(new cljs.core.Symbol(null, ".-length", ".-length", 
          1395928862, null), new cljs.core.Symbol(null, "puts", "puts", -1637078787, null)), new cljs.core.Symbol("impl", "MAX-QUEUE-SIZE", "impl/MAX-QUEUE-SIZE", -1989946393, null))))].join(""));
        }
        d.puts.unbounded_unshift(new cljs.core.async.impl.channels.PutBox(c, b));
        return null
      }
      c = cljs.core.async.impl.protocols.commit.call(null, c);
      cljs.core.async.impl.protocols.add_BANG_.call(null, d.buf, b);
      return cljs.core.async.impl.channels.box.call(null, null)
    }
  }
};
cljs.core.async.impl.channels.__GT_ManyToManyChannel = function(a, b, c, d, e, f) {
  return new cljs.core.async.impl.channels.ManyToManyChannel(a, b, c, d, e, f)
};
cljs.core.async.impl.channels.chan = function(a) {
  return new cljs.core.async.impl.channels.ManyToManyChannel(cljs.core.async.impl.buffers.ring_buffer.call(null, 32), 0, cljs.core.async.impl.buffers.ring_buffer.call(null, 32), 0, a, null)
};
cljs.core.async.impl.timers = {};
cljs.core.async.impl.timers.MAX_LEVEL = 15;
cljs.core.async.impl.timers.P = 0.5;
cljs.core.async.impl.timers.random_level = function() {
  var a = null, b = function() {
    return a.call(null, 0)
  }, c = function(a) {
    for(;;) {
      var b;
      b = (b = Math.random() < cljs.core.async.impl.timers.P) ? a < cljs.core.async.impl.timers.MAX_LEVEL : b;
      if(b) {
        a += 1
      }else {
        return a
      }
    }
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.async.impl.timers.SkipListNode = function(a, b, c) {
  this.key = a;
  this.val = b;
  this.forward = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2155872256
};
cljs.core.async.impl.timers.SkipListNode.cljs$lang$type = !0;
cljs.core.async.impl.timers.SkipListNode.cljs$lang$ctorStr = "cljs.core.async.impl.timers/SkipListNode";
cljs.core.async.impl.timers.SkipListNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core.async.impl.timers/SkipListNode")
};
cljs.core.async.impl.timers.SkipListNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.async.impl.timers.SkipListNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.list.call(null, this.key, this.val)
};
cljs.core.async.impl.timers.__GT_SkipListNode = function(a, b, c) {
  return new cljs.core.async.impl.timers.SkipListNode(a, b, c)
};
cljs.core.async.impl.timers.skip_list_node = function() {
  var a = null, b = function(b) {
    return a.call(null, null, null, b)
  }, c = function(a, b, c) {
    c = Array(c + 1);
    for(var g = 0;;) {
      if(g < c.length) {
        c[g] = null, g += 1
      }else {
        break
      }
    }
    return new cljs.core.async.impl.timers.SkipListNode(a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.impl.timers.least_greater_node = function() {
  var a = null, b = function(b, c, f) {
    return a.call(null, b, c, f, null)
  }, c = function(a, b, c, g) {
    for(;;) {
      if(0 > c) {
        return a
      }
      a: {
        for(;;) {
          var h = a.forward[c];
          if(cljs.core.truth_(h)) {
            if(h.key < b) {
              a = h
            }else {
              break a
            }
          }else {
            break a
          }
        }
        a = void 0
      }
      null != g && (g[c] = a);
      c -= 1
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
cljs.core.async.impl.timers.SkipList = function(a, b) {
  this.header = a;
  this.level = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2155872256
};
cljs.core.async.impl.timers.SkipList.cljs$lang$type = !0;
cljs.core.async.impl.timers.SkipList.cljs$lang$ctorStr = "cljs.core.async.impl.timers/SkipList";
cljs.core.async.impl.timers.SkipList.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core.async.impl.timers/SkipList")
};
cljs.core.async.impl.timers.SkipList.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.async.impl.timers.SkipList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return function c(a) {
    return new cljs.core.LazySeq(null, function() {
      return null == a ? null : cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([a.key, a.val], !0), c.call(null, a.forward[0]))
    }, null, null)
  }.call(null, this.header.forward[0])
};
cljs.core.async.impl.timers.SkipList.prototype.put = function(a, b) {
  var c = Array(cljs.core.async.impl.timers.MAX_LEVEL), d = cljs.core.async.impl.timers.least_greater_node.call(null, this.header, a, this.level, c).forward[0], e;
  e = (e = null != d) ? d.key === a : e;
  if(e) {
    return d.val = b
  }
  d = cljs.core.async.impl.timers.random_level.call(null);
  if(d > this.level) {
    for(e = this.level + 1;;) {
      if(e <= d + 1) {
        c[e] = this.header, e += 1
      }else {
        break
      }
    }
    this.level = d
  }
  for(d = cljs.core.async.impl.timers.skip_list_node.call(null, a, b, Array(d));;) {
    return 0 <= this.level ? (c = c[0].forward, d.forward[0] = c[0], c[0] = d) : null
  }
};
cljs.core.async.impl.timers.SkipList.prototype.remove = function(a) {
  var b = this, c = Array(cljs.core.async.impl.timers.MAX_LEVEL), d = cljs.core.async.impl.timers.least_greater_node.call(null, b.header, a, b.level, c).forward[0];
  if(function() {
    var b = null != d;
    return b ? d.key === a : b
  }()) {
    for(var e = 0;;) {
      if(e <= b.level) {
        var f = c[e].forward;
        f[e] === d && (f[e] = d.forward[e]);
        e += 1
      }else {
        break
      }
    }
    for(;;) {
      if(function() {
        var a = 0 < b.level;
        return a ? null == b.header.forward[b.level] : a
      }()) {
        b.level -= 1
      }else {
        return null
      }
    }
  }else {
    return null
  }
};
cljs.core.async.impl.timers.SkipList.prototype.ceilingEntry = function(a) {
  for(var b = this.header, c = this.level;;) {
    if(0 > c) {
      return b === this.header ? null : b
    }
    var d;
    a: {
      for(d = b;;) {
        if(d = d.forward[c], null == d) {
          d = null;
          break a
        }else {
          if(d.key >= a) {
            break a
          }
        }
      }
      d = void 0
    }
    null != d ? (c -= 1, b = d) : c -= 1
  }
};
cljs.core.async.impl.timers.SkipList.prototype.floorEntry = function(a) {
  for(var b = this.header, c = this.level;;) {
    if(0 > c) {
      return b === this.header ? null : b
    }
    var d;
    a: {
      for(d = b;;) {
        var e = d.forward[c];
        if(null != e) {
          if(e.key > a) {
            break a
          }
          d = e
        }else {
          d = 0 === c ? d : null;
          break a
        }
      }
      d = void 0
    }
    cljs.core.truth_(d) ? (c -= 1, b = d) : c -= 1
  }
};
cljs.core.async.impl.timers.__GT_SkipList = function(a, b) {
  return new cljs.core.async.impl.timers.SkipList(a, b)
};
cljs.core.async.impl.timers.skip_list = function() {
  return new cljs.core.async.impl.timers.SkipList(cljs.core.async.impl.timers.skip_list_node.call(null, 0), 0)
};
cljs.core.async.impl.timers.timeouts_map = cljs.core.async.impl.timers.skip_list.call(null);
cljs.core.async.impl.timers.TIMEOUT_RESOLUTION_MS = 10;
cljs.core.async.impl.timers.timeout = function(a) {
  var b = (new Date).valueOf() + a, c = cljs.core.async.impl.timers.timeouts_map.ceilingEntry(b), c = cljs.core.truth_(cljs.core.truth_(c) ? c.key < b + cljs.core.async.impl.timers.TIMEOUT_RESOLUTION_MS : c) ? c.val : null;
  if(cljs.core.truth_(c)) {
    return c
  }
  var d = cljs.core.async.impl.channels.chan.call(null, null);
  cljs.core.async.impl.timers.timeouts_map.put(b, d);
  cljs.core.async.impl.dispatch.queue_delay.call(null, function() {
    cljs.core.async.impl.timers.timeouts_map.remove(b);
    return cljs.core.async.impl.protocols.close_BANG_.call(null, d)
  }, a);
  return d
};
cljs.core.async.fn_handler = function fn_handler$$0(b) {
  "undefined" === typeof cljs.core.async.t9421 && (cljs.core.async.t9421 = {}, cljs.core.async.t9421 = function(b, d, e) {
    this.f = b;
    this.fn_handler = d;
    this.meta9422 = e;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.t9421.cljs$lang$type = !0, cljs.core.async.t9421.cljs$lang$ctorStr = "cljs.core.async/t9421", cljs.core.async.t9421.cljs$lang$ctorPrWriter = function(b, d, e) {
    return cljs.core._write.call(null, d, "cljs.core.async/t9421")
  }, cljs.core.async.t9421.prototype.cljs$core$async$impl$protocols$Handler$ = !0, cljs.core.async.t9421.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = function(b) {
    return!0
  }, cljs.core.async.t9421.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = function(b) {
    return this.f
  }, cljs.core.async.t9421.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta9422
  }, cljs.core.async.t9421.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, d) {
    return new cljs.core.async.t9421(this.f, this.fn_handler, d)
  }, cljs.core.async.__GT_t9421 = function(b, d, e) {
    return new cljs.core.async.t9421(b, d, e)
  });
  return new cljs.core.async.t9421(b, fn_handler$$0, null)
};
cljs.core.async.buffer = function(a) {
  return cljs.core.async.impl.buffers.fixed_buffer.call(null, a)
};
cljs.core.async.dropping_buffer = function(a) {
  return cljs.core.async.impl.buffers.dropping_buffer.call(null, a)
};
cljs.core.async.sliding_buffer = function(a) {
  return cljs.core.async.impl.buffers.sliding_buffer.call(null, a)
};
cljs.core.async.chan = function() {
  var a = null, b = function() {
    return a.call(null, null)
  }, c = function(a) {
    a = cljs.core._EQ_.call(null, a, 0) ? null : a;
    return cljs.core.async.impl.channels.chan.call(null, "number" === typeof a ? cljs.core.async.buffer.call(null, a) : a)
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.async.timeout = function(a) {
  return cljs.core.async.impl.timers.timeout.call(null, a)
};
cljs.core.async._LT__BANG_ = function(a) {
  throw Error([cljs.core.str("Assert failed: "), cljs.core.str("\x3c! used not in (go ...) block"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, null))].join(""));
};
cljs.core.async.take_BANG_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, !0)
  }, c = function(a, b, c) {
    a = cljs.core.async.impl.protocols.take_BANG_.call(null, a, cljs.core.async.fn_handler.call(null, b));
    if(cljs.core.truth_(a)) {
      var g = cljs.core.deref.call(null, a);
      cljs.core.truth_(c) ? b.call(null, g) : cljs.core.async.impl.dispatch.run.call(null, function() {
        return b.call(null, g)
      })
    }
    return null
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.nop = function() {
  return null
};
cljs.core.async._GT__BANG_ = function(a, b) {
  throw Error([cljs.core.str("Assert failed: "), cljs.core.str("\x3e! used not in (go ...) block"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, null))].join(""));
};
cljs.core.async.put_BANG_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, cljs.core.async.nop)
  }, c = function(b, c, d) {
    return a.call(null, b, c, d, !0)
  }, d = function(a, b, c, d) {
    a = cljs.core.async.impl.protocols.put_BANG_.call(null, a, b, cljs.core.async.fn_handler.call(null, c));
    cljs.core.truth_(cljs.core.truth_(a) ? cljs.core.not_EQ_.call(null, c, cljs.core.async.nop) : a) && (cljs.core.truth_(d) ? c.call(null) : cljs.core.async.impl.dispatch.run.call(null, c));
    return null
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.async.close_BANG_ = function(a) {
  return cljs.core.async.impl.protocols.close_BANG_.call(null, a)
};
cljs.core.async.random_array = function(a) {
  for(var b = Array(a), c = 0;;) {
    if(c < a) {
      b[c] = 0, c += 1
    }else {
      break
    }
  }
  for(c = 1;;) {
    if(cljs.core._EQ_.call(null, c, a)) {
      return b
    }
    var d = cljs.core.rand_int.call(null, c);
    b[c] = b[d];
    b[d] = c;
    c += 1
  }
};
cljs.core.async.alt_flag = function alt_flag() {
  var b = cljs.core.atom.call(null, !0);
  "undefined" === typeof cljs.core.async.t9432 && (cljs.core.async.t9432 = {}, cljs.core.async.t9432 = function(b, d, e) {
    this.flag = b;
    this.alt_flag = d;
    this.meta9433 = e;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.t9432.cljs$lang$type = !0, cljs.core.async.t9432.cljs$lang$ctorStr = "cljs.core.async/t9432", cljs.core.async.t9432.cljs$lang$ctorPrWriter = function(b, d, e) {
    return cljs.core._write.call(null, d, "cljs.core.async/t9432")
  }, cljs.core.async.t9432.prototype.cljs$core$async$impl$protocols$Handler$ = !0, cljs.core.async.t9432.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = function(b) {
    return cljs.core.deref.call(null, this.flag)
  }, cljs.core.async.t9432.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = function(b) {
    cljs.core.reset_BANG_.call(null, this.flag, null);
    return!0
  }, cljs.core.async.t9432.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta9433
  }, cljs.core.async.t9432.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, d) {
    return new cljs.core.async.t9432(this.flag, this.alt_flag, d)
  }, cljs.core.async.__GT_t9432 = function(b, d, e) {
    return new cljs.core.async.t9432(b, d, e)
  });
  return new cljs.core.async.t9432(b, alt_flag, null)
};
cljs.core.async.alt_handler = function alt_handler(b, c) {
  "undefined" === typeof cljs.core.async.t9438 && (cljs.core.async.t9438 = {}, cljs.core.async.t9438 = function(b, c, f, g) {
    this.cb = b;
    this.flag = c;
    this.alt_handler = f;
    this.meta9439 = g;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.t9438.cljs$lang$type = !0, cljs.core.async.t9438.cljs$lang$ctorStr = "cljs.core.async/t9438", cljs.core.async.t9438.cljs$lang$ctorPrWriter = function(b, c, f) {
    return cljs.core._write.call(null, c, "cljs.core.async/t9438")
  }, cljs.core.async.t9438.prototype.cljs$core$async$impl$protocols$Handler$ = !0, cljs.core.async.t9438.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = function(b) {
    return cljs.core.async.impl.protocols.active_QMARK_.call(null, this.flag)
  }, cljs.core.async.t9438.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = function(b) {
    cljs.core.async.impl.protocols.commit.call(null, this.flag);
    return this.cb
  }, cljs.core.async.t9438.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta9439
  }, cljs.core.async.t9438.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new cljs.core.async.t9438(this.cb, this.flag, this.alt_handler, c)
  }, cljs.core.async.__GT_t9438 = function(b, c, f, g) {
    return new cljs.core.async.t9438(b, c, f, g)
  });
  return new cljs.core.async.t9438(c, b, alt_handler, null)
};
cljs.core.async.do_alts = function(a, b, c) {
  var d = cljs.core.async.alt_flag.call(null), e = cljs.core.count.call(null, b), f = cljs.core.async.random_array.call(null, e), g = (new cljs.core.Keyword(null, "priority", "priority", 4143410454)).call(null, c), h = function() {
    for(var c = 0;;) {
      if(c < e) {
        var h = cljs.core.truth_(g) ? c : f[c], m = cljs.core.nth.call(null, b, h), n = cljs.core.vector_QMARK_.call(null, m) ? m.call(null, 0) : null, p = cljs.core.truth_(n) ? function() {
          var b = m.call(null, 1);
          return cljs.core.async.impl.protocols.put_BANG_.call(null, n, b, cljs.core.async.alt_handler.call(null, d, function(b, c, d, e, f, g, h, k, m) {
            return function() {
              return a.call(null, cljs.core.PersistentVector.fromArray([null, f], !0))
            }
          }(c, b, h, m, n, d, e, f, g)))
        }() : cljs.core.async.impl.protocols.take_BANG_.call(null, m, cljs.core.async.alt_handler.call(null, d, function(b, c, d, e, f, g, h, k) {
          return function(b) {
            return a.call(null, cljs.core.PersistentVector.fromArray([b, d], !0))
          }
        }(c, h, m, n, d, e, f, g)));
        if(cljs.core.truth_(p)) {
          return cljs.core.async.impl.channels.box.call(null, cljs.core.PersistentVector.fromArray([cljs.core.deref.call(null, p), function() {
            var a = n;
            return cljs.core.truth_(a) ? a : m
          }()], !0))
        }
        c += 1
      }else {
        return null
      }
    }
  }();
  return cljs.core.truth_(h) ? h : cljs.core.contains_QMARK_.call(null, c, new cljs.core.Keyword(null, "default", "default", 2558708147)) ? (h = function() {
    var a = cljs.core.async.impl.protocols.active_QMARK_.call(null, d);
    return cljs.core.truth_(a) ? cljs.core.async.impl.protocols.commit.call(null, d) : a
  }(), cljs.core.truth_(h) ? cljs.core.async.impl.channels.box.call(null, cljs.core.PersistentVector.fromArray([(new cljs.core.Keyword(null, "default", "default", 2558708147)).call(null, c), new cljs.core.Keyword(null, "default", "default", 2558708147)], !0)) : null) : null
};
cljs.core.async.alts_BANG_ = function() {
  var a = function(a, b) {
    cljs.core.seq_QMARK_.call(null, b) && cljs.core.apply.call(null, cljs.core.hash_map, b);
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("alts! used not in (go ...) block"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, null))].join(""));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.async.map_LT_ = function map_LT_(b, c) {
  "undefined" === typeof cljs.core.async.t9454 && (cljs.core.async.t9454 = {}, cljs.core.async.t9454 = function(b, c, f, g) {
    this.ch = b;
    this.f = c;
    this.map_LT_ = f;
    this.meta9455 = g;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.t9454.cljs$lang$type = !0, cljs.core.async.t9454.cljs$lang$ctorStr = "cljs.core.async/t9454", cljs.core.async.t9454.cljs$lang$ctorPrWriter = function(b, c, f) {
    return cljs.core._write.call(null, c, "cljs.core.async/t9454")
  }, cljs.core.async.t9454.prototype.cljs$core$async$impl$protocols$WritePort$ = !0, cljs.core.async.t9454.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = function(b, c, f) {
    return cljs.core.async.impl.protocols.put_BANG_.call(null, this.ch, c, f)
  }, cljs.core.async.t9454.prototype.cljs$core$async$impl$protocols$ReadPort$ = !0, cljs.core.async.t9454.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = function(b, c) {
    var f = this, g = cljs.core.async.impl.protocols.take_BANG_.call(null, f.ch, function() {
      "undefined" === typeof cljs.core.async.t9457 && (cljs.core.async.t9457 = {}, cljs.core.async.t9457 = function(b, c, d, e, f, g, r) {
        this.fn1 = b;
        this._ = c;
        this.meta9455 = d;
        this.ch = e;
        this.f = f;
        this.map_LT_ = g;
        this.meta9458 = r;
        this.cljs$lang$protocol_mask$partition1$ = 0;
        this.cljs$lang$protocol_mask$partition0$ = 393216
      }, cljs.core.async.t9457.cljs$lang$type = !0, cljs.core.async.t9457.cljs$lang$ctorStr = "cljs.core.async/t9457", cljs.core.async.t9457.cljs$lang$ctorPrWriter = function(b, c, d) {
        return cljs.core._write.call(null, c, "cljs.core.async/t9457")
      }, cljs.core.async.t9457.prototype.cljs$core$async$impl$protocols$Handler$ = !0, cljs.core.async.t9457.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = function(b) {
        return cljs.core.async.impl.protocols.active_QMARK_.call(null, this.fn1)
      }, cljs.core.async.t9457.prototype.cljs$core$async$impl$protocols$Handler$lock_id$arity$1 = function(b) {
        return cljs.core.async.impl.protocols.lock_id.call(null, this.fn1)
      }, cljs.core.async.t9457.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = function(b) {
        var c = this;
        return function(b) {
          return function(d) {
            return b.call(null, null == d ? null : c.f.call(null, d))
          }
        }(cljs.core.async.impl.protocols.commit.call(null, c.fn1))
      }, cljs.core.async.t9457.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
        return this.meta9458
      }, cljs.core.async.t9457.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
        return new cljs.core.async.t9457(this.fn1, this._, this.meta9455, this.ch, this.f, this.map_LT_, c)
      }, cljs.core.async.__GT_t9457 = function(b, c, d, e, f, g, r) {
        return new cljs.core.async.t9457(b, c, d, e, f, g, r)
      });
      return new cljs.core.async.t9457(c, b, f.meta9455, f.ch, f.f, f.map_LT_, null)
    }());
    return cljs.core.truth_(cljs.core.truth_(g) ? null != cljs.core.deref.call(null, g) : g) ? cljs.core.async.impl.channels.box.call(null, f.f.call(null, cljs.core.deref.call(null, g))) : g
  }, cljs.core.async.t9454.prototype.cljs$core$async$impl$protocols$Channel$ = !0, cljs.core.async.t9454.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = function(b) {
    return cljs.core.async.impl.protocols.close_BANG_.call(null, this.ch)
  }, cljs.core.async.t9454.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta9455
  }, cljs.core.async.t9454.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new cljs.core.async.t9454(this.ch, this.f, this.map_LT_, c)
  }, cljs.core.async.__GT_t9454 = function(b, c, f, g) {
    return new cljs.core.async.t9454(b, c, f, g)
  });
  return new cljs.core.async.t9454(c, b, map_LT_, null)
};
cljs.core.async.map_GT_ = function map_GT_(b, c) {
  "undefined" === typeof cljs.core.async.t9463 && (cljs.core.async.t9463 = {}, cljs.core.async.t9463 = function(b, c, f, g) {
    this.ch = b;
    this.f = c;
    this.map_GT_ = f;
    this.meta9464 = g;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.t9463.cljs$lang$type = !0, cljs.core.async.t9463.cljs$lang$ctorStr = "cljs.core.async/t9463", cljs.core.async.t9463.cljs$lang$ctorPrWriter = function(b, c, f) {
    return cljs.core._write.call(null, c, "cljs.core.async/t9463")
  }, cljs.core.async.t9463.prototype.cljs$core$async$impl$protocols$WritePort$ = !0, cljs.core.async.t9463.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = function(b, c, f) {
    return cljs.core.async.impl.protocols.put_BANG_.call(null, this.ch, this.f.call(null, c), f)
  }, cljs.core.async.t9463.prototype.cljs$core$async$impl$protocols$ReadPort$ = !0, cljs.core.async.t9463.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = function(b, c) {
    return cljs.core.async.impl.protocols.take_BANG_.call(null, this.ch, c)
  }, cljs.core.async.t9463.prototype.cljs$core$async$impl$protocols$Channel$ = !0, cljs.core.async.t9463.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = function(b) {
    return cljs.core.async.impl.protocols.close_BANG_.call(null, this.ch)
  }, cljs.core.async.t9463.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta9464
  }, cljs.core.async.t9463.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new cljs.core.async.t9463(this.ch, this.f, this.map_GT_, c)
  }, cljs.core.async.__GT_t9463 = function(b, c, f, g) {
    return new cljs.core.async.t9463(b, c, f, g)
  });
  return new cljs.core.async.t9463(c, b, map_GT_, null)
};
cljs.core.async.filter_GT_ = function filter_GT_(b, c) {
  "undefined" === typeof cljs.core.async.t9469 && (cljs.core.async.t9469 = {}, cljs.core.async.t9469 = function(b, c, f, g) {
    this.ch = b;
    this.p = c;
    this.filter_GT_ = f;
    this.meta9470 = g;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.t9469.cljs$lang$type = !0, cljs.core.async.t9469.cljs$lang$ctorStr = "cljs.core.async/t9469", cljs.core.async.t9469.cljs$lang$ctorPrWriter = function(b, c, f) {
    return cljs.core._write.call(null, c, "cljs.core.async/t9469")
  }, cljs.core.async.t9469.prototype.cljs$core$async$impl$protocols$WritePort$ = !0, cljs.core.async.t9469.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = function(b, c, f) {
    return cljs.core.truth_(this.p.call(null, c)) ? cljs.core.async.impl.protocols.put_BANG_.call(null, this.ch, c, f) : cljs.core.async.impl.channels.box.call(null, null)
  }, cljs.core.async.t9469.prototype.cljs$core$async$impl$protocols$ReadPort$ = !0, cljs.core.async.t9469.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = function(b, c) {
    return cljs.core.async.impl.protocols.take_BANG_.call(null, this.ch, c)
  }, cljs.core.async.t9469.prototype.cljs$core$async$impl$protocols$Channel$ = !0, cljs.core.async.t9469.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = function(b) {
    return cljs.core.async.impl.protocols.close_BANG_.call(null, this.ch)
  }, cljs.core.async.t9469.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta9470
  }, cljs.core.async.t9469.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new cljs.core.async.t9469(this.ch, this.p, this.filter_GT_, c)
  }, cljs.core.async.__GT_t9469 = function(b, c, f, g) {
    return new cljs.core.async.t9469(b, c, f, g)
  });
  return new cljs.core.async.t9469(c, b, filter_GT_, null)
};
cljs.core.async.remove_GT_ = function(a, b) {
  return cljs.core.async.filter_GT_.call(null, cljs.core.complement.call(null, a), b)
};
cljs.core.async.filter_LT_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null)
  }, c = function(a, b, c) {
    var g = cljs.core.async.chan.call(null, c), h = cljs.core.async.chan.call(null, 1);
    cljs.core.async.impl.dispatch.run.call(null, function() {
      var c = function() {
        return function(a) {
          return function() {
            var b = null, c = function() {
              var a = Array(7);
              a[0] = b;
              a[1] = 1;
              return a
            }, d = function(b) {
              for(;;) {
                var c = a.call(null, b);
                if(!cljs.core.keyword_identical_QMARK_.call(null, c, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                  return c
                }
              }
            }, b = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return d.call(this, a)
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            b.cljs$core$IFn$_invoke$arity$0 = c;
            b.cljs$core$IFn$_invoke$arity$1 = d;
            return b
          }()
        }(function(c) {
          var f = c[1];
          return 1 === f ? (c[2] = null, c[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 2 === f ? cljs.core.async.impl.ioc_helpers.take_BANG_.call(null, c, 4, b) : 3 === f ? (f = c[2], cljs.core.async.impl.ioc_helpers.return_chan.call(null, c, f)) : 4 === f ? (f = c[5], f = c[2], c[5] = f, cljs.core.truth_(null == f) ? c[1] = 5 : c[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 5 === f ? (f = cljs.core.async.close_BANG_.call(null, g), c[2] = f, c[1] = 
          7, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 6 === f ? (f = c[5], f = a.call(null, f), cljs.core.truth_(f) ? c[1] = 8 : c[1] = 9, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 7 === f ? (f = c[2], c[2] = f, c[1] = 3, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 8 === f ? (f = c[5], cljs.core.async.impl.ioc_helpers.put_BANG_.call(null, c, 11, g, f)) : 9 === f ? (c[2] = null, c[1] = 10, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 
          10 === f ? (c[6] = c[2], c[2] = null, c[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 11 === f ? (f = c[2], c[2] = f, c[1] = 10, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
        })
      }(), f = function() {
        var a = c.call(null);
        a[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = h;
        return a
      }();
      return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, f)
    });
    return g
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.remove_LT_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null)
  }, c = function(a, b, c) {
    return cljs.core.async.filter_LT_.call(null, cljs.core.complement.call(null, a), b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.mapcat_STAR_ = function(a, b, c) {
  var d = cljs.core.async.chan.call(null, 1);
  cljs.core.async.impl.dispatch.run.call(null, function() {
    var e = function() {
      return function(a) {
        return function() {
          var b = null, c = function() {
            var a = Array(14);
            a[0] = b;
            a[1] = 1;
            return a
          }, d = function(b) {
            for(;;) {
              var c = a.call(null, b);
              if(!cljs.core.keyword_identical_QMARK_.call(null, c, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                return c
              }
            }
          }, b = function(a) {
            switch(arguments.length) {
              case 0:
                return c.call(this);
              case 1:
                return d.call(this, a)
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          b.cljs$core$IFn$_invoke$arity$0 = c;
          b.cljs$core$IFn$_invoke$arity$1 = d;
          return b
        }()
      }(function(d) {
        var e = d[1];
        if(1 === e) {
          return d[2] = null, d[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(2 === e) {
          return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null, d, 4, b)
        }
        if(3 === e) {
          return e = d[2], cljs.core.async.impl.ioc_helpers.return_chan.call(null, d, e)
        }
        if(4 === e) {
          return e = d[5], e = d[2], d[5] = e, cljs.core.truth_(null == e) ? d[1] = 5 : d[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(5 === e) {
          return e = cljs.core.async.close_BANG_.call(null, c), d[2] = e, d[1] = 7, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(6 === e) {
          var e = d[5], e = a.call(null, e), e = cljs.core.seq.call(null, e), f, l, m;
          d[6] = 0;
          d[7] = e;
          d[8] = 0;
          d[9] = null;
          d[2] = null;
          d[1] = 8;
          return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(7 === e) {
          return e = d[2], d[2] = e, d[1] = 3, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(8 === e) {
          return m = d[6], l = d[8], cljs.core.truth_(m < l) ? d[1] = 10 : d[1] = 11, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(9 === e) {
          return d[10] = d[2], d[2] = null, d[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(10 === e) {
          return m = d[6], f = d[9], e = cljs.core._nth.call(null, f, m), cljs.core.async.impl.ioc_helpers.put_BANG_.call(null, d, 13, c, e)
        }
        if(11 === e) {
          return e = d[7], l = d[11], e = cljs.core.seq.call(null, e), d[11] = e, d[1] = e ? 14 : 15, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(12 === e) {
          return e = d[2], d[2] = e, d[1] = 9, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(13 === e) {
          m = d[6];
          e = d[7];
          l = d[8];
          f = d[9];
          var n = d[2];
          d[6] = m + 1;
          d[7] = e;
          d[8] = l;
          d[9] = f;
          d[12] = n;
          d[2] = null;
          d[1] = 8;
          return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        return 14 === e ? (l = d[11], e = cljs.core.chunked_seq_QMARK_.call(null, l), d[1] = e ? 17 : 18, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 15 === e ? (d[2] = null, d[1] = 16, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 16 === e ? (e = d[2], d[2] = e, d[1] = 12, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 17 === e ? (l = d[11], e = cljs.core.chunk_first.call(null, l), l = cljs.core.chunk_rest.call(null, l), m = cljs.core.count.call(null, 
        e), d[6] = 0, d[7] = l, d[8] = m, d[9] = e, d[2] = null, d[1] = 8, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 18 === e ? (l = d[11], e = cljs.core.first.call(null, l), cljs.core.async.impl.ioc_helpers.put_BANG_.call(null, d, 20, c, e)) : 19 === e ? (e = d[2], d[2] = e, d[1] = 16, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 20 === e ? (l = d[11], m = d[2], e = cljs.core.next.call(null, l), d[6] = 0, d[7] = e, d[8] = 0, d[9] = null, d[13] = m, d[2] = null, 
        d[1] = 8, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
      })
    }(), f = function() {
      var a = e.call(null);
      a[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = d;
      return a
    }();
    return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, f)
  });
  return d
};
cljs.core.async.mapcat_LT_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null)
  }, c = function(a, b, c) {
    c = cljs.core.async.chan.call(null, c);
    cljs.core.async.mapcat_STAR_.call(null, a, b, c);
    return c
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.mapcat_GT_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null)
  }, c = function(a, b, c) {
    c = cljs.core.async.chan.call(null, c);
    cljs.core.async.mapcat_STAR_.call(null, a, c, b);
    return c
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.pipe = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, !0)
  }, c = function(a, b, c) {
    var g = cljs.core.async.chan.call(null, 1);
    cljs.core.async.impl.dispatch.run.call(null, function() {
      var h = function() {
        return function(a) {
          return function() {
            var b = null, c = function() {
              var a = Array(7);
              a[0] = b;
              a[1] = 1;
              return a
            }, d = function(b) {
              for(;;) {
                var c = a.call(null, b);
                if(!cljs.core.keyword_identical_QMARK_.call(null, c, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                  return c
                }
              }
            }, b = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return d.call(this, a)
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            b.cljs$core$IFn$_invoke$arity$0 = c;
            b.cljs$core$IFn$_invoke$arity$1 = d;
            return b
          }()
        }(function(g) {
          var h = g[1];
          return 1 === h ? (g[2] = null, g[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 2 === h ? cljs.core.async.impl.ioc_helpers.take_BANG_.call(null, g, 4, a) : 3 === h ? (h = g[2], cljs.core.async.impl.ioc_helpers.return_chan.call(null, g, h)) : 4 === h ? (h = g[5], h = g[2], g[5] = h, cljs.core.truth_(null == h) ? g[1] = 5 : g[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 5 === h ? (cljs.core.truth_(c) ? g[1] = 8 : g[1] = 9, new cljs.core.Keyword(null, 
          "recur", "recur", 1122293407)) : 6 === h ? (h = g[5], cljs.core.async.impl.ioc_helpers.put_BANG_.call(null, g, 11, b, h)) : 7 === h ? (h = g[2], g[2] = h, g[1] = 3, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 8 === h ? (h = cljs.core.async.close_BANG_.call(null, b), g[2] = h, g[1] = 10, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 9 === h ? (g[2] = null, g[1] = 10, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 10 === h ? (h = g[2], g[2] = 
          h, g[1] = 7, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 11 === h ? (g[6] = g[2], g[2] = null, g[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
        })
      }(), k = function() {
        var a = h.call(null);
        a[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = g;
        return a
      }();
      return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, k)
    });
    return b
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.split = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null, null)
  }, c = function(a, b, c, g) {
    var h = cljs.core.async.chan.call(null, c), k = cljs.core.async.chan.call(null, g), l = cljs.core.async.chan.call(null, 1);
    cljs.core.async.impl.dispatch.run.call(null, function() {
      var c = function() {
        return function(a) {
          return function() {
            var b = null, c = function() {
              var a = Array(8);
              a[0] = b;
              a[1] = 1;
              return a
            }, d = function(b) {
              for(;;) {
                var c = a.call(null, b);
                if(!cljs.core.keyword_identical_QMARK_.call(null, c, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                  return c
                }
              }
            }, b = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return d.call(this, a)
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            b.cljs$core$IFn$_invoke$arity$0 = c;
            b.cljs$core$IFn$_invoke$arity$1 = d;
            return b
          }()
        }(function(c) {
          var f = c[1];
          if(1 === f) {
            return c[2] = null, c[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(2 === f) {
            return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null, c, 4, b)
          }
          if(3 === f) {
            return f = c[2], cljs.core.async.impl.ioc_helpers.return_chan.call(null, c, f)
          }
          if(4 === f) {
            return f = c[5], f = c[2], c[5] = f, cljs.core.truth_(null == f) ? c[1] = 5 : c[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(5 === f) {
            var g = cljs.core.async.close_BANG_.call(null, h), f = cljs.core.async.close_BANG_.call(null, k);
            c[6] = g;
            c[2] = f;
            c[1] = 7;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          return 6 === f ? (f = c[5], f = a.call(null, f), cljs.core.truth_(f) ? c[1] = 9 : c[1] = 10, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 7 === f ? (f = c[2], c[2] = f, c[1] = 3, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 8 === f ? (c[7] = c[2], c[2] = null, c[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 9 === f ? (c[2] = h, c[1] = 11, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 10 === f ? (c[2] = k, c[1] = 11, new cljs.core.Keyword(null, 
          "recur", "recur", 1122293407)) : 11 === f ? (f = c[5], g = c[2], cljs.core.async.impl.ioc_helpers.put_BANG_.call(null, c, 8, g, f)) : null
        })
      }(), f = function() {
        var a = c.call(null);
        a[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = l;
        return a
      }();
      return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, f)
    });
    return cljs.core.PersistentVector.fromArray([h, k], !0)
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
cljs.core.async.reduce = function(a, b, c) {
  var d = cljs.core.async.chan.call(null, 1);
  cljs.core.async.impl.dispatch.run.call(null, function() {
    var e = function() {
      return function(a) {
        return function() {
          var b = null, c = function() {
            var a = Array(7);
            a[0] = b;
            a[1] = 1;
            return a
          }, d = function(b) {
            for(;;) {
              var c = a.call(null, b);
              if(!cljs.core.keyword_identical_QMARK_.call(null, c, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                return c
              }
            }
          }, b = function(a) {
            switch(arguments.length) {
              case 0:
                return c.call(this);
              case 1:
                return d.call(this, a)
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          b.cljs$core$IFn$_invoke$arity$0 = c;
          b.cljs$core$IFn$_invoke$arity$1 = d;
          return b
        }()
      }(function(d) {
        var e = d[1];
        return 7 === e ? (e = d, e[2] = d[2], e[1] = 3, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 6 === e ? (e = d[6], e = a.call(null, e, d[5]), d[6] = e, d[2] = null, d[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 5 === e ? (e = d[6], d[2] = e, d[1] = 7, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 4 === e ? (e = d[2], d[5] = e, cljs.core.truth_(null == e) ? d[1] = 5 : d[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 
        3 === e ? (e = d[2], cljs.core.async.impl.ioc_helpers.return_chan.call(null, d, e)) : 2 === e ? cljs.core.async.impl.ioc_helpers.take_BANG_.call(null, d, 4, c) : 1 === e ? (e = b, d[6] = e, d[2] = null, d[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
      })
    }(), f = function() {
      var a = e.call(null);
      a[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = d;
      return a
    }();
    return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, f)
  });
  return d
};
cljs.core.async.onto_chan = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, !0)
  }, c = function(a, b, c) {
    var g = cljs.core.async.chan.call(null, 1);
    cljs.core.async.impl.dispatch.run.call(null, function() {
      var h = function() {
        return function(a) {
          return function() {
            var b = null, c = function() {
              var a = Array(7);
              a[0] = b;
              a[1] = 1;
              return a
            }, d = function(b) {
              for(;;) {
                var c = a.call(null, b);
                if(!cljs.core.keyword_identical_QMARK_.call(null, c, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                  return c
                }
              }
            }, b = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return d.call(this, a)
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            b.cljs$core$IFn$_invoke$arity$0 = c;
            b.cljs$core$IFn$_invoke$arity$1 = d;
            return b
          }()
        }(function(g) {
          var h = g[1];
          if(1 === h) {
            return h = cljs.core.seq.call(null, b), g[5] = h, g[2] = null, g[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(2 === h) {
            return h = g[5], cljs.core.truth_(h) ? g[1] = 4 : g[1] = 5, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(3 === h) {
            return h = g[2], cljs.core.async.impl.ioc_helpers.return_chan.call(null, g, h)
          }
          if(4 === h) {
            return h = g[5], h = cljs.core.first.call(null, h), cljs.core.async.impl.ioc_helpers.put_BANG_.call(null, g, 7, a, h)
          }
          if(5 === h) {
            return cljs.core.truth_(c) ? g[1] = 8 : g[1] = 9, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(6 === h) {
            return h = g[2], g[2] = h, g[1] = 3, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(7 === h) {
            var h = g[5], k = g[2], h = cljs.core.next.call(null, h);
            g[6] = k;
            g[5] = h;
            g[2] = null;
            g[1] = 2;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          return 8 === h ? (h = cljs.core.async.close_BANG_.call(null, a), g[2] = h, g[1] = 10, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 9 === h ? (g[2] = null, g[1] = 10, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 10 === h ? (h = g[2], g[2] = h, g[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
        })
      }(), k = function() {
        var a = h.call(null);
        a[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = g;
        return a
      }();
      return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, k)
    });
    return g
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.to_chan = function(a) {
  var b = cljs.core.async.chan.call(null, cljs.core.bounded_count.call(null, 100, a));
  cljs.core.async.onto_chan.call(null, b, a);
  return b
};
cljs.core.async.Mux = {};
cljs.core.async.muxch_STAR_ = function(a) {
  if(a ? a.cljs$core$async$Mux$muxch_STAR_$arity$1 : a) {
    return a.cljs$core$async$Mux$muxch_STAR_$arity$1(a)
  }
  var b;
  b = cljs.core.async.muxch_STAR_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.muxch_STAR_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "Mux.muxch*", a);
  }
  return b.call(null, a)
};
cljs.core.async.Mult = {};
cljs.core.async.tap_STAR_ = function(a, b, c) {
  if(a ? a.cljs$core$async$Mult$tap_STAR_$arity$3 : a) {
    return a.cljs$core$async$Mult$tap_STAR_$arity$3(a, b, c)
  }
  var d;
  d = cljs.core.async.tap_STAR_[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core.async.tap_STAR_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "Mult.tap*", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.async.untap_STAR_ = function(a, b) {
  if(a ? a.cljs$core$async$Mult$untap_STAR_$arity$2 : a) {
    return a.cljs$core$async$Mult$untap_STAR_$arity$2(a, b)
  }
  var c;
  c = cljs.core.async.untap_STAR_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core.async.untap_STAR_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "Mult.untap*", a);
  }
  return c.call(null, a, b)
};
cljs.core.async.untap_all_STAR_ = function(a) {
  if(a ? a.cljs$core$async$Mult$untap_all_STAR_$arity$1 : a) {
    return a.cljs$core$async$Mult$untap_all_STAR_$arity$1(a)
  }
  var b;
  b = cljs.core.async.untap_all_STAR_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.untap_all_STAR_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "Mult.untap-all*", a);
  }
  return b.call(null, a)
};
cljs.core.async.mult = function mult(b) {
  var c = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), d = function() {
    "undefined" === typeof cljs.core.async.t10289 && (cljs.core.async.t10289 = {}, cljs.core.async.t10289 = function(b, c, d, e) {
      this.cs = b;
      this.ch = c;
      this.mult = d;
      this.meta10290 = e;
      this.cljs$lang$protocol_mask$partition1$ = 0;
      this.cljs$lang$protocol_mask$partition0$ = 393216
    }, cljs.core.async.t10289.cljs$lang$type = !0, cljs.core.async.t10289.cljs$lang$ctorStr = "cljs.core.async/t10289", cljs.core.async.t10289.cljs$lang$ctorPrWriter = function(b) {
      return function(b, c, d) {
        return cljs.core._write.call(null, c, "cljs.core.async/t10289")
      }
    }(c), cljs.core.async.t10289.prototype.cljs$core$async$Mult$ = !0, cljs.core.async.t10289.prototype.cljs$core$async$Mult$tap_STAR_$arity$3 = function(b) {
      return function(b, c, d) {
        cljs.core.swap_BANG_.call(null, this.cs, cljs.core.assoc, c, d);
        return null
      }
    }(c), cljs.core.async.t10289.prototype.cljs$core$async$Mult$untap_STAR_$arity$2 = function(b) {
      return function(b, c) {
        cljs.core.swap_BANG_.call(null, this.cs, cljs.core.dissoc, c);
        return null
      }
    }(c), cljs.core.async.t10289.prototype.cljs$core$async$Mult$untap_all_STAR_$arity$1 = function(b) {
      return function(b) {
        cljs.core.reset_BANG_.call(null, this.cs, cljs.core.PersistentArrayMap.EMPTY);
        return null
      }
    }(c), cljs.core.async.t10289.prototype.cljs$core$async$Mux$ = !0, cljs.core.async.t10289.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = function(b) {
      return function(b) {
        return this.ch
      }
    }(c), cljs.core.async.t10289.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
      return function(b) {
        return this.meta10290
      }
    }(c), cljs.core.async.t10289.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b) {
      return function(b, c) {
        return new cljs.core.async.t10289(this.cs, this.ch, this.mult, c)
      }
    }(c), cljs.core.async.__GT_t10289 = function(b) {
      return function(b, c, d, e) {
        return new cljs.core.async.t10289(b, c, d, e)
      }
    }(c));
    return new cljs.core.async.t10289(c, b, mult, null)
  }(), e = cljs.core.async.chan.call(null, 1), f = cljs.core.atom.call(null, null), g = function(b, c, d, e) {
    return function() {
      return 0 === cljs.core.swap_BANG_.call(null, e, cljs.core.dec) ? cljs.core.async.put_BANG_.call(null, d, !0) : null
    }
  }(c, d, e, f), h = cljs.core.async.chan.call(null, 1);
  cljs.core.async.impl.dispatch.run.call(null, function() {
    var k = function() {
      return function(b) {
        return function() {
          var c = null, d = function() {
            var b = Array(31);
            b[0] = c;
            b[1] = 1;
            return b
          }, e = function(c) {
            for(;;) {
              var d = b.call(null, c);
              if(!cljs.core.keyword_identical_QMARK_.call(null, d, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                return d
              }
            }
          }, c = function(b) {
            switch(arguments.length) {
              case 0:
                return d.call(this);
              case 1:
                return e.call(this, b)
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          c.cljs$core$IFn$_invoke$arity$0 = d;
          c.cljs$core$IFn$_invoke$arity$1 = e;
          return c
        }()
      }(function(h) {
        var k = h[1];
        if(32 === k) {
          try {
            var l = h[5], r = h[6], s = cljs.core.async.put_BANG_.call(null, l, r, g), q = h, t = q;
            t[2] = s;
            t[1] = 30;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }catch(u) {
            if(u instanceof Object) {
              var v = u;
              h[1] = 31;
              h[2] = v;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
              throw u;
            }
            return null
          }
        }else {
          if(1 === k) {
            var w = q = h;
            w[2] = null;
            w[1] = 2;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(33 === k) {
            var x = h[7], N = cljs.core.chunked_seq_QMARK_.call(null, x), q = h;
            q[1] = N ? 36 : 37;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(2 === k) {
            return q = h, cljs.core.async.impl.ioc_helpers.take_BANG_.call(null, q, 4, b)
          }
          if(34 === k) {
            var T = q = h;
            T[2] = null;
            T[1] = 35;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(3 === k) {
            var y = h[2], q = h;
            return cljs.core.async.impl.ioc_helpers.return_chan.call(null, q, y)
          }
          if(35 === k) {
            var A = h[2], B = q = h;
            B[2] = A;
            B[1] = 29;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(4 === k) {
            var r = h[6], E = h[2], G = null == E;
            h[6] = E;
            q = h;
            cljs.core.truth_(G) ? q[1] = 5 : q[1] = 6;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(36 === k) {
            var x = h[7], H = cljs.core.chunk_first.call(null, x), I = cljs.core.chunk_rest.call(null, x), K = cljs.core.count.call(null, H), z = I, C = H, F = K, D = 0;
            h[8] = z;
            h[9] = D;
            h[10] = F;
            h[11] = C;
            var P = q = h;
            P[2] = null;
            P[1] = 25;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(5 === k) {
            var Q = cljs.core.deref.call(null, c), J = cljs.core.seq.call(null, Q), L = null, O = 0, M = 0;
            h[12] = M;
            h[13] = O;
            h[14] = J;
            h[15] = L;
            var U = q = h;
            U[2] = null;
            U[1] = 8;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(37 === k) {
            var x = h[7], S = cljs.core.first.call(null, x);
            h[16] = S;
            var Y = q = h;
            Y[2] = null;
            Y[1] = 41;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(6 === k) {
            var Ba = cljs.core.deref.call(null, c), Z = cljs.core.keys.call(null, Ba), Ca = cljs.core.count.call(null, Z), Da = cljs.core.reset_BANG_.call(null, f, Ca), z = cljs.core.seq.call(null, Z), C = null, D = F = 0;
            h[8] = z;
            h[17] = Da;
            h[9] = D;
            h[10] = F;
            h[11] = C;
            var $ = q = h;
            $[2] = null;
            $[1] = 25;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(38 === k) {
            var Ea = h[2], aa = q = h;
            aa[2] = Ea;
            aa[1] = 35;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(7 === k) {
            var Fa = h[2], ba = q = h;
            ba[2] = Fa;
            ba[1] = 3;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(39 === k) {
            var x = h[7], Ga = h[2], z = cljs.core.next.call(null, x), C = null, D = F = 0;
            h[8] = z;
            h[9] = D;
            h[10] = F;
            h[11] = C;
            h[18] = Ga;
            var ca = q = h;
            ca[2] = null;
            ca[1] = 25;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(8 === k) {
            var M = h[12], O = h[13], Ha = M < O, q = h;
            cljs.core.truth_(Ha) ? q[1] = 10 : q[1] = 11;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(40 === k) {
            var S = h[16], Ia = h[2], Ja = cljs.core.swap_BANG_.call(null, f, cljs.core.dec), Ka = cljs.core.async.untap_STAR_.call(null, d, S);
            h[19] = Ia;
            h[20] = Ja;
            var da = q = h;
            da[2] = Ka;
            da[1] = 39;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(9 === k) {
            var La = h[2], ea = q = h;
            ea[2] = La;
            ea[1] = 7;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(41 === k) {
            try {
              var r = h[6], S = h[16], Ma = cljs.core.async.put_BANG_.call(null, S, r, g), fa = q = h;
              fa[2] = Ma;
              fa[1] = 39;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }catch(V) {
              if(V instanceof Object) {
                return v = V, h[1] = 40, h[2] = v, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
              }
              if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
                throw V;
              }
              return null
            }
          }else {
            if(10 === k) {
              var M = h[12], L = h[15], ga = cljs.core._nth.call(null, L, M), W = cljs.core.nth.call(null, ga, 0, null), Na = cljs.core.nth.call(null, ga, 1, null);
              h[21] = W;
              q = h;
              cljs.core.truth_(Na) ? q[1] = 13 : q[1] = 14;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(42 === k) {
              h[22] = h[2];
              var ha = q = h;
              ha[2] = null;
              ha[1] = 2;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(11 === k) {
              var R = h[23], J = h[14], ia = cljs.core.seq.call(null, J);
              h[23] = ia;
              q = h;
              q[1] = ia ? 16 : 17;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(12 === k) {
              var Oa = h[2], ja = q = h;
              ja[2] = Oa;
              ja[1] = 9;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(13 === k) {
              var W = h[21], Pa = cljs.core.async.close_BANG_.call(null, W), ka = q = h;
              ka[2] = Pa;
              ka[1] = 15;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(14 === k) {
              var la = q = h;
              la[2] = null;
              la[1] = 15;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(15 === k) {
              var M = h[12], O = h[13], J = h[14], L = h[15], Qa = h[2], Ra = J, Sa = L, Ta = O;
              h[12] = M + 1;
              h[13] = Ta;
              h[24] = Qa;
              h[14] = Ra;
              h[15] = Sa;
              var ma = q = h;
              ma[2] = null;
              ma[1] = 8;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(16 === k) {
              var R = h[23], Ua = cljs.core.chunked_seq_QMARK_.call(null, R), q = h;
              q[1] = Ua ? 19 : 20;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(17 === k) {
              var na = q = h;
              na[2] = null;
              na[1] = 18;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(18 === k) {
              var Va = h[2], oa = q = h;
              oa[2] = Va;
              oa[1] = 12;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(19 === k) {
              var R = h[23], pa = cljs.core.chunk_first.call(null, R), Wa = cljs.core.chunk_rest.call(null, R), Xa = cljs.core.count.call(null, pa), J = Wa, L = pa, O = Xa, M = 0;
              h[12] = M;
              h[13] = O;
              h[14] = J;
              h[15] = L;
              var qa = q = h;
              qa[2] = null;
              qa[1] = 8;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(20 === k) {
              var R = h[23], ra = cljs.core.first.call(null, R), X = cljs.core.nth.call(null, ra, 0, null), Ya = cljs.core.nth.call(null, ra, 1, null);
              h[25] = X;
              q = h;
              cljs.core.truth_(Ya) ? q[1] = 22 : q[1] = 23;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(21 === k) {
              var Za = h[2], sa = q = h;
              sa[2] = Za;
              sa[1] = 18;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(22 === k) {
              var X = h[25], $a = cljs.core.async.close_BANG_.call(null, X), ta = q = h;
              ta[2] = $a;
              ta[1] = 24;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(23 === k) {
              var ua = q = h;
              ua[2] = null;
              ua[1] = 24;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(24 === k) {
              var R = h[23], ab = h[2], J = cljs.core.next.call(null, R), L = null, M = O = 0;
              h[12] = M;
              h[13] = O;
              h[26] = ab;
              h[14] = J;
              h[15] = L;
              var va = q = h;
              va[2] = null;
              va[1] = 8;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(25 === k) {
              var D = h[9], F = h[10], bb = D < F, q = h;
              cljs.core.truth_(bb) ? q[1] = 27 : q[1] = 28;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(26 === k) {
              return h[27] = h[2], q = h, cljs.core.async.impl.ioc_helpers.take_BANG_.call(null, q, 42, e)
            }
            if(27 === k) {
              D = h[9];
              C = h[11];
              l = cljs.core._nth.call(null, C, D);
              h[5] = l;
              var wa = q = h;
              wa[2] = null;
              wa[1] = 32;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(28 === k) {
              var z = h[8], x = h[7], xa = cljs.core.seq.call(null, z);
              h[7] = xa;
              q = h;
              q[1] = xa ? 33 : 34;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(29 === k) {
              var cb = h[2], ya = q = h;
              ya[2] = cb;
              ya[1] = 26;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(30 === k) {
              var z = h[8], D = h[9], F = h[10], C = h[11], db = h[2], eb = C, fb = F, gb = D + 1;
              h[8] = z;
              h[9] = gb;
              h[10] = fb;
              h[11] = eb;
              h[28] = db;
              var za = q = h;
              za[2] = null;
              za[1] = 25;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            if(31 === k) {
              var l = h[5], hb = h[2], ib = cljs.core.swap_BANG_.call(null, f, cljs.core.dec), jb = cljs.core.async.untap_STAR_.call(null, d, l);
              h[29] = ib;
              h[30] = hb;
              var Aa = q = h;
              Aa[2] = jb;
              Aa[1] = 30;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }
            return null
          }
        }
      })
    }(), l = function() {
      var b = k.call(null);
      b[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = h;
      return b
    }();
    return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, l)
  });
  return d
};
cljs.core.async.tap = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, !0)
  }, c = function(a, b, c) {
    cljs.core.async.tap_STAR_.call(null, a, b, c);
    return b
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.untap = function(a, b) {
  return cljs.core.async.untap_STAR_.call(null, a, b)
};
cljs.core.async.untap_all = function(a) {
  return cljs.core.async.untap_all_STAR_.call(null, a)
};
cljs.core.async.Mix = {};
cljs.core.async.admix_STAR_ = function(a, b) {
  if(a ? a.cljs$core$async$Mix$admix_STAR_$arity$2 : a) {
    return a.cljs$core$async$Mix$admix_STAR_$arity$2(a, b)
  }
  var c;
  c = cljs.core.async.admix_STAR_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core.async.admix_STAR_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "Mix.admix*", a);
  }
  return c.call(null, a, b)
};
cljs.core.async.unmix_STAR_ = function(a, b) {
  if(a ? a.cljs$core$async$Mix$unmix_STAR_$arity$2 : a) {
    return a.cljs$core$async$Mix$unmix_STAR_$arity$2(a, b)
  }
  var c;
  c = cljs.core.async.unmix_STAR_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core.async.unmix_STAR_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "Mix.unmix*", a);
  }
  return c.call(null, a, b)
};
cljs.core.async.unmix_all_STAR_ = function(a) {
  if(a ? a.cljs$core$async$Mix$unmix_all_STAR_$arity$1 : a) {
    return a.cljs$core$async$Mix$unmix_all_STAR_$arity$1(a)
  }
  var b;
  b = cljs.core.async.unmix_all_STAR_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.unmix_all_STAR_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "Mix.unmix-all*", a);
  }
  return b.call(null, a)
};
cljs.core.async.toggle_STAR_ = function(a, b) {
  if(a ? a.cljs$core$async$Mix$toggle_STAR_$arity$2 : a) {
    return a.cljs$core$async$Mix$toggle_STAR_$arity$2(a, b)
  }
  var c;
  c = cljs.core.async.toggle_STAR_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core.async.toggle_STAR_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "Mix.toggle*", a);
  }
  return c.call(null, a, b)
};
cljs.core.async.solo_mode_STAR_ = function(a, b) {
  if(a ? a.cljs$core$async$Mix$solo_mode_STAR_$arity$2 : a) {
    return a.cljs$core$async$Mix$solo_mode_STAR_$arity$2(a, b)
  }
  var c;
  c = cljs.core.async.solo_mode_STAR_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core.async.solo_mode_STAR_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "Mix.solo-mode*", a);
  }
  return c.call(null, a, b)
};
cljs.core.async.mix = function mix(b) {
  var c = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "pause", "pause", 1120344424), null, new cljs.core.Keyword(null, "mute", "mute", 1017267595), null], !0), e = cljs.core.conj.call(null, d, new cljs.core.Keyword(null, "solo", "solo", 1017440337)), f = cljs.core.atom.call(null, new cljs.core.Keyword(null, "mute", "mute", 1017267595)), g = cljs.core.async.chan.call(null), h = function(b, c, d, e, f) {
    return function() {
      return cljs.core.async.put_BANG_.call(null, f, !0)
    }
  }(c, d, e, f, g), k = function(b, c, d, e, f, g) {
    return function(h, k) {
      return cljs.core.reduce_kv.call(null, function(b, c, d, e, f, g) {
        return function(b, c, d) {
          return cljs.core.truth_(h.call(null, d)) ? cljs.core.conj.call(null, b, c) : b
        }
      }(b, c, d, e, f, g), cljs.core.PersistentHashSet.EMPTY, k)
    }
  }(c, d, e, f, g, h), l = function(b, c, d, e, f, g, h) {
    return function() {
      var c = cljs.core.deref.call(null, b), d = cljs.core.deref.call(null, e), g = h.call(null, new cljs.core.Keyword(null, "solo", "solo", 1017440337), c), k = h.call(null, new cljs.core.Keyword(null, "pause", "pause", 1120344424), c);
      return cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "solos", "solos", 1123523302), g, new cljs.core.Keyword(null, "mutes", "mutes", 1118168300), h.call(null, new cljs.core.Keyword(null, "mute", "mute", 1017267595), c), new cljs.core.Keyword(null, "reads", "reads", 1122290959), cljs.core.conj.call(null, function() {
        var b = cljs.core._EQ_.call(null, d, new cljs.core.Keyword(null, "pause", "pause", 1120344424));
        return b ? !cljs.core.empty_QMARK_.call(null, g) : b
      }() ? cljs.core.vec.call(null, g) : cljs.core.vec.call(null, cljs.core.remove.call(null, k, cljs.core.keys.call(null, c))), f)], !0)
    }
  }(c, d, e, f, g, h, k), m = function() {
    "undefined" === typeof cljs.core.async.t10672 && (cljs.core.async.t10672 = {}, cljs.core.async.t10672 = function(b, c, d, e, f, g, h, k, l, m, n) {
      this.pick = b;
      this.out = c;
      this.attrs = d;
      this.cs = e;
      this.calc_state = f;
      this.solo_modes = g;
      this.mix = h;
      this.changed = k;
      this.change = l;
      this.solo_mode = m;
      this.meta10673 = n;
      this.cljs$lang$protocol_mask$partition1$ = 0;
      this.cljs$lang$protocol_mask$partition0$ = 393216
    }, cljs.core.async.t10672.cljs$lang$type = !0, cljs.core.async.t10672.cljs$lang$ctorStr = "cljs.core.async/t10672", cljs.core.async.t10672.cljs$lang$ctorPrWriter = function(b, c, d, e, f, g, h, k) {
      return function(b, c, d) {
        return cljs.core._write.call(null, c, "cljs.core.async/t10672")
      }
    }(c, d, e, f, g, h, k, l), cljs.core.async.t10672.prototype.cljs$core$async$Mix$ = !0, cljs.core.async.t10672.prototype.cljs$core$async$Mix$admix_STAR_$arity$2 = function(b, c, d, e, f, g, h, k) {
      return function(b, c) {
        cljs.core.swap_BANG_.call(null, this.cs, cljs.core.assoc, c, cljs.core.PersistentArrayMap.EMPTY);
        return this.changed.call(null)
      }
    }(c, d, e, f, g, h, k, l), cljs.core.async.t10672.prototype.cljs$core$async$Mix$unmix_STAR_$arity$2 = function(b, c, d, e, f, g, h, k) {
      return function(b, c) {
        cljs.core.swap_BANG_.call(null, this.cs, cljs.core.dissoc, c);
        return this.changed.call(null)
      }
    }(c, d, e, f, g, h, k, l), cljs.core.async.t10672.prototype.cljs$core$async$Mix$unmix_all_STAR_$arity$1 = function(b, c, d, e, f, g, h, k) {
      return function(b) {
        cljs.core.reset_BANG_.call(null, this.cs, cljs.core.PersistentArrayMap.EMPTY);
        return this.changed.call(null)
      }
    }(c, d, e, f, g, h, k, l), cljs.core.async.t10672.prototype.cljs$core$async$Mix$toggle_STAR_$arity$2 = function(b, c, d, e, f, g, h, k) {
      return function(b, c) {
        cljs.core.swap_BANG_.call(null, this.cs, cljs.core.partial.call(null, cljs.core.merge_with, core.merge), c);
        return this.changed.call(null)
      }
    }(c, d, e, f, g, h, k, l), cljs.core.async.t10672.prototype.cljs$core$async$Mix$solo_mode_STAR_$arity$2 = function(b, c, d, e, f, g, h, k) {
      return function(b, c) {
        if(!cljs.core.truth_(this.solo_modes.call(null, c))) {
          throw Error([cljs.core.str("Assert failed: "), cljs.core.str([cljs.core.str("mode must be one of: "), cljs.core.str(this.solo_modes)].join("")), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "solo-modes", "solo-modes", -1162732933, null), new cljs.core.Symbol(null, "mode", "mode", -1637174436, null))))].join(""));
        }
        cljs.core.reset_BANG_.call(null, this.solo_mode, c);
        return this.changed.call(null)
      }
    }(c, d, e, f, g, h, k, l), cljs.core.async.t10672.prototype.cljs$core$async$Mux$ = !0, cljs.core.async.t10672.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = function(b, c, d, e, f, g, h, k) {
      return function(b) {
        return this.out
      }
    }(c, d, e, f, g, h, k, l), cljs.core.async.t10672.prototype.cljs$core$IMeta$_meta$arity$1 = function(b, c, d, e, f, g, h, k) {
      return function(b) {
        return this.meta10673
      }
    }(c, d, e, f, g, h, k, l), cljs.core.async.t10672.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c, d, e, f, g, h, k) {
      return function(b, c) {
        return new cljs.core.async.t10672(this.pick, this.out, this.attrs, this.cs, this.calc_state, this.solo_modes, this.mix, this.changed, this.change, this.solo_mode, c)
      }
    }(c, d, e, f, g, h, k, l), cljs.core.async.__GT_t10672 = function(b, c, d, e, f, g, h, k) {
      return function(b, c, d, e, f, g, h, k, l, m, q) {
        return new cljs.core.async.t10672(b, c, d, e, f, g, h, k, l, m, q)
      }
    }(c, d, e, f, g, h, k, l));
    return new cljs.core.async.t10672(k, b, e, c, l, d, mix, h, g, f, null)
  }(), n = cljs.core.async.chan.call(null, 1);
  cljs.core.async.impl.dispatch.run.call(null, function() {
    var d = function() {
      return function(b) {
        return function() {
          var c = null, d = function() {
            var b = Array(20);
            b[0] = c;
            b[1] = 1;
            return b
          }, e = function(c) {
            for(;;) {
              var d = b.call(null, c);
              if(!cljs.core.keyword_identical_QMARK_.call(null, d, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                return d
              }
            }
          }, c = function(b) {
            switch(arguments.length) {
              case 0:
                return d.call(this);
              case 1:
                return e.call(this, b)
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          c.cljs$core$IFn$_invoke$arity$0 = d;
          c.cljs$core$IFn$_invoke$arity$1 = e;
          return c
        }()
      }(function(d) {
        var e = d[1];
        if(1 === e) {
          var e = d[5], e = l.call(null), f = cljs.core.seq_QMARK_.call(null, e);
          d[5] = e;
          d[1] = f ? 2 : 3;
          return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(2 === e) {
          return e = d[5], e = cljs.core.apply.call(null, cljs.core.hash_map, e), d[2] = e, d[1] = 4, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(3 === e) {
          return e = d[5], d[2] = e, d[1] = 4, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        if(4 === e) {
          var e = d[5], h = d[2], f = cljs.core.get.call(null, h, new cljs.core.Keyword(null, "reads", "reads", 1122290959)), k = cljs.core.get.call(null, h, new cljs.core.Keyword(null, "mutes", "mutes", 1118168300)), h = cljs.core.get.call(null, h, new cljs.core.Keyword(null, "solos", "solos", 1123523302));
          d[6] = k;
          d[7] = h;
          d[8] = e;
          d[9] = f;
          d[2] = null;
          d[1] = 5;
          return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
        }
        return 5 === e ? (e = d[8], e = cljs.core.seq_QMARK_.call(null, e), d[1] = e ? 7 : 8, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 6 === e ? (e = d[2], cljs.core.async.impl.ioc_helpers.return_chan.call(null, d, e)) : 7 === e ? (e = d[8], e = cljs.core.apply.call(null, cljs.core.hash_map, e), d[2] = e, d[1] = 9, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 8 === e ? (e = d[8], d[2] = e, d[1] = 9, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 9 === 
        e ? (e = d[10], k = d[2], h = cljs.core.get.call(null, k, new cljs.core.Keyword(null, "reads", "reads", 1122290959)), e = cljs.core.get.call(null, k, new cljs.core.Keyword(null, "mutes", "mutes", 1118168300)), f = cljs.core.get.call(null, k, new cljs.core.Keyword(null, "solos", "solos", 1123523302)), d[10] = k, d[11] = e, d[12] = f, cljs.core.async.impl.ioc_helpers.ioc_alts_BANG_.call(null, d, 10, h)) : 10 === e ? (e = d[13], e = d[14], f = d[2], e = cljs.core.nth.call(null, f, 0, null), 
        k = cljs.core.nth.call(null, f, 1, null), f = null == e, d[15] = k, d[13] = e, d[14] = f, cljs.core.truth_(f) ? d[1] = 11 : d[1] = 12, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 11 === e ? (e = d[14], d[2] = e, d[1] = 13, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 12 === e ? (k = d[15], e = cljs.core._EQ_.call(null, k, g), d[2] = e, d[1] = 13, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 13 === e ? (e = d[2], cljs.core.truth_(e) ? d[1] = 
        14 : d[1] = 15, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 14 === e ? (e = d[13], cljs.core.truth_(null == e) ? d[1] = 17 : d[1] = 18, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 15 === e ? (e = d[16], k = d[15], f = d[12], e = f.call(null, k), d[16] = e, cljs.core.truth_(e) ? d[1] = 20 : d[1] = 21, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 16 === e ? (e = d[2], d[2] = e, d[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 
        17 === e ? (k = d[15], e = cljs.core.swap_BANG_.call(null, c, cljs.core.dissoc, k), d[2] = e, d[1] = 19, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 18 === e ? (d[2] = null, d[1] = 19, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 19 === e ? (f = d[2], e = l.call(null), d[8] = e, d[17] = f, d[2] = null, d[1] = 5, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 20 === e ? (e = d[16], d[2] = e, d[1] = 22, new cljs.core.Keyword(null, "recur", "recur", 
        1122293407)) : 21 === e ? (e = d[18], f = d[12], e = cljs.core.empty_QMARK_.call(null, f), d[18] = e, d[1] = e ? 23 : 24, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 22 === e ? (e = d[2], cljs.core.truth_(e) ? d[1] = 26 : d[1] = 27, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 23 === e ? (k = d[15], e = d[11], e = e.call(null, k), e = cljs.core.not.call(null, e), d[2] = e, d[1] = 25, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 24 === e ? (e = 
        d[18], d[2] = e, d[1] = 25, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 25 === e ? (e = d[2], d[2] = e, d[1] = 22, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 26 === e ? (e = d[13], cljs.core.async.impl.ioc_helpers.put_BANG_.call(null, d, 29, b, e)) : 27 === e ? (d[2] = null, d[1] = 28, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 28 === e ? (e = d[10], f = d[2], d[19] = f, d[8] = e, d[2] = null, d[1] = 5, new cljs.core.Keyword(null, "recur", 
        "recur", 1122293407)) : 29 === e ? (e = d[2], d[2] = e, d[1] = 28, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
      })
    }(), e = function() {
      var b = d.call(null);
      b[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = n;
      return b
    }();
    return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, e)
  });
  return m
};
cljs.core.async.admix = function(a, b) {
  return cljs.core.async.admix_STAR_.call(null, a, b)
};
cljs.core.async.unmix = function(a, b) {
  return cljs.core.async.unmix_STAR_.call(null, a, b)
};
cljs.core.async.unmix_all = function(a) {
  return cljs.core.async.unmix_all_STAR_.call(null, a)
};
cljs.core.async.toggle = function(a, b) {
  return cljs.core.async.toggle_STAR_.call(null, a, b)
};
cljs.core.async.solo_mode = function(a, b) {
  return cljs.core.async.solo_mode_STAR_.call(null, a, b)
};
cljs.core.async.Pub = {};
cljs.core.async.sub_STAR_ = function(a, b, c, d) {
  if(a ? a.cljs$core$async$Pub$sub_STAR_$arity$4 : a) {
    return a.cljs$core$async$Pub$sub_STAR_$arity$4(a, b, c, d)
  }
  var e;
  e = cljs.core.async.sub_STAR_[goog.typeOf(null == a ? null : a)];
  if(!e && (e = cljs.core.async.sub_STAR_._, !e)) {
    throw cljs.core.missing_protocol.call(null, "Pub.sub*", a);
  }
  return e.call(null, a, b, c, d)
};
cljs.core.async.unsub_STAR_ = function(a, b, c) {
  if(a ? a.cljs$core$async$Pub$unsub_STAR_$arity$3 : a) {
    return a.cljs$core$async$Pub$unsub_STAR_$arity$3(a, b, c)
  }
  var d;
  d = cljs.core.async.unsub_STAR_[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core.async.unsub_STAR_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "Pub.unsub*", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.async.unsub_all_STAR_ = function() {
  var a = null, b = function(a) {
    if(a ? a.cljs$core$async$Pub$unsub_all_STAR_$arity$1 : a) {
      return a.cljs$core$async$Pub$unsub_all_STAR_$arity$1(a)
    }
    var b;
    b = cljs.core.async.unsub_all_STAR_[goog.typeOf(null == a ? null : a)];
    if(!b && (b = cljs.core.async.unsub_all_STAR_._, !b)) {
      throw cljs.core.missing_protocol.call(null, "Pub.unsub-all*", a);
    }
    return b.call(null, a)
  }, c = function(a, b) {
    if(a ? a.cljs$core$async$Pub$unsub_all_STAR_$arity$2 : a) {
      return a.cljs$core$async$Pub$unsub_all_STAR_$arity$2(a, b)
    }
    var c;
    c = cljs.core.async.unsub_all_STAR_[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core.async.unsub_all_STAR_._, !c)) {
      throw cljs.core.missing_protocol.call(null, "Pub.unsub-all*", a);
    }
    return c.call(null, a, b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.async.pub = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, cljs.core.constantly.call(null, null))
  }, c = function(b, c, f) {
    var g = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), h = function(a) {
      return function(b) {
        var c = cljs.core.get.call(null, cljs.core.deref.call(null, a), b);
        return cljs.core.truth_(c) ? c : cljs.core.get.call(null, cljs.core.swap_BANG_.call(null, a, function(a, c) {
          return function(a) {
            return cljs.core.truth_(a.call(null, b)) ? a : cljs.core.assoc.call(null, a, b, cljs.core.async.mult.call(null, cljs.core.async.chan.call(null, f.call(null, b))))
          }
        }(c, a)), b)
      }
    }(g), k = function() {
      "undefined" === typeof cljs.core.async.t10951 && (cljs.core.async.t10951 = {}, cljs.core.async.t10951 = function(a, b, c, d, e, f, g) {
        this.ensure_mult = a;
        this.mults = b;
        this.buf_fn = c;
        this.topic_fn = d;
        this.ch = e;
        this.pub = f;
        this.meta10952 = g;
        this.cljs$lang$protocol_mask$partition1$ = 0;
        this.cljs$lang$protocol_mask$partition0$ = 393216
      }, cljs.core.async.t10951.cljs$lang$type = !0, cljs.core.async.t10951.cljs$lang$ctorStr = "cljs.core.async/t10951", cljs.core.async.t10951.cljs$lang$ctorPrWriter = function(a, b) {
        return function(a, b, c) {
          return cljs.core._write.call(null, b, "cljs.core.async/t10951")
        }
      }(g, h), cljs.core.async.t10951.prototype.cljs$core$async$Pub$ = !0, cljs.core.async.t10951.prototype.cljs$core$async$Pub$sub_STAR_$arity$4 = function(a, b) {
        return function(a, b, c, d) {
          a = this.ensure_mult.call(null, b);
          return cljs.core.async.tap.call(null, a, c, d)
        }
      }(g, h), cljs.core.async.t10951.prototype.cljs$core$async$Pub$unsub_STAR_$arity$3 = function(a, b) {
        return function(a, b, c) {
          a = cljs.core.get.call(null, cljs.core.deref.call(null, this.mults), b);
          return cljs.core.truth_(a) ? cljs.core.async.untap.call(null, a, c) : null
        }
      }(g, h), cljs.core.async.t10951.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$1 = function(a, b) {
        return function(a) {
          return cljs.core.reset_BANG_.call(null, this.mults, cljs.core.PersistentArrayMap.EMPTY)
        }
      }(g, h), cljs.core.async.t10951.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$2 = function(a, b) {
        return function(a, b) {
          return cljs.core.swap_BANG_.call(null, this.mults, cljs.core.dissoc, b)
        }
      }(g, h), cljs.core.async.t10951.prototype.cljs$core$async$Mux$ = !0, cljs.core.async.t10951.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = function(a, b) {
        return function(a) {
          return this.ch
        }
      }(g, h), cljs.core.async.t10951.prototype.cljs$core$IMeta$_meta$arity$1 = function(a, b) {
        return function(a) {
          return this.meta10952
        }
      }(g, h), cljs.core.async.t10951.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
        return function(a, b) {
          return new cljs.core.async.t10951(this.ensure_mult, this.mults, this.buf_fn, this.topic_fn, this.ch, this.pub, b)
        }
      }(g, h), cljs.core.async.__GT_t10951 = function(a, b) {
        return function(a, b, c, d, e, f, g) {
          return new cljs.core.async.t10951(a, b, c, d, e, f, g)
        }
      }(g, h));
      return new cljs.core.async.t10951(h, g, f, c, b, a, null)
    }(), l = cljs.core.async.chan.call(null, 1);
    cljs.core.async.impl.dispatch.run.call(null, function() {
      var a = function() {
        return function(a) {
          return function() {
            var b = null, c = function() {
              var a = Array(17);
              a[0] = b;
              a[1] = 1;
              return a
            }, d = function(b) {
              for(;;) {
                var c = a.call(null, b);
                if(!cljs.core.keyword_identical_QMARK_.call(null, c, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                  return c
                }
              }
            }, b = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return d.call(this, a)
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            b.cljs$core$IFn$_invoke$arity$0 = c;
            b.cljs$core$IFn$_invoke$arity$1 = d;
            return b
          }()
        }(function(a) {
          var f = a[1];
          if(1 === f) {
            return a[2] = null, a[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(2 === f) {
            return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null, a, 4, b)
          }
          if(3 === f) {
            var h = a[2];
            return cljs.core.async.impl.ioc_helpers.return_chan.call(null, a, h)
          }
          if(4 === f) {
            return h = a[5], h = a[2], a[5] = h, cljs.core.truth_(null == h) ? a[1] = 5 : a[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(5 === f) {
            var h = cljs.core.deref.call(null, g), h = cljs.core.vals.call(null, h), h = cljs.core.seq.call(null, h), k, l;
            a[6] = h;
            a[7] = 0;
            a[8] = null;
            a[9] = 0;
            a[2] = null;
            a[1] = 8;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(6 === f) {
            return k = a[10], h = a[5], l = a[11], h = c.call(null, h), l = cljs.core.deref.call(null, g), l = cljs.core.get.call(null, l, h), a[10] = l, a[11] = h, cljs.core.truth_(l) ? a[1] = 19 : a[1] = 20, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(7 === f) {
            return h = a[2], a[2] = h, a[1] = 3, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(8 === f) {
            return l = a[7], f = a[9], cljs.core.truth_(f < l) ? a[1] = 10 : a[1] = 11, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(9 === f) {
            return h = a[2], a[2] = h, a[1] = 7, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(10 === f) {
            h = a[6];
            l = a[7];
            k = a[8];
            var f = a[9], m = cljs.core._nth.call(null, k, f), m = cljs.core.async.muxch_STAR_.call(null, m), m = cljs.core.async.close_BANG_.call(null, m);
            a[12] = m;
            a[6] = h;
            a[7] = l;
            a[8] = k;
            a[9] = f + 1;
            a[2] = null;
            a[1] = 8;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(11 === f) {
            return h = a[6], l = a[13], h = cljs.core.seq.call(null, h), a[13] = h, a[1] = h ? 13 : 14, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(12 === f) {
            return h = a[2], a[2] = h, a[1] = 9, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(13 === f) {
            return l = a[13], h = cljs.core.chunked_seq_QMARK_.call(null, l), a[1] = h ? 16 : 17, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(14 === f) {
            return a[2] = null, a[1] = 15, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(15 === f) {
            return h = a[2], a[2] = h, a[1] = 12, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(16 === f) {
            return l = a[13], h = cljs.core.chunk_first.call(null, l), l = cljs.core.chunk_rest.call(null, l), f = cljs.core.count.call(null, h), a[6] = l, a[7] = f, a[8] = h, a[9] = 0, a[2] = null, a[1] = 8, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(17 === f) {
            return l = a[13], h = cljs.core.first.call(null, l), h = cljs.core.async.muxch_STAR_.call(null, h), f = cljs.core.async.close_BANG_.call(null, h), h = cljs.core.next.call(null, l), a[14] = f, a[6] = h, a[7] = 0, a[8] = null, a[9] = 0, a[2] = null, a[1] = 8, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(18 === f) {
            return h = a[2], a[2] = h, a[1] = 15, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(19 === f) {
            return a[2] = null, a[1] = 24, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(20 === f) {
            return a[2] = null, a[1] = 21, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(21 === f) {
            return a[15] = a[2], a[2] = null, a[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(22 === f) {
            return h = a[2], a[2] = h, a[1] = 21, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(23 === f) {
            return l = a[11], h = a[2], l = cljs.core.swap_BANG_.call(null, g, cljs.core.dissoc, l), a[16] = h, a[2] = l, a[1] = 22, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(24 === f) {
            try {
              return k = a[10], h = a[5], m = cljs.core.async.muxch_STAR_.call(null, k), cljs.core.async.impl.ioc_helpers.put_BANG_.call(null, a, 25, m, h)
            }catch(n) {
              if(n instanceof Object) {
                return h = n, a[1] = 23, a[2] = h, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
              }
              if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
                throw n;
              }
              return null
            }
          }else {
            if(25 === f) {
              try {
                return l = a[2], h = a, h[2] = l, h[1] = 22, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
              }catch(w) {
                if(w instanceof Object) {
                  return h = w, a[1] = 23, a[2] = h, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
                }
                if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
                  throw w;
                }
                return null
              }
            }else {
              return null
            }
          }
        })
      }(), f = function() {
        var b = a.call(null);
        b[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = l;
        return b
      }();
      return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, f)
    });
    return k
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.sub = function() {
  var a = null, b = function(b, c, f) {
    return a.call(null, b, c, f, !0)
  }, c = function(a, b, c, g) {
    return cljs.core.async.sub_STAR_.call(null, a, b, c, g)
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
cljs.core.async.unsub = function(a, b, c) {
  return cljs.core.async.unsub_STAR_.call(null, a, b, c)
};
cljs.core.async.unsub_all = function() {
  var a = null, b = function(a) {
    return cljs.core.async.unsub_all_STAR_.call(null, a)
  }, c = function(a, b) {
    return cljs.core.async.unsub_all_STAR_.call(null, a, b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.async.map = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null)
  }, c = function(a, b, c) {
    var g = cljs.core.vec.call(null, b), h = cljs.core.async.chan.call(null, c), k = cljs.core.count.call(null, g);
    b = cljs.core.object_array.call(null, k);
    var l = cljs.core.async.chan.call(null, 1), m = cljs.core.atom.call(null, null), n = cljs.core.mapv.call(null, function(a, b, c, d, e, f) {
      return function(g) {
        return function(a, b, c, d, e, f) {
          return function(a) {
            d[g] = a;
            return 0 === cljs.core.swap_BANG_.call(null, f, cljs.core.dec) ? cljs.core.async.put_BANG_.call(null, e, java.util.Arrays.copyOf.call(null, d, c)) : null
          }
        }(a, b, c, d, e, f)
      }
    }(g, h, k, b, l, m), cljs.core.range.call(null, k)), p = cljs.core.async.chan.call(null, 1);
    cljs.core.async.impl.dispatch.run.call(null, function() {
      var b = function() {
        return function(a) {
          return function() {
            var b = null, c = function() {
              var a = Array(12);
              a[0] = b;
              a[1] = 1;
              return a
            }, d = function(b) {
              for(;;) {
                var c = a.call(null, b);
                if(!cljs.core.keyword_identical_QMARK_.call(null, c, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                  return c
                }
              }
            }, b = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return d.call(this, a)
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            b.cljs$core$IFn$_invoke$arity$0 = c;
            b.cljs$core$IFn$_invoke$arity$1 = d;
            return b
          }()
        }(function(b) {
          var c = b[1];
          if(1 === c) {
            return b[2] = null, b[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(2 === c) {
            var e = cljs.core.reset_BANG_.call(null, m, k);
            b[5] = e;
            b[6] = 0;
            b[2] = null;
            b[1] = 4;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(3 === c) {
            return e = b[2], cljs.core.async.impl.ioc_helpers.return_chan.call(null, b, e)
          }
          if(4 === c) {
            return e = b[6], e = e < k, cljs.core.truth_(e) ? b[1] = 6 : b[1] = 7, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(5 === c) {
            return b[7] = b[2], cljs.core.async.impl.ioc_helpers.take_BANG_.call(null, b, 12, l)
          }
          if(6 === c) {
            return b[2] = null, b[1] = 11, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(7 === c) {
            return b[2] = null, b[1] = 8, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(8 === c) {
            return e = b[2], b[2] = e, b[1] = 5, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(9 === c) {
            var e = b[6], f = b[2];
            b[6] = e + 1;
            b[8] = f;
            b[2] = null;
            b[1] = 4;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(10 === c) {
            return f = b[2], e = cljs.core.swap_BANG_.call(null, m, cljs.core.dec), b[9] = f, b[2] = e, b[1] = 9, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(11 === c) {
            try {
              var e = b[6], p = g.call(null, e), r = n.call(null, e), f = cljs.core.async.take_BANG_.call(null, p, r), e = b;
              e[2] = f;
              e[1] = 9;
              return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
            }catch(s) {
              if(s instanceof Object) {
                return b[1] = 10, b[2] = s, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
              }
              if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
                throw s;
              }
              return null
            }
          }else {
            return 12 === c ? (e = b[10], f = b[2], e = cljs.core.some.call(null, cljs.core.nil_QMARK_, f), b[10] = f, cljs.core.truth_(e) ? b[1] = 13 : b[1] = 14, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 13 === c ? (e = cljs.core.async.close_BANG_.call(null, h), b[2] = e, b[1] = 15, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 14 === c ? (e = b[10], e = cljs.core.apply.call(null, a, e), cljs.core.async.impl.ioc_helpers.put_BANG_.call(null, b, 16, h, e)) : 15 === 
            c ? (e = b[2], b[2] = e, b[1] = 3, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 16 === c ? (b[11] = b[2], b[2] = null, b[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
          }
        })
      }(), c = function() {
        var a = b.call(null);
        a[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = p;
        return a
      }();
      return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, c)
    });
    return h
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.merge = function() {
  var a = null, b = function(b) {
    return a.call(null, b, null)
  }, c = function(a, b) {
    var c = cljs.core.async.chan.call(null, b), g = cljs.core.async.chan.call(null, 1);
    cljs.core.async.impl.dispatch.run.call(null, function() {
      var b = function() {
        return function(a) {
          return function() {
            var b = null, c = function() {
              var a = Array(10);
              a[0] = b;
              a[1] = 1;
              return a
            }, d = function(b) {
              for(;;) {
                var c = a.call(null, b);
                if(!cljs.core.keyword_identical_QMARK_.call(null, c, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                  return c
                }
              }
            }, b = function(a) {
              switch(arguments.length) {
                case 0:
                  return c.call(this);
                case 1:
                  return d.call(this, a)
              }
              throw Error("Invalid arity: " + arguments.length);
            };
            b.cljs$core$IFn$_invoke$arity$0 = c;
            b.cljs$core$IFn$_invoke$arity$1 = d;
            return b
          }()
        }(function(b) {
          var e = b[1];
          if(1 === e) {
            var g = cljs.core.vec.call(null, a);
            b[5] = g;
            b[2] = null;
            b[1] = 2;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(2 === e) {
            var g = b[5], h = 0 < cljs.core.count.call(null, g);
            cljs.core.truth_(h) ? b[1] = 4 : b[1] = 5;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(3 === e) {
            return h = b[2], cljs.core.async.impl.ioc_helpers.return_chan.call(null, b, h)
          }
          if(4 === e) {
            return g = b[5], cljs.core.async.impl.ioc_helpers.ioc_alts_BANG_.call(null, b, 7, g)
          }
          if(5 === e) {
            return h = cljs.core.async.close_BANG_.call(null, c), b[2] = h, b[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(6 === e) {
            return h = b[2], b[2] = h, b[1] = 3, new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          if(7 === e) {
            var k = b[6], s = b[7], q = b[2], h = cljs.core.nth.call(null, q, 0, null), t = cljs.core.nth.call(null, q, 1, null);
            b[6] = q;
            b[8] = t;
            b[7] = h;
            cljs.core.truth_(null == h) ? b[1] = 8 : b[1] = 9;
            return new cljs.core.Keyword(null, "recur", "recur", 1122293407)
          }
          return 8 === e ? (k = b[6], g = b[5], t = b[8], s = b[7], h = function() {
            return function(a, b, c, d, e, f, g, h, k) {
              return function(b) {
                return cljs.core.not_EQ_.call(null, a, b)
              }
            }(t, s, k, g, k, g, t, s, e)
          }(), h = cljs.core.filterv.call(null, h, g), b[5] = h, b[2] = null, b[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 9 === e ? (s = b[7], cljs.core.async.impl.ioc_helpers.put_BANG_.call(null, b, 11, c, s)) : 10 === e ? (h = b[2], b[2] = h, b[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 11 === e ? (g = b[5], h = b[2], b[9] = h, b[5] = g, b[2] = null, b[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
        })
      }(), e = function() {
        var a = b.call(null);
        a[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = g;
        return a
      }();
      return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, e)
    });
    return c
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.async.into = function(a, b) {
  return cljs.core.async.reduce.call(null, cljs.core.conj, a, b)
};
var lucuma = {shadow_dom:{}};
lucuma.shadow_dom.create = function(a, b, c) {
  a = a.createShadowRoot();
  cljs.core.truth_(b) && (a.resetStyleInheritance = !0);
  cljs.core.truth_(c) && (a.applyAuthorStyles = !0);
  return a
};
lucuma.custom_elements = {};
lucuma.custom_elements.forbidden_names = cljs.core.PersistentHashSet.fromArray(["missing-glyph", null, "font-face-format", null, "font-face-src", null, "annotation-xml", null, "font-face-uri", null, "font-face", null, "font-face-name", null, "color-profile", null], !0);
lucuma.custom_elements.valid_name_QMARK_ = function(a) {
  var b = cljs.core.not_EQ_.call(null, -1, a.indexOf("-"));
  return b ? !cljs.core.contains_QMARK_.call(null, lucuma.custom_elements.forbidden_names, a) : b
};
lucuma.custom_elements.render_content = function() {
  var a = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), b = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), c = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), e = cljs.core.get.call(null, cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "hierarchy", "hierarchy", 3129050535), cljs.core.get_global_hierarchy.call(null));
  return new cljs.core.MultiFn("render-content", function(a) {
    return a instanceof HTMLTemplateElement ? HTMLTemplateElement : cljs.core.type.call(null, a)
  }, new cljs.core.Keyword(null, "default", "default", 2558708147), e, a, b, c, d)
}();
cljs.core._add_method.call(null, lucuma.custom_elements.render_content, String, function(a) {
  return a
});
void 0 !== HTMLTemplateElement && cljs.core._add_method.call(null, lucuma.custom_elements.render_content, HTMLTemplateElement, function(a) {
  return a.content.cloneNode(!0)
});
cljs.core._add_method.call(null, lucuma.custom_elements.render_content, new cljs.core.Keyword(null, "default", "default", 2558708147), function(a) {
  throw[cljs.core.str("No render-content implementation for "), cljs.core.str(a)].join("");
});
lucuma.custom_elements.append_content_BANG_ = function() {
  var a = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), b = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), c = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), e = cljs.core.get.call(null, cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "hierarchy", "hierarchy", 3129050535), cljs.core.get_global_hierarchy.call(null));
  return new cljs.core.MultiFn("append-content!", function(a, b) {
    return b instanceof HTMLElement ? HTMLElement : cljs.core.type.call(null, b)
  }, new cljs.core.Keyword(null, "default", "default", 2558708147), e, a, b, c, d)
}();
cljs.core._add_method.call(null, lucuma.custom_elements.append_content_BANG_, String, function(a, b) {
  return a.innerHTML = b
});
cljs.core._add_method.call(null, lucuma.custom_elements.append_content_BANG_, HTMLElement, function(a, b) {
  return a.appendChild(b)
});
cljs.core._add_method.call(null, lucuma.custom_elements.append_content_BANG_, DocumentFragment, function(a, b) {
  return a.appendChild(b)
});
cljs.core._add_method.call(null, lucuma.custom_elements.append_content_BANG_, new cljs.core.Keyword(null, "default", "default", 2558708147), function(a, b) {
  throw[cljs.core.str("No append! implementation for "), cljs.core.str(b)].join("");
});
lucuma.custom_elements.render_style = function() {
  var a = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), b = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), c = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), e = cljs.core.get.call(null, cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "hierarchy", "hierarchy", 3129050535), cljs.core.get_global_hierarchy.call(null));
  return new cljs.core.MultiFn("render-style", cljs.core.type, new cljs.core.Keyword(null, "default", "default", 2558708147), e, a, b, c, d)
}();
cljs.core._add_method.call(null, lucuma.custom_elements.render_style, String, function(a) {
  return a
});
cljs.core._add_method.call(null, lucuma.custom_elements.render_style, new cljs.core.Keyword(null, "default", "default", 2558708147), function(a) {
  throw[cljs.core.str("No render-style implementation for "), cljs.core.str(a)].join("");
});
lucuma.custom_elements.append_style_BANG_ = function() {
  var a = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), b = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), c = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), e = cljs.core.get.call(null, cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "hierarchy", "hierarchy", 3129050535), cljs.core.get_global_hierarchy.call(null));
  return new cljs.core.MultiFn("append-style!", function(a, b) {
    return b instanceof HTMLElement ? HTMLElement : cljs.core.type.call(null, b)
  }, new cljs.core.Keyword(null, "default", "default", 2558708147), e, a, b, c, d)
}();
cljs.core._add_method.call(null, lucuma.custom_elements.append_style_BANG_, String, function(a, b) {
  var c = document.createElement("style");
  c.textContent = b;
  return a.appendChild(c)
});
lucuma.custom_elements.render_then_append_BANG_ = function(a, b, c, d) {
  b = b.call(null, d);
  return cljs.core.truth_(b) ? c.call(null, a, b) : null
};
lucuma.custom_elements.invoke_if_fn = function(a) {
  return cljs.core.fn_QMARK_.call(null, a) ? a.call(null) : a
};
lucuma.custom_elements.create_shadow_root_BANG_ = function(a, b, c, d, e) {
  return cljs.core.truth_(cljs.core.truth_(c) ? c : b) ? (a = lucuma.shadow_dom.create.call(null, a, d, e), cljs.core.truth_(c) && lucuma.custom_elements.render_then_append_BANG_.call(null, a, lucuma.custom_elements.render_style, lucuma.custom_elements.append_style_BANG_, lucuma.custom_elements.invoke_if_fn.call(null, c)), cljs.core.truth_(b) ? lucuma.custom_elements.render_then_append_BANG_.call(null, a, lucuma.custom_elements.render_content, lucuma.custom_elements.append_content_BANG_, lucuma.custom_elements.invoke_if_fn.call(null, 
  b)) : null) : null
};
lucuma.custom_elements.find_prototype = function(a) {
  return cljs.core.truth_(a) ? Object.getPrototypeOf(document.createElement(a)) : HTMLElement.prototype
};
lucuma.custom_elements.call_with_this_argument = function(a, b, c) {
  return cljs.core.apply.call(null, a, cljs.core.conj.call(null, c, b))
};
lucuma.custom_elements.wrap_with_callback_this_value = function(a) {
  return function() {
    var b = function(b) {
      return lucuma.custom_elements.call_with_this_argument.call(null, a, this, b)
    }, c = function(a) {
      var c = null;
      0 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return b.call(this, c)
    };
    c.cljs$lang$maxFixedArity = 0;
    c.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return b(a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }()
};
lucuma.custom_elements.set_callback_BANG_ = function(a, b, c) {
  return cljs.core.truth_(c) ? a[b] = lucuma.custom_elements.wrap_with_callback_this_value.call(null, c) : null
};
lucuma.custom_elements.install_shadow_css_shim_when_needed = function(a, b, c) {
  return cljs.core.truth_(ShadowDOMPolyfill) ? cljs.core.truth_(c) ? Platform.ShadowCSS.shimStyling(a, b, c) : Platform.ShadowCSS.shimStyling(a, b) : null
};
lucuma.custom_elements.get_chan = function(a) {
  return a.chan
};
lucuma.custom_elements.initialize_BANG_ = function(a, b) {
  return function() {
    var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "apply-author-styles", "apply-author-styles", 4411190967)), e = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "reset-style-inheritance", "reset-style-inheritance", 1435321634)), f = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "style", "style", 1123684643)), g = cljs.core.get.call(null, c, new cljs.core.Keyword(null, 
    "content", "content", 1965434859));
    this.chan = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "chan-fn", "chan-fn", 1752792213), cljs.core.async.chan).call(null);
    lucuma.custom_elements.create_shadow_root_BANG_.call(null, this, g, f, e, d);
    cljs.core.truth_(f) && lucuma.custom_elements.install_shadow_css_shim_when_needed.call(null, this.shadowRoot, (new cljs.core.Keyword(null, "name", "name", 1017277949)).call(null, b), (new cljs.core.Keyword(null, "base-type", "base-type", 3446290472)).call(null, b));
    return cljs.core.truth_(a) ? lucuma.custom_elements.call_with_this_argument.call(null, a, this, cljs.core.PersistentVector.EMPTY) : null
  }
};
lucuma.custom_elements.attribute_changed_fn = function(a, b) {
  return function(c, d, e, f) {
    c = lucuma.custom_elements.get_chan.call(null, c);
    return cljs.core.contains_QMARK_.call(null, a, d) ? cljs.core.async.put_BANG_.call(null, c, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword("lucuma.custom-elements", "attribute", "lucuma.custom-elements/attribute", 2578035775), new cljs.core.Keyword(null, "name", "name", 1017277949), d, new cljs.core.Keyword(null, "before", "before", 3915985649), e, new cljs.core.Keyword(null, "after", "after", 1106639182), f], !0)) : cljs.core.contains_QMARK_.call(null, 
    b, d) ? cljs.core.async.put_BANG_.call(null, c, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword("lucuma.custom-elements", "handler", "lucuma.custom-elements/handler", 2989353357), new cljs.core.Keyword(null, "name", "name", 1017277949), d, new cljs.core.Keyword(null, "before", "before", 3915985649), e, new cljs.core.Keyword(null, "after", "after", 1106639182), f], !0)) : null
  }
};
lucuma.custom_elements.attribute_properties = function(a) {
  return cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "configurable", "configurable", 2184612523), !0, new cljs.core.Keyword(null, "enumerable", "enumerable", 4388194106), !0, new cljs.core.Keyword(null, "writable", "writable", 3462285074), !0, new cljs.core.Keyword(null, "get", "get", 1014006472), function() {
    return""
  }, new cljs.core.Keyword(null, "set", "set", 1014018004), function() {
    return""
  }], !0)
};
lucuma.custom_elements.create_prototype = function(a) {
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, c = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "handlers", "handlers", 1015973339)), d = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "methods", "methods", 1969438500)), e = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "attributes", "attributes", 1419549897)), f = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "left-view-fn", "left-view-fn", 4756847772)), 
  g = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "entered-view-fn", "entered-view-fn", 3505744396)), h = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "created-fn", "created-fn", 2383536447)), k = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "base-type", "base-type", 3446290472)), l = cljs.core.set.call(null, cljs.core.map.call(null, cljs.core.name, e)), m = cljs.core.set.call(null, cljs.core.map.call(null, function(a, b, c, d, e, f, g, h, k, l) {
    return function(a) {
      return[cljs.core.str("on"), cljs.core.str(cljs.core.name.call(null, a))].join("")
    }
  }(a, b, c, d, e, f, g, h, k, l), c)), b = Object.create(lucuma.custom_elements.find_prototype.call(null, k), cljs.core.map.call(null, function(a, b, c, d, e, f, g, h, k, l, m) {
    return function(a) {
      return cljs.core.clj__GT_js.call(null, lucuma.custom_elements.attribute_properties.call(null, a))
    }
  }(a, b, c, d, e, f, g, h, k, l, m), l));
  b.createdCallback = lucuma.custom_elements.initialize_BANG_.call(null, h, a);
  lucuma.custom_elements.set_callback_BANG_.call(null, b, "enteredViewCallback", g);
  lucuma.custom_elements.set_callback_BANG_.call(null, b, "leftViewCallback", f);
  lucuma.custom_elements.set_callback_BANG_.call(null, b, "attributeChangedCallback", lucuma.custom_elements.attribute_changed_fn.call(null, l, m));
  a = cljs.core.seq.call(null, d);
  d = null;
  for(g = f = 0;;) {
    if(g < f) {
      h = cljs.core._nth.call(null, d, g), b[cljs.core.name.call(null, cljs.core.key.call(null, h))] = lucuma.custom_elements.wrap_with_callback_this_value.call(null, cljs.core.val.call(null, h)), g += 1
    }else {
      if(a = cljs.core.seq.call(null, a)) {
        d = a, cljs.core.chunked_seq_QMARK_.call(null, d) ? (a = cljs.core.chunk_first.call(null, d), g = cljs.core.chunk_rest.call(null, d), d = a, f = cljs.core.count.call(null, a), a = g) : (a = cljs.core.first.call(null, d), b[cljs.core.name.call(null, cljs.core.key.call(null, a))] = lucuma.custom_elements.wrap_with_callback_this_value.call(null, cljs.core.val.call(null, a)), a = cljs.core.next.call(null, d), d = null, f = 0), g = 0
      }else {
        break
      }
    }
  }
  return b
};
lucuma.custom_elements.default_constructor_name = function(a) {
  a = clojure.string.split.call(null, a, /-/);
  return[cljs.core.str(clojure.string.upper_case.call(null, cljs.core.get.call(null, a, 0))), cljs.core.str(clojure.string.join.call(null, cljs.core.map.call(null, clojure.string.capitalize, cljs.core.subvec.call(null, a, 1))))].join("")
};
lucuma.custom_elements.register = function() {
  var a = null, b = function(b) {
    return a.call(null, (new cljs.core.Keyword(null, "name", "name", 1017277949)).call(null, b), b)
  }, c = function(a, b) {
    if(!cljs.core.truth_(lucuma.custom_elements.valid_name_QMARK_.call(null, a))) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "valid-name?", "valid-name?", -190511172, null), new cljs.core.Symbol(null, "n", "n", -1640531417, null))))].join(""));
    }
    var c = lucuma.custom_elements.create_prototype.call(null, b);
    document.register(a, cljs.core.clj__GT_js.call(null, cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "prototype", "prototype", 4710078612), c], !0), cljs.core.truth_((new cljs.core.Keyword(null, "base-type", "base-type", 3446290472)).call(null, b)) ? cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "extends", "extends", 4003207179), (new cljs.core.Keyword(null, "base-type", "base-type", 3446290472)).call(null, b)], !0) : null)));
    var g = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "constructor", "constructor", 3720465260), lucuma.custom_elements.default_constructor_name.call(null, a));
    return cljs.core.truth_(g) ? window[g] = c.constructor : null
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
lucuma.custom_elements.create = function() {
  var a = null, b = function(b) {
    return a.call(null, b, null)
  }, c = function(a, b) {
    return document.createElement(a, b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
var cemerick = {cljs:{}};
cemerick.cljs.test = {};
cemerick.cljs.test._STAR_report_counters_STAR_ = null;
cemerick.cljs.test._STAR_initial_report_counters_STAR_ = cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "test", "test", 1017460740), 0, new cljs.core.Keyword(null, "pass", "pass", 1017337731), 0, new cljs.core.Keyword(null, "fail", "fail", 1017039504), 0, new cljs.core.Keyword(null, "error", "error", 1110689146), 0], !0);
cemerick.cljs.test._STAR_testing_vars_STAR_ = cljs.core.list.call(null);
cemerick.cljs.test._STAR_testing_contexts_STAR_ = cljs.core.list.call(null);
cemerick.cljs.test._STAR_test_print_fn_STAR_ = null;
cemerick.cljs.test.registered_tests = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY);
cemerick.cljs.test.registered_test_hooks = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY);
cemerick.cljs.test.registered_fixtures = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY);
cemerick.cljs.test.register_test_BANG_ = function(a, b) {
  return cljs.core.swap_BANG_.call(null, cemerick.cljs.test.registered_tests, cljs.core.update_in, cljs.core.PersistentVector.fromArray([a], !0), cljs.core.fnil.call(null, cljs.core.conj, cljs.core.PersistentHashSet.EMPTY), b)
};
cemerick.cljs.test.register_test_ns_hook_BANG_ = function(a, b) {
  return cljs.core.swap_BANG_.call(null, cemerick.cljs.test.registered_test_hooks, cljs.core.assoc, a, b)
};
cemerick.cljs.test.testing_vars_str = function(a) {
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "line", "line", 1017226086));
  b = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "file", "file", 1017047278));
  return[cljs.core.str(cljs.core.pr_str.call(null, cljs.core.reverse.call(null, cemerick.cljs.test._STAR_testing_vars_STAR_))), cljs.core.str(" ("), cljs.core.str(b), cljs.core.str(":"), cljs.core.str(a), cljs.core.str(")")].join("")
};
cemerick.cljs.test.testing_contexts_str = function() {
  return cljs.core.apply.call(null, cljs.core.str, cljs.core.interpose.call(null, " ", cljs.core.reverse.call(null, cemerick.cljs.test._STAR_testing_contexts_STAR_)))
};
cemerick.cljs.test.inc_report_counter = function(a) {
  return cljs.core.truth_(cemerick.cljs.test._STAR_report_counters_STAR_) ? cljs.core.swap_BANG_.call(null, cemerick.cljs.test._STAR_report_counters_STAR_, cljs.core.update_in, cljs.core.PersistentVector.fromArray([a], !0), cljs.core.fnil.call(null, cljs.core.inc, 0)) : null
};
cemerick.cljs.test.report = function() {
  var a = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), b = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), c = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), e = cljs.core.get.call(null, cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "hierarchy", "hierarchy", 3129050535), cljs.core.get_global_hierarchy.call(null));
  return new cljs.core.MultiFn("report", new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "default", "default", 2558708147), e, a, b, c, d)
}();
cemerick.cljs.test.file_and_line = function(a) {
  return cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "file", "file", 1017047278), a.fileName, new cljs.core.Keyword(null, "line", "line", 1017226086), a.lineNumber], !0)
};
cemerick.cljs.test.do_report = function(a) {
  return cemerick.cljs.test.report.call(null, function() {
    var b = (new cljs.core.Keyword(null, "type", "type", 1017479852)).call(null, a);
    return cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "error", "error", 1110689146), b) ? cljs.core.merge.call(null, cemerick.cljs.test.file_and_line.call(null, (new cljs.core.Keyword(null, "actual", "actual", 3885931776)).call(null, a)), a) : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "fail", "fail", 1017039504), b) ? cljs.core.merge.call(null, cemerick.cljs.test.file_and_line.call(null, Error()), a) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? a : null
  }())
};
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "default", "default", 2558708147), function(a) {
  var b = cljs.core._STAR_print_fn_STAR_;
  try {
    var c = cljs.core, d;
    var e = cemerick.cljs.test._STAR_test_print_fn_STAR_;
    d = cljs.core.truth_(e) ? e : cljs.core._STAR_print_fn_STAR_;
    c._STAR_print_fn_STAR_ = d;
    return cljs.core.prn.call(null, a)
  }finally {
    cljs.core._STAR_print_fn_STAR_ = b
  }
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "pass", "pass", 1017337731), function(a) {
  a = cljs.core._STAR_print_fn_STAR_;
  try {
    var b = cljs.core, c;
    var d = cemerick.cljs.test._STAR_test_print_fn_STAR_;
    c = cljs.core.truth_(d) ? d : cljs.core._STAR_print_fn_STAR_;
    b._STAR_print_fn_STAR_ = c;
    return cemerick.cljs.test.inc_report_counter.call(null, new cljs.core.Keyword(null, "pass", "pass", 1017337731))
  }finally {
    cljs.core._STAR_print_fn_STAR_ = a
  }
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "fail", "fail", 1017039504), function(a) {
  var b = cljs.core._STAR_print_fn_STAR_;
  try {
    var c = cljs.core, d;
    var e = cemerick.cljs.test._STAR_test_print_fn_STAR_;
    d = cljs.core.truth_(e) ? e : cljs.core._STAR_print_fn_STAR_;
    c._STAR_print_fn_STAR_ = d;
    cemerick.cljs.test.inc_report_counter.call(null, new cljs.core.Keyword(null, "fail", "fail", 1017039504));
    cljs.core.println.call(null, "\nFAIL in", cemerick.cljs.test.testing_vars_str.call(null, a));
    cljs.core.seq.call(null, cemerick.cljs.test._STAR_testing_contexts_STAR_) && cljs.core.println.call(null, cemerick.cljs.test.testing_contexts_str.call(null));
    var f = (new cljs.core.Keyword(null, "message", "message", 1968829305)).call(null, a);
    cljs.core.truth_(f) && cljs.core.println.call(null, f);
    cljs.core.println.call(null, "expected:", cljs.core.pr_str.call(null, (new cljs.core.Keyword(null, "expected", "expected", 3373152810)).call(null, a)));
    return cljs.core.println.call(null, "  actual:", cljs.core.pr_str.call(null, (new cljs.core.Keyword(null, "actual", "actual", 3885931776)).call(null, a)))
  }finally {
    cljs.core._STAR_print_fn_STAR_ = b
  }
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "error", "error", 1110689146), function(a) {
  var b = cljs.core._STAR_print_fn_STAR_;
  try {
    var c = cljs.core, d;
    var e = cemerick.cljs.test._STAR_test_print_fn_STAR_;
    d = cljs.core.truth_(e) ? e : cljs.core._STAR_print_fn_STAR_;
    c._STAR_print_fn_STAR_ = d;
    cemerick.cljs.test.inc_report_counter.call(null, new cljs.core.Keyword(null, "error", "error", 1110689146));
    cljs.core.println.call(null, "\nERROR in", cemerick.cljs.test.testing_vars_str.call(null, a));
    cljs.core.seq.call(null, cemerick.cljs.test._STAR_testing_contexts_STAR_) && cljs.core.println.call(null, cemerick.cljs.test.testing_contexts_str.call(null));
    var f = (new cljs.core.Keyword(null, "message", "message", 1968829305)).call(null, a);
    cljs.core.truth_(f) && cljs.core.println.call(null, f);
    cljs.core.println.call(null, "expected:", cljs.core.pr_str.call(null, (new cljs.core.Keyword(null, "expected", "expected", 3373152810)).call(null, a)));
    cljs.core.print.call(null, "  actual: ");
    var g = (new cljs.core.Keyword(null, "actual", "actual", 3885931776)).call(null, a);
    return g instanceof Error ? cljs.core.println.call(null, g.stack) : cljs.core.prn.call(null, g)
  }finally {
    cljs.core._STAR_print_fn_STAR_ = b
  }
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "summary", "summary", 3451231E3), function(a) {
  var b = cljs.core._STAR_print_fn_STAR_;
  try {
    var c = cljs.core, d;
    var e = cemerick.cljs.test._STAR_test_print_fn_STAR_;
    d = cljs.core.truth_(e) ? e : cljs.core._STAR_print_fn_STAR_;
    c._STAR_print_fn_STAR_ = d;
    cljs.core.println.call(null, "\nRan", (new cljs.core.Keyword(null, "test", "test", 1017460740)).call(null, a), "tests containing", (new cljs.core.Keyword(null, "pass", "pass", 1017337731)).call(null, a) + (new cljs.core.Keyword(null, "fail", "fail", 1017039504)).call(null, a) + (new cljs.core.Keyword(null, "error", "error", 1110689146)).call(null, a), "assertions.");
    return cljs.core.println.call(null, (new cljs.core.Keyword(null, "fail", "fail", 1017039504)).call(null, a), "failures,", (new cljs.core.Keyword(null, "error", "error", 1110689146)).call(null, a), "errors.")
  }finally {
    cljs.core._STAR_print_fn_STAR_ = b
  }
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "begin-test-ns", "begin-test-ns", 1359210286), function(a) {
  var b = cljs.core._STAR_print_fn_STAR_;
  try {
    var c = cljs.core, d;
    var e = cemerick.cljs.test._STAR_test_print_fn_STAR_;
    d = cljs.core.truth_(e) ? e : cljs.core._STAR_print_fn_STAR_;
    c._STAR_print_fn_STAR_ = d;
    return cljs.core.println.call(null, "\nTesting", (new cljs.core.Keyword(null, "ns", "ns", 1013907767)).call(null, a))
  }finally {
    cljs.core._STAR_print_fn_STAR_ = b
  }
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "end-test-ns", "end-test-ns", 3401491808), function(a) {
  return null
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "begin-test-var", "begin-test-var", 3128464258), function(a) {
  return null
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "end-test-var", "end-test-var", 2014682E3), function(a) {
  return null
});
cemerick.cljs.test.register_fixtures_BANG_ = function() {
  var a = function(a, b, e) {
    return cljs.core.swap_BANG_.call(null, cemerick.cljs.test.registered_fixtures, cljs.core.update_in, cljs.core.PersistentVector.fromArray([a, b], !0), cljs.core.constantly.call(null, e))
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cemerick.cljs.test.default_fixture = function(a) {
  return a.call(null)
};
cemerick.cljs.test.compose_fixtures = function(a, b) {
  return function(c) {
    return a.call(null, function() {
      return b.call(null, c)
    })
  }
};
cemerick.cljs.test.join_fixtures = function(a) {
  return cljs.core.reduce.call(null, cemerick.cljs.test.compose_fixtures, cemerick.cljs.test.default_fixture, a)
};
cemerick.cljs.test.test_var = function(a) {
  if(!cljs.core.fn_QMARK_.call(null, a)) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("test-var must be passed the function to be tested (not a symbol naming it)"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "fn?", "fn?", -1640430032, null), new cljs.core.Symbol(null, "v", "v", -1640531409, null))))].join(""));
  }
  var b = (new cljs.core.Keyword(null, "test", "test", 1017460740)).call(null, cljs.core.meta.call(null, a));
  if(cljs.core.truth_(b)) {
    var c = cemerick.cljs.test._STAR_testing_vars_STAR_;
    try {
      cemerick.cljs.test._STAR_testing_vars_STAR_ = cljs.core.conj.call(null, cemerick.cljs.test._STAR_testing_vars_STAR_, function() {
        var b = (new cljs.core.Keyword(null, "name", "name", 1017277949)).call(null, cljs.core.meta.call(null, a));
        return cljs.core.truth_(b) ? b : a
      }());
      cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "begin-test-var", "begin-test-var", 3128464258), new cljs.core.Keyword(null, "var", "var", 1014020761), a], !0));
      cemerick.cljs.test.inc_report_counter.call(null, new cljs.core.Keyword(null, "test", "test", 1017460740));
      try {
        b.call(null)
      }catch(d) {
        if(d instanceof Error) {
          cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "error", "error", 1110689146), new cljs.core.Keyword(null, "message", "message", 1968829305), "Uncaught exception, not in assertion.", new cljs.core.Keyword(null, "expected", "expected", 3373152810), null, new cljs.core.Keyword(null, "actual", "actual", 3885931776), d], !0))
        }else {
          if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
            throw d;
          }
        }
      }
      return cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "end-test-var", "end-test-var", 2014682E3), new cljs.core.Keyword(null, "var", "var", 1014020761), a], !0))
    }finally {
      cemerick.cljs.test._STAR_testing_vars_STAR_ = c
    }
  }else {
    return null
  }
};
cemerick.cljs.test.test_all_vars = function(a) {
  var b = cemerick.cljs.test.join_fixtures.call(null, (new cljs.core.Keyword(null, "once", "once", 1017319923)).call(null, a.call(null, cljs.core.deref.call(null, cemerick.cljs.test.registered_fixtures)))), c = cemerick.cljs.test.join_fixtures.call(null, (new cljs.core.Keyword(null, "each", "each", 1017009523)).call(null, a.call(null, cljs.core.deref.call(null, cemerick.cljs.test.registered_fixtures))));
  return b.call(null, function() {
    for(var b = cljs.core.seq.call(null, cljs.core.get.call(null, cljs.core.deref.call(null, cemerick.cljs.test.registered_tests), a)), e = null, f = 0, g = 0;;) {
      if(g < f) {
        var h = cljs.core._nth.call(null, e, g);
        cljs.core.truth_((new cljs.core.Keyword(null, "test", "test", 1017460740)).call(null, cljs.core.meta.call(null, h))) && c.call(null, function(a, b, c, d, e) {
          return function() {
            return cemerick.cljs.test.test_var.call(null, e)
          }
        }(b, e, f, g, h));
        g += 1
      }else {
        var k = cljs.core.seq.call(null, b);
        if(k) {
          var l = k;
          cljs.core.chunked_seq_QMARK_.call(null, l) ? (b = cljs.core.chunk_first.call(null, l), f = cljs.core.chunk_rest.call(null, l), e = b, l = cljs.core.count.call(null, b), b = f, f = l) : (h = cljs.core.first.call(null, l), cljs.core.truth_((new cljs.core.Keyword(null, "test", "test", 1017460740)).call(null, cljs.core.meta.call(null, h))) && c.call(null, function(a, b, c, d, e, f, g) {
            return function() {
              return cemerick.cljs.test.test_var.call(null, e)
            }
          }(b, e, f, g, h, l, k)), b = cljs.core.next.call(null, l), e = null, f = 0);
          g = 0
        }else {
          return null
        }
      }
    }
  })
};
cemerick.cljs.test.test_ns = function(a) {
  var b = cemerick.cljs.test._STAR_report_counters_STAR_;
  try {
    cemerick.cljs.test._STAR_report_counters_STAR_ = cljs.core.atom.call(null, cemerick.cljs.test._STAR_initial_report_counters_STAR_);
    cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "begin-test-ns", "begin-test-ns", 1359210286), new cljs.core.Keyword(null, "ns", "ns", 1013907767), a], !0));
    var c = cljs.core.get.call(null, cljs.core.deref.call(null, cemerick.cljs.test.registered_test_hooks), a);
    cljs.core.truth_(c) ? c.call(null) : cemerick.cljs.test.test_all_vars.call(null, a);
    cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "end-test-ns", "end-test-ns", 3401491808), new cljs.core.Keyword(null, "ns", "ns", 1013907767), a], !0));
    return cljs.core.deref.call(null, cemerick.cljs.test._STAR_report_counters_STAR_)
  }finally {
    cemerick.cljs.test._STAR_report_counters_STAR_ = b
  }
};
cemerick.cljs.test.run_tests_STAR_ = function() {
  var a = function(a) {
    a = cljs.core.assoc.call(null, cljs.core.apply.call(null, cljs.core.merge_with, cljs.core._PLUS_, cljs.core.map.call(null, cemerick.cljs.test.test_ns, a)), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "summary", "summary", 3451231E3));
    cemerick.cljs.test.do_report.call(null, a);
    return a
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
goog.exportSymbol("cemerick.cljs.test.run_tests_STAR_", cemerick.cljs.test.run_tests_STAR_);
cemerick.cljs.test.run_all_tests = function() {
  var a = null, b = function() {
    return cljs.core.apply.call(null, cemerick.cljs.test.run_tests_STAR_, cljs.core.keys.call(null, cljs.core.deref.call(null, cemerick.cljs.test.registered_tests)))
  }, c = function(a) {
    return cljs.core.apply.call(null, cemerick.cljs.test.run_tests_STAR_, cljs.core.filter.call(null, function(b) {
      return cljs.core.re_matches.call(null, a, cljs.core.name.call(null, b))
    }, cljs.core.keys.call(null, cljs.core.deref.call(null, cemerick.cljs.test.registered_tests))))
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
goog.exportSymbol("cemerick.cljs.test.run_all_tests", cemerick.cljs.test.run_all_tests);
cemerick.cljs.test.successful_QMARK_ = function(a) {
  var b = 0 === (new cljs.core.Keyword(null, "fail", "fail", 1017039504)).call(null, a, 0);
  return b ? 0 === (new cljs.core.Keyword(null, "error", "error", 1110689146)).call(null, a, 0) : b
};
goog.exportSymbol("cemerick.cljs.test.successful_QMARK_", cemerick.cljs.test.successful_QMARK_);
cemerick.cljs.test.set_print_fn_BANG_ = function(a) {
  return cljs.core._STAR_print_fn_STAR_ = a
};
goog.exportSymbol("cemerick.cljs.test.set_print_fn_BANG_", cemerick.cljs.test.set_print_fn_BANG_);
lucuma.custom_elements_test = {};
lucuma.custom_elements_test.names = function() {
  return cemerick.cljs.test.test_var.call(null, lucuma.custom_elements_test.names)
};
lucuma.custom_elements_test.names = cljs.core.vary_meta.call(null, lucuma.custom_elements_test.names, cljs.core.assoc, new cljs.core.Keyword(null, "name", "name", 1017277949), new cljs.core.Symbol(null, "names", "names", -1535946495, null), new cljs.core.Keyword(null, "test", "test", 1017460740), function() {
  try {
    var a = cljs.core.list.call(null, "ex-name"), b = cljs.core.apply.call(null, lucuma.custom_elements.valid_name_QMARK_, a);
    cljs.core.truth_(b) ? cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.cons.call(null, lucuma.custom_elements.valid_name_QMARK_, a), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "pass", "pass", 1017337731), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol("ce", 
    "valid-name?", "ce/valid-name?", -190304458, null), "ex-name")], !0)) : cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.list.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.cons.call(null, new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), a)), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "fail", 
    "fail", 1017039504), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), "ex-name")], !0))
  }catch(c) {
    if(c instanceof Error) {
      cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), c, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "error", "error", 1110689146), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), "ex-name")], 
      !0))
    }else {
      if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
        throw c;
      }
    }
  }
  try {
    var d = cljs.core.list.call(null, "ex-name-name"), e = cljs.core.apply.call(null, lucuma.custom_elements.valid_name_QMARK_, d);
    cljs.core.truth_(e) ? cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.cons.call(null, lucuma.custom_elements.valid_name_QMARK_, d), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "pass", "pass", 1017337731), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol("ce", 
    "valid-name?", "ce/valid-name?", -190304458, null), "ex-name-name")], !0)) : cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.list.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.cons.call(null, new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), d)), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, 
    "fail", "fail", 1017039504), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), "ex-name-name")], !0))
  }catch(f) {
    if(f instanceof Error) {
      cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), f, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "error", "error", 1110689146), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), "ex-name-name")], 
      !0))
    }else {
      if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
        throw f;
      }
    }
  }
  try {
    var g = cljs.core.list.call(null, lucuma.custom_elements.valid_name_QMARK_.call(null, "name")), h = cljs.core.apply.call(null, cljs.core.not, g);
    cljs.core.truth_(h) ? cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.cons.call(null, cljs.core.not, g), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "pass", "pass", 1017337731), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, 
    "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), "name"))], !0)) : cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.list.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.cons.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), g)), new cljs.core.Keyword(null, "type", 
    "type", 1017479852), new cljs.core.Keyword(null, "fail", "fail", 1017039504), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), "name"))], !0))
  }catch(k) {
    if(k instanceof Error) {
      cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), k, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "error", "error", 1110689146), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("ce", 
      "valid-name?", "ce/valid-name?", -190304458, null), "name"))], !0))
    }else {
      if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
        throw k;
      }
    }
  }
  try {
    var l = cljs.core.list.call(null, lucuma.custom_elements.valid_name_QMARK_.call(null, "ex_name")), m = cljs.core.apply.call(null, cljs.core.not, l);
    cljs.core.truth_(m) ? cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.cons.call(null, cljs.core.not, l), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "pass", "pass", 1017337731), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, 
    "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), "ex_name"))], !0)) : cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.list.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.cons.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), l)), new cljs.core.Keyword(null, 
    "type", "type", 1017479852), new cljs.core.Keyword(null, "fail", "fail", 1017039504), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), "ex_name"))], !0))
  }catch(n) {
    if(n instanceof Error) {
      cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), n, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "error", "error", 1110689146), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("ce", 
      "valid-name?", "ce/valid-name?", -190304458, null), "ex_name"))], !0))
    }else {
      if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
        throw n;
      }
    }
  }
  try {
    var p = cljs.core.list.call(null, lucuma.custom_elements.valid_name_QMARK_.call(null, "color-profile")), r = cljs.core.apply.call(null, cljs.core.not, p);
    cljs.core.truth_(r) ? cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.cons.call(null, cljs.core.not, p), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "pass", "pass", 1017337731), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, 
    "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), "color-profile"))], !0)) : cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.list.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.cons.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), p)), new cljs.core.Keyword(null, 
    "type", "type", 1017479852), new cljs.core.Keyword(null, "fail", "fail", 1017039504), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("ce", "valid-name?", "ce/valid-name?", -190304458, null), "color-profile"))], !0));
    return r
  }catch(s) {
    if(s instanceof Error) {
      return cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), s, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "error", "error", 1110689146), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("ce", 
      "valid-name?", "ce/valid-name?", -190304458, null), "color-profile"))], !0))
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      throw s;
    }
    return null
  }
});
cemerick.cljs.test.register_test_BANG_.call(null, new cljs.core.Symbol(null, "lucuma.custom-elements-test", "lucuma.custom-elements-test", -265684476, null), lucuma.custom_elements_test.names);
lucuma.custom_elements_test.default_constructor_names = function() {
  return cemerick.cljs.test.test_var.call(null, lucuma.custom_elements_test.default_constructor_names)
};
lucuma.custom_elements_test.default_constructor_names = cljs.core.vary_meta.call(null, lucuma.custom_elements_test.default_constructor_names, cljs.core.assoc, new cljs.core.Keyword(null, "name", "name", 1017277949), new cljs.core.Symbol(null, "default-constructor-names", "default-constructor-names", -1566916382, null), new cljs.core.Keyword(null, "test", "test", 1017460740), function() {
  try {
    var a = cljs.core.list.call(null, "EXName", lucuma.custom_elements.default_constructor_name.call(null, "ex-name")), b = cljs.core.apply.call(null, cljs.core._EQ_, a);
    cljs.core.truth_(b) ? cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.cons.call(null, cljs.core._EQ_, a), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "pass", "pass", 1017337731), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, 
    "\x3d", "\x3d", -1640531466, null), "EXName", cljs.core.list(new cljs.core.Symbol("ce", "default-constructor-name", "ce/default-constructor-name", -2053598279, null), "ex-name"))], !0)) : cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.list.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.cons.call(null, new cljs.core.Symbol(null, "\x3d", "\x3d", -1640531466, 
    null), a)), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "fail", "fail", 1017039504), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "\x3d", "\x3d", -1640531466, null), "EXName", cljs.core.list(new cljs.core.Symbol("ce", "default-constructor-name", "ce/default-constructor-name", -2053598279, null), "ex-name"))], !0))
  }catch(c) {
    if(c instanceof Error) {
      cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), c, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "error", "error", 1110689146), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "\x3d", "\x3d", -1640531466, null), "EXName", cljs.core.list(new cljs.core.Symbol("ce", 
      "default-constructor-name", "ce/default-constructor-name", -2053598279, null), "ex-name"))], !0))
    }else {
      if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
        throw c;
      }
    }
  }
  try {
    var d = cljs.core.list.call(null, "EXComplexName", lucuma.custom_elements.default_constructor_name.call(null, "ex-complex-name")), e = cljs.core.apply.call(null, cljs.core._EQ_, d);
    cljs.core.truth_(e) ? cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.cons.call(null, cljs.core._EQ_, d), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "pass", "pass", 1017337731), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, 
    "\x3d", "\x3d", -1640531466, null), "EXComplexName", cljs.core.list(new cljs.core.Symbol("ce", "default-constructor-name", "ce/default-constructor-name", -2053598279, null), "ex-complex-name"))], !0)) : cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.list.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.cons.call(null, new cljs.core.Symbol(null, "\x3d", "\x3d", 
    -1640531466, null), d)), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "fail", "fail", 1017039504), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "\x3d", "\x3d", -1640531466, null), "EXComplexName", cljs.core.list(new cljs.core.Symbol("ce", "default-constructor-name", "ce/default-constructor-name", -2053598279, null), "ex-complex-name"))], 
    !0));
    return e
  }catch(f) {
    if(f instanceof Error) {
      return cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), f, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "error", "error", 1110689146), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "\x3d", "\x3d", -1640531466, null), "EXComplexName", 
      cljs.core.list(new cljs.core.Symbol("ce", "default-constructor-name", "ce/default-constructor-name", -2053598279, null), "ex-complex-name"))], !0))
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      throw f;
    }
    return null
  }
});
cemerick.cljs.test.register_test_BANG_.call(null, new cljs.core.Symbol(null, "lucuma.custom-elements-test", "lucuma.custom-elements-test", -265684476, null), lucuma.custom_elements_test.default_constructor_names);
lucuma.custom_elements_test.register = function() {
  return cemerick.cljs.test.test_var.call(null, lucuma.custom_elements_test.register)
};
lucuma.custom_elements_test.register = cljs.core.vary_meta.call(null, lucuma.custom_elements_test.register, cljs.core.assoc, new cljs.core.Keyword(null, "name", "name", 1017277949), new cljs.core.Symbol(null, "register", "register", 1964222556, null), new cljs.core.Keyword(null, "test", "test", 1017460740), function() {
  return null
});
cemerick.cljs.test.register_test_BANG_.call(null, new cljs.core.Symbol(null, "lucuma.custom-elements-test", "lucuma.custom-elements-test", -265684476, null), lucuma.custom_elements_test.register);
lucuma.custom_elements_test.create = function() {
  return cemerick.cljs.test.test_var.call(null, lucuma.custom_elements_test.create)
};
lucuma.custom_elements_test.create = cljs.core.vary_meta.call(null, lucuma.custom_elements_test.create, cljs.core.assoc, new cljs.core.Keyword(null, "name", "name", 1017277949), new cljs.core.Symbol(null, "create", "create", 1302141621, null), new cljs.core.Keyword(null, "test", "test", 1017460740), function() {
  return null
});
cemerick.cljs.test.register_test_BANG_.call(null, new cljs.core.Symbol(null, "lucuma.custom-elements-test", "lucuma.custom-elements-test", -265684476, null), lucuma.custom_elements_test.create);
goog.string.format = function(a, b) {
  var c = Array.prototype.slice.call(arguments), d = c.shift();
  if("undefined" == typeof d) {
    throw Error("[goog.string.format] Template required");
  }
  return d.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, d, h, k, l, m, n) {
    if("%" == l) {
      return"%"
    }
    var p = c.shift();
    if("undefined" == typeof p) {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = p;
    return goog.string.format.demuxes_[l].apply(null, arguments)
  })
};
goog.string.format.demuxes_ = {};
goog.string.format.demuxes_.s = function(a, b, c, d, e, f, g, h) {
  return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + goog.string.repeat(" ", c - a.length) : goog.string.repeat(" ", c - a.length) + a
};
goog.string.format.demuxes_.f = function(a, b, c, d, e, f, g, h) {
  d = a.toString();
  isNaN(e) || "" == e || (d = a.toFixed(e));
  f = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
  0 <= a && (d = f + d);
  if(isNaN(c) || d.length >= c) {
    return d
  }
  d = isNaN(e) ? Math.abs(a).toString() : Math.abs(a).toFixed(e);
  a = c - d.length - f.length;
  0 <= b.indexOf("-", 0) ? d = f + d + goog.string.repeat(" ", a) : (b = 0 <= b.indexOf("0", 0) ? "0" : " ", d = f + goog.string.repeat(b, a) + d);
  return d
};
goog.string.format.demuxes_.d = function(a, b, c, d, e, f, g, h) {
  return goog.string.format.demuxes_.f(parseInt(a, 10), b, c, d, 0, f, g, h)
};
goog.string.format.demuxes_.i = goog.string.format.demuxes_.d;
goog.string.format.demuxes_.u = goog.string.format.demuxes_.d;
var garden = {types:{}};
garden.types.CSSUnit = function(a, b, c, d) {
  this.unit = a;
  this.magnitude = b;
  this.__meta = c;
  this.__extmap = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2229667594;
  2 < arguments.length ? (this.__meta = c, this.__extmap = d) : this.__extmap = this.__meta = null
};
garden.types.CSSUnit.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
garden.types.CSSUnit.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
garden.types.CSSUnit.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "unit", "unit", 1017498870)) ? this.unit : cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682)) ? this.magnitude : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.get.call(null, this.__extmap, b, c) : null
};
garden.types.CSSUnit.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = cljs.core.keyword_identical_QMARK_;
  return a.call(null, new cljs.core.Keyword(null, "unit", "unit", 1017498870), b) ? new garden.types.CSSUnit(c, this.magnitude, this.__meta, this.__extmap, null) : a.call(null, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682), b) ? new garden.types.CSSUnit(this.unit, c, this.__meta, this.__extmap, null) : new garden.types.CSSUnit(this.unit, this.magnitude, this.__meta, cljs.core.assoc.call(null, this.__extmap, b, c), null)
};
garden.types.CSSUnit.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "#garden.types.CSSUnit{", ", ", "}", c, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, new cljs.core.Keyword(null, "unit", "unit", 1017498870), this.unit), cljs.core.vector.call(null, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682), this.magnitude)], !0), this.__extmap))
};
garden.types.CSSUnit.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
garden.types.CSSUnit.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, new cljs.core.Keyword(null, "unit", "unit", 1017498870), this.unit), cljs.core.vector.call(null, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682), this.magnitude)], !0), this.__extmap))
};
garden.types.CSSUnit.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2 + cljs.core.count.call(null, this.__extmap)
};
garden.types.CSSUnit.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(b)) {
      var c = a.constructor === b.constructor;
      return c ? cljs.core.equiv_map.call(null, a, b) : c
    }
    return b
  }()) ? !0 : !1
};
garden.types.CSSUnit.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new garden.types.CSSUnit(this.unit, this.magnitude, b, this.__extmap, this.__hash)
};
garden.types.CSSUnit.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.__meta
};
garden.types.CSSUnit.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  return cljs.core.contains_QMARK_.call(null, cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682), null, new cljs.core.Keyword(null, "unit", "unit", 1017498870), null], !0), b) ? cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, a), this.__meta), b) : new garden.types.CSSUnit(this.unit, this.magnitude, this.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, this.__extmap, 
  b)), null)
};
garden.types.CSSUnit.cljs$lang$type = !0;
garden.types.CSSUnit.cljs$lang$ctorPrSeq = function(a) {
  return cljs.core.list.call(null, "garden.types/CSSUnit")
};
garden.types.CSSUnit.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "garden.types/CSSUnit")
};
garden.types.__GT_CSSUnit = function(a, b) {
  return new garden.types.CSSUnit(a, b)
};
garden.types.map__GT_CSSUnit = function(a) {
  return new garden.types.CSSUnit((new cljs.core.Keyword(null, "unit", "unit", 1017498870)).call(null, a), (new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682)).call(null, a), null, cljs.core.dissoc.call(null, a, new cljs.core.Keyword(null, "unit", "unit", 1017498870), new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682)))
};
garden.types.CSSFunction = function(a, b, c, d) {
  this.function$ = a;
  this.args = b;
  this.__meta = c;
  this.__extmap = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2229667594;
  2 < arguments.length ? (this.__meta = c, this.__extmap = d) : this.__extmap = this.__meta = null
};
garden.types.CSSFunction.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
garden.types.CSSFunction.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
garden.types.CSSFunction.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "function", "function", 2394842954)) ? this.function$ : cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "args", "args", 1016906831)) ? this.args : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.get.call(null, this.__extmap, b, c) : null
};
garden.types.CSSFunction.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = cljs.core.keyword_identical_QMARK_;
  return a.call(null, new cljs.core.Keyword(null, "function", "function", 2394842954), b) ? new garden.types.CSSFunction(c, this.args, this.__meta, this.__extmap, null) : a.call(null, new cljs.core.Keyword(null, "args", "args", 1016906831), b) ? new garden.types.CSSFunction(this.function$, c, this.__meta, this.__extmap, null) : new garden.types.CSSFunction(this.function$, this.args, this.__meta, cljs.core.assoc.call(null, this.__extmap, b, c), null)
};
garden.types.CSSFunction.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "#garden.types.CSSFunction{", ", ", "}", c, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, new cljs.core.Keyword(null, "function", "function", 2394842954), this.function$), cljs.core.vector.call(null, new cljs.core.Keyword(null, "args", "args", 1016906831), this.args)], !0), this.__extmap))
};
garden.types.CSSFunction.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
garden.types.CSSFunction.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, new cljs.core.Keyword(null, "function", "function", 2394842954), this.function$), cljs.core.vector.call(null, new cljs.core.Keyword(null, "args", "args", 1016906831), this.args)], !0), this.__extmap))
};
garden.types.CSSFunction.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2 + cljs.core.count.call(null, this.__extmap)
};
garden.types.CSSFunction.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(b)) {
      var c = a.constructor === b.constructor;
      return c ? cljs.core.equiv_map.call(null, a, b) : c
    }
    return b
  }()) ? !0 : !1
};
garden.types.CSSFunction.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new garden.types.CSSFunction(this.function$, this.args, b, this.__extmap, this.__hash)
};
garden.types.CSSFunction.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.__meta
};
garden.types.CSSFunction.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  return cljs.core.contains_QMARK_.call(null, cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "args", "args", 1016906831), null, new cljs.core.Keyword(null, "function", "function", 2394842954), null], !0), b) ? cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, a), this.__meta), b) : new garden.types.CSSFunction(this.function$, this.args, this.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, 
  this.__extmap, b)), null)
};
garden.types.CSSFunction.cljs$lang$type = !0;
garden.types.CSSFunction.cljs$lang$ctorPrSeq = function(a) {
  return cljs.core.list.call(null, "garden.types/CSSFunction")
};
garden.types.CSSFunction.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "garden.types/CSSFunction")
};
garden.types.__GT_CSSFunction = function(a, b) {
  return new garden.types.CSSFunction(a, b)
};
garden.types.map__GT_CSSFunction = function(a) {
  return new garden.types.CSSFunction((new cljs.core.Keyword(null, "function", "function", 2394842954)).call(null, a), (new cljs.core.Keyword(null, "args", "args", 1016906831)).call(null, a), null, cljs.core.dissoc.call(null, a, new cljs.core.Keyword(null, "function", "function", 2394842954), new cljs.core.Keyword(null, "args", "args", 1016906831)))
};
garden.types.CSSAtRule = function(a, b, c, d) {
  this.identifier = a;
  this.value = b;
  this.__meta = c;
  this.__extmap = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2229667594;
  2 < arguments.length ? (this.__meta = c, this.__extmap = d) : this.__extmap = this.__meta = null
};
garden.types.CSSAtRule.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
garden.types.CSSAtRule.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
garden.types.CSSAtRule.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "identifier", "identifier", 3690438683)) ? this.identifier : cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "value", "value", 1125876963)) ? this.value : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.get.call(null, this.__extmap, b, c) : null
};
garden.types.CSSAtRule.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = cljs.core.keyword_identical_QMARK_;
  return a.call(null, new cljs.core.Keyword(null, "identifier", "identifier", 3690438683), b) ? new garden.types.CSSAtRule(c, this.value, this.__meta, this.__extmap, null) : a.call(null, new cljs.core.Keyword(null, "value", "value", 1125876963), b) ? new garden.types.CSSAtRule(this.identifier, c, this.__meta, this.__extmap, null) : new garden.types.CSSAtRule(this.identifier, this.value, this.__meta, cljs.core.assoc.call(null, this.__extmap, b, c), null)
};
garden.types.CSSAtRule.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "#garden.types.CSSAtRule{", ", ", "}", c, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, new cljs.core.Keyword(null, "identifier", "identifier", 3690438683), this.identifier), cljs.core.vector.call(null, new cljs.core.Keyword(null, "value", "value", 1125876963), this.value)], !0), this.__extmap))
};
garden.types.CSSAtRule.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
garden.types.CSSAtRule.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, new cljs.core.Keyword(null, "identifier", "identifier", 3690438683), this.identifier), cljs.core.vector.call(null, new cljs.core.Keyword(null, "value", "value", 1125876963), this.value)], !0), this.__extmap))
};
garden.types.CSSAtRule.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2 + cljs.core.count.call(null, this.__extmap)
};
garden.types.CSSAtRule.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(b)) {
      var c = a.constructor === b.constructor;
      return c ? cljs.core.equiv_map.call(null, a, b) : c
    }
    return b
  }()) ? !0 : !1
};
garden.types.CSSAtRule.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new garden.types.CSSAtRule(this.identifier, this.value, b, this.__extmap, this.__hash)
};
garden.types.CSSAtRule.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.__meta
};
garden.types.CSSAtRule.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  return cljs.core.contains_QMARK_.call(null, cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "identifier", "identifier", 3690438683), null, new cljs.core.Keyword(null, "value", "value", 1125876963), null], !0), b) ? cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, a), this.__meta), b) : new garden.types.CSSAtRule(this.identifier, this.value, this.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, 
  this.__extmap, b)), null)
};
garden.types.CSSAtRule.cljs$lang$type = !0;
garden.types.CSSAtRule.cljs$lang$ctorPrSeq = function(a) {
  return cljs.core.list.call(null, "garden.types/CSSAtRule")
};
garden.types.CSSAtRule.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "garden.types/CSSAtRule")
};
garden.types.__GT_CSSAtRule = function(a, b) {
  return new garden.types.CSSAtRule(a, b)
};
garden.types.map__GT_CSSAtRule = function(a) {
  return new garden.types.CSSAtRule((new cljs.core.Keyword(null, "identifier", "identifier", 3690438683)).call(null, a), (new cljs.core.Keyword(null, "value", "value", 1125876963)).call(null, a), null, cljs.core.dissoc.call(null, a, new cljs.core.Keyword(null, "identifier", "identifier", 3690438683), new cljs.core.Keyword(null, "value", "value", 1125876963)))
};
garden.util = {};
garden.util.format = function() {
  var a = function(a, b) {
    return cljs.core.apply.call(null, goog.string.format, a, b)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
garden.util.ToString = {};
garden.util.to_str = function(a) {
  if(a ? a.garden$util$ToString$to_str$arity$1 : a) {
    return a.garden$util$ToString$to_str$arity$1(a)
  }
  var b;
  b = garden.util.to_str[goog.typeOf(null == a ? null : a)];
  if(!b && (b = garden.util.to_str._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ToString.to-str", a);
  }
  return b.call(null, a)
};
garden.util.ToString["null"] = !0;
garden.util.to_str["null"] = function(a) {
  return""
};
garden.util.ToString._ = !0;
garden.util.to_str._ = function(a) {
  return"" + cljs.core.str(a)
};
cljs.core.Keyword.prototype.garden$util$ToString$ = !0;
cljs.core.Keyword.prototype.garden$util$ToString$to_str$arity$1 = function(a) {
  return cljs.core.name.call(null, a)
};
garden.util.as_str = function() {
  var a = function(a) {
    return cljs.core.apply.call(null, cljs.core.str, cljs.core.map.call(null, garden.util.to_str, a))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
garden.util.string__GT_int = function() {
  var a = function(a, b) {
    var e;
    e = cljs.core.nth.call(null, b, 0, null);
    e = cljs.core.truth_(e) ? e : 10;
    return parseInt(a, e)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
garden.util.int__GT_string = function() {
  var a = function(a, b) {
    var e;
    e = cljs.core.nth.call(null, b, 0, null);
    e = cljs.core.truth_(e) ? e : 10;
    return a.toString(e)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
garden.util.space_join = function(a) {
  return clojure.string.join.call(null, " ", cljs.core.map.call(null, garden.util.to_str, a))
};
garden.util.comma_join = function(a) {
  var b = function() {
    return function d(a) {
      return new cljs.core.LazySeq(null, function() {
        for(;;) {
          var b = cljs.core.seq.call(null, a);
          if(b) {
            if(cljs.core.chunked_seq_QMARK_.call(null, b)) {
              var g = cljs.core.chunk_first.call(null, b), h = cljs.core.count.call(null, g), k = cljs.core.chunk_buffer.call(null, h);
              a: {
                for(var l = 0;;) {
                  if(l < h) {
                    var m = cljs.core._nth.call(null, g, l);
                    cljs.core.chunk_append.call(null, k, cljs.core.sequential_QMARK_.call(null, m) ? garden.util.space_join.call(null, m) : garden.util.to_str.call(null, m));
                    l += 1
                  }else {
                    g = !0;
                    break a
                  }
                }
                g = void 0
              }
              return g ? cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, k), d.call(null, cljs.core.chunk_rest.call(null, b))) : cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, k), null)
            }
            k = cljs.core.first.call(null, b);
            return cljs.core.cons.call(null, cljs.core.sequential_QMARK_.call(null, k) ? garden.util.space_join.call(null, k) : garden.util.to_str.call(null, k), d.call(null, cljs.core.rest.call(null, b)))
          }
          return null
        }
      }, null, null)
    }.call(null, a)
  }();
  return clojure.string.join.call(null, ", ", b)
};
garden.util.wrap_quotes = function(a) {
  return[cljs.core.str('"'), cljs.core.str(a), cljs.core.str('"')].join("")
};
garden.util.hash_map_QMARK_ = function(a) {
  var b = cljs.core.map_QMARK_.call(null, a);
  b ? (a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 67108864) ? b : a.cljs$core$IRecord$, a = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IRecord, a)) : a = cljs.core.type_satisfies_.call(null, cljs.core.IRecord, a), a = !a) : a = b;
  return a
};
garden.util.rule_QMARK_ = cljs.core.vector_QMARK_;
garden.util.declaration_QMARK_ = garden.util.hash_map_QMARK_;
garden.util.at_rule_QMARK_ = function(a) {
  return a instanceof garden.types.CSSAtRule
};
garden.util.at_media_QMARK_ = function(a) {
  var b = garden.util.at_rule_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? cljs.core._EQ_.call(null, (new cljs.core.Keyword(null, "identifier", "identifier", 3690438683)).call(null, a), new cljs.core.Keyword(null, "media", "media", 1117676374)) : b
};
garden.util.at_keyframes_QMARK_ = function(a) {
  var b = garden.util.at_rule_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? cljs.core._EQ_.call(null, (new cljs.core.Keyword(null, "identifier", "identifier", 3690438683)).call(null, a), new cljs.core.Keyword(null, "keyframes", "keyframes", 3862205239)) : b
};
garden.util.at_import_QMARK_ = function(a) {
  var b = garden.util.at_rule_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? cljs.core._EQ_.call(null, (new cljs.core.Keyword(null, "identifier", "identifier", 3690438683)).call(null, a), new cljs.core.Keyword(null, "import", "import", 4124075799)) : b
};
garden.util.prefix = function(a, b) {
  var c = garden.util.to_str.call(null, a);
  return cljs.core._EQ_.call(null, "-", cljs.core.last.call(null, c)) ? [cljs.core.str(c), cljs.core.str(b)].join("") : [cljs.core.str(c), cljs.core.str("-"), cljs.core.str(b)].join("")
};
garden.util.vendor_prefix = function(a, b) {
  var c = garden.util.to_str.call(null, a);
  return cljs.core._EQ_.call(null, "-", cljs.core.first.call(null, c)) ? garden.util.prefix.call(null, c, b) : garden.util.prefix.call(null, [cljs.core.str("-"), cljs.core.str(c)].join(""), b)
};
garden.util.natural_QMARK_ = function(a) {
  var b = cljs.core.integer_QMARK_.call(null, a);
  return b ? 0 < a : b
};
garden.util.between_QMARK_ = function(a, b, c) {
  var d = a >= (b < c ? b : c);
  return d ? a <= (b > c ? b : c) : d
};
garden.util.clip = function(a, b, c) {
  b = a <= b ? cljs.core.PersistentVector.fromArray([a, b], !0) : cljs.core.PersistentVector.fromArray([b, a], !0);
  a = cljs.core.nth.call(null, b, 0, null);
  b = cljs.core.nth.call(null, b, 1, null);
  c = b < c ? b : c;
  return a > c ? a : c
};
garden.util.average = function() {
  var a = function(a, b, e) {
    return cljs.core.apply.call(null, cljs.core._PLUS_, a, b, e) / (2 + cljs.core.count.call(null, e))
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
garden.util.cartesian_product = function() {
  var a = function(a) {
    var b = cljs.core.vec.call(null, a), e = function(a) {
      return function h(b) {
        var c = function(a) {
          return function(b) {
            for(var c = cljs.core.count.call(null, b) - 1;;) {
              if(cljs.core._EQ_.call(null, c, -1)) {
                return null
              }
              var d = cljs.core.next.call(null, b.call(null, c));
              if(d) {
                return cljs.core.assoc.call(null, b, c, d)
              }
              d = c - 1;
              b = cljs.core.assoc.call(null, b, c, a.call(null, c));
              c = d
            }
          }
        }(a);
        return cljs.core.truth_(b) ? cljs.core.cons.call(null, cljs.core.map.call(null, cljs.core.first, b), new cljs.core.LazySeq(null, function(a, c) {
          return function() {
            return h.call(null, a.call(null, b))
          }
        }(c, a), null, null)) : null
      }
    }(b);
    return cljs.core.every_QMARK_.call(null, cljs.core.seq, a) ? new cljs.core.LazySeq(null, function() {
      return e.call(null, b)
    }, null, null) : null
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.reader = {};
cljs.reader.PushbackReader = {};
cljs.reader.read_char = function(a) {
  if(a ? a.cljs$reader$PushbackReader$read_char$arity$1 : a) {
    return a.cljs$reader$PushbackReader$read_char$arity$1(a)
  }
  var b;
  b = cljs.reader.read_char[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.reader.read_char._, !b)) {
    throw cljs.core.missing_protocol.call(null, "PushbackReader.read-char", a);
  }
  return b.call(null, a)
};
cljs.reader.unread = function(a, b) {
  if(a ? a.cljs$reader$PushbackReader$unread$arity$2 : a) {
    return a.cljs$reader$PushbackReader$unread$arity$2(a, b)
  }
  var c;
  c = cljs.reader.unread[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.reader.unread._, !c)) {
    throw cljs.core.missing_protocol.call(null, "PushbackReader.unread", a);
  }
  return c.call(null, a, b)
};
cljs.reader.StringPushbackReader = function(a, b, c) {
  this.s = a;
  this.buffer = b;
  this.idx = c
};
cljs.reader.StringPushbackReader.cljs$lang$type = !0;
cljs.reader.StringPushbackReader.cljs$lang$ctorStr = "cljs.reader/StringPushbackReader";
cljs.reader.StringPushbackReader.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.reader/StringPushbackReader")
};
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$ = !0;
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$read_char$arity$1 = function(a) {
  return 0 === this.buffer.length ? (this.idx += 1, this.s[this.idx]) : this.buffer.pop()
};
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$unread$arity$2 = function(a, b) {
  return this.buffer.push(b)
};
cljs.reader.__GT_StringPushbackReader = function(a, b, c) {
  return new cljs.reader.StringPushbackReader(a, b, c)
};
cljs.reader.push_back_reader = function(a) {
  return new cljs.reader.StringPushbackReader(a, [], -1)
};
cljs.reader.whitespace_QMARK_ = function(a) {
  var b = goog.string.isBreakingWhitespace(a);
  return cljs.core.truth_(b) ? b : "," === a
};
cljs.reader.numeric_QMARK_ = function(a) {
  return goog.string.isNumeric(a)
};
cljs.reader.comment_prefix_QMARK_ = function(a) {
  return";" === a
};
cljs.reader.number_literal_QMARK_ = function(a, b) {
  var c = cljs.reader.numeric_QMARK_.call(null, b);
  if(c) {
    return c
  }
  c = function() {
    var a = "+" === b;
    return a ? a : "-" === b
  }();
  return cljs.core.truth_(c) ? cljs.reader.numeric_QMARK_.call(null, function() {
    var b = cljs.reader.read_char.call(null, a);
    cljs.reader.unread.call(null, a, b);
    return b
  }()) : c
};
cljs.reader.reader_error = function() {
  var a = function(a, b) {
    throw Error(cljs.core.apply.call(null, cljs.core.str, b));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.reader.macro_terminating_QMARK_ = function(a) {
  var b = "#" !== a;
  return b && (b = "'" !== a) ? (b = ":" !== a) ? cljs.reader.macros.call(null, a) : b : b
};
cljs.reader.read_token = function(a, b) {
  for(var c = new goog.string.StringBuffer(b), d = cljs.reader.read_char.call(null, a);;) {
    var e;
    e = null == d;
    e || (e = (e = cljs.reader.whitespace_QMARK_.call(null, d)) ? e : cljs.reader.macro_terminating_QMARK_.call(null, d));
    if(e) {
      return cljs.reader.unread.call(null, a, d), c.toString()
    }
    c.append(d);
    d = cljs.reader.read_char.call(null, a)
  }
};
cljs.reader.skip_line = function(a, b) {
  for(;;) {
    var c = cljs.reader.read_char.call(null, a);
    var d = "n" === c;
    c = d ? d : (d = "r" === c) ? d : null == c;
    if(c) {
      return a
    }
  }
};
cljs.reader.int_pattern = cljs.core.re_pattern.call(null, "([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+)|0[0-9]+)(N)?");
cljs.reader.ratio_pattern = cljs.core.re_pattern.call(null, "([-+]?[0-9]+)/([0-9]+)");
cljs.reader.float_pattern = cljs.core.re_pattern.call(null, "([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?");
cljs.reader.symbol_pattern = cljs.core.re_pattern.call(null, "[:]?([^0-9/].*/)?([^0-9/][^/]*)");
cljs.reader.re_find_STAR_ = function(a, b) {
  var c = a.exec(b);
  return null == c ? null : 1 === c.length ? c[0] : c
};
cljs.reader.match_int = function(a) {
  a = cljs.reader.re_find_STAR_.call(null, cljs.reader.int_pattern, a);
  var b = a[2];
  var c = null == b, b = c ? c : 1 > b.length;
  return b ? (b = "-" === a[1] ? -1 : 1, c = cljs.core.truth_(a[3]) ? [a[3], 10] : cljs.core.truth_(a[4]) ? [a[4], 16] : cljs.core.truth_(a[5]) ? [a[5], 8] : cljs.core.truth_(a[7]) ? [a[7], parseInt(a[7])] : new cljs.core.Keyword(null, "default", "default", 2558708147) ? [null, null] : null, a = c[0], c = c[1], null == a ? null : b * parseInt(a, c)) : 0
};
cljs.reader.match_ratio = function(a) {
  a = cljs.reader.re_find_STAR_.call(null, cljs.reader.ratio_pattern, a);
  var b = a[2];
  return parseInt(a[1]) / parseInt(b)
};
cljs.reader.match_float = function(a) {
  return parseFloat(a)
};
cljs.reader.re_matches_STAR_ = function(a, b) {
  var c = a.exec(b), d;
  d = (d = null != c) ? c[0] === b : d;
  return d ? 1 === c.length ? c[0] : c : null
};
cljs.reader.match_number = function(a) {
  return cljs.core.truth_(cljs.reader.re_matches_STAR_.call(null, cljs.reader.int_pattern, a)) ? cljs.reader.match_int.call(null, a) : cljs.core.truth_(cljs.reader.re_matches_STAR_.call(null, cljs.reader.ratio_pattern, a)) ? cljs.reader.match_ratio.call(null, a) : cljs.core.truth_(cljs.reader.re_matches_STAR_.call(null, cljs.reader.float_pattern, a)) ? cljs.reader.match_float.call(null, a) : null
};
cljs.reader.escape_char_map = function(a) {
  if("t" === a) {
    return"\t"
  }
  if("r" === a) {
    return"\r"
  }
  if("n" === a) {
    return"\n"
  }
  if("\\" === a) {
    return"\\"
  }
  if('"' === a) {
    return'"'
  }
  if("b" === a) {
    return"\b"
  }
  if("f" === a) {
    return"\f"
  }
  new cljs.core.Keyword(null, "else", "else", 1017020587);
  return null
};
cljs.reader.read_2_chars = function(a) {
  return(new goog.string.StringBuffer(cljs.reader.read_char.call(null, a), cljs.reader.read_char.call(null, a))).toString()
};
cljs.reader.read_4_chars = function(a) {
  return(new goog.string.StringBuffer(cljs.reader.read_char.call(null, a), cljs.reader.read_char.call(null, a), cljs.reader.read_char.call(null, a), cljs.reader.read_char.call(null, a))).toString()
};
cljs.reader.unicode_2_pattern = cljs.core.re_pattern.call(null, "[0-9A-Fa-f]{2}");
cljs.reader.unicode_4_pattern = cljs.core.re_pattern.call(null, "[0-9A-Fa-f]{4}");
cljs.reader.validate_unicode_escape = function(a, b, c, d) {
  return cljs.core.truth_(cljs.core.re_matches.call(null, a, d)) ? d : cljs.reader.reader_error.call(null, b, "Unexpected unicode escape \\", c, d)
};
cljs.reader.make_unicode_char = function(a) {
  a = parseInt(a, 16);
  return String.fromCharCode(a)
};
cljs.reader.escape_char = function(a, b) {
  var c = cljs.reader.read_char.call(null, b), d = cljs.reader.escape_char_map.call(null, c);
  return cljs.core.truth_(d) ? d : "x" === c ? cljs.reader.make_unicode_char.call(null, cljs.reader.validate_unicode_escape.call(null, cljs.reader.unicode_2_pattern, b, c, cljs.reader.read_2_chars.call(null, b))) : "u" === c ? cljs.reader.make_unicode_char.call(null, cljs.reader.validate_unicode_escape.call(null, cljs.reader.unicode_4_pattern, b, c, cljs.reader.read_4_chars.call(null, b))) : cljs.reader.numeric_QMARK_.call(null, c) ? String.fromCharCode(c) : new cljs.core.Keyword(null, "else", "else", 
  1017020587) ? cljs.reader.reader_error.call(null, b, "Unexpected unicode escape \\", c) : null
};
cljs.reader.read_past = function(a, b) {
  for(var c = cljs.reader.read_char.call(null, b);;) {
    if(cljs.core.truth_(a.call(null, c))) {
      c = cljs.reader.read_char.call(null, b)
    }else {
      return c
    }
  }
};
cljs.reader.read_delimited_list = function(a, b, c) {
  for(var d = cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY);;) {
    var e = cljs.reader.read_past.call(null, cljs.reader.whitespace_QMARK_, b);
    cljs.core.truth_(e) || cljs.reader.reader_error.call(null, b, "EOF while reading");
    if(a === e) {
      return cljs.core.persistent_BANG_.call(null, d)
    }
    var f = cljs.reader.macros.call(null, e);
    cljs.core.truth_(f) ? e = f.call(null, b, e) : (cljs.reader.unread.call(null, b, e), e = cljs.reader.read.call(null, b, !0, null, c));
    d = e === b ? d : cljs.core.conj_BANG_.call(null, d, e)
  }
};
cljs.reader.not_implemented = function(a, b) {
  return cljs.reader.reader_error.call(null, a, "Reader for ", b, " not implemented yet")
};
cljs.reader.read_dispatch = function(a, b) {
  var c = cljs.reader.read_char.call(null, a), d = cljs.reader.dispatch_macros.call(null, c);
  if(cljs.core.truth_(d)) {
    return d.call(null, a, b)
  }
  d = cljs.reader.maybe_read_tagged_type.call(null, a, c);
  return cljs.core.truth_(d) ? d : cljs.reader.reader_error.call(null, a, "No dispatch macro for ", c)
};
cljs.reader.read_unmatched_delimiter = function(a, b) {
  return cljs.reader.reader_error.call(null, a, "Unmached delimiter ", b)
};
cljs.reader.read_list = function(a, b) {
  return cljs.core.apply.call(null, cljs.core.list, cljs.reader.read_delimited_list.call(null, ")", a, !0))
};
cljs.reader.read_comment = cljs.reader.skip_line;
cljs.reader.read_vector = function(a, b) {
  return cljs.reader.read_delimited_list.call(null, "]", a, !0)
};
cljs.reader.read_map = function(a, b) {
  var c = cljs.reader.read_delimited_list.call(null, "}", a, !0);
  cljs.core.odd_QMARK_.call(null, cljs.core.count.call(null, c)) && cljs.reader.reader_error.call(null, a, "Map literal must contain an even number of forms");
  return cljs.core.apply.call(null, cljs.core.hash_map, c)
};
cljs.reader.read_number = function(a, b) {
  for(var c = new goog.string.StringBuffer(b), d = cljs.reader.read_char.call(null, a);;) {
    if(cljs.core.truth_(function() {
      var a = null == d;
      return a ? a : (a = cljs.reader.whitespace_QMARK_.call(null, d)) ? a : cljs.reader.macros.call(null, d)
    }())) {
      cljs.reader.unread.call(null, a, d);
      var e = c.toString(), c = cljs.reader.match_number.call(null, e);
      return cljs.core.truth_(c) ? c : cljs.reader.reader_error.call(null, a, "Invalid number format [", e, "]")
    }
    c.append(d);
    d = e = cljs.reader.read_char.call(null, a)
  }
};
cljs.reader.read_string_STAR_ = function(a, b) {
  for(var c = new goog.string.StringBuffer, d = cljs.reader.read_char.call(null, a);;) {
    if(null == d) {
      return cljs.reader.reader_error.call(null, a, "EOF while reading")
    }
    if("\\" === d) {
      c.append(cljs.reader.escape_char.call(null, c, a)), d = cljs.reader.read_char.call(null, a)
    }else {
      if('"' === d) {
        return c.toString()
      }
      if(new cljs.core.Keyword(null, "default", "default", 2558708147)) {
        c.append(d), d = cljs.reader.read_char.call(null, a)
      }else {
        return null
      }
    }
  }
};
cljs.reader.special_symbols = function(a, b) {
  return"nil" === a ? null : "true" === a ? !0 : "false" === a ? !1 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? b : null
};
cljs.reader.read_symbol = function(a, b) {
  var c = cljs.reader.read_token.call(null, a, b);
  return cljs.core.truth_(goog.string.contains(c, "/")) ? cljs.core.symbol.call(null, cljs.core.subs.call(null, c, 0, c.indexOf("/")), cljs.core.subs.call(null, c, c.indexOf("/") + 1, c.length)) : cljs.reader.special_symbols.call(null, c, cljs.core.symbol.call(null, c))
};
cljs.reader.read_keyword = function(a, b) {
  var c = cljs.reader.read_token.call(null, a, cljs.reader.read_char.call(null, a)), c = cljs.reader.re_matches_STAR_.call(null, cljs.reader.symbol_pattern, c), d = c[0], e = c[1], f = c[2];
  return cljs.core.truth_(function() {
    var a;
    a = (a = void 0 !== e) ? ":/" === e.substring(e.length - 2, e.length) : a;
    return cljs.core.truth_(a) ? a : (a = ":" === f[f.length - 1]) ? a : -1 !== d.indexOf("::", 1)
  }()) ? cljs.reader.reader_error.call(null, a, "Invalid token: ", d) : function() {
    var a = null != e;
    return a ? 0 < e.length : a
  }() ? cljs.core.keyword.call(null, e.substring(0, e.indexOf("/")), f) : cljs.core.keyword.call(null, d)
};
cljs.reader.desugar_meta = function(a) {
  return a instanceof cljs.core.Symbol ? cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "tag", "tag", 1014018828), a], !0) : "string" === typeof a ? cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "tag", "tag", 1014018828), a], !0) : a instanceof cljs.core.Keyword ? cljs.core.PersistentArrayMap.fromArray([a, !0], !0) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? a : null
};
cljs.reader.wrapping_reader = function(a) {
  return function(b, c) {
    return cljs.core.list.call(null, a, cljs.reader.read.call(null, b, !0, null, !0))
  }
};
cljs.reader.throwing_reader = function(a) {
  return function(b, c) {
    return cljs.reader.reader_error.call(null, b, a)
  }
};
cljs.reader.read_meta = function(a, b) {
  var c = cljs.reader.desugar_meta.call(null, cljs.reader.read.call(null, a, !0, null, !0));
  cljs.core.map_QMARK_.call(null, c) || cljs.reader.reader_error.call(null, a, "Metadata must be Symbol,Keyword,String or Map");
  var d = cljs.reader.read.call(null, a, !0, null, !0), e;
  d ? (e = (e = d.cljs$lang$protocol_mask$partition0$ & 262144) ? e : d.cljs$core$IWithMeta$, e = e ? !0 : d.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IWithMeta, d)) : e = cljs.core.type_satisfies_.call(null, cljs.core.IWithMeta, d);
  return e ? cljs.core.with_meta.call(null, d, cljs.core.merge.call(null, cljs.core.meta.call(null, d), c)) : cljs.reader.reader_error.call(null, a, "Metadata can only be applied to IWithMetas")
};
cljs.reader.read_set = function(a, b) {
  return cljs.core.set.call(null, cljs.reader.read_delimited_list.call(null, "}", a, !0))
};
cljs.reader.read_regex = function(a, b) {
  return cljs.core.re_pattern.call(null, cljs.reader.read_string_STAR_.call(null, a, b))
};
cljs.reader.read_discard = function(a, b) {
  cljs.reader.read.call(null, a, !0, null, !0);
  return a
};
cljs.reader.macros = function(a) {
  if('"' === a) {
    return cljs.reader.read_string_STAR_
  }
  if(":" === a) {
    return cljs.reader.read_keyword
  }
  if(";" === a) {
    return cljs.reader.not_implemented
  }
  if("'" === a) {
    return cljs.reader.wrapping_reader.call(null, new cljs.core.Symbol(null, "quote", "quote", -1532577739, null))
  }
  if("@" === a) {
    return cljs.reader.wrapping_reader.call(null, new cljs.core.Symbol(null, "deref", "deref", -1545057749, null))
  }
  if("^" === a) {
    return cljs.reader.read_meta
  }
  if("`" === a || "~" === a) {
    return cljs.reader.not_implemented
  }
  if("(" === a) {
    return cljs.reader.read_list
  }
  if(")" === a) {
    return cljs.reader.read_unmatched_delimiter
  }
  if("[" === a) {
    return cljs.reader.read_vector
  }
  if("]" === a) {
    return cljs.reader.read_unmatched_delimiter
  }
  if("{" === a) {
    return cljs.reader.read_map
  }
  if("}" === a) {
    return cljs.reader.read_unmatched_delimiter
  }
  if("\\" === a) {
    return cljs.reader.read_char
  }
  if("#" === a) {
    return cljs.reader.read_dispatch
  }
  new cljs.core.Keyword(null, "else", "else", 1017020587);
  return null
};
cljs.reader.dispatch_macros = function(a) {
  if("{" === a) {
    return cljs.reader.read_set
  }
  if("\x3c" === a) {
    return cljs.reader.throwing_reader.call(null, "Unreadable form")
  }
  if('"' === a) {
    return cljs.reader.read_regex
  }
  if("!" === a) {
    return cljs.reader.read_comment
  }
  if("_" === a) {
    return cljs.reader.read_discard
  }
  new cljs.core.Keyword(null, "else", "else", 1017020587);
  return null
};
cljs.reader.read = function(a, b, c, d) {
  for(;;) {
    d = cljs.reader.read_char.call(null, a);
    if(null == d) {
      return cljs.core.truth_(b) ? cljs.reader.reader_error.call(null, a, "EOF while reading") : c
    }
    if(!cljs.reader.whitespace_QMARK_.call(null, d)) {
      if(cljs.reader.comment_prefix_QMARK_.call(null, d)) {
        a = cljs.reader.read_comment.call(null, a, d)
      }else {
        if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
          var e = cljs.reader.macros.call(null, d);
          d = cljs.core.truth_(e) ? e.call(null, a, d) : cljs.reader.number_literal_QMARK_.call(null, a, d) ? cljs.reader.read_number.call(null, a, d) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.reader.read_symbol.call(null, a, d) : null;
          if(d !== a) {
            return d
          }
        }else {
          return null
        }
      }
    }
  }
};
cljs.reader.read_string = function(a) {
  a = cljs.reader.push_back_reader.call(null, a);
  return cljs.reader.read.call(null, a, !0, null, !1)
};
cljs.reader.zero_fill_right_and_truncate = function(a, b) {
  if(cljs.core._EQ_.call(null, b, cljs.core.count.call(null, a))) {
    return a
  }
  if(b < cljs.core.count.call(null, a)) {
    return cljs.core.subs.call(null, a, 0, b)
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    for(var c = new goog.string.StringBuffer(a);;) {
      if(c.getLength() < b) {
        c = c.append("0")
      }else {
        return c.toString()
      }
    }
  }else {
    return null
  }
};
cljs.reader.divisible_QMARK_ = function(a, b) {
  return 0 === cljs.core.mod.call(null, a, b)
};
cljs.reader.indivisible_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.reader.divisible_QMARK_.call(null, a, b))
};
cljs.reader.leap_year_QMARK_ = function(a) {
  var b = cljs.reader.divisible_QMARK_.call(null, a, 4);
  return cljs.core.truth_(b) ? (b = cljs.reader.indivisible_QMARK_.call(null, a, 100), cljs.core.truth_(b) ? b : cljs.reader.divisible_QMARK_.call(null, a, 400)) : b
};
cljs.reader.days_in_month = function() {
  var a = cljs.core.PersistentVector.fromArray([null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], !0), b = cljs.core.PersistentVector.fromArray([null, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], !0);
  return function(c, d) {
    return cljs.core.get.call(null, cljs.core.truth_(d) ? b : a, c)
  }
}();
cljs.reader.timestamp_regex = /(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;
cljs.reader.parse_int = function(a) {
  a = parseInt(a);
  return cljs.core.not.call(null, isNaN(a)) ? a : null
};
cljs.reader.check = function(a, b, c, d) {
  var e = a <= b;
  (e ? b <= c : e) || cljs.reader.reader_error.call(null, null, [cljs.core.str(d), cljs.core.str(" Failed:  "), cljs.core.str(a), cljs.core.str("\x3c\x3d"), cljs.core.str(b), cljs.core.str("\x3c\x3d"), cljs.core.str(c)].join(""));
  return b
};
cljs.reader.parse_and_validate_timestamp = function(a) {
  var b = cljs.core.re_matches.call(null, cljs.reader.timestamp_regex, a);
  cljs.core.nth.call(null, b, 0, null);
  var c = cljs.core.nth.call(null, b, 1, null), d = cljs.core.nth.call(null, b, 2, null), e = cljs.core.nth.call(null, b, 3, null), f = cljs.core.nth.call(null, b, 4, null), g = cljs.core.nth.call(null, b, 5, null), h = cljs.core.nth.call(null, b, 6, null), k = cljs.core.nth.call(null, b, 7, null), l = cljs.core.nth.call(null, b, 8, null), m = cljs.core.nth.call(null, b, 9, null), n = cljs.core.nth.call(null, b, 10, null);
  if(cljs.core.not.call(null, b)) {
    return cljs.reader.reader_error.call(null, null, [cljs.core.str("Unrecognized date/time syntax: "), cljs.core.str(a)].join(""))
  }
  a = cljs.reader.parse_int.call(null, c);
  var b = function() {
    var a = cljs.reader.parse_int.call(null, d);
    return cljs.core.truth_(a) ? a : 1
  }(), c = function() {
    var a = cljs.reader.parse_int.call(null, e);
    return cljs.core.truth_(a) ? a : 1
  }(), p = function() {
    var a = cljs.reader.parse_int.call(null, f);
    return cljs.core.truth_(a) ? a : 0
  }(), r = function() {
    var a = cljs.reader.parse_int.call(null, g);
    return cljs.core.truth_(a) ? a : 0
  }(), s = function() {
    var a = cljs.reader.parse_int.call(null, h);
    return cljs.core.truth_(a) ? a : 0
  }(), q = function() {
    var a = cljs.reader.parse_int.call(null, cljs.reader.zero_fill_right_and_truncate.call(null, k, 3));
    return cljs.core.truth_(a) ? a : 0
  }(), l = cljs.core._EQ_.call(null, l, "-") ? -1 : 1, t = function() {
    var a = cljs.reader.parse_int.call(null, m);
    return cljs.core.truth_(a) ? a : 0
  }(), u = function() {
    var a = cljs.reader.parse_int.call(null, n);
    return cljs.core.truth_(a) ? a : 0
  }(), l = l * (60 * t + u);
  return cljs.core.PersistentVector.fromArray([a, cljs.reader.check.call(null, 1, b, 12, "timestamp month field must be in range 1..12"), cljs.reader.check.call(null, 1, c, cljs.reader.days_in_month.call(null, b, cljs.reader.leap_year_QMARK_.call(null, a)), "timestamp day field must be in range 1..last day in month"), cljs.reader.check.call(null, 0, p, 23, "timestamp hour field must be in range 0..23"), cljs.reader.check.call(null, 0, r, 59, "timestamp minute field must be in range 0..59"), cljs.reader.check.call(null, 
  0, s, cljs.core._EQ_.call(null, r, 59) ? 60 : 59, "timestamp second field must be in range 0..60"), cljs.reader.check.call(null, 0, q, 999, "timestamp millisecond field must be in range 0..999"), l], !0)
};
cljs.reader.parse_timestamp = function(a) {
  var b = cljs.reader.parse_and_validate_timestamp.call(null, a);
  if(cljs.core.truth_(b)) {
    a = cljs.core.nth.call(null, b, 0, null);
    var c = cljs.core.nth.call(null, b, 1, null), d = cljs.core.nth.call(null, b, 2, null), e = cljs.core.nth.call(null, b, 3, null), f = cljs.core.nth.call(null, b, 4, null), g = cljs.core.nth.call(null, b, 5, null), h = cljs.core.nth.call(null, b, 6, null), b = cljs.core.nth.call(null, b, 7, null);
    return new Date(Date.UTC(a, c - 1, d, e, f, g, h) - 6E4 * b)
  }
  return cljs.reader.reader_error.call(null, null, [cljs.core.str("Unrecognized date/time syntax: "), cljs.core.str(a)].join(""))
};
cljs.reader.read_date = function(a) {
  return"string" === typeof a ? cljs.reader.parse_timestamp.call(null, a) : cljs.reader.reader_error.call(null, null, "Instance literal expects a string for its timestamp.")
};
cljs.reader.read_queue = function(a) {
  return cljs.core.vector_QMARK_.call(null, a) ? cljs.core.into.call(null, cljs.core.PersistentQueue.EMPTY, a) : cljs.reader.reader_error.call(null, null, "Queue literal expects a vector for its elements.")
};
cljs.reader.read_uuid = function(a) {
  return"string" === typeof a ? new cljs.core.UUID(a) : cljs.reader.reader_error.call(null, null, "UUID literal expects a string as its representation.")
};
cljs.reader._STAR_tag_table_STAR_ = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.fromArray(["inst", cljs.reader.read_date, "uuid", cljs.reader.read_uuid, "queue", cljs.reader.read_queue], !0));
cljs.reader._STAR_default_data_reader_fn_STAR_ = cljs.core.atom.call(null, null);
cljs.reader.maybe_read_tagged_type = function(a, b) {
  var c = cljs.reader.read_symbol.call(null, a, b), d = cljs.core.get.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_), "" + cljs.core.str(c)), e = cljs.core.deref.call(null, cljs.reader._STAR_default_data_reader_fn_STAR_);
  return cljs.core.truth_(d) ? d.call(null, cljs.reader.read.call(null, a, !0, null, !1)) : cljs.core.truth_(e) ? e.call(null, c, cljs.reader.read.call(null, a, !0, null, !1)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.reader.reader_error.call(null, a, "Could not find tag parser for ", "" + cljs.core.str(c), " in ", cljs.core.pr_str.call(null, cljs.core.keys.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_)))) : null
};
cljs.reader.register_tag_parser_BANG_ = function(a, b) {
  var c = "" + cljs.core.str(a), d = cljs.core.get.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_), c);
  cljs.core.swap_BANG_.call(null, cljs.reader._STAR_tag_table_STAR_, cljs.core.assoc, c, b);
  return d
};
cljs.reader.deregister_tag_parser_BANG_ = function(a) {
  a = "" + cljs.core.str(a);
  var b = cljs.core.get.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_), a);
  cljs.core.swap_BANG_.call(null, cljs.reader._STAR_tag_table_STAR_, cljs.core.dissoc, a);
  return b
};
cljs.reader.register_default_tag_parser_BANG_ = function(a) {
  var b = cljs.core.deref.call(null, cljs.reader._STAR_default_data_reader_fn_STAR_);
  cljs.core.swap_BANG_.call(null, cljs.reader._STAR_default_data_reader_fn_STAR_, function(b) {
    return a
  });
  return b
};
cljs.reader.deregister_default_tag_parser_BANG_ = function() {
  var a = cljs.core.deref.call(null, cljs.reader._STAR_default_data_reader_fn_STAR_);
  cljs.core.swap_BANG_.call(null, cljs.reader._STAR_default_data_reader_fn_STAR_, function(a) {
    return null
  });
  return a
};
garden.units = {};
garden.units.length_units = cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "in", "in", 1013907607), null, cljs.core.keyword.call(null, "%"), null, new cljs.core.Keyword(null, "px", "px", 1013907834), null, new cljs.core.Keyword(null, "cm", "cm", 1013907420), null, new cljs.core.Keyword(null, "pt", "pt", 1013907830), null, new cljs.core.Keyword(null, "mm", "mm", 1013907730), null, new cljs.core.Keyword(null, "pc", "pc", 1013907813), null], !0);
garden.units.angular_units = cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "rad", "rad", 1014016903), null, new cljs.core.Keyword(null, "deg", "deg", 1014003576), null, new cljs.core.Keyword(null, "grad", "grad", 1017085376), null, new cljs.core.Keyword(null, "turn", "turn", 1017476079), null], !0);
garden.units.time_units = cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "ms", "ms", 1013907736), null, new cljs.core.Keyword(null, "s", "s", 1013904357), null], !0);
garden.units.frequency_units = cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "kHz", "kHz", 1014009423), null, new cljs.core.Keyword(null, "Hz", "Hz", 1013906596), null], !0);
garden.units.resolution_units = cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "dppx", "dppx", 1016994566), null, new cljs.core.Keyword(null, "dpi", "dpi", 1014003919), null, new cljs.core.Keyword(null, "dpcm", "dpcm", 1016994152), null], !0);
garden.units.unit_QMARK_ = function(a) {
  return a instanceof garden.types.CSSUnit
};
garden.units.length_QMARK_ = function(a) {
  var b = garden.units.unit_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? cljs.core.contains_QMARK_.call(null, garden.units.length_units, (new cljs.core.Keyword(null, "unit", "unit", 1017498870)).call(null, a)) : b
};
garden.units.angle_QMARK_ = function(a) {
  var b = garden.units.unit_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? cljs.core.contains_QMARK_.call(null, garden.units.angular_units, (new cljs.core.Keyword(null, "unit", "unit", 1017498870)).call(null, a)) : b
};
garden.units.time_QMARK_ = function(a) {
  var b = garden.units.unit_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? cljs.core.contains_QMARK_.call(null, garden.units.time_units, (new cljs.core.Keyword(null, "unit", "unit", 1017498870)).call(null, a)) : b
};
garden.units.frequency_QMARK_ = function(a) {
  var b = garden.units.unit_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? cljs.core.contains_QMARK_.call(null, garden.units.frequency_units, (new cljs.core.Keyword(null, "unit", "unit", 1017498870)).call(null, a)) : b
};
garden.units.resolution_QMARK_ = function(a) {
  var b = garden.units.unit_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? cljs.core.contains_QMARK_.call(null, garden.units.resolution_units, (new cljs.core.Keyword(null, "unit", "unit", 1017498870)).call(null, a)) : b
};
garden.units.conversions = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null, "in", "in", 1013907607), new cljs.core.Keyword(null, "rad", "rad", 1014016903), new cljs.core.Keyword(null, "kHz", "kHz", 1014009423), new cljs.core.Keyword(null, "px", "px", 1013907834), new cljs.core.Keyword(null, "Hz", "Hz", 1013906596), new cljs.core.Keyword(null, "cm", "cm", 1013907420), new cljs.core.Keyword(null, "deg", "deg", 1014003576), new cljs.core.Keyword(null, "pt", "pt", 1013907830), new cljs.core.Keyword(null, 
"mm", "mm", 1013907730), new cljs.core.Keyword(null, "grad", "grad", 1017085376), new cljs.core.Keyword(null, "ms", "ms", 1013907736), new cljs.core.Keyword(null, "turn", "turn", 1017476079), new cljs.core.Keyword(null, "s", "s", 1013904357), new cljs.core.Keyword(null, "pc", "pc", 1013907813)], [cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "in", "in", 1013907607), 1, new cljs.core.Keyword(null, "cm", "cm", 1013907420), 2.54, new cljs.core.Keyword(null, "pc", "pc", 1013907813), 
6, new cljs.core.Keyword(null, "mm", "mm", 1013907730), 25.4, new cljs.core.Keyword(null, "pt", "pt", 1013907830), 72, new cljs.core.Keyword(null, "px", "px", 1013907834), 96], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "rad", "rad", 1014016903), 1, new cljs.core.Keyword(null, "turn", "turn", 1017476079), 0.159154943], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "kHz", "kHz", 1014009423), 1], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, 
"px", "px", 1013907834), 1], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "Hz", "Hz", 1013906596), 1, new cljs.core.Keyword(null, "kHz", "kHz", 1014009423), 0.001], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "cm", "cm", 1013907420), 1, new cljs.core.Keyword(null, "pc", "pc", 1013907813), 2.36220473, new cljs.core.Keyword(null, "mm", "mm", 1013907730), 10, new cljs.core.Keyword(null, "pt", "pt", 1013907830), 28.3464567, new cljs.core.Keyword(null, 
"px", "px", 1013907834), 37.795275591], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "deg", "deg", 1014003576), 1, new cljs.core.Keyword(null, "grad", "grad", 1017085376), 1.111111111, new cljs.core.Keyword(null, "rad", "rad", 1014016903), 0.0174532925, new cljs.core.Keyword(null, "turn", "turn", 1017476079), 0.002777778], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "pt", "pt", 1013907830), 1, new cljs.core.Keyword(null, "px", "px", 1013907834), 
1.3333333333], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "mm", "mm", 1013907730), 1, new cljs.core.Keyword(null, "pt", "pt", 1013907830), 2.83464567, new cljs.core.Keyword(null, "px", "px", 1013907834), 3.7795275591], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "grad", "grad", 1017085376), 1, new cljs.core.Keyword(null, "rad", "rad", 1014016903), 63.661977237, new cljs.core.Keyword(null, "turn", "turn", 1017476079), 0.0025], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, 
"ms", "ms", 1013907736), 1], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "turn", "turn", 1017476079), 1], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "s", "s", 1013904357), 1, new cljs.core.Keyword(null, "ms", "ms", 1013907736), 1E3], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "pc", "pc", 1013907813), 1, new cljs.core.Keyword(null, "mm", "mm", 1013907730), 4.23333333, new cljs.core.Keyword(null, "pt", "pt", 1013907830), 
12, new cljs.core.Keyword(null, "px", "px", 1013907834), 16], !0)]);
garden.units.convertable_QMARK_ = function(a) {
  return cljs.core.contains_QMARK_.call(null, garden.units.conversions, a)
};
garden.units.convert = function(a, b) {
  var c = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682)), c = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "unit", "unit", 1017498870));
  if(cljs.core.every_QMARK_.call(null, garden.units.convertable_QMARK_, cljs.core.PersistentVector.fromArray([c, b], !0))) {
    var e = cljs.core.get_in.call(null, garden.units.conversions, cljs.core.PersistentVector.fromArray([c, b], !0)), f = cljs.core.get_in.call(null, garden.units.conversions, cljs.core.PersistentVector.fromArray([b, c], !0));
    if(cljs.core.truth_(e)) {
      return new garden.types.CSSUnit(b, e * d)
    }
    if(cljs.core.truth_(f)) {
      return new garden.types.CSSUnit(b, d / f)
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      throw cljs.core.ex_info.call(null, garden.util.format.call(null, "Can't convert %s to %s", cljs.core.name.call(null, c), cljs.core.name.call(null, b)), cljs.core.PersistentArrayMap.EMPTY);
    }
    return null
  }
  d = cljs.core.first.call(null, cljs.core.drop_while.call(null, garden.units.convertable_QMARK_, cljs.core.PersistentVector.fromArray([c, b], !0)));
  throw cljs.core.ex_info.call(null, [cljs.core.str("Inconvertible unit "), cljs.core.str(cljs.core.name.call(null, d))].join(""), cljs.core.PersistentArrayMap.EMPTY);
};
garden.units.unit_re = /([+-]?\d+(?:\.?\d+)?)(p[xtc]|in|[cm]m|%|r?em|ex|ch|v(?:[wh]|m(?:in|ax))|deg|g?rad|turn|m?s|k?Hz|dp(?:i|cm|px))/;
garden.units.read_unit = function(a) {
  var b = cljs.core.re_matches.call(null, garden.units.unit_re, a);
  return cljs.core.truth_(b) ? (cljs.core.nth.call(null, b, 0, null), a = cljs.core.nth.call(null, b, 1, null), b = cljs.core.nth.call(null, b, 2, null), b = cljs.core.keyword.call(null, b), a = cljs.core.truth_(a) ? cljs.reader.read_string.call(null, a) : 0, new garden.types.CSSUnit(b, a)) : null
};
garden.units.make_unit_predicate = function(a) {
  return function(b) {
    var c = garden.units.unit_QMARK_.call(null, b);
    return cljs.core.truth_(c) ? cljs.core._EQ_.call(null, (new cljs.core.Keyword(null, "unit", "unit", 1017498870)).call(null, b), a) : c
  }
};
garden.units.make_unit_fn = function(a) {
  return function(b) {
    if("number" === typeof b) {
      return new garden.types.CSSUnit(a, b)
    }
    if(cljs.core.truth_(garden.units.unit_QMARK_.call(null, b))) {
      var c;
      c = (c = cljs.core._EQ_.call(null, a.call(null, b), a)) ? b : c;
      return cljs.core.truth_(c) ? c : garden.units.convert.call(null, b, a)
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      throw cljs.core.ex_info.call(null, garden.util.format.call(null, "Don't know how to convert type %s to %s", cljs.core.type.call(null, b).getName(), cljs.core.name.call(null, a)), cljs.core.PersistentArrayMap.EMPTY);
    }
    return null
  }
};
garden.units.make_unit_adder = function(a) {
  var b = garden.units.make_unit_fn.call(null, a);
  return function() {
    var a = null, d = function() {
      return b.call(null, 0)
    }, e = function(a) {
      return b.call(null, a)
    }, f = function(a, c) {
      var d = b.call(null, a), d = cljs.core.seq_QMARK_.call(null, d) ? cljs.core.apply.call(null, cljs.core.hash_map, d) : d, d = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682)), e = b.call(null, c), e = cljs.core.seq_QMARK_.call(null, e) ? cljs.core.apply.call(null, cljs.core.hash_map, e) : e, e = cljs.core.get.call(null, e, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682));
      return b.call(null, d + e)
    }, g = function() {
      var b = function(b, d, e) {
        return cljs.core.reduce.call(null, a, a.call(null, b, d), e)
      }, d = function(a, c, d) {
        var e = null;
        2 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return b.call(this, a, c, e)
      };
      d.cljs$lang$maxFixedArity = 2;
      d.cljs$lang$applyTo = function(a) {
        var c = cljs.core.first(a);
        a = cljs.core.next(a);
        var d = cljs.core.first(a);
        a = cljs.core.rest(a);
        return b(c, d, a)
      };
      d.cljs$core$IFn$_invoke$arity$variadic = b;
      return d
    }(), a = function(a, b, c) {
      switch(arguments.length) {
        case 0:
          return d.call(this);
        case 1:
          return e.call(this, a);
        case 2:
          return f.call(this, a, b);
        default:
          return g.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    a.cljs$lang$maxFixedArity = 2;
    a.cljs$lang$applyTo = g.cljs$lang$applyTo;
    a.cljs$core$IFn$_invoke$arity$0 = d;
    a.cljs$core$IFn$_invoke$arity$1 = e;
    a.cljs$core$IFn$_invoke$arity$2 = f;
    a.cljs$core$IFn$_invoke$arity$variadic = g.cljs$core$IFn$_invoke$arity$variadic;
    return a
  }()
};
garden.units.make_unit_subtractor = function(a) {
  var b = garden.units.make_unit_fn.call(null, a);
  return function() {
    var a = null, d = function(a) {
      return b.call(null, -a)
    }, e = function(a, c) {
      var d = b.call(null, a), d = cljs.core.seq_QMARK_.call(null, d) ? cljs.core.apply.call(null, cljs.core.hash_map, d) : d, d = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682)), e = b.call(null, c), e = cljs.core.seq_QMARK_.call(null, e) ? cljs.core.apply.call(null, cljs.core.hash_map, e) : e, e = cljs.core.get.call(null, e, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682));
      return b.call(null, d - e)
    }, f = function() {
      var b = function(b, d, e) {
        return cljs.core.reduce.call(null, a, a.call(null, b, d), e)
      }, d = function(a, c, d) {
        var e = null;
        2 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return b.call(this, a, c, e)
      };
      d.cljs$lang$maxFixedArity = 2;
      d.cljs$lang$applyTo = function(a) {
        var c = cljs.core.first(a);
        a = cljs.core.next(a);
        var d = cljs.core.first(a);
        a = cljs.core.rest(a);
        return b(c, d, a)
      };
      d.cljs$core$IFn$_invoke$arity$variadic = b;
      return d
    }(), a = function(a, b, c) {
      switch(arguments.length) {
        case 1:
          return d.call(this, a);
        case 2:
          return e.call(this, a, b);
        default:
          return f.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    a.cljs$lang$maxFixedArity = 2;
    a.cljs$lang$applyTo = f.cljs$lang$applyTo;
    a.cljs$core$IFn$_invoke$arity$1 = d;
    a.cljs$core$IFn$_invoke$arity$2 = e;
    a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
    return a
  }()
};
garden.units.make_unit_multiplier = function(a) {
  var b = garden.units.make_unit_fn.call(null, a);
  return function() {
    var a = null, d = function() {
      return b.call(null, 1)
    }, e = function(a) {
      return b.call(null, a)
    }, f = function(a, c) {
      var d = b.call(null, a), d = cljs.core.seq_QMARK_.call(null, d) ? cljs.core.apply.call(null, cljs.core.hash_map, d) : d, d = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682)), e = b.call(null, c), e = cljs.core.seq_QMARK_.call(null, e) ? cljs.core.apply.call(null, cljs.core.hash_map, e) : e, e = cljs.core.get.call(null, e, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682));
      return b.call(null, d * e)
    }, g = function() {
      var b = function(b, d, e) {
        return cljs.core.reduce.call(null, a, a.call(null, b, d), e)
      }, d = function(a, c, d) {
        var e = null;
        2 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return b.call(this, a, c, e)
      };
      d.cljs$lang$maxFixedArity = 2;
      d.cljs$lang$applyTo = function(a) {
        var c = cljs.core.first(a);
        a = cljs.core.next(a);
        var d = cljs.core.first(a);
        a = cljs.core.rest(a);
        return b(c, d, a)
      };
      d.cljs$core$IFn$_invoke$arity$variadic = b;
      return d
    }(), a = function(a, b, c) {
      switch(arguments.length) {
        case 0:
          return d.call(this);
        case 1:
          return e.call(this, a);
        case 2:
          return f.call(this, a, b);
        default:
          return g.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    a.cljs$lang$maxFixedArity = 2;
    a.cljs$lang$applyTo = g.cljs$lang$applyTo;
    a.cljs$core$IFn$_invoke$arity$0 = d;
    a.cljs$core$IFn$_invoke$arity$1 = e;
    a.cljs$core$IFn$_invoke$arity$2 = f;
    a.cljs$core$IFn$_invoke$arity$variadic = g.cljs$core$IFn$_invoke$arity$variadic;
    return a
  }()
};
garden.units.make_unit_divider = function(a) {
  var b = garden.units.make_unit_fn.call(null, a);
  return function() {
    var a = null, d = function(a) {
      return b.call(null, 1 / a)
    }, e = function(a, c) {
      var d = b.call(null, a), d = cljs.core.seq_QMARK_.call(null, d) ? cljs.core.apply.call(null, cljs.core.hash_map, d) : d, d = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682)), e = b.call(null, c), e = cljs.core.seq_QMARK_.call(null, e) ? cljs.core.apply.call(null, cljs.core.hash_map, e) : e, e = cljs.core.get.call(null, e, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682));
      return b.call(null, d / e)
    }, f = function() {
      var b = function(b, d, e) {
        return cljs.core.reduce.call(null, a, a.call(null, b, d), e)
      }, d = function(a, c, d) {
        var e = null;
        2 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return b.call(this, a, c, e)
      };
      d.cljs$lang$maxFixedArity = 2;
      d.cljs$lang$applyTo = function(a) {
        var c = cljs.core.first(a);
        a = cljs.core.next(a);
        var d = cljs.core.first(a);
        a = cljs.core.rest(a);
        return b(c, d, a)
      };
      d.cljs$core$IFn$_invoke$arity$variadic = b;
      return d
    }(), a = function(a, b, c) {
      switch(arguments.length) {
        case 1:
          return d.call(this, a);
        case 2:
          return e.call(this, a, b);
        default:
          return f.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    a.cljs$lang$maxFixedArity = 2;
    a.cljs$lang$applyTo = f.cljs$lang$applyTo;
    a.cljs$core$IFn$_invoke$arity$1 = d;
    a.cljs$core$IFn$_invoke$arity$2 = e;
    a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
    return a
  }()
};
garden.units.cm = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "cm", "cm", 1013907420));
garden.units.cm_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "cm", "cm", 1013907420));
garden.units.cm_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "cm", "cm", 1013907420));
garden.units.cm_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "cm", "cm", 1013907420));
garden.units.cm_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "cm", "cm", 1013907420));
garden.units.cm_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "cm", "cm", 1013907420));
garden.units.mm = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "mm", "mm", 1013907730));
garden.units.mm_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "mm", "mm", 1013907730));
garden.units.mm_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "mm", "mm", 1013907730));
garden.units.mm_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "mm", "mm", 1013907730));
garden.units.mm_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "mm", "mm", 1013907730));
garden.units.mm_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "mm", "mm", 1013907730));
garden.units.in$ = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "in", "in", 1013907607));
garden.units.in_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "in", "in", 1013907607));
garden.units.in_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "in", "in", 1013907607));
garden.units.in_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "in", "in", 1013907607));
garden.units.in_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "in", "in", 1013907607));
garden.units.in_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "in", "in", 1013907607));
garden.units.px = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "px", "px", 1013907834));
garden.units.px_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "px", "px", 1013907834));
garden.units.px_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "px", "px", 1013907834));
garden.units.px_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "px", "px", 1013907834));
garden.units.px_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "px", "px", 1013907834));
garden.units.px_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "px", "px", 1013907834));
garden.units.pt = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "pt", "pt", 1013907830));
garden.units.pt_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "pt", "pt", 1013907830));
garden.units.pt_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "pt", "pt", 1013907830));
garden.units.pt_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "pt", "pt", 1013907830));
garden.units.pt_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "pt", "pt", 1013907830));
garden.units.pt_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "pt", "pt", 1013907830));
garden.units.pc = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "pc", "pc", 1013907813));
garden.units.pc_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "pc", "pc", 1013907813));
garden.units.pc_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "pc", "pc", 1013907813));
garden.units.pc_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "pc", "pc", 1013907813));
garden.units.pc_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "pc", "pc", 1013907813));
garden.units.pc_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "pc", "pc", 1013907813));
garden.units.percent = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "%", "%", 1013904279));
garden.units.percent_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "%", "%", 1013904279));
garden.units.percent_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "%", "%", 1013904279));
garden.units.percent_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "%", "%", 1013904279));
garden.units.percent_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "%", "%", 1013904279));
garden.units.percent_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "%", "%", 1013904279));
garden.units.em = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "em", "em", 1013907482));
garden.units.em_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "em", "em", 1013907482));
garden.units.em_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "em", "em", 1013907482));
garden.units.em_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "em", "em", 1013907482));
garden.units.em_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "em", "em", 1013907482));
garden.units.em_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "em", "em", 1013907482));
garden.units.ex = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "ex", "ex", 1013907493));
garden.units.ex_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "ex", "ex", 1013907493));
garden.units.ex_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "ex", "ex", 1013907493));
garden.units.ex_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "ex", "ex", 1013907493));
garden.units.ex_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "ex", "ex", 1013907493));
garden.units.ex_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "ex", "ex", 1013907493));
garden.units.ch = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "ch", "ch", 1013907415));
garden.units.ch_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "ch", "ch", 1013907415));
garden.units.ch_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "ch", "ch", 1013907415));
garden.units.ch_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "ch", "ch", 1013907415));
garden.units.ch_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "ch", "ch", 1013907415));
garden.units.ch_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "ch", "ch", 1013907415));
garden.units.vw = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "vw", "vw", 1013908019));
garden.units.vw_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "vw", "vw", 1013908019));
garden.units.vw_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "vw", "vw", 1013908019));
garden.units.vw_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "vw", "vw", 1013908019));
garden.units.vw_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "vw", "vw", 1013908019));
garden.units.vw_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "vw", "vw", 1013908019));
garden.units.vh = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "vh", "vh", 1013908004));
garden.units.vh_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "vh", "vh", 1013908004));
garden.units.vh_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "vh", "vh", 1013908004));
garden.units.vh_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "vh", "vh", 1013908004));
garden.units.vh_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "vh", "vh", 1013908004));
garden.units.vh_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "vh", "vh", 1013908004));
garden.units.vmin = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "vmin", "vmin", 1017527694));
garden.units.vmin_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "vmin", "vmin", 1017527694));
garden.units.vmin_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "vmin", "vmin", 1017527694));
garden.units.vmin_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "vmin", "vmin", 1017527694));
garden.units.vmin_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "vmin", "vmin", 1017527694));
garden.units.vmin_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "vmin", "vmin", 1017527694));
garden.units.vmax = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "vmax", "vmax", 1017527456));
garden.units.vmax_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "vmax", "vmax", 1017527456));
garden.units.vmax_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "vmax", "vmax", 1017527456));
garden.units.vmax_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "vmax", "vmax", 1017527456));
garden.units.vmax_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "vmax", "vmax", 1017527456));
garden.units.vmax_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "vmax", "vmax", 1017527456));
garden.units.deg = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "deg", "deg", 1014003576));
garden.units.deg_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "deg", "deg", 1014003576));
garden.units.deg_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "deg", "deg", 1014003576));
garden.units.deg_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "deg", "deg", 1014003576));
garden.units.deg_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "deg", "deg", 1014003576));
garden.units.deg_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "deg", "deg", 1014003576));
garden.units.grad = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "grad", "grad", 1017085376));
garden.units.grad_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "grad", "grad", 1017085376));
garden.units.grad_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "grad", "grad", 1017085376));
garden.units.grad_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "grad", "grad", 1017085376));
garden.units.grad_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "grad", "grad", 1017085376));
garden.units.grad_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "grad", "grad", 1017085376));
garden.units.rad = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "rad", "rad", 1014016903));
garden.units.rad_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "rad", "rad", 1014016903));
garden.units.rad_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "rad", "rad", 1014016903));
garden.units.rad_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "rad", "rad", 1014016903));
garden.units.rad_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "rad", "rad", 1014016903));
garden.units.rad_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "rad", "rad", 1014016903));
garden.units.turn = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "turn", "turn", 1017476079));
garden.units.turn_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "turn", "turn", 1017476079));
garden.units.turn_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "turn", "turn", 1017476079));
garden.units.turn_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "turn", "turn", 1017476079));
garden.units.turn_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "turn", "turn", 1017476079));
garden.units.turn_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "turn", "turn", 1017476079));
garden.units.s = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "s", "s", 1013904357));
garden.units.s_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "s", "s", 1013904357));
garden.units.s_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "s", "s", 1013904357));
garden.units.s_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "s", "s", 1013904357));
garden.units.s_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "s", "s", 1013904357));
garden.units.s_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "s", "s", 1013904357));
garden.units.ms = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "ms", "ms", 1013907736));
garden.units.ms_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "ms", "ms", 1013907736));
garden.units.ms_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "ms", "ms", 1013907736));
garden.units.ms_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "ms", "ms", 1013907736));
garden.units.ms_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "ms", "ms", 1013907736));
garden.units.ms_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "ms", "ms", 1013907736));
garden.units.Hz = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "Hz", "Hz", 1013906596));
garden.units.Hz_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "Hz", "Hz", 1013906596));
garden.units.Hz_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "Hz", "Hz", 1013906596));
garden.units.Hz_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "Hz", "Hz", 1013906596));
garden.units.Hz_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "Hz", "Hz", 1013906596));
garden.units.Hz_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "Hz", "Hz", 1013906596));
garden.units.kHz = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "kHz", "kHz", 1014009423));
garden.units.kHz_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "kHz", "kHz", 1014009423));
garden.units.kHz_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "kHz", "kHz", 1014009423));
garden.units.kHz_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "kHz", "kHz", 1014009423));
garden.units.kHz_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "kHz", "kHz", 1014009423));
garden.units.kHz_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "kHz", "kHz", 1014009423));
garden.units.dpi = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "dpi", "dpi", 1014003919));
garden.units.dpi_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "dpi", "dpi", 1014003919));
garden.units.dpi_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "dpi", "dpi", 1014003919));
garden.units.dpi_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "dpi", "dpi", 1014003919));
garden.units.dpi_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "dpi", "dpi", 1014003919));
garden.units.dpi_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "dpi", "dpi", 1014003919));
garden.units.dpcm = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "dpcm", "dpcm", 1016994152));
garden.units.dpcm_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "dpcm", "dpcm", 1016994152));
garden.units.dpcm_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "dpcm", "dpcm", 1016994152));
garden.units.dpcm_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "dpcm", "dpcm", 1016994152));
garden.units.dpcm_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "dpcm", "dpcm", 1016994152));
garden.units.dpcm_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "dpcm", "dpcm", 1016994152));
garden.units.dppx = garden.units.make_unit_fn.call(null, new cljs.core.Keyword(null, "dppx", "dppx", 1016994566));
garden.units.dppx_QMARK_ = garden.units.make_unit_predicate.call(null, new cljs.core.Keyword(null, "dppx", "dppx", 1016994566));
garden.units.dppx_PLUS_ = garden.units.make_unit_adder.call(null, new cljs.core.Keyword(null, "dppx", "dppx", 1016994566));
garden.units.dppx_ = garden.units.make_unit_subtractor.call(null, new cljs.core.Keyword(null, "dppx", "dppx", 1016994566));
garden.units.dppx_STAR_ = garden.units.make_unit_multiplier.call(null, new cljs.core.Keyword(null, "dppx", "dppx", 1016994566));
garden.units.dppx_div = garden.units.make_unit_divider.call(null, new cljs.core.Keyword(null, "dppx", "dppx", 1016994566));
lucuma.event = {};
lucuma.event.create_event = function(a, b, c, d) {
  return document.createEvent("CustomEvent").initCustomEvent(a, c, d, cljs.core.clj__GT_js.call(null, b))
};
lucuma.event.fire = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, cljs.core.PersistentArrayMap.EMPTY)
  }, c = function(b, c, d) {
    return a.call(null, b, c, d, !1, !1)
  }, d = function(a, b, c, d, k) {
    return a.dispatchEvent(lucuma.event.create_event.call(null, b, c, d, k))
  }, a = function(a, f, g, h, k) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 5:
        return d.call(this, a, f, g, h, k)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  return a
}();
garden.color = {};
garden.color.CSSColor = function(a, b, c, d, e, f, g, h, k) {
  this.red = a;
  this.green = b;
  this.blue = c;
  this.hue = d;
  this.saturation = e;
  this.lightness = f;
  this.alpha = g;
  this.__meta = h;
  this.__extmap = k;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2229667595;
  7 < arguments.length ? (this.__meta = h, this.__extmap = k) : this.__extmap = this.__meta = null
};
garden.color.CSSColor.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
garden.color.CSSColor.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
garden.color.CSSColor.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "red", "red", 1014017027)) ? this.red : cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "green", "green", 1112523381)) ? this.green : cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "blue", "blue", 1016931276)) ? this.blue : cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "hue", "hue", 1014007914)) ? this.hue : cljs.core.keyword_identical_QMARK_.call(null, 
  b, new cljs.core.Keyword(null, "saturation", "saturation", 783413060)) ? this.saturation : cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823)) ? this.lightness : cljs.core.keyword_identical_QMARK_.call(null, b, new cljs.core.Keyword(null, "alpha", "alpha", 1106814160)) ? this.alpha : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.get.call(null, this.__extmap, b, c) : null
};
garden.color.CSSColor.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = cljs.core.keyword_identical_QMARK_;
  return a.call(null, new cljs.core.Keyword(null, "red", "red", 1014017027), b) ? new garden.color.CSSColor(c, this.green, this.blue, this.hue, this.saturation, this.lightness, this.alpha, this.__meta, this.__extmap, null) : a.call(null, new cljs.core.Keyword(null, "green", "green", 1112523381), b) ? new garden.color.CSSColor(this.red, c, this.blue, this.hue, this.saturation, this.lightness, this.alpha, this.__meta, this.__extmap, null) : a.call(null, new cljs.core.Keyword(null, "blue", "blue", 1016931276), 
  b) ? new garden.color.CSSColor(this.red, this.green, c, this.hue, this.saturation, this.lightness, this.alpha, this.__meta, this.__extmap, null) : a.call(null, new cljs.core.Keyword(null, "hue", "hue", 1014007914), b) ? new garden.color.CSSColor(this.red, this.green, this.blue, c, this.saturation, this.lightness, this.alpha, this.__meta, this.__extmap, null) : a.call(null, new cljs.core.Keyword(null, "saturation", "saturation", 783413060), b) ? new garden.color.CSSColor(this.red, this.green, this.blue, 
  this.hue, c, this.lightness, this.alpha, this.__meta, this.__extmap, null) : a.call(null, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), b) ? new garden.color.CSSColor(this.red, this.green, this.blue, this.hue, this.saturation, c, this.alpha, this.__meta, this.__extmap, null) : a.call(null, new cljs.core.Keyword(null, "alpha", "alpha", 1106814160), b) ? new garden.color.CSSColor(this.red, this.green, this.blue, this.hue, this.saturation, this.lightness, c, this.__meta, this.__extmap, 
  null) : new garden.color.CSSColor(this.red, this.green, this.blue, this.hue, this.saturation, this.lightness, this.alpha, this.__meta, cljs.core.assoc.call(null, this.__extmap, b, c), null)
};
garden.color.CSSColor.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 1:
        return this;
      case 2:
        return cljs.core.get.call(null, this, c);
      case 3:
        return cljs.core.get.call(null, this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
garden.color.CSSColor.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
garden.color.CSSColor.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "#garden.color.CSSColor{", ", ", "}", c, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, new cljs.core.Keyword(null, "red", "red", 1014017027), this.red), cljs.core.vector.call(null, new cljs.core.Keyword(null, "green", "green", 1112523381), this.green), cljs.core.vector.call(null, new cljs.core.Keyword(null, "blue", "blue", 1016931276), this.blue), cljs.core.vector.call(null, new cljs.core.Keyword(null, "hue", "hue", 1014007914), this.hue), cljs.core.vector.call(null, 
  new cljs.core.Keyword(null, "saturation", "saturation", 783413060), this.saturation), cljs.core.vector.call(null, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), this.lightness), cljs.core.vector.call(null, new cljs.core.Keyword(null, "alpha", "alpha", 1106814160), this.alpha)], !0), this.__extmap))
};
garden.color.CSSColor.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
garden.color.CSSColor.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.seq.call(null, cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([cljs.core.vector.call(null, new cljs.core.Keyword(null, "red", "red", 1014017027), this.red), cljs.core.vector.call(null, new cljs.core.Keyword(null, "green", "green", 1112523381), this.green), cljs.core.vector.call(null, new cljs.core.Keyword(null, "blue", "blue", 1016931276), this.blue), cljs.core.vector.call(null, new cljs.core.Keyword(null, "hue", "hue", 1014007914), this.hue), cljs.core.vector.call(null, 
  new cljs.core.Keyword(null, "saturation", "saturation", 783413060), this.saturation), cljs.core.vector.call(null, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), this.lightness), cljs.core.vector.call(null, new cljs.core.Keyword(null, "alpha", "alpha", 1106814160), this.alpha)], !0), this.__extmap))
};
garden.color.CSSColor.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 7 + cljs.core.count.call(null, this.__extmap)
};
garden.color.CSSColor.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(b)) {
      var c = a.constructor === b.constructor;
      return c ? cljs.core.equiv_map.call(null, a, b) : c
    }
    return b
  }()) ? !0 : !1
};
garden.color.CSSColor.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new garden.color.CSSColor(this.red, this.green, this.blue, this.hue, this.saturation, this.lightness, this.alpha, b, this.__extmap, this.__hash)
};
garden.color.CSSColor.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.__meta
};
garden.color.CSSColor.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  return cljs.core.contains_QMARK_.call(null, cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "red", "red", 1014017027), null, new cljs.core.Keyword(null, "alpha", "alpha", 1106814160), null, new cljs.core.Keyword(null, "hue", "hue", 1014007914), null, new cljs.core.Keyword(null, "blue", "blue", 1016931276), null, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), null, new cljs.core.Keyword(null, "green", "green", 1112523381), null, new cljs.core.Keyword(null, 
  "saturation", "saturation", 783413060), null], !0), b) ? cljs.core.dissoc.call(null, cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, a), this.__meta), b) : new garden.color.CSSColor(this.red, this.green, this.blue, this.hue, this.saturation, this.lightness, this.alpha, this.__meta, cljs.core.not_empty.call(null, cljs.core.dissoc.call(null, this.__extmap, b)), null)
};
garden.color.CSSColor.cljs$lang$type = !0;
garden.color.CSSColor.cljs$lang$ctorPrSeq = function(a) {
  return cljs.core.list.call(null, "garden.color/CSSColor")
};
garden.color.CSSColor.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "garden.color/CSSColor")
};
garden.color.__GT_CSSColor = function(a, b, c, d, e, f, g) {
  return new garden.color.CSSColor(a, b, c, d, e, f, g)
};
garden.color.map__GT_CSSColor = function(a) {
  return new garden.color.CSSColor((new cljs.core.Keyword(null, "red", "red", 1014017027)).call(null, a), (new cljs.core.Keyword(null, "green", "green", 1112523381)).call(null, a), (new cljs.core.Keyword(null, "blue", "blue", 1016931276)).call(null, a), (new cljs.core.Keyword(null, "hue", "hue", 1014007914)).call(null, a), (new cljs.core.Keyword(null, "saturation", "saturation", 783413060)).call(null, a), (new cljs.core.Keyword(null, "lightness", "lightness", 1700345823)).call(null, a), (new cljs.core.Keyword(null, 
  "alpha", "alpha", 1106814160)).call(null, a), null, cljs.core.dissoc.call(null, a, new cljs.core.Keyword(null, "red", "red", 1014017027), new cljs.core.Keyword(null, "green", "green", 1112523381), new cljs.core.Keyword(null, "blue", "blue", 1016931276), new cljs.core.Keyword(null, "hue", "hue", 1014007914), new cljs.core.Keyword(null, "saturation", "saturation", 783413060), new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), new cljs.core.Keyword(null, "alpha", "alpha", 1106814160)))
};
garden.color.as_color = garden.color.map__GT_CSSColor;
garden.color.rgb = function() {
  var a = null, b = function(a) {
    var b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null), g = cljs.core.nth.call(null, a, 2, null);
    if(cljs.core.every_QMARK_.call(null, function(a) {
      return garden.util.between_QMARK_.call(null, a, 0, 255)
    }, a)) {
      return garden.color.as_color.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "red", "red", 1014017027), b, new cljs.core.Keyword(null, "green", "green", 1112523381), c, new cljs.core.Keyword(null, "blue", "blue", 1016931276), g], !0))
    }
    throw cljs.core.ex_info.call(null, "RGB values must be between 0 and 255", cljs.core.PersistentArrayMap.EMPTY);
  }, c = function(b, c, f) {
    return a.call(null, cljs.core.PersistentVector.fromArray([b, c, f], !0))
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
garden.color.rgba = function() {
  var a = null, b = function(a) {
    var b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null), g = cljs.core.nth.call(null, a, 2, null);
    a = cljs.core.nth.call(null, a, 3, null);
    if(cljs.core.truth_(garden.util.between_QMARK_.call(null, a, 0, 1))) {
      return garden.color.as_color.call(null, cljs.core.assoc.call(null, garden.color.rgb.call(null, cljs.core.PersistentVector.fromArray([b, c, g], !0)), new cljs.core.Keyword(null, "alpha", "alpha", 1106814160), a))
    }
    throw cljs.core.ex_info.call(null, "Alpha value must be between 0 and 1", cljs.core.PersistentArrayMap.EMPTY);
  }, c = function(b, c, f, g) {
    return a.call(null, cljs.core.PersistentVector.fromArray([b, c, f, g], !0))
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
garden.color.hsl = function() {
  var a = null, b = function(a) {
    var b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null);
    a = cljs.core.nth.call(null, a, 2, null);
    var b = cljs.core.map.call(null, function(a) {
      return cljs.core.get.call(null, a, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682), a)
    }, cljs.core.PersistentVector.fromArray([b, c, a], !0)), c = cljs.core.nth.call(null, b, 0, null), g = cljs.core.nth.call(null, b, 1, null), h = cljs.core.nth.call(null, b, 2, null);
    if(cljs.core.truth_(function() {
      var a = garden.util.between_QMARK_.call(null, g, 0, 100);
      return cljs.core.truth_(a) ? garden.util.between_QMARK_.call(null, h, 0, 100) : a
    }())) {
      return garden.color.as_color.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "hue", "hue", 1014007914), cljs.core.mod.call(null, c, 360), new cljs.core.Keyword(null, "saturation", "saturation", 783413060), g, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), h], !0))
    }
    throw cljs.core.ex_info.call(null, "Saturation and lightness must be between 0(%) and 100(%)", cljs.core.PersistentArrayMap.EMPTY);
  }, c = function(b, c, f) {
    return a.call(null, cljs.core.PersistentVector.fromArray([b, c, f], !0))
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
garden.color.hsla = function() {
  var a = null, b = function(a) {
    var b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null), g = cljs.core.nth.call(null, a, 2, null);
    a = cljs.core.nth.call(null, a, 3, null);
    if(cljs.core.truth_(garden.util.between_QMARK_.call(null, a, 0, 1))) {
      return garden.color.as_color.call(null, cljs.core.assoc.call(null, garden.color.hsl.call(null, cljs.core.PersistentVector.fromArray([b, c, g], !0)), new cljs.core.Keyword(null, "alpha", "alpha", 1106814160), a))
    }
    throw cljs.core.ex_info.call(null, "Alpha value must be between 0 and 1", cljs.core.PersistentArrayMap.EMPTY);
  }, c = function(b, c, f, g) {
    return a.call(null, cljs.core.PersistentVector.fromArray([b, c, f, g], !0))
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
garden.color.rgb_QMARK_ = function(a) {
  var b = cljs.core.map_QMARK_.call(null, a);
  return b ? cljs.core.every_QMARK_.call(null, a, cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "red", "red", 1014017027), null, new cljs.core.Keyword(null, "blue", "blue", 1016931276), null, new cljs.core.Keyword(null, "green", "green", 1112523381), null], !0)) : b
};
garden.color.hsl_QMARK_ = function(a) {
  var b = cljs.core.map_QMARK_.call(null, a);
  return b ? cljs.core.every_QMARK_.call(null, a, cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "hue", "hue", 1014007914), null, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), null, new cljs.core.Keyword(null, "saturation", "saturation", 783413060), null], !0)) : b
};
garden.color.color_QMARK_ = function(a) {
  var b = garden.color.rgb_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? b : garden.color.hsl_QMARK_.call(null, a)
};
garden.color.hex_re = /#?([\da-fA-F]{6}|[\da-fA-F]{3})/;
garden.color.hex_QMARK_ = function(a) {
  return cljs.core.boolean$.call(null, function() {
    var b = "string" === typeof a;
    return b ? cljs.core.re_matches.call(null, garden.color.hex_re, a) : b
  }())
};
garden.color.hex__GT_rgb = function(a) {
  a = cljs.core.re_matches.call(null, garden.color.hex_re, a);
  return cljs.core.truth_(a) ? (cljs.core.nth.call(null, a, 0, null), a = cljs.core.nth.call(null, a, 1, null), a = cljs.core._EQ_.call(null, 3, cljs.core.count.call(null, a)) ? cljs.core.apply.call(null, cljs.core.str, cljs.core.mapcat.call(null, function(a) {
    return cljs.core.list.call(null, a, a)
  }, a)) : a, garden.color.rgb.call(null, cljs.core.map.call(null, function(a) {
    return garden.util.string__GT_int.call(null, a, 16)
  }, cljs.core.re_seq.call(null, /[\da-fA-F]{2}/, a)))) : null
};
garden.color.rgb__GT_hex = function(a) {
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "red", "red", 1014017027));
  var c = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "green", "green", 1112523381)), b = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "blue", "blue", 1016931276));
  return cljs.core.apply.call(null, cljs.core.str, "#", cljs.core.map.call(null, function(a) {
    return clojure.string.replace.call(null, garden.util.format.call(null, "%2s", garden.util.int__GT_string.call(null, a, 16)), " ", "0")
  }, cljs.core.PersistentVector.fromArray([a, c, b], !0)))
};
garden.color.rgb__GT_hsl = function(a) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  var b = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "blue", "blue", 1016931276)), c = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "green", "green", 1112523381)), d = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "red", "red", 1014017027));
  if(cljs.core.truth_(garden.color.hsl_QMARK_.call(null, a))) {
    return a
  }
  a = cljs.core.map.call(null, function(a) {
    return a / 255
  }, cljs.core.PersistentVector.fromArray([d, c, b], !0));
  var e = cljs.core.nth.call(null, a, 0, null), f = cljs.core.nth.call(null, a, 1, null), g = cljs.core.nth.call(null, a, 2, null), h = function() {
    var a;
    a = e > f ? e : f;
    return a > g ? a : g
  }(), k = function() {
    var a;
    a = e < f ? e : f;
    return a < g ? a : g
  }(), l = h - k;
  a = function() {
    var a = cljs.core._EQ_;
    if(a.call(null, k, h)) {
      return 0
    }
    if(a.call(null, e, h)) {
      return 60 * ((f - g) / l)
    }
    if(a.call(null, f, h)) {
      return 60 * ((g - e) / l) + 120
    }
    if(a.call(null, g, h)) {
      return 60 * ((e - f) / l) + 240
    }
    throw Error([cljs.core.str("No matching clause: "), cljs.core.str(h)].join(""));
  }();
  b = (h + k) / 2;
  c = cljs.core._EQ_.call(null, h, k) ? 0 : 0.5 > b ? l / (2 * b) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? l / (2 - 2 * b) : null;
  return garden.color.hsl.call(null, cljs.core.mod.call(null, a, 360), 100 * c, 100 * b)
};
garden.color.hsl__GT_rgb = function(a) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  var b = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823)), c = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "saturation", "saturation", 783413060)), d = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "hue", "hue", 1014007914));
  if(cljs.core.truth_(garden.color.rgb_QMARK_.call(null, a))) {
    return a
  }
  a = d / 360;
  var c = c / 100, b = b / 100, d = 0.5 >= b ? b * (c + 1) : b + c - b * c, e = 2 * b - d, c = cljs.core.map.call(null, function(a, b, c, d, e) {
    return function(a) {
      return Math.round.call(null, 255 * a)
    }
  }(a, c, b, d, e), cljs.core.PersistentVector.fromArray([garden.color.hue__GT_rgb.call(null, e, d, a + 1 / 3), garden.color.hue__GT_rgb.call(null, e, d, a), garden.color.hue__GT_rgb.call(null, e, d, a - 1 / 3)], !0));
  a = cljs.core.nth.call(null, c, 0, null);
  b = cljs.core.nth.call(null, c, 1, null);
  c = cljs.core.nth.call(null, c, 2, null);
  return garden.color.rgb.call(null, cljs.core.PersistentVector.fromArray([a, b, c], !0))
};
garden.color.hue__GT_rgb = function(a, b, c) {
  c = 0 > c ? c + 1 : 1 < c ? c - 1 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? c : null;
  return 1 > 6 * c ? a + 6 * (b - a) * c : 1 > 2 * c ? b : 2 > 3 * c ? a + 6 * (b - a) * (2 / 3 - c) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? a : null
};
garden.color.hsl__GT_hex = function(a) {
  return garden.color.rgb__GT_hex.call(null, garden.color.hsl__GT_rgb.call(null, a))
};
garden.color.hex__GT_hsl = function(a) {
  return garden.color.rgb__GT_hsl.call(null, garden.color.hex__GT_rgb.call(null, a))
};
garden.color.percent_clip = cljs.core.partial.call(null, garden.util.clip, 0, 100);
garden.color.rgb_clip = cljs.core.partial.call(null, garden.util.clip, 0, 255);
garden.color.as_hex = function(a) {
  if(cljs.core.truth_(garden.color.hex_QMARK_.call(null, a))) {
    return a
  }
  if(cljs.core.truth_(garden.color.rgb_QMARK_.call(null, a))) {
    return garden.color.rgb__GT_hex.call(null, a)
  }
  if(cljs.core.truth_(garden.color.hsl_QMARK_.call(null, a))) {
    return garden.color.hsl__GT_hex.call(null, a)
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw cljs.core.ex_info.call(null, [cljs.core.str("Can't convert "), cljs.core.str(a), cljs.core.str(" to a color.")].join(""), cljs.core.PersistentArrayMap.EMPTY);
  }
  return null
};
garden.color.as_rgb = function(a) {
  if(cljs.core.truth_(garden.color.rgb_QMARK_.call(null, a))) {
    return a
  }
  if(cljs.core.truth_(garden.color.hsl_QMARK_.call(null, a))) {
    return garden.color.hsl__GT_rgb.call(null, a)
  }
  if(cljs.core.truth_(garden.color.hex_QMARK_.call(null, a))) {
    return garden.color.hex__GT_rgb.call(null, a)
  }
  if("number" === typeof a) {
    return garden.color.rgb.call(null, cljs.core.map.call(null, garden.color.rgb_clip, cljs.core.PersistentVector.fromArray([a, a, a], !0)))
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw cljs.core.ex_info.call(null, [cljs.core.str("Can't convert "), cljs.core.str(a), cljs.core.str(" to a color.")].join(""), cljs.core.PersistentArrayMap.EMPTY);
  }
  return null
};
garden.color.as_hsl = function(a) {
  if(cljs.core.truth_(garden.color.hsl_QMARK_.call(null, a))) {
    return a
  }
  if(cljs.core.truth_(garden.color.rgb_QMARK_.call(null, a))) {
    return garden.color.rgb__GT_hsl.call(null, a)
  }
  if(cljs.core.truth_(garden.color.hex_QMARK_.call(null, a))) {
    return garden.color.hex__GT_hsl.call(null, a)
  }
  if("number" === typeof a) {
    return garden.color.hsl.call(null, cljs.core.PersistentVector.fromArray([a, garden.color.percent_clip.call(null, a), garden.color.percent_clip.call(null, a)], !0))
  }
  if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw cljs.core.ex_info.call(null, [cljs.core.str("Can't convert "), cljs.core.str(a), cljs.core.str(" to a color.")].join(""), cljs.core.PersistentArrayMap.EMPTY);
  }
  return null
};
garden.color.restrict_rgb = function(a) {
  return cljs.core.select_keys.call(null, a, cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "red", "red", 1014017027), new cljs.core.Keyword(null, "green", "green", 1112523381), new cljs.core.Keyword(null, "blue", "blue", 1016931276)], !0))
};
garden.color.make_color_operation = function(a) {
  return function() {
    var b = null, c = function(b, c) {
      var d = cljs.core.comp.call(null, garden.color.rgb_clip, a), h = garden.color.restrict_rgb.call(null, garden.color.as_rgb.call(null, b)), k = garden.color.restrict_rgb.call(null, garden.color.as_rgb.call(null, c));
      return garden.color.as_color.call(null, cljs.core.merge_with.call(null, d, h, k))
    }, d = function() {
      var a = function(a, c, d) {
        return cljs.core.reduce.call(null, b, b.call(null, a, c), d)
      }, c = function(b, c, d) {
        var f = null;
        2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return a.call(this, b, c, f)
      };
      c.cljs$lang$maxFixedArity = 2;
      c.cljs$lang$applyTo = function(b) {
        var c = cljs.core.first(b);
        b = cljs.core.next(b);
        var d = cljs.core.first(b);
        b = cljs.core.rest(b);
        return a(c, d, b)
      };
      c.cljs$core$IFn$_invoke$arity$variadic = a;
      return c
    }(), b = function(a, b, g) {
      switch(arguments.length) {
        case 1:
          return a;
        case 2:
          return c.call(this, a, b);
        default:
          return d.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = d.cljs$lang$applyTo;
    b.cljs$core$IFn$_invoke$arity$1 = function(a) {
      return a
    };
    b.cljs$core$IFn$_invoke$arity$2 = c;
    b.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
    return b
  }()
};
garden.color.color_PLUS_ = garden.color.make_color_operation.call(null, cljs.core._PLUS_);
garden.color.color_ = garden.color.make_color_operation.call(null, cljs.core._);
garden.color.color_STAR_ = garden.color.make_color_operation.call(null, cljs.core._STAR_);
garden.color.color_div = garden.color.make_color_operation.call(null, cljs.core._SLASH_);
garden.color.update_color = function(a, b, c, d) {
  var e = (new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682)).call(null, d);
  d = cljs.core.truth_(e) ? e : d;
  return cljs.core.update_in.call(null, garden.color.as_hsl.call(null, a), cljs.core.PersistentVector.fromArray([b], !0), c, d)
};
garden.color.rotate_hue = function(a, b) {
  return garden.color.update_color.call(null, a, new cljs.core.Keyword(null, "hue", "hue", 1014007914), cljs.core.comp.call(null, function(a) {
    return cljs.core.mod.call(null, a, 360)
  }, cljs.core._PLUS_), b)
};
garden.color.saturate = function(a, b) {
  return garden.color.update_color.call(null, a, new cljs.core.Keyword(null, "saturation", "saturation", 783413060), cljs.core.comp.call(null, garden.color.percent_clip, cljs.core._PLUS_), b)
};
garden.color.desaturate = function(a, b) {
  return garden.color.update_color.call(null, a, new cljs.core.Keyword(null, "saturation", "saturation", 783413060), cljs.core.comp.call(null, garden.color.percent_clip, cljs.core._), b)
};
garden.color.lighten = function(a, b) {
  return garden.color.update_color.call(null, a, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), cljs.core.comp.call(null, garden.color.percent_clip, cljs.core._PLUS_), b)
};
garden.color.darken = function(a, b) {
  return garden.color.update_color.call(null, a, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), cljs.core.comp.call(null, garden.color.percent_clip, cljs.core._), b)
};
garden.color.invert = function(a) {
  return garden.color.as_color.call(null, cljs.core.merge_with.call(null, cljs.core._, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "red", "red", 1014017027), 255, new cljs.core.Keyword(null, "green", "green", 1112523381), 255, new cljs.core.Keyword(null, "blue", "blue", 1016931276), 255], !0), garden.color.as_rgb.call(null, a)))
};
garden.color.mix = function() {
  var a = null, b = function(a, b) {
    var c = garden.color.restrict_rgb.call(null, garden.color.as_rgb.call(null, a)), g = garden.color.restrict_rgb.call(null, garden.color.as_rgb.call(null, b));
    return garden.color.as_color.call(null, cljs.core.merge_with.call(null, garden.util.average, c, g))
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, a.call(null, b, c), d)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
garden.color.complement = function(a) {
  return garden.color.rotate_hue.call(null, a, 180)
};
garden.color.hue_rotations = function() {
  var a = function(a, b) {
    return cljs.core.map.call(null, cljs.core.partial.call(null, garden.color.rotate_hue, a), b)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
garden.color.analogous = function() {
  var a = null, b = function(b) {
    return a.call(null, b, !0)
  }, c = function(a, b) {
    var c = cljs.core.truth_(b) ? cljs.core._PLUS_ : cljs.core._;
    return garden.color.hue_rotations.call(null, a, 0, c.call(null, 30), c.call(null, 60))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
garden.color.triad = function(a) {
  return garden.color.hue_rotations.call(null, a, 0, 120, 240)
};
garden.color.split_complement = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 130)
  }, c = function(a, b) {
    var c = garden.util.clip.call(null, 1, 179, b);
    return garden.color.hue_rotations.call(null, a, 0, c, -c)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
garden.color.tetrad = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 90)
  }, c = function(a, b) {
    var c = garden.util.clip.call(null, 1, 90, Math.abs.call(null, (new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682)).call(null, b, b))), c = garden.color.rotate_hue.call(null, a, c);
    return cljs.core.PersistentVector.fromArray([garden.color.rotate_hue.call(null, a, 0), garden.color.complement.call(null, a), c, garden.color.complement.call(null, c)], !0)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
garden.color.shades = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 10)
  }, c = function(a, b) {
    var c = garden.color.as_hsl.call(null, a);
    return function h(a) {
      return new cljs.core.LazySeq(null, function() {
        for(;;) {
          var d = cljs.core.seq.call(null, a);
          if(d) {
            if(cljs.core.chunked_seq_QMARK_.call(null, d)) {
              var m = cljs.core.chunk_first.call(null, d), n = cljs.core.count.call(null, m), p = cljs.core.chunk_buffer.call(null, n);
              a: {
                for(var r = 0;;) {
                  if(r < n) {
                    var s = cljs.core._nth.call(null, m, r);
                    cljs.core.chunk_append.call(null, p, cljs.core.assoc.call(null, c, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), s * b));
                    r += 1
                  }else {
                    m = !0;
                    break a
                  }
                }
                m = void 0
              }
              return m ? cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, p), h.call(null, cljs.core.chunk_rest.call(null, d))) : cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, p), null)
            }
            p = cljs.core.first.call(null, d);
            return cljs.core.cons.call(null, cljs.core.assoc.call(null, c, new cljs.core.Keyword(null, "lightness", "lightness", 1700345823), p * b), h.call(null, cljs.core.rest.call(null, d)))
          }
          return null
        }
      }, null, null)
    }.call(null, cljs.core.range.call(null, 1, Math.floor.call(null, 100 / b)))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
var dommy = {attrs:{}};
dommy.attrs.class_match_QMARK_ = function(a, b, c) {
  var d;
  d = (d = 0 === c) ? d : " " === a.charAt(c - 1);
  return cljs.core.truth_(d) ? (d = a.length, b = c + b.length, b <= d ? (c = b === d) ? c : " " === a.charAt(b) : null) : d
};
dommy.attrs.class_index = function(a, b) {
  for(var c = 0;;) {
    if(c = a.indexOf(b, c), 0 <= c) {
      if(dommy.attrs.class_match_QMARK_.call(null, a, b, c)) {
        return c
      }
      c += b.length
    }else {
      return null
    }
  }
};
dommy.attrs.has_class_QMARK_ = function(a, b) {
  var c = dommy.template.__GT_node_like.call(null, a), d = cljs.core.name.call(null, b), e = c.classList;
  if(cljs.core.truth_(e)) {
    return e.contains(d)
  }
  c = c.className;
  return cljs.core.truth_(c) ? (d = dommy.attrs.class_index.call(null, c, d), cljs.core.truth_(d) ? 0 <= d : null) : null
};
dommy.attrs.add_class_BANG_ = function() {
  var a = null, b = function(a, b) {
    var c = dommy.template.__GT_node_like.call(null, a), g = clojure.string.trim.call(null, cljs.core.name.call(null, b));
    if(cljs.core.seq.call(null, g)) {
      var h = c.classList;
      if(cljs.core.truth_(h)) {
        for(var g = cljs.core.seq.call(null, g.split(/\s+/)), k = null, l = 0, m = 0;;) {
          if(m < l) {
            var n = cljs.core._nth.call(null, k, m);
            h.add(n);
            m += 1
          }else {
            if(g = cljs.core.seq.call(null, g)) {
              k = g, cljs.core.chunked_seq_QMARK_.call(null, k) ? (g = cljs.core.chunk_first.call(null, k), m = cljs.core.chunk_rest.call(null, k), k = g, l = cljs.core.count.call(null, g), g = m) : (g = cljs.core.first.call(null, k), h.add(g), g = cljs.core.next.call(null, k), k = null, l = 0), m = 0
            }else {
              break
            }
          }
        }
      }else {
        for(h = c.className, g = cljs.core.seq.call(null, g.split(/\s+/)), k = null, m = l = 0;;) {
          if(m < l) {
            n = cljs.core._nth.call(null, k, m), cljs.core.truth_(dommy.attrs.class_index.call(null, h, n)) || (c.className = "" === h ? n : [cljs.core.str(h), cljs.core.str(" "), cljs.core.str(n)].join("")), m += 1
          }else {
            if(g = cljs.core.seq.call(null, g)) {
              k = g, cljs.core.chunked_seq_QMARK_.call(null, k) ? (g = cljs.core.chunk_first.call(null, k), m = cljs.core.chunk_rest.call(null, k), k = g, l = cljs.core.count.call(null, g), g = m) : (g = cljs.core.first.call(null, k), cljs.core.truth_(dommy.attrs.class_index.call(null, h, g)) || (c.className = "" === h ? g : [cljs.core.str(h), cljs.core.str(" "), cljs.core.str(g)].join("")), g = cljs.core.next.call(null, k), k = null, l = 0), m = 0
            }else {
              break
            }
          }
        }
      }
    }
    return c
  }, c = function() {
    var b = function(b, c, d) {
      b = dommy.template.__GT_node_like.call(null, b);
      c = cljs.core.seq.call(null, cljs.core.conj.call(null, d, c));
      d = null;
      for(var e = 0, l = 0;;) {
        if(l < e) {
          var m = cljs.core._nth.call(null, d, l);
          a.call(null, b, m);
          l += 1
        }else {
          if(c = cljs.core.seq.call(null, c)) {
            d = c, cljs.core.chunked_seq_QMARK_.call(null, d) ? (c = cljs.core.chunk_first.call(null, d), l = cljs.core.chunk_rest.call(null, d), d = c, e = cljs.core.count.call(null, c), c = l) : (c = cljs.core.first.call(null, d), a.call(null, b, c), c = cljs.core.next.call(null, d), d = null, e = 0), l = 0
          }else {
            break
          }
        }
      }
      return b
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
dommy.attrs.remove_class_str = function(a, b) {
  for(var c = a;;) {
    var d = c.length, e = dommy.attrs.class_index.call(null, c, b);
    if(cljs.core.truth_(e)) {
      var f = e + b.length, c = "" + cljs.core.str(f < d ? [cljs.core.str(c.substring(0, e)), cljs.core.str(c.substr(f + 1))].join("") : c.substring(0, e - 1))
    }else {
      return c
    }
  }
};
dommy.attrs.remove_class_BANG_ = function() {
  var a = null, b = function(a, b) {
    var c = dommy.template.__GT_node_like.call(null, a), g = cljs.core.name.call(null, b), h = c.classList;
    cljs.core.truth_(h) ? h.remove(g) : (h = c.className, g = dommy.attrs.remove_class_str.call(null, h, g), h !== g && (c.className = g));
    return c
  }, c = function() {
    var b = function(b, c, d) {
      b = dommy.template.__GT_node_like.call(null, b);
      c = cljs.core.seq.call(null, cljs.core.conj.call(null, d, c));
      d = null;
      for(var e = 0, l = 0;;) {
        if(l < e) {
          var m = cljs.core._nth.call(null, d, l);
          a.call(null, b, m);
          l += 1
        }else {
          if(c = cljs.core.seq.call(null, c)) {
            d = c, cljs.core.chunked_seq_QMARK_.call(null, d) ? (c = cljs.core.chunk_first.call(null, d), e = cljs.core.chunk_rest.call(null, d), d = c, m = cljs.core.count.call(null, c), c = e, e = m) : (m = cljs.core.first.call(null, d), a.call(null, b, m), c = cljs.core.next.call(null, d), d = null, e = 0), l = 0
          }else {
            return null
          }
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
dommy.attrs.toggle_class_BANG_ = function() {
  var a = null, b = function(b, c) {
    var f = dommy.template.__GT_node_like.call(null, b), g = cljs.core.name.call(null, c), h = f.classList;
    cljs.core.truth_(h) ? h.toggle(g) : a.call(null, f, g, !dommy.attrs.has_class_QMARK_.call(null, f, g));
    return f
  }, c = function(a, b, c) {
    a = dommy.template.__GT_node_like.call(null, a);
    c ? dommy.attrs.add_class_BANG_.call(null, a, b) : dommy.attrs.remove_class_BANG_.call(null, a, b);
    return a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
dommy.attrs.style_str = function(a) {
  return"string" === typeof a ? a : clojure.string.join.call(null, " ", cljs.core.map.call(null, function(a) {
    var c = cljs.core.nth.call(null, a, 0, null);
    a = cljs.core.nth.call(null, a, 1, null);
    return[cljs.core.str(cljs.core.name.call(null, c)), cljs.core.str(":"), cljs.core.str(cljs.core.name.call(null, a)), cljs.core.str(";")].join("")
  }, a))
};
dommy.attrs.set_style_BANG_ = function() {
  var a = function(a, b) {
    if(!cljs.core.even_QMARK_.call(null, cljs.core.count.call(null, b))) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "even?", "even?", -1543640034, null), cljs.core.list(new cljs.core.Symbol(null, "count", "count", -1545680184, null), new cljs.core.Symbol(null, "kvs", "kvs", -1640424927, null)))))].join(""));
    }
    for(var e = dommy.template.__GT_node_like.call(null, a), f = e.style, g = cljs.core.seq.call(null, cljs.core.partition.call(null, 2, b)), h = null, k = 0, l = 0;;) {
      if(l < k) {
        var m = cljs.core._nth.call(null, h, l), n = cljs.core.nth.call(null, m, 0, null), m = cljs.core.nth.call(null, m, 1, null);
        f[cljs.core.name.call(null, n)] = m;
        l += 1
      }else {
        if(g = cljs.core.seq.call(null, g)) {
          cljs.core.chunked_seq_QMARK_.call(null, g) ? (k = cljs.core.chunk_first.call(null, g), g = cljs.core.chunk_rest.call(null, g), h = k, k = cljs.core.count.call(null, k)) : (k = cljs.core.first.call(null, g), h = cljs.core.nth.call(null, k, 0, null), k = cljs.core.nth.call(null, k, 1, null), f[cljs.core.name.call(null, h)] = k, g = cljs.core.next.call(null, g), h = null, k = 0), l = 0
        }else {
          break
        }
      }
    }
    return e
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
dommy.attrs.style = function(a, b) {
  if(!cljs.core.truth_(b)) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, new cljs.core.Symbol(null, "k", "k", -1640531420, null)))].join(""));
  }
  return window.getComputedStyle(dommy.template.__GT_node_like.call(null, a))[cljs.core.name.call(null, b)]
};
dommy.attrs.set_px_BANG_ = function() {
  var a = function(a, b) {
    if(!cljs.core.even_QMARK_.call(null, cljs.core.count.call(null, b))) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "even?", "even?", -1543640034, null), cljs.core.list(new cljs.core.Symbol(null, "count", "count", -1545680184, null), new cljs.core.Symbol(null, "kvs", "kvs", -1640424927, null)))))].join(""));
    }
    for(var e = dommy.template.__GT_node_like.call(null, a), f = cljs.core.seq.call(null, cljs.core.partition.call(null, 2, b)), g = null, h = 0, k = 0;;) {
      if(k < h) {
        var l = cljs.core._nth.call(null, g, k), m = cljs.core.nth.call(null, l, 0, null), l = cljs.core.nth.call(null, l, 1, null);
        dommy.attrs.set_style_BANG_.call(null, e, m, [cljs.core.str(l), cljs.core.str("px")].join(""));
        k += 1
      }else {
        if(f = cljs.core.seq.call(null, f)) {
          cljs.core.chunked_seq_QMARK_.call(null, f) ? (h = cljs.core.chunk_first.call(null, f), f = cljs.core.chunk_rest.call(null, f), g = h, h = cljs.core.count.call(null, h)) : (h = cljs.core.first.call(null, f), g = cljs.core.nth.call(null, h, 0, null), h = cljs.core.nth.call(null, h, 1, null), dommy.attrs.set_style_BANG_.call(null, e, g, [cljs.core.str(h), cljs.core.str("px")].join("")), f = cljs.core.next.call(null, f), g = null, h = 0), k = 0
        }else {
          break
        }
      }
    }
    return e
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
dommy.attrs.px = function(a, b) {
  var c = dommy.attrs.style.call(null, dommy.template.__GT_node_like.call(null, a), b);
  return cljs.core.seq.call(null, c) ? parseInt(c) : null
};
dommy.attrs.set_attr_BANG_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, dommy.template.__GT_node_like.call(null, b), c, "true")
  }, c = function(a, b, c) {
    if(cljs.core.truth_(c)) {
      if(cljs.core.fn_QMARK_.call(null, c)) {
        return a = dommy.template.__GT_node_like.call(null, a), a[cljs.core.name.call(null, b)] = c, a
      }
      a = dommy.template.__GT_node_like.call(null, a);
      a.setAttribute(cljs.core.name.call(null, b), b === new cljs.core.Keyword(null, "style", "style", 1123684643) ? dommy.attrs.style_str.call(null, c) : c);
      return a
    }
    return null
  }, d = function() {
    var b = function(b, c, d, e) {
      if(!cljs.core.even_QMARK_.call(null, cljs.core.count.call(null, e))) {
        throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "even?", "even?", -1543640034, null), cljs.core.list(new cljs.core.Symbol(null, "count", "count", -1545680184, null), new cljs.core.Symbol(null, "kvs", "kvs", -1640424927, null)))))].join(""));
      }
      b = dommy.template.__GT_node_like.call(null, b);
      c = cljs.core.seq.call(null, cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([c, d], !0), cljs.core.partition.call(null, 2, e)));
      d = null;
      for(var f = e = 0;;) {
        if(f < e) {
          var n = cljs.core._nth.call(null, d, f), p = cljs.core.nth.call(null, n, 0, null), n = cljs.core.nth.call(null, n, 1, null);
          a.call(null, b, p, n);
          f += 1
        }else {
          if(c = cljs.core.seq.call(null, c)) {
            cljs.core.chunked_seq_QMARK_.call(null, c) ? (e = cljs.core.chunk_first.call(null, c), c = cljs.core.chunk_rest.call(null, c), d = e, e = cljs.core.count.call(null, e)) : (e = cljs.core.first.call(null, c), d = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), a.call(null, b, d, e), c = cljs.core.next.call(null, c), d = null, e = 0), f = 0
          }else {
            break
          }
        }
      }
      return b
    }, c = function(a, c, d, f) {
      var m = null;
      3 < arguments.length && (m = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, d, m)
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var f = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, f, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, f, g, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
dommy.attrs.remove_attr_BANG_ = function() {
  var a = null, b = function(a, b) {
    var c = dommy.template.__GT_node_like.call(null, a);
    cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), null, new cljs.core.Keyword(null, "classes", "classes", 1867525016), null], !0).call(null, b)) ? c.className = "" : c.removeAttribute(cljs.core.name.call(null, b));
    return c
  }, c = function() {
    var b = function(b, c, d) {
      b = dommy.template.__GT_node_like.call(null, b);
      c = cljs.core.seq.call(null, cljs.core.cons.call(null, c, d));
      d = null;
      for(var e = 0, l = 0;;) {
        if(l < e) {
          var m = cljs.core._nth.call(null, d, l);
          a.call(null, b, m);
          l += 1
        }else {
          if(c = cljs.core.seq.call(null, c)) {
            d = c, cljs.core.chunked_seq_QMARK_.call(null, d) ? (c = cljs.core.chunk_first.call(null, d), l = cljs.core.chunk_rest.call(null, d), d = c, e = cljs.core.count.call(null, c), c = l) : (c = cljs.core.first.call(null, d), a.call(null, b, c), c = cljs.core.next.call(null, d), d = null, e = 0), l = 0
          }else {
            break
          }
        }
      }
      return b
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
dommy.attrs.attr = function(a, b) {
  return cljs.core.truth_(b) ? dommy.template.__GT_node_like.call(null, a).getAttribute(cljs.core.name.call(null, b)) : null
};
dommy.attrs.toggle_attr_BANG_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, cljs.core.boolean$.call(null, dommy.attrs.attr.call(null, b, c)))
  }, c = function(a, b, c) {
    a = dommy.template.__GT_node_like.call(null, a);
    return c ? dommy.attrs.set_attr_BANG_.call(null, a, b) : dommy.attrs.remove_attr_BANG_.call(null, a, b)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
dommy.attrs.hidden_QMARK_ = function(a) {
  return"none" === dommy.template.__GT_node_like.call(null, a).style.display
};
dommy.attrs.toggle_BANG_ = function() {
  var a = null, b = function(b) {
    b = dommy.template.__GT_node_like.call(null, b);
    a.call(null, b, dommy.attrs.hidden_QMARK_.call(null, b));
    return b
  }, c = function(a, b) {
    var c = dommy.template.__GT_node_like.call(null, a);
    c.style.display = b ? "" : "none";
    return c
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
dommy.attrs.hide_BANG_ = function(a) {
  a = dommy.template.__GT_node_like.call(null, a);
  dommy.attrs.toggle_BANG_.call(null, a, !1);
  return a
};
dommy.attrs.show_BANG_ = function(a) {
  a = dommy.template.__GT_node_like.call(null, a);
  dommy.attrs.toggle_BANG_.call(null, a, !0);
  return a
};
dommy.attrs.bounding_client_rect = function(a) {
  return cljs.core.js__GT_clj.call(null, function() {
    var b = dommy.template.__GT_node_like.call(null, a).getBoundingClientRect();
    b.constructor = Object;
    return b
  }(), new cljs.core.Keyword(null, "keywordize-keys", "keywordize-keys", 4191781672), !0)
};
dommy.attrs.scroll_into_view = function(a, b) {
  var c = dommy.template.__GT_node_like.call(null, a), d = (new cljs.core.Keyword(null, "top", "top", 1014019271)).call(null, dommy.attrs.bounding_client_rect.call(null, c));
  return window.innerHeight < d + c.offsetHeight ? c.scrollIntoView(b) : null
};
dommy.template = {};
dommy.template._PLUS_svg_ns_PLUS_ = "http://www.w3.org/2000/svg";
dommy.template._PLUS_svg_tags_PLUS_ = cljs.core.PersistentHashSet.fromArray(["svg", null, "line", null], !0);
dommy.template.PElement = {};
dommy.template._elem = function(a) {
  if(a ? a.dommy$template$PElement$_elem$arity$1 : a) {
    return a.dommy$template$PElement$_elem$arity$1(a)
  }
  var b;
  b = dommy.template._elem[goog.typeOf(null == a ? null : a)];
  if(!b && (b = dommy.template._elem._, !b)) {
    throw cljs.core.missing_protocol.call(null, "PElement.-elem", a);
  }
  return b.call(null, a)
};
dommy.template.next_css_index = function(a, b) {
  var c = a.indexOf("#", b), d = a.indexOf(".", b), e = Math.min(c, d);
  return 0 > e ? Math.max(c, d) : e
};
dommy.template.base_element = function(a) {
  var b = cljs.core.name.call(null, a), c = dommy.template.next_css_index.call(null, b, 0);
  a = 0 < c ? b.substring(0, c) : 0 === c ? "div" : new cljs.core.Keyword(null, "else", "else", 1017020587) ? b : null;
  a = cljs.core.truth_(dommy.template._PLUS_svg_tags_PLUS_.call(null, a)) ? document.createElementNS(dommy.template._PLUS_svg_ns_PLUS_, a) : document.createElement(a);
  if(0 <= c) {
    for(b = b.substring(c);;) {
      var c = dommy.template.next_css_index.call(null, b, 1), d = 0 <= c ? b.substring(0, c) : b, e = d.charAt(0);
      if(cljs.core._EQ_.call(null, "#", e)) {
        a.setAttribute("id", d.substring(1))
      }else {
        if(cljs.core._EQ_.call(null, ".", e)) {
          dommy.attrs.add_class_BANG_.call(null, a, d.substring(1))
        }else {
          if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
            throw Error([cljs.core.str("No matching clause: "), cljs.core.str(d.charAt(0))].join(""));
          }
        }
      }
      if(0 <= c) {
        b = b.substring(c)
      }else {
        break
      }
    }
  }
  return a
};
dommy.template.throw_unable_to_make_node = function(a) {
  throw[cljs.core.str("Don't know how to make node from: "), cljs.core.str(cljs.core.pr_str.call(null, a))].join("");
};
dommy.template.__GT_document_fragment = function() {
  var a = null, b = function(b) {
    return a.call(null, document.createDocumentFragment(), b)
  }, c = function(b, c) {
    if(c ? cljs.core.truth_(cljs.core.truth_(null) ? null : c.dommy$template$PElement$) || (c.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_.call(null, dommy.template.PElement, c)) : cljs.core.type_satisfies_.call(null, dommy.template.PElement, c)) {
      return b.appendChild(dommy.template._elem.call(null, c)), b
    }
    if(cljs.core.seq_QMARK_.call(null, c)) {
      for(var f = cljs.core.seq.call(null, c), g = null, h = 0, k = 0;;) {
        if(k < h) {
          var l = cljs.core._nth.call(null, g, k);
          a.call(null, b, l);
          k += 1
        }else {
          if(f = cljs.core.seq.call(null, f)) {
            g = f, cljs.core.chunked_seq_QMARK_.call(null, g) ? (f = cljs.core.chunk_first.call(null, g), k = cljs.core.chunk_rest.call(null, g), g = f, h = cljs.core.count.call(null, f), f = k) : (f = cljs.core.first.call(null, g), a.call(null, b, f), f = cljs.core.next.call(null, g), g = null, h = 0), k = 0
          }else {
            break
          }
        }
      }
      return b
    }
    return null == c ? b : new cljs.core.Keyword(null, "else", "else", 1017020587) ? dommy.template.throw_unable_to_make_node.call(null, c) : null
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
dommy.template.__GT_node_like = function(a) {
  return(a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.dommy$template$PElement$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_.call(null, dommy.template.PElement, a)) : cljs.core.type_satisfies_.call(null, dommy.template.PElement, a)) ? dommy.template._elem.call(null, a) : dommy.template.__GT_document_fragment.call(null, a)
};
dommy.template.compound_element = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null);
  a = cljs.core.nthnext.call(null, a, 2);
  var b = dommy.template.base_element.call(null, b), d = cljs.core.map_QMARK_.call(null, c), d = (d ? c ? cljs.core.truth_(cljs.core.truth_(null) ? null : c.dommy$template$PElement$) || (c.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_.call(null, dommy.template.PElement, c)) : cljs.core.type_satisfies_.call(null, dommy.template.PElement, c) : !d) ? null : c, c = cljs.core.truth_(d) ? a : cljs.core.cons.call(null, c, a);
  a = cljs.core.seq.call(null, d);
  for(var d = null, e = 0, f = 0;;) {
    if(f < e) {
      var g = cljs.core._nth.call(null, d, f), h = cljs.core.nth.call(null, g, 0, null), g = cljs.core.nth.call(null, g, 1, null), k = h;
      if(cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "classes", "classes", 1867525016), k)) {
        for(var h = cljs.core.seq.call(null, g), g = null, l = k = 0;;) {
          if(l < k) {
            var m = cljs.core._nth.call(null, g, l);
            dommy.attrs.add_class_BANG_.call(null, b, m);
            l += 1
          }else {
            if(h = cljs.core.seq.call(null, h)) {
              g = h, cljs.core.chunked_seq_QMARK_.call(null, g) ? (h = cljs.core.chunk_first.call(null, g), l = cljs.core.chunk_rest.call(null, g), g = h, k = cljs.core.count.call(null, h), h = l) : (h = cljs.core.first.call(null, g), dommy.attrs.add_class_BANG_.call(null, b, h), h = cljs.core.next.call(null, g), g = null, k = 0), l = 0
            }else {
              break
            }
          }
        }
      }else {
        cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "class", "class", 1108647146), k) ? dommy.attrs.add_class_BANG_.call(null, b, g) : new cljs.core.Keyword(null, "else", "else", 1017020587) && dommy.attrs.set_attr_BANG_.call(null, b, h, g)
      }
      f += 1
    }else {
      if(a = cljs.core.seq.call(null, a)) {
        if(cljs.core.chunked_seq_QMARK_.call(null, a)) {
          e = cljs.core.chunk_first.call(null, a), a = cljs.core.chunk_rest.call(null, a), d = e, e = cljs.core.count.call(null, e)
        }else {
          e = cljs.core.first.call(null, a);
          d = cljs.core.nth.call(null, e, 0, null);
          e = cljs.core.nth.call(null, e, 1, null);
          f = d;
          if(cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "classes", "classes", 1867525016), f)) {
            for(d = cljs.core.seq.call(null, e), e = null, h = f = 0;;) {
              if(h < f) {
                g = cljs.core._nth.call(null, e, h), dommy.attrs.add_class_BANG_.call(null, b, g), h += 1
              }else {
                if(d = cljs.core.seq.call(null, d)) {
                  e = d, cljs.core.chunked_seq_QMARK_.call(null, e) ? (d = cljs.core.chunk_first.call(null, e), h = cljs.core.chunk_rest.call(null, e), e = d, f = cljs.core.count.call(null, d), d = h) : (d = cljs.core.first.call(null, e), dommy.attrs.add_class_BANG_.call(null, b, d), d = cljs.core.next.call(null, e), e = null, f = 0), h = 0
                }else {
                  break
                }
              }
            }
          }else {
            cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "class", "class", 1108647146), f) ? dommy.attrs.add_class_BANG_.call(null, b, e) : new cljs.core.Keyword(null, "else", "else", 1017020587) && dommy.attrs.set_attr_BANG_.call(null, b, d, e)
          }
          a = cljs.core.next.call(null, a);
          d = null;
          e = 0
        }
        f = 0
      }else {
        break
      }
    }
  }
  b.appendChild(dommy.template.__GT_node_like.call(null, c));
  return b
};
dommy.template.PElement.string = !0;
dommy.template._elem.string = function(a) {
  return a instanceof cljs.core.Keyword ? dommy.template.base_element.call(null, a) : document.createTextNode("" + cljs.core.str(a))
};
dommy.template.PElement.number = !0;
dommy.template._elem.number = function(a) {
  return document.createTextNode("" + cljs.core.str(a))
};
cljs.core.PersistentVector.prototype.dommy$template$PElement$ = !0;
cljs.core.PersistentVector.prototype.dommy$template$PElement$_elem$arity$1 = function(a) {
  return dommy.template.compound_element.call(null, a)
};
SVGElement.prototype.dommy$template$PElement$ = !0;
SVGElement.prototype.dommy$template$PElement$_elem$arity$1 = function(a) {
  return a
};
Document.prototype.dommy$template$PElement$ = !0;
Document.prototype.dommy$template$PElement$_elem$arity$1 = function(a) {
  return a
};
Text.prototype.dommy$template$PElement$ = !0;
Text.prototype.dommy$template$PElement$_elem$arity$1 = function(a) {
  return a
};
DocumentFragment.prototype.dommy$template$PElement$ = !0;
DocumentFragment.prototype.dommy$template$PElement$_elem$arity$1 = function(a) {
  return a
};
HTMLElement.prototype.dommy$template$PElement$ = !0;
HTMLElement.prototype.dommy$template$PElement$_elem$arity$1 = function(a) {
  return a
};
try {
  Window.prototype.dommy$template$PElement$ = !0, Window.prototype.dommy$template$PElement$_elem$arity$1 = function(a) {
    return a
  }
}catch(e12248) {
  if(e12248 instanceof ReferenceError) {
    var __12249 = e12248;
    console.log("PElement: js/Window not defined by browser, skipping it... (running on phantomjs?)")
  }else {
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      throw e12248;
    }
  }
}
dommy.template.node = function(a) {
  return(a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.dommy$template$PElement$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_.call(null, dommy.template.PElement, a)) : cljs.core.type_satisfies_.call(null, dommy.template.PElement, a)) ? dommy.template._elem.call(null, a) : dommy.template.throw_unable_to_make_node.call(null, a)
};
dommy.template.html__GT_nodes = function(a) {
  var b = document.createElement("div");
  b.insertAdjacentHTML("beforeend", a);
  return cljs.core.seq.call(null, Array.prototype.slice.call(b.childNodes))
};
dommy.utils = {};
dommy.utils.dissoc_in = function dissoc_in(b, c) {
  var d = cljs.core.nth.call(null, c, 0, null), e = cljs.core.nthnext.call(null, c, 1);
  if(cljs.core.truth_(b)) {
    e = cljs.core.truth_(e) ? dissoc_in.call(null, b.call(null, d), e) : e;
    if(cljs.core.truth_(e)) {
      return cljs.core.assoc.call(null, b, d, e)
    }
    d = cljs.core.dissoc.call(null, b, d);
    return cljs.core.empty_QMARK_.call(null, d) ? null : d
  }
  return null
};
dommy.utils.__GT_Array = function(a) {
  return Array.prototype.slice.call(a)
};
dommy.core = {};
dommy.core.has_class_QMARK_ = dommy.attrs.has_class_QMARK_;
dommy.core.add_class_BANG_ = dommy.attrs.add_class_BANG_;
dommy.core.remove_class_BANG_ = dommy.attrs.remove_class_BANG_;
dommy.core.toggle_class_BANG_ = dommy.attrs.toggle_class_BANG_;
dommy.core.set_attr_BANG_ = dommy.attrs.set_attr_BANG_;
dommy.core.set_style_BANG_ = dommy.attrs.set_style_BANG_;
dommy.core.set_px_BANG_ = dommy.attrs.set_px_BANG_;
dommy.core.px = dommy.attrs.px;
dommy.core.style_str = dommy.attrs.style_str;
dommy.core.style = dommy.attrs.style;
dommy.core.remove_attr_BANG_ = dommy.attrs.remove_attr_BANG_;
dommy.core.toggle_attr_BANG_ = dommy.attrs.toggle_attr_BANG_;
dommy.core.attr = dommy.attrs.attr;
dommy.core.hidden_QMARK_ = dommy.attrs.hidden_QMARK_;
dommy.core.toggle_BANG_ = dommy.attrs.toggle_BANG_;
dommy.core.hide_BANG_ = dommy.attrs.hide_BANG_;
dommy.core.show_BANG_ = dommy.attrs.show_BANG_;
dommy.core.bounding_client_rect = dommy.attrs.bounding_client_rect;
dommy.core.scroll_into_view = dommy.attrs.scroll_into_view;
dommy.core.dissoc_in = dommy.utils.dissoc_in;
dommy.core.__GT_Array = dommy.utils.__GT_Array;
dommy.core.set_html_BANG_ = function(a, b) {
  var c = dommy.template.__GT_node_like.call(null, a);
  c.innerHTML = b;
  return c
};
dommy.core.html = function(a) {
  return dommy.template.__GT_node_like.call(null, a).innerHTML
};
dommy.core.set_text_BANG_ = function(a, b) {
  var c = dommy.template.__GT_node_like.call(null, a), d = cljs.core.truth_(c.textContent) ? "textContent" : "innerText";
  c[d] = b;
  return c
};
dommy.core.text = function(a) {
  var b = a.textContent;
  return cljs.core.truth_(b) ? b : a.innerText
};
dommy.core.value = function(a) {
  return dommy.template.__GT_node_like.call(null, a).value
};
dommy.core.set_value_BANG_ = function(a, b) {
  var c = dommy.template.__GT_node_like.call(null, a);
  c.value = b;
  return c
};
dommy.core.append_BANG_ = function() {
  var a = null, b = function(a, b) {
    var c = dommy.template.__GT_node_like.call(null, a);
    c.appendChild(dommy.template.__GT_node_like.call(null, b));
    return c
  }, c = function() {
    var b = function(b, c, d) {
      b = dommy.template.__GT_node_like.call(null, b);
      c = cljs.core.seq.call(null, cljs.core.cons.call(null, c, d));
      d = null;
      for(var e = 0, l = 0;;) {
        if(l < e) {
          var m = cljs.core._nth.call(null, d, l);
          a.call(null, b, m);
          l += 1
        }else {
          if(c = cljs.core.seq.call(null, c)) {
            d = c, cljs.core.chunked_seq_QMARK_.call(null, d) ? (c = cljs.core.chunk_first.call(null, d), l = cljs.core.chunk_rest.call(null, d), d = c, e = cljs.core.count.call(null, c), c = l) : (c = cljs.core.first.call(null, d), a.call(null, b, c), c = cljs.core.next.call(null, d), d = null, e = 0), l = 0
          }else {
            break
          }
        }
      }
      return b
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
dommy.core.prepend_BANG_ = function() {
  var a = null, b = function(a, b) {
    var c = dommy.template.__GT_node_like.call(null, a);
    return c.insertBefore(dommy.template.__GT_node_like.call(null, b), c.firstChild)
  }, c = function() {
    var b = function(b, c, d) {
      b = dommy.template.__GT_node_like.call(null, b);
      c = cljs.core.seq.call(null, cljs.core.cons.call(null, c, d));
      d = null;
      for(var e = 0, l = 0;;) {
        if(l < e) {
          var m = cljs.core._nth.call(null, d, l);
          a.call(null, b, m);
          l += 1
        }else {
          if(c = cljs.core.seq.call(null, c)) {
            d = c, cljs.core.chunked_seq_QMARK_.call(null, d) ? (c = cljs.core.chunk_first.call(null, d), l = cljs.core.chunk_rest.call(null, d), d = c, e = cljs.core.count.call(null, c), c = l) : (c = cljs.core.first.call(null, d), a.call(null, b, c), c = cljs.core.next.call(null, d), d = null, e = 0), l = 0
          }else {
            break
          }
        }
      }
      return b
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
dommy.core.insert_before_BANG_ = function(a, b) {
  var c = dommy.template.__GT_node_like.call(null, a), d = dommy.template.__GT_node_like.call(null, b);
  if(!cljs.core.truth_(d.parentNode)) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, ".-parentNode", ".-parentNode", 499016324, null), new cljs.core.Symbol(null, "other", "other", -1534461751, null))))].join(""));
  }
  d.parentNode.insertBefore(c, d);
  return c
};
dommy.core.insert_after_BANG_ = function(a, b) {
  var c = dommy.template.__GT_node_like.call(null, a), d = dommy.template.__GT_node_like.call(null, b), e = d.parentNode, d = d.nextSibling;
  cljs.core.truth_(d) ? e.insertBefore(c, d) : e.appendChild(c);
  return c
};
dommy.core.replace_BANG_ = function(a, b) {
  var c = dommy.template.__GT_node_like.call(null, b), d = dommy.template.__GT_node_like.call(null, a);
  if(!cljs.core.truth_(d.parentNode)) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, ".-parentNode", ".-parentNode", 499016324, null), new cljs.core.Symbol(null, "elem", "elem", -1637415608, null))))].join(""));
  }
  d.parentNode.replaceChild(c, d);
  return c
};
dommy.core.replace_contents_BANG_ = function(a, b) {
  var c = dommy.template.__GT_node_like.call(null, a);
  c.innerHTML = "";
  dommy.core.append_BANG_.call(null, c, b);
  return c
};
dommy.core.remove_BANG_ = function(a) {
  a = dommy.template.__GT_node_like.call(null, a);
  var b = a.parentNode;
  b.removeChild(a);
  return b
};
dommy.core.clear_BANG_ = function(a) {
  return dommy.template.__GT_node_like.call(null, a).innerHTML = ""
};
dommy.core.selector = function selector(b) {
  if(cljs.core.coll_QMARK_.call(null, b)) {
    return clojure.string.join.call(null, " ", cljs.core.map.call(null, selector, b))
  }
  var c;
  c = (c = "string" === typeof b) ? c : b instanceof cljs.core.Keyword;
  return c ? cljs.core.name.call(null, b) : null
};
dommy.core.selector_map = function selector_map(b, c) {
  var d = dommy.template.__GT_node_like.call(null, b);
  if(cljs.core.contains_QMARK_.call(null, c, new cljs.core.Keyword(null, "container", "container", 602947571))) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol(null, "contains?", "contains?", -2051487815, null), new cljs.core.Symbol(null, "key-selectors-map", "key-selectors-map", 19054414, null), new cljs.core.Keyword(null, "container", "container", 602947571)))))].join(""));
  }
  return cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "container", "container", 602947571), d], !0), cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, cljs.core.map.call(null, function(e) {
    var f = cljs.core.nth.call(null, e, 0, null), g = cljs.core.nth.call(null, e, 1, null);
    return cljs.core.PersistentVector.fromArray([f, cljs.core.truth_((new cljs.core.Keyword(null, "live", "live", 1017226334)).call(null, cljs.core.meta.call(null, g))) ? function() {
      "undefined" === typeof dommy.core.t11781 && (dommy.core.t11781 = {}, dommy.core.t11781 = function(b, c, d, e, f, g, r, s, q) {
        this.v = b;
        this.k = c;
        this.vec__11780 = d;
        this.p__11779 = e;
        this.container = f;
        this.key_selectors_map = g;
        this.template = r;
        this.selector_map = s;
        this.meta11782 = q;
        this.cljs$lang$protocol_mask$partition1$ = 0;
        this.cljs$lang$protocol_mask$partition0$ = 425984
      }, dommy.core.t11781.cljs$lang$type = !0, dommy.core.t11781.cljs$lang$ctorStr = "dommy.core/t11781", dommy.core.t11781.cljs$lang$ctorPrWriter = function(b, c, d) {
        return cljs.core._write.call(null, c, "dommy.core/t11781")
      }, dommy.core.t11781.prototype.cljs$core$IDeref$_deref$arity$1 = function(b) {
        return dommy.utils.__GT_Array.call(null, dommy.template.__GT_node_like.call(null, this.container).querySelectorAll(dommy.core.selector.call(null, this.v)))
      }, dommy.core.t11781.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
        return this.meta11782
      }, dommy.core.t11781.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
        return new dommy.core.t11781(this.v, this.k, this.vec__11780, this.p__11779, this.container, this.key_selectors_map, this.template, this.selector_map, c)
      }, dommy.core.__GT_t11781 = function(b, c, d, e, f, g, r, s, q) {
        return new dommy.core.t11781(b, c, d, e, f, g, r, s, q)
      });
      return new dommy.core.t11781(g, f, e, e, d, c, b, selector_map, null)
    }() : dommy.template.__GT_node_like.call(null, d).querySelector(dommy.core.selector.call(null, g))], !0)
  }, c)))
};
dommy.core.ancestor_nodes = function(a) {
  return cljs.core.take_while.call(null, cljs.core.identity, cljs.core.iterate.call(null, function(a) {
    return a.parentNode
  }, dommy.template.__GT_node_like.call(null, a)))
};
dommy.core.matches_pred = function() {
  var a = null, b = function(b) {
    return a.call(null, document, b)
  }, c = function(a, b) {
    var c = dommy.utils.__GT_Array.call(null, dommy.template.__GT_node_like.call(null, dommy.template.__GT_node_like.call(null, a)).querySelectorAll(dommy.core.selector.call(null, b)));
    return function(a) {
      return 0 <= c.indexOf(a)
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
dommy.core.closest = function() {
  var a = null, b = function(a, b) {
    return cljs.core.first.call(null, cljs.core.filter.call(null, dommy.core.matches_pred.call(null, b), dommy.core.ancestor_nodes.call(null, dommy.template.__GT_node_like.call(null, a))))
  }, c = function(a, b, c) {
    var g = dommy.template.__GT_node_like.call(null, a);
    a = dommy.template.__GT_node_like.call(null, b);
    return cljs.core.first.call(null, cljs.core.filter.call(null, dommy.core.matches_pred.call(null, g, c), cljs.core.take_while.call(null, function(a) {
      return a !== g
    }, dommy.core.ancestor_nodes.call(null, a))))
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
dommy.core.descendant_QMARK_ = function(a, b) {
  var c = dommy.template.__GT_node_like.call(null, a), d = dommy.template.__GT_node_like.call(null, b);
  return cljs.core.truth_(d.contains) ? d.contains(c) : cljs.core.truth_(d.compareDocumentPosition) ? 0 != (d.compareDocumentPosition(c) & 16) : null
};
dommy.core.special_listener_makers = cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, cljs.core.map.call(null, function(a) {
  var b = cljs.core.nth.call(null, a, 0, null);
  a = cljs.core.nth.call(null, a, 1, null);
  return cljs.core.PersistentVector.fromArray([b, cljs.core.PersistentArrayMap.fromArray([a, function(a) {
    return function(b) {
      var e = b.relatedTarget, f;
      f = b.selectedTarget;
      f = cljs.core.truth_(f) ? f : b.currentTarget;
      return cljs.core.truth_(cljs.core.truth_(e) ? dommy.core.descendant_QMARK_.call(null, e, f) : e) ? null : a.call(null, b)
    }
  }], !0)], !0)
}, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "mouseenter", "mouseenter", 2027084997), new cljs.core.Keyword(null, "mouseover", "mouseover", 1601081963), new cljs.core.Keyword(null, "mouseleave", "mouseleave", 2033263780), new cljs.core.Keyword(null, "mouseout", "mouseout", 894298107)], !0)));
dommy.core.live_listener = function(a, b, c) {
  return function(d) {
    var e = dommy.core.closest.call(null, dommy.template.__GT_node_like.call(null, a), d.target, b);
    return cljs.core.truth_(cljs.core.truth_(e) ? cljs.core.not.call(null, dommy.core.attr.call(null, e, new cljs.core.Keyword(null, "disabled", "disabled", 1284845038))) : e) ? (d.selectedTarget = e, c.call(null, d)) : null
  }
};
dommy.core.event_listeners = function(a) {
  a = dommy.template.__GT_node_like.call(null, a).dommyEventListeners;
  return cljs.core.truth_(a) ? a : cljs.core.PersistentArrayMap.EMPTY
};
dommy.core.update_event_listeners_BANG_ = function() {
  var a = function(a, b, e) {
    a = dommy.template.__GT_node_like.call(null, a);
    return a.dommyEventListeners = cljs.core.apply.call(null, b, dommy.core.event_listeners.call(null, a), e)
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
dommy.core.elem_and_selector = function(a) {
  return cljs.core.sequential_QMARK_.call(null, a) ? cljs.core.juxt.call(null, function(a) {
    return dommy.template.__GT_node_like.call(null, cljs.core.first.call(null, a))
  }, cljs.core.rest).call(null, a) : cljs.core.PersistentVector.fromArray([dommy.template.__GT_node_like.call(null, a), null], !0)
};
dommy.core.listen_BANG_ = function() {
  var a = function(a, b) {
    if(!cljs.core.even_QMARK_.call(null, cljs.core.count.call(null, b))) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "even?", "even?", -1543640034, null), cljs.core.list(new cljs.core.Symbol(null, "count", "count", -1545680184, null), new cljs.core.Symbol(null, "type-fs", "type-fs", 1801297401, null)))))].join(""));
    }
    for(var e = dommy.core.elem_and_selector.call(null, a), f = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), g = cljs.core.seq.call(null, cljs.core.partition.call(null, 2, b)), h = null, k = 0, l = 0;;) {
      if(l < k) {
        for(var m = cljs.core._nth.call(null, h, l), n = cljs.core.nth.call(null, m, 0, null), m = cljs.core.nth.call(null, m, 1, null), n = cljs.core.seq.call(null, cljs.core.get.call(null, dommy.core.special_listener_makers, n, cljs.core.PersistentArrayMap.fromArray([n, cljs.core.identity], !0))), p = null, r = 0, s = 0;;) {
          if(s < r) {
            var q = cljs.core._nth.call(null, p, s), t = cljs.core.nth.call(null, q, 0, null), q = cljs.core.nth.call(null, q, 1, null), q = (cljs.core.truth_(e) ? cljs.core.partial.call(null, dommy.core.live_listener, f, e) : cljs.core.identity).call(null, q.call(null, m));
            dommy.core.update_event_listeners_BANG_.call(null, f, cljs.core.assoc_in, cljs.core.PersistentVector.fromArray([e, t, m], !0), q);
            cljs.core.truth_(f.addEventListener) ? f.addEventListener(cljs.core.name.call(null, t), q) : f.attachEvent(cljs.core.name.call(null, t), q);
            s += 1
          }else {
            if(n = cljs.core.seq.call(null, n)) {
              cljs.core.chunked_seq_QMARK_.call(null, n) ? (r = cljs.core.chunk_first.call(null, n), n = cljs.core.chunk_rest.call(null, n), p = r, r = cljs.core.count.call(null, r)) : (r = cljs.core.first.call(null, n), p = cljs.core.nth.call(null, r, 0, null), r = cljs.core.nth.call(null, r, 1, null), r = (cljs.core.truth_(e) ? cljs.core.partial.call(null, dommy.core.live_listener, f, e) : cljs.core.identity).call(null, r.call(null, m)), dommy.core.update_event_listeners_BANG_.call(null, f, cljs.core.assoc_in, 
              cljs.core.PersistentVector.fromArray([e, p, m], !0), r), cljs.core.truth_(f.addEventListener) ? f.addEventListener(cljs.core.name.call(null, p), r) : f.attachEvent(cljs.core.name.call(null, p), r), n = cljs.core.next.call(null, n), p = null, r = 0), s = 0
            }else {
              break
            }
          }
        }
        l += 1
      }else {
        if(g = cljs.core.seq.call(null, g)) {
          if(cljs.core.chunked_seq_QMARK_.call(null, g)) {
            k = cljs.core.chunk_first.call(null, g), g = cljs.core.chunk_rest.call(null, g), h = k, k = cljs.core.count.call(null, k)
          }else {
            h = cljs.core.first.call(null, g);
            k = cljs.core.nth.call(null, h, 0, null);
            h = cljs.core.nth.call(null, h, 1, null);
            k = cljs.core.seq.call(null, cljs.core.get.call(null, dommy.core.special_listener_makers, k, cljs.core.PersistentArrayMap.fromArray([k, cljs.core.identity], !0)));
            l = null;
            for(n = m = 0;;) {
              if(n < m) {
                r = cljs.core._nth.call(null, l, n), p = cljs.core.nth.call(null, r, 0, null), r = cljs.core.nth.call(null, r, 1, null), r = (cljs.core.truth_(e) ? cljs.core.partial.call(null, dommy.core.live_listener, f, e) : cljs.core.identity).call(null, r.call(null, h)), dommy.core.update_event_listeners_BANG_.call(null, f, cljs.core.assoc_in, cljs.core.PersistentVector.fromArray([e, p, h], !0), r), cljs.core.truth_(f.addEventListener) ? f.addEventListener(cljs.core.name.call(null, p), r) : f.attachEvent(cljs.core.name.call(null, 
                p), r), n += 1
              }else {
                if(k = cljs.core.seq.call(null, k)) {
                  cljs.core.chunked_seq_QMARK_.call(null, k) ? (m = cljs.core.chunk_first.call(null, k), k = cljs.core.chunk_rest.call(null, k), l = m, m = cljs.core.count.call(null, m)) : (m = cljs.core.first.call(null, k), l = cljs.core.nth.call(null, m, 0, null), m = cljs.core.nth.call(null, m, 1, null), m = (cljs.core.truth_(e) ? cljs.core.partial.call(null, dommy.core.live_listener, f, e) : cljs.core.identity).call(null, m.call(null, h)), dommy.core.update_event_listeners_BANG_.call(null, f, 
                  cljs.core.assoc_in, cljs.core.PersistentVector.fromArray([e, l, h], !0), m), cljs.core.truth_(f.addEventListener) ? f.addEventListener(cljs.core.name.call(null, l), m) : f.attachEvent(cljs.core.name.call(null, l), m), k = cljs.core.next.call(null, k), l = null, m = 0), n = 0
                }else {
                  break
                }
              }
            }
            g = cljs.core.next.call(null, g);
            h = null;
            k = 0
          }
          l = 0
        }else {
          break
        }
      }
    }
    return a
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
dommy.core.unlisten_BANG_ = function() {
  var a = function(a, b) {
    if(!cljs.core.even_QMARK_.call(null, cljs.core.count.call(null, b))) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "even?", "even?", -1543640034, null), cljs.core.list(new cljs.core.Symbol(null, "count", "count", -1545680184, null), new cljs.core.Symbol(null, "type-fs", "type-fs", 1801297401, null)))))].join(""));
    }
    for(var e = dommy.core.elem_and_selector.call(null, a), f = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), g = cljs.core.seq.call(null, cljs.core.partition.call(null, 2, b)), h = null, k = 0, l = 0;;) {
      if(l < k) {
        for(var m = cljs.core._nth.call(null, h, l), n = cljs.core.nth.call(null, m, 0, null), m = cljs.core.nth.call(null, m, 1, null), n = cljs.core.seq.call(null, cljs.core.get.call(null, dommy.core.special_listener_makers, n, cljs.core.PersistentArrayMap.fromArray([n, cljs.core.identity], !0))), p = null, r = 0, s = 0;;) {
          if(s < r) {
            var q = cljs.core._nth.call(null, p, s), t = cljs.core.nth.call(null, q, 0, null);
            cljs.core.nth.call(null, q, 1, null);
            var q = cljs.core.PersistentVector.fromArray([e, t, m], !0), u = cljs.core.get_in.call(null, dommy.core.event_listeners.call(null, f), q);
            dommy.core.update_event_listeners_BANG_.call(null, f, dommy.utils.dissoc_in, q);
            cljs.core.truth_(f.removeEventListener) ? f.removeEventListener(cljs.core.name.call(null, t), u) : f.detachEvent(cljs.core.name.call(null, t), u);
            s += 1
          }else {
            if(n = cljs.core.seq.call(null, n)) {
              cljs.core.chunked_seq_QMARK_.call(null, n) ? (r = cljs.core.chunk_first.call(null, n), n = cljs.core.chunk_rest.call(null, n), p = r, r = cljs.core.count.call(null, r)) : (r = cljs.core.first.call(null, n), p = cljs.core.nth.call(null, r, 0, null), cljs.core.nth.call(null, r, 1, null), r = cljs.core.PersistentVector.fromArray([e, p, m], !0), s = cljs.core.get_in.call(null, dommy.core.event_listeners.call(null, f), r), dommy.core.update_event_listeners_BANG_.call(null, f, dommy.utils.dissoc_in, 
              r), cljs.core.truth_(f.removeEventListener) ? f.removeEventListener(cljs.core.name.call(null, p), s) : f.detachEvent(cljs.core.name.call(null, p), s), n = cljs.core.next.call(null, n), p = null, r = 0), s = 0
            }else {
              break
            }
          }
        }
        l += 1
      }else {
        if(g = cljs.core.seq.call(null, g)) {
          if(cljs.core.chunked_seq_QMARK_.call(null, g)) {
            k = cljs.core.chunk_first.call(null, g), g = cljs.core.chunk_rest.call(null, g), h = k, k = cljs.core.count.call(null, k)
          }else {
            h = cljs.core.first.call(null, g);
            k = cljs.core.nth.call(null, h, 0, null);
            h = cljs.core.nth.call(null, h, 1, null);
            k = cljs.core.seq.call(null, cljs.core.get.call(null, dommy.core.special_listener_makers, k, cljs.core.PersistentArrayMap.fromArray([k, cljs.core.identity], !0)));
            l = null;
            for(n = m = 0;;) {
              if(n < m) {
                r = cljs.core._nth.call(null, l, n), p = cljs.core.nth.call(null, r, 0, null), cljs.core.nth.call(null, r, 1, null), r = cljs.core.PersistentVector.fromArray([e, p, h], !0), s = cljs.core.get_in.call(null, dommy.core.event_listeners.call(null, f), r), dommy.core.update_event_listeners_BANG_.call(null, f, dommy.utils.dissoc_in, r), cljs.core.truth_(f.removeEventListener) ? f.removeEventListener(cljs.core.name.call(null, p), s) : f.detachEvent(cljs.core.name.call(null, p), s), n += 
                1
              }else {
                if(k = cljs.core.seq.call(null, k)) {
                  cljs.core.chunked_seq_QMARK_.call(null, k) ? (m = cljs.core.chunk_first.call(null, k), k = cljs.core.chunk_rest.call(null, k), l = m, m = cljs.core.count.call(null, m)) : (m = cljs.core.first.call(null, k), l = cljs.core.nth.call(null, m, 0, null), cljs.core.nth.call(null, m, 1, null), m = cljs.core.PersistentVector.fromArray([e, l, h], !0), n = cljs.core.get_in.call(null, dommy.core.event_listeners.call(null, f), m), dommy.core.update_event_listeners_BANG_.call(null, f, dommy.utils.dissoc_in, 
                  m), cljs.core.truth_(f.removeEventListener) ? f.removeEventListener(cljs.core.name.call(null, l), n) : f.detachEvent(cljs.core.name.call(null, l), n), k = cljs.core.next.call(null, k), l = null, m = 0), n = 0
                }else {
                  break
                }
              }
            }
            g = cljs.core.next.call(null, g);
            h = null;
            k = 0
          }
          l = 0
        }else {
          break
        }
      }
    }
    return a
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
dommy.core.listen_once_BANG_ = function() {
  var a = function(a, b) {
    if(!cljs.core.even_QMARK_.call(null, cljs.core.count.call(null, b))) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "even?", "even?", -1543640034, null), cljs.core.list(new cljs.core.Symbol(null, "count", "count", -1545680184, null), new cljs.core.Symbol(null, "type-fs", "type-fs", 1801297401, null)))))].join(""));
    }
    var e = dommy.core.elem_and_selector.call(null, a);
    cljs.core.nth.call(null, e, 0, null);
    cljs.core.nth.call(null, e, 1, null);
    for(var e = cljs.core.seq.call(null, cljs.core.partition.call(null, 2, b)), f = null, g = 0, h = 0;;) {
      if(h < g) {
        var k = cljs.core._nth.call(null, f, h), l = cljs.core.nth.call(null, k, 0, null), m = cljs.core.nth.call(null, k, 1, null);
        dommy.core.listen_BANG_.call(null, a, l, function(b, d, e, f, g, h, k) {
          return function N(b) {
            dommy.core.unlisten_BANG_.call(null, a, h, N);
            return k.call(null, b)
          }
        }(e, f, g, h, k, l, m));
        h += 1
      }else {
        if(l = cljs.core.seq.call(null, e)) {
          k = l;
          if(cljs.core.chunked_seq_QMARK_.call(null, k)) {
            e = cljs.core.chunk_first.call(null, k), h = cljs.core.chunk_rest.call(null, k), f = e, g = cljs.core.count.call(null, e), e = h
          }else {
            var m = cljs.core.first.call(null, k), n = cljs.core.nth.call(null, m, 0, null), p = cljs.core.nth.call(null, m, 1, null);
            dommy.core.listen_BANG_.call(null, a, n, function(b, d, e, f, g, h, k, l, m) {
              return function y(b) {
                dommy.core.unlisten_BANG_.call(null, a, h, y);
                return k.call(null, b)
              }
            }(e, f, g, h, m, n, p, k, l));
            e = cljs.core.next.call(null, k);
            f = null;
            g = 0
          }
          h = 0
        }else {
          break
        }
      }
    }
    return a
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
dommy.core.fire_BANG_ = function() {
  var a = function(a, b, e) {
    e = cljs.core.nth.call(null, e, 0, null);
    if(!dommy.core.descendant_QMARK_.call(null, a, document.documentElement)) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "descendant?", "descendant?", -1886221157, null), new cljs.core.Symbol(null, "node", "node", -1637144645, null), new cljs.core.Symbol("js", "document.documentElement", "js/document.documentElement", -1449696112, null))))].join(""));
    }
    e = cljs.core.truth_(e) ? e : cljs.core.identity;
    if(cljs.core.truth_(document.createEvent)) {
      var f = document.createEvent("Event");
      f.initEvent(cljs.core.name.call(null, b), !0, !0);
      return a.dispatchEvent(e.call(null, f))
    }
    return a.fireEvent([cljs.core.str("on"), cljs.core.str(cljs.core.name.call(null, b))].join(""), e.call(null, document.createEventObject()))
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
lucuma.overlay = {};
lucuma.overlay.style = cljs.core.PersistentVector.fromArray([cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "body", "body", 1016933652), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "overflow", "overflow", 1543546740), "visible", new cljs.core.Keyword(null, "overflow-y", "overflow-y", 3194205408), "scroll"], !0)], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, ".overlay-backdrop-active", ".overlay-backdrop-active", 3945912420), new cljs.core.Keyword(null, 
"body", "body", 1016933652), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "overflow", "overflow", 1543546740), "hidden"], !0)], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, ".b-overlay-backdrop", ".b-overlay-backdrop", 3653671774), cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null, "bottom", "bottom", 3925642653), new cljs.core.Keyword(null, "position", "position", 1761709211), new cljs.core.Keyword(null, "display", "display", 2685668404), 
new cljs.core.Keyword(null, "z-index", "z-index", 3303828785), new cljs.core.Keyword(null, "overflow-x", "overflow-x", 3194205407), new cljs.core.Keyword(null, "overflow-y", "overflow-y", 3194205408), new cljs.core.Keyword(null, "top", "top", 1014019271), new cljs.core.Keyword(null, "right", "right", 1122416014), new cljs.core.Keyword(null, "left", "left", 1017222009), new cljs.core.Keyword(null, "background-color", "background-color", 1619226998)], [0, "fixed", "none", 998, "auto", "scroll", 0, 
0, 0, garden.color.rgba.call(null, 252, 252, 252, 0.7)])], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, ".b-overlay-backdrop-close", ".b-overlay-backdrop-close", 2212228169), cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null, "border", "border", 3925567390), new cljs.core.Keyword(null, "position", "position", 1761709211), new cljs.core.Keyword(null, "width", "width", 1127031096), new cljs.core.Keyword(null, "color", "color", 1108746965), new cljs.core.Keyword(null, 
"font-size", "font-size", 3722789425), new cljs.core.Keyword(null, "text-align", "text-align", 1760136663), new cljs.core.Keyword(null, "cursor", "cursor", 3959752392), new cljs.core.Keyword(null, "top", "top", 1014019271), new cljs.core.Keyword(null, "right", "right", 1122416014), new cljs.core.Keyword(null, "height", "height", 4087841945)], ["0", "fixed", garden.units.px.call(null, 30), "#aaa", garden.units.px.call(null, 30), "center", "pointer", garden.units.px.call(null, 10), garden.units.px.call(null, 
10), garden.units.px.call(null, 30)])], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, ".b-overlay-body", ".b-overlay-body", 3557664682), cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null, "border", "border", 3925567390), new cljs.core.Keyword(null, "margin", "margin", 4227561760), new cljs.core.Keyword(null, "position", "position", 1761709211), new cljs.core.Keyword(null, "background", "background", 3976677536), new cljs.core.Keyword(null, "padding", "padding", 
4502531971), new cljs.core.Keyword(null, "box-shadow", "box-shadow", 3529658068), new cljs.core.Keyword(null, "z-index", "z-index", 3303828785), new cljs.core.Keyword(null, "-webkit-box-shadow", "-webkit-box-shadow", 665567730), new cljs.core.Keyword(null, "-moz-box-shadow", "-moz-box-shadow", 4480492054)], ["1px solid #cccccc", "60px auto", "static", "#ffffff", garden.units.px.call(null, 60), "0 2px 4px rgba(0, 0, 0,.2)", 999, "0 2px 4px rgba(0,0,0,.2)", "-1px 1px 1px rgba(0,0,0,.2)"])], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, 
".q-overlay", ".q-overlay", 2506059256), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "width", "width", 1127031096), garden.units.px.call(null, 600)], !0)], !0)], !0);
lucuma.overlay.display_BANG_ = function(a, b) {
  return a.style.display = b
};
lucuma.overlay.backdrop = function(a) {
  return a.shadowRoot.querySelector(".q-b-overlay-backdrop")
};
lucuma.overlay.hide = function(a) {
  lucuma.overlay.display_BANG_.call(null, lucuma.overlay.backdrop.call(null, a), "none");
  return lucuma.event.fire.call(null, a, "hide")
};
lucuma.overlay.show = function(a) {
  lucuma.overlay.display_BANG_.call(null, lucuma.overlay.backdrop.call(null, a), "block");
  dommy.core.add_class_BANG_.call(null, dommy.utils.__GT_Array.call(null, document.getElementsByTagName("html"))[0], new cljs.core.Keyword(null, "overlay-backdrop-active", "overlay-backdrop-active", 2733255762));
  a.addEventListener("click", function() {
    return lucuma.overlay.hide.call(null, a)
  });
  return lucuma.event.fire.call(null, a, "show")
};
lucuma.overlay.lucu_overlay = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "lucu-overlay"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "div", "div", 1014003715), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "b-overlay-backdrop q-b-overlay-backdrop"], 
!0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "div", "div", 1014003715), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "b-overlay-backdrop-close q-b-overlay-backdrop-close", new cljs.core.Keyword(null, "title", "title", 1124275658), "Press ESC to close"], !0), "x"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "div", "div", 1014003715), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, 
"class", "class", 1108647146), "b-overlay-body q-overlay"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859)], !0)], !0)], !0), new cljs.core.Keyword(null, "style", "style", 1123684643), lucuma.overlay.style, new cljs.core.Keyword(null, "methods", "methods", 1969438500), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "show", "show", 1017433711), lucuma.overlay.show, new cljs.core.Keyword(null, "hide", "hide", 1017106612), 
lucuma.overlay.hide], !0)], !0));
lucuma.shadow_dom_test = {};
lucuma.shadow_dom_test.create = function() {
  return cemerick.cljs.test.test_var.call(null, lucuma.shadow_dom_test.create)
};
lucuma.shadow_dom_test.create = cljs.core.vary_meta.call(null, lucuma.shadow_dom_test.create, cljs.core.assoc, new cljs.core.Keyword(null, "name", "name", 1017277949), new cljs.core.Symbol(null, "create", "create", 1302141621, null), new cljs.core.Keyword(null, "test", "test", 1017460740), function() {
  try {
    var a = cljs.core.list.call(null, null == lucuma.shadow_dom.create.call(null, document.createElement("a"), !0, !0)), b = cljs.core.apply.call(null, cljs.core.not, a);
    cljs.core.truth_(b) ? cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), cljs.core.cons.call(null, cljs.core.not, a), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "pass", "pass", 1017337731), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, 
    "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol(null, "nil?", "nil?", -1637150201, null), cljs.core.list(new cljs.core.Symbol("sd", "create", "sd/create", 1302379736, null), cljs.core.list(new cljs.core.Symbol(null, ".createElement", ".createElement", 1457256107, null), new cljs.core.Symbol("js", "document", "js/document", -778588881, null), "a"), !0, !0)))], !0)) : cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, 
    "actual", "actual", 3885931776), cljs.core.list.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.cons.call(null, new cljs.core.Symbol(null, "not", "not", -1640422260, null), a)), new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "fail", "fail", 1017039504), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, 
    "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol(null, "nil?", "nil?", -1637150201, null), cljs.core.list(new cljs.core.Symbol("sd", "create", "sd/create", 1302379736, null), cljs.core.list(new cljs.core.Symbol(null, ".createElement", ".createElement", 1457256107, null), new cljs.core.Symbol("js", "document", "js/document", -778588881, null), "a"), !0, !0)))], !0));
    return b
  }catch(c) {
    if(c instanceof Error) {
      return cemerick.cljs.test.do_report.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "actual", "actual", 3885931776), c, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "error", "error", 1110689146), new cljs.core.Keyword(null, "message", "message", 1968829305), null, new cljs.core.Keyword(null, "expected", "expected", 3373152810), cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol(null, 
      "nil?", "nil?", -1637150201, null), cljs.core.list(new cljs.core.Symbol("sd", "create", "sd/create", 1302379736, null), cljs.core.list(new cljs.core.Symbol(null, ".createElement", ".createElement", 1457256107, null), new cljs.core.Symbol("js", "document", "js/document", -778588881, null), "a"), !0, !0)))], !0))
    }
    if(new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      throw c;
    }
    return null
  }
});
cemerick.cljs.test.register_test_BANG_.call(null, new cljs.core.Symbol(null, "lucuma.shadow-dom-test", "lucuma.shadow-dom-test", 1815242916, null), lucuma.shadow_dom_test.create);
lucuma.test = {};
lucuma.test.browser_runner = {};
lucuma.test.browser_runner.current_ns = cljs.core.atom.call(null, null);
lucuma.test.browser_runner.report_details = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY);
lucuma.test.browser_runner.sel_current_ns = function() {
  return document.getElementById([cljs.core.str("collapse-"), cljs.core.str(cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns))].join(""))
};
lucuma.test.browser_runner.sel_current_ns_header = function() {
  return document.getElementById([cljs.core.str("collapse-"), cljs.core.str(cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns)), cljs.core.str("-header")].join(""))
};
lucuma.test.browser_runner.sel_test = function(a) {
  return lucuma.test.browser_runner.sel_current_ns.call(null).getElementsByClassName(a).item(0)
};
lucuma.test.browser_runner.sel_test_header = function(a) {
  return lucuma.test.browser_runner.sel_test.call(null, a).firstChild
};
lucuma.test.browser_runner.or_0 = function(a, b) {
  var c = cljs.core.get.call(null, a, b);
  return cljs.core.truth_(c) ? c : 0
};
lucuma.test.browser_runner.passes = function(a) {
  return lucuma.test.browser_runner.or_0.call(null, a, new cljs.core.Keyword(null, "pass", "pass", 1017337731))
};
lucuma.test.browser_runner.failures = function(a) {
  return lucuma.test.browser_runner.or_0.call(null, a, new cljs.core.Keyword(null, "fail", "fail", 1017039504))
};
lucuma.test.browser_runner.errors = function(a) {
  return lucuma.test.browser_runner.or_0.call(null, a, new cljs.core.Keyword(null, "error", "error", 1110689146))
};
lucuma.test.browser_runner.issues = function(a) {
  return lucuma.test.browser_runner.failures.call(null, a) + lucuma.test.browser_runner.errors.call(null, a)
};
lucuma.test.browser_runner.tests = function(a) {
  return lucuma.test.browser_runner.passes.call(null, a) + lucuma.test.browser_runner.issues.call(null, a)
};
lucuma.test.browser_runner.reports = function() {
  var a = null, b = function() {
    return cljs.core.deref.call(null, lucuma.test.browser_runner.report_details)
  }, c = function(a) {
    return cljs.core.get.call(null, cljs.core.deref.call(null, lucuma.test.browser_runner.report_details), a)
  }, d = function(a, b) {
    return cljs.core.get_in.call(null, cljs.core.deref.call(null, lucuma.test.browser_runner.report_details), cljs.core.PersistentVector.fromArray([a, b], !0))
  }, a = function(a, f) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  return a
}();
lucuma.test.browser_runner.agg_ns = function(a, b) {
  return cljs.core.reduce.call(null, cljs.core._PLUS_, cljs.core.map.call(null, b, cljs.core.vals.call(null, a)))
};
lucuma.test.browser_runner.all_reports = function() {
  var a = function(a) {
    return cljs.core.reduce.call(null, cljs.core._PLUS_, cljs.core.map.call(null, function(c) {
      return lucuma.test.browser_runner.agg_ns.call(null, c, a)
    }, cljs.core.vals.call(null, lucuma.test.browser_runner.reports.call(null))))
  };
  return cljs.core.merge.call(null, cljs.core.PersistentArrayMap.EMPTY, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "pass", "pass", 1017337731), a.call(null, new cljs.core.Keyword(null, "pass", "pass", 1017337731))], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "fail", "fail", 1017039504), a.call(null, new cljs.core.Keyword(null, "fail", "fail", 1017039504))], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "error", "error", 
  1110689146), a.call(null, new cljs.core.Keyword(null, "error", "error", 1110689146))], !0))
};
lucuma.test.browser_runner.elapsed = function(a) {
  return(new cljs.core.Keyword(null, "end-time", "end-time", 2693279729)).call(null, a).getTime() - (new cljs.core.Keyword(null, "start-time", "start-time", 3689550026)).call(null, a).getTime()
};
lucuma.test.browser_runner.failed_ns_QMARK_ = function(a) {
  a = lucuma.test.browser_runner.reports.call(null, a);
  return cljs.core.not_EQ_.call(null, 0, cljs.core.reduce.call(null, cljs.core._PLUS_, cljs.core.map.call(null, lucuma.test.browser_runner.issues, cljs.core.vals.call(null, a))))
};
lucuma.test.browser_runner.failed_test_QMARK_ = function(a, b) {
  var c = lucuma.test.browser_runner.reports.call(null, a, b);
  return cljs.core.not_EQ_.call(null, 0, lucuma.test.browser_runner.issues.call(null, c))
};
lucuma.test.browser_runner.ns_id = function(a) {
  return cljs.core.first.call(null, cljs.core.reverse.call(null, clojure.string.split.call(null, a, /\./)))
};
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "begin-test-ns", "begin-test-ns", 1359210286), function(a) {
  cljs.core.reset_BANG_.call(null, lucuma.test.browser_runner.current_ns, lucuma.test.browser_runner.ns_id.call(null, "" + cljs.core.str((new cljs.core.Keyword(null, "ns", "ns", 1013907767)).call(null, a))));
  cljs.core.swap_BANG_.call(null, lucuma.test.browser_runner.report_details, cljs.core.assoc_in, cljs.core.PersistentVector.fromArray([cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns), new cljs.core.Keyword(null, "start-time", "start-time", 3689550026)], !0), new Date);
  dommy.core.add_class_BANG_.call(null, document.getElementById("tests-results"), "panel-group");
  return dommy.core.append_BANG_.call(null, document.getElementById("tests-results"), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "div", "div", 1014003715), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "panel panel-default"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "div", "div", 1014003715), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "id", "id", 1013907597), [cljs.core.str("collapse-"), 
  cljs.core.str(cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns)), cljs.core.str("-header")].join(""), new cljs.core.Keyword(null, "class", "class", 1108647146), "panel-heading test-ns-running"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "h4", "h4", 1013907518), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "panel-title"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "a", "a", 
  1013904339), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "accordion-toggle", new cljs.core.Keyword(null, "data-toggle", "data-toggle", 2577667657), "collapse", new cljs.core.Keyword(null, "data-parent", "data-parent", 2450547615), "#tests-results", new cljs.core.Keyword(null, "href", "href", 1017115293), [cljs.core.str("#collapse-"), cljs.core.str(cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns))].join("")], !0), cljs.core.deref.call(null, 
  lucuma.test.browser_runner.current_ns)], !0)], !0)], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "div", "div", 1014003715), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "id", "id", 1013907597), [cljs.core.str("collapse-"), cljs.core.str(cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns))].join(""), new cljs.core.Keyword(null, "class", "class", 1108647146), "panel-collapse collapse"], !0)], !0)], !0))
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "end-test-ns", "end-test-ns", 3401491808), function(a) {
  cljs.core.swap_BANG_.call(null, lucuma.test.browser_runner.report_details, cljs.core.assoc_in, cljs.core.PersistentVector.fromArray([cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns), new cljs.core.Keyword(null, "end-time", "end-time", 2693279729)], !0), new Date);
  dommy.core.remove_class_BANG_.call(null, lucuma.test.browser_runner.sel_current_ns_header.call(null), "test-ns-running");
  dommy.core.add_class_BANG_.call(null, lucuma.test.browser_runner.sel_current_ns_header.call(null), cljs.core.truth_(lucuma.test.browser_runner.failed_ns_QMARK_.call(null, cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns))) ? "test-ns-fail" : "test-ns-pass");
  a = lucuma.test.browser_runner.reports.call(null, cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns));
  a = [cljs.core.str(lucuma.test.browser_runner.agg_ns.call(null, a, lucuma.test.browser_runner.tests)), cljs.core.str(" tests ("), cljs.core.str(lucuma.test.browser_runner.agg_ns.call(null, a, lucuma.test.browser_runner.failures)), cljs.core.str(" failures, "), cljs.core.str(lucuma.test.browser_runner.agg_ns.call(null, a, lucuma.test.browser_runner.errors)), cljs.core.str(" errors) executed in "), cljs.core.str(lucuma.test.browser_runner.elapsed.call(null, a)), cljs.core.str("ms")].join("");
  return dommy.core.append_BANG_.call(null, lucuma.test.browser_runner.sel_current_ns_header.call(null), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "i", "i", 1013904347), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), cljs.core.truth_(lucuma.test.browser_runner.failed_ns_QMARK_.call(null, cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns))) ? "icon-remove" : "icon-ok", new cljs.core.Keyword(null, "data-toggle", 
  "data-toggle", 2577667657), "tooltip", new cljs.core.Keyword(null, "data-placement", "data-placement", 4725197812), "right", new cljs.core.Keyword(null, "title", "title", 1124275658), a], !0)], !0))
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "begin-test-var", "begin-test-var", 3128464258), function(a) {
  a = "" + cljs.core.str((new cljs.core.Keyword(null, "name", "name", 1017277949)).call(null, cljs.core.meta.call(null, (new cljs.core.Keyword(null, "var", "var", 1014020761)).call(null, a))));
  cljs.core.swap_BANG_.call(null, lucuma.test.browser_runner.report_details, cljs.core.assoc_in, cljs.core.PersistentVector.fromArray([cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns), a, new cljs.core.Keyword(null, "start-time", "start-time", 3689550026)], !0), new Date);
  return dommy.core.append_BANG_.call(null, lucuma.test.browser_runner.sel_current_ns.call(null), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "ul", "ul", 1013907977), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), [cljs.core.str(a), cljs.core.str(" panel-body test-running")].join("")], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "h4", "h4", 1013907518), a], !0)], !0))
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "end-test-var", "end-test-var", 2014682E3), function(a) {
  a = "" + cljs.core.str((new cljs.core.Keyword(null, "name", "name", 1017277949)).call(null, cljs.core.meta.call(null, (new cljs.core.Keyword(null, "var", "var", 1014020761)).call(null, a))));
  cljs.core.swap_BANG_.call(null, lucuma.test.browser_runner.report_details, cljs.core.assoc_in, cljs.core.PersistentVector.fromArray([cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns), a, new cljs.core.Keyword(null, "end-time", "end-time", 2693279729)], !0), new Date);
  dommy.core.remove_class_BANG_.call(null, lucuma.test.browser_runner.sel_test.call(null, a), "test-running");
  dommy.core.add_class_BANG_.call(null, lucuma.test.browser_runner.sel_test.call(null, a), cljs.core.truth_(lucuma.test.browser_runner.failed_test_QMARK_.call(null, cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns), a)) ? "test-fail" : "test-pass");
  return dommy.core.insert_after_BANG_.call(null, cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "i", "i", 1013904347), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), cljs.core.truth_(lucuma.test.browser_runner.failed_test_QMARK_.call(null, cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns), a)) ? "icon-remove" : "icon-ok", new cljs.core.Keyword(null, "data-toggle", "data-toggle", 2577667657), "tooltip", new cljs.core.Keyword(null, 
  "data-placement", "data-placement", 4725197812), "right", new cljs.core.Keyword(null, "title", "title", 1124275658), [cljs.core.str("executed in "), cljs.core.str(lucuma.test.browser_runner.elapsed.call(null, lucuma.test.browser_runner.reports.call(null, cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns), a))), cljs.core.str("ms")].join("")], !0)], !0), lucuma.test.browser_runner.sel_test_header.call(null, a))
});
lucuma.test.browser_runner.append_test_result = function(a, b, c) {
  return dommy.core.append_BANG_.call(null, lucuma.test.browser_runner.sel_test.call(null, b), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "li", "li", 1013907695), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), c], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "em", "em", 1013907482), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "test-message"], 
  !0), (new cljs.core.Keyword(null, "message", "message", 1968829305)).call(null, a)], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "span", "span", 1017440956), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "test-result"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "span", "span", 1017440956), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), 
  "test-expected-value"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "span", "span", 1017440956), "expected:"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "code", "code", 1016963423), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "language-clojure"], !0), "" + cljs.core.str((new cljs.core.Keyword(null, "expected", "expected", 3373152810)).call(null, a))], !0)], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, 
  "span", "span", 1017440956), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "test-actual-value"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "span", "span", 1017440956), "but got:"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "code", "code", 1016963423), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "language-clojure"], !0), "" + cljs.core.str((new cljs.core.Keyword(null, 
  "actual", "actual", 3885931776)).call(null, a))], !0)], !0)], !0)], !0))
};
lucuma.test.browser_runner.report_var = function(a, b, c) {
  var d = "" + cljs.core.str(cljs.core.first.call(null, cemerick.cljs.test._STAR_testing_vars_STAR_));
  cljs.core.swap_BANG_.call(null, lucuma.test.browser_runner.report_details, cljs.core.update_in, cljs.core.PersistentVector.fromArray([cljs.core.deref.call(null, lucuma.test.browser_runner.current_ns), d, b], !0), cljs.core.fnil.call(null, cljs.core.inc, 0));
  return lucuma.test.browser_runner.append_test_result.call(null, a, d, c)
};
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "pass", "pass", 1017337731), function(a) {
  return lucuma.test.browser_runner.report_var.call(null, a, new cljs.core.Keyword(null, "pass", "pass", 1017337731), "test-pass")
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "error", "error", 1110689146), function(a) {
  return lucuma.test.browser_runner.report_var.call(null, a, new cljs.core.Keyword(null, "error", "error", 1110689146), "test-error")
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "fail", "fail", 1017039504), function(a) {
  return lucuma.test.browser_runner.report_var.call(null, a, new cljs.core.Keyword(null, "fail", "fail", 1017039504), "test-fail")
});
cljs.core._add_method.call(null, cemerick.cljs.test.report, new cljs.core.Keyword(null, "summary", "summary", 3451231E3), function(a) {
  dommy.core.append_BANG_.call(null, document.getElementById("tests-results"), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "script", "script", 4401185853), "Prism.highlightAll(); $('#tests-results').tooltip({selector: \"[data-toggle\x3dtooltip]\"});"], !0));
  a = lucuma.test.browser_runner.all_reports.call(null);
  dommy.core.insert_before_BANG_.call(null, cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "span", "span", 1017440956), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "id", "id", 1013907597), "tests-results-label"], !0), [cljs.core.str(lucuma.test.browser_runner.tests.call(null, a)), cljs.core.str(" tests run ("), cljs.core.str((new cljs.core.Keyword(null, "fail", "fail", 1017039504)).call(null, a)), cljs.core.str(" failures, "), cljs.core.str((new cljs.core.Keyword(null, 
  "error", "error", 1110689146)).call(null, a)), cljs.core.str(" errors)")].join("")], !0), document.getElementById("tests-results"));
  return cljs.core.reset_BANG_.call(null, lucuma.test.browser_runner.report_details, cljs.core.PersistentArrayMap.EMPTY)
});
lucuma.test.browser_runner.run_all_tests = function() {
  Ladda.create(document.getElementById("tests-btn")).start();
  var a = document.getElementById("tests-results");
  cljs.core.truth_(a) && dommy.core.clear_BANG_.call(null, a);
  a = document.getElementById("tests-results-label");
  cljs.core.truth_(a) && dommy.core.remove_BANG_.call(null, a);
  cemerick.cljs.test.run_all_tests.call(null);
  return Ladda.stopAll()
};
goog.exportSymbol("lucuma.test.browser_runner.run_all_tests", lucuma.test.browser_runner.run_all_tests);
lucuma.flipbox = {};
lucuma.flipbox.style = '\nlucu-flipbox{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;position:relative;height:100%;width:100%;-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-ms-transform-style:preserve-3d;-o-transform-style:preserve-3d;transform-style:preserve-3d}\nxlucuflipbox \x3e *{display:block;position:absolute;top:0;left:0;width:100%;height:100%;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;-o-backface-visibility:hidden;backface-visibility:hidden;-webkit-transition-property:-webkit-transform;-moz-transition-property:-moz-transform;-ms-transition-property:-ms-transform;-o-transition-property:-o-transform;transition-property:transform;-webkit-transition-duration:.25s;-moz-transition-duration:.25s;-ms-transition-duration:.25s;-o-transition-duration:.25s;transition-duration:.25s;-webkit-transition-timing-function:linear;-moz-transition-timing-function:linear;-ms-transition-timing-function:linear;-o-transition-timing-function:linear;transition-timing-function:linear;-webkit-transition-delay:0;-moz-transition-delay:0;-ms-transition-delay:0;-o-transition-delay:0;transition-delay:0;-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-ms-transform-style:preserve-3d;-o-transform-style:preserve-3d;transform-style:preserve-3d}\nlucu-flipbox \x3e *:first-child{-webkit-transform:perspective(800px) rotateY(0) translate3d(0,0,2px);-moz-transform:perspective(800px) rotateY(0) translate3d(0,0,2px);-ms-transform:perspective(800px) rotateY(0) translate3d(0,0,2px);-o-transform:perspective(800px) rotateY(0) translate3d(0,0,2px);transform:perspective(800px) rotateY(0) translate3d(0,0,2px);z-index:2}\nlucu-flipbox \x3e *:last-child{-webkit-transform:perspective(800px) rotateY(180deg) translate3d(0,0,1px);-moz-transform:perspective(800px) rotateY(180deg) translate3d(0,0,1px);-ms-transform:perspective(800px) rotateY(180deg) translate3d(0,0,1px);-o-transform:perspective(800px) rotateY(180deg) translate3d(0,0,1px);transform:perspective(800px) rotateY(180deg) translate3d(0,0,1px);z-index:1}\nlucu-flipbox[_anim-direction\x3d"up"] \x3e *:first-child,lucu-flipbox[_anim-direction\x3d"down"] \x3e *:first-child{-webkit-transform:perspective(800px) rotateX(0) translate3d(0,0,2px);-moz-transform:perspective(800px) rotateX(0) translate3d(0,0,2px);-ms-transform:perspective(800px) rotateX(0) translate3d(0,0,2px);-o-transform:perspective(800px) rotateX(0) translate3d(0,0,2px);transform:perspective(800px) rotateX(0) translate3d(0,0,2px)}\nlucu-flipbox[_anim-direction\x3d"up"] \x3e *:last-child{-webkit-transform:perspective(800px) rotateX(-180deg) translate3d(0,0,1px);-moz-transform:perspective(800px) rotateX(-180deg) translate3d(0,0,1px);-ms-transform:perspective(800px) rotateX(-180deg) translate3d(0,0,1px);-o-transform:perspective(800px) rotateX(-180deg) translate3d(0,0,1px);transform:perspective(800px) rotateX(-180deg) translate3d(0,0,1px)}\nlucu-flipbox[_anim-direction\x3d"down"] \x3e *:last-child{-webkit-transform:perspective(800px) rotateX(180deg) translate3d(0,0,1px);-moz-transform:perspective(800px) rotateX(180deg) translate3d(0,0,1px);-ms-transform:perspective(800px) rotateX(180deg) translate3d(0,0,1px);-o-transform:perspective(800px) rotateX(180deg) translate3d(0,0,1px);transform:perspective(800px) rotateX(180deg) translate3d(0,0,1px)}\nlucu-flipbox[flipped]:after{content:"";display:none}\nlucu-flipbox[flipped] \x3e *:first-child{-webkit-transform:perspective(800px) rotateY(180deg) translate3d(0,0,2px);-moz-transform:perspective(800px) rotateY(180deg) translate3d(0,0,2px);-ms-transform:perspective(800px) rotateY(180deg) translate3d(0,0,2px);-o-transform:perspective(800px) rotateY(180deg) translate3d(0,0,2px);transform:perspective(800px) rotateY(180deg) translate3d(0,0,2px);z-index:1}\nlucu-flipbox[flipped] \x3e *:last-child{-webkit-transform:perspective(800px) rotateY(360deg) translate3d(0,0,1px);-moz-transform:perspective(800px) rotateY(360deg) translate3d(0,0,1px);-ms-transform:perspective(800px) rotateY(360deg) translate3d(0,0,1px);-o-transform:perspective(800px) rotateY(360deg) translate3d(0,0,1px);transform:perspective(800px) rotateY(360deg) translate3d(0,0,1px);z-index:2}\nlucu-flipbox[_anim-direction\x3d"left"][flipped] \x3e *:first-child{-webkit-transform:perspective(800px) rotateY(-180deg) translate3d(0,0,2px);-moz-transform:perspective(800px) rotateY(-180deg) translate3d(0,0,2px);-ms-transform:perspective(800px) rotateY(-180deg) translate3d(0,0,2px);-o-transform:perspective(800px) rotateY(-180deg) translate3d(0,0,2px);transform:perspective(800px) rotateY(-180deg) translate3d(0,0,2px)}\nlucu-flipbox[_anim-direction\x3d"left"][flipped] \x3e *:last-child{-webkit-transform:perspective(800px) rotateY(0) translate3d(0,0,1px);-moz-transform:perspective(800px) rotateY(0) translate3d(0,0,1px);-ms-transform:perspective(800px) rotateY(0) translate3d(0,0,1px);-o-transform:perspective(800px) rotateY(0) translate3d(0,0,1px);transform:perspective(800px) rotateY(0) translate3d(0,0,1px)}\nlucu-flipbox[_anim-direction\x3d"up"][flipped] \x3e *:first-child{-webkit-transform:perspective(800px) rotateX(180deg) translate3d(0,0,2px);-moz-transform:perspective(800px) rotateX(180deg) translate3d(0,0,2px);-ms-transform:perspective(800px) rotateX(180deg) translate3d(0,0,2px);-o-transform:perspective(800px) rotateX(180deg) translate3d(0,0,2px);transform:perspective(800px) rotateX(180deg) translate3d(0,0,2px)}\nlucu-flipbox[_anim-direction\x3d"up"][flipped] \x3e *:last-child{-webkit-transform:perspective(800px) rotateX(0) translate3d(0,0,1px);-moz-transform:perspective(800px) rotateX(0) translate3d(0,0,1px);-ms-transform:perspective(800px) rotateX(0) translate3d(0,0,1px);-o-transform:perspective(800px) rotateX(0) translate3d(0,0,1px);transform:perspective(800px) rotateX(0) translate3d(0,0,1px)}\nlucu-flipbox[_anim-direction\x3d"down"][flipped] \x3e *:first-child{-webkit-transform:perspective(800px) rotateX(-180deg) translate3d(0,0,2px);-moz-transform:perspective(800px) rotateX(-180deg) translate3d(0,0,2px);-ms-transform:perspective(800px) rotateX(-180deg) translate3d(0,0,2px);-o-transform:perspective(800px) rotateX(-180deg) translate3d(0,0,2px);transform:perspective(800px) rotateX(-180deg) translate3d(0,0,2px)}\nlucu-flipbox[_anim-direction\x3d"down"][flipped] \x3e *:last-child{-webkit-transform:perspective(800px) rotateX(0) translate3d(0,0,1px);-moz-transform:perspective(800px) rotateX(0) translate3d(0,0,1px);-ms-transform:perspective(800px) rotateX(0) translate3d(0,0,1px);-o-transform:perspective(800px) rotateX(0) translate3d(0,0,1px);transform:perspective(800px) rotateX(0) translate3d(0,0,1px)}\n  ';
lucuma.flipbox.toggle = function(a) {
  return null
};
lucuma.flipbox.show_front = function(a) {
  return null
};
lucuma.flipbox.show_back = function(a) {
  return null
};
lucuma.flipbox.lucu_flipbox = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "lucu-flipbox"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859)], !0), new cljs.core.Keyword(null, "style", "style", 1123684643), lucuma.flipbox.style, new cljs.core.Keyword(null, "methods", 
"methods", 1969438500), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "showFront", "showFront", 3382402206), lucuma.flipbox.show_front, new cljs.core.Keyword(null, "showBack", "showBack", 674529526), lucuma.flipbox.show_back, new cljs.core.Keyword(null, "toggle", "toggle", 4440567494), lucuma.flipbox.toggle], !0)], !0));
lucuma.range_with_threshold = {};
lucuma.range_with_threshold.previous_value = cljs.core.atom.call(null, null);
lucuma.range_with_threshold.add_threshold_crossed_class = function(a) {
  return a.classList.add("threshold-crossed")
};
lucuma.range_with_threshold.remove_threshold_crossed_class = function(a) {
  return a.classList.remove("threshold-crossed")
};
lucuma.range_with_threshold.breach_threshold = function(a, b, c) {
  lucuma.range_with_threshold.add_threshold_crossed_class.call(null, a);
  return lucuma.event.fire.call(null, a, "threshold-crossed", cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "breached", "breached", 1091008034), new cljs.core.Keyword(null, "value", "value", 1125876963), b, new cljs.core.Keyword(null, "threshold", "threshold", 3763394525), c], !0))
};
lucuma.range_with_threshold.clear_threshold = function(a, b) {
  lucuma.range_with_threshold.remove_threshold_crossed_class.call(null, a);
  return lucuma.event.fire.call(null, a, "threshold-cleared", cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "cleared", "cleared", 1870681886), new cljs.core.Keyword(null, "value", "value", 1125876963), b], !0))
};
lucuma.range_with_threshold.fire_event_on_threshold_cross = function(a, b, c, d) {
  return c > b ? lucuma.range_with_threshold.breach_threshold.call(null, a, b, c) : b > d ? lucuma.range_with_threshold.breach_threshold.call(null, a, b, d) : new cljs.core.Keyword(null, "default", "default", 2558708147) ? lucuma.range_with_threshold.clear_threshold.call(null, a, b) : null
};
lucuma.range_with_threshold.initialize = function(a, b, c) {
  return a.addEventListener("change", function(a) {
    return lucuma.range_with_threshold.fire_event_on_threshold_cross.call(null, a.target, a.target.value, b, c)
  }, !1)
};
lucuma.range_with_threshold.lucu_range_with_threshold = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "lucu-range-with-threshold"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "style", "style", 1123684643), "input[type\x3d'range'] .threshold-crossed { background-color: red; }", new cljs.core.Keyword(null, "event-handlers", "event-handlers", 4531807150), cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, 
"threshold-crossed", "threshold-crossed", 3678385391), null], !0), new cljs.core.Keyword(null, "created-fn", "created-fn", 2383536447), function(a) {
  return lucuma.range_with_threshold.initialize.call(null, a, function() {
    var a = lucuma.range_with_threshold.min_threshold;
    return cljs.core.truth_(a) ? a : 10
  }(), function() {
    var a = lucuma.range_with_threshold.max_threshold;
    return cljs.core.truth_(a) ? a : 30
  }())
}, new cljs.core.Keyword(null, "extends", "extends", 4003207179), "input"], !0));
garden.compiler = {};
garden.compiler._STAR_flags_STAR_ = cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "pretty-print?", "pretty-print?", 3437152219), !0, new cljs.core.Keyword(null, "output-to", "output-to", 3189532217), null, new cljs.core.Keyword(null, "vendors", "vendors", 1361377181), cljs.core.PersistentVector.EMPTY, new cljs.core.Keyword(null, "media-expressions", "media-expressions", 4652695524), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "nesting-behavior", "nesting-behavior", 
4235335079), new cljs.core.Keyword(null, "default", "default", 2558708147)], !0)], !0);
garden.compiler.media_expression_behavior = cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "merge", "merge", 1117689770), function(a, b) {
  return cljs.core.merge.call(null, b, a)
}, new cljs.core.Keyword(null, "default", "default", 2558708147), function(a, b) {
  return a
}], !0);
garden.compiler._STAR_selector_context_STAR_ = null;
garden.compiler._STAR_media_query_context_STAR_ = null;
garden.compiler.vendors = function() {
  return cljs.core.seq.call(null, (new cljs.core.Keyword(null, "vendors", "vendors", 1361377181)).call(null, garden.compiler._STAR_flags_STAR_))
};
garden.compiler.top_level_expression_QMARK_ = function(a) {
  var b = garden.util.rule_QMARK_.call(null, a);
  if(cljs.core.truth_(b)) {
    return b
  }
  b = garden.util.at_import_QMARK_.call(null, a);
  if(cljs.core.truth_(b)) {
    return b
  }
  b = garden.util.at_media_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? b : garden.util.at_keyframes_QMARK_.call(null, a)
};
garden.compiler.divide_vec = function(a, b) {
  return cljs.core.juxt.call(null, cljs.core.filter, cljs.core.remove).call(null, a, b)
};
garden.compiler.token_fn = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null);
  return function(a) {
    a = cljs.core.re_find.call(null, c, a);
    return cljs.core.truth_(a) ? cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "tag", "tag", 1014018828), b, new cljs.core.Keyword(null, "chunk", "chunk", 1108547039), a, new cljs.core.Keyword(null, "size", "size", 1017434995), cljs.core.count.call(null, a)], !0) : null
  }
};
garden.compiler.tokenizer = function() {
  var a = function(a) {
    var b = cljs.core.map.call(null, garden.compiler.token_fn, a);
    return function(a) {
      return cljs.core.some.call(null, function(b) {
        return b.call(null, a)
      }, b)
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
garden.compiler.stylesheet_tokenizer = garden.compiler.tokenizer.call(null, cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "string", "string", 4416885635), /^\"(?:\\.|[^\"])*\"/], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "r-brace", "r-brace", 4787385482), /^\s*\{\s*/], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "l-brace", "l-brace", 3757330692), /^;?\s*}/], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, 
"r-paren", "r-paren", 4799824737), /^\s*\(\s*/], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "l-paren", "l-paren", 3769769947), /^\s*\)/], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "comma", "comma", 1108747847), /^,\s*/], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "colon", "colon", 1108746961), /^:\s*/], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "semicolon", "semicolon", 4594780195), /^;/], 
!0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "space+", "space+", 4412678999), /^ +/], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "white-space+", "white-space+", 3237048699), /^\s+/], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "any", "any", 1014000990), /^./], !0));
garden.compiler.compress_stylesheet = function(a) {
  for(var b = "";;) {
    var c = garden.compiler.stylesheet_tokenizer.call(null, a);
    if(cljs.core.truth_(c)) {
      var c = cljs.core.seq_QMARK_.call(null, c) ? cljs.core.apply.call(null, cljs.core.hash_map, c) : c, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "size", "size", 1017434995)), e = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "chunk", "chunk", 1108547039)), f = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "tag", "tag", 1014018828));
      a = cljs.core.subs.call(null, a, d);
      b = [cljs.core.str(b), cljs.core.str(function() {
        var a = f;
        return cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "r-brace", "r-brace", 4787385482), a) ? "{" : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "string", "string", 4416885635), a) ? e : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "l-brace", "l-brace", 3757330692), a) ? "}" : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "colon", "colon", 1108746961), a) ? ":" : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "semi-comma", "semi-comma", 3089907496), 
        a) ? ";" : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "white-space+", "white-space+", 3237048699), a) ? "" : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "space+", "space+", 4412678999), a) ? " " : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "l-paren", "l-paren", 3769769947), a) ? ")" : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "r-paren", "r-paren", 4799824737), a) ? "(" : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "comma", "comma", 1108747847), 
        a) ? "," : new cljs.core.Keyword(null, "else", "else", 1017020587) ? e : null
      }())].join("")
    }else {
      return b
    }
  }
};
garden.compiler.IExpandable = {};
garden.compiler.expand = function(a) {
  if(a ? a.garden$compiler$IExpandable$expand$arity$1 : a) {
    return a.garden$compiler$IExpandable$expand$arity$1(a)
  }
  var b;
  b = garden.compiler.expand[goog.typeOf(null == a ? null : a)];
  if(!b && (b = garden.compiler.expand._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IExpandable.expand", a);
  }
  return b.call(null, a)
};
garden.compiler.expand_seqs = function expand_seqs(b) {
  return cljs.core.mapcat.call(null, function(b) {
    return cljs.core.seq_QMARK_.call(null, b) ? expand_seqs.call(null, b) : cljs.core.list.call(null, b)
  }, b)
};
garden.compiler.expand_declaration = function expand_declaration(b) {
  if(cljs.core.seq.call(null, b)) {
    var c = cljs.core.meta.call(null, b), d = function(b) {
      return function(c, d) {
        var h = cljs.core.nth.call(null, d, 0, null), k = cljs.core.nth.call(null, d, 1, null), l = function(b, c, d, e) {
          return function(b) {
            var d = cljs.core.nth.call(null, b, 0, null);
            b = cljs.core.nth.call(null, b, 1, null);
            return cljs.core.hash_map.call(null, garden.util.as_str.call(null, c, "-", d), b)
          }
        }(d, h, k, b);
        return cljs.core.truth_(garden.util.hash_map_QMARK_.call(null, k)) ? expand_declaration.call(null, cljs.core.into.call(null, c, cljs.core.map.call(null, l, k))) : cljs.core.assoc.call(null, c, garden.util.to_str.call(null, h), k)
      }
    }(c);
    return cljs.core.with_meta.call(null, cljs.core.reduce.call(null, d, cljs.core.PersistentArrayMap.EMPTY, b), c)
  }
  return null
};
garden.compiler.parent_selector_re = /^&(?:\S+)?$/;
garden.compiler.extract_reference = function(a) {
  a = cljs.core.re_find.call(null, garden.compiler.parent_selector_re, garden.util.to_str.call(null, cljs.core.last.call(null, a)));
  return cljs.core.truth_(a) ? cljs.core.apply.call(null, cljs.core.str, cljs.core.rest.call(null, a)) : null
};
garden.compiler.expand_selector_reference = function(a) {
  var b = garden.compiler.extract_reference.call(null, a);
  return cljs.core.truth_(b) ? (a = cljs.core.butlast.call(null, a), cljs.core.concat.call(null, cljs.core.butlast.call(null, a), cljs.core.list.call(null, garden.util.as_str.call(null, cljs.core.last.call(null, a), b)))) : a
};
garden.compiler.expand_selector = function(a, b) {
  var c = cljs.core.seq.call(null, b) ? cljs.core.map.call(null, cljs.core.flatten, garden.util.cartesian_product.call(null, b, a)) : cljs.core.map.call(null, cljs.core.list, a);
  return cljs.core.map.call(null, garden.compiler.expand_selector_reference, c)
};
garden.compiler.expand_rule = function(a) {
  var b = cljs.core.split_with.call(null, cljs.core.complement.call(null, cljs.core.coll_QMARK_), a);
  a = cljs.core.nth.call(null, b, 0, null);
  b = cljs.core.nth.call(null, b, 1, null);
  a = garden.compiler.expand_selector.call(null, a, garden.compiler._STAR_selector_context_STAR_);
  var b = garden.compiler.expand.call(null, b), c = garden.compiler.divide_vec.call(null, garden.util.declaration_QMARK_, b), b = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nth.call(null, c, 1, null), d;
  a: {
    var e = garden.compiler._STAR_selector_context_STAR_;
    try {
      garden.compiler._STAR_selector_context_STAR_ = cljs.core.seq.call(null, a) ? a : garden.compiler._STAR_selector_context_STAR_;
      d = cljs.core.doall.call(null, cljs.core.mapcat.call(null, garden.compiler.expand, c));
      break a
    }finally {
      garden.compiler._STAR_selector_context_STAR_ = e
    }
    d = void 0
  }
  return cljs.core.conj.call(null, d, cljs.core.conj.call(null, cljs.core.PersistentVector.fromArray([a], !0), cljs.core.mapcat.call(null, garden.compiler.expand, b)))
};
garden.compiler.expand_at_rule = function() {
  var a = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), b = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), c = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), e = cljs.core.get.call(null, cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "hierarchy", "hierarchy", 3129050535), cljs.core.get_global_hierarchy.call(null));
  return new cljs.core.MultiFn("expand-at-rule", new cljs.core.Keyword(null, "identifier", "identifier", 3690438683), new cljs.core.Keyword(null, "default", "default", 2558708147), e, a, b, c, d)
}();
cljs.core._add_method.call(null, garden.compiler.expand_at_rule, new cljs.core.Keyword(null, "default", "default", 2558708147), function(a) {
  return cljs.core.list.call(null, a)
});
cljs.core._add_method.call(null, garden.compiler.expand_at_rule, new cljs.core.Keyword(null, "keyframes", "keyframes", 3862205239), function(a) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "value", "value", 1125876963));
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "frames", "frames", 4042356760));
  b = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "identifier", "identifier", 3690438683));
  return cljs.core.list.call(null, new garden.types.CSSAtRule(new cljs.core.Keyword(null, "keyframes", "keyframes", 3862205239), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "identifier", "identifier", 3690438683), garden.util.to_str.call(null, b), new cljs.core.Keyword(null, "frames", "frames", 4042356760), cljs.core.mapcat.call(null, garden.compiler.expand, a)], !0)))
});
garden.compiler.expand_media_query_expression = function(a) {
  var b = garden.compiler.media_expression_behavior.call(null, cljs.core.get_in.call(null, garden.compiler._STAR_flags_STAR_, cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "media-expressions", "media-expressions", 4652695524), new cljs.core.Keyword(null, "nesting-behavior", "nesting-behavior", 4235335079)], !0)));
  return cljs.core.truth_(b) ? b.call(null, a, garden.compiler._STAR_media_query_context_STAR_) : a
};
cljs.core._add_method.call(null, garden.compiler.expand_at_rule, new cljs.core.Keyword(null, "media", "media", 1117676374), function(a) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "value", "value", 1125876963));
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  var b = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "rules", "rules", 1122778217));
  a = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "media-queries", "media-queries", 3327326703));
  a = garden.compiler.expand_media_query_expression.call(null, a);
  var c;
  a: {
    var d = garden.compiler._STAR_media_query_context_STAR_;
    try {
      garden.compiler._STAR_media_query_context_STAR_ = a;
      c = cljs.core.doall.call(null, cljs.core.mapcat.call(null, garden.compiler.expand, garden.compiler.expand.call(null, b)));
      break a
    }finally {
      garden.compiler._STAR_media_query_context_STAR_ = d
    }
    c = void 0
  }
  b = garden.compiler.divide_vec.call(null, garden.util.at_media_QMARK_, c);
  c = cljs.core.nth.call(null, b, 0, null);
  b = cljs.core.nth.call(null, b, 1, null);
  return cljs.core.cons.call(null, new garden.types.CSSAtRule(new cljs.core.Keyword(null, "media", "media", 1117676374), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "media-queries", "media-queries", 3327326703), a, new cljs.core.Keyword(null, "rules", "rules", 1122778217), b], !0)), c)
});
garden.compiler.expand_stylesheet = function(a) {
  return cljs.core.apply.call(null, cljs.core.concat, cljs.core.map.call(null, garden.compiler.expand, garden.compiler.expand.call(null, a)))
};
garden.compiler.IExpandable["null"] = !0;
garden.compiler.expand["null"] = function(a) {
  return null
};
cljs.core.IndexedSeq.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.IndexedSeq.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_seqs.call(null, a)
};
cljs.core.Subvec.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.Subvec.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_rule.call(null, a)
};
cljs.core.ChunkedCons.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.ChunkedCons.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_seqs.call(null, a)
};
cljs.core.PersistentTreeMap.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.PersistentTreeMap.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return cljs.core.list.call(null, garden.compiler.expand_declaration.call(null, a))
};
cljs.core.PersistentArrayMap.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.PersistentArrayMap.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return cljs.core.list.call(null, garden.compiler.expand_declaration.call(null, a))
};
cljs.core.LazySeq.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.LazySeq.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_seqs.call(null, a)
};
garden.compiler.IExpandable._ = !0;
garden.compiler.expand._ = function(a) {
  return cljs.core.list.call(null, a)
};
cljs.core.RSeq.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.RSeq.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_seqs.call(null, a)
};
cljs.core.NodeSeq.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.NodeSeq.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_seqs.call(null, a)
};
cljs.core.RedNode.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.RedNode.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_rule.call(null, a)
};
cljs.core.ChunkedSeq.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.ChunkedSeq.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_seqs.call(null, a)
};
garden.types.CSSAtRule.prototype.garden$compiler$IExpandable$ = !0;
garden.types.CSSAtRule.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_at_rule.call(null, a)
};
cljs.core.PersistentHashMap.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.PersistentHashMap.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return cljs.core.list.call(null, garden.compiler.expand_declaration.call(null, a))
};
garden.types.CSSFunction.prototype.garden$compiler$IExpandable$ = !0;
garden.types.CSSFunction.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return cljs.core.list.call(null, a)
};
cljs.core.PersistentVector.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.PersistentVector.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_rule.call(null, a)
};
cljs.core.List.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.List.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_seqs.call(null, a)
};
cljs.core.PersistentArrayMapSeq.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.PersistentArrayMapSeq.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_seqs.call(null, a)
};
cljs.core.BlackNode.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.BlackNode.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_rule.call(null, a)
};
cljs.core.Cons.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.Cons.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_seqs.call(null, a)
};
cljs.core.ArrayNodeSeq.prototype.garden$compiler$IExpandable$ = !0;
cljs.core.ArrayNodeSeq.prototype.garden$compiler$IExpandable$expand$arity$1 = function(a) {
  return garden.compiler.expand_seqs.call(null, a)
};
garden.compiler.CSSRenderer = {};
garden.compiler.render_css = function(a) {
  if(a ? a.garden$compiler$CSSRenderer$render_css$arity$1 : a) {
    return a.garden$compiler$CSSRenderer$render_css$arity$1(a)
  }
  var b;
  b = garden.compiler.render_css[goog.typeOf(null == a ? null : a)];
  if(!b && (b = garden.compiler.render_css._, !b)) {
    throw cljs.core.missing_protocol.call(null, "CSSRenderer.render-css", a);
  }
  return b.call(null, a)
};
garden.compiler.comma = ", ";
garden.compiler.colon = ": ";
garden.compiler.semicolon = ";";
garden.compiler.l_brace = " {\n";
garden.compiler.r_brace = "\n}";
garden.compiler.l_brace_1 = " {\n\n";
garden.compiler.r_brace_1 = "\n\n}";
garden.compiler.rule_sep = "\n\n";
garden.compiler.indent = "  ";
garden.compiler.space_separated_list = function() {
  var a = null, b = function(b) {
    return a.call(null, garden.compiler.render_css, b)
  }, c = function(a, b) {
    return clojure.string.join.call(null, " ", cljs.core.map.call(null, a, b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
garden.compiler.comma_separated_list = function() {
  var a = null, b = function(b) {
    return a.call(null, garden.compiler.render_css, b)
  }, c = function(a, b) {
    var c = function() {
      return function h(b) {
        return new cljs.core.LazySeq(null, function() {
          for(;;) {
            var c = cljs.core.seq.call(null, b);
            if(c) {
              if(cljs.core.chunked_seq_QMARK_.call(null, c)) {
                var e = cljs.core.chunk_first.call(null, c), f = cljs.core.count.call(null, e), p = cljs.core.chunk_buffer.call(null, f);
                a: {
                  for(var r = 0;;) {
                    if(r < f) {
                      var s = cljs.core._nth.call(null, e, r);
                      cljs.core.chunk_append.call(null, p, cljs.core.sequential_QMARK_.call(null, s) ? garden.compiler.space_separated_list.call(null, a, s) : a.call(null, s));
                      r += 1
                    }else {
                      e = !0;
                      break a
                    }
                  }
                  e = void 0
                }
                return e ? cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, p), h.call(null, cljs.core.chunk_rest.call(null, c))) : cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, p), null)
              }
              p = cljs.core.first.call(null, c);
              return cljs.core.cons.call(null, cljs.core.sequential_QMARK_.call(null, p) ? garden.compiler.space_separated_list.call(null, a, p) : a.call(null, p), h.call(null, cljs.core.rest.call(null, c)))
            }
            return null
          }
        }, null, null)
      }.call(null, b)
    }();
    return clojure.string.join.call(null, garden.compiler.comma, c)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
garden.compiler.rule_join = function(a) {
  return clojure.string.join.call(null, garden.compiler.rule_sep, a)
};
garden.compiler.indent_loc_re = RegExp("(?\x3d[ A-Za-z#.}-]+)^", "gm");
garden.compiler.indent_str = function(a) {
  return a.replace(garden.compiler.indent_loc_re, garden.compiler.indent)
};
garden.compiler.render_value = function(a) {
  return cljs.core.truth_(garden.util.at_keyframes_QMARK_.call(null, a)) ? garden.util.to_str.call(null, cljs.core.get_in.call(null, a, cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "value", "value", 1125876963), new cljs.core.Keyword(null, "identifier", "identifier", 3690438683)], !0))) : garden.compiler.render_css.call(null, a)
};
garden.compiler.render_property_and_value = function render_property_and_value(b) {
  var c = cljs.core.nth.call(null, b, 0, null);
  b = cljs.core.nth.call(null, b, 1, null);
  if(cljs.core.set_QMARK_.call(null, b)) {
    return clojure.string.join.call(null, "\n", cljs.core.map.call(null, render_property_and_value, cljs.core.partition.call(null, 2, cljs.core.interleave.call(null, cljs.core.repeat.call(null, c), b))))
  }
  b = cljs.core.sequential_QMARK_.call(null, b) ? garden.compiler.comma_separated_list.call(null, garden.compiler.render_value, b) : garden.compiler.render_value.call(null, b);
  return garden.util.as_str.call(null, c, garden.compiler.colon, b, garden.compiler.semicolon)
};
garden.compiler.prefix_declaration = function(a) {
  return cljs.core.not.call(null, function() {
    var b = garden.compiler.vendors.call(null);
    return cljs.core.truth_(b) ? (new cljs.core.Keyword(null, "prefix", "prefix", 4328760836)).call(null, cljs.core.meta.call(null, a)) : b
  }()) ? a : cljs.core.mapcat.call(null, function(a, c) {
    return cljs.core.conj.call(null, cljs.core.mapv.call(null, function(a, b, c) {
      return cljs.core.PersistentVector.fromArray([garden.util.vendor_prefix.call(null, a, b), c], !0)
    }, garden.compiler.vendors.call(null), cljs.core.repeat.call(null, a), cljs.core.repeat.call(null, c)), cljs.core.PersistentVector.fromArray([a, c], !0))
  }, cljs.core.keys.call(null, a), cljs.core.vals.call(null, a))
};
garden.compiler.render_declaration = function(a) {
  return clojure.string.join.call(null, "\n", cljs.core.map.call(null, garden.compiler.render_property_and_value, garden.compiler.prefix_declaration.call(null, a)))
};
garden.compiler.render_selector = function(a) {
  return garden.compiler.comma_separated_list.call(null, a)
};
garden.compiler.render_rule = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null);
  return cljs.core.truth_(function() {
    var b = cljs.core.seq.call(null, a);
    return b ? cljs.core.every_QMARK_.call(null, cljs.core.seq, a) : b
  }()) ? [cljs.core.str(garden.compiler.render_selector.call(null, b)), cljs.core.str(garden.compiler.l_brace), cljs.core.str(garden.compiler.indent_str.call(null, clojure.string.join.call(null, "\n", cljs.core.map.call(null, garden.compiler.render_css, c)))), cljs.core.str(garden.compiler.r_brace)].join("") : null
};
garden.compiler.render_media_expr_part = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null);
  a = cljs.core.nth.call(null, a, 1, null);
  var c = cljs.core.map.call(null, garden.util.to_str, cljs.core.PersistentVector.fromArray([b, a], !0)), b = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nth.call(null, c, 1, null);
  return!0 === a ? b : !1 === a ? [cljs.core.str("not "), cljs.core.str(b)].join("") : cljs.core._EQ_.call(null, "only", c) ? [cljs.core.str("only "), cljs.core.str(b)].join("") : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.truth_(cljs.core.truth_(a) ? cljs.core.seq.call(null, c) : a) ? [cljs.core.str("("), cljs.core.str(b), cljs.core.str(garden.compiler.colon), cljs.core.str(c), cljs.core.str(")")].join("") : [cljs.core.str("("), cljs.core.str(b), cljs.core.str(")")].join("") : 
  null
};
garden.compiler.render_media_expr = function render_media_expr(b) {
  return cljs.core.sequential_QMARK_.call(null, b) ? garden.compiler.comma_separated_list.call(null, cljs.core.map.call(null, render_media_expr, b)) : clojure.string.join.call(null, " and ", cljs.core.map.call(null, garden.compiler.render_media_expr_part, b))
};
garden.compiler.render_unit = function(a) {
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "unit", "unit", 1017498870));
  b = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "magnitude", "magnitude", 3292087682));
  return[cljs.core.str(0 === b ? 0 : b), cljs.core.str(0 === b ? null : cljs.core.name.call(null, a))].join("")
};
garden.compiler.render_function = function(a) {
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "args", "args", 1016906831));
  b = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "function", "function", 2394842954));
  a = cljs.core.sequential_QMARK_.call(null, a) ? garden.compiler.comma_separated_list.call(null, a) : garden.util.to_str.call(null, a);
  return garden.util.format.call(null, "%s(%s)", garden.util.to_str.call(null, b), a)
};
garden.compiler.render_color = garden.color.as_hex;
garden.compiler.render_at_rule = function() {
  var a = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), b = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), c = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), e = cljs.core.get.call(null, cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "hierarchy", "hierarchy", 3129050535), cljs.core.get_global_hierarchy.call(null));
  return new cljs.core.MultiFn("render-at-rule", new cljs.core.Keyword(null, "identifier", "identifier", 3690438683), new cljs.core.Keyword(null, "default", "default", 2558708147), e, a, b, c, d)
}();
cljs.core._add_method.call(null, garden.compiler.render_at_rule, new cljs.core.Keyword(null, "default", "default", 2558708147), function(a) {
  return null
});
cljs.core._add_method.call(null, garden.compiler.render_at_rule, new cljs.core.Keyword(null, "import", "import", 4124075799), function(a) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "value", "value", 1125876963));
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "media-queries", "media-queries", 3327326703));
  b = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "url", "url", 1014020321));
  b = "string" === typeof b ? garden.util.wrap_quotes.call(null, b) : garden.compiler.render_css.call(null, b);
  a = cljs.core.truth_(a) ? garden.compiler.render_media_expr.call(null, a) : null;
  return[cljs.core.str("@import "), cljs.core.str(cljs.core.truth_(a) ? [cljs.core.str(b), cljs.core.str(" "), cljs.core.str(a)].join("") : b), cljs.core.str(garden.compiler.semicolon)].join("")
});
cljs.core._add_method.call(null, garden.compiler.render_at_rule, new cljs.core.Keyword(null, "keyframes", "keyframes", 3862205239), function(a) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "value", "value", 1125876963));
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "frames", "frames", 4042356760));
  b = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "identifier", "identifier", 3690438683));
  if(cljs.core.seq.call(null, a)) {
    var c = [cljs.core.str(garden.util.to_str.call(null, b)), cljs.core.str(garden.compiler.l_brace_1), cljs.core.str(garden.compiler.indent_str.call(null, garden.compiler.rule_join.call(null, cljs.core.map.call(null, garden.compiler.render_css, a)))), cljs.core.str(garden.compiler.r_brace_1)].join("");
    a = function(a) {
      return function(a) {
        return[cljs.core.str("@"), cljs.core.str(garden.util.vendor_prefix.call(null, a, "keyframes "))].join("")
      }
    }(c);
    return garden.compiler.rule_join.call(null, cljs.core.map.call(null, function(a) {
      return[cljs.core.str(a), cljs.core.str(c)].join("")
    }, cljs.core.cons.call(null, "@keyframes ", cljs.core.map.call(null, a, garden.compiler.vendors.call(null)))))
  }
  return null
});
cljs.core._add_method.call(null, garden.compiler.render_at_rule, new cljs.core.Keyword(null, "media", "media", 1117676374), function(a) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "value", "value", 1125876963));
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "rules", "rules", 1122778217));
  b = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "media-queries", "media-queries", 3327326703));
  return cljs.core.seq.call(null, a) ? [cljs.core.str("@media "), cljs.core.str(garden.compiler.render_media_expr.call(null, b)), cljs.core.str(garden.compiler.l_brace_1), cljs.core.str(garden.compiler.indent_str.call(null, garden.compiler.rule_join.call(null, cljs.core.map.call(null, garden.compiler.render_css, a)))), cljs.core.str(garden.compiler.r_brace_1)].join("") : null
});
garden.compiler.CSSRenderer["null"] = !0;
garden.compiler.render_css["null"] = function(a) {
  return""
};
cljs.core.Keyword.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.Keyword.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.name.call(null, a)
};
garden.compiler.CSSRenderer.number = !0;
garden.compiler.render_css.number = function(a) {
  return"" + cljs.core.str(a)
};
cljs.core.IndexedSeq.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.IndexedSeq.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.map.call(null, garden.compiler.render_css, a)
};
cljs.core.Subvec.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.Subvec.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_rule.call(null, a)
};
cljs.core.ChunkedCons.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.ChunkedCons.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.map.call(null, garden.compiler.render_css, a)
};
cljs.core.PersistentTreeMap.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.PersistentTreeMap.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_declaration.call(null, a)
};
cljs.core.PersistentArrayMap.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.PersistentArrayMap.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_declaration.call(null, a)
};
cljs.core.LazySeq.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.LazySeq.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.map.call(null, garden.compiler.render_css, a)
};
garden.compiler.CSSRenderer._ = !0;
garden.compiler.render_css._ = function(a) {
  return"" + cljs.core.str(a)
};
cljs.core.RSeq.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.RSeq.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.map.call(null, garden.compiler.render_css, a)
};
garden.color.CSSColor.prototype.garden$compiler$CSSRenderer$ = !0;
garden.color.CSSColor.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_color.call(null, a)
};
cljs.core.NodeSeq.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.NodeSeq.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.map.call(null, garden.compiler.render_css, a)
};
cljs.core.RedNode.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.RedNode.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_rule.call(null, a)
};
cljs.core.ChunkedSeq.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.ChunkedSeq.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.map.call(null, garden.compiler.render_css, a)
};
garden.types.CSSAtRule.prototype.garden$compiler$CSSRenderer$ = !0;
garden.types.CSSAtRule.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_at_rule.call(null, a)
};
cljs.core.PersistentHashMap.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.PersistentHashMap.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_declaration.call(null, a)
};
garden.types.CSSFunction.prototype.garden$compiler$CSSRenderer$ = !0;
garden.types.CSSFunction.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_function.call(null, a)
};
cljs.core.PersistentVector.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.PersistentVector.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_rule.call(null, a)
};
cljs.core.List.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.List.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.map.call(null, garden.compiler.render_css, a)
};
cljs.core.PersistentArrayMapSeq.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.PersistentArrayMapSeq.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.map.call(null, garden.compiler.render_css, a)
};
cljs.core.BlackNode.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.BlackNode.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_rule.call(null, a)
};
cljs.core.Cons.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.Cons.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.map.call(null, garden.compiler.render_css, a)
};
garden.types.CSSUnit.prototype.garden$compiler$CSSRenderer$ = !0;
garden.types.CSSUnit.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return garden.compiler.render_unit.call(null, a)
};
cljs.core.ArrayNodeSeq.prototype.garden$compiler$CSSRenderer$ = !0;
cljs.core.ArrayNodeSeq.prototype.garden$compiler$CSSRenderer$render_css$arity$1 = function(a) {
  return cljs.core.map.call(null, garden.compiler.render_css, a)
};
garden.compiler.compile_stylesheet = function(a, b) {
  var c = garden.compiler._STAR_flags_STAR_;
  try {
    return garden.compiler._STAR_flags_STAR_ = a, garden.compiler.rule_join.call(null, cljs.core.remove.call(null, cljs.core.nil_QMARK_, cljs.core.map.call(null, garden.compiler.render_css, cljs.core.filter.call(null, garden.compiler.top_level_expression_QMARK_, garden.compiler.expand_stylesheet.call(null, b)))))
  }finally {
    garden.compiler._STAR_flags_STAR_ = c
  }
};
garden.compiler.compile_style = function(a) {
  return cljs.core.first.call(null, garden.compiler.render_css.call(null, garden.compiler.expand.call(null, cljs.core.reduce.call(null, cljs.core.merge, cljs.core.filter.call(null, garden.util.declaration_QMARK_, a)))))
};
garden.compiler.compile_css = function() {
  var a = function(a, b) {
    var e = cljs.core.truth_(function() {
      var b = garden.util.hash_map_QMARK_.call(null, a);
      return cljs.core.truth_(b) ? cljs.core.some.call(null, cljs.core.set.call(null, cljs.core.keys.call(null, a)), cljs.core.keys.call(null, garden.compiler._STAR_flags_STAR_)) : b
    }()) ? cljs.core.PersistentVector.fromArray([cljs.core.merge.call(null, garden.compiler._STAR_flags_STAR_, a), b], !0) : cljs.core.PersistentVector.fromArray([garden.compiler._STAR_flags_STAR_, cljs.core.cons.call(null, a, b)], !0), f = cljs.core.nth.call(null, e, 0, null), g = cljs.core.nth.call(null, e, 1, null);
    (new cljs.core.Keyword(null, "output-to", "output-to", 3189532217)).call(null, f);
    return function() {
      var a = garden.compiler.compile_stylesheet.call(null, f, g);
      return cljs.core.truth_((new cljs.core.Keyword(null, "pretty-print?", "pretty-print?", 3437152219)).call(null, f)) ? a : garden.compiler.compress_stylesheet.call(null, a)
    }()
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
garden.core = {};
garden.core.css = function() {
  var a = function(a) {
    return cljs.core.apply.call(null, garden.compiler.compile_css, a)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
garden.core.style = function() {
  var a = function(a) {
    return garden.compiler.compile_style.call(null, a)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
lucuma.examples = {};
lucuma.examples.ex_hello = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-hello"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859), "Hello world!"], !0));
lucuma.examples.ex_lifecycle = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-lifecycle"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "left-view-fn", "left-view-fn", 4756847772), function() {
  return dommy.core.prepend_BANG_.call(null, document.getElementById("lifecycle-events"), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "li", "li", 1013907695), "element left view"], !0))
}, new cljs.core.Keyword(null, "created-fn", "created-fn", 2383536447), function() {
  return dommy.core.prepend_BANG_.call(null, document.getElementById("lifecycle-events"), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "li", "li", 1013907695), "element created"], !0))
}, new cljs.core.Keyword(null, "entered-view-fn", "entered-view-fn", 3505744396), function() {
  return dommy.core.prepend_BANG_.call(null, document.getElementById("lifecycle-events"), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "li", "li", 1013907695), "element entered view"], !0))
}], !0));
lucuma.examples.ex_content_template = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-content-template"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859), function() {
  return document.getElementById("template-id")
}], !0));
cljs.core.derive.call(null, cljs.core.PersistentVector, new cljs.core.Keyword("lucuma.examples", "vector", "lucuma.examples/vector", 4458923423));
cljs.core._add_method.call(null, lucuma.custom_elements.render_content, new cljs.core.Keyword("lucuma.examples", "vector", "lucuma.examples/vector", 4458923423), function(a) {
  return dommy.template.__GT_node_like.call(null, a)
});
lucuma.examples.ex_content_hiccup = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-content-hiccup"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "div", "div", 1014003715), "Hello hiccup!"], !0)], !0));
lucuma.examples.ex_style = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-style"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "button", "button", 3931183780), "Hello styled!"], !0), new cljs.core.Keyword(null, "style", "style", 1123684643), "button { background: blue; color: white; border: 0; border-radius: 4px;}"], 
!0));
cljs.core._add_method.call(null, lucuma.custom_elements.render_style, new cljs.core.Keyword("lucuma.examples", "vector", "lucuma.examples/vector", 4458923423), function(a) {
  return garden.core.css.call(null, a)
});
lucuma.examples.ex_style_garden = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-style-garden"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "button", "button", 3931183780), "Hello garden!"], !0), new cljs.core.Keyword(null, "style", "style", 1123684643), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, 
"button", "button", 3931183780), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "background", "background", 3976677536), "#3d7c45", new cljs.core.Keyword(null, "color", "color", 1108746965), "white", new cljs.core.Keyword(null, "border", "border", 3925567390), 0, new cljs.core.Keyword(null, "border-radius", "border-radius", 1894943941), "4px"], !0)], !0)], !0));
lucuma.examples.ex_style_scope = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-style-scope"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "span", "span", 1017440956), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "icon-exclamation-sign"], 
!0), "Hello style scope!"], !0), new cljs.core.Keyword(null, "apply-author-styles", "apply-author-styles", 4411190967), !0], !0));
lucuma.examples.delegate_attributes = function(a, b) {
  var c = lucuma.custom_elements.get_chan.call(null, a), d = cljs.core.async.chan.call(null, 1);
  cljs.core.async.impl.dispatch.run.call(null, function() {
    var a = function() {
      return function(a) {
        return function() {
          var b = null, c = function() {
            var a = Array(6);
            a[0] = b;
            a[1] = 1;
            return a
          }, d = function(b) {
            for(;;) {
              var c = a.call(null, b);
              if(!cljs.core.keyword_identical_QMARK_.call(null, c, new cljs.core.Keyword(null, "recur", "recur", 1122293407))) {
                return c
              }
            }
          }, b = function(a) {
            switch(arguments.length) {
              case 0:
                return c.call(this);
              case 1:
                return d.call(this, a)
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          b.cljs$core$IFn$_invoke$arity$0 = c;
          b.cljs$core$IFn$_invoke$arity$1 = d;
          return b
        }()
      }(function(a) {
        var b = a[1];
        return 7 === b ? (b = console.log(a[2]), a[5] = b, a[2] = null, a[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 6 === b ? (b = a[2], a[2] = b, a[1] = 3, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 5 === b ? (a[2] = null, a[1] = 6, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 4 === b ? cljs.core.async.impl.ioc_helpers.take_BANG_.call(null, a, 7, c) : 3 === b ? (b = a[2], cljs.core.async.impl.ioc_helpers.return_chan.call(null, a, b)) : 
        2 === b ? (a[1] = 4, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : 1 === b ? (a[2] = null, a[1] = 2, new cljs.core.Keyword(null, "recur", "recur", 1122293407)) : null
      })
    }(), b = function() {
      var b = a.call(null);
      b[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = d;
      return b
    }();
    return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null, b)
  });
  return d
};
goog.exportSymbol("lucuma.examples.delegate_attributes", lucuma.examples.delegate_attributes);
lucuma.examples.ex_attributes = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-attributes"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "attributes", "attributes", 1419549897), cljs.core.PersistentHashSet.fromArray([new cljs.core.Keyword(null, "attribute", "attribute", 1026989582), null], !0)], !0));
lucuma.examples.alert_fn = function(a) {
  return window.alert([cljs.core.str("Hello methods from '"), cljs.core.str(a.id), cljs.core.str("' !")].join(""))
};
lucuma.examples.ex_methods = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-methods"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "methods", "methods", 1969438500), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "alert", "alert", 1106803918), lucuma.examples.alert_fn], !0)], !0));
lucuma.examples.ex_constructor = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-constructor"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "constructor", "constructor", 3720465260), "MyConstructor", new cljs.core.Keyword(null, "content", "content", 1965434859), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "div", "div", 1014003715), "Hello constructor!"], !0)], !0));
lucuma.examples.ex_extend = cljs.core.merge.call(null, cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "name", "name", 1017277949), "ex-extend"], !0), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "content", "content", 1965434859), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "span", "span", 1017440956), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "class", "class", 1108647146), "icon-exclamation-sign"], !0), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, 
"content", "content", 1965434859)], !0)], !0), new cljs.core.Keyword(null, "apply-author-styles", "apply-author-styles", 4411190967), !0, new cljs.core.Keyword(null, "base-type", "base-type", 3446290472), "button", new cljs.core.Keyword(null, "style", "style", 1123684643), cljs.core.PersistentVector.fromArray([new cljs.core.Keyword(null, "button", "button", 3931183780), cljs.core.PersistentArrayMap.fromArray([new cljs.core.Keyword(null, "color", "color", 1108746965), "red"], !0)], !0)], !0));
lucuma.examples.register_all = function() {
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_hello);
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_lifecycle);
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_content_template);
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_content_hiccup);
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_style);
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_style_garden);
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_style_scope);
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_extend);
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_attributes);
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_methods);
  lucuma.custom_elements.register.call(null, lucuma.examples.ex_constructor);
  lucuma.custom_elements.register.call(null, lucuma.range_with_threshold.lucu_range_with_threshold);
  lucuma.custom_elements.register.call(null, lucuma.overlay.lucu_overlay);
  return lucuma.custom_elements.register.call(null, lucuma.flipbox.lucu_flipbox)
};
goog.exportSymbol("lucuma.examples.register_all", lucuma.examples.register_all);
lucuma.mutation_observer = {};

//@ sourceMappingURL=target/cljs/lucuma+tests.js.map