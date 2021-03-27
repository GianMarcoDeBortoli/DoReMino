// MODEL
const modelLength = 10
var grades = []
let tiles = document.querySelectorAll(".tile");
var setPieces = [] // elenco dei tiles con associati i due gradi e l'angolazione
let pieceNum = -1; //mi serve per togliere la tessera droppata dall'array setPieces
const colors = ["darkSlateBlue","darkGoldenRod", "darkRed", "paleVioletRed", "darkGreen","darkBlue","lawnGreen", "darkSlateGray", "darkOrange", "turquoise", "yellow", "red", "slateBlue", "goldenRod", "fireBrick", "lightPink", "forestGreen", "blue"]
// nel nome di questi colori si potrebbe anche mettere il nome della nota corrispondente, non serve ma se ci aiuta a livello di codice si può fare
const barContainer = document.getElementById("bar");


// function to get parameters from URL ------------------------------------------------------------------------------
function parseGetVars()
{
  // creo una array
  var args = new Array();
  // individuo la query (cioè tutto quello che sta a destra del ?)
  // per farlo uso il metodo substring della proprietà search
  // dell'oggetto location
  var query = window.location.search.substring(1);
  // se c'è una querystring procedo alla sua analisi
  if (query)
  {
    // divido la querystring in blocchi sulla base del carattere &
    // (il carattere & è usato per concatenare i diversi parametri della URL)
    var strList = query.split('&');
    // faccio un ciclo per leggere i blocchi individuati nella querystring
    for(str in strList)
    {
      // divido ogni blocco mediante il simbolo uguale
      // (uguale è usato per l'assegnazione del valore)
      var parts = strList[str].split('=');
      // inserisco nella array args l'accoppiata nome = valore di ciascun
      // parametro presente nella querystring
      args[unescape(parts[0])] = unescape(parts[1]);
    }
  }
  return args;
}

// Recupero i valori passati con GET
// Per farlo creo una variabile cui assegno come valore
// il risultato della funzione vista in precedenza
var get = parseGetVars();

// estraggo dall'array contenente i valori della querystring
// il valore del parametro "sito"
var mode = get['mode'];

//riempire grades in base al mode ricevuto da select dell'utente
if(mode == "Ionian"){
  grades = [-5,-3,-1,0,2,4,5,7,9,11,12]
}else if(mode == "Dorian"){
  grades = [-5,-3,-2,0,2,3,5,7,9,10,12]
}else if(mode == "Phrygian"){
  grades = [-5,-4,-2,0,1,3,5,7,8,10,12]
}else if(mode == "Lydian"){
  grades = [-5,-3,-1,0,2,4,6,7,9,11,12]
}else if(mode == "Myxolydian"){
  grades = [-5,-3,-2,0,2,4,5,7,9,10,12]
}else if(mode == "Aeolian"){
  grades = [-5,-4,-2,0,2,3,5,7,8,10,12]
}else if(mode == "Locrian"){
  grades = [-4,-2,0,1,3,5,6,8,10,12]
}
// ---------------- END of the portion of code related to create grades ---------------------------------------------

//funzione che crea le caselle all'interno del contenitore #containers e assegna le classi per la distribuzione spaziale
function createTable() {
  let table = document.getElementById("containers");
  for (i = 0; i < 4; i++) {
    let box = document.createElement("div");
    box.id = "dropContainer"+i;
    box.classList.add("box");
    table.appendChild(box);
  }
}

//creo un array che contenga i tre contenitori "drop" creati in html
let containerArray = document.getElementById("containers").children;

// VIEW
// Creates a button of the specified color
function createTile(color1,color2,i) {
  // creo il tassello di domino
  let tile = document.createElement("div");
  tile.classList.add("tile_v");


  // assegnare un id ad ogni tile --------
  tile.id = i;

  tile.setAttribute("draggable", true)
  tile.addEventListener("dragstart",  function() {pieceNum = drag(event)})

  // faccio due sottoclassi con la parte sopra e sotto
  // che sono di due colori diversi
  const tileUpper = document.createElement("div");
  tileUpper.classList.add("tileUpper",color1);
  const tileLower = document.createElement("div");
  tileLower.classList.add("tileLower",color2);

  tile.appendChild(tileUpper);
  tile.appendChild(tileLower);

  tile.addEventListener("dblclick", call_rotate);

  return tile
}

// -------------------- funzioni per DRAG and DROP ------------------------------------------------

//funzione che, dato l'evento drag su un elemento ne raccoglie i dati avendo come argomento l'ID dell'elemento stesso
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  let i =  Array.from(ev.currentTarget.parentNode.children).indexOf(ev.currentTarget)
  return i;
}

//funzione che assegna all'elemento container gli eventhandlers necessari a permettere il drop al suo interno
function dropBox(array) {
  let i = 0;
  while(array[i]) {
    if (array[i].children.length == 0) {
      array[i].addEventListener("drop", function() {drop(event)})
      array[i].addEventListener("dragover", function() {allowDrop(event)})
      break;
    }
    i++;
  }
}
dropBox(containerArray);

//funzione che non ho capito a che serva
function allowDrop(ev) {
  ev.preventDefault();
}

//funzione che, dato l'evento drop, trasferisce i dati dell'elemento in drag all'elemento container in cui si vuole droppare
//la plice su setPieces serve a rimuovere dall'array la tessera appena droppata per far si che la funzione rotate continui a funzionare tramite l'indice preso dall'elemento bar
function drop(ev) {
  if (ev.target.children.length === 0) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    setPieces.splice(pieceNum, 1);
    console.log(setPieces);
    ev.target.firstElementChild.removeEventListener("dblclick", call_rotate);
    ev.target.removeEventListener("drop", function() {drop(event)});
    ev.target.removeEventListener("dragover", function() {allowDrop(event)});
    dropBox(containerArray);
  }
}
// -------------------- END funzioni per DRAG and DROP -------------------------------------------------


