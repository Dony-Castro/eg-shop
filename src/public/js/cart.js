(function cartModule() {
  const CART_KEY = 'eg_shop_cart';
  const formatDop = (value) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(value);

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const setCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = String(count);
  };

  const render = () => {
    const container = document.getElementById('cart-container');
    if (!container) return;

    const cart = getCart();
    if (cart.length === 0) {
      container.innerHTML = '<p>Tu carrito está vacío.</p>';
      document.getElementById('go-checkout')?.classList.add('disabled');
      return;
    }

    let total = 0;

    container.innerHTML = `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${cart
    .map((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      return `
                  <tr>
                    <td>${item.name}</td>
                    <td>${formatDop(item.price)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max="${item.stock}"
                        value="${item.quantity}"
                        data-id="${item.productId}"
                        class="qty-input"
                        aria-label="Cantidad de ${item.name}"
                      >
                    </td>
                    <td>${formatDop(subtotal)}</td>
                    <td><button class="btn secondary remove-item" data-id="${item.productId}">Eliminar</button></td>
                  </tr>
                `;
    })
    .join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><strong>Total</strong></td>
              <td><strong>${formatDop(total)}</strong></td>
              <td><button class="btn danger" id="clear-cart">Vaciar carrito</button></td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    document.querySelectorAll('.qty-input').forEach((input) => {
      input.addEventListener('change', (event) => {
        const id = Number(event.target.dataset.id);
        const cart = getCart();
        const item = cart.find((entry) => entry.productId === id);
        if (!item) return;

        const max = Number(item.stock);
        let qty = Number(event.target.value);
        if (!Number.isInteger(qty) || qty < 1) qty = 1;
        if (qty > max) qty = max;

        item.quantity = qty;
        setCart(cart);
        render();
      });
    });

    document.querySelectorAll('.remove-item').forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.id);
        const cart = getCart().filter((item) => item.productId !== id);
        setCart(cart);
        render();
      });
    });

    document.getElementById('clear-cart')?.addEventListener('click', () => {
      if (window.confirm('¿Seguro que deseas vaciar el carrito?')) {
        setCart([]);
        render();
      }
    });
  };

  render();
})();
