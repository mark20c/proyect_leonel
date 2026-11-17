# 🔒 Políticas de seguridad: Manos Creativas

Esta guía explica **quién puede hacer qué** en la tienda y cómo activar la protección en Firebase.

## Por qué hacen falta reglas

Ocultar el Panel Admin en la página **no protege nada**. Cualquiera puede abrir las herramientas del navegador (F12) y llamar a la base de datos directamente.
La protección real son las **reglas de seguridad**, que se ejecutan en los servidores de Google. El navegador no puede saltárselas.

| Archivo | Qué protege |
|---|---|
| `firestore.rules` | La base de datos: productos y pedidos |
| `storage.rules` | Las fotos subidas (solo si usas Storage con el plan Blaze) |
| `firebase.json` | Cabeceras de seguridad del hosting y enlace a las reglas |

## Quién puede hacer qué

| Acción | Visitante | Cliente conectado | Administrador |
|---|:---:|:---:|:---:|
| Ver productos | ✅ | ✅ | ✅ |
| Crear, editar o eliminar productos | ❌ | ❌ | ✅ |
| Crear un pedido | ❌ | ✅ (solo a su nombre y en estado "pendiente") | ✅ |
| Ver pedidos | ❌ | ✅ solo los suyos | ✅ todos |
| Cambiar el estado de un pedido | ❌ | ❌ | ✅ (solo el estado) |
| Eliminar sus pedidos pendientes | ❌ | ✅ solo los suyos | ✅ |
| Borrar sus datos personales de un pedido pagado | ❌ | ✅ solo los suyos | — |
| Subir fotos | ❌ | ❌ | ✅ (imágenes de menos de 2 MB) |
| Cualquier otra colección o carpeta | ❌ | ❌ | ❌ |

Además, las reglas **validan los datos**:

- **Productos:** nombre de 1 a 100 caracteres, precio mayor que 0, stock entero no negativo, categoría válida y foto con enlace `https://`. No se aceptan campos extra.
- **Pedidos:** celular de 9 dígitos que empiece con 9, método de pago de la lista, de 1 a 50 productos, y fecha puesta por el servidor.
- **Estado inicial:** un cliente **no puede** crear un pedido ya "confirmado" ni cambiarlo después. Solo el admin confirma pagos.

## Privacidad: los 4 errores más comunes y cómo los cubre la tienda

| Error | Cómo lo resuelve la tienda |
|---|---|
| **1. No tener política de privacidad** | Página `/privacidad` con: responsable, qué datos se recogen y para qué, base legal, cuánto tiempo se guardan, con quién se comparten, derechos ARCO y contacto. Enlazada en el pie de página, en el login y en el checkout. |
| **2. Recolectar datos de más** | Solo se piden nombre, celular y dirección. La **ubicación es opcional** y el GPS solo se activa si el cliente pulsa "Usar mi ubicación actual". La casilla de consentimiento **nunca está pre-marcada** y es obligatoria para comprar. Cada pedido guarda la versión de la política que aceptó el cliente. |
| **3. Seguridad abierta** | Reglas de Firestore y Storage (este documento). `.env` fuera de GitHub. Sin "modo de prueba". |
| **4. Usuarios sin control** | Página `/mi-cuenta` para **ver** los datos, **descargarlos** (.json), pedir **correcciones** por correo y un botón para **eliminar la cuenta**. Al eliminarla se borran los pedidos pendientes y se anonimizan los pagados (se conserva solo el registro de la venta). |

### Antes de publicar (privacidad)

1. Completa `RESPONSABLE` en `src/utils/constants.js` con tu nombre o razón social, DNI o RUC y un **correo que revises**. Ese correo aparece en la política, en Mi cuenta y en el pie de página.
2. Si cambias la política, actualiza `VERSION_PRIVACIDAD` (la fecha) en el mismo archivo.
3. Responde las solicitudes de los clientes dentro del plazo de ley. Como referencia: acceso en 20 días hábiles; rectificación, cancelación y oposición en 10 días hábiles.
4. **Si hay una filtración de datos:** la ley pide avisar a la Autoridad Nacional de Protección de Datos Personales y a los afectados dentro de las **48 horas** de saberlo. Ten anotado qué harías: cambiar las reglas, revisar los accesos y avisar.
5. La política es una **plantilla** para un emprendimiento pequeño. Si el negocio crece, que la revise alguien con conocimientos legales. También revisa si debes inscribir tu banco de datos de clientes ante la Autoridad.

## Paso a paso para activar las reglas

### 1. Crear la base de datos
Consola de Firebase → **Firestore Database** → **Crear base de datos** → elige **modo de producción** y la región `southamerica-east1` (São Paulo, la más cercana a Perú).

### 2. Activar el login con Google
**Authentication** → **Método de acceso** → **Google** → Habilitar.
Cuando publiques la página, agrega tu dominio en **Authentication → Configuración → Dominios autorizados**.

### 3. Publicar las reglas
Tienes dos formas de hacerlo:

**Opción A: desde la consola (más fácil)**
1. **Firestore Database** → pestaña **Reglas**.
2. Borra lo que haya y pega todo el contenido de `firestore.rules`.
3. Clic en **Publicar**.
4. Si usas Storage, repite lo mismo en **Storage → Reglas** con `storage.rules`.

**Opción B: con la terminal**
```bash
npm install -g firebase-tools
firebase login
firebase use --add            # elige tu proyecto
firebase deploy --only firestore:rules
firebase deploy --only storage   # solo si usas Storage
```

### 4. Probar que funcionan
En **Firestore Database → Reglas** está el **Área de prueba de reglas** (Rules Playground). Comprueba que:
- Un usuario **sin sesión** puede leer `productos/abc` → ✅ permitido.
- Un usuario **sin sesión** intenta escribir en `productos/abc` → ❌ denegado.
- Un usuario con **otro correo** intenta escribir en `productos/abc` → ❌ denegado.

## Cambiar el administrador

El correo del admin está en **tres lugares**, y los tres deben coincidir:
1. `src/utils/constants.js` → `ADMIN_EMAILS` (solo muestra u oculta el menú)
2. `firestore.rules` → función `esAdmin()`
3. `storage.rules` → función `esAdmin()`

Después de cambiarlo, **vuelve a publicar las reglas**.

## Otras buenas prácticas

- **El archivo `.env` no se sube a GitHub** (ya está en `.gitignore`). La `apiKey` de Firebase no es una contraseña: identifica tu proyecto, y lo que protege tus datos son las reglas.
- **Revisa los precios antes de confirmar un pago.** El total lo calcula el navegador del cliente y podría venir alterado. El panel de pedidos muestra **"Revisar precios"** cuando no coincide con el catálogo.
- **El stock se descuenta cuando confirmas el pago**, no cuando el cliente hace el pedido. Así nadie puede "agotar" productos con pedidos falsos.
- **No uses el "modo de prueba" de Firestore** en una tienda real: deja la base de datos abierta a cualquiera.
- **Alerta de presupuesto:** si pasas al plan Blaze, crea una en Google Cloud → Facturación → Presupuestos y alertas.
- **Cabeceras de seguridad:** `firebase.json` las agrega si publicas con Firebase Hosting (`npm run build` y luego `firebase deploy --only hosting`).

## Limitaciones conocidas

- Las reglas no pueden recalcular el total del pedido. Por eso el admin revisa los precios antes de confirmar.
- Un usuario conectado podría crear muchos pedidos falsos. No afectan el stock, y el admin puede cancelarlos o eliminarlos. Si llega a ser un problema, se puede activar **Firebase App Check**.
