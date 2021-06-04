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
})({"modules/timer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startTimer = startTimer;
//------------------------- TIMER MODEL ------------------------------------------------
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};
const TIME_LIMIT = 120;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
document.getElementById("timer").innerHTML = "\n<div class=\"base-timer\">\n  <svg class=\"base-timer__svg\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\">\n    <g class=\"base-timer__circle\">\n      <circle class=\"base-timer__path-elapsed\" cx=\"50\" cy=\"50\" r=\"45\"></circle>\n      <path\n        id=\"base-timer-path-remaining\"\n        stroke-dasharray=\"283\"\n        class=\"base-timer__path-remaining ".concat(remainingPathColor, "\"\n        d=\"\n          M 50, 50\n          m -45, 0\n          a 45,45 0 1,0 90,0\n          a 45,45 0 1,0 -90,0\n        \"\n      ></path>\n    </g>\n  </svg>\n  <span id=\"base-timer-label\" class=\"base-timer__label\">").concat(formatTime(timeLeft), "</span>\n</div>\n"); //------------------------- END TIMER MODEL ------------------------------------------------

function onTimesUp() {
  clearInterval(timerInterval); // qua devo scrivere il codice per fare la stessa cosa che faccio se clicco su Finish Game
  //hiddenField2.setAttribute("type", "submit");
  //hiddenField2.setAttribute("name", "end");
  //document.getElementById("fPlayGame").appendChild(hiddenField2);

  document.fPlayGame.submit();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      /* onTimesUp(); */
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = "0".concat(seconds);
  }

  return "".concat(minutes, ":").concat(seconds);
}

function setRemainingPathColor(timeLeft) {
  const {
    alert,
    warning,
    info
  } = COLOR_CODES;

  if (timeLeft <= alert.threshold) {
    document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
    document.getElementById("base-timer-path-remaining").classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document.getElementById("base-timer-path-remaining").classList.remove(info.color);
    document.getElementById("base-timer-path-remaining").classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - 1 / TIME_LIMIT * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = "".concat((calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0), " 283");
  document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
} // ------------ END of TIMER controller ------------------
},{}],"modules/sound.js":[function(require,module,exports) {
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
  console.log(setPieces[Array.from(event.currentTarget.parentNode.parentNode.children).indexOf(event.currentTarget.parentNode)]);
  let index = searchForNote[0].indexOf(color);
  let note = searchForNote[1][index];

  if (event.shiftKey) {
    synth.triggerAttackRelease(note, "8n");
  }
}
},{}],"modules/table.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draw_table = draw_table;

//---------------------------------------- CREATION of TABLE -----------------------------------------------------------
//prende in argomento la const table, il numero di rows e l'altezza di una row.
//crea le rows, le disegna, aggiunge gli attributi per il flex del contenuto e le appendChilda al table.
function add_rows(table, num, height) {
  for (let i = 0; i < num; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    row.id = "row" + i;
    row.style.height = height + "px";

    if (i % 2 == 0) {
      row.style.flexFlow = "row wrap";
    } else {
      row.style.flexFlow = "row-reverse wrap";
    }

    table.appendChild(row);
  }
} //due funzioni ausiliarie chiamate poi dalla add_boxes che disegnano i singoli box e danno gli attributi per il flex di contenuto


function horiz_box(box, dim1, dim2) {
  box.classList.add("box");
  box.style.width = dim2 + "px";
  box.style.height = dim1 + "px";
}

function vert_box(box, dim1, dim2) {
  box.classList.add("box");
  box.style.width = dim1 + "px";
  box.style.height = dim2 + "px";
} //prende in argomento il numero di rows, il numero di boxes per ogni row e le dimensioni di un box
//prende una row alla volta per id, crea l'elemento box, chiama per i primi numBox-1 la horiz_box e per l'ultimo
//di ogni riga la vert_box per disegnarli. Infine assegna il box alla row.


function add_boxes(numRows, numBoxes, width, height) {
  let cntbox = 0;

  for (let i = 0; i < numRows; i++) {
    let row = document.getElementById("row" + i);

    for (let j = 0; j < numBoxes - 1; j++) {
      let box = document.createElement("div");
      horiz_box(box, width, height);
      box.textContent = cntbox;
      box.id = cntbox;
      cntbox++;
      row.appendChild(box);
    }

    let box = document.createElement("div");
    vert_box(box, width, height);
    box.textContent = cntbox;
    box.id = cntbox;
    cntbox++;
    row.appendChild(box);
  }
}

