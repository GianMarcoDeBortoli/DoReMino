import * as timer from './modules/timer';
import {playNoteOnTile} from './modules/sound';
import {draw_table} from './modules/table';

//------------------------------------------------------- MODEL -----------------------------------------------------------
const modelLength = 10
var grades = []
let tiles = document.querySelectorAll(".tile");
var setPieces = [] // elenco dei tiles con associati i due gradi e l'angolazione
let pieceNum = -1; // I need this to remove the dropped tile from setPieces array
const colors = ["darkSlateBlue","darkGoldenRod", "darkRed", "paleVioletRed", "darkGreen","darkBlue","lawnGreen", "darkSlateGray", "darkOrange", "turquoise", "yellow", "red", "slateBlue", "goldenRod", "fireBrick", "lightPink", "forestGreen", "blue"]
// each color is associated to a note
let colorsAvailable= []
// for all grades values, I put into colorsAvailable in this game session, only a subgroup of the ones available,
// by selecting the colors in colors corresponding to the number present in grades
let lowerGrades = 5; //? nome
const barContainer = document.getElementById("bar");
var result = [] // array with the sequence created: everytime I add a piece to the board, the tile grade is added to result

// a new element hidden in the form to pass the result as a URL parameter
var hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "result");
document.getElementById("fPlayGame").appendChild(hiddenField);

//boxes
const boxesPerRow = 9;
const dim1 = 60;
const dim2 = 120;
const spaceBetweenBoxes = 5;

//table
const rows = 3;
const rowHeight = dim2 + 10; //10 is padding
const tableWidth = boxesPerRow*dim2 + (boxesPerRow-1)*spaceBetweenBoxes + 20; //40 is padding
const tableHeight = rows * rowHeight;

let table = document.getElementById("table");


// function to get parameters from URL
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

let params = parseGetVars();
console.log(params);
let mode = params[0];
console.log(mode);
let difficulty = params[1];
console.log(difficulty);


// Filling grades according to the mode received by the select input in the form by the user
switch(mode){
  case "Ionian":
    grades = [-5,-3,-1,0,2,4,5,7,9,11,12]
    break;
  case "Dorian":
    grades = [-5,-3,-2,0,2,3,5,7,9,10,12]
    break;
  case "Phrygian":
    grades = [-4,-2,-0,1,3,5,7,8,10,12]
    break;
  case "Lydian":
    grades = [-5,-3,-1,0,2,4,6,7,9,11,12]
  case "Myxolydian":
    grades = [-5,-3,-2,0,2,4,5,7,9,10,12]
  case "Aeolian":
    grades = [-5,-4,-2,0,2,3,5,7,8,10,12]
  case "Locrian":
    grades = [-4,-2,0,1,3,5,6,8,10,12]
}

//---------------------------------------------- END of MODEL --------------------------------------------------------------

//----------------------------------------------- VIEW --------------------------------------------------------------

// Creates a tile of the specified color
function createTile(color1,color2,i) {
  let tile = document.createElement("div");
  tile.classList.add("tile_v");
  tile.id = i;   // L'id serve al drag
  tile.setAttribute("draggable", true)
  tile.addEventListener("dragstart",  function() {pieceNum = drag(event)})

  // I create two subclasses with the lower and upper part that are of two different colors
  const tileUpper = document.createElement("div");
  tileUpper.classList.add("tileUpper");
  tileUpper.style.backgroundColor = color1;
  tileUpper.addEventListener("click", playNoteOnTile);
  const tileLower = document.createElement("div");
  tileLower.classList.add("tileLower");
  tileLower.style.backgroundColor = color2;
  tileLower.addEventListener("click", playNoteOnTile);

  tile.appendChild(tileUpper);
  tile.appendChild(tileLower);

  tile.addEventListener("dblclick", rotate); // non so se questo sia giusto che sia nella view ?

  return tile

}

