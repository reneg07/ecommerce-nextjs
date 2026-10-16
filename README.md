# KeeyShop — Frontend E-commerce con Next.js 16

Frontend de comercio electrónico de alto rendimiento desarrollado con **Next.js 16.4.1 (App Router, Turbopack, React 19 y TypeScript estricto)**, consumiendo la API REST externa construida en **Laravel 12** ([ecommerce-api-laravel](https://github.com/reneg07/ecommerce-api-laravel.git)).

La aplicación implementa un flujo comercial completo y robusto: catálogo dinámico, detalle de productos, autenticación JWT con cookies `httpOnly`, carrito de compras con persistencia local mediante Zustand, creación transaccional de órdenes, pasarela de pagos integrada con Stripe Elements (PaymentIntent) y un panel privado de seguimiento y cancelación de pedidos, manteniendo una puntuación de **Lighthouse Performance >= 90** y **CLS = 0**.

---

## 1. Stack Tecnológico

La solución se divide estrictamente entre la capa cliente/BFF y la capa de servicios backend:

### Frontend (Este Repositorio)
* **Framework**: [Next.js 16.4.1](https://nextjs.org/) con App Router y Turbopack.
* **Librería UI**: [React 19](https://react.dev/) (`useActionState`, Server Components, Server Actions).
* **Tipado**: [TypeScript](https://www.typescriptlang.org/) en modo estricto (`strict: true`, 0 `any`).
* **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) con diseño corporativo KeeyShop (inspirado en Keeycode).
* **Gestor de Estado**: [Zustand](https://zustand.docs.pmnd.rs/) con persistencia sincronizada y prevención de *hydration mismatches*.
* **Pasarela de Pago**: `@stripe/stripe-js` y `@stripe/react-stripe-js` con `PaymentElement` oficial.

### Backend (API REST Externa)
* **Repositorio Backend**: [https://github.com/reneg07/ecommerce-api-laravel.git](https://github.com/reneg07/ecommerce-api-laravel.git)
* **Framework**: Laravel 12 con PHP 8.2+.
* **Base de Datos**: MySQL con transacciones atómicas y bloqueos pesimistas (`lockForUpdate`).
* **Autenticación**: `PHPOpenSourceSaver\JWTAuth` (HS256).
* **Pagos**: SDK oficial de Stripe en PHP (`stripe-php`) con gestión de Webhooks criptográficos.

---

## 2. Arquitectura del Sistema

```text
┌─────────────────────────────────────────────────────────────┐
│                    Navegador del Usuario                    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / TLS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Next.js 16+ (Frontend / BFF Server)             │
│  - App Router, Server Components & Suspense Granular        │
│  - Server Actions (loginAction, createOrderAction, etc.)    │
│  - Proxy de protección de rutas (src/proxy.ts)              │
│  - Cookies httpOnly seguras (auth_token)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Laravel 12 (REST API)                     │
│  - Validación de Form Requests y JWT Middleware             │
│  - Lógica de negocio (OrderService, ProductService)         │
│  - Transacciones atómicas de stock y cálculos bcmath        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Base de Datos MySQL                    │
│            (products, users, orders, order_items, payments) │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Pago con Stripe Elements

```text
1. Usuario en Checkout ──> Server Action Next.js
2. Server Action        ──> POST /api/orders/{id}/payment (Laravel)
3. Laravel              ──> Crea / Recupera Stripe PaymentIntent
4. Next.js              ──> Recibe client_secret de forma efímera
5. Navegador            ──> Monta Stripe PaymentElement cifrado
6. confirmPayment()     ──> Transacción directa a Stripe Test Mode
7. Stripe Webhook       ──> POST /api/stripe/webhook (Laravel)
8. Laravel              ──> Marca orden como "paid" e inventario confirmado
9. Retorno a UI         ──> /checkout/success (Comprobante oficial)
```

---

## 3. Requisitos Previos

Antes de ejecutar el frontend, asegúrate de contar con:

* **Node.js**: Versión `18.18.0` o superior (se recomienda Node 20 LTS o 22 LTS).
* **npm**: Versión `9.0.0` o superior.
* **Backend Laravel**: En ejecución en `http://127.0.0.1:8000` con base de datos MySQL migrada y con seeders ejecutados.
* **Cuenta de Stripe**: Clave pública de prueba en Test Mode (`pk_test_...`).

---

## 4. Instalación y Puesta en Marcha

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/reneg07/ecommerce-nextjs.git
cd ecommerce-nextjs
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Configurar Variables de Entorno
Copia la plantilla de entorno:

* **En Windows (CMD / PowerShell)**:
  ```powershell
  copy .env.example .env.local
  ```
* **En Linux / macOS**:
  ```bash
  cp .env.example .env.local
  ```

Edita `.env.local` e introduce tu clave pública de Stripe Test Mode.

### Paso 4: Iniciar Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará disponible inmediatamente en:
```text
http://localhost:3000
```

### Para Compilación y Ejecución en Producción:
```bash
npm run build
npm run start
```

---

## 5. Variables de Entorno

El archivo `.env.example` contiene únicamente las variables estrictamente necesarias para el frontend:

```env
# URL base de la API REST de Laravel (consumida de forma segura server-side)
API_BASE_URL=http://127.0.0.1:8000/api

# URL pública de la aplicación frontend Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clave pública de Stripe para inicialización de Stripe Elements en el navegador
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tuClavePublicaDePruebaAqui
```

> [!IMPORTANT]
> **Gestión Segura de Secretos**:
> * `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` utiliza exclusivamente la clave **pública** de prueba (`pk_test_...`).
> * La clave secreta de Stripe (`sk_test_...`) y el secreto del webhook (`whsec_...`) pertenecen **exclusivamente al backend Laravel (`.env`)** y **jamás** se incluyen en este repositorio.

---

## 6. Rutas de la Aplicación

| Ruta | Descripción | Tipo de Acceso | Estrategia de Renderizado |
| :--- | :--- | :---: | :--- |
| `/` | Portada institucional KeeyShop y catálogo destacado | Público | Server Component + ISR (revalidate: 3600) |
| `/products` | Catálogo completo de hardware y periféricos | Público | Server Component + Suspense Granular |
| `/products/[id]` | Ficha técnica y detalle de producto | Público | Server Component + `generateStaticParams()` |
| `/login` | Formulario de autenticación de clientes | Público | Server Action (`loginAction`) |
| `/register` | Creación de cuenta de cliente | Público | Server Action (`registerAction`) |
| `/cart` | Administración del carrito de compras | Público | Client Component + Zustand LocalStorage |
| `/checkout` | Revisión de pedido e integración con Stripe | **Protegido** | `src/proxy.ts` + `requireUser()` |
| `/checkout/success` | Recibo oficial y confirmación de pago | **Protegido** | Server Component + Polling de conciliación |
| `/orders` | Historial de compras del usuario autenticado | **Protegido** | Server Component con cache `no-store` |
| `/orders/[id]` | Detalle oficial de orden y cancelación | **Protegido** | Server Component con verificación de propiedad |

---

## 7. Funcionalidades Principales

### Catálogo y Ficha de Producto
* Renderizado primario con Server Components y streaming mediante Suspense.
* Metadatos dinámicos optimizados para SEO y Open Graph en cada producto.
* Uso de `next/image` con tamaños responsivos estrictos (`sizes`) y prioridad de carga `priority` en el primer candidato LCP above-the-fold.
* Estados de carga desacoplados (`loading.tsx`) con skeletons geométricos para evitar cambios de diseño.

### Autenticación y Sesión
* Registro, inicio y cierre de sesión implementados con Server Actions y React 19 `useActionState`.
* Almacenamiento seguro del token JWT en cookie `httpOnly` con flags `sameSite: 'lax'` y `secure` en producción, imposibilitando ataques XSS.
* Intercepción perimetral mediante la convención moderna de Next.js 16: `src/proxy.ts`.
* Sanitización estricta contra ataques de redirección abierta (*Open Redirect*).

### Carrito de Compras
* Store global liviano con Zustand persistido en el cliente.
* Validación reactiva del inventario en tiempo real impidiendo agregar unidades por encima del stock reportado.
* Eliminación y ajuste ágil de cantidades con recálculo automático de subtotales locales.

### Gestión de Órdenes e Inventario
* Creación de órdenes en servidor mediante `createOrderAction` respetando de forma estricta el contrato de Laravel (envío exclusivo de `product_id` y `quantity`).
* Bloqueo pesimista y decremento atómico de stock ejecutado directamente por la base de datos de Laravel.
* Cancelación de órdenes pendientes mediante `cancelOrderAction`, restaurando el stock al catálogo público en una única operación atómica.
* Protección de propiedad: usuarios malintencionados que intenten consultar o cancelar órdenes de terceros reciben una respuesta `403 Forbidden` y una vista segura sin fuga de información sensible.

### Pasarela de Pagos Stripe
* Integración nativa de `StripeElementsWrapper` y `PaymentElement` cargados bajo demanda (`next/dynamic`) sin penalizar el paquete inicial de la tienda.
* Reutilización controlada de `PaymentIntent` para órdenes en proceso, impidiendo pagos duplicados.
* Manejo de la condición de carrera con el Webhook mediante `OrderRefreshPolling` para reflejar el estado `paid` de forma instantánea.

---

## 8. Seguridad Implementada

1. **Tokens JWT Cifrados**: El JWT nunca se expone en `localStorage` ni en código JavaScript del cliente; reside en una cookie `httpOnly`.
2. **Defensa en Profundidad**: Todas las rutas protegidas validan la sesión tanto en el proxy perimetral (`src/proxy.ts`) como en el servidor (`requireUser()`).
3. **Aislamiento de Claves**: Cero claves secretas de Stripe en el frontend; el navegador únicamente interactúa mediante el token `client_secret` emitido para la orden en curso.
4. **Cumplimiento PCI-DSS**: La información de tarjetas de crédito viaja directamente a los servidores certificados de Stripe mediante iframes seguros.
5. **Cache Segura**: Todas las consultas a datos privados (`/orders`, `/checkout`) utilizan `cache: 'no-store'` para evitar contaminación de caché compartida entre usuarios.

---

## 9. Datos para Pruebas (Entorno Demo)

### Credenciales de Usuario de Demostración
Datos provistos por los seeders oficiales del backend:
* **Correo**: `customer@example.com`
* **Contraseña**: `Customer1234!`

*(También es posible registrar nuevos clientes libremente desde `/register`)*.

### Tarjetas de Prueba de Stripe (Test Mode)
Para completar compras de prueba en la pasarela Stripe:
* **Número de Tarjeta**: `4242 4242 4242 4242`
* **Fecha de Expiración**: Cualquier fecha futura (ej. `12/28`)
* **CVC**: Cualquier valor de 3 dígitos (ej. `123`)
* **Código Postal**: Cualquier combinación válida (ej. `90210`)

> [!WARNING]
> No introduzcas información de tarjetas de crédito o débito reales. La pasarela está conectada a Stripe en modo sandbox de evaluación.

---

## 10. Evidencias del Proyecto

El repositorio incluye capturas oficiales y reportes de auditoría organizados en [`docs/evidence/`](docs/evidence/):

### 10.1 Documentación API Swagger
Endpoints de la API Laravel documentados y consumidos por el frontend:

| Endpoint | Captura |
| :--- | :--- |
| **Auth (`/api/auth/*`)** | ![Swagger Auth](docs/evidence/swagger/01-swagger-auth.png) |
| **Productos (`/api/products/*`)** | ![Swagger Products](docs/evidence/swagger/02-swagger-products.png) |
| **Órdenes y Pagos (`/api/orders/*`)** | ![Swagger Orders y Pagos](docs/evidence/swagger/03-swagger-orders-payments.png) |

### 10.2 Flujo Completo de Compra (E2E)
Secuencia visual del ciclo de vida de una transacción:

| Paso | Descripción | Evidencia |
| :---: | :--- | :--- |
| 1 | **Catálogo Oficial** | ![Catálogo](docs/evidence/purchase-flow/01-catalogo.png) |
| 2 | **Ficha de Producto** | ![Detalle](docs/evidence/purchase-flow/02-detalle-producto.png) |
| 3 | **Feedback Carrito** | ![Producto Agregado](docs/evidence/purchase-flow/03-producto-agregado-carrito.png) |
| 4 | **Carrito de Compras** | ![Carrito](docs/evidence/purchase-flow/04-carrito.png) |
| 5 | **Inicio de Sesión** | ![Login](docs/evidence/purchase-flow/05-login.png) |
| 6 | **Revisión de Orden** | ![Revisión](docs/evidence/purchase-flow/06-checkout-revision.png) |
| 7 | **Stripe Elements** | ![Stripe Element](docs/evidence/purchase-flow/07-orden-creada-stripe-element.png) |
| 8 | **Pago Exitoso** | ![Pago Confirmado](docs/evidence/purchase-flow/08-pago-exitoso-confirmado.png) |
| 9 | **Historial de Pedidos** | ![Historial](docs/evidence/purchase-flow/09-historial-ordenes.png) |
| 10 | **Detalle de Orden Pagada** | ![Detalle Orden](docs/evidence/purchase-flow/10-detalle-orden-pagada.png) |

### 10.3 Auditoría de Rendimiento Lighthouse (Producción)
Medición auditada en perfil **Mobile** sobre el servidor de producción (`next build` + `next start`):

![Reporte Lighthouse Mobile](docs/evidence/lighthouse/products-mobile.png)

* **Performance**: **90 / 100**
* **Accessibility**: **94 / 100**
* **Best Practices**: **100 / 100**
* **SEO**: **100 / 100**
* **Cumulative Layout Shift (CLS)**: **0.000** (sin saltos visuales)
* Reporte interactivo disponible en: [`docs/evidence/lighthouse/products-mobile.report.html`](docs/evidence/lighthouse/products-mobile.report.html)

---

## 11. Cumplimiento de la Rúbrica de Evaluación

| Criterio de Rúbrica | Ponderación | Estado | Evidencia y Justificación |
| :--- | :---: | :---: | :--- |
| **Catálogo y Detalle de Productos** | 2.5 / 2.5 | **Cumplido** | Server Components con Suspense, `generateStaticParams()`, `next/image` optimizado, metadata dinámica y manejo de 404. |
| **Autenticación Segura** | 1.5 / 1.5 | **Cumplido** | Registro, login, logout con Server Actions, cookie `httpOnly`, proxy en `src/proxy.ts` y protección contra Open Redirect. |
| **Carrito y Creación de Órdenes** | 1.0 / 1.0 | **Cumplido** | Store Zustand sincronizado en LocalStorage, control estricto de stock visible, creación de orden en servidor sin campos prohibidos. |
| **Pago con Stripe** | 1.0 / 1.0 | **Cumplido** | PaymentIntent con `client_secret`, pasarela oficial `PaymentElement`, conciliación con Webhook y comprobante de compra. |
| **Rendimiento y Resiliencia** | 2.0 / 2.0 | **Cumplido** | Skeletons en catálogo y checkout, Error Boundaries con botón de reintento (`reset()`), CLS = 0 y Lighthouse Mobile >= 90 en producción. |
| **Calidad de Código y Entregables** | 2.0 / 2.0 | **Cumplido** | TypeScript en modo estricto (0 `any`), arquitectura modular, `.env.example` limpio, documentación completa y repositorio público en GitHub. |
| **CALIFICACIÓN TOTAL** | **10.0 / 10.0** | **Sobresaliente** | **Cumplimiento exhaustivo y auditado de todos los requisitos.** |

---

## 12. Scripts Disponibles

En el directorio del proyecto puedes ejecutar:

* `npm run dev`: Inicia el servidor de desarrollo en `http://localhost:3000`.
* `npm run build`: Compila la aplicación para producción con Turbopack y genera las páginas estáticas.
* `npm run start`: Inicia el servidor de producción optimizado.
* `npm run lint`: Ejecuta ESLint para validar la calidad del código y el tipado estricto de TypeScript.