function draw_table(table, tableWidth, tableHeight, numRows, rowHeight, numBoxes, width, height) {
  table.style.width = tableWidth + "px";
  table.style.height = tableHeight + "px";
  add_rows(table, numRows, rowHeight);
  add_boxes(numRows, numBoxes, width, height);
}
},{}],"game.js":[function(require,module,exports) {
"use strict";

var timer = _interopRequireWildcard(require("./modules/timer"));

var _sound = require("./modules/sound");

var _table = require("./modules/table");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var table = document.getElementById("table");
const synth = new Tone.Synth().toDestination(); // matrix needed for the selection of the correct note based on the color of the half-tile

const searchForNote = [[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], ["G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"]]; // the function goes into the target of the click event and lookes for the color, finds the index of the color inside the array of colors,
// finds the note correspondent to the index found, triggers the synth with that same note

function playNoteOnUpperTile() {
  if (event.shiftKey) {
    let grade;

    if (event.currentTarget.parentNode.parentNode.id === "bar") {
      grade = setPieces[Array.from(event.currentTarget.parentNode.parentNode.children).indexOf(event.currentTarget.parentNode)].grade1;
    } else if (event.currentTarget.parentNode.parentNode.parentNode.parentNode.id === "table") {
      grade = setBoxes[boxes.indexOf(event.currentTarget.parentNode.parentNode)].grade1;
    }

    console.log(grade);
    let index = searchForNote[0].indexOf(grade);
    let note = searchForNote[1][index];
    console.log(note);
    synth.triggerAttackRelease(note, "8n");
  }
}

function playNoteOnLowerTile() {
  if (event.shiftKey) {
    let grade;

    if (event.currentTarget.parentNode.parentNode.id === "bar") {
      grade = setPieces[Array.from(event.currentTarget.parentNode.parentNode.children).indexOf(event.currentTarget.parentNode)].grade2;
    } else if (event.currentTarget.parentNode.parentNode.parentNode.parentNode.id === "table") {
      grade = setBoxes[boxes.indexOf(event.currentTarget.parentNode.parentNode)].grade2;
    }

    console.log(grade);
    let index = searchForNote[0].indexOf(grade);
    let note = searchForNote[1][index];
    console.log(note);
    synth.triggerAttackRelease(note, "8n");
  }
} //------------------------------------------------------- MODEL -----------------------------------------------------------


const modelLength = 10;
var grades = [];
var tiles = document.querySelectorAll(".tile");
var setPieces = []; // elenco dei tiles con associati i due gradi e l'angolazione

var setBoxes = [];
var pieceNum = -1; // I need this to remove the dropped tile from setPieces array

const colors = ["rgb(11, 191, 140)", "rgb(165, 29, 54)", "rgb(167, 200, 242)", "rgb(217, 164, 4)", "rgb(135, 28, 235)", "rgb(56, 5, 242)", "rgb(253, 105, 19)", "rgb(12, 242, 27)", "rgb(207, 178, 143)", "rgb(242, 242, 242)", "rgb(93, 93, 107)", "rgb(240, 11, 118)", "rgb(15, 242, 178)", "rgb(217, 72, 98)", "rgb(206, 222, 242)", "rgb(242, 205, 19)", "rgb(181, 128, 230)", "rgb(100, 61, 240)"]; // each color is associated to a note

var colorsAvailable = []; // for all grades values, I put into colorsAvailable in this game session, only a subgroup of the ones available,
// by selecting the colors in colors corresponding to the number present in grades

var lowerGrades = 5; //? nome

const barContainer = document.getElementById("bar");
var result = []; // array with the sequence created: everytime I add a piece to the board, the tile grade is added to result
// a new element hidden in the form to pass the result as a URL parameter

var hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "result");
document.getElementById("fPlayGame").appendChild(hiddenField); //boxes

const boxesPerRow = 9;
const dim1 = 60;
const dim2 = 120;
const spaceBetweenBoxes = 5; //table

const rows = 3;
const rowHeight = dim2 + 10; //10 is padding

const tableWidth = boxesPerRow * dim2 + (boxesPerRow - 1) * spaceBetweenBoxes + 20; //40 is padding

const tableHeight = rows * rowHeight; // function to get parameters from URL
// URLSearchParams crea una sorta di dizionario dalla stringa data in argomento, la stringa data è la parte dell'URL che sta dopo l'uguale
// per accedere ai valori del dizionario si usa la get(key)

function parseGetVars() {
  let res = [];
  let params = new URLSearchParams(document.location.search.substring(1));
  let modal = params.get("mode");
  let difficulty = params.get("difficulty");
  res[0] = modal;
  res[1] = difficulty;
  console.log(res);
  return res;
}

var params = parseGetVars();
console.log(params);
var mode = params[0];
console.log(mode);
var difficulty = params[1];
console.log(difficulty); // Filling grades according to the mode received by the select input in the form by the user

switch (mode) {
  case "Ionian":
    grades = [-5, -3, -1, 0, 2, 4, 5, 7, 9, 11, 12];
    break;

  case "Dorian":
    grades = [-5, -3, -2, 0, 2, 3, 5, 7, 9, 10, 12];
    break;

  case "Phrygian":
    grades = [-4, -2, -0, 1, 3, 5, 7, 8, 10, 12];
    break;

  case "Lydian":
    grades = [-5, -3, -1, 0, 2, 4, 6, 7, 9, 11, 12];

  case "Myxolydian":
    grades = [-5, -3, -2, 0, 2, 4, 5, 7, 9, 10, 12];

  case "Aeolian":
    grades = [-5, -4, -2, 0, 2, 3, 5, 7, 8, 10, 12];

  case "Locrian":
    grades = [-4, -2, 0, 1, 3, 5, 6, 8, 10, 12];
} //---------------------------------------------- END of MODEL --------------------------------------------------------------
//----------------------------------------------- VIEW --------------------------------------------------------------
// Creates a tile of the specified color


function createTile(color1, color2, i) {
  let tile = document.createElement("div");
  tile.classList.add("tile_v");
  tile.id = i; // L'id serve al drag

  tile.setAttribute("draggable", true);
  tile.addEventListener("dragstart", function () {
    pieceNum = drag(event);
  }); // I create two subclasses with the lower and upper part that are of two different colors

  const tileUpper = document.createElement("div");
  tileUpper.classList.add("tileUpper");

  if (difficulty == "expert") {
    tileUpper.style.backgroundColor = "rgb(159, 93, 44)";
  } else if (difficulty == "amateur") {
    tileUpper.style.backgroundColor = color1;
  }

  tileUpper.addEventListener("click", playNoteOnUpperTile);
  const tileLower = document.createElement("div");
  tileLower.classList.add("tileLower");

  if (difficulty == "expert") {
    tileLower.style.backgroundColor = "rgb(159, 93, 44)";
  } else if (difficulty == "amateur") {
    tileLower.style.backgroundColor = color2;
  }

  tileLower.addEventListener("click", playNoteOnLowerTile);
  tile.appendChild(tileUpper);
  tile.appendChild(tileLower);
  tile.addEventListener("dblclick", rotate); // non so se questo sia giusto che sia nella view ?

  return tile;
}

function createSet() {
  for (let i = 0; i < modelLength; i++) {
    // For each element of the model, so of the bar
    let index1 = Math.floor(Math.random() * grades.length);
    let grade1 = grades[index1];
    let color1 = colors[grade1 + lowerGrades];
    let index2 = Math.floor(Math.random() * grades.length);
    let grade2 = grades[index2];
    let color2 = colors[grade2 + lowerGrades]; //Math.floor() restituisce un numero intero arrotondato per difetto

    const tile = createTile(color1, color2, i); // Create actual tile of that two colors chosen in a randomic way

    barContainer.appendChild(tile); // Add it to the bar div

    let piece = {
      // all'inizio i pezzi sono sempre in verticale e assegno grade1 di default al pezzo in alto e grade2 al pezzo in basso
      tile: tile,
      grade1: grade1,
      grade2: grade2,
      angle: 0
    };
    setPieces.push(piece);
  }
} // RENDER


function firstPainfulRender() {
  createSet();
  (0, _table.draw_table)(table, tableWidth, tableHeight, rows, rowHeight, boxesPerRow, dim1, dim2); // take a look at table.js
} //document.write(result)
//----------------------------------------------- END of VIEW --------------------------------------------------------------
//----------------------------------------------- CONTROLLER --------------------------------------------------------------


firstPainfulRender(); //funzione che calcola il nuovo angolo da dare al piece ruotato

function iterate_angle(n) {
  n += 90;
  n = n % 360;
  return n;
} // rotates the tile by 90° each time


function rotate(ev) {
  let i = Array.from(ev.currentTarget.parentNode.children).indexOf(ev.currentTarget); // at the beginning I have [grade1, grade2]

  if (setPieces[i].angle == 0) {
    ev.currentTarget.classList.remove("tile_v");
    ev.currentTarget.classList.add("tile_h");
    ev.currentTarget.style.flexFlow = "row-reverse wrap"; // I want to swap grade1 and grade2 to have [grade2, grade1]

    let tempGrade = setPieces[i].grade1;
    setPieces[i].grade1 = setPieces[i].grade2;
    setPieces[i].grade2 = tempGrade;
  }

  if (setPieces[i].angle == 90) {
    ev.currentTarget.classList.remove("tile_h");
    ev.currentTarget.classList.add("tile_v");
    ev.currentTarget.style.flexFlow = "column-reverse wrap"; // I still have [grade2, grade1]
  }

  if (setPieces[i].angle == 180) {
    ev.currentTarget.classList.remove("tile_v");
    ev.currentTarget.classList.add("tile_h");
    ev.currentTarget.style.flexFlow = "row wrap"; // I want to swap to [grade1, grade2]

    let tempGrade = setPieces[i].grade1;
    setPieces[i].grade1 = setPieces[i].grade2;
    setPieces[i].grade2 = tempGrade;
  }

  if (setPieces[i].angle == 270) {
    ev.currentTarget.classList.remove("tile_h");
    ev.currentTarget.classList.add("tile_v");
    ev.currentTarget.style.flexFlow = "column wrap"; // I end up with [grade1, grade2]
  }

  setPieces[i].angle = iterate_angle(setPieces[i].angle);
  console.log(setPieces[i]);
}

function change_set() {
  (0, _sound.changeSetSound)();

  for (let i = 0; i < setPieces.length; i++) {
    // For each element of the model, so of the bar
    barContainer.removeChild(setPieces[i].tile);
  } // svuotare setPieces


  setPieces = [];
  createSet();
}

changeSet.onclick = change_set; // ------------------------------------------------- DRAG and DROP --------------------------------
// Creo l'array "boxes" che contenga i contenitori box creati creati in html a cui dare le funzionalità di drop

let rowCollection = document.getElementById("table").children;
let boxes = [];

for (let i = 0; i < rows; i++) {
  let rowChild = rowCollection[i].children;

  for (let j = 0; j < boxesPerRow; j++) {
    boxes.push(rowChild[j]);
  }
} // Funzioni ausiliarie che permettono la cancellazione dell'eventiListener quando serve.
// PreventDefault() impedisce che all'evento a cui è legato sia associata un'azione di default del browser.
// Per esempio se in mozilla, per default, l'evento dragover aziona il drop siamo fregati.


function prevent_drop(ev) {
  ev.preventDefault();
} // Dato l'evento drag su un elemento ne raccoglie i dati avendo come argomento l'ID dell'elemento stesso.
// Inoltre, draggando una tessera, raccoglie l'indice della stessa passando per il parent "bar"


function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  let i = Array.from(ev.currentTarget.parentNode.children).indexOf(ev.currentTarget);
  return i;
} // Assegna solamente al primo elemento senza figli dell'array dato gli eventListeners necessari a permettere il drop
// al suo interno e toglie l'attributo draggable all'ultima tessera inserita.


