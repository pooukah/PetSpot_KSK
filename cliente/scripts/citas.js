// PetSpot — Citas del cliente

PetSpot.init('cliente');
buildClienteLayout('citas');

// Iconos
document.getElementById('btn-nueva-icon').innerHTML = Icons.plus;
document.getElementById('icon-x').innerHTML         = Icons.x;
document.getElementById('icon-cal2').innerHTML      = Icons.calendar;

// Array de citas (empezamos con las de prueba y podemos añadir más)
var listaCitas = [];
for (var i = 0; i < MockData.citas.length; i++) {
  listaCitas.push(MockData.citas[i]);
}

// Botón nueva cita
document.getElementById('btn-nueva').addEventListener('click', function() {
  document.getElementById('modal-cita').classList.add('open');
});

// ── FUNCIONES DE TABS ──
function switchTab(tab, el) {
  // Ocultar todos los tabs
  document.getElementById('tab-proximas').style.display  = 'none';
  document.getElementById('tab-historial').style.display = 'none';
  document.getElementById('tab-calendario').style.display = 'none';
  // Mostrar el que se ha clicado
  document.getElementById('tab-' + tab).style.display = '';
  // Quitar clase active de todos los botones
  var botones = document.querySelectorAll('.tab');
  for (var i = 0; i < botones.length; i++) {
    botones[i].classList.remove('active');
  }
  el.classList.add('active');
  // Si es el calendario, renderizarlo
  if (tab === 'calendario') renderCalendario();
}

// ── PRÓXIMAS CITAS ──
function renderProximas() {
  var lista = document.getElementById('list-proximas');
  lista.innerHTML = '';
  var hayAlguna = false;

  for (var i = 0; i < listaCitas.length; i++) {
    var c = listaCitas[i];
    if (c.estado === 'completada') continue;
    hayAlguna = true;
    var claseBadge = c.estado === 'confirmada' ? 'badge-green' : 'badge-orange';

    var div = document.createElement('div');
    div.className = 'cita-card';
    div.dataset.id = c.id;
    div.innerHTML =
      '<div class="cita-time"><div class="hour">' + c.hora + '</div><div class="date">' + c.fecha + '</div></div>' +
      '<div class="cita-divider"></div>' +
      '<div class="cita-info">' +
        '<div class="cita-title">' + c.motivo + '</div>' +
        '<div class="cita-sub">' + Icons.paw + ' ' + c.mascota + ' · ' + c.veterinario + '</div>' +
      '</div>' +
      '<div class="cita-actions">' +
        '<span class="badge ' + claseBadge + '">' + c.estado + '</span>' +
        '<button class="btn btn-danger btn-sm" onclick="cancelarCita(' + c.id + ', this)">Cancelar</button>' +
      '</div>';
    lista.appendChild(div);
  }

  if (!hayAlguna) {
    lista.innerHTML = '<p style="text-align:center;color:var(--text3);padding:24px">No tienes citas próximas</p>';
  }
}

function cancelarCita(id, boton) {
  // Buscar la cita y marcarla como cancelada visualmente
  boton.closest('.cita-card').style.opacity = '0.4';
  boton.textContent = 'Cancelada';
  boton.disabled = true;
  PetSpot.notify('Cita cancelada correctamente');
}

renderProximas();

// ── HISTORIAL (divs como en próximas, no tabla) ──
function renderHistorial() {
  var lista = document.getElementById('list-historial');
  lista.innerHTML = '';

  for (var i = 0; i < listaCitas.length; i++) {
    var c = listaCitas[i];
    if (c.estado !== 'completada') continue;

    var div = document.createElement('div');
    div.className = 'cita-card';
    div.innerHTML =
      '<div class="cita-time"><div class="hour">' + c.hora + '</div><div class="date">' + c.fecha + '</div></div>' +
      '<div class="cita-divider"></div>' +
      '<div class="cita-info">' +
        '<div class="cita-title">' + c.motivo + '</div>' +
        '<div class="cita-sub">' + Icons.paw + ' ' + c.mascota + ' · ' + c.veterinario + ' · ' + c.clinica + '</div>' +
      '</div>' +
      '<span class="badge badge-blue">completada</span>';
    lista.appendChild(div);
  }
}

renderHistorial();

