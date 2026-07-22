(function checkoutModule() {
  const CART_KEY = 'eg_shop_cart';
  const formatDop = (value) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(value);

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  const summaryEl = document.getElementById('checkout-summary');
  const feedbackEl = document.getElementById('checkout-feedback');
  const submitBtn = document.getElementById('confirm-order');
  const form = document.getElementById('checkout-form');

  const renderSummary = () => {
    const cart = getCart();
    if (!summaryEl) return;

    if (cart.length === 0) {
      summaryEl.innerHTML = '<p>Tu carrito está vacío. Regresa al catálogo para agregar productos.</p>';
      if (submitBtn) submitBtn.disabled = true;
      return;
    }

    const rows = cart
      .map((item) => `<li>${item.name} x ${item.quantity} = <strong>${formatDop(item.price * item.quantity)}</strong></li>`)
      .join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    summaryEl.innerHTML = `<ul>${rows}</ul><p><strong>Total: ${formatDop(total)}</strong></p>`;
  };

  const showFieldError = (field, message) => {
    const errorNode = document.querySelector(`[data-field-error="${field}"]`);
    if (errorNode) errorNode.textContent = message || '';
  };

  const clearErrors = () => ['fullName', 'email', 'phone', 'address', 'city'].forEach((field) => showFieldError(field, ''));

  const validateForm = (data) => {
    clearErrors();
    let valid = true;

    if (data.fullName.length < 5) {
      showFieldError('fullName', 'Nombre completo obligatorio');
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showFieldError('email', 'Correo inválido');
      valid = false;
    }
    if (data.phone.length < 7) {
      showFieldError('phone', 'Teléfono obligatorio');
      valid = false;
    }
    if (data.address.length < 5) {
      showFieldError('address', 'Dirección obligatoria');
      valid = false;
    }
    if (data.city.length < 2) {
      showFieldError('city', 'Ciudad obligatoria');
      valid = false;
    }

    return valid;
  };

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cart = getCart();

    if (cart.length === 0) {
      feedbackEl.textContent = 'No puedes confirmar un pedido con carrito vacío.';
      feedbackEl.classList.add('error');
      return;
    }

    const payload = {
      customer: {
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        address: form.address.value.trim(),
        city: form.city.value.trim(),
        locationReference: form.locationReference.value.trim()
      },
      items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity }))
    };

    if (!validateForm(payload.customer)) {
      feedbackEl.textContent = 'Corrige los campos marcados.';
      feedbackEl.classList.add('error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';
    feedbackEl.textContent = '';

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        feedbackEl.textContent = result.message || 'No se pudo confirmar el pedido.';
        feedbackEl.classList.add('error');
        return;
      }

      localStorage.removeItem(CART_KEY);
      window.location.href = `/pedido-confirmado/${result.data.orderId}`;
    } catch {
      feedbackEl.textContent = 'Error de conexión. Intenta nuevamente.';
      feedbackEl.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirmar pedido';
    }
  });

  renderSummary();
})();
