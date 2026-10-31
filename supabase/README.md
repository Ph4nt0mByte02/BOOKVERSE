# Supabase

El frontend usa únicamente `SUPABASE_URL` y la clave publicable. La clave secreta,
si se necesita para tareas server-side, solo debe existir como variable privada en
Vercel o en el backend.

Para permitir acceso a `/consola`, crea el usuario en Supabase Auth y asígnale el
rol `admin` en `app_metadata` desde un entorno seguro. Nunca aceptes el rol desde
`user_metadata` enviado por el cliente.

Ejecuta las migraciones en orden:

1. `001_bookverse.sql`: estructura, relaciones y RLS.
2. `002_seed_books.sql`: catálogo inicial de BOOKVERSE.

El usuario administrativo configurado para este proyecto es:
`1ad4f5c4-2b16-4592-92e5-1b01258abbf9`.
También está permitido como administrador mediante `SUPABASE_ADMIN_USER_ID`;
configura esa variable en Vercel. Para el acceso puedes usar contraseña o enlace
mágico de Supabase Auth.
