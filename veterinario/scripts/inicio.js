// PetSpot — Inicio del veterinario

PetSpot.init('veterinario');
buildVetLayout('inicio');

// Iconos
document.getElementById('icon-cal').innerHTML   = Icons.calendar;
document.getElementById('icon-euro').innerHTML  = Icons.euro;
document.getElementById('icon-users').innerHTML = Icons.users;
document.getElementById('icon-alert').innerHTML = Icons.star;

// Fecha actual (igual que en cliente)
var dias  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var hoy   = new Date();
document.getElementById('date-chip-vet').textContent =
  dias[hoy.getDay()] + ', ' + hoy.getDate() + ' de ' + meses[hoy.getMonth()] + ' ' + hoy.getFullYear();

// Stats — "Pedidos hoy" en vez de "Ingresos hoy"
var statsData = [
  { label: 'Citas hoy',      value: '8',    change: '↑ 2 más que ayer', icon: Icons.calendar },
  { label: 'Mensajes',       value: '12',   change: '3 sin responder',   icon: Icons.chat     },
  { label: 'Pedidos hoy',    value: '5',    change: '↑ 3 vs ayer',      icon: Icons.shop     },
  { label: 'Clientes activos',value: '127', change: '↑ 4 este mes',     icon: Icons.users    }
];

var statsGrid = document.getElementById('stats-grid');
for (var i = 0; i < statsData.length; i++) {
  var s = statsData[i];
  var div = document.createElement('div');
  div.className = 'stat-card';
  div.innerHTML =
    '<div class="stat-icon">' + s.icon + '</div>' +
    '<div class="stat-label">' + s.label + '</div>' +
    '<div class="stat-value">' + s.value + '</div>' +
    '<div class="stat-change">' + s.change + '</div>';
  statsGrid.appendChild(div);
}

// Citas de hoy
var hoyCitas = document.getElementById('hoy-citas');
for (var i = 0; i < MockData.vetCitas.length; i++) {
  var c = MockData.vetCitas[i];
  if (c.fecha !== 'Hoy') continue;
  var claseBadge = c.estado === 'confirmada' ? 'badge-green' : 'badge-orange';
  hoyCitas.innerHTML +=
    '<div class="cita-card">' +
      '<div class="cita-time"><div class="hour">' + c.hora + '</div><div class="date">Hoy</div></div>' +
      '<div class="cita-divider"></div>' +
      '<div class="cita-info">' +
        '<div class="cita-title">' + c.motivo + '</div>' +
        '<div class="cita-sub">' + Icons.user + ' ' + c.cliente + ' · ' + Icons.paw + ' ' + c.mascota + '</div>' +
      '</div>' +
      '<span class="badge ' + claseBadge + '">' + c.estado + '</span>' +
    '</div>';
}

// Clientes recientes
var clList = document.getElementById('clientes-list');
for (var i = 0; i < MockData.clientes.length; i++) {
  var cl = MockData.clientes[i];
  clList.innerHTML +=
    '<div class="client-row">' +
      '<div class="topbar-avatar" style="width:36px;height:36px;font-size:14px;flex-shrink:0">' + cl.nombre[0] + '</div>' +
      '<div style="flex:1">' +
        '<div style="font-size:14px;font-weight:600">' + cl.nombre + '</div>' +
        '<div style="font-size:12px;color:var(--text2)">' + cl.mascotas.join(', ') + '</div>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--text3)">' + cl.ultima + '</div>' +
    '</div>';
}

// Alertas
var alertas = [
  { tipo: 'warning', title: '⚠️ Stock bajo',      sub: 'Vitaminas K9 Pro — 18 unidades' },
  { tipo: 'accent',  title: '💬 Mensaje nuevo',    sub: 'Ana González — hace 5 min'      },
  { tipo: 'info',    title: '📅 Recordatorio',     sub: 'Próxima cita en 30 min — Kira'  }
];
var colores = {
  warning: { bg: 'rgba(255,165,0,0.1)',    border: 'rgba(255,165,0,0.3)',    color: '#ffa500'        },
  accent:  { bg: 'var(--accent-light)',    border: 'var(--accent)',          color: 'var(--accent)'  },
  info:    { bg: 'rgba(83,184,202,0.1)',   border: 'rgba(83,184,202,0.3)',   color: '#53B8CA'        }
};
var alertsList = document.getElementById('alerts-list');
for (var i = 0; i < alertas.length; i++) {
  var a  = alertas[i];
  var cl = colores[a.tipo];
  alertsList.innerHTML +=
    '<div class="alert-item" style="background:' + cl.bg + ';border:1px solid ' + cl.border + '">' +
      '<div class="alert-item-title" style="color:' + cl.color + '">' + a.title + '</div>' +
      '<div class="alert-item-sub">' + a.sub + '</div>' +
    '</div>';
}

// Gráfica de barras (sin pointer-events para que no tenga cursor de clic)
var vals  = [180, 220, 310, 280, 340, 190, 320];
var dias7 = ['L','M','X','J','V','S','D'];
var maxVal = 0;
for (var i = 0; i < vals.length; i++) {
  if (vals[i] > maxVal) maxVal = vals[i];
}
var chart  = document.getElementById('ingr-chart');
var labels = document.getElementById('ingr-labels');
for (var i = 0; i < vals.length; i++) {
  var h = Math.round((vals[i] / maxVal) * 76);
  // pointer-events:none para que no parezca clicable
  chart.innerHTML  += '<div class="bar-col ' + (i === 4 ? 'today' : '') + '" style="height:' + h + 'px;pointer-events:none"></div>';
  labels.innerHTML += '<span>' + dias7[i] + '</span>';
}
