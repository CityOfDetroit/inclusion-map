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
// Add API data to populate the map