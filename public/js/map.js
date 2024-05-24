mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11',
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom:9  // starting zoom
});
const marker1 = new mapboxgl.Marker({color:`red`})
.setLngLat(listing.geometry.coordinates) // listing.geometry.cordinates
.setPopup(new mapboxgl.Popup({offset:25})
.setHTML(`<h4>${listing.title}</h4><p>You'll be Living here!</p>`))
.addTo(map);



const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');

for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
    };
}



