import * as timer from './modules/timer';
import {play_melody, synth, searchForNote, errorSound, changeSetSound} from './modules/sound';
import {draw_table} from './modules/table';
import { meanOfDistances, sameDirectionLastLeap, neighbourNotes, notNeighbourNotes, tooWideLastLeap,  } from './modules/melodyEvaluator';


//------------------------------------------------------- MODEL -----------------------------------------------------------
const modelLength = 10; // number of tiles in the bar
var grades = []; // grades of the game, they are based on the mode selected by the user
var setPieces = []; // dictionary of the tiles  in the bar with the two grades and the orientation associated
var setBoxes = []; // dictionary of the tiles  in the board with the two grades and the orientation associated
var setCopy = []; // tile contained in copySpace with the two grades and the orientation associated
var pieceNum = -1; // var needed to remove the dropped tile from setPieces array
const colors = ["rgb(255, 104, 222)", "rgb(60, 116, 9)", "rgb(123, 180, 255)", "rgb(114, 67, 13)", "rgb(217, 164, 4)",
                "rgb(128, 21, 228)", "rgb(165, 29, 54)", "rgb(255, 115, 0)", "rgb(0, 4, 255)", "rgb(207, 178, 143)",
                "rgb(242, 242, 242)", "rgb(93, 93, 107)", "rgb(255, 163, 235)", "rgb(106, 206, 13)", "rgb(181, 214, 255)",
                "rgb(201, 115, 17)", "rgb(242, 205, 19)", "rgb(184, 109, 255)", "rgb(217, 72, 98)"];

var lowerGrades = 6; // used to choose the correct index from colors by translating the grades that start from -6
const barContainer = document.getElementById("bar");
var result = [] // array with the sequence created: everytime I add a piece to the board, the tile grade is added to result

// a new element hidden in the form to pass the result as a URL parameter
var hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "result");
document.getElementById("fPlayGame").appendChild(hiddenField);

//boxes
const boxesPerRow = 8;
const dim1 = 60;
const dim2 = 120;
const spaceBetweenBoxes = 5;

//table
const rows = 3;
const rowHeight = dim2 + 10; //10 is padding
const tableWidth = boxesPerRow*dim2 + (boxesPerRow-1)*spaceBetweenBoxes + 20; //40 is padding
const tableHeight = rows * rowHeight;
const table = document.getElementById("table");

//copyspace
const copySpace = document.getElementById("copySpace");


// function to get parameters from URL
// URLSearchParams creates a sort of dictionary from the string given passed by the argument
function parseGetVars() {
  let res = [];
  let params = new URLSearchParams(document.location.search.substring(1));
  let modal = params.get("mode");
  let difficulty = params.get("difficulty");
  res[0] = modal;
  res[1] = difficulty;
  return res;
}

var params = parseGetVars();
var mode = params[0];
var difficulty = params[1];


// Filling grades according to the mode received by the select input in the form by the user
switch(mode){
  case "Ionian":
    grades = [-5,-3,-1,0,2,4,5,7,9,11,12]
    break;
  case "Dorian":
    grades = [-5,-3,-2,0,2,3,5,7,9,10,12]
    break;
  case "Phrygian":
    grades = [-6,-4,-2,-0,1,3,5,7,8,10,12]
    break;
  case "Lydian":
    grades = [-5,-3,-1,0,2,4,6,7,9,11,12]
  case "Myxolydian":
    grades = [-5,-3,-2,0,2,4,5,7,9,10,12]
  case "Aeolian":
    grades = [-5,-4,-2,0,2,3,5,7,8,10,12]
  case "Locrian":
    grades = [-6,-4,-2,0,1,3,5,6,8,10,12]
}

//---------------------------------------------- END of MODEL --------------------------------------------------------------

//----------------------------------------------- VIEW --------------------------------------------------------------

// Creates a tile of the specified color
function createTile(color1,color2,i) {
  let tile = document.createElement("div");
  tile.classList.add("tile_v");
  tile.id = i;   // id needed in the drag function
  tile.setAttribute("draggable", true)
  tile.addEventListener("dragstart",  function() {pieceNum = drag(event)})

  // creating two subclasses with the lower and upper part that are of two different colors
  const tileUpper = document.createElement("div");
  tileUpper.classList.add("tileUpper");
  if (difficulty == "expert") {
    tileUpper.style.backgroundColor = "rgb(159, 93, 44)";
  }
  else if (difficulty == "normal") {
    tileUpper.style.backgroundColor = color1;
  }
  tileUpper.addEventListener("click", playNoteOnUpperTile);
  const tileLower = document.createElement("div");
  tileLower.classList.add("tileLower");
  if (difficulty == "expert") {
    tileLower.style.backgroundColor = "rgb(159, 93, 44)";
  }
  else if (difficulty == "normal") {
    tileLower.style.backgroundColor = color2;
  }

  tileLower.addEventListener("click", playNoteOnLowerTile);


  tile.appendChild(tileUpper);
  tile.appendChild(tileLower);


  tile.addEventListener("dblclick", rotate);

  return tile

}

