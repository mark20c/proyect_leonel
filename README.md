# 🧶 Manos Creativas: tienda de manualidades

Página web para vender manualidades hechas a mano (tejidos, bisutería, cerámica, velas, madera y decoración).
Proyecto del curso de Desarrollo Web hecho con **React + Vite + Tailwind CSS**, con **Firebase**: login con Google, base de datos Firestore y, opcionalmente, Storage para las imágenes.

## Funcionalidades

- **Inicio**: portada, categorías y productos destacados.
- **Catálogo**: búsqueda (sin importar tildes), filtro por categoría y orden por precio.
- **Detalle de producto**: selector de cantidad, stock disponible, productos relacionados y consulta por WhatsApp.
- **Carrito**: subir o bajar cantidades (sin pasar el stock); se guarda en el navegador.
- **Checkout**: datos de entrega, método de pago (Yape, Plin, transferencia o efectivo) y mapa para marcar la ubicación. El pedido se guarda y se envía por WhatsApp.
- **Mis pedidos**: el cliente ve el estado de sus compras.
- **Panel admin**: productos (crear, editar y eliminar) y pedidos (confirmar pago, entregar, cancelar), con descuento automático de stock.
- **Seguridad**: reglas de Firestore y Storage que se aplican en el servidor (ver [SEGURIDAD.md](SEGURIDAD.md)).
- **Privacidad**: página de Política de privacidad, consentimiento sin pre-marcar, ubicación opcional y página **Mi cuenta** para descargar o eliminar los datos.
- **Modo demo**: si no configuras Firebase, la tienda funciona igual con 12 productos de ejemplo.

## Usar como plantilla

Este proyecto es una plantilla para crear otras tiendas. Mira **[PLANTILLA.md](PLANTILLA.md)**: cómo subirlo a GitHub, marcarlo como plantilla, crear proyectos nuevos y usar git en el día a día.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Configuración (opcional)

Copia `.env.example` como `.env` y completa los datos de tu proyecto de Firebase.
Con eso, los productos y pedidos se guardan en **Cloud Firestore** y el login es con Google.

> ⚠️ **Antes de usar Firebase, publica las reglas de seguridad.** Lee **[SEGURIDAD.md](SEGURIDAD.md)**.

**Fotos:** Cloud Storage necesita el plan Blaze. Si no lo tienes, deja `VITE_USE_STORAGE=false` y pega el enlace `https://` de cada foto.

**Administradores:** se definen en `ADMIN_EMAILS` (`src/utils/constants.js`) **y** en `firestore.rules` y `storage.rules`.

**WhatsApp y responsable de datos:** cambia `WHATSAPP` y completa `RESPONSABLE` (nombre, DNI o RUC, correo) en `src/utils/constants.js` antes de publicar.

### Pedidos

1. El cliente confirma su compra y se crea un pedido **pendiente**.
2. El cliente lo envía por WhatsApp para coordinar el pago.
3. El admin revisa el pago y lo marca como **Pago confirmado**. En ese momento se descuenta el stock.
4. Después lo marca como **Entregado**. Si cancela un pedido ya confirmado, el stock se devuelve.

El cliente ve el estado de sus pedidos en **Mis pedidos**.

## Estructura

```
src/
├── components/   Navbar, Footer, ProductCard, ProductImage, Modal, PedidosAdmin, Loader, ProtectedRoute
├── config/       firebaseConfig
├── context/      AuthContext, CartContext, ProductContext
├── data/         productosEjemplo (modo demo)
├── hooks/        useAuth, useCart, useProducts
├── service/      authService, productService, pedidoService, cuentaService, uploadService, demoStore
├── utils/        constants, helpers
└── views/        Home, Catalogo, ProductDetail, Nosotros, Cart, Checkout, MisPedidos, MiCuenta, Privacidad, Login, AdminPanel, NotFound

firestore.rules · storage.rules · firebase.json   ← seguridad y hosting
```
