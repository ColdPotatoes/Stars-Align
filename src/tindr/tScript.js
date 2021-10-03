const txt = require('txt.json');

var i = 0

function transforming() {

    console.log(i)
    //change text
    document.getElementById("words").innerHTML = txt[i]

    if(i % 2 == 0){
        //flip image
        document.getElementById('astro-img').style.transform = "scaleX(-1)";

        //flip text and image
        var content = document.getElementById('astro-img');
        var parent = content.parentNode;
        parent.insertBefore(content, parent.firstChild);

        //show date picker
        document.getElementById('start').style.display ="inline-block"
        
    }

    console.log("yessir");

    i++
}
function removeElement() {
    document.getElementById('pg1').style.display = "none";
}
function resetElement() {
    document.getElementsByClassName("").style.visibility = "hidden";
}
function changeT() {
    document.getElementById("").innerHTML = "";
}