//------------ createSet() non so se vada in VIEW ---------------------
function createSet(){
 //const barContainer = document.getElementById("bar") l'ho spostata in model
 let colorsAvailable= []
 // per tutti i valori di grades, inserisco nei colori da utilizzare in questa partita, un sottogruppo di quelli disponibili, selezionando i colori in colors in base al numero presente in grades
 for(let i = 0; i < grades.length; i++){
   colorsAvailable[i] = colors[grades[i]+5]; // for example -5 in grades becomes 0 in colors, because i want to use the position to access colors: colors[0] corresponds always to grade -5
 }

 for (let i = 0; i < modelLength; i++) { // For each element of the model, so of the bar
   const number1 = Math.floor(Math.random() * colorsAvailable.length)
   const number2 = Math.floor(Math.random() * colorsAvailable.length)
   //Math.floor() restituisce un numero intero arrotondato per difetto
   const tile = createTile(colorsAvailable[number1],colorsAvailable[number2],i) // Create actual tile of that two colors chosen in a randomic way
   barContainer.appendChild(tile) // Add it to the bar div
   piece = {
     // all'inizio i pezzi sono sempre in verticale e assegno grade1 di default al pezzo in alto e grade2 al pezzo in basso
     tile: tile,
     grade1: number1-5,
     grade2: number2-5,
     angle: 0,
   }

   setPieces.push(piece)
    }
      render()
}
//------------ FINE createSet() non so se vada in VIEW -----

// --------------------------- rotation ----------------------------------------------------------
//funzione che calcola il nuovo angolo da dare al piece ruotato
function iterate_angle(n) {
  n += 90;
  n = n % 360;
  return n;
}
//in ordine: trova l'indice della tessera all'interno di setPieces passando per la bar;
//la if serve a permettere la la rotazione anche se l'evento avviene su upper o lower;
//controlla l'angolo del piece su cui avviene l'evento per decidere come agire;
//se serve, scambia di posto tileupper e tilelower e i due grade all'interno del piece;
//infine modifica l'angolo del piece
function rotate(event){
  let i =  Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget)
  if (event.target = event.currentTarget) {
    // at the beginning I have [grade1, grade2]
    if (setPieces[i].angle == 0) {
      event.currentTarget.classList.remove("tile_v");
      event.currentTarget.classList.add("tile_h");
      //event.currentTarget.style.flexFlow = "row-reverse wrap"; //questa riga dovrebbe fare la stessa cosa delle seguenti sei
      let tileUpper = event.currentTarget.firstElementChild;
      let tileLower = event.currentTarget.lastElementChild;
      while (event.currentTarget.firstChild) {
        event.currentTarget.removeChild(event.currentTarget.lastChild);
      }
      event.currentTarget.appendChild(tileLower);
      event.currentTarget.appendChild(tileUpper);
      // I also want to swap grade1 and grade2 to have [grade2, grade1]
      let tempGrade = setPieces[i].grade1;
      setPieces[i].grade1 = setPieces[i].grade2;
      setPieces[i].grade2 = tempGrade;
    }
    if (setPieces[i].angle == 90) {
      event.currentTarget.classList.remove("tile_h");
      event.currentTarget.classList.add("tile_v");
      // I still have [grade2, grade1]
    }
    if (setPieces[i].angle == 180) {
      event.currentTarget.classList.remove("tile_v");
      event.currentTarget.classList.add("tile_h");
      let tileUpper = event.currentTarget.firstElementChild;
      let tileLower = event.currentTarget.lastElementChild;
      while (event.currentTarget.firstChild) {
        event.currentTarget.removeChild(event.currentTarget.lastChild);
      }
      event.currentTarget.appendChild(tileLower);
      event.currentTarget.appendChild(tileUpper);
      // I again want to swap grade1 and grade2 to have [grade1, grade2]
      let tempGrade = setPieces[i].grade1;
      setPieces[i].grade1 = setPieces[i].grade2;
      setPieces[i].grade2 = tempGrade;
    }
    if (setPieces[i].angle == 270) {
      event.currentTarget.classList.remove("tile_h");
      event.currentTarget.classList.add("tile_v");
    }
    setPieces[i].angle = iterate_angle(setPieces[i].angle);
    console.log(setPieces[i]);
  }
}

//funzione ausiliaria che chiama la rotate per gestire l'eventListener corrispondente
function call_rotate () {
  rotate(event);
}
// --------------------------- END rotation ----------------------------------------------------------

// Different from the normal render function because it has to create all the tiles

function firstPainfulRender() {
  createSet();
  render();
}

// -------------------------------------- Timer --------------------------------------------------
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

document.getElementById("timer").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

startTimer();

function onTimesUp() {
  clearInterval(timerInterval);
  // qua devo scrivere il codice per fare la stessa cosa che faccio se clicco su Finish Game
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
//---------------------------------END timer -------------------------------------

// Updates the classes to display the selected keys as described in model.
function render() {
  tiles = document.querySelectorAll(".tile");
}

// CONTROLLER

function change_set() {
   for (let i = 0; i < modelLength; i++) { // For each element of the model, so of the bar
      barContainer.removeChild(setPieces[i].tile)
   }
  // svuotare setPieces
  setPieces = []
  createSet()
  render()
}

changeSet.onclick = change_set

firstPainfulRender()
