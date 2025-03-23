// Datos y estado de la aplicación
let products = [];
let cart = [];
let editingProductId = null;
let discountPercent = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Cargar productos desde localStorage
  loadProducts();
  
  // Inicializar eventos
  initTabEvents();
  initSearchEvents();
  initCartEvents();
  initInventoryEvents();
  initModalEvents();
  
  // Renderizar productos
  renderProducts();
  renderInventory();
  updateCartUI();
});

// Cargar productos desde localStorage
function loadProducts() {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    products = JSON.parse(storedProducts);
  } else {
    // Productos por defecto
    products = [
      { id: "1", name: "Leche", description: "1 Galón", price: 3.99, stock: 50, color: "bg-blue-500" },
      { id: "2", name: "Pan", description: "Integral", price: 2.49, stock: 30, color: "bg-amber-500" },
      { id: "3", name: "Huevos", description: "Docena Grande", price: 4.99, stock: 40, color: "bg-yellow-500" },
      { id: "4", name: "Manzanas", description: "Bolsa de 6", price: 5.99, stock: 25, color: "bg-red-500" },
      { id: "5", name: "Pollo", description: "Entero", price: 8.99, stock: 15, color: "bg-orange-500" },
      { id: "6", name: "Arroz", description: "Bolsa de 5lb", price: 6.99, stock: 20, color: "bg-green-500" }
    ];
    saveProducts();
  }
}

// Guardar productos en localStorage
function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

// Inicializar eventos de pestañas
function initTabEvents() {
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      // Desactivar todas las pestañas
      tabTriggers.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      // Activar la pestaña seleccionada
      trigger.classList.add('active');
      const tabId = trigger.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
}

// Inicializar eventos de búsqueda
function initSearchEvents() {
  // Búsqueda de productos
  document.getElementById('product-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    renderProducts(searchTerm);
  });
  
  // Búsqueda de inventario
  document.getElementById('inventory-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    renderInventory(searchTerm);
  });
}

// Inicializar eventos del carrito
function initCartEvents() {
  // Evento de descuento
  document.getElementById('discount-input').addEventListener('input', (e) => {
    discountPercent = parseFloat(e.target.value) || 0;
    updateCartTotals();
  });
  
  // Evento de checkout
  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) return;
    
    openCheckoutModal();
  });
}

// Inicializar eventos de inventario
function initInventoryEvents() {
  // Evento para añadir producto
  document.getElementById('add-product-btn').addEventListener('click', () => {
    editingProductId = null;
    document.getElementById('product-modal-title').textContent = 'Añadir Nuevo Producto';
    document.getElementById('save-product').textContent = 'Añadir Producto';
    
    // Limpiar formulario
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '';
    document.getElementById('product-color').value = 'bg-purple-500';
    document.getElementById('color-preview').className = 'color-preview bg-purple-500';
    
    // Abrir modal
    openProductModal();
  });
  
  // Evento para cambio de color
  document.getElementById('product-color').addEventListener('change', (e) => {
    const colorClass = e.target.value;
    document.getElementById('color-preview').className = `color-preview ${colorClass}`;
  });
}

// Inicializar eventos de modales
function initModalEvents() {
  // Modal de checkout
  document.getElementById('cancel-checkout').addEventListener('click', closeCheckoutModal);
  document.getElementById('payment-amount').addEventListener('input', updateChangeAmount);
  document.getElementById('complete-sale').addEventListener('click', completeSale);
  
  // Modal de producto
  document.getElementById('cancel-product').addEventListener('click', closeProductModal);
  document.getElementById('save-product').addEventListener('click', saveProductForm);
  
  // Cerrar modales al hacer clic fuera
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

// Renderizar productos en el catálogo
function renderProducts(searchTerm = '') {
  const container = document.getElementById('products-container');
  container.innerHTML = '';
  
  const filteredProducts = searchTerm 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
      )
    : products;
  
  if (filteredProducts.length === 0) {
    container.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 2rem 0; color: #6b7280;">No se encontraron productos</p>';
    return;
  }
  
  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'card product-card';
    
    const stockBadge = product.stock > 0 
      ? `<span class="product-badge badge-outline">Stock: ${product.stock}</span>`
      : `<span class="product-badge badge-destructive">Agotado</span>`;
    
    productCard.innerHTML = `
      <div class="product-color-indicator ${product.color || 'bg-purple-500'}"></div>
      <div class="product-content">
        <div class="product-header">
          <div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
          </div>
          ${stockBadge}
        </div>
        <div class="product-footer">
          <span class="product-price">${formatCurrency(product.price)}</span>
          <button class="btn btn-sm add-to-cart" data-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Añadir
          </button>
        </div>
      </div>
    `;
    
    // Aplicar el color del producto al botón
    const addButton = productCard.querySelector('.add-to-cart');
    addButton.classList.add(product.color || 'bg-purple-500');
    addButton.classList.add('text-white');
    addButton.classList.add('hover:opacity-90');
    
    // Evento para añadir al carrito
    if (product.stock > 0) {
      addButton.addEventListener('click', () => addToCart(product));
    }
    
    container.appendChild(productCard);
  });
}

