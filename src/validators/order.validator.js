const { body, validationResult } = require('express-validator');
const { AppError } = require('../errors');

const orderValidationRules = [
  body('customer.fullName')
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage('Nombre completo obligatorio y válido'),
  body('customer.email')
    .trim()
    .isEmail()
    .withMessage('Correo electrónico obligatorio y válido')
    .normalizeEmail(),
  body('customer.phone')
    .trim()
    .isLength({ min: 7, max: 30 })
    .withMessage('Teléfono obligatorio y válido'),
  body('customer.address')
    .trim()
    .isLength({ min: 5, max: 220 })
    .withMessage('Dirección obligatoria'),
  body('customer.city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Ciudad o sector obligatorio'),
  body('customer.locationReference')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 240 })
    .withMessage('La referencia excede la longitud permitida'),
  body('items').isArray({ min: 1 }).withMessage('El carrito no puede estar vacío'),
  body('items.*.productId').isInt({ min: 1 }).withMessage('productId inválido'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('quantity inválida')
];

const validateOrderRequest = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const list = errors.array().map((error) => error.msg);
    throw new AppError('Datos inválidos para crear el pedido', 400, list);
  }
  next();
};

module.exports = {
  orderValidationRules,
  validateOrderRequest
};
