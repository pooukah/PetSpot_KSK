// PetSpot — Construye el sidebar y el topbar de cada página

function buildClienteLayout(paginaActiva) {
  var nav = [
    { id: 'inicio',  icon: Icons.home,     label: 'Inicio',   href: 'inicio.html'  },
    { id: 'citas',   icon: Icons.calendar, label: 'Citas',    href: 'citas.html',  badge: '2' },
    { id: 'chat',    icon: Icons.chat,     label: 'Chat',     href: 'chat.html',   badge: '3' },
    { id: 'mapa',    icon: Icons.map,      label: 'Mapa',     href: 'mapa.html'    },
    { id: 'tienda',  icon: Icons.shop,     label: 'Tienda',   href: 'tienda.html'  },
    { id: 'perfil',  icon: Icons.user,     label: 'Mi Perfil',href: 'perfil.html'  }
  ];
  construirLayout(paginaActiva, nav, 'cliente');
}

function buildVetLayout(paginaActiva) {
  var plan = PetSpot.getPlan();
  var nav = [
    { id: 'inicio',      icon: Icons.home,     label: 'Inicio',      href: 'inicio.html'       },
    { id: 'citas',       icon: Icons.calendar, label: 'Citas',       href: 'citas.html',        badge: '3' },
    { id: 'chat',        icon: Icons.chat,     label: 'Chat',        href: 'chat.html',         badge: '2' },
    { id: 'tienda',      icon: Icons.shop,     label: 'Tienda',      href: 'tienda.html'        },
    { id: 'suscripcion', icon: Icons.card,     label: 'Suscripción', href: 'suscripcion.html'   },
    { id: 'perfil',      icon: Icons.user,     label: 'Mi Perfil',   href: 'perfil.html'        }
  ];
  // Analíticas solo aparece si tiene plan Enterprise
  if (plan === 'enterprise') {
    // Insertar antes de suscripción
    nav.splice(4, 0, { id: 'analiticas', icon: Icons.chart, label: 'Analíticas', href: 'analiticas.html' });
  }
  construirLayout(paginaActiva, nav, 'veterinario');
}

function construirLayout(paginaActiva, nav, tipo) {
  var oscuro = localStorage.getItem('ps_dark') !== 'false';

  // ── SIDEBAR ──
  var sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  // Construir los items del menú
  var itemsHTML = '';
  for (var i = 0; i < nav.length; i++) {
    var n = nav[i];
    var activo = n.id === paginaActiva ? 'active' : '';
    var badge = n.badge ? '<span class="nav-badge">' + n.badge + '</span>' : '';
    itemsHTML += '<a href="' + n.href + '" class="nav-item ' + activo + '">' +
      n.icon + '<span>' + n.label + '</span>' + badge + '</a>';
  }

  sidebar.innerHTML =
    '<div class="sidebar-logo">' +
      '<div class="logo-icon">' + Icons.logoPaw + '</div>' +
      '<span class="logo-name">PetSpot</span>' +
    '</div>' +
    '<nav class="sidebar-nav">' +
      '<div class="nav-label">Menú</div>' +
      itemsHTML +
    '</nav>' +
    '<div class="sidebar-bottom">' +
      '<div class="theme-toggle-row">' +
        '<span id="theme-icon-svg">' + (oscuro ? Icons.moon : Icons.sun) + '</span>' +
        '<span id="theme-label">' + (oscuro ? 'Modo claro' : 'Modo oscuro') + '</span>' +
        '<div class="toggle-switch ' + (!oscuro ? 'on' : '') + '" id="theme-toggle"></div>' +
      '</div>' +
      '<button class="btn-logout" id="logout-btn">' +
        Icons.logout + '<span>Cerrar sesión</span>' +
      '</button>' +
    '</div>';

  // ── TOPBAR ──
  var topbar = document.createElement('header');
  topbar.className = 'topbar';
  topbar.innerHTML =
    '<div id="topbar-greeting" class="topbar-greeting">Hola</div>' +
    '<div class="topbar-spacer"></div>' +
    '<div class="topbar-avatar" id="topbar-avatar" title="Mi perfil" style="cursor:pointer">U</div>';

  // Insertar en el body (sidebar primero para que quede a la izquierda)
  document.body.insertBefore(topbar, document.body.firstChild);
  document.body.insertBefore(sidebar, document.body.firstChild);

  // ── Saludo con nombre del usuario ──
  PetSpot.setTopbar();

  // ── Avatar → va al perfil ──
  document.getElementById('topbar-avatar').addEventListener('click', function() {
    window.location.href = 'perfil.html';
  });

  // ── Toggle de tema ──
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      PetSpot.toggleTheme();
      var ahora = localStorage.getItem('ps_dark') !== 'false';
      toggle.classList.toggle('on', !ahora);
      document.getElementById('theme-label').textContent = ahora ? 'Modo claro' : 'Modo oscuro';
      // Cambiar icono
      var iconSpan = document.getElementById('theme-icon-svg');
      if (iconSpan) iconSpan.innerHTML = ahora ? Icons.moon : Icons.sun;
    });
  }

  // ── Botón cerrar sesión ──
  var logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      PetSpot.logout();
    });
  }
}
