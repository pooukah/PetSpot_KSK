// PetSpot — Analíticas (solo plan Enterprise)

PetSpot.init('veterinario');

// Comprobar plan (solo Enterprise accede aquí)
var plan = PetSpot.getPlan();
if (plan !== 'enterprise') {
  // Redirigir a suscripción si no tiene el plan
  window.location.href = 'suscripcion.html';
}

buildVetLayout('analiticas');

document.getElementById('icon-export').innerHTML     = Icons.send;
document.getElementById('icon-paw-chart').innerHTML  = Icons.paw;
document.getElementById('icon-steth').innerHTML      = Icons.stethoscope;
document.getElementById('icon-cal-chart').innerHTML  = Icons.calendar;
document.getElementById('icon-euro-chart').innerHTML = Icons.euro;
document.getElementById('icon-dog-chart').innerHTML  = Icons.dog;
document.getElementById('icon-cat-chart').innerHTML  = Icons.cat;

// KPIs — sin "clientes activos"
var kpis = [
  { value: '342',   label: 'Citas este mes'   },
  { value: '8,240€',label: 'Ingresos mes'     },
  { value: '4.8 ★', label: 'Valoración media' },
  { value: '89%',   label: 'Tasa de retorno'  }
];
var kpiRow = document.getElementById('kpi-row');
for (var i = 0; i < kpis.length; i++) {
  kpiRow.innerHTML +=
    '<div class="kpi-card">' +
      '<div class="kpi-value">' + kpis[i].value + '</div>' +
      '<div class="kpi-label">' + kpis[i].label + '</div>' +
    '</div>';
}

// Leyenda donut
var species = [
  { label: 'Perros',  pct: '55%', color: 'var(--accent)' },
  { label: 'Gatos',   pct: '28%', color: '#53B8CA'        },
  { label: 'Conejos', pct: '12%', color: '#f0c040'        },
  { label: 'Otros',   pct: '5%',  color: '#f0a080'        }
];
var legend = document.getElementById('donut-legend');
for (var i = 0; i < species.length; i++) {
  var s = species[i];
  legend.innerHTML +=
    '<div class="legend-row">' +
      '<div class="legend-dot" style="background:' + s.color + '"></div>' +
      '<span style="color:var(--text2)">' + s.label + '</span>' +
      '<span class="legend-pct">' + s.pct + '</span>' +
    '</div>';
}

// Motivos de consulta generales
var motivos = [
  { label: 'Revisión anual', val: 89, color: 'var(--accent)' },
  { label: 'Vacunación',     val: 67, color: '#53B8CA'        },
  { label: 'Dermatitis',     val: 34, color: '#f0c040'        },
  { label: 'Gastroenteritis',val: 28, color: '#f0a080'        },
  { label: 'Traumatismo',    val: 19, color: '#c080f0'        },
  { label: 'Dental',         val: 15, color: '#80c0f0'        }
];
var maxM = 0;
for (var i = 0; i < motivos.length; i++) {
  if (motivos[i].val > maxM) maxM = motivos[i].val;
}
var motivosEl = document.getElementById('motivos-chart');
for (var i = 0; i < motivos.length; i++) {
  var m = motivos[i];
  motivosEl.innerHTML +=
    '<div class="motivo-row">' +
      '<div class="motivo-label">' + m.label + '</div>' +
      '<div class="motivo-track"><div class="motivo-fill" style="width:' + Math.round(m.val/maxM*100) + '%;background:' + m.color + '"></div></div>' +
      '<div class="motivo-val">' + m.val + '</div>' +
    '</div>';
}

// Distribución por edad
var ages = [
  { label: '0-1a',  val: 18, color: 'var(--accent)' },
  { label: '1-3a',  val: 32, color: '#53B8CA'        },
  { label: '3-6a',  val: 42, color: 'var(--accent)' },
  { label: '6-9a',  val: 24, color: '#53B8CA'        },
  { label: '9-12a', val: 8,  color: 'var(--accent)' },
  { label: '+12a',  val: 3,  color: '#f0a080'        }
];
var maxA = 0;
for (var i = 0; i < ages.length; i++) {
  if (ages[i].val > maxA) maxA = ages[i].val;
}
var ageEl = document.getElementById('age-chart');
for (var i = 0; i < ages.length; i++) {
  var a = ages[i];
  var h = Math.round((a.val / maxA) * 96);
  ageEl.innerHTML +=
    '<div class="age-bar-wrap">' +
      '<div class="age-bar" style="height:' + h + 'px;background:' + a.color + ';opacity:0.85"></div>' +
      '<div class="age-bar-label">' + a.label + '</div>' +
    '</div>';
}

