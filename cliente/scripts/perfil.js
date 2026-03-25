// PetSpot — Perfil del cliente

PetSpot.init('cliente');
buildClienteLayout('perfil');

// Iconos
document.getElementById('icon-edit-av').innerHTML  = Icons.edit;
document.getElementById('icon-check-sm').innerHTML = Icons.check;
document.getElementById('icon-plus-pet').innerHTML = Icons.plus;
document.getElementById('icon-x-pet').innerHTML    = Icons.x;
document.getElementById('icon-paw-modal').innerHTML = Icons.paw;

// Cargar datos del usuario en los campos
var user = PetSpot.getUser();
if (user) {
  document.getElementById('input-nombre').value   = user.nombre  || '';
  document.getElementById('input-email').value    = user.email   || '';
  document.getElementById('input-dir').value      = user.direccion || '';
  document.getElementById('profile-name').textContent = user.nombre || '';
  document.getElementById('profile-email').textContent = user.email || '';
}

// Cuando se cambia el nombre, actualizar en tiempo real
document.getElementById('input-nombre').addEventListener('input', function() {
  document.getElementById('profile-name').textContent = this.value || 'Sin nombre';
});

// Guardar cambios de datos personales
function guardarDatos() {
  var nombre    = document.getElementById('input-nombre').value.trim();
  var email     = document.getElementById('input-email').value.trim();
  var tel       = document.getElementById('input-tel').value.trim();
  var dir       = document.getElementById('input-dir').value.trim();
  var cp        = document.getElementById('input-cp').value.trim();

  if (!nombre) {
    PetSpot.notify('El nombre no puede estar vacío');
    return;
  }

  // Actualizar datos en sessionStorage
  var user = PetSpot.getUser();
  user.nombre    = nombre;
  user.email     = email;
  user.direccion = dir;
  PetSpot.setUser(user);

  // Actualizar topbar
  PetSpot.setTopbar();

  // Actualizar cabecera del perfil
  document.getElementById('profile-name').textContent  = nombre;
  document.getElementById('profile-email').textContent = email;

  PetSpot.notify('✅ Datos guardados correctamente');
}

// ── SECCIÓN SWITCHER ──
function showSection(sec, el) {
  document.getElementById('sec-datos').style.display    = sec === 'datos'    ? '' : 'none';
  document.getElementById('sec-mascotas').style.display = sec === 'mascotas' ? '' : 'none';
  document.getElementById('sec-config').style.display   = sec === 'config'   ? '' : 'none';
  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  el.classList.add('active');
}

// ── MASCOTAS ──
// Trabajamos con una copia del array para poder añadir/borrar
var listaMascotas = [];
for (var i = 0; i < MockData.mascotas.length; i++) {
  listaMascotas.push({
    id:          MockData.mascotas[i].id,
    nombre:      MockData.mascotas[i].nombre,
    especie:     MockData.mascotas[i].especie,
    raza:        MockData.mascotas[i].raza,
    peso:        MockData.mascotas[i].peso,
    nacimiento:  MockData.mascotas[i].nacimiento,
    microchip:   MockData.mascotas[i].microchip,
    type:        MockData.mascotas[i].type
  });
}

var petIcons = { dog: Icons.dog, cat: Icons.cat, rabbit: Icons.paw };

function renderMascotas() {
  var lista = document.getElementById('mascotas-list');
  lista.innerHTML = '';

  for (var i = 0; i < listaMascotas.length; i++) {
    var m = listaMascotas[i];
    var icono = petIcons[m.type] || Icons.paw;

    var div = document.createElement('div');
    div.className = 'mascota-card';
    div.dataset.id = m.id;
    div.innerHTML =
      '<div class="mascota-card-top">' +
        '<div class="mascota-icon">' + icono + '</div>' +
        '<div style="flex:1">' +
          '<div class="mascota-name">' + m.nombre + '</div>' +
          '<div class="mascota-breed">' + m.especie + ' · ' + m.raza + '</div>' +
        '</div>' +
        '<button class="btn btn-danger btn-sm" onclick="eliminarMascota(' + m.id + ')">Eliminar</button>' +
      '</div>' +
      '<div class="grid-2" style="gap:12px">' +
        '<div class="form-group"><label class="form-label">Peso (kg)</label>' +
          '<input class="form-input" id="peso-' + m.id + '" value="' + m.peso + '"></div>' +
        '<div class="form-group"><label class="form-label">Fecha de nacimiento</label>' +
          '<input class="form-input" value="' + m.nacimiento + '" readonly style="opacity:0.7"></div>' +
        '<div class="form-group" style="grid-column:1/-1"><label class="form-label">Nº Microchip</label>' +
          '<input class="form-input" value="' + m.microchip + '" readonly style="opacity:0.7"></div>' +
      '</div>' +
      '<button class="btn btn-primary btn-sm" style="margin-top:8px" onclick="guardarPeso(' + m.id + ')">Guardar cambios</button>';
    lista.appendChild(div);
  }

  // Actualizar contador
  document.getElementById('contador-mascotas').textContent = '(' + listaMascotas.length + ')';
}

