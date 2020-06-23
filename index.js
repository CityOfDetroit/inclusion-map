import Controller from './components/controller.class';
import './node_modules/mapbox-gl/dist/mapbox-gl.css';
import './node_modules/@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './sass/styles.scss';
(function start() {
  const controller = new Controller(document.querySelector('.content-section'));
  const delay = 500; // delay between calls
  let throttled = false; // are we currently throttled?

  controller.map.map.on('mousemove', function (e, parent = this) {
    let features = this.queryRenderedFeatures(e.point, {
      layers: ['wifi']
    });
    if (features.length) {
      controller.map.map.setFilter('wifi-hover', ['==', 'ID', features[0].properties.ID]);
    }else{
      controller.map.map.setFilter('wifi-hover', ['==', 'ID', ""]);
    }
    this.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });
  controller.map.map.on('click', function (e, parent = this) {
    let features = this.queryRenderedFeatures(e.point, {
      layers: ['wifi']
    });
    if (features.length) {
      console.log(features[0]);
      controller.map.map.setFilter('wifi-featured', ['==', 'ID', '']);
      controller.updatePanel(features[0], controller);
      document.querySelector('.data-panel').className = 'data-panel active';
    }else{
      controller.map.map.setFilter('wifi-featured', ['==', 'ID', '']);
      controller.panel.clearPanel();
    }
  });
  document.getElementById('close-panel-btn').addEventListener('click', function () {
    controller.panel.clearPanel();
    (document.querySelector('.data-panel.active') != null) ?  document.querySelector('.data-panel.active').className = 'data-panel' : 0;
  });
  document.getElementById('panel-btn').addEventListener('click', function () {
    controller.updatePanel(controller.wifiLocs);
    document.querySelector('.data-panel').className = 'data-panel active';
  });
  const startingBtns = document.querySelectorAll('#user-type-section button');
  startingBtns.forEach(function (btn) {
    btn.addEventListener('click', function (ev) {
      controller.initialForm(ev.target.attributes[2].nodeValue, controller);
    });
  });

  controller.map.geocoder.on('result', function (ev, parent = this) {
    controller.geoResults(ev,controller);
  });

  window.addEventListener('resize',()=>{
    if (!throttled) {
      // actual callback action
      controller.map.map.resize();
      // we're throttled!
      throttled = true;
      // set a timeout to un-throttle
      setTimeout(()=>{
        throttled = false;
      }, delay);
    }  
  })
})(window);

//================ geocoder for address search====================//
// const geocoder = new MapboxGeocoder({
//     accessToken: mapboxgl.accessToken,
//     zoom: 12,
//     // limit results to North America
//     countries: 'us',
//     marker: {
//         color: 'orange'
//     },
//     // further limit results to the geographic bounds representing the region of
//     // Detroit Michigan
//     bbox: [-83.3437, 42.2102, -82.8754, 42.5197],
//     // apply a client side filter to further limit results to those strictly within
//     // the detroit michigan region
//     filter: function (item) {
//         // returns true if item contains the detroit michigan region
//         return item.context.map(function (i) {
//             // this code attempts to find the `region` named `Detroit Michigan`
//             return (i.id.split('.').shift() === 'region' && i.text === 'Michigan');
//         }).reduce(function (acc, cur) {
//             return acc || cur;
//         });
//     },
//     mapboxgl: mapboxgl,
// });
// // Add zoom and rotation controls to the map.
// //  var geocoderV = document.getElementById('geocoder');
// //  geocoderV.appendChild(geocoder.onAdd(map));
// map.addControl(geocoder);
// map.addControl(new mapboxgl.NavigationControl());

// var allsidebarids = [];
// var getGeoJson =  {
//       type: "FeatureCollection",
//       features: [],
//   }

// var point = {
//       type: "Point",
//       coordinates: [],
//   }
// // document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
// //================ geocoder for address search ends====================//
// function highlightItem(id){
//   let elem = document.getElementById(id);
//   elem.classList.add("highlightItem");
//   for(var i=0; i < allsidebarids.length; i++){
//     if(allsidebarids[i] !== id ){
//       let elems = document.getElementById(allsidebarids[i]);
//       elems.classList.remove("highlightItem");
//     }

