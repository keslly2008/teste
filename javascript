// Inicializa o mapa centrado em São Paulo
const map = L.map('map').setView([-23.5505, -46.6333], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Localização do usuário
map.locate({ setView: true, maxZoom: 16 });

map.on('locationfound', e => {
  const radius = e.accuracy / 2;

  L.marker(e.latlng).addTo(map)
    .bindPopup("Você está aqui!").openPopup();

  L.circle(e.latlng, { radius }).addTo(map);
});

map.on('locationerror', () => {
  alert("Não foi possível acessar sua localização.");
});

// ----- FORMULÁRIO E SUGESTÕES -----
const form = document.getElementById('suggestion-form');
const suggestionsList = document.getElementById('suggestions');

function salvarSugestao(nome, ponto, mensagem) {
  const sugestoes = JSON.parse(localStorage.getItem('sugestoes') || '[]');
  sugestoes.push({ nome, ponto, mensagem, data: new Date().toLocaleString() });
  localStorage.setItem('sugestoes', JSON.stringify(sugestoes));
  atualizarLista();
}

function atualizarLista() {
  const sugestoes = JSON.parse(localStorage.getItem('sugestoes') || '[]');
  suggestionsList.innerHTML = '';
  sugestoes.forEach(({ nome, ponto, mensagem, data }) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${nome}</strong> sugeriu <em>${ponto}</em> - ${mensagem || 'Sem mensagem'} <br><small>${data}</small>`;
    suggestionsList.appendChild(li);
  });
}

// Carrega sugestões ao iniciar
document.addEventListener('DOMContentLoaded', atualizarLista);

// Envio do formulário
form.addEventListener('submit', e => {
  e.preventDefault();
  const nome = form.elements['nome'].value.trim();
  const ponto = form.elements['ponto'].value.trim();
  const mensagem = form.elements['mensagem'].value.trim();
  salvarSugestao(nome, ponto, mensagem);
  alert("Obrigado pela sua contribuição!");
  form.reset();
});
