window.onbeforeunload = function() {
    return "Are you sure you want to leave?";
}

const synth = new Tone.Synth().toDestination();

// matrix needed for the selection of the correct note based on the color of the half-tile
const searchForNote = [[-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12],
                       ["G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5"]];
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
var result = params[0].split("_"); // in this way I have again an array with all the grades
console.log(result);

function play_melody(){
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

playMelody.onclick = play_melody;
