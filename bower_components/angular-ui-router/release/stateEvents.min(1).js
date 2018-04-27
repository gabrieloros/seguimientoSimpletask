/**
 * State-based routing for AngularJS 1.x
 * @version v1.0.10
 * @link https://ui-router.github.io
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("angular")):"function"==typeof define&&define.amd?define(["exports","angular"],e):e(t["@uirouter/angularjs-state-events"]={},t.angular)}(this,function(t,e){"use strict";var r=angular,n=e&&e.module?e:r;!function(){function t(t,e){var r,n;if(Array.isArray(e)&&(r=e[0],n=e[1]),!s(r))throw new Error("invalid parameters to applyPairs");return t[r]=n,t}function e(t){if(t.options().notify&&t.valid()&&!t.ignored()){var e=t.injector(),r=e.get("$stateEvents"),n=e.get("$rootScope"),o=e.get("$state"),a=e.get("$urlRouter"),s=r.provider.enabled(),i=t.params("to"),u=t.params("from");if(s.$stateChangeSuccess){if(n.$broadcast("$stateChangeStart",t.to(),i,t.from(),u,t.options(),t).defaultPrevented)return s.$stateChangeCancel&&n.$broadcast("$stateChangeCancel",t.to(),i,t.from(),u,t.options(),t),null==o.transition&&a.update(),!1;var c={priority:9999};t.onSuccess({},function(){n.$broadcast("$stateChangeSuccess",t.to(),i,t.from(),u,t.options(),t)},c)}s.$stateChangeError&&t.promise.catch(function(e){(!e||2!==e.type&&3!==e.type)&&(n.$broadcast("$stateChangeError",t.to(),i,t.from(),u,e,t.options(),t).defaultPrevented||a.update())})}}function r(t,e,r){function n(){return o.target(u.to,u.toParams,u.options)}var o=r.get("$state"),s=r.get("$rootScope"),i=r.get("$urlRouter"),u={to:t.identifier(),toParams:t.params(),options:t.options()},c=s.$broadcast("$stateNotFound",u,e.state(),e.params());return(c.defaultPrevented||c.retry)&&i.update(),!c.defaultPrevented&&(c.retry||o.get(u.to)?c.retry&&a(c.retry.then)?c.retry.then(n):n():void 0)}function o(n){function a(){if(i)throw new Error("Cannot enable events at runtime (use $stateEventsProvider")}function s(t){return i=!0,c.$stateNotFound&&n.onInvalid(r),c.$stateChangeStart&&t.onBefore({},e,{priority:1e3}),{provider:o.prototype.instance}}o.prototype.instance=this;var i=!1,u=["$stateChangeStart","$stateNotFound","$stateChangeSuccess","$stateChangeError"],c=u.map(function(t){return[t,!0]}).reduce(t,{});this.enable=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];a(),t&&t.length||(t=u),t.forEach(function(t){return c[t]=!0})},this.disable=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];a(),t&&t.length||(t=u),t.forEach(function(t){return delete c[t]})},this.enabled=function(){return c},this.$get=s,s.$inject=["$transitions"]}var a=n.isFunction,s=n.isString;r.$inject=["$to$","$from$","$state","$rootScope","$urlRouter"],o.$inject=["$stateProvider"],n.module("ui.router.state.events",["ui.router.state"]).provider("$stateEvents",o).run(["$stateEvents",function(t){}])}(),t.$stateChangeStart=void 0,t.$stateChangeCancel=void 0,t.$stateChangeSuccess=void 0,t.$stateChangeError=void 0,t.$stateNotFound=void 0,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=stateEvents.min.js.map
