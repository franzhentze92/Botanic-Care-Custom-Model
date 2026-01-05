-- Script para insertar categorías y nutrientes en la base de datos
-- Ejecuta este script después de crear el schema de nutrientes

-- Insertar categorías de nutrientes
INSERT INTO nutrient_categories (id, name, description, icon) VALUES
('vitamins', 'Vitaminas', 'Las vitaminas son compuestos orgánicos esenciales que la piel necesita para funcionar correctamente. En cosmética natural, las vitaminas actúan como antioxidantes, promueven la regeneración celular y protegen contra los daños ambientales.', 'Sun'),
('proteins', 'Proteínas', 'Las proteínas son los componentes básicos de la piel. En productos cosméticos naturales, las proteínas vegetales ayudan a fortalecer la estructura de la piel y mantener su elasticidad.', 'Bean'),
('minerals', 'Minerales', 'Los minerales son elementos inorgánicos esenciales que regulan las funciones de la piel, mantienen el equilibrio de humedad y proporcionan protección.', 'Sparkles'),
('fatty-acids', 'Ácidos Grasos', 'Los ácidos grasos son componentes esenciales de las membranas celulares y ayudan a mantener la barrera protectora de la piel, previniendo la pérdida de humedad.', 'Droplets'),
('antioxidants', 'Antioxidantes', 'Los antioxidantes protegen la piel del daño causado por los radicales libres, el estrés oxidativo y factores ambientales como la contaminación y la radiación UV.', 'Shield'),
('amino-acids', 'Aminoácidos', 'Los aminoácidos son los componentes básicos de las proteínas. En cosmética, ayudan a hidratar, reparar y mantener la salud de la piel.', 'Zap'),
('enzymes', 'Enzimas', 'Las enzimas naturales ayudan en la renovación celular, exfoliación suave y mejoran la textura de la piel sin irritación.', 'Flower2')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  updated_at = NOW();

-- Insertar nutrientes - Vitaminas
INSERT INTO nutrients (name, category_id, description, benefits, sources) VALUES
('Vitamina A (Retinol)', 'vitamins', 'Esencial para la regeneración celular y la producción de colágeno. Ayuda a mejorar la textura de la piel y reducir la apariencia de líneas finas.', 
 ARRAY['Regeneración celular', 'Reducción de arrugas', 'Mejora de la textura', 'Tratamiento del acné'],
 ARRAY['Zanahoria', 'Espinaca', 'Aceite de rosa mosqueta', 'Aceite de hígado de bacalao']),

('Vitamina C (Ácido Ascórbico)', 'vitamins', 'Poderoso antioxidante que protege contra los radicales libres, estimula la producción de colágeno y ayuda a iluminar la piel.',
 ARRAY['Producción de colágeno', 'Protección antioxidante', 'Iluminación de la piel', 'Reducción de manchas'],
 ARRAY['Limón', 'Naranja', 'Rosa mosqueta', 'Acerola', 'Kiwi', 'Fresas']),

('Vitamina E (Tocoferol)', 'vitamins', 'Antioxidante natural que protege la piel del daño oxidativo, ayuda a mantener la humedad y promueve la cicatrización.',
 ARRAY['Protección antioxidante', 'Hidratación profunda', 'Cicatrización', 'Antiinflamatorio'],
 ARRAY['Aceite de germen de trigo', 'Aceite de girasol', 'Almendras', 'Aguacate']),

('Vitamina K', 'vitamins', 'Ayuda a reducir la apariencia de círculos oscuros y moretones, mejorando la apariencia general de la piel.',
 ARRAY['Reducción de círculos oscuros', 'Mejora de circulación', 'Cicatrización'],
 ARRAY['Espinaca', 'Col rizada', 'Brócoli', 'Aceite de oliva'])

ON CONFLICT (name) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  sources = EXCLUDED.sources,
  updated_at = NOW();

