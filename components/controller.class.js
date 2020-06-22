'use strict';
import Map from './map.class.js';
import Panel from './panel.class.js';
export default class Controller {
  constructor(container) {
    this.wifiLocs = []; 
    this.map = new Map({
      styleURL: 'mapbox://styles/mapbox',
      mapContainer: 'map',
      geocoder: false,
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
    switch (ev) {
      case 'v-sign-up':
        document.querySelector('#user-type-section').className = 'hidden';
        document.querySelector('section.application').className = 'application';
        _controller.map.map.resize();
        this.getWiFiPoints(this,[42.3314,-83.0458]);
        break;
      default:

    }
  }

  getWiFiPoints(_controller, centroid){
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
      console.log("data", data);
      let tempWiFiList = {
        "type": "FeatureCollection",
        "features": []
      };
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
            address: loc.location.display_address[0] + loc.location.display_address[1],
            phone: loc.phone,
            displayPhone: loc.display_phone,
            categories: loc.categories
          }
        };
        tempWiFiList.features.push(tempWifi);
      });
      _controller.wifiLocs = tempWiFiList.features;
      _controller.map.map.getSource('wifi').setData(tempWiFiList);
    });
  }


  updatePanel(ev, _controller){
    this.panel.buildPanel(ev.data, ev.type);
  }

  geoResults(ev, _controller){
    _controller.map.geocoder.setInput('');
    _controller.map.map.getSource('single-point').setData(ev.result.geometry);
    _controller.map.map.flyTo({
      center: ev.result.center,
      zoom: 12,
      speed: 1,
      curve: 1,
      easing(t) {
        return t;
      }
    });
    const url = `http://gis.detroitmi.gov/arcgis/rest/services/DoIT/LITCH/MapServer/0/query?where=&text=&objectIds=&time=&geometry=${ev.result.center[0]}%2C+${ev.result.center[1]}&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=fid%2C+name&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json`;
    fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      //console.log(data);
      if (data.features.length) {
        const patrol = data.features[0].properties.name.split(' ').join('+');
        document.getElementById('sheet-link').href = `https://app.smartsheet.com/b/form/f004f42fcd4345b89a35049a29ff408a?Patrol+ID=${data.features[0].properties.FID}&Patrol+Name=${patrol}`;
        document.querySelector('.patrol-info').innerHTML = `<h3>Radio Patrol ${data.features[0].properties.name}</h3><p>Interested in becoming part of your local radio patrol? Follow the link to start the process.</p><p><small>The Radio Patrol application process is managed by the Detroit Police Department. Once you complete the sign up, someone will contact you regarding the application process. Residents who complete the online form will be contacted after October 31 to start the application process.</small></p>`;
        document.querySelector('.data-panel').className = 'data-panel active';
        _controller.geocoderOff = true;
      } else {
        const patrol = 'NEED+NAME';
        document.getElementById('sheet-link').href = `https://app.smartsheet.com/b/form/0c25bae787bc40ef9707c95b2d9684e8`;
        document.querySelector('.patrol-info').innerHTML = `<h3>NO RADIO PATROL FOUND</h3><p>Interested starting your new local radio patrlo? Follow the link to start the process.</p><p><small>The Radio Patrol application process is managed by the Detroit Police Department. Once you complete the sign up, someone will contact you regarding the application process. Residents who complete the online form will be contacted after October 31 to start the application process.</small></p>`;
        document.querySelector('.data-panel').className = 'data-panel active';
        _controller.geocoderOff = true;
      }
    });
  }
}
