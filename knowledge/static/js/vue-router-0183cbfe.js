import{s as e,u as t,p as n,g as r,m as o,n as a,k as s,O as c,N as l,d as i,h as u,q as f,r as p,w as h}from"./@vue-b526e9a7.js";
/*!
  * vue-router v4.1.2
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */const d="undefined"!=typeof window;const m=Object.assign;function g(e,t){const n={};for(const r in t){const o=t[r];n[r]=y(o)?o.map(e):e(o)}return n}const v=()=>{},y=Array.isArray,b=/\/$/;function w(e,t,n="/"){let r,o={},a="",s="";const c=t.indexOf("#");let l=t.indexOf("?");return c<l&&c>=0&&(l=-1),l>-1&&(r=t.slice(0,l),a=t.slice(l+1,c>-1?c:t.length),o=e(a)),c>-1&&(r=r||t.slice(0,c),s=t.slice(c,t.length)),r=function(e,t){if(e.startsWith("/"))return e;if(!e)return t;const n=t.split("/"),r=e.split("/");let o,a,s=n.length-1;for(o=0;o<r.length;o++)if(a=r[o],"."!==a){if(".."!==a)break;s>1&&s--}return n.slice(0,s).join("/")+"/"+r.slice(o-(o===r.length?1:0)).join("/")}(null!=r?r:t,n),{fullPath:r+(a&&"?")+a+s,path:r,query:o,hash:s}}function E(e,t){return t&&e.toLowerCase().startsWith(t.toLowerCase())?e.slice(t.length)||"/":e}function O(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function R(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!k(e[n],t[n]))return!1;return!0}function k(e,t){return y(e)?P(e,t):y(t)?P(t,e):e===t}function P(e,t){return y(t)?e.length===t.length&&e.every(((e,n)=>e===t[n])):1===e.length&&e[0]===t}var x,C,$,S;function j(e){if(!e)if(d){const t=document.querySelector("base");e=(e=t&&t.getAttribute("href")||"/").replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return"/"!==e[0]&&"#"!==e[0]&&(e="/"+e),e.replace(b,"")}(C=x||(x={})).pop="pop",C.push="push",(S=$||($={})).back="back",S.forward="forward",S.unknown="";const q=/^[^#]+#/;function A(e,t){return e.replace(q,"#")+t}const L=()=>({left:window.pageXOffset,top:window.pageYOffset});function M(e){let t;if("el"in e){const n=e.el,r="string"==typeof n&&n.startsWith("#"),o="string"==typeof n?r?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!o)return;t=function(e,t){const n=document.documentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return{behavior:t.behavior,left:r.left-n.left-(t.left||0),top:r.top-n.top-(t.top||0)}}(o,e)}else t=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(t):window.scrollTo(null!=t.left?t.left:window.pageXOffset,null!=t.top?t.top:window.pageYOffset)}function G(e,t){return(history.state?history.state.position-t:-1)+e}const B=new Map;function _(e,t){const{pathname:n,search:r,hash:o}=t,a=e.indexOf("#");if(a>-1){let t=o.includes(e.slice(a))?e.slice(a).length:1,n=o.slice(t);return"/"!==n[0]&&(n="/"+n),E(n,"")}return E(n,e)+r+o}function I(e,t,n,r=!1,o=!1){return{back:e,current:t,forward:n,replaced:r,position:window.history.length,scroll:o?L():null}}function D(e){const{history:t,location:n}=window,r={value:_(e,n)},o={value:t.state};function a(r,a,s){const c=e.indexOf("#"),l=c>-1?(n.host&&document.querySelector("base")?e:e.slice(c))+r:location.protocol+"//"+location.host+e+r;try{t[s?"replaceState":"pushState"](a,"",l),o.value=a}catch(i){console.error(i),n[s?"replace":"assign"](l)}}return o.value||a(r.value,{back:null,current:r.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0),{location:r,state:o,push:function(e,n){const s=m({},o.value,t.state,{forward:e,scroll:L()});a(s.current,s,!0),a(e,m({},I(r.value,e,null),{position:s.position+1},n),!1),r.value=e},replace:function(e,n){a(e,m({},t.state,I(o.value.back,e,o.value.forward,!0),n,{position:o.value.position}),!0),r.value=e}}}function U(e){const t=D(e=j(e)),n=function(e,t,n,r){let o=[],a=[],s=null;const c=({state:a})=>{const c=_(e,location),l=n.value,i=t.value;let u=0;if(a){if(n.value=c,t.value=a,s&&s===l)return void(s=null);u=i?a.position-i.position:0}else r(c);o.forEach((e=>{e(n.value,l,{delta:u,type:x.pop,direction:u?u>0?$.forward:$.back:$.unknown})}))};function l(){const{history:e}=window;e.state&&e.replaceState(m({},e.state,{scroll:L()}),"")}return window.addEventListener("popstate",c),window.addEventListener("beforeunload",l),{pauseListeners:function(){s=n.value},listen:function(e){o.push(e);const t=()=>{const t=o.indexOf(e);t>-1&&o.splice(t,1)};return a.push(t),t},destroy:function(){for(const e of a)e();a=[],window.removeEventListener("popstate",c),window.removeEventListener("beforeunload",l)}}}(e,t.state,t.location,t.replace);const r=m({location:"",base:e,go:function(e,t=!0){t||n.pauseListeners(),history.go(e)},createHref:A.bind(null,e)},t,n);return Object.defineProperty(r,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(r,"state",{enumerable:!0,get:()=>t.state.value}),r}function F(e){return(e=location.host?e||location.pathname+location.search:"").includes("#")||(e+="#"),U(e)}function T(e){return"string"==typeof e||"symbol"==typeof e}const W={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0},V=Symbol("");var z,K;function H(e,t){return m(new Error,{type:e,[V]:!0},t)}function N(e,t){return e instanceof Error&&V in e&&(null==t||!!(e.type&t))}(K=z||(z={}))[K.aborted=4]="aborted",K[K.cancelled=8]="cancelled",K[K.duplicated=16]="duplicated";const Q={sensitive:!1,strict:!1,start:!0,end:!0},X=/[.+*?^${}()[\]/\\]/g;function Y(e,t){let n=0;for(;n<e.length&&n<t.length;){const r=t[n]-e[n];if(r)return r;n++}return e.length<t.length?1===e.length&&80===e[0]?-1:1:e.length>t.length?1===t.length&&80===t[0]?1:-1:0}function Z(e,t){let n=0;const r=e.score,o=t.score;for(;n<r.length&&n<o.length;){const e=Y(r[n],o[n]);if(e)return e;n++}if(1===Math.abs(o.length-r.length)){if(J(r))return 1;if(J(o))return-1}return o.length-r.length}function J(e){const t=e[e.length-1];return e.length>0&&t[t.length-1]<0}const ee={type:0,value:""},te=/[a-zA-Z0-9_]/;function ne(e,t,n){const r=function(e,t){const n=m({},Q,t),r=[];let o=n.start?"^":"";const a=[];for(const l of e){const e=l.length?[]:[90];n.strict&&!l.length&&(o+="/");for(let t=0;t<l.length;t++){const r=l[t];let s=40+(n.sensitive?.25:0);if(0===r.type)t||(o+="/"),o+=r.value.replace(X,"\\$&"),s+=40;else if(1===r.type){const{value:e,repeatable:n,optional:i,regexp:u}=r;a.push({name:e,repeatable:n,optional:i});const f=u||"[^/]+?";if("[^/]+?"!==f){s+=10;try{new RegExp(`(${f})`)}catch(c){throw new Error(`Invalid custom RegExp for param "${e}" (${f}): `+c.message)}}let p=n?`((?:${f})(?:/(?:${f}))*)`:`(${f})`;t||(p=i&&l.length<2?`(?:/${p})`:"/"+p),i&&(p+="?"),o+=p,s+=20,i&&(s+=-8),n&&(s+=-20),".*"===f&&(s+=-50)}e.push(s)}r.push(e)}if(n.strict&&n.end){const e=r.length-1;r[e][r[e].length-1]+=.7000000000000001}n.strict||(o+="/?"),n.end?o+="$":n.strict&&(o+="(?:/|$)");const s=new RegExp(o,n.sensitive?"":"i");return{re:s,score:r,keys:a,parse:function(e){const t=e.match(s),n={};if(!t)return null;for(let r=1;r<t.length;r++){const e=t[r]||"",o=a[r-1];n[o.name]=e&&o.repeatable?e.split("/"):e}return n},stringify:function(t){let n="",r=!1;for(const o of e){r&&n.endsWith("/")||(n+="/"),r=!1;for(const a of o)if(0===a.type)n+=a.value;else if(1===a.type){const{value:s,repeatable:c,optional:l}=a,i=s in t?t[s]:"";if(y(i)&&!c)throw new Error(`Provided param "${s}" is an array but it is not repeatable (* or + modifiers)`);const u=y(i)?i.join("/"):i;if(!u){if(!l)throw new Error(`Missing required param "${s}"`);o.length<2&&e.length>1&&(n.endsWith("/")?n=n.slice(0,-1):r=!0)}n+=u}}return n}}}(function(e){if(!e)return[[]];if("/"===e)return[[ee]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function t(e){throw new Error(`ERR (${n})/"${i}": ${e}`)}let n=0,r=n;const o=[];let a;function s(){a&&o.push(a),a=[]}let c,l=0,i="",u="";function f(){i&&(0===n?a.push({type:0,value:i}):1===n||2===n||3===n?(a.length>1&&("*"===c||"+"===c)&&t(`A repeatable param (${i}) must be alone in its segment. eg: '/:ids+.`),a.push({type:1,value:i,regexp:u,repeatable:"*"===c||"+"===c,optional:"*"===c||"?"===c})):t("Invalid state to consume buffer"),i="")}function p(){i+=c}for(;l<e.length;)if(c=e[l++],"\\"!==c||2===n)switch(n){case 0:"/"===c?(i&&f(),s()):":"===c?(f(),n=1):p();break;case 4:p(),n=r;break;case 1:"("===c?n=2:te.test(c)?p():(f(),n=0,"*"!==c&&"?"!==c&&"+"!==c&&l--);break;case 2:")"===c?"\\"==u[u.length-1]?u=u.slice(0,-1)+c:n=3:u+=c;break;case 3:f(),n=0,"*"!==c&&"?"!==c&&"+"!==c&&l--,u="";break;default:t("Unknown state")}else r=n,n=4;return 2===n&&t(`Unfinished custom RegExp for param "${i}"`),f(),s(),o}(e.path),n),o=m(r,{record:e,parent:t,children:[],alias:[]});return t&&!o.record.aliasOf==!t.record.aliasOf&&t.children.push(o),o}function re(e,t){const n=[],r=new Map;function o(e,n,r){const c=!r,l=function(e){return{path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:void 0,beforeEnter:e.beforeEnter,props:oe(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||null:e.component&&{default:e.component}}}(e);l.aliasOf=r&&r.record;const i=ce(t,e),u=[l];if("alias"in e){const t="string"==typeof e.alias?[e.alias]:e.alias;for(const e of t)u.push(m({},l,{components:r?r.record.components:l.components,path:e,aliasOf:r?r.record:l}))}let f,p;for(const t of u){const{path:u}=t;if(n&&"/"!==u[0]){const e=n.record.path,r="/"===e[e.length-1]?"":"/";t.path=n.record.path+(u&&r+u)}if(f=ne(t,n,i),r?r.alias.push(f):(p=p||f,p!==f&&p.alias.push(f),c&&e.name&&!ae(f)&&a(e.name)),l.children){const e=l.children;for(let t=0;t<e.length;t++)o(e[t],f,r&&r.children[t])}r=r||f,s(f)}return p?()=>{a(p)}:v}function a(e){if(T(e)){const t=r.get(e);t&&(r.delete(e),n.splice(n.indexOf(t),1),t.children.forEach(a),t.alias.forEach(a))}else{const t=n.indexOf(e);t>-1&&(n.splice(t,1),e.record.name&&r.delete(e.record.name),e.children.forEach(a),e.alias.forEach(a))}}function s(e){let t=0;for(;t<n.length&&Z(e,n[t])>=0&&(e.record.path!==n[t].record.path||!le(e,n[t]));)t++;n.splice(t,0,e),e.record.name&&!ae(e)&&r.set(e.record.name,e)}return t=ce({strict:!1,end:!0,sensitive:!1},t),e.forEach((e=>o(e))),{addRoute:o,resolve:function(e,t){let o,a,s,c={};if("name"in e&&e.name){if(o=r.get(e.name),!o)throw H(1,{location:e});s=o.record.name,c=m(function(e,t){const n={};for(const r of t)r in e&&(n[r]=e[r]);return n}(t.params,o.keys.filter((e=>!e.optional)).map((e=>e.name))),e.params),a=o.stringify(c)}else if("path"in e)a=e.path,o=n.find((e=>e.re.test(a))),o&&(c=o.parse(a),s=o.record.name);else{if(o=t.name?r.get(t.name):n.find((e=>e.re.test(t.path))),!o)throw H(1,{location:e,currentLocation:t});s=o.record.name,c=m({},t.params,e.params),a=o.stringify(c)}const l=[];let i=o;for(;i;)l.unshift(i.record),i=i.parent;return{name:s,path:a,params:c,matched:l,meta:se(l)}},removeRoute:a,getRoutes:function(){return n},getRecordMatcher:function(e){return r.get(e)}}}function oe(e){const t={},n=e.props||!1;if("component"in e)t.default=n;else for(const r in e.components)t[r]="boolean"==typeof n?n:n[r];return t}function ae(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function se(e){return e.reduce(((e,t)=>m(e,t.meta)),{})}function ce(e,t){const n={};for(const r in e)n[r]=r in t?t[r]:e[r];return n}function le(e,t){return t.children.some((t=>t===e||le(e,t)))}const ie=/#/g,ue=/&/g,fe=/\//g,pe=/=/g,he=/\?/g,de=/\+/g,me=/%5B/g,ge=/%5D/g,ve=/%5E/g,ye=/%60/g,be=/%7B/g,we=/%7C/g,Ee=/%7D/g,Oe=/%20/g;function Re(e){return encodeURI(""+e).replace(we,"|").replace(me,"[").replace(ge,"]")}function ke(e){return Re(e).replace(de,"%2B").replace(Oe,"+").replace(ie,"%23").replace(ue,"%26").replace(ye,"`").replace(be,"{").replace(Ee,"}").replace(ve,"^")}function Pe(e){return null==e?"":function(e){return Re(e).replace(ie,"%23").replace(he,"%3F")}(e).replace(fe,"%2F")}function xe(e){try{return decodeURIComponent(""+e)}catch(t){}return""+e}function Ce(e){const t={};if(""===e||"?"===e)return t;const n=("?"===e[0]?e.slice(1):e).split("&");for(let r=0;r<n.length;++r){const e=n[r].replace(de," "),o=e.indexOf("="),a=xe(o<0?e:e.slice(0,o)),s=o<0?null:xe(e.slice(o+1));if(a in t){let e=t[a];y(e)||(e=t[a]=[e]),e.push(s)}else t[a]=s}return t}function $e(e){let t="";for(let n in e){const r=e[n];if(n=ke(n).replace(pe,"%3D"),null==r){void 0!==r&&(t+=(t.length?"&":"")+n);continue}(y(r)?r.map((e=>e&&ke(e))):[r&&ke(r)]).forEach((e=>{void 0!==e&&(t+=(t.length?"&":"")+n,null!=e&&(t+="="+e))}))}return t}function Se(e){const t={};for(const n in e){const r=e[n];void 0!==r&&(t[n]=y(r)?r.map((e=>null==e?null:""+e)):null==r?r:""+r)}return t}const je=Symbol(""),qe=Symbol(""),Ae=Symbol(""),Le=Symbol(""),Me=Symbol("");function Ge(){let e=[];return{add:function(t){return e.push(t),()=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)}},list:()=>e,reset:function(){e=[]}}}function Be(e,t,n){const r=()=>{e[t].delete(n)};s(r),c(r),l((()=>{e[t].add(n)})),e[t].add(n)}function _e(e){const t=o(je,{}).value;t&&Be(t,"leaveGuards",e)}function Ie(e){const t=o(je,{}).value;t&&Be(t,"updateGuards",e)}function De(e,t,n,r,o){const a=r&&(r.enterCallbacks[o]=r.enterCallbacks[o]||[]);return()=>new Promise(((s,c)=>{const l=e=>{var l;!1===e?c(H(4,{from:n,to:t})):e instanceof Error?c(e):"string"==typeof(l=e)||l&&"object"==typeof l?c(H(2,{from:t,to:e})):(a&&r.enterCallbacks[o]===a&&"function"==typeof e&&a.push(e),s())},i=e.call(r&&r.instances[o],t,n,l);let u=Promise.resolve(i);e.length<3&&(u=u.then(l)),u.catch((e=>c(e)))}))}function Ue(e,t,n,r){const o=[];for(const s of e)for(const e in s.components){let c=s.components[e];if("beforeRouteEnter"===t||s.instances[e])if("object"==typeof(a=c)||"displayName"in a||"props"in a||"__vccOpts"in a){const a=(c.__vccOpts||c)[t];a&&o.push(De(a,n,r,s,e))}else{let a=c();o.push((()=>a.then((o=>{if(!o)return Promise.reject(new Error(`Couldn't resolve component "${e}" at "${s.path}"`));const a=(c=o).__esModule||"Module"===c[Symbol.toStringTag]?o.default:o;var c;s.components[e]=a;const l=(a.__vccOpts||a)[t];return l&&De(l,n,r,s,e)()}))))}}var a;return o}function Fe(e){const r=o(Ae),a=o(Le),s=n((()=>r.resolve(t(e.to)))),c=n((()=>{const{matched:e}=s.value,{length:t}=e,n=e[t-1],r=a.matched;if(!n||!r.length)return-1;const o=r.findIndex(O.bind(null,n));if(o>-1)return o;const c=We(e[t-2]);return t>1&&We(n)===c&&r[r.length-1].path!==c?r.findIndex(O.bind(null,e[t-2])):o})),l=n((()=>c.value>-1&&function(e,t){for(const n in t){const r=t[n],o=e[n];if("string"==typeof r){if(r!==o)return!1}else if(!y(o)||o.length!==r.length||r.some(((e,t)=>e!==o[t])))return!1}return!0}(a.params,s.value.params))),i=n((()=>c.value>-1&&c.value===a.matched.length-1&&R(a.params,s.value.params)));return{route:s,href:n((()=>s.value.href)),isActive:l,isExactActive:i,navigate:function(n={}){return function(e){if(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)return;if(e.defaultPrevented)return;if(void 0!==e.button&&0!==e.button)return;if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}e.preventDefault&&e.preventDefault();return!0}(n)?r[t(e.replace)?"replace":"push"](t(e.to)).catch(v):Promise.resolve()}}}const Te=i({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"}},useLink:Fe,setup(e,{slots:t}){const a=r(Fe(e)),{options:s}=o(Ae),c=n((()=>({[Ve(e.activeClass,s.linkActiveClass,"router-link-active")]:a.isActive,[Ve(e.exactActiveClass,s.linkExactActiveClass,"router-link-exact-active")]:a.isExactActive})));return()=>{const n=t.default&&t.default(a);return e.custom?n:u("a",{"aria-current":a.isExactActive?e.ariaCurrentValue:null,href:a.href,onClick:a.navigate,class:c.value},n)}}});function We(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const Ve=(e,t,n)=>null!=e?e:null!=t?t:n;function ze(e,t){if(!e)return null;const n=e(t);return 1===n.length?n[0]:n}const Ke=i({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(e,{attrs:r,slots:a}){const s=o(Me),c=n((()=>e.route||s.value)),l=o(qe,0),i=n((()=>{let e=t(l);const{matched:n}=c.value;let r;for(;(r=n[e])&&!r.components;)e++;return e})),d=n((()=>c.value.matched[i.value]));f(qe,n((()=>i.value+1))),f(je,d),f(Me,c);const g=p();return h((()=>[g.value,d.value,e.name]),(([e,t,n],[r,o,a])=>{t&&(t.instances[n]=e,o&&o!==t&&e&&e===r&&(t.leaveGuards.size||(t.leaveGuards=o.leaveGuards),t.updateGuards.size||(t.updateGuards=o.updateGuards))),!e||!t||o&&O(t,o)&&r||(t.enterCallbacks[n]||[]).forEach((t=>t(e)))}),{flush:"post"}),()=>{const t=c.value,n=d.value,o=n&&n.components[e.name],s=e.name;if(!o)return ze(a.default,{Component:o,route:t});const l=n.props[e.name],i=l?!0===l?t.params:"function"==typeof l?l(t):l:null,f=u(o,m({},i,r,{onVnodeUnmounted:e=>{e.component.isUnmounted&&(n.instances[s]=null)},ref:g}));return ze(a.default,{Component:f,route:t})||f}}});function He(o){const s=re(o.routes,o),c=o.parseQuery||Ce,l=o.stringifyQuery||$e,i=o.history,u=Ge(),f=Ge(),p=Ge(),h=e(W);let b=W;d&&o.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const E=g.bind(null,(e=>""+e)),k=g.bind(null,Pe),P=g.bind(null,xe);function C(e,t){if(t=m({},t||h.value),"string"==typeof e){const n=w(c,e,t.path),r=s.resolve({path:n.path},t),o=i.createHref(n.fullPath);return m(n,r,{params:P(r.params),hash:xe(n.hash),redirectedFrom:void 0,href:o})}let n;if("path"in e)n=m({},e,{path:w(c,e.path,t.path).path});else{const r=m({},e.params);for(const e in r)null==r[e]&&delete r[e];n=m({},e,{params:k(e.params)}),t.params=k(t.params)}const r=s.resolve(n,t),o=e.hash||"";r.params=E(P(r.params));const a=function(e,t){const n=t.query?e(t.query):"";return t.path+(n&&"?")+n+(t.hash||"")}(l,m({},e,{hash:(u=o,Re(u).replace(be,"{").replace(Ee,"}").replace(ve,"^")),path:r.path}));var u;const f=i.createHref(a);return m({fullPath:a,hash:o,query:l===$e?Se(e.query):e.query||{}},r,{redirectedFrom:void 0,href:f})}function $(e){return"string"==typeof e?w(c,e,h.value.path):m({},e)}function S(e,t){if(b!==e)return H(8,{from:t,to:e})}function j(e){return A(e)}function q(e){const t=e.matched[e.matched.length-1];if(t&&t.redirect){const{redirect:n}=t;let r="function"==typeof n?n(e):n;return"string"==typeof r&&(r=r.includes("?")||r.includes("#")?r=$(r):{path:r},r.params={}),m({query:e.query,hash:e.hash,params:"path"in r?{}:e.params},r)}}function A(e,t){const n=b=C(e),r=h.value,o=e.state,a=e.force,s=!0===e.replace,c=q(n);if(c)return A(m($(c),{state:o,force:a,replace:s}),t||n);const i=n;let u;return i.redirectedFrom=t,!a&&function(e,t,n){const r=t.matched.length-1,o=n.matched.length-1;return r>-1&&r===o&&O(t.matched[r],n.matched[o])&&R(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}(l,r,n)&&(u=H(16,{to:i,from:r}),Z(r,r,!0,!1)),(u?Promise.resolve(u):I(i,r)).catch((e=>N(e)?N(e,2)?e:Y(e):X(e,i,r))).then((e=>{if(e){if(N(e,2))return A(m($(e.to),{state:o,force:a,replace:s}),t||i)}else e=U(i,r,!0,s,o);return D(i,r,e),e}))}function _(e,t){const n=S(e,t);return n?Promise.reject(n):Promise.resolve()}function I(e,t){let n;const[r,o,a]=function(e,t){const n=[],r=[],o=[],a=Math.max(t.matched.length,e.matched.length);for(let s=0;s<a;s++){const a=t.matched[s];a&&(e.matched.find((e=>O(e,a)))?r.push(a):n.push(a));const c=e.matched[s];c&&(t.matched.find((e=>O(e,c)))||o.push(c))}return[n,r,o]}(e,t);n=Ue(r.reverse(),"beforeRouteLeave",e,t);for(const c of r)c.leaveGuards.forEach((r=>{n.push(De(r,e,t))}));const s=_.bind(null,e,t);return n.push(s),Ne(n).then((()=>{n=[];for(const r of u.list())n.push(De(r,e,t));return n.push(s),Ne(n)})).then((()=>{n=Ue(o,"beforeRouteUpdate",e,t);for(const r of o)r.updateGuards.forEach((r=>{n.push(De(r,e,t))}));return n.push(s),Ne(n)})).then((()=>{n=[];for(const r of e.matched)if(r.beforeEnter&&!t.matched.includes(r))if(y(r.beforeEnter))for(const o of r.beforeEnter)n.push(De(o,e,t));else n.push(De(r.beforeEnter,e,t));return n.push(s),Ne(n)})).then((()=>(e.matched.forEach((e=>e.enterCallbacks={})),n=Ue(a,"beforeRouteEnter",e,t),n.push(s),Ne(n)))).then((()=>{n=[];for(const r of f.list())n.push(De(r,e,t));return n.push(s),Ne(n)})).catch((e=>N(e,8)?e:Promise.reject(e)))}function D(e,t,n){for(const r of p.list())r(e,t,n)}function U(e,t,n,r,o){const a=S(e,t);if(a)return a;const s=t===W,c=d?history.state:{};n&&(r||s?i.replace(e.fullPath,m({scroll:s&&c&&c.scroll},o)):i.push(e.fullPath,o)),h.value=e,Z(e,t,n,s),Y()}let F;function V(){F||(F=i.listen(((e,t,n)=>{if(!ne.listening)return;const r=C(e),o=q(r);if(o)return void A(m(o,{replace:!0}),r).catch(v);b=r;const a=h.value;var s,c;d&&(s=G(a.fullPath,n.delta),c=L(),B.set(s,c)),I(r,a).catch((e=>N(e,12)?e:N(e,2)?(A(e.to,r).then((e=>{N(e,20)&&!n.delta&&n.type===x.pop&&i.go(-1,!1)})).catch(v),Promise.reject()):(n.delta&&i.go(-n.delta,!1),X(e,r,a)))).then((e=>{(e=e||U(r,a,!1))&&(n.delta?i.go(-n.delta,!1):n.type===x.pop&&N(e,20)&&i.go(-1,!1)),D(r,a,e)})).catch(v)})))}let z,K=Ge(),Q=Ge();function X(e,t,n){Y(e);const r=Q.list();return r.length?r.forEach((r=>r(e,t,n))):console.error(e),Promise.reject(e)}function Y(e){return z||(z=!e,V(),K.list().forEach((([t,n])=>e?n(e):t())),K.reset()),e}function Z(e,t,n,r){const{scrollBehavior:s}=o;if(!d||!s)return Promise.resolve();const c=!n&&function(e){const t=B.get(e);return B.delete(e),t}(G(e.fullPath,0))||(r||!n)&&history.state&&history.state.scroll||null;return a().then((()=>s(e,t,c))).then((e=>e&&M(e))).catch((n=>X(n,e,t)))}const J=e=>i.go(e);let ee;const te=new Set,ne={currentRoute:h,listening:!0,addRoute:function(e,t){let n,r;return T(e)?(n=s.getRecordMatcher(e),r=t):r=e,s.addRoute(r,n)},removeRoute:function(e){const t=s.getRecordMatcher(e);t&&s.removeRoute(t)},hasRoute:function(e){return!!s.getRecordMatcher(e)},getRoutes:function(){return s.getRoutes().map((e=>e.record))},resolve:C,options:o,push:j,replace:function(e){return j(m($(e),{replace:!0}))},go:J,back:()=>J(-1),forward:()=>J(1),beforeEach:u.add,beforeResolve:f.add,afterEach:p.add,onError:Q.add,isReady:function(){return z&&h.value!==W?Promise.resolve():new Promise(((e,t)=>{K.add([e,t])}))},install(e){e.component("RouterLink",Te),e.component("RouterView",Ke),e.config.globalProperties.$router=this,Object.defineProperty(e.config.globalProperties,"$route",{enumerable:!0,get:()=>t(h)}),d&&!ee&&h.value===W&&(ee=!0,j(i.location).catch((e=>{})));const o={};for(const t in W)o[t]=n((()=>h.value[t]));e.provide(Ae,this),e.provide(Le,r(o)),e.provide(Me,h);const a=e.unmount;te.add(e),e.unmount=function(){te.delete(e),te.size<1&&(b=W,F&&F(),F=null,h.value=W,ee=!1,z=!1),a()}}};return ne}function Ne(e){return e.reduce(((e,t)=>e.then((()=>t()))),Promise.resolve())}function Qe(){return o(Ae)}function Xe(){return o(Le)}export{_e as a,Qe as b,He as c,F as d,Ie as o,Xe as u};
