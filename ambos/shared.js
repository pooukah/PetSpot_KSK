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

// ============================================================
// DATOS DE PRUEBA
// ============================================================
var MockData = {

  mascotas: [
    { id: 1, nombre: 'Luna', especie: 'Perro',  raza: 'Labrador', peso: '28',  nacimiento: '12/03/2019', microchip: '724099234000012', type: 'dog'    },
    { id: 2, nombre: 'Miso', especie: 'Gato',   raza: 'Siamés',   peso: '4.2', nacimiento: '05/07/2021', microchip: '724099234000087', type: 'cat'    },
    { id: 3, nombre: 'Coco', especie: 'Conejo', raza: 'Mini Rex', peso: '1.8', nacimiento: '22/11/2022', microchip: '724099234000124', type: 'rabbit' }
  ],

  citas: [
    { id: 1, hora: '09:30', fecha: 'Hoy',    veterinario: 'Dra. García',  mascota: 'Luna', motivo: 'Revisión anual',  estado: 'confirmada', clinica: 'Clínica VetPro'     },
    { id: 2, hora: '16:00', fecha: 'Mañana', veterinario: 'Dr. Martínez', mascota: 'Miso', motivo: 'Vacunación',      estado: 'pendiente',  clinica: 'VetSalut Barcelona' },
    { id: 3, hora: '11:00', fecha: '22/03',  veterinario: 'Dra. López',   mascota: 'Coco', motivo: 'Control peso',    estado: 'confirmada', clinica: 'AnimaCare Vet'      },
    { id: 4, hora: '10:00', fecha: '15/02',  veterinario: 'Dra. García',  mascota: 'Luna', motivo: 'Desparasitación', estado: 'completada', clinica: 'Clínica VetPro'     },
    { id: 5, hora: '17:30', fecha: '08/01',  veterinario: 'Dr. Martínez', mascota: 'Miso', motivo: 'Revisión dental', estado: 'completada', clinica: 'VetSalut Barcelona' }
  ],

  chats: [
    { id: 1, nombre: 'Dra. García',    ultimo: 'Recuerde traer el historial', hora: '10:32', unread: 2 },
    { id: 2, nombre: 'Dr. Martínez',   ultimo: 'La vacuna está lista',         hora: 'Ayer',  unread: 0 },
    { id: 3, nombre: 'Clínica VetPro', ultimo: 'Su cita ha sido confirmada',   hora: 'Lun',   unread: 1 }
  ],

  mensajesCliente: {
    1: [
      { texto: 'Hola, ¿cómo está Luna después de la última visita?', hora: '10:15', tipo: 'recv' },
      { texto: 'Muy bien gracias, come con más apetito',             hora: '10:18', tipo: 'sent' },
      { texto: 'Perfecto. Recuerde traer el historial de vacunas.', hora: '10:32', tipo: 'recv' }
    ]
  },

  productos: [
    { id: 1, nombre: 'Pienso Premium Adulto', precio: 38.99, stock: 45, ventas: 120, cat: 'Alimentación', visible: true, imagen: null },
    { id: 2, nombre: 'Collar Antipulgas',      precio: 14.50, stock: 32, ventas: 89,  cat: 'Salud',        visible: true, imagen: null },
    { id: 3, nombre: 'Vitaminas K9 Pro',       precio: 22.00, stock: 18, ventas: 67,  cat: 'Salud',        visible: true, imagen: null },
    { id: 4, nombre: 'Arnés Ergonómico',       precio: 29.95, stock: 12, ventas: 43,  cat: 'Accesorios',   visible: true, imagen: null },
    { id: 5, nombre: 'Arena Sílice Gato',      precio: 11.99, stock: 60, ventas: 210, cat: 'Higiene',      visible: true, imagen: null },
    { id: 6, nombre: 'Champú Hipoalergénico',  precio: 8.75,  stock: 28, ventas: 55,  cat: 'Higiene',      visible: true, imagen: null },
    { id: 7, nombre: 'Juguete Interactivo',    precio: 16.50, stock: 35, ventas: 78,  cat: 'Juguetes',     visible: true, imagen: null },
    { id: 8, nombre: 'Cama Ortopédica M',      precio: 54.00, stock: 8,  ventas: 31,  cat: 'Descanso',     visible: true, imagen: null }
  ],

  clinicas: [
    { id: 0, nombre: 'Clínica VetPro',          dir: 'Carrer de Balmes, 120',      dist: '0.3 km', rating: 4.9, abierta: true,  h24: false, urgencias: true,  tel: '932 456 789', lat: 41.3940, lng: 2.1511 },
    { id: 1, nombre: 'VetSalut Barcelona',      dir: 'Av. Diagonal, 450',          dist: '0.8 km', rating: 4.7, abierta: true,  h24: true,  urgencias: true,  tel: '934 123 456', lat: 41.3948, lng: 2.1565 },
    { id: 2, nombre: 'AnimaCare Vet',           dir: 'Carrer de Provença, 88',     dist: '1.2 km', rating: 4.5, abierta: false, h24: false, urgencias: false, tel: '933 987 654', lat: 41.3922, lng: 2.1575 },
    { id: 3, nombre: 'Hospital Veterinari BCN', dir: 'Gran Via de les Corts, 600', dist: '2.1 km', rating: 4.8, abierta: true,  h24: true,  urgencias: true,  tel: '931 234 567', lat: 41.3800, lng: 2.1510 }
  ],

  clientes: [
    { id: 1, nombre: 'María Fernández',  mascotas: ['Kira (Perro)', 'Mimo (Gato)'],     ultima: '14/03/2026', proxima: 'Hoy 09:30'    },
    { id: 2, nombre: 'Jordi Puig',       mascotas: ['Rocky (Perro)'],                   ultima: '10/03/2026', proxima: 'Mañana 16:00' },
    { id: 3, nombre: 'Ana González',     mascotas: ['Perla (Gato)', 'Bomba (Hámster)'], ultima: '05/03/2026', proxima: '22/03 11:00'  },
    { id: 4, nombre: 'Carlos Rodríguez', mascotas: ['Max (Perro)'],                     ultima: '01/03/2026', proxima: '-'            }
  ],

  vetCitas: [
    { id: 1, hora: '09:30', fecha: 'Hoy',    cliente: 'María Fernández',  mascota: 'Kira',  especie: 'Perro', motivo: 'Revisión anual',  estado: 'confirmada' },
    { id: 2, hora: '11:00', fecha: 'Hoy',    cliente: 'Jordi Puig',       mascota: 'Rocky', especie: 'Perro', motivo: 'Vacunación',       estado: 'pendiente'  },
    { id: 3, hora: '12:30', fecha: 'Hoy',    cliente: 'Ana González',     mascota: 'Perla', especie: 'Gato',  motivo: 'Control peso',     estado: 'pendiente'  },
    { id: 4, hora: '16:00', fecha: 'Mañana', cliente: 'Jordi Puig',       mascota: 'Rocky', especie: 'Perro', motivo: 'Seguimiento',      estado: 'confirmada' },
    { id: 5, hora: '09:00', fecha: '22/03',  cliente: 'Carlos Rodríguez', mascota: 'Max',   especie: 'Perro', motivo: 'Urgencia',         estado: 'pendiente'  }
  ],

  vetChats: [
    { id: 1, nombre: 'María Fernández', rol: 'Propietaria de Kira',  ultimo: '¿Puedo darle el medicamento con comida?', hora: '11:45', unread: 1 },
    { id: 2, nombre: 'Jordi Puig',      rol: 'Propietario de Rocky', ultimo: 'Gracias por la atención',                  hora: '09:20', unread: 0 },
    { id: 3, nombre: 'Ana González',    rol: 'Propietaria de Perla', ultimo: 'El gato sigue con fiebre',                 hora: 'Ayer',  unread: 2 }
  ],

  vetMsgs: {
    1: [
      { texto: '¿Puede traer a Kira mañana a las 9:30?',                hora: '11:20', tipo: 'sent' },
      { texto: 'Sí, estaremos allí. ¿Debo darle el medicamento antes?', hora: '11:35', tipo: 'recv' },
      { texto: 'No, evite dárselo las 2 horas previas a la consulta.',  hora: '11:40', tipo: 'sent' },
      { texto: '¿Puedo darle el medicamento con comida?',                hora: '11:45', tipo: 'recv' }
    ],
    2: [
      { texto: 'La vacuna de Rocky está lista. ¿Cuándo puede venir?', hora: '09:00', tipo: 'sent' },
      { texto: 'Gracias por la atención, mañana pasamos.',             hora: '09:20', tipo: 'recv' }
    ],
    3: [
      { texto: 'He revisado el historial de Perla. Necesito verla urgente.', hora: '08:00', tipo: 'sent' },
      { texto: 'El gato sigue con fiebre, ¿qué le doy?',                     hora: '08:45', tipo: 'recv' }
    ]
  }

};
