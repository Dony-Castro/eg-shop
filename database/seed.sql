INSERT INTO products (name, description, price, image_url, stock, active)
VALUES
  ('Licuadora Oster 10 Velocidades', 'Licuadora de vidrio resistente con 10 velocidades y motor potente para jugos y batidas.', 3890.00, '/images/product-placeholder.svg', 20, TRUE),
  ('Freidora de Aire 5L', 'Freidora de aire digital de 5 litros con control de temperatura y temporizador.', 6950.00, '/images/product-placeholder.svg', 15, TRUE),
  ('Set de Ollas Antiadherentes', 'Juego de 7 piezas para cocina diaria con tapas de vidrio templado.', 5400.00, '/images/product-placeholder.svg', 18, TRUE),
  ('Audífonos Bluetooth Pro', 'Audífonos inalámbricos con cancelación de ruido y estuche de carga rápida.', 2950.00, '/images/product-placeholder.svg', 35, TRUE),
  ('Teclado Mecánico RGB', 'Teclado mecánico para productividad y gaming con switches táctiles.', 4200.00, '/images/product-placeholder.svg', 12, TRUE),
  ('Mouse Inalámbrico Ergonómico', 'Mouse recargable con diseño ergonómico y conexión dual.', 1650.00, '/images/product-placeholder.svg', 30, TRUE),
  ('Lámpara LED de Escritorio', 'Lámpara LED regulable con puerto USB y tres tonos de luz.', 2100.00, '/images/product-placeholder.svg', 22, TRUE),
  ('Organizador Modular de Closet', 'Organizador de hogar de 6 compartimentos para ropa y accesorios.', 1850.00, '/images/product-placeholder.svg', 25, TRUE),
  ('Cámara Web Full HD', 'Cámara web 1080p con micrófono integrado para clases y videollamadas.', 3350.00, '/images/product-placeholder.svg', 10, TRUE),
  ('Power Bank 20000mAh', 'Batería portátil de alta capacidad con carga rápida y doble salida USB.', 2750.00, '/images/product-placeholder.svg', 28, TRUE)
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description,
    price = EXCLUDED.price,
    image_url = EXCLUDED.image_url,
    stock = EXCLUDED.stock,
    active = EXCLUDED.active,
    updated_at = CURRENT_TIMESTAMP;
