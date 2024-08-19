const socket = io()

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      socket.emit('send-location', { latitude, longitude })
    },
    (error) => {
      console.error('Error while emetting location: ', error)
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  )
}

var carIcon = L.icon({
  iconUrl: 'car.png',

  iconSize: [40, 60],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
})

const map = L.map('map').setView([0, 0], 20)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

const markers = {}

socket.on('recive-location', (data) => {
  const { id, latitude, longitude } = data
  map.setView([latitude, longitude])
  if (!markers[id]) {
    markers[id] = L.marker([latitude, longitude], { icon: carIcon }).addTo(map)
  } else {
    markers[id].setLatLng([latitude, longitude])
  }
})

socket.on('user-disconnected', (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id])
    delete markers[id]
  }
})