function createSet() {
  for(let i = 0; i < grades.length; i++){
    colorsAvailable[i] = colors[grades[i]+lowerGrades]; // for example lowerGrades=5 (as in our case) in grades, becomes 0 in colors,
    // because I want to use the position to access colors: colors[0] corresponds always to grade -5
  }

  for (let i = 0; i < modelLength; i++) { // For each element of the model, so of the bar
    const number1 = Math.floor(Math.random() * colorsAvailable.length)
    const number2 = Math.floor(Math.random() * colorsAvailable.length)
    //Math.floor() restituisce un numero intero arrotondato per difetto
    const tile = createTile(colorsAvailable[number1],colorsAvailable[number2],i) // Create actual tile of that two colors chosen in a randomic way
    barContainer.appendChild(tile) // Add it to the bar div
    let piece = {
      // all'inizio i pezzi sono sempre in verticale e assegno grade1 di default al pezzo in alto e grade2 al pezzo in basso
      tile: tile,
      grade1: number1-lowerGrades,
      grade2: number2-lowerGrades,
      angle: 0,
    }

    setPieces.push(piece)
  }
}


// RENDER
function firstPainfulRender() {
  createSet();
  draw_table(table, tableWidth, tableHeight, rows, rowHeight, boxesPerRow, dim1, dim2); // take a look at table.js
}
//document.write(result)

//----------------------------------------------- END of VIEW --------------------------------------------------------------


//----------------------------------------------- CONTROLLER --------------------------------------------------------------
firstPainfulRender()

//funzione che calcola il nuovo angolo da dare al piece ruotato
function iterate_angle(n) {
  n += 90;
  n = n % 360;
  return n;
}

// rotates the tile by 90° each time
function rotate(ev){
  let i =  Array.from(ev.currentTarget.parentNode.children).indexOf(ev.currentTarget)
  // at the beginning I have [grade1, grade2]
  if (setPieces[i].angle == 0) {
    ev.currentTarget.classList.remove("tile_v");
    ev.currentTarget.classList.add("tile_h");
    ev.currentTarget.style.flexFlow = "row-reverse wrap";
    // I want to swap grade1 and grade2 to have [grade2, grade1]
    let tempGrade = setPieces[i].grade1;
    setPieces[i].grade1 = setPieces[i].grade2;
    setPieces[i].grade2 = tempGrade;
  }
  if (setPieces[i].angle == 90) {
    ev.currentTarget.classList.remove("tile_h");
    ev.currentTarget.classList.add("tile_v");
    ev.currentTarget.style.flexFlow = "column-reverse wrap";
    // I still have [grade2, grade1]
  }
  if (setPieces[i].angle == 180) {
    ev.currentTarget.classList.remove("tile_v");
    ev.currentTarget.classList.add("tile_h");
    ev.currentTarget.style.flexFlow = "row wrap";
    // I want to swap to [grade1, grade2]
    let tempGrade = setPieces[i].grade1;
    setPieces[i].grade1 = setPieces[i].grade2;
    setPieces[i].grade2 = tempGrade;
  }
  if (setPieces[i].angle == 270) {
    ev.currentTarget.classList.remove("tile_h");
    ev.currentTarget.classList.add("tile_v");
    ev.currentTarget.style.flexFlow = "column wrap";
    // I end up with [grade1, grade2]
  }
  setPieces[i].angle = iterate_angle(setPieces[i].angle);
  console.log(setPieces[i]);
}


function change_set() {
  for (let i = 0; i < setPieces.length; i++) { // For each element of the model, so of the bar
     barContainer.removeChild(setPieces[i].tile)
  }
  // svuotare setPieces
  setPieces = []
  createSet()
}

changeSet.onclick = change_set

// ------------------------------------------------- DRAG and DROP --------------------------------
// Creo l'array "boxes" che contenga i contenitori box creati creati in html a cui dare le funzionalità di drop
let rowCollection = document.getElementById("table").children;
let boxes = [];
for (let i = 0; i < rows; i++) {
    let rowChild = rowCollection[i].children;
    for (let j = 0; j < boxesPerRow; j++) {
        boxes.push(rowChild[j]);
    }
}

// Funzioni ausiliarie che permettono la cancellazione dell'eventiListener quando serve.


// PreventDefault() impedisce che all'evento a cui è legato sia associata un'azione di default del browser.
// Per esempio se in mozilla, per default, l'evento dragover aziona il drop siamo fregati.
function prevent_drop(ev) {
  ev.preventDefault();
}

// Dato l'evento drag su un elemento ne raccoglie i dati avendo come argomento l'ID dell'elemento stesso.
// Inoltre, draggando una tessera, raccoglie l'indice della stessa passando per il parent "bar"
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  let i =  Array.from(ev.currentTarget.parentNode.children).indexOf(ev.currentTarget)
  return i;
}

