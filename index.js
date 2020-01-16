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

var allsidebarids = [];
// document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
//================ geocoder for address search ends====================//
function highlightItem(id){
  let elem = document.getElementById(id);
  elem.classList.add("highlightItem");
  for(var i=0; i < allsidebarids.length; i++){
    if(allsidebarids[i] !== id ){
      let elems = document.getElementById(allsidebarids[i]);
      elems.classList.remove("highlightItem");
    }

  }
}
var size = 200;
var pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
     
    // get rendering context for the map canvas when layer is added to the map
    onAdd: function() {
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d');
    },
     
    // called once before every frame where the icon will be used
    render: function() {
    var duration = 1000;
    var t = (performance.now() % duration) / duration;
     
    var radius = (size / 2) * 0.3;
    var outerRadius = (size / 2) * 0.7 * t + radius;
    var context = this.context;
     
    // draw outer circle
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(
    this.width / 2,
    this.height / 2,
    outerRadius,
    0,
    Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
    context.fill();
     
    // draw inner circle
    context.beginPath();
    context.arc(
    this.width / 2,
    this.height / 2,
    radius,
    0,
    Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 100, 100, 1)';
    context.strokeStyle = 'white';
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();
     
    // update this image's data with data from the canvas
    this.data = context.getImageData(
    0,
    0,
    this.width,
    this.height
    ).data;
     
    // continuously repaint the map, resulting in the smooth animation of the dot
    map.triggerRepaint();
     
    // return `true` to let the map know that the image was updated
    return true;
    }
    };
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
var k = 0;
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
          this.parentNode.removeChild(this);
      }
    };
  }
 
//data to onLoad
map.on('load', function (data) {
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
    // console.log(data)
    allsidebarids = []
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
            // console.log("data", data)
            ;
            const geoJson = getGeoJson;
            var mainContainer = document.getElementById("listings");
            for (let i = 0; i < data.length; i++, k++) {
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
                                        'layout': {
                                            'icon-image': 'pulsing-dot'
                                        }
                                    });
                                //   console.log(data[i].id)
                                  allsidebarids.push(data[i].id);
                                  var div = document.createElement("div");
                                  div.id = data[i].id;
                                  div.innerHTML = '<p> Name:' + data[i].name + '</p><p> phone:' +' '+ data[i].phone + '</p><p>Address:'+' '+ data[i].location.address1+' '+data[i].location.city+'</p>';
                                  mainContainer.appendChild(div);
                                    // document.getElementById("listings").innerHTML = 'Name: ' + data[i].id + ' ' + data[i].is_closed;

                // .setText(data[i].name);

                // create the marker
                var popup = new mapboxgl.Popup()
                .setHTML('<h3>' + data[i].name + '</h3>');

              // create a HTML element for each feature
              var el = document.createElement('div');
              el.id = 'marker';

              var MarkerElement = document.createElement('h3');

              MarkerElement.onclick = () => {
                // console.log("ids" ,allsidebarids[i] );
                location.href = '#'+allsidebarids[i];
                highlightItem(allsidebarids[i]);
              }
              // make a marker for each feature and add to the map
              const myMarker = new mapboxgl.Marker({
                    element :MarkerElement ,
                    offset: [0, -25]
                })
                .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
                .setPopup(popup)
                .addTo(map);
            //  console.log(myMarker)
              const markerDiv = myMarker.getElement();
              var mainContainer = document.getElementById("listings");
            markerDiv.addEventListener('click', function(f,data){
                openNav()
                //console.log(e)
                f.stopPropagation();
            })
              markerDiv.addEventListener('mouseenter', () => myMarker.togglePopup());
              markerDiv.addEventListener('mouseleave', () => myMarker.togglePopup());
            //   document.getElementById('listings').innerHTML = JSON.stringify(data[i].length, null, 2);
            };

        })
        getGeocoderResults()

})
var m = 0;
map.on('click', (e, data, i ) => {
    closeNav()
//    console.log(data)
   k = k+m;
    hide()
    // console.log(e);
  // Add spinner function
    loader.removeAttribute('hidden');
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
            loader.setAttribute("hidden", "");
            const geoJson = getGeoJson;
            var mainContainer = document.getElementById("listings");
            for (let i = 0; i < data.length; i++) {
            //   console.log("length" , k + " " + allsidebarids.length)
            //     console.log(data.length)
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
                    'layout': {
                        'icon-image': 'pulsing-dot'
                    }
                });
                allsidebarids.push(data[i].id);
                // console.log("data id", data[i].id)
                var div = document.createElement("div");
                div.id = data[i].id;
                div.innerHTML = '<p> Name:' + data[i].name + '</p><p> phone:' +' '+ data[i].phone + '</p><p>Address:'+' '+ data[i].location.address1+' '+data[i].location.city+'</p>';
                mainContainer.appendChild(div);
                var popup = new mapboxgl.Popup()
                           .setHTML('<h3>'+ data[i].name+'</h3>');

                var el = document.createElement('div');
                el.id = 'marker';

                var MarkerElement = document.createElement('h3');

                MarkerElement.onclick = () => {
                //   console.log("ids" ,allsidebarids[i+k] );
                  location.href = '#'+allsidebarids[i+k];
                  highlightItem(allsidebarids[i+k]);
                }
                // create the marker
                const myMarker = new mapboxgl.Marker({
                  element:MarkerElement ,
                    offset: [0, -25]
                })
                .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
                .setPopup(popup)
                .addTo(map);
                    const markerDiv = myMarker.getElement();

                markerDiv.addEventListener('click', function(f){
                    openNav()
                    f.stopPropagation();

                    // flyToStore(clickedListing);
                    // createPopUp(clickedListing)
                    /* If yes, then: */

                })
                    markerDiv.addEventListener('mouseenter', () => myMarker.togglePopup());
                    markerDiv.addEventListener('mouseleave', () => myMarker.togglePopup());

                // document.getElementById('geojson').innerHTML = JSON.stringify(geoJSON, null, 2);
            }
            m = data.length;
        })


    // create DOM element for the marker
    var el = document.createElement('div');
    el.id = 'marker';
