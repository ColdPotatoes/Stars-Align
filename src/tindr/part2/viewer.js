const totalSeconds = 60 * 60 * 3;
const timestepInSeconds = 300;
const start = Cesium.JulianDate.fromDate(new Date());
const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
const startTime = Cesium.JulianDate.addSeconds(start, -totalSeconds, new Cesium.JulianDate());
const endTime = Cesium.JulianDate.addSeconds(start, totalSeconds - 600, new Cesium.JulianDate());
let entityArr = [];

let viewer;

let selectedEntity;
propogate()
async function getData() {
    let satelliteArr = [];
    const res = await fetch('https://us-central1-stars-5145f.cloudfunctions.net/app/catalog2');
    let orbitalsArr = await res.json();

    let length = orbitalsArr.length;

    for (let i = 0; i < length - 1; i += 3) {
        const satrec = satellite.twoline2satrec(
            orbitalsArr[i].TLE_LINE1,
            orbitalsArr[i].TLE_LINE2
        );
        satelliteArr.push(satrec)
    }
    return {
        satArr: satelliteArr,
        orbArr: orbitalsArr
    };
}

async function loadViewer(satArr) {
    const clock = new Cesium.Clock({
        startTime: startTime,
        stopTime: endTime,
        currentTime: start,
        clockRange: Cesium.ClockRange.CLAMPED, // loop when we hit the end time
        canAnimate: true,
        shouldAnimate: true,
    });

    const clockViewModel = new Cesium.ClockViewModel(clock);

    const viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.TileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
        }),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: true,
        infoBox: false,
        navigationHelpButton: true,
        sceneModePicker: false,
        timeline: false,
        animation:false,
        clockViewModel
    });
    



    let latestEntity;

    viewer.selectedEntityChanged.addEventListener((entity) => {
        showInfo(entity)
        if(localStorage["selectTime"] == "true"){
            console.log("hi")
            selectedEntity = entity
        }
        if (entity) {
            
            // console.log(entity);
            // if (latestEntity && latestEntity != entity) {
            //     latestEntity.label = undefined;
            //     latestEntity.polyline = undefined;
            //     latestEntity = entity;
            // }
            // latestEntity = entity;
            // entity.label = {
            //         text: `${entity.name}\nID: ${entity.id}\nEccentricity: ${entity.eccentricity}\nPeriod: ${entity.period}`,
            //         font: "12px Helvetica",
            //         fillColor: Cesium.Color.WHITE,
            //         style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            //         showBackground: true,
            //     }
                // let line = drawOrbit(satArr, entity.index, entity); //dragonlordslayer please find out how to get index of entity in satArr

        } else {
            latestEntity.label = undefined;
            latestEntity.polyline = undefined;
        }

    });

    return viewer;
}
function showInfo(entity) {
    if (entity) {
        let panel = document.getElementById("right-panel")
        let {name, id, objectType, period, inclination, eccentricity, meanMotion, semiMajorAxis} = entity
        panel.innerHTML = `
        <h1> Entity Information </h1>
        <div class="info" id = "name"> Name: ${name}</div>
        <div class="info" id = "norad-id"> NORAD ID: ${id}</div>
        <div class="info" id = "type"> Type: ${objectType}</div>
        <div class="info" id = "period"> Period: ${period} min</div>
        <div class="info" id = "inclination"> Inclination: ${inclination} deg</div>
        <div class="info" id = "eccentricity"> Eccenctricity: ${eccentricity}</div>
        <div class="info" id = "mean-motion"> Mean Motion: ${meanMotion} rad/min</div>
        <div class="info" id = "semi-major-axis"> Semi-Major Axis: ${semiMajorAxis} m</div>`
        panel.style.display="block";
    }
    else {
        document.getElementById("right-panel").style.display="none";
    }
}
/*function loadTimeline(timeline) {
    timeline.zoomTo(startTime, endTime)
    return timeline;
}*/

function loadPolyLines() {
    const polylines = new Cesium.PolylineCollection({ show: true });
    return polylines;
}

function addToViewer(satrec, viewer, orbArr, i) {
    let positionsOverTime = new Cesium.SampledPositionProperty();
    let satelliteEntity = {};

    for (let i = -totalSeconds; i < totalSeconds; i += timestepInSeconds) {
        const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
        const jsDate = Cesium.JulianDate.toDate(time);

        const positionAndVelocity = satellite.propagate(satrec, jsDate);
        if (Array.isArray(positionAndVelocity)) {
            break;
        }
        satelliteEntity.velocity = positionAndVelocity.velocity;
        const gmst = satellite.gstime(jsDate);
        // console.log(positionAndVelocity.position);
        const p = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

        const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
        positionsOverTime.addSample(time, position);
    }
    entityArr.push(positionsOverTime)

    let orbObj = orbArr[i];

    satelliteEntity.position = positionsOverTime;
    if (orbObj.OBJECT_TYPE == 'DEBRIS') {
        satelliteEntity.point = { pixelSize: 2, color: Cesium.Color.RED };
    } else if (orbObj.OBJECT_TYPE == 'PAYLOAD') {
        satelliteEntity.point = { pixelSize: 2, color: Cesium.Color.PURPLE };
    } else {
        satelliteEntity.point = { pixelSize: 2, color: Cesium.Color.WHITE };
    }
    satelliteEntity.name = orbObj.OBJECT_NAME;
    satelliteEntity.index = i;
    satelliteEntity.id = orbObj.NORAD_CAT_ID;
    satelliteEntity.period = orbObj.PERIOD;
    satelliteEntity.inclination = orbObj.INCLIINATION;
    satelliteEntity.eccentricity = orbObj.ECCENTRICITY;
    satelliteEntity.meanMotion = orbObj.MEAN_MOTION;
    satelliteEntity.semiMajorAxis = orbObj.SEMIMAJOR_AXIS;

    const satellitePoint = viewer.entities.add(satelliteEntity);
    return satellitePoint;
}

