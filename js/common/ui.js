/**
 * front js 전역 공통 ui 모듈
 * 1. :focus-visible 구현을 위한 pollyfill 영역(https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
 * @author JeongHoon Kim <fehoon@11stcorp.com>
 */

/**
 * classList.js: Cross-browser full element.classList implementation.
 * 1.2.20171210
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
// Including IE < Edge missing SVGElement.classList
    if (
        !("classList" in document.createElement("_"))
        || document.createElementNS
        && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))
    ) {

        (function (view) {

            "use strict";

            if (!('Element' in view)) return;

            var
                classListProp = "classList"
                , protoProp = "prototype"
                , elemCtrProto = view.Element[protoProp]
                , objCtr = Object
                , strTrim = String[protoProp].trim || function () {
                    return this.replace(/^\s+|\s+$/g, "");
                }
                , arrIndexOf = Array[protoProp].indexOf || function (item) {
                    var
                        i = 0
                        , len = this.length
                    ;
                    for (; i < len; i++) {
                        if (i in this && this[i] === item) {
                            return i;
                        }
                    }
                    return -1;
                }
                // Vendors: please allow content code to instantiate DOMExceptions
                , DOMEx = function (type, message) {
                    this.name = type;
                    this.code = DOMException[type];
                    this.message = message;
                }
                , checkTokenAndGetIndex = function (classList, token) {
                    if (token === "") {
                        throw new DOMEx(
                            "SYNTAX_ERR"
                            , "The token must not be empty."
                        );
                    }
                    if (/\s/.test(token)) {
                        throw new DOMEx(
                            "INVALID_CHARACTER_ERR"
                            , "The token must not contain space characters."
                        );
                    }
                    return arrIndexOf.call(classList, token);
                }
                , ClassList = function (elem) {
                    var
                        trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
                        , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                        , i = 0
                        , len = classes.length
                    ;
                    for (; i < len; i++) {
                        this.push(classes[i]);
                    }
                    this._updateClassName = function () {
                        elem.setAttribute("class", this.toString());
                    };
                }
                , classListProto = ClassList[protoProp] = []
                , classListGetter = function () {
                    return new ClassList(this);
                }
            ;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
            DOMEx[protoProp] = Error[protoProp];
            classListProto.item = function (i) {
                return this[i] || null;
            };
            classListProto.contains = function (token) {
                return ~checkTokenAndGetIndex(this, token + "");
            };
            classListProto.add = function () {
                var
                    tokens = arguments
                    , i = 0
                    , l = tokens.length
                    , token
                    , updated = false
                ;
                do {
                    token = tokens[i] + "";
                    if (!~checkTokenAndGetIndex(this, token)) {
                        this.push(token);
                        updated = true;
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.remove = function () {
                var
                    tokens = arguments
                    , i = 0
                    , l = tokens.length
                    , token
                    , updated = false
                    , index
                ;
                do {
                    token = tokens[i] + "";
                    index = checkTokenAndGetIndex(this, token);
                    while (~index) {
                        this.splice(index, 1);
                        updated = true;
                        index = checkTokenAndGetIndex(this, token);
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.toggle = function (token, force) {
                var
                    result = this.contains(token)
                    , method = result ?
                    force !== true && "remove"
                    :
                    force !== false && "add"
                ;

                if (method) {
                    this[method](token);
                }

                if (force === true || force === false) {
                    return force;
                } else {
                    return !result;
                }
            };
            classListProto.replace = function (token, replacement_token) {
                var index = checkTokenAndGetIndex(token + "");
                if (~index) {
                    this.splice(index, 1, replacement_token);
                    this._updateClassName();
                }
            }
            classListProto.toString = function () {
                return this.join(" ");
            };

            if (objCtr.defineProperty) {
                var classListPropDesc = {
                    get: classListGetter
                    , enumerable: true
                    , configurable: true
                };
                try {
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                } catch (ex) { // IE 8 doesn't support enumerable:true
                    // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
                    // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
                    if (ex.number === undefined || ex.number === -0x7FF5EC54) {
                        classListPropDesc.enumerable = false;
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    }
                }
            } else if (objCtr[protoProp].__defineGetter__) {
                elemCtrProto.__defineGetter__(classListProp, classListGetter);
            }

        }(self));

    }

// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

    (function () {
        "use strict";

        var testElement = document.createElement("_");

        testElement.classList.add("c1", "c2");

        // Polyfill for IE 10/11 and Firefox <26, where classList.add and
        // classList.remove exist but support only one argument at a time.
        if (!testElement.classList.contains("c2")) {
            var createMethod = function(method) {
                var original = DOMTokenList.prototype[method];

                DOMTokenList.prototype[method] = function(token) {
                    var i, len = arguments.length;

                    for (i = 0; i < len; i++) {
                        token = arguments[i];
                        original.call(this, token);
                    }
                };
            };
            createMethod('add');
            createMethod('remove');
        }

        testElement.classList.toggle("c3", false);

        // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
        // support the second argument.
        if (testElement.classList.contains("c3")) {
            var _toggle = DOMTokenList.prototype.toggle;

            DOMTokenList.prototype.toggle = function(token, force) {
                if (1 in arguments && !this.contains(token) === !force) {
                    return force;
                } else {
                    return _toggle.call(this, token);
                }
            };

        }

        // replace() polyfill
        if (!("replace" in document.createElement("_").classList)) {
            DOMTokenList.prototype.replace = function (token, replacement_token) {
                var
                    tokens = this.toString().split(" ")
                    , index = tokens.indexOf(token + "")
                ;
                if (~index) {
                    tokens = tokens.slice(index);
                    this.remove.apply(this, tokens);
                    this.add(replacement_token);
                    this.add.apply(this, tokens.slice(1));
                }
            }
        }

        testElement = null;
    }());

}

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (factory());
}(this, (function () { 'use strict';

    /**
     * Applies the :focus-visible polyfill at the given scope.
     * A scope in this case is either the top-level Document or a Shadow Root.
     *
     * @param {(Document|ShadowRoot)} scope
     * @see https://github.com/WICG/focus-visible
     */
    function applyFocusVisiblePolyfill(scope) {
        var hadKeyboardEvent = true;
        var hadFocusVisibleRecently = false;
        var hadFocusVisibleRecentlyTimeout = null;

        var inputTypesWhitelist = {
            text: true,
            search: true,
            url: true,
            tel: true,
            email: true,
            password: true,
            number: true,
            date: true,
            month: true,
            week: true,
            time: true,
            datetime: true,
            'datetime-local': true
        };

        /**
         * Helper function for legacy browsers and iframes which sometimes focus
         * elements like document, body, and non-interactive SVG.
         * @param {Element} el
         */
        function isValidFocusTarget(el) {
            if (
                el &&
                el !== document &&
                el.nodeName !== 'HTML' &&
                el.nodeName !== 'BODY' &&
                'classList' in el &&
                'contains' in el.classList
            ) {
                return true;
            }
            return false;
        }

        /**
         * Computes whether the given element should automatically trigger the
         * `focus-visible` class being added, i.e. whether it should always match
         * `:focus-visible` when focused.
         * @param {Element} el
         * @return {boolean}
         */
        function focusTriggersKeyboardModality(el) {
            var type = el.type;
            var tagName = el.tagName;

            if (tagName === 'INPUT' && inputTypesWhitelist[type] && !el.readOnly) {
                return true;
            }

            if (tagName === 'TEXTAREA' && !el.readOnly) {
                return true;
            }

            if (el.isContentEditable) {
                return true;
            }

            return false;
        }

        /**
         * Add the `focus-visible` class to the given element if it was not added by
         * the author.
         * @param {Element} el
         */
        function addFocusVisibleClass(el) {
            if (el.classList.contains('focus-visible')) {
                return;
            }
            el.classList.add('focus-visible');
            el.setAttribute('data-focus-visible-added', '');
        }

        /**
         * Remove the `focus-visible` class from the given element if it was not
         * originally added by the author.
         * @param {Element} el
         */
        function removeFocusVisibleClass(el) {
            if (!el.hasAttribute('data-focus-visible-added')) {
                return;
            }
            el.classList.remove('focus-visible');
            el.removeAttribute('data-focus-visible-added');
        }

        /**
         * If the most recent user interaction was via the keyboard;
         * and the key press did not include a meta, alt/option, or control key;
         * then the modality is keyboard. Otherwise, the modality is not keyboard.
         * Apply `focus-visible` to any current active element and keep track
         * of our keyboard modality state with `hadKeyboardEvent`.
         * @param {KeyboardEvent} e
         */
        function onKeyDown(e) {
            if (e.metaKey || e.altKey || e.ctrlKey) {
                return;
            }

            if (isValidFocusTarget(scope.activeElement)) {
                addFocusVisibleClass(scope.activeElement);
            }

            hadKeyboardEvent = true;
        }

        /**
         * If at any point a user clicks with a pointing device, ensure that we change
         * the modality away from keyboard.
         * This avoids the situation where a user presses a key on an already focused
         * element, and then clicks on a different element, focusing it with a
         * pointing device, while we still think we're in keyboard modality.
         * @param {Event} e
         */
        function onPointerDown(e) {
            hadKeyboardEvent = false;
        }

        /**
         * On `focus`, add the `focus-visible` class to the target if:
         * - the target received focus as a result of keyboard navigation, or
         * - the event target is an element that will likely require interaction
         *   via the keyboard (e.g. a text box)
         * @param {Event} e
         */
        function onFocus(e) {
            // Prevent IE from focusing the document or HTML element.
            if (!isValidFocusTarget(e.target)) {
                return;
            }

            if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
                addFocusVisibleClass(e.target);
            }
        }

        /**
         * On `blur`, remove the `focus-visible` class from the target.
         * @param {Event} e
         */
        function onBlur(e) {
            if (!isValidFocusTarget(e.target)) {
                return;
            }

            if (
                e.target.classList.contains('focus-visible') ||
                e.target.hasAttribute('data-focus-visible-added')
            ) {
                // To detect a tab/window switch, we look for a blur event followed
                // rapidly by a visibility change.
                // If we don't see a visibility change within 100ms, it's probably a
                // regular focus change.
                hadFocusVisibleRecently = true;
                window.clearTimeout(hadFocusVisibleRecentlyTimeout);
                hadFocusVisibleRecentlyTimeout = window.setTimeout(function() {
                    hadFocusVisibleRecently = false;
                }, 100);
                removeFocusVisibleClass(e.target);
            }
        }

        /**
         * If the user changes tabs, keep track of whether or not the previously
         * focused element had .focus-visible.
         * @param {Event} e
         */
        function onVisibilityChange(e) {
            if (document.visibilityState === 'hidden') {
                // If the tab becomes active again, the browser will handle calling focus
                // on the element (Safari actually calls it twice).
                // If this tab change caused a blur on an element with focus-visible,
                // re-apply the class when the user switches back to the tab.
                if (hadFocusVisibleRecently) {
                    hadKeyboardEvent = true;
                }
                addInitialPointerMoveListeners();
            }
        }

        /**
         * Add a group of listeners to detect usage of any pointing devices.
         * These listeners will be added when the polyfill first loads, and anytime
         * the window is blurred, so that they are active when the window regains
         * focus.
         */
        function addInitialPointerMoveListeners() {
            document.addEventListener('mousemove', onInitialPointerMove);
            document.addEventListener('mousedown', onInitialPointerMove);
            document.addEventListener('mouseup', onInitialPointerMove);
            document.addEventListener('pointermove', onInitialPointerMove);
            document.addEventListener('pointerdown', onInitialPointerMove);
            document.addEventListener('pointerup', onInitialPointerMove);
            document.addEventListener('touchmove', onInitialPointerMove);
            document.addEventListener('touchstart', onInitialPointerMove);
            document.addEventListener('touchend', onInitialPointerMove);
        }

        function removeInitialPointerMoveListeners() {
            document.removeEventListener('mousemove', onInitialPointerMove);
            document.removeEventListener('mousedown', onInitialPointerMove);
            document.removeEventListener('mouseup', onInitialPointerMove);
            document.removeEventListener('pointermove', onInitialPointerMove);
            document.removeEventListener('pointerdown', onInitialPointerMove);
            document.removeEventListener('pointerup', onInitialPointerMove);
            document.removeEventListener('touchmove', onInitialPointerMove);
            document.removeEventListener('touchstart', onInitialPointerMove);
            document.removeEventListener('touchend', onInitialPointerMove);
        }

        /**
         * When the polfyill first loads, assume the user is in keyboard modality.
         * If any event is received from a pointing device (e.g. mouse, pointer,
         * touch), turn off keyboard modality.
         * This accounts for situations where focus enters the page from the URL bar.
         * @param {Event} e
         */
        function onInitialPointerMove(e) {
            // Work around a Safari quirk that fires a mousemove on <html> whenever the
            // window blurs, even if you're tabbing out of the page. ¯\_(ツ)_/¯
            if (e.target.nodeName && e.target.nodeName.toLowerCase() === 'html') {
                return;
            }

            hadKeyboardEvent = false;
            removeInitialPointerMoveListeners();
        }

        // For some kinds of state, we are interested in changes at the global scope
        // only. For example, global pointer input, global key presses and global
        // visibility change should affect the state at every scope:
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('mousedown', onPointerDown, true);
        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('touchstart', onPointerDown, true);
        document.addEventListener('visibilitychange', onVisibilityChange, true);

        addInitialPointerMoveListeners();

        // For focus and blur, we specifically care about state changes in the local
        // scope. This is because focus / blur events that originate from within a
        // shadow root are not re-dispatched from the host element if it was already
        // the active element in its own scope:
        scope.addEventListener('focus', onFocus, true);
        scope.addEventListener('blur', onBlur, true);

        // We detect that a node is a ShadowRoot by ensuring that it is a
        // DocumentFragment and also has a host property. This check covers native
        // implementation and polyfill implementation transparently. If we only cared
        // about the native implementation, we could just check if the scope was
        // an instance of a ShadowRoot.
        if (scope.nodeType === Node.DOCUMENT_FRAGMENT_NODE && scope.host) {
            // Since a ShadowRoot is a special kind of DocumentFragment, it does not
            // have a root element to add a class to. So, we add this attribute to the
            // host element instead:
            scope.host.setAttribute('data-js-focus-visible', '');
        } else if (scope.nodeType === Node.DOCUMENT_NODE) {
            document.documentElement.classList.add('js-focus-visible');
            document.documentElement.setAttribute('data-js-focus-visible', '');
        }
    }

    // It is important to wrap all references to global window and document in
    // these checks to support server-side rendering use cases
    // @see https://github.com/WICG/focus-visible/issues/199
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // Make the polyfill helper globally available. This can be used as a signal
        // to interested libraries that wish to coordinate with the polyfill for e.g.,
        // applying the polyfill to a shadow root:
        window.applyFocusVisiblePolyfill = applyFocusVisiblePolyfill;

        // Notify interested libraries of the polyfill's presence, in case the
        // polyfill was loaded lazily:
        var event;

        try {
            event = new CustomEvent('focus-visible-polyfill-ready');
        } catch (error) {
            // IE11 does not support using CustomEvent as a constructor directly:
            event = document.createEvent('CustomEvent');
            event.initCustomEvent('focus-visible-polyfill-ready', false, false, {});
        }

        window.dispatchEvent(event);
    }

    if (typeof document !== 'undefined') {
        // Apply the polyfill to the global document, so that no JavaScript
        // coordination is required to use the polyfill in the top-level document:
        applyFocusVisiblePolyfill(document);
    }

})));

