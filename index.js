
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
    zoom: 12,
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
//  var geocoderV = document.getElementById('geocoder');
//  geocoderV.appendChild(geocoder.onAdd(map));
 map.addControl(geocoder);
map.addControl(new mapboxgl.NavigationControl());


// document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
//================ geocoder for address search ends====================//
const geoJson = {
    type: "FeatureCollection",
    features: [],
};

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

let layer = {
    "id": "places",
    "source": "places",
    "type": "circle",
    "paint": {
        "circle-radius": 10,
        "circle-color": "#007cbf"
    }
   
}
var data;
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
          this.parentNode.removeChild(this);
      }
    };
  }
  function flyToStore(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    });
  }
  
  function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */
    if (popUps[0]) popUps[0].remove();
  
    var popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML('<h3>Sweetgreen</h3>' +
        '<h4>' + currentFeature.properties.address + '</h4>')
      .addTo(map);
  }
//data to onLoad
map.on('load', function (data) {
    console.log(data)
    map.addSource('places', {
        "type": 'geojson',
        "data": geoJson
    });
    map.addLayer(layer);
    loader.removeAttribute('hidden');
    const url = baseUrl + '42.3314,-83.0458';
    fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        redirect: 'follow', // manual, *follow, error
    }).then(resp => resp.json())
        // Transform the data into json
        .then((data) => {
           
            loader.setAttribute("hidden", "");
            console.log(data)
            ;
            const geoJson = getGeoJson;
            var mainContainer = document.getElementById("listings");
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
                                  console.log(data[i].id)
                                  var div = document.createElement("div");
                                  div.innerHTML = 'Name: ' + data[i].name + '</br> phone:' +''+ data[i].phone + '</br>Address:'+''+ data[i].location.address1,data[i].location.city;
                                  mainContainer.appendChild(div);
                                    // document.getElementById("listings").innerHTML = 'Name: ' + data[i].id + ' ' + data[i].is_closed;
                                  
                // .setText(data[i].name);
              
                // create the marker
              
                var popup = new mapboxgl.Popup()
                .setHTML('<h3>' + data[i].name + '</h3>');
            
              // create a HTML element for each feature
              var el = document.createElement('div');
              el.id = 'marker';
            
              // make a marker for each feature and add to the map
              const myMarker = new mapboxgl.Marker({
                    offset: [0, -25]
                })
                .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
                .setPopup(popup)
                .addTo(map);
             console.log(myMarker)
              const markerDiv = myMarker.getElement();
              var mainContainer = document.getElementById("listings");
            markerDiv.addEventListener('click', function(e){
                openNav()
              console.log(e)
                    var clickedListing = e.features[this.dataPosition];
                    // flyToStore(clickedListing);
                    // createPopUp(clickedListing);
                  
                    var activeItem = document.getElementsByClassName('active');
                    if (activeItem[0]) {
                      activeItem[0].classList.remove('active');
                    }
                    this.parentNode.classList.add('active');
                    var features = map.queryRenderedFeatures(e.point, {
                        layers: ['places']
                      });
                      
                      /* If yes, then: */
                      if (features.length) {
                        var clickedPoint = features[0];
                        
                        /* Fly to the point */
                        flyToStore(clickedPoint);
                        
                        /* Close all other popups and display popup for clicked store */
                        createPopUp(clickedPoint);
                        
                        /* Highlight listing in sidebar (and remove highlight for all other listings) */
                        var activeItem = document.getElementsByClassName('active');
                        if (activeItem[0]) {
                          activeItem[0].classList.remove('active');
                        }
                        var listing = document.getElementById('listing-' + clickedPoint.properties.id);
                        listing.classList.add('active');
                      }
                
            })
              markerDiv.addEventListener('mouseenter', () => myMarker.togglePopup());
              markerDiv.addEventListener('mouseleave', () => myMarker.togglePopup());
            //   document.getElementById('listings').innerHTML = JSON.stringify(data[i].length, null, 2);
            };
            
        }) 
        getGeocoderResults()
        
})