// Ingresos mensuales
var monthly = [
  { label: 'Ene', val: 6200,  current: false },
  { label: 'Feb', val: 7100,  current: false },
  { label: 'Mar', val: 8240,  current: true  }
];
var maxMo = 0;
for (var i = 0; i < monthly.length; i++) {
  if (monthly[i].val > maxMo) maxMo = monthly[i].val;
}
var moEl    = document.getElementById('monthly-chart');
var futuros = ['Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
for (var i = 0; i < monthly.length; i++) {
  var mo = monthly[i];
  var h  = Math.round((mo.val / maxMo) * 96);
  moEl.innerHTML +=
    '<div class="month-bar-wrap">' +
      '<div class="month-value">' + (mo.val/1000).toFixed(1) + 'k€</div>' +
      '<div class="month-bar ' + (mo.current ? 'current' : '') + '" style="height:' + h + 'px"></div>' +
      '<div class="month-label">' + mo.label + '</div>' +
    '</div>';
}
for (var i = 0; i < futuros.length; i++) {
  moEl.innerHTML +=
    '<div class="month-bar-wrap" style="opacity:0.25">' +
      '<div class="month-value" style="visibility:hidden">—</div>' +
      '<div style="width:100%;height:14px;border-radius:5px 5px 0 0;background:var(--bg3);border-top:2px dashed var(--border)"></div>' +
      '<div class="month-label">' + futuros[i] + '</div>' +
    '</div>';
}

// ── ANALÍTICAS PROFUNDAS POR ESPECIE ──

// Enfermedades en PERROS
var dogConditions = [
  { label: 'Dermatitis',       val: 28, color: '#f0c040' },
  { label: 'Displasia de cadera', val: 18, color: '#f0a080' },
  { label: 'Otitis',           val: 15, color: '#c080f0' },
  { label: 'Obesidad',         val: 12, color: '#80c0f0' },
  { label: 'Epilepsia',        val: 7,  color: '#f08060' }
];
var maxDog = 28;
var dogEl = document.getElementById('dog-conditions');
for (var i = 0; i < dogConditions.length; i++) {
  var d = dogConditions[i];
  dogEl.innerHTML +=
    '<div class="motivo-row">' +
      '<div class="motivo-label" style="width:130px">' + d.label + '</div>' +
      '<div class="motivo-track"><div class="motivo-fill" style="width:' + Math.round(d.val/maxDog*100) + '%;background:' + d.color + '"></div></div>' +
      '<div class="motivo-val">' + d.val + '</div>' +
    '</div>';
}

// Enfermedades en GATOS
var catConditions = [
  { label: 'Enfermedad renal',  val: 22, color: '#53B8CA' },
  { label: 'Gingivitis',        val: 17, color: '#f0a080' },
  { label: 'Hipertiroidismo',   val: 11, color: '#c080f0' },
  { label: 'Urolitiasis',       val: 9,  color: '#f0c040' },
  { label: 'Anemia',            val: 5,  color: '#f08060' }
];
var maxCat = 22;
var catEl  = document.getElementById('cat-conditions');
for (var i = 0; i < catConditions.length; i++) {
  var ca = catConditions[i];
  catEl.innerHTML +=
    '<div class="motivo-row">' +
      '<div class="motivo-label" style="width:130px">' + ca.label + '</div>' +
      '<div class="motivo-track"><div class="motivo-fill" style="width:' + Math.round(ca.val/maxCat*100) + '%;background:' + ca.color + '"></div></div>' +
      '<div class="motivo-val">' + ca.val + '</div>' +
    '</div>';
}

// Tratamientos más prescritos
var tratamientos = [
  { label: 'Antibióticos',      val: 54, especie: 'Perro + Gato' },
  { label: 'Antiparasitarios',  val: 48, especie: 'Todos'         },
  { label: 'Antiinflamatorios', val: 37, especie: 'Perro'         },
  { label: 'Vacuna rabia',      val: 29, especie: 'Perro + Gato' },
  { label: 'Corticoides',       val: 21, especie: 'Perro'         },
  { label: 'Probióticos',       val: 18, especie: 'Todos'         }
];
var tBody = document.getElementById('tratamientos-body');
for (var i = 0; i < tratamientos.length; i++) {
  var t = tratamientos[i];
  tBody.innerHTML +=
    '<tr>' +
      '<td><strong>' + t.label + '</strong></td>' +
      '<td style="color:var(--text2)">' + t.especie + '</td>' +
      '<td><strong style="color:var(--accent)">' + t.val + '</strong></td>' +
    '</tr>';
}