//Add a marker to show where you clicked.
    // create the marker
     var MarkerResults = new mapboxgl.Marker(el)
        .setLngLat(e.lngLat)
        .addTo(map);
});
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
        k = k+m;
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
                var mainContainer = document.getElementById("listings");
                // console.log(data.error)
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
                    allsidebarids.push(data[i].id);
                // console.log("data id", data[i].id)
                var div = document.createElement("div");
                div.id = data[i].id;
                div.innerHTML = '<p> Name:' + data[i].name + '</p><p> phone:' +' '+ data[i].phone + '</p><p>Address:'+' '+ data[i].location.address1+' '+data[i].location.city+'</p>';
                mainContainer.appendChild(div);
                var popup = new mapboxgl.Popup()
                           .setHTML('<h3>'+ data[i].name+'</h3>');

                           var el = document.createElement('div');
                           el.id = 'marker';
           
                           var MarkerElement = document.createElement('h3');
           
                           MarkerElement.onclick = () => {
                            //  console.log("ids" ,allsidebarids[i+k] );
                             location.href = '#'+allsidebarids[i+k];
                             highlightItem(allsidebarids[i+k]);
                           }
         // create the marker
         const myMarker = new mapboxgl.Marker({
            element:MarkerElement ,
              offset: [0, -25]
          })
          .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
          .setPopup(popup)
          .addTo(map);
              const markerDiv = myMarker.getElement();

          markerDiv.addEventListener('click', function(f){
              openNav()
              f.stopPropagation();

              // flyToStore(clickedListing);
              // createPopUp(clickedListing)
              /* If yes, then: */

          })
              markerDiv.addEventListener('mouseenter', () => myMarker.togglePopup());
              markerDiv.addEventListener('mouseleave', () => myMarker.togglePopup());
                }
                m = data.length;
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