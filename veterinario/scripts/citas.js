// PetSpot — Citas del veterinario

PetSpot.init('veterinario');
buildVetLayout('citas');

document.getElementById('icon-plus').innerHTML   = Icons.plus;
document.getElementById('icon-search').innerHTML = Icons.search;
document.getElementById('icon-x').innerHTML      = Icons.x;

document.getElementById('btn-nueva').addEventListener('click', function() {
  document.getElementById('modal-nueva').classList.add('open');
});

// Array de citas que podemos modificar
var listaCitas = [];
for (var i = 0; i < MockData.vetCitas.length; i++) {
  listaCitas.push(MockData.vetCitas[i]);
}

var filtroActivo = 'todas';

// Icono según especie
function iconoPorEspecie(especie) {
  if (especie === 'Perro') return Icons.dog;
  if (especie === 'Gato')  return Icons.cat;
  return Icons.paw;
}

function renderCitas(datos) {
  var tbody = document.getElementById('citas-body');
  if (!datos || datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:32px">No hay citas que mostrar</td></tr>';
    return;
  }
  tbody.innerHTML = '';
  for (var i = 0; i < datos.length; i++) {
    var c = datos[i];
    var claseBadge = c.estado === 'confirmada' ? 'badge-green' : 'badge-orange';
    var icono = iconoPorEspecie(c.especie || 'Perro');
    var botonesHTML = c.estado === 'pendiente'
      ? '<button class="btn btn-success btn-sm" onclick="aceptarCita(' + c.id + ')">' + Icons.check + ' Aceptar</button>' +
        '<button class="btn btn-danger btn-sm" onclick="rechazarCita(' + c.id + ')">' + Icons.x + ' Rechazar</button>'
      : '<button class="btn btn-ghost btn-sm" onclick="PetSpot.notify(\'Historial del paciente (próximamente)\')">Ver historial</button>';

    var fila = document.createElement('tr');
    fila.id  = 'cita-row-' + c.id;
    fila.innerHTML =
      '<td><strong style="font-size:15px">' + c.hora + '</strong></td>' +
      '<td>' + c.fecha + '</td>' +
      '<td><div style="display:flex;align-items:center;gap:9px">' +
        '<div class="topbar-avatar" style="width:30px;height:30px;font-size:12px;flex-shrink:0">' + c.cliente[0] + '</div>' +
        '<span style="font-weight:500">' + c.cliente + '</span></div></td>' +
      '<td><div style="display:flex;align-items:center;gap:7px">' + icono + ' ' + c.mascota + '</div></td>' +
      '<td>' + c.motivo + '</td>' +
      '<td><span class="badge ' + claseBadge + '">' + c.estado + '</span></td>' +
      '<td><div style="display:flex;gap:6px">' + botonesHTML + '</div></td>';
    tbody.appendChild(fila);
  }
}

function filtrarYRenderizar() {
  var datos = [];
  for (var i = 0; i < listaCitas.length; i++) {
    if (filtroActivo === 'todas' || listaCitas[i].estado === filtroActivo) {
      datos.push(listaCitas[i]);
    }
  }
  renderCitas(datos);
}

function filterCitas(tipo, el) {
  filtroActivo = tipo;
  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  el.classList.add('active');
  filtrarYRenderizar();
}

function searchCitas(q) {
  var datos = [];
  var busq  = q.toLowerCase();
  for (var i = 0; i < listaCitas.length; i++) {
    var c = listaCitas[i];
    if (c.cliente.toLowerCase().indexOf(busq) !== -1 ||
        c.mascota.toLowerCase().indexOf(busq) !== -1 ||
        c.motivo.toLowerCase().indexOf(busq)  !== -1) {
      datos.push(c);
    }
  }
  renderCitas(datos);
}

function aceptarCita(id) {
  for (var i = 0; i < listaCitas.length; i++) {
    if (listaCitas[i].id === id) {
      listaCitas[i].estado = 'confirmada';
      break;
    }
  }
  filtrarYRenderizar();
  PetSpot.notify('✅ Cita confirmada');
}

function rechazarCita(id) {
  // Quitar del array
  var nueva = [];
  for (var i = 0; i < listaCitas.length; i++) {
    if (listaCitas[i].id !== id) nueva.push(listaCitas[i]);
  }
  listaCitas = nueva;
  filtrarYRenderizar();
  PetSpot.notify('Cita rechazada');
}

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(function(m) {
    m.classList.remove('open');
  });
}

function addCita() {
  var cliente  = document.getElementById('nueva-cliente').value;
  var mascota  = document.getElementById('nueva-mascota').value;
  var motivo   = document.getElementById('nueva-motivo').value.trim();
  var fecha    = document.getElementById('nueva-fecha').value;
  var hora     = document.getElementById('nueva-hora').value;

  if (!cliente || !mascota || !motivo || !fecha || !hora) {
    PetSpot.notify('Rellena todos los campos');
    return;
  }

  var partes = fecha.split('-');
  var fechaLegible = partes[2] + '/' + partes[1];

  var nuevaId = Date.now();
  listaCitas.push({
    id:      nuevaId,
    hora:    hora,
    fecha:   fechaLegible,
    cliente: cliente,
    mascota: mascota.split(' ')[0],
    especie: 'Perro',
    motivo:  motivo,
    estado:  'confirmada' // El vet la crea directamente como confirmada
  });

  filtrarYRenderizar();
  closeModal();
  PetSpot.notify('✅ Cita añadida correctamente');
}

filtrarYRenderizar();
