import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { formatPrecio, getCategoria } from '../utils/helpers';
import { WHATSAPP } from '../utils/constants';
import ProductImage from '../components/ProductImage';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

const DetalleProducto = ({ id }) => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);

  if (loading) return <Loader />;

  const producto = products.find((p) => String(p.id) === String(id));
  if (!producto) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-3">🧐</p>
        <h1 className="text-2xl font-bold text-stone-800">Producto no encontrado</h1>
        <Link to="/catalogo" className="text-orange-700 font-semibold hover:underline mt-4 inline-block">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const categoria = getCategoria(producto.categoria);
  const agotado = producto.stock <= 0;
  const relacionados = products
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  const handleAgregar = () => {
    addToCart(producto, cantidad);
    Swal.fire({ icon: 'success', title: '¡Agregado al carrito!', timer: 1300, showConfirmButton: false, toast: true, position: 'top-end' });
  };

  const mensaje = encodeURIComponent(`Hola, me interesa "${producto.nombre}" (${formatPrecio(producto.precio)}).`);

  return (
    <div className="container mx-auto px-4 py-10">
      <nav className="text-sm text-stone-500 mb-6 text-left">
        <Link to="/" className="hover:text-orange-700">Inicio</Link> /{' '}
        <Link to={`/catalogo?categoria=${categoria.id}`} className="hover:text-orange-700">{categoria.nombre}</Link> /{' '}
        <span className="text-stone-700">{producto.nombre}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 text-left">
        <ProductImage producto={producto} className="w-full aspect-square rounded-3xl shadow-md" />

        <div>
          <span className={`${categoria.color} inline-block text-sm font-semibold px-3 py-1 rounded-full`}>
            {categoria.icono} {categoria.nombre}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-800 mt-3">{producto.nombre}</h1>
          <p className="text-3xl font-extrabold text-orange-700 mt-3">{formatPrecio(producto.precio)}</p>
          <p className="text-stone-600 mt-4 leading-relaxed">{producto.descripcion}</p>
          <p className={`mt-4 text-sm font-medium ${agotado ? 'text-red-600' : 'text-emerald-700'}`}>
            {agotado ? 'Agotado por ahora' : `Disponible: ${producto.stock} unidad(es)`}
          </p>

          {!agotado && (
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center border border-stone-300 rounded-xl">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="px-4 py-2 text-lg" aria-label="Quitar uno">−</button>
                <span className="w-10 text-center font-semibold">{cantidad}</span>
                <button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} className="px-4 py-2 text-lg" aria-label="Agregar uno">+</button>
              </div>
              <button onClick={handleAgregar} className="flex-1 bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-xl font-semibold transition">
                <i className="fa-solid fa-cart-plus mr-2"></i>Agregar al carrito
              </button>
            </div>
          )}

          <a
            href={`https://wa.me/${WHATSAPP}?text=${mensaje}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 w-full inline-flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-3 rounded-xl font-semibold transition"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>Consultar por WhatsApp
          </a>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-stone-800 mb-6 text-left">También te puede gustar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relacionados.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

// key={id} reinicia la cantidad al pasar de un producto a otro
const ProductDetail = () => {
  const { id } = useParams();
  return <DetalleProducto key={id} id={id} />;
};

export default ProductDetail;
