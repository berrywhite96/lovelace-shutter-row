/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=window,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$3=new WeakMap;class o$3{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$3.set(s,t));}return t}toString(){return this.cssText}}const r$3=t=>new o$3("string"==typeof t?t:t+"",void 0,s$3),i$1=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$3(n,t,s$3)},S$1=(s,n)=>{e$2?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$2.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$1=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$1=window,r$2=e$1.trustedTypes,h$1=r$2?r$2.emptyScript:"",o$2=e$1.reactiveElementPolyfillSupport,n$2={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:n$2,reflect:!1,hasChanged:a$1};class d$1 extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;null!==(i=this.h)&&void 0!==i||(this.h=[]),this.h.push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$1(i));}else void 0!==i&&s.push(c$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$2).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$2;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}}d$1.finalized=!0,d$1.elementProperties=new Map,d$1.elementStyles=[],d$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:d$1}),(null!==(s$2=e$1.reactiveElementVersions)&&void 0!==s$2?s$2:e$1.reactiveElementVersions=[]).push("1.4.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$1;const i=window,s$1=i.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$1=`lit$${(Math.random()+"").slice(9)}$`,n$1="?"+o$1,l$1=`<${n$1}>`,h=document,r$1=(t="")=>h.createComment(t),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,c=t=>u(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,a=/-->/g,f=/>/g,_=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),m=/'/g,p=/"/g,$=/^(?:script|style|textarea|title)$/i,g=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),y=g(1),x=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),T=new WeakMap,A=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new S(i.insertBefore(r$1(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l},E$1=h.createTreeWalker(h,129,null,!1),C=(t,i)=>{const s=t.length-1,n=[];let h,r=2===i?"<svg>":"",d=v;for(let i=0;i<s;i++){const s=t[i];let e,u,c=-1,g=0;for(;g<s.length&&(d.lastIndex=g,u=d.exec(s),null!==u);)g=d.lastIndex,d===v?"!--"===u[1]?d=a:void 0!==u[1]?d=f:void 0!==u[2]?($.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=_):void 0!==u[3]&&(d=_):d===_?">"===u[0]?(d=null!=h?h:v,c=-1):void 0===u[1]?c=-2:(c=d.lastIndex-u[2].length,e=u[1],d=void 0===u[3]?_:'"'===u[3]?p:m):d===p||d===m?d=_:d===a||d===f?d=v:(d=_,h=void 0);const y=d===_&&t[i+1].startsWith("/>")?" ":"";r+=d===v?s+l$1:c>=0?(n.push(e),s.slice(0,c)+"$lit$"+s.slice(c)+o$1+y):s+o$1+(-2===c?(n.push(void 0),i):y);}const u=r+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==e?e.createHTML(u):u,n]};class P{constructor({strings:t,_$litType$:i},e){let l;this.parts=[];let h=0,d=0;const u=t.length-1,c=this.parts,[v,a]=C(t,i);if(this.el=P.createElement(v,e),E$1.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=E$1.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(o$1)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(o$1),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:h,name:i[2],strings:t,ctor:"."===i[1]?R:"?"===i[1]?H:"@"===i[1]?I:M});}else c.push({type:6,index:h});}for(const i of t)l.removeAttribute(i);}if($.test(l.tagName)){const t=l.textContent.split(o$1),i=t.length-1;if(i>0){l.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)l.append(t[s],r$1()),E$1.nextNode(),c.push({type:2,index:++h});l.append(t[i],r$1());}}}else if(8===l.nodeType)if(l.data===n$1)c.push({type:2,index:h});else {let t=-1;for(;-1!==(t=l.data.indexOf(o$1,t+1));)c.push({type:7,index:h}),t+=o$1.length-1;}h++;}}static createElement(t,i){const s=h.createElement("template");return s.innerHTML=t,s}}function V(t,i,s=t,e){var o,n,l,h;if(i===x)return i;let r=void 0!==e?null===(o=s._$Cl)||void 0===o?void 0:o[e]:s._$Cu;const u=d(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===u?r=void 0:(r=new u(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Cl)&&void 0!==l?l:h._$Cl=[])[e]=r:s._$Cu=r),void 0!==r&&(i=V(t,r._$AS(t,i.values),r,e)),i}class N{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:h).importNode(s,!0);E$1.currentNode=o;let n=E$1.nextNode(),l=0,r=0,d=e[0];for(;void 0!==d;){if(l===d.index){let i;2===d.type?i=new S(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new L(n,this,t)),this.v.push(i),d=e[++r];}l!==(null==d?void 0:d.index)&&(n=E$1.nextNode(),l++);}return o}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class S{constructor(t,i,s,e){var o;this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$C_=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$C_}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=V(this,t,i),d(t)?t===b||null==t||""===t?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==x&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.k(t):c(t)?this.O(t):this.$(t);}S(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t));}$(t){this._$AH!==b&&d(this._$AH)?this._$AA.nextSibling.data=t:this.k(h.createTextNode(t)),this._$AH=t;}T(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=P.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(s);else {const t=new N(o,this),i=t.p(this.options);t.m(s),this.k(i),this._$AH=t;}}_$AC(t){let i=T.get(t.strings);return void 0===i&&T.set(t.strings,i=new P(t)),i}O(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new S(this.S(r$1()),this.S(r$1()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$C_=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class M{constructor(t,i,s,e,o){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=V(this,t,i,0),n=!d(t)||t!==this._$AH&&t!==x,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=V(this,e[s+l],i,l),h===x&&(h=this._$AH[l]),n||(n=!d(h)||h!==this._$AH[l]),h===b?t=b:t!==b&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.P(t);}P(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class R extends M{constructor(){super(...arguments),this.type=3;}P(t){this.element[this.name]=t===b?void 0:t;}}const k=s$1?s$1.emptyScript:"";class H extends M{constructor(){super(...arguments),this.type=4;}P(t){t&&t!==b?this.element.setAttribute(this.name,k):this.element.removeAttribute(this.name);}}class I extends M{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=V(this,t,i,0))&&void 0!==s?s:b)===x)return;const e=this._$AH,o=t===b&&e!==b||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==b&&(e===b||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class L{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){V(this,t);}}const Z$1=i.litHtmlPolyfillSupport;null==Z$1||Z$1(P,S),(null!==(t$1=i.litHtmlVersions)&&void 0!==t$1?t$1:i.litHtmlVersions=[]).push("2.3.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends d$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=A(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return x}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.2.2");

var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};

// https://tc39.es/ecma402/#sec-issanctionedsimpleunitidentifier
var SANCTIONED_UNITS = [
    'angle-degree',
    'area-acre',
    'area-hectare',
    'concentr-percent',
    'digital-bit',
    'digital-byte',
    'digital-gigabit',
    'digital-gigabyte',
    'digital-kilobit',
    'digital-kilobyte',
    'digital-megabit',
    'digital-megabyte',
    'digital-petabyte',
    'digital-terabit',
    'digital-terabyte',
    'duration-day',
    'duration-hour',
    'duration-millisecond',
    'duration-minute',
    'duration-month',
    'duration-second',
    'duration-week',
    'duration-year',
    'length-centimeter',
    'length-foot',
    'length-inch',
    'length-kilometer',
    'length-meter',
    'length-mile-scandinavian',
    'length-mile',
    'length-millimeter',
    'length-yard',
    'mass-gram',
    'mass-kilogram',
    'mass-ounce',
    'mass-pound',
    'mass-stone',
    'temperature-celsius',
    'temperature-fahrenheit',
    'volume-fluid-ounce',
    'volume-gallon',
    'volume-liter',
    'volume-milliliter',
];

SANCTIONED_UNITS.map(function (unit) {
    return unit.replace(/^(.*?)-/, '');
});

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/** @class */ ((function (_super) {
    __extends(MissingLocaleDataError, _super);
    function MissingLocaleDataError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'MISSING_LOCALE_DATA';
        return _this;
    }
    return MissingLocaleDataError;
})(Error));

var t,r;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none";}(t||(t={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24";}(r||(r={}));function O(){return (O=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);}return e}).apply(this,arguments)}function E(e){return e.substr(0,e.indexOf("."))}var Z=["closed","locked","off"],ne=function(e,t,r,n){n=n||{},r=null==r?{}:r;var i=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return i.detail=r,e.dispatchEvent(i),i};var le=function(e){ne(window,"haptic",e);},de=function(e,t,r){void 0===r&&(r=!1),r?history.replaceState(null,"",t):history.pushState(null,"",t),ne(window,"location-changed",{replace:r});},fe=function(e,t,r){void 0===r&&(r=!0);var n,i=E(t),a="group"===i?"homeassistant":i;switch(i){case"lock":n=r?"unlock":"lock";break;case"cover":n=r?"open_cover":"close_cover";break;default:n=r?"turn_on":"turn_off";}return e.callService(a,n,{entity_id:t})},ge=function(e,t){var r=Z.includes(e.states[t].state);return fe(e,t,r)},be=function(e,t,r,n,i){var a;if(i&&r.double_tap_action?a=r.double_tap_action:n&&r.hold_action?a=r.hold_action:!n&&r.tap_action&&(a=r.tap_action),a||(a={action:"more-info"}),!a.confirmation||a.confirmation.exemptions&&a.confirmation.exemptions.some(function(e){return e.user===t.user.id})||confirm(a.confirmation.text||"Are you sure you want to "+a.action+"?"))switch(a.action){case"more-info":(a.entity||r.entity||r.camera_image)&&(ne(e,"hass-more-info",{entityId:a.entity?a.entity:r.entity?r.entity:r.camera_image}),a.haptic&&le(a.haptic));break;case"navigate":a.navigation_path&&(de(0,a.navigation_path),a.haptic&&le(a.haptic));break;case"url":a.url_path&&window.open(a.url_path),a.haptic&&le(a.haptic);break;case"toggle":r.entity&&(ge(t,r.entity),a.haptic&&le(a.haptic));break;case"call-service":if(!a.service)return;var o=a.service.split(".",2),u=o[0],c=o[1],m=O({},a.service_data);"entity"===m.entity_id&&(m.entity_id=r.entity),t.callService(u,c,m,a.target),a.haptic&&le(a.haptic);break;case"fire-dom-event":ne(e,"ll-custom",a),a.haptic&&le(a.haptic);}};

