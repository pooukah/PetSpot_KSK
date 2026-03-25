// PetSpot — Inicio del cliente

PetSpot.init('cliente');
buildClienteLayout('inicio');

// Fecha actual
var dias  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var hoy   = new Date();
document.getElementById('date-chip').textContent =
  dias[hoy.getDay()] + ', ' + hoy.getDate() + ' de ' + meses[hoy.getMonth()] + ' ' + hoy.getFullYear();

// Iconos de acciones rápidas
document.getElementById('qi-citas').innerHTML  = Icons.calendar;
document.getElementById('qi-chat').innerHTML   = Icons.chat;
document.getElementById('qi-mapa').innerHTML   = Icons.map;
document.getElementById('qi-tienda').innerHTML = Icons.shop;
document.getElementById('icon-cal').innerHTML  = Icons.calendar;
document.getElementById('icon-paw').innerHTML  = Icons.paw;

// Próximas citas
var citasList = document.getElementById('citas-list');
var proximas  = [];
for (var i = 0; i < MockData.citas.length; i++) {
  if (MockData.citas[i].estado !== 'completada') proximas.push(MockData.citas[i]);
}
proximas = proximas.slice(0, 3);

if (proximas.length === 0) {
  citasList.innerHTML = '<p style="text-align:center;color:var(--text3);padding:20px;font-size:13px">No tienes citas próximas</p>';
} else {
  for (var i = 0; i < proximas.length; i++) {
    var c = proximas[i];
    var claseBadge = c.estado === 'confirmada' ? 'badge-green' : 'badge-orange';
    var div = document.createElement('div');
    div.className = 'cita-card';
    div.innerHTML =
      '<div class="cita-time"><div class="hour">' + c.hora + '</div><div class="date">' + c.fecha + '</div></div>' +
      '<div class="cita-divider"></div>' +
      '<div class="cita-info">' +
        '<div class="cita-title">' + c.motivo + '</div>' +
        '<div class="cita-sub">' + Icons.paw + ' ' + c.mascota + ' · ' + c.veterinario + '</div>' +
      '</div>' +
      '<span class="badge ' + claseBadge + '">' + c.estado + '</span>';
    citasList.appendChild(div);
  }
}

// Mascotas — con icono según especie
var mascotasList = document.getElementById('mascotas-list');
var petIcons     = { dog: Icons.dog, cat: Icons.cat, rabbit: Icons.paw };

for (var i = 0; i < MockData.mascotas.length; i++) {
  var m     = MockData.mascotas[i];
  var icono = petIcons[m.type] || Icons.paw;
  var div   = document.createElement('div');
  div.className = 'pet-card';
  div.innerHTML =
    '<div class="pet-avatar">' + icono + '</div>' +
    '<div>' +
      '<div class="pet-name">' + m.nombre + '</div>' +
      '<div class="pet-detail">' + m.raza + '</div>' +
      '<div class="pet-detail">🎂 ' + m.nacimiento + '</div>' +
    '</div>';
  mascotasList.appendChild(div);
}
