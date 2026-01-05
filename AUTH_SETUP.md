# Configuración de Autenticación

Este documento explica cómo configurar la autenticación de usuarios en Botanic Care usando Supabase.

## Características Implementadas

✅ **Login** - Inicio de sesión con email y contraseña  
✅ **Registro** - Creación de nuevas cuentas  
✅ **Protección de Rutas** - Rutas protegidas que requieren autenticación  
✅ **Gestión de Sesión** - Manejo automático de sesiones  
✅ **UI Integrada** - Menú de usuario en el header  

## Rutas Protegidas

Las siguientes rutas requieren que el usuario esté autenticado:
- `/cart` - Carrito de compras
- `/wishlist` - Lista de deseos
- `/dashboard` - Panel del usuario

Si un usuario no autenticado intenta acceder, será redirigido a `/login`.

## Configuración en Supabase

### 1. Habilitar Autenticación por Email

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Navega a **Authentication** > **Providers**
3. Asegúrate de que **Email** esté habilitado
4. Configura las opciones según tus necesidades:
   - **Enable email confirmations**: Opcional (recomendado para producción)
   - **Secure email change**: Recomendado

### 2. Configurar URLs de Redirección

1. Ve a **Authentication** > **URL Configuration**
2. Agrega las siguientes URLs a **Redirect URLs**:
   - `http://localhost:8080` (desarrollo)
   - `https://tu-dominio.com` (producción)
   - `http://localhost:8080/**` (para callbacks)

### 3. Configurar Plantillas de Email (Opcional)

1. Ve a **Authentication** > **Email Templates**
2. Personaliza las plantillas de:
   - Confirmación de email
   - Recuperación de contraseña
   - Cambio de email

## Uso en el Código

### Obtener el Usuario Actual

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>No autenticado</div>;

  return <div>Hola, {user.email}!</div>;
}
```

### Proteger un Componente

```typescript
import { ProtectedRoute } from '@/App';

function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Contenido protegido</div>
    </ProtectedRoute>
  );
}
```

### Cerrar Sesión

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <button onClick={() => signOut()}>
      Cerrar Sesión
    </button>
  );
}
```

## Estructura de Usuario

Cuando un usuario se registra, Supabase crea automáticamente un registro en la tabla `auth.users` con:

- `id` (UUID) - ID único del usuario
- `email` - Email del usuario
- `user_metadata` - Metadatos adicionales (nombre, etc.)
- `created_at` - Fecha de creación

Puedes acceder a estos datos usando `user.id`, `user.email`, `user.user_metadata.name`, etc.

## Integración con Base de Datos

Para asociar datos del usuario con tus tablas (como pedidos, cremas personalizadas, etc.), usa el `user.id`:

```sql
-- Ejemplo: Tabla de pedidos
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Próximos Pasos

1. ✅ Autenticación básica implementada
2. 🔄 Integrar con carrito de compras (guardar carrito por usuario)
3. 🔄 Perfil de usuario (editar información)
4. 🔄 Historial de pedidos
5. 🔄 Recuperación de contraseña (página de reset)
6. 🔄 Verificación de email (opcional)

## Notas de Seguridad

- Las contraseñas se almacenan de forma segura usando bcrypt
- Las sesiones se manejan mediante JWT tokens
- Row Level Security (RLS) puede configurarse para proteger datos por usuario
- Nunca expongas las claves de servicio en el frontend