function drop_box(array) {
  let i = 0;

  while (array[i]) {
    if (array[i - 1]) {
      array[i - 1].children[0].setAttribute("draggable", false);
    }

    if (array[i].children.length == 0) {
      array[i].addEventListener("drop", drop);
      array[i].addEventListener("dragover", prevent_drop);
      break;
    }

    i++;
  }
}

drop_box(boxes); // Dato l'evento drop, trasferisce i dati dell'elemento in drag all'elemento container in cui si vuole droppare tramite l'id.
// La splice su setPieces serve a rimuovere dall'array la tessera appena droppata per far sì che la funzione rotate
// continui a funzionare tramite l'indice pieceNum preso dall'elemento "bar" tramite il drag

function drop(ev) {
  if (ev.target.children.length === 0) {
    //controllo che la casella e la tessera siano entrambe orizzontali
    if (ev.target.style.width == dim2 + "px" && (setPieces[pieceNum].angle == 90 || setPieces[pieceNum].angle == 270)) {
      if (Math.floor(ev.target.id / boxesPerRow) % 2 == 0 && result.length != 0 && result[result.length - 1] != setPieces[pieceNum].grade1) {
        cartoonFeedback("color_match");
      } else if (Math.floor(ev.target.id / boxesPerRow) % 2 != 0 && result.length != 0 && result[result.length - 1] != setPieces[pieceNum].grade2) {
        cartoonFeedback("color_match");
      } else {
        ev.target.textContent = "";
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data)); // prima di toglierlo da setPieces metto i grades del pezzo in questa funzione che crea result

        addToSequence(setPieces[pieceNum].grade1, setPieces[pieceNum].grade2, ev.target.id);
        setBoxes.push(setPieces.splice(pieceNum, 1)[0]);
        ev.target.firstElementChild.removeEventListener("dblclick", rotate);
        ev.target.removeEventListener("drop", drop);
        ev.target.removeEventListener("dragover", prevent_drop);
        drop_box(boxes);
        console.log(setPieces);
        console.log(setBoxes);
      }
    } //controllo che la casella e la tessera siano entrambe verticali
    else if (ev.target.style.width == dim1 + "px" && (setPieces[pieceNum].angle == 0 || setPieces[pieceNum].angle == 180)) {
        if (result[result.length - 1] != setPieces[pieceNum].grade1) {
          cartoonFeedback("color_match");
        } else {
          ev.target.textContent = "";
          ev.preventDefault();
          var data = ev.dataTransfer.getData("text");
          ev.target.appendChild(document.getElementById(data)); // prima di toglierlo da setPieces metto i grades del pezzo in questa funzione che crea result

          addToSequence(setPieces[pieceNum].grade1, setPieces[pieceNum].grade2, 1); // passo 2 come id perchè i pezzi verticali si comportano sempre come se fossero in una riga pari

          setBoxes.push(setPieces.splice(pieceNum, 1)[0]);
          ev.target.firstElementChild.removeEventListener("dblclick", rotate);
          ev.target.removeEventListener("drop", drop);
          ev.target.removeEventListener("dragover", prevent_drop);
          drop_box(boxes);
          console.log(setPieces);
          console.log(setBoxes);
        }
      } else {
        cartoonFeedback("wrong_rotation");
      }
  }
} // this function adds the tile