//   }
// }

// function createSidebar_Markers(data){
//   allsidebarids = [];
//   const geoJson = getGeoJson;
//   getGeoJson.features = [];
//   var mainContainer = document.getElementById("listings");
//   mainContainer.innerHTML = '';
//   for (let i = 0; i < data.length; i++) {
//       getGeoJson.features.push({
//                               "type": "Feature",
//                               "geometry": {
//                                   "type": "Point",
//                                   "coordinates": [data[i].coordinates.longitude, data[i].coordinates.latitude]
//                               },
//                               "properties": {
//                                   "id": data[i].id,
//                                   "name":data[i].name,
//                                   "stationName": data[i].alias,
//                                   "isClosed": data[i].is_closed,
//                                   "imageUrl": data[i].image_url,
//                                   "address" : data[i].location.address1,
//                                   "city": data[i].location.city,
//                                   "postalCode": data[i].location.zip_code,
//                               },
//                               "layout": {
//                                   "icon-image": "{icon}-15",
//                                   "icon-allow-overlap": true
//                               }
//                           });
//                         //console.log(data[i].id)
//                         allsidebarids.push(data[i].id);
//                         var div = document.createElement("div");
//                         div.id = data[i].id;
//                         div.onclick = () =>{
//                           flyToStore(getGeoJson.features[i]);
//                           createPopUp(getGeoJson.features[i]);
//                           highlightItem(allsidebarids[i]);
//                         }

//                         div.innerHTML = '<p>Name: </p>' + data[i].name + '</br><p> phone:</p>' +''+ data[i].phone + '</br><p>Address:</p>'+''+ data[i].location.address1,data[i].location.city;
//                         mainContainer.appendChild(div);
//       var popup = new mapboxgl.Popup()
//       .setHTML('<h3>' + data[i].name + '</h3>');

//     // create a HTML element for each feature
//     var el = document.createElement('div');
//     el.id = 'marker';

//     var MarkerElement = document.createElement('h3');
//     MarkerElement.id = "marker_"+data[i].id;
//     MarkerElement.onclick = () => {
//       //console.log("ids" ,allsidebarids[i] );
//       location.href = '#'+allsidebarids[i];
//       highlightItem(allsidebarids[i]);
//     }
//     // make a marker for each feature and add to the map
//     const myMarker = new mapboxgl.Marker({
//           element :MarkerElement
//       })
//       .setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude])
//       .setPopup(popup)
//       .addTo(map);
//    //console.log(myMarker)
//     const markerDiv = myMarker.getElement();
//     var mainContainer = document.getElementById("listings");
//     markerDiv.addEventListener('click', function(f,data){
//         openNav()
//         //console.log(e)
//         f.stopPropagation();
//     })
//     markerDiv.addEventListener('mouseenter', () => {
//       var popUps = document.getElementsByClassName('mapboxgl-popup');
//       /** Check if there is already a popup on the map and if so, remove it */
//       if (popUps[0]) popUps[0].remove();
//       myMarker.togglePopup()});
//     markerDiv.addEventListener('mouseleave', () => myMarker.togglePopup());
//   }

// }

// const geoJson = {
//     type: "FeatureCollection",
//     features: [],
// };

// function hide() {
//     let markers = document.getElementsByClassName('mapboxgl-marker mapboxgl-marker-anchor-center');
//     for (let i = 0; i < markers.length; i++) {
//         markers[i].style.visibility = "hidden";
//     }
//     return
// }

// function show() {
//     let markers = document.getElementsByClassName("mapboxgl-marker");
//     for (let i = 0; i < markers.length; i++) {
//         markers[i].style.visibility = "visible";
//     }
//     return
// }

// let layer = {
//     "id": "places",
//     "source": "places",
//     "type": "circle",
//     "paint": {
//         "circle-radius": 10,
//         "circle-color": "#007cbf"
//     }