// ── CALENDARIO ──
var mesActual   = new Date().getMonth();
var anioActual  = new Date().getFullYear();
var diaSeleccionado = null;
var nombresMeses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function renderCalendario() {
  document.getElementById('cal-title').textContent = nombresMeses[mesActual] + ' ' + anioActual;
  var grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  // Calcular qué día empieza el mes (0=domingo, ajustamos a lunes)
  var primerDia = new Date(anioActual, mesActual, 1).getDay();
  var offset = (primerDia + 6) % 7;
  var totalDias = new Date(anioActual, mesActual + 1, 0).getDate();
  var hoy = new Date().getDate();

  // Días vacíos al principio
  for (var i = 0; i < offset; i++) {
    grid.innerHTML += '<div></div>';
  }

  // Días del mes
  for (var d = 1; d <= totalDias; d++) {
    var esHoy = (d === hoy && mesActual === new Date().getMonth() && anioActual === new Date().getFullYear());
    var tienesCita = tieneCitaEnDia(d);
    var seleccionado = (d === diaSeleccionado) ? 'selected' : '';

    var div = document.createElement('div');
    div.className = 'cal-day' + (esHoy ? ' today' : '') + (tienesCita ? ' has-cita' : '') + (seleccionado ? ' selected' : '');
    div.textContent = d;
    div.dataset.dia = d;
    div.addEventListener('click', function() {
      diaSeleccionado = parseInt(this.dataset.dia);
      renderCalendario(); // Re-renderizar para marcar el día
      mostrarCitasDelDia(diaSeleccionado);
    });
    grid.appendChild(div);
  }

  // Mostrar citas del día seleccionado si hay uno
  if (diaSeleccionado) {
    mostrarCitasDelDia(diaSeleccionado);
  } else {
    document.getElementById('cal-citas-list').innerHTML = '<p style="color:var(--text3);font-size:13px;padding:12px 0">Clica un día para ver sus citas</p>';
  }
}

function tieneCitaEnDia(dia) {
  // Por simplificar, los días 17, 18 y 22 tienen citas
  return dia === 17 || dia === 18 || dia === 22;
}

function mostrarCitasDelDia(dia) {
  var lista = document.getElementById('cal-citas-list');
  lista.innerHTML = '';

  // Filtrar citas del día (simulado: días 17, 18, 22)
  var citasDelDia = [];
  for (var i = 0; i < listaCitas.length; i++) {
    var c = listaCitas[i];
    if (c.estado !== 'completada') {
      // Simular que algunas citas coinciden con esos días
      if ((dia === 17 && c.fecha === 'Hoy') ||
          (dia === 18 && c.fecha === 'Mañana') ||
          (dia === 22 && c.fecha === '22/03')) {
        citasDelDia.push(c);
      }
    }
  }

  if (citasDelDia.length === 0) {
    lista.innerHTML = '<p style="color:var(--text3);font-size:13px;padding:12px 0">No hay citas este día</p>';
    return;
  }

  for (var i = 0; i < citasDelDia.length; i++) {
    var c = citasDelDia[i];
    lista.innerHTML +=
      '<div class="cita-card" style="margin-bottom:10px">' +
        '<div class="cita-time"><div class="hour">' + c.hora + '</div><div class="date">Día ' + dia + '</div></div>' +
        '<div class="cita-divider"></div>' +
        '<div class="cita-info">' +
          '<div class="cita-title">' + c.motivo + '</div>' +
          '<div class="cita-sub">' + Icons.paw + ' ' + c.mascota + '</div>' +
        '</div>' +
      '</div>';
  }
}

function changeMonth(d) {
  mesActual += d;
  if (mesActual > 11) { mesActual = 0; anioActual++; }
  if (mesActual < 0)  { mesActual = 11; anioActual--; }
  diaSeleccionado = null;
  renderCalendario();
}

// ── NUEVA CITA ──
function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(function(m) {
    m.classList.remove('open');
  });
}

function solicitarCita() {
  var mascota    = document.getElementById('nueva-mascota').value;
  var veterinario = document.getElementById('nueva-vet').value;
  var motivo     = document.getElementById('nueva-motivo').value.trim();
  var fecha      = document.getElementById('nueva-fecha').value;
  var hora       = document.getElementById('nueva-hora').value;

  if (!mascota || !motivo || !fecha || !hora) {
    PetSpot.notify('Por favor, rellena todos los campos');
    return;
  }

  // Convertir fecha a formato legible
  var partes = fecha.split('-');
  var fechaLegible = partes[2] + '/' + partes[1];

  // Crear nueva cita y añadirla a la lista
  var nuevaId = listaCitas.length + 100;
  var nuevaCita = {
    id:          nuevaId,
    hora:        hora,
    fecha:       fechaLegible,
    veterinario: veterinario.split('—')[0].trim(),
    mascota:     mascota.split(' ')[0],
    motivo:      motivo,
    estado:      'pendiente',
    clinica:     veterinario.split('—')[1] ? veterinario.split('—')[1].trim() : 'PetSpot'
  };

  listaCitas.push(nuevaCita);
  closeModal();
  renderProximas();
  renderHistorial();
  PetSpot.notify('✅ Cita solicitada — estado: pendiente');
}
