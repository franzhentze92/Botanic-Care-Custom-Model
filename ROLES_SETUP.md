# Configuración de Roles de Usuario

Este documento explica cómo configurar el sistema de roles (admin y cliente) en Botanic Care.

## Roles Disponibles

- **admin**: Acceso completo al panel de administración
- **cliente**: Usuario regular, acceso a compras y cuenta personal

## Configuración Inicial

### 1. Ejecutar el Schema SQL

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Navega a **SQL Editor**
3. Ejecuta el contenido del archivo `user-roles-schema.sql`

Este script creará:
- Tabla `user_roles` para almacenar los roles
- Políticas RLS para proteger las operaciones
- Trigger para asignar automáticamente rol "cliente" a nuevos usuarios
- Políticas para que solo admins puedan gestionar productos

### 2. Configurar el Primer Admin

Después de crear tu primera cuenta de usuario, necesitas asignarle el rol de admin manualmente.

#### Opción A: Desde el SQL Editor de Supabase

```sql
-- Reemplaza 'TU_USER_ID_AQUI' con el ID del usuario que quieres hacer admin
-- Puedes encontrar el user_id en la tabla auth.users
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'TU_USER_ID_AQUI';

-- O si el usuario no tiene un rol aún:
INSERT INTO user_roles (user_id, role) 
VALUES ('TU_USER_ID_AQUI', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

#### Opción B: Obtener tu User ID

1. Inicia sesión en tu aplicación
2. Abre la consola del navegador (F12)
3. Ejecuta: `localStorage.getItem('supabase.auth.token')` o revisa el token
4. O mejor, ve a Supabase > Authentication > Users y copia el UUID del usuario

#### Opción C: Usar el Dashboard de Supabase

1. Ve a **Authentication** > **Users**
2. Encuentra tu usuario
3. Copia el **UUID** (user_id)
4. Ve a **SQL Editor** y ejecuta:

```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('PEGA_AQUI_EL_UUID', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Cómo Funciona

### Asignación Automática de Roles

- Cuando un usuario se registra, automáticamente se le asigna el rol "cliente"
- Solo los usuarios con rol "admin" pueden acceder a `/admin`
- Solo los admins pueden crear, editar o eliminar productos

### Protección de Rutas

- La ruta `/admin` está protegida con `AdminRoute`
- Si un usuario no admin intenta acceder, será redirigido a `/dashboard`
- El enlace de "Administración" solo aparece en el menú para usuarios admin

### Políticas de Seguridad (RLS)

Las políticas RLS aseguran que:
- Solo admins pueden insertar/actualizar/eliminar productos
- Los usuarios pueden leer su propio rol
- Los usuarios autenticados pueden leer todos los roles (para verificar permisos)

## Cambiar el Rol de un Usuario

### Promover a Admin

```sql
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'USER_ID_AQUI';
```

### Degradar a Cliente

```sql
UPDATE user_roles 
SET role = 'cliente' 
WHERE user_id = 'USER_ID_AQUI';
```

## Verificar Roles en el Código

### En Componentes React

```typescript
import { useIsAdmin, useUserRole } from '@/hooks/useUserRole';

function MyComponent() {
  const isAdmin = useIsAdmin();
  const { data: userRole } = useUserRole();
  
  if (isAdmin) {
    // Mostrar funcionalidad de admin
  }
}
```

### Verificar Rol Específico

```typescript
const { data: userRole } = useUserRole();
const role = userRole?.role || 'cliente'; // Default a cliente
```

## Troubleshooting

### "No tengo acceso al panel de admin"

1. Verifica que tu usuario tenga el rol "admin" en la tabla `user_roles`
2. Verifica que estés autenticado
3. Recarga la página después de cambiar el rol

### "El trigger no asigna el rol automáticamente"

1. Verifica que el trigger `on_auth_user_created` esté creado
2. Verifica que la función `assign_default_role()` exista
3. Si el usuario ya existe, asigna el rol manualmente

### "Error al crear/editar productos"

1. Verifica que tengas el rol "admin"
2. Verifica que las políticas RLS estén correctamente configuradas
3. Revisa la consola del navegador para ver el error específico

## Notas Importantes

- Los roles se almacenan en la tabla `user_roles` separada de `auth.users`
- El sistema asume que si un usuario no tiene rol, es "cliente" por defecto
- Las políticas RLS se ejecutan en el servidor, por lo que son seguras
- Solo los admins pueden cambiar roles de otros usuarios

