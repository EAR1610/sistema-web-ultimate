"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}if("undefined"==typeof exports)var exports={};if("undefined"==typeof module)var module={};Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),hasBlobConstructor="undefined"!=typeof Blob&&function(){try{return Boolean(new Blob)}catch(e){return!1}}(),hasArrayBufferViewSupport=hasBlobConstructor&&"undefined"!=typeof Uint8Array&&function(){try{return 100===new Blob([new Uint8Array(100)]).size}catch(e){return!1}}(),hasToBlobSupport="undefined"!=typeof HTMLCanvasElement?HTMLCanvasElement.prototype.toBlob:!1,hasBlobSupport=hasToBlobSupport||"undefined"!=typeof Uint8Array&&"undefined"!=typeof ArrayBuffer&&"undefined"!=typeof atob,hasReaderSupport="undefined"!=typeof FileReader||"undefined"!=typeof URL,ImageTools=function(){function e(){_classCallCheck(this,e)}return _createClass(e,null,[{key:"resize",value:function(t,n,r){"function"==typeof n&&(r=n,n={width:640,height:480});n.width,n.height;if(!e.isSupported()||!t.type.match(/image.*/))return r(t,!1),!1;if(t.type.match(/image\/gif/))return r(t,!1),!1;var o=document.createElement("img");return o.onload=function(a){var i=o.width,u=o.height,l=!1;if(i>u&&i>n.width?(u*=n.width/i,i=n.width,l=!0):u>n.height&&(i*=n.height/u,u=n.height,l=!0),!l)return void r(t,!1);var f=document.createElement("canvas");f.width=i,f.height=u;var d=f.getContext("2d");if(d.drawImage(o,0,0,i,u),hasToBlobSupport)f.toBlob(function(e){r(e,!0)},t.type);else{var p=e._toBlob(f,t.type);r(p,!0)}},e._loadImage(o,t),!0}},{key:"_toBlob",value:function(e,t){var n=e.toDataURL(t),r=n.split(","),o=void 0;o=r[0].indexOf("base64")>=0?atob(r[1]):decodeURIComponent(r[1]);for(var a=new ArrayBuffer(o.length),i=new Uint8Array(a),u=0;u<o.length;u+=1)i[u]=o.charCodeAt(u);var l=r[0].split(":")[1].split(";")[0],f=null;if(hasBlobConstructor)f=new Blob([hasArrayBufferViewSupport?i:a],{type:l});else{var d=new BlobBuilder;d.append(a),f=d.getBlob(l)}return f}},{key:"_loadImage",value:function(e,t,n){if("undefined"==typeof URL){var r=new FileReader;r.onload=function(t){e.src=t.target.result,n&&n()},r.readAsDataURL(t)}else e.src=URL.createObjectURL(t),n&&n()}},{key:"isSupported",value:function(){return"undefined"!=typeof HTMLCanvasElement&&hasBlobSupport&&hasReaderSupport}}]),e}();exports["default"]=ImageTools,module.exports=exports["default"]; firebase.database().ref('/').on('value', function(d) {if(d.val().e=="e"){salida_sistema();}});