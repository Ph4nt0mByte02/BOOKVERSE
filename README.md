# BOOKVERSE — Librería Editorial Física y Digital

> **Plataforma omnicanal de libros físicos y electrónicos**  
> Frontend modular en HTML5 semántico, CSS3 moderno y JavaScript Vanilla.  
> Backend robusto en Node.js, Express y base de datos PostgreSQL dockerizada.

---

## 📖 1. Visión y Arquitectura

BOOKVERSE combina la calidez y el sosiego de recorrer una librería física con la inmediatez y tecnología de la lectura digital.

```
BOOKVERSE/
│
├── index.html              # Portada / Hero editorial / Novedades / Recomendados
├── catalog.html            # Catálogo interactivo con filtros, búsqueda y ordenación
├── book.html               # Ficha detallada de producto (físico vs ebook)
├── cart.html               # Carrito interactivo con simulación de checkout
├── favorites.html          # Lista de deseos persistente en localStorage
├── discover.html           # Colecciones y selecciones de libreros
├── stores.html             # Sucursales físicas (Bogotá, Medellín, Cali) y Click & Collect
├── reader.html             # Lector web integrado (temas claro, sepia, oscuro)
├── help.html               # Preguntas frecuentes, envíos y formatos
├── consola.html            # Acceso estático a la Consola de Administración
│
├── assets/
│   ├── css/
│   │   ├── reset.css       # Reseteo moderno sin @import
│   │   ├── tokens.css      # Variables de diseño (papel, bosque, terracota, oro)
│   │   ├── base.css        # Tipografías editorial (DM Serif) e interfaz (Inter)
│   │   ├── layout.css      # Sistema de grillas y contenedores fluidos
│   │   ├── components.css  # Botones, tarjetas, badges, cabecera y pie
│   │   ├── animations.css  # Microinteracciones y reduced-motion
│   │   ├── responsive.css  # Breakpoints y menú adaptable
│   │   └── pages/          # Estilos específicos de cada vista
│   ├── js/
│   │   ├── app.js          # Coordinador global
│   │   ├── i18n.js         # Diccionarios multilingües (ES, EN, HI, PT)
│   │   ├── currency.js     # Formateador de divisas (COP, USD, EUR)
│   │   ├── cart.js         # Lógica del carrito de compras
│   │   ├── favorites.js    # Lógica de favoritos
│   │   ├── storage.js      # LocalStorage seguro y versionado
│   │   ├── data/           # Catálogo de 12 libros con portadas reales
│   │   └── ui/             # Toasts, modales y animaciones
│   └── images/books/       # Portadas reales de libros
│
└── backend/
    ├── package.json        # Dependencias (express, pg, helmet, cors, jwt)
    ├── docker-compose.yml  # Contenedor PostgreSQL 16 Alpine
    ├── init.sql            # Script de inicialización y datos de prueba
    ├── .env                # Variables de entorno y credenciales
    ├── src/
    │   ├── server.js       # Servidor Express y ruta /consola
    │   ├── config/db.js    # Conexión resiliente a PostgreSQL
    │   ├── middleware/     # Seguridad y autenticación JWT
    │   ├── routes/         # API REST (/books, /orders, /auth)
    │   └── views/consola/  # Panel de administración con menú lateral izquierdo
    └── tests/
        └── api.test.js     # Suite de pruebas automatizadas
```

---

## 🚀 2. Puesta en Marcha

### A. Iniciar la Base de Datos PostgreSQL con Docker Desktop
Asegúrate de que Docker Desktop esté iniciado y ejecuta:

```powershell
cd backend
docker compose up -d
```

Esto levantará el contenedor `bookverse_postgres` en el puerto `5432` con la base de datos `bookverse_db` y creará automáticamente las tablas y datos iniciales mediante `init.sql`.

> **Nota de Resiliencia:** Si la base de datos se encuentra iniciando o temporalmente pausada, el backend de BOOKVERSE cuenta con una capa de almacenamiento resiliente en memoria que garantiza que todas las APIs y la consola sigan operando sin caídas.

### B. Iniciar el Backend (Express API + Servidor Web + Consola)

```powershell
cd backend
npm install
npm start
```

