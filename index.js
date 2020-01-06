
mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjajd3MGlodXIwZ3piMnhudmlzazVnNm44In0.BL29_7QRvcnOrVuXX_hD9A';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    zoom: 11.7,
    center: [-83.060303, 42.348495]
});

let baseUrl = "https://apis.detroitmi.gov/crowdsource/yahoo/wifi/locations/";
//================ geocoder for address search====================//
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    // limit results to North America
    countries: 'us',
    marker: {
        color: 'orange'
    },
    // further limit results to the geographic bounds representing the region of
    // Detroit Michigan
    bbox: [-83.3437, 42.2102, -82.8754, 42.5197],
    // apply a client side filter to further limit results to those strictly within
    // the detroit michigan region
    filter: function (item) {
        // returns true if item contains the detroit michigan region
        return item.context.map(function (i) {
            // this code attempts to find the `region` named `Detroit Michigan`
            return (i.id.split('.').shift() === 'region' && i.text === 'Michigan');
        }).reduce(function (acc, cur) {
            return acc || cur;
        });
    },
    mapboxgl: mapboxgl,
});
// Add zoom and rotation controls to the map.

 map.addControl(geocoder);
map.addControl(new mapboxgl.NavigationControl());

// document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
//================ geocoder for address search ends====================//
const geoJson = {
    type: "FeatureCollection",
    features: [],
};

    function toggle(){
        geocoderV.disabled = true;
    }

function hide() {
    let markers = document.getElementsByClassName("mapboxgl-marker");
    for (let i = 0; i < markers.length; i++) {
        markers[i].style.visibility = "hidden";
    }
    return
}

function show() {
    let markers = document.getElementsByClassName("mapboxgl-marker");
    for (let i = 0; i < markers.length; i++) {
        markers[i].style.visibility = "visible";
    }
    return
}
var data, i;

//data to onLoad
map.on('load', function () {
    map.addSource('places', {
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
   
 spinner.removeAttribute('hidden');
    const url = baseUrl + '42.3314,-83.0458';
    fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        redirect: 'follow', // manual, *follow, error
    }).then(resp => resp.json())
        // Transform the data into json
        .then((data) => {

             spinner.setAttribute("hidden", "");
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                // .setText(data[i].name);
                // create DOM element for the marker
                var el = document.createElement('div');
                el.id = 'marker';

                // create the marker

                var MarkerResults = new mapboxgl.Marker()
                    .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
                    .addTo(map);

                // if(markerResults >= 1){
                //     markerResults[1].remove()
                // }else{
                //     markerResults.remove();
                // }

            };
        });

    getGeocoderResults()

})// then data

// var geocoderMarkerResults,markerResults,pinMarkerResults;


map.on('click', (e) => {

    hide()

  // Add spinner function
    spinner.removeAttribute('hidden');
    // map.flyTo({ center: e.features[0].geometry.coordinates });
    //base url
    const url = baseUrl + [e.lngLat.lat, e.lngLat.lng];
    // map.flyTo({ center: e.features[0].geometry.coordinates });
    //fetch to get api from html
    fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        redirect: 'follow', // manual, *follow, error
    })
        .then(resp => resp.json())
        // Transform the data into json
        .then((data) => {

             data = data;
             i=i;
            spinner.setAttribute("hidden", "");
            console.log(data)
            const geoJson = getGeoJson;
            for (let i = 0; i < data.length; i++) {
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
                        "imageUrl": data[i].image_url,
                        "city": data[i].location.city,
                        "postalCode": data[i].location.zip_code,
                    },
                    "layout": {
                        "icon-image": "{icon}-15",
                        "icon-allow-overlap": true
                    }
                });
                console.log(data[i]);
                var el = document.createElement('div');
                el.id = 'marker';
                // create the marker
                var MarkerResults = new mapboxgl.Marker()
                    .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
                    .addTo(map);

                // document.getElementById('geojson').innerHTML = JSON.stringify(geoJSON, null, 2);
            }
        })
    // create DOM element for the marker
    var el = document.createElement('div');
    el.id = 'marker';
//Add a marker to show where you clicked.
    // create the marker
     var marker = new mapboxgl.Marker(el)
        .setLngLat(e.lngLat)
        .addTo(map);

});

let getGeoJson = {
    type: "FeatureCollection",
    features: [],
}
const checkStatus = response => {
    if (response.ok) {
        return response;
        console.log("response" + response)
    } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
        console.log("error" + error)
    }
}
const spinner = document.getElementById("spinner");

function showSpinner() {
    spinner.className = "show";
    setTimeout(() => {
        spinner.className = spinner.className.replace("show", "");
    }, 5000);
}
function getGeocoderResults() {

    geocoder.on('result', function (ev) {
        hide();
        spinner.removeAttribute('hidden');
       
        map.getSource('places').setData(ev.result.geometry);
        built_address = ev.result.place_name
        console.log("coordinates ", ev.result.geometry.coordinates[0])
        // Api for data
        const url = baseUrl + [ev.result.geometry.coordinates[1], ev.result.geometry.coordinates[0]];
        fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            redirect: 'follow', // manual, *follow, error
        })
            .then(checkStatus)
            .then(resp => resp.json())
            // Transform the data into json
            .then((data) => {
              
                data=data;i=i;
                spinner.setAttribute("hidden", "");
                console.log(data)
                const geoJson = getGeoJson;
                for (let i = 0; i < data.length; i++) {
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
                            "imageUrl": data[i].image_url,
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
                    // create DOM element for the marker
                    var el = document.createElement('div');
                    el.id = 'geoMaker';
                    // create the marker
                    var MarkerResults = new mapboxgl.Marker()
                        .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
                        .addTo(map);

                    // document.getElementById('geojson').innerHTML = JSON.stringify(geoJSON, null, 2);
                }
            })

    });
}
// function getUserLocation() {
//     // request to allow user position
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//         function showPosition(position) {
//
//             // get user current coordinates and center map on coordiates
//             console.log('L2', position)
//
//             //console.log(position.coords.latitude, position.coords.latitude)
//             user_coordinates = {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude
//             };
//             // draw user location on mao
//             map.getSource('places').setData({type: "Point", coordinates: [user_coordinates.lng,user_coordinates.lat]});
//
//             getGeocoderResults()
//             // geocoder.query(user_coordinates.lat, user_coordinates.lng)
//
//             // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
//
//             // makes a selection and add a symbol that matches the result.
//
//         }
//     } else {
//         // if device doesnt support location
//         console.log('device doesnt support location')
//     }
// }; /* END getUserLocation(); */
