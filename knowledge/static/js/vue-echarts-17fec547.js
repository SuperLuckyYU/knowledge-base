import{a as e,r as t}from"./resize-detector-94afada7.js";import{i as n,t as a}from"./echarts-7075129c.js";import{d as r,s as o,m as i,M as u,p as s,l as c,w as l,f as p,e as f,k as v,h as d,n as g,u as h}from"./@vue-b55b200f.js";var O=function(){return O=Object.assign||function(e){for(var t,n=1,a=arguments.length;n<a;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},O.apply(this,arguments)},m=["getWidth","getHeight","getDom","getOption","resize","dispatchAction","convertToPixel","convertFromPixel","containPixel","getDataURL","getConnectedDataURL","appendData","clear","isDisposed","dispose"];var b={autoresize:Boolean},y={loading:Boolean,loadingOptions:Object},j=/^on[^a-z]/,x=function(e){return j.test(e)},_=[],A=[];!function(e,t){if(e&&"undefined"!=typeof document){var n,a=!0===t.prepend?"prepend":"append",r=!0===t.singleTag,o="string"==typeof t.container?document.querySelector(t.container):document.getElementsByTagName("head")[0];if(r){var i=_.indexOf(o);-1===i&&(i=_.push(o)-1,A[i]={}),n=A[i]&&A[i][a]?A[i][a]:A[i][a]=u()}else n=u();65279===e.charCodeAt(0)&&(e=e.substring(1)),n.styleSheet?n.styleSheet.cssText+=e:n.appendChild(document.createTextNode(e))}function u(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),t.attributes)for(var n=Object.keys(t.attributes),r=0;r<n.length;r++)e.setAttribute(n[r],t.attributes[n[r]]);var i="prepend"===a?"afterbegin":"beforeend";return o.insertAdjacentElement(i,e),e}}("x-vue-echarts{display:block;width:100%;height:100%}",{});var E=r({name:"echarts",props:O(O({option:Object,theme:{type:[Object,String]},initOptions:Object,updateOptions:Object,group:String,manualUpdate:Boolean},b),y),inheritAttrs:!1,setup:function(r,d){var b=d.attrs,y=o(),j=o(),_=o(),A=i("ecTheme",null),E=i("ecInitOptions",null),z=i("ecUpdateOptions",null),w=u(r),L=w.autoresize,C=w.manualUpdate,D=w.loading,T=w.loadingOptions,U=s((function(){return _.value||r.option||null})),k=s((function(){return r.theme||h(A)||{}})),S=s((function(){return r.initOptions||h(E)||{}})),B=s((function(){return r.updateOptions||h(z)||{}})),P=s((function(){return function(e){var t={};for(var n in e)x(n)||(t[n]=e[n]);return t}(b)})),M=c().proxy.$listeners;function N(e){if(y.value){var t=j.value=n(y.value,k.value,S.value);r.group&&(t.group=r.group);var a=M;a||(a={},Object.keys(b).filter((function(e){return 0===e.indexOf("on")&&e.length>2})).forEach((function(e){var t=e.charAt(2).toLowerCase()+e.slice(3);"Once"===t.substring(t.length-4)&&(t="~".concat(t.substring(0,t.length-4))),a[t]=b[e]}))),Object.keys(a).forEach((function(e){var n=a[e];if(n){var r=e.toLowerCase();"~"===r.charAt(0)&&(r=r.substring(1),n.__once__=!0);var o=t;if(0===r.indexOf("zr:")&&(o=t.getZr(),r=r.substring(3)),n.__once__){delete n.__once__;var i=n;n=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];i.apply(void 0,e),o.off(r,n)}}o.on(r,n)}})),L.value?g((function(){t&&!t.isDisposed()&&t.resize(),o()})):o()}function o(){var n=e||U.value;n&&t.setOption(n,B.value)}}function R(){j.value&&(j.value.dispose(),j.value=void 0)}var q=null;l(C,(function(e){"function"==typeof q&&(q(),q=null),e||(q=l((function(){return r.option}),(function(e,t){e&&(j.value?j.value.setOption(e,O({notMerge:e.value!==(null==t?void 0:t.value)},B.value)):N())}),{deep:!0}))}),{immediate:!0}),l([k,S],(function(){R(),N()}),{deep:!0}),p((function(){r.group&&j.value&&(j.value.group=r.group)}));var F,H,I=(F=j,H=Object.create(null),m.forEach((function(e){var t;H[e]=(t=e,function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];if(!F.value)throw new Error("ECharts is not initialized yet.");return F.value[t].apply(F.value,e)})})),H);return function(e,t,n){var a=i("ecLoadingOptions",{}),r=s((function(){return O(O({},h(a)),null==n?void 0:n.value)}));p((function(){var n=e.value;n&&(t.value?n.showLoading(r.value):n.hideLoading())}))}(j,D,T),function(n,r,o){var i=null;l([o,n,r],(function(n,r,o){var u=n[0],s=n[1],c=n[2];u&&s&&c&&(i=a((function(){s.resize()}),100),e(u,i)),o((function(){i&&u&&t(u,i)}))}))}(j,L,y),f((function(){N()})),v(R),O({chart:j,root:y,setOption:function(e,t){r.manualUpdate&&(_.value=e),j.value?j.value.setOption(e,t||{}):N(e)},nonEventAttrs:P},I)},render:function(){var e=O({},this.nonEventAttrs);return e.ref="root",e.class=e.class?["echarts"].concat(e.class):"echarts",d("x-vue-echarts",e)}});export{E as C};