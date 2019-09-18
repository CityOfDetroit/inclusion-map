// import {yelp} from './components/yelp.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjajd3MGlodXIwZ3piMnhudmlzazVnNm44In0.BL29_7QRvcnOrVuXX_hD9A';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    zoom: 10.7,
    center: [-83.060303, 42.348495]
});
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

var url = 'https://api.yelp.com/v3/businesses/search?text=coffee&latitude=37.786882&longitude=-122.399972';
fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        'Authorization': 'Bearer MIzyyL2O3CO86GTDo9ISK3LZWujAXdzDWKluJx96oAAJtEQg05zxVlM74TSnMi472hZJJkTp40DF8a59ALGftK8wUnJbobbW4eTNBQZu2O8fwo2-x966_plTV3SCXXYx'
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer' // no-referrer, *client

})
    .then(resp => resp.json())
    console.log(resp)
    // Transform the data into json
    .then((data) => {
        console.log(data);

    }) // then data
// var data = null;
// var xhr = new XMLHttpRequest();
// xhr.open("GET", "https://api.yelp.com/v3/businesses/search?text=coffee&latitude=37.786882&longitude=-122.399972");
// xhr.setRequestHeader("Authorization", "Bearer MIzyyL2O3CO86GTDo9ISK3LZWujAXdzDWKluJx96oAAJtEQg05zxVlM74TSnMi472hZJJkTp40DF8a59ALGftK8wUnJbobbW4eTNBQZu2O8fwo2-x966_plTV3SCXXYx");
// xhr.addEventListener("readystatechange", function () {
//     if (this.readyState === 4) {
//         data = JSON.parse(this.responseText);
//         console.log(data);
//     }
// });
// xhr.send(data);
// const yelp = require('yelp-fusion');
//
// // Place holder for Yelp Fusion's API Key. Grab them
// // from https://www.yelp.com/developers/v3/manage_app
// const apiKey = 'MIzyyL2O3CO86GTDo9ISK3LZWujAXdzDWKluJx96oAAJtEQg05zxVlM74TSnMi472hZJJkTp40DF8a59ALGftK8wUnJbobbW4eTNBQZu2O8fwo2-x966_plTV3SCXXYx';
//
// const searchRequest = {
//     term:'Four Barrel Coffee',
//     location: 'san francisco, ca'
// };
//
// const client = yelp.client(apiKey);
//
// client.search(searchRequest).then(response => {
//     const firstResult = response.jsonBody.businesses[0];
//     const prettyJson = JSON.stringify(firstResult, null, 4);
//     console.log(prettyJson);
// }).catch(e => {
//     console.log(e);
// });