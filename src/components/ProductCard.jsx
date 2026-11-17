import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrecio, getCategoria } from '../utils/helpers';
import ProductImage from './ProductImage';
import Swal from 'sweetalert2';

// En el panel admin se pasan onEdit y onDelete; en la tienda, no.
const ProductCard = ({ product, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const { id, nombre, precio, descripcion, stock } = product;
  const categoria = getCategoria(product.categoria);
  const agotado = stock <= 0;
  const modoAdmin = Boolean(onEdit || onDelete);

  const handleAgregar = () => {
    addToCart(product);
    Swal.fire({
      icon: 'success',
      title: '¡Agregado!',
      text: `${nombre} está en tu carrito`,
      timer: 1500,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-orange-100 group flex flex-col">
      <Link to={`/producto/${id}`} className="relative overflow-hidden block">
        <ProductImage
          producto={product}
          className="w-full h-52 transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-white/90 text-stone-700 text-xs font-semibold px-3 py-1 rounded-full">
          {categoria.icono} {categoria.nombre}
        </span>
        {agotado && (
          <span className="absolute top-3 right-3 bg-stone-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Agotado
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 text-left">
        <Link to={`/producto/${id}`}>
          <h3 className="text-lg font-bold text-stone-800 truncate hover:text-orange-700">{nombre}</h3>
        </Link>
        <p className="text-2xl font-extrabold text-orange-700 mt-1">{formatPrecio(precio)}</p>
        {descripcion && <p className="text-sm text-stone-500 mt-1 line-clamp-2">{descripcion}</p>}
        {modoAdmin && <p className="text-xs text-stone-400 mt-2">Stock: {stock}</p>}

        <div className="mt-auto pt-4 flex gap-2">
          {modoAdmin ? (
            <>
              <button
                onClick={() => onEdit(product)}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-stone-900 font-medium py-2.5 rounded-xl transition"
                title="Editar"
              >
                <i className="fa-solid fa-pen-to-square mr-2"></i>Editar
              </button>
              <button
                onClick={() => onDelete(product)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-xl transition"
                title="Eliminar"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </>
          ) : (
            <button
              onClick={handleAgregar}
              disabled={agotado}
              className="flex-1 bg-orange-700 hover:bg-orange-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-cart-plus"></i>
              {agotado ? 'Sin stock' : 'Agregar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