function createSet() {

  for (let i = 0; i < modelLength; i++) { // for each element of the model, so of the bar
    let index1 = Math.floor(Math.random() * grades.length);
    let grade1 = grades[index1];
    let color1 = colors[grade1+lowerGrades];

    let index2 = Math.floor(Math.random() * grades.length);
    let grade2 = grades[index2];
    let color2 = colors[grade2+lowerGrades];
    const tile = createTile(color1,color2,i) // Create the actual tile of that two colors chosen in a randomic way
    barContainer.appendChild(tile) // Add it to the bar div
    let piece = {
      // at the beginning the tiles are always in vertical position and by default grade1 is assigned to
      // the upper part of the tile, grade2 is assigned to the lower part of the tile
      tile: tile,
      grade1: grade1,
      grade2: grade2,
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
    // swapping grade1 and grade2 to have [grade2, grade1]
    let tempGrade = setPieces[i].grade1;
    setPieces[i].grade1 = setPieces[i].grade2;
    setPieces[i].grade2 = tempGrade;
  }
  if (setPieces[i].angle == 90) {
    ev.currentTarget.classList.remove("tile_h");
    ev.currentTarget.classList.add("tile_v");
    ev.currentTarget.style.flexFlow = "column-reverse wrap";
    // still having [grade2, grade1]
  }
  if (setPieces[i].angle == 180) {
    ev.currentTarget.classList.remove("tile_v");
    ev.currentTarget.classList.add("tile_h");
    ev.currentTarget.style.flexFlow = "row wrap";
    // swapping to [grade1, grade2]
    let tempGrade = setPieces[i].grade1;
    setPieces[i].grade1 = setPieces[i].grade2;
    setPieces[i].grade2 = tempGrade;
  }
  if (setPieces[i].angle == 270) {
    ev.currentTarget.classList.remove("tile_h");
    ev.currentTarget.classList.add("tile_v");
    ev.currentTarget.style.flexFlow = "column wrap";
    // ending up with [grade1, grade2]
  }
  setPieces[i].angle = iterate_angle(setPieces[i].angle);
}


function rotateCopy(ev) {
  if (setCopy[0].angle == 0) {
    ev.currentTarget.classList.remove("tile_v");
    ev.currentTarget.classList.add("tile_h");
    ev.currentTarget.style.flexFlow = "row-reverse wrap";
    // I want to swap grade1 and grade2 to have [grade2, grade1]
    let tempGrade = setCopy[0].grade1;
    setCopy[0].grade1 = setCopy[0].grade2;
    setCopy[0].grade2 = tempGrade;
  }
  if (setCopy[0].angle == 90) {
    ev.currentTarget.classList.remove("tile_h");
    ev.currentTarget.classList.add("tile_v");
    ev.currentTarget.style.flexFlow = "column-reverse wrap";
    // still having [grade2, grade1]
  }
  if (setCopy[0].angle == 180) {
    ev.currentTarget.classList.remove("tile_v");
    ev.currentTarget.classList.add("tile_h");
    ev.currentTarget.style.flexFlow = "row wrap";
    // swapping to [grade1, grade2]
    let tempGrade = setCopy[0].grade1;
    setCopy[0].grade1 = setCopy[0].grade2;
    setCopy[0].grade2 = tempGrade;
  }
  if (setCopy[0].angle == 270) {
    ev.currentTarget.classList.remove("tile_h");
    ev.currentTarget.classList.add("tile_v");
    ev.currentTarget.style.flexFlow = "column wrap";
    // ending up with [grade1, grade2]
  }
  setCopy[0].angle = iterate_angle(setCopy[0].angle);
}


function change_set() {
  changeSetSound();
  for (let i = 0; i < setPieces.length; i++) { // For each element of the model, so of the bar
     barContainer.removeChild(setPieces[i].tile)
  }
  // setPieces must be empty again, because it is the dictionary contaning the tiles in the bar
  setPieces = [];
  createSet();
}

changeSet.onclick = change_set;

document.getElementById("finishGame").onclick = function(){
  window.removeEventListener('beforeunload', askToReload);
}

playMelody.onclick = function() {
  play_melody(result);
}

playTonic.addEventListener("click", function() {
  synth.triggerAttackRelease("C4", "8n");
})


// the function goes into the target of the click event and lookes for the color, finds the index of the color inside the array of colors,
// finds the note correspondent to the index found, triggers the synth with that same note
function playNoteOnUpperTile() {
  if (event.shiftKey) {
    let grade;

    if (event.currentTarget.parentNode.parentNode.id === "bar") {
      let angle = setPieces[Array.from(event.currentTarget.parentNode.parentNode.children).indexOf(event.currentTarget.parentNode)].angle;
      if (angle == 0 || angle == 270)
        grade = setPieces[Array.from(event.currentTarget.parentNode.parentNode.children).indexOf(event.currentTarget.parentNode)].grade1;
      else if (angle == 90 || angle == 180)
        grade = setPieces[Array.from(event.currentTarget.parentNode.parentNode.children).indexOf(event.currentTarget.parentNode)].grade2;
    }
    else if (event.currentTarget.parentNode.parentNode.parentNode.parentNode.id === "table") {
      let angle = setBoxes[boxes.indexOf(event.currentTarget.parentNode.parentNode)].angle;
      if (angle == 0 || angle == 270)
        grade = setBoxes[boxes.indexOf(event.currentTarget.parentNode.parentNode)].grade1;
      else if (angle == 90 || angle == 180)
      grade = setBoxes[boxes.indexOf(event.currentTarget.parentNode.parentNode)].grade2;
    }
    else if (event.currentTarget.parentNode.parentNode.id ==="copySpace") {
      let angle = setCopy[0].angle;
      if (angle == 0 || angle == 270)
        grade = setCopy[0].grade1;
      else if (angle == 90 || angle == 180)
        grade = setCopy[0].grade2;
    }

    let index = searchForNote[0].indexOf(grade);
    let note = searchForNote[1][index];

    synth.triggerAttackRelease(note, "8n");
  }
}

function playNoteOnLowerTile() {
  if (event.shiftKey) {
    let grade;

    if (event.currentTarget.parentNode.parentNode.id === "bar") {
      let angle = setPieces[Array.from(event.currentTarget.parentNode.parentNode.children).indexOf(event.currentTarget.parentNode)].angle;
      if (angle == 0 || angle == 270)
        grade = setPieces[Array.from(event.currentTarget.parentNode.parentNode.children).indexOf(event.currentTarget.parentNode)].grade2;
      else if (angle == 90 || angle == 180)
        grade = setPieces[Array.from(event.currentTarget.parentNode.parentNode.children).indexOf(event.currentTarget.parentNode)].grade1;
    }
    else if (event.currentTarget.parentNode.parentNode.parentNode.parentNode.id === "table") {
      let angle = setBoxes[boxes.indexOf(event.currentTarget.parentNode.parentNode)].angle;
      if (angle == 0 || angle == 270)
        grade = setBoxes[boxes.indexOf(event.currentTarget.parentNode.parentNode)].grade2;
      else if (angle == 90 || angle == 180)
        grade = setBoxes[boxes.indexOf(event.currentTarget.parentNode.parentNode)].grade1;
    }
    else if (event.currentTarget.parentNode.parentNode.id === "copySpace") {
      let angle = setCopy[0].angle;
      if (angle == 0 || angle == 270)
        grade = setCopy[0].grade2;
      else if (angle == 90 || angle == 180)
        grade = setCopy[0].grade1;
    }

    let index = searchForNote[0].indexOf(grade);
    let note = searchForNote[1][index];

    synth.triggerAttackRelease(note, "8n");
  }
}

// ------------------------------------------------- DRAG and DROP --------------------------------
// creating the "boxes" array to give to the boxes created in html the drop functionality
let rowCollection = document.getElementById("table").children;
let boxes = [];
for (let i = 0; i < rows; i++) {
    let rowChild = rowCollection[i].children;
    for (let j = 0; j < boxesPerRow; j++) {
        boxes.push(rowChild[j]);
    }
}


// PreventDefault() prevents the default action of the browser of the event to which it is associated
function prevent_drop(ev) {
  ev.preventDefault();
}

// Dato l'evento drag su un elemento ne raccoglie i dati avendo come argomento l'ID dell'elemento stesso.
// Inoltre, draggando una tessera, raccoglie l'indice della stessa passando per il parent "bar"
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  if (ev.target.id == "11")
    return 11;
  if (ev.target.id != "11") {
    let i =  Array.from(ev.currentTarget.parentNode.children).indexOf(ev.currentTarget)
    return i;
  }
}

