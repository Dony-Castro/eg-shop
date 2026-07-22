const productService = require('../services/product.service');
const orderService = require('../services/order.service');

const renderCatalog = async (req, res) => {
  const products = await productService.getProducts({ active: 'true' });
  res.render('catalog', { title: 'Catálogo', products });
};

const renderProductDetail = async (req, res) => {
  const product = await productService.getProductById(Number(req.params.id));
  res.render('product-detail', { title: product.name, product });
};

const renderCart = async (_req, res) => {
  res.render('cart', { title: 'Carrito' });
};

const renderCheckout = async (_req, res) => {
  res.render('checkout', { title: 'Checkout' });
};

const renderOrderConfirmation = async (req, res) => {
  const order = await orderService.getOrderById(Number(req.params.id));
  res.render('confirmation', { title: 'Pedido confirmado', order });
};

module.exports = {
  renderCatalog,
  renderProductDetail,
  renderCart,
  renderCheckout,
  renderOrderConfirmation
};