-- Insertar nutrientes - Proteínas
INSERT INTO nutrients (name, category_id, description, benefits, sources) VALUES
('Colágeno', 'proteins', 'Proteína estructural principal de la piel que proporciona firmeza y elasticidad. Aunque el colágeno tópico no penetra profundamente, los péptidos vegetales pueden estimular su producción.',
 ARRAY['Firmeza de la piel', 'Elasticidad', 'Reducción de arrugas', 'Apariencia juvenil'],
 ARRAY['Proteínas vegetales hidrolizadas', 'Péptidos de arroz', 'Proteína de trigo', 'Aminoácidos esenciales']),

('Queratina', 'proteins', 'Proteína estructural que forma la capa externa de la piel y el cabello, proporcionando protección y resistencia.',
 ARRAY['Fortalecimiento de la piel', 'Protección', 'Textura mejorada'],
 ARRAY['Proteína de trigo', 'Proteína de soja', 'Queratina vegetal']),

('Elastina', 'proteins', 'Proteína que permite que la piel recupere su forma después de estirarse, manteniendo la flexibilidad.',
 ARRAY['Flexibilidad', 'Recuperación de elasticidad', 'Apariencia joven'],
 ARRAY['Péptidos vegetales', 'Proteínas de origen vegetal'])

ON CONFLICT (name) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  sources = EXCLUDED.sources,
  updated_at = NOW();

-- Insertar nutrientes - Minerales
INSERT INTO nutrients (name, category_id, description, benefits, sources) VALUES
('Zinc', 'minerals', 'Mineral esencial que ayuda a controlar la producción de aceite, reduce la inflamación y promueve la cicatrización de heridas.',
 ARRAY['Control de acné', 'Antiinflamatorio', 'Cicatrización', 'Protección solar'],
 ARRAY['Óxido de zinc', 'Zinc PCA', 'Extractos de plantas ricas en zinc']),

('Selenio', 'minerals', 'Antioxidante mineral que protege contra el daño solar y ayuda a mantener la elasticidad de la piel.',
 ARRAY['Protección antioxidante', 'Anti-envejecimiento', 'Protección solar'],
 ARRAY['Nueces de Brasil', 'Semillas de girasol', 'Extractos vegetales']),

('Cobre', 'minerals', 'Mineral que estimula la producción de colágeno y elastina, esencial para la salud y apariencia de la piel.',
 ARRAY['Producción de colágeno', 'Regeneración celular', 'Propiedades antimicrobianas'],
 ARRAY['Péptidos de cobre', 'Extractos de plantas']),

('Magnesio', 'minerals', 'Mineral que ayuda a regular el estrés en la piel y promueve la relajación celular.',
 ARRAY['Relajación', 'Regulación del estrés', 'Mejora del tono'],
 ARRAY['Sal de Epsom', 'Extractos de algas', 'Arcilla'])

ON CONFLICT (name) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  sources = EXCLUDED.sources,
  updated_at = NOW();

-- Insertar nutrientes - Ácidos Grasos
INSERT INTO nutrients (name, category_id, description, benefits, sources) VALUES
('Omega-3', 'fatty-acids', 'Ácidos grasos esenciales que reducen la inflamación, nutren la piel profundamente y ayudan a mantener la barrera cutánea saludable.',
 ARRAY['Antiinflamatorio', 'Nutrición profunda', 'Barrera cutánea', 'Hidratación'],
 ARRAY['Aceite de linaza', 'Aceite de chía', 'Aceite de cáñamo', 'Aceite de rosa mosqueta']),

('Omega-6', 'fatty-acids', 'Ayuda a mantener la integridad de la barrera cutánea y previene la pérdida de humedad.',
 ARRAY['Barrera cutánea', 'Hidratación', 'Reparación'],
 ARRAY['Aceite de girasol', 'Aceite de cártamo', 'Aceite de borraja']),

