var i = 0

console.log(localStorage["bday"])
console.log(localStorage["lat"])
console.log(localStorage["long"])

function transforming() {
    if (i == 0) {
        let astroText = document.getElementById("main")
        document.getElementById("words").innerHTML = "hey thats me based on my birthday!"
            // astroText.style.width = "30vw";
            // astroText.style.height = "15vh";
            // astroText.style.float = "right";
            // astroText.style.marginRight = "20vw";
        i++;
        //show your point
        addYourOrbit(`1 00011U 59001A   21274.81911892  .00000050  00000-0  29890-4 0  9999
        2 00011  32.8668  85.4565 1467468  32.7520 335.6037 11.85795798330941`)
    } else if (i == 1) {
        document.getElementById("words").innerHTML = "well will you look at that right above where you live, that's a lot of chances.";
        //show the cone area
        let lat = localStorage["lat"] * Math.PI / 180
        let long = localStorage["long"] * Math.PI / 180
        showCone(lat, long)
        i++;
    } else if (i == 2) {
        localStorage["selectTime"] = "true"
        document.getElementById("words").innerHTML = "click on one of them to find out orbital information. and choose your special debris";
        document.getElementById("submit").style.display = "block";
        document.getElementById("next").style.display = "none";
    }
}