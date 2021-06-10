import {synth, searchForNote, playMembrane} from './modules/sound';
import * as melodyEvaluator from './modules/melodyEvaluator';


/* ****************************************************** MODEL ******************************************************* */

var dominosContainer = document.getElementById("dominosContainer");

const colors = ["rgb(255, 104, 222)", "rgb(60, 116, 9)", "rgb(123, 180, 255)", "rgb(114, 67, 13)", "rgb(217, 164, 4)",
                "rgb(128, 21, 228)", "rgb(165, 29, 54)", "rgb(255, 115, 0)", "rgb(0, 4, 255)", "rgb(207, 178, 143)",
                "rgb(242, 242, 242)", "rgb(93, 93, 107)", "rgb(255, 163, 235)", "rgb(106, 206, 13)", "rgb(181, 214, 255)",
                "rgb(201, 115, 17)", "rgb(242, 205, 19)", "rgb(184, 109, 255)", "rgb(217, 72, 98)"];
var lowerGrades = 6; /* 6 grandes below C4 */
let delay = 0; /* sets the timing for the animation of the falling tiles */

// arrays to be filled with tips shown in green and red post-it
var pros = ["GOOD JOB!"];
var cons = ["FOR THE NEXT TIME:"];

// function to get parameters from URL
function parseGetVars() {
  let res = [];
  let params = new URLSearchParams(document.location.search.substring(1));
  let result = params.get("result");
  res[0] = result;
  return res;
}

var params = parseGetVars();

var resultString = params[0].split("_"); // in this way I have again an array with all the grades
var result = [];

for(let i=0; i<resultString.length; i++){
  result.push(parseInt(resultString[i]));
}


/* *****************************************************  VIEW  ********************************************************** */

/* plays the melody built in the game  */
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

/* DOMINO ANIMATION */
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

/* creates the text in the two post-it taking strings from pros and cons arrays */
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


/* SCORE BAR */
const GOOD_THRESHOLD = 50;
const EXCELLENT_THRESHOLD = 80;

const COLOR_CODES = {
  bad: {
    color: "rgb(214, 71, 71)"
  },
  good: {
    color: "rgb(255, 219, 58)",
    threshold: GOOD_THRESHOLD
  },
  excellent: {
    color: "rgb(61, 180, 61)",
    threshold: EXCELLENT_THRESHOLD
  }
};

var i = 0;


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

/*  RENDER  */
function firstPainfulRender() {
    moveScoreBar();
    writeTips();
}

//************************************************** CONTROLLER **************************************************

/* retry button that redirects to the mode selection */
const retryButton = document.getElementById("backToModeSelection");

retryButton.addEventListener("click", function() {
  playMembrane();
  setTimeout(function() {location.replace("modeSelection.html")}, 700);
})

/* ------------- SCORE EVALUATION SYSTEM -------------- */

