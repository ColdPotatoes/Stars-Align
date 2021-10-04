let i = 0;

function transforming() {
    if (i == 0) {     
        let ogbox = document.getElementById("text-box");
        document.getElementById("words").innerHTML = "make sure to meet me there when the time comes!";
        ogbox.style.width = "90vw";
        ogbox.style.height = "10vh";

        var image = document.getElementById('astro-img');
        image.parentNode.removeChild(image);

        document.getElementById('')
        //change text
    }

    else if (i == 1) {

        //change next button function to go to part2
        document.getElementById("next-button").setAttribute("onclick", "location.href='../part2/part2.html'");
    }
    
    i++
}