// Renderizar productos en el inventario
function renderInventory(searchTerm = '') {
  const container = document.getElementById('inventory-items');
  container.innerHTML = '';
  
  const filteredProducts = searchTerm 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
      )
    : products;
  
  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="5" class="text-center" style="padding: 2rem 0; color: #6b7280;">
          No se encontraron productos
        </td>
      </tr>
    `;
    return;
  }
  
  filteredProducts.forEach(product => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full mr-2 ${product.color || 'bg-purple-500'}"></div>
          <span class="font-bold">${product.name}</span>
        </div>
      </td>
      <td>${product.description}</td>
      <td class="text-right" style="color: #1d4ed8; font-weight: 500;">${formatCurrency(product.price)}</td>
      <td class="text-right">${product.stock}</td>
      <td class="text-right">
        <div class="flex justify-end space-x-2">
          <button class="btn btn-icon btn-edit edit-product" data-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="btn btn-icon btn-danger delete-product" data-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </td>
    `;
    
    // Evento para editar producto
    row.querySelector('.edit-product').addEventListener('click', () => {
      editProduct(product.id);
    });
    
    // Evento para eliminar producto
    row.querySelector('.delete-product').addEventListener('click', () => {
      deleteProduct(product.id);
    });
    
    container.appendChild(row);
  });
}

// Añadir producto al carrito
function addToCart(product) {
  if (product.stock <= 0) {
    showToast('Sin existencias', `${product.name} no está disponible en inventario.`, 'error');
    return;
  }
  
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      showToast('Límite de existencias alcanzado', `Solo hay ${product.stock} unidades de ${product.name} disponibles.`, 'error');
      return;
    }
    
    existingItem.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }
  
  updateCartUI();
  showToast('Añadido al carrito', `${product.name} añadido al carrito.`, 'success');
}

// Actualizar cantidad de producto en el carrito
function updateCartQuantity(productId, newQuantity) {
  const cartItem = cart.find(item => item.product.id === productId);
  if (!cartItem) return;
  
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  if (newQuantity > product.stock) {
    showToast('Límite de existencias alcanzado', `Solo hay ${product.stock} unidades de ${product.name} disponibles.`, 'error');
    return;
  }
  
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  cartItem.quantity = newQuantity;
  updateCartUI();
}

// Eliminar producto del carrito
function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  updateCartUI();
}

