// ------------------------------------ functions used also to evaluate the melody during the game -----------------------


/*This function returns the number of wide leaps (at least 1 sixth - 9 semitones) followed by a leap in the same direction*/
export function sameDirectionLastLeap(melody) {
    var l = melody.length;
    if (Math.abs(melody[l - 2] - melody[l - 1]) > 9 && (Math.sign(melody[l - 2] - melody[l - 1]) == Math.sign(melody[l - 1] - melody[l]))) {
        return 1;
    } else {
        return 0;
    }
}

/* This function returns the number of consecutive neighbour notes*/
export function neighbourNotes(melody){
  var score = 0.0;
   for(let i=1; i<melody.length; i++){
    if ( Math.abs(melody[i-1]-melody[i]) < 3 ) {
      score ++;
    }
  }
  return score;
}

/* This function returns the number of consecutive NOT neighbour notes*/
export function notNeighbourNotes(melody){
  var score = 0.0;
   for(let i=1; i<melody.length; i++){
    if ( Math.abs(melody[i-1]-melody[i]) > 2 ) {
      score ++;
    }
  }
  return score;
}

/* This function returns 1 if the last added note is at more than an octave of distance, 0 otherwise*/
export function tooWideLastLeap(melody){
  if (Math.abs(melody[melody.length-2]-melody[melody.length-1]) > 12) {
    return 1;
  }
  else {
    return 0;
  }
}

/* This function returns the mean of the abs value of the jumps. Checks if there are too many wide oscillations in the melody (meaning many jumps)
If the mean value is more than a 5th, the melody is too oscillating*/
export function meanOfDistances(melody) {
    var score = 0.0;
    for (let i = 1; i < melody.length; i++) {
        score = Math.abs(melody[i - 1] - melody[i]);
    }
    return score / melody.length;
}


// ------------------------------------ END functions used also to evaluate the melody during the game -----------------------

// ------------------------------------ functions used only to evaluate the melody at the end of the game -----------------------



/* This function returns a negative score: returns the number of too wide leaps (over 1 octave). 1 ocatve is represented by a leap of 12 in our case. */
export function tooWideLeaps(melody){
 var score = 0.0;
 for(let i=1; i<melody.length-1; i++){
   if ( Math.abs(melody[i-1]-melody[i]) > 12 ) {
     score ++;
   }
 }
 return score;
}

/*This function returns the number of wide leaps (at least 1 sixth - 9 semitones) followed by a leap in the same direction*/
export function sameDirectionLeaps(melody) {
    var score = 0.0;
    for (let i = 2; i < melody.length; i++) {
        if (Math.abs(melody[i - 2] - melody[i - 1]) > 9 && (Math.sign(melody[i - 2] - melody[i - 1]) == Math.sign(melody[i - 1] - melody[i - 0]))) {
            score++;
        }
    }
    return score;
}

// -- FUNCTIONS ABOUT FIRST AND LAST NOTE -- //

//returns 0 if the melody begins on the first grade [0], 1 otherwise
export function beginOnTonic(melody){
  if (melody[0]==0) {
    return 0;
  } else {
    return 1;
  }
}

//returns 0 if the melody ends on the first grade [0], 1 otherwise
export function endOnTonic(melody){
  if (melody[melody.length-1]==0) {
    return 0;
  } else {
    return 1;
  }
}

/* This function counts how many different notes are there in the melody */
export function differentNotes(melody) {
    let score = 0;

    for (let i = 0; i < melody.length; i++) {
        var j;
        for (j = 0; j < i; j++)
           if (melody[i] == melody[j])
               break;
   
        if (i == j)
            score += 1
    }
    return score;
}



// -- FUNCTIONS ABOUT CONTOUR -- //

/* this function returns an evaluation of the melody so far based on the melody contour.*/
/*
The melody is scanned to get the contour of every block of 3 notes. The possible contours are:
11 RISING
12 RISING - FLAT
13 RISING - FALLING
21 FLAT - RISING
22 FLAT
23 FLAT - FALLING
31 FALLING - RISING
32 FALLING - FLAT
33 FALLING

If 3 contours with repeated same digits (11, 22, 33) are found consecutive of each other, (eg: 11 - 11 means there are 4 notes all in a ascending scale) there is a penalty in the score.
In other cases, if the consecutive are inversions (eg: 12 - 21) it means that vore varying patterns are repeated, and that's good
*/
export function findContour(melody){
  var len = melody.length;
  if (len<3){
    return;
  }
  var contourCode = [];
  // scanning trough the melody to detect patterns.
  for(let i=1; i<len-1; i++){ //i goes from the second note to the second-last note
    var code;
    if (melody[i-1]<melody[i]) code = 10; // first note is lower than second: rising
    else if (melody[i-1]==melody[i]) code = 20; // first note is same as second: flat
    else if (melody[i-1]>melody[i]) code = 30; // first note is higher than second: falling
    if (melody[i]<melody[i+1]) code = code + 1; // second note is lower than third: rising
    else if (melody[i]==melody[i+1]) code = code + 2; // second note is same as third: flat
    else if (melody[i]>melody[i+1]) code = code + 3;// second note is higher than third: falling
    contourCode[i-1] = code;
  }

  return contourCode;
}

/* This function returns a negative score: subtracts a point every time 4 notes are in the same contour (rising - flat - falling) */
export function oneDirectionContour(contourCode) {
    var score = 0.0;
    if (undefined !== contourCode && contourCode.length) {
        // remove points when patterns with not repeated digits are placed next to each other
        for (let i = 1; i < contourCode.length; i++) {
            if ((contourCode[i - 1] == contourCode[i] && (contourCode[i - 1] == 11 || contourCode[i - 1] == 22 || contourCode[i - 1] == 33))) {
                score++;
            }
        }
    }
    
  return score;
}

/* This function returns a positive score: adds a point then same contours are repeated every other note*/
export function multiDirectionContour(contourCode) {
    var score = 0.0;
    if (undefined !== contourCode && contourCode.length) {
        // adding points when patterns are repeated every other note or every other 2 notes
        for (let i = 1; i < contourCode.length - 1; i++) {
            if (contourCode[i - 1] == contourCode[i + 1]) {
                score++;
            }
        }
        for (let i = 1; i < contourCode.length - 2; i++) {
            if (contourCode[i - 1] == contourCode[i + 2]) {
                score++;
            }
        }
    }
  return score;
}


// ------------------------------------ END functions used only to evaluate the melody at the end of the game -----------------------
