
var i = 0

function transforming() {
    if (i == 0) {
        let astroText = document.getElementById("main")
        document.getElementById("words").innerHTML = "hey thats me based on my birthday!"
        i++;
        
        //show your point
        addYourOrbit(`1 00011U 59001A   21274.81911892  .00000050  00000-0  29890-4 0  9999
        2 00011  32.8668  85.4565 1467468  32.7520 335.6037 11.85795798330941`)
    }
    else if (i == 1) {
        document.getElementById("words").innerHTML = "well will you look at that, that's a lot of chances.";
        //show the cone area
        showCone(0, 0)
        i++;
    }
    else if (i == 2) {
        document.getElementById("words").innerHTML = "click on one of them to find out orbital information. and choose your special debris";
        chooseDebris()
        //document.getElementById("submit").visibility = visible;    
    }
}

function chooseDebris() {

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

    let data = {
        'address': value, //need to get address from user input in html
        'key': 'AIzaSyAxD0n3nubD6HZ9oZjuyer_vfJ3oWiSZq0',
    }
    let coord = getCoords(data)
    coord.then(coordinates => {
        console.log("lat: " + coordinates.lat + " long: " + coordinates.long)
    })
}