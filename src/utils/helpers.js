import { CATEGORIAS } from './constants';

export const formatPrecio = (precio) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(Number(precio) || 0);

export const getCategoria = (id) =>
  CATEGORIAS.find((c) => c.id === id) || { id, nombre: id || 'Otros', icono: '🎨', color: 'bg-stone-100' };

// Quita tildes y pasa a minúsculas para que la búsqueda no dependa de ellas
export const normalizar = (texto = '') =>
  texto.toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
