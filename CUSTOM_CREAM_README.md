# Base de Datos para Constructor de Cremas Personalizadas

Este documento describe la estructura de la base de datos para el sistema de cremas personalizadas de Botanic Care.

## Estructura de Tablas

### 1. `custom_oils` - Aceites Base
Almacena los aceites base disponibles para las cremas personalizadas.

**Campos:**
- `id` (TEXT, PK): Identificador único (ej: 'uva', 'jojoba')
- `name` (TEXT): Nombre del aceite
- `emoji` (TEXT): Emoji representativo
- `description` (TEXT): Descripción del aceite
- `price_modifier` (DECIMAL): Modificador de precio adicional
- `created_at`, `updated_at` (TIMESTAMP): Fechas de creación y actualización

### 2. `custom_extracts` - Extractos Botánicos
Almacena los extractos botánicos disponibles (máximo 2 por crema).

**Campos:**
- `id` (TEXT, PK): Identificador único (ej: 'aloe', 'pepino')
- `name` (TEXT): Nombre del extracto
- `emoji` (TEXT): Emoji representativo
- `price_modifier` (DECIMAL): Modificador de precio adicional
- `created_at`, `updated_at` (TIMESTAMP): Fechas de creación y actualización

### 3. `custom_functions` - Funciones Activas
Almacena las funciones activas disponibles (anti-aging, hidratante, purificante).

**Campos:**
- `id` (TEXT, PK): Identificador único (ej: 'anti-aging', 'hidratante')
- `name` (TEXT): Nombre de la función
- `emoji` (TEXT): Emoji representativo
- `ingredients` (TEXT[]): Array de ingredientes incluidos
- `price_modifier` (DECIMAL): Modificador de precio adicional
- `created_at`, `updated_at` (TIMESTAMP): Fechas de creación y actualización

### 4. `custom_creams` - Cremas Personalizadas
Almacena las configuraciones de cremas personalizadas creadas por los usuarios.

**Campos:**
- `id` (BIGSERIAL, PK): ID único de la crema
- `user_id` (UUID): ID del usuario (opcional, para futura autenticación)
- `oil_id` (TEXT, FK): Referencia a `custom_oils`
- `extract_ids` (TEXT[]): Array de IDs de extractos seleccionados
- `function_id` (TEXT, FK): Referencia a `custom_functions`
- `base_price` (DECIMAL): Precio base de la crema
- `final_price` (DECIMAL): Precio final calculado (base + modificadores)
- `name` (TEXT): Nombre personalizado opcional
- `status` (TEXT): Estado de la crema ('draft', 'in_cart', 'ordered', 'completed')
- `created_at`, `updated_at` (TIMESTAMP): Fechas de creación y actualización

### 5. `custom_cream_orders` - Pedidos de Cremas Personalizadas
Almacena los pedidos de cremas personalizadas.

**Campos:**
- `id` (BIGSERIAL, PK): ID único del pedido
- `custom_cream_id` (BIGINT, FK): Referencia a `custom_creams`
- `order_id` (BIGINT): Referencia a tabla de órdenes generales (opcional)
- `user_id` (UUID): ID del usuario
- `quantity` (INTEGER): Cantidad ordenada
- `unit_price` (DECIMAL): Precio unitario al momento del pedido
- `total_price` (DECIMAL): Precio total (unit_price * quantity)
- `subscription` (BOOLEAN): Si es parte de una suscripción
- `subscription_frequency` (TEXT): Frecuencia de suscripción ('monthly', 'bimonthly', 'quarterly')
- `status` (TEXT): Estado del pedido ('pending', 'processing', 'preparing', 'ready', 'shipped', 'delivered', 'cancelled')
- `created_at`, `updated_at` (TIMESTAMP): Fechas de creación y actualización

## Cálculo de Precios

El precio final de una crema personalizada se calcula así:

```
precio_final = precio_base + 
               modificador_aceite + 
               sum(modificadores_extractos) + 
               modificador_funcion
```

## Flujo de Uso

1. **Usuario selecciona opciones:**
   - Un aceite base (obligatorio)
   - Hasta 2 extractos botánicos
   - Una función activa (obligatorio)

2. **Se crea un registro en `custom_creams`:**
   - Status inicial: 'draft'
   - Se calcula el precio final

3. **Usuario agrega al carrito o suscripción:**
   - Status cambia a 'in_cart'
   - Se puede crear un registro en `custom_cream_orders` si se ordena directamente

4. **Cuando se completa el pedido:**
   - Status cambia a 'ordered'
   - Se crea/actualiza registro en `custom_cream_orders`

## Instalación

1. Ejecuta `custom-cream-schema.sql` para crear las tablas
2. Ejecuta `insert-custom-options.sql` para insertar las opciones disponibles

## Seguridad (RLS)

- Las opciones (oils, extracts, functions) son de lectura pública
- Los usuarios pueden crear sus propias cremas personalizadas
- Las políticas RLS están configuradas para permitir operaciones básicas
- Para producción, considera restringir acceso basado en `user_id` cuando implementes autenticación

## Próximos Pasos

1. Implementar hooks de React Query para obtener opciones desde Supabase
2. Crear función para calcular precios automáticamente
3. Integrar con el carrito de compras
4. Implementar sistema de suscripciones
5. Agregar autenticación de usuarios para rastrear cremas por usuario

