// import {yelp} from './components/yelp.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjajd3MGlodXIwZ3piMnhudmlzazVnNm44In0.BL29_7QRvcnOrVuXX_hD9A';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    zoom: 10.7,
    center: [-83.060303, 42.348495]
});
//============================================================================
// var size = 100;

// var pulsingDot = {
//     width: size,
//     height: size,
//     data: new Uint8Array(size * size * 4),
//
//     onAdd: function() {
//         var canvas = document.createElement('canvas');
//         canvas.width = this.width;
//         canvas.height = this.height;
//         this.context = canvas.getContext('2d');
//     },
//
//     render: function() {
//         var duration = 1000;
//         var t = (performance.now() % duration) / duration;
//
//         var radius = size / 2 * 0.3;
//         var outerRadius = size / 2 * 0.7 * t + radius;
//         var context = this.context;
//
// // draw outer circle
//         context.clearRect(0, 0, this.width, this.height);
//         context.beginPath();
//         context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
//         context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
//         context.fill();
//
// // draw inner circle
//         context.beginPath();
//         context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
//         context.fillStyle = 'rgba(255, 100, 100, 1)';
//         context.strokeStyle = 'white';
//         context.lineWidth = 2 + 4 * (1 - t);
//         context.fill();
//         context.stroke();
//
// // update this image's data with data from the canvas
//         this.data = context.getImageData(0, 0, this.width, this.height).data;
//
// // keep the map repainting
//         map.triggerRepaint();
//
// // return `true` to let the map know that the image was updated
//         return true;
//     }
// };
//==========================================================


//================ geocoder for address search====================//
let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    // limit results to North America
    countries: 'us',
    // further limit results to the geographic bounds representing the region of
    // Detroit Michigan
    bbox: [-83.3437, 42.2102, -82.8754, 42.5197],
    // apply a client side filter to further limit results to those strictly within
    // the detroit michigan region
    filter: function(item) {
        // returns true if item contains the detroit michigan region
        return item.context.map(function (i) {
            // this code attempts to find the `region` named `Detroit Michigan`
            return (i.id.split('.').shift() === 'region' && i.text === 'Michigan');
        }).reduce(function(acc, cur) {
            return acc || cur;
        });
    },
    mapboxgl: mapboxgl
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
//================ geocoder for address search ends====================//
//=================yelp for wifi search ============================//

const url = 'https://apis.detroitmi.gov/crowdsource/yahoo/wifi/locations/';
fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    redirect: 'follow', // manual, *follow, error
})
    .then(resp => resp.json())
    // Transform the data into json
    .then((data) => {
        console.log(data)
        var geoJsonData = {
            type: "FeatureCollection",
            features: [],
        };
        for (let i = 0; i < data.length; i++) {
            geoJsonData.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [data[i].coordinates.longitude, data[i].coordinates.latitude]
                },
                "properties": {
                    "id": data[i].id,
                    "stationName": data[i].alias,
                    "isClosed": data[i].is_closed,
                    "station": data[i].stationName,
                    "Address1": data[i].location.address1,
                    "city": data[i].location.city,
                    "postalCode": data[i].location.zip_code,
                }
            });
        }
        map.on('load', function(){
            map.addSource('Places',{
                "type": 'geojson',
                "data": geoJsonData
            });

            map.addLayer({
                "id": "Places",
                "type": "circle",
                "source": 'Places',
                "paint": {
                    "circle-radius": 10,
                    "circle-color": "#007cbf"
                }
            });

        })// then data

        console.log(data[0].is_closed);
         document.getElementById('geojson').innerHTML = JSON.stringify(geoJsonData, null, 2);
    })