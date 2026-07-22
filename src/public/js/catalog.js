(function catalogModule() {
  const CART_KEY = 'eg_shop_cart';

  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const setCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = String(count);
  };

  const upsertCartItem = (product, quantity = 1) => {
    const cart = getCart();
    const existing = cart.find((item) => item.productId === product.productId);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      cart.push({ ...product, quantity: Math.min(quantity, product.stock) });
    }

    setCart(cart);
  };

  const showFeedback = (targetId, message, isError = false) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.textContent = message;
    el.classList.toggle('error', isError);
  };

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const stock = Number(button.dataset.productStock);
      if (stock <= 0) {
        showFeedback('catalog-message', 'Producto sin stock disponible', true);
        return;
      }

      upsertCartItem(
        {
          productId: Number(button.dataset.productId),
          name: button.dataset.productName,
          price: Number(button.dataset.productPrice),
          stock,
          image: button.dataset.productImage
        },
        1
      );
      showFeedback('catalog-message', 'Producto agregado al carrito');
      showFeedback('detail-message', 'Producto agregado al carrito');
    });
  });

  const detailForm = document.getElementById('detail-cart-form');
  if (detailForm) {
    detailForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const submitButton = detailForm.querySelector('button[type="submit"]');
      const quantityInput = document.getElementById('quantity');
      const max = Number(submitButton.dataset.productStock);
      const quantity = Number(quantityInput.value);

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > max) {
        showFeedback('detail-message', 'Cantidad inválida según stock', true);
        return;
      }

      upsertCartItem(
        {
          productId: Number(submitButton.dataset.productId),
          name: submitButton.dataset.productName,
          price: Number(submitButton.dataset.productPrice),
          stock: max,
          image: submitButton.dataset.productImage
        },
        quantity
      );
      showFeedback('detail-message', 'Producto agregado al carrito');
    });
  }

  const searchInput = document.getElementById('search-input');
  const onlyStock = document.getElementById('only-stock');
  const cards = document.querySelectorAll('#catalog-grid .product-card');

  const applyFilter = () => {
    if (!searchInput || !onlyStock) return;
    const q = searchInput.value.toLowerCase().trim();
    cards.forEach((card) => {
      const byName = card.dataset.name.includes(q);
      const byStock = !onlyStock.checked || Number(card.dataset.stock) > 0;
      card.style.display = byName && byStock ? 'block' : 'none';
    });
  };

  searchInput?.addEventListener('input', applyFilter);
  onlyStock?.addEventListener('change', applyFilter);
})();
