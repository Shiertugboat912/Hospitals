//Add your LocationIQ Maps Access Token here (not the API token!)
locationiq.key = "pk.1130a51101f3e542204e6a37ef6c3d56";
//Define the map and configure the map's theme
var map = new mapboxgl.Map({
  container: "map",
  attributionControl: false, //need this to show a compact attribution icon (i) instead of the whole text
  zoom: 9,
  center: [72.8, 19.02]
});

//Define layers you want to add to the layer controls; the first element will be the default layer
var layerStyles = {
  Streets: "streets/vector",
  Hybrid: "hybrid/vector",
  Dark: "dark/vector",
  Light: "light/vector"
};

map.addControl(
  new locationiqLayerControl({
    key: locationiq.key,
    layerStyles: layerStyles
  }),
  "top-left"
);

//Add Navigation controls to the map to the top-right corner of the map
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-right");

//Add a 'full screen' button to the map
map.addControl(new mapboxgl.FullscreenControl());

//Add a Scale to the map
map.addControl(
  new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: "metric" //imperial for miles
  })
);
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  })
);

function addMarker(lon, lat, display_name, distance) {
  var el = document.createElement("div");
  el.className = "marker";
  el.style.backgroundImage = "url(images/icon.png)";
  el.style.width = "48px";
  el.style.height = "48px";
  el.style.objectFit = "cover";
  distance = distance / 1000;

  var info = "Name: " + display_name + "   Distance: " + distance + " kms";
  var popup = new mapboxgl.Popup({ offset: 25 }).setText(info);
  // add marker to map
  new mapboxgl.Marker(el)
    .setLngLat([lon, lat])
    .setPopup(popup)
    .addTo(map);

  map.flyTo({ center: [lon, lat], zoom: 13 });
}

function display(a, b, c, d) {
  d = d * 1000;
  addMarker(b, a, c, d);
}
/* getCity(19.0148, 72.8326); */
