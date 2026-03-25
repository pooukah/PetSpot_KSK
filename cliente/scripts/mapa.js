// PetSpot — Mapa del cliente
// Usa Google Maps JavaScript API

PetSpot.init('cliente');
buildClienteLayout('mapa');

// Filtro activo (solo uno a la vez)
var filtroActivo = 'todas';

// Clínicas filtradas actualmente
var clinicasFiltradas = [];

// Mapa de Google
var mapa = null;
var marcadores = [];

// Inicializar el mapa (se llama desde el callback de Google Maps)
function initMap() {
  // Centro en Barcelona
  var barcelona = { lat: 41.3874, lng: 2.1686 };

  mapa = new google.maps.Map(document.getElementById('google-map'), {
    center: barcelona,
    zoom: 14,
    styles: obtenerEstiloMapa(),
    disableDefaultUI: true,
    zoomControl: true
  });

  aplicarFiltro('todas', document.querySelector('.filter-chip'));
}

function obtenerEstiloMapa() {
  var oscuro = localStorage.getItem('ps_dark') !== 'false';
  if (!oscuro) return []; // Estilo por defecto si es modo claro

  // Estilo oscuro para el mapa
  return [
    { elementType: 'geometry', stylers: [{ color: '#1e2535' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1e2535' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8a91a8' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#161b26' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f1117' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f1117' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e2535' }] }
  ];
}

function aplicarFiltro(tipo, el) {
  filtroActivo = tipo;

  // Marcar solo el chip clicado como activo
  var chips = document.querySelectorAll('.filter-chip');
  for (var i = 0; i < chips.length; i++) {
    chips[i].classList.remove('active');
  }
  el.classList.add('active');

  // Filtrar clínicas
  clinicasFiltradas = [];
  for (var i = 0; i < MockData.clinicas.length; i++) {
    var c = MockData.clinicas[i];
    var incluir = false;

    if (tipo === 'todas')   incluir = true;
    if (tipo === '24h')     incluir = c.h24;
    if (tipo === 'urgencias') incluir = c.urgencias;
    if (tipo === 'abiertas')  incluir = c.abierta;

    if (incluir) clinicasFiltradas.push(c);
  }

  renderClinicas();
  if (mapa) actualizarMarcadores();
}

function actualizarMarcadores() {
  // Quitar marcadores anteriores
  for (var i = 0; i < marcadores.length; i++) {
    marcadores[i].setMap(null);
  }
  marcadores = [];

  // Añadir marcadores de las clínicas filtradas
  for (var i = 0; i < clinicasFiltradas.length; i++) {
    var c = clinicasFiltradas[i];
    var marcador = new google.maps.Marker({
      position: { lat: c.lat, lng: c.lng },
      map: mapa,
      title: c.nombre,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: c.abierta ? '#6dd3b1' : '#545e7a',
        fillOpacity: 0.9,
        strokeColor: '#fff',
        strokeWeight: 2
      }
    });

    // Crear closure para el click del marcador
    (function(clinica, idx) {
      marcador.addListener('click', function() {
        seleccionarClinica(idx);
      });
    })(c, i);

    marcadores.push(marcador);
  }
}

function renderClinicas() {
  var lista = document.getElementById('clinicas-list');
  lista.innerHTML = '';

  if (clinicasFiltradas.length === 0) {
    lista.innerHTML = '<p style="text-align:center;color:var(--text3);padding:24px;font-size:13px">No hay clínicas con este filtro</p>';
    return;
  }

  for (var i = 0; i < clinicasFiltradas.length; i++) {
    var c = clinicasFiltradas[i];
    var estrellas = '';
    for (var s = 1; s <= 5; s++) {
      estrellas += s <= Math.floor(c.rating) ? '★' : '☆';
    }

    var card = document.createElement('div');
    card.className = 'clinica-card';
    card.dataset.idx = i;
    card.innerHTML =
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">' +
        '<div class="clinica-name">' + c.nombre + '</div>' +
        '<span class="badge ' + (c.abierta ? 'badge-green' : 'badge-red') + '">' + (c.abierta ? 'Abierto' : 'Cerrado') + '</span>' +
      '</div>' +
      '<div class="clinica-addr">' + Icons.pin + ' ' + c.dir + ' · <strong>' + c.dist + '</strong></div>' +
      '<div class="clinica-meta">' +
        '<span style="color:#ffa500;font-size:13px">' + estrellas + '</span>' +
        '<span style="font-size:12px;color:var(--text2);margin-left:4px">' + c.rating + '</span>' +
        (c.h24       ? '<span class="badge badge-blue" style="margin-left:6px">24h</span>' : '') +
        (c.urgencias ? '<span class="badge badge-orange" style="margin-left:4px">Urgencias</span>' : '') +
      '</div>' +
      '<div class="clinica-actions">' +
        '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); PetSpot.notify(\'Redirigiendo a citas...\')">Pedir cita</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation()">' + Icons.phone + ' ' + c.tel + '</button>' +
      '</div>';

    card.addEventListener('click', crearHandlerClinica(i));
    lista.appendChild(card);
  }
}

function crearHandlerClinica(idx) {
  return function() { seleccionarClinica(idx); };
}

function seleccionarClinica(idx) {
  var cards = document.querySelectorAll('.clinica-card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.toggle('active', parseInt(cards[i].dataset.idx) === idx);
  }
  if (cards[idx]) {
    cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  // Centrar mapa en la clínica seleccionada
  if (mapa && clinicasFiltradas[idx]) {
    mapa.setCenter({ lat: clinicasFiltradas[idx].lat, lng: clinicasFiltradas[idx].lng });
    mapa.setZoom(16);
  }
}
