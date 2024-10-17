var video = document.getElementById("videoIntro");
var btn = document.getElementById("videoControl");

function playVideo() {
    if (video.paused) {
        video.play();
        // btn.innerHTML = "Pausar";
    } else {
        video.pause();
        // btn.innerHTML = "Tocar";
    }
}
document.getElementById('videoIntro').addEventListener('ended', function (e) {
    console.log("video has ended");
    fullpage_api.moveSectionDown();
}, false);