// }
// var data;
// if (!('remove' in Element.prototype)) {
//     Element.prototype.remove = function() {
//       if (this.parentNode) {
//           this.parentNode.removeChild(this);
//       }
//     };
//   }
// function flyToStore(currentFeature) {
//     map.flyTo({
//       center: currentFeature.geometry.coordinates,
//       zoom: 15
//     });
//   }

//   function createPopUp(currentFeature) {
//     var popUps = document.getElementsByClassName('mapboxgl-popup');
//     /** Check if there is already a popup on the map and if so, remove it */
//     if (popUps[0]) popUps[0].remove();

//     var popup = new mapboxgl.Popup({ closeOnClick: false })
//       .setLngLat(currentFeature.geometry.coordinates)
//       .setHTML('<h3>'+currentFeature.properties.name+'</h3>')
//       .addTo(map);
     
//   }
// //data to onLoad
// map.on('load', function (data) {
//     //console.log(data)
//     //allsidebarids = []
//     map.addSource('places', {
//         "type": 'geojson',
//         "data": geoJson
//     });
//     map.addLayer(layer);
//     loader.removeAttribute('hidden');

//     const url = baseUrl + '42.3314,-83.0458';
//     fetch(url, {
//         method: 'GET', // *GET, POST, PUT, DELETE, etc.
//         mode: 'cors', // no-cors, *cors, same-origin
//         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//         redirect: 'follow', // manual, *follow, error
//     }).then(resp => resp.json())
//         // Transform the data into json
//         .then((data) => {
//             loader.setAttribute("hidden", "");
//             //console.log("data", data);
//             createSidebar_Markers(data);

//           });
//   getGeocoderResults();
// });

// geocoder.on('clear', () => {
//   console.log("clear event ")
// })

// map.on('click', (e, data, i ) => {
//   //  console.log(data)
//    //k = k+m;
//     hide();

//     // remove geocoder marker
//     map.getSource('places').setData(point);

//   // Add spinner function
//     loader.removeAttribute('hidden');
//     var popUps = document.getElementsByClassName('mapboxgl-popup');
//     /** Check if there is already a popup on the map and if so, remove it */
//     if (popUps[0]) popUps[0].remove();
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
//           console.log(data);
//             loader.setAttribute("hidden", "");
//             createSidebar_Markers(data)
//         })


//     // create DOM element for the marker
//     var el = document.createElement('div');
//     el.id = 'marker';
//     //Add a marker to show where you clicked.
//     // create the marker
//      var MarkerResults = new mapboxgl.Marker(el)
//         .setLngLat(e.lngLat)
//         .addTo(map);
// });


// //------- create the loader -------
// const loader = document.getElementById("initial-loader-overlay");
// // Assign the classname active and time out
// function showSpinner() {
//     loader.className = "active";
//     setTimeout(() => {
//         loader.className = loader.className.replace("active", "");
//     }, 5000);
// }
// //=-------- Loader end-----------------

// //----------geocoder results on search -------------------
// function getGeocoderResults() {
//     geocoder.on('result', function (ev) {
//         hide();

//         loader.removeAttribute('hidden');
//         var popUps = document.getElementsByClassName('mapboxgl-popup');
//         /** Check if there is already a popup on the map and if so, remove it */
//         if (popUps[0]) popUps[0].remove();
        
//         map.getSource('places').setData(ev.result.geometry);
        
//         built_address = ev.result.place_name
//         //console.log("coordinates ", ev.result.geometry.coordinates[0])
//         // Api for data
//         const url = baseUrl + [ev.result.geometry.coordinates[1], ev.result.geometry.coordinates[0]];
//         fetch(url, {
//             method: 'GET', // *GET, POST, PUT, DELETE, etc.
//             mode: 'cors', // no-cors, *cors, same-origin
//             cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//             redirect: 'follow', // manual, *follow, error
//         })
//             // .then(checkStatus)
//             .then(resp => resp.json())
//             // Transform the data into json
//             .then((data) => {
//                 loader.setAttribute("hidden", "");
//                 createSidebar_Markers(data)
//             })

//     });
// }
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