/**
 * front js 전역 공통 ui 모듈
 * 2. layBodyWrap tabindex 할당
 * @author JeongHoon Kim <fehoon@11stcorp.com>
 */
window.addEventListener('DOMContentLoaded', function(event){
    var bodyWrapElem = document.getElementById('layBodyWrap');
    if(typeof(bodyWrapElem) != 'undefined' && bodyWrapElem != null){
        bodyWrapElem.setAttribute('tabindex', '-1');
    }
});

/**
 * front js 전역 공통 ui 모듈
 * 3. details polyfill
 * @author JeongHoon Kim <fehoon@11stcorp.com>
 */

(function() {
    "use strict";
    var element = document.createElement("details");
    var elementIsNative = typeof HTMLDetailsElement != "undefined" && element instanceof HTMLDetailsElement;
    var support = {
        open: "open" in element || elementIsNative,
        toggle: "ontoggle" in element
    };
    var styles = '\ndetails, summary {\n  display: block;\n}\ndetails:not([open]) > *:not(summary) {\n  display: none;\n}\nsummary::before {\n  content: "";\n  padding-right: 0.3rem;\n  font-size: 0.6rem;\n  cursor: default;\n}\n[open] > summary::before {\n  content: "";\n}\n';
    var _ref = [], forEach = _ref.forEach, slice = _ref.slice;
    if (!support.open) {
        polyfillStyles();
        polyfillProperties();
        polyfillToggle();
        polyfillAccessibility();
    }
    if (support.open && !support.toggle) {
        polyfillToggleEvent();
    }
    function polyfillStyles() {
        document.head.insertAdjacentHTML("afterbegin", "<style>" + styles + "</style>");
    }
    function polyfillProperties() {
        var prototype = document.createElement("details").constructor.prototype;
        var setAttribute = prototype.setAttribute, removeAttribute = prototype.removeAttribute;
        var open = Object.getOwnPropertyDescriptor(prototype, "open");
        Object.defineProperties(prototype, {
            open: {
                get: function get() {
                    if (this.tagName == "DETAILS") {
                        return this.hasAttribute("open");
                    } else {
                        if (open && open.get) {
                            return open.get.call(this);
                        }
                    }
                },
                set: function set(value) {
                    if (this.tagName == "DETAILS") {
                        return value ? this.setAttribute("open", "") : this.removeAttribute("open");
                    } else {
                        if (open && open.set) {
                            return open.set.call(this, value);
                        }
                    }
                }
            },
            setAttribute: {
                value: function value(name, _value) {
                    var _this = this;
                    var call = function call() {
                        return setAttribute.call(_this, name, _value);
                    };
                    if (name == "open" && this.tagName == "DETAILS") {
                        var wasOpen = this.hasAttribute("open");
                        var result = call();
                        if (!wasOpen) {
                            var summary = this.querySelector("summary");
                            if (summary) summary.setAttribute("aria-expanded", true);
                            triggerToggle(this);
                        }
                        return result;
                    }
                    return call();
                }
            },
            removeAttribute: {
                value: function value(name) {
                    var _this2 = this;
                    var call = function call() {
                        return removeAttribute.call(_this2, name);
                    };
                    if (name == "open" && this.tagName == "DETAILS") {
                        var wasOpen = this.hasAttribute("open");
                        var result = call();
                        if (wasOpen) {
                            var summary = this.querySelector("summary");
                            if (summary) summary.setAttribute("aria-expanded", false);
                            triggerToggle(this);
                        }
                        return result;
                    }
                    return call();
                }
            }
        });
    }
    function polyfillToggle() {
        onTogglingTrigger(function(element) {
            element.hasAttribute("open") ? element.removeAttribute("open") : element.setAttribute("open", "");
        });
    }
    function polyfillToggleEvent() {
        if (window.MutationObserver) {
            new MutationObserver(function(mutations) {
                forEach.call(mutations, function(mutation) {
                    var target = mutation.target, attributeName = mutation.attributeName;
                    if (target.tagName == "DETAILS" && attributeName == "open") {
                        triggerToggle(target);
                    }
                });
            }).observe(document.documentElement, {
                attributes: true,
                subtree: true
            });
        } else {
            onTogglingTrigger(function(element) {
                var wasOpen = element.getAttribute("open");
                setTimeout(function() {
                    var isOpen = element.getAttribute("open");
                    if (wasOpen != isOpen) {
                        triggerToggle(element);
                    }
                }, 1);
            });
        }
    }
    function polyfillAccessibility() {
        setAccessibilityAttributes(document);
        if (window.MutationObserver) {
            new MutationObserver(function(mutations) {
                forEach.call(mutations, function(mutation) {
                    forEach.call(mutation.addedNodes, setAccessibilityAttributes);
                });
            }).observe(document.documentElement, {
                subtree: true,
                childList: true
            });
        } else {
            document.addEventListener("DOMNodeInserted", function(event) {
                setAccessibilityAttributes(event.target);
            });
        }
    }
    function setAccessibilityAttributes(root) {
        findElementsWithTagName(root, "SUMMARY").forEach(function(summary) {
            var details = findClosestElementWithTagName(summary, "DETAILS");
            summary.setAttribute("aria-expanded", details.hasAttribute("open"));
            if (!summary.hasAttribute("tabindex")) summary.setAttribute("tabindex", "0");
            if (!summary.hasAttribute("role")) summary.setAttribute("role", "button");
        });
    }
    function eventIsSignificant(event) {
        return !(event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.target.isContentEditable);
    }
    function onTogglingTrigger(callback) {
        addEventListener("click", function(event) {
            if (eventIsSignificant(event)) {
                if (event.which <= 1) {
                    var element = findClosestElementWithTagName(event.target, "SUMMARY");
                    if (element && element.parentNode && element.parentNode.tagName == "DETAILS") {
                        callback(element.parentNode);
                    }
                }
            }
        }, false);
        addEventListener("keydown", function(event) {
            if (eventIsSignificant(event)) {
                if (event.keyCode == 13 || event.keyCode == 32) {
                    var element = findClosestElementWithTagName(event.target, "SUMMARY");
                    if (element && element.parentNode && element.parentNode.tagName == "DETAILS") {
                        callback(element.parentNode);
                        event.preventDefault();
                    }
                }
            }
        }, false);
    }
    function triggerToggle(element) {
        var event = document.createEvent("Event");
        event.initEvent("toggle", false, false);
        element.dispatchEvent(event);
    }
    function findElementsWithTagName(root, tagName) {
        return (root.tagName == tagName ? [ root ] : []).concat(typeof root.getElementsByTagName == "function" ? slice.call(root.getElementsByTagName(tagName)) : []);
    }
    function findClosestElementWithTagName(element, tagName) {
        if (typeof element.closest == "function") {
            return element.closest(tagName);
        } else {
            while (element) {
                if (element.tagName == tagName) {
                    return element;
                } else {
                    element = element.parentNode;
                }
            }
        }
    }
})();