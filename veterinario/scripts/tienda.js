// PetSpot — Tienda del veterinario

PetSpot.init('veterinario');
buildVetLayout('tienda');

document.getElementById('icon-plus').innerHTML = Icons.plus;
document.getElementById('icon-x-nuevo').innerHTML  = Icons.x;
document.getElementById('icon-x-editar').innerHTML = Icons.x;

document.getElementById('btn-nuevo').addEventListener('click', function() {
  document.getElementById('modal-prod').classList.add('open');
});

function showTab(tab, el) {
  document.getElementById('tab-productos').style.display = tab === 'productos' ? '' : 'none';
  document.getElementById('tab-pedidos').style.display   = tab === 'pedidos'   ? '' : 'none';
  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  el.classList.add('active');
}

// Lista de productos (copia para poder modificar)
var listaProductos = [];
for (var i = 0; i < MockData.productos.length; i++) {
  listaProductos.push({
    id:      MockData.productos[i].id,
    nombre:  MockData.productos[i].nombre,
    precio:  MockData.productos[i].precio,
    stock:   MockData.productos[i].stock,
    ventas:  MockData.productos[i].ventas,
    cat:     MockData.productos[i].cat,
    visible: MockData.productos[i].visible,
    imagen:  MockData.productos[i].imagen
  });
}

var productoEditandoId = null;

function renderProductos() {
  var tbody = document.getElementById('productos-body');
  tbody.innerHTML = '';
  for (var i = 0; i < listaProductos.length; i++) {
    var p = listaProductos[i];
    var lowStock = p.stock < 20;
    var opacidad = p.visible ? '1' : '0.45';
    var fila = document.createElement('tr');
    fila.id = 'prod-row-' + p.id;
    fila.style.opacity = opacidad;
    fila.innerHTML =
      '<td>' +
        '<div style="display:flex;align-items:center;gap:11px">' +
          // Imagen o icono placeholder para foto futura
          '<div style="width:40px;height:40px;background:var(--bg3);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">' +
            (p.imagen ? '<img src="' + p.imagen + '" style="width:100%;height:100%;object-fit:cover">' : Icons.box) +
          '</div>' +
          '<span style="font-weight:600;font-size:14px">' + p.nombre + '</span>' +
        '</div>' +
      '</td>' +
      '<td><span class="badge badge-blue">' + p.cat + '</span></td>' +
      '<td><strong style="color:var(--accent);font-size:15px">' + p.precio.toFixed(2) + '€</strong></td>' +
      '<td><span class="' + (lowStock ? 'stock-low' : 'stock-ok') + '">' + (lowStock ? '⚠️ ' : '') + p.stock + ' uds.</span></td>' +
      '<td style="color:var(--text2)">' + p.ventas + ' vendidos</td>' +
      '<td>' +
        '<div style="display:flex;gap:6px">' +
          '<button class="btn btn-ghost btn-sm" onclick="abrirEditar(' + p.id + ')">' + Icons.edit + '</button>' +
          '<button class="btn btn-ghost btn-sm" onclick="toggleVisible(' + p.id + ')" title="' + (p.visible ? 'Ocultar' : 'Mostrar') + '">' +
            (p.visible ? '👁' : '🚫') +
          '</button>' +
          '<button class="btn btn-danger btn-sm" onclick="eliminarProducto(' + p.id + ')">' + Icons.trash + '</button>' +
        '</div>' +
      '</td>';
    tbody.appendChild(fila);
  }
}

function toggleVisible(id) {
  for (var i = 0; i < listaProductos.length; i++) {
    if (listaProductos[i].id === id) {
      listaProductos[i].visible = !listaProductos[i].visible;
      break;
    }
  }
  renderProductos();
}

function eliminarProducto(id) {
  var nueva = [];
  for (var i = 0; i < listaProductos.length; i++) {
    if (listaProductos[i].id !== id) nueva.push(listaProductos[i]);
  }
  listaProductos = nueva;
  renderProductos();
  PetSpot.notify('Producto eliminado');
}

