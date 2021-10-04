let i = 0;

function transforming() {
    if (i == 0) {
        let astroText = document.getElementById("main")
        
        //change text
        document.getElementById("words").innerHTML = "input your birthday to find your orbit!"
        
        //flip image vertically
        document.getElementById('astro-img').style.transform = "scaleX(-1)";

        //flip text and image location
        var content = document.getElementById('astro-img');
        var parent = content.parentNode;
        parent.insertBefore(content, parent.firstChild);

        //adding calendar??
        //document.getElementById("custom-picker").style.display = "block";
        document.getElementsByClassName('date-picker')[0].style.display = "block";

        console.log("yessir");

    }
    else if (i == 1) {
        const birthday = document.querySelector('.date-picker .selected-date');
        let bday = birthday.textContent

        localStorage["bday"] = bday
        console.log(bday)
        document.getElementById("words").innerHTML = "choose a location on the globe or input an address!"
        document.getElementById("forming").style.display = "block";

        //change next button function to go to part2
        document.getElementById("next-button").setAttribute("onclick", "saveAddress()");
        document.getElementsByClassName('date-picker')[0].style.display = "none";
    }
    i++
}

//address stuff move to part 1
async function getCoords(data) {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${new URLSearchParams(data).toString()}`);
    let obj = await res.json();

    return {
        lat: obj.results[0].geometry.location.lat,
        long: obj.results[0].geometry.location.lng
    }
}

function saveAddress() {
    console.log("heaihhi")
    let value = document.getElementById("address-form").value
    console.log("value: " + value)

    if (value == ""){
        alert("please insert an address!")
    }
    let data = {
        'address': value, //need to get address from user input in html
        'key': 'AIzaSyAxD0n3nubD6HZ9oZjuyer_vfJ3oWiSZq0',
    }
    let coord = getCoords(data)
    coord.then(coordinates => {
        console.log("lat: " + coordinates.lat + " long: " + coordinates.long)
        localStorage["lat"]= coordinates.lat
        localStorage["long"] = coordinates.long
        location.href = '../part2/part2.html'
    })
}
function submit(){

}



// var months = [ "January", "February", "March", "April", "May", "June", 
//            "July", "August", "September", "October", "November", "December" ]; 
// const birthday = "2005-01-24";
// twoLineGenerator(birthday);
// function twoLineGenerator(birthday){
// const year = birthday.substring(0,4);
// const month = birthday.substring(5,7);
// const day = birthday.substring(8, 10);
// const twoLineSet = `1 000` + month * 3 + day + months[month - 1].substring(0,1) + ` ` + month * 1000 + day + months[month - 1].substring(0,1) + `   ` + 
// (year + month + day) * 79 / 9 + `  ` + month / 2205882.3529412 + `  00000-0  ` + year * 13 + `-4 ` + `0  ` + (day + month + year) * 4 + `\n` + 
// `2 000` + month * 3 + day + `  ` + day * 2/3 + ` ` + month * 82/23 + ` ` + year * 914 + ` ` + month * 219.352 + `  ` + day * 31.2314 + 
// ` ` + month  * 5.2482;

// console.log(twoLineSet);
// }
