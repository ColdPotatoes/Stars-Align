const txt = [
"hey! i’m a lost astronaut in space looking to find *that* special one,\n help me out?",
 "input your birthday to find your orbit!", "i’d love to find a partner whose orbit collides with mine or is near me.",
  "click here to filter  for debris that collides with you",
   "input an address!",
    "click on an object to find more information on its orbital + time of collision with you.",
     "these are our orbits !! (orbit of that object and u will be shown)",
      "our collision date is.....",
       "if you ever want to check another space debris out, click the button up here!",
        "however, if you feel like you’ve found *the one*, introduce them to the family with the orange button",
         "let’s find a meeting time! we’ll see when your friends and family will be able to meet your special one.",
          "input an address!",
           "choose a point",
            "I’ve been missing food from Earth, good ol’ Earth food. I was wondering if you could give me an address, I’ll let you know if it’s safe to launch from there, and we’ll have some Earth food in space!",
             "input an address!",
              "thank you for helping me out!"]
var i = 1

function transforming() {

    console.log(i)
    //change text
    document.getElementById("words").innerHTML = txt[i]

    if(i % 2 == 1){
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

    if(i < 15){
        i++
    }
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