// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjajd3MGlodXIwZ3piMnhudmlzazVnNm44In0.BL29_7QRvcnOrVuXX_hD9A';
var map = new mapboxgl.Map({
  container: 'map',
  // container id
  style: 'mapbox://styles/mapbox/streets-v11',
  // stylesheet location
  zoom: 11.7,
  center: [-83.060303, 42.348495]
});
var baseUrl = "https://apis.detroitmi.gov/crowdsource/yahoo/wifi/locations/"; //================ geocoder for address search====================//

var geocoder = new MapboxGeocoder({
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
  filter: function filter(item) {
    // returns true if item contains the detroit michigan region
    return item.context.map(function (i) {
      // this code attempts to find the `region` named `Detroit Michigan`
      return i.id.split('.').shift() === 'region' && i.text === 'Michigan';
    }).reduce(function (acc, cur) {
      return acc || cur;
    });
  },
  mapboxgl: mapboxgl
}); // Add zoom and rotation controls to the map.
//  var geocoderV = document.getElementById('geocoder');
//  geocoderV.appendChild(geocoder.onAdd(map));

map.addControl(geocoder);
map.addControl(new mapboxgl.NavigationControl());
var allsidebarids = [];
var getGeoJson = {
  type: "FeatureCollection",
  features: []
};
var point = {
  type: "Point",
  coordinates: []
}; // document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
//================ geocoder for address search ends====================//

function highlightItem(id) {
  var elem = document.getElementById(id);
  elem.classList.add("highlightItem");

  for (var i = 0; i < allsidebarids.length; i++) {
    if (allsidebarids[i] !== id) {
      var elems = document.getElementById(allsidebarids[i]);
      elems.classList.remove("highlightItem");
    }
  }
}

function createSidebar_Markers(data) {
  allsidebarids = [];
  var geoJson = getGeoJson;
  getGeoJson.features = [];
  var mainContainer = document.getElementById("listings");
  mainContainer.innerHTML = '';

  var _loop = function _loop(i) {
    getGeoJson.features.push({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [data[i].coordinates.longitude, data[i].coordinates.latitude]
      },
      "properties": {
        "id": data[i].id,
        "name": data[i].name,
        "stationName": data[i].alias,
        "isClosed": data[i].is_closed,
        "imageUrl": data[i].image_url,
        "address": data[i].location.address1,
        "city": data[i].location.city,
        "postalCode": data[i].location.zip_code
      },
      "layout": {
        "icon-image": "{icon}-15",
        "icon-allow-overlap": true
      }
    }); //console.log(data[i].id)

    allsidebarids.push(data[i].id);
    div = document.createElement("div");
    div.id = data[i].id;

    div.onclick = function () {
      flyToStore(getGeoJson.features[i]);
      createPopUp(getGeoJson.features[i]);
      highlightItem(allsidebarids[i]);
    };

    div.innerHTML = '<p>Name: </p>' + data[i].name + '</br><p> phone:</p>' + '' + data[i].phone + '</br><p>Address:</p>' + '' + data[i].location.address1, data[i].location.city;
    mainContainer.appendChild(div);
    popup = new mapboxgl.Popup().setHTML('<h3>' + data[i].name + '</h3>'); // create a HTML element for each feature

    el = document.createElement('div');
    el.id = 'marker';
    MarkerElement = document.createElement('h3');
    MarkerElement.id = "marker_" + data[i].id;

    MarkerElement.onclick = function () {
      //console.log("ids" ,allsidebarids[i] );
      location.href = '#' + allsidebarids[i];
      highlightItem(allsidebarids[i]);
    }; // make a marker for each feature and add to the map


    var myMarker = new mapboxgl.Marker({
      element: MarkerElement
    }).setLngLat([data[i].coordinates.longitude, data[i].coordinates.latitude]).setPopup(popup).addTo(map); //console.log(myMarker)

    var markerDiv = myMarker.getElement();
    mainContainer = document.getElementById("listings");
    markerDiv.addEventListener('click', function (f, data) {
      openNav(); //console.log(e)

      f.stopPropagation();
    });
    markerDiv.addEventListener('mouseenter', function () {
      var popUps = document.getElementsByClassName('mapboxgl-popup');
      /** Check if there is already a popup on the map and if so, remove it */

      if (popUps[0]) popUps[0].remove();
      myMarker.togglePopup();
    });
    markerDiv.addEventListener('mouseleave', function () {
      return myMarker.togglePopup();
    });
  };

  for (var i = 0; i < data.length; i++) {
    var div;
    var popup;
    var el;
    var MarkerElement;
    var mainContainer;

    _loop(i);
  }
}

