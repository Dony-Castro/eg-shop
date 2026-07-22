# E&G Shop

Tienda virtual B2C académica de **E&G Comercial** para catálogo, carrito, checkout y confirmación de pedidos persistidos en PostgreSQL.

## Características
- Catálogo dinámico desde base de datos.
- Detalle de producto con control de stock.
- Carrito persistente en `localStorage`.
- Checkout con validación frontend y backend.
- Creación de pedidos en transacción PostgreSQL con bloqueo `FOR UPDATE`.
- Confirmación visual del pedido con datos reales.

## Stack
- JavaScript, Node.js, Express.js, EJS
- HTML5, CSS3, JavaScript del navegador
- PostgreSQL con `pg`
- Docker y Docker Compose
- Jest + Supertest
- ESLint

## Arquitectura
`Views/Public -> Routes -> Controllers -> Services -> Repositories -> PostgreSQL`

## Requisitos previos
- Node.js 20+
- Docker Desktop (opcional, recomendado)
- npm

## Instalación con Docker
1. Copia variables:
   ```bash
   cp .env.example .env
   ```
2. Levanta servicios:
   ```bash
   docker compose up --build
   ```
3. Abrir: `http://localhost:3000`

## Instalación local sin Docker
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar `.env` (ver `.env.example`).
3. Crear base y cargar scripts:
   ```bash
   psql -U postgres -d eg_shop_db -f database/schema.sql
   psql -U postgres -d eg_shop_db -f database/seed.sql
   ```
4. Ejecutar:
   ```bash
   npm run dev
   ```

## Variables de entorno
Revisar `.env.example`.

## Comandos
- `npm run dev`
- `npm start`
- `npm run lint`
- `npm test`
- `npm run test:watch`

## URLs
- Aplicación: `http://localhost:3000`
- API productos: `http://localhost:3000/api/products`
- API pedidos: `http://localhost:3000/api/orders`

## Endpoints
- `GET /`
- `GET /productos/:id`
- `GET /carrito`
- `GET /checkout`
- `GET /pedido-confirmado/:id`
- `GET /api/products?search=&active=`
- `GET /api/products/:id`
- `POST /api/orders`
- `GET /api/orders/:id`

## Estructura del proyecto
```text
src/
  config/ controllers/ services/ repositories/ routes/ middlewares/ validators/
  views/ public/
database/
docs/
tests/
```

## Cargar base de datos
- Inicial: `database/schema.sql`
- Datos demo: `database/seed.sql` (idempotente por `ON CONFLICT`)

## Ejecutar pruebas
```bash
npm test
```

## Solución de problemas frecuentes
- **No conecta a DB:** validar host/puerto/credenciales y que PostgreSQL esté activo.
- **Tabla vacía:** re-ejecutar `database/seed.sql`.
- **Puerto ocupado:** cambiar `PORT` en `.env`.

## Miembros del equipo
- Gabriel Candelario Asencio
- Dony Martín Castro Jiménez
- Eber Cedeño Paredes
