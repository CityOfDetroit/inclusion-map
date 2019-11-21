
mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjajd3MGlodXIwZ3piMnhudmlzazVnNm44In0.BL29_7QRvcnOrVuXX_hD9A';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    zoom: 11.7,
    center: [-83.060303, 42.348495]
});
 
let baseUrl = "https://apis.detroitmi.gov/crowdsource/yahoo/wifi/locations/";
//================ geocoder for address search====================//
let geocoder = new MapboxGeocoder({
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
    filter: function(item) {
        // returns true if item contains the detroit michigan region
        return item.context.map(function (i) {
            // this code attempts to find the `region` named `Detroit Michigan`
            return (i.id.split('.').shift() === 'region' && i.text === 'Michigan');
        }).reduce(function(acc, cur) {
            return acc || cur;
        });
    },
  
    mapboxgl: mapboxgl,
   
});
// Add zoom and rotation controls to the map.
map.addControl(geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
    }));
map.addControl(new mapboxgl.NavigationControl());

// document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
//================ geocoder for address search ends====================//
const geoJson = {
    type: "FeatureCollection",
    features: [],
};
//data to onLoad
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

    const url =  baseUrl + '42.3314,-83.0458';
    fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        redirect: 'follow', // manual, *follow, error
    }) .then(resp => resp.json())
    // Transform the data into json
    .then((data) => {
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            var popup = new mapboxgl.Popup()
                .setHTML(
                    '<div class="card mb-3">' +
                    '  <div class="row no-gutters">' +
                    '    <div class="col-md-4">' +
                    '<img class="card-img" src="' + data[i].image_url + '"/>' +
                    '    </div>' +
                    '    <div class="col-md-8">' +
                    '      <div class="card-body">' +
                    '        <h6 class="card-title">'+data[i].name+'</h6>' +
                    '<p class="place_address">'
                    +'<a href="">'
                    +data[i].location.address1 +','+ data[i].location.city+','
                    + data[i].location.state+',' + data[i].location.zip_code +
                    '</a>'+
                    '</p>' +
                    '<div class="rating" data-rating="'+ data[i].rating+'"><div class="star"></div> <div class="star"></div> <div class="star"></div> <div class="star"></div> <div class="star"></div> </div>'+
                    '      </div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'
                );
            //console.log(data[i].rating);
                // .setText(data[i].name);
// create DOM element for the marker
            var el = document.createElement('div');
            el.id = 'marker';
// create the marker
            var marker = new mapboxgl.Marker()
                .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
                .setPopup(popup)
                .addTo(map);
    };
});
     getUserLocation()
     getGeocoderResults()
    
})// then data
let getGeoJson ={
    type: "FeatureCollection",
    features: [],
}
const checkStatus = response =>{
    if(response.ok){
        return response;
    } else{
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}
function getGeocoderResults(){

    geocoder.on('result', function(ev) {
        map.setZoom(13);
        map.getSource('places').setData(ev.result.geometry);
       
        console.log('ev',ev)
        built_address = ev.result.place_name
        console.log("coordinates ", ev.result.geometry.coordinates[0])
        // Api for data 
        const url =  baseUrl+ [ev.result.geometry.coordinates[1],ev.result.geometry.coordinates[0]];
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
                            "imageUrl" : data[i].image_url,
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
                    el.id = 'marker';
// create the marker
                    var marker = new mapboxgl.Marker()
                        .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
                        .setPopup(popup)
                        .addTo(map);
                    // document.getElementById('geojson').innerHTML = JSON.stringify(geoJSON, null, 2);
                    var popup = new mapboxgl.Popup()
                        .setHTML(
                            '<div class="card mb-3">' +
                            '  <div class="row no-gutters">' +
                            '    <div class="col-md-4">' +
                            '<img class="card-img" src="' + data[i].image_url + '"/>' +
                            '    </div>' +
                            '    <div class="col-md-8">' +
                            '      <div class="card-body">' +
                            '        <h6 class="card-title">'+data[i].name+'</h6>' +
                            '<p class="place_address">'
                            +'<a href="">'
                            +data[i].location.address1 +','+ data[i].location.city+','
                            + data[i].location.state+',' + data[i].location.zip_code +
                            '</a>'+
                            '</p>' +
                            '<div class="rating" data-rating="'+ data[i].rating+'"><div class="star"></div> <div class="star"></div> <div class="star"></div> <div class="star"></div> <div class="star"></div> </div>'+
                            '      </div>' +
                            '    </div>' +
                            '  </div>' +
                            '</div>'
                        );

                }
            })

    });
}
function getUserLocation() {
    // request to allow user position 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        function showPosition(position) {

            // get user current coordinates and center map on coordiates
            console.log('L2', position)
            
            //console.log(position.coords.latitude, position.coords.latitude)
            user_coordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            // draw user location on mao
            map.getSource('places').setData({type: "Point", coordinates: [user_coordinates.lng,user_coordinates.lat]});

            getGeocoderResults()
            // geocoder.query(user_coordinates.lat, user_coordinates.lng)

            // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
            
            // makes a selection and add a symbol that matches the result.
           
        }
    } else {
        // if device doesnt support location
        console.log('device doesnt support location')
    }
}; /* END getUserLocation(); */
