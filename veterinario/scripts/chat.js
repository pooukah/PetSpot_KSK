// PetSpot — Chat del veterinario

PetSpot.init('veterinario');
buildVetLayout('chat');

document.getElementById('icon-search').innerHTML = Icons.search;
document.getElementById('btn-send').innerHTML    = Icons.send;

var chatActivo = 1;

function construirListaChats() {
  var contenedor = document.getElementById('chat-list-items');
  contenedor.innerHTML = '';

  for (var i = 0; i < MockData.vetChats.length; i++) {
    var c  = MockData.vetChats[i];
    var el = document.createElement('div');
    el.className = 'chat-item' + (c.id === chatActivo ? ' active' : '');
    el.dataset.id = c.id;
    el.innerHTML =
      '<div class="topbar-avatar" style="width:38px;height:38px;font-size:15px;flex-shrink:0;border-radius:50%">' + c.nombre[0] + '</div>' +
      '<div style="flex:1;min-width:0">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px">' +
          '<span class="chat-item-name">' + c.nombre + '</span>' +
          '<span class="chat-item-time">' + c.hora + '</span>' +
        '</div>' +
        '<div class="chat-item-msg">' + c.ultimo + '</div>' +
      '</div>';
    // Sin badge de mensajes no leídos
    el.addEventListener('click', crearHandlerChat(c.id));
    contenedor.appendChild(el);
  }
}

function crearHandlerChat(id) {
  return function() { abrirChat(id); };
}

function abrirChat(id) {
  chatActivo = id;

  var items = document.querySelectorAll('.chat-item');
  for (var i = 0; i < items.length; i++) {
    items[i].classList.toggle('active', parseInt(items[i].dataset.id) === id);
  }

  var chat = null;
  for (var i = 0; i < MockData.vetChats.length; i++) {
    if (MockData.vetChats[i].id === id) { chat = MockData.vetChats[i]; break; }
  }
  if (!chat) return;

  document.getElementById('chat-name').textContent = chat.nombre;
  document.getElementById('chat-sub').textContent  = chat.rol;
  document.getElementById('chat-av').textContent   = chat.nombre[0];

  var mensajes  = (MockData.vetMsgs || {})[id] || [];
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
  // Sin respuesta automática — se conectará a API en el futuro
}

construirListaChats();
abrirChat(1);
