// creation of the synth and connection of it to the output speakers
const synth = new Tone.Synth().toDestination();
const poly = new Tone.PolySynth().toDestination();
const pluck = new Tone.PluckSynth().toDestination();

//----------------------------------------- SOUND INSIDE openingTitle.html ----------------------------------------
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

//----------------------------------------- SOUND INSIDE game.html ------------------------------------------------

// matrix needed for the selection of the correct note based on the color of the half-tile
const searchForNote = [["darkslateblue", "darkgoldenrod", "darkred", "palevioletred",
                       "darkgreen", "darkblue", "lawngreen", "darkslategray",
                       "darkorange", "turquoise", "yellow", "red", "slateblue",
                       "goldenrod", "firebrick", "lightpink", "forestgreen", "blue"], 
                       ["G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"]];

// the function goes into the target of the click event and lookes for the color, finds the index of the color inside the array of colors,
// finds the note correspondent to the index found, triggers the synth with that same note
export function playNoteOnTile() {
    let color = event.currentTarget.style.backgroundColor;
    let index = searchForNote[0].indexOf(color);
    let note = searchForNote[1][index];
    if (event.shiftKey) {
        synth.triggerAttackRelease(note, "8n");
    }
}

