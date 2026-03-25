// PetSpot — Perfil del veterinario

PetSpot.init('veterinario');
buildVetLayout('perfil');

// Iconos
document.getElementById('icon-edit-av').innerHTML = Icons.edit;
document.getElementById('icon-pin').innerHTML     = Icons.pin;
document.getElementById('icon-clinic').innerHTML  = Icons.pin;
document.getElementById('icon-clock').innerHTML   = Icons.calendar;
document.getElementById('icon-steth').innerHTML   = Icons.stethoscope;
document.getElementById('icon-notif').innerHTML   = Icons.chat;
document.getElementById('icon-lock').innerHTML    = Icons.user;

// Cargar datos del usuario en los campos
var user = PetSpot.getUser();
if (user) {
  document.getElementById('input-nombre').value    = user.nombre    || '';
  document.getElementById('input-email').value     = user.email     || '';
  document.getElementById('vet-name').textContent  = 'Dr./Dra. ' + (user.nombre || '');
  document.getElementById('vet-email').textContent = user.email || '';
  document.getElementById('vet-av').textContent    = user.nombre ? user.nombre[0] : 'V';
  if (user.clinica) {
    document.getElementById('vet-clinic-name').textContent = user.clinica;
  }
}

// Actualizar nombre en tiempo real al escribir
document.getElementById('input-nombre').addEventListener('input', function() {
  var nuevo = this.value || 'Sin nombre';
  document.getElementById('vet-name').textContent = 'Dr./Dra. ' + nuevo;
  // Actualizar topbar también
  var saludo = document.getElementById('topbar-greeting');
  if (saludo) saludo.innerHTML = 'Bienvenido, <strong>Dr./Dra. ' + nuevo + '</strong>';
  var av = document.getElementById('topbar-avatar');
  if (av) av.textContent = nuevo[0] ? nuevo[0].toUpperCase() : 'V';
});

// Guardar datos del veterinario
function guardarDatos() {
  var nombre = document.getElementById('input-nombre').value.trim();
  var email  = document.getElementById('input-email').value.trim();
  var tel    = document.getElementById('input-tel').value.trim();

  if (!nombre) {
    PetSpot.notify('El nombre no puede estar vacío');
    return;
  }

  // Guardar en sesión
  var user = PetSpot.getUser();
  user.nombre = nombre;
  user.email  = email;
  PetSpot.setUser(user);

  // Actualizar cabecera
  document.getElementById('vet-name').textContent  = 'Dr./Dra. ' + nombre;
  document.getElementById('vet-email').textContent = email;
  document.getElementById('vet-av').textContent    = nombre[0].toUpperCase();
  PetSpot.setTopbar();

  PetSpot.notify('✅ Datos guardados correctamente');
}

// Sección switcher
function showSection(sec, el) {
  document.getElementById('sec-datos').style.display   = sec === 'datos'   ? '' : 'none';
  document.getElementById('sec-clinica').style.display = sec === 'clinica' ? '' : 'none';
  document.getElementById('sec-config').style.display  = sec === 'config'  ? '' : 'none';
  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  el.classList.add('active');
}

// Especialidades
var specs = ['Cirugía', 'Medicina interna', 'Odontología'];
var specsEl = document.getElementById('vet-specs');
for (var i = 0; i < specs.length; i++) {
  specsEl.innerHTML += '<span class="spec-tag">' + specs[i] + '</span>';
}

// Horario del doctor (no de la veterinaria en general)
var horario = [
  { dia: 'Lunes — Viernes', hora: '09:00 – 20:00', on: true  },
  { dia: 'Sábados',         hora: '09:00 – 14:00', on: true  },
  { dia: 'Domingos',        hora: 'Cerrado',        on: false }
];
var horarioEl = document.getElementById('horario-list');
for (var i = 0; i < horario.length; i++) {
  var h = horario[i];
  horarioEl.innerHTML +=
    '<div class="notif-row">' +
      '<div>' +
        '<div style="font-size:14px;font-weight:600">' + h.dia + '</div>' +
        '<div style="font-size:12px;color:var(--text2)">' + h.hora + '</div>' +
      '</div>' +
      '<div class="toggle ' + (h.on ? 'on' : '') + '" onclick="this.classList.toggle(\'on\')"></div>' +
    '</div>';
}

// Servicios del doctor en concreto (no de la clínica)
var servicios = [
  { label: 'Urgencias',          on: false },
  { label: 'Visita a domicilio', on: true  },
  { label: 'Videoconsulta',      on: true  },
  { label: 'Cirugía mayor',      on: true  }
];
var serviciosEl = document.getElementById('servicios-list');
for (var i = 0; i < servicios.length; i++) {
  var s = servicios[i];
  serviciosEl.innerHTML +=
    '<div class="notif-row">' +
      '<span style="font-size:14px;font-weight:500">' + s.label + '</span>' +
      '<div class="toggle ' + (s.on ? 'on' : '') + '" onclick="this.classList.toggle(\'on\')"></div>' +
    '</div>';
}

// Notificaciones
var notifs = [
  ['Nueva cita solicitada', 'Cuando un cliente pide cita',  true  ],
  ['Mensaje nuevo',         'Cuando recibes un mensaje',    true  ],
  ['Pago recibido',         'Confirmación de pago',         true  ],
  ['Recordatorio de cita',  '1h antes de cada cita',        true  ],
  ['Valoración nueva',      'Cuando te valoran',            false ]
];
var notifEl = document.getElementById('notif-list');
for (var i = 0; i < notifs.length; i++) {
  var n = notifs[i];
  notifEl.innerHTML +=
    '<div class="notif-row">' +
      '<div>' +
        '<div style="font-size:14px;font-weight:600">' + n[0] + '</div>' +
        '<div style="font-size:12px;color:var(--text2)">' + n[1] + '</div>' +
      '</div>' +
      '<div class="toggle ' + (n[2] ? 'on' : '') + '" onclick="this.classList.toggle(\'on\')"></div>' +
    '</div>';
}
