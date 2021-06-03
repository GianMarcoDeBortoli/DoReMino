// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"modules/sound.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playChordsOnHeader = playChordsOnHeader;
exports.playNoteOnHeader = playNoteOnHeader;
exports.playPluck = playPluck;
exports.playMembrane = playMembrane;
exports.errorSound = errorSound;
exports.changeSetSound = changeSetSound;
exports.playNoteOnTile = playNoteOnTile;
// creation of the synth and connection of it to the output speakers
const synth = new Tone.Synth().toDestination();
const poly = new Tone.PolySynth().toDestination();
const pluck = new Tone.PluckSynth().toDestination();
const membrane = new Tone.MembraneSynth().toDestination();
const metal = new Tone.MetalSynth().toDestination();
pluck.volume.value = -12;
membrane.volume.value = -12;
metal.volume.value = -12; //----------------------------------------- SOUND INSIDE openingTitle.html ----------------------------------------

function playChordsOnHeader(index) {
  if (index == 0) poly.triggerAttackRelease(["C4", "G4"], "8n");else if (index == 1) poly.triggerAttackRelease(["D4", "F4"], "8n");else if (index == 2) poly.triggerAttackRelease(["B3", "E4", "G4"], "8n");else if (index == 3) synth.triggerAttackRelease("C4", "4n");
}

function playNoteOnHeader(index) {
  if (index == 0) synth.triggerAttackRelease("C4", "8n");else if (index == 1) synth.triggerAttackRelease("D4", "8n");else if (index == 2) synth.triggerAttackRelease("E4", "8n");
}

function playPluck() {
  pluck.triggerAttackRelease("C5", "16n");
}

function playMembrane() {
  membrane.triggerAttackRelease("C4", "16n");
}

function errorSound() {
  metal.triggerAttackRelease("C5", "32n");
}

function changeSetSound() {
  let interval = setInterval(function () {
    pluck.triggerAttackRelease("C6", "32n");
  }, 40);
  setTimeout(function () {
    clearInterval(interval);
  }, 300);
} //----------------------------------------- SOUND INSIDE game.html ------------------------------------------------
// matrix needed for the selection of the correct note based on the color of the half-tile


const searchForNote = [["rgb(11, 191, 140)", "rgb(165, 29, 54)", "rgb(167, 200, 242)", "rgb(217, 164, 4)", "rgb(135, 28, 235)", "rgb(56, 5, 242)", "rgb(253, 105, 19)", "rgb(12, 242, 27)", "rgb(207, 178, 143)", "rgb(242, 242, 242)", "rgb(93, 93, 107)", "rgb(240, 11, 118)", "rgb(15, 242, 178)", "rgb(217, 72, 98)", "rgb(206, 222, 242)", "rgb(242, 205, 19)", "rgb(181, 128, 230)", "rgb(100, 61, 240)"], ["G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"]]; // the function goes into the target of the click event and lookes for the color, finds the index of the color inside the array of colors,
// finds the note correspondent to the index found, triggers the synth with that same note

function playNoteOnTile() {
  let color = event.currentTarget.style.backgroundColor;
  console.log(color);
  let index = searchForNote[0].indexOf(color);
  let note = searchForNote[1][index];

  if (event.shiftKey) {
    synth.triggerAttackRelease(note, "8n");
  }
}
},{}],"openingTitle.js":[function(require,module,exports) {
"use strict";

var _sound = require("./modules/sound");

function redirectToModeSelection() {
  location.replace("modeSelection.html");
}

const title = document.querySelectorAll(".title");
let indexTitle = 0;

function showTitle() {
  title[indexTitle].style.setProperty("opacity", "1.0");
  (0, _sound.playChordsOnHeader)(indexTitle);
  indexTitle++;
}

const audioButton = document.querySelector('#startAudio');
audioButton === null || audioButton === void 0 ? void 0 : audioButton.addEventListener('click', async () => {
  await Tone.start();
  console.log('audio is ready');
  setTimeout(function () {
    document.getElementById("startAudio").style.setProperty("opacity", "0.0");
    setTimeout(function () {
      document.querySelector("#content").classList.add("backgroundAnimation");
      setTimeout(function () {
        document.querySelector("#theHeader").style.setProperty("width", "60%");
        document.querySelector("#theHeader").style.setProperty("height", "35%");
        document.querySelector("#theHeader").style.setProperty("border", "5px solid rgb(109, 41, 44)");
        setTimeout(function () {
          let showing = setInterval(showTitle, 700);
          setTimeout(function () {
            clearInterval(showing);
          }, 2800);
          setTimeout(redirectToModeSelection, 5000);
        }, 2300);
      }, 800);
    }, 500);
  }, 500);
}, {
  once: true
});
},{"./modules/sound":"modules/sound.js"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49349" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","openingTitle.js"], null)
//# sourceMappingURL=/openingTitle.eebdc959.js.map