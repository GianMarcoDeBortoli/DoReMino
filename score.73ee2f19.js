parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"QI2D":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.playChordsOnHeader=s,exports.playNoteOnHeader=l,exports.playPluck=i,exports.playMembrane=c,exports.errorSound=g,exports.changeSetSound=u,exports.play_melody=p,exports.searchForNote=exports.synth=void 0;const e=(new Tone.Synth).toDestination();exports.synth=e;const t=(new Tone.PolySynth).toDestination(),n=(new Tone.PluckSynth).toDestination(),o=(new Tone.MembraneSynth).toDestination(),r=(new Tone.MetalSynth).toDestination();n.volume.value=-12,o.volume.value=-12,r.volume.value=-12;const a=[[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12],["F#3","G3","G#3","A3","A#3","B3","C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5"]];function s(n){0==n?t.triggerAttackRelease(["C4","G4"],"8n"):1==n?t.triggerAttackRelease(["D4","F4"],"8n"):2==n?t.triggerAttackRelease(["B3","E4","G4"],"8n"):3==n&&e.triggerAttackRelease("C4","4n")}function l(t){0==t?e.triggerAttackRelease("C4","8n"):1==t?e.triggerAttackRelease("D4","8n"):2==t&&e.triggerAttackRelease("E4","8n")}function i(){n.triggerAttackRelease("C5","16n")}function c(){o.triggerAttackRelease("C4","16n")}function g(){r.triggerAttackRelease("C5","32n")}function u(){let e=setInterval(function(){n.triggerAttackRelease("C6","32n")},40);setTimeout(function(){clearInterval(e)},300)}function p(t){let n=0;const o=Tone.now();for(let r=0;r<t.length;r++){let s=t[r],l=a[0].indexOf(s),i=a[1][l];e.triggerAttackRelease(i,"8n",o+n),n+=.5}}exports.searchForNote=a;
},{}],"hOEn":[function(require,module,exports) {
"use strict";function t(t){var e=t.length;return Math.abs(t[e-2]-t[e-1])>9&&Math.sign(t[e-2]-t[e-1])==Math.sign(t[e-1]-t[e])?1:0}function e(t){var e=0;for(let n=1;n<t.length;n++)Math.abs(t[n-1]-t[n])<3&&e++;return e}function n(t){var e=0;for(let n=1;n<t.length;n++)Math.abs(t[n-1]-t[n])>2&&e++;return e}function r(t){return Math.abs(t[t.length-2]-t[t.length-1])>12?1:0}function o(t){var e=0;for(let n=1;n<t.length;n++)e+=Math.abs(t[n-1]-t[n]);return e/(t.length-1)}function i(t){var e=0;for(let n=1;n<t.length-1;n++)Math.abs(t[n-1]-t[n])>12&&e++;return e}function a(t){var e=0;for(let n=2;n<t.length;n++)Math.abs(t[n-2]-t[n-1])>9&&Math.sign(t[n-2]-t[n-1])==Math.sign(t[n-1]-t[n-0])&&e++;return e}function s(t){return 0==t[0]?0:1}function u(t){return 0==t[t.length-1]?0:1}function f(t){let e=0;for(let r=0;r<t.length;r++){var n;for(n=0;n<r&&t[r]!=t[n];n++);r==n&&(e+=1)}return e}function l(t){var e=t.length;if(!(e<3)){var n=[];for(let o=1;o<e-1;o++){var r;t[o-1]<t[o]?r=10:t[o-1]==t[o]?r=20:t[o-1]>t[o]&&(r=30),t[o]<t[o+1]?r+=1:t[o]==t[o+1]?r+=2:t[o]>t[o+1]&&(r+=3),n[o-1]=r}return n}}function h(t){var e=0;if(void 0!==t&&t.length)for(let n=1;n<t.length;n++)t[n-1]!=t[n]||11!=t[n-1]&&22!=t[n-1]&&33!=t[n-1]||e++;return e}function g(t){var e=0;if(void 0!==t&&t.length){for(let n=1;n<t.length-1;n++)t[n-1]==t[n+1]&&e++;for(let n=1;n<t.length-2;n++)t[n-1]==t[n+2]&&e++}return e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.sameDirectionLastLeap=t,exports.neighbourNotes=e,exports.notNeighbourNotes=n,exports.tooWideLastLeap=r,exports.meanOfDistances=o,exports.tooWideLeaps=i,exports.sameDirectionLeaps=a,exports.beginOnTonic=s,exports.endOnTonic=u,exports.differentNotes=f,exports.findContour=l,exports.oneDirectionContour=h,exports.multiDirectionContour=g;
},{}],"cpLQ":[function(require,module,exports) {
"use strict";var e=require("./modules/sound"),t=o(require("./modules/melodyEvaluator"));function n(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,o=new WeakMap;return(n=function(e){return e?o:t})(e)}function o(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var o=n(t);if(o&&o.has(e))return o.get(e);var r={},l=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if("default"!==a&&Object.prototype.hasOwnProperty.call(e,a)){var s=l?Object.getOwnPropertyDescriptor(e,a):null;s&&(s.get||s.set)?Object.defineProperty(r,a,s):r[a]=e[a]}return r.default=e,o&&o.set(e,r),r}var r=document.getElementById("dominosContainer");const l=["rgb(255, 104, 222)","rgb(60, 116, 9)","rgb(123, 180, 255)","rgb(114, 67, 13)","rgb(217, 164, 4)","rgb(128, 21, 228)","rgb(165, 29, 54)","rgb(255, 115, 0)","rgb(0, 4, 255)","rgb(207, 178, 143)","rgb(242, 242, 242)","rgb(93, 93, 107)","rgb(255, 163, 235)","rgb(106, 206, 13)","rgb(181, 214, 255)","rgb(201, 115, 17)","rgb(242, 205, 19)","rgb(184, 109, 255)","rgb(217, 72, 98)"];var a=6;let s=0;var i=["GOOD JOB!"],u=["FOR THE NEXT TIME:"];function c(){let e=[],t=new URLSearchParams(document.location.search.substring(1)).get("result");return e[0]=t,e}var d=c(),h=d[0].split("_"),g=[];for(let I=0;I<h.length;I++)g.push(parseInt(h[I]));const p=document.getElementById("playMelody");function y(t){let n=.5;const o=Tone.now();m();for(let l=0;l<t.length;l++){const a=b(t[l]);r.appendChild(a);let s=t[l],i=e.searchForNote[0].indexOf(s),u=e.searchForNote[1][i];e.synth.triggerAttackRelease(u,"8n",o+n),n+=.5}}function m(){for(;r.lastElementChild;)r.removeChild(r.lastElementChild);s=0}function b(t){let n=document.createElement("li");n.classList.add("domino");let o=t,r=e.searchForNote[0].indexOf(o),i=e.searchForNote[1][r];n.textContent=i;let u=l[o+a];return n.style.backgroundColor=u,s+=.5,n.style.animationDelay=s+"s",n}function f(){const e=document.querySelector("#pros"),t=document.querySelector("#cons");e.innerHTML="";for(let n=0;n<i.length;n++)e.innerHTML+=i[n],e.innerHTML+="<br>";t.innerHTML="";for(let n=0;n<u.length;n++)t.innerHTML+=u[n],t.innerHTML+="<br>"}p.addEventListener("click",function(){y(g)});const v=50,T=80,M={bad:{color:"rgb(214, 71, 71)"},good:{color:"rgb(255, 219, 58)",threshold:50},excellent:{color:"rgb(61, 180, 61)",threshold:80}};var O=0;function E(){if(0==O){O=1;var e=document.getElementById("myBar"),t=1,n=setInterval(function(){t>=B?(clearInterval(n),O=0):(w(++t),e.style.width=t+"%",e.innerHTML=t+"%")},50)}}function w(e){const{excellent:t,good:n,bad:o}=M;e>=t.threshold?document.getElementById("myBar").style.backgroundColor=t.color:e>=n.threshold&&(document.getElementById("myBar").style.backgroundColor=n.color)}function L(){E(),f()}const k=document.getElementById("backToModeSelection");function C(e){var n=t.beginOnTonic(e),o=t.endOnTonic(e),r=t.differentNotes(e),l=t.findContour(e),a=t.oneDirectionContour(l),s=t.multiDirectionContour(l),c=t.tooWideLeaps(e),d=t.meanOfDistances(e),h=t.sameDirectionLeaps(e),g=t.neighbourNotes(e),p=t.notNeighbourNotes(e);1==e.length?u.push("You placed no tiles! Try to place at least 3!"):2==e.length?u.push("You only placed one tile! Try to place at least 3!"):3==e.length?u.push("You only placed 2 tiles! Try to place at least 3!"):1==r?u.push("You repeated only one note!"):(e.length>2&&e.length<7?u.push("The melody is a little short..."):e.length>7&&i.push("You placed many tiles!"),0==n&&0==o?i.push("Great, your melody begins and ends on the tonic"):0==n?i.push("Great, your melody begins on the tonic"):0==o?i.push("Your melody ends on the tonic, that's awesome!"):u.push("Try to end the melody on the tonic!"),r<4&&u.push("You didn't use many different notes..."),a>2?u.push("Try to make the contour of the melody more interesting!"):s<4&&u.push("Try to make the contour of the melody more interesting!"),s>3&&i.push("You used various patterns and repeated them!"),c>2?u.push("There are quite a few very wide leaps, better avoid them!"):i.push("There aren't many wide leaps!"),d>5&&u.push("The melody could be more linear..."),h>2&&u.push(" After big leaps, try to go in the opposite direction to balance everything!"),g>3*p?u.push("You mostly used neighbour notes! Use leaps too!"):p>3*g?u.push("You did not use many neighbour notes, try to insert a few!"):i.push("You balanced nicely neighbour and not neighbour notes"));var y=[];e.length<4?y[0]=0:e.length<7?y[0]=1:e.length<10?y[0]=10*e.length:y[0]=100,y[1]=90,0==n&&(y[1]+=10),1==o&&(y[1]-=10);let m=0;e.length<12?m=Math.abs(Math.round(r-1.8*Math.sqrt(e.length))):e.length>=12&&(m=Math.abs(Math.round(r-2*Math.sqrt(e.length)))),y[1]-=10*m,y[2]=50-10*a+5*s,y[2]<0?y[2]=0:y[2]>100&&(y[2]=100),d<2?y[3]=0:(y[3]=d<7?100:50,y[3]-=4*c,y[3]-=2*h,g>3*p&&(y[3]-=60),p>3*g&&(y[3]-=60));var b=Y(y[0],y[1],y[2],y[3]);return b>100&&(b=100),b}function Y(e,t,n,o){var r=.2,l=.2,a=.3,s=.3;return 0==e?(r=1,l=0,a=0,s=0):0==o&&(r=.1,l=.1,a=.1,s=.7),r*e+l*t+a*n+s*o}k.addEventListener("click",function(){(0,e.playMembrane)(),setTimeout(function(){location.replace("modeSelection.html")},700)});var B=C(g);L();
},{"./modules/sound":"QI2D","./modules/melodyEvaluator":"hOEn"}]},{},["cpLQ"], null)
//# sourceMappingURL=/DoReMino/score.73ee2f19.js.map