// PetSpot — Chat del cliente

PetSpot.init('cliente');
buildClienteLayout('chat');

document.getElementById('icon-search').innerHTML = Icons.search;
document.getElementById('btn-send').innerHTML    = Icons.send;

var chatActivo = 1;

function construirListaChats() {
  var contenedor = document.getElementById('chat-list-items');
  contenedor.innerHTML = '';

  for (var i = 0; i < MockData.chats.length; i++) {
    var c = MockData.chats[i];
    var el = document.createElement('div');
    el.className = 'chat-item' + (c.id === chatActivo ? ' active' : '');
    el.dataset.id = c.id;

    var badgeHTML = c.unread > 0
      ? '<span class="chat-unread" id="unread-' + c.id + '">' + c.unread + '</span>'
      : '';

    el.innerHTML =
      '<div class="topbar-avatar" style="width:38px;height:38px;font-size:15px;flex-shrink:0;border-radius:50%">' + c.nombre[0] + '</div>' +
      '<div style="flex:1;min-width:0">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px">' +
          '<span class="chat-item-name">' + c.nombre + '</span>' +
          '<span class="chat-item-time">' + c.hora + '</span>' +
        '</div>' +
        '<div class="chat-item-msg">' + c.ultimo + '</div>' +
      '</div>' +
      badgeHTML;

    // Necesitamos una función separada para evitar el problema del closure en bucles
    el.addEventListener('click', crearHandlerChat(c.id));
    contenedor.appendChild(el);
  }
}

// Función auxiliar para crear el handler sin problemas de closure
function crearHandlerChat(id) {
  return function() {
    abrirChat(id);
  };
}

function abrirChat(id) {
  chatActivo = id;

  // Marcar como activo en la lista
  var items = document.querySelectorAll('.chat-item');
  for (var i = 0; i < items.length; i++) {
    items[i].classList.toggle('active', parseInt(items[i].dataset.id) === id);
  }

  // Quitar el indicador de mensajes no leídos al abrir
  var badge = document.getElementById('unread-' + id);
  if (badge) badge.remove();

  // Poner nombre del chat
  var chat = null;
  for (var i = 0; i < MockData.chats.length; i++) {
    if (MockData.chats[i].id === id) {
      chat = MockData.chats[i];
      break;
    }
  }
  if (!chat) return;

  document.getElementById('chat-name').textContent = chat.nombre;
  document.getElementById('chat-av').textContent   = chat.nombre[0];

  // Cargar mensajes
  var mensajes = MockData.mensajesCliente[id] || [];
  var contenedor = document.getElementById('chat-messages');
  contenedor.innerHTML = '';
  for (var i = 0; i < mensajes.length; i++) {
    agregarBurbuja(mensajes[i].texto, mensajes[i].hora, mensajes[i].tipo);
  }
  contenedor.scrollTop = contenedor.scrollHeight;
}

function agregarBurbuja(texto, hora, tipo) {
  var contenedor = document.getElementById('chat-messages');
  var div = document.createElement('div');
  div.className = 'msg ' + tipo;
  div.innerHTML = '<div class="msg-bubble">' + texto + '</div><div class="msg-time">' + hora + '</div>';
  contenedor.appendChild(div);
  contenedor.scrollTop = contenedor.scrollHeight;
}

function sendMsg() {
  var input = document.getElementById('msg-input');
  var texto = input.value.trim();
  if (!texto) return;

  var ahora = new Date();
  var hora  = ahora.getHours() + ':' + String(ahora.getMinutes()).padStart(2, '0');
  agregarBurbuja(texto, hora, 'sent');
  input.value = '';
  // Sin respuesta automática — se conectará a la API en el futuro
}

construirListaChats();
abrirChat(1);
