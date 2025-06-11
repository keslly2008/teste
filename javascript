// Inicializa o mapa
const map = L.map('map').setView([-23.5505, -46.6333], 12); // São Paulo por padrão

// Adiciona camada de mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Tenta obter localização do usuário
map.locate({ setView: true, maxZoom: 16 });

function onLocationFound(e) {
  const radius = e.accuracy / 2;

  L.marker(e.latlng).addTo(map)
    .bindPopup("Você está aqui!").openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert("Não foi possível acessar sua localização.");
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Evento do formulário
document.getElementById('suggestion-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert("Obrigado pela sua contribuição!");
  this.reset();
});
