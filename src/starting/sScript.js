function btnTindr() {
    window.location='https://cornhub.website/';
}

let data = {
    'address': "1600 Pennsylvania Avenue NW",
    'key': 'AIzaSyAxD0n3nubD6HZ9oZjuyer_vfJ3oWiSZq0',
}

async function getCoords() {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${new URLSearchParams( data ).toString()}`);
    let obj = await res.json();
    console.log(obj);
}

function btnOrbit() {
    window.location='http://www.ornnhub.net';
}