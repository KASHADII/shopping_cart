document.addEventListener('DOMContentLoaded', () => {
  const products = [
    {id: 1, name: "Product 1", price: 29.99},
    {id: 2, name: "Product 2", price: 19.99},
    {id: 3, name: "Product 3", price: 49.99},
  ];

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartTotalMessage = document.getElementById("cart-total");
  const totalPriceDisplay = document.getElementById("total-price");
  const checkOutButton = document.getElementById("checkout-btn");

  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <div class="product-info">
        <span class="product-name">${product.name}</span>
        <span class="product-price">$${product.price.toFixed(2)}</span>
      </div>
      <button class="add-btn" data-id="${product.id}">Add to Cart</button>
    `;
    productList.appendChild(productDiv);
  });

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function renderCart() {
    cartItems.innerHTML = "";
    let totalPrice = 0;

    if (cart.length > 0) {
      emptyCartMessage.classList.add('hidden');
      cartTotalMessage.classList.remove('hidden');
      
      cart.forEach((item) => {
        totalPrice += item.price * item.quantity;
        const cartDiv = document.createElement('div');
        cartDiv.classList.add('cart-item');
        cartDiv.innerHTML = `
          <div class="cart-item-info">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          <div class="cart-item-actions">
            <button class="qty-btn minus" data-id="${item.id}">-</button>
            <span class="qty">${item.quantity}</span>
            <button class="qty-btn plus" data-id="${item.id}">+</button>
            <button class="remove-btn" data-id="${item.id}" title="Remove item">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        `;
        cartItems.appendChild(cartDiv);
      });
    } else {
      emptyCartMessage.classList.remove('hidden');
      emptyCartMessage.textContent = "Your cart is empty.";
      cartTotalMessage.classList.add('hidden');
    }
    totalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
  }

  function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();
  }

  function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        removeFromCart(id);
      } else {
        saveCart();
        renderCart();
      }
    }
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
  }

  productList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      const btn = e.target.closest('button');
      const productID = parseInt(btn.getAttribute('data-id'));
      const product = products.find(p => p.id === productID);
      if (product) addToCart(product);
    }
  });

  cartItems.addEventListener('click', (e) => {
    const target = e.target;
    const btn = target.closest('button');
    if (!btn) return;

    const id = parseInt(btn.getAttribute('data-id'));
    
    if (btn.classList.contains('plus')) {
      updateQuantity(id, 1);
    } else if (btn.classList.contains('minus')) {
      updateQuantity(id, -1);
    } else if (btn.classList.contains('remove-btn') || btn.closest('.remove-btn')) {
      removeFromCart(id);
    }
  });

  checkOutButton.addEventListener('click', () => {
    if (cart.length === 0) return;
    cart = [];
    saveCart();
    renderCart();
    
    const originalText = checkOutButton.textContent;
    checkOutButton.textContent = "Checked Out Successfully!";
    checkOutButton.style.backgroundColor = "#10b981"; // success green
    checkOutButton.style.color = "white";
    
    setTimeout(() => {
      checkOutButton.textContent = originalText;
      checkOutButton.style.backgroundColor = "";
      checkOutButton.style.color = "";
    }, 2000);
  });

  renderCart();
});