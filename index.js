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
      controller.map.map.setFilter('wifi-featured', ['==', 'ID', features[0].properties.ID]);
      controller.updatePanel(features, controller);
      document.querySelector('.data-panel').className = 'data-panel active';
    }else{
      controller.map.map.setFilter('wifi-featured', ['==', 'ID', '']);
      controller.panel.clearPanel();
      controller.getWiFiPoints(controller, [e.lngLat.lat,e.lngLat.lng]);
      let point = {
        coordinates: [e.lngLat.lng,e.lngLat.lat],
        type: "Point"
      }
      controller.map.map.getSource('single-point').setData(point);
      controller.map.map.flyTo({
        center: [e.lngLat.lng,e.lngLat.lat],
        zoom: 12,
        speed: 1,
        curve: 1,
        easing(t) {
          return t;
        }
      });
    }
  });
  document.getElementById('close-panel-btn').addEventListener('click', function () {
    controller.panel.clearPanel();
    (document.querySelector('.data-panel.active') != null) ?  document.querySelector('.data-panel.active').className = 'data-panel' : 0;
  });
  document.getElementById('panel-btn').addEventListener('click', function () {
    controller.updatePanel(controller.wifiLocs, controller);
    document.querySelector('.data-panel').className = 'data-panel active';
  });
  const startingBtns = document.querySelectorAll('#user-type-section button');
  startingBtns.forEach(function (btn) {
    btn.addEventListener('click', function (ev) {
      controller.initialForm(ev, controller);
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