function abrirEditar(id) {
  var prod = null;
  for (var i = 0; i < listaProductos.length; i++) {
    if (listaProductos[i].id === id) { prod = listaProductos[i]; break; }
  }
  if (!prod) return;
  productoEditandoId = id;

  // Pre-rellenar el modal de editar con los datos actuales
  document.getElementById('edit-nombre').value = prod.nombre;
  document.getElementById('edit-precio').value = prod.precio;
  document.getElementById('edit-stock').value  = prod.stock;
  document.getElementById('edit-cat').value    = prod.cat;

  document.getElementById('modal-editar').classList.add('open');
}

function guardarEdicion() {
  if (!productoEditandoId) return;
  var nombre = document.getElementById('edit-nombre').value.trim();
  var precio = parseFloat(document.getElementById('edit-precio').value);
  var stock  = parseInt(document.getElementById('edit-stock').value);
  var cat    = document.getElementById('edit-cat').value;

  if (!nombre || isNaN(precio) || isNaN(stock)) {
    PetSpot.notify('Rellena todos los campos correctamente');
    return;
  }

  for (var i = 0; i < listaProductos.length; i++) {
    if (listaProductos[i].id === productoEditandoId) {
      listaProductos[i].nombre = nombre;
      listaProductos[i].precio = precio;
      listaProductos[i].stock  = stock;
      listaProductos[i].cat    = cat;
      break;
    }
  }

  renderProductos();
  closeModal();
  PetSpot.notify('✅ Producto actualizado');
}

function addProduct() {
  var nombre = document.getElementById('nuevo-nombre').value.trim();
  var precio = parseFloat(document.getElementById('nuevo-precio').value);
  var stock  = parseInt(document.getElementById('nuevo-stock').value);
  var cat    = document.getElementById('nuevo-cat').value;

  if (!nombre || isNaN(precio) || isNaN(stock)) {
    PetSpot.notify('Rellena todos los campos');
    return;
  }

  listaProductos.push({
    id:      Date.now(),
    nombre:  nombre,
    precio:  precio,
    stock:   stock,
    ventas:  0,
    cat:     cat,
    visible: true,
    imagen:  null
  });

  renderProductos();
  closeModal();
  PetSpot.notify('✅ Producto creado correctamente');

  // Limpiar campos
  document.getElementById('nuevo-nombre').value = '';
  document.getElementById('nuevo-precio').value = '';
  document.getElementById('nuevo-stock').value  = '';
}

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(function(m) {
    m.classList.remove('open');
  });
  productoEditandoId = null;
}

// Pedidos mock
var pedidos = [
  { id: '#1024', cliente: 'María Fernández', prods: 'Pienso Premium (x2), Collar (x1)', total: '92.48€', estado: 'entregado',  fecha: '14/03/2026' },
  { id: '#1023', cliente: 'Jordi Puig',      prods: 'Vitaminas K9 (x1)',                total: '22.00€', estado: 'en camino',  fecha: '15/03/2026' },
  { id: '#1022', cliente: 'Ana González',    prods: 'Arena Sílice (x3), Champú (x2)',   total: '53.47€', estado: 'procesando', fecha: '16/03/2026' }
];
var estadoClase = { 'entregado': 'badge-green', 'en camino': 'badge-orange', 'procesando': 'badge-blue' };
var pedidosBody = document.getElementById('pedidos-body');
for (var i = 0; i < pedidos.length; i++) {
  var p = pedidos[i];
  pedidosBody.innerHTML +=
    '<tr><td><strong>' + p.id + '</strong></td><td>' + p.cliente + '</td>' +
    '<td style="max-width:220px;color:var(--text2)">' + p.prods + '</td>' +
    '<td><strong style="color:var(--accent)">' + p.total + '</strong></td>' +
    '<td><span class="badge ' + (estadoClase[p.estado] || 'badge-gray') + '">' + p.estado + '</span></td>' +
    '<td>' + p.fecha + '</td></tr>';
}

renderProductos();