var geoJson = {
  type: "FeatureCollection",
  features: []
};

function hide() {
  var markers = document.getElementsByClassName('mapboxgl-marker mapboxgl-marker-anchor-center');

  for (var i = 0; i < markers.length; i++) {
    markers[i].style.visibility = "hidden";
  }

  return;
}

function show() {
  var markers = document.getElementsByClassName("mapboxgl-marker");

  for (var i = 0; i < markers.length; i++) {
    markers[i].style.visibility = "visible";
  }

  return;
}

var layer = {
  "id": "places",
  "source": "places",
  "type": "circle",
  "paint": {
    "circle-radius": 10,
    "circle-color": "#007cbf"
  }
};
var data;

if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function () {
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
  var popup = new mapboxgl.Popup({
    closeOnClick: false
  }).setLngLat(currentFeature.geometry.coordinates).setHTML('<h3>' + currentFeature.properties.name + '</h3>').addTo(map);
} //data to onLoad


map.on('load', function (data) {
  //console.log(data)
  //allsidebarids = []
  map.addSource('places', {
    "type": 'geojson',
    "data": geoJson
  });
  map.addLayer(layer);
  loader.removeAttribute('hidden');
  var url = baseUrl + '42.3314,-83.0458';
  fetch(url, {
    method: 'GET',
    // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    // no-cors, *cors, same-origin
    cache: 'no-cache',
    // *default, no-cache, reload, force-cache, only-if-cached
    redirect: 'follow' // manual, *follow, error

  }).then(function (resp) {
    return resp.json();
  }) // Transform the data into json
  .then(function (data) {
    loader.setAttribute("hidden", ""); //console.log("data", data);

    createSidebar_Markers(data);
  });
  getGeocoderResults();
});
geocoder.on('clear', function () {
  console.log("clear event ");
});
map.on('click', function (e, data, i) {
  //  console.log(data)
  //k = k+m;
  hide(); // remove geocoder marker

  map.getSource('places').setData(point); // Add spinner function

  loader.removeAttribute('hidden');
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */

  if (popUps[0]) popUps[0].remove(); // map.flyTo({ center: e.features[0].geometry.coordinates });
  //base url

  var url = baseUrl + [e.lngLat.lat, e.lngLat.lng]; // map.flyTo({ center: e.features[0].geometry.coordinates });
  //fetch to get api from html

  fetch(url, {
    method: 'GET',
    // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    // no-cors, *cors, same-origin
    cache: 'no-cache',
    // *default, no-cache, reload, force-cache, only-if-cached
    redirect: 'follow' // manual, *follow, error

  }).then(function (resp) {
    return resp.json();
  }) // Transform the data into json
  .then(function (data) {
    loader.setAttribute("hidden", "");
    createSidebar_Markers(data);
  }); // create DOM element for the marker

  var el = document.createElement('div');
  el.id = 'marker'; //Add a marker to show where you clicked.
  // create the marker

  var MarkerResults = new mapboxgl.Marker(el).setLngLat(e.lngLat).addTo(map);
}); //------- create the loader -------

var loader = document.getElementById("initial-loader-overlay"); // Assign the classname active and time out

function showSpinner() {
  loader.className = "active";
  setTimeout(function () {
    loader.className = loader.className.replace("active", "");
  }, 5000);
} //=-------- Loader end-----------------
//----------geocoder results on search -------------------


function getGeocoderResults() {
  geocoder.on('result', function (ev) {
    hide();
    loader.removeAttribute('hidden');
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */

    if (popUps[0]) popUps[0].remove();
    map.getSource('places').setData(ev.result.geometry);
    built_address = ev.result.place_name; //console.log("coordinates ", ev.result.geometry.coordinates[0])
    // Api for data

    var url = baseUrl + [ev.result.geometry.coordinates[1], ev.result.geometry.coordinates[0]];
    fetch(url, {
      method: 'GET',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      redirect: 'follow' // manual, *follow, error

    }) // .then(checkStatus)
    .then(function (resp) {
      return resp.json();
    }) // Transform the data into json
    .then(function (data) {
      loader.setAttribute("hidden", "");
      createSidebar_Markers(data);
    });
  });
} // function getUserLocation() {
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
},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "45373" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/inclusion-map.e31bb0bc.js.map