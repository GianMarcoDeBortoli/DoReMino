// creation of the synth and connection of it to the output speakers
const synth = new Tone.Synth().toDestination();
const poly = new Tone.PolySynth().toDestination();
const pluck = new Tone.PluckSynth().toDestination();
const membrane = new Tone.MembraneSynth().toDestination();
const metal = new Tone.MetalSynth().toDestination();
pluck.volume.value = -12;
membrane.volume.value = -12;
metal.volume.value = -12;

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
//----------------------------------------- SOUND INSIDE game.html ------------------------------------------------

// matrix needed for the selection of the correct note based on the color of the half-tile
const searchForNote = [["rgb(11, 191, 140)","rgb(165, 29, 54)", "rgb(167, 200, 242)", "rgb(217, 164, 4)",
                        "rgb(135, 28, 235)","rgb(56, 5, 242)","rgb(253, 105, 19)", "rgb(12, 242, 27)",
                        "rgb(207, 178, 143)", "rgb(242, 242, 242)", "rgb(93, 93, 107)", "rgb(240, 11, 118)", "rgb(15, 242, 178)",
                        "rgb(217, 72, 98)", "rgb(206, 222, 242)", "rgb(242, 205, 19)", "rgb(181, 128, 230)", "rgb(100, 61, 240)"], 
                       ["G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"]];

// the function goes into the target of the click event and lookes for the color, finds the index of the color inside the array of colors,
// finds the note correspondent to the index found, triggers the synth with that same note
export function playNoteOnTile() {
    let color = event.currentTarget.style.backgroundColor;
    console.log(color);
    let index = searchForNote[0].indexOf(color);
    let note = searchForNote[1][index];
    if (event.shiftKey) {
        synth.triggerAttackRelease(note, "8n");
    }
}

