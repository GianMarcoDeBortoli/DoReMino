import {playMembrane} from "./modules/sound";

const backToModeSelectionButton = document.getElementById("backToModeSelectionButton");
backToModeSelectionButton.addEventListener("click", redirectToModeSelection);

const goToDemo = document.getElementById("goToDemo");
goToDemo.addEventListener("click", redirectToDemo);

function redirectToModeSelection() {
    playMembrane();
    setTimeout(function() {location.replace("modeSelection.html")}, 700);
}

function redirectToDemo() {
    playMembrane();
    setTimeout(function() {location.replace("videoDemo.html")}, 700);
}