// assigning the eventListeners needed to allow the drop and removes the draggable attribute from the last tile,
// only to the first element without childs of the array
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

// given the drop event, it transfers the element in drag to the container element selected via id.
// The splice on setPieces is needed to remove the dropped tile from the array to allow the function rotate to
// keep working through the index pieceNum taken from the element "bar"
function drop(ev) {

  if (ev.target.children.length === 0) {
    // checking if the box and the tile are both horizontal
    if (pieceNum == 11) {
      if (ev.target.style.width == dim2+"px" && (setCopy[0].angle == 90 || setCopy[0].angle == 270)) {
        if((Math.floor((ev.target.id)/boxesPerRow))%2==0 && result.length != 0 && result[result.length-1]!=setCopy[0].grade1){
          cartoonFeedback("Remember to match the color!");
        }else if((Math.floor((ev.target.id)/boxesPerRow))%2!=0 && result.length != 0 && result[result.length-1]!=setCopy[0].grade2){
          cartoonFeedback("Remember to match the color!");
        }else{
          ev.target.textContent= "";
          ev.preventDefault();
          var data = ev.dataTransfer.getData("text");
          ev.target.appendChild(setCopy[0].tile);
          // putting the grades of the piece in addToSequence to create result, before removing the tile from setPieces
          addToSequence(setCopy[0].grade1, setCopy[0].grade2,ev.target.id);
          setBoxes.push(setCopy.pop());
          ev.target.firstElementChild.removeEventListener("dblclick", rotateCopy);
          ev.target.removeEventListener("drop", drop);
          ev.target.removeEventListener("dragover", prevent_drop);
          ev.target.firstElementChild.addEventListener("click", copy);
          ev.target.firstElementChild.removeAttribute("id");
          copySpace.removeChild;
          drop_box(boxes);
        }
      }
      // checking if the box and the tile are both vertical
      else if (ev.target.style.width == dim1+"px" && (setCopy[0].angle == 0 || setCopy[0].angle == 180)) {
        if(result[result.length-1]!=setCopy[0].grade1){
          cartoonFeedback("Remember to match the color!");
        }else{
          ev.target.textContent ="";
          ev.preventDefault();
          var data = ev.dataTransfer.getData("text");
          ev.target.appendChild(setCopy[0].tile);
          // putting the grades of the piece in addToSequence to create result, before removing the tile from setPieces
          addToSequence(setCopy[0].grade1, setCopy[0].grade2,1);
          setBoxes.push(setCopy.pop());
          ev.target.firstElementChild.removeEventListener("dblclick", rotateCopy);
          ev.target.removeEventListener("drop", drop);
          ev.target.removeEventListener("dragover", prevent_drop);
          ev.target.firstElementChild.addEventListener("click", copy);
          ev.target.firstElementChild.removeAttribute("id");
          copySpace.removeChild
          drop_box(boxes);
        }
      }else{
        cartoonFeedback("Remember you can rotate the tile!");
      }
    }

    else {
      if (ev.target.style.width == dim2+"px" && (setPieces[pieceNum].angle == 90 || setPieces[pieceNum].angle == 270)) {
        if((Math.floor((ev.target.id)/boxesPerRow))%2==0 && result.length != 0 && result[result.length-1]!=setPieces[pieceNum].grade1){
          cartoonFeedback("Remember to match the color!");
        }else if((Math.floor((ev.target.id)/boxesPerRow))%2!=0 && result.length != 0 && result[result.length-1]!=setPieces[pieceNum].grade2){
          cartoonFeedback("Remember to match the color!");
        }else{
        ev.target.textContent= "";
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        // putting the grades of the piece in addToSequence to create result, before removing the tile from setPieces
        addToSequence(setPieces[pieceNum].grade1, setPieces[pieceNum].grade2,ev.target.id);
        setBoxes.push(setPieces.splice(pieceNum, 1)[0]);
        ev.target.firstElementChild.removeEventListener("dblclick", rotate);
        ev.target.removeEventListener("drop", drop);
        ev.target.removeEventListener("dragover", prevent_drop);
        ev.target.firstElementChild.addEventListener("click", copy);
        ev.target.firstElementChild.removeAttribute("id");
        drop_box(boxes);
        }
      }
      // checking if the box and the tile are both vertical
      else if (ev.target.style.width == dim1+"px" && (setPieces[pieceNum].angle == 0 || setPieces[pieceNum].angle == 180)) {
        if(result[result.length-1]!=setPieces[pieceNum].grade1){
          cartoonFeedback("Remember to match the color!");
        }else{
          ev.target.textContent ="";
          ev.preventDefault();
          var data = ev.dataTransfer.getData("text");
          ev.target.appendChild(document.getElementById(data));
          // putting the grades of the piece in addToSequence to create result, before removing the tile from setPieces
          addToSequence(setPieces[pieceNum].grade1, setPieces[pieceNum].grade2,1);
          setBoxes.push(setPieces.splice(pieceNum, 1)[0]);
          ev.target.firstElementChild.removeEventListener("dblclick", rotate);
          ev.target.removeEventListener("drop", drop);
          ev.target.removeEventListener("dragover", prevent_drop);
          ev.target.firstElementChild.addEventListener("click", copy);
          ev.target.firstElementChild.removeAttribute("id");
          drop_box(boxes);
        }
      }else{
        cartoonFeedback("Remember you can rotate the tile!");
      }
    }
  }
}

