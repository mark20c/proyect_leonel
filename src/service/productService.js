import {
  collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { db, firebaseEnabled } from "../config/firebaseConfig";
import { leerProductosDemo, guardarProductosDemo } from "./demoStore";

const COLECCION = "productos";

// Convierte una fecha de Firestore (Timestamp) a milisegundos
const aMilis = (fecha) => (fecha?.toMillis ? fecha.toMillis() : Number(fecha) || 0);

// Lo que llega de la base de datos, listo para la vista
const limpiar = (p) => ({
  ...p,
  precio: Number(p.precio) || 0,
  stock: Number.parseInt(p.stock, 10) || 0,
  creadoEn: aMilis(p.creadoEn),
  actualizadoEn: aMilis(p.actualizadoEn),
});

// Solo estos campos se guardan (las reglas de Firestore rechazan cualquier otro)
const paraGuardar = (p) => ({
  nombre: String(p.nombre || "").trim(),
  descripcion: String(p.descripcion || "").trim(),
  categoria: p.categoria,
  precio: Number(p.precio),
  stock: Math.max(0, Number.parseInt(p.stock, 10) || 0),
  destacado: Boolean(p.destacado),
  foto: String(p.foto || "").trim(),
});

const porFecha = (a, b) => a.creadoEn - b.creadoEn;

export const getProducts = async () => {
  if (!firebaseEnabled) return leerProductosDemo().map(limpiar);
  const snap = await getDocs(collection(db, COLECCION));
  return snap.docs.map((d) => limpiar({ id: d.id, ...d.data() })).sort(porFecha);
};

export const getProductById = async (id) => {
  if (!firebaseEnabled) {
    const producto = leerProductosDemo().find((p) => String(p.id) === String(id));
    if (!producto) throw new Error("Producto no encontrado");
    return limpiar(producto);
  }
  const snap = await getDoc(doc(db, COLECCION, id));
  if (!snap.exists()) throw new Error("Producto no encontrado");
  return limpiar({ id: snap.id, ...snap.data() });
};

export const createProduct = async (product) => {
  const datos = paraGuardar(product);
  if (!firebaseEnabled) {
    const nuevo = { ...datos, id: Date.now().toString(), creadoEn: Date.now() };
    guardarProductosDemo([...leerProductosDemo(), nuevo]);
    return limpiar(nuevo);
  }
  const ref = await addDoc(collection(db, COLECCION), { ...datos, creadoEn: serverTimestamp() });
  return limpiar({ ...datos, id: ref.id, creadoEn: Date.now() });
};

export const updateProduct = async (id, product) => {
  const datos = paraGuardar(product);
  if (!firebaseEnabled) {
    let actualizado;
    guardarProductosDemo(
      leerProductosDemo().map((p) => {
        if (String(p.id) !== String(id)) return p;
        actualizado = { ...p, ...datos };
        return actualizado;
      })
    );
    return limpiar(actualizado);
  }
  await updateDoc(doc(db, COLECCION, id), { ...datos, actualizadoEn: serverTimestamp() });
  return limpiar({ ...product, ...datos, id, actualizadoEn: Date.now() });
};

export const deleteProduct = async (id) => {
  if (!firebaseEnabled) {
    guardarProductosDemo(leerProductosDemo().filter((p) => String(p.id) !== String(id)));
    return;
  }
  await deleteDoc(doc(db, COLECCION, id));
};
