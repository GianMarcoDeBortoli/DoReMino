import {playMembrane} from "./modules/sound";


/* redirecting to mode selction when clicking the button */
const backToModeSelectionButton = document.getElementById("backToModeSelectionButton");
backToModeSelectionButton.addEventListener("click", redirectToModeSelection);

function redirectToModeSelection() {
    playMembrane();
    setTimeout(function() {location.replace("modeSelection.html")}, 700);
}

/* redirecting to the demo of the game when clicking the button */
const goToDemo = document.getElementById("goToDemo");
goToDemo.addEventListener("click", redirectToDemo);

function redirectToDemo() {
    playMembrane();
    setTimeout(function() {location.replace("videoDemo.html")}, 700);
}
