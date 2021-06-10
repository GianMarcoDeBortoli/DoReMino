import {synth, searchForNote, playMembrane} from './modules/sound';
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

// arrays to be filled with tips shown in green and red post-it
var pros = ["GOOD JOB!"];
var cons = ["FOR THE NEXT TIME:"];

// retry button
const retryButton = document.getElementById("backToModeSelection");

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

function writeTips() {
  const positive = document.querySelector("#pros");
  const negative = document.querySelector("#cons");

  positive.innerHTML = "";
  for (let i = 0; i < pros.length; i++) {
    positive.innerHTML += pros[i];
    positive.innerHTML += "<br>";
  }

  negative.innerHTML = "";
  for (let i = 0; i < cons.length; i++) {
    negative.innerHTML += cons[i];
    negative.innerHTML += "<br>";
  }
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
    writeTips();
}

//----------------------------------------------- END of VIEW --------------------------------------------------------------

//----------------------------------------------- CONTROLLER --------------------------------------------------------------
firstPainfulRender();

//---------- scoring ------------------------

function finalEvaluateMelody(melody){
    // BEGIN AND END, DIFFERENT NOTES
    var begin = melodyEvaluator.beginOnTonic(melody);
    var end = melodyEvaluator.endOnTonic(melody);
    var diffNotes = melodyEvaluator.differentNotes(melody);

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

 
    // MESSAGES
    //length 
    if (melody.length == 1) {
        cons.push("You placed no tiles!");
    } else if (melody.length == 2) {
        /* - You only placed one tile!*/
        cons.push("You only placed one tile! Try to place at least 3!");
    } else if (melody.length == 3) {
        cons.push("You only placed 2 tiles! Try to place at least 3!");
    } else if (diffNotes == 0) {
        /*  - You didn't use many different notes... */
        cons.push("You repeated only one note!");
    } else {
            // if the melody is long enough: 
            if (melody.length > 2 && melody.length < 7) {
                /* - The melody is a little short... */
                cons.push("The melody is a little short...");
            } else if (melody.length > 7) {
                /* + You placed many tiles! */
                pros.push("You placed many tiles!");
            }

            //begin and end
            if (begin == 0 && end == 0) {
                /* +   Great, your melody begins and ends on the first grade!   */  //-> it's not really wrong to make it start on a different note
                pros.push("Great, your melody begins and ends on the first grade!");
            } else if (begin == 0) {
                /* +   Great, your melody begins on the first grade!   */
                pros.push("Great, your melody begins on the first grade!");
            } else if (end == 0) {
                /*  +   Your melody ends on the tonic, that's awesome!  */
                pros.push("Your melody ends on the tonic, that's awesome!");
            } else {
                /*  -  Next time, try to end the melody on the tonic!  */  //-> it's not really wrong to make it start on a different note
                cons.push("Try to end the melody on the tonic!");
            }

            if (diffNotes < 3) {
                /*  - You didn't use many different notes... */
                cons.push("You didn't use many different notes...");
            }

            //contour
            if (negContour < -3) {
                /* - You used continously the same boring patterns! */
                cons.push("You used continously the same boring patterns!");
            }

            if (posContour > 3) {
                /* + You used various patterns and repeated them!*/
                pros.push("You used various patterns and repeated them!");
            }

            //leap
            if (wideLeaps > 2) {
                /* - There are quite a few very wide leaps, better avoid them */
                cons.push("There are quite a few very wide leaps, better avoid them!");
            } else {
                /* + There aren't many wide leaps! */
                pros.push("There aren't many wide leaps!");
            }

            if (meanDistance > 7) {
                /* - The melody is not really linear */
                cons.push("The melody is not really linear...");
            }

            if (sameDirLeaps > 2) {
                /* - After big leaps, try to go in the opposite direction */
                cons.push(" After big leaps, try to go in the opposite direction to balance everything!");
            }

            if (neighNotes > 3 * notNeighNotes) {
                /* - You mostly used neighbour notes*/
                cons.push("You mostly used neighbour notes! Use leaps too!");
            } else if (notNeighNotes > 3 * neighNotes) {
                /* - You did not use many neighbour notes*/
                cons.push("You did not use many neighbour notes, try to insert a few!");
            } else {
                /* + You balanced well neighbour and not neighbour notes*/
                pros.push("You balanced well neighbour and not neighbour notes!");
            }

    }
    



   
    


    // TOTAL POINTS
    var indivScores = [];
    // each aspect of the game is given a score from o to 100. The score will be the mean of them.

    // [0] = length of the melody 
    if (melody.length < 4) {
        indivScores[0] = 0;
    } else if (melody.length < 7) {
        indivScores[0] = (melody.length-2);
    } else { indivScores[0] = 100; }

    // [1] = begin and end on tonic; not enough different notes
    indivScores[1] = 90;
    if (begin == 0) { indivScores[1] += 10; }
    if (end == 1) { indivScores[1] -= 10; }
    if (diffNotes <= (melody.length * 0.2 )) { indivScores[1] -= 75 }

    // [2] = contour
    indivScores[2] = 100 - negContour - posContour;

    // [3] = leaps
    if (meanDistance > 7) {
        indivScores[3] = 50;
    }
    indivScores[3] = 100;
    indivScores[3] -= wideLeaps * 4;
    indivScores[3] -= sameDirLeaps * 2;

    if (neighNotes > 3 * notNeighNotes) {
        indivScores[3] -= 10;
    }
    if (notNeighNotes > 3 * neighNotes) {
        indivScores[3] -= 10;
    }


    if (indivScores[0] == 0) {
        score = 0;
    } else {
        score = indivScores[0] + indivScores[1] + indivScores[2] + indivScores[3];
        score = score / 4;
    }
    return score;

  /*if(repetitionIdentifier>3*l){
    score = score - 10;   //random value to be evaluated.....
  }*/

}

retryButton.addEventListener("click", function() {
  playMembrane();
  setTimeout(function() {location.replace("modeSelection.html")}, 700);
})