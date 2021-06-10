import { playChordsOnHeader } from "./modules/sound";

/* redirecting to mode selction when clicking the button, after the animation */
function redirectToModeSelection() {
    location.replace("modeSelection.html");
}


/* function that makes the title visible and plays a chord on each syllable */
const title = document.querySelectorAll(".title");
var indexTitle = 0;

function showTitle() {
    title[indexTitle].style.setProperty("opacity", "1.0");
    playChordsOnHeader(indexTitle);
    indexTitle++;
}


const audioButton = document.getElementById("startAudio");
const theHeader = document.getElementById("theHeader");

/* creates the animation by timing both sound and style */
audioButton?.addEventListener('click', async () => {
    await Tone.start()

    setTimeout(function() {
        audioButton.style.setProperty("opacity", "0.0");
        setTimeout(function() {
            document.querySelector("#content").classList.add("backgroundAnimation");
            setTimeout(function() {
                theHeader.style.setProperty("width", "60%");
                theHeader.style.setProperty("height", "35%");
                theHeader.style.setProperty("border", "0.4em solid rgb(109, 41, 44)");
                setTimeout(function() {
                    let showing = setInterval(showTitle, 700);
                    setTimeout(function() {clearInterval(showing)}, 2800);
                    setTimeout(redirectToModeSelection, 5000);
                }, 2300);
            }, 800);
        }, 500);
    }, 500);

}, {once: true})
