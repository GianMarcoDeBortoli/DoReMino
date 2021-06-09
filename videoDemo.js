import {playMembrane} from "./modules/sound";

const backToRules = document.getElementById("backToRules");
backToRules.addEventListener("click", redirectToRules);

/* redirecting to the rules when clicking the button */
function redirectToRules() {
    playMembrane();
    setTimeout(function() {location.replace("rules.html")}, 700);
}
