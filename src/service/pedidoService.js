import {
  collection, addDoc, getDocs, query, where, doc, runTransaction, serverTimestamp,
} from "firebase/firestore";
import { VERSION_PRIVACIDAD } from "../utils/constants";
import { db, firebaseEnabled } from "../config/firebaseConfig";
import {
  leerPedidosDemo, guardarPedidosDemo, leerProductosDemo, guardarProductosDemo,
} from "./demoStore";

const COLECCION = "pedidos";

export const ESTADOS = {
  pendiente: { nombre: "Pendiente de pago", color: "bg-amber-100 text-amber-800" },
  confirmado: { nombre: "Pago confirmado", color: "bg-blue-100 text-blue-800" },
  entregado: { nombre: "Entregado", color: "bg-emerald-100 text-emerald-800" },
  cancelado: { nombre: "Cancelado", color: "bg-stone-200 text-stone-600" },
};

const aMilis = (fecha) => (fecha?.toMillis ? fecha.toMillis() : Number(fecha) || 0);
const limpiar = (p) => ({ ...p, creadoEn: aMilis(p.creadoEn) });
const recientesPrimero = (a, b) => b.creadoEn - a.creadoEn;

// El cliente crea su pedido. Siempre empieza "pendiente": solo el admin lo confirma.
export const crearPedido = async ({ user, cart, total, datos, ubicacion, aceptaPrivacidad }) => {
  if (!aceptaPrivacidad) throw new Error("Falta aceptar la Política de privacidad");
  const pedido = {
    uid: user.uid,
    email: user.email,
    cliente: {
      nombre: datos.nombre.trim(),
      telefono: datos.telefono.trim(),
      direccion: datos.direccion.trim(),
      notas: datos.notas.trim(),
    },
    metodoPago: datos.metodoPago,
    items: cart.map((i) => ({
      id: String(i.id),
      nombre: i.nombre,
      precio: Number(i.precio),
      cantidad: i.quantity,
    })),
    total: Number(total.toFixed(2)),
    estado: "pendiente",
    // Constancia del consentimiento: qué versión de la política aceptó
    privacidad: { acepto: true, version: VERSION_PRIVACIDAD },
  };
  // La ubicación es opcional (minimización de datos)
  if (ubicacion) pedido.ubicacion = { lat: ubicacion.lat, lng: ubicacion.lng };

  if (!firebaseEnabled) {
    const nuevo = { ...pedido, id: Date.now().toString(), creadoEn: Date.now() };
    guardarPedidosDemo([...leerPedidosDemo(), nuevo]);
    return nuevo;
  }
  const ref = await addDoc(collection(db, COLECCION), { ...pedido, creadoEn: serverTimestamp() });
  return { ...pedido, id: ref.id, creadoEn: Date.now() };
};

// Pedidos del usuario conectado (las reglas no dejan leer los de otros)
export const getMisPedidos = async (uid) => {
  if (!firebaseEnabled) return leerPedidosDemo().filter((p) => p.uid === uid).sort(recientesPrimero);
  const snap = await getDocs(query(collection(db, COLECCION), where("uid", "==", uid)));
  return snap.docs.map((d) => limpiar({ id: d.id, ...d.data() })).sort(recientesPrimero);
};

// Todos los pedidos: solo el admin tiene permiso
export const getTodosLosPedidos = async () => {
  if (!firebaseEnabled) return leerPedidosDemo().sort(recientesPrimero);
  const snap = await getDocs(collection(db, COLECCION));
  return snap.docs.map((d) => limpiar({ id: d.id, ...d.data() })).sort(recientesPrimero);
};

// Cuánto cambia el stock al pasar de un estado a otro:
// al confirmar el pago se descuenta; si se cancela un pedido ya confirmado, se devuelve.
const descuentaStock = (estado) => estado === "confirmado" || estado === "entregado";
const factorStock = (anterior, nuevo) => {
  if (!descuentaStock(anterior) && descuentaStock(nuevo)) return -1;
  if (descuentaStock(anterior) && !descuentaStock(nuevo)) return 1;
  return 0;
};

export const cambiarEstado = async (pedido, nuevoEstado) => {
  const factor = factorStock(pedido.estado, nuevoEstado);

  if (!firebaseEnabled) {
    if (factor !== 0) {
      guardarProductosDemo(
        leerProductosDemo().map((p) => {
          const item = pedido.items.find((i) => i.id === String(p.id));
          if (!item) return p;
          return { ...p, stock: Math.max(0, Number(p.stock) + factor * item.cantidad) };
        })
      );
    }
    guardarPedidosDemo(
      leerPedidosDemo().map((p) => (p.id === pedido.id ? { ...p, estado: nuevoEstado } : p))
    );
    return;
  }

  // Transacción: el estado y el stock cambian juntos o no cambia nada
  await runTransaction(db, async (tx) => {
    const pedidoRef = doc(db, COLECCION, pedido.id);
    const refs = pedido.items.map((i) => doc(db, "productos", i.id));
    const snaps = factor !== 0 ? await Promise.all(refs.map((r) => tx.get(r))) : [];

    snaps.forEach((snap, idx) => {
      if (!snap.exists()) return; // el producto fue eliminado
      const stock = Number(snap.data().stock) || 0;
      const nuevo = Math.max(0, stock + factor * pedido.items[idx].cantidad);
      tx.update(refs[idx], { stock: nuevo, actualizadoEn: serverTimestamp() });
    });
    tx.update(pedidoRef, { estado: nuevoEstado, actualizadoEn: serverTimestamp() });
  });
};
