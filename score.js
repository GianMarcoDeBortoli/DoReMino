import {play_melody, synth, searchForNote} from './modules/sound';
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

playMelody.onclick = function() {
  play_melody(result);
}
