let coordinates = listing.geometry.coordinates;  // [longitude, latitude]
let locationName = listing.location;

let center, zoom;
let map;

// // Check if coordinates are undefined, null, empty, or not valid
// if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
//   center = ol.proj.fromLonLat([0, 0]);  // Default center
//   zoom = 2;                             // Default zoom level
// } else {
//   center = ol.proj.fromLonLat(coordinates);  // Use provided coordinates
//   zoom = 10;                                 // Zoom closer
// }


// const map = new ol.Map({
//     target: 'map',
//     layers: [
//       new ol.layer.Tile({
//         source: new ol.source.OSM(),
//       }),
//     ],
//     view: new ol.View({    
//     //   center: ol.proj.fromLonLat(coordinates),
//     //   zoom: 10,
//         center: center,
//         zoom: zoom
//     }),
//   });


//  // Create an overlay for the popup
//  const popupContainer = document.getElementById('popup');
//  const popupContent = document.getElementById('popup-content');
//  const popupCloser = document.getElementById('popup-closer');

//  const overlay = new ol.Overlay({
//      element: popupContainer,
//      autoPan: true,
//      autoPanAnimation: {
//          duration: 250
//      }
//  });
//  map.addOverlay(overlay);

//  // Close the popup when clicking the 'X'
//  popupCloser.onclick = function () {
//      overlay.setPosition(undefined);
//      popupCloser.blur();
//      return false;
//  };

//  // Display popup on marker click
//  map.on('singleclick', function (event) {
//      const feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
//          return feature;
//      });

//      if (feature) {
//         const coordinates = listing.geometry.coordinates;
//         const name = listing.title;
//         const description = listing.location;

//           // Convert coordinates to the projection used by OpenLayers
//           const projectedCoordinates = ol.proj.fromLonLat(coordinates);

//           popupContent.innerHTML = `<h4>${name}</h4><p>Exact location will be provided after booking</p>`;
//           overlay.setPosition(projectedCoordinates);  // Use converted coordinates
//      } else {
//          overlay.setPosition(undefined);  // Close popup if clicking outside marker
//      }

//  });





// Test Code



// Function to fetch coordinates using Nominatim
async function geocodeLocation(location) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const data = await response.json();

    if (data && data.length > 0) {
        let lon = parseFloat(data[0].lon);
        let lat = parseFloat(data[0].lat);
        return [lon, lat];
    } else {
        return [0, 0];  // Fallback if location not found
    }
}


// Initialize Map Function
async function initializeMap() {
    // if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    //     // If coordinates are missing, geocode the location
    //     coordinates = await geocodeLocation(locationName);
    //     zoom = 12;  // Zoom in after geocoding
    // } else {
    //     zoom = 12;  // Use closer zoom for provided coordinates
    // }

    coordinates = await geocodeLocation(locationName);
        zoom = 12;  // Zoom in after geocoding

    center = ol.proj.fromLonLat(coordinates);

        map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            }),
        ],
        view: new ol.View({
            center: center,
            zoom: zoom
        }),
    });
    
    addMarker(coordinates);
    addCircle(coordinates); // Add circle feature here
    setupPopupOverlay();
}

// Call the function to load the map
initializeMap();



  // Function to add a marker
function addMarker(coordinates) {
  const marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
  });
  

  const vectorSource = new ol.source.Vector({
      features: [marker]
  });

  const markerStyle = new ol.style.Style({
      image: new ol.style.Icon({
          anchor: [0.5, 1],
        //   src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',  // Custom marker icon (optional)
          src: "/assets/home.png",
          scale: 0.07
      })
  });

  const markerLayer = new ol.layer.Vector({
      source: vectorSource,
      style: markerStyle
  });

  map.addLayer(markerLayer);
}

// // Call the function to add the marker
// addMarker(coordinates);



// Function to add a circle around the marker
function addCircle(coordinates) {
    const circleFeature = new ol.Feature({
        geometry: new ol.geom.Circle(ol.proj.fromLonLat(coordinates), 3000) // Radius in meters
    });

    const circleStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 56, 92, 0.16)', // Red fill with opacity
        }),
        // stroke: new ol.style.Stroke({
        //     color: '#ff0000',
        //     width: 0,
        // }),
    });

    circleFeature.setStyle(circleStyle);

    const vectorSource = new ol.source.Vector({
        features: [circleFeature]
    });

    const circleLayer = new ol.layer.Vector({
        source: vectorSource
    });

    map.addLayer(circleLayer);
}





// Function to set up the popup overlay
function setupPopupOverlay() {
    const popupContainer = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const popupCloser = document.getElementById('popup-closer');

    const overlay = new ol.Overlay({
        element: popupContainer,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    map.addOverlay(overlay);

    // Close the popup when clicking the 'X'
    popupCloser.onclick = function () {
        overlay.setPosition(undefined);
        popupCloser.blur();
        return false;
    };

    // Display popup on marker click
    map.on('singleclick', function (event) {
        const feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
            return feature;
        });

        if (feature) {
            const projectedCoordinates = ol.proj.fromLonLat(coordinates);

            popupContent.innerHTML = 
                `<h4>${listing.title}</h4>
                <p>${listing.location}</p>
                <p>Exact location will be provided after booking</p>`;
            overlay.setPosition(projectedCoordinates);
        } else {
            overlay.setPosition(undefined);  // Close popup if clicking outside marker
        }
    });
}
