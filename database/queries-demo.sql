-- Mostrar todos los productos
SELECT id, name, price, stock, active
FROM products
ORDER BY id;

-- Mostrar el último cliente
SELECT *
FROM customers
ORDER BY id DESC
LIMIT 1;

-- Mostrar el último pedido
SELECT *
FROM orders
ORDER BY id DESC
LIMIT 1;

-- Mostrar los detalles del último pedido
SELECT *
FROM order_items
WHERE order_id = (SELECT id FROM orders ORDER BY id DESC LIMIT 1);

-- Mostrar un pedido completo mediante JOIN (consulta principal)
SELECT
  o.id AS order_id,
  c.full_name AS cliente,
  c.email AS correo,
  p.name AS producto,
  oi.quantity AS cantidad,
  oi.unit_price AS precio_unitario,
  oi.subtotal,
  o.total,
  o.status,
  o.created_at AS fecha
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
ORDER BY o.id DESC, oi.id;

-- Mostrar cantidad de pedidos por estado
SELECT status, COUNT(*) AS total_pedidos
FROM orders
GROUP BY status
ORDER BY total_pedidos DESC;

-- Mostrar productos con menor stock
SELECT id, name, stock
FROM products
ORDER BY stock ASC, name ASC
LIMIT 5;
