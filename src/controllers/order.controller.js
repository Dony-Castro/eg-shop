const orderService = require('../services/order.service');
const { AppError } = require('../errors');

const createOrder = async (req, res) => {
  const result = await orderService.createOrder(req.body);
  return res.status(201).json({ success: true, data: result });
};

const getOrderById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('ID de pedido inválido', 400);
  }
  const order = await orderService.getOrderById(id);
  return res.status(200).json({ success: true, data: order });
};

module.exports = {
  createOrder,
  getOrderById
};
