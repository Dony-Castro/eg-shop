const productRepository = require('../repositories/product.repository');
const { AppError } = require('../errors');

const getProducts = async (filters) => productRepository.getAll(filters);

const getProductById = async (id) => {
  const product = await productRepository.getById(id);
  if (!product || !product.active) {
    throw new AppError('Producto no encontrado', 404);
  }
  return product;
};

module.exports = {
  getProducts,
  getProductById
};
