!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.aston=e():t.aston=e()}(window,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";function r(t){return function(t){if(Array.isArray(t))return t}(t)||c(t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function u(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return e.get(t).value}function a(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||c(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function c(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function f(t,e,n,r,o,i,u){try{var a=t[i](u),c=a.value}catch(t){return void n(t)}a.done?e(c):Promise.resolve(c).then(r,o)}function l(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){return!e||"object"!==o(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function p(t){var e="function"==typeof Map?new Map:void 0;return(p=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return y(t,arguments,b(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),v(r,t)})(t)}function y(t,e,n){return(y=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var o=new(Function.bind.apply(t,r));return n&&v(o,n.prototype),o}).apply(null,arguments)}function v(t,e){return(v=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function b(t){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}n.r(e),n.d(e,"AstonError",function(){return d});var d=function(t){function e(){return l(this,e),s(this,b(e).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&v(t,e)}(e,p(Error)),e}(),h=function(){var t,e=(t=regeneratorRuntime.mark(function t(e,n,r){var o,i,u,c,f,l,s,p,v,b=arguments;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(i=[],!n.ASTON_CONSTRUCTOR){t.next=5;break}return t.next=4,e.getItems(n.ASTON_CONSTRUCTOR);case 4:i=t.sent;case 5:for(u=b.length,c=new Array(u>3?u-3:0),f=3;f<u;f++)c[f-3]=b[f];if(!n.ASTON_INJECT){t.next=16;break}return l=Object.keys(n.ASTON_INJECT),s=l.map(function(t){return e.get(n.ASTON_INJECT[t])}),o=y(n,a(i).concat(c)),t.next=12,Promise.all(s);case 12:for(p=t.sent,v=0;v<l.length;v++)o[l[v]]=p[v];t.next=25;break;case 16:t.prev=16,o=r?n.apply(void 0,[e].concat(a(i),c)):n.apply(void 0,a(i).concat(c)),t.next=25;break;case 20:if(t.prev=20,t.t0=t.catch(16),!(t.t0 instanceof d)){t.next=24;break}throw t.t0;case 24:o=y(n,a(i).concat(c));case 25:return t.abrupt("return",o);case 26:case"end":return t.stop()}},t,this,[[16,20]])}),function(){var e=this,n=arguments;return new Promise(function(r,o){var i=t.apply(e,n);function u(t){f(i,r,o,u,a,"next",t)}function a(t){f(i,r,o,u,a,"throw",t)}u(void 0)})});return function(t,n,r){return e.apply(this,arguments)}}(),w=new WeakMap,m=new WeakMap,g=new WeakMap,O=new WeakMap,j=new function t(e){var n=this;l(this,t),w.set(this,{writable:!0,value:void 0}),m.set(this,{writable:!0,value:function(){return new t(u(n,w))}}),g.set(this,{writable:!0,value:function(t,e){var n=t.key,r=t.value,i=t.single,a=t.multi;if(void 0===n&&void 0!==r)throw new d("can only inject a value with a key");var c=i||a;if(void 0!==c&&!(c instanceof Object))throw new d("single or multi must be constructable");if(void 0!==a&&"object"===o(a))throw new d("multi cannot be an object instance");var f=0;if(void 0!==i&&f++,void 0!==a&&f++,void 0!==r&&f++,1!==f)throw new d("injected item should specify exactly one of the value, single or multi properties");var l=n;if(null==l){if("object"===o(i))return void u(e,w).set(i.constructor,{value:i});l=i||a}if(u(e,w).has(l))throw new d("duplicate key added");c&&(t.astonInstance=e),u(e,w).set(l,t)}}),i(this,"inject",function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];if(0===e.length)return n;var o=u(n,m).call(n);return e.forEach(function(t){u(n,g).call(n,function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),r.forEach(function(e){i(t,e,n[e])})}return t}({},t),o)}),o}),i(this,"get",function(t){if(!u(n,w).has(t))throw new d("key not defined: ".concat(t));var e=u(n,w).get(t),r=e.single,o=e.value,i=e.multi,c=e.args,f=void 0===c?[]:c,l=e.supplyAston,s=void 0!==l&&l;if(void 0!==o)return o;for(var p=arguments.length,y=new Array(p>1?p-1:0),v=1;v<p;v++)y[v-1]=arguments[v];if(i)return h.apply(void 0,[e.astonInstance,i,s].concat(a(f),y));if(y.length>0)throw new d("Single item should not receive extra arguments");return e.value=h.apply(void 0,[e.astonInstance,r,s].concat(a(f),y)),e.astonInstance=null,e.value}),O.set(this,{writable:!0,value:function(t){if(Array.isArray(t)){var e=r(t),o=e[0],i=e.slice(1);return n.get.apply(n,[o].concat(a(i)))}return n.get(t)}}),i(this,"getItems",function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return Promise.all(e.map(u(n,O)))}),function(t,e,n){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");var r=e.get(t);if(!r.writable)throw new TypeError("attempted to set read only private field");r.value=n}(this,w,new Map(e))};e.default=j}])});