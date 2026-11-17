// Almacenamiento en el navegador para el modo demo (sin Firebase).
import { PRODUCTOS_EJEMPLO } from "../data/productosEjemplo";

const leer = (clave, porDefecto) => {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : porDefecto;
  } catch {
    return porDefecto;
  }
};

const guardar = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor));

export const leerProductosDemo = () => leer("manualidades_productos", PRODUCTOS_EJEMPLO);
export const guardarProductosDemo = (lista) => guardar("manualidades_productos", lista);

export const leerPedidosDemo = () => leer("manualidades_pedidos", []);
export const guardarPedidosDemo = (lista) => guardar("manualidades_pedidos", lista);