// Actualizar interfaz del carrito
function updateCartUI() {
  const cartBadge = document.getElementById('cart-badge');
  const cartEmpty = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  const cartItems = document.getElementById('cart-items');
  
  // Actualizar contador de items
  cartBadge.textContent = `${cart.length} items`;
  
  // Mostrar/ocultar contenido del carrito
  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartContent.style.display = 'none';
    return;
  } else {
    cartEmpty.style.display = 'none';
    cartContent.style.display = 'block';
  }
  
  // Renderizar items del carrito
  cartItems.innerHTML = '';
  
  cart.forEach(item => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td class="font-bold">${item.product.name}</td>
      <td class="text-right">
        <div class="quantity-control">
          <button class="quantity-btn decrease-quantity" data-id="${item.product.id}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn increase-quantity" data-id="${item.product.id}">+</button>
        </div>
      </td>
      <td class="text-right">${formatCurrency(item.product.price)}</td>
      <td class="text-right" style="color: #6d28d9; font-weight: 500;">${formatCurrency(item.product.price * item.quantity)}</td>
      <td>
        <button class="btn btn-icon btn-danger remove-item" data-id="${item.product.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </td>
    `;
    
    // Eventos para los botones de cantidad
    row.querySelector('.decrease-quantity').addEventListener('click', () => {
      updateCartQuantity(item.product.id, item.quantity - 1);
    });
    
    row.querySelector('.increase-quantity').addEventListener('click', () => {
      updateCartQuantity(item.product.id, item.quantity + 1);
    });
    
    // Evento para eliminar item
    row.querySelector('.remove-item').addEventListener('click', () => {
      removeFromCart(item.product.id);
    });
    
    cartItems.appendChild(row);
  });
  
  // Actualizar totales
  updateCartTotals();
}

// Actualizar totales del carrito
function updateCartTotals() {
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const total = subtotal - discount;
  
  document.getElementById('cart-subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('discount-amount').textContent = formatCurrency(discount);
  document.getElementById('cart-total').textContent = formatCurrency(total);
}

// Calcular subtotal
function calculateSubtotal() {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
}

// Calcular descuento
function calculateDiscount() {
  return (calculateSubtotal() * discountPercent) / 100;
}

// Abrir modal de checkout
function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const total = subtotal - discount;
  
  document.getElementById('modal-subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('modal-discount-text').textContent = `Descuento (${discountPercent}%):`;
  document.getElementById('modal-discount-amount').textContent = `-${formatCurrency(discount)}`;
  document.getElementById('modal-total').textContent = formatCurrency(total);
  
  document.getElementById('payment-amount').value = '';
  document.getElementById('change-container').style.display = 'none';
  
  modal.classList.add('active');
}

// Cerrar modal de checkout
function closeCheckoutModal() {
  document.getElementById('checkout-modal').classList.remove('active');
}

// Actualizar monto de cambio
function updateChangeAmount() {
  const paymentAmount = parseFloat(document.getElementById('payment-amount').value) || 0;
  const total = calculateSubtotal() - calculateDiscount();
  
  if (paymentAmount >= total) {
    const change = paymentAmount - total;
    document.getElementById('change-amount').textContent = formatCurrency(change);
    document.getElementById('change-container').style.display = 'block';
  } else {
    document.getElementById('change-container').style.display = 'none';
  }
}

// Completar venta
function completeSale() {
  const paymentAmount = parseFloat(document.getElementById('payment-amount').value) || 0;
  const total = calculateSubtotal() - calculateDiscount();
  
  if (isNaN(paymentAmount) || paymentAmount < total) {
    showToast('Pago inválido', 'Por favor ingrese un monto válido que cubra el total.', 'error');
    return;
  }
  
  // Actualizar stock de productos
  cart.forEach(item => {
    const product = products.find(p => p.id === item.product.id);
    if (product) {
      product.stock -= item.quantity;
    }
  });
  
  // Guardar productos actualizados
  saveProducts();
  
  // Mostrar mensaje de éxito
  const change = paymentAmount - total;
  showToast('¡Venta completada!', `Cambio: ${formatCurrency(change)}`, 'success');
  
  // Limpiar carrito y cerrar modal
  cart = [];
  updateCartUI();
  closeCheckoutModal();
  
  // Actualizar catálogo de productos
  renderProducts();
  renderInventory();
}

// Abrir modal de producto
function openProductModal() {
  document.getElementById('product-modal').classList.add('active');
}

// Cerrar modal de producto
function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

// Editar producto
function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  editingProductId = productId;
  
  document.getElementById('product-modal-title').textContent = 'Editar Producto';
  document.getElementById('save-product').textContent = 'Actualizar Producto';
  
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-stock').value = product.stock;
  document.getElementById('product-color').value = product.color || 'bg-purple-500';
  document.getElementById('color-preview').className = `color-preview ${product.color || 'bg-purple-500'}`;
  
  openProductModal();
}

// Eliminar producto
function deleteProduct(productId) {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
  
  products = products.filter(p => p.id !== productId);
  
  // Eliminar del carrito si existe
  cart = cart.filter(item => item.product.id !== productId);
  
  // Guardar cambios
  saveProducts();
  updateCartUI();
  renderProducts();
  renderInventory();
  
  showToast('Producto Eliminado', 'El producto ha sido eliminado del inventario.', 'info');
}

// Guardar formulario de producto
function saveProductForm() {
  const name = document.getElementById('product-name').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const priceStr = document.getElementById('product-price').value;
  const stockStr = document.getElementById('product-stock').value;
  const color = document.getElementById('product-color').value;
  
  // Validar campos
  if (!name) {
    showToast('Error de Validación', 'El nombre del producto es obligatorio.', 'error');
    return;
  }
  
  const price = parseFloat(priceStr);
  if (isNaN(price) || price <= 0) {
    showToast('Error de Validación', 'El precio debe ser un número positivo.', 'error');
    return;
  }
  
  const stock = parseInt(stockStr);
  if (isNaN(stock) || stock < 0) {
    showToast('Error de Validación', 'El stock debe ser un número no negativo.', 'error');
    return;
  }
  
  if (editingProductId) {
    // Actualizar producto existente
    const productIndex = products.findIndex(p => p.id === editingProductId);
    if (productIndex !== -1) {
      const updatedProduct = {
        ...products[productIndex],
        name,
        description,
        price,
        stock,
        color
      };
      
      products[productIndex] = updatedProduct;
      
      // Actualizar producto en el carrito si existe
      const cartItemIndex = cart.findIndex(item => item.product.id === editingProductId);
      if (cartItemIndex !== -1) {
        cart[cartItemIndex].product = updatedProduct;
      }
      
      showToast('¡Producto Actualizado!', `${name} ha sido actualizado.`, 'success');
    }
  } else {
    // Añadir nuevo producto
    const newProduct = {
      id: Date.now().toString(),
      name,
      description,
      price,
      stock,
      color
    };
    
    products.push(newProduct);
    showToast('¡Producto Añadido!', `${name} ha sido añadido al inventario.`, 'success');
  }
  
  // Guardar cambios
  saveProducts();
  updateCartUI();
  renderProducts();
  renderInventory();
  
  // Cerrar modal
  closeProductModal();
}

// Mostrar toast
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-title">${title}</div>
    <div class="toast-message">${message}</div>
  `;
  
  container.appendChild(toast);
  
  // Eliminar toast después de 3 segundos
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3000);
}

// Formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}