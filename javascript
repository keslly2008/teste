// Configuração do mapa
function initMap() {
  const map = L.map('map').setView([-23.5505, -46.6333], 12);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
    alert("Não foi possível acessar sua localização. Mostrando mapa de São Paulo por padrão.");
  });
}

// Gerenciamento de sugestões
class SuggestionsManager {
  constructor() {
    this.form = document.getElementById('suggestion-form');
    this.suggestionsList = document.getElementById('suggestions');
    this.init();
  }

  init() {
    this.loadSuggestions();
    this.setupForm();
    this.setCurrentYear();
  }

  loadSuggestions() {
    const suggestions = this.getStoredSuggestions();
    this.renderSuggestions(suggestions);
  }

  getStoredSuggestions() {
    return JSON.parse(localStorage.getItem('sugestoes') || '[]');
  }

  renderSuggestions(suggestions) {
    this.suggestionsList.innerHTML = suggestions
      .map(({ nome, ponto, mensagem, data }) => `
        <li>
          <strong>${nome}</strong> sugeriu <em>${ponto}</em> - ${mensagem || 'Sem mensagem'} 
          <br><small>${data}</small>
        </li>
      `)
      .join('');
  }

  saveSuggestion({ nome, ponto, mensagem }) {
    const suggestions = this.getStoredSuggestions();
    suggestions.push({ 
      nome, 
      ponto, 
      mensagem, 
      data: new Date().toLocaleString() 
    });
    localStorage.setItem('sugestoes', JSON.stringify(suggestions));
    this.renderSuggestions(suggestions);
  }

  setupForm() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(this.form);
      const suggestion = {
        nome: formData.get('nome').trim(),
        ponto: formData.get('ponto').trim(),
        mensagem: formData.get('mensagem').trim()
      };
      
      this.saveSuggestion(suggestion);
      alert("Obrigado pela sua contribuição!");
      this.form.reset();
    });
  }

  setCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
  }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  new SuggestionsManager();
});