function addToSequence(grade1, grade2, id) {
  if (id == 0) {
    result.push(grade1, grade2);
  } else if (Math.floor(id / boxesPerRow) % 2 == 0) {
    //result.push(grade1,grade2);
    result.push(grade2);
  } else {
    //result.push(grade2,grade1);
    result.push(grade1);
  }

  hiddenField.setAttribute("value", result.join('_')); // in questo momento in result ci sono i "doppioni"
} // questa funzione in base al parametro, che dipende dal tipo di feedback che devo dare,
// fa comparire il fumetto con il commento


function cartoonFeedback(feedback) {
  (0, _sound.errorSound)();
  let cartoon = document.getElementById("cartoon");
  cartoon.style.visibility = "visible";

  if (feedback == "color_match") {
    cartoon.textContent = "Remember to match the color!";
  }

  if (feedback == "wrong_rotation") {
    cartoon.textContent = "Remember you can rotate the tile!";
  }

  setTimeout(function () {
    cartoon.style.visibility = "hidden";
  }, 2000);
} //------------------------------------------- END of DRAG and DROP ---------------------------
// ------------ TIMER controller ------------------


timer.startTimer(); //-----------------------------------------------END of CONTROLLER--------------------------------------------------------------
},{"./modules/timer":"modules/timer.js","./modules/sound":"modules/sound.js","./modules/table":"modules/table.js"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50880" + '/');

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
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","game.js"], null)
//# sourceMappingURL=/game.7bbe06d5.js.map