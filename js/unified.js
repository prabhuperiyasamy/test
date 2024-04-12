(function () {
  var fw = {};
  (function (fw, $) {
    if ($) {
      window.freshsales = window.freshsales || {};
      window.freshsales.$ = window.freshsales.$ || jQuery;
    }
    var chatSelector = document.querySelector("[chat]");
    window.hideChatWidget =
      chatSelector &&
      chatSelector.hasAttribute("chat") &&
      chatSelector.getAttribute("chat") === "false";
    var widgetSelector = document.querySelector("script[widgetId]");
    window.custWidgetId =
      widgetSelector && widgetSelector.hasAttribute("widgetId")
        ? widgetSelector.getAttribute("widgetId")
        : "";
    var FreshworksCRM = (function () {
      let eventListeners = {};
      function FreshworksCRM() {}
      FreshworksCRM.prototype.identify = function () {
        let event = {
          name: "identify",
          args: arguments,
          origin: window.location.origin,
          created_by: "fwcrm",
        };
        let customEvent = new CustomEvent("fwcrm_event", { detail: event });
        window.dispatchEvent(customEvent);
      };
      FreshworksCRM.prototype.trackCustomEvent = function () {
        let event = {
          name: "trackCustomEvent",
          args: arguments,
          origin: window.location.origin,
          created_by: "fwcrm",
        };
        let customEvent = new CustomEvent("fwcrm_event", { detail: event });
        window.dispatchEvent(customEvent);
      };
      FreshworksCRM.prototype.set = function () {
        let event = {
          name: "set",
          args: arguments,
          origin: window.location.origin,
          created_by: "fwcrm",
        };
        let customEvent = new CustomEvent("fwcrm_event", { detail: event });
        window.dispatchEvent(customEvent);
      };
      FreshworksCRM.prototype.on = function (event_name, callback) {
        eventListeners[event_name] = eventListeners[event_name] || [];
        eventListeners[event_name].push(callback);
      };
      FreshworksCRM.prototype.off = function (event_name, callback) {
        if (eventListeners[event_name].length) {
          eventListeners[event_name].pop(callback);
        }
      };
      window.addEventListener("fwcrm_event_consume", function (e) {
        let event_name = e.detail.name;
        let callbacks = eventListeners[event_name];
        if (callbacks && callbacks.length) {
          callbacks.forEach(function (c) {
            try {
              c.apply(this);
            } catch (e) {
              console.log(
                "Error while calling callback function of seeder products",
                e
              );
            }
          });
        }
      });
      return FreshworksCRM;
    })();
    fw.FreshworksCRM = FreshworksCRM;
  })(fw, window.jQuery);
  (function (a) {
    function bind(fn, $this) {
      var a = function () {
        return fn.apply($this, arguments);
      };
      return a;
    }
    a.start = function () {
      try {
        this.FreshworksCRM = new a.FreshworksCRM();
        window.fwcrm = {};
        window.fwcrm.identify = bind(
          this.FreshworksCRM.identify,
          this.FreshworksCRM
        );
        window.fwcrm.trackCustomEvent = bind(
          this.FreshworksCRM.trackCustomEvent,
          this.FreshworksCRM
        );
        window.fwcrm.set = bind(this.FreshworksCRM.set, this.FreshworksCRM);
        window.fwcrm.on = bind(this.FreshworksCRM.on, this.FreshworksCRM);
        window.fwcrm.off = bind(this.FreshworksCRM.off, this.FreshworksCRM);
      } catch (err) {}
    };
  })(fw);
  fw.start();
  var zargetMain;
  zargetMain =
    zargetMain ||
    (function () {
      (function ($) {
        if (!$) {
          var productName = window.fwcrm ? "Freshworks CRM" : "Zarget";
          throw new Error(
            "Jquery library not found :: " +
              productName +
              "'s JavaScript requires jQuery"
          );
        }
        var version = $.fn.jquery.split(" ")[0].split(".");
        var excludeModules = $.fn.jquery.split(" ")[1];
        if (
          (version[0] < 2 && version[1] < 10) ||
          (version[0] == 1 && version[1] == 10 && version[2] < 0)
        ) {
          throw new Error(
            "Zarget's JavaScript requires at least jQuery v1.10.0"
          );
        }
        if (
          excludeModules &&
          excludeModules.split(",").indexOf("-ajax") != -1
        ) {
          throw new Error(
            "Zarget's JavaScript requires Full Jquery, included jQuery does not contain AJAX module"
          );
        }
        window.freshsales = window.freshsales || {};
        window.freshsales.$ = window.freshsales.$ || jQuery;
      })(window.jQuery);
      var Zarget = (function () {
        var zarget = {},
          document = window.document,
          navigator = window.navigator,
          CssSelector,
          _cachedformlabels = {},
          timeOutVariable;
        zarget.visitorCookie = "zarget_user_id";
        zarget.freshworks360Cookie = "_fw_crm_v";
        zarget.visitorInfoCookie = "zarget_visitor_info";
        zarget.goalInfoCookie = "zarget_goal_info";
        zarget.sessionCookie = "zg_session";
        zarget.pollData = "zarget_poll_data";
        zarget.redirectData = "zarget_redirect_time";
        zarget.trackingOptOut = "freshmarketer_opt_out";
        zarget.optOut = false;
        (zarget.trackingOptOutAge = 10 * 365 * 24 * 60 * 60 * 1000),
          (zarget.eventBuffer = []);
        zarget.serverinfo = {
          serverurl: "https://app.pre-freshmarketer.io",
          secureServerURL: "https://app.pre-freshmarketer.io",
          visitorUrl: "/ab/api/visitor/putinfo",
          returningVisitorUrl: "/ab/api/visitor/putinfo",
          heatmapUrl: "/ab/api/visitor/putinfo",
          goalUrl: "/ab/api/visitor/putinfo",
          pausedUrl:
            "/ab/api/auth/org/{orgid}/experiment/{expid}/pausedExperiment",
          cdnServerURL: "//toolbar.pre-freshmarketer.io",
          previewToolbarURL:
            "https://toolbar.pre-freshmarketer.io/preview-toolbar",
          loginurl: "/ab/api/auth/currentuser",
          pollUrl: "/ab/api/visitor/putinfo",
          tpUrl: "//tp.pre-freshmarketer.io/getandset",
          sessionCheckUrl: "/ab/api/visitor/playback/canrecord",
          sessionDecodeUrl: "/ab/api/visitor/playback/decode/url",
          previewurl:
            "/ab/api/preview/get?varinfo={varhashinfo}&varid={varid}&authToken={authToken}",
          pingBackUrl: "/ab/api/visitor/pingback",
          sessionDataSendUrl: "https://src.pre-freshmarketer.io/sr",
          eventDataSendUrl: "https://src.pre-freshmarketer.io/mas",
          formTrackingUrl: "https://src.pre-freshmarketer.io/mas",
          croDataSendUrl: "https://src.pre-freshmarketer.io/cro",
          chatWidgetUrl: "freshpori.com",
          chatHistoryUpdateStatusUrl: "/mas/api/v1/chat/history",
          getFullURL: function (url, secure) {
            var server = secure ? this.secureServerURL : this.serverurl;
            return server + url;
          },
          getFullPath: function (url, props, secure) {
            if (!url) {
              return url;
            }
            var server = secure ? this.secureServerURL : this.serverurl;
            return (
              server +
              url.replace(/{([^{}]*)}/g, function (a, b) {
                var val = "";
                val = props[b];
                return val ? val : a;
              })
            );
          },
        };
        var SECUREFIELDS = {
          creditcard_holdername: {
            rgx: /.*(?:(?:(?:cc|card)?.*(?:(?:holder|owner).*)))|(?:name.*on.*card)|(?:issued.*to)|(?:(?:card|cc|payment).*name)/i,
            negative:
              /(?:issued.*to)|(?:name.*on.*card)|(?:card.*name)|(?:card.*holder)/i,
            label:
              /(?:issued.*to)|(?:name.*on.*card)|(?:card.*name)|(?:card.*holder)/i,
          },
          creditcard_cvv: {
            rgx: /.*(?:cc|card|credit.*card)?(?:(?:cvv|cvc|ccv|cv|cid|verify|verif.*(?:code|num)|verification|sec.*code|card.*sec.*num)|cvv).*/i,
            negative: /gift/i,
          },
          creditcard_number: {
            rgx: /.*(?:cc|card|credit.*card|payment).*(?:num|number|no)|ccard/i,
            negative: /gift|account|reward|acct|issue/i,
            label: /card.*number/i,
          },
          creditcard_expiry_month: {
            rgx: /.*(?:(?:(?:cc|card|billing)?.*(?:exp.*))|(?:(?:cc|card).*(?:exp.*)))(?:date.*)?(?:[m]{2}|mo|mon|month|mn)/i,
            negative: /gift|start|valid|birth/i,
          },
          creditcard_expiry_year: {
            rgx: /.*(?:(?:(?:cc|card|billing)?.*(?:exp.*))|(?:(?:cc|card).*(?:exp.*)))(?:date.*)?(?:[y]{2,4}|yr|year)/i,
            negative: /gift|start|valid|birth/i,
          },
          creditcard_expiry: {
            rgx: /.*(?:(?:(?:cc|card|billing)?.*(?:exp.*))|(?:(?:cc|card).*(?:exp.*))|expiration)/i,
            negative: /gift|year|yr|mon|mm|yy|start|valid|birth/i,
          },
        };
        var URLChangeTrigger = function () {
          this.callBacks = [];
          this.context = [];
        };
        URLChangeTrigger.prototype = {
          register: function (v, ctx) {
            if (typeof v === "function") {
              this.callBacks.push(v);
              this.context.push(ctx);
            }
          },
          dispatchMethods: function () {
            var length = this.callBacks.length;
            for (var i = 0; i < length; i++) {
              try {
                this.callBacks[i].apply(this.context[i]);
              } catch (e) {
                zarget.log(
                  "Error while executing single page registered methods::",
                  e
                );
              }
            }
          },
        };
        window.ZargetUrlChangeTrigger = new URLChangeTrigger();
        (function (history) {
          if (
            !history ||
            !history.pushState ||
            typeof history.pushState !== "function"
          ) {
            zarget.log(
              "History api not supported. Tracking single apps tracking disabled."
            );
            return;
          }
          var pushstate = history.pushState,
            replacestate = history.replaceState;
          history.pushState = function (state) {
            if (typeof history.onpushstate === "function") {
              history.onpushstate({ state: state });
            }
            window.setTimeout(function () {
              window.ZargetUrlChangeTrigger.dispatchMethods();
            }, 50);
            return pushstate.apply(history, arguments);
          };
          history.replaceState = function (state) {
            window.setTimeout(function () {
              window.ZargetUrlChangeTrigger.dispatchMethods();
            }, 50);
            return replacestate.apply(history, arguments);
          };
        })(window.history);
        zarget.getVariationForExperimentAndUser = function (
          experimentid,
          variationid,
          callback,
          otherParams
        ) {
          var props = "";
          if (experimentid) {
            props += "experimentid=" + experimentid;
          }
          if (variationid) {
            props += "&variationid=" + variationid.id;
          }
          var apiurl;
          if (props !== "") {
            apiurl = Zarget.serverinfo.tpUrl + "?" + props;
          } else {
            apiurl = Zarget.serverinfo.tpUrl;
          }
          try {
            var cookieObj;
            var timerId;
            var xhr = Zarget.Messenger.createCORS(apiurl);
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                var age = 365 * 24 * 60 * 60 * 1000;
                cookieObj = JSON.parse(xhr.responseText);
                window.zarget_masteruserid = cookieObj.uid;
                window.zarget_crossdomainrequestgoing = false;
                if (callback) {
                  if (otherParams) {
                    callback.call(otherParams, cookieObj, otherParams);
                  } else {
                    callback(cookieObj);
                  }
                }
              }
            };
            if (xhr) {
              xhr.withCredentials = true;
              xhr.send();
            }
          } catch (e) {}
        };
        window.addEventListener("popstate", function () {
          window.ZargetUrlChangeTrigger.dispatchMethods();
        });
        window.addEventListener("fwcrm_event", function (e) {
          let eventName = e.detail.name;
          switch (eventName) {
            case "identify":
              FM.associateVisitor(e.detail.args[0]);
              break;
            case "trackCustomEvent":
              FM.trackCustomEvent(e.detail.args[0], e.detail.args[1]);
            case "pagevisit":
              FM.pagevisit(e.detail.args[0]);
          }
        });
        zarget.arrayIndexOf = function (arr, val) {
          if (arr && !arr.length) {
            return -1;
          }
          if (!Array.prototype.indexOf) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] == val) {
                return i;
              }
            }
          } else {
            return arr.indexOf(val);
          }
          return -1;
        };
        zarget.matcher = function (v, v1, type) {
          var CONDITION = {
            EQ: 1,
            NOTEQ: 2,
            EQIGNORE: 3,
            NOTEQIGNORE: 4,
            RGX: 5,
            CONTAINS: 6,
            NOTCONTAINS: 7,
            STARTSWITH: 8,
            ENDSWITH: 9,
            SIMPLE: 10,
          };
          function str(a) {
            return String(a);
          }
          function lc(a) {
            return (a || "").toLowerCase();
          }
          function eq(a, b) {
            return a === b;
          }
          function eqignore(a, b) {
            if (!a || !b) {
              return a == b;
            }
            return lc(str(a)) === lc(str(b));
          }
          function noteq(a, b) {
            return a !== b;
          }
          function noteqignore(a, b) {
            if (!a || !b) {
              return a !== b;
            }
            return lc(str(a)) !== lc(str(b));
          }
          function rgxmatch(a, b) {
            if (!(a instanceof RegExp)) {
              a = new RegExp(a);
            }
            return a.test(b);
          }
          function contains(a, b) {
            if (!a || !b) {
              return a == b;
            }
            return lc(str(a)).indexOf(lc(str(b))) !== -1;
          }
          function notcontains(a, b) {
            if (!a || !b) {
              return a !== b;
            }
            return lc(str(a)).indexOf(lc(str(b))) === -1;
          }
          function startswith(a, b) {
            if (!a || !b) {
              return false;
            }
            return lc(str(a)).indexOf(lc(str(b))) === 0;
          }
          function endswith(a, b) {
            if (!a || !b) {
              return false;
            }
            a = lc(str(a));
            b = lc(str(b));
            return a.indexOf(b) + b.length === a.length;
          }
          function simple(a, b) {
            if (!a || !b) {
              return false;
            }
            return zarget.getSimpleURL(lc(a)) === zarget.getSimpleURL(lc(b));
          }
          switch (type) {
            case CONDITION.EQ:
              return eq(v, v1);
            case CONDITION.EQIGNORE:
              return eqignore(v, v1);
            case CONDITION.NOTEQ:
              return noteq(v, v1);
            case CONDITION.NOTEQIGNORE:
              return noteqignore(v, v1);
            case CONDITION.RGX:
              return rgxmatch(v, v1);
            case CONDITION.CONTAINS:
              return contains(v, v1);
            case CONDITION.NOTCONTAINS:
              return notcontains(v, v1);
            case CONDITION.STARTSWITH:
              return startswith(v, v1);
            case CONDITION.ENDSWITH:
              return endswith(v, v1);
            case CONDITION.SIMPLE:
              return simple(v, v1);
            default:
              return false;
          }
        };
        function keySet(arr) {
          var keys = {},
            i,
            l;
          for (i = 0, l = arr.length; i < l; ++i) {
            keys[arr[i]] = true;
          }
          return keys;
        }
        function getClassName(node, excludes) {
          var EXCLUDE_CLASS_LIST = [
            "active",
            "ui-draggable",
            "ui-draggable-handle",
          ];
          var classes = node.getAttribute("class"),
            claz;
          var v;
          if (classes) {
            v = "";
            classes = classes.split(" ");
            for (var i = 0, l = classes.length; i < l; i++) {
              claz = classes[i];
              if (EXCLUDE_CLASS_LIST.indexOf(claz) != -1) {
                continue;
              }
              if (matchesExcludePattern(claz, excludes && excludes.claz)) {
                continue;
              }
              v += claz + " ";
            }
            return v.trim();
          }
          return v;
        }
        function matchesExcludePattern(selector, excludes) {
          var i,
            l,
            pattern,
            regex,
            type,
            value,
            matches = false;
          if (!excludes || !selector || !excludes.length) {
            return matches;
          }
          try {
            for (i = 0, l = excludes.length; i < l; i++) {
              pattern = excludes[i];
              if (!pattern || typeof pattern !== "object") {
                continue;
              }
              type = pattern.type;
              value = pattern.value;
              if (!value || value.trim().length === 0) {
                continue;
              }
              if (type === "contains" && selector.indexOf(value) !== -1) {
                matches = true;
                break;
              } else {
                if (type === "regex") {
                  regex = new RegExp(value);
                  if (regex.test(selector)) {
                    matches = true;
                    break;
                  }
                }
              }
            }
          } catch (e) {}
          return matches;
        }
        function getId(node, excludes) {
          var EXCLUDE_ID_PATTERN = /^ember.*/;
          var elementid = node.getAttribute("id"),
            regex,
            ps;
          if (elementid) {
            elementid = elementid.replace(EXCLUDE_ID_PATTERN, "");
            if (!matchesExcludePattern(elementid, excludes && excludes.id)) {
              return elementid;
            }
          }
        }
        CssSelector = {
          cssPath: function (node, optimized, excludes) {
            if (node.nodeType !== Node.ELEMENT_NODE) {
              return "";
            }
            var steps = [],
              contextNode = node,
              step;
            while (contextNode) {
              step = CssSelector.cssPathStep(
                contextNode,
                !!optimized,
                contextNode === node,
                excludes
              );
              if (!step) {
                break;
              }
              steps.push(step);
              if (step.optimized) {
                break;
              }
              contextNode = contextNode.parentNode;
            }
            steps.reverse();
            return steps.join(" > ");
          },
          cssPathStep: function (node, optimized, isTargetNode, excludes) {
            if (node.nodeType !== Node.ELEMENT_NODE) {
              return null;
            }
            function prefixedElementClassNames(node) {
              var classAttribute = getClassName(node, excludes);
              if (!classAttribute) {
                return [];
              }
              return classAttribute
                .split(/\s+/g)
                .filter(Boolean)
                .map(function (name) {
                  return "$" + name;
                });
            }
            function isCSSIdentChar(c) {
              if (/[a-zA-Z0-9_\-]/.test(c)) {
                return true;
              }
              return c.charCodeAt(0) >= 160;
            }
            function isCSSIdentifier(value) {
              return /^-?[a-zA-Z_][a-zA-Z0-9_\-]*$/.test(value);
            }
            function toHexByte(c) {
              var hexByte = c.charCodeAt(0).toString(16);
              if (hexByte.length === 1) {
                hexByte = "0" + hexByte;
              }
              return hexByte;
            }
            function escapeAsciiChar(c, isLast) {
              return "\\" + toHexByte(c) + (isLast ? "" : " ");
            }
            function escapeIdentifierIfNeeded(ident) {
              if (isCSSIdentifier(ident)) {
                return ident;
              }
              var shouldEscapeFirst = /^(?:[0-9]|-[0-9\-]?)/.test(ident),
                lastIndex = ident.length - 1;
              return ident.replace(/./g, function (c, i) {
                return (shouldEscapeFirst && i === 0) || !isCSSIdentChar(c)
                  ? escapeAsciiChar(c, i === lastIndex)
                  : c;
              });
            }
            function idSelector(id) {
              return "#" + escapeIdentifierIfNeeded(id);
            }
            var id = getId(node, excludes),
              nodeNameLower,
              nodeName,
              parent,
              prefixedOwnClassNamesArray,
              needsClassNames,
              needsNthChild,
              ownIndex,
              elementIndex,
              siblings,
              i,
              sibling,
              ownClassNames,
              ownClassNameCount,
              name,
              siblingClassNamesArray,
              j,
              siblingClass,
              result,
              prefixedName;
            if (optimized) {
              if (id) {
                return new CssSelector.DOMNodePathStep(idSelector(id), true);
              }
              nodeNameLower = node.nodeName.toLowerCase();
              if (
                nodeNameLower === "body" ||
                nodeNameLower === "head" ||
                nodeNameLower === "html"
              ) {
                return new CssSelector.DOMNodePathStep(
                  CssSelector.nodeNameInCorrectCase(node),
                  true
                );
              }
            }
            nodeName = CssSelector.nodeNameInCorrectCase(node);
            if (id) {
              return new CssSelector.DOMNodePathStep(
                nodeName + idSelector(id),
                true
              );
            }
            parent = node.parentNode;
            if (!parent || parent.nodeType === Node.DOCUMENT_NODE) {
              return new CssSelector.DOMNodePathStep(nodeName, true);
            }
            prefixedOwnClassNamesArray = prefixedElementClassNames(node);
            needsClassNames = false;
            needsNthChild = false;
            ownIndex = -1;
            elementIndex = -1;
            siblings = parent.children;
            for (
              i = 0;
              (ownIndex === -1 || !needsNthChild) && i < siblings.length;
              ++i
            ) {
              sibling = siblings[i];
              if (sibling.nodeType !== Node.ELEMENT_NODE) {
                continue;
              }
              elementIndex += 1;
              if (sibling === node) {
                ownIndex = elementIndex;
                continue;
              }
              if (needsNthChild) {
                continue;
              }
              if (CssSelector.nodeNameInCorrectCase(sibling) !== nodeName) {
                continue;
              }
              needsClassNames = true;
              ownClassNames = keySet(prefixedOwnClassNamesArray);
              ownClassNameCount = 0;
              for (name in ownClassNames) {
                ++ownClassNameCount;
              }
              if (ownClassNameCount === 0) {
                needsNthChild = true;
                continue;
              }
              siblingClassNamesArray = prefixedElementClassNames(sibling);
              for (j = 0; j < siblingClassNamesArray.length; ++j) {
                siblingClass = siblingClassNamesArray[j];
                if (!ownClassNames.hasOwnProperty(siblingClass)) {
                  continue;
                }
                delete ownClassNames[siblingClass];
                if (!--ownClassNameCount) {
                  needsNthChild = true;
                  break;
                }
              }
            }
            result = nodeName;
            if (
              isTargetNode &&
              nodeName.toLowerCase() === "input" &&
              node.getAttribute("type") &&
              !getId(node, excludes) &&
              !getClassName(node, excludes)
            ) {
              result += '[type="' + node.getAttribute("type") + '"]';
            }
            if (needsNthChild) {
              result += ":nth-child(" + (ownIndex + 1) + ")";
            } else {
              if (needsClassNames) {
                for (prefixedName in keySet(prefixedOwnClassNamesArray)) {
                  result +=
                    "." + escapeIdentifierIfNeeded(prefixedName.substr(1));
                }
              }
            }
            return new CssSelector.DOMNodePathStep(result, false);
          },
        };
        CssSelector.DOMNodePathStep = function (value, optimized) {
          this.value = value;
          this.optimized = optimized || false;
        };
        CssSelector.nodeNameInCorrectCase = function (node) {
          return CssSelector.isXMLNode(node)
            ? node.nodeName
            : node.nodeName.toLowerCase();
        };
        CssSelector.isXMLNode = function (node) {
          return node.ownerDocument && !!node.ownerDocument.xmlVersion;
        };
        CssSelector.DOMNodePathStep.prototype = {
          toString: function () {
            return this.value;
          },
        };
        zarget.log = function () {
          if (window.console && window.console.log && zargetDebugEnabled) {
            Array.prototype.unshift.call(arguments, 0);
            arguments[0] = "Zarget :";
            console.log.apply(window.console, arguments);
          }
        };
        zarget.stringifyJSON = function (obj) {
          if (!obj) {
            return;
          }
          if (window.JSON && window.JSON.stringify) {
            return JSON.stringify(obj);
          }
          var k,
            v,
            r = "{";
          for (k in obj) {
            v = obj[k];
            if (typeof obj[k] === "number") {
              r += '"' + k + '":' + v + ",";
            } else {
              r += '"' + k + '":"' + String(obj[k]) + '",';
            }
          }
          if (r.charAt(r.length - 1) === ",") {
            r = r.substring(0, r.length - 1);
          }
          return r + "}";
        };
        zarget.parseJSON = function (data) {
          if (!data || data === "undefined") {
            return;
          }
          if (window.JSON && window.JSON.parse) {
            return window.JSON.parse(data + "");
          }
          var rvalidtokens =
              /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g,
            requiredNonComma,
            depth = null,
            str = zarget.trim(data + "");
          function tokenize(token, comma, open, close) {
            if (requiredNonComma && comma) {
              depth = 0;
            }
            if (depth === 0) {
              return token;
            }
            requiredNonComma = open || comma;
            depth += !close - !open;
            return "";
          }
          return str && !zarget.trim(str.replace(rvalidtokens, tokenize))
            ? Function("return " + str)()
            : (function () {
                throw "Invalid JSON";
              })();
        };
        zarget.parseURL = function (url) {
          var rgx,
            result,
            scheme,
            authority,
            path,
            query,
            fragement,
            params,
            n,
            v,
            p,
            idx,
            i,
            a,
            l;
          rgx =
            /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;
          result = url.match(rgx);
          scheme = result[1] || "";
          authority = result[2] || "";
          path = result[3] || "";
          query = result[4] || "";
          fragement = result[5] || "";
          if (query) {
            params = {};
            for (i = 0, a = query.split("&"), l = a.length; i < l; i++) {
              (p = a[i]),
                (idx = p.indexOf("=")),
                (n = idx !== -1 ? p.substr(0, idx) : p),
                (v = idx !== -1 ? p.substr(idx + 1) : "");
              try {
                v = v && decodeURIComponent(v.replace(/\+/g, "%20"));
              } catch (ignore) {}
              params[n] = v;
            }
          }
          return {
            path: path,
            scheme: scheme,
            authority: authority,
            query: params,
            fragement: fragement,
          };
        };
        var queryObj = zarget.parseURL(document.URL).query;
        var zargetDebugEnabled =
          queryObj != undefined &&
          queryObj.hasOwnProperty("zarget_debug_enabled") &&
          queryObj.zarget_debug_enabled == "true";
        zarget.removeTrailSlash = function (url) {
          var rgx = /\/+$/g;
          return url.replace(rgx, "");
        };
        zarget.trim = function (str) {
          if (String.prototype.trim) {
            return str.trim();
          }
          var rgx = /^\s+|\s+$/g;
          return str.replace(rgx, "");
        };
        zarget.getCookies = function () {
          if (!document.cookie) {
            return [];
          }
          var cookies = {},
            cookie,
            cname,
            cval,
            dcookies,
            i,
            l,
            oldCookieName = "freshworks-s360-vid";
          dcookies = document.cookie.split(";");
          for (i = 0, l = dcookies.length; i < l; i++) {
            cookie = dcookies[i];
            cname = cookie.substr(0, cookie.indexOf("="));
            cval = cookie.substr(cname.length + 1);
            cookies[zarget.trim(cname)] = cval;
          }
          if (cookies[oldCookieName]) {
            var value = cookies[oldCookieName];
            zarget.removeCookie(oldCookieName);
            if (!cookies[zarget.freshworks360Cookie]) {
              zarget.setCookie(zarget.freshworks360Cookie, value);
            }
          }
          return cookies;
        };
        zarget.getCookie = function (name) {
          if (!name) {
            return;
          }
          return zarget.getCookies()[name];
        };
        zarget.getStorage = function (name) {
          if (!name) {
            return;
          }
          if (window.localStorage) {
            try {
              window.localStorage.setItem("test", "test");
              return window.localStorage.getItem(name);
            } catch (e) {
              return zarget.getCookie(name);
            }
          } else {
            return zarget.getCookie(name);
          }
          return;
        };
        zarget.setStorage = function (name, value) {
          if (window.localStorage) {
            try {
              return window.localStorage.setItem(name, value);
            } catch (e) {
              var age = 365 * 24 * 60 * 60 * 1000;
              return zarget.setCookie(name, value, age);
            }
          } else {
            var age = 365 * 24 * 60 * 60 * 1000;
            return zarget.setCookie(name, value, age);
          }
          return;
        };
        zarget.extractStorageData = function (storageName) {
          try {
            var storeInfo = Zarget.getStorage(storageName);
            if (!storeInfo) {
              return;
            }
            return Zarget.parseJSON(decodeURIComponent(storeInfo));
          } catch (e) {
            Zarget.log("localStorage data can not be extracted");
          }
        };
        zarget.updatePollData = function (id, key, value, trigger) {
          var item = zarget.getStorage(Zarget.pollData);
          var pollObj;
          var pollData = {};
          if (item) {
            pollData = zarget.parseJSON(decodeURIComponent(item));
            if (pollData.hasOwnProperty(id)) {
              pollObj = pollData[id];
            } else {
              pollData[id] = pollObj = {};
            }
          } else {
            pollData[id] = pollObj = {};
          }
          if (trigger) {
            var urlHash = zarget.sdbmCode(document.URL);
            if (pollObj.hasOwnProperty(urlHash)) {
              pollObj = pollObj[urlHash];
            } else {
              pollData[id][urlHash] = pollObj = {};
            }
          }
          pollObj[key] = value;
          zarget.setStorage(
            Zarget.pollData,
            encodeURIComponent(Zarget.stringifyJSON(pollData))
          );
        };
        zarget.getPollData = function (id, key, trigger) {
          var item = zarget.getStorage(Zarget.pollData);
          if (item) {
            var pollData = zarget.parseJSON(decodeURIComponent(item));
            if (pollData.hasOwnProperty(id)) {
              if (trigger) {
                var hashData = pollData[id];
                var urlHash = zarget.sdbmCode(document.URL);
                if (hashData.hasOwnProperty(urlHash)) {
                  return pollData[id][urlHash][key];
                }
              } else {
                return pollData[id][key];
              }
            }
          }
        };
        zarget.setAction = function (id, close) {
          zarget.setStorage(id, close);
        };
        zarget.getAction = function (id) {
          var close = zarget.getStorage(id);
          if (close) {
            return close;
          } else {
            return null;
          }
        };
        zarget.sdbmCode = function (str) {
          var hash = 0,
            char1;
          for (var i = 0, len = str.length; i < len; i++) {
            char1 = str.charCodeAt(i);
            hash = char1 + (hash << 6) + (hash << 16) - hash;
          }
          return hash;
        };
        zarget.isCookieDisabled = function () {
          return (
            navigator.cookieEnabled === "undefined" || !navigator.cookieEnabled
          );
        };
        zarget.getHighestLevelDomain = function () {
          var i = 0,
            domain = document.domain,
            parts = domain.split("."),
            tmpCookie = "_zg" + new Date().getTime();
          while (
            i < parts.length - 1 &&
            document.cookie.indexOf(tmpCookie + "=" + tmpCookie) == -1
          ) {
            domain = parts.slice(-1 - ++i).join(".");
            document.cookie =
              tmpCookie + "=" + tmpCookie + ";domain=" + domain + ";";
          }
          document.cookie =
            tmpCookie +
            "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" +
            domain +
            ";";
          return domain;
        };
        zarget.setCookie = function (name, value, age) {
          var age = age || 365 * 24 * 60 * 60 * 1000,
            expiry = new Date(+new Date() + age);
          var domain = zarget.getHighestLevelDomain() || location.hostname;
          document.cookie =
            name +
            "=" +
            value +
            ";domain=." +
            domain +
            ";path=/;expires=" +
            expiry.toUTCString() +
            ";SameSite=Lax;";
          if (zarget.getCookie(name) !== value) {
            document.cookie =
              name + "=" + value + ";path=/; expires=" + expiry.toUTCString();
          }
          if (zarget.getCookie(name) !== value) {
            document.cookie =
              name +
              "=" +
              value +
              ";domain=." +
              domain +
              "; SameSite=None; Secure; path=/; expires=" +
              expiry.toUTCString();
          }
        };
        zarget.removeCookie = function (name) {
          var domain = zarget.getHighestLevelDomain() || location.hostname;
          document.cookie =
            name +
            "=;domain=." +
            domain +
            ";path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;SameSite=Lax;";
        };
        zarget.generateUserID = function () {
          var d = new Date().getTime();
          var d2 =
            (performance && performance.now && performance.now() * 1000) || 0;
          var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
              var r = Math.random() * 16;
              if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
              } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
              }
              return (c == "x" ? r : (r & 7) | 8).toString(16);
            }
          );
          return uuid;
        };
        zarget.setUserID = function () {
          var age,
            c = document.cookie || "";
          if (c.indexOf(zarget.visitorCookie + "=") === -1) {
            age = 365 * 24 * 60 * 60 * 1000;
            zarget.setCookie(
              zarget.visitorCookie,
              zarget.generateUserID(),
              age
            );
          }
        };
        zarget.checkPingBack = function (hash) {
          var msg = new Zarget.Message(Zarget.MessageType.PINGBACK);
          msg.setParam({ id: hash });
          Zarget.Messenger.send(msg);
        };
        zarget.generatePageID = function () {
          return +new Date() + "p" + Math.random();
        };
        zarget.generateSessionID = function () {
          return +new Date() + "f" + Math.random();
        };
        zarget.isNewSession = function (expid) {
          var c = document.cookie || "";
          return c.indexOf(zarget.sessionCookie + "_" + expid + "=") === -1
            ? true
            : false;
        };
        zarget.setSessionID = function (expid) {
          if (zarget.isNewSession()) {
            var age = 1 * 24 * 60 * 60 * 1000;
            zarget.setCookie(
              zarget.sessionCookie + "_" + expid,
              zarget.generateSessionID(),
              age
            );
          }
          return zarget.getCookie(zarget.sessionCookie);
        };
        zarget.setSessionStopped = function (expid) {
          var age = 30 * 24 * 60 * 60 * 1000;
          zarget.setCookie(zarget.sessionCookie + "_" + expid, "-1", age);
        };
        zarget.getSessionID = function (expid) {
          return zarget.getCookie(zarget.sessionCookie + "_" + expid);
        };
        zarget.checkSamplePercentage = function () {
          var randomPercentage = Math.floor(Math.random() * 100);
          var samplePercentage = ZargetData.samplePercentage;
          return randomPercentage <= samplePercentage;
        };
        zarget.SAMPLE_VISITED_USER = 1;
        zarget.SAMPLE_ABANDONED_USER = 2;
        zarget.notAllowSampledVisitor = function () {
          var uid = zarget.getUidAndSetIfNotExists();
          var info = zarget.getCookie(uid);
          var sampledUser = info ? parseInt(info) : info;
          if (sampledUser === zarget.SAMPLE_ABANDONED_USER) {
            return true;
          }
          if (sampledUser !== zarget.SAMPLE_VISITED_USER) {
            if (!zarget.checkSamplePercentage()) {
              zarget.setCookie(uid, zarget.SAMPLE_ABANDONED_USER);
              console.log("####### Visitor is not bucketed ########");
              return true;
            }
          }
          return false;
        };
        zarget.getUidAndSetIfNotExists = function () {
          var userid;
          if (ZargetData.IS_BUNDLE_ACCOUNT) {
            userid = zarget.getCookie(zarget.freshworks360Cookie);
            if (!userid) {
              var age,
                c = document.cookie || "";
              if (c.indexOf(zarget.freshworks360Cookie + "=") === -1) {
                age = 365 * 24 * 60 * 60 * 1000;
                zarget.setCookie(
                  zarget.freshworks360Cookie,
                  zarget.generateUserID(),
                  age
                );
              }
              userid = zarget.getCookie(zarget.freshworks360Cookie);
            }
          } else {
            userid = zarget.getCookie(zarget.visitorCookie);
            if (!userid) {
              zarget.setUserID();
              userid = zarget.getCookie(zarget.visitorCookie);
            }
          }
          return userid;
        };
        zarget.getVisitorInfo = function () {
          var info = zarget.getCookie(zarget.visitorInfoCookie);
          if (!info) {
            return;
          }
          try {
            return zarget.parseJSON(decodeURIComponent(info));
          } catch (e) {
            zarget.log("Cookie visitor_info value tampered cannot parse it.");
          }
        };
        zarget.getGoalInfo = function () {
          var info = zarget.getCookie(zarget.goalInfoCookie);
          if (!info) {
            return;
          }
          try {
            return zarget.parseJSON(decodeURIComponent(info));
          } catch (e) {
            zarget.log("Cookie goals_info value tampered cannot parse it.");
          }
        };
        zarget.getPollsInfo = function () {
          var info = zarget.getStorage(zarget.pollData);
          if (!info) {
            return;
          }
          try {
            return zarget.parseJSON(decodeURIComponent(info));
          } catch (e) {
            zarget.log("Cookie polls_info value tampered cannot parse it.");
          }
        };
        zarget.selector = function (node, excludes) {
          return node ? CssSelector.cssPath(node, false, excludes) : "";
        };
        zarget.getReferrer = function () {
          return document.referrer;
        };
        zarget.getURL = function (url) {
          url = url || document.URL;
          return url.split("?")[0];
        };
        zarget.getSimpleURL = function (url) {
          var parser = document.createElement("a");
          parser.href = url;
          var hostname = parser.hostname;
          var pathname = parser.pathname;
          if (hostname) {
            hostname = hostname.replace(/^www./i, "");
          }
          if (pathname) {
            pathname = pathname.replace(/\/$/, "");
          }
          return hostname + pathname;
        };
        zarget.isAlreadyVisitedUser = function () {
          return !!(
            zarget.getCookie(zarget.visitorCookie) &&
            zarget.getCookie(zarget.visitorInfoCookie)
          );
        };
        zarget.isNewVisitor = function () {
          return !zarget.getCookie(zarget.visitorCookie);
        };
        zarget.isURLMatches = function (url) {
          var cururl = zarget.parseURL(document.URL);
          function lc(a) {
            return (a || "").toLowerCase();
          }
          var expurl = zarget.parseURL(experiment.url);
          if (
            lc(expurl.authority) === lc(cururl.authority) &&
            lc(expurl.path) === lc(cururl.path)
          ) {
            return true;
          }
          return false;
        };
        zarget.Message = function (type) {
          this.type = type;
          this.params = {};
        };
        zarget.migrateExistingCookies = function (exps, cookies, excludes) {
          var runningCookies = {},
            exp;
          for (var cookieKey in cookies) {
            if (
              exps.hasOwnProperty(cookieKey) ||
              zarget.isLidExists(exps, cookieKey)
            ) {
              exp = exps[cookieKey] || zarget.isLidExists(exps, cookieKey);
              if (exp.hasOwnProperty("lid")) {
                runningCookies[exp.lid] = cookies[cookieKey];
              }
            }
            if (
              excludes.hasOwnProperty(cookieKey) ||
              zarget.isLidExists(excludes, cookieKey)
            ) {
              exp =
                excludes[cookieKey] || zarget.isLidExists(excludes, cookieKey);
              if (exp.hasOwnProperty("lid")) {
                runningCookies[exp.lid] = cookies[cookieKey];
              }
            }
          }
          return runningCookies;
        };
        zarget.isLidExists = function (exps, lid) {
          if (Array.isArray(exps)) {
            for (var i = 0, exp, len; (exp = exps[i]); i++) {
              if (exp.hasOwnProperty("experiment")) {
                if (exp.experiment.hasOwnProperty("lid")) {
                  if (exp.experiment.lid == lid) {
                    return exp.experiment;
                  }
                }
              }
            }
          } else {
            for (var exp in exps) {
              if (exps[exp].hasOwnProperty("lid")) {
                if (exps[exp]["lid"] == lid) {
                  return exps[exp];
                }
              }
            }
          }
          return false;
        };
        zarget.removePausedExpCookies = function () {
          var exps = ZargetData.experiments,
            viCookies = Zarget.getVisitorInfo(),
            age = 365 * 24 * 60 * 60 * 1000,
            excludes = ZargetData.excludes || {};
        };
        zarget.findExperiment = function (exps, Experiment) {
          if (!ZargetData || !ZargetData.experiments || zarget.isOptedOut()) {
            return;
          }
          var visitorinfo = Zarget.getVisitorInfo();
          for (var exp in visitorinfo) {
            var expDet = zarget.isLidExists(ZargetData.experiments, exp);
            if (
              !expDet ||
              (expDet && (expDet.type === 7 || expDet.type === 8))
            ) {
              continue;
            }
            if (
              zarget.isExperimentURLMatches(expDet) ||
              matchVariationURL(expDet, null, true)
            ) {
              if (!exps.isExists(expDet)) {
                exps.push(Experiment(expDet));
              }
            }
          }
          for (var e in ZargetData.experiments) {
            var expDet = ZargetData.experiments[e];
            if (expDet.type === 5 || expDet.type === 7 || expDet.type === 8) {
              continue;
            }
            if (
              zarget.isExperimentURLMatches(expDet) &&
              canRunScheduled(expDet)
            ) {
              if (expDet.type === 1 || expDet.type === 4) {
                var traffic = Math.random() * 100;
                if (traffic > expDet.traffic) {
                  continue;
                }
              }
              if (!exps.isExists(expDet)) {
                exps.push(Experiment(expDet));
              }
            }
          }
          var split = filterExps(exps, 4);
          var ab = filterExps(exps, 1);
          var heatmap = filterExps(exps, 3);
          exps.splice(0);
          split.length && exps.push(split[0]);
          window.zarget$.each(ab, function (idx, abExp) {
            exps.push(abExp);
          });
          heatmap.length && exps.push(heatmap[0]);
          return exps;
        };
        zarget.getProjectProps = function () {
          if (!ZargetData || !ZargetData.project) {
            return;
          }
          return ZargetData.project;
        };
        function filterExps(exps, type) {
          return window.zarget$.grep(exps, function (expObj) {
            if (expObj.experiment.type === type) {
              return true;
            }
          });
        }
        zarget.rememberGoal = function (exp, goalid) {
          if (!goalid) {
            return;
          }
          var age = 365 * 24 * 60 * 60 * 1000,
            goalInfo = Zarget.getGoalInfo(),
            gobj;
          gobj = typeof goalInfo === "object" ? goalInfo : {};
          if (!gobj.hasOwnProperty(exp.id)) {
            gobj[exp.id] = [goalid];
            Zarget.setCookie(
              Zarget.goalInfoCookie,
              encodeURIComponent(Zarget.stringifyJSON(gobj)),
              age
            );
          } else {
            var goals = gobj[exp.id];
            if (goals.indexOf(goalid) < 0) {
              goals.push(goalid);
              Zarget.setCookie(
                Zarget.goalInfoCookie,
                encodeURIComponent(Zarget.stringifyJSON(gobj)),
                age
              );
            }
          }
        };
        zarget.processOptOut = function () {
          var optOutCookie, queryParams;
          optOutCookie = zarget.getCookie(zarget.trackingOptOut);
          if (optOutCookie) {
            zarget.optOut = true;
            zarget.removeCookie(zarget.visitorCookie);
            zarget.removeCookie(zarget.visitorInfoCookie);
          } else {
            queryParams = zarget.parseURL(document.URL).query;
            if (queryParams && queryParams[zarget.trackingOptOut] === "true") {
              zarget.setTrackingOptOutCookie();
              zarget.optOut = true;
              zarget.removeCookie(zarget.visitorCookie);
              zarget.removeCookie(zarget.visitorInfoCookie);
            }
          }
        };
        zarget.isOptedOut = function () {
          return zarget.optOut;
        };
        zarget.setTrackingOptOutCookie = function () {
          var c = document.cookie || "";
          if (c.indexOf(zarget.trackingOptOut + "=") === -1) {
            zarget.setCookie(
              zarget.trackingOptOut,
              "1",
              zarget.trackingOptOutAge
            );
            alert(
              "You have successfully opted out of FreshMarketer tracking for this website."
            );
          }
        };
        function canRunScheduled(exp) {
          if (exp.schedule && exp.time) {
            var today = new Date();
            var nowUTC = today.getTime() + today.getTimezoneOffset() * 60000;
            return exp.time > nowUTC ? true : false;
          }
          return true;
        }
        zarget.canRunScheduled = canRunScheduled;
        function trimURL(url) {
          if (!url) {
            return url;
          }
          return url.charAt(url.length - 1) === "/"
            ? url.substring(0, url.length - 1)
            : url;
        }
        function matchVariationURL(experiment, variationArr, findExp) {
          if (!experiment || !experiment.variations) {
            return false;
          }
          if (experiment.type !== 4) {
            return false;
          }
          if (experiment.type === 4 && experiment.regex) {
            return fnCheckMatchURL(
              experiment,
              variationArr || experiment.variations
            );
          }
          var cururl = zarget.parseURL(document.URL);
          var variations = variationArr || experiment.variations;
          for (var i = 0, url, variation, l = variations.length; i < l; i++) {
            variation = variations[i];
            url = zarget.parseURL(variation.url);
            var queryIdx = variation.url.indexOf("?");
            var varQueryUrl = "";
            if (queryIdx > -1) {
              var queryStr = variation.url.substring(queryIdx);
              varQueryUrl = queryStr;
            }
            if (experiment.queryparam) {
              varQueryUrl = window.location.search;
            }
            if (findExp) {
              if (
                simpleMatchHost(url.authority, cururl.authority) &&
                trimURL(url.path) === trimURL(cururl.path)
              ) {
                return true;
              }
            } else {
              if (
                simpleMatchHost(url.authority, cururl.authority) &&
                trimURL(url.path) === trimURL(cururl.path) &&
                window.location.search === varQueryUrl
              ) {
                return true;
              }
            }
          }
          return false;
        }
        zarget.matchSplitFunc = matchVariationURL;
        function fnCheckMatchURL(experiment, variationArr) {
          var cururl,
            locHref,
            checkURL,
            orig,
            regexs,
            k,
            matches,
            match,
            re,
            regex,
            i,
            len,
            variations,
            j,
            variation,
            varUrl,
            groupPatt,
            grpMatch,
            match1,
            orig1,
            d,
            lastInd,
            strEx,
            expurl,
            parseUrl,
            docURL;
          docURL = document.URL;
          cururl = Zarget.parseURL(docURL);
          expurl = Zarget.parseURL(experiment.url);
          locHref = cururl.authority.replace(/^www./, "") + cururl.path;
          var queryIdx = docURL.indexOf("?");
          if (queryIdx > -1) {
            var queryStr = docURL.substring(queryIdx);
            locHref += queryStr;
          }
          checkURL = expurl.authority.replace(/^www./, "") + expurl.path;
          var queryIdx = experiment.url.indexOf("?");
          if (queryIdx > -1) {
            var queryStr = experiment.url.substring(queryIdx);
            checkURL += queryStr;
          }
          orig = checkURL;
          regexs = orig.split("/");
          k = 1;
          matches = {};
          re = /(\([^\)\/]*\)|\*+)/g;
          for (i = 0, len = regexs.length; i < len; i++) {
            regex = regexs[i];
            if (regex.match(re) !== null) {
              while ((match = re.exec(regex)) !== null) {
                matches[k] = match[0];
                k++;
              }
            }
          }
          function supplant(url) {
            return url.replace(/\$\{variable(\d)\}/g, function ($1, $2) {
              return matches[$2] ? matches[$2] : "";
            });
          }
          variations = variationArr || experiment.variations;
          for (j = 0, len = variations.length; j < len; j++) {
            variation = variations[j];
            if (variation.name.toLowerCase() !== "original") {
              parseUrl = Zarget.parseURL(variation.url);
              varUrl = parseUrl.authority.replace(/^www./, "") + parseUrl.path;
              var queryIdx = variation.url.indexOf("?");
              if (queryIdx > -1) {
                var queryStr = variation.url.substring(queryIdx);
                varUrl += queryStr;
              }
              varUrl = supplant(varUrl);
              varUrl = varUrl.replace(/([\[\]\*\^\$\.\?\/\\])/g, "\\$1");
              groupPatt = /(\\\(([^\)\/]*)\))/g;
              match1 = varUrl.match(groupPatt);
              orig1 = "";
              if (orig.match(groupPatt) !== null) {
                d = 0;
                lastInd = 0;
                while ((grpMatch = groupPatt.exec(orig)) !== null) {
                  firstSub = orig
                    .substring(lastInd, grpMatch.index)
                    .replace(/\\\*+/g, "(.*)");
                  matchReg =
                    "(" +
                    grpMatch[2].substring(0, grpMatch[2].length - 1) +
                    ")";
                  matchReg = matchReg.replace(/\\\|/g, "|");
                  orig1 += firstSub + matchReg;
                  lastInd = grpMatch.index + grpMatch[0].length;
                  d++;
                }
                orig1 += orig.substring(lastInd, orig.length);
                varUrl = orig1;
              } else {
                varUrl = varUrl.replace(/\\\*+/g, "(.*)");
              }
              strEx = new RegExp(varUrl);
              match = locHref.match(strEx);
              if (
                match !== null &&
                match.index === 0 &&
                match[0].length == locHref.length
              ) {
                return true;
              }
            }
          }
        }
        zarget.findHeatMapExperiment = function () {
          if (!ZargetData || !ZargetData.experiments) {
            return;
          }
          var visitorinfo = Zarget.getVisitorInfo();
          for (var exp in visitorinfo) {
            var expDet = zarget.isLidExists(ZargetData.experiments, exp);
            if (!expDet || (expDet && expDet.type !== 3)) {
              continue;
            }
            if (zarget.isExperimentURLMatches(expDet)) {
              return expDet;
            }
          }
          for (var e in ZargetData.experiments) {
            if (
              ZargetData.experiments[e].type === 3 &&
              zarget.isExperimentURLMatches(ZargetData.experiments[e]) &&
              canRunScheduled(ZargetData.experiments[e])
            ) {
              return ZargetData.experiments[e];
            }
          }
        };
        zarget.importScript = function (url, id, success, failure) {
          var scriptTag = document.createElement("script"),
            head = document.head;
          scriptTag.type = "text/javascript";
          scriptTag.setAttribute("id", id);
          scriptTag.setAttribute("src", url);
          if (failure && typeof failure === "function") {
            scriptTag.onerror = failure;
          }
          if (success && typeof success === "function") {
            scriptTag.onload = success;
          }
          head.appendChild(scriptTag);
        };
        zarget.importStyle = function (url, id, success, failure) {
          var linkTag = document.createElement("link"),
            head = document.head;
          linkTag.type = "text/css";
          linkTag.setAttribute("rel", "stylesheet");
          linkTag.setAttribute("id", id);
          linkTag.setAttribute("href", url);
          if (failure && typeof failure === "function") {
            linkTag.onerror = failure;
          }
          if (success && typeof success === "function") {
            linkTag.onload = success;
          }
          head.appendChild(linkTag);
        };
        zarget.getPageLoadTime = function () {
          if (window.performance && window.performance.timing) {
            return (
              window.performance.timing.domContentLoadedEventEnd -
              window.performance.timing.navigationStart
            );
          } else {
            return window.zargetLoadEnded - window.zargetLoadStart;
          }
        };
        zarget.getUserLanguage = function () {
          return navigator.language || navigator.userLanguage;
        };
        zarget.getScreenResolution = function () {
          return screen.width + "x" + screen.height;
        };
        zarget.hasLocalStorage = function () {
          return !!window.localStorage;
        };
        zarget.getCurrentPath = function () {
          return window.location.pathname;
        };
        zarget.getObjectLength = function (obj) {
          var count = 0;
          for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
              ++count;
            }
          }
          return count;
        };
        zarget.mergeTwoObject = function (obj1, obj2) {
          if (Object.assign) {
            return Object.assign(obj1, obj2);
          }
          for (var attrname in obj2) {
            obj1[attrname] = obj2[attrname];
          }
          return obj1;
        };
        zarget.findPoll = function (deviceTarget) {
          if (!ZargetData || !ZargetData.polls) {
            return;
          }
          var pollsInfo = Zarget.getPollsInfo();
          for (var poll in pollsInfo) {
            if (!ZargetData.polls.hasOwnProperty(poll)) {
              continue;
            }
            ZargetData.polls[poll].type = 6;
            if (zarget.isExperimentURLMatches(ZargetData.polls[poll])) {
              return ZargetData.polls[poll];
            }
          }
          for (var p in ZargetData.polls) {
            ZargetData.polls[p].type = 6;
            if (
              zarget.isExperimentURLMatches(ZargetData.polls[p]) &&
              deviceTarget(ZargetData.polls[p].deviceTarget)
            ) {
              return ZargetData.polls[p];
            }
          }
        };
        zarget.getIntegrations = function () {
          if (!ZargetData || !ZargetData.integrations) {
            return {};
          }
          return ZargetData.integrations;
        };
        zarget.isExperimentURLMatches = function (e) {
          if (!e) {
            return;
          }
          function lc(a) {
            return (a || "").toLowerCase();
          }
          function simple(u, isSplit) {
            var cururl = zarget.parseURL(lc(document.URL));
            var expurl = zarget.parseURL(lc(u));
            if (isSplit) {
              return (
                simpleMatchHost(cururl.authority, expurl.authority) &&
                trimURL(cururl.path) === trimURL(expurl.path) &&
                cururl.fragement === expurl.fragement
              );
            } else {
              return (
                simpleMatchHost(cururl.authority, expurl.authority) &&
                trimURL(cururl.path) === trimURL(expurl.path)
              );
            }
          }
          function regex(u) {
            var rgx = new RegExp(u);
            return rgx.test(document.URL);
          }
          function trimWwwAndTrailingSlash(u) {
            if (u) {
              u =
                u.lastIndexOf("/") === u.length - 1
                  ? u.substring(0, u.length - 1)
                  : u;
              u = u.replace(/^https?\:\/\//, "").replace(/^www./, "");
            }
            return u;
          }
          function equal(u) {
            if (
              trimWwwAndTrailingSlash(lc(document.URL)) ===
              trimWwwAndTrailingSlash(lc(u))
            ) {
              return true;
            }
          }
          function substr(u) {
            var domain = u.domain;
            var cururl = zarget.parseURL(document.URL);
            if (domain.type === "contains") {
              if (
                cururl.authority &&
                lc(cururl.authority).indexOf(lc(domain.domain)) > -1
              ) {
                if (
                  lc(
                    cururl.path + window.location.search + window.location.hash
                  ).indexOf(lc(u.url)) > -1
                ) {
                  return true;
                }
              }
            } else {
              if (domain.type === "is") {
                var incParse = zarget.parseURL(
                  zarget.matcher(domain.domain, "http", 8)
                    ? domain.domain
                    : cururl.scheme + "://" + domain.domain
                );
                if (
                  lc(cururl.scheme) === lc(incParse.scheme) &&
                  trimWwwAndTrailingSlash(lc(cururl.authority)) ===
                    trimWwwAndTrailingSlash(lc(incParse.authority))
                ) {
                  if (
                    lc(
                      cururl.path +
                        window.location.search +
                        window.location.hash
                    ).indexOf(lc(u.url)) > -1
                  ) {
                    return true;
                  }
                }
              }
            }
          }
          var EXPERIMENT = {
              AB: 1,
              MULTIVARIANT: 2,
              HEATMAP: 3,
              SPLIT: 4,
              POLLS: 6,
              FORMS: 7,
              SESSIONREPLAY: 8,
            },
            urls = e.urls,
            excludes = e.excludeUrls,
            i,
            j,
            l,
            jl,
            url,
            u,
            v,
            variations = e.variations;
          if (!urls) {
            return;
          }
          var exp = false;
          if (e.type == EXPERIMENT.SPLIT) {
            for (i = 1, l = variations.length; i < l; i++) {
              v = variations[i];
              if (e.regex && isSplitURLMatches(v.url)) {
                exp = e;
                break;
              } else {
                if (!e.regex && simple(v.url, true)) {
                  exp = e;
                  break;
                }
              }
              if (matchVariationURL(e, null, true)) {
                exp = e;
                break;
              }
            }
          }
          if (exp) {
            if (e.type === EXPERIMENT.SPLIT) {
              for (j = 0, jl = excludes.length; j < jl; j++) {
                u = excludes[j];
                if (simple(u.url)) {
                  exp = false;
                  break;
                }
              }
            }
            return exp;
          }
          for (i = 0, l = urls.length; i < l; i++) {
            u = urls[i];
            if (e.type == EXPERIMENT.SPLIT && e.regex) {
              if (isSplitURLMatches(u.url)) {
                exp = e;
                break;
              }
            } else {
              if (u.match === "simple" && simple(u.url)) {
                exp = e;
                break;
              } else {
                if (u.match === "regex" && regex(u.url)) {
                  exp = e;
                  break;
                } else {
                  if (u.match === "exact" && equal(u.url)) {
                    exp = e;
                    break;
                  } else {
                    if (u.match === "substr" && substr(u)) {
                      exp = e;
                      break;
                    }
                  }
                }
              }
            }
          }
          if (
            e.type === EXPERIMENT.AB ||
            e.type === EXPERIMENT.HEATMAP ||
            e.type === EXPERIMENT.POLLS ||
            e.type === EXPERIMENT.SESSIONREPLAY ||
            e.type === EXPERIMENT.FORMS
          ) {
            for (j = 0, jl = excludes.length; j < jl; j++) {
              u = excludes[j];
              if (u.match === "simple" && simple(u.url)) {
                exp = false;
                break;
              } else {
                if (u.match === "regex" && regex(u.url)) {
                  exp = false;
                  break;
                } else {
                  if (u.match === "exact" && equal(u.url)) {
                    exp = false;
                    break;
                  } else {
                    if (u.match === "substr" && substr(u)) {
                      exp = false;
                      break;
                    }
                  }
                }
              }
            }
          }
          return exp;
        };
        function simpleMatchHost(host, host1) {
          host = host.toLowerCase();
          host1 = host1.toLowerCase();
          if (host === host1) {
            return true;
          }
          if (host.replace(/^www./, "") === host1.replace(/^www./, "")) {
            return true;
          }
        }
        function isSplitURLMatches(url) {
          var cururl,
            expurl,
            locHref,
            orig,
            groupPatt,
            match1,
            orig1,
            d,
            lastInd,
            firstSub,
            matchReg,
            strEx,
            match,
            grpMatch,
            matcher;
          cururl = zarget.parseURL(document.URL);
          if (!url) {
            return false;
          }
          function lc(a) {
            return (a || "").toLowerCase();
          }
          expurl = zarget.parseURL(url);
          locHref = cururl.authority.replace(/(^www.)/, "") + cururl.path;
          orig = expurl.authority.replace(/^www./, "") + expurl.path;
          orig = orig.replace(/([\[\]\*\^\$\.\?/\\])/g, "\\$1");
          groupPatt = /(\\\(([^\)\/]*)\))/g;
          match1 = orig.match(groupPatt);
          orig1 = "";
          if (orig.match(groupPatt) !== null) {
            d = 0;
            lastInd = 0;
            while ((grpMatch = groupPatt.exec(orig)) !== null) {
              firstSub = orig
                .substring(lastInd, grpMatch.index)
                .replace(/\\\*+/g, "(.*)");
              matchReg =
                "(" + grpMatch[2].substring(0, grpMatch[2].length - 1) + ")";
              matchReg = matchReg.replace(/\\\|/g, "|");
              orig1 += firstSub + matchReg;
              lastInd = grpMatch.index + grpMatch[0].length;
              d++;
            }
            orig1 += orig.substring(lastInd, orig.length);
            orig = orig1;
          } else {
            orig = orig.replace(/\\\*+/g, "(.*)");
          }
          strEx = new RegExp(orig);
          match = locHref.match(strEx);
          if (match !== null && match[0].length === locHref.length) {
            return true;
          }
          return false;
        }
        zarget.Message.prototype = {
          addParam: function (name, value) {
            this.params[name] = value;
          },
          setParam: function (params) {
            this.params = params;
          },
          getParam: function (name) {
            return this.params[name];
          },
          getParams: function () {
            return this.params;
          },
          serializeWebsocket: function () {
            return JSON.stringify({
              url: this.url,
              type: this.type,
              msg: this.params,
              ua: navigator.userAgent,
              referrer: document.referrer,
            });
          },
          serializeForm: function () {
            var sb = "";
            for (var p in this.params) {
              sb += p + "=" + encodeURIComponent(this.params[p]) + "&";
            }
            if (sb.lastIndexOf("&") == sb.length - 1) {
              sb = sb.substring(0, sb.length - 1);
            }
            return sb;
          },
        };
        zarget.isVisitorLocationInLocalStorage = function () {
          if (typeof localStorage !== "undefined") {
            return window.localStorage.zarget_visitor_location ? true : false;
          }
          return false;
        };
        zarget.getHashCode = function (str) {
          str = str.toString();
          var hash = 0,
            i,
            chr,
            len;
          if (str.length === 0) {
            return hash;
          }
          for (i = 0, len = str.length; i < len; i++) {
            chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0;
          }
          return hash;
        };
        zarget.getVisitorLocation = function () {
          if (
            typeof localStorage !== "undefined" &&
            window.localStorage.zarget_visitor_location
          ) {
            return zarget.parseJSON(
              window.localStorage.zarget_visitor_location
            );
          }
          if (
            typeof localStorage !== "undefined" &&
            window.localStorage.freshmarketer_visitor_location
          ) {
            return zarget.parseJSON(
              window.localStorage.freshmarketer_visitor_location
            );
          }
          return window.zarget_geoDetails;
        };
        zarget.MessageType = {
          ADDVISITOR: 0,
          UPDATEVISITOR: 1,
          ADDGOAL: 2,
          ADDSELECTOR: 3,
          ADDPOLL: 4,
          CHECKSESSION: 5,
          PINGBACK: 10,
          SESSION_DATA_SEND: 11,
          GET_SESSIONURL: 12,
          EVENT_DATA_SEND: 15,
          CRO_DATA_SEND: 13,
          FCHAT_WIDGET_URL: 16,
          CHAT_HISTORY_STATUS: 17,
          PENDING_CHAT_TRIGGER: 18,
        };
        zarget.ExperimentType = {
          AB: 1,
          HEATMAP: 3,
          SPLIT: 4,
          FUNNEL: 5,
          POLL: 6,
          FORM: 7,
          SR: 8,
          PERSONALIZATION: 9,
        };
        var HttpTransport = function () {
          this.retries = 0;
          this.timeOut = 5000;
          this.events = [];
          this.intervalId = -1;
          this.reqInProcess = false;
          this.start();
        };
        HttpTransport.prototype.start = function () {
          var _this = this;
          this.intervalId = window.setInterval(function () {
            if (_this.events.length > 0 && !_this.reqInProcess) {
              var data = _this.processEvents();
              _this.dispatchData(data);
            }
          }, this.timeOut);
          window.beforeunload = function () {};
        };
        HttpTransport.prototype.processEvents = function () {
          var time = +new Date();
          var today = new Date();
          var timeZone = today.getTime() + today.getTimezoneOffset() * 60000;
          var url = encodeURIComponent(document.URL);
          var lang = Zarget.getUserLanguage(),
            loadTime = Zarget.getPageLoadTime(),
            res = Zarget.getScreenResolution(),
            referrer = document.referrer;
          var projProps = zarget.getProjectProps();
          var eventsToSend;
          if (this.events.length > 50) {
            eventsToSend = this.events.slice(0, 50);
          } else {
            eventsToSend = this.events.slice(0);
          }
          var data = {
            url: url,
            res: res,
            segref: referrer,
            data: eventsToSend,
            dispatched_time: time,
          };
          if (projProps && projProps.anonymize_ip === 1) {
            data.ip = "no";
          }
          return data;
        };
        HttpTransport.prototype.dispatchData = function (data) {
          if (!navigator.onLine) {
            return;
          }
          var _this = this;
          var url = zarget.Messenger._getApiURL(
            Zarget.MessageType.CRO_DATA_SEND
          );
          try {
            var xhr = zarget.Messenger.createCORS(url, "POST");
            xhr.onload = function (e) {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  _this.events.splice(0, data.data.length);
                  _this.timeOut = 5000;
                  _this.retries = 0;
                } else {
                  _this.retries++;
                  if (_this.retries > 20) {
                    _this.timeOut *= 2;
                  }
                }
                _this.reqInProcess = false;
              }
            };
            if (xhr) {
              xhr.withCredentials = true;
              this.reqInProcess = true;
              xhr.send(JSON.stringify(data));
              return;
            }
          } catch (e) {}
        };
        HttpTransport.prototype.stop = function () {
          window.clearInterval(this.intervalId);
        };
        HttpTransport.prototype.send = function (e) {
          if (!e) {
            return;
          }
          try {
            this.events.push(e.params);
          } catch (e) {
            console.log(e);
          }
        };
        HttpTransport.prototype.sendBeacon = function () {};
        HttpTransport.prototype.sendImmediate = function (e) {
          if (!e) {
            return;
          }
          try {
            this.events.push(e.params);
          } catch (e) {
            console.log(e);
          }
          this.reqInProcess = true;
          let data = this.processEvents();
          this.dispatchData(data);
        };
        var transport = (function () {
          return new HttpTransport();
        })();
        zarget.xhrService = transport;
        zarget.Messenger = {
          _getApiURL: function (type) {
            var serverurl = zarget.serverinfo.serverurl,
              apiurl;
            switch (type) {
              case zarget.MessageType.ADDVISITOR:
                apiurl = zarget.serverinfo.visitorUrl;
                break;
              case zarget.MessageType.UPDATEVISITOR:
                apiurl = zarget.serverinfo.returningVisitorUrl;
                break;
              case zarget.MessageType.ADDGOAL:
                apiurl = zarget.serverinfo.goalUrl;
                break;
              case zarget.MessageType.ADDSELECTOR:
                apiurl = zarget.serverinfo.heatmapUrl;
                break;
              case zarget.MessageType.ADDPOLL:
                apiurl = zarget.serverinfo.pollUrl;
                break;
              case zarget.MessageType.CHECKSESSION:
                apiurl = zarget.serverinfo.sessionCheckUrl;
                break;
              case zarget.MessageType.PINGBACK:
                apiurl = zarget.serverinfo.pingBackUrl;
                break;
              case zarget.MessageType.GET_SESSIONURL:
                apiurl = zarget.serverinfo.sessionDecodeUrl;
                break;
              case zarget.MessageType.SESSION_DATA_SEND:
                apiurl = zarget.serverinfo.sessionDataSendUrl;
                return apiurl;
              case zarget.MessageType.CRO_DATA_SEND:
                apiurl = zarget.serverinfo.croDataSendUrl;
                return apiurl;
                break;
              case zarget.MessageType.EVENT_DATA_SEND:
                apiurl = zarget.serverinfo.eventDataSendUrl;
                return apiurl;
              case zarget.MessageType.FCHAT_WIDGET_URL:
                apiurl = zarget.serverinfo.chatWidgetUrl;
                return apiurl;
              case zarget.MessageType.CHAT_HISTORY_STATUS:
                apiurl =
                  zarget.serverinfo.secureServerURL +
                  zarget.serverinfo.chatHistoryUpdateStatusUrl;
                return apiurl;
              case zarget.MessageType.PENDING_CHAT_TRIGGER:
                apiurl =
                  zarget.serverinfo.secureServerURL +
                  zarget.serverinfo.chatHistoryUpdateStatusUrl +
                  "/trigger";
                return apiurl;
            }
            return serverurl + apiurl;
          },
          createCORS: function (url, requestMethod) {
            requestMethod = requestMethod || "GET";
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
              xhr.open(requestMethod, url, true);
            } else {
              if (typeof XDomainRequest != "undefined") {
                xhr = new XDomainRequest();
                xhr.open(requestMethod, url);
              } else {
                xhr = null;
              }
            }
            return xhr;
          },
          send: function (message) {
            if (!message || !message instanceof zarget.Message) {
              return;
            }
            var url = zarget.Messenger._getApiURL(message.type);
            var params = message.serializeForm();
            if (params && params.length) {
              url = url + "?" + params;
              var projProps = zarget.getProjectProps();
              if (projProps && projProps.anonymize_ip === 1) {
                url += "&ip=no";
              }
            }
            try {
              var xhr = zarget.Messenger.createCORS(url);
              if (xhr) {
                xhr.withCredentials = true;
                xhr.send();
                return;
              }
            } catch (e) {}
            var img = new Image();
            img.src = url;
          },
        };
        zarget.isSecureField = function (node) {
          if (!node) {
            return;
          }
          var name = node.getAttribute("name") || node.getAttribute("id");
          var autocomplete = node.getAttribute("autocomplete");
          var form = window.zarget$(node).parents("form"),
            labels,
            fieldlabel,
            c;
          if (form && form.length > 0) {
            var selector = Zarget.selector(form.get(0));
            if (!_cachedformlabels[selector]) {
              labels = zarget.getLabelMappings(selector);
              _cachedformlabels[selector] = labels;
            }
            labels = _cachedformlabels[selector];
          }
          for (var f in SECUREFIELDS) {
            fieldlabel = labels
              ? labels[name]
                ? labels[name].text
                : void 0
              : void 0;
            c = SECUREFIELDS[f];
            if (
              (c.rgx.test(name) || (c.label && c.label.test(fieldlabel))) &&
              !c.negative.test(name)
            ) {
              return true;
            }
          }
          return false;
        };
        zarget.getLabelMappings = function (e) {
          var n,
            i = {},
            t = window.zarget$;
          return (
            t(e)
              .find("label")
              .each(function (e, a) {
                if ((n = a.getAttribute("for"))) {
                  i[n] ||
                    (i[n] = {
                      element: a,
                      text: t(a).text() || a.name || a.id,
                    });
                } else {
                  var r = a.nextSibling;
                  for (
                    r || (r = a.parentNode.nextSibling);
                    r && 1 != r.nodeType;

                  ) {
                    r = r.nextSibling;
                  }
                  if (r && !r.form && r.firstChild) {
                    for (r = r.firstChild; r && 1 != r.nodeType; ) {
                      r = r.nextSibling;
                    }
                  }
                  r &&
                    r.form &&
                    (r.id || r.name) &&
                    (i[r.id || r.name] = {
                      element: a,
                      text: t(a).text() || a.name || a.id,
                    });
                }
              }),
            i
          );
        };
        window.zg_is_new_visitor = zarget.isNewVisitor();
        zarget.processOptOut();
        window.zargetCookie = window.zarget || {};
        window.zargetCookie.getCookies = zarget.getCookies;
        window.zargetCookie.setCookie = zarget.setCookie;
        window.zargetCookie.generateUserID = zarget.generateUserID;
        window.zargetCookie.removeCookie = zarget.removeCookie;
        window.zg_selector = zarget.selector;
        window.integrations = zarget.getIntegrations;
        window.zg_projectProps = zarget.getProjectProps;
        return zarget;
      })();
      (function (Zarget) {
        if (Zarget.isOptedOut()) {
          return;
        }
        var searchEngines,
          socialnetworks,
          browsers,
          devices,
          headers = { "X-Osm-CSRF": "9390uasldkhf8" },
          mobiledevices,
          CONDITIONTYPE = { AND: 0, OR: 1 };
        searchEngines = [
          { d: "search.daum.net", u: "/search", q: "q", s: "Daum" },
          { d: "search.naver.com", u: "/search.naver", q: "query", s: "Naver" },
          { d: "www.google.", q: "q", s: "Google" },
          { d: "r.search.yahoo.com", q: "p", s: "Yahoo" },
          { d: "www.bing.com", u: "/search", q: "q", s: "Bing" },
          { d: "search.aol.com", u: "/aol/search", q: "q", s: "AOL" },
          { d: "www.aolsearch.com", u: "/search", q: "query", s: "AOL" },
          { d: "search.lycos.com", u: "/web/", q: "q", s: "Lycos" },
          { d: "www.ask.com", u: "/web", q: "q", s: "Ask" },
          { d: "search.about.com", q: "q", s: "About" },
          { d: "websearch.about.com", q: "q", s: "About" },
          { d: "ricerca.virgilio.it", u: "/ricerca", q: "qs", s: "Virgilio" },
          { d: "www.baidu.com", q: "wd", s: "Baidu" },
          { d: "www.yandex.", u: "/clck/jsredir", s: "Yandex" },
          { d: "yandex.", u: "/clck/jsredir", s: "Yandex" },
          { d: "search.seznam.cz", q: "q", s: "Seznam" },
          {
            d: "szukaj.wp.pl",
            u: "/szukaj.html",
            q: "q",
            s: "Wirtulana Polska",
          },
          {
            d: "search.yam.com",
            u: "/Search/Web/GSearch.aspx",
            q: "q",
            s: "Yam",
          },
          { d: "www.kvasir.no", q: "q", s: "Kvasir" },
          { d: "arama.mynet.com", q: "q", s: "Mynet" },
          { d: "nova.rambler.ru", u: "/search", q: "query", s: "Rambler" },
        ];
        browsers = [
          { c: "UCBrowser/", b: "ucbrowser" },
          { c: "Edge", b: "edge" },
          { c: " OPR/", or: window.opera, b: "opera" },
          { c: "Chrome", b: "chrome" },
          { c: "Netscape", b: "netscape" },
          { c: "Firefox", b: "firefox" },
          { c: "Apple", b: "safari" },
          { c: "MSIE", b: "ie" },
          { c: "Konqueror", b: "konqueror" },
        ];
        devices = [
          { c: "ipod", d: "ios" },
          {
            c: "ipad",
            d: "ios",
            and: navigator.userAgent.toLowerCase().indexOf("webkit") !== -1,
          },
          { c: "iphone", d: "ios" },
          { c: "windows phone", d: "winphone" },
          { c: "SymbianOS", d: "symbian" },
          { c: "googletv", d: "googletv" },
          {
            c: "bb10",
            d: "blackberry",
            or: navigator.userAgent.toLowerCase().indexOf("playbook") !== -1,
          },
          { c: "android", d: "android" },
        ];
        mobiledevices = [
          { r: /Android/i, d: "Android" },
          { r: /blackberry/i, d: "blackberry" },
          { r: /iPhone|iPod/i, d: "iOS" },
          { r: /Opera Mini|Opera Mobi/i, d: "Opera" },
          { r: /IEMobile/i, d: "winphone" },
        ];
        socialnetworks = [
          { d: "www.facebook.com", s: "Facebook" },
          { d: "www.messenger.com", s: "FBMessenger" },
          { d: "plus.google.com", s: "Google Plus" },
          { d: "plus.url.google.com", s: "Google Plus" },
          { d: "t.co", s: "Twitter" },
          { d: "twitter.com", s: "Twitter" },
          { d: "instagram.com", s: "Instagram" },
          { d: "www.linkedin.com", s: "LinkedIn" },
          { d: "www.pinterest.com", s: "Pinterest" },
          { d: "vk.com", s: "VK" },
        ];
        function UserAgent(useragent, appversion, platform) {
          var n = window.navigator;
          this.useragent = useragent || n.userAgent;
          this.appversion = appversion || n.appVersion;
          this.platform = platform || n.platform;
        }
        UserAgent.prototype = {
          matches: function (ua, d) {
            var c = d.c;
            if (d.hasOwnProperty("and")) {
              if (d.and && ua.indexOf(c) !== -1) {
                return true;
              }
            } else {
              if (ua.indexOf(c) !== -1 || d.or) {
                return true;
              }
            }
          },
          getDevice: function () {
            var ua = this.useragent.toLowerCase(),
              i,
              l;
            for (i = 0, l = devices.length; i < l; i++) {
              if (this.matches(ua, devices[i])) {
                return devices[i].d;
              }
            }
          },
          getBrowser: function () {
            var ua = this.useragent,
              i,
              l;
            for (i = 0, l = browsers.length; i < l; i++) {
              if (this.matches(ua, browsers[i])) {
                return browsers[i].b;
              }
            }
          },
          getOs: function () {
            var appversion = this.appversion;
            if (appversion.indexOf("Win") !== -1) {
              return "windows";
            }
            if (appversion.indexOf("Mac") !== -1) {
              return "mac";
            }
            if (appversion.indexOf("Linux") !== -1) {
              return "linux";
            }
            if (appversion.indexOf("X11") !== -1) {
              return "unix";
            }
          },
          getDevicetype: function () {
            if (
              this.useragent.match(
                /(iPhone|BB10|windows phone|Android|BlackBerry|IEMobile|Nokia|SymbianOS|SonyEricsson|Opera Mobi|Opera Mini|Minimo|Maemo)/
              )
            ) {
              return "mobile";
            }
            if (this.useragent.match(/(iPad|PlayBook|Touch|Android|kindle)/)) {
              return "tablet";
            }
            if (
              !this.useragent.match(
                /(iPhone|iPod|iPad|BB10|windows phone|Android|BlackBerry|PlayBook|IEMobile|SymbianOS|SonyEricsson|Opera Mobi|Opera Mini|Kindle|Minimo|Maemo)/
              )
            ) {
            }
            return "desktop";
          },
          isMobile: function () {
            var d, i, l;
            for (i = 0, l = mobiledevices.length; i < l; i++) {
              d = mobiledevices[i];
              if (d.r.test(this.useragent)) {
                return true;
              }
            }
            return false;
          },
          isNotMobileTab: function () {
            return !navigator.userAgent.match(
              /(iPhone|iPod|iPad|BB10|windows phone|Android|BlackBerry|PlayBook|IEMobile|SymbianOS|SonyEricsson|Opera Mobi|Opera Mini|Kindle|Minimo|Maemo)/
            );
          },
          getUserAgentString: function () {
            return this.useragent;
          },
          getPlatform: function () {
            return this.platform;
          },
          getAppVersion: function () {
            return this.appversion;
          },
        };
        function getSocialNetwork(r) {
          var referrer, url, domain, i, l, sn;
          referrer = r || document.referrer;
          url = Zarget.parseURL(referrer);
          domain = url && url.authority;
          if (!referrer || !domain) {
            return;
          }
          for (i = 0, l = socialnetworks.length; i < l; i++) {
            sn = socialnetworks[i];
            if (domain.toLowerCase() === sn.d.toLowerCase()) {
              return sn.s;
            }
          }
        }
        function getSearchEngine(r) {
          var referrer, domain, url, i, l, se, idx, path, spath, pidx;
          referrer = r || document.referrer;
          if (!referrer) {
            return;
          }
          url = Zarget.parseURL(referrer);
          domain = url.authority;
          for (i = 0, l = searchEngines.length; i < l; i++) {
            se = searchEngines[i];
            idx = domain.indexOf(se.d);
            path = url.path || "";
            spath = se.u || "";
            pidx = path.indexOf(spath);
            if (idx === 0 && pidx === 0) {
              return se.s;
            }
          }
        }
        function getDayOfWeek() {
          return new Date().getDay();
        }
        function getHourOfTheDay() {
          return new Date().getHours();
        }
        function getJavascriptVariable(v) {
          try {
            return window[v] || new Function(v);
          } catch (ignore) {}
        }
        function getURL(url) {
          return url || document.URL;
        }
        function getReferrer() {
          return document.referrer;
        }
        function getQueryParameter() {
          var result = Zarget.parseURL(document.URL);
          if (result) {
            return result.query || {};
          }
        }
        function Targeting(rules, personalization) {
          this.rules = rules;
          this.personalization = personalization;
        }
        function getCountry() {
          var location = Zarget.getVisitorLocation();
          return location ? location.country_code : null;
        }
        function getIPv4() {
          var location = Zarget.getVisitorLocation();
          return location ? location.ip : null;
        }
        function getIPv6() {
          var location = Zarget.getVisitorLocation();
          return location ? location.ip6 : null;
        }
        function getLocale() {
          return Zarget.getUserLanguage();
        }
        function getCustomJSOut(expr) {
          if (expr !== null && expr.length > 0) {
            return new Function("return (" + expr + ")");
          }
        }
        Targeting.prototype = {
          matches: function (str, set, type) {
            var r, i, l, arr;
            arr = [];
            for (i = 0, l = set.length; i < l; i++) {
              if (type === 5) {
                r = Zarget.matcher(new RegExp(set[i]), str, type);
              } else {
                r = Zarget.matcher(str, set[i], type);
              }
              if (type !== 2 && r) {
                return true;
              } else {
                arr.push(r.toString());
              }
            }
            if (type === 2 && arr.indexOf("false") < 0) {
              return true;
            }
            return false;
          },
          matcher: function (str, val, type) {
            try {
              if (type === 5) {
                return Zarget.matcher(new RegExp(val), str, type);
              }
              return Zarget.matcher(str, val, type);
            } catch (err) {
              return false;
            }
          },
          pageTrackMatcher: function (condition, condValue, pageValue) {
            switch (condition) {
              case 1:
                return condValue === pageValue;
                break;
              case 2:
                return condValue !== pageValue;
                break;
              case 12:
                return pageValue < condValue;
                break;
              case 13:
                return pageValue > condValue;
                break;
            }
          },
          range: function (type, condition, from, to, ip) {
            try {
              if (type === "ipv4") {
                from = from.split(".");
                from =
                  parseInt(from[3], 10) +
                  from[2] * 256 +
                  from[1] * Math.pow(256, 2) +
                  from[0] * Math.pow(256, 3);
                to = to.split(".");
                to =
                  parseInt(to[3], 10) +
                  to[2] * 256 +
                  to[1] * Math.pow(256, 2) +
                  to[0] * Math.pow(256, 3);
                ip = ip.split(".");
                ip =
                  parseInt(ip[3], 10) +
                  ip[2] * 256 +
                  ip[1] * Math.pow(256, 2) +
                  ip[0] * Math.pow(256, 3);
              } else {
                if (type === "ipv6") {
                  from = splitAndFillIP(from);
                  from = hex2long(from.replace(/:/g, ""));
                  to = splitAndFillIP(to);
                  to = hex2long(to.replace(/:/g, ""));
                  ip = splitAndFillIP(ip);
                  ip = hex2long(to.replace(/:/g, ""));
                }
              }
              if (condition === 10) {
                return from <= ip && ip <= to;
              } else {
                if (condition === 11) {
                  return from > ip || ip > to;
                }
              }
            } catch (e) {
              return false;
            }
          },
          useragent: function (c) {
            if (!c) {
              return false;
            }
            try {
              return this.matcher(navigator.userAgent, c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          referrer: function (c) {
            if (!c) {
              return false;
            }
            try {
              return this.matcher(getReferrer(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          url: function (c) {
            if (!c) {
              return false;
            }
            try {
              return this.matcher(getURL(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          cookieval: function (c) {
            if (!c) {
              return false;
            }
            try {
              var cookie = c.value,
                cookies = Zarget.getCookies();
              return Zarget.matcher(cookies[cookie.n], cookie.v, c.condition);
            } catch (e) {
              return false;
            }
          },
          browser: function (c) {
            if (!c) {
              return false;
            }
            try {
              var u = new UserAgent();
              return this.matches(u.getBrowser(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          visitor: function (c) {
            if (!c) {
              return false;
            }
            try {
              var usertype = !window.zg_is_new_visitor;
              return Zarget.matcher(usertype ? "1" : "0", c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          traffictype: function (c) {
            var TRAFFIC = {
                DIRECT: "direct",
                REFERRAL: "referral",
                SEARCH: "search",
                SOCIAL: "social",
                MOBILE: "mobile",
                MOBILEANDTABLET: "mobiletablet",
                NEWVISITOR: "newvisitor",
                RETURNINGVISITOR: "returningvisitor",
                DESKTOP: "desktop",
              },
              referrer,
              url,
              traffictype,
              ua,
              cookie;
            if (!c) {
              return false;
            }
            try {
              if (!c.traffictype) {
                return false;
              }
              referrer = Zarget.getReferrer() || "";
              url = document.URL;
              traffictype = c.traffictype;
              cookie = document.cookie || "";
              if (traffictype === TRAFFIC.DIRECT) {
                return (
                  referrer.length === 0 ||
                  url === referrer ||
                  Zarget.parseURL(url).authority ===
                    Zarget.parseURL(referrer).authority
                );
              }
              if (traffictype === TRAFFIC.REFERRAL) {
                return (
                  referrer.length > 0 &&
                  Zarget.parseURL(url).authority !==
                    Zarget.parseURL(referrer).authority
                );
              }
              if (traffictype === TRAFFIC.SOCIAL) {
                return getSocialNetwork(referrer) ? true : false;
              }
              if (traffictype === TRAFFIC.SEARCH) {
                return getSearchEngine(referrer) ? true : false;
              }
              if (traffictype === TRAFFIC.MOBILE) {
                return new UserAgent().isMobile() ? true : false;
              }
              if (traffictype === TRAFFIC.MOBILEANDTABLET) {
                ua = new UserAgent();
                return ua.isMobile() || ua.getDevicetype() === "tablet";
              }
              if (traffictype === TRAFFIC.NEWVISITOR) {
                return window.zg_is_new_visitor;
              }
              if (traffictype === TRAFFIC.RETURNINGVISITOR) {
                return !window.zg_is_new_visitor;
              }
              if (traffictype === TRAFFIC.DESKTOP) {
                ua = new UserAgent();
                return new UserAgent().isNotMobileTab();
              }
            } catch (err) {
              return false;
            }
          },
          queryparam: function (c) {
            if (!c) {
              return false;
            }
            try {
              var param = c.value,
                qp = getQueryParameter();
              return Zarget.matcher(qp[param.n], param.v, c.condition);
            } catch (e) {
              return false;
            }
          },
          prevVisit: function (c) {
            if (!c) {
              return false;
            }
            try {
              var url = c.value;
              if (url) {
                try {
                  var newUrl = new URL(url);
                  if (newUrl) {
                    url = newUrl.hostname + "" + newUrl.pathname;
                  }
                } catch (e) {}
              }
              var storage = Zarget.getStorage("pageViewCookie");
              if (storage) {
                var prevUrlObj = JSON.parse(decodeURIComponent(storage));
                var flag = false;
                for (var k in prevUrlObj) {
                  if (
                    c.condition === 2 ||
                    c.condition === 4 ||
                    c.condition === 7
                  ) {
                    if (c.condition === 7) {
                      var match = Zarget.matcher(k, url, c.condition);
                      if (match) {
                        flag = true;
                      } else {
                        flag = false;
                        return;
                      }
                    } else {
                      url = c.condition === 2 ? url : String(url).toLowerCase();
                      k = c.condition === 2 ? k : String(k).toLowerCase();
                      if (url === k) {
                        flag = false;
                        break;
                      } else {
                        flag = true;
                      }
                    }
                  } else {
                    var match = Zarget.matcher(k, url, c.condition);
                    if (match) {
                      flag = true;
                      break;
                    }
                  }
                }
                return flag;
              } else {
                return false;
              }
            } catch (e) {
              return false;
            }
          },
          os: function (c) {
            if (!c) {
              return false;
            }
            try {
              var u = new UserAgent();
              return this.matches(u.getOs(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          devicetype: function (c) {
            if (!c) {
              return false;
            }
            try {
              var u = new UserAgent();
              return this.matches(u.getDevicetype(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          mobiledevice: function (c) {
            if (!c) {
              return false;
            }
            try {
              var u = new UserAgent();
              return this.matches(u.getDevice(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          jsvar: function (c) {
            if (!c) {
              return false;
            }
            try {
              var jsvar = c.value;
              return Zarget.matcher(
                getJavascriptVariable(jsvar.n),
                jsvar.v,
                c.condition
              );
            } catch (e) {
              return false;
            }
          },
          dayofweek: function (c) {
            if (!c) {
              return false;
            }
            try {
              return this.matches(getDayOfWeek(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          houroftheday: function (c) {
            if (!c) {
              return false;
            }
            try {
              return this.matches(getHourOfTheDay(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          searchengine: function (c) {
            if (!c) {
              return false;
            }
            try {
              return this.matches(getSearchEngine(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          socialnetwork: function (c) {
            if (!c) {
              return false;
            }
            try {
              return this.matches(getSocialNetwork(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          country: function (c) {
            if (!c) {
              return false;
            }
            try {
              return this.matches(getCountry(), c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          locale: function (c) {
            if (!c) {
              return false;
            }
            try {
              var locale = getLocale();
              if (locale !== null && typeof locale !== undefined) {
                locale = locale.toLowerCase();
              }
              if (locale !== "") {
                if (locale === "az" || locale === "az-az") {
                  locale = "az-az";
                } else {
                  if (locale === "de" || locale === "de-de") {
                    locale = "de-de";
                  } else {
                    if (locale === "fr" || locale === "fr-fr") {
                      locale = "fr-fr";
                    } else {
                      if (locale === "it" || locale === "it-it") {
                        locale = "it-it";
                      } else {
                        if (locale === "no" || locale === "no-no") {
                          locale = "no-no";
                        } else {
                          if (locale === "pt" || locale === "pt-pt") {
                            locale = "pt-pt";
                          } else {
                            if (locale === "es" || locale === "es-es") {
                              locale = "es-es";
                            } else {
                              if (locale === "uz" || locale === "uz-uz") {
                                locale = "uz-uz";
                              } else {
                                if (locale === "pt" || locale === "pt-pt") {
                                  locale = "pt-pt";
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                return false;
              }
              return this.matches(locale, c.value, c.condition);
            } catch (e) {
              return false;
            }
          },
          customjs: function (c) {
            if (!c) {
              return false;
            }
            try {
              var custFn = getCustomJSOut(c.value);
              return custFn();
            } catch (e) {
              return false;
            }
          },
          location: function (c) {
            var curLocation,
              country,
              state,
              city,
              targetingLocations,
              i,
              l,
              loc,
              a,
              matches,
              pl;
            if (!c) {
              return false;
            }
            (curLocation = Zarget.getVisitorLocation()),
              (targetingLocations = c.value);
            if (
              !curLocation ||
              !targetingLocations ||
              !targetingLocations.length
            ) {
              return false;
            }
            for (i = 0, l = targetingLocations.length; i < l; i++) {
              (loc = targetingLocations[i]), (a = loc.text.split(", "));
              if (!a || !a.length) {
                continue;
              }
              pl = a.length;
              if (pl === 3) {
                matches =
                  this.matcher(curLocation.city, a[0], c.condition) &&
                  this.matcher(curLocation.region_name, a[1], c.condition) &&
                  this.matcher(curLocation.country_name, a[2], c.condition);
              } else {
                if (pl === 2) {
                  matches =
                    this.matcher(curLocation.region_name, a[0], c.condition) &&
                    this.matcher(curLocation.country_name, a[1], c.condition);
                } else {
                  if (pl === 1) {
                    matches = this.matcher(
                      curLocation.country_name,
                      a[0],
                      c.condition
                    );
                  }
                }
              }
              if (matches) {
                return true;
              }
            }
            return false;
          },
          ipv4: function (c) {
            if (!c) {
              return false;
            }
            try {
              if (c.condition === 1 || c.condition === 2 || c.condition === 5) {
                return this.matches(getIPv4(), c.value, c.condition);
              } else {
                if (c.condition === 10 || c.condition === 11) {
                  return this.range(
                    c.type,
                    c.condition,
                    c.value.f,
                    c.value.t,
                    getIPv4()
                  );
                }
              }
            } catch (e) {
              return false;
            }
          },
          ipv6: function (c) {
            if (!c) {
              return false;
            }
            try {
              if (c.condition === 1 || c.condition === 2) {
                return this.matches(getIPv6(), c.value, c.condition);
              } else {
                if (c.condition === 10 || c.condition === 11) {
                  return this.range(
                    c.type,
                    c.condition,
                    c.value.f,
                    c.value.t,
                    getIPv6()
                  );
                }
              }
            } catch (e) {
              return false;
            }
          },
          bulkaudience: function (c) {
            if (!c) {
              return false;
            }
            try {
              if (c.condition === 1) {
                return window.bulkDetails[c.value.v.ID] ? true : false;
              } else {
                if (c.condition === 2) {
                  return window.bulkDetails[c.value.v.ID] ? false : true;
                }
              }
            } catch (e) {
              return false;
            }
          },
          minPageView: function (c) {
            if (!c) {
              return false;
            }
            function lc(a) {
              return (a || "").toLowerCase();
            }
            try {
              var countLocalInfo = Zarget.extractStorageData("pageViewCookie");
              var pageCount = countLocalInfo.count;
              pageCount = pageCount - 1;
              var condValue = parseInt(c.value);
              return this.pageTrackMatcher(c.condition, condValue, pageCount);
            } catch (e) {
              Zarget.log("Got Error in min page view. Reason : ", e);
              return false;
            }
          },
          daySinceVisitCheck: function (c, typeOfVisit) {
            function lc(a) {
              return (a || "").toLowerCase();
            }
            try {
              if (ZargetData.isFirstVisit) {
                return false;
              }
              var countLocalInfo = Zarget.extractStorageData("pageViewCookie");
              var currurl = Zarget.parseURL(document.URL);
              var finalUrl = lc(currurl.authority) + lc(currurl.path);
              var url = encodeURI(finalUrl);
              var timestamp = 0;
              if (typeOfVisit == "DSFV") {
                timestamp = countLocalInfo[finalUrl].firstVisited;
              } else {
                if (typeOfVisit == "DSLV") {
                  timestamp = ZargetData.pageLastVisited || +new Date();
                }
              }
              var oneDay = 24 * 60 * 60 * 1000;
              var diffDays = Math.floor(
                Math.abs((new Date() - timestamp) / oneDay)
              );
              var condValue = parseInt(c.value);
              return this.pageTrackMatcher(c.condition, condValue, diffDays);
            } catch (e) {
              return false;
            }
          },
          dSFVisits: function (c) {
            if (!c) {
              return false;
            }
            try {
              return this.daySinceVisitCheck(c, "DSFV");
            } catch (e) {
              Zarget.log("Got Error Day since first visit. Reason : ", e);
              return false;
            }
          },
          dSLVisits: function (c) {
            if (!c) {
              return false;
            }
            try {
              return this.daySinceVisitCheck(c, "DSLV");
            } catch (e) {
              Zarget.log("Got Error Day since last visit. Reason : ", e);
              return false;
            }
          },
          minPageVisits: function (c) {
            if (!c) {
              return false;
            }
            function lc(a) {
              return (a || "").toLowerCase();
            }
            try {
              var countLocalInfo = Zarget.extractStorageData("pageViewCookie");
              var currurl = Zarget.parseURL(document.URL);
              var finalUrl = lc(currurl.authority) + lc(currurl.path);
              var url = encodeURI(finalUrl);
              var visitCount = countLocalInfo[finalUrl].visitedN;
              var condValue = parseInt(c.value);
              return this.pageTrackMatcher(c.condition, condValue, visitCount);
            } catch (e) {
              Zarget.log("Got Error in min page view. Reason : ", e);
              return false;
            }
          },
          CustomAttribute: function (c) {
            if (!c) {
              return false;
            }
            try {
              var customAttr = Zarget.getLocalCustomAttr("zg_cus_attr") || [];
              var l = customAttr.length;
              var targetSuccess = false;
              var attrObj = {};
              for (var key in customAttr) {
                if (customAttr.hasOwnProperty(key)) {
                  if (
                    key == c.type &&
                    c.value &&
                    c.value.indexOf(customAttr[key]) !== -1
                  ) {
                    targetSuccess = true;
                    break;
                  }
                }
              }
              return targetSuccess;
            } catch (e) {
              Zarget.log("Got Error in target CustomAttribute . Reason : ", e);
              return false;
            }
          },
          test: function () {
            var conditions, targetConditionType, i, l, matches, flag;
            try {
              if (!this.rules) {
                return true;
              }
              conditions = this.rules.conditions;
              if (
                !conditions ||
                !(conditions instanceof Array) ||
                conditions.length === 0
              ) {
                return true;
              }
              targetConditionType = this.rules.type;
              if (targetConditionType === CONDITIONTYPE.AND) {
                flag = true;
              } else {
                flag = false;
              }
              for (i = 0, l = conditions.length; i < l; i++) {
                matches = this.testConditionGroup(conditions[i]);
                if (this.personalization) {
                  if (targetConditionType === CONDITIONTYPE.AND && !matches) {
                    flag = false;
                  }
                  if (targetConditionType === CONDITIONTYPE.OR && matches) {
                    flag = true;
                  }
                  continue;
                }
                if (targetConditionType === CONDITIONTYPE.AND && !matches) {
                  return false;
                }
                if (targetConditionType === CONDITIONTYPE.OR && matches) {
                  return true;
                }
              }
            } catch (e) {
              Zarget.log("Targeting failed. Reason : ", e);
              return false;
            }
            if (this.personalization) {
              return flag;
            } else {
              return targetConditionType === CONDITIONTYPE.AND && matches
                ? true
                : false;
            }
          },
          testConditionGroup: function (conditiongroup) {
            if (!conditiongroup) {
              return true;
            }
            var conditions = conditiongroup.conditions,
              conditiontype = parseInt(conditiongroup.type, 10),
              i,
              l,
              condition,
              t,
              matches,
              flag;
            if (
              !conditions ||
              !(conditions instanceof Array) ||
              conditions.length === 0
            ) {
              return true;
            }
            if (conditiontype === CONDITIONTYPE.AND) {
              flag = true;
            } else {
              flag = false;
            }
            for (i = 0, l = conditions.length; i < l; i++) {
              condition = conditions[i];
              t = condition.type;
              var customAttrFn = condition.cusAttrType;
              if (
                (!this[t] || typeof this[t] !== "function") &&
                (!this[customAttrFn] ||
                  typeof this[customAttrFn] !== "function")
              ) {
                return false;
              }
              if (
                this[customAttrFn] &&
                typeof this[customAttrFn] === "function"
              ) {
                matches = this[customAttrFn](condition);
              } else {
                matches = this[t](condition);
              }
              condition.matches = matches;
              if (this.personalization) {
                if (conditiontype === CONDITIONTYPE.AND && !matches) {
                  flag = false;
                }
                if (conditiontype === CONDITIONTYPE.OR && matches) {
                  flag = true;
                }
                continue;
              }
              if (conditiontype === CONDITIONTYPE.AND && !matches) {
                return false;
              }
              if (conditiontype === CONDITIONTYPE.OR && matches) {
                return true;
              }
            }
            if (this.personalization) {
              return flag;
            } else {
              return conditiontype === CONDITIONTYPE.AND && matches
                ? true
                : false;
            }
          },
          splitAndFillIP: function (ip) {
            var result = "";
            if (ip.indexOf("::") != -1) {
              ip = ip.split("::");
              result += fillPrefix(ip[0].split(":"));
              if (ip[0] === "") {
                result += fillZeros(8 - ip[1].split(":").length + 1);
              } else {
                if (ip[1] === "") {
                  result += fillZeros(8 - ip[0].split(":").length + 1);
                } else {
                  result += fillZeros(
                    8 - (ip[0].split(":").length + ip[1].split(":").length) + 1
                  );
                }
              }
              result += fillPrefix(ip[1].split(":"));
            } else {
              result = fillPrefix(ip.split(":"));
            }
            return result;
          },
          fillPrefix: function (a) {
            var finalFromIPv6 = "";
            $.each(a, function (i, v) {
              if (v !== "" && v.trim().length > 0) {
                finalFromIPv6 +=
                  v.length === 1
                    ? "000" + v
                    : v.length === 2
                    ? "00" + v
                    : v.length === 3
                    ? "0" + v
                    : v;
              }
            });
            return finalFromIPv6;
          },
          fillZeros: function (n) {
            return new Array(n).join("0000:");
          },
          hex2long: function (n) {
            return parseInt(n, 16);
          },
        };
        Zarget.matchesTargeting = function (condition, personalization) {
          if (!condition) {
            return;
          }
          return new Targeting(condition, personalization).test();
        };
      })(Zarget);
      var ZargetData = {
        IS_BUNDLE_ACCOUNT: true,
        excludes: {},
        mas_tracking_info: { domains: [], enabled: true },
        experiments: {},
        project: {
          ga_integration: 0,
          adobe_integration: 0,
          excludeIps: [],
          src_tracking_enabled: 0,
          projectJS: "",
          auto_map_query_params: 0,
          jquery: 0,
          anonymize_ip: 0,
        },
        polls: {},
        "domain-url": "staging-test-prabhu.pre-freshmarketer.io",
        product_name: "Freshworks",
        webform_tracking_info: { enabled: false },
        BUNDLE_NAME: "sales360",
        samplePercentage: 75,
        "fwdomain-url": "staging-test-prabhu.myfreshworks.dev",
        audiences: {},
        integrations: {},
        goals: {},
        orgidhash: "425650535A535946565B5858414C575D575E5E5D58",
      };
      var zgAddHeatmapLoader = function () {
        var loader = document.getElementById("ab-visualeditor-loading");
        if (window.osmexperiment && window.osmexperiment.visualeditor) {
          return;
        }
        if (!loader) {
          var d = document.createElement("div"),
            style,
            intervalid,
            html;
          var imgsrc =
            '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="64px" height="64px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#2c5cc5" stroke-width="12" r="40" stroke-dasharray="188.49555921538757 64.83185307179586" transform="rotate(312.042 50 50)"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.5s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>';
          style =
            "pointer-events:none;transition: opacity 1s;opacity:0.87;z-index: 500000000; position: fixed; top: 0px; left: 0px; width: 100%; height: 1000px; overflow: hidden; display: block; background: rgba(0, 0, 0, 1);";
          html =
            '<span style="display: block; position: fixed; top: 40%; left: 45%;"><div style="text-align:center">' +
            imgsrc +
            "</div></span>";
          d.setAttribute("id", "ab-visualeditor-loading");
          d.setAttribute("class", "ab-editor-component");
          d.style.cssText = style;
          d.innerHTML = html;
          document.documentElement.appendChild(d);
        } else {
          loader.style.display = "block";
          loader.style.opacity = "0.87";
        }
      };
      var zgRemoveHeatmapLoader = function () {
        var loader = document.querySelector("#ab-visualeditor-loading");
        loader ? (loader.style.display = "none") : null;
      };
      (function (Zarget, ZargetData) {
        if (typeof ZargetData === "undefined") {
          Zarget.log("No experiments is running on the current page.");
          return;
        }
        if (Zarget.isOptedOut()) {
          return;
        }
        function trimZargetParams(hash) {
          var hashStr = "",
            params,
            hasZgParams,
            i,
            param,
            name,
            value;
          params = hash.split("&");
          hasZgParams = false;
          for (i = 0, param, name, value; i < params.length; i++) {
            param = params[i];
            if (param.indexOf("zarget_") !== -1) {
              hasZgParams = true;
            } else {
              hashStr += param;
            }
          }
          return hasZgParams ? hashStr : hash;
        }
        function getOriginURL() {
          var url = document.URL,
            a,
            hash,
            search,
            origin;
          a = document.createElement("a");
          a.href = url;
          hash = a.hash;
          if (hash) {
            hash = trimZargetParams(hash.substr(1));
          }
          origin = a.protocol + "//" + a.host + a.pathname;
          if (a.search) {
            origin += a.search;
          }
          return hash ? origin + "#" + hash : origin;
        }
        function getHashParamValue(name) {
          name = name.replace(/[\[\]]/g, "\\$&");
          var hash = window.location.hash,
            rgx = new RegExp("[#&]" + name + "(=([^&#]*)|&|#|$)"),
            results;
          if (!hash || hash.indexOf(Zarget.heatmapUiConfig.showreport) === -1) {
            return null;
          }
          hash =
            "#" + hash.substr(hash.indexOf(Zarget.heatmapUiConfig.showreport));
          results = rgx.exec(hash);
          if (!results || !results[2]) {
            return null;
          }
          return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        var cdn = Zarget.serverinfo.cdnServerURL,
          zgLoadingImg = document.querySelector("#ab-visualeditor-loading");
        function zgAddLoader() {
          zgAddHeatmapLoader();
        }
        function zgRemoveLoader() {
          Zarget.log("::removing loader ::");
          zgRemoveHeatmapLoader();
        }
        Zarget.heatmapUiConfig = {
          showreport: "zarget__show_report",
          orgid: "zarget__orgid",
          varid: "zarget__varid",
          expid: "zarget__expid",
          hashid: "zarget__hashid",
          segName: "zarget__segmentName",
          segType: "zarget__segmentType",
          zarget_cors_header: "X-Zarget-Cors",
          fm_lang: "fm_lang",
          zarget_cors_expid_header: "X-Zarget-Expid",
          zarget_cors_orgid_header: "X-Zarget-Orgid",
          zarget_cors_origin_url: "X-Zarget-Origin-URL",
          toolbar: {
            js: "zarget-heatmap-toolbar-script",
            css: "zarget-heatmap-toolbar-css",
            html: "zarget-heatmap-toolbar-html",
            jsurl: cdn + "/heatmap.min.js",
            langScript: "zarget-heatmap-toolbar-lang",
            langUrl: cdn + "/i18n/",
            cssurl: cdn + "/heatmap.min.css",
            htmlurl: "http://localhost:8080/ab/heatmaptoolbar.jsp",
          },
        };
        Zarget.isReportView = function () {
          var val = getHashParamValue(Zarget.heatmapUiConfig.showreport);
          if (window.localStorage && window.localStorage.zargetextexpinfo) {
            val = "true";
          }
          return val === "true" ? true : false;
        };
        Zarget.isPausedExp = function () {
          var orgid = getHashParamValue(Zarget.heatmapUiConfig.orgid);
          var expid = getHashParamValue(Zarget.heatmapUiConfig.expid);
          var varid = getHashParamValue(Zarget.heatmapUiConfig.varid);
          var expHashId = getHashParamValue(Zarget.heatmapUiConfig.hashid);
          var segName = getHashParamValue(Zarget.heatmapUiConfig.segName);
          var segType = getHashParamValue(Zarget.heatmapUiConfig.segType);
          var obj = {};
          if (expid !== "" && varid !== "") {
            obj.orgid = orgid;
            obj.expid = expid;
            obj.varid = varid;
          }
          if (
            segName != null &&
            segName != null &&
            segName != "null" &&
            segName != "null"
          ) {
            obj.segName = segName;
            obj.segType = segType;
          }
          if (expHashId) {
            obj.expHashId = expHashId;
          }
          return obj;
        };
        Zarget.initPausedExperiment = function (orgid, expid, varid) {
          zgAddLoader();
          var apiurl = Zarget.serverinfo.getFullPath(
              Zarget.serverinfo.pausedUrl,
              { orgid: orgid, expid: expid },
              false
            ),
            headers = {},
            experiment = {};
          experiment.id = expid;
          headers[Zarget.heatmapUiConfig.zarget_cors_header] = true;
          headers[Zarget.heatmapUiConfig.zarget_cors_expid_header] =
            experiment.id;
          headers[Zarget.heatmapUiConfig.zarget_cors_origin_url] =
            getOriginURL();
          window.zarget$.ajax({
            url: apiurl,
            method: "GET",
            headers: headers,
            crossDomain: true,
            xhrFields: { withCredentials: true },
            complete: function (xhr) {
              if (xhr.status === 200) {
                var exp = JSON.parse(xhr.responseText);
                experiment = exp.pausedExperiment;
                if (!varid) {
                  varid = experiment.variations[0];
                } else {
                  experiment.variations[0] = varid;
                }
                window.zargetCurVariation = varid;
                Zarget.initHeatmap(experiment);
                return;
              } else {
                Zarget.log("Unable to get experiment details.");
                return;
              }
            },
          });
        };
        Zarget.initHeatmap = function (experiment) {
          if (!experiment) {
            Zarget.log(
              "@@@ Experiment cannot be null, heatmapui initialization failed. @@@"
            );
            zgRemoveLoader();
            return;
          }
          zgAddLoader();
          window._ab__toolbar__attached = true;
          Zarget.log("@@@@@@@@ Initializing Heatmap UI @@@@@@@");
          Zarget.start(experiment);
        };
        Zarget.loginFailure = function () {
          zgRemoveLoader();
          Zarget.log(
            "@@@@ User Unauthorized to View heatmap report for current url @@@@"
          );
        };
        Zarget.importScript = function (url, id, success, failure) {
          var scriptTag = document.createElement("script"),
            head = document.head;
          scriptTag.type = "text/javascript";
          scriptTag.setAttribute("id", id);
          scriptTag.setAttribute("src", url);
          if (failure && typeof failure === "function") {
            scriptTag.onerror = failure;
          }
          if (success && typeof success === "function") {
            scriptTag.onload = success;
          }
          head.appendChild(scriptTag);
        };
        Zarget.importStyle = function (url, id, success, failure) {
          var linkTag = document.createElement("link"),
            head = document.head;
          linkTag.type = "text/css";
          linkTag.setAttribute("rel", "stylesheet");
          linkTag.setAttribute("id", id);
          linkTag.setAttribute("href", url);
          if (failure && typeof failure === "function") {
            linkTag.onerror = failure;
          }
          if (success && typeof success === "function") {
            linkTag.onload = success;
          }
          head.appendChild(linkTag);
        };
        Zarget.handleFailure = function (e) {
          zgRemoveLoader();
          Zarget.log("Unable to inject tag into this page. Reason: ", e);
        };
        Zarget.initCompleted = function () {
          Zarget.log("Heatmap toolbar injected @@@@");
        };
        Zarget.injectHeatmapScripts = function () {
          Zarget.log(
            "@@@@@ User has privileges to see heatmap report for current page. @@@@@@@@"
          );
          var script = document.querySelector(
              "#" + Zarget.heatmapUiConfig.toolbar.js
            ),
            link = document.querySelector(
              "#" + Zarget.heatmapUiConfig.toolbar.css
            );
          if (!script) {
            Zarget.importScript(
              Zarget.heatmapUiConfig.toolbar.jsurl,
              Zarget.heatmapUiConfig.toolbar.js,
              function () {
                if (!link) {
                  Zarget.importStyle(
                    Zarget.heatmapUiConfig.toolbar.cssurl,
                    Zarget.heatmapUiConfig.toolbar.css,
                    function () {},
                    Zarget.handleFailure
                  );
                }
              },
              Zarget.handleFailure
            );
            var lang =
              getHashParamValue(Zarget.heatmapUiConfig.fm_lang) || "en-US";
            Zarget.importScript(
              Zarget.heatmapUiConfig.toolbar.langUrl +
                lang.toLowerCase() +
                ".js",
              Zarget.heatmapUiConfig.toolbar.langScript,
              function () {},
              Zarget.handleFailure
            );
          } else {
            zgRemoveLoader();
            Zarget.log("@@@ Heatmap toolbar script is already injected @@@@");
          }
        };
        Zarget.start = function (experiment) {
          window.zargetCurExp = experiment;
          if (!window.zarget$) {
            zgRemoveLoader();
            Zarget.log("JQuery is not initialized.");
            return;
          }
          var loginUrl = Zarget.serverinfo.getFullURL(
            Zarget.serverinfo.loginurl,
            true
          );
          loginUrl += "?url=" + encodeURIComponent(window.location.href);
          var headers = {};
          headers[Zarget.heatmapUiConfig.zarget_cors_header] = true;
          headers[Zarget.heatmapUiConfig.zarget_cors_expid_header] =
            experiment.id;
          headers[Zarget.heatmapUiConfig.zarget_cors_orgid_header] =
            experiment.ORG_ID;
          headers[Zarget.heatmapUiConfig.zarget_cors_origin_url] =
            getOriginURL();
          window.zarget$.ajax({
            url: loginUrl,
            headers: headers,
            crossDomain: true,
            xhrFields: { withCredentials: true },
            complete: function (xhr) {
              if (xhr.status === 0) {
                Zarget.loginFailure();
              } else {
                Zarget.injectHeatmapScripts();
              }
            },
          });
        };
        var common = { ZARGET_VISITOR_INFO: "zarget_visitor_info" };
        var cookie = {
          get: function (k) {
            var r = new RegExp("[; ]" + k + "=([^\\s;]*)"),
              m = (" " + document.cookie).match(r);
            if (k && m) {
              return decodeURIComponent(m[1]);
            }
            return "";
          },
        };
        Zarget.getDomainByExperimentId = function (obj, func) {
          window.zarget$.ajax({
            url:
              Zarget.serverinfo.serverurl +
              "/ab/api/domain/" +
              obj.expHashId +
              "/account/",
            method: "GET",
            crossDomain: true,
            dataType: "json",
            xhrFields: { withCredentials: true },
            success: function (res) {
              var domain = res[res.resource_name]["result"];
              if (!domain) {
                return;
              }
              if (domain.includes("https://")) {
                window.fm_domain = domain;
              } else {
                window.fm_domain = "https://" + domain;
              }
              Zarget.serverinfo.serverurl = window.fm_domain;
              Zarget.serverinfo.secureServerURL = window.fm_domain;
              if (func) {
                if (obj.experiment) {
                  func(obj.experiment);
                } else {
                  func(obj.orgid, obj.expid, obj.varid);
                }
              }
            },
            error: function () {
              console.log("error::", arguments);
            },
          });
        };
        window.runZGHeatmap = function () {
          if (ZargetData.curexp && ZargetData.curexp.length) {
            var visitorinfo = Zarget.getVisitorInfo(),
              experiment = ZargetData.curexp[0].experiment;
            window.zargetCurVariation = visitorinfo[experiment.id];
            if (experiment.id) {
              var domainObj = {
                expHashId: experiment.id,
                experiment: experiment,
              };
              Zarget.getDomainByExperimentId(domainObj, Zarget.initHeatmap);
            } else {
              Zarget.initHeatmap(experiment);
            }
          }
        };
        window.runZGPausedExp = function (data) {
          var cookieObj;
          if (data && data.orgid) {
            var orgid = data.orgid,
              expid = data.expid,
              varid = data.varid;
            if (!varid && data.type !== 3) {
              var curExpVar = zargetAPI.getCurrentRunningExperiment(),
                visitorCookieValue = cookie.get(common.ZARGET_VISITOR_INFO);
              if (visitorCookieValue) {
                cookieObj = JSON.parse(visitorCookieValue);
                if (curExpVar && curExpVar.length) {
                  varid = cookieObj[curExpVar[0].getExpertmentId()];
                }
              }
            }
            if (data.encid) {
              var domainObj = {
                orgid: orgid,
                expid: expid,
                varid: varid,
                expHashId: data.encid,
              };
              Zarget.getDomainByExperimentId(
                domainObj,
                Zarget.initPausedExperiment
              );
            } else {
              Zarget.initPausedExperiment(orgid, expid, varid);
            }
          }
        };
      })(Zarget, ZargetData);
      (function (Zarget, ZargetData) {
        if (Zarget.isOptedOut()) {
          return;
        }
        (function () {
          if (typeof window.CustomEvent === "function") {
            return false;
          }
          function CustomEvent(event, params) {
            var d = document,
              defaultOpt = {
                bubbles: false,
                cancelable: false,
                detail: undefined,
              },
              evt;
            if (!d || d.createEvent) {
              return;
            }
            params = params || defaultOpt;
            evt = d.createEvent("HTMLEvents");
            evt &&
              typeof evt.initEvent === "function" &&
              evt.initEvent(
                event,
                params.bubbles,
                params.cancelable,
                params.detail
              );
            return evt;
          }
          CustomEvent.prototype =
            window && window.Event ? window.Event.prototype : {};
          window.CustomEvent = CustomEvent;
        })();
        Zarget.removePausedExpCookies();
        var isPrevMode,
          prevModeExperiment,
          prevAppliedvarName,
          segmentMsgQueue = [],
          segPageVisitMsg = {};
        window.expEvt = new CustomEvent("experimentLoaded");
        if (ZargetData && ZargetData.project.jquery === 1) {
          window.zarget$ = jQuery.noConflict(true);
          window.jQuery = window.jQuery || window.zarget$;
          window.zarget$ = window.zarget$ || window.jQuery;
          window.fm_$ = window.zarget$ || window.jQuery;
          "undefined" == typeof window.jQuery && delete window.jQuery,
            "undefined" == typeof window.$ && delete window.$;
          window.zarget$ = window.zarget$ || window.jQuery;
        } else {
          window.zarget$ = window.zarget$ || window.jQuery;
          window.fm_$ = window.zarget$ || window.jQuery;
        }
        function hasCrossDomainExperiments() {
          if (!ZargetData || !ZargetData.experiments) {
            return;
          }
          var experiments = ZargetData.experiments,
            experiment,
            expid;
          for (expid in experiments) {
            experiment = experiments[expid];
            if (experiment && experiment.isCrossDomainExperiment) {
              if (experiment.type != 5) {
                return true;
              }
            }
          }
          return false;
        }
        var GOAL_TYPES = {
            PAGE_VISIT: 1,
            ENGAGEMENT: 2,
            FORM_SUBMIT: 3,
            LINK: 4,
            CLICK: 5,
            REVENUE: 6,
            CUSTOM_CONVERSION: 7,
            BOUNCE_RATE: 8,
            TRACK_TIME: 9,
          },
          EXPERIMENT_TYPES = {
            AB: 1,
            HEATMAP: 3,
            SPLIT: 4,
            FUNNEL: 5,
            POLLS: 6,
            FORM: 7,
          },
          serverurl = Zarget.serverinfo.serverurl,
          returningVisitorUrl = Zarget.serverinfo.returningVisitorUrl,
          visitorUrl = Zarget.serverinfo.visitorUrl,
          executioncompleted = false,
          goalUrl = Zarget.serverinfo.goalUrl,
          experiment,
          process = false,
          experiments = [];
        window.zargetAPI = window.zargetAPI || [];
        window.FMApi = window.zargetAPI;
        window.zargetAPI.push = function () {
          Array.prototype.push.apply(this, arguments);
          if (arguments[0] === "fm_activate_adobe_integration") {
            if (
              experiments &&
              experiments.length &&
              (ZargetData.project.adobe_integration ||
                ZargetData.IS_BUNDLE_ACCOUNT)
            ) {
              for (var j = 0, exp; (exp = experiments[j]); j++) {
                var curVar = exp.getAppliedVariation();
                if (
                  curVar &&
                  (exp.getExpertmentType() == 1 || exp.getExpertmentType() == 4)
                ) {
                  try {
                    if (exp.experiment.adobeInteg) {
                      if (exp.experiment.adobeInteg["integrate"]) {
                        if (arguments[1]) {
                          var variable = arguments[1]["sVariable"];
                          if (variable) {
                            variable[
                              exp.experiment.adobeInteg["conversion_variable"]
                            ] =
                              "FM_" +
                              exp.experiment.experimentName +
                              " : " +
                              curVar.name;
                            variable[
                              exp.experiment.adobeInteg["traffic_variable"]
                            ] =
                              "FM_" +
                              exp.experiment.experimentName +
                              " : " +
                              curVar.name;
                          }
                        } else {
                          if (window.s) {
                            window.s[
                              exp.experiment.adobeInteg["conversion_variable"]
                            ] =
                              "FM_" +
                              exp.experiment.experimentName +
                              " : " +
                              curVar.name;
                            window.s[
                              exp.experiment.adobeInteg["traffic_variable"]
                            ] =
                              "FM_" +
                              exp.experiment.experimentName +
                              " : " +
                              curVar.name;
                          }
                        }
                        if (
                          window._satellite != undefined &&
                          window._satellite
                        ) {
                          if (window._satellite.track) {
                            _satellite.track("fm_activate_adobe_integration");
                          }
                        }
                      }
                    }
                  } catch (e) {}
                }
              }
            }
          } else {
            if (arguments[0] === "zg_activate_ga") {
              if (
                window.ga &&
                experiments &&
                experiments.length &&
                (ZargetData.project.ga_integration ||
                  ZargetData.IS_BUNDLE_ACCOUNT)
              ) {
                for (var j = 0, exp; (exp = experiments[j]); j++) {
                  var curVar = exp.getAppliedVariation();
                  if (
                    exp.experiment.ga.integrate &&
                    curVar &&
                    exp.getExpertmentType() == 1
                  ) {
                    var title = $('meta[property="og:title"]').attr("content")
                      ? $('meta[property="og:title"]').attr("content")
                      : document.title;
                    var dimString;
                    var expDate = new Date(exp.experiment.createdTime);
                    var gaDate = new Date(2016, 11, 28);
                    if (expDate > gaDate) {
                      var experimentName = exp.experiment.experimentName
                        ? exp.experiment.experimentName
                        : title;
                      dimString =
                        "Zarget_" +
                        experimentName +
                        "(" +
                        Zarget.getHashCode(curVar.id) +
                        ") : " +
                        curVar.name;
                    } else {
                      dimString =
                        "Zarget_" +
                        title +
                        " (" +
                        exp.experiment.id +
                        ") " +
                        curVar.name;
                    }
                    ga(
                      (exp.experiment.ga.tracker
                        ? exp.experiment.ga.tracker + "."
                        : "") + "set",
                      "dimension" + exp.experiment.ga.dimensionId,
                      dimString
                    );
                  }
                }
              }
            } else {
              if (arguments[0] === "zg_trackEvent") {
                var customGoalName = arguments[1];
                var revenue = arguments[2];
                if (customGoalName && !revenue) {
                  sendCustomEventGoal(customGoalName, 7);
                } else {
                  if (
                    customGoalName &&
                    revenue &&
                    revenue instanceof Object &&
                    !(revenue instanceof Array)
                  ) {
                    if (revenue.revenue && !isNaN(revenue.revenue)) {
                      sendCustomEventGoal(customGoalName, 6, revenue.revenue);
                    }
                  }
                }
              } else {
                if (arguments[0] === "zg_setCutomAttribute") {
                  try {
                    var customAttrName = arguments[1];
                    var customAttrValue = arguments[2];
                    if (customAttrName && customAttrValue) {
                      updateCustomSegAttributes(
                        customAttrName,
                        customAttrValue
                      );
                    }
                  } catch (e) {}
                } else {
                  if (arguments[0] === "fm_form_tracking") {
                    try {
                      var d = arguments[1],
                        u = arguments[2];
                      if (
                        (d &&
                          u &&
                          typeof d === "string" &&
                          typeof u === "object") ||
                        (d && typeof d === "object")
                      ) {
                        typeof d === "object"
                          ? sendMasFormTrackingData("", d)
                          : sendMasFormTrackingData(d, u);
                      } else {
                        Zarget.log(
                          "Skipping sending mas data, reason: validation failed. ",
                          d,
                          u
                        );
                      }
                    } catch (e) {
                      Zarget.log(
                        "Error sending mas form tracking data. Reason: ",
                        e
                      );
                    }
                  }
                }
              }
            }
          }
          window.zargetAPI.splice(0, arguments.length);
          return this.length;
        };
        function sendMasFormTrackingData(digest, userData) {
          if (FM && FM.trackMasEvent) {
            FM.trackMasEvent("web_form", true, {
              digest: digest,
              data: userData,
            });
          }
        }
        function getAllExperimentObj(type, dataObj) {
          var experiments = [];
          for (var lid in dataObj) {
            var exp = Zarget.isLidExists(ZargetData.experiments, lid);
            if (exp) {
              if (type === "all") {
                experiments.push(exp);
              } else {
                exp.type === type && experiments.push(exp);
              }
              if (exp.type === 1 || exp.type === 4) {
                var variationName = "";
                for (var i = 0, l = exp.variations.length; i < l; i++) {
                  if (String(exp.variations[i].id) === String(dataObj[lid])) {
                    variationName = exp.variations[i].name;
                    break;
                  }
                }
                exp.appliedVariationName = variationName;
              }
            }
          }
          return experiments;
        }
        function fiterPreviewExp(experiments, prevModeExperiment) {
          experiments = window.zarget$.grep(experiments, function (exp) {
            if (exp.id !== prevModeExperiment.id) {
              return exp;
            }
          });
          prevModeExperiment.appliedVariationName = prevAppliedvarName;
          experiments.push(prevModeExperiment);
          return experiments;
        }
        window.zargetAPI.getAllExperimentsVariations = function (
          callback,
          type
        ) {
          var expTypes = { ab: 1, heatmap: 3, split: 4, funnel: 5 };
          type = type ? (expTypes[type] ? expTypes[type] : "all") : "all";
          var experiments = [];
          try {
            var visitorInfo = Zarget.getVisitorInfo();
            experiments = getAllExperimentObj(type, visitorInfo);
            if (variationExpMap) {
              var tempExps = getAllExperimentObj(type, variationExpMap);
              if (tempExps && tempExps.length > 0) {
                experiments.concat(tempExps);
              }
            }
            if (isPrevMode) {
              if (!prevModeExperiment) {
                (function poll() {
                  var intervalFn = setInterval(function () {
                    if (prevModeExperiment) {
                      clearInterval(intervalFn);
                      experiments = fiterPreviewExp(
                        experiments,
                        prevModeExperiment
                      );
                      if (callback && typeof callback === "function") {
                        callback(experiments);
                      }
                    }
                  }, 300);
                  setTimeout(function () {
                    clearInterval(intervalFn);
                  }, 6000);
                })();
              } else {
                experiments = fiterPreviewExp(experiments, prevModeExperiment);
                if (callback && typeof callback === "function") {
                  callback(experiments);
                }
              }
            } else {
              if (callback && typeof callback === "function") {
                callback(experiments);
              }
            }
          } catch (e) {
            Zarget.log("Error while fetching all experiments. Reason : ", e);
          }
        };
        function filterExperiments(vinfo, type) {
          if (!vinfo) {
            return [];
          }
          var o = [];
          for (var lid in vinfo) {
            var exp = Zarget.isLidExists(ZargetData.experiments, lid);
            if (exp) {
              if (type === "all") {
                o.push(exp);
              } else {
                exp.type === type && o.push(exp);
              }
              if (exp.type === 1 || exp.type === 4) {
                var variationName = "";
                for (var i = 0, l = exp.variations.length; i < l; i++) {
                  if (String(exp.variations[i].id) === String(vinfo[lid])) {
                    variationName = exp.variations[i].name;
                    break;
                  }
                }
                exp.appliedVariationName = variationName;
              }
            }
          }
          return o;
        }
        window.zargetAPI.getAllRunningExperiments = function (type) {
          var expTypes = { ab: 1, heatmap: 3, split: 4, funnel: 5 };
          type = type ? (expTypes[type] ? expTypes[type] : "all") : "all";
          var experiments = [];
          var visitorInfo = Zarget.getVisitorInfo();
          experiments = experiments.concat(
            filterExperiments(visitorInfo, type)
          );
          experiments = experiments.concat(
            filterExperiments(variationExpMap, type)
          );
          if (isPrevMode && prevModeExperiment) {
            experiments = window.zarget$.grep(experiments, function (exp) {
              if (exp.id !== prevModeExperiment.id) {
                return exp;
              }
            });
            prevModeExperiment.appliedVariationName = prevAppliedvarName;
            experiments.push(prevModeExperiment);
          }
          return experiments;
        };
        window.zargetAPI.getCurrentRunningExperiment = function () {
          return ZargetData.curexp;
        };
        function sendCustomEventGoal(eventName, goalType, revenue) {
          var visitorInfo = Zarget.getVisitorInfo();
          var user = Zarget.getUidAndSetIfNotExists();
          if (!user || !visitorInfo || !ZargetData) {
            return;
          }
          var allGoals,
            i,
            g,
            l,
            urls,
            j,
            l1,
            url,
            cururl,
            matches,
            simplematch_conditions = [1, 2, 3, 4],
            exp;
          for (var lid in visitorInfo) {
            var customEventGoal;
            exp = Zarget.isLidExists(ZargetData.experiments, lid);
            if (exp) {
              allGoals = exp.goals;
              for (i = 0, l = allGoals.length; i < l; i++) {
                if (!ZargetData.goals.hasOwnProperty(allGoals[i])) {
                  continue;
                }
                if (
                  ZargetData.goals[allGoals[i]].type === goalType &&
                  ZargetData.goals[allGoals[i]].event === eventName
                ) {
                  customEventGoal = ZargetData.goals[allGoals[i]];
                  break;
                }
              }
              if (customEventGoal) {
                sendCustomGoal(
                  user,
                  customEventGoal,
                  exp.id,
                  visitorInfo[lid],
                  exp,
                  revenue
                );
              }
            }
          }
        }
        function sendCustomGoal(uid, goal, expid, varid, exp, revenue) {
          if (!uid || !goal || !expid || !varid) {
            return;
          }
          var url, msg, gid, r, rc, referrer;
          url = encodeURIComponent(document.URL);
          referrer = document.referrer;
          gid = goal.id;
          r = new Date().getTime();
          if (exp.isCrossDomainExperiment) {
            uid = window.zarget_masteruserid;
          } else {
            uid = Zarget.getUidAndSetIfNotExists();
          }
          var goalInfo = Zarget.getGoalInfo();
          rc = !goalInfo
            ? false
            : goalInfo[expid]
            ? goalInfo[expid].indexOf(gid) > -1
              ? true
              : false
            : false;
          Zarget.rememberGoal(exp, gid);
          msg = new Zarget.Message(Zarget.MessageType.ADDGOAL);
          var today = new Date();
          var nowUTC = today.getTime() + today.getTimezoneOffset() * 60000;
          msg.setParam({
            eid: expid,
            uid: uid,
            vid: varid,
            r: r,
            gid: gid,
            ftc: !rc,
            ety: exp.type,
          });
          if (revenue) {
            msg.addParam("revenue_amount", revenue);
          }
          msg = checkCustomAttr(msg);
          Zarget.xhrService.sendImmediate(msg);
        }
        Zarget.checkCustomAttr = function (msg) {
          return checkCustomAttr(msg);
        };
        Zarget.getLocalCustomAttr = function (storekey) {
          var localStoreAttrdata = {},
            cookieAttrData = {};
          cookieAttrData =
            Zarget.parseJSON(decodeURIComponent(Zarget.getCookie(storekey))) ||
            {};
          localStoreAttrdata =
            Zarget.parseJSON(decodeURIComponent(Zarget.getStorage(storekey))) ||
            {};
          return Zarget.mergeTwoObject(cookieAttrData, localStoreAttrdata);
        };
        function checkCustomAttr(msg) {
          if (!msg) {
            return;
          }
          var segCustAttr = Zarget.getLocalCustomAttr("zg_cus_attr");
          var attrObjLength = Zarget.getObjectLength(segCustAttr);
          if (
            (!segCustAttr || attrObjLength == 0) &&
            segmentMsgQueue &&
            segmentMsgQueue.length <= 10
          ) {
            segmentMsgQueue.push(msg);
          }
          if (segCustAttr && attrObjLength > 0) {
            for (var cobj in segCustAttr) {
              if (segCustAttr.hasOwnProperty(cobj)) {
                msg.addParam("segAttrName;" + cobj, segCustAttr[cobj]);
              }
            }
          }
          return msg;
        }
        function updateCustomSegAttributes(attrName, attrValue) {
          if (!attrName || !attrValue) {
            return;
          }
          var localStoreAttrdata = {},
            cookieAttrData = {},
            age = 365 * 24 * 60 * 60 * 1000;
          cookieAttrData =
            Zarget.parseJSON(
              decodeURIComponent(Zarget.getCookie("zg_cus_attr"))
            ) || {};
          localStoreAttrdata =
            Zarget.parseJSON(
              decodeURIComponent(Zarget.getStorage("zg_cus_attr"))
            ) || {};
          if (Zarget.getObjectLength(cookieAttrData) < 3) {
            cookieAttrData[attrName] = attrValue;
            Zarget.setCookie(
              "zg_cus_attr",
              encodeURIComponent(Zarget.stringifyJSON(cookieAttrData)),
              age
            );
          } else {
            localStoreAttrdata[attrName] = attrValue;
            Zarget.setStorage(
              "zg_cus_attr",
              encodeURIComponent(Zarget.stringifyJSON(localStoreAttrdata))
            );
          }
          if (segmentMsgQueue && Zarget.getObjectLength(segPageVisitMsg) > 0) {
            segmentMsgQueue.push(segPageVisitMsg);
            segPageVisitMsg = null;
          }
          processQueueData();
        }
        function processQueueData() {
          if (segmentMsgQueue && segmentMsgQueue.length > 0) {
            for (var i = 0; i < segmentMsgQueue.length; i++) {
              var msg = segmentMsgQueue[i];
              if (msg) {
                var cusAttrArr = Zarget.getLocalCustomAttr("zg_cus_attr");
                for (var cobj in cusAttrArr) {
                  if (cusAttrArr.hasOwnProperty(cobj)) {
                    msg.addParam("segAttrName;" + cobj, cusAttrArr[cobj]);
                  }
                }
              }
              Zarget.Messenger.send(msg);
            }
            segmentMsgQueue = [];
          }
        }
        experiments.isTypeExps = function (type) {
          var abs = window.zarget$.grep(this, function (experiment) {
            if (experiment.getExpertmentType() === type) {
              return experiment;
            }
          });
          return abs.length === this.length ? true : false;
        };
        experiments.isExists = function (exp) {
          var abs = window.zarget$.grep(this, function (experiment) {
            if (experiment.getExpertmentId() === exp.id) {
              return experiment;
            }
          });
          return abs.length ? true : false;
        };
        experiments.isGeoExp = function () {
          return window.zarget$.grep(this, function (expObj) {
            if (expObj.isGeoRequest()) {
              return true;
            }
          }).length
            ? true
            : false;
        };
        experiments.isBulkTargeting = function () {
          return window.zarget$.grep(this, function (expObj) {
            if (expObj.isBulkTargeting()) {
              return true;
            }
          }).length
            ? true
            : false;
        };
        experiments.filterGoal = function (evt) {
          if (!this.hasGoals()) {
            return;
          }
          var goaltypes,
            goals,
            goal,
            filteredgoals,
            i,
            l,
            j,
            l1,
            appliedvariation;
          if (evt.type === "submit") {
            goaltypes = [2, 3];
          } else {
            if (evt.type === "mousedown") {
              goaltypes = [2, 3, 4, 5];
            }
          }
          filteredgoals = [];
          var len = this.length;
          for (var k = 0, expObj; k < len; k++) {
            expObj = this[k];
            if (!expObj.isRunning) {
              continue;
            }
            goals = expObj.experiment.goals;
            appliedvariation = expObj.getAppliedVariation(true);
            for (i = 0, l = goals.length; i < l; i++) {
              goal = ZargetData.goals[goals[i]];
              if (goaltypes.indexOf(goal.type) > -1) {
                if (goal.type === 5 && expObj.experiment.type === 4) {
                  for (j = 0, l1 = goal.s.length; j < l1; j++) {
                    if (
                      appliedvariation &&
                      goal.s[j].v === appliedvariation.name
                    ) {
                      filteredgoals.push({
                        goal: goal.s[j],
                        experiment: expObj,
                      });
                    }
                  }
                } else {
                  filteredgoals.push({ goal: goal, experiment: expObj });
                }
              }
            }
          }
          return filteredgoals;
        };
        experiments.hasGeoJsExp = function () {
          return window.zarget$.grep(this, function (expObj) {
            if (expObj.isGeoRequest() || expObj.isJsVariable()) {
              return true;
            }
          }).length
            ? true
            : false;
        };
        experiments.hasGoals = function () {
          var goals = [];
          window.zarget$.each(this, function (idx, expObj) {
            expObj.experiment &&
              window.zarget$.each(expObj.getGoals(), function (idx, goalId) {
                goals.push(goalId);
              });
          });
          return goals.length > 0;
        };
        experiments.isLidExists = function (lid) {
          return window.zarget$.grep(this, function (expObj) {
            if (expObj.experiment.lid === lid) {
              return true;
            }
          }).length
            ? true
            : false;
        };
        function Experiment(experiment) {
          if (!(this instanceof Experiment)) {
            return new Experiment(experiment);
          }
          this.isRunning = false;
          this.experiment = experiment;
          return this;
        }
        Experiment.prototype = {
          startExperiment: function () {
            var experiment = this.experiment;
            if (this.isAlreadyVisitedUser()) {
              if (experiment.isCrossDomainExperiment) {
                if (!window.zarget_masteruserid) {
                  Zarget.getVariationForExperimentAndUser(
                    experiment.id,
                    null,
                    this.startExperiment,
                    this
                  );
                  return;
                }
              }
              this.isRunning = true;
              this.sendVisitorInfo(true);
              if (Zarget.mixpanel) {
                Zarget.mixpanel(this.getAppliedVariation(), experiment);
              }
              if (Zarget.kissmetrics) {
                Zarget.kissmetrics(this.getAppliedVariation(), experiment);
              }
              startGoalTracking();
              this.handleVisitedUser();
              if (
                variationExpMap &&
                variationExpMap.hasOwnProperty(experiment.lid)
              ) {
                delete variationExpMap[experiment.lid];
              }
              checkUserInfoTimeGoal();
              return;
            }
            if (this.isGeoRequest() && !isGeoRequestFinished()) {
              var self = this;
              this.zarget_timeoutid = window.setTimeout(function () {
                self.startExperiment();
              }, 5);
              return;
            } else {
              try {
                window.clearTimeout(this.zarget_timeoutid);
              } catch (e) {
                Zarget.log("Error in clearing geo timer.");
              }
            }
            if (this.isBulkRequest() && !this.isBulkRequestFinished()) {
              this.zarget_bulktimeoutid = window.setTimeout(
                this.startExperiment,
                5
              );
              return;
            } else {
              try {
                window.clearTimeout(this.zarget_bulktimeoutid);
              } catch (e) {
                Zarget.log("Error in clearing bulk timer.");
              }
            }
            if (Zarget.isCookieDisabled()) {
              return;
            }
            if (
              experiment.hasOwnProperty("audienceid") &&
              !Zarget.matchesTargeting(
                ZargetData.audiences[experiment.audienceid]
              )
            ) {
              Zarget.log("Targeting Failed.");
              return;
            }
            var variation;
            if (
              variationExpMap &&
              variationExpMap.hasOwnProperty(experiment.lid)
            ) {
              variation = this.getVariation(variationExpMap[experiment.lid]);
            } else {
              variation = this.pickvariation();
            }
            var userid = Zarget.getUidAndSetIfNotExists();
            if (experiment.type === 1) {
              if (!variation) {
                return;
              }
              if (experiment.isCrossDomainExperiment) {
                window.zarget_crossdomainrequestgoing = true;
                Zarget.getVariationForExperimentAndUser(
                  experiment.id,
                  variation,
                  null
                );
              }
              startGoalTracking();
              this.rememberVisitor(variation.id);
              checkUserInfoTimeGoal();
              if (
                variationExpMap &&
                variationExpMap.hasOwnProperty(experiment.lid)
              ) {
                delete variationExpMap[experiment.lid];
              }
              this.isRunning = true;
              this.sendVisitorInfo(false, userid ? true : false);
              if (Zarget.mixpanel) {
                Zarget.mixpanel(this.getAppliedVariation(), experiment);
              }
              if (Zarget.kissmetrics) {
                Zarget.kissmetrics(this.getAppliedVariation(), experiment);
              }
              this.route(variation);
              return;
            }
            if (experiment.isCrossDomainExperiment) {
              if (
                !getCookieFinished(
                  experiment,
                  processCrossDomainExperiment,
                  this
                )
              ) {
                window.zarget_crosstimeoutid = window.setTimeout(
                  self.startExperiment,
                  5
                );
                return;
              } else {
                window.clearTimeout(window.zarget_crosstimeoutid);
                if (experiment.type === 4) {
                  checkUserInfoTimeGoal();
                }
                return;
              }
            }
            if (!variation) {
              return;
            }
            this.isRunning = true;
            startGoalTracking();
            this.rememberVisitor(variation.id);
            checkUserInfoTimeGoal();
            this.sendVisitorInfo(false, userid ? true : false);
            if (Zarget.mixpanel) {
              Zarget.mixpanel(this.getAppliedVariation(), experiment);
            }
            if (Zarget.kissmetrics) {
              Zarget.kissmetrics(this.getAppliedVariation(), experiment);
            }
            this.route(variation);
          },
          getExpertmentType: function () {
            return this.experiment && this.experiment.type;
          },
          getExpertmentId: function () {
            return this.experiment && this.experiment.id;
          },
          isAlreadyVisitedUser: function () {
            var info = Zarget.getVisitorInfo(),
              userid = Zarget.getUidAndSetIfNotExists();
            if (userid && info && info.hasOwnProperty(this.experiment.lid)) {
              return true;
            }
          },
          sendVisitorInfo: function (returning, rv) {
            var visitorinfo = Zarget.getVisitorInfo(),
              img,
              experiment = this.experiment,
              expid = experiment.id,
              lid = experiment.lid,
              varid,
              r,
              uid,
              url,
              referrer,
              type,
              msg;
            if (!visitorinfo || !visitorinfo.hasOwnProperty(lid)) {
              return;
            }
            url = encodeURIComponent(document.URL);
            referrer = document.referrer;
            varid = visitorinfo[lid];
            type = returning
              ? Zarget.MessageType.UPDATEVISITOR
              : Zarget.MessageType.ADDVISITOR;
            if (experiment.isCrossDomainExperiment) {
              if (window.zarget_masteruserid) {
                uid = window.zarget_masteruserid;
                if (window.zarget_sendvisitortimeoutid2) {
                  window.clearTimeout(window.zarget_sendvisitortimeoutid2);
                }
              } else {
                window.zarget_sendvisitortimeoutid2 = window.setTimeout(
                  this.sendVisitorInfo,
                  5,
                  returning,
                  uid
                );
                return;
              }
            } else {
              uid = Zarget.getUidAndSetIfNotExists();
            }
            r = new Date().getTime();
            msg = new Zarget.Message(type);
            var today = new Date();
            var nowUTC = today.getTime() + today.getTimezoneOffset() * 60000;
            msg.setParam({
              eid: expid,
              uid: uid,
              vid: varid,
              r: r,
              ftv: !returning,
              ety: experiment.type,
            });
            typeof rv !== "undefined" && msg.addParam("ru", rv);
            msg = checkCustomAttr(msg);
            segPageVisitMsg = msg;
            Zarget.xhrService.send(msg);
          },
          checkAllVariationChangesMarked: function (expData) {
            experiment = expData;
            var variation = getVariationForVisitedUser();
            if (variation.name === "Original") {
              return true;
            }
            if (
              variation &&
              variation.changes &&
              Array.isArray(variation.changes)
            ) {
              var counter = 0;
              for (i = 0, l = variation.changes.length; i < l; i++) {
                var varChanges = variation.changes[i];
                if (
                  getDataAtrribute(varChanges.s, "zg_" + getObjhash(varChanges))
                ) {
                  counter++;
                }
              }
              return counter === variation.changes.length;
            }
            return false;
          },
          handleVisitedUser: function () {
            var variation = this.getAppliedVariation();
            if (variation) {
              this.route(variation);
            }
          },
          getVariation: function (id) {
            var i, l;
            for (i = 0, l = this.experiment.variations.length; i < l; i++) {
              if (String(this.experiment.variations[i].id) === String(id)) {
                return this.experiment.variations[i];
              }
            }
          },
          getVistedUserVariationInfo: function () {
            var visitorinfo = Zarget.getVisitorInfo(),
              variation;
            variation = this.getVariation(visitorinfo[this.experiment.lid]);
            return variation;
          },
          getVariationForVisitedUser: function () {
            if (this.isAlreadyVisitedUser()) {
              return this.getVistedUserVariationInfo();
            }
          },
          getGoals: function () {
            return this.experiment.goals;
          },
          route: function (variation) {
            var EXPERIMENT = { AB: 1, MULTIVARIANT: 2, SPLIT: 4 };
            switch (this.experiment.type) {
              case EXPERIMENT_TYPES.AB:
                this.abtest(variation);
                break;
              case EXPERIMENT.MULTIVARIANT:
                break;
              case EXPERIMENT_TYPES.SPLIT:
                this.spliturl(variation);
                break;
            }
          },
          abtest: function (variation) {
            try {
              trackPageVisits();
              this.applyGlobalJsCss();
            } catch (e) {}
            if (variation.css) {
              var style =
                document.getElementById(
                  "zg-variation-css-code-" + variation.id
                ) || document.createElement("style");
              style.setAttribute("id", "zg-variation-css-code-" + variation.id);
              style.type = "text/css";
              if (style.styleSheet) {
                style.styleSheet.cssText = variation.css;
              } else {
                style.appendChild(document.createTextNode(variation.css));
              }
              document.head.appendChild(style);
            }
            if (
              !variation ||
              !variation.changes ||
              variation.changes.length < 1
            ) {
              return;
            }
            var changes = variation.changes,
              i,
              l;
            for (i = 0, l = changes.length; i < l; i++) {
              this.applyabtestchange(changes[i], variation.id);
            }
          },
          applyGlobalJsCss: function () {
            var experiment = this.experiment;
            if (experiment == "undefined") {
              return;
            }
            if (
              experiment.hasOwnProperty("globalJsCode") &&
              experiment.globalJsCode
            ) {
              var script =
                document.getElementById(
                  "zg-global-script-code-" + experiment.id
                ) || document.createElement("script");
              script.setAttribute(
                "id",
                "zg-global-script-code-" + experiment.id
              );
              script.innerHTML = experiment.globalJsCode;
              document.head.appendChild(script);
            }
            if (
              experiment.hasOwnProperty("globalCssCode") &&
              experiment.globalCssCode
            ) {
              var style =
                document.getElementById(
                  "zg-global-css-code-" + experiment.id
                ) || document.createElement("style");
              style.setAttribute("id", "zg-global-css-code-" + experiment.id);
              style.type = "text/css";
              if (style.styleSheet) {
                style.styleSheet.cssText = experiment.globalCssCode;
              } else {
                style.appendChild(
                  document.createTextNode(experiment.globalCssCode)
                );
              }
              document.head.appendChild(style);
            }
          },
          abtestpolling: function () {
            var variation = this.getAppliedVariation(),
              changes,
              change,
              i,
              l;
            if (!variation || typeof variation !== "object") {
              return;
            }
            changes = variation.changes;
            for (i = 0, l = changes.length; i < l; i++) {
              change = changes[i];
              if (!change.applied) {
                this.applyabtestchange(change);
              }
            }
            var self = this;
            if (this.hasUnappliedChanges(variation)) {
              window.setTimeout(function () {
                self.abtestpolling(experiment);
              }, 50);
            }
          },
          getAppliedVariation: function (click) {
            try {
              var visitorInfo = Zarget.getVisitorInfo();
              if (!visitorInfo || typeof visitorInfo !== "object") {
                return;
              }
              var applied = this.getVariation(visitorInfo[this.experiment.lid]);
              if (
                this.experiment.personalization &&
                !this.isBulkRequest() &&
                !this.isGeoRequest() &&
                !click
              ) {
                var variation = this.pickvariation();
                if (variation) {
                  this.rememberVisitor(variation.id, true);
                  this.sendVisitorInfo(true);
                  return variation;
                }
              }
              return applied;
            } catch (e) {
              Zarget.log(e);
            }
          },
          applyabtestchange: function (change, vid) {
            try {
              change.applied = true;
              if (change.jsStr) {
                var script = document.getElementById(
                  "zg-variation-script-code-" + vid
                );
                if (script) {
                  document.body.removeChild(script);
                }
                script = document.createElement("script");
                script.setAttribute("id", "zg-variation-script-code-" + vid);
                script.innerHTML = change.jsStr;
                document.body.appendChild(script);
              }
            } catch (e) {
              Zarget.log("Error while applying change ", e.toString());
            }
          },
          hasUnappliedChanges: function (variation) {
            var changes = variation.changes,
              i,
              l;
            for (i = 0, l = changes.length; i < l; i++) {
              if (!changes[i].applied) {
                return true;
              }
            }
            return false;
          },
          pickvariation: function () {
            var variations = this.experiment.variations;
            if (!variations || !(variations instanceof Array)) {
              return;
            }
            if (this.experiment.personalization) {
              var matchedVar = [];
              for (i = 0, l = variations.length; i < l; i++) {
                var audicenedata =
                  ZargetData.audiences[variations[i].audienceid];
                if (
                  Zarget.matchesTargeting(
                    audicenedata,
                    this.experiment.personalization
                  )
                ) {
                  var data = {
                    variation: variations[i],
                    audience: audicenedata,
                  };
                  matchedVar.push(data);
                }
              }
              if (matchedVar.length) {
                if (matchedVar.length === 1) {
                  return matchedVar[0].variation;
                } else {
                  var exactMatches = [],
                    partialMatches = [];
                  for (var k = 0; k < matchedVar.length; k++) {
                    if (
                      matchedVar[k].audience.conditions &&
                      isMatchAllCond(matchedVar[k].audience.conditions)
                    ) {
                      exactMatches.push(matchedVar[k]);
                    } else {
                      partialMatches.push(matchedVar[k]);
                    }
                  }
                  if (exactMatches.length) {
                    return exactMatches.length === 1
                      ? exactMatches[0].variation
                      : exactMatches[
                          Math.floor(Math.random() * exactMatches.length)
                        ].variation;
                  } else {
                    return partialMatches.length === 1
                      ? partialMatches[0].variation
                      : partialMatches[
                          Math.floor(Math.random() * partialMatches.length)
                        ].variation;
                  }
                }
              } else {
                return false;
              }
            }
            var e = 0,
              c = 0,
              r = Math.random(),
              i,
              l;
            for (i = 0, l = variations.length; i < l; i++) {
              c = variations[i].traffic;
              if (r > e && r <= e + c) {
                return variations[i];
              }
              e += c;
            }
          },
          isReqPersonalization: function (variations, condition) {
            for (var i = 0, l = variations.length; i < l; i++) {
              var audicenedata = ZargetData.audiences[variations[i].audienceid];
              if (audicenedata && audicenedata[condition]) {
                return true;
              }
            }
          },
          isGeoRequest: function () {
            var exp = this.experiment;
            return (
              exp &&
              exp.audienceid &&
              (ZargetData.audiences[exp.audienceid].isGeoTargeting ||
                (exp.personalization &&
                  this.isReqPersonalization(exp.variations, "isGeoTargeting")))
            );
          },
          isBulkRequest: function () {
            var exp = this.experiment;
            return (
              exp &&
              exp.audienceid &&
              (ZargetData.audiences[exp.audienceid].isBulkTargeting ||
                (exp.personalization &&
                  this.isReqPersonalization(exp.variations, "isBulkTargeting")))
            );
          },
          isJsVariable: function () {
            var exp = this.experiment;
            return (
              exp &&
              exp.audienceid &&
              (ZargetData.audiences[exp.audienceid].hasJsVariable ||
                (exp.personalization &&
                  this.isReqPersonalization(exp.variations, "hasJsVariable")))
            );
          },
          spliturl: function (variation) {
            if (!variation || !variation.url) {
              return;
            }
            if (variation.name === "Original") {
              return;
            }
            var experiment = this.experiment;
            if (Zarget.matchSplitFunc(experiment, [variation])) {
              return;
            }
            var docURL = document.URL,
              cururl = Zarget.parseURL(docURL),
              expurl = Zarget.parseURL(experiment.url),
              varurl = Zarget.parseURL(variation.url);
            var locHref = Zarget.removeTrailSlash(cururl.path);
            if (!experiment.queryparam && experiment.regex) {
              var queryIdx = docURL.indexOf("?");
              if (queryIdx > -1) {
                var queryStr = docURL.substring(queryIdx);
                locHref += queryStr;
              }
            }
            var checkURL = Zarget.removeTrailSlash(expurl.path);
            if (!experiment.queryparam && experiment.regex) {
              var queryIdx = experiment.url.indexOf("?");
              if (queryIdx > -1) {
                var queryStr = experiment.url.substring(queryIdx);
                checkURL += queryStr;
              }
            }
            var finURL = varurl.path;
            if (!experiment.queryparam) {
              var queryIdx = variation.url.indexOf("?");
              if (queryIdx > -1) {
                var queryStr = variation.url.substring(queryIdx);
                finURL += queryStr;
              }
            }
            if (experiment.regex) {
              var found = false;
              var orig = expurl.authority.replace(/^www./, "") + checkURL;
              locHref = cururl.authority.replace(/^www./, "") + locHref;
              orig = orig.replace(/([\[\]\(\)\*\^\$\.\?\|\/\\])/g, "\\$1");
              var groupPatt = /(\\\(([^\)\/]*)\))/g;
              var match1 = orig.match(groupPatt),
                grpMatch;
              var orig1 = "";
              if (orig.match(groupPatt) !== null) {
                var d = 0;
                var lastInd = 0;
                while ((grpMatch = groupPatt.exec(orig)) !== null) {
                  var firstSub = orig
                    .substring(lastInd, grpMatch.index)
                    .replace(/\\\*+/g, "(.*)");
                  var matchReg =
                    "(" +
                    grpMatch[2].substring(0, grpMatch[2].length - 1) +
                    ")";
                  matchReg = matchReg.replace(/\\\|/g, "|");
                  orig1 += firstSub + matchReg;
                  lastInd = grpMatch.index + grpMatch[0].length;
                  d++;
                }
                orig1 += orig.substring(lastInd, orig.length);
                orig = orig1;
              } else {
                orig = orig.replace(/\\\*+/g, "(.*)");
              }
              var strEx = new RegExp(orig);
              var match = locHref.match(strEx),
                matcher;
              if (
                match !== null &&
                match.index === 0 &&
                match[0].length == locHref.length
              ) {
                found = true;
                checkURL = match[0];
              } else {
                found = false;
                checkURL = "";
              }
              if (found) {
                var matches = {};
                for (var k = 1, len = match.length; k < len; k++) {
                  matches[k] = match[k];
                }
                finURL = (
                  varurl.authority.replace(/^www\./, "") + finURL
                ).replace(/\$\{variable(\d)\}/g, function ($1, $2) {
                  return matches[$2] ? matches[$2] : "";
                });
                fm_$(experiment.excludeUrls).each(function (i, val) {
                  var excParse = Zarget.parseURL(val);
                  var excUrl =
                    excParse.authority.replace(/^www\./, "") + excParse.path;
                  if (excUrl === finURL) {
                    checkURL = "";
                  }
                });
              }
            }
            if (checkURL === locHref) {
              if (experiment.queryparam) {
                finURL += window.location.search;
                finURL += window.location.hash;
              }
              if (experiment.regex) {
                finURL =
                  varurl.scheme +
                  "://" +
                  (varurl.authority.indexOf("www.") === 0 ? "www." : "") +
                  finURL;
              } else {
                finURL = varurl.scheme + "://" + varurl.authority + finURL;
              }
              document.location.href = finURL;
            }
          },
          sendGoal: function (goal) {
            var visitorinfo = Zarget.getVisitorInfo(),
              img,
              expid,
              lid,
              varid,
              gid,
              r,
              uid,
              msg,
              url,
              referrer,
              rc;
            if (!visitorinfo) {
              return;
            }
            var goalInfo = Zarget.getGoalInfo();
            url = encodeURIComponent(document.URL);
            referrer = document.referrer;
            expid = this.experiment.id;
            lid = this.experiment.lid;
            varid = visitorinfo[lid];
            gid = goal.id;
            rc = !goalInfo
              ? false
              : goalInfo[expid]
              ? goalInfo[expid].indexOf(gid) > -1
                ? true
                : false
              : false;
            Zarget.rememberGoal(this.experiment, gid);
            r = new Date().getTime();
            if (this.experiment.isCrossDomainExperiment) {
              if (window.zarget_masteruserid) {
                uid = window.zarget_masteruserid;
                if (window.zarget_sendvisitortimeoutid3) {
                  window.clearTimeout(window.zarget_sendvisitortimeoutid3);
                }
              } else {
                window.zarget_sendvisitortimeoutid3 = window.setTimeout(
                  sendGoal,
                  5,
                  goal
                );
                return;
              }
            } else {
              uid = Zarget.getUidAndSetIfNotExists();
            }
            msg = new Zarget.Message(Zarget.MessageType.ADDGOAL);
            var today = new Date();
            var nowUTC = today.getTime() + today.getTimezoneOffset() * 60000;
            msg.setParam({
              eid: expid,
              uid: uid,
              vid: varid,
              r: r,
              gid: gid,
              ftc: !rc,
              ety: this.experiment.type,
            });
            msg = checkCustomAttr(msg);
            Zarget.xhrService.sendImmediate(msg);
          },
          rememberVisitor: function (variationid, personalization) {
            if (!variationid) {
              return;
            }
            var age = 365 * 24 * 60 * 60 * 1000,
              visitorinfo = Zarget.getVisitorInfo(),
              vobj;
            vobj = typeof visitorinfo === "object" ? visitorinfo : {};
            Zarget.setUserID();
            if (!vobj.hasOwnProperty(this.experiment.lid) || personalization) {
              vobj[this.experiment.lid] = variationid;
              Zarget.setCookie(
                Zarget.visitorInfoCookie,
                encodeURIComponent(Zarget.stringifyJSON(vobj)),
                age
              );
            }
          },
          isReadyToRedirectSplitURL: function () {
            var experiment = this.experiment;
            if (experiment && experiment.type !== 4) {
              return false;
            }
            if (
              this.isGeoRequest() ||
              this.isBulkRequest() ||
              this.isJsVariable()
            ) {
              return false;
            }
            return true;
          },
          isBulkRequestFinished: function () {
            if (
              !this.finishBulkReq &&
              new Date().getTime() <= window.zarget_bulk_requestedtime + 1000
            ) {
              return false;
            }
            return true;
          },
        };
        function setExperimentsInCookie(masterCookie) {
          var age = 365 * 24 * 60 * 60 * 1000,
            visitorinfo = Zarget.getVisitorInfo(),
            i,
            vobj = typeof visitorinfo === "object" ? visitorinfo : {};
          var experiments;
          try {
            experiments = JSON.parse(masterCookie.experiments);
          } catch (noExperiments) {
            window.zarget_experiments_loaded = true;
            Zarget.setCookie(
              Zarget.visitorInfoCookie,
              encodeURIComponent(Zarget.stringifyJSON(vobj)),
              age
            );
            return;
          }
          for (i = 0; i < experiments.length; i++) {
            if (
              ZargetData.experiments.hasOwnProperty(experiments[i].experimentid)
            ) {
              var experimentid =
                ZargetData.experiments[experiments[i].experimentid]["lid"];
              var variation = experiments[i].variationid;
              vobj[experimentid] = variation.zg_variation_id;
            }
          }
          Zarget.setCookie(
            Zarget.visitorInfoCookie,
            encodeURIComponent(Zarget.stringifyJSON(vobj)),
            age
          );
          window.zarget_experiments_loaded = true;
        }
        function isGetExperimentsFinished() {
          if (window.zarget_experiments_loaded === undefined) {
            window.zarget_experiments_loaded = false;
            Zarget.getVariationForExperimentAndUser(
              null,
              null,
              setExperimentsInCookie,
              null
            );
            return false;
          } else {
            if (!window.zarget_experiments_loaded) {
              return false;
            } else {
              return true;
            }
          }
        }
        function trackPageVisits() {
          if (hasCrossDomainExperiments()) {
            if (!isGetExperimentsFinished()) {
              window.zarget_experimenttimeoutid = window.setTimeout(
                trackPageVisits,
                5
              );
              return;
            } else {
              clearTimeout(window.zarget_experimenttimeoutid);
            }
          }
          var visitorInfo = Zarget.getVisitorInfo();
          var user =
            Zarget.getUidAndSetIfNotExists() || window.zarget_masteruserid;
          if (!user || !visitorInfo || !ZargetData) {
            return;
          }
          var pageVisitGoals,
            allGoals,
            i,
            g,
            l,
            urls,
            j,
            l1,
            url,
            cururl,
            matches,
            exp,
            simplematch_conditions = [1, 2, 3, 4];
          var timeGoalExperiment = [];
          for (var lid in visitorInfo) {
            var hasTimeGoal = false;
            pageVisitGoals = [];
            exp = Zarget.isLidExists(ZargetData.experiments, lid);
            if (exp) {
              allGoals = exp.goals;
              var trackTimeGoalArr = [];
              for (i = 0, l = allGoals.length; i < l; i++) {
                if (!ZargetData.goals.hasOwnProperty(allGoals[i])) {
                  continue;
                }
                if (
                  ZargetData.goals[allGoals[i]].type === 1 ||
                  ZargetData.goals[allGoals[i]].type === 3
                ) {
                  pageVisitGoals.push(allGoals[i]);
                }
                if (ZargetData.goals[allGoals[i]].type === 8) {
                  trackBounceRateGoal(exp, user, ZargetData.goals[allGoals[i]]);
                }
              }
            }
            if (pageVisitGoals.length === 0) {
              continue;
            }
            for (i = 0, l = pageVisitGoals.length; i < l; i++) {
              g = ZargetData.goals[pageVisitGoals[i]];
              urls = g.type == 3 ? [g] : g.urls;
              if (!urls || urls.length === 0) {
                continue;
              }
              for (j = 0, l1 = urls.length; j < l1; j++) {
                url = urls[j].url;
                if (
                  simplematch_conditions.indexOf(urls[j].condition) >= 0 &&
                  url.indexOf("?") === -1
                ) {
                  url = Zarget.getSimpleURL(url);
                  cururl = Zarget.getSimpleURL(document.URL);
                } else {
                  if (
                    simplematch_conditions.indexOf(urls[j].condition) >= 0 ||
                    urls[j].condition === 6 ||
                    urls[j].condition === 5
                  ) {
                    cururl = document.URL;
                  } else {
                    cururl = Zarget.getURL();
                  }
                }
                if (urls[j].condition == 5) {
                  url = new RegExp(url);
                  matches = Zarget.matcher(url, cururl, urls[j].condition);
                } else {
                  matches = Zarget.matcher(cururl, url, urls[j].condition);
                }
                if (matches) {
                  sendPageVisitGoal(user, g, exp.id, visitorInfo[lid]);
                  markAsConverted(exp);
                }
              }
            }
          }
        }
        function timeGoalExperimentIteration(timeGoalExperiment, visitorInfo) {
          var user = Zarget.getUidAndSetIfNotExists();
          if (timeGoalExperiment.length > 0) {
            document.removeEventListener("visibilitychange", visibilitychange);
            document.removeEventListener("keydown", keydown);
            document.removeEventListener("mousemove", mousemove);
            clearInterval(window.goalTimeInterval);
            var startTime = new Date();
            var count = 0;
            var blur = false;
            var avgTimeTrack = true;
            function visibilitychange() {
              if (document.visibilityState === "hidden") {
                blur = true;
              } else {
                if (document.visibilityState === "visible") {
                  count = 0;
                  blur = false;
                  startTime = new Date();
                }
              }
            }
            function keydown(e) {
              if (e.ctrlKey || e.metaKey) {
                var endTime = new Date();
                var time = (endTime - startTime) / 1000;
                trackTimeAvg(timeGoalExperiment, time, visitorInfo);
                startTime = new Date();
              }
            }
            function mousemove(e) {
              var x = e.clientX;
              var y = e.clientY;
              var tempCount = count;
              if (y <= 10) {
                var endTime = new Date();
                var time = (endTime - startTime) / 1000;
                if (avgTimeTrack) {
                  avgTimeTrack = false;
                  trackTimeAvg(timeGoalExperiment, time, visitorInfo);
                  startTime = new Date();
                }
              } else {
                avgTimeTrack = true;
              }
            }
            document.addEventListener("visibilitychange", visibilitychange);
            document.addEventListener("keydown", keydown);
            document.addEventListener("mousemove", mousemove);
            clearInterval(window.goalTimeInterval);
            window.goalTimeInterval = setInterval(function () {
              if (!blur) {
                count = count + 5;
                for (var a = 0; a < timeGoalExperiment.length; a++) {
                  for (var b = 0; b < timeGoalExperiment[a].goals.length; b++) {
                    var value = timeGoalExperiment[a].goals[b].goal.value;
                    if (count >= value) {
                      if (!timeGoalExperiment[a].goals[b].status) {
                        timeGoalExperiment[a].goals[b].status = true;
                        trackTimeGoal(
                          timeGoalExperiment[a].experiment,
                          user,
                          timeGoalExperiment[a].goals[b].goal
                        );
                      }
                    }
                  }
                }
              }
            }, 5000);
          }
        }
        function trackTimeAvg(timeGoalExperiment, count, visitorInfo) {
          for (var a = 0; a < timeGoalExperiment.length; a++) {
            var expid = timeGoalExperiment[a].experiment.id;
            var lid = timeGoalExperiment[a].experiment.lid;
            var url, msg, gid, r, type, exp, referrer, uid;
            url = encodeURIComponent(document.URL);
            referrer = document.referrer;
            exp = ZargetData.experiments[expid];
            if (exp.isCrossDomainExperiment) {
              uid = window.zarget_masteruserid;
            } else {
              uid = Zarget.getUidAndSetIfNotExists();
            }
            msg = new Zarget.Message(Zarget.MessageType.ADDGOAL);
            var today = new Date();
            var nowUTC = today.getTime() + today.getTimezoneOffset() * 60000;
            msg.setParam({
              eid: expid,
              uid: uid,
              vid: visitorInfo[lid],
              r: new Date().getTime(),
              ety: exp.type,
              ett: parseInt(count),
            });
            msg = checkCustomAttr(msg);
            Zarget.xhrService.send(msg);
          }
        }
        function trackBounceRateGoal(experimentDetail, user, g) {
          var visitorInfo = Zarget.getVisitorInfo();
          var eid = experimentDetail.id;
          var lid = experimentDetail.lid;
          if (experimentDetail.type === 4) {
            if (
              !Zarget.matchSplitFunc(experimentDetail) ||
              experimentDetail.regex
            ) {
              sendPageVisitGoal(user, g, eid, visitorInfo[lid]);
            }
          } else {
            if (!Zarget.isExperimentURLMatches(experimentDetail)) {
              sendPageVisitGoal(user, g, eid, visitorInfo[lid]);
            }
          }
        }
        function trackTimeGoal(experimentDetail, user, g) {
          var visitorInfo = Zarget.getVisitorInfo();
          var eid = experimentDetail.id;
          var lid = experimentDetail.lid;
          sendPageVisitGoal(user, g, eid, visitorInfo[lid]);
        }
        function markAsConverted(experiment) {
          if (!experiment || experiment.type !== 7) {
            return;
          }
          var visitorState = "1";
          var age = 365 * 24 * 60 * 60 * 1000,
            visitorinfo = Zarget.getVisitorInfo(),
            vobj = typeof visitorinfo === "object" ? visitorinfo : {};
          vobj[experiment.lid] = visitorState;
          Zarget.setCookie(
            Zarget.visitorInfoCookie,
            encodeURIComponent(Zarget.stringifyJSON(vobj)),
            age
          );
        }
        function sendPageVisitGoal(uid, goal, expid, varid) {
          if (!uid || !goal || !expid || !varid) {
            return;
          }
          var url, msg, gid, r, type, exp, rc, referrer;
          var goalInfo = Zarget.getGoalInfo();
          url = encodeURIComponent(document.URL);
          referrer = document.referrer;
          exp = ZargetData.experiments[expid];
          gid = goal.id;
          rc = !goalInfo
            ? false
            : goalInfo[expid]
            ? goalInfo[expid].indexOf(gid) > -1
              ? true
              : false
            : false;
          Zarget.rememberGoal(exp, gid);
          r = new Date().getTime();
          if (exp.isCrossDomainExperiment) {
            uid = window.zarget_masteruserid;
          } else {
            uid = Zarget.getUidAndSetIfNotExists();
          }
          msg = new Zarget.Message(Zarget.MessageType.ADDGOAL);
          var today = new Date();
          var nowUTC = today.getTime() + today.getTimezoneOffset() * 60000;
          msg.setParam({
            eid: expid,
            uid: uid,
            vid: varid,
            r: r,
            gid: gid,
            ety: exp.type,
            ftc: !rc,
          });
          msg = checkCustomAttr(msg);
          Zarget.xhrService.sendImmediate(msg);
        }
        function trackGoal(evt) {
          var goals = experiments.filterGoal(evt),
            e$,
            ele,
            tag,
            r,
            r1,
            i,
            l,
            goal,
            type,
            experiment;
          if (!goals || goals.length === 0) {
            return;
          }
          e$ = window.zarget$(evt.target);
          ele = e$.get(0);
          tag = ele.tagName.toLowerCase();
          type = ele.getAttribute("type");
          r = /^(img|a|button)$/;
          r1 = /^(submit|button|image)$/;
          for (i = 0, l = goals.length; i < l; i++) {
            goal = goals[i].goal;
            experiment = goals[i].experiment;
            if (
              goal.type === GOAL_TYPES.ENGAGEMENT &&
              (r.test(tag) ||
                r1.test(type) ||
                e$.parents("a,img,button").length)
            ) {
              experiment.sendGoal(goal);
            }
            if (
              goal.type === GOAL_TYPES.LINK &&
              Zarget.matcher(ele.href, goal.url, goal.condition)
            ) {
              experiment.sendGoal(goal);
            }
            if (
              goal.type === GOAL_TYPES.FORM_SUBMIT &&
              Zarget.matcher(goal.url, ele.action, goal.condition)
            ) {
              experiment.sendGoal(goal);
            }
            if (
              goal.type === GOAL_TYPES.CLICK &&
              (window.zarget$(goal.s).is(e$) || e$.parents(goal.s).length)
            ) {
              experiment.sendGoal(goal);
            }
          }
        }
        function handleVisitorclick(e) {
          try {
            trackGoal(e);
          } catch (err) {
            Zarget.log("Error while handling user click on track goal.", err);
          }
        }
        function handleFormSubmit(e) {
          trackGoal(e);
        }
        function isAlreadyVisitedUser() {
          var info = Zarget.getVisitorInfo(),
            userid = Zarget.getCookie(Zarget.visitorCookie);
          if (userid && info && info.hasOwnProperty(experiment.lid)) {
            return true;
          }
        }
        function isMatchAllCond(conds) {
          for (var j = 0, cond; (cond = conds[j]); j++) {
            var failCond = window.zarget$.grep(
              cond.conditions,
              function (condition) {
                if (condition.matches === false) {
                  return condition;
                }
              }
            );
            if (failCond.length) {
              return false;
            }
          }
          return true;
        }
        function doRearrange(change) {
          if (!change) {
            Zarget.log("Rearrange failed. Reason: invalid change object.");
            return;
          }
          var ref, ele, pos, c;
          if (change && typeof change.code === "object") {
            c = change.code;
            ref = c.rs;
            ele = c.s;
            pos = c.p;
            if (
              window.zarget$(ele).length < 1 ||
              window.zarget$(ref).length < 1
            ) {
              Zarget.log(
                "Cannot perform rearrange. Reason : " +
                  ref +
                  " or " +
                  ele +
                  " not found."
              );
              return;
            }
            switch (pos) {
              case "after":
                window.zarget$(ele).detach().insertAfter(window.zarget$(ref));
                break;
              case "before":
                window.zarget$(ele).detach().insertBefore(window.zarget$(ref));
                break;
              case "append":
                window.zarget$(ref).append(window.zarget$(ele).detach());
                break;
              case "prepend":
                window.zarget$(ref).prepend(window.zarget$(ele).detach());
                break;
            }
          }
          window
            .zarget$(ele)
            .css({ position: "relative", top: "0px", left: "0px" });
        }
        function addDataAttribute(element, attrName, value) {
          if (!element || !attrName || !value) {
            return;
          }
          window.zarget$(element).data(attrName, value);
        }
        function getDataAtrribute(element, attrName) {
          if (!element || !attrName) {
            return;
          }
          if (window.zarget$(element) && window.zarget$(element).length) {
            return window.zarget$(element).data(attrName);
          }
        }
        function getStringHash(string) {
          var hash = 0;
          string = string.toString();
          for (var i = 0; i < string.length; i++) {
            hash = ((hash << 5) - hash + string.charCodeAt(i)) & 4294967295;
          }
          return hash;
        }
        function getObjhash(obj) {
          var result = 0;
          for (var property in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, property)) {
              result += getStringHash(property + hashValue(obj[property]));
            }
          }
          return result;
        }
        function hashValue(value) {
          var type = value == undefined ? undefined : typeof value;
          return MAPPER[type] ? MAPPER[type](value) + getStringHash(type) : 0;
        }
        var MAPPER = {};
        MAPPER.string = getStringHash;
        MAPPER.number = getStringHash;
        MAPPER["boolean"] = getStringHash;
        MAPPER.object = getObjhash;
        function isGeoRequestFinished() {
          if (
            !window.zarget_geoDetails &&
            new Date().getTime() <= window.zarget_geo_requestedtime + 1000
          ) {
            return false;
          }
          return true;
        }
        function setCookieForVariation(masterCookie, experiment) {
          var age = 365 * 24 * 60 * 60 * 1000,
            variation = masterCookie.variationId,
            vobj = typeof visitorinfo === "object" ? visitorinfo : {};
          vobj[experiment.lid] = variation.zg_variation_id;
          Zarget.setCookie(
            Zarget.visitorInfoCookie,
            encodeURIComponent(Zarget.stringifyJSON(vobj)),
            age
          );
          window.zarget_isCrossDomainProcessOngoing = false;
        }
        function processCrossDomainExperiment(masterCookie, exp) {
          var age = 365 * 24 * 60 * 60 * 1000,
            visitorinfo = Zarget.getVisitorInfo(),
            variation;
          if (masterCookie.variationId != null) {
            window.zarget_isCrossDomainProcessOngoing = false;
            setCookieForVariation(masterCookie, exp.experiment);
            startGoalTracking();
            exp.rememberVisitor(masterCookie.variationId.zg_variation_id);
            exp.sendVisitorInfo(false, true);
            visitorinfo = Zarget.getVisitorInfo();
            variation = exp.getVariation(visitorinfo[exp.experiment.lid]);
            exp.route(variation);
          } else {
            var variation = exp.getVariation(visitorinfo[exp.experiment.lid]);
            if (!variation) {
              var variation = exp.pickvariation();
              if (!variation) {
                return;
              }
              Zarget.getVariationForExperimentAndUser(
                exp.experiment.id,
                variation,
                processCrossDomainExperiment,
                exp
              );
            }
          }
        }
        function getCookieFinished(experiment, callback, expObj) {
          if (window.zarget_isCrossDomainProcessOngoing === undefined) {
            Zarget.getVariationForExperimentAndUser(
              experiment.id,
              null,
              callback,
              expObj
            );
            window.zarget_isCrossDomainProcessOngoing = true;
            return false;
          } else {
            if (window.zarget_isCrossDomainProcessOngoing) {
              return false;
            } else {
              return true;
            }
          }
        }
        function getGoalsByIds(goalsArr) {
          var goalsObj = [];
          if (goalsArr.hasOwnProperty("experiment")) {
            if (goalsArr.hasOwnProperty("goals")) {
              var goalsData = goalsArr.goals;
              for (var key in goalsData) {
                goalsObj.push(goalsData[key]);
              }
            }
          } else {
            goalsArr.map(function (goal) {
              goalsObj.push(ZargetData.goals[goal]);
            });
          }
          return goalsObj;
        }
        function getAudienceById(exp) {
          var audienceObj = {};
          if (exp.hasOwnProperty("experiment")) {
            if (exp.hasOwnProperty("target")) {
              return exp.target;
            }
          } else {
            if (ZargetData.audiences.hasOwnProperty(exp.audienceid)) {
              return ZargetData.audiences[exp.audienceid];
            }
          }
          return audienceObj;
        }
        var PreviewBridge = (function () {
          function PreviewBridge(exp, prevModeData) {
            var previewCDN = Zarget.serverinfo.previewToolbarURL;
            this.previewJsURL = previewCDN + "/preview.min.js";
            this.previewJsId = "zgPreviewScript";
            this.previewCssId = "zgPreviewStyle";
            this.previewCssURL = previewCDN + "/preview.min.css";
            window.zargetPreviewData = {};
            try {
              window.zargetPreviewData.isPrevMode = prevModeData;
              if (exp !== "EXPIRED") {
                window.zargetPreviewData.prevModeExperiment = exp;
                window.zargetPreviewData.goals = ZargetData.goals;
                window.zargetPreviewData.audience = ZargetData.audiences;
              } else {
                window.zargetPreviewData.prevModeExperiment = "EXPIRED";
              }
              this.injectPreviewScripts();
            } catch (e) {
              Zarget.log("prevModeExperiment " + e);
            }
          }
          PreviewBridge.prototype.injectPreviewScripts = function () {
            Zarget.log(
              "@@@@@ User has privileges to see heatmap report for current page. @@@@@@@@"
            );
            var that = this;
            var script = document.querySelector("#" + this.previewJsId),
              link = document.querySelector("#" + this.previewCssId);
            if (!script) {
              Zarget.importScript(
                that.previewJsURL,
                that.previewJsId,
                function () {
                  if (!link) {
                    Zarget.importStyle(
                      that.previewCssURL,
                      that.previewCssId,
                      function () {},
                      previewLoadhandleFailure
                    );
                  }
                },
                previewLoadhandleFailure
              );
            } else {
              previewLoadhandleFailure();
              Zarget.log("@@@ Heatmap toolbar script is already injected @@@@");
            }
          };
          return PreviewBridge;
        })();
        function previewLoadhandleFailure() {
          Zarget.log("previewLoad failed");
        }
        Zarget.isPreviewMode = function () {
          return getPrevModeInfo();
        };
        Zarget.isExpEditMode = function () {
          try {
            queryArray = Zarget.parseURL(document.URL).query;
            return queryArray && queryArray.zarget_edit_mode === "true";
          } catch (e) {
            return false;
          }
        };
        function getPrevModeInfo() {
          var queryArray, prevMode;
          try {
            queryArray = Zarget.parseURL(document.URL).query;
            if (
              queryArray &&
              queryArray.zarget_preview_debugmode === "true" &&
              queryArray.zarget_preview_varinfo &&
              queryArray.zarget_preview_varid &&
              queryArray.zarget_preview_token
            ) {
              prevMode = {};
              prevMode.debugmode = queryArray.zarget_preview_debugmode;
              prevMode.hashid = queryArray.zarget_preview_varinfo;
              prevMode.varid = queryArray.zarget_preview_varid;
              prevMode.authToken = queryArray.zarget_preview_token;
              prevMode.isMobilePreview = queryArray.isMobilePreview;
            }
            return prevMode;
          } catch (err) {
            return false;
          }
        }
        isPrevMode = getPrevModeInfo();
        function getVariationById(experimentData, variationId) {
          if (
            experimentData &&
            experimentData.hasOwnProperty("variations") &&
            experimentData.variations
          ) {
            var selectedVar = window.zarget$.grep(
              experimentData.variations,
              function (variation) {
                if (String(variation.id) === String(variationId)) {
                  return variation;
                }
              }
            );
            return selectedVar[0];
          }
        }
        function queryPrevVariation(prevModeInfo) {
          var prevAuthurl = Zarget.serverinfo.getFullPath(
            Zarget.serverinfo.previewurl,
            {
              varid: prevModeInfo.varid,
              varhashinfo: prevModeInfo.hashid,
              authToken: prevModeInfo.authToken,
            },
            false
          );
          var headers = {};
          headers[Zarget.heatmapUiConfig.zarget_cors_header] = true;
          headers[Zarget.heatmapUiConfig.zarget_cors_expid_header] =
            prevModeInfo.expid;
          headers[Zarget.heatmapUiConfig.zarget_cors_origin_url] = document.URL;
          window.zarget$
            .ajax({
              url: prevAuthurl,
              method: "GET",
              headers: headers,
              crossDomain: true,
              xhrFields: { withCredentials: true },
            })
            .done(function (data, textStatus, xhr) {
              var response = JSON.parse(xhr.responseText);
              if (response && response.get) {
                try {
                  prevModeExperiment = response.get;
                  if (prevModeExperiment === "NULL") {
                    prevModeExperiment = "EXPIRED";
                    prevModeVariation = "EXPIRED";
                    return prevModeVariation;
                  }
                  var abPrev = getVariationById(
                    prevModeExperiment.experiment,
                    prevModeInfo.varid
                  );
                  if (abPrev) {
                    prevAppliedvarName = abPrev.name;
                    if (abPrev) {
                      prevModeVariation = abPrev;
                    }
                  }
                } catch (e) {
                  Zarget.log("error in get preview " + e);
                }
                return abPrev;
              }
            })
            .fail(function (xhr, textStatus, errorThrown) {
              Zarget.log("Unable to get previw details.");
            });
        }
        function getVariaonByExpidVarid(expid, varid) {
          if (ZargetData.experiments.hasOwnProperty(expid)) {
            prevModeExperiment = ZargetData.experiments[expid];
            var variation = getVariationById(prevModeExperiment, varid);
            prevAppliedvarName = variation.name;
            return variation;
          }
        }
        function getPreviewVariation(prevModeInfo) {
          var variationForPreview;
          prevModeVariation = getVariaonByExpidVarid(
            prevModeInfo.hashid,
            prevModeInfo.varid
          );
          if (!prevModeVariation) {
            variationForPreview = queryPrevVariation(prevModeInfo);
          }
          return variationForPreview;
        }
        function applyAbPreview(prevModeVariationChanges) {
          var exp = Experiment(prevModeVariationChanges);
          if (prevModeVariationChanges) {
            var i, l;
            for (i = 0, l = prevModeVariationChanges.length; i < l; i++) {
              exp.applyabtestchange(prevModeVariationChanges[i]);
            }
          }
        }
        var prevModeVariation;
        function initAbPreview() {
          var prevModeInfo;
          prevModeInfo = getPrevModeInfo();
          if (prevModeInfo) {
            getPreviewVariation(prevModeInfo);
          }
        }
        var variationCounter = 0;
        function startAbPreview() {
          try {
            variationCounter++;
            if (variationCounter < 4 && !prevModeVariation) {
              var checkVariationTimeout = window.setTimeout(
                startAbPreview,
                1000
              );
            } else {
              if (checkVariationTimeout) {
                window.clearTimeout(checkVariationTimeout);
              }
              if (prevModeVariation) {
                try {
                  var expHashId = prevModeExperiment.experiment
                    ? prevModeExperiment.experiment.id
                    : prevModeExperiment.id;
                  if (expHashId) {
                    window.zarget$.ajax({
                      url:
                        Zarget.serverinfo.serverurl +
                        "/ab/api/domain/" +
                        expHashId +
                        "/account/",
                      method: "GET",
                      crossDomain: true,
                      dataType: "json",
                      xhrFields: { withCredentials: true },
                      success: function (res) {
                        var domain = res[res.resource_name]["result"];
                        if (!domain) {
                          return;
                        }
                        var domainUrl = domain.includes("https://")
                          ? domain
                          : "https://" + domain;
                        window.fm_domain = domainUrl;
                        Zarget.serverinfo.serverurl = domainUrl;
                        Zarget.serverinfo.secureServerURL = domainUrl;
                        new PreviewBridge(prevModeExperiment, isPrevMode);
                      },
                      error: function () {
                        Zarget.log("error::", arguments);
                      },
                    });
                    return;
                  }
                  new PreviewBridge(prevModeExperiment, isPrevMode);
                } catch (e) {
                  Zarget.log("Unable to open previw editor. " + e);
                }
              }
            }
          } catch (e) {
            Zarget.log("Error in Preview  ", e);
          }
        }
        function trackPageViewForEachExperiment() {
          function lc(a) {
            return (a || "").toLowerCase();
          }
          try {
            if (ZargetData.experiments) {
              var e,
                experimentData,
                pageView = {};
              pageView = Zarget.extractStorageData("pageViewCookie");
              var currurl = Zarget.parseURL(document.URL);
              var finalUrl = lc(currurl.authority) + lc(currurl.path);
              var url = encodeURI(finalUrl);
              if (pageView === undefined) {
                pageView = {};
              }
              if (pageView.hasOwnProperty(url)) {
                pageView[url]["visitedN"] =
                  parseInt(pageView[url]["visitedN"]) + 1;
                ZargetData.pageLastVisited = pageView[url]["lastVisited"];
                ZargetData.isFirstVisit = false;
                pageView[url]["lastVisited"] = +new Date();
              } else {
                pageView[url] = {};
                pageView.count =
                  pageView.count === undefined
                    ? 1
                    : parseInt(pageView.count) + 1;
                pageView[url]["visitedN"] = 1;
                pageView[url]["firstVisited"] = +new Date();
                pageView[url]["lastVisited"] = +new Date();
                ZargetData.isFirstVisit = true;
                ZargetData.pageLastVisited = pageView[url]["lastVisited"];
              }
              Zarget.setStorage(
                "pageViewCookie",
                encodeURIComponent(Zarget.stringifyJSON(pageView))
              );
            }
          } catch (e) {
            Zarget.log("Error in pagetrack " + e);
          }
        }
        function setup() {
          if (experiment && experiment.type === 8) {
            return;
          }
          var b = window.zarget$("body");
          if (b.length === 0) {
            window.setTimeout(setup, 20);
            return;
          } else {
            if (!executioncompleted) {
              b.css("visibility", "hidden");
            } else {
              b.css("visibility", "");
            }
          }
        }
        function cleanup() {
          window.zarget$("body").unbind("mousedown", handleVisitorclick);
          window.zarget$("body").unbind("mousedown", handleFormSubmit);
        }
        function tearDown() {
          var b = window.zarget$("body");
          b.css("visibility", "");
        }
        function bindEvents() {
          cleanup();
          window.zarget$("body").bind("mousedown", handleVisitorclick);
          window.zarget$("body").bind("submit", handleFormSubmit);
        }
        function startGoalTracking() {
          window.zarget$(document).ready(bindEvents);
        }
        function checkUserInfoTimeGoal() {
          var visitorInfo = Zarget.getVisitorInfo();
          var timeGoalExperiment = [];
          for (var j = 0, exp; (exp = experiments[j]); j++) {
            if (!exp.isRunning) {
              continue;
            }
            var eid = exp.experiment.id;
            var allGoals = ZargetData.experiments[eid].goals;
            var trackTimeGoalArr = [];
            var hasTimeGoal = false;
            for (var i = 0, l = allGoals.length; i < l; i++) {
              if (ZargetData.goals[allGoals[i]].type === 9) {
                hasTimeGoal = true;
                trackTimeGoalArr.push({
                  goal: ZargetData.goals[allGoals[i]],
                  status: false,
                });
              }
            }
            if (hasTimeGoal) {
              if (ZargetData.experiments[eid].type === 4) {
                if (
                  Zarget.isExperimentURLMatches(ZargetData.experiments[eid]) ||
                  Zarget.matchSplitFunc(ZargetData.experiments[eid])
                ) {
                  timeGoalExperiment.push({
                    experiment: ZargetData.experiments[eid],
                    goals: trackTimeGoalArr,
                  });
                }
              } else {
                if (
                  Zarget.isExperimentURLMatches(ZargetData.experiments[eid])
                ) {
                  timeGoalExperiment.push({
                    experiment: ZargetData.experiments[eid],
                    goals: trackTimeGoalArr,
                  });
                }
              }
            }
            if (timeGoalExperiment) {
              timeGoalExperimentIteration(timeGoalExperiment, visitorInfo);
            }
          }
        }
        function samplingExps(exp) {
          return (
            exp.type === EXPERIMENT_TYPES.FORM ||
            exp.type === EXPERIMENT_TYPES.FUNNEL ||
            exp.type === EXPERIMENT_TYPES.HEATMAP
          );
        }
        function dataSamplingCondition(exp) {
          var randomPercentage = Math.floor(Math.random() * 100);
          if (samplingExps(exp)) {
            var samplePercentage = ZargetData.samplePercentage;
            return randomPercentage <= samplePercentage;
          }
          return true;
        }
        function init(exp) {
          try {
            exp.startExperiment();
            Zarget.setUserID();
            window.zargetAPI.expLoaded = true;
            document.body &&
              document.body.dispatchEvent &&
              document.body.dispatchEvent(window.expEvt);
          } catch (e) {
            Zarget.log(e);
          } finally {
            executioncompleted = true;
            tearDown();
          }
          if (window.zargetAPI.length) {
            var queueData = convertToTwoDimesional(window.zargetAPI);
            for (var j = 0; j < queueData.length; j++) {
              zargetAPI.push.apply([], queueData[j]);
            }
          }
        }
        function convertToTwoDimesional(arr) {
          var arr2 = [],
            arr1 = [];
          while (arr.length) {
            var first = arr.splice(0, 1)[0];
            if (first.toString().indexOf("zg_") === 0) {
              if (arr1.length) {
                arr2.push(arr1);
              }
              arr1 = [];
            }
            arr1.push(first);
          }
          arr2.push(arr1);
          return arr2;
        }
        function setGeoTargeting(data) {
          window.zarget_geoDetails = data;
          if (!Zarget.isVisitorLocationInLocalStorage()) {
            window.localStorage.zarget_visitor_location = Zarget.stringifyJSON(
              window.zarget_geoDetails
            );
          }
        }
        function getCookie(n) {
          var r = new RegExp(n + "=([^\\s;]*)"),
            m = document.cookie.match(r);
          return n && m ? decodeURIComponent(m[1]) : "";
        }
        function getQueryparam(name, url) {
          if (!url) {
            url = window.location.href;
          }
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
          if (!results) {
            return null;
          }
          if (!results[2]) {
            return "";
          }
          return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        window.zargetAPI.manualTriggerExperiment = function () {
          try {
            experiments.splice(0);
            Zarget.findExperiment(experiments, Experiment);
            makeGeoRequest(experiments);
            window.zarget$.each(experiments, bulkReq);
            ZargetData.curexp = experiments;
            if (experiments.length) {
              for (var i = 0, exp; (exp = experiments[i]); i++) {
                triggerExperiment(exp);
              }
              Zarget.initScrollHeatMap();
              trackingOn = true;
            } else {
              if (trackingOn) {
                cleanup();
                Zarget.clearScrollHeatMap();
                trackingOn = false;
              }
            }
          } catch (e) {
            Zarget.log("caught exception in manualStart " + e);
          }
        };
        window.triggerHeatmapExperiment = window.triggerHeatmapExperiment || [];
        window.triggerHeatmapExperiment.push = function (uniqueid) {
          try {
            for (var e in ZargetData.experiments) {
              var expDet = ZargetData.experiments[e];
              if (
                expDet.type === 3 &&
                expDet.activationModeCondition !== null &&
                expDet.activationModeCondition === uniqueid &&
                !checkExcludeURL(expDet)
              ) {
                var experiment = Experiment(expDet);
                if (!experiments.isExists(expDet.id)) {
                  experiments.push(experiment);
                }
                ZargetData.curexp = experiments;
                Zarget.initScrollHeatMap();
              }
            }
          } catch (e) {
            Zarget.log("caught exception in Heatmap Exp Start " + e);
          }
        };
        function checkExcludeURL(expDet) {
          var exclude = false;
          if (expDet.excludeUrls && expDet.excludeUrls.length > 0) {
            var obj = window.zarget$.grep(expDet.excludeUrls, function (obj) {
              return obj.url === expDet.url;
            })[0];
            exclude = obj ? true : false;
          }
          return exclude;
        }
        window.bulkDetails = {};
        function bulkReq(ind, exp) {
          var experiment = exp.experiment;
          exp.finishBulkReq = false;
          if (
            experiment &&
            experiment.type !== 3 &&
            exp.isBulkRequest() &&
            !exp.isAlreadyVisitedUser()
          ) {
            var audiences =
              ZargetData.audiences[experiment.audienceid].conditions;
            var bulkAudiences = [];
            window.zarget$.each(audiences, function (id, audience) {
              window.zarget$.each(
                audience.conditions,
                function (idx, condition) {
                  if (condition.type === "bulkaudience") {
                    bulkAudiences.push(condition);
                  }
                }
              );
            });
            var reqPayload = {};
            window.zarget$.each(bulkAudiences, function (idx1, bulkCondition) {
              var val;
              if (bulkCondition.value.n === 0) {
                val = getQueryparam(bulkCondition.value.v.NAME);
              } else {
                val = getCookie(bulkCondition.value.v.NAME);
              }
              if (val) {
                reqPayload[bulkCondition.value.v.ID] = val;
              } else {
                window.bulkDetails[bulkCondition.value.v.ID] = false;
              }
            });
            if (Object.keys(reqPayload).length) {
              reqPayload.encid = experiment.id;
              window.zarget_bulk_requestedtime = new Date().getTime();
              var headers = { "X-Osm-CSRF": "9390uasldkhf8" };
              window.zarget$
                .ajax({
                  url: serverurl + "/ab/api/search/audience",
                  method: "GET",
                  data: reqPayload,
                  dataType: "json",
                  contentType: "application/json",
                  headers: headers,
                  crossDomain: true,
                  xhrFields: { withCredentials: true },
                })
                .done(function (data, textStatus, xhr) {
                  var response = JSON.parse(xhr.responseText);
                  var bulkRes = JSON.parse(response.audience || "{}");
                  for (var key in bulkRes) {
                    window.bulkDetails[key] = bulkRes[key];
                  }
                })
                .fail(function (xhr, textStatus, errorThrown) {
                  Zarget.log("Unable to get preview details.");
                })
                .always(function () {
                  exp.finishBulkReq = true;
                });
            } else {
              exp.finishBulkReq = true;
            }
          } else {
            exp.finishBulkReq = true;
          }
        }
        function makeGeoRequest(exps) {
          if (
            ((exps.length && exps.isGeoExp()) ||
              ZargetData.project.excludeIps.length) &&
            !Zarget.isVisitorLocationInLocalStorage()
          ) {
            window.zarget_geo_requestedtime = new Date().getTime();
            var b =
                document.head ||
                document.getElementsByTagName("head")[0] ||
                document.documentElement,
              a = document.createElement("script");
            a.type = "text/javascript";
            a.async = !0;
            a.src = "//ip.freshmarketer.com/json/?callback=setGeoTargeting";
            b.insertBefore(a, b.firstChild);
            window.setGeoTargeting = setGeoTargeting;
          }
          if (Zarget.isVisitorLocationInLocalStorage()) {
            window.zarget_geoDetails = Zarget.getVisitorLocation();
          }
        }
        function triggerExperiment(exp) {
          try {
            if (
              exp &&
              exp.experiment &&
              !window.zarget$.isEmptyObject(exp.experiment)
            ) {
              if (exp.experiment.type !== 3) {
                if (exp.isReadyToRedirectSplitURL()) {
                  init(exp);
                } else {
                  (function (exp) {
                    window.zarget$(document).ready(function () {
                      init(exp);
                    });
                  })(exp);
                }
              }
            }
          } catch (e) {
            Zarget.log("caught exception in triggerExperiment " + e);
          }
        }
        function triggerExpById(expId) {
          var visitorinfo = Zarget.getVisitorInfo(),
            expDet;
          for (var exp in visitorinfo) {
            expDet = Zarget.isLidExists(ZargetData.experiments, exp);
            if (!expDet || expDet.type === 7) {
              continue;
            }
            if (exp.id === expId) {
              var experiment = Experiment(expDet);
              if (!experiments.isExists(expId)) {
                experiments.push(experiment);
              }
              ZargetData.curexp = experiments;
              Zarget.initScrollHeatMap();
              triggerExperiment(experiment);
              return;
            }
          }
          for (var e in ZargetData.experiments) {
            expDet = ZargetData.experiments[e];
            if (expDet.type === 5 || expDet.type === 7) {
              continue;
            }
            if (e === expId) {
              var experiment = Experiment(expDet);
              if (!experiments.isExists(expId)) {
                experiments.push(experiment);
              }
              ZargetData.curexp = experiments;
              Zarget.initScrollHeatMap();
              triggerExperiment(experiment);
            }
          }
        }
        window.zargetAPI.triggerTargetExp = function (expId) {
          if (
            expId &&
            ZargetData.experiments.hasOwnProperty(expId) &&
            Zarget.isExperimentURLMatches(ZargetData.experiments[expId])
          ) {
            triggerExpById(expId);
          }
        };
        var trackingOn = false;
        function pollForConditionalActivation(exp) {
          exp.abPollTimer = setInterval(function () {
            try {
              var conditionMet = new Function(
                "return " + exp.experiment.activationModeCondition
              )();
              if (typeof conditionMet === "function") {
                conditionMet = conditionMet();
              }
              if (conditionMet) {
                triggerExpById(exp.experiment.id);
                if (!trackingOn) {
                  Zarget.initScrollHeatMap();
                  trackingOn = true;
                }
                clearInterval(exp.abPollTimer);
              } else {
                if (trackingOn) {
                  cleanup();
                  Zarget.clearScrollHeatMap();
                  trackingOn = false;
                }
              }
            } catch (e) {
              Zarget.log("caught exception in conditional polling ", e);
            }
          }, 300);
        }
        if (window.zarget === undefined || window.zarget === true) {
          if (window.zarget !== undefined) {
            clearTimeout(window.zargetTimer);
          }
          try {
            Zarget.log("JS Code Execution started");
            var jsCode = new Function(ZargetData.project.projectJS);
            jsCode();
          } catch (e) {
            Zarget.log("Some Error While Executing Project JavaScriptCode" + e);
          }
          Zarget.findExperiment(experiments, Experiment);
          function trackKeyUp(e) {
            if (
              e.ctrlKey &&
              e.shiftKey &&
              e.keyCode === 72 &&
              ZargetData.curexp &&
              ZargetData.curexp.length
            ) {
              window.setTimeout(function () {
                var visitorinfo = Zarget.getVisitorInfo(),
                  experiment = ZargetData.curexp[0].experiment;
                window.zargetCurVariation = visitorinfo[experiment.id];
                if (experiment.id) {
                  var domainObj = {
                    expHashId: experiment.id,
                    experiment: experiment,
                  };
                  Zarget.getDomainByExperimentId(domainObj, Zarget.initHeatmap);
                } else {
                  Zarget.initHeatmap(experiment);
                }
              }, 50);
            }
          }
          window
            .zarget$(window)
            .off("keyup", trackKeyUp)
            .on("keyup", trackKeyUp);
          if (
            experiments.length &&
            Zarget.isReportView &&
            Zarget.isReportView()
          ) {
            ZargetData.curexp = experiments;
            return;
          }
          var variationExpMap = {};
          function initExperiment() {
            for (var i = 0, exp; (exp = experiments[i]); i++) {
              if (!exp.isAlreadyVisitedUser()) {
                var experiment = exp.experiment;
                var audience = ZargetData.audiences[experiment.audienceid];
                if (exp.isGeoRequest() || exp.isBulkRequest()) {
                  Zarget.log("Waiting for geo/bulk targeting to finish");
                  return;
                }
                if (
                  experiment.hasOwnProperty("audienceid") &&
                  !Zarget.matchesTargeting(
                    ZargetData.audiences[experiment.audienceid]
                  )
                ) {
                  Zarget.log("Targeting failed");
                  return;
                }
                if (!isPrevMode) {
                  var variation = exp.pickvariation();
                  if (!variation) {
                    break;
                  }
                  variationExpMap[experiment.lid] = variation.id;
                }
              }
            }
          }
          if (experiments.length && !isPrevMode) {
            try {
              initExperiment();
            } catch (e) {
              Zarget.log("exception in initExperiment");
            }
          }
          makeGeoRequest(experiments);
          window.zarget$.each(experiments, bulkReq);
          if (!isPrevMode) {
            trackPageViewForEachExperiment();
          }
          if (experiments.length && !isPrevMode) {
            ZargetData.curexp = experiments;
            for (var j = 0, exp; (exp = experiments[j]); j++) {
              if (exp.getExpertmentType() !== EXPERIMENT_TYPES.HEATMAP) {
                if (
                  exp.experiment &&
                  exp.experiment.hasOwnProperty("activationMode")
                ) {
                  if (exp.experiment.activationMode === 2) {
                    Zarget.log("waiting for manual activiation... ");
                    continue;
                  } else {
                    if (exp.experiment.activationMode === 3) {
                      Zarget.log("conditional activation... ");
                      pollForConditionalActivation(exp);
                      continue;
                    }
                  }
                }
                setup();
                if (exp.isReadyToRedirectSplitURL()) {
                  init(exp);
                } else {
                  (function (exp) {
                    Zarget.READYSTATE_RGX = Zarget.ie
                      ? /complete/
                      : /complete|interactive/;
                    Zarget.domReady =
                      document.readyState &&
                      Zarget.READYSTATE_RGX.test(document.readyState);
                    if (Zarget.domReady) {
                      init(exp);
                    } else {
                      window.fm_$(document).ready(function () {
                        init(exp);
                      });
                    }
                  })(exp);
                }
              }
            }
          } else {
            if (isPrevMode) {
              try {
                initAbPreview();
                Zarget.log("preview start ");
                window.zarget$(document).ready(startAbPreview);
              } catch (e) {
                Zarget.log("exception in preview " + e);
              }
            }
          }
        }
        try {
          trackPageVisits();
        } catch (e) {
          Zarget.log(e);
        }
        window.ZargetUrlChangeTrigger.register(trackPageVisits);
      })(Zarget, ZargetData);
      (function (Zarget, ZargetData) {
        if (
          typeof ZargetData === "undefined" ||
          !ZargetData.hasOwnProperty("experiments")
        ) {
          return;
        }
        if (Zarget.isOptedOut()) {
          return;
        }
        var experiments = ZargetData.curexp;
        if (!experiments || !experiments.length) {
          var experiment = Zarget.findHeatMapExperiment();
          if (experiment) {
            ZargetData.curexp = [{ experiment: experiment }];
            experiments = ZargetData.curexp;
          }
        }
        if (Zarget.isReportView && Zarget.isReportView()) {
          var hashParams = Zarget.isPausedExp(),
            orgid,
            expid,
            expHashId,
            varid,
            expInfo,
            segName,
            segType;
          if (hashParams) {
            orgid = hashParams.orgid;
            expid = hashParams.expid;
            varid = hashParams.varid;
            segName = hashParams.segName;
            segType = hashParams.segType;
            expHashId = hashParams.expHashId;
          }
          if (
            window.localStorage &&
            window.localStorage.zargetextexpinfo &&
            !expid &&
            !varid
          ) {
            expInfo = JSON.parse(window.localStorage.zargetextexpinfo);
            orgid = expInfo.orgid;
            expid = expInfo.expid;
            varid = expInfo.varid;
            segName = expInfo.segName;
            segType = expInfo.segType;
            expHashId = expInfo.expHashId;
            window.localStorage.removeItem("zargetextexpinfo");
          }
          if (segName != null && segType != null) {
            window.zg_heatmap_segment_name = segName;
            window.zg_heatmap_segment_type = segType;
          }
          if (orgid && expid && varid) {
            if (expHashId) {
              var domainObj = {
                orgid: orgid,
                expid: expid,
                varid: varid,
                expHashId: expHashId,
              };
              Zarget.getDomainByExperimentId(
                domainObj,
                Zarget.initPausedExperiment
              );
              return;
            }
            Zarget.initPausedExperiment(orgid, expid, varid);
          } else {
            if (experiments && experiments.length) {
              if (experiments[0].experiment) {
                if (experiments[0].experiment.id) {
                  var domainObj = {
                    expHashId: experiments[0].experiment.id,
                    experiment: experiments[0].experiment,
                  };
                  Zarget.getDomainByExperimentId(domainObj, Zarget.initHeatmap);
                  return;
                }
              }
              Zarget.initHeatmap(experiments[0].experiment);
              return;
            }
          }
        } else {
          window.ZargetUrlChangeTrigger.register(onSPAPageTransition);
        }
        Zarget.w = window;
        Zarget.n = navigator;
        Zarget.d = document;
        var serverurl = Zarget.serverinfo.serverurl;
        var heatmapurl = Zarget.serverinfo.heatmapUrl;
        (function () {
          var ua = navigator.userAgent;
          Zarget.webkit = /\bChrome\b/.test(ua);
          Zarget.ie = /\bMSIE\b/.test(ua);
          if (Zarget.webkit) {
            Zarget.webkitVersion = parseInt(
              /AppleWebKit\/(\d+)/.exec(ua)[1],
              10
            );
          }
        })();
        Zarget.on = function (c, evt, handler) {
          if (c.addEventListener) {
            c.addEventListener(evt, handler, true);
          } else {
            c.attachEvent("on" + evt, handler);
          }
        };
        Zarget.off = function (c, evt, handler) {
          if (c.removeEventListener) {
            c.removeEventListener(evt, handler, true);
          } else {
            c.detachEvent("on" + evt, handler);
          }
        };
        Zarget.scroll = function (c) {
          var b, a;
          c = c || Zarget.w;
          b = c.document;
          if (c.pageXOffset !== null) {
            return {
              left: c.pageXOffset,
              top: c.pageYOffset,
              width: c.innerWidth,
              height: c.innerHeight,
            };
          } else {
            a = b.compatMode === "BackCompat" ? b.body : b.documentElement;
            return {
              left: a.scrollLeft,
              top: a.scrollTop,
              width: a.offsetWidth,
              height: a.offsetHeight,
            };
          }
        };
        Zarget.getBox = function (e) {
          var g,
            h,
            d,
            i,
            f,
            b = {};
          if (e.getBoundingClientRect) {
            g = e.getBoundingClientRect();
            h = Zarget.scroll();
            b.left = Math.floor(g.left + h.left);
            b.top = Math.floor(g.top + h.top);
            if (
              Zarget.webkit &&
              Zarget.webkitVersion < 533 &&
              e.style.position === "relative"
            ) {
              b.left += parseInt(e.style.left, 10);
              b.top += parseInt(e.style.top, 10);
            }
            b.width = Math.floor(g.width || g.right - g.left);
            b.height = Math.floor(g.height || g.bottom - g.top);
          } else {
            b.width = e.offsetWidth;
            b.height = e.offsetHeight;
            d = e;
            i = 0;
            f = 0;
            do {
              i += d.offsetLeft || 0;
              f += d.offsetTop || 0;
              d = d.offsetParent;
            } while (d);
            b.left = Math.floor(i);
            b.top = Math.floor(f);
          }
          b.pageX = b.left;
          b.pageY = b.top;
          return b;
        };
        Zarget.getWindow = function (elem) {
          return elem !== null && elem === window
            ? elem
            : elem.nodeType === 9
            ? elem.defaultView || elem.parentWindow
            : false;
        };
        Zarget.offset = function (elem) {
          var docElem,
            win,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument,
            strundefined = typeof undefined;
          if (!doc) {
            return;
          }
          docElem = doc.documentElement;
          if (typeof elem.getBoundingClientRect !== strundefined) {
            box = elem.getBoundingClientRect();
          }
          win = Zarget.getWindow(doc);
          return {
            top:
              box.top +
              (win.pageYOffset || docElem.scrollTop) -
              (docElem.clientTop || 0),
            left:
              box.left +
              (win.pageXOffset || docElem.scrollLeft) -
              (docElem.clientLeft || 0),
          };
        };
        Zarget.isCustomMatch = function (exp) {
          var isMatches = Zarget.isExperimentURLMatches(exp);
          if (!isMatches) {
            var url = exp.urls[0];
            if (url && url.match === "custom") {
              return true;
            }
          }
          return isMatches;
        };
        Zarget.Tracker = function () {
          this.ignoredElements = ["body", "html", "head"];
          this.lastClickedElement = null;
          this.startTime = new Date().getTime();
          Zarget.on(document, "mousedown", this.handlers.click);
        };
        Zarget.Tracker.prototype = {
          isIgnoredElement: function (ele) {
            if (!ele) {
              return false;
            }
            var tagname = ele.tagName.toLowerCase();
            return this.ignoredElements.indexOf(tagname) !== -1;
          },
          handlers: {
            click: function (evt) {
              try {
                if (
                  window._ab__plugin__attached ||
                  window._ab__toolbar__attached
                ) {
                  return;
                }
                var el,
                  o,
                  x,
                  y,
                  s,
                  px,
                  py,
                  r,
                  b,
                  msg,
                  uid,
                  expid,
                  vid,
                  ttc,
                  url,
                  sch,
                  lid,
                  ety,
                  lang = Zarget.getUserLanguage(),
                  loadt = Zarget.getPageLoadTime(),
                  res = Zarget.getScreenResolution(),
                  referrer;
                el = evt.srcElement || evt.target;
                if (!el || Zarget.tracker.isIgnoredElement(el)) {
                  return;
                }
                var visitorinfo = Zarget.getVisitorInfo();
                for (var i = 0, exp; (exp = experiments[i]); i++) {
                  if (exp.experiment.type != 3) {
                    if (!exp.isRunning) {
                      continue;
                    }
                  }
                  if (!Zarget.isCustomMatch(exp.experiment)) {
                    continue;
                  }
                  if (!exp.experiment.heatmap) {
                    continue;
                  }
                  expid = exp.experiment.id;
                  lid = exp.experiment.lid;
                  if (exp.experiment.isCrossDomainExperiment) {
                    uid = window.zarget_masteruserid;
                  } else {
                    uid = Zarget.getUidAndSetIfNotExists();
                  }
                  if (!visitorinfo || !Zarget.isLidExists(experiments, lid)) {
                    continue;
                  }
                  if (visitorinfo[lid] === -1) {
                    continue;
                  }
                  vid = Zarget.getVisitorInfo()[lid];
                  s = encodeURIComponent(
                    Zarget.selector(el, exp.experiment.selectorExcludes)
                  );
                  url = encodeURIComponent(document.URL);
                  referrer = document.referrer;
                  o = Zarget.offset(el);
                  b = Zarget.getBox(el);
                  px = evt.pageX;
                  py = evt.pageY;
                  x = Math.round((1000 * (px - o.left)) / b.width) / 1000;
                  y = Math.round((1000 * (py - o.top)) / b.height) / 1000;
                  r = +new Date();
                  ttc = r - Zarget.tracker.startTime;
                  msg = new Zarget.Message(Zarget.MessageType.ADDSELECTOR);
                  var today = new Date();
                  var nowUTC =
                    today.getTime() + today.getTimezoneOffset() * 60000;
                  sch = exp.experiment.schedule;
                  ety = exp.experiment.type;
                  msg.setParam({
                    s: s,
                    x: x,
                    y: y,
                    r: r,
                    eid: expid,
                    vid: vid,
                    uid: uid,
                    ttc: ttc,
                    ety: ety,
                  });
                  msg = Zarget.checkCustomAttr(msg);
                  Zarget.xhrService.send(msg);
                }
              } catch (e) {
                Zarget.log(e);
              }
            },
          },
          cleanup: function () {
            Zarget.off(document, "mousedown", this.handlers.click);
          },
        };
        Zarget.READYSTATE_RGX = Zarget.ie ? /complete/ : /complete|interactive/;
        Zarget.domReady =
          document.readyState &&
          Zarget.READYSTATE_RGX.test(document.readyState);
        function rememberVisitor(variationid, lid) {
          if (!variationid) {
            return;
          }
          var age = 365 * 24 * 60 * 60 * 1000,
            visitorinfo = Zarget.getVisitorInfo(),
            vobj;
          vobj = typeof visitorinfo === "object" ? visitorinfo : {};
          if (variationid !== -1) {
            Zarget.setUserID();
          }
          if (!vobj.hasOwnProperty(lid)) {
            vobj[lid] = variationid;
            Zarget.setCookie(
              Zarget.visitorInfoCookie,
              encodeURIComponent(Zarget.stringifyJSON(vobj)),
              age
            );
          }
        }
        function sendVisitorInfo(exp, returning, rv) {
          var experiment = exp.experiment;
          var visitorinfo = Zarget.getVisitorInfo(),
            img,
            expid = experiment.id,
            lid = experiment.lid,
            varid,
            r,
            uid,
            url,
            referrer,
            type,
            msg,
            lang = Zarget.getUserLanguage(),
            loadt = Zarget.getPageLoadTime(),
            res = Zarget.getScreenResolution();
          if (!visitorinfo || !visitorinfo.hasOwnProperty(lid)) {
            return;
          }
          url = encodeURIComponent(document.URL);
          referrer = document.referrer;
          varid = visitorinfo[lid];
          type = returning
            ? Zarget.MessageType.UPDATEVISITOR
            : Zarget.MessageType.ADDVISITOR;
          if (experiment.isCrossDomainExperiment) {
            if (window.zarget_masteruserid) {
              uid = window.zarget_masteruserid;
              if (window.zarget_sendvisitortimeoutid4) {
                window.clearTimeout(window.zarget_sendvisitortimeoutid4);
              }
            } else {
              window.zarget_sendvisitortimeoutid4 = window.setTimeout(
                sendVisitorInfo,
                5,
                exp,
                returning,
                rv
              );
              return;
            }
          } else {
            uid = Zarget.getUidAndSetIfNotExists();
          }
          r = new Date().getTime();
          msg = new Zarget.Message(type);
          var today = new Date();
          var nowUTC = today.getTime() + today.getTimezoneOffset() * 60000;
          msg.setParam({
            eid: expid,
            uid: uid,
            vid: varid,
            r: r,
            ftv: !returning,
            ety: experiment.type,
          });
          typeof rv !== "undefined" && msg.addParam("ru", rv);
          msg = Zarget.checkCustomAttr(msg);
          Zarget.xhrService.send(msg);
        }
        var scrollRecords = [];
        var FM_SCROLL_LIMIT_PREFIX = "fm_scroll_limit_";
        var FM_SCROLL_MAX_LIMIT_PER_PAGE = 50;
        var ZargetScroll = {
          init: function () {
            ZargetScroll.lastRecordedTime = 0;
            ZargetScroll.lastRecordedY = 0;
            ZargetScroll.idleAt = null;
            ZargetScroll.idleSince = +new Date();
            ZargetScroll.lastRecordedScroll = null;
            ZargetScroll.IDLE_TIME = 1000;
            ZargetScroll.MIN_TRACK_TIME = 2000;
            ZargetScroll.EXIT_TIME = 30 * 60 * 1000;
            ZargetScroll.isScrolling = false;
            window.onscroll = function (e) {
              ZargetScroll.isScrolling = true;
              window.setTimeout(function () {
                ZargetScroll.isScrolling = false;
              }, 100);
            };
          },
          scroll: function (evt) {
            evt = evt || window;
            return {
              left: evt.pageXOffset,
              top: evt.pageYOffset,
              width: evt.innerWidth,
              height: evt.innerHeight,
            };
          },
          shouldRecord: function (e) {
            var top = e.top,
              height = e.height,
              pos = top + "," + height,
              time = +new Date();
            if (pos === ZargetScroll.lastRecordedScroll) {
              return !1;
            }
            if (pos === ZargetScroll.idleAt) {
              if (time - ZargetScroll.idleSince >= ZargetScroll.IDLE_TIME) {
                ZargetScroll.lastRecordedY = top;
                ZargetScroll.lastRecordedTime = time;
                ZargetScroll.lastRecordedScroll = pos;
                return !0;
              }
            } else {
              ZargetScroll.idleAt = pos;
              ZargetScroll.idleSince = time;
              if (
                null == ZargetScroll.lastRecordedScroll ||
                (Math.abs(top - ZargetScroll.lastRecordedY) >= height / 2 &&
                  time - ZargetScroll.lastRecordedTime >=
                    ZargetScroll.MIN_TRACK_TIME)
              ) {
                ZargetScroll.lastRecordedScroll = pos;
                ZargetScroll.lastRecordedTime = time;
                ZargetScroll.lastRecordedY = top;
                return !0;
              }
            }
            return !1;
          },
          trackScroll: function () {
            var e = ZargetScroll.scroll();
            if (!ZargetScroll.isScrolling && ZargetScroll.shouldRecord(e)) {
              ZargetScroll.sendScrollInfo(e);
            }
          },
          getScrollLimitKey: function (expid) {
            return FM_SCROLL_LIMIT_PREFIX + expid;
          },
          getScrollLimit: function (expid) {
            if (!expid) {
              return;
            }
            var key = this.getScrollLimitKey(expid),
              visitorInfo;
            if (Zarget.hasLocalStorage()) {
              visitorInfo = window.localStorage[key];
            }
            return visitorInfo ? JSON.parse(visitorInfo) : visitorInfo;
          },
          getScrollLimitForPage: function (expid) {
            var visitorInfo = ZargetScroll.getScrollLimit(expid);
            if (!visitorInfo) {
              return 0;
            }
            var path = Zarget.getCurrentPath();
            return visitorInfo[path];
          },
          setScrollLimit: function (expid) {
            if (!expid) {
              return;
            }
            var scrollInfo = 0,
              path = Zarget.getCurrentPath();
            var visitorInfo = ZargetScroll.getScrollLimit(expid);
            if (!visitorInfo) {
              visitorInfo = {};
            } else {
              scrollInfo = visitorInfo[path];
              scrollInfo = scrollInfo || 0;
            }
            scrollInfo += 1;
            visitorInfo[path] = scrollInfo;
            var key = this.getScrollLimitKey(expid);
            if (Zarget.hasLocalStorage()) {
              window.localStorage[key] = JSON.stringify(visitorInfo);
            }
          },
          sendScrollInfo: function (e) {
            var visitorinfo = Zarget.getVisitorInfo(),
              img,
              varid,
              expid,
              lid,
              r,
              uid,
              url,
              type,
              msg,
              y1,
              y2,
              lang = Zarget.getUserLanguage(),
              loadt = Zarget.getPageLoadTime(),
              res = Zarget.getScreenResolution(),
              referrer;
            if (!e || !e.hasOwnProperty("height") || !e.hasOwnProperty("top")) {
              Zarget.log("Insufficient scroll details.");
              return;
            }
            for (var i = 0, exp; (exp = experiments[i]); i++) {
              expid = exp.experiment.id;
              lid = exp.experiment.lid;
              if (!visitorinfo || !visitorinfo.hasOwnProperty(lid)) {
                continue;
              }
              if (visitorinfo[lid] === -1) {
                continue;
              }
              if (exp.experiment.type != 3) {
                if (!exp.isRunning) {
                  continue;
                }
              }
              if (!Zarget.isCustomMatch(exp.experiment)) {
                continue;
              }
              if (
                ZargetScroll.getScrollLimitForPage(lid) >
                FM_SCROLL_MAX_LIMIT_PER_PAGE
              ) {
                return;
              }
              ZargetScroll.setScrollLimit(lid);
              url = encodeURIComponent(document.URL);
              referrer = document.referrer;
              varid = visitorinfo[lid];
              type = Zarget.MessageType.UPDATEVISITOR;
              if (exp.experiment.isCrossDomainExperiment) {
                uid = window.zarget_masteruserid;
              } else {
                uid = Zarget.getUidAndSetIfNotExists();
              }
              r = new Date().getTime();
              msg = new Zarget.Message(type);
              y1 = e.top;
              y2 = y1 + e.height;
              msg.setParam({
                eid: expid,
                uid: uid,
                vid: varid,
                r: r,
                y1: y1,
                y2: y2,
                scroll: 1,
                height: e.height,
              });
              msg = Zarget.checkCustomAttr(msg);
              Zarget.xhrService.send(msg);
            }
          },
          cleanup: function () {
            ZargetScroll.lastRecordedY = null;
            ZargetScroll.lastRecordedTime = null;
            ZargetScroll.lastRecordedScroll = null;
            ZargetScroll.idleAt = null;
            ZargetScroll.idleSince = null;
            window.clearInterval(ZargetScroll.scrollInterval);
          },
        };
        function onSPAPageTransition() {
          var experiment = Zarget.findHeatMapExperiment();
          if (experiment) {
            ZargetData.curexp = [{ experiment: experiment }];
            experiments = ZargetData.curexp;
            onDOMReady();
          }
        }
        function onDOMReady() {
          if (Zarget.tracker) {
            Zarget.tracker.cleanup();
          }
          if (Zarget.notAllowSampledVisitor()) {
            return;
          }
          var uid = Zarget.getUidAndSetIfNotExists();
          Zarget.setCookie(uid, Zarget.SAMPLE_VISITED_USER);
          var userid = Zarget.getUidAndSetIfNotExists();
          for (var i = 0, exp; (exp = experiments[i]); i++) {
            var visitorInfo = Zarget.getVisitorInfo(),
              expid = exp.experiment.id,
              lid = exp.experiment.lid,
              variationID = visitorInfo ? visitorInfo[lid] : undefined,
              traffic,
              runExperiment,
              isReturningUser = visitorInfo && visitorInfo.hasOwnProperty(lid);
            if (variationID === -1) {
              continue;
            }
            if (exp.experiment.type === 3 && !isReturningUser) {
              traffic = Math.random() * 100;
              if (traffic <= exp.experiment.traffic) {
                rememberVisitor(exp.experiment.variations[0], lid);
                sendVisitorInfo(exp, false, userid ? true : false);
                runExperiment = true;
              } else {
                rememberVisitor(-1, lid);
                continue;
              }
            } else {
              if (isReturningUser) {
                sendVisitorInfo(exp, true);
              }
            }
          }
          Zarget.tracker = new Zarget.Tracker();
          ZargetScroll.init();
          ZargetScroll.cleanup();
          ZargetScroll.scrollInterval = window.setInterval(
            ZargetScroll.trackScroll,
            100
          );
        }
        Zarget.initScrollHeatMap = function () {
          Zarget.log("init scroll heat map");
          experiments = ZargetData.curexp;
          onDOMReady();
        };
        Zarget.clearScrollHeatMap = function () {
          Zarget.log("clear scroll heat map");
          ZargetScroll && ZargetScroll.cleanup();
          if (Zarget.tracker) {
            Zarget.tracker.cleanup();
          }
        };
        if (!experiments || !experiments.length) {
          return;
        }
        if (Zarget.domReady) {
          onDOMReady();
        } else {
          if (document.addEventListener) {
            Zarget.on(document, "DOMContentLoaded", onDOMReady);
          } else {
            Zarget.on(window, "load", onDOMReady);
          }
        }
      })(Zarget, ZargetData);
      (function (Zarget, ZargetData) {
        if (Zarget.isOptedOut()) {
          return;
        }
        var ZARGET_FUNNEL_STORAGE_PREFIX = "zarget_funnel_";
        var ZARGET_FUNNEL_VIRTUAL_PAGE = "zg_vpage";
        var FUNNEL_SESSION_EXPIRY = 30 * 24 * 60 * 60;
        var pendingExperiments = [];
        var requestAlreadyGoing = false;
        Zarget.Funnel = function (experiments) {
          this.experiments = experiments;
        };
        Zarget.Funnel.prototype = {
          callPendingExperiments: function (cookieObj, otherParams) {
            var funnel = new Zarget.Funnel(pendingExperiments);
            for (i = 0, l = pendingExperiments.length; i < l; i++) {
              funnel.sendMessage(pendingExperiments[i], otherParams);
            }
          },
          hasLocalStorage: function () {
            return !!window.localStorage;
          },
          start: function (customevent) {
            var runningFunnels = this.findMatchingFunnels(customevent),
              i,
              l;
            if (!runningFunnels && customevent) {
              Zarget.log(
                "No matching funnel experiments for this virtual page : ",
                customevent
              );
              return;
            }
            if (!runningFunnels || runningFunnels.length === 0) {
              Zarget.log("No running  funnel experiments on this page.");
              return;
            }
            for (i = 0, l = runningFunnels.length; i < l; i++) {
              if (runningFunnels[i].isCrossDomainExperiment) {
                if (!window.zarget_masteruserid) {
                  pendingExperiments.push(runningFunnels[i]);
                  if (!requestAlreadyGoing) {
                    requestAlreadyGoing = true;
                    Zarget.getVariationForExperimentAndUser(
                      runningFunnels[i].id,
                      null,
                      this.callPendingExperiments,
                      customevent
                    );
                  }
                  continue;
                }
              }
              this.sendMessage(runningFunnels[i], customevent);
            }
          },
          _trimWww: function (domain) {
            if (domain && domain.indexOf("www.") === 0) {
              return domain.substring(4);
            }
            return domain;
          },
          _contains: function (stepurl, presenturl) {
            try {
              var domain, matchType, path, curdomain, curpath, domainMatches;
              domain = this._trimWww(stepurl.domain.toLowerCase());
              if (presenturl) {
                var a = document.createElement("a");
                a.href = presenturl;
                curdomain = this._trimWww(a.hostname.toLowerCase());
                curpath = (a.pathname + a.search + a.hash || "").toLowerCase();
              } else {
                curdomain = this._trimWww(
                  window.location.hostname.toLowerCase()
                );
                curpath = (
                  window.location.pathname +
                    window.location.search +
                    window.location.hash || ""
                ).toLowerCase();
              }
              matchType = stepurl.match_type;
              path = stepurl.path && stepurl.path.toLowerCase();
              domainMatches =
                matchType === 0
                  ? domain === curdomain
                  : curdomain.indexOf(domain) > -1;
              return domainMatches && curpath.indexOf(path) > -1;
            } catch (e) {
              Zarget.log(
                "Step url object is not valid. " + e + " step url " + stepurl
              );
            }
          },
          _custom: function (match, event) {
            if (!match || !event) {
              return false;
            }
            return match.toLowerCase().trim() === event.toLowerCase().trim();
          },
          isRegexMatch: function (experiment, url, presenturl) {
            if (!experiment || !url) {
              return;
            }
            var urlsToMatch = experiment.urls,
              curUrl = url || document.URL,
              matches = false;
            for (var i = 0, spec, url, l = urlsToMatch.length; i < l; i++) {
              url = urlsToMatch[i];
              spec = url.url;
              switch (url.match) {
                case "substr":
                  matches = presenturl
                    ? this._contains(spec, curUrl) &&
                      this._contains(spec, presenturl)
                    : this._contains(spec);
                  break;
                case "regex":
                  matches = presenturl
                    ? Zarget.matcher(new RegExp(spec), curUrl, 5) &&
                      Zarget.matcher(new RegExp(spec), presenturl, 5)
                    : Zarget.matcher(new RegExp(spec), curUrl, 5);
                  break;
              }
              if (matches) {
                break;
              }
            }
            return matches;
          },
          findMatchingFunnels: function (customevent) {
            var curUrl,
              i,
              hasTrailingSlash,
              urlsToMatch,
              j,
              filteredFunnels = [],
              url,
              matches,
              spec;
            if (!this.experiments) {
              return;
            }
            curUrl = customevent || document.URL;
            for (i = 0; i < this.experiments.length; i++) {
              urlsToMatch = this.experiments[i].urls;
              var isSimple = false;
              for (j = 0; j < urlsToMatch.length; j++) {
                url = urlsToMatch[j];
                spec = url.url;
                matches = false;
                if (customevent && url.match != "custom") {
                  continue;
                }
                switch (url.match) {
                  case "simple":
                    matches = Zarget.matcher(spec, curUrl, 10);
                    isSimple = matches;
                    break;
                  case "exact":
                    matches = Zarget.matcher(spec, curUrl, 1);
                    break;
                  case "substr":
                    matches = this._contains(spec);
                    break;
                  case "startswith":
                    matches = Zarget.matcher(curUrl, spec, 8);
                    break;
                  case "endswith":
                    matches = Zarget.matcher(curUrl, spec, 9);
                    break;
                  case "regex":
                    matches = Zarget.matcher(new RegExp(spec), curUrl, 5);
                    break;
                  case "custom":
                    matches = this._custom(spec, customevent);
                    break;
                }
                if (matches) {
                  break;
                }
              }
              if (matches) {
                this.experiments[i].isSimple = isSimple;
                filteredFunnels.push(this.experiments[i]);
              }
            }
            return filteredFunnels;
          },
          rememberPage: function (experiment, virtualpage) {
            if (
              !experiment ||
              this.isAlreadyVisitedPage(experiment, virtualpage)
            ) {
              Zarget.log("Already visited page @@@@ ");
              return;
            }
            var expid = experiment.id;
            var visitorInfo = this.getVisitorInfo(experiment);
            visitorInfo = visitorInfo ? visitorInfo : [];
            var path = experiment.isSimple
              ? window.location.pathname
              : virtualpage ||
                window.location.pathname +
                  window.location.search +
                  window.location.hash;
            if (visitorInfo.indexOf(path) === -1) {
              visitorInfo.push(path);
              this.storeVisitorInfo(expid, visitorInfo);
            }
          },
          storeVisitorInfo: function (expid, visitorInfo) {
            if (!expid) {
              return;
            }
            var key = ZARGET_FUNNEL_STORAGE_PREFIX + expid;
            if (this.hasLocalStorage()) {
              window.localStorage[key] = JSON.stringify(visitorInfo);
            } else {
              Zarget.setCookie(
                key,
                JSON.stringify(visitorInfo),
                FUNNEL_SESSION_EXPIRY
              );
            }
          },
          sendMessage: function (experiment, virtualpage) {
            var expid = experiment.id,
              r,
              uid,
              url,
              referrer,
              type,
              msg,
              lang = Zarget.getUserLanguage(),
              loadt = Zarget.getPageLoadTime(),
              res = Zarget.getScreenResolution();
            url = encodeURIComponent(document.URL);
            referrer = document.referrer;
            if (experiment.isCrossDomainExperiment) {
              uid = window.zarget_masteruserid;
            } else {
              uid = Zarget.getUidAndSetIfNotExists();
            }
            r = new Date().getTime();
            msg = new Zarget.Message(Zarget.MessageType.ADDVISITOR);
            var today = new Date();
            var nowUTC = today.getTime() + today.getTimezoneOffset() * 60000;
            var params = {
              eid: expid,
              uid: uid,
              r: r,
              ety: experiment.type,
              isflexi: experiment.isFlexiOrder ? true : false,
            };
            if (virtualpage) {
              params.virtualpage = encodeURIComponent(virtualpage);
            }
            msg.setParam(params);
            if (
              (experiment.isFlexiOrder && virtualpage) ||
              !experiment.isFlexiOrder ||
              !this.isAlreadyVisitedPage(experiment, virtualpage)
            ) {
              msg = Zarget.checkCustomAttr(msg);
              Zarget.xhrService.send(msg);
              if (experiment.isFlexiOrder) {
                this.rememberPage(experiment, virtualpage);
              }
            }
          },
          trackVirtualPage: function (page) {
            if (!page) {
              return;
            }
            var experiments = this.findMatchingFunnels(page);
            if (!experiments) {
              Zarget.log(
                "No matching funnel experiments for this virtual page : ",
                page
              );
              return;
            }
            for (var i = 0, l = experiments.length; i < l; i++) {
              this.sendMessage(experiments[i], page);
            }
          },
          trackSinglePageapps: function () {
            var experiments = this.findMatchingFunnels();
            if (!experiments) {
              return;
            }
            for (var i = 0, l = experiments.length; i < l; i++) {
              this.sendMessage(experiments[i]);
            }
          },
          isAlreadyVisitedPage: function (experiment, virtualpage) {
            var visitorInfo = this.getVisitorInfo(experiment);
            var path = experiment.isSimple
              ? window.location.pathname
              : virtualpage ||
                window.location.pathname +
                  window.location.search +
                  window.location.hash;
            var visited = !!(visitorInfo && visitorInfo.indexOf(path) !== -1);
            if (visited) {
              return visited;
            }
            var url = virtualpage || document.URL;
            if (virtualpage) {
              return Zarget.arrayIndexOf(visitorInfo, virtualpage) != -1;
            }
            if (this.isRegexMatch(experiment, url)) {
              for (
                var i = 0, l = visitorInfo ? visitorInfo.length : 0;
                i < l;
                i++
              ) {
                var visitedUrl =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  visitorInfo[i];
                if (this.isRegexMatch(experiment, visitedUrl, url)) {
                  return true;
                }
              }
            }
            return false;
          },
          getVisitorInfo: function (experiment) {
            if (!experiment) {
              return;
            }
            var key = ZARGET_FUNNEL_STORAGE_PREFIX + experiment.id;
            var visitorInfo = this.hasLocalStorage()
              ? window.localStorage[key]
              : Zarget.getCookie(key);
            return visitorInfo ? JSON.parse(visitorInfo) : visitorInfo;
          },
        };
        (function start() {
          if (!ZargetData || !ZargetData.experiments) {
            return;
          }
          var experiment,
            e,
            experiments = [],
            funnel;
          for (e in ZargetData.experiments) {
            experiment = ZargetData.experiments[e];
            if (experiment.type === 5) {
              experiments.push(experiment);
            }
          }
          if (experiments.length > 0) {
            if (Zarget.notAllowSampledVisitor()) {
              return;
            }
            var uid = Zarget.getUidAndSetIfNotExists();
            Zarget.setCookie(uid, Zarget.SAMPLE_VISITED_USER);
            funnel = new Zarget.Funnel(experiments);
            funnel.start();
            window.ZargetFunnelAPI = window.ZargetFunnelAPI || [];
            window.FMFunnelAPI = window.ZargetFunnelAPI;
            window.ZargetFunnelAPI.push = function () {
              Array.prototype.push.apply(this, arguments);
              try {
                if (
                  arguments[0] === ZARGET_FUNNEL_VIRTUAL_PAGE &&
                  funnel &&
                  arguments[1]
                ) {
                  funnel.start(arguments[1]);
                }
              } catch (e) {
                Zarget.log("Error while tracking virtual pages.", e);
              }
            };
            window.ZargetUrlChangeTrigger.register(
              funnel.trackSinglePageapps,
              funnel
            );
          }
        })();
      })(Zarget, ZargetData);
      (function (Zarget, ZargetData) {
        if (
          typeof ZargetData === "undefined" ||
          !ZargetData.hasOwnProperty("polls") ||
          ZargetData.polls.length === 0
        ) {
          return;
        }
        if (Zarget.isOptedOut()) {
          return;
        }
        var devices = { ALL: 1, DESKTOP: 2, MOBILE: 3, TABLET: 4 };
        var show = {
          LOAD: 1,
          TIMER: 2,
          SCROLL: 3,
          CLOSE: 4,
          CUSTOM: 5,
          CLICKELEMENT: 6,
        };
        var poll = Zarget.findPoll(deviceTarget);
        if (!poll) {
          Zarget.log("No poll is created for this url ");
          return;
        }
        if (
          (Zarget.isReportView && Zarget.isReportView()) ||
          Zarget.isPreviewMode() ||
          Zarget.isExpEditMode()
        ) {
          return;
        }
        Zarget.on = function (c, evt, handler) {
          if (c.addEventListener) {
            c.addEventListener(evt, handler, true);
          } else {
            c.attachEvent("on" + evt, handler);
          }
        };
        Zarget.off = function (c, evt, handler) {
          if (c.removeEventListener) {
            c.removeEventListener(evt, handler, true);
          } else {
            c.detachEvent("on" + evt, handler);
          }
        };
        Zarget.READYSTATE_RGX = Zarget.ie ? /complete/ : /complete|interactive/;
        Zarget.domReady =
          document.readyState &&
          Zarget.READYSTATE_RGX.test(document.readyState);
        function sendVisitorInfo(returning, status, geoData, rv) {
          var visitorinfo = Zarget.getPollsInfo(),
            img,
            fid = poll.id,
            r,
            uid,
            url,
            referrer,
            type,
            msg;
          if (!visitorinfo || !visitorinfo.hasOwnProperty(fid)) {
            return;
          }
          url = encodeURIComponent(document.URL);
          referrer = document.referrer;
          type = Zarget.MessageType.ADDPOLL;
          uid = Zarget.getCookie(Zarget.visitorCookie);
          r = new Date().getTime();
          msg = new Zarget.Message(type);
          var today = new Date();
          var nowUTC = today.getTime() + today.getTimezoneOffset() * 60000;
          msg.setParam({
            fid: fid,
            uid: uid,
            r: r,
            ftv: !returning,
            trigger: poll ? poll.trigger : 0,
            ety: Zarget.ExperimentType.POLL,
          });
          typeof rv !== "undefined" && msg.addParam("ru", rv);
          status && msg.addParam("status", status);
          poll.schedulertype && msg.addParam("sch", true);
          Zarget.xhrService.send(msg);
        }
        function sendFieldData(field, answer, status, skipped) {
          var visitorinfo = Zarget.getPollsInfo(),
            img,
            fid,
            varid,
            r,
            uid,
            msg,
            url,
            referrer;
          if (!visitorinfo) {
            return;
          }
          url = encodeURIComponent(document.URL);
          referrer = document.referrer;
          fid = poll.id;
          r = new Date().getTime();
          uid = Zarget.getCookie(Zarget.visitorCookie);
          msg = new Zarget.Message(Zarget.MessageType.ADDPOLL);
          var today = new Date();
          var nowUTC = today.getTime() + today.getTimezoneOffset() * 60000;
          msg.setParam({
            fid: fid,
            uid: uid,
            r: r,
            fieldid: field,
            trigger: poll ? poll.trigger : 0,
            ety: Zarget.ExperimentType.POLL,
          });
          status && msg.addParam("status", status);
          answer && msg.addParam("answer", answer);
          skipped && msg.addParam("skipped", skipped);
          Zarget.xhrService.send(msg);
        }
        var JSTemplate = {};
        JSTemplate.compiled = {};
        function shadeBlendConvert(p, from, to) {
          if (
            typeof p != "number" ||
            p < -1 ||
            p > 1 ||
            typeof from != "string" ||
            (from[0] != "r" && from[0] != "#") ||
            (typeof to != "string" && typeof to != "undefined")
          ) {
            return null;
          }
          if (!this.sbcRip) {
            this.sbcRip = function (d) {
              var l = d.length,
                RGB = new Object();
              if (l > 9) {
                d = d.split(",");
                if (d.length < 3 || d.length > 4) {
                  return null;
                }
                (RGB[0] = i(d[0].slice(4))),
                  (RGB[1] = i(d[1])),
                  (RGB[2] = i(d[2])),
                  (RGB[3] = d[3] ? parseFloat(d[3]) : -1);
              } else {
                if (l == 8 || l == 6 || l < 4) {
                  return null;
                }
                if (l < 6) {
                  d =
                    "#" +
                    d[1] +
                    d[1] +
                    d[2] +
                    d[2] +
                    d[3] +
                    d[3] +
                    (l > 4 ? d[4] + "" + d[4] : "");
                }
                (d = i(d.slice(1), 16)),
                  (RGB[0] = (d >> 16) & 255),
                  (RGB[1] = (d >> 8) & 255),
                  (RGB[2] = d & 255),
                  (RGB[3] =
                    l == 9 || l == 5
                      ? r((((d >> 24) & 255) / 255) * 10000) / 10000
                      : -1);
              }
              return RGB;
            };
          }
          var i = parseInt,
            r = Math.round,
            h = from.length > 9,
            h =
              typeof to == "string"
                ? to.length > 9
                  ? true
                  : to == "c"
                  ? !h
                  : false
                : h,
            b = p < 0,
            p = b ? p * -1 : p,
            to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF",
            f = this.sbcRip(from),
            t = this.sbcRip(to);
          if (!f || !t) {
            return null;
          }
          if (h) {
            return (
              "rgb(" +
              r((t[0] - f[0]) * p + f[0]) +
              "," +
              r((t[1] - f[1]) * p + f[1]) +
              "," +
              r((t[2] - f[2]) * p + f[2]) +
              (f[3] < 0 && t[3] < 0
                ? ")"
                : "," +
                  (f[3] > -1 && t[3] > -1
                    ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000
                    : t[3] < 0
                    ? f[3]
                    : t[3]) +
                  ")")
            );
          } else {
            return (
              "#" +
              (
                4294967296 +
                (f[3] > -1 && t[3] > -1
                  ? r(((t[3] - f[3]) * p + f[3]) * 255)
                  : t[3] > -1
                  ? r(t[3] * 255)
                  : f[3] > -1
                  ? r(f[3] * 255)
                  : 255) *
                  16777216 +
                r((t[0] - f[0]) * p + f[0]) * 65536 +
                r((t[1] - f[1]) * p + f[1]) * 256 +
                r((t[2] - f[2]) * p + f[2])
              )
                .toString(16)
                .slice(f[3] > -1 || t[3] > -1 ? 1 : 3)
            );
          }
        }
        function stringify(obj) {
          if (typeof obj !== "object" || obj === null || obj instanceof Array) {
            return strValue(obj);
          }
          return (
            "{" +
            Object.keys(obj)
              .map(function (k) {
                return typeof obj[k] === "function"
                  ? null
                  : '"' + k + '":' + strValue(obj[k]);
              })
              .filter(function (i) {
                return i;
              }) +
            "}"
          );
        }
        function strValue(val) {
          switch (typeof val) {
            case "string":
              return '"' + val.replace(/\\/g, "\\\\").replace('"', '\\"') + '"';
            case "number":
            case "boolean":
              return "" + val;
            case "function":
              return "null";
            case "object":
              if (val instanceof Date) {
                return '"' + val.toISOString() + '"';
              }
              if (val instanceof Array) {
                return "[" + val.map(strValue).join(",") + "]";
              }
              if (val === null) {
                return "null";
              }
              return stringify(val);
          }
        }
        JSTemplate.render = function (
          template_id,
          data,
          target,
          truncate,
          controller
        ) {
          controller.model = data;
          var func = JSTemplate.compiled[template_id]();
          if (truncate) {
            while (target.firstChild) {
              target.removeChild(target.lastChild);
            }
          }
          var view = func.getView(data);
          var span = document.createElement("span");
          span.innerHTML = view;
          while (span.firstChild) {
            target.appendChild(span.firstChild);
          }
          var bindEvtElems = window.zarget$(
            "[data-bind]",
            window.zarget$(target)
          );
          for (var j = 0, bindLen = bindEvtElems.length; j < bindLen; j++) {
            var bindElem = bindEvtElems[j];
            var evts = bindElem.getAttribute("data-bind").split(",");
            for (var t = 0, evtsLen = evts.length; t < evtsLen; t++) {
              var evtToCreate = evts[t].trim().split(" ");
              var evtName = evtToCreate[0],
                evtFunc = evtToCreate[1];
              Zarget.on(bindElem, evtName, controller[evtFunc]);
            }
          }
          target.style.cssText = "display:none !important";
          return true;
        };
        var currentAnswerObj = {},
          Poll = {},
          answersArr = [],
          timer = null,
          showTimer = null;
        Poll.dataBinding = {
          fnSendVisited: function () {
            var preview = window.zarget$("#zg_" + poll.id);
            var activeQuest = window.zarget$(".active", preview);
            var type = activeQuest.attr("data-type");
            var elemId = activeQuest.attr("data-elem");
            currentAnswerObj[elemId] = currentAnswerObj[elemId] || {
              started: false,
              engaged: false,
            };
            if (!currentAnswerObj[elemId]["started"]) {
              var type = activeQuest.attr("data-type");
              var typePrefix;
              if (type === "text" || type === "multiline") {
                typePrefix = "text_";
              } else {
                if (type === "radio" || type === "choice") {
                  typePrefix = "field_";
                } else {
                  if (type === "nps") {
                    typePrefix = "nps_";
                  }
                }
              }
              var modelObj = Poll.dataBinding.model.questions;
              var currentAns = modelObj.filter(function (obj) {
                if (obj.eid === parseInt(elemId)) {
                  return obj;
                }
              })[0];
              sendFieldData(typePrefix + currentAns.fid, null, "visited", null);
            }
          },
          fnEnableSend: function (e) {
            var preview = window.zarget$("#zg_" + poll.id);
            var activeQuest = window.zarget$(".active", preview);
            var type = activeQuest.attr("data-type");
            var enabled = false;
            var value;
            var typePrefix;
            var index = activeQuest.attr("data-elem");
            var modelObj = Poll.dataBinding.model.questions;
            var currentAns = modelObj.filter(function (obj) {
              if (obj.eid === parseInt(index)) {
                return obj;
              }
            })[0];
            if (type === "text" || type === "multiline") {
              typePrefix = "text_";
              value = this.value;
            } else {
              if (type === "radio") {
                value = window.zarget$("input:checked", activeQuest).val();
                typePrefix = "field_";
                var commentMand = this.parentNode.parentNode.querySelector(
                  'input[data-mandatory="true"]'
                );
                if (commentMand && currentAns.mandatory == 1) {
                  if (!commentMand.value) {
                    value = null;
                  }
                }
              } else {
                if (type === "choice") {
                  typePrefix = "field_";
                  var selOpts = window.zarget$("input:checked", activeQuest);
                  if (selOpts.length) {
                    value = [];
                  }
                  for (var j = 0, opt; (opt = selOpts[j]); j++) {
                    var chkcommentMand =
                      opt.parentNode.parentNode.querySelector(
                        'input[data-mandatory="true"]'
                      );
                    if (chkcommentMand && currentAns.mandatory == 1) {
                      if (!chkcommentMand.value) {
                        value = null;
                        break;
                      }
                    }
                    value.push(opt.value);
                  }
                } else {
                  if (type === "nps") {
                    typePrefix = "nps_";
                    e = e || window.event;
                    var ele = e.target ? e.target : e.srcElement;
                    if (ele.nodeName.toLowerCase() === "li") {
                      if (ele.className === "zarget-active") {
                        window.zarget$(this).children().attr("class", "");
                        value = null;
                      } else {
                        window.zarget$(this).children().attr("class", "");
                        ele.className = "zarget-active";
                        value = parseInt(ele.getAttribute("data-value"));
                      }
                    } else {
                      window.zarget$(this).children().attr("class", "");
                      value = null;
                    }
                  }
                }
              }
            }
            if (type === "radio" || type === "choice") {
              var checked = window.zarget$("input:checked", activeQuest);
              var allTxtHolder = window.zarget$(
                ".zarget-shorttext-holder",
                activeQuest
              );
              for (var j = 0, txtHolder; (txtHolder = allTxtHolder[j]); j++) {
                txtHolder.style.cssText = "display:none!important";
              }
              for (var k = 0, checkHolder; (checkHolder = checked[k]); k++) {
                var inParent = window.zarget$(checkHolder).parent().parent();
                if (window.zarget$(".zarget-shorttext-holder", inParent)[0]) {
                  if (
                    this.parentNode.parentNode.querySelector(
                      '[data-mandatory="true"]'
                    )
                  ) {
                    window.zarget$(
                      ".zarget-shorttext-holder",
                      inParent
                    )[0].style.cssText = "display:block !important";
                  } else {
                    window.zarget$(
                      ".zarget-shorttext-holder",
                      inParent
                    )[0].style.cssText = "display:block !important";
                  }
                }
              }
              var inParent = window.zarget$(this).parent().parent();
              if (window.zarget$(".zarget-shorttext-holder", inParent)[0]) {
                window
                  .zarget$(
                    window
                      .zarget$(".zarget-shorttext-holder", inParent)[0]
                      .getElementsByTagName("input")[0]
                  )
                  .focus();
              }
            }
            var index = activeQuest.attr("data-elem");
            currentAnswerObj.value = value;
            currentAnswerObj[index] = currentAnswerObj[index] || {
              started: false,
              engaged: false,
            };
            if (!currentAnswerObj[index]["engaged"]) {
              var modelObj = Poll.dataBinding.model.questions;
              var currentAns = modelObj.filter(function (obj) {
                if (obj.eid === parseInt(index)) {
                  return obj;
                }
              })[0];
              if (!answersArr.length) {
                sendFieldData(
                  typePrefix + currentAns.fid,
                  null,
                  "started",
                  null
                );
              }
              currentAnswerObj[index]["started"] = true;
              sendFieldData(typePrefix + currentAns.fid, null, "engaged", null);
              currentAnswerObj[index]["engaged"] = true;
            }
            var modelObj = Poll.dataBinding.model.questions;
            var currEid = parseInt(index);
            var currQuest = modelObj.filter(function (obj) {
              if (obj.eid == currEid) {
                return obj;
              }
            })[0];
            var btn = window.zarget$(
              "button",
              window.zarget$(".zarget-poll-button", preview)
            )[0];
            btn.className =
              currentAnswerObj.value !== "" &&
              currentAnswerObj.value !== undefined &&
              currentAnswerObj.value !== null
                ? ""
                : currQuest && !currQuest.mandatory
                ? ""
                : "disabled";
          },
          fnSendData: function () {
            if (
              this.className === "disabled" &&
              (currentAnswerObj.value === "" ||
                currentAnswerObj.value === undefined ||
                currentAnswerObj.value === null)
            ) {
              return;
            }
            var modelObj = Poll.dataBinding.model.questions;
            modelObj.sort(function (a, b) {
              return a.oid - b.oid;
            });
            var preview = window.zarget$("#zg_" + poll.id);
            var activeQuest = window.zarget$(".active", preview);
            var index = activeQuest.attr("data-elem");
            var currentAns = modelObj.filter(function (obj) {
              if (obj.eid === parseInt(index)) {
                return obj;
              }
            })[0];
            var next = currentAns.cto;
            var type = activeQuest.attr("data-type");
            var currEid = parseInt(index);
            var currQuest = modelObj.filter(function (obj) {
              if (obj.eid == currEid) {
                return obj;
              }
            })[0];
            var typePrefix;
            var answers = [];
            var answerObj = {};
            var isAnsEmpty = false;
            if (type === "text" || type === "multiline") {
              typePrefix = "text_";
              var feedback = currentAnswerObj.value || "";
              if (type === "text") {
                feedback = feedback.substring(0, 150);
              } else {
                feedback = feedback.substring(0, 300);
              }
              if (feedback == "" || feedback == undefined || feedback == null) {
                isAnsEmpty = true;
              }
              answerObj.answer = feedback;
              answers.push(answerObj);
            } else {
              if (type === "radio" || type === "choice") {
                if (type === "radio") {
                  var answerObj = {};
                  answerObj.id = currentAnswerObj.value;
                  var answer = currentAns.answers.filter(function (obj) {
                    if (obj.aid === parseInt(currentAnswerObj.value)) {
                      return obj;
                    }
                  })[0];
                  if (answer) {
                    if (answer.comment == 1) {
                      var parent = window
                        .zarget$(
                          'input[value="' + currentAnswerObj.value + '"]'
                        )
                        .parent()
                        .parent();
                      answerObj.comment = window
                        .zarget$(".zarget-shorttext", parent)
                        .val();
                    }
                    answerObj.answer = answer.label;
                  }
                  if (
                    answerObj.answer == "" ||
                    answerObj.answer == undefined ||
                    answerObj.answer == null
                  ) {
                    isAnsEmpty = true;
                  }
                  answers.push(answerObj);
                } else {
                  if (type === "choice") {
                    var checkValues = currentAnswerObj.value;
                    if (checkValues) {
                      for (var k = 0, val; (val = checkValues[k]); k++) {
                        var answerObj = {};
                        answerObj.id = val;
                        var answer = currentAns.answers.filter(function (obj) {
                          if (obj.aid === parseInt(val)) {
                            return obj;
                          }
                        })[0];
                        if (answer) {
                          if (answer.comment == 1) {
                            var parent = window
                              .zarget$('input[value="' + val + '"]')
                              .parent()
                              .parent();
                            answerObj.comment = window
                              .zarget$(".zarget-shorttext", parent)
                              .val();
                          }
                          answerObj.answer = answer.label;
                        }
                        answers.push(answerObj);
                      }
                    } else {
                      isAnsEmpty = true;
                      answers.push("");
                    }
                  }
                }
                typePrefix = "field_";
              } else {
                if (type === "nps") {
                  answerObj.answer = currentAnswerObj.value;
                  if (
                    answerObj.answer == "" ||
                    answerObj.answer == undefined ||
                    answerObj.answer == null
                  ) {
                    isAnsEmpty = true;
                  }
                  answers.push(answerObj);
                  typePrefix = "nps_";
                }
              }
            }
            answersArr.push(currentAnswerObj);
            var statusToSend = null;
            var isSkipped = null;
            if (currQuest.mandatory) {
              statusToSend = "responded";
            } else {
              if (isAnsEmpty) {
                if (answersArr.length === 1) {
                  statusToSend = "started";
                  currentAnswerObj[index]["started"] = true;
                }
                isSkipped = true;
              } else {
                statusToSend = "responded";
              }
            }
            if (typeof Array.prototype.toJSON === "function") {
              sendFieldData(
                typePrefix + currentAns.fid,
                stringify(answers),
                statusToSend,
                isSkipped
              );
            } else {
              sendFieldData(
                typePrefix + currentAns.fid,
                JSON.stringify(answers),
                statusToSend,
                isSkipped
              );
            }
            if (type === "text") {
              window.zarget$("input", activeQuest).val("");
            } else {
              if (type === "multiline") {
                window.zarget$("textarea", activeQuest).val("");
              } else {
                if (type === "radio") {
                  window
                    .zarget$("input:checked", activeQuest)
                    .attr("checked", false);
                } else {
                  if (type === "nps") {
                    window
                      .zarget$(".zarget-active", activeQuest)
                      .attr("class", "");
                  }
                }
              }
            }
            activeQuest.attr("class", "inactive");
            var btn = window.zarget$(
              "button",
              window.zarget$(".zarget-poll-button", preview)
            )[0];
            if (next === 3 && type === "radio") {
              if (currentAnswerObj.value) {
                var ansCto = currentAns.answers.filter(function (obj) {
                  if (obj.aid === parseInt(currentAnswerObj.value)) {
                    return obj;
                  }
                })[0].cto;
                var objCto = modelObj.filter(function (obj) {
                  if (obj.eid === ansCto) {
                    return obj.eid;
                  }
                })[0];
                next =
                  objCto && "eid" in objCto
                    ? objCto.eid
                    : ansCto == 1 || ansCto == 2
                    ? ansCto
                    : 1;
              } else {
                next = 1;
              }
            } else {
              if (next === 3 && type === "nps") {
                if (
                  currentAnswerObj.value != "" ||
                  currentAnswerObj.value != null
                ) {
                  var answered =
                    currentAnswerObj.value >= 0 && currentAnswerObj.value <= 6
                      ? "low"
                      : currentAnswerObj.value >= 7 &&
                        currentAnswerObj.value <= 8
                      ? "neutral"
                      : "high";
                  var answeredObj = currentAns.answers.filter(function (
                    ansObj
                  ) {
                    var label = JSON.parse(ansObj.label);
                    if (label.type === answered) {
                      return label;
                    }
                  });
                  var ansCto = answeredObj.length ? answeredObj[0].cto : 1;
                  var objCto = modelObj.filter(function (obj) {
                    if (obj.eid === ansCto) {
                      return obj.eid;
                    }
                  })[0];
                  next =
                    objCto && "eid" in objCto
                      ? objCto.eid
                      : ansCto == 1 || ansCto == 2
                      ? ansCto
                      : 1;
                } else {
                  next = 1;
                }
              }
            }
            if (next === 1) {
              var ansIndex = modelObj.indexOf(currentAns);
              if (modelObj[ansIndex + 1]) {
                var nextAns = modelObj[ansIndex + 1];
                var elem_id = nextAns.eid;
                var nextDom = window.zarget$(
                  'span[data-elem="' + elem_id + '"]',
                  preview
                );
                if (nextAns.mandatory) {
                  btn.className = "disabled";
                }
                nextDom.attr("class", "active");
                Poll.dataBinding.fnSendVisited();
              } else {
                Zarget.updatePollData(poll.id, "completed", true, poll.trigger);
                window
                  .zarget$(".zarget-thank-mgs-holder", preview)
                  .removeClass("inactive");
                window
                  .zarget$(".zarget-thank-mgs-holder", preview)
                  .addClass("active");
                timer = setTimeout(function () {
                  preview.css("display", "none");
                }, 5000);
                btn.style.display = "none";
                sendVisitorInfo(true, "completed");
                window.zarget$(document).off("mouseout");
              }
            } else {
              if (next === 2) {
                Zarget.updatePollData(poll.id, "completed", true, poll.trigger);
                window
                  .zarget$(".zarget-thank-mgs-holder", preview)
                  .removeClass("inactive");
                window
                  .zarget$(".zarget-thank-mgs-holder", preview)
                  .addClass("active");
                timer = setTimeout(function () {
                  preview.css("display", "none");
                }, 5000);
                btn.style.display = "none";
                sendVisitorInfo(true, "completed");
                window.zarget$(document).off("mouseout");
              } else {
                var nextAns = modelObj.filter(function (obj) {
                  if (obj.eid === parseInt(next)) {
                    return obj;
                  }
                })[0];
                if (!nextAns) {
                  var ansIndex = modelObj.indexOf(currentAns);
                  if (modelObj[ansIndex + 1]) {
                    var nextAns = modelObj[ansIndex + 1];
                    var elem_id = nextAns.eid;
                    var nextDom = window.zarget$(
                      'span[data-elem="' + elem_id + '"]',
                      preview
                    );
                    if (nextAns.mandatory) {
                      btn.className = "disabled";
                    }
                    nextDom.attr("class", "active");
                    Poll.dataBinding.fnSendVisited();
                  } else {
                    Zarget.updatePollData(
                      poll.id,
                      "completed",
                      true,
                      poll.trigger
                    );
                    window
                      .zarget$(".zarget-thank-mgs-holder", preview)
                      .removeClass("inactive");
                    window
                      .zarget$(".zarget-thank-mgs-holder", preview)
                      .addClass("active");
                    timer = setTimeout(function () {
                      preview.css("display", "none");
                    }, 5000);
                    btn.style.display = "none";
                    sendVisitorInfo(true, "completed");
                    window.zarget$(document).off("mouseout");
                  }
                } else {
                  var nextDom = window.zarget$(
                    'span[data-elem="' + nextAns.eid + '"]',
                    preview
                  );
                  if (nextAns.mandatory) {
                    btn.className = "disabled";
                  }
                  nextDom.attr("class", "active");
                  Poll.dataBinding.fnSendVisited();
                }
              }
            }
            if (nextAns) {
              btn.innerText = nextAns.next_custom;
            }
            delete currentAnswerObj.value;
          },
        };
        function focusNext(nextDom, nextAns) {
          if (nextAns.ftype === 1) {
            window.zarget$("input", nextDom).focus();
          } else {
            if (nextAns.ftype === 2) {
              window.zarget$("textarea", nextDom).focus();
            } else {
              if (nextAns.ftype === 3) {
                window.zarget$("input", nextDom)[0].focus();
              }
            }
          }
        }
        function init() {
          if (
            ZargetData.project.excludeIps.length &&
            !Zarget.isVisitorLocationInLocalStorage()
          ) {
            zarget_timeoutid = window.setTimeout(init, 5);
            return;
          } else {
            try {
              window.clearTimeout(zarget_timeoutid);
            } catch (e) {
              Zarget.log("Error in clearing geo timer.");
            }
          }
          if (ZargetData.project.excludeIps.length) {
            var excludeIpCheck = {
              type: 1,
              conditions: [
                {
                  type: 0,
                  conditions: [
                    {
                      condition: 5,
                      type: "ipv4",
                      value: ZargetData.project.excludeIps,
                    },
                  ],
                },
              ],
            };
            if (Zarget.matchesTargeting(excludeIpCheck, false)) {
              return false;
            }
          }
          window.ZargetUrlChangeTrigger.register(urlChange);
          try {
            startExperiment();
            Zarget.setUserID();
          } catch (e) {
            Zarget.log(e);
          }
        }
        function isAlreadyVisitedUser() {
          var info = Zarget.getPollsInfo(),
            userid = Zarget.getCookie(Zarget.visitorCookie);
          if (userid && info && info.hasOwnProperty(poll.id)) {
            return true;
          }
          return false;
        }
        function rememberPoll() {
          var visitorinfo = Zarget.getPollsInfo(),
            vobj;
          vobj = typeof visitorinfo === "object" ? visitorinfo : {};
          if (!vobj.hasOwnProperty(poll.id)) {
            if (poll.trigger) {
              var urlHash = Zarget.sdbmCode(document.URL);
              vobj[poll.id] = {};
              vobj[poll.id][urlHash] = { completed: false };
            } else {
              vobj[poll.id] = { completed: false };
            }
            Zarget.setStorage(
              Zarget.pollData,
              encodeURIComponent(Zarget.stringifyJSON(vobj))
            );
          } else {
            if (poll.trigger) {
              var urlHash = Zarget.sdbmCode(document.URL);
              if (!vobj[poll.id][urlHash]) {
                vobj[poll.id][urlHash] = { completed: false };
              }
              Zarget.setStorage(
                Zarget.pollData,
                encodeURIComponent(Zarget.stringifyJSON(vobj))
              );
            }
          }
        }
        function startExperiment() {
          currentAnswerObj = {};
          answersArr = [];
          if (isAlreadyVisitedUser()) {
            rememberPoll();
            if (poll.trigger) {
              sendVisitorInfo(true, "geo");
            } else {
              sendVisitorInfo(true);
            }
            runPoll();
            return;
          }
          if (Zarget.isCookieDisabled()) {
            return;
          }
          var userid = Zarget.getCookie(Zarget.visitorCookie);
          Zarget.setUserID();
          rememberPoll();
          sendVisitorInfo(false, "geo", userid ? true : false);
          runPoll();
        }
        function deviceTarget(target) {
          var targets = Zarget.trim((target || "1").toString()).split(",");
          for (var i = 0, target; (target = parseInt(targets[i])); i++) {
            switch (target) {
              case devices.ALL:
                return true;
                break;
              case devices.DESKTOP:
                if (
                  !/Android|webOS|iPhone|iPod|tablet|silk|iPad|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                  )
                ) {
                  return true;
                }
                break;
              case devices.MOBILE:
                if (
                  /Android.+mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                  )
                ) {
                  return true;
                }
                break;
              case devices.TABLET:
                if (
                  /Android(?!.*mobile)|playbook|tablet|silk|iPad/i.test(
                    navigator.userAgent
                  )
                ) {
                  return true;
                }
                break;
            }
          }
          return false;
        }
        function runPoll() {
          var pollTmplParsed = function anonymous() {
            function brTag(str) {
              if (!str) {
                str = "";
              }
              return str.replace(/\n/g, "<br>");
            }
            function escapeStr(str) {
              if (!str) {
                str = "";
              }
              str = str.toString();
              return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
            }
            return {
              getView: function (args) {
                var view = [];
                var questions = args.questions;
                var thanks = args.thanks;
                var settings = args.settings;
                view.push("");
                var theme = settings.theme;
                view.push("        ");
                var bg = settings.color.theme;
                view.push("        ");
                var color = settings.color.text;
                view.push("        ");
                var bgColor = "";
                view.push("        ");
                var btnStyle = "";
                view.push("        ");
                var questTxt = "color:rgb(" + color + ") !important;";
                view.push("        ");
                var powerTxt = "color:rgba(" + color + ", .84) !important;";
                view.push("    ");
                var lightColor = shadeBlendConvert.call(
                  this,
                  0.9,
                  "rgb(" + bg + ")"
                );
                view.push("        ");
                if (theme === 1) {
                  view.push("                ");
                  bgColor =
                    "background-color:" +
                    lightColor +
                    " !important;border:1px solid rgb(" +
                    bg +
                    ") !important;";
                  view.push("                     ");
                  btnStyle =
                    "color:rgb(" +
                    color +
                    ") !important;border :1px solid rgb(" +
                    bg +
                    ") !important;background-color:rgb(" +
                    bg +
                    ") !important;";
                  view.push("                ");
                  questTxt = "";
                  view.push("                ");
                  powerTxt = "";
                  view.push("        ");
                } else {
                  if (theme === 2) {
                    view.push("                ");
                    bgColor =
                      "background-color:rgb(" +
                      bg +
                      ") !important;border:1px solid rgb(" +
                      bg +
                      ") !important;";
                    view.push("                ");
                    btnStyle =
                      "color:rgb(" +
                      bg +
                      ") !important;border:1px solid rgb(" +
                      bg +
                      ") !important;background-color:rgb(" +
                      color +
                      ") !important;";
                    view.push("        ");
                  } else {
                    view.push("                ");
                    btnStyle =
                      "color:rgb(" +
                      color +
                      ") !important;border:1px solid rgb(" +
                      bg +
                      ") !important;background-color:rgb(" +
                      bg +
                      ") !important;";
                    view.push("                ");
                    questTxt = "";
                    view.push("                ");
                    powerTxt = "";
                    view.push("        ");
                  }
                }
                view.push("");
                var pos = settings.position === 2 ? "right" : "left";
                view.push('<div class="zarget-poll-window ');
                view.push(escapeStr(pos));
                view.push(" zarget-theme-skin");
                view.push(escapeStr(settings.theme));
                view.push(" zarget-poll-close\" style='");
                view.push(escapeStr(bgColor));
                view.push(
                  "'>            <a class=\"zarget-poll-min-max\" style='"
                );
                view.push(escapeStr(questTxt));
                view.push("");
                view.push(escapeStr(bgColor));
                view.push("border-bottom: 0 solid !important'><span style='");
                view.push(escapeStr(questTxt));
                view.push("'>&#10094;</span></a>            ");
                var types = {
                  1: "text",
                  2: "multiline",
                  3: "radio",
                  4: "choice",
                  5: "nps",
                };
                view.push(
                  '        <div class="zarget-poll-container">         '
                );
                for (var i = 0, question; (question = questions[i]); i++) {
                  view.push("            ");
                  var type = types[question.ftype];
                  view.push("            ");
                  var questType = question.ftype;
                  view.push("            ");
                  var state = i === 0 ? "active" : "inactive";
                  view.push("            <span class='");
                  view.push(escapeStr(state));
                  view.push("' data-elem='");
                  view.push(escapeStr(question.eid));
                  view.push("' data-type='");
                  view.push(escapeStr(type));
                  view.push(
                    "'>            <div class=\"zarget-poll-title\" style='"
                  );
                  view.push(escapeStr(questTxt));
                  view.push("'>                ");
                  view.push(escapeStr(question.label));
                  view.push(
                    '            </div>            <div class="zarget-poll-answers">                '
                  );
                  if (questType === 3) {
                    view.push(
                      '                    <ul class="zarget-single-select">            '
                    );
                    var answers = question.answers.slice();
                    view.push("                        ");
                    if (question.randomize == 1) {
                      view.push("                                ");
                      answers.sort(function () {
                        return 0.5 - Math.random();
                      });
                      view.push("                        ");
                    }
                    view.push("                        ");
                    for (var j = 0, answer; (answer = answers[j]); j++) {
                      view.push(
                        '                        <li>                            <label>                                <input type="radio" value="'
                      );
                      view.push(escapeStr(answer.aid));
                      view.push('" name="radio-');
                      view.push(escapeStr(question.eid));
                      view.push(
                        '" data-bind="change fnEnableSend, focus fnEnableSend"><span style=\''
                      );
                      view.push(escapeStr(questTxt));
                      view.push("'>");
                      view.push(escapeStr(answer.label));
                      view.push(
                        "</span>                            </label>                "
                      );
                      if (answer.comment == 1) {
                        view.push(
                          '                                                <div class="zarget-shorttext-holder zarget-description-holder" style="display:none !important">'
                        );
                        var mandatoryComment = answer.MANDATORY_COMMENT
                          ? "true"
                          : "false";
                        view.push("                ");
                        if (
                          mandatoryComment == "true" &&
                          question.mandatory == 1
                        ) {
                          view.push(
                            '                                <input class="zarget-shorttext" type="text" placeholder="Required" data-mandatory="'
                          );
                          view.push(escapeStr(mandatoryComment));
                          view.push(
                            '" data-bind="keyup fnEnableSend">                                </div>                '
                          );
                        } else {
                          if (
                            mandatoryComment == "false" ||
                            question.mandatory == 0
                          ) {
                            view.push(
                              '                                <input class="zarget-shorttext" type="text" placeholder="Please type here..." data-mandatory="'
                            );
                            view.push(escapeStr(mandatoryComment));
                            view.push(
                              '" data-bind="keyup fnEnableSend">                                </div>                '
                            );
                          }
                        }
                        view.push("                        ");
                      }
                      view.push(
                        "                        </li>                        "
                      );
                    }
                    view.push("                    </ul>                ");
                  } else {
                    if (questType === 4) {
                      view.push(
                        '                    <ul class="zarget-multi-select">            '
                      );
                      var answers = question.answers.slice();
                      view.push("                        ");
                      if (question.randomize == 1) {
                        view.push("                                ");
                        answers.sort(function () {
                          return 0.5 - Math.random();
                        });
                        view.push("                        ");
                      }
                      view.push("                        ");
                      for (var j = 0, answer; (answer = answers[j]); j++) {
                        view.push(
                          '                        <li>                            <label>                                <input type="checkbox" value="'
                        );
                        view.push(escapeStr(answer.aid));
                        view.push('" name="checkbox-');
                        view.push(escapeStr(question.eid));
                        view.push(
                          '" data-bind="change fnEnableSend, focus fnEnableSend"><span style=\''
                        );
                        view.push(escapeStr(questTxt));
                        view.push("'>");
                        view.push(escapeStr(answer.label));
                        view.push(
                          "</span>                            </label>                "
                        );
                        if (answer.comment == 1) {
                          view.push(
                            '                                                <div class="zarget-shorttext-holder zarget-description-holder">'
                          );
                          var chkoptman = answer.MANDATORY_COMMENT
                            ? "true"
                            : "false";
                          view.push("                ");
                          if (chkoptman == "true" && question.mandatory == 1) {
                            view.push(
                              '                                     <input class="zarget-shorttext" type="text" placeholder="Required" data-mandatory="'
                            );
                            view.push(escapeStr(chkoptman));
                            view.push(
                              '" data-bind="keyup fnEnableSend">                                </div>                '
                            );
                          } else {
                            if (
                              chkoptman == "false" ||
                              question.mandatory == 0
                            ) {
                              view.push(
                                '                                     <input class="zarget-shorttext" type="text" placeholder="Please type here..." data-mandatory="'
                              );
                              view.push(escapeStr(chkoptman));
                              view.push(
                                '" data-bind="keyup fnEnableSend">                                </div>                '
                              );
                            }
                          }
                          view.push("                        ");
                        }
                        view.push(
                          "                        </li>                        "
                        );
                      }
                      view.push("                    </ul>                ");
                    } else {
                      if (questType === 5) {
                        view.push(
                          '                    <div class="zarget-net-promoter">                        <div class="zarget-net-promoter-bg">                            <ul data-bind="click fnEnableSend">                                <li data-value="0">0</li>                                <li data-value="1">1</li>                                <li data-value="2">2</li>                                <li data-value="3">3</li>                                <li data-value="4">4</li>                                <li data-value="5">5</li>                                <li data-value="6">6</li>                                <li data-value="7">7</li>                                <li data-value="8">8</li>                                <li data-value="9">9</li>                                <li data-value="10">10</li>                            </ul>                        </div>                        <div class="scrore-label-holder">                '
                        );
                        var lowLabel,
                          highLabel = "";
                        view.push("                                ");
                        question.answers.filter(function (ansObj) {
                          view.push("                                        ");
                          var label = JSON.parse(ansObj.label);
                          view.push("                                        ");
                          if (label.type === "low") {
                            lowLabel = label.label;
                          }
                          view.push("                                        ");
                          if (label.type === "high") {
                            highLabel = label.label;
                          }
                          view.push("                                        ");
                          return ansObj;
                          view.push("                                ");
                        });
                        view.push(
                          '                            <div class="zarget-fleft" style=\''
                        );
                        view.push(escapeStr(questTxt));
                        view.push("'>                                0 - ");
                        view.push(escapeStr(lowLabel));
                        view.push(
                          '                            </div>                            <div class="zarget-fright" style=\''
                        );
                        view.push(escapeStr(questTxt));
                        view.push("'>                                10 - ");
                        view.push(escapeStr(highLabel));
                        view.push(
                          "                            </div>                        </div>                    </div>                "
                        );
                      } else {
                        if (questType === 2) {
                          view.push(
                            '                    <div class="zarget-logtext-holder">                    <textarea class="zarget-logtext" type="textarea" maxlength="300" placeholder="Please type here..." data-bind="keyup fnEnableSend, focus fnEnableSend"></textarea>                    </div>                '
                          );
                        } else {
                          if (questType === 1) {
                            view.push(
                              '                    <div class="zarget-shorttext-holder">                    <input class="zarget-shorttext" type="text" maxlength="150" placeholder="Please type here..." data-bind="keyup fnEnableSend, focus fnEnableSend">                    </div>                '
                            );
                          }
                        }
                      }
                    }
                  }
                  view.push("        </div>        </span>    ");
                }
                view.push(
                  '        <div class="zarget-thank-mgs-holder inactive">            <div class="zarget-thank-mgs-bg">                <div class="zarget-thank-mgs-icon">            &#10003;                </div>                <p class="zarget-thank-mgs" style=\''
                );
                view.push(escapeStr(questTxt));
                view.push("'>");
                view.push(brTag(escapeStr(thanks.THANKYOU_MESSAGE)));
                view.push("</p>                ");
                var displayThanks = thanks.THANKYOU_URL
                  ? "block"
                  : "none !important";
                view.push(
                  '                <div class="zarget-thank-button" style=\'display:'
                );
                view.push(escapeStr(displayThanks));
                view.push("'>                    <a href=\"");
                view.push(escapeStr(thanks.THANKYOU_URL));
                view.push('"><button type="button" style=\'');
                view.push(escapeStr(btnStyle));
                view.push("'>");
                view.push(escapeStr(thanks.BUTTON_LABEL));
                view.push(
                  '</button></a>                </div>            </div>        </div>        <div class="zarget-poll-footer">            '
                );
                if (settings.showbranding === 0) {
                  view.push(
                    '                <div class="zarget-poll-powerdby" style=\''
                  );
                  view.push(escapeStr(powerTxt));
                  view.push(
                    '\'>Powered by <a target="_blank" href="https://www.freshworks.com/marketing-automation/conversion-rate-optimization/?utm_source='
                  );
                  view.push(escapeStr(document.domain));
                  view.push("&utm_medium=poll_widget\" style='");
                  view.push(escapeStr(powerTxt));
                  view.push("'>" + ZargetData.product_name + "</a></div>");
                }
                view.push(
                  '            <div class="zarget-poll-button">                '
                );
                var mandate =
                  questions && (questions[0] ? questions[0].mandatory : 1);
                view.push("                ");
                var disabled = mandate ? "disabled" : "";
                view.push("                ");
                var custom = questions[0].next_custom;
                view.push("                ");
                if (questions[0].cto == 1 && custom != "") {
                  view.push('                <button type="button" class=\'');
                  view.push(escapeStr(disabled));
                  view.push("' data-bind='click fnSendData' style='");
                  view.push(escapeStr(btnStyle));
                  view.push("'>");
                  view.push(escapeStr(questions[0].next_custom));
                  view.push("</button>                ");
                } else {
                  view.push('                <button type="button" class=\'');
                  view.push(escapeStr(disabled));
                  view.push("' data-bind='click fnSendData' style='");
                  view.push(escapeStr(btnStyle));
                  view.push("'>Next</button>                ");
                }
                view.push(
                  '            </div>        </div>    </div></div><style type=\'text/css\'>.zarget-poll-window{all:initial;background:#fff !important;width:300px !important;-webkit-box-shadow:0 0 7px 0 rgba(0,0,0,0.6) !important;-moz-box-shadow:0 0 7px 0 rgba(0,0,0,0.6) !important;box-shadow:0 0 7px 0 rgba(0,0,0,0.6) !important;border:1px solid rgba(0,0,0,0.3) !important;display:block !important;padding:2px;position:fixed;bottom:0px;z-index:9999999}.zarget-poll-window div,.zarget-poll-window span,.zarget-poll-window img,.zarget-poll-window ul,.zarget-poll-window li,.zarget-poll-window h1,.zarget-poll-window h2,.zarget-poll-window h3,.zarget-poll-window h4,.zarget-poll-window h5,.zarget-poll-window h6,.zarget-poll-window p,.zarget-poll-window a,.zarget-poll-window textarea,.zarget-poll-window label,.zarget-poll-window input[type="button"],.zarget-poll-window input[type="email"],.zarget-poll-window input[type="text"],.zarget-poll-window input[type="number"]{all:initial}.zarget-poll-window *{font-family:Arial, Helvetica, sans-serif !important;font-size:12px !important;font-weight:normal !important;font-variant:normal !important;-webkit-font-smoothing:subpixel-antialiased !important;text-rendering:optimizeLegibility !important}.zarget-poll-window input[type="radio"],.zarget-poll-window input[type="checkbox"]{margin-right:5px !important;width:15px !important;height:15px !important;background:#fff !important;cursor:pointer !important;display:inline-block !important;vertical-align:middle !important;border:1px solid rgba(0,0,0,0.3) !important;opacity:1 !important}.zarget-poll-window input[type="radio"]{-webkit-border-radius:50% !important;-moz-border-radius:50% !important;border-radius:50% !important;content:\'\' !important}.zarget-poll-window input[type="radio"]:checked{background:#fff !important;border:4px solid #0190e2 !important}.zarget-poll-window input[type="checkbox"]{content:\'\' !important;-webkit-border-radius:2px !important;-moz-border-radius:2px !important;border-radius:2px !important}.zarget-poll-window input[type="checkbox"]:checked{content:\'\' !important;background:#fff !important;border:4px solid #0190e2 !important}.zarget-poll-window .active{display:block !important}.zarget-poll-window .inactive{display:none !important}.zarget-poll-window .zarget-poll-min-max{text-align:center !important;position:absolute !important;top:-19px !important;right:-1px !important;width:40px !important;height:16px !important;padding-top:2px !important;cursor:pointer !important;-webkit-border-radius:5px 5px 0 0 !important;-moz-border-radius:5px 5px 0 0 !important;border-radiusus:5px 5px 0 0 !important;background:#fff !important;border:1px solid rgba(0,0,0,0.3) !important;border-bottom:0 solid !important;-webkit-box-shadow:0px -3px 5px 0px rgba(0,0,0,0.3) !important;-moz-box-shadow:0px -3px 5px 0px rgba(0,0,0,0.3) !important;box-shadow:0px -3px 5px 0px rgba(0,0,0,0.3) !important;text-align:center !important;-webkit-user-select:none !important;-moz-user-select:-moz-none !important;user-select:none !important;text-decoration:none !important}.zarget-poll-window .zarget-poll-min-max span{color:#000 !important;display:table !important;-moz-transform:rotate(-90deg) !important;-webkit-transform:rotate(-90deg) !important;transform:rotate(-90deg) !important;margin:0 auto !important;cursor:pointer !important;-webkit-user-select:none !important;-moz-user-select:-moz-none !important;user-select:none !important}.zarget-poll-window .zarget-poll-title{display:block !important;padding:20px 20px 20px 20px !important;font-weight:bold !important;line-height:1.4em;word-wrap:break-word}.zarget-poll-window .zarget-poll-answers{display:block !important;padding:0px 20px 20px 20px !important}.zarget-poll-window .zarget-poll-answers ul,.zarget-poll-window .zarget-poll-answers li{display:block !important}.zarget-poll-window .zarget-poll-answers ul{max-height:190px !important;overflow-y:auto}.zarget-poll-window .zarget-poll-answers .zarget-single-select li,.zarget-poll-window .zarget-poll-answers .zarget-multi-select li{margin-bottom:5px !important;background:rgba(255,255,255,0.25) !important;-webkit-border-radius:2px !important;-moz-border-radius:2px !important;border-radius:2px !important;padding:3px 0px 3px 0px}.zarget-poll-window .zarget-poll-answers .zarget-single-select li label,.zarget-poll-window .zarget-poll-answers .zarget-multi-select li label{white-space:nowrap !important;overflow:hidden !important}.zarget-poll-window .zarget-poll-answers .zarget-single-select li label span::before,.zarget-poll-window .zarget-poll-answers .zarget-multi-select li label span::before{content:none}.zarget-poll-window .zarget-poll-answers .zarget-single-select input[type="radio"],.zarget-poll-window .zarget-poll-answers .zarget-single-select input[type="checkbox"],.zarget-poll-window .zarget-poll-answers .zarget-multi-select input[type="radio"],.zarget-poll-window .zarget-poll-answers .zarget-multi-select input[type="checkbox"]{margin:0;margin-right:5px !important}.zarget-poll-window .zarget-poll-answers .zarget-single-select span,.zarget-poll-window .zarget-poll-answers .zarget-multi-select span{cursor:pointer !important}.zarget-poll-window .zarget-poll-answers .zarget-single-select label,.zarget-poll-window .zarget-poll-answers .zarget-multi-select label{cursor:pointer !important;display:block !important;padding:5px 3px 5px 10px !important}.zarget-poll-window .zarget-poll-answers .zarget-logtext-holder{display:table !important;width:100% !important}.zarget-poll-window .zarget-poll-answers .zarget-logtext-holder .zarget-logtext{color:#000 !important;overflow:auto !important;resize:none !important;height:120px !important;padding:4px !important;width:100% !important;background:#fff !important;-webkit-border-radius:2px !important;-moz-border-radius:2px !important;border-radius:2px !important;border:1px solid rgba(0,0,0,0.2) !important;-webkit-box-sizing:border-box !important;-moz-box-sizing:border-box !important;box-sizing:border-box !important}.zarget-poll-window .zarget-poll-answers .zarget-shorttext-holder{display:table !important;width:100% !important}.zarget-poll-window .zarget-poll-answers .zarget-shorttext-holder .zarget-shorttext{color:#000 !important;height:30px !important;padding:3px !important;width:100% !important;background:#fff !important;margin-top:25px !important;margin-bottom:25px !important;-webkit-border-radius:2px !important;-moz-border-radius:2px !important;border-radius:2px !important;border:1px solid rgba(0,0,0,0.2) !important;-webkit-box-sizing:border-box !important;-moz-box-sizing:border-box !important;box-sizing:border-box !important}.zarget-poll-window .zarget-poll-answers .zarget-description-holder{-webkit-box-sizing:border-box !important;-moz-box-sizing:border-box !important;box-sizing:border-box !important;padding-left:10px !important;padding-right:10px !important;display:none !important;position:relative}.zarget-poll-window .zarget-poll-answers .zarget-description-holder input.zarget-shorttext{margin-top:10px !important;margin-bottom:10px !important;-webkit-box-sizing:border-box !important;-moz-box-sizing:border-box !important;box-sizing:border-box !important}.zarget-poll-window .zarget-poll-answers .zarget-net-promoter{margin-top:15px !important;margin-bottom:30px !important;display:table !important;width:100% !important}.zarget-poll-window .zarget-poll-answers .zarget-net-promoter .zarget-net-promoter-bg{background:#f2f2f2 !important;padding-top:5px !important;padding-bottom:5px !important;display:table !important;width:100% !important}.zarget-poll-window .zarget-poll-answers .zarget-net-promoter ul li{border:0px solid !important;display:inline-block !important;width:20px !important;padding:3px 0 3px 0 !important;margin:0 !important;-webkit-border-radius:2px !important;-moz-border-radius:2px !important;border-radius:2px !important;text-align:center !important;cursor:pointer}.zarget-poll-window .zarget-poll-answers .zarget-net-promoter ul li:hover{background:rgba(0,0,0,0.2) !important}.zarget-poll-window .zarget-poll-answers .zarget-net-promoter .zarget-active,.zarget-poll-window .zarget-poll-answers .zarget-net-promoter .zarget-active:hover{background:#00cc66 !important;color:#fff !important}.zarget-poll-window .zarget-poll-answers .zarget-net-promoter .scrore-label-holder{margin-top:10px !important;display:table !important;width:100% !important}.zarget-poll-window .zarget-poll-answers .zarget-net-promoter .scrore-label-holder .zarget-fleft,.zarget-poll-window .zarget-poll-answers .zarget-net-promoter .scrore-label-holder .zarget-fright{width:120px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-all;word-break:break-word}.zarget-poll-window .zarget-poll-answers .zarget-net-promoter .zarget-fleft{float:left !important}.zarget-poll-window .zarget-poll-answers .zarget-net-promoter .zarget-fright{float:right !important;text-align:right !important}.zarget-poll-window .zarget-thank-mgs-holder{padding:20px 20px 20px 20px !important}.zarget-poll-window .zarget-thank-mgs-holder .zarget-thank-mgs-bg{display:block !important;background:rgba(0,0,0,0.05) !important;padding:20px !important;text-align:center !important}.zarget-poll-window .zarget-thank-mgs-holder .zarget-thank-mgs{display:block !important;font-weight:bold !important;text-align:center !important;margin-top:20px !important;margin-bottom:20px !important;word-wrap:break-word;-ms-word-break:break-all;word-break:break-word}.zarget-poll-window .zarget-thank-mgs-holder .zarget-thank-mgs-icon{display:table !important;margin:0 auto !important;color:#00ca7d !important;-webkit-box-sizing:border-box !important;-moz-box-sizing:border-box !important;box-sizing:border-box !important;margin-bottom:20px !important;text-align:center !important;font-size:40px !important;width:50px !important;height:50px !important;padding-top:6px !important;-webkit-border-radius:50% !important;-moz-border-radius:50% !important;border-radius:50% !important}.zarget-poll-window .zarget-thank-mgs-holder .zarget-thank-button{display:block !important;text-align:center !important}.zarget-poll-window .zarget-thank-mgs-holder .zarget-thank-button button{background:#4b4b4b !important;color:#fff !important;border:1px solid #4b4b4b !important;height:29px !important;padding-left:20px !important;padding-right:20px !important;-webkit-border-radius:2px !important;-moz-border-radius:2px !important;border-radius:2px !important;cursor:pointer !important}.zarget-poll-window .zarget-thank-mgs-holder .zarget-thank-button button:focus{background:#4b4b4b !important;border:1px solid #4b4b4b;color:#fff !important}.zarget-poll-window .zarget-thank-mgs-holder .zarget-thank-button button:hover{background:#262626 !important;border:1px solid #262626 !important;color:#fff !important}.zarget-poll-window .zarget-poll-footer{display:block !important;padding:5px 20px 20px 20px !important;overflow:auto !important}.zarget-poll-window .zarget-poll-footer .zarget-poll-powerdby{float:left !important;color:rgba(0,0,0,0.54) !important;font-size:10px !important;line-height:28px !important}.zarget-poll-window .zarget-poll-footer .zarget-poll-powerdby a{color:rgba(0,0,0,0.54) !important;font-size:10px !important;cursor:pointer !important;text-decoration:underline !important}.zarget-poll-window .zarget-poll-footer .zarget-poll-powerdby a:hover{text-decoration:underline !important}.zarget-poll-window .zarget-poll-footer .zarget-poll-button{float:right !important}.zarget-poll-window .zarget-poll-footer .zarget-poll-button button{all:initial;background:#9f9f9f !important;border:1px solid #9f9f9f !important;color:#000 !important;cursor:pointer !important;height:28px;padding-right:20px !important;padding-left:20px !important;border-radius:4px}.zarget-poll-window .zarget-poll-footer .zarget-poll-button button:hover{background:#4e4e4e !important;border:1px solid #4e4e4e !important;color:#fff !important;-webkit-box-shadow:0px 0px 5px 0px rgba(0,0,0,0.75) !important;-moz-box-shadow:0px 0px 5px 0px rgba(0,0,0,0.75) !important;box-shadow:0px 0px 5px 0px rgba(0,0,0,0.75) !important}.zarget-poll-window .zarget-poll-footer .zarget-poll-button button.disabled{background:rgba(0,0,0,0.2) !important;cursor:not-allowed !important;color:#000 !important;border:1px solid rgba(0,0,0,0.2) !important;opacity:.38}.zarget-poll-window .zarget-poll-footer .zarget-poll-button button.disabled:focus,.zarget-poll-window .zarget-poll-footer .zarget-poll-button button.disabled:hover{background:0,0,0,0.2 !important;color:#000 !important;border:1px solid rgba(0,0,0,0.2) !important;opacity:.38;box-shadow:none !important}.zarget-poll-window.left{left:20px}.zarget-poll-window.right{right:100px}@media only screen and (max-device-width: 720px){.zarget-poll-window{width:100% !important;left:0 !important;bottom:0 !important}}@media only screen and (min-device-width: 320px) and (max-device-width: 568px){.zarget-poll-window{width:96% !important;left:0 !important;right:0 !important;bottom:0 !important;margin-left:2% !important;margin-right:2% !important}}.zarget-poll-window.zarget-theme-skin1{background:#fff9f6 !important;border:1px solid #ff4d00 !important}.zarget-poll-window.zarget-theme-skin1 .zarget-poll-min-max{background:#fff9f6 !important;border:1px solid #ff4d00 !important;border-bottom:0 solid !important}.zarget-poll-window.zarget-theme-skin1 .zarget-poll-footer .zarget-poll-button button{background:#ff4d00 !important;color:#fff !important;border:1px solid #ff4d00 !important}.zarget-poll-window.zarget-theme-skin1 .zarget-poll-footer .zarget-poll-button button:focus{background:#ff4d00 !important;border:1px solid #ff4d00;color:#fff !important}.zarget-poll-window.zarget-theme-skin1 .zarget-poll-footer .zarget-poll-button button:hover{background:#cc3d00 !important;border:1px solid #cc3d00 !important;color:#fff !important}.zarget-poll-window.zarget-poll-open{padding:2px}.zarget-poll-window.zarget-poll-open .zarget-poll-container{display:block}.zarget-poll-window.zarget-poll-close{padding:2px}.zarget-poll-window.zarget-poll-close .zarget-poll-container{display:none}.zarget-poll-window.zarget-poll-close .zarget-poll-min-max span{-moz-transform:rotate(90deg) !important;-webkit-transform:rotate(90deg) !important;transform:rotate(90deg) !important;margin-top:2px !important}.zarget-poll-window.zarget-theme-skin3{background:#2F2723 !important;border:1px solid #2F2723 !important}.zarget-poll-window.zarget-theme-skin3 .zarget-poll-min-max{background:#2F2723 !important;border:1px solid #2F2723 !important;border-bottom:0 solid !important;color:#fff !important}.zarget-poll-window.zarget-theme-skin3 .zarget-poll-min-max span{color:#fff !important}.zarget-poll-window.zarget-theme-skin3 .zarget-poll-title,.zarget-poll-window.zarget-theme-skin3 .zarget-poll-answers .zarget-single-select span,.zarget-poll-window.zarget-theme-skin3 .zarget-poll-answers .zarget-multi-select span{color:#fff !important}.zarget-poll-window.zarget-theme-skin3 .zarget-thank-mgs-holder .zarget-thank-mgs{color:#fff}.zarget-poll-window.zarget-theme-skin3 .zarget-poll-answers .zarget-single-select li{background:rgba(255,255,255,0.25) !important}.zarget-poll-window.zarget-theme-skin3 .scrore-label-holder .zarget-fleft,.zarget-poll-window.zarget-theme-skin3 .scrore-label-holder .zarget-fright{color:#fff !important}.zarget-poll-window.zarget-theme-skin3 .zarget-thank-mgs-holder .zarget-thank-mgs-bg{background:rgba(255,255,255,0.2) !important}.zarget-poll-window.zarget-theme-skin3 .zarget-poll-footer .zarget-poll-powerdby{color:rgba(255,255,255,0.54) !important}.zarget-poll-window.zarget-theme-skin3 .zarget-poll-footer .zarget-poll-powerdby a{color:rgba(255,255,255,0.54) !important}.zarget-poll-window.zarget-theme-skin3 .zarget-poll-footer .zarget-poll-button button{background:#ff4d00 !important;color:#fff !important;border:1px solid #ff4d00 !important}.zarget-poll-window.zarget-theme-skin3 .zarget-poll-footer .zarget-poll-button button:focus{background:#ff4d00 !important;border:1px solid #ff4d00;color:#fff !important}.zarget-poll-window.zarget-theme-skin3 .zarget-poll-footer .zarget-poll-button button:hover{background:#cc3d00 !important;border:1px solid #cc3d00 !important;color:#fff !important}.zarget-poll-window.zarget-theme-skin2{background:#ff4d00 !important;border:1px solid #ff4d00 !important}.zarget-poll-window.zarget-theme-skin2 .zarget-poll-min-max{background:#ff4d00 !important;border:1px solid #ff4d00 !important;border-bottom:0 solid !important;color:#fff !important}.zarget-poll-window.zarget-theme-skin2 .zarget-poll-title,.zarget-poll-window.zarget-theme-skin2 .zarget-poll-answers .zarget-single-select span{color:#fff !important}.zarget-poll-window.zarget-theme-skin2 .zarget-thank-mgs-holder .zarget-thank-mgs{color:#fff}.zarget-poll-window.zarget-theme-skin2 .zarget-poll-answers .zarget-single-select li{background:rgba(255,255,255,0.25) !important}.zarget-poll-window.zarget-theme-skin2 .zarget-poll-powerdby{color:rgba(255,255,255,0.54) !important}.zarget-poll-window.zarget-theme-skin2 .zarget-poll-powerdby a{color:rgba(255,255,255,0.54) !important}.zarget-poll-window.zarget-theme-skin2 .zarget-poll-footer .zarget-poll-button button{background:#fff !important;color:ff4d00 !important;border:1px solid #ff4d00 !important}.zarget-poll-window.zarget-theme-skin2 .zarget-poll-footer .zarget-poll-button button:focus{background:#ff4d00 !important;border:1px solid #ff4d00;color:#fff !important}.zarget-poll-window.zarget-theme-skin2 .zarget-poll-footer .zarget-poll-button button:hover{background:#cc3d00 !important;border:1px solid #cc3d00 !important;color:#fff !important}.zarget-poll-window .zarget-poll-answers .zarget-single-select li label span,.zarget-poll-window .zarget-poll-answers .zarget-multi-select li label span{width:220px !important;overflow-wrap:break-word !important;word-wrap:break-word !important;-ms-word-break:break-all !important;word-break:break-all !important;-ms-hyphens:auto !important;-moz-hyphens:auto !important;-webkit-hyphens:auto !important;hyphens:auto !important;display:inline-block !important;line-height:15px !important;vertical-align:top}</style>'
                );
                return view.join("");
              },
              getModels: function () {
                return questions, thanks, settings;
              },
              getBinds: function () {
                return {};
              },
              getCtrls: function () {
                return {};
              },
            };
          };
          JSTemplate.compiled.pollTmpl = pollTmplParsed;
          poll.fields.sort(function (a, b) {
            return a.oid - b.oid;
          });
          var settings = {
            theme: poll.theme || 1,
            position: poll.position || 1,
          };
          settings.color = JSON.parse(
            poll.color || '{"theme":"255,77,0","text":"255,255,255"}'
          );
          settings.showbranding = poll.showbranding || 0;
          var dataModel = {
            questions: poll.fields || [],
            thanks: poll.thanks || {},
            settings: settings,
          };
          var pollContainer = document.getElementById("zg_" + poll.id)
            ? document.getElementById("zg_" + poll.id)
            : document.body.appendChild(document.createElement("span"));
          pollContainer.id = "zg_" + poll.id;
          var render = JSTemplate.render(
            "pollTmpl",
            dataModel,
            pollContainer,
            true,
            Poll.dataBinding
          );
          var showPollId = poll.show;
          if (showPollId === show.LOAD) {
            pollContainer.style.cssText = "display : block !important";
            showPoll(null, true);
          } else {
            if (showPollId === show.TIMER) {
              showTimer = setTimeout(function () {
                pollContainer.style.cssText = "display : block !important";
                showPoll(true, true);
              }, poll.triggerTime);
            } else {
              if (showPollId === show.SCROLL) {
                window.zarget$(window).on("scroll", scrollShow);
              } else {
                if (showPollId === show.CLOSE) {
                  window.zarget$(window).on("mouseout", mouseShow);
                } else {
                  if (showPollId === show.CLICKELEMENT) {
                    window.zarget$(window).on("click", clickShow);
                  }
                }
              }
            }
          }
          window.zarget$(".zarget-poll-min-max", pollContainer)[0].onclick =
            function () {
              showPoll(false);
            };
        }
        function scrollShow() {
          var halfScroll = Math.floor(
            (window.zarget$("body").prop("scrollHeight") -
              window.zarget$(window).height()) /
              2
          );
          var scrolled = window.zarget$(window).scrollTop();
          if (scrolled > halfScroll) {
            if (poll) {
              var pollContainer = document.getElementById("zg_" + poll.id);
              pollContainer.style.cssText = "display : block !important";
              showPoll(true, true);
            }
          }
        }
        function mouseShow(event) {
          event = event ? event : window.event;
          var from = event.relatedTarget || event.toElement;
          if (
            (!from || from.nodeName == "HTML") &&
            (event.clientY <= 50 || event.pageY <= 50)
          ) {
            if (poll) {
              var pollContainer = document.getElementById("zg_" + poll.id);
              pollContainer.style.cssText = "display : block !important";
              showPoll(true, true);
            }
          }
        }
        function clickShow() {
          if (poll) {
            var pollContainer = document.getElementById("zg_" + poll.id);
            pollContainer.style.cssText = "display : block !important";
            showPoll(true, true);
          }
        }
        window.zargetAPI = window.zargetAPI || [];
        window.FMApi = window.zargetAPI;
        window.zargetAPI.triggerPoll = function () {
          if (poll) {
            var pollContainer = document.getElementById("zg_" + poll.id)
              ? document.getElementById("zg_" + poll.id)
              : document.body.appendChild(document.createElement("span"));
            pollContainer.style.cssText = "display : block !important";
            showPoll(true);
          }
        };
        function showPoll(expanded, check) {
          var pollWin = window.zarget$(".zarget-poll-window", "#zg_" + poll.id);
          var pos = poll.position === 2 ? "right" : "left";
          var userid = Zarget.getCookie("zarget_user_id");
          var action = Zarget.getAction(userid);
          if (check == true) {
            if (action == 1) {
              pollWin.attr(
                "class",
                "zarget-poll-window " +
                  pos +
                  " zarget-theme-skin" +
                  (poll.theme || 1) +
                  " zarget-poll-close"
              );
            } else {
              pollWin.attr(
                "class",
                "zarget-poll-window " +
                  pos +
                  " zarget-theme-skin" +
                  (poll.theme || 1) +
                  " zarget-poll-open"
              );
            }
          } else {
            if (pollWin.hasClass("zarget-poll-close")) {
              pollWin.attr(
                "class",
                "zarget-poll-window " +
                  pos +
                  " zarget-theme-skin" +
                  (poll.theme || 1) +
                  " zarget-poll-open"
              );
              Zarget.setAction(userid, 0);
              Poll.dataBinding.fnSendVisited();
            } else {
              if (!expanded) {
                pollWin.attr(
                  "class",
                  "zarget-poll-window " +
                    pos +
                    " zarget-theme-skin" +
                    (poll.theme || 1) +
                    " zarget-poll-close"
                );
                var count = Zarget.getPollData(poll.id, "count", poll.trigger);
                count = count ? count + 1 : 1;
                Zarget.setAction(userid, 1);
                Zarget.updatePollData(poll.id, "count", count, poll.trigger);
                if (count >= poll.visibilityCount) {
                  pollWin[0].style.cssText = "display:none !important";
                }
              }
            }
          }
        }
        if (poll) {
          var completed = Zarget.getPollData(
            poll.id,
            "completed",
            poll.trigger
          );
          var target = deviceTarget(poll.deviceTarget);
          if (completed || !target) {
            return;
          }
          var count = Zarget.getPollData(poll.id, "count", poll.trigger);
          if (count && poll.visibilityCount && count >= poll.visibilityCount) {
            return;
          }
          if (poll.schtime) {
            if (new Date() >= poll.schtime) {
              return;
            }
          }
          var r = Math.floor(Math.random() * 100) + 1;
          if (r > poll.traffic) {
            return;
          }
          if (Zarget.domReady) {
            if (Zarget.domReady) {
              init();
            }
          } else {
            if (document.addEventListener) {
              Zarget.on(document, "DOMContentLoaded", init);
            } else {
              Zarget.on(window, "load", init);
            }
          }
        }
        function urlChange() {
          clearTimeout(timer);
          clearTimeout(showTimer);
          window.zarget$(window).off("scroll", scrollShow);
          window.zarget$(window).off("mouseout", mouseShow);
          window.zarget$(window).off("click", clickShow);
          var preview = window.zarget$("#zg_" + poll.id);
          preview.css("display", "none");
          poll = Zarget.findPoll(deviceTarget);
          if (!poll) {
            return;
          }
          var completed = Zarget.getPollData(
            poll.id,
            "completed",
            poll.trigger
          );
          var target = deviceTarget(poll.deviceTarget);
          if (completed || !target) {
            return;
          }
          var count = Zarget.getPollData(poll.id, "count", poll.trigger);
          if (count && poll.visibilityCount && count >= poll.visibilityCount) {
            return;
          }
          if (poll.schtime) {
            if (new Date() >= poll.schtime) {
              return;
            }
          }
          var r = Math.floor(Math.random() * 100) + 1;
          if (r > poll.traffic) {
            return;
          }
          startExperiment();
        }
      })(Zarget, ZargetData);
      (function (FMCore, FMData) {
        if (FMCore.isOptedOut()) {
          return;
        }
        var fm = {};
        function log() {
          if (window.console) {
            window.console.log.apply(window.console, arguments);
          }
        }
        var eventConst = {
          PAGE_VISIT: "page_visit_event",
          WEB_FORM: "web_form",
          CUSTOM_EVENT: "custom_event",
          ASSOCIATE_VISITOR: "associate_visitor",
        };
        function trimWwwAndTrailingSlash(u) {
          if (u) {
            u =
              u.lastIndexOf("/") === u.length - 1
                ? u.substring(0, u.length - 1)
                : u;
            u = u.replace(/^https?\:\/\//, "").replace(/^www./, "");
          }
          return u;
        }
        function getCurrentDomain() {
          return trimWwwAndTrailingSlash(
            FMCore.parseURL(FMCore.getURL()).authority
          ).toLowerCase();
        }
        function isTrackingAllowed(domains) {
          var curDomain = getCurrentDomain();
          for (var i = 0; i < domains.length; i++) {
            if (
              trimWwwAndTrailingSlash(domains[i]).toLowerCase() === curDomain
            ) {
              return true;
            }
          }
          return false;
        }
        var isPageVisitTrackingEnabled = (function () {
          if (
            !FMData.hasOwnProperty("mas_tracking_info") ||
            !FMData.mas_tracking_info.enabled
          ) {
            return false;
          }
          var domains = FMData.mas_tracking_info.domains;
          if (!domains) {
            return false;
          }
          return isTrackingAllowed(domains);
        })();
        var isWebFormTrackingAllowed = (function () {
          if (
            !FMData.hasOwnProperty("webform_tracking_info") ||
            !FMData.webform_tracking_info.domains
          ) {
            return true;
          }
          var domains = FMData.webform_tracking_info.domains;
          if (domains.length === 0) {
            return true;
          }
          return isTrackingAllowed(domains);
        })();
        (function (a) {
          var Event = (function () {
            function Event(event_name, event_data, isDefault, version) {
              this.event_type = isDefault
                ? event_name
                : eventConst.CUSTOM_EVENT;
              this.event_name = event_name;
              this.useragent = navigator.userAgent;
              this.referrer = document.referrer;
              this.url = document.URL;
              this.lang = navigator.language;
              this.visitor_id = FMCore.getUidAndSetIfNotExists();
              this.isDefault = isDefault === false ? false : true;
              this.event_data = event_data || {};
              this.event_at = new Date().getTime();
              this.timezone = new Date().getTimezoneOffset();
              this.account_id = FMData ? FMData.orgidhash : null;
              this.event_version = version ? version : "v1";
            }
            Event.prototype.setVersion = function (version) {
              this.event_version = version;
            };
            Event.prototype.getVersion = function () {
              return this.event_version;
            };
            Event.prototype.getDefault = function () {
              return this.isDefault;
            };
            Event.prototype.setEventName = function (eventName) {
              this.event_type = eventName;
            };
            Event.prototype.getEventName = function () {
              return this.event_type;
            };
            Event.prototype.setAttributes = function (attributes) {
              if (typeof attributes !== "object") {
                return;
              }
              for (var k in attributes) {
                if (attributes.hasOwnProperty(k)) {
                  this.event_data[k] = attributes[k];
                }
              }
            };
            Event.prototype.setAttribute = function (name, value) {
              this.event_data[name] = value;
            };
            Event.prototype.getAttributes = function () {
              return this.event_data;
            };
            Event.prototype.getAttribute = function (name) {
              return this.event_data[name];
            };
            Event.prototype.toJSON = function () {
              return {
                referrer: this.referrer,
                event_type: this.event_type,
                event_name: this.event_name,
                url: this.url,
                event_data: this.getAttributes(),
                visitor_id: this.visitor_id,
                default: this.isDefault,
                lang: this.lang,
                event_at: this.event_at,
                useragent: this.useragent,
                tz: this.timezone,
                account_id: this.account_id,
                event_version: this.getVersion(),
              };
            };
            return Event;
          })();
          a.Event = Event;
        })(fm || (fm = {}));
        (function (a) {
          var EventListener = (function () {
            function EventListener() {
              this.listeners = [];
              this.capture = !0;
              this.noCapture = !1;
              try {
                var e = Object.defineProperty({}, "passive", {
                  get: function () {
                    this.capture = !0;
                    this.noCapture = !0;
                  },
                });
                window.addEventListener("test_support", function () {}, e);
              } catch (err) {
                log("Error listening event : ", err);
              }
            }
            EventListener.prototype.add = function (
              target,
              type,
              capture,
              callback
            ) {
              var c = {
                target: target,
                type: type,
                fn: function (a) {
                  try {
                    callback(a);
                  } catch (b) {
                    log("Error in calling event handler : ", b);
                  }
                },
                options: capture ? this.capture : this.noCapture,
                index: this.listeners.length,
              };
              this.listeners.push(c);
              target.addEventListener(type, c.fn, c.options);
            };
            EventListener.prototype.remove = function (e) {
              if (e.target) {
                e.target.removeEventListener(e.type, e.fn, e.options);
                e.target = null;
                e.fn = void 0;
              }
            };
            EventListener.prototype.clear = function () {
              for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].target) {
                  this.remove(this.listeners[i]);
                }
              }
              this.listeners = [];
            };
            return EventListener;
          })();
          a.EventListener = EventListener;
        })(fm || (fm = {}));
        (function (a) {
          var EventStore = (function () {
            function EventStore() {
              this.priorityEvents = [
                eventConst.ASSOCIATE_VISITOR,
                eventConst.PAGE_VISIT,
                eventConst.WEB_FORM,
              ];
              this.batchEvents = [];
              this.events = [];
            }
            EventStore.prototype.addEvent = function (event) {
              if (!event.visitor_id) {
                return false;
              }
              if (this.priorityEvents.indexOf(event.getEventName()) != -1) {
                this.events.push(event);
              } else {
                this.batchEvents.push(event);
              }
              return true;
            };
            EventStore.prototype.pushEvent = function (
              event_name,
              is_default,
              event_data
            ) {
              if (
                !event_name ||
                !event_data ||
                (event_name === "web_form" && !isWebFormTrackingAllowed)
              ) {
                return;
              }
              this.addEvent(new a.Event(event_name, event_data, is_default));
            };
            EventStore.prototype.pushCustomEvent = function (
              event_name,
              event_data
            ) {
              if (!event_name || !event_data) {
                return;
              }
              this.addEvent(new a.Event(event_name, event_data, false));
            };
            EventStore.prototype.associateVisitor = function (email_id) {
              if (!email_id) {
                return;
              }
              this.addEvent(
                new a.Event(
                  eventConst.ASSOCIATE_VISITOR,
                  { email: email_id },
                  true
                )
              );
            };
            EventStore.prototype.autoAssociateVisitor = function (digest) {
              if (!digest) {
                return;
              }
              this.addEvent(
                new a.Event(eventConst.ASSOCIATE_VISITOR, { digest: digest }),
                true
              );
            };
            EventStore.prototype.pagevisit = function () {
              if (!isPageVisitTrackingEnabled) {
                return;
              }
              this.addEvent(new a.Event(eventConst.PAGE_VISIT, {}, true));
            };
            EventStore.prototype.getEvents = function () {
              return this.events;
            };
            EventStore.prototype.getBatchEvents = function () {
              return this.batchEvents;
            };
            EventStore.prototype.clearEvents = function () {
              this.events = [];
            };
            EventStore.prototype.clearBatchEvents = function () {
              this.batchEvents = [];
            };
            EventStore.prototype.getOverallEvents = function (batch) {
              var data = {
                events: batch ? this.getBatchEvents() : this.getEvents(),
                account_id: FMData ? FMData.orgidhash : null,
                t: new Date().getTime(),
                tz: new Date().getTimezoneOffset(),
              };
              return data;
            };
            return EventStore;
          })();
          a.EventStore = EventStore;
        })(fm || (fm = {}));
        (function (a) {
          var EventHandler = (function () {
            function EventHandler(wnd, eventStore) {
              this.wnd = wnd;
              this.listener = new a.EventListener();
              this.eventStore = eventStore;
              this.bind();
              if (document.readyState === "complete") {
                this.autoAssociateVisitor();
                this.pagevisit();
              }
            }
            EventHandler.prototype.bind = function () {
              var _this = this;
              this.listener.add(this.wnd, "load", false, function (e) {
                _this.autoAssociateVisitor(e);
                _this.pagevisit(e);
              });
              this.listener.add(this.wnd, "beforeunload", false, function () {
                _this.beforeunloadeve();
                return;
              });
              this.listener.add(this.wnd, "hashchange", false, function (e) {
                _this.pagevisit(e);
              });
            };
            EventHandler.prototype.beforeunloadeve = function () {
              if (this.eventStore.getEvents().length > 0) {
                new a.HTTPTransport(
                  this.eventStore.getOverallEvents()
                ).sendBeacon();
              }
              if (this.eventStore.getBatchEvents().length > 0) {
                new a.HTTPTransport(
                  this.eventStore.getOverallEvents("batch")
                ).sendBeacon();
              }
            };
            EventHandler.prototype.pagevisit = function (e) {
              if (!isPageVisitTrackingEnabled) {
                return;
              }
              this.eventStore.addEvent(
                new a.Event(eventConst.PAGE_VISIT, {}, true)
              );
            };
            EventHandler.prototype.autoAssociateVisitor = function (e) {
              var url = FMCore.parseURL(window.location.href);
              if (!url || !url.query || !url.query._fm_st) {
                return;
              }
              this.eventStore.autoAssociateVisitor(url.query._fm_st);
            };
            return EventHandler;
          })();
          a.EventHandler = EventHandler;
        })(fm || (fm = {}));
        (function (a) {
          var HTTPTransport = (function () {
            function HTTPTransport(event) {
              this.msg = new FMCore.Message(FMCore.MessageType.EVENT_DATA_SEND);
              this.msg.setParam(event);
              this.url = FMCore.Messenger._getApiURL(this.msg.type);
              this.processCount = 1;
            }
            HTTPTransport.prototype.startProcess = function (callback) {
              this.xhr = FMCore.Messenger.createCORS(this.url, "POST");
              if (!this.xhr) {
                return;
              }
              this.xhr.setRequestHeader(
                "Content-Type",
                "application/json;charset=UTF-8"
              );
              this.xhr.send(FMCore.stringifyJSON(this.msg.getParams()));
              var _this = this;
              this.xhr.onreadystatechange = function () {
                if (_this.xhr.readyState === 4) {
                  if (callback) {
                    callback();
                    callback = null;
                  }
                  if (_this.xhr.status !== 200) {
                    if (_this.processCount < 5) {
                      window.setTimeout(function () {
                        _this.startProcess();
                      }, 1000);
                      _this.processCount += 1;
                    }
                  }
                }
              };
            };
            HTTPTransport.prototype.sendBeacon = function () {
              return typeof navigator.sendBeacon === "function"
                ? navigator.sendBeacon(
                    this.url,
                    FMCore.stringifyJSON(this.msg.getParams())
                  )
                : !1;
            };
            return HTTPTransport;
          })();
          a.HTTPTransport = HTTPTransport;
        })(fm || (fm = {}));
        (function (a) {
          var EventEmitter = (function () {
            function EventEmitter(store) {
              this.eventStore = store;
              this.immediateInterval = -1;
              this.batchInterval = -1;
              this.startImmediateEmitter();
              this.startBatchEmitter();
            }
            EventEmitter.prototype.startImmediateEmitter = function () {
              if (this.immediateInterval != -1) {
                return;
              }
              var _this = this;
              this.immediateInterval = window.setInterval(function () {
                var events = _this.eventStore.getEvents();
                if (events.length > 0) {
                  var transport = new a.HTTPTransport(
                    _this.eventStore.getOverallEvents()
                  );
                  transport.startProcess(function () {
                    _this.immediateInterval = -1;
                    _this.startImmediateEmitter();
                  });
                  _this.stopImmediateEmitter();
                  _this.eventStore.clearEvents();
                }
              }, 500);
            };
            EventEmitter.prototype.stopImmediateEmitter = function () {
              if (this.immediateInterval == -1) {
                return;
              }
              window.clearInterval(this.immediateInterval);
              this.immediateInterval = -1;
            };
            EventEmitter.prototype.startBatchEmitter = function () {
              if (this.batchInterval != -1) {
                return;
              }
              var _this = this;
              this.batchInterval = window.setInterval(function () {
                var events = _this.eventStore.getBatchEvents();
                if (events.length > 0) {
                  var transport = new a.HTTPTransport(
                    _this.eventStore.getOverallEvents("batch")
                  );
                  transport.startProcess(function () {
                    _this.batchInterval = -1;
                    _this.startBatchEmitter();
                  });
                  _this.stopBatchEmitter();
                  _this.eventStore.clearBatchEvents();
                }
              }, 3000);
            };
            EventEmitter.prototype.stopBatchEmitter = function () {
              if (this.batchInterval == -1) {
                return;
              }
              window.clearInterval(this.batchInterval);
              this.batchInterval = -1;
            };
            return EventEmitter;
          })();
          a.EventEmitter = EventEmitter;
        })(fm || (fm = {}));
        (function (a) {
          function NameSpace() {
            return window.__fm_namespace || "FM";
          }
          function initNameSpace(namespace) {
            if (window[namespace]) {
              return;
            }
            window[namespace] = {};
          }
          function bind(fn, $this) {
            var a = function () {
              try {
                return fn.apply($this || this, arguments);
              } catch (e) {
                log("Error binding event.");
              }
            };
            return a;
          }
          function addAPI(namespace, api, fn, $this) {
            if (namespace[api]) {
              return;
            }
            namespace[api] = bind(fn, $this);
          }
          a.startTracking = function () {
            try {
              this.eventStore = new a.EventStore();
              this.eventEmitter = new a.EventEmitter(this.eventStore);
              this.handler = new a.EventHandler(window, this.eventStore);
              var namespace = NameSpace();
              initNameSpace(namespace);
              namespace = window[namespace];
              var self = this;
              addAPI(
                namespace,
                "trackMasEvent",
                this.eventStore.pushEvent,
                this.eventStore
              );
              addAPI(
                namespace,
                "trackCustomEvent",
                this.eventStore.pushCustomEvent,
                this.eventStore
              );
              addAPI(
                namespace,
                "associateVisitor",
                this.eventStore.associateVisitor,
                this.eventStore
              );
              addAPI(
                namespace,
                "pagevisit",
                this.eventStore.pagevisit,
                this.eventStore
              );
            } catch (err) {}
          };
        })(fm || (fm = {}));
        fm.startTracking();
      })(Zarget, ZargetData);
      (function (Zarget, ZargetData) {
        try {
          let parsedUrl = Zarget.parseURL(window.location.href);
          let projProps = Zarget.getProjectProps();
          const utm_fields = [
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_term",
            "utm_id",
            "utm_content",
            "gclid",
            "fbclid",
          ];
          if (containsFmTrackingParams()) {
            fmSourceTracking();
          } else {
            if (projProps && projProps.src_tracking_enabled === 1) {
              visitorSourceTracking();
            }
          }
          function containsFmTrackingParams() {
            if (parsedUrl.query && Object.keys(parsedUrl.query).length) {
              const fmUtmParams = [
                "fm_source",
                "fm_medium",
                "fm_content",
                "fm_cnt",
                "fm_journey",
              ];
              return containsQueryParam(fmUtmParams);
            }
            return false;
          }
          function containsQueryParam(params) {
            for (let i = 0; i < params.length; i++) {
              if (params[i] in parsedUrl.query) {
                return true;
              }
            }
            return false;
          }
          function fmSourceTracking() {
            let sourceChange = false,
              paramArr = [
                {
                  type: "source",
                  utm_param: "fm_source",
                  store: "_fm_s",
                  check: true,
                },
                { type: "medium", utm_param: "fm_medium", store: "_fm_m" },
                {
                  type: "campaign",
                  utm_param: "fm_content",
                  store: "_fm_cam",
                  check: true,
                },
                { type: "contact", utm_param: "fm_cnt", store: "_fm_con" },
                {
                  type: "journey",
                  utm_param: "fm_journey",
                  store: "_fm_jou",
                  check: true,
                },
              ];
            let customerId = getCustomerId();
            paramArr.forEach(function (type) {
              let val = getntrimValues(type.utm_param);
              if (Zarget.getStorage(type.store) !== val) {
                Zarget.setStorage(type.store, val);
                if (type.check) {
                  sourceChange = true;
                }
              }
            });
            let old_date = Zarget.getStorage("_o_date");
            let notExp = old_date ? (Date.now() - old_date) / 60000 > 30 : true;
            if (
              (sourceChange || notExp) &&
              (Zarget.getStorage("_fm_con") || customerId)
            ) {
              var eventData = { tracking: {} };
              paramArr.forEach(function (item) {
                let lVal = Zarget.getStorage(item.store);
                if (lVal) {
                  eventData.tracking[item.type] = lVal;
                }
              });
              if (customerId) {
                eventData.customer = { id: customerId };
              }
              if (FM && FM.trackMasEvent) {
                Zarget.setStorage("_o_date", Date.now());
                FM.trackMasEvent("source_tracking", true, eventData);
              }
            }
          }
          function getntrimValues(paramName) {
            let val =
              paramName in parsedUrl.query ? parsedUrl.query[paramName] : "";
            return val ? val.trim().toLowerCase() : "";
          }
          function getCustomerId() {
            try {
              if (
                window.ShopifyAnalytics &&
                window.ShopifyAnalytics.meta &&
                window.ShopifyAnalytics.meta.page &&
                window.ShopifyAnalytics.meta.page.customerId
              ) {
                return window.ShopifyAnalytics.meta.page.customerId;
              }
              if (
                window.meta &&
                window.meta.page &&
                window.meta.page.customerId
              ) {
                return window.meta.page.customerId;
              }
              if (__st && __st.cid) {
                return __st.cid;
              }
              if (
                ShopifyAnalytics &&
                ShopifyAnalytics.lib &&
                ShopifyAnalytics.lib.user &&
                ShopifyAnalytics.lib.user().traits &&
                ShopifyAnalytics.lib.user().traits().uniqToken
              ) {
                return ShopifyAnalytics.lib.user().traits().uniqToken;
              }
            } catch (err) {}
            return null;
          }
          function visitorSourceTracking() {
            let existingSrcParams = getExistingSrcTrackingParams();
            let latestSrcParams = getLatestSrcTrackingParams();
            setLocalStorage(latestSrcParams);
            if (
              JSON.stringify(existingSrcParams) !==
              JSON.stringify(latestSrcParams)
            ) {
              if (FM && FM.trackMasEvent) {
                let eventData = {
                  trk: {
                    rs: latestSrcParams.source,
                    rm: latestSrcParams.medium,
                    rc: latestSrcParams.campaign,
                  },
                };
                FM.trackMasEvent("VISITOR_SOURCE_TRACKING", true, eventData);
              }
            }
          }
          function getExistingSrcTrackingParams() {
            return {
              source: Zarget.getStorage("_fm_rs") || "",
              medium: Zarget.getStorage("_fm_rm") || "",
              campaign: Zarget.getStorage("_fm_rc") || "",
            };
          }
          function getLatestSrcTrackingParams() {
            if (parsedUrl.query && Object.keys(parsedUrl.query).length) {
              const utmParams = ["utm_source", "utm_medium", "utm_campaign"];
              if (containsQueryParam(utmParams)) {
                return {
                  source: parsedUrl.query.utm_source || "",
                  medium: parsedUrl.query.utm_medium || "",
                  campaign: parsedUrl.query.utm_campaign || "",
                };
              }
            }
            const referrer = document.referrer;
            if (!referrer) {
              return {
                source: "Direct",
                medium: "Direct traffic",
                campaign: "",
              };
            }
            let refDomain = getDomain(referrer);
            if (refDomain.startsWith("www.")) {
              refDomain = refDomain.substring(4);
            }
            let matches;
            const socialMediaDomains = [
              "digg",
              "facebook",
              "fb",
              "flickr",
              "friendfeed",
              "google+",
              "hackernews",
              "hootsuite",
              "instagram",
              "ig",
              "linkedin",
              "livejournal",
              "meebo",
              "metacafe",
              "mixx",
              "myspace",
              "ning",
              "pinterest",
              "quora",
              "reddit",
              "seesmic",
              "slashdot",
              "slideshare",
              "slide",
              "snapchat",
              "stumbleupon",
              "squidoo",
              "technorati",
              "tiktok",
              "tip'd",
              "tipd",
              "triiibes",
              "tumblr",
              "twitter",
              "vimeo",
              "whatsapp",
              "wikipedia",
              "xing",
              "youtube",
              "zhihu",
            ];
            matches = getMatchingDomain(socialMediaDomains, refDomain);
            if (matches.length > 0) {
              return {
                source: matches[0],
                medium: "organic social",
                campaign: "",
              };
            }
            const searchEngineDomains = [
              "google",
              "yahoo",
              "bing",
              "baidu",
              "aol",
              "duckduckgo",
              "ask",
              "yandex",
            ];
            matches = getMatchingDomain(searchEngineDomains, refDomain);
            if (matches.length > 0) {
              return {
                source: matches[0],
                medium: "organic search",
                campaign: "",
              };
            }
            function getMatchingDomain(domains, refDomain) {
              let matches = [];
              for (let i = 0; i < domains.length; i++) {
                if (refDomain.includes(domains[i])) {
                  matches.push(domains[i]);
                }
              }
              return matches;
            }
            let curDomain = getDomain(window.location.href);
            if (curDomain.startsWith("www.")) {
              curDomain = curDomain.substring(4);
            }
            if (curDomain.includes(refDomain)) {
              return {
                source: Zarget.getStorage("_fm_rs") || "",
                medium: Zarget.getStorage("_fm_rm") || "",
                campaign: Zarget.getStorage("_fm_rc") || "",
              };
            }
            return { source: refDomain, medium: "Referral", campaign: "" };
          }
          function setLocalStorage(latestSrcParams) {
            if (
              Zarget.getStorage("_fm_os") === null ||
              Zarget.getStorage("_fm_os") === undefined
            ) {
              Zarget.setStorage("_fm_os", latestSrcParams.source);
            }
            if (
              Zarget.getStorage("_fm_om") === null ||
              Zarget.getStorage("_fm_om") === undefined
            ) {
              Zarget.setStorage("_fm_om", latestSrcParams.medium);
            }
            if (
              Zarget.getStorage("_fm_oc") === null ||
              Zarget.getStorage("_fm_oc") === undefined
            ) {
              Zarget.setStorage("_fm_oc", latestSrcParams.campaign);
            }
            Zarget.setStorage("_fm_rs", latestSrcParams.source);
            Zarget.setStorage("_fm_rm", latestSrcParams.medium);
            Zarget.setStorage("_fm_rc", latestSrcParams.campaign);
            updateUtmParamsInLocalStorage();
          }
          function updateUtmParamsInLocalStorage() {
            let curDomain = getDomain(window.location.href);
            let referrer = document.referrer;
            let refDomain = referrer ? getDomain(document.referrer) : "";
            if (curDomain.includes(refDomain) && !checkIfUTMParamsPresent()) {
              return;
            }
            let utmParams = getUTMParams();
            Zarget.setStorage("_fm_utm", JSON.stringify(utmParams));
          }
          function getDomain(href) {
            let url = new URL(href);
            let domain = url.hostname.toLowerCase();
            if (domain.startsWith("www.")) {
              domain = domain.substring(4);
            }
            return domain;
          }
          function checkIfUTMParamsPresent() {
            let queryParams = Object.fromEntries(
              new URLSearchParams(window.location.search)
            );
            for (let key in queryParams) {
              if (utm_fields.includes(key)) {
                return true;
              }
            }
            return false;
          }
          function getUTMParams() {
            let queryParams = Object.fromEntries(
              new URLSearchParams(window.location.search)
            );
            let utmParams = {};
            for (let key in queryParams) {
              if (utm_fields.includes(key)) {
                utmParams[key] = queryParams[key];
              }
            }
            return utmParams;
          }
        } catch (err) {
          console.error("error in loading the script", err);
        }
      })(Zarget, ZargetData);
      return 1;
    })();
  function createFcn(nm) {
    window.freshsales.salesData[nm] = function () {
      window.freshsales.salesData.push(
        [nm].concat(Array.prototype.slice.call(arguments, 0))
      );
    };
  }
  (function (url, appToken, formCapture) {
    window.freshsales.salesData = window.freshsales.salesData || [];
    if (window.freshsales.salesData.length == 0) {
      var list = "init identify trackPageView trackEvent set".split(" ");
      for (var i = 0; i < list.length; i++) {
        var nm = list[i];
        createFcn(nm);
      }
      freshsales.salesData.init(
        "https://staging-test-prabhu.myfreshworks.dev/crm/sales",
        "5be9faa4e63bdc0aa0bb00d18d1817a48640bdd217f7d5c61a05c7412b485d6c",
        true,
        8281127,
        "https://fm-staging-us-app-cdnjs.s3.amazonaws.com/crm",
        { enabled: false }
      );
    }
  })();
  var Freshsales = {
    util: {
      utmParamsMap: {
        utm_source: "source",
        utm_medium: "medium",
        utm_campaign: "campaign",
        utm_term: "keyword",
      },
      httpStatus: { OK: 200, READY_STATE: 4 },
      errorMessages: {
        REQUEST_INCOMPLETE: "Request could not be completed.",
        REQUEST_TIMEOUT: "Request Timed out.",
        CORS_NOT_SUPPORTED:
          "Request failed as CORS is not supported in this browser.",
      },
      documentURL: [
        decodeURIComponent(location.host),
        decodeURIComponent(location.pathname),
      ].join(""),
      leadSearchTerm: "fs_lid",
      contactSearchTerm: "fs_cid",
      FsSearchByTerm: "fs_q",
      identifierTerm: "fs_i",
      getCookie: function () {
        var oldCookieName = "freshworks-s360-vid";
        var cookieName = "_fw_crm_v";
        var cookies = {};
        var dCookie = document.cookie.split(";");
        var cookie, value, actualCookie;
        for (var i = 0, length = dCookie.length; i < length; i++) {
          cookie = dCookie[i] && dCookie[i].split("=");
          if (cookie && cookie.length) {
            cookies[cookie[0].trim()] = cookie[1];
          }
        }
        if (cookies[oldCookieName]) {
          actualCookie = cookies[oldCookieName];
          zargetCookie.removeCookie(oldCookieName);
        } else {
          actualCookie = cookies[cookieName];
        }
        value = actualCookie ? actualCookie : zargetCookie.generateUserID();
        zargetCookie.setCookie("_fw_crm_v", value);
        return value;
      },
    },
    hallway: {
      buttonSelectors: [
        "input[type='submit']",
        "input[type='button']",
        "input[id='submit']",
        "form input[type='image']",
        "form input[type='submit']",
        "form input[type='button']",
        "form input[id='submit']",
        "button[type='submit']",
        "button[type='button']",
        "button[id='submit']",
        "form button[type='submit']",
        "form button[type='button']",
        "form button[id='submit']",
        "form a[type='submit']",
        "form a:contains('submit|sign up|create account|send|subscribe|Συνέχεια')",
        "form button:contains('submit|sign up|create account|send|subscribe|Συνέχεια')",
      ],
      inputFieldSelectors: [
        "input:not(:button):not([type=password]):not([type=button]):not([type=submit])",
        "select",
        "textarea",
      ],
      SubmitHandler: function (button) {
        (counter = 0),
          (parents = freshsales.$(button).parents()),
          (parentsCount = parents.length);
        parents.each(function (index, parent) {
          if (counter == 3 || index == parentsCount - 1) {
            Freshsales.hallway.formSubmitHandler(freshsales.$(parent));
            return false;
          } else {
            if (
              freshsales.$(parent).find("input").length ==
              freshsales.$(parent).parent().find("input").length
            ) {
              counter++;
            }
          }
        });
      },
      getManualForms: function () {
        var endPoint =
            Freshsales.analytics.cdnUrl +
            "/" +
            Freshsales.analytics.orgId +
            "/web_form_tracking.json",
          method = "GET",
          req = null,
          _self = this;
        if (XMLHttpRequest) {
          req = new XMLHttpRequest();
          req.open(method, endPoint, true);
          req.onreadystatechange = function () {
            if (req.readyState === Freshsales.util.httpStatus.READY_STATE) {
              if (req.status === Freshsales.util.httpStatus.OK) {
                Freshsales.hallway.manualSelectors = req.responseText;
              } else {
              }
            }
          };
        } else {
          if (XDomainRequest) {
            req = new XDomainRequest();
            req.open(method, endPoint);
            req.onload = function () {
              Freshsales.hallway.manualSelectors = req.responseText;
            };
          } else {
          }
        }
        req.send();
      },
      getManualFormSelector: function () {
        var interval = setInterval(Freshsales.hallway.getManualForms, 21600000);
      },
      formSubmitHandler: function (data) {
        var fieldValuePairs = this.sanitizeAndSerializeForm(data);
        var selector = Freshsales.hallway.getSelector(data[0]);
        let url = Freshsales.hallway.getUrl(window.location.href);
        if (fieldValuePairs.length > 0) {
          fieldValuePairs.unshift({
            nodeName: data[0].nodeName,
            name: data[0].getAttribute("name") || "",
            id: data[0].id ? "#" + data[0].id : "" || "",
            classes: data[0].className
              ? "." + data[0].className.replace(" ", ".")
              : "" || "",
            selector: selector,
            url: url || "",
          });
          Freshsales.post.hallwayData({ hallwayData: fieldValuePairs });
        }
      },
      getSelector: function (data) {
        let selector = window.zg_selector(data);
        return selector;
      },
      getUrl: function (href) {
        let url = new URL(href);
        return url.origin + url.pathname;
      },
      isWebForm: function (closestForm) {
        var container = freshsales.$(closestForm.parent());
        if (container && container.hasClass("fserv-container")) {
          return true;
        }
        return false;
      },
      listenFormSubmit: function () {
        freshsales.$.expr.pseudos.contains = function (a, i, m) {
          return !!freshsales.$(a).text().match(new RegExp(m[3], "i"));
        };
        const startLimitForEventCounter = 0;
        const maxLimitForEventCounter = 10;
        const eventCounter = "event_counter";
        const eventTime = "event_time";
        let eventCapturedCounter,
          eventCapturedCurrentTime,
          eventCapturedMaxTime;
        const resetCounterAndTimer = function () {
          sessionStorage.setItem(eventCounter, startLimitForEventCounter);
          sessionStorage.setItem(eventTime, new Date().getTime());
        };
        freshsales
          .$("body")
          .on(
            "click submit",
            Freshsales.hallway.buttonSelectors.join(","),
            function () {
              if (
                !sessionStorage.getItem(eventCounter) ||
                !sessionStorage.getItem(eventTime)
              ) {
                resetCounterAndTimer();
              }
              eventCapturedCurrentTime = +sessionStorage.getItem(eventTime);
              eventCapturedMaxTime = eventCapturedCurrentTime + 60000;
              if (new Date().getTime() > eventCapturedMaxTime) {
                resetCounterAndTimer();
              }
              eventCapturedCounter = +sessionStorage.getItem(eventCounter);
              if (eventCapturedCounter < maxLimitForEventCounter) {
                sessionStorage.setItem(eventCounter, ++eventCapturedCounter);
                const closestForm = freshsales.$(this).closest("form");
                if (closestForm.length == 0) {
                  Freshsales.hallway.SubmitHandler(this);
                } else {
                  if (Freshsales.hallway.isWebForm(closestForm)) {
                    return;
                  }
                  Freshsales.hallway.formSubmitHandler(closestForm);
                }
              }
            }
          );
      },
      getLabel: function (inputField, initialized) {
        var input = freshsales.$(inputField),
          inputType = Freshsales.hallway.getType(inputField);
        if ((inputType == "radio" || inputType == "checkbox") && !initialized) {
          return Freshsales.hallway.getLabelForRadioOrCheckboxGroup(inputField);
        }
        var inputId = input.attr("id"),
          inputName = input.attr("name"),
          label = freshsales.$("label[for='" + inputId + "']").text();
        if (label) {
          return label;
        } else {
          if (new RegExp("ninja_\\w*\\[\\]$").test(inputName)) {
            var labelSelector = inputName.split("[]")[0];
            return freshsales.$("label[for='" + labelSelector + "']").text();
          } else {
            var parentLabel = input.parent().find("label");
            if (parentLabel.length == 1) {
              return parentLabel.text();
            }
          }
        }
      },
      getLabelForRadioOrCheckboxGroup: function (inputField) {
        var input = freshsales.$(inputField),
          inputName = input.attr("name"),
          inputType = Freshsales.hallway.getType(inputField),
          radioButtonsGroup = freshsales.$(
            "[name='" + inputName + "'][type=" + inputType + "]"
          ),
          uniqueLabels = [];
        radioButtonsGroup.each(function (index, radioButton) {
          var label = Freshsales.hallway.getLabel(radioButton, true);
          if (label && uniqueLabels.indexOf(label) == -1) {
            uniqueLabels.push(label);
          }
        });
        if (uniqueLabels.length === 1) {
          return uniqueLabels[0];
        } else {
          var parents = freshsales.$(inputField).parents();
          var label = "";
          for (var i = 0; i < parents.length - 2; i++) {
            var labelsUnderPrnt = freshsales.$(parents[i]).find("label"),
              labelsUnderGrandPrnt = freshsales.$(parents[i + 1]).find("label");
            if (
              labelsUnderGrandPrnt.length != labelsUnderPrnt.length &&
              labelsUnderPrnt.length == uniqueLabels.length + 1
            ) {
              label = freshsales.$(labelsUnderPrnt[0]).text();
              break;
            }
          }
          return label;
        }
      },
      getValue: function (inputField) {
        var inputType = Freshsales.hallway.getType(inputField),
          input = freshsales.$(inputField),
          value = "";
        switch (inputType) {
          case "select":
            var selectedChoices = [];
            input.find(":selected").each(function () {
              selectedChoices.push(freshsales.$(this).text());
            });
            value = selectedChoices.join(";");
            break;
          case "radio":
            var field = freshsales.$(
              "[name='" + input.attr("name") + "'][type=radio]:checked"
            );
            value =
              Freshsales.hallway.getLabel(field, true) || field.attr("value");
            break;
          case "checkbox":
            var inputName = input.attr("name"),
              checkboxesGroup = freshsales.$(
                "[name='" + inputName + "'][type=checkbox]"
              );
            if (checkboxesGroup.length == 1) {
              value = String(input.is(":checked"));
            } else {
              var selectedCheckboxes = [];
              freshsales
                .$("[name='" + inputName + "'][type=checkbox]:checked")
                .each(function () {
                  selectedCheckboxes.push(freshsales.$(this).val());
                });
              value = selectedCheckboxes.join(";");
            }
            break;
          default:
            value = input.val() || input.attr("value");
        }
        return value;
      },
      getType: function (inputField) {
        var type = "";
        switch (inputField.tagName) {
          case "SELECT":
            type = "select";
            break;
          case "TEXTAREA":
            type = "textarea";
            break;
          case "INPUT":
            type = freshsales.$(inputField).attr("type");
        }
        return type;
      },
      fieldExistsInArray: function (array, name, type) {
        return array.find(function (item, idx) {
          return item.name == name && item.type == type;
        });
      },
      sanitizeAndSerializeForm: function (data) {
        var inputFields = data.find(
          Freshsales.hallway.inputFieldSelectors.join(",")
        );
        var array = [];
        // Get the current time before the program execution
        const startTime = new Date().getTime();
        inputFields.each(function (index, inputField) {
          var inputType = Freshsales.hallway.getType(inputField),
            inputName = freshsales.$(inputField).attr("name");
          if (
            (inputType == "radio" || inputType == "checkbox") &&
            Freshsales.hallway.fieldExistsInArray(array, inputName, inputType)
          ) {
            return true;
          }
          array.push({
            label:
              freshsales.$.trim(Freshsales.hallway.getLabel(inputField)) || "",
            name: inputName || "",
            placeholder: freshsales.$(inputField).attr("placeholder") || "",
            id: freshsales.$(inputField).attr("id") || "",
            type: inputType,
            value: freshsales.$.trim(Freshsales.hallway.getValue(inputField)),
          });
        });
        // Get the current time after the program execution
        const endTime = new Date().getTime();

        // Calculate the time taken
        const timeTaken = endTime - startTime;
        console.log("Time taken: " + timeTaken + " milliseconds");
        return array;
      },
    },
    form: {
      serialize: function (data, prefix) {
        var encodedURL = [];
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var nestedKey = prefix ? prefix + "[" + key + "]" : key,
              value = data[key];
            encodedURL.push(
              typeof value == "object"
                ? this.serialize(value, nestedKey)
                : encodeURIComponent(nestedKey) +
                    "=" +
                    encodeURIComponent(value)
            );
          }
        }
        return encodedURL.join("&");
      },
      post: function (data, successCallBack, errorCallBack) {
        let cookie = Freshsales.util.getCookie(),
          check = false,
          selectorObj = Freshsales.hallway.manualSelectors
            ? JSON.parse(Freshsales.hallway.manualSelectors)
            : null,
          selectorList =
            selectorObj &&
            Object.keys(selectorObj).length > 0 &&
            selectorObj.web_form_tracking &&
            selectorObj.web_form_tracking.length > 0
              ? selectorObj.web_form_tracking
              : null;
        if (data) {
          data._fw_crm_v = cookie;
        }
        function trimWwwAndTrailingSlash(url) {
          if (url) {
            url =
              url.lastIndexOf("/") === url.length - 1
                ? url.substring(0, url.length - 1)
                : url;
            url = url.replace(/^https?\:\/\//, "").replace(/^www./, "");
          }
          return url;
        }
        if (Freshsales.analytics.smartformsEnabled) {
          check = true;
        } else {
          if (
            !Freshsales.analytics.smartformsEnabled &&
            selectorList &&
            data &&
            data.hallway_data &&
            data.hallway_data.length > 0
          ) {
            check = selectorList.some(function (e) {
              return (
                e.formSelector === data.hallway_data[0].selector &&
                trimWwwAndTrailingSlash(e.url) ===
                  trimWwwAndTrailingSlash(data.hallway_data[0].url)
              );
            });
          }
        }
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let validEmail =
          data && data.hallway_data
            ? data.hallway_data.filter(function (res) {
                if (res.value) {
                  return re.test(res.value.toLowerCase());
                }
              })
            : [];
        let hasEmail = validEmail.length && validEmail[0].value;
        if (
          check &&
          data &&
          data.hallway_data &&
          data.hallway_data.length > 0 &&
          hasEmail
        ) {
          window.FMApi = window.FMApi || [];
          this.setSrcTrackingParams(data);
          window.FMApi.push("fm_form_tracking", data);
        }
        if (data && data.visitor) {
          var endPoint = Freshsales.analytics.url + "/track/visit.json",
            method = "POST",
            req = null,
            _self = this;
          if (XMLHttpRequest) {
            req = new XMLHttpRequest();
            if ("withCredentials" in req) {
              req.open(method, endPoint, true);
              req.onreadystatechange = function () {
                if (req.readyState === Freshsales.util.httpStatus.READY_STATE) {
                  if (req.status === Freshsales.util.httpStatus.OK) {
                    _self.handleSuccess(req.responseText, successCallBack);
                  } else {
                    _self.handleFailure(req.responseText, errorCallBack);
                  }
                }
              };
            }
          } else {
            if (XDomainRequest) {
              req = new XDomainRequest();
              req.open(method, endPoint);
              req.onload = function () {
                _self.handleSuccess(req.responseText, successCallBack);
              };
            } else {
              this.handleFailure(
                Freshsales.util.errorMessages.CORS_NOT_SUPPORTED,
                errorCallBack
              );
            }
          }
          if (req) {
            var dataString = this.serialize(data);
            req.onerror = function () {
              _self.handleFailure(
                Freshsales.util.errorMessages.REQUEST_INCOMPLETE,
                errorCallBack
              );
            };
            req.ontimeout = function () {
              _self.handleFailure(
                Freshsales.util.errorMessages.REQUEST_TIMEOUT,
                errorCallBack
              );
            };
            req.setRequestHeader(
              "Content-type",
              "application/x-www-form-urlencoded"
            );
            req.withCredentials = true;
            req.send(dataString);
          }
        }
        if (hasEmail && FM) {
          FM.pagevisit(window.location.href);
        }
      },
      setSrcTrackingParams: function (data) {
        let projProps = window.zg_projectProps();
        if (projProps) {
          if (projProps.src_tracking_enabled === 1) {
            data.st = {
              os: localStorage.getItem("_fm_os"),
              om: localStorage.getItem("_fm_om"),
              oc: localStorage.getItem("_fm_oc"),
              rs: localStorage.getItem("_fm_rs"),
              rm: localStorage.getItem("_fm_rm"),
              rc: localStorage.getItem("_fm_rc"),
            };
          }
          if (projProps.auto_map_query_params === 1) {
            this.setUtmQueryParams(data);
          }
        }
      },
      setUtmQueryParams: function (data) {
        if (!data.st) {
          data.st = {};
        }
        data.st._ga = this.getGAClientId();
        data.st.q = this.getUtmFields();
      },
      getGAClientId: function () {
        let ga_client_id = "";
        let full_ga_client_id = zargetCookie.getCookies()["_ga"];
        if (full_ga_client_id) {
          let splits = full_ga_client_id.split(".");
          for (let i = 2; i < splits.length; ++i) {
            ga_client_id += "." + splits[i];
          }
          ga_client_id = ga_client_id.substring(1);
        }
        return ga_client_id;
      },
      getUtmFields: function () {
        let queryParams = Object.fromEntries(
          new URLSearchParams(window.location.search)
        );
        let fmUtm = localStorage.getItem("_fm_utm");
        if (!fmUtm) {
          return queryParams;
        }
        let utmParamsInLS = JSON.parse(fmUtm);
        if (!utmParamsInLS) {
          return queryParams;
        }
        for (let key in utmParamsInLS) {
          if (!queryParams.hasOwnProperty(key)) {
            queryParams[key] = utmParamsInLS[key];
          }
        }
        return queryParams;
      },
      handleSuccess: function (responseText, successCallBack) {
        Freshsales.analytics.anonymous_id =
          Freshsales.analytics.anonymous_id ||
          JSON.parse(responseText).anonymous_id;
        if (successCallBack) {
          successCallBack(responseText);
        }
      },
      handleFailure: function (errorText, errorCallBack) {
        if (errorCallBack) {
          errorCallBack(errorText);
        }
      },
    },
    sessionTracking: {
      medium: {
        organic_search: "Organic Search",
        referral: "Referral",
        web: "Web",
      },
      sessionData: null,
      checkIsSelfReferral: function (referrer, url) {
        var link = document.createElement("a");
        link.href = url;
        if (link.hostname === referrer) {
          return false;
        }
        return true;
      },
      getParams: function (qs) {
        qs = qs.split("+").join(" ");
        var params = {},
          tokens,
          re = /[?&]?([^=]+)=([^&]*)/g;
        while ((tokens = re.exec(qs))) {
          params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return params;
      },
      processSessionData: function (session) {
        var freshsales_session = new Object();
        if (session.current_session) {
          if (session.current_session.search.engine !== null) {
            freshsales_session.source = this.medium.organic_search;
            freshsales_session.medium = session.current_session.search.engine;
            if (session.current_session.search.query != undefined) {
              freshsales_session.keyword = session.current_session.search.query;
            }
          } else {
            if (
              session.current_session.referrer !== "" &&
              Freshsales.sessionTracking.checkIsSelfReferral(
                session.current_session.referrer_info.host,
                session.current_session.url
              )
            ) {
              if (session.current_session.referrer_info !== undefined) {
                freshsales_session.source = this.medium.referral;
                freshsales_session.medium =
                  session.current_session.referrer_info.host;
              }
            } else {
              if (session.current_session.referrer === "") {
                freshsales_session.source = this.medium.web;
              }
            }
          }
        }
        if (window.location.search != "") {
          var params = Freshsales.sessionTracking.getParams(
            window.location.search
          );
          if (Object.keys(params).length !== 0) {
            for (var i in Freshsales.util.utmParamsMap) {
              if (params.hasOwnProperty(i)) {
                freshsales_session[Freshsales.util.utmParamsMap[i]] = params[i];
              }
            }
          }
        }
        this.sessionData = freshsales_session;
        return freshsales_session;
      },
    },
    post: {
      identifier: function () {
        var data = new Object();
        data.application_token = Freshsales.analytics.applicationToken;
        data.sdk = "javascript";
        return data;
      },
      visit: function (options, successCallBack, errorCallBack) {
        options = options || {};
        if (!options.ignore) {
          options.ignore = {};
        }
        var data = this.identifier();
        if (!options.ignore.sessionInfoData) {
          var sessionData = Freshsales.sessionTracking.sessionData;
          if (
            sessionData !== undefined &&
            Object.keys(sessionData).length !== 0
          ) {
            data.session_info = sessionData;
          }
        }
        if (!options.ignore.pageViewData) {
          data.page_view = {
            url: options.customURL || Freshsales.util.documentURL,
          };
          var search = Freshsales.sessionTracking.getParams(
            window.location.search
          );
          var leadId = search[Freshsales.util.leadSearchTerm];
          var contactId = search[Freshsales.util.contactSearchTerm];
          var fsSearchBy = search[Freshsales.util.FsSearchByTerm];
          var identifier = search[Freshsales.util.identifierTerm];
          if (leadId) {
            data.lead_id = leadId;
          } else {
            if (contactId) {
              data.contact_id = contactId;
            } else {
              if (fsSearchBy) {
                data.visitor = {};
                data.visitor.fs_search_by = JSON.parse(fsSearchBy);
              } else {
                if (identifier) {
                  data.identifier = identifier;
                }
              }
            }
          }
        }
        if (!options.ignore.hallwayData && options.hallwayData) {
          data.hallway_data = options.hallwayData;
        }
        if (!options.ignore.visitorData && options.visitor) {
          data.visitor = options.visitor;
          if (options.identifier != undefined) {
            data.identifier = options.identifier;
          }
        }
        if (!options.ignore.eventData && options.event) {
          data.event = options.event;
        }
        Freshsales.form.post(data, successCallBack, errorCallBack);
      },
      pageViewData: function (customURL, successCallBack, errorCallBack) {
        this.only(
          "pageViewData",
          { customURL: customURL },
          successCallBack,
          errorCallBack
        );
      },
      sessionInfoData: function () {
        this.only("sessionInfoData");
      },
      hallwayData: function (data) {
        this.only("hallwayData", data);
      },
      eventData: function (data, successCallBack, errorCallBack) {
        this.only("eventData", data, successCallBack, errorCallBack);
      },
      visitorData: function (data, successCallBack, errorCallBack) {
        this.only("visitorData", data, successCallBack, errorCallBack);
      },
      only: function (action, options, successCallBack, errorCallBack) {
        var actions = [
          "pageViewData",
          "sessionInfoData",
          "eventData",
          "visitorData",
          "hallwayData",
        ];
        options = options || {};
        if (!options.ignore) {
          options.ignore = {};
        }
        for (var i = 0; i < actions.length; i++) {
          if (action != actions[i]) {
            options.ignore[actions[i]] = true;
          }
        }
        this.visit(options, successCallBack, errorCallBack);
      },
    },
    analytics: {
      init: function (
        url,
        applicationToken,
        formCapture,
        orgId,
        cdnUrl,
        smartFormsSettings
      ) {
        this.url = url;
        this.applicationToken = applicationToken;
        this.formCapture = formCapture;
        this.orgId = orgId;
        this.cdnUrl = cdnUrl;
        this.smartformsEnabled = smartFormsSettings.enabled;
      },
      identify: function (
        identifier,
        visitorProperties,
        successCallBack,
        errorCallBack
      ) {
        visitorProperties = visitorProperties || {};
        var visitorData = {};
        visitorData.visitor = visitorProperties;
        visitorData.identifier = identifier;
        if (!this.initialized) {
          return visitorData;
        }
        Freshsales.post.visitorData(
          visitorData,
          successCallBack,
          errorCallBack
        );
      },
      set: function (visitorProperties, successCallBack, errorCallBack) {
        var visitorData = {};
        visitorData.visitor = visitorProperties;
        if (!this.initialized) {
          return visitorData;
        }
        Freshsales.post.visitorData(
          visitorData,
          successCallBack,
          errorCallBack
        );
      },
      trackPageView: function (customURL, successCallBack, errorCallBack) {
        if (!this.initialized) {
          return { customURL: customURL || Freshsales.util.documentURL };
        }
        Freshsales.post.pageViewData(customURL, successCallBack, errorCallBack);
      },
      trackEvent: function (
        eventName,
        eventProperties,
        successCallBack,
        errorCallBack
      ) {
        eventProperties = eventProperties || {};
        eventProperties.name = eventName;
        var eventData = {};
        eventData.event = eventProperties;
        if (!this.initialized) {
          return eventData;
        }
        Freshsales.post.eventData(eventData, successCallBack, errorCallBack);
      },
      start: function () {
        var options = {};
        while (
          window.freshsales.salesData &&
          window.freshsales.salesData.length > 0
        ) {
          var item = window.freshsales.salesData.splice(0, 1);
          item = item[0];
          var function_name = item[0];
          this.current = function_name;
          var args = Array.prototype.slice.call(item).splice(1);
          var obj = this[function_name].apply(this, args);
          for (var attr in obj) {
            options[attr] = obj[attr];
          }
        }
        if (Freshsales.analytics.formCapture) {
          freshsales.$(function () {
            Freshsales.hallway.listenFormSubmit();
          });
        }
        if (!Freshsales.analytics.smartformsEnabled) {
          freshsales.$(function () {
            Freshsales.hallway.getManualForms();
            Freshsales.hallway.getManualFormSelector();
          });
        }
        Freshsales.analytics.$ = freshsales.$;
        window.freshsales = Freshsales.analytics;
        Freshsales.post.visit(options);
        this.initialized = true;
      },
    },
  };
  window.session = {
    options: { gapi_location: false },
    start: function (session) {
      Freshsales.sessionTracking.processSessionData(session);
      Freshsales.analytics.start();
      window.addEventListener("fwcrm_event", function (e) {
        let eventName = e.detail.name;
        switch (eventName) {
          case "identify":
            Freshsales.analytics.identify(e.detail.args[0], e.detail.args[1]);
            break;
          case "trackCustomEvent":
            Freshsales.analytics.trackEvent(e.detail.args[0], e.detail.args[1]);
            break;
          case "set":
            Freshsales.analytics.set(e.detail.args[0]);
            break;
        }
      });
    },
  };
  var session_fetch = function (win, doc, nav) {
    var API_VERSION = 0.4;
    var options = {
      use_html5_location: false,
      ipinfodb_key: false,
      gapi_location: true,
      location_cookie: "location",
      location_cookie_timeout: 5,
      session_timeout: 32,
      session_cookie: "first_session",
      get_object: null,
      set_object: null,
    };
    var SessionRunner = function () {
      win.session = win.session || {};
      win.session.contains = function (other_str) {
        if (typeof other_str === "string") {
          return this.indexOf(other_str) !== -1;
        }
        for (var i = 0; i < other_str.length; i++) {
          if (this.indexOf(other_str[i]) !== -1) {
            return true;
          }
        }
        return false;
      };
      if (win.session && win.session.options) {
        for (var option in win.session.options) {
          options[option] = win.session.options[option];
        }
      }
      var unloaded_modules = {
        api_version: API_VERSION,
        locale: modules.locale(),
        current_session: modules.session(),
        original_session: modules.session(
          options.session_cookie,
          options.session_timeout * 24 * 60 * 60 * 1000
        ),
        browser: modules.browser(),
        plugins: modules.plugins(),
        time: modules.time(),
        device: modules.device(),
      };
      if (options.use_html5_location) {
        unloaded_modules.location = modules.html5_location();
      } else {
        if (options.ipinfodb_key) {
          unloaded_modules.location = modules.ipinfodb_location(
            options.ipinfodb_key
          );
        } else {
          if (options.gapi_location) {
            unloaded_modules.location = modules.gapi_location();
          }
        }
      }
      if (win.session && win.session.start) {
        var start = win.session.start;
      }
      var asynchs = 0,
        module,
        result,
        check_asynch = function (deinc) {
          if (deinc) {
            asynchs--;
          }
          if (asynchs === 0) {
            if (start) {
              start(win.session);
            }
          }
        };
      win.session = {};
      for (var name in unloaded_modules) {
        module = unloaded_modules[name];
        if (typeof module === "function") {
          try {
            module(function (data) {
              win.session[name] = data;
              check_asynch(true);
            });
            asynchs++;
          } catch (err) {
            if (win.console && typeof console.log === "function") {
              console.log(err);
              check_asynch(true);
            }
          }
        } else {
          win.session[name] = module;
        }
      }
      check_asynch();
    };
    var browser = {
      detect: function () {
        var ret = {
          browser: this.search(this.data.browser),
          version: this.search(nav.userAgent) || this.search(nav.appVersion),
          os: this.search(this.data.os),
        };
        if (ret.os == "Linux") {
          var distros = [
            "CentOS",
            "Debian",
            "Fedora",
            "Gentoo",
            "Mandriva",
            "Mageia",
            "Red Hat",
            "Slackware",
            "SUSE",
            "Turbolinux",
            "Ubuntu",
          ];
          for (var i = 0; i < distros.length; i++) {
            if (nav.userAgent.toLowerCase().match(distros[i].toLowerCase())) {
              ret.distro = distros[i];
              break;
            }
          }
        }
        return ret;
      },
      search: function (data) {
        if (typeof data === "object") {
          for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string,
              dataProp = data[i].prop;
            this.version_string = data[i].versionSearch || data[i].identity;
            if (dataString) {
              if (dataString.indexOf(data[i].subString) != -1) {
                return data[i].identity;
              }
            } else {
              if (dataProp) {
                return data[i].identity;
              }
            }
          }
        } else {
          var index = data.indexOf(this.version_string);
          if (index == -1) {
            return;
          }
          return parseFloat(
            data.substr(index + this.version_string.length + 1)
          );
        }
      },
      data: {
        browser: [
          { string: nav.userAgent, subString: "Edge", identity: "Edge" },
          { string: nav.userAgent, subString: "Chrome", identity: "Chrome" },
          {
            string: nav.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb",
          },
          {
            string: nav.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version",
          },
          { prop: win.opera, identity: "Opera", versionSearch: "Version" },
          { string: nav.vendor, subString: "iCab", identity: "iCab" },
          { string: nav.vendor, subString: "KDE", identity: "Konqueror" },
          { string: nav.userAgent, subString: "Firefox", identity: "Firefox" },
          { string: nav.vendor, subString: "Camino", identity: "Camino" },
          {
            string: nav.userAgent,
            subString: "Netscape",
            identity: "Netscape",
          },
          {
            string: nav.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE",
          },
          {
            string: nav.userAgent,
            subString: "Trident",
            identity: "Explorer",
            versionSearch: "rv",
          },
          {
            string: nav.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv",
          },
          {
            string: nav.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla",
          },
        ],
        os: [
          { string: nav.platform, subString: "Win", identity: "Windows" },
          { string: nav.platform, subString: "Mac", identity: "Mac" },
          {
            string: nav.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod",
          },
          { string: nav.userAgent, subString: "iPad", identity: "iPad" },
          { string: nav.userAgent, subString: "Android", identity: "Android" },
          { string: nav.platform, subString: "Linux", identity: "Linux" },
        ],
      },
    };
    var modules = {
      browser: function () {
        return browser.detect();
      },
      time: function () {
        var d1 = new Date(),
          d2 = new Date();
        d1.setMonth(0);
        d1.setDate(1);
        d2.setMonth(6);
        d2.setDate(1);
        return {
          tz_offset: -new Date().getTimezoneOffset() / 60,
          observes_dst: d1.getTimezoneOffset() !== d2.getTimezoneOffset(),
        };
      },
      locale: function () {
        var lang = (
          nav.language ||
          nav.browserLanguage ||
          nav.systemLanguage ||
          nav.userLanguage ||
          ""
        ).split("-");
        if (lang.length == 2) {
          return {
            country: lang[1].toLowerCase(),
            lang: lang[0].toLowerCase(),
          };
        } else {
          if (lang) {
            return { lang: lang[0].toLowerCase(), country: null };
          } else {
            return { lang: null, country: null };
          }
        }
      },
      device: function () {
        var device = {
          screen: { width: win.screen.width, height: win.screen.height },
        };
        var width, height;
        try {
          width =
            win.innerWidth ||
            doc.documentElement.clientWidth ||
            doc.body.clientWidth;
        } catch (e) {
          width = 0;
        }
        try {
          height =
            win.innerHeight ||
            doc.documentElement.clientHeight ||
            doc.body.clientHeight;
        } catch (e) {
          height = 0;
        }
        device.viewport = { width: width, height: height };
        device.is_tablet = !!nav.userAgent.match(
          /(iPad|SCH-I800|xoom|kindle)/i
        );
        device.is_phone =
          !device.is_tablet &&
          !!nav.userAgent.match(
            /(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i
          );
        device.is_mobile = device.is_tablet || device.is_phone;
        return device;
      },
      plugins: function () {
        var check_plugin = function (name) {
          if (nav.plugins) {
            var plugin,
              i = 0,
              length = nav.plugins.length;
            for (; i < length; i++) {
              plugin = nav.plugins[i];
              if (
                plugin &&
                plugin.name &&
                plugin.name.toLowerCase().indexOf(name) !== -1
              ) {
                return true;
              }
            }
            return false;
          }
          return false;
        };
        var check_activex_flash = function (versions) {
          var found = true;
          for (var i = 0; i < versions.length; i++) {
            try {
              var obj = new ActiveXObject(
                  "ShockwaveFlash.ShockwaveFlash" + versions[i]
                ),
                found = !0;
            } catch (e) {}
            if (found) {
              return true;
            }
          }
          return false;
        };
        return {
          flash: check_plugin("flash") || check_activex_flash([".7", ".6", ""]),
          silverlight: check_plugin("silverlight"),
          java: check_plugin("java"),
          quicktime: check_plugin("quicktime"),
        };
      },
      session: function (cookie, expires) {
        var session = util.get_obj(cookie);
        if (session == null) {
          session = {
            visits: 1,
            start: new Date().getTime(),
            last_visit: new Date().getTime(),
            url: win.location.href,
            path: win.location.pathname,
            referrer: doc.referrer,
            referrer_info: util.parse_url(util.sanitizeUrl(doc.referrer)),
            search: { engine: null, query: null },
          };
          var search_engines = [
              { name: "Google", host: "google", query: "q" },
              { name: "Bing", host: "bing.com", query: "q" },
              { name: "Yahoo", host: "search.yahoo", query: "p" },
              { name: "AOL", host: "search.aol", query: "q" },
              { name: "Ask", host: "ask.com", query: "q" },
              { name: "Baidu", host: "baidu.com", query: "wd" },
            ],
            length = search_engines.length,
            engine,
            match,
            i = 0,
            fallbacks = "q query term p wd query text".split(" ");
          for (i = 0; i < length; i++) {
            engine = search_engines[i];
            if (session.referrer_info.host.indexOf(engine.host) !== -1) {
              session.search.engine = engine.name;
              session.search.query = session.referrer_info.query[engine.query];
              session.search.terms = session.search.query
                ? session.search.query.split(" ")
                : null;
              break;
            }
          }
          if (
            session.search.engine === null &&
            session.referrer_info.search.length > 1
          ) {
            for (i = 0; i < fallbacks.length; i++) {
              var terms = session.referrer_info.query[fallbacks[i]];
              if (terms) {
                session.search.engine = "Unknown";
                session.search.query = terms;
                session.search.terms = terms.split(" ");
                break;
              }
            }
          }
        } else {
          session.prev_visit = session.last_visit;
          session.last_visit = new Date().getTime();
          session.visits++;
          session.time_since_last_visit =
            session.last_visit - session.prev_visit;
        }
        util.set_obj(cookie, session, expires);
        return session;
      },
      html5_location: function () {
        return function (callback) {
          nav.geolocation.getCurrentPosition(
            function (pos) {
              pos.source = "html5";
              callback(pos);
            },
            function (err) {
              if (options.gapi_location) {
                modules.gapi_location()(callback);
              } else {
                callback({ error: true, source: "html5" });
              }
            }
          );
        };
      },
      gapi_location: function () {
        return function (callback) {
          var location = util.get_obj(options.location_cookie);
          if (!location || location.source !== "google") {
            win.gloader_ready = function () {
              if ("google" in win) {
                if (win.google.loader.ClientLocation) {
                  win.google.loader.ClientLocation.source = "google";
                  callback(win.google.loader.ClientLocation);
                } else {
                  callback({ error: true, source: "google" });
                }
                util.set_obj(
                  options.location_cookie,
                  win.google.loader.ClientLocation,
                  options.location_cookie_timeout * 60 * 60 * 1000
                );
              }
            };
            util.embed_script(
              "https://www.google.com/jsapi?callback=gloader_ready"
            );
          } else {
            callback(location);
          }
        };
      },
      architecture: function () {
        var arch =
          n.userAgent.match(/x86_64|Win64|WOW64|x86-64|x64\;|AMD64|amd64/) ||
          n.cpuClass === "x64"
            ? "x64"
            : "x86";
        return { arch: arch, is_x64: arch == "x64", is_x86: arch == "x68" };
      },
      ipinfodb_location: function (api_key) {
        return function (callback) {
          var location_cookie = util.get_obj(options.location_cookie);
          if (!location_cookie && location_cookie.source === "ipinfodb") {
            win.ipinfocb = function (data) {
              if (data.statusCode === "OK") {
                data.source = "ipinfodb";
                util.set_obj(
                  options.location_cookie,
                  data,
                  options.location_cookie * 60 * 60 * 1000
                );
                callback(data);
              } else {
                if (options.gapi_location) {
                  return modules.gapi_location()(callback);
                } else {
                  callback({
                    error: true,
                    source: "ipinfodb",
                    message: data.statusMessage,
                  });
                }
              }
            };
            util.embed_script(
              "http://api.ipinfodb.com/v3/ip-city/?key=" +
                api_key +
                "&format=json&callback=ipinfocb"
            );
          } else {
            callback(location_cookie);
          }
        };
      },
    };
    var util = {
      parse_url: function (url_str) {
        var a = doc.createElement("a"),
          query = {};
        a.href = url_str;
        var query_str = a.search.substr(1);
        if (query_str != "") {
          var pairs = query_str.split("&"),
            i = 0,
            length = pairs.length,
            parts;
          for (; i < length; i++) {
            parts = pairs[i].split("=");
            if (parts.length === 2) {
              query[parts[0]] = decodeURI(parts[1]);
            }
          }
        }
        return {
          host: a.host,
          path: a.pathname,
          protocol: a.protocol,
          port: a.port === "" ? 80 : a.port,
          search: a.search,
          query: query,
        };
      },
      set_cookie: function (cname, value, expires, options) {
        if (!cname) {
          return null;
        }
        if (!options) {
          options = {};
        }
        if (value === null || value === undefined) {
          expires = -1;
        }
        if (expires) {
          options.expires = new Date().getTime() + expires;
        }
        return (doc.cookie = [
          encodeURIComponent(cname),
          "=",
          encodeURIComponent(String(value)),
          options.expires
            ? "; expires=" + new Date(options.expires).toUTCString()
            : "",
          "; path=" + (options.path ? options.path : "/"),
          options.domain ? "; domain=" + options.domain : "",
          win.location && win.location.protocol === "https:" ? "; secure" : "",
        ].join(""));
      },
      get_cookie: function (cookie_name, result) {
        return (result = new RegExp(
          "(?:^|; )" + encodeURIComponent(cookie_name) + "=([^;]*)"
        ).exec(doc.cookie))
          ? decodeURIComponent(result[1])
          : null;
      },
      embed_script: function (url) {
        var element = doc.createElement("script");
        element.type = "text/javascript";
        element.src = url;
        (
          doc.body ||
          doc.getElementsByTagName("body")[0] ||
          doc.head
        ).appendChild(element);
      },
      package_obj: function (obj) {
        if (obj) {
          obj.version = API_VERSION;
          var ret = JSON.stringify(obj);
          delete obj.version;
          return ret;
        }
      },
      set_obj: function (cname, value, expires, options) {
        util.set_cookie(cname, util.package_obj(value), expires, options);
      },
      get_obj: function (cookie_name) {
        var obj;
        try {
          obj = JSON.parse(util.get_cookie(cookie_name));
        } catch (e) {}
        if (obj && obj.version == API_VERSION) {
          delete obj.version;
          return obj;
        }
      },
      sanitizeUrl: function (url) {
        if (!url) {
          return "about:blank";
        }
        const invalidProtocolRegex = /^(%20|\s)*(javascript|data|vbscript)/im;
        const ctrlCharactersRegex = /[^\x20-\x7EÀ-ž]/gim;
        const urlSchemeRegex = /^([^:]+):/gm;
        const relativeFirstCharacters = [".", "/"];
        function isRelativeUrlWithoutProtocol(url) {
          return relativeFirstCharacters.indexOf(url[0]) > -1;
        }
        const sanitizedUrl = url.replace(ctrlCharactersRegex, "").trim();
        if (isRelativeUrlWithoutProtocol(sanitizedUrl)) {
          return sanitizedUrl;
        }
        const urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
        if (!urlSchemeParseResults) {
          return sanitizedUrl;
        }
        const urlScheme = urlSchemeParseResults[0];
        if (invalidProtocolRegex.test(urlScheme)) {
          return "about:blank";
        }
        return sanitizedUrl;
      },
    };
    if (options.get_object != null) {
      util.get_obj = options.get_object;
    }
    if (options.set_object != null) {
      util.set_obj = options.set_object;
    }
    var JSON = {
      parse:
        (win.JSON && win.JSON.parse) ||
        function (data) {
          if (typeof data !== "string" || !data) {
            return null;
          }
          return new Function("return " + data)();
        },
      stringify:
        (win.JSON && win.JSON.stringify) ||
        function (object) {
          var type = typeof object;
          if (type !== "object" || object === null) {
            if (type === "string") {
              return '"' + object + '"';
            }
          } else {
            var k,
              v,
              json = [],
              isArray = object && object.constructor === Array;
            for (k in object) {
              v = object[k];
              type = typeof v;
              if (type === "string") {
                v = '"' + v + '"';
              } else {
                if (type === "object" && v !== null) {
                  v = this.stringify(v);
                }
              }
              json.push((isArray ? "" : '"' + k + '":') + v);
            }
            return (
              (isArray ? "[" : "{") + json.join(",") + (isArray ? "]" : "}")
            );
          }
        },
    };
    SessionRunner();
  };
  if (typeof window.exports === "undefined") {
    session_fetch(window, document, navigator);
  } else {
    window.exports.session = session_fetch;
  }
})();