// map.on('click', (e, data, i ) => {
//    console.log(data)
//     hide()
//     console.log(e);
//   // Add spinner function
//     loader.removeAttribute('hidden');
//     // map.flyTo({ center: e.features[0].geometry.coordinates });
//     //base url
//     const url = baseUrl + [e.lngLat.lat, e.lngLat.lng];
//     // map.flyTo({ center: e.features[0].geometry.coordinates });
//     //fetch to get api from html
//     fetch(url, {
//         method: 'GET', // *GET, POST, PUT, DELETE, etc.
//         mode: 'cors', // no-cors, *cors, same-origin
//         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//         redirect: 'follow', // manual, *follow, error
//     })
//         .then(resp => resp.json())
//         // Transform the data into json
        
//         .then((data) => {
//             loader.setAttribute("hidden", "");
//             const geoJson = getGeoJson;
            
//             for ( i = 0; i < data.length; i++) {
//                 console.log(data.length)
//                 getGeoJson.features.push({
//                     "type": "Feature",
//                     "geometry": {
//                         "type": "Point",
//                         "coordinates": [data[i].coordinates.longitude, data[i].coordinates.latitude]
//                     },
//                     "properties": {
//                         "id": data[i].id,
//                         "stationName": data[i].alias,
//                         "isClosed": data[i].is_closed,
//                         "imageUrl": data[i].image_url,
//                         "city": data[i].location.city,
//                         "postalCode": data[i].location.zip_code,
//                     },
//                     "layout": {
//                         "icon-image": "{icon}-15",
//                         "icon-allow-overlap": true
//                     }
//                 });
//                 var popup = new mapboxgl.Popup()
//                            .setHTML('<h3>'+ data[i].alias+'</h3>');
                         
//                 var el = document.createElement('div');
//                 el.id = 'marker';
//                 // create the marker
//                 const myMarker = new mapboxgl.Marker({
//                     offset: [0, -25]
//                 })
//                 .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
//                 .setPopup(popup)
//                 .addTo(map);
//                     const markerDiv = myMarker.getElement();  
//                     markerDiv.addEventListener('mouseenter', () => myMarker.togglePopup());
//                     markerDiv.addEventListener('mouseleave', () => myMarker.togglePopup());
                   
//                 // document.getElementById('geojson').innerHTML = JSON.stringify(geoJSON, null, 2);
//             }
//         })
        
        
//     // create DOM element for the marker
//     var el = document.createElement('div');
//     el.id = 'marker';
// //Add a marker to show where you clicked.
//     // create the marker
//      var MarkerResults = new mapboxgl.Marker(el)
//         .setLngLat(e.lngLat)
//         .addTo(map);     
// });
// var former = console.log;
// console.log = function(msg){
//     former(msg);
//     document.getElementById('mylog').append("<div>" + msg + "</div>");//maintains existing logging via the console.
// }

// window.onerror = function(message, url, linenumber) {
//     console.log("JavaScript error: " + message + " on line " +
//         linenumber + " for " + url);
// }

let getGeoJson = {
    type: "FeatureCollection",
    features: [],
}
//------- create the loader -------
const loader = document.getElementById("initial-loader-overlay");
// Assign the classname active and time out
function showSpinner() {
    loader.className = "active";
    setTimeout(() => {
        loader.className = loader.className.replace("active", "");
    }, 5000);
}
//=-------- Loader end-----------------

//----------geocoder results on search -------------------
function getGeocoderResults() {

    geocoder.on('result', function (ev) {
        hide();
        loader.removeAttribute('hidden');
       
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
            // .then(checkStatus)
            .then(resp => resp.json())
            // Transform the data into json
            .then((data) => {
                loader.setAttribute("hidden", "");
                console.log(data.error)
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
                    var popup = new mapboxgl.Popup()
                    .setHTML('<h3>'+ data[i].alias+'</h3>');
                  
         var el = document.createElement('div');
         el.id = 'marker';
         // create the marker
         const myMarker = new mapboxgl.Marker({
             offset: [0, -25]
         })
         .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
         .setPopup(popup)
         .addTo(map);
             const markerDiv = myMarker.getElement();  
             markerDiv.addEventListener('mouseenter', () => myMarker.togglePopup());
             markerDiv.addEventListener('mouseleave', () => myMarker.togglePopup());
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