function copy() {
  if (event.altKey) {
    if (copySpace.children.length == 0) {

      if (setBoxes[event.currentTarget.parentNode.id].angle == 90 || setBoxes[event.currentTarget.parentNode.id].angle == 180) {
        var color1 = setBoxes[event.currentTarget.parentNode.id].tile.lastElementChild.style.backgroundColor;
        var color2 = setBoxes[event.currentTarget.parentNode.id].tile.firstElementChild.style.backgroundColor;
      }
      else if (setBoxes[event.currentTarget.parentNode.id].angle == 0 || setBoxes[event.currentTarget.parentNode.id].angle == 270) {
        var color1 = setBoxes[event.currentTarget.parentNode.id].tile.firstElementChild.style.backgroundColor;
        var color2 = setBoxes[event.currentTarget.parentNode.id].tile.lastElementChild.style.backgroundColor;
      }
      let copyTile = createTile(color1, color2, 11);
      copyTile.removeEventListener("dblclick", rotate);
      copyTile.addEventListener("dblclick", rotateCopy);
      copyTile.addEventListener("dragstart", function() {pieceNum = drag(event)});

      copySpace.appendChild(copyTile);

      let grade1 = setBoxes[event.currentTarget.parentNode.id].grade1;
      let grade2 = setBoxes[event.currentTarget.parentNode.id].grade2;

      let piece = {
        tile: copyTile,
        grade1: grade1,
        grade2: grade2,
        angle: 0,
      }

      setCopy.push(piece);

    }
  }
}

