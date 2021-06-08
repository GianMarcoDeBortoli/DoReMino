import {playMembrane} from "./modules/sound";

const backToModeSelectionButton = document.getElementById("backToModeSelectionButton");
backToModeSelectionButton.addEventListener("click", redirectToModeSelection);

function redirectToModeSelection() {
    playMembrane();
    setTimeout(function() {location.replace("modeSelection.html")}, 700);
}