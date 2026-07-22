const { Router } = require('express');
const pageController = require('../controllers/page.controller');

const router = Router();

router.get('/', pageController.renderCatalog);
router.get('/productos/:id', pageController.renderProductDetail);
router.get('/carrito', pageController.renderCart);
router.get('/checkout', pageController.renderCheckout);
router.get('/pedido-confirmado/:id', pageController.renderOrderConfirmation);

module.exports = router;
