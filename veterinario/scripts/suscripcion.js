// PetSpot — Suscripción del veterinario

PetSpot.init('veterinario');
buildVetLayout('suscripcion');

document.getElementById('icon-check-chip').innerHTML = Icons.check;
document.getElementById('icon-card').innerHTML       = Icons.card;

// Plan actual guardado
var planActual = PetSpot.getPlan();

var planes = [
  {
    id:    'basico',
    name:  'Básico',
    desc:  'Para clínicas pequeñas',
    price: '29€',
    period: '/mes',
    features: [
      { text: 'Agenda de citas',          on: true  },
      { text: 'Hasta 50 clientes',        on: true  },
      { text: 'Chat limitado (100/mes)',   on: true  },
      { text: 'Perfil de clínica',         on: true  },
      { text: 'Marketplace',              on: false },
      { text: 'Historial médico',         on: false },
      { text: 'Analíticas',              on: false },
      { text: 'Multi-sede / API',         on: false }
    ]
  },
  {
    id:    'profesional',
    name:  'Profesional',
    desc:  'Para clínicas en crecimiento',
    price: '79€',
    period: '/mes',
    popular: true,
    features: [
      { text: 'Todo lo del plan Básico',  on: true  },
      { text: 'Clientes ilimitados',      on: true  },
      { text: 'Chat ilimitado',           on: true  },
      { text: 'Marketplace',              on: true  },
      { text: 'Historial médico completo',on: true  },
      { text: 'Analíticas básicas',       on: true  },
      { text: 'Soporte prioritario',      on: false },
      { text: 'Multi-sede / API',         on: false }
    ]
  },
  {
    id:    'enterprise',
    name:  'Enterprise',
    desc:  'Para grupos veterinarios',
    price: 'A medida',
    period: '',
    features: [
      { text: 'Todo lo del plan Pro',     on: true },
      { text: 'Multi-sede',               on: true },
      { text: 'API de integración',       on: true },
      { text: 'Analíticas avanzadas',     on: true },
      { text: 'Soporte prioritario 24/7', on: true },
      { text: 'SLA garantizado',          on: true }
    ]
  }
];

function renderPlanes() {
  var grid = document.getElementById('plans-grid');
  grid.innerHTML = '';

  for (var i = 0; i < planes.length; i++) {
    var p      = planes[i];
    var actual = planActual === p.id;

    // Badge encima de la tarjeta
    var badgeHTML = '';
    if (actual) {
      badgeHTML = '<div class="plan-badge current-badge">✓ Tu plan actual</div>';
    } else if (p.popular) {
      badgeHTML = '<div class="plan-badge popular-badge">⭐ Más popular</div>';
    }

    // Lista de características
    var featHTML = '';
    for (var j = 0; j < p.features.length; j++) {
      var f = p.features[j];
      featHTML +=
        '<li class="' + (f.on ? 'enabled' : 'disabled') + '">' +
          (f.on ? Icons.check : Icons.x) +
          ' ' + f.text +
        '</li>';
    }

    // Botón
    var btnHTML = '';
    if (actual) {
      btnHTML = '<button class="btn btn-ghost" style="width:100%;justify-content:center;opacity:0.7" disabled>Plan actual</button>';
    } else if (p.id === 'enterprise') {
      btnHTML = '<button class="btn btn-ghost" style="width:100%;justify-content:center" onclick="contactarVentas()">Contactar ventas</button>';
    } else {
      btnHTML = '<button class="btn btn-primary" style="width:100%;justify-content:center" onclick="cambiarPlan(\'' + p.id + '\')">Cambiar a este plan</button>';
    }

    var card = document.createElement('div');
    card.className = 'plan-card' + (actual ? ' current-plan' : '') + (p.popular && !actual ? ' popular-plan' : '');
    card.id = 'plan-card-' + p.id;
    card.innerHTML =
      badgeHTML +
      '<div class="plan-icon">' + Icons.box + '</div>' +
      '<div class="plan-name">' + p.name + '</div>' +
      '<div class="plan-desc">' + p.desc + '</div>' +
      '<div class="plan-price">' +
        '<span class="amount">' + p.price + '</span>' +
        '<span class="period">' + p.period + '</span>' +
      '</div>' +
      '<ul class="plan-features">' + featHTML + '</ul>' +
      btnHTML;
    grid.appendChild(card);
  }
}

function cambiarPlan(nuevoPlan) {
  // Guardar nuevo plan
  PetSpot.setPlan(nuevoPlan);
  planActual = nuevoPlan;

  // Re-renderizar las tarjetas
  renderPlanes();

  // Si es enterprise, añadir Analíticas al sidebar recargando la página
  // (el sidebar ya lo gestiona buildVetLayout según el plan)
  PetSpot.notify('✅ Plan cambiado a ' + nuevoPlan.charAt(0).toUpperCase() + nuevoPlan.slice(1) + '. Recargando...');
  setTimeout(function() {
    window.location.reload();
  }, 1500);
}

function contactarVentas() {
  PetSpot.notify('📧 Te contactaremos en breve en dr.garcia@vetpro.es');
}

// Historial de facturación
var billing = [
  { fecha: '17/03/2026', plan: 'Básico', importe: '29.00€' },
  { fecha: '17/02/2026', plan: 'Básico', importe: '29.00€' },
  { fecha: '17/01/2026', plan: 'Básico', importe: '29.00€' }
];
var tbody = document.getElementById('billing-body');
for (var i = 0; i < billing.length; i++) {
  var b = billing[i];
  tbody.innerHTML +=
    '<tr>' +
      '<td>' + b.fecha + '</td>' +
      '<td>' + b.plan + '</td>' +
      '<td><strong>' + b.importe + '</strong></td>' +
      '<td><span class="badge badge-green">pagado</span></td>' +
      '<td><button class="btn btn-ghost btn-sm">' + Icons.send + ' PDF</button></td>' +
    '</tr>';
}

renderPlanes();

// Actualizar el chip del plan actual
var chipEl = document.getElementById('current-plan-name');
if (chipEl) {
  chipEl.textContent = planActual.charAt(0).toUpperCase() + planActual.slice(1);
}