function drawOrbit(satArr, index, entity) {
    let meanMotion = satArr[index]['mo'];
    let period = 60 * 2 * Math.PI / meanMotion;
    let positionArrSampled = [];
    let positionArr = [];

    for (let i = 0; i < period * 1000; i += 600) {
        const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
        const jsDate = Cesium.JulianDate.toDate(time);
        let positionsOverTime = satellite.propagate(satArr[index], jsDate);

        positionArrSampled.push(positionsOverTime.position)

    }

    for (let i = 0; i < positionArrSampled.length; i++) {
        console.log(positionArrSampled[i]);
        let cart = new Cesium.Cartesian3(positionArrSampled[i]['x'] * 1000, positionArrSampled[i]['y'] * 1000, positionArrSampled[i]['z'] * 1000)
        positionArr.push(cart);
    }

    console.log(positionArr);

    return entity.polyline = {
        positions: positionArr,
        width: 1,
        material: Cesium.Color.RED,
    }
}

async function propogate() {
    const { satArr, orbArr } = await getData();

    viewer = await loadViewer(satArr);

    let polylines = loadPolyLines();

    console.log("lolol")
    //let timeline = await loadTimeline(viewer.timeline);

    for (let i = 0; i < satArr.length; i++) {
        addToViewer(satArr[i], viewer, orbArr, i);
    }

    return true;
}

function addYourOrbit(yourTle){
    const yourSat = satellite.twoline2satrec(yourTle.split('\n')[0].trim(), yourTle.split('\n')[1].trim());
    let satelliteEntity = {};
    let positionsOverTime = new Cesium.SampledPositionProperty();
    for (let i = -totalSeconds; i < totalSeconds; i += timestepInSeconds) {
        const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
        const jsDate = Cesium.JulianDate.toDate(time);

        const positionAndVelocity = satellite.propagate(yourSat, jsDate);
        if (Array.isArray(positionAndVelocity)) {
            break;
        }
        satelliteEntity.velocity = positionAndVelocity.velocity;
        const gmst = satellite.gstime(jsDate);
        // console.log(positionAndVelocity.position);
        const p = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

        const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
        positionsOverTime.addSample(time, position);
    }

    satelliteEntity.position = positionsOverTime;
    
    satelliteEntity.point = { pixelSize: 50, color: Cesium.Color.SALMON };
    const satellitePoint = viewer.entities.add(satelliteEntity);
    console.log(satellitePoint)

    viewer.trackedEntity = satelliteEntity
    console.log("run till here")
}

function showCone(lat, long) {
    let entArr = viewer.entities.values;
    //console.log(entArr.length);
    for (var i = 0; i < entArr.length - 1; i++) {
        console.log(i)
        if (i != 10818 && i != 16524 && i != 16984 && i != 17403 && i != 17917 && i != 17925 && i != 18689 && i != 18827 && i != 18852 && i != 18986 && i != 18992 && i != 19191 && i != 19203 && i != 19205 && i != 19271 && i != 19577 && i != 19593 && i != 19634 && i != 19769 && i != 21188) {
            if (!isInCone(lat, long, entArr[i])) {
                entArr[i].show = false
            } else {
                entArr[i].point.pixelSize = 15
            }
        }
    }
}

let date = Cesium.JulianDate.fromDate(new Date());


function isInCone(latS, longS, entity) {


    var ellipsoid = viewer.scene.globe.ellipsoid;
    let coord = entity.position.getValue(date)

    var cartographic = ellipsoid.cartesianToCartographic(coord);
    let lat = cartographic.latitude
    let long = cartographic.longitude
    let height = cartographic.height //m

    let maxDistance = height / 3 // radius , m
    let pointSelected = Cesium.Cartesian3.fromRadians(longS, latS, 1000 + height)

    var cartographicSelected = ellipsoid.cartesianToCartographic(pointSelected)

    let distancebw = getDistanceTwoCartesian(cartographic, cartographicSelected, 6378 + height / 1000) //km

    if (distancebw > (maxDistance / 1000)) {
        console.log("nope" + "bc distance bw is " + distancebw + " and max is " + (maxDistance / 1000))
        return false;
    } else {
        console.log("yes")
        return true;
    }
}

function getDistanceTwoCartesian(one, two, radius) {

    var oneLong = one.longitude
    var oneLat = one.latitude
    var twoLong = two.longitude
    var twoLat = two.latitude

    console.log("oneLong: " + oneLong + "oneLat: " + oneLat + "twoLong: " + twoLong + "twoLat: " + twoLat + "radius: " + radius)
    var sinLat1 = Math.sin(oneLat)
    var sinLat2 = Math.sin(twoLat)

    var cosLat1 = Math.cos(oneLat)
    var costLat2 = Math.cos(twoLat)

    var changeLongAbs = Math.abs(oneLong - twoLong)

    var cosAbs = Math.cos(changeLongAbs)
    var firstHalf = sinLat1 * sinLat2

    var secondHalf = cosLat1 * costLat2 * cosAbs

    var degrees = Math.acos(firstHalf + secondHalf)

    console.log("degrees: " + degrees)
    var distance = degrees * radius

    return distance
}

function submit(){
    if (selectedEntity != null){
        localStorage["entity"] = selectedEntity
    }
    location.href = "../part3.1/part3.html"
}
