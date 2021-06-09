import {synth, searchForNote} from './modules/sound';
import * as melodyEvaluator from './modules/melodyEvaluator';

//------------------------------------------------------- MODEL -----------------------------------------------------------
var dominosContainer = document.getElementById("dominosContainer");
const colors = ["rgb(11, 191, 140)", "rgb(165, 29, 54)", "rgb(167, 200, 242)", "rgb(217, 164, 4)",
                "rgb(135, 28, 235)", "rgb(56, 5, 242)", "rgb(253, 105, 19)", "rgb(12, 242, 27)",
                "rgb(207, 178, 143)", "rgb(242, 242, 242)", "rgb(93, 93, 107)", "rgb(240, 11, 118)",
                "rgb(15, 242, 178)","rgb(217, 72, 98)", "rgb(206, 222, 242)", "rgb(242, 205, 19)",
                "rgb(181, 128, 230)", "rgb(100, 61, 240)"];
var lowerGrades = 5;
let delay = 0;
window.onbeforeunload = function() {
    return "Are you sure you want to leave?";
}

// function to get parameters from URL
// URLSearchParams crea una sorta di dizionario dalla stringa data in argomento, la stringa data è la parte dell'URL che sta dopo l'uguale
// per accedere ai valori del dizionario si usa la get(key)
function parseGetVars() {
  let res = [];
  let params = new URLSearchParams(document.location.search.substring(1));
  let result = params.get("result");
  res[0] = result;
  console.log(res);
  return res;
}
var params = parseGetVars();
console.log(params);
var resultString = params[0].split("_"); // in this way I have again an array with all the grades
var result = [];
for(let i=0; i<resultString.length; i++){
  result.push(parseInt(resultString[i]));
}
console.log(resultString);
console.log(result);
//---------------------------------------------- END of MODEL --------------------------------------------------------------

//----------------------------------------------- VIEW ---------------------------------------------------------------------

const playMelody = document.getElementById("playMelody");
playMelody.addEventListener("click", function() {
  play_melody(result);
})

function play_melody(result){
  let time = 0.5;
  const now = Tone.now();
  cleanDominos();
      for(let i=0 ; i<result.length; i++){
          const domino = createDomino(result[i]);
          dominosContainer.appendChild(domino);
          let grade = result[i];
          let index = searchForNote[0].indexOf(grade);
          let note = searchForNote[1][index];
          synth.triggerAttackRelease(note, "8n", now + time);
          time += 0.5;
      }
}

function cleanDominos(){
  while (dominosContainer.lastElementChild) {
    dominosContainer.removeChild(dominosContainer.lastElementChild);
  }
  delay=0;
}

function createDomino(resultElement){
  let piece = document.createElement("li");
  piece.classList.add("domino");
  let grade = resultElement;
  let index = searchForNote[0].indexOf(grade);
  let note = searchForNote[1][index];
  piece.textContent = note;
  let color = colors[grade+lowerGrades];
  piece.style.backgroundColor = color;
  delay += 0.5;
  piece.style.animationDelay = delay+"s";
  return piece;
}

//---------------------------------------------------- score bar -------------------------------------
const GOOD_THRESHOLD = 50;
const EXCELLENT_THRESHOLD = 80;
const COLOR_CODES = {
  bad: {
    color: "red"
  },
  good: {
    color: "orange",
    threshold: GOOD_THRESHOLD
  },
  excellent: {
    color: "green",
    threshold: EXCELLENT_THRESHOLD
  }
};
var i = 0;
var score = finalEvaluateMelody(result);
function moveScoreBar() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 50); /* duration of loading bar */
    function frame() {
			if(width >= score) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        setColor(width);
        elem.style.width = width + "%";
        elem.innerHTML = width + "%";
      }
    }
  }
}

function setColor(width) {
  const { excellent, good, bad } = COLOR_CODES;
  if (width >= excellent.threshold) {
    document.getElementById("myBar").style.backgroundColor = excellent.color;
  } else if (width >= good.threshold) {
    document.getElementById("myBar").style.backgroundColor = good.color;
  }
}
//---------------------------------------------------- END score bar -------------------------------------

// RENDER
function firstPainfulRender() {
  moveScoreBar();
}

//----------------------------------------------- END of VIEW --------------------------------------------------------------

//----------------------------------------------- CONTROLLER --------------------------------------------------------------
firstPainfulRender();

//---------- scoring ------------------------
//the evaluation tends to subtract points if you did WRONG THINGS

function finalEvaluateMelody(melody){
  // BEGIN AND END
  var begin = melodyEvaluator.beginOnTonic(melody);
  var end = melodyEvaluator.endOnTonic(melody);

  // CONTOUR
  var contour = melodyEvaluator.findContour(melody);
  var negContour = melodyEvaluator.oneDirectionContour(contour);
  var posContour = melodyEvaluator.multiDirectionContour(contour);

  // LEAPS
  var wideLeaps = melodyEvaluator.tooWideLeaps(melody);
  var meanDistance = melodyEvaluator.meanOfDistances(melody);
  var sameDirLeaps= melodyEvaluator.sameDirectionLeaps(melody);
  var neighNotes = melodyEvaluator.neighbourNotes(melody);
  var notNeighNotes = melodyEvaluator.notNeighbourNotes(melody);

  // REPETITION
  //var repetitions = repetitionIdentifier(melody);

  // MESSAGES
  if (begin == 0){
     /* +   Great, your melody begins on the first grade!   */  //-> it's not really wrong to make it start on a different note
  }
  if (end == 0) {
    /*  +   Your melody ends on the tonic, that's awesome  */
  } else {
    /*  -  Next time, try to end the melody on the tonic!  */
  }

  // TOTAL POINTS

  score = 100 - begin - end;
  score = score + 2*negContour + 2*posContour;
  score = score - wideLeaps - sameDirLeaps;

  if(meanDistance > 7) {
    score = score - meanDistance;
  }
  if(neighNotes>3*notNeighNotes || 3*neighNotes < notNeighNotes) {
    score = score - 10;   //random value to be evaluated.....
  }

  return score;

  /*if(repetitionIdentifier>3*l){
    score = score - 10;   //random value to be evaluated.....
  }*/

}
