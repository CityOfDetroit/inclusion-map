map.on('click', 'places', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.name;

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

// Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

// Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', function () {
            map.getCanvas().style.cursor = '';
        });

// var size = 200;
//
// var pulsingDot = {
//     width: size,
//     height: size,
//     data: new Uint8Array(size * size * 4),
//
//     onAdd: function() {
//         var canvas = document.createElement('canvas');
//         canvas.width = this.width;
//         canvas.height = this.height;
//         this.context = canvas.getContext('2d');
//     },
//
//     render: function() {
//         var duration = 1000;
//         var t = (performance.now() % duration) / duration;
//
//         var radius = size / 2 * 0.3;
//         var outerRadius = size / 2 * 0.7 * t + radius;
//         var context = this.context;
//
// // draw outer circle
//         context.clearRect(0, 0, this.width, this.height);
//         context.beginPath();
//         context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
//         context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
//         context.fill();
//
// // draw inner circle
//         context.beginPath();
//         context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
//         context.fillStyle = 'rgba(255, 100, 100, 1)';
//         context.strokeStyle = 'white';
//         context.lineWidth = 2 + 4 * (1 - t);
//         context.fill();
//         context.stroke();
//
// // update this image's data with data from the canvas
//         this.data = context.getImageData(0, 0, this.width, this.height).data;
//
// // keep the map repainting
//         map.triggerRepaint();
//
// // return `true` to let the map know that the image was updated
//         return true;
//     }
// };
