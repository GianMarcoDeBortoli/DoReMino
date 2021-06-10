import {playMembrane} from "./modules/sound";


/* redirecting to the rules when clicking the button */
const backToRules = document.getElementById("backToRules");
backToRules.addEventListener("click", redirectToRules);

function redirectToRules() {
    playMembrane();
    setTimeout(function() {location.replace("rules.html")}, 700);
}
