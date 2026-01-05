# Instrucciones de Configuración - Sistema de Roles

## ⚠️ IMPORTANTE: Orden de Ejecución

Ejecuta los scripts SQL en este orden específico:

### Paso 1: Schema Base de Productos
Ejecuta `supabase-schema.sql` (si aún no lo has hecho)

### Paso 2: Schema de Roles
Ejecuta **SOLO** `user-roles-schema.sql`

Este archivo incluye:
- ✅ Creación de la tabla `user_roles`
- ✅ Políticas RLS para roles
- ✅ Políticas RLS para productos (solo admins)
- ✅ Trigger para asignar rol "cliente" automáticamente

### Paso 3: NO ejecutes `admin-rls-policies.sql`
Este archivo es redundante si ya ejecutaste `user-roles-schema.sql`

## Configurar el Primer Admin

Después de ejecutar `user-roles-schema.sql` y crear tu primera cuenta:

1. **Obtén tu User ID:**
   - Ve a Supabase > Authentication > Users
   - Copia el UUID de tu usuario

2. **Ejecuta este SQL:**
```sql
-- Reemplaza 'TU_USER_ID_AQUI' con el UUID que copiaste
INSERT INTO user_roles (user_id, role) 
VALUES ('TU_USER_ID_AQUI', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Verificación

Después de configurar todo:

1. Inicia sesión con tu cuenta
2. Deberías poder acceder a `/admin`
3. Deberías poder crear/editar/eliminar productos

## Solución de Problemas

### Error: "syntax error at or near '{'"
- Asegúrate de ejecutar SOLO código SQL en el editor SQL de Supabase
- No copies código TypeScript/JavaScript
- Verifica que el archivo que estás ejecutando termine en `.sql`

### Error: "relation user_roles does not exist"
- Ejecuta primero `user-roles-schema.sql`
- Verifica que la tabla se haya creado correctamente

### No puedo acceder a /admin
- Verifica que tu usuario tenga rol "admin" en la tabla `user_roles`
- Recarga la página después de cambiar el rol
- Verifica que estés autenticado

