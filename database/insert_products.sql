-- Script SQL para insertar productos directamente en la base de datos
-- Ejecutar en MySQL Workbench o tu cliente de base de datos

-- Limpiar tabla si es necesario (descomentar si quieres empezar limpio)
-- TRUNCATE TABLE product;

INSERT INTO product (code, product_name, descripcion, price, stock, categoria, imagen, personalizable, max_msg_chars, tipo_forma, tamanos_disponibles) VALUES
('TC001', 'Torta Cuadrada de Chocolate', 'Deliciosa torta de chocolate con ganache y toque de avellanas. Ideal para personalizar con mensaje.', 45000, 10, 'Tortas Cuadradas', 'assets/chocolate-2.jpg', 1, 50, 'cuadrada', 'S (8 porciones),M (12 porciones),L (20 porciones)'),
('TC002', 'Torta Cuadrada de Frutas', 'Bizcocho de vainilla con frutas frescas y crema chantilly.', 50000, 8, 'Tortas Cuadradas', 'assets/Torta Cuadrada de Frutas.png', 1, 50, 'cuadrada', 'S (8 porciones),M (12 porciones),L (20 porciones)'),
('TT001', 'Torta Circular de Vainilla', 'Vainilla clásica rellena con crema pastelera y glaseado dulce.', 40000, 12, 'Tortas Circulares', 'assets/Torta Circular de Vainilla.jpg', 1, 50, 'circular', 'S (8 porciones),M (12 porciones),L (20 porciones)'),
('TT002', 'Torta Circular de Manjar', 'Clásica torta chilena con manjar y nueces.', 42000, 9, 'Tortas Circulares', 'assets/Torta Circular de Manjar.jpg', 1, 50, 'circular', 'S (8 porciones),M (12 porciones),L (20 porciones)'),
('PI001', 'Mousse de Chocolate', 'Postre cremoso con chocolate de alta calidad.', 5000, 40, 'Postres Individuales', 'assets/Mousse de Chocolate.jpg', 0, 0, NULL, 'unidad'),
('PI002', 'Tiramisú Clásico', 'Café, mascarpone y cacao en un equilibrio perfecto.', 5500, 36, 'Postres Individuales', 'assets/Tiramisú Clásico.jpg', 0, 0, NULL, 'unidad'),
('PSA001', 'Torta Sin Azúcar de Naranja', 'Endulzada naturalmente para quienes buscan opciones más saludables.', 48000, 7, 'Postres Sin Azúcar', 'assets/Torta Sin Azúcar de Naranja.png', 1, 50, 'circular', 'S (8 porciones),M (12 porciones)'),
('PSA002', 'Cheesecake Sin Azúcar', 'Suave y cremoso, ideal para disfrutar sin culpa.', 47000, 6, 'Postres Sin Azúcar', 'assets/Cheesecake Sin Azúcar.jpg', 1, 50, 'circular', 'S (8 porciones),M (12 porciones)'),
('PT001', 'Empanada de Manzana', 'Rellena de manzanas especiadas, perfecta para el desayuno o merienda.', 3000, 50, 'Postres Tradicionales', 'assets/Empanada de Manzana.jpg', 0, 0, NULL, 'unidad'),
('PT002', 'Tarta de Santiago', 'Clásica tarta de almendras, azúcar y huevos.', 6000, 22, 'Postres Tradicionales', 'assets/Tarta de Santiago.jpg', 0, 0, 'circular', 'S (8 porciones)'),
('PG001', 'Brownie Sin Gluten', 'Denso y sabroso, libre de gluten.', 4000, 35, 'Postres Sin Gluten', 'assets/Brownie Sin Gluten.jpg', 0, 0, 'cuadrada', 'unidad'),
('PG002', 'Pan Sin Gluten', 'Suave y esponjoso, ideal para sándwiches.', 3500, 28, 'Postres Sin Gluten', 'assets/Pan sin gluten.png', 0, 0, NULL, 'unidad'),
('PV001', 'Torta Vegana de Chocolate', 'Húmeda y deliciosa, sin ingredientes de origen animal.', 50000, 6, 'Postres Veganos', 'assets/Torta Vegana de Chocolate.jpg', 1, 50, 'circular', 'S (8 porciones),M (12 porciones)'),
('PV002', 'Galletas Veganas de Avena', 'Crujientes y sabrosas, perfectas para colación.', 4500, 40, 'Postres Veganos', 'assets/Galletas Veganas de Avena.jpg', 0, 0, NULL, 'unidad'),
('TE001', 'Torta Especial de Cumpleaños', 'Pensada para celebrar: admite decoraciones temáticas y mensaje.', 55000, 7, 'Tortas Especiales', 'assets/Torta Especial de Cumpleaños.jpg', 1, 50, 'circular', 'S (8 porciones),M (12 porciones),L (20 porciones)'),
('TE002', 'Torta Especial de Boda', 'Elegante y memorable; lista para personalizar.', 60000, 4, 'Tortas Especiales', 'assets/Torta Especial de Boda.jpg', 1, 50, 'circular', 'M (12 porciones),L (20 porciones)');

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_productos FROM product;
SELECT * FROM product ORDER BY code;
