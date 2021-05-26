const searchForNote = [["darkslateblue", "darkgoldenrod", "darkred", "palevioletred",
                       "darkgreen", "darkblue", "lawngreen", "darkslategray",
                       "darkorange", "turquoise", "yellow", "red", "slateblue",
                       "goldenrod", "firebrick", "lightpink", "forestgreen", "blue"], 
                       ["G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"]];

let synth = new Tone.Synth().toDestination();

export function playNote() {
    let color = event.currentTarget.style.backgroundColor;
    let index = searchForNote[0].indexOf(color);
    let note = searchForNote[1][index];
    if (event.shiftKey) {
        synth.triggerAttackRelease(note, "8n");
    }
}
