# Base de datos - E&G Shop

- **Gestor:** PostgreSQL
- **Base de datos:** `eg_shop_db`

## Tablas

### products
- `id` SERIAL PK
- `name` VARCHAR(120) NOT NULL UNIQUE
- `description` TEXT NOT NULL
- `price` NUMERIC(10,2) NOT NULL CHECK >= 0
- `image_url` TEXT
- `stock` INTEGER NOT NULL DEFAULT 0 CHECK >= 0
- `active` BOOLEAN NOT NULL DEFAULT TRUE
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### customers
- `id` SERIAL PK
- `full_name` VARCHAR(150) NOT NULL
- `email` VARCHAR(150) NOT NULL
- `phone` VARCHAR(30) NOT NULL
- `address` TEXT NOT NULL
- `city` VARCHAR(100) NOT NULL
- `location_reference` TEXT
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### orders
- `id` SERIAL PK
- `customer_id` INTEGER NOT NULL FK -> customers(id)
- `total` NUMERIC(10,2) NOT NULL CHECK >= 0
- `status` VARCHAR(30) NOT NULL DEFAULT 'Pendiente'
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

Estados permitidos: Pendiente, Confirmado, Procesando, Enviado, Entregado, Cancelado.

### order_items
- `id` SERIAL PK
- `order_id` INTEGER NOT NULL FK -> orders(id) ON DELETE CASCADE
- `product_id` INTEGER NOT NULL FK -> products(id)
- `quantity` INTEGER NOT NULL CHECK > 0
- `unit_price` NUMERIC(10,2) NOT NULL CHECK >= 0
- `subtotal` NUMERIC(10,2) NOT NULL CHECK >= 0

## Relaciones
- customers 1:N orders
- orders 1:N order_items
- products 1:N order_items

## Consultas de demostración
Ejecuta `database/queries-demo.sql` para:
1. Listar productos.
2. Ver último cliente.
3. Ver último pedido.
4. Ver detalles del último pedido.
5. JOIN completo del pedido.
6. Conteo de pedidos por estado.
7. Productos con menor stock.
