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
    // bbox: [-83.3437, 42.2102, -82.8754, 42.5197],
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

const geoJson = {
    type: "FeatureCollection",
    features: [],
};
map.on('load', function(){
    map.addSource('places',{
        "type": 'geojson',
        "data": geoJson
    });
    map.addLayer({
        "id": "places",
        "source": "places",
        "type": "circle",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#007cbf"
        }
    });
    let getGeoJson ={
        type: "FeatureCollection",
        features: [],
    }
    const url = 'https://apis.detroitmi.gov/crowdsource/yahoo/wifi/locations/ ';
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
            const geoJson = getGeoJson;

            for (let i = 0; i < data.length; i++) {
                var popup = new mapboxgl.Popup({ offset: 25 })
                    .setText(data[i].name);
// create DOM element for the marker
                var el = document.createElement('div');
                el.id = 'marker';
// create the marker
                var marker = new mapboxgl.Marker()
                    .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
                    .setPopup(popup)
                    .addTo(map);
                getGeoJson.features.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [data[i].coordinates.longitude, data[i].coordinates.latitude]
                    },
                    "properties": {
                        "id": data[i].id,
                        "stationName": data[i].alias,
                        "isClosed": data[i].is_closed,
                        "Address1": data[i].location.address1,
                        "city": data[i].location.city,
                        "postalCode": data[i].location.zip_code,
                    },
                    "layout": {
                        "icon-image": "{icon}-15",
                        "icon-allow-overlap": true
                    }
                });
                console.log(data[i]);
            }

        })
})// then data

//================ geocoder for address search ends====================//
//=================yelp for wifi search ============================//
// Create a popup, but don't add it to the map yet.

// create the popup
