// PetSpot — Tienda del cliente

PetSpot.init('cliente');
buildClienteLayout('tienda');

document.getElementById('icon-search').innerHTML = Icons.search;
document.getElementById('icon-cart').innerHTML   = Icons.shop;
document.getElementById('icon-check').innerHTML  = Icons.check;

// Categorías
var categorias = ['Todas'];
for (var i = 0; i < MockData.productos.length; i++) {
  if (categorias.indexOf(MockData.productos[i].cat) === -1) {
    categorias.push(MockData.productos[i].cat);
  }
}

var categoriaActiva = 'Todas';
var carrito = {};

// Mis pedidos (simulados)
var misPedidos = [
  { id: '#1024', productos: 'Pienso Premium (x2)', total: '77.98€', estado: 'entregado',  fecha: '14/03/2026' },
  { id: '#1023', productos: 'Vitaminas K9 (x1)',   total: '22.00€', estado: 'en camino',  fecha: '15/03/2026' }
];

// Construir filtros de categoría
var filtrosEl = document.getElementById('cat-filters');
for (var i = 0; i < categorias.length; i++) {
  var chip = document.createElement('div');
  chip.className = 'filter-chip' + (categorias[i] === 'Todas' ? ' active' : '');
  chip.textContent = categorias[i];
  chip.addEventListener('click', crearHandlerCategoria(categorias[i], chip));
  filtrosEl.appendChild(chip);
}

function crearHandlerCategoria(cat, chip) {
  return function() {
    categoriaActiva = cat;
    var chips = document.querySelectorAll('.cat-filters .filter-chip');
    for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
    chip.classList.add('active');
    renderProductos();
  };
}

function filterProducts() {
  renderProductos();
}

function renderProductos() {
  var query  = document.getElementById('search-input').value.toLowerCase();
  var grid   = document.getElementById('products-grid');
  grid.innerHTML = '';

  for (var i = 0; i < MockData.productos.length; i++) {
    var p = MockData.productos[i];
    if (!p.visible) continue;
    if (categoriaActiva !== 'Todas' && p.cat !== categoriaActiva) continue;
    if (query && p.nombre.toLowerCase().indexOf(query) === -1) continue;

    var card = document.createElement('div');
    card.className = 'product-card';

    // Imagen o icono de bloque (preparado para foto futura)
    var imgHTML;
    if (p.imagen) {
      imgHTML = '<div class="product-img"><img src="' + p.imagen + '" alt="' + p.nombre + '" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm)"></div>';
    } else {
      imgHTML = '<div class="product-img">' + Icons.box + '</div>';
    }

    card.innerHTML =
      imgHTML +
      '<div class="product-cat">' + p.cat + '</div>' +
      '<div class="product-name">' + p.nombre + '</div>' +
      '<div class="product-actions">' +
        '<span class="product-price">' + p.precio.toFixed(2) + '€</span>' +
        '<button class="btn btn-primary btn-sm" onclick="addToCart(' + p.id + ')">+</button>' +
      '</div>';
    grid.appendChild(card);
  }
}

function addToCart(id) {
  var producto = null;
  for (var i = 0; i < MockData.productos.length; i++) {
    if (MockData.productos[i].id === id) {
      producto = MockData.productos[i];
      break;
    }
  }
  if (!producto) return;

  if (!carrito[id]) {
    carrito[id] = { nombre: producto.nombre, precio: producto.precio, qty: 0 };
  }
  carrito[id].qty++;
  renderCarrito();
  PetSpot.notify('✅ ' + producto.nombre + ' añadido');
}

function cambiarCantidad(id, diferencia) {
  if (!carrito[id]) return;
  carrito[id].qty += diferencia;
  if (carrito[id].qty <= 0) delete carrito[id];
  renderCarrito();
}