function guardarPeso(id) {
  var input = document.getElementById('peso-' + id);
  if (!input) return;
  for (var i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].id === id) {
      listaMascotas[i].peso = input.value;
      break;
    }
  }
  PetSpot.notify('✅ Peso actualizado');
}

function eliminarMascota(id) {
  if (!confirm('¿Seguro que quieres eliminar esta mascota?')) return;
  var nuevaLista = [];
  for (var i = 0; i < listaMascotas.length; i++) {
    if (listaMascotas[i].id !== id) nuevaLista.push(listaMascotas[i]);
  }
  listaMascotas = nuevaLista;
  renderMascotas();
  PetSpot.notify('Mascota eliminada');
}

function obtenerTypeDeEspecie(especie) {
  if (especie === 'Perro') return 'dog';
  if (especie === 'Gato')  return 'cat';
  return 'rabbit';
}

function addPet() {
  var nombre   = document.getElementById('nueva-nombre').value.trim();
  var especie  = document.getElementById('nueva-especie').value;
  var raza     = document.getElementById('nueva-raza').value.trim();
  var peso     = document.getElementById('nueva-peso').value.trim();
  var fecha    = document.getElementById('nueva-fecha').value;
  var microchip = document.getElementById('nueva-microchip').value.trim();

  if (!nombre || !raza || !peso || !fecha) {
    PetSpot.notify('Rellena al menos nombre, raza, peso y fecha');
    return;
  }

  // Convertir fecha de YYYY-MM-DD a DD/MM/YYYY
  var partes = fecha.split('-');
  var fechaFormato = partes[2] + '/' + partes[1] + '/' + partes[0];

  var nuevaId = Date.now(); // ID único
  listaMascotas.push({
    id:         nuevaId,
    nombre:     nombre,
    especie:    especie,
    raza:       raza,
    peso:       peso,
    nacimiento: fechaFormato,
    microchip:  microchip || 'Sin microchip',
    type:       obtenerTypeDeEspecie(especie)
  });

  renderMascotas();
  closeModal();

  // Limpiar el formulario
  document.getElementById('nueva-nombre').value     = '';
  document.getElementById('nueva-raza').value       = '';
  document.getElementById('nueva-peso').value       = '';
  document.getElementById('nueva-fecha').value      = '';
  document.getElementById('nueva-microchip').value  = '';

  PetSpot.notify('✅ ' + nombre + ' añadido/a correctamente');
}

// Modal
document.getElementById('btn-add-pet').addEventListener('click', function() {
  document.getElementById('modal-pet').classList.add('open');
});

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(function(m) {
    m.classList.remove('open');
  });
}

// Notificaciones
var notifCfg = [
  ['Recordatorio de citas', '24h antes de cada cita', true],
  ['Mensajes nuevos', 'Cuando recibas un mensaje', true],
  ['Ofertas', 'Novedades y descuentos', false],
  ['Email marketing', 'Boletín mensual', false]
];
var notifLista = document.getElementById('notif-list');
for (var i = 0; i < notifCfg.length; i++) {
  var lbl = notifCfg[i][0];
  var sub = notifCfg[i][1];
  var on  = notifCfg[i][2];
  var div = document.createElement('div');
  div.className = 'notif-row';
  div.innerHTML =
    '<div>' +
      '<div style="font-size:14px;font-weight:600">' + lbl + '</div>' +
      '<div style="font-size:12px;color:var(--text2)">' + sub + '</div>' +
    '</div>' +
    '<div class="toggle ' + (on ? 'on' : '') + '" onclick="this.classList.toggle(\'on\')"></div>';
  notifLista.appendChild(div);
}

renderMascotas();
