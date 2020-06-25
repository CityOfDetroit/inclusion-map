'use strict';
import Map from './map.class.js';
import Panel from './panel.class.js';
export default class Controller {
  constructor(container) {
    this.wifiLocs = []; 
    this.map = new Map({
      styleURL: 'mapbox://styles/mapbox',
      mapContainer: 'map',
      geocoder: true,
      zoomControls: true,
      baseLayers: {
        street: 'light-v10',
        satellite: 'cj774gftq3bwr2so2y6nqzvz4'
      },
      center: [-83.10, 42.36],
      zoom: 11,
      boundaries: {
        sw: [-83.3437,42.2102],
        ne: [-82.8754,42.5197]
      },
      sources: [
        {
          id: "wifi",
          type: "geojson",
          data: {
              "type": "FeatureCollection",
              "features": []
          }
        },
        {
          id: "single-point",
          type: "geojson",
          data: {
              "type": "FeatureCollection",
              "features": []
          }
        }
      ],
      layers: [
        {
          id: "wifi",
          "source": "wifi",
          "type": "circle",
          "paint": {
              "circle-radius": 8,
              "circle-color": "#004544"
          }
        },
        {
          id: "wifi-hover",
          "source": "wifi",
          "type": "circle",
          "paint": {
              "circle-radius": 8,
              "circle-color": "#E48F22"
          },
          "filter": ["==", "ID", ""]
        },
        {
          id: "wifi-featured",
          "source": "wifi",
          "type": "circle",
          "paint": {
              "circle-radius": 8,
              "circle-color": "#E48F22"
          },
          "filter": ["==", "ID", ""]
        },
        {
          id: "point",
          "source": "single-point",
          "type": "circle",
          "paint": {
              "circle-radius": 8,
              "circle-color": "#007cbf"
          }
        }
      ]
    });
    this.panel = new Panel(container);
  }
  
  initialForm(ev,_controller){
    switch (ev.target.getAttribute('data-btn-type')) {
      case 'start':
        document.querySelector('#user-type-section').className = 'hidden';
        document.querySelector('section.application').className = 'application';
        _controller.map.map.resize();
        this.getWiFiPoints(this,[42.3314,-83.0458]);
        break;
      default:

    }
  }

  getWiFiPoints(_controller, centroid){
    document.querySelector('#initial-loader-overlay').className = 'active';
    let baseUrl = "https://apis.detroitmi.gov/crowdsource/yahoo/wifi/locations/";
    const url = `${baseUrl}${centroid[0]},${centroid[1]}`;
    fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        redirect: 'follow', // manual, *follow, error
    }).then(resp => resp.json())
    // Transform the data into json
    .then((data) => {
      let tempWiFiList = {
        "type": "FeatureCollection",
        "features": []
      };
      if(!Array.isArray(data) && data.error == "No WiFi locations found"){
        data = [];
      }
      data.forEach(function(loc, index){
        let tempWifi = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              loc.coordinates.longitude,
              loc.coordinates.latitude
            ]
          },
          "properties": {
            ID: loc.id,
            image: loc.image_url,
            name: loc.name,
            address: loc.location.display_address[0] + " " + loc.location.display_address[1],
            phone: loc.phone,
            displayPhone: loc.display_phone,
            categories: loc.categories
          }
        };
        tempWiFiList.features.push(tempWifi);
      });
      _controller.wifiLocs = tempWiFiList.features;
      _controller.map.map.getSource('wifi').setData(tempWiFiList);
      document.querySelector('#initial-loader-overlay').className = '';
    });
  }


  updatePanel(data, _controller){
    this.panel.buildPanel(data, _controller);
  }

  geoResults(ev, _controller){
    console.log(ev.result.geometry);
    _controller.map.geocoder.setInput('');
    _controller.map.map.getSource('single-point').setData(ev.result.geometry);
    _controller.getWiFiPoints(_controller, [ev.result.center[1],ev.result.center[0]]);
    _controller.map.map.flyTo({
      center: ev.result.center,
      zoom: 12,
      speed: 1,
      curve: 1,
      easing(t) {
        return t;
      }
    });
  }
}
