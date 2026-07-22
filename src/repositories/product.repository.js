const db = require('../config/database');

const getAll = async ({ search, active } = {}) => {
  const conditions = [];
  const params = [];

  if (typeof active !== 'undefined') {
    params.push(active === 'true');
    conditions.push(`active = $${params.length}`);
  } else {
    conditions.push('active = true');
  }

  if (search) {
    params.push(`%${search.trim()}%`);
    conditions.push(`name ILIKE $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `
    SELECT id, name, description, price, image_url, stock, active
    FROM products
    ${where}
    ORDER BY id ASC
  `;

  const result = await db.query(sql, params);
  return result.rows;
};

const getById = async (id) => {
  const result = await db.query(
    `SELECT id, name, description, price, image_url, stock, active
     FROM products
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

const getByIdsForUpdate = async (client, ids) => {
  const result = await client.query(
    `SELECT id, name, price, stock, active
     FROM products
     WHERE id = ANY($1::int[])
     FOR UPDATE`,
    [ids]
  );
  return result.rows;
};

const decreaseStock = async (client, productId, quantity) => {
  await client.query(
    `UPDATE products
     SET stock = stock - $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [quantity, productId]
  );
};

module.exports = {
  getAll,
  getById,
  getByIdsForUpdate,
  decreaseStock
};
