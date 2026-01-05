# Sistema de Nutrientes - Guía de Configuración

Este documento explica cómo configurar y usar el nuevo sistema de nutrientes/ingredientes.

## Estructura de la Base de Datos

El sistema utiliza tres tablas principales:

1. **nutrient_categories**: Categorías de nutrientes (Vitaminas, Proteínas, Minerales, etc.)
2. **nutrients**: Nutrientes/ingredientes individuales con su información
3. **product_nutrients**: Relación muchos a muchos entre productos y nutrientes

## Pasos de Configuración

### 1. Ejecutar el Schema SQL

Ejecuta el archivo `nutrients-schema.sql` en el SQL Editor de Supabase para crear las tablas necesarias:

```sql
-- Ejecutar nutrients-schema.sql
```

### 2. Insertar Datos Iniciales

Ejecuta el archivo `insert-nutrients.sql` para insertar las categorías y nutrientes iniciales:

```sql
-- Ejecutar insert-nutrients.sql
```

Esto creará:
- 7 categorías de nutrientes
- 25+ nutrientes con sus descripciones, beneficios y fuentes naturales

### 3. Asociar Nutrientes con Productos (IMPORTANTE)

Ejecuta el archivo `migrate-product-nutrients.sql` para asociar automáticamente los ingredientes de los productos con los nutrientes:

```sql
-- Ejecutar migrate-product-nutrients.sql
```

**Este paso es crucial** - sin él, el filtro de nutrientes en la tienda no mostrará ningún producto porque no hay relaciones establecidas.

### 3. Asociar Nutrientes con Productos

Ejecuta el script de migración `migrate-product-nutrients.sql` para asociar automáticamente los ingredientes existentes de los productos con los nutrientes:

```sql
-- Ejecutar migrate-product-nutrients.sql
```

Este script busca coincidencias entre los ingredientes de los productos y los nutrientes usando palabras clave. Asocia:

- **Vitaminas**: Vitamina A (Retinol), Vitamina C, Vitamina E, Vitamina K
- **Ácidos Grasos**: Omega-3, Omega-6, Omega-9 (basado en los aceites)
- **Minerales**: Zinc, Magnesio
- **Aminoácidos**: Ácido Hialurónico, Glicina
- **Proteínas**: Colágeno (péptidos)
- **Antioxidantes**: Polifenoles, Flavonoides (té verde)

El script incluye consultas SELECT al final para verificar los resultados de la migración.

## Uso en la Aplicación

### Filtrado por Nutrientes

Los usuarios pueden filtrar productos por nutrientes en la página de Tienda usando el dropdown "Nutrientes" en la barra lateral de filtros.

### Visualización en Nutrición

La página de Nutrición (`/nutrition`) muestra todos los nutrientes organizados por categorías, obteniendo la información directamente de la base de datos.

## Administración de Nutrientes

### Agregar Nuevos Nutrientes

```sql
INSERT INTO nutrients (name, category_id, description, benefits, sources)
VALUES (
  'Nombre del Nutriente',
  'category-id', -- ID de la categoría (ej: 'vitamins', 'minerals', etc.)
  'Descripción del nutriente...',
  ARRAY['Beneficio 1', 'Beneficio 2', 'Beneficio 3'],
  ARRAY['Fuente 1', 'Fuente 2', 'Fuente 3']
);
```

### Asociar Nutriente con Producto

```sql
INSERT INTO product_nutrients (product_id, nutrient_id)
VALUES (
  (SELECT id FROM products WHERE sku = 'SKU-001'),
  (SELECT id FROM nutrients WHERE name = 'Vitamina C (Ácido Ascórbico)')
)
ON CONFLICT (product_id, nutrient_id) DO NOTHING;
```

### Consultar Nutrientes de un Producto

```sql
SELECT n.*
FROM nutrients n
INNER JOIN product_nutrients pn ON n.id = pn.nutrient_id
WHERE pn.product_id = 1; -- ID del producto
```

## Migración de Datos Existentes

Si tienes productos existentes con ingredientes, necesitarás crear un script de migración que:

1. Analice los ingredientes de cada producto
2. Identifique qué nutrientes corresponden a esos ingredientes
3. Inserte las relaciones en `product_nutrients`

Puedes hacer esto de forma manual o crear un script que haga coincidencias automáticas basadas en palabras clave.

## Mantener Compatibilidad

El campo `ingredients` (TEXT[]) en la tabla `products` se mantiene por compatibilidad con el código existente. Puedes optar por:

1. **Migrar completamente**: Eliminar el campo `ingredients` y usar solo `product_nutrients`
2. **Mantener ambos**: Usar `product_nutrients` para filtros y relaciones, y `ingredients` para visualización simple

Para la visualización en la página del producto, puedes elegir mostrar los ingredientes desde `product_nutrients` o desde el campo `ingredients` original.

