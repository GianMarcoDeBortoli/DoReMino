parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"QI2D":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.playChordsOnHeader=s,exports.playNoteOnHeader=l,exports.playPluck=i,exports.playMembrane=c,exports.errorSound=g,exports.changeSetSound=u,exports.play_melody=p,exports.searchForNote=exports.synth=void 0;const e=(new Tone.Synth).toDestination();exports.synth=e;const t=(new Tone.PolySynth).toDestination(),n=(new Tone.PluckSynth).toDestination(),o=(new Tone.MembraneSynth).toDestination(),r=(new Tone.MetalSynth).toDestination();n.volume.value=-12,o.volume.value=-12,r.volume.value=-12;const a=[[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12],["F#3","G3","G#3","A3","A#3","B3","C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5"]];function s(n){0==n?t.triggerAttackRelease(["C4","G4"],"8n"):1==n?t.triggerAttackRelease(["D4","F4"],"8n"):2==n?t.triggerAttackRelease(["B3","E4","G4"],"8n"):3==n&&e.triggerAttackRelease("C4","4n")}function l(t){0==t?e.triggerAttackRelease("C4","8n"):1==t?e.triggerAttackRelease("D4","8n"):2==t&&e.triggerAttackRelease("E4","8n")}function i(){n.triggerAttackRelease("C5","16n")}function c(){o.triggerAttackRelease("C4","16n")}function g(){r.triggerAttackRelease("C5","32n")}function u(){let e=setInterval(function(){n.triggerAttackRelease("C6","32n")},40);setTimeout(function(){clearInterval(e)},300)}function p(t){let n=0;const o=Tone.now();for(let r=0;r<t.length;r++){let s=t[r],l=a[0].indexOf(s),i=a[1][l];e.triggerAttackRelease(i,"8n",o+n),n+=.5}}exports.searchForNote=a;
},{}],"eQIN":[function(require,module,exports) {
"use strict";var e=require("./modules/sound");const t=document.getElementById("backToRules");function n(){(0,e.playMembrane)(),setTimeout(function(){location.replace("rules.html")},700)}t.addEventListener("click",n);
},{"./modules/sound":"QI2D"}]},{},["eQIN"], null)
//# sourceMappingURL=https://github.com/Giemme13/DoReMino.git/videoDemo.fc15274e.js.map