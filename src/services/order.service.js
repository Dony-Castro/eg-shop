const db = require('../config/database');
const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const { AppError } = require('../errors');

const toCurrencyNumber = (value) => Number(Number(value).toFixed(2));

const validateItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('El carrito no puede estar vacío', 400, ['items debe contener al menos un producto']);
  }

  items.forEach((item, index) => {
    if (!Number.isInteger(item.productId) || item.productId <= 0) {
      throw new AppError('Producto inválido en el carrito', 400, [`items[${index}].productId inválido`]);
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new AppError('Cantidad inválida en el carrito', 400, [`items[${index}].quantity inválida`]);
    }
  });
};

const createOrder = async ({ customer, items }) => {
  validateItems(items);

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const uniqueIds = [...new Set(items.map((item) => item.productId))];
    const products = await productRepository.getByIdsForUpdate(client, uniqueIds);

    if (products.length !== uniqueIds.length) {
      throw new AppError('Uno o más productos no existen', 400);
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    const normalizedItems = items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product.active) {
        throw new AppError(`El producto ${product.name} no está disponible`, 409);
      }

      if (item.quantity > product.stock) {
        throw new AppError(`Stock insuficiente para ${product.name}`, 409);
      }

      const unitPrice = toCurrencyNumber(product.price);
      const subtotal = toCurrencyNumber(unitPrice * item.quantity);

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        subtotal
      };
    });

    const total = toCurrencyNumber(
      normalizedItems.reduce((acc, item) => acc + item.subtotal, 0)
    );

    const savedCustomer = await orderRepository.createCustomer(client, customer);
    const savedOrder = await orderRepository.createOrder(client, savedCustomer.id, total);

    for (const item of normalizedItems) {
      await orderRepository.createOrderItem(client, {
        orderId: savedOrder.id,
        ...item
      });
      await productRepository.decreaseStock(client, item.productId, item.quantity);
    }

    await client.query('COMMIT');

    return {
      orderId: savedOrder.id,
      status: savedOrder.status,
      total,
      message: 'Pedido creado exitosamente'
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getOrderById = async (orderId) => {
  const order = await orderRepository.getOrderById(db, orderId);
  if (!order) {
    throw new AppError('Pedido no encontrado', 404);
  }
  return order;
};

module.exports = {
  createOrder,
  getOrderById
};
