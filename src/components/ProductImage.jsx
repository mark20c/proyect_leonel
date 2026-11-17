import React from 'react';
import { getCategoria } from '../utils/helpers';

// Muestra la foto del producto; si no tiene, muestra el icono de su categoría
const ProductImage = ({ producto, className = '' }) => {
  const categoria = getCategoria(producto.categoria);

  if (producto.foto) {
    return <img src={producto.foto} alt={producto.nombre} className={`object-cover ${className}`} />;
  }

  return (
    <div
      className={`flex items-center justify-center ${categoria.color} ${className}`}
      role="img"
      aria-label={producto.nombre}
    >
      <span className="text-6xl">{categoria.icono}</span>
    </div>
  );
};

export default ProductImage;