('Omega-9', 'fatty-acids', 'Ácido graso no esencial que proporciona hidratación y ayuda a suavizar la piel.',
 ARRAY['Hidratación', 'Suavidad', 'Brillo'],
 ARRAY['Aceite de oliva', 'Aceite de aguacate', 'Aceite de almendras'])

ON CONFLICT (name) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  sources = EXCLUDED.sources,
  updated_at = NOW();

-- Insertar nutrientes - Antioxidantes
INSERT INTO nutrients (name, category_id, description, benefits, sources) VALUES
('Polifenoles', 'antioxidants', 'Compuestos naturales con potentes propiedades antioxidantes que protegen contra el envejecimiento prematuro.',
 ARRAY['Protección antioxidante', 'Anti-envejecimiento', 'Antiinflamatorio'],
 ARRAY['Té verde', 'Uvas', 'Arándanos', 'Cacao', 'Romero']),

('Flavonoides', 'antioxidants', 'Antioxidantes vegetales que ayudan a proteger la piel y mejorar su apariencia general.',
 ARRAY['Protección UV', 'Antiinflamatorio', 'Mejora de la circulación'],
 ARRAY['Té verde', 'Ginkgo biloba', 'Propóleos', 'Miel']),

('Carotenoides', 'antioxidants', 'Pigmentos naturales que proporcionan protección antioxidante y pueden dar un tono saludable a la piel.',
 ARRAY['Protección antioxidante', 'Tono saludable', 'Protección solar natural'],
 ARRAY['Zanahoria', 'Tomate', 'Espinaca', 'Calabaza'])

ON CONFLICT (name) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  sources = EXCLUDED.sources,
  updated_at = NOW();

-- Insertar nutrientes - Aminoácidos
INSERT INTO nutrients (name, category_id, description, benefits, sources) VALUES
('Ácido Hialurónico', 'amino-acids', 'Aunque técnicamente no es un aminoácido, es un componente clave que puede retener hasta 1000 veces su peso en agua, proporcionando hidratación intensa.',
 ARRAY['Hidratación intensa', 'Relleno de arrugas', 'Piel más llena'],
 ARRAY['Fermentación vegetal', 'Extractos de plantas']),

('Glicina', 'amino-acids', 'Aminoácido que ayuda en la síntesis de colágeno y promueve la cicatrización.',
 ARRAY['Síntesis de colágeno', 'Cicatrización', 'Hidratación'],
 ARRAY['Proteínas vegetales', 'Extractos de soja']),

('Prolina', 'amino-acids', 'Aminoácido esencial para la producción de colágeno y la estructura de la piel.',
 ARRAY['Producción de colágeno', 'Estructura de la piel', 'Elasticidad'],
 ARRAY['Proteínas vegetales', 'Extractos naturales'])

ON CONFLICT (name) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  sources = EXCLUDED.sources,
  updated_at = NOW();

-- Insertar nutrientes - Enzimas
INSERT INTO nutrients (name, category_id, description, benefits, sources) VALUES
('Papaina', 'enzymes', 'Enzima derivada de la papaya que exfolia suavemente la piel, eliminando células muertas.',
 ARRAY['Exfoliación suave', 'Renovación celular', 'Brillo natural'],
 ARRAY['Papaya', 'Extractos de papaya']),

('Bromelina', 'enzymes', 'Enzima de la piña que ayuda a exfoliar y reducir la inflamación.',
 ARRAY['Exfoliación', 'Antiinflamatorio', 'Mejora de textura'],
 ARRAY['Piña', 'Extractos de piña'])

ON CONFLICT (name) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  sources = EXCLUDED.sources,
  updated_at = NOW();

-- Nota: Después de ejecutar este script, necesitarás asociar los nutrientes con los productos
-- usando INSERT INTO product_nutrients (product_id, nutrient_id) VALUES (...);
-- Por ejemplo, si un producto tiene "Vitamina E" en su lista de ingredientes, 
-- necesitarás hacer match manual o crear un script de migración