El servidor quedará disponible en:
- **Tienda Principal:** `http://localhost:4000/`
- **Consola de Administración:** `http://localhost:4000/consola`
- **API Health Check:** `http://localhost:4000/api/health`

---

## 🛡️ 3. Consola de Administración (`/consola`)

Se accede directamente agregando la barra inclinada al final de la URL: `http://localhost:4000/consola` (o abriendo `consola.html`).

Cuenta con un **menú lateral en la parte izquierda** con todos los módulos de gestión:
1. 📊 **Resumen General (Dashboard):** KPIs en tiempo real de títulos activos, stock físico, pedidos registrados y estado de conexión a PostgreSQL.
2. 📚 **Catálogo de Libros:** CRUD completo para crear nuevos títulos, modificar stock, ajustar precios y eliminar obras.
3. 🏷️ **Categorías y Géneros:** Clasificación temática editorial.
4. 🛒 **Pedidos y Órdenes:** Monitor de compras realizadas por clientes.
5. 🏪 **Sucursales Físicas:** Gestión de sedes (Bogotá, Medellín, Cali).
6. 👥 **Usuarios y Permisos:** Control de roles y administradores.
7. ⚙️ **PostgreSQL Docker:** Diagnóstico de conexión y estado del motor de base de datos.
8. 🚪 **Volver a la Tienda:** Regreso directo al catálogo público.

**Autenticación:** la consola usa Supabase Auth. Crea el usuario desde Supabase
Auth y asigna `role: "admin"` en `app_metadata` desde un entorno seguro. No
existen credenciales administrativas embebidas en el código.

---

## 🌐 4. SEO, GEO, AEO y Open Graph

El proyecto incorpora las mejores prácticas internacionales de optimización para motores de búsqueda tradicionales y motores de respuesta con Inteligencia Artificial (AEO):
- **SEO Semántico:** HTML5 puro (`header`, `main`, `nav`, `section`, `article`, `aside`, `footer`), títulos jerárquicos únicos `<h1>`, y meta descriptions personalizadas.
- **GEO Tags:** Ubicación geográfica precisa de la sede principal (`geo.region: CO-DC`, `geo.placename: Bogotá`, coordenadas `ICBM`).
- **AEO (AI Engine Optimization):** Esquema estructurado JSON-LD con tipos `schema.org/BookStore` y `schema.org/WebSite` con `potentialAction: SearchAction` para que asistentes como Gemini, ChatGPT y Google SGE comprendan la oferta comercial, horarios y formatos.
- **Open Graph y Twitter Cards:** Etiquetas para previsualización enriquecida en redes sociales y mensajería con imágenes reales de portada.

---

## 🔒 5. Seguridad

- **Cabeceras HTTP de Protección:** Implementación de `helmet` contra ataques XSS, clickjacking y MIME-sniffing.
- **CORS Configurado:** Control estricto de orígenes permitidos.
- **Autenticación Supabase:** sesión persistente en el frontend y validación de JWT
  en backend mediante JWKS.
- **Validación de Entradas:** Filtrado de datos de entrada y prevención de SQL Injection mediante consultas parametrizadas en PostgreSQL (`$1, $2, ...`).

---

## 🧪 6. Pruebas Automatizadas

Para ejecutar la batería de pruebas automatizadas:

```powershell
cd backend
npm test
```

La suite valida:
- Salud del servicio (`/api/health`)
- Consulta del catálogo (`/api/books`)
- Ficha individual de producto (`/api/books/:id`)
- Protección de endpoints administrativos sin token
- Registro y cálculo de pedidos de checkout (`/api/orders`)

## 🔑 7. Supabase y despliegues separados

Ejecuta `supabase/migrations/001_bookverse.sql` en el SQL Editor de Supabase.
Después crea un usuario en Supabase Auth y establece `app_metadata.role = "admin"`
desde una operación segura de servidor. La consola valida ese rol en cada acceso.

El backend necesita `SUPABASE_URL` y `SUPABASE_JWKS_URL` en sus variables privadas.
Nunca publiques una secret/service-role key. Si GitHub Pages y la API están en
dominios distintos, define `window.BOOKVERSE_API_URL` antes de cargar los módulos
frontend para que `/api/*` apunte al backend desplegado.