// Assegna solamente al primo elemento senza figli dell'array dato gli eventListeners necessari a permettere il drop
// al suo interno e toglie l'attributo draggable all'ultima tessera inserita.
function drop_box(array) {
  let i = 0;
  while(array[i]) {
    if (array[i-1]) {
      array[i-1].children[0].setAttribute("draggable", false);
    }
    if (array[i].children.length == 0) {
      array[i].addEventListener("drop", drop);
      array[i].addEventListener("dragover", prevent_drop);
      break;
    }
    i++;
  }
}
drop_box(boxes);

// Dato l'evento drop, trasferisce i dati dell'elemento in drag all'elemento container in cui si vuole droppare tramite l'id.
// La splice su setPieces serve a rimuovere dall'array la tessera appena droppata per far sì che la funzione rotate
// continui a funzionare tramite l'indice pieceNum preso dall'elemento "bar" tramite il drag
function drop(ev) {
  if (ev.target.children.length === 0) {
    //controllo che la casella e la tessera siano entrambe orizzontali
    if (ev.target.style.width == dim2+"px" && (setPieces[pieceNum].angle == 90 || setPieces[pieceNum].angle == 270)) {
      if((Math.floor((ev.target.id)/boxesPerRow))%2==0 && result.length != 0 && result[result.length-1]!=setPieces[pieceNum].grade1){
        cartoonFeedback("color_match");
      }else if((Math.floor((ev.target.id)/boxesPerRow))%2!=0 && result.length != 0 && result[result.length-1]!=setPieces[pieceNum].grade2){
        cartoonFeedback("color_match");
      }else{
      ev.target.textContent= "";
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      ev.target.appendChild(document.getElementById(data));
      // prima di toglierlo da setPieces metto i grades del pezzo in questa funzione che crea result
      addToSequence(setPieces[pieceNum].grade1, setPieces[pieceNum].grade2,ev.target.id);
      setPieces.splice(pieceNum, 1);
      ev.target.firstElementChild.removeEventListener("dblclick", rotate);
      ev.target.removeEventListener("drop", drop);
      ev.target.removeEventListener("dragover", prevent_drop);
      drop_box(boxes);
      }
    }
    //controllo che la casella e la tessera siano entrambe verticali
    else if (ev.target.style.width == dim1+"px" && (setPieces[pieceNum].angle == 0 || setPieces[pieceNum].angle == 180)) {
      if(result[result.length-1]!=setPieces[pieceNum].grade1){
        cartoonFeedback("color_match");
      }else{
        ev.target.textContent ="";
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        // prima di toglierlo da setPieces metto i grades del pezzo in questa funzione che crea result
        addToSequence(setPieces[pieceNum].grade1, setPieces[pieceNum].grade2,1);
        // passo 2 come id perchè i pezzi verticali si comportano sempre come se fossero in una riga pari
        setPieces.splice(pieceNum, 1);
        ev.target.firstElementChild.removeEventListener("dblclick", rotate);
        ev.target.removeEventListener("drop", drop);
        ev.target.removeEventListener("dragover", prevent_drop);
        drop_box(boxes);
      }
    }else{
      cartoonFeedback("wrong_rotation");
    }
  }
}

// this function adds the tile
function addToSequence(grade1,grade2,id){
  if(id==0){
    result.push(grade1,grade2);
  }else if(Math.floor((id)/boxesPerRow)%2==0){
    //result.push(grade1,grade2);
    result.push(grade2);
  }else{
    //result.push(grade2,grade1);
    result.push(grade1);
  }

  hiddenField.setAttribute("value", result.join('_'));
  // in questo momento in result ci sono i "doppioni"
}

// questa funzione in base al parametro, che dipende dal tipo di feedback che devo dare,
// fa comparire il fumetto con il commento
function cartoonFeedback(feedback){
  let cartoon = document.getElementById("cartoon");
  cartoon.style.visibility = "visible";
  if(feedback=="color_match"){
    cartoon.textContent = "Remember to match the color!";

  }
  if(feedback=="wrong_rotation"){
    cartoon.textContent = "Remember you can rotate the tile!";
  }
  setTimeout(function(){cartoon.style.visibility="hidden"}, 2000);
}
//------------------------------------------- END of DRAG and DROP ---------------------------

// ------------ TIMER controller ------------------
timer.startTimer();

//-----------------------------------------------END of CONTROLLER--------------------------------------------------------------
