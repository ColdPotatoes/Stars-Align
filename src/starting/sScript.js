let data = {
    'address': "1600 Pennsylvania Avenue NW", //need to get address from user input in html
    'key': 'AIzaSyAxD0n3nubD6HZ9oZjuyer_vfJ3oWiSZq0',
}

async function getCoords() {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${new URLSearchParams( data ).toString()}`);
    let obj = await res.json();

    return {
        lat: obj.results[0].geometry.location.lat,
        long: obj.results[0].geometry.location.lng
    }
}

// const {lat, long} = await getCoords();