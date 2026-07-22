const createCustomer = async (client, customer) => {
  const result = await client.query(
    `INSERT INTO customers (full_name, email, phone, address, city, location_reference)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, full_name, email, phone, address, city, location_reference, created_at`,
    [
      customer.fullName,
      customer.email,
      customer.phone,
      customer.address,
      customer.city,
      customer.locationReference || null
    ]
  );
  return result.rows[0];
};

const createOrder = async (client, customerId, total) => {
  const result = await client.query(
    `INSERT INTO orders (customer_id, total)
     VALUES ($1, $2)
     RETURNING id, customer_id, total, status, created_at`,
    [customerId, total]
  );
  return result.rows[0];
};

const createOrderItem = async (client, item) => {
  await client.query(
    `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
     VALUES ($1, $2, $3, $4, $5)`,
    [item.orderId, item.productId, item.quantity, item.unitPrice, item.subtotal]
  );
};

const getOrderById = async (db, orderId) => {
  const orderResult = await db.query(
    `SELECT o.id, o.total, o.status, o.created_at,
            c.id AS customer_id,
            c.full_name,
            c.email,
            c.phone,
            c.address,
            c.city,
            c.location_reference
     FROM orders o
     JOIN customers c ON c.id = o.customer_id
     WHERE o.id = $1`,
    [orderId]
  );

  const order = orderResult.rows[0];
  if (!order) {
    return null;
  }

  const itemsResult = await db.query(
    `SELECT oi.id,
            oi.product_id,
            p.name AS product_name,
            oi.quantity,
            oi.unit_price,
            oi.subtotal
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1
     ORDER BY oi.id`,
    [orderId]
  );

  return {
    id: order.id,
    total: Number(order.total),
    status: order.status,
    createdAt: order.created_at,
    customer: {
      id: order.customer_id,
      fullName: order.full_name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      locationReference: order.location_reference
    },
    items: itemsResult.rows.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      subtotal: Number(item.subtotal)
    }))
  };
};

module.exports = {
  createCustomer,
  createOrder,
  createOrderItem,
  getOrderById
};
