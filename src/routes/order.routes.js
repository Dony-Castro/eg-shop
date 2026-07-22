const { Router } = require('express');
const orderController = require('../controllers/order.controller');
const { orderValidationRules, validateOrderRequest } = require('../validators/order.validator');

const router = Router();

router.post('/', orderValidationRules, validateOrderRequest, orderController.createOrder);
router.get('/:id', orderController.getOrderById);

module.exports = router;