// this function adds the tile to the result array
function addToSequence(grade1,grade2,id){
  if(id==0){
    result.push(grade1,grade2);
  }else if(Math.floor((id)/boxesPerRow)%2==0){
    result.push(grade2);
  }else{
    result.push(grade1);
  }

  hiddenField.setAttribute("value", result.join('_'));
  onGoingEvaluateMelody(result);
}

// this function shows up a cartoon with a feedback, based on the string passed as argument
function cartoonFeedback(feedback){
  errorSound();
  let cartoon = document.getElementById("cartoon");
  cartoon.style.visibility = "visible";
  cartoon.textContent = feedback;

  setTimeout(function(){cartoon.style.visibility="hidden"}, 2000);
}
// evaluating melody when dropping a tile --------------------------------------------------------
function onGoingEvaluateMelody(melody) {
  let l = melody.length;

  // Last leap over 1 octave
  if (tooWideLastLeap(melody) == 1) {
    cartoonFeedback("Try to avoid big jumps!");
  }

  /* // All notes are neighbour notes (no jumps)
  if (l > 4 && notNeighbourNotes(melody) == 0 ) {
    cartoonFeedback("Do not only use neigbour notes!");
  }

  // All notes are far away from each other (no usage of neighbour notes)
  if (l > 3 && neighbourNotes(melody) == 0 ) {
    cartoonFeedback("Use some neighbour notes!");
  }
 */

  // Big jump followed by other big jump
  if (l > 3 && sameDirectionLastLeap(melody) != 0) {
    cartoonFeedback("Try to change direction after a big jump!");
  }

  // Repetition of the same note
  if (l > 3 && meanOfDistances(melody) == 0) {
    cartoonFeedback("Do not only use one note!");
  }
  // Used 3 times more neigbour notes than leaps
  else if (l > 3 && neighbourNotes(melody)>3*notNeighbourNotes(melody)) {
    cartoonFeedback("Do not overuse neigbour notes!");
  }

  // Used 3 times more leaps than neighbour notes
  if (l > 3 && notNeighbourNotes(melody)>3*neighbourNotes(melody)) {
    cartoonFeedback("Use more neighbour notes!");
  }
}

//------------------------------------------- END of DRAG and DROP ---------------------------
// ------------ TIMER controller ---------------------------------------------
timer.startTimer();
//-----------------------------------------------END of CONTROLLER-----------------------------------------------------
