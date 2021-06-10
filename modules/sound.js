/* ************************************************** MODEL **************************************************** */

/* creation of synths with tone.js */
export const synth = new Tone.Synth().toDestination();
const poly = new Tone.PolySynth().toDestination();
const pluck = new Tone.PluckSynth().toDestination();
const membrane = new Tone.MembraneSynth().toDestination();
const metal = new Tone.MetalSynth().toDestination();

/* regulation of volumes */
pluck.volume.value = -12;
membrane.volume.value = -12;
metal.volume.value = -12;

/* dictionary used to get the correct note from of the grade */
export const searchForNote = [[-6, -5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12],
                       ["F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"]];


/* functions that creates the ambient sounds */
export function playChordsOnHeader(index) {
    if (index == 0) poly.triggerAttackRelease(["C4", "G4"], "8n");
    else if (index == 1) poly.triggerAttackRelease(["D4", "F4"], "8n");
    else if (index == 2) poly.triggerAttackRelease(["B3", "E4", "G4"], "8n");
    else if (index == 3) synth.triggerAttackRelease("C4", "4n");
}

export function playNoteOnHeader(index) {
    if (index == 0) synth.triggerAttackRelease("C4", "8n");
    else if (index == 1) synth.triggerAttackRelease("D4", "8n");
    else if (index == 2) synth.triggerAttackRelease("E4", "8n");
}

export function playPluck() {
    pluck.triggerAttackRelease("C5", "16n");
}

export function playMembrane() {
    membrane.triggerAttackRelease("C4", "16n");
}

export function errorSound() {
    metal.triggerAttackRelease("C5", "32n");
}

export function changeSetSound() {
    let interval = setInterval(function () {pluck.triggerAttackRelease("C6", "32n")}, 40);
    setTimeout(function () {clearInterval(interval)}, 300);
}

/* function that plays back the melody built inside the game */
export function play_melody(result){
  let time = 0;
  const now = Tone.now()
      for(let i=0 ; i<result.length; i++){
          let grade = result[i];
          let index = searchForNote[0].indexOf(grade);
          let note = searchForNote[1][index];
          synth.triggerAttackRelease(note, "8n", now + time);
          time += 0.5;
      }
}
