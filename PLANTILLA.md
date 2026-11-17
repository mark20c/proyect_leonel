# 🧩 Usar este proyecto como plantilla

Este repositorio sirve de base para crear otras tiendas (ropa, comida, accesorios…) sin empezar de cero.
Cada tienda nueva es **un repositorio aparte** con su propio historial de git.

```
proyect_claude (PLANTILLA)
   ├──▶ tienda-manualidades   (repositorio propio)
   ├──▶ tienda-ropa           (repositorio propio)
   └──▶ tienda-cafe           (repositorio propio)
```

---

## 1. Subir la plantilla a GitHub (una sola vez)

En la terminal de VS Code, dentro de esta carpeta:

```powershell
.\subir-a-github.ps1 -Repo https://github.com/mark20c/proyect_claude.git
```

Si PowerShell dice que **no se permite ejecutar scripts**, usa:

```powershell
powershell -ExecutionPolicy Bypass -File .\subir-a-github.ps1 -Repo https://github.com/mark20c/proyect_claude.git
```

## 2. Marcarla como plantilla en GitHub (una sola vez)

1. Abre el repositorio en GitHub → **Settings** → **General**.
2. Debajo del nombre, marca la casilla **Template repository**.

Desde ese momento aparece el botón verde **Use this template** en la página del repositorio.

## 3. Crear un proyecto nuevo desde la plantilla

1. En GitHub, en la plantilla: **Use this template** → **Create a new repository**.
2. Ponle nombre (por ejemplo `tienda-ropa`) y crea el repositorio.
3. En la terminal, dentro de la carpeta de la plantilla:

   ```powershell
   .\nuevo-proyecto.ps1 -Url https://github.com/mark20c/tienda-ropa.git
   ```

   El script descarga el proyecto en la carpeta de al lado, cambia el nombre en `package.json`, crea el `.env` y ejecuta `npm install`.
4. Abre la carpeta nueva en VS Code (`code ..\tienda-ropa`).

## 4. Lista para personalizar cada tienda

| Qué | Dónde |
|---|---|
| Nombre de la tienda, WhatsApp | `src/utils/constants.js` → `NOMBRE_TIENDA`, `WHATSAPP` |
| Datos del responsable (privacidad) | `src/utils/constants.js` → `RESPONSABLE` |
| Categorías | `src/utils/constants.js` → `CATEGORIAS` **y** `firestore.rules` → `productoValido` |
| Correo del administrador | `src/utils/constants.js` → `ADMIN_EMAILS` **y** `firestore.rules` **y** `storage.rules` |
| Productos de ejemplo (modo demo) | `src/data/productosEjemplo.js` |
| Título y descripción para Google | `index.html` |
| Icono de la pestaña | `public/favicon.svg` |
| Textos de portada y "Nosotros" | `src/views/Home.jsx`, `src/views/Nosotros.jsx` |
| Ícono 🧶 del menú | `src/components/Navbar.jsx`, `src/components/Footer.jsx` |
| Colores | En VS Code, **Ctrl+Shift+H** (reemplazar en todos los archivos): `orange-` → `teal-` (o `rose-`, `sky-`, `emerald-`…) |
| Proyecto de Firebase | `.env` (cada tienda debe tener **su propio** proyecto de Firebase) |

> Después de cambiar `firestore.rules`, vuelve a publicarlas en Firebase (ver `SEGURIDAD.md`).

## 5. Git en el día a día

Con el script (más fácil):

```powershell
.\subir-a-github.ps1 -Mensaje "Agrego página de ofertas"
```

O a mano:

| Comando | Para qué |
|---|---|
| `git status` | Ver qué archivos cambiaste |
| `git add .` | Preparar todos los cambios |
| `git commit -m "mensaje"` | Guardar un punto en el historial |
| `git push` | Subir a GitHub |
| `git pull` | Bajar cambios hechos desde otra PC |
| `git log --oneline` | Ver el historial |

**Buenas prácticas:**

- Haz commits pequeños y con mensajes claros: "Agrego filtro por precio", no "cambios".
- Para algo grande, trabaja en una rama: `git switch -c nueva-funcion`. Cuando funcione, súbela con `git push -u origin nueva-funcion` y únela a `main` desde GitHub (Pull request).
- **Nunca subas el `.env`**. El `.gitignore` ya lo excluye y el script lo verifica.

## 6. Llevar una mejora de la plantilla a un proyecto (avanzado)

Si mejoras la plantilla (por ejemplo, corriges un error) y quieres esa mejora en `tienda-ropa`:

```powershell
git remote add plantilla https://github.com/mark20c/proyect_claude.git   # solo la primera vez
git fetch plantilla
git cherry-pick <id-del-commit>     # el id sale en: git log plantilla/main --oneline
```

Si hay conflictos, VS Code te muestra los archivos para elegir qué versión quedarse.