function finalEvaluateMelody(melody) {

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
  var sameDirLeaps = melodyEvaluator.sameDirectionLeaps(melody);
  var neighNotes = melodyEvaluator.neighbourNotes(melody);
  var notNeighNotes = melodyEvaluator.notNeighbourNotes(melody);

  // MESSAGES

  // if the melody is to short
  if (melody.length == 1) {
      cons.push("You placed no tiles! Try to place at least 3!");
  } else if (melody.length == 2) {
      cons.push("You only placed one tile! Try to place at least 3!");
  } else if (melody.length == 3) {
      cons.push("You only placed 2 tiles! Try to place at least 3!");
  } else if (diffNotes == 1) {
      cons.push("You repeated only one note!");
  } else {
    // if the melody is long enough
    if (melody.length > 2 && melody.length < 7) {
        cons.push("The melody is a little short...");
    } else if (melody.length > 7) {
        pros.push("You placed many tiles!");
    }

    // begin and end on tonic
    if (begin == 0 && end == 0) {
        pros.push("Great, your melody begins and ends on the tonic");
    } else if (begin == 0) {
        pros.push("Great, your melody begins on the tonic");
    } else if (end == 0) {
        pros.push("Your melody ends on the tonic, that's awesome!");
    } else {
        cons.push("Try to end the melody on the tonic!");
    }


    // if to many notes are equal to each other
    if (diffNotes < 4) {
        cons.push("You didn't use many different notes...");
    }

    // contour
    if (negContour > 2) {
        cons.push("Try to make the contour of the melody more interesting!");
    }

    if (posContour < 4) {
        cons.push("Try to make the contour of the melody more interesting!");
    }

    if (posContour > 3) {
        pros.push("You used various patterns and repeated them!");
    }

    // leaps
    if (wideLeaps > 2) {
        cons.push("There are quite a few very wide leaps, better avoid them!");
    } else {
        pros.push("There aren't many wide leaps!");
    }

    if (meanDistance > 5) {
        cons.push("The melody could be more linear...");
    }

    if (sameDirLeaps > 2) {
        cons.push(" After big leaps, try to go in the opposite direction to balance everything!");
    }

    if (neighNotes > 3 * notNeighNotes) {
        cons.push("You mostly used neighbour notes! Use leaps too!");
    } else if (notNeighNotes > 3 * neighNotes) {
        cons.push("You did not use many neighbour notes, try to insert a few!");
    } else {
        pros.push("You balanced nicely neighbour and not neighbour notes");
    }

  }



  // TOTAL POINTS
  var indivScores = [];
  // each aspect of the game is given a score from 0 to 100. The score will be the mean of them.

  // [0] = length of the melody
  if (melody.length < 4) {
      indivScores[0] = 0;
  } else if (melody.length < 7) {
      indivScores[0] = 1;
  } else if (melody.length < 10) {
      indivScores[0] = melody.length * 10;
  } else { indivScores[0] = 100; }

  // [1] = begin and end on tonic; not enough different notes
  indivScores[1] = 90;
  if (begin == 0) { indivScores[1] += 10; }
  if (end == 1) { indivScores[1] -= 10; }
  let diff = 0;
  if (melody.length < 12) {
    diff = Math.abs(Math.round(diffNotes - 1.8 * Math.sqrt(melody.length)));
  } else if (melody.length >= 12) {
    diff = Math.abs(Math.round(diffNotes - 2 * Math.sqrt(melody.length)));
  }
  indivScores[1] -= diff * 10;

  // [2] = contour
  indivScores[2] = 50 - 10 * negContour + 5 * posContour;
  if (indivScores[2] < 0)
    indivScores[2] = 0;
  else if (indivScores[2] > 100)
    indivScores[2] = 100;

    // [3] = leaps
    console.log(meanDistance)
    if (meanDistance < 2)
     
     indivScores[3] = 0;
  else {
     if (meanDistance < 7)
        indivScores[3] = 100;
     /*else 
        indivScores[3] = 50; */
      
     indivScores[3] -= wideLeaps * 4;
     indivScores[3] -= sameDirLeaps * 2;
     if (neighNotes > 3 * notNeighNotes) 
        indivScores[3] -= 60;
     if (notNeighNotes > 3 * neighNotes) 
      indivScores[3] -= 60;  
  }


  console.log("indivScores[0]" + indivScores[0]);
  console.log("indivScores[1]" + indivScores[1]);
  console.log("indivScores[2]" + indivScores[2]);
  console.log("indivScores[3]" + indivScores[3]);

  var score = computeScore(indivScores[0], indivScores[1], indivScores[2], indivScores[3]);

  if (score > 100)
    score = 100;

  return score
}

var score = finalEvaluateMelody(result);


firstPainfulRender();


function computeScore(length, diffnotes, countour, leaps) {
  var a = 0.2, b = 0.2, c = 0.3, d = 0.3;
  
  if (length == 0) {
    a = 1;
    b = 0;
    c = 0;
    d = 0;
  }
  else if (leaps == 0) {
    a = 0.1;
    b = 0.1;
    c = 0.1;
    d = 0.7;
  }

  return a * length + b * diffnotes + c * countour + d * leaps
}