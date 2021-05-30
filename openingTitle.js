import { playChordsOnHeader } from "./modules/sound";


function redirectToModeSelection() {
    location.replace("modeSelection.html");
}

const title = document.querySelectorAll(".title");

let indexTitle = 0;

function showTitle() {
    title[indexTitle].style.setProperty("opacity", "1.0");
    playChordsOnHeader(indexTitle);
    indexTitle++;
}

const audioButton = document.querySelector('#startAudio');

audioButton?.addEventListener('click', async () => {
    await Tone.start()
	console.log('audio is ready')

    setTimeout(function() {
        document.getElementById("startAudio").style.opacity = 0.0;
        setTimeout(function() {
            document.querySelector("#theHeader").style.width = "80%";
            document.querySelector("#theHeader").style.height = "50%";
        }, 200);
        setTimeout(function() {
            let showing = setInterval(showTitle, 700);
            setTimeout(function() {clearInterval(showing)}, 2800);
        }, 1000);
        setTimeout(redirectToModeSelection, 6000);
    }, 300);

}, {once: true})
