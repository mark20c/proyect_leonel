// Derechos del usuario sobre sus datos: acceso (descargar) y cancelación (eliminar cuenta).
import { doc, writeBatch, deleteField } from "firebase/firestore";
import { reauthenticateWithPopup, deleteUser } from "firebase/auth";
import { auth, db, googleProvider, firebaseEnabled } from "../config/firebaseConfig";
import { getMisPedidos } from "./pedidoService";
import { leerPedidosDemo, guardarPedidosDemo } from "./demoStore";
import { NOMBRE_TIENDA } from "../utils/constants";

// Lo que queda en un pedido ya pagado cuando el cliente elimina su cuenta:
// se conservan productos, montos y fechas (registro de la venta) y se borran sus datos personales.
// Debe coincidir EXACTAMENTE con la regla "anonimizacionValida" de firestore.rules.
const CLIENTE_ANONIMO = { nombre: "Cliente eliminado", telefono: "", direccion: "", notas: "" };

// ---------- Acceso / portabilidad: descargar mis datos ----------
export const descargarMisDatos = async (user) => {
  const pedidos = await getMisPedidos(user.uid);
  const datos = {
    tienda: NOMBRE_TIENDA,
    generado: new Date().toISOString(),
    cuenta: {
      uid: user.uid,
      nombre: user.displayName || "",
      correo: user.email || "",
    },
    pedidos: pedidos.map((p) => ({ ...p, creadoEn: new Date(p.creadoEn).toISOString() })),
  };

  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mis-datos-${NOMBRE_TIENDA.toLowerCase().replace(/\s+/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// ---------- Cancelación: eliminar mi cuenta ----------
// 1. Pedidos pendientes (no pagados): se eliminan por completo.
// 2. Pedidos pagados, entregados o cancelados: se anonimizan.
// 3. Se elimina la cuenta de inicio de sesión.
export const eliminarMiCuenta = async (user) => {
  if (!firebaseEnabled) {
    guardarPedidosDemo(
      leerPedidosDemo()
        .filter((p) => !(p.uid === user.uid && p.estado === "pendiente"))
        .map((p) => {
          if (p.uid !== user.uid) return p;
          const anonimo = { ...p, cliente: CLIENTE_ANONIMO, email: "", anonimizado: true };
          delete anonimo.ubicacion;
          return anonimo;
        })
    );
    localStorage.removeItem("manualidades_carrito");
    return;
  }

  // Firebase pide haber iniciado sesión hace poco para borrar una cuenta,
  // así que confirmamos la identidad con Google antes de borrar nada.
  await reauthenticateWithPopup(auth.currentUser, googleProvider);

  const pedidos = await getMisPedidos(user.uid);
  const batch = writeBatch(db);
  pedidos.forEach((p) => {
    const ref = doc(db, "pedidos", p.id);
    if (p.estado === "pendiente") {
      batch.delete(ref);
    } else if (!p.anonimizado) {
      batch.update(ref, {
        cliente: CLIENTE_ANONIMO,
        email: "",
        ubicacion: deleteField(),
        anonimizado: true,
      });
    }
  });
  await batch.commit();

  localStorage.removeItem("manualidades_carrito");
  await deleteUser(auth.currentUser);
};
