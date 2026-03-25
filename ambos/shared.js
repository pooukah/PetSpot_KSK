// PetSpot — Funciones compartidas
// Guardamos los datos del usuario en sessionStorage

var PetSpot = {

  getUser: function() {
    var datos = sessionStorage.getItem('ps_user');
    if (datos) return JSON.parse(datos);
    return null;
  },

  setUser: function(usuario) {
    sessionStorage.setItem('ps_user', JSON.stringify(usuario));
  },

  logout: function() {
    sessionStorage.clear();
    var partes = window.location.pathname.split('/');
    if (partes.length >= 4) {
      window.location.href = '../../index.html';
    } else {
      window.location.href = '../index.html';
    }
  },

  applyTheme: function() {
    var user = this.getUser();
    if (!user) return;
    document.body.classList.remove('cliente', 'veterinario');
    document.body.classList.add(user.tipo);
    var oscuro = localStorage.getItem('ps_dark') !== 'false';
    document.body.classList.toggle('modoclaro', !oscuro);
  },

  toggleTheme: function() {
    var oscuro = localStorage.getItem('ps_dark') !== 'false';
    localStorage.setItem('ps_dark', oscuro ? 'false' : 'true');
    document.body.classList.toggle('modoclaro', oscuro);
  },

  requireAuth: function(tipo) {
    var user = this.getUser();
    var partes = window.location.pathname.split('/');
    var raiz = partes.length >= 4 ? '../../' : '../';
    if (!user) {
      window.location.href = raiz + 'index.html';
      return false;
    }
    if (tipo && user.tipo !== tipo) {
      if (user.tipo === 'cliente') {
        window.location.href = raiz + 'cliente/htmls/inicio.html';
      } else {
        window.location.href = raiz + 'veterinario/htmls/inicio.html';
      }
      return false;
    }
    return true;
  },

  notify: function(mensaje) {
    var notif = document.querySelector('.notif');
    if (!notif) {
      notif = document.createElement('div');
      notif.className = 'notif';
      document.body.appendChild(notif);
    }
    notif.textContent = mensaje;
    notif.classList.add('show');
    clearTimeout(notif._timer);
    notif._timer = setTimeout(function() {
      notif.classList.remove('show');
    }, 3200);
  },

  setTopbar: function() {
    var user = this.getUser();
    if (!user) return;
    var saludo = document.getElementById('topbar-greeting');
    if (saludo) {
      if (user.tipo === 'veterinario') {
        saludo.innerHTML = 'Bienvenido, <strong>Dr./Dra. ' + user.nombre + '</strong>';
      } else {
        saludo.innerHTML = 'Hola, <strong>' + user.nombre + '</strong>';
      }
    }
    var avatar = document.getElementById('topbar-avatar');
    if (avatar) {
      avatar.textContent = user.nombre ? user.nombre[0].toUpperCase() : 'U';
    }
  },

  init: function(tipo) {
    if (!this.requireAuth(tipo)) return;
    this.applyTheme();
  },

  getPlan: function() {
    return localStorage.getItem('ps_plan') || 'basico';
  },

  setPlan: function(plan) {
    localStorage.setItem('ps_plan', plan);
  }

};

