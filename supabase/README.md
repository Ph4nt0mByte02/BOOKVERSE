# Supabase

El frontend usa únicamente `SUPABASE_URL` y la clave publicable. La clave secreta,
si se necesita para tareas server-side, solo debe existir como variable privada en
Vercel o en el backend.

Para permitir acceso a `/consola`, crea el usuario en Supabase Auth y asígnale el
rol `admin` en `app_metadata` desde un entorno seguro. Nunca aceptes el rol desde
`user_metadata` enviado por el cliente.