// Material Design Icons v7.0.96
var mdiChevronDown = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z";
var mdiChevronUp = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z";
var mdiStop = "M18,18H6V6H18V18Z";

var HOLD_TIMER;
var HOLD_ACTIVED = false;
var HOLD_TIME = 500;

function onHoldPointerDown(e) {
    let timerDone = function() {
        HOLD_ACTIVED = true;
    };
    // Reset
    clearTimeout(HOLD_TIMER);
    HOLD_ACTIVED = false;
    // Start timer
    HOLD_TIMER = setTimeout(timerDone, HOLD_TIME);
}

function onPointerUp(context, onClickCallback, onHoldCallback, e) {
    if(HOLD_ACTIVED) {
        HOLD_ACTIVED = false;
        onHoldCallback.bind(context)(e);
    } else {
        onClickCallback.bind(context)(e);
    }
}

function getRippleElement() {
    let ripple = document.createElement("mwc-ripple");
    ripple.setAttribute("primary");
    return ripple;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = i$1`.disabled,
div.controls[state="unavailable"] ha-icon  {
    color: var(--disabled-text-color);
    cursor: default;
}
ha-card {
    padding: 16px;
}
ha-icon.active-icon,
ha-icon-button.active-icon {
    color: #fdd835 !important;
    color: var(--paper-item-icon-active-color, #fdd835) !important;
}
div.card-row {
    --card-row-height: 48px;
    display: flex;
    align-items: center;
    height: var(--card-row-height);
}
div.card-row.first-row ha-icon {
    width: 40px;
    height: 40px;
    line-height: 40px;
}
div.card-row.first-row ha-icon-button {
    width: var(--card-row-height);
    height: var(--card-row-height);
    line-height: var(--card-row-height);
}
div.card-row.first-row ha-icon,
div.card-row.first-row ha-icon-button {
    display: inline-block;
    text-align: center;
    cursor: pointer;
}
div.entity-icon ha-icon {
    color: #44739e;
    color: var(--paper-item-icon-color, #44739e);
}
div.card-row.first-row span.entity-name {
    margin-left: 16px;
    margin-right: 8px;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex: 1 1;
}
div.card-row.first-row div.controls {
    margin-left: auto;
}
div.card-row.second-row ha-slider {
    width: 100%;
    padding-left: var(--card-row-height);
    box-sizing: border-box;
}
div.card-row.second-row div.infos {
    width: 175px;
    text-align: right;
}
div.card-row.preset-buttons {
    justify-content: center;
    padding-left: var(--card-row-height);
    flex-wrap: wrap;
    height: auto;
}
div.card-row.preset-buttons div.button {
    position: relative;
    padding: 0.5em 0.75em;
    cursor: pointer;
}
div.card-row.preset-buttons div.button span {
    margin-left: 0.25em;
}`;
styleInject(css_248z);

let HASSIO_CARD_ID = "shutter-row";
let HASSIO_CARD_NAME = "Shutter row";
let VERSION = "0.2.2";


class ShutterRow extends s {
    /*
        Lovelace needed functions
    */
    static get properties() {
        return {
            hass: Object,
            config: Object,
        };
    }
    // Lovelace card height
    getCardSize() {
        return 2;
    }
    // On user config update
    setConfig(config) {
        let getConfigAttribute = (attribute, defaultValue, array=this._config) => {
            if(!array)
                return;
            return attribute in array ? array[attribute] : defaultValue;
        };
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }

        this._config = config;
        this.config = {
            type: config.type,
            entity: config.entity,
            name: getConfigAttribute("name", false),
            invert_position: getConfigAttribute("invert_position", false),
            invert_position_label: getConfigAttribute("invert_position_label", false) || getConfigAttribute("invert_position", false),
            state_color: getConfigAttribute("state_color", false),
            move_down_button: {
                tap_action: getConfigAttribute("tap_action", false, getConfigAttribute("move_down_button", false)),
                double_tap_action: getConfigAttribute("double_tap_action", false, getConfigAttribute("move_down_button", false)),
                hold_action: getConfigAttribute("hold_action", false, getConfigAttribute("move_down_button", false)),
            },
            move_stop_button: {
                tap_action: getConfigAttribute("tap_action", false, getConfigAttribute("move_stop_button", false)),
                double_tap_action: getConfigAttribute("double_tap_action", false, getConfigAttribute("move_stop_button", false)),
                hold_action: getConfigAttribute("hold_action", false, getConfigAttribute("move_stop_button", false)),
            },
            move_up_button: {
                tap_action: getConfigAttribute("tap_action", false, getConfigAttribute("move_up_button", false)),
                double_tap_action: getConfigAttribute("double_tap_action", false, getConfigAttribute("move_up_button", false)),
                hold_action: getConfigAttribute("hold_action", false, getConfigAttribute("move_up_button", false)),
            },
            preset_buttons: getConfigAttribute("preset_buttons", false),
        };
        this.entityId = this.config.entity;
    }
    // Calls custom action if defined
    callCustomAction(config, action) {
        // Check if defined
        if(!config[action])
            return;
        // Run custom action
        switch(action) {
            case "tap_action": be(this, this.hass, config, false, false); break;
            case "double_tap_action": be(this, this.hass, config, false, true); break;
            case "hold_action": be(this, this.hass, config, true, false); break;
        }
    }

    /*
        Card functions
    */
    // Returns CSS style
    static get styles() {
        return css_248z;
    }
    // Get entity name
    getName() {
        if(this.config.name)
            return this.config.name;
        return this.state.attributes.friendly_name;
    }
    // Get position value
    getPosition() {
        if(this.config.invert_position)
            return (100 - this.state.attributes.current_position);
        return this.state.attributes.current_position;
    }
    // Get position text for label
    getPositionLabel() {
        if( (this.config.invert_position_label && this.getPosition() == 100) ||
                (!this.config.invert_position_label && this.getPosition() == 0) )
            return this.hass.localize("component.cover.state._.closed");
        if( (this.config.invert_position_label && this.getPosition() == 0) ||
                (!this.config.invert_position_label && this.getPosition() == 100) )
            return this.hass.localize("component.cover.state._.open");
        return `${this.getPosition()} %`;
    }
    // Sets meta for variables
    setMeta(force=false) {
        // Only on change
        if(this.state == this.hass.states[this.entityId] && !force)
            return;
        this.state = this.hass.states[this.entityId];
        this.stateDisplay = this.state ? this.state.state : 'unavailable';
    }
    // Checks if cover is fully opened
    upReached() {
        if(!this.config.invert_position_label && this.getPosition() == 100 ||
        this.config.invert_position_label && this.getPosition() == 0)
                return true;
        return false;
    }
    // Checks if cover is fully closed
    downReached() {
        if(this.config.invert_position_label && this.getPosition() == 100 ||
            !this.config.invert_position_label && this.getPosition() == 0)
                return true;
        return false;
    }

    // Render entity icon
    renderIcon() {
        let icon = "";
        // Check for entity defined icon
        if(this.state.attributes.icon != undefined)
            icon = this.state.attributes.icon;
        else {
            // Use dynamic icon
            if(this.downReached())
                icon = "mdi:window-shutter";
            else
                icon = "mdi:window-shutter-open";
        }
        return y`<ha-icon icon="${icon}" class="${(this.config.state_color != undefined && this.config.state_color && this.stateDisplay != "closed") ? "active-icon" : ""}"></ha-icon>`;
    }
    renderFirstRow() {
        let moveUpDisabled = () => {
            if(this.stateDisplay == "unavailable")
                return true;
            if(this.upReached() || this.stateDisplay == "opening" || this.state.attributes.moving == "UP")
                return true;
            return false;
        };
        let moveStopDisabled = () => {
            if(this.stateDisplay == "unavailable")
                return true;
            if(this.state.attributes.moving == "STOP")
                return true;
            return false;
        };
        let moveDownDisabled = () => {
            if(this.stateDisplay == "unavailable")
                return true;
            if(this.downReached() || this.stateDisplay == "closing" || this.state.attributes.moving == "DOWN")
                return true;
            return false;
        };

        return y`
            <div class="card-row first-row">
                <div class="entity-icon">
                    ${this.renderIcon()}
                </div>
                
                <span class="entity-name" @click="${this.moreInfo}">${this.getName()}</span>
                <div class="controls" state="${this.stateDisplay}">
                    <ha-icon-button
                        .label=${this.hass.localize("ui.dialogs.more_info_control.cover.open_cover")}
                        .path="${mdiChevronUp}"
                        .disabled=${moveUpDisabled()}
                        @dblclick="${this.onMoveUpDoubleClick}"
                        @pointerdown="${onHoldPointerDown}"
                        @pointerup="${this.onMoveUpPointerUp}">
                    </ha-icon-button>
                    <ha-icon-button
                        .label=${this.hass.localize("ui.dialogs.more_info_control.cover.stop_cover")}
                        .path="${mdiStop}"
                        .disabled=${moveStopDisabled()}
                        @dblclick="${this.onMoveStopDoubleClick}"
                        @pointerdown="${onHoldPointerDown}"
                        @pointerup="${this.onMoveStopPointerUp}">
                    </ha-icon-button>
                    <ha-icon-button
                        .label=${this.hass.localize("ui.dialogs.more_info_control.cover.close_cover")}
                        .path="${mdiChevronDown}"
                        .disabled=${moveDownDisabled()}
                        @dblclick="${this.onMoveDownDoubleClick}"
                        @pointerdown="${onHoldPointerDown}"
                        @pointerup="${this.onMoveDownPointerUp}">
                    </ha-icon-button>
                </div>
            </div>
        `;
    }
    renderSecondRow() {
        return y`
            <div class="card-row second-row">
                <ha-slider ignore-bar-touch="" min="0" max="100" value=${this.getPosition()} step="5" pin dir="ltr" role="slider" @change="${this.onSliderChange}"></ha-slider>
                <div class="infos">
                    <span class="position">${this.getPositionLabel()}</span>
                </div>
            </div>
        `;
    }
    renderPresetsRow() {
        if(!this.config.preset_buttons)
            return;
        let presetsHtml = [];
        this.config.preset_buttons.forEach(presetConfig => {
            presetsHtml.push(this.renderPreset(presetConfig));
        });
        return y`
            <div class="card-row preset-buttons">
               ${presetsHtml}
            </div>
        `;
    }
    renderPreset(presetConfig) {
        // Ripple effect
        let ripple = getRippleElement();
        // Events
        let onPointerDownFunc = () => {
            ripple.startPress();
            onHoldPointerDown();
        };
        let onPointerUpFunc = () => {
            ripple.endPress();
            let onClickCallback = () => {
                this.callCustomAction(presetConfig, "tap_action");
            };
            let onHoldCallback = () => {
                this.callCustomAction(presetConfig, "hold_action");
            };
            onPointerUp(this, onClickCallback, onHoldCallback);
        };
        let onDoubleClick = () => {
            this.callCustomAction(presetConfig, "double_tap_action");
        };

        return y`
            <div class="button" @dblclick="${onDoubleClick}" @pointerdown="${onPointerDownFunc}" @pointerup="${onPointerUpFunc}">
                <ha-icon icon="${presetConfig.icon}"></ha-icon>
                <span>${presetConfig.name}</span>
                ${ripple}
            </div>
        `;
    }
    // Render lovelace card
    render() {
        this.setMeta();
        
        return y`
            <ha-card>
                ${this.renderFirstRow()}
                ${this.renderSecondRow()}
                ${this.renderPresetsRow()}
            </ha-card>
        `;
    }
    /*
        DOM element handler
    */
    // Get all important DOM elements
    _getElements() {
        return {
            controls: this.renderRoot.querySelector("div.card-row.first-row div.controls"),
            slider: this.renderRoot.querySelector("div.card-row.second-row ha-slider"),
        }
    }

    // On move up pointer up
    onMoveUpPointerUp() {
        let onClickCallback = (e) => {
            if(this.config.move_up_button && this.config.move_up_button.tap_action) {
                this.callCustomAction(this.config.move_up_button, "tap_action");
                return;
            }
            // Run default action
            if(this.upReached())
                return;
            this.hass.callService("cover", "open_cover", {
                entity_id: this.entityId,
            });
        };
        let onHoldCallback = (e) => {
            this.callCustomAction(this.config.move_up_button, "hold_action");
        };
        onPointerUp(this, onClickCallback, onHoldCallback);
    }
    // On move up double click
    onMoveUpDoubleClick() {
        this.callCustomAction(this.config.move_up_button, "double_tap_action");
    }
    // On move stop pointer up
    onMoveStopPointerUp() {
        let onClickCallback = (e) => {
            if(this.config.move_stop_button && this.config.move_stop_button.tap_action) {
                this.callCustomAction(this.config.move_stop_button, "tap_action");
                return;
            }
            // Run default action
            if(this.state.attributes.moving == "STOP")
                return;
            this.hass.callService("cover", "stop_cover", {
                entity_id: this.entityId,
            });
        };
        let onHoldCallback = (e) => {
            this.callCustomAction(this.config.move_stop_button, "hold_action");
        };
        onPointerUp(this, onClickCallback, onHoldCallback);
    }
    // On move down double click
    onMoveStopDoubleClick() {
        this.callCustomAction(this.config.move_stop_button, "double_tap_action");
    }
    // On move down pointer up
    onMoveDownPointerUp() {
        let onClickCallback = (e) => {
            if(this.config.move_down_button && this.config.move_down_button.tap_action) {
                this.callCustomAction(this.config.move_down_button, "tap_action");
                return;
            }
            // Run default action
            if(this.downReached())
                return;
            this.hass.callService("cover", "close_cover", {
                entity_id: this.entityId,
            });
        };
        let onHoldCallback = (e) => {
            this.callCustomAction(this.config.move_down_button, "hold_action");
        };
        onPointerUp(this, onClickCallback, onHoldCallback);
    }
    // On move down double click
    onMoveDownDoubleClick() {
        this.callCustomAction(this.config.move_down_button, "double_tap_action");
    }

    // On position input change
    onSliderChange() {
        let elements = this._getElements();
        let value = parseInt(elements.slider.value);
        if(value == this.getPosition())
            return;
        this.hass.callService("cover", "set_cover_position", {
            entity_id: this.entityId,
            position: this.config.invert_position ? (100 - value) : value,
        });
    }
    // Open HA more info
    moreInfo() {
        let entityId = this.config.entity;
        ne(this, 'hass-more-info', {
            entityId,
        }, {
            bubbles: false,
            composed: true,
        });
    }
}

customElements.define(HASSIO_CARD_ID, ShutterRow);
console.info("%c" + HASSIO_CARD_NAME.toLocaleUpperCase() + " " + VERSION, "color: #ffa500");
