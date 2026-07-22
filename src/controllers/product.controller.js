const productService = require('../services/product.service');
const { AppError } = require('../errors');

const getProducts = async (req, res) => {
  const { search, active } = req.query;
  const products = await productService.getProducts({ search, active });
  return res.status(200).json({ success: true, data: products });
};

const getProductById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('ID de producto inválido', 400);
  }
  const product = await productService.getProductById(id);
  return res.status(200).json({ success: true, data: product });
};

module.exports = {
  getProducts,
  getProductById
};