function renderCarrito() {
  var contenedor = document.getElementById('cart-items');
  var ids = Object.keys(carrito);

  // Actualizar contador
  var total = 0;
  var numItems = 0;
  for (var i = 0; i < ids.length; i++) {
    numItems += carrito[ids[i]].qty;
    total    += carrito[ids[i]].precio * carrito[ids[i]].qty;
  }
  document.getElementById('cart-count').textContent = numItems + ' artículos';
  document.getElementById('subtotal').textContent = total.toFixed(2) + '€';

  if (ids.length === 0) {
    contenedor.innerHTML = '<p class="empty-msg">Tu carrito está vacío</p>';
    return;
  }

  contenedor.innerHTML = '';
  for (var i = 0; i < ids.length; i++) {
    var id  = ids[i];
    var item = carrito[id];
    var div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML =
      '<div class="cart-item-icon">' + Icons.box + '</div>' +
      '<div style="flex:1">' +
        '<div style="font-size:13px;font-weight:600">' + item.nombre + '</div>' +
        '<div style="font-size:12px;color:var(--accent)">' + (item.precio * item.qty).toFixed(2) + '€</div>' +
      '</div>' +
      '<div class="qty-ctrl">' +
        '<button class="qty-btn" onclick="cambiarCantidad(' + id + ', -1)">−</button>' +
        '<span style="font-size:13px;font-weight:700;min-width:18px;text-align:center">' + item.qty + '</span>' +
        '<button class="qty-btn" onclick="cambiarCantidad(' + id + ', 1)">+</button>' +
      '</div>';
    contenedor.appendChild(div);
  }
}

function checkout() {
  var ids = Object.keys(carrito);
  if (ids.length === 0) {
    PetSpot.notify('Tu carrito está vacío');
    return;
  }
  // Rellenar dirección automáticamente desde el perfil
  var user = PetSpot.getUser();
  if (user && user.direccion) {
    document.getElementById('checkout-dir').value = user.direccion;
  }
  document.getElementById('modal-checkout').classList.add('open');
}

function confirmarCompra() {
  var nombre    = document.getElementById('checkout-nombre').value.trim();
  var cuenta    = document.getElementById('checkout-cuenta').value.trim();
  if (!nombre || !cuenta) {
    PetSpot.notify('Por favor, rellena todos los campos');
    return;
  }
  // Añadir a mis pedidos
  var ids = Object.keys(carrito);
  var prods = [];
  var total = 0;
  for (var i = 0; i < ids.length; i++) {
    prods.push(carrito[ids[i]].nombre + ' (x' + carrito[ids[i]].qty + ')');
    total += carrito[ids[i]].precio * carrito[ids[i]].qty;
  }
  var numeroPedido = '#' + (1025 + misPedidos.length);
  misPedidos.unshift({
    id: numeroPedido,
    productos: prods.join(', '),
    total: total.toFixed(2) + '€',
    estado: 'procesando',
    fecha: new Date().toLocaleDateString('es-ES')
  });
  renderPedidos();

  // Limpiar carrito
  carrito = {};
  renderCarrito();
  closeModal();
  PetSpot.notify('🎉 Pedido realizado con éxito — ' + numeroPedido);
}

// Mis Pedidos
function renderPedidos() {
  var lista = document.getElementById('pedidos-lista');
  lista.innerHTML = '';
  var estadoClase = { 'entregado': 'badge-green', 'en camino': 'badge-orange', 'procesando': 'badge-blue' };

  for (var i = 0; i < misPedidos.length; i++) {
    var p = misPedidos[i];
    lista.innerHTML +=
      '<div class="cita-card">' +
        '<div class="cita-time"><div class="hour" style="font-size:14px">' + p.id + '</div><div class="date">' + p.fecha + '</div></div>' +
        '<div class="cita-divider"></div>' +
        '<div class="cita-info"><div class="cita-title">' + p.productos + '</div></div>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<strong style="color:var(--accent)">' + p.total + '</strong>' +
          '<span class="badge ' + (estadoClase[p.estado] || 'badge-gray') + '">' + p.estado + '</span>' +
        '</div>' +
      '</div>';
  }
}

function showTab(tab, el) {
  document.getElementById('tab-productos').style.display = tab === 'productos' ? '' : 'none';
  document.getElementById('tab-pedidos').style.display   = tab === 'pedidos'   ? '' : 'none';
  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  el.classList.add('active');
}

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(function(m) {
    m.classList.remove('open');
  });
}

renderProductos();
renderPedidos();
