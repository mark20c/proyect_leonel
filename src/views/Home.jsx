import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { CATEGORIAS } from '../utils/constants';

const Home = () => {
  const { products, loading } = useProducts();
  // Destacados con stock; si no hay ninguno marcado, los primeros 4
  const destacados = products.filter((p) => p.destacado && p.stock > 0);
  const mostrar = (destacados.length ? destacados : products).slice(0, 4);

  return (
    <div>
      {/* Portada */}
      <section className="bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100">
        <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-left">
            <span className="inline-block bg-white text-orange-700 text-sm font-semibold px-4 py-1 rounded-full shadow-sm mb-4">
              Hecho a mano con cariño 🧡
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-stone-800 leading-tight">
              Manualidades únicas para regalar y decorar
            </h1>
            <p className="text-lg text-stone-600 mt-4 max-w-lg">
              Tejidos, bisutería con semillas amazónicas, cerámica, velas y más,
              hechos por artesanos de Puerto Maldonado.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/catalogo" className="bg-orange-700 hover:bg-orange-800 text-white px-7 py-3 rounded-xl font-semibold shadow-md transition">
                Ver catálogo
              </Link>
              <Link to="/nosotros" className="bg-white hover:bg-orange-50 text-stone-700 px-7 py-3 rounded-xl font-semibold shadow-sm transition">
                Conócenos
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-6xl md:text-7xl">
            {CATEGORIAS.map((c) => (
              <div key={c.id} className={`${c.color} aspect-square rounded-3xl flex items-center justify-center shadow-sm`}>
                {c.icono}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6 text-left">Explora por categoría</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIAS.map((c) => (
            <Link
              key={c.id}
              to={`/catalogo?categoria=${c.id}`}
              className={`${c.color} rounded-2xl p-5 flex flex-col items-center gap-2 hover:-translate-y-1 hover:shadow-md transition`}
            >
              <span className="text-4xl">{c.icono}</span>
              <span className="font-semibold text-stone-700">{c.nombre}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="container mx-auto px-4 pb-4">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800">Destacados</h2>
          <Link to="/catalogo" className="text-orange-700 font-semibold hover:underline">Ver todo →</Link>
        </div>
        {loading ? (
          <Loader texto="Cargando productos..." />
        ) : mostrar.length === 0 ? (
          <p className="text-stone-500">Todavía no hay productos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mostrar.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>

      {/* Beneficios */}
      <section className="container mx-auto px-4 py-12 grid sm:grid-cols-3 gap-6">
        {[
          { icono: 'fa-hand-holding-heart', titulo: '100% hecho a mano', texto: 'Cada pieza es única y elaborada por artesanos locales.' },
          { icono: 'fa-truck', titulo: 'Envío en Puerto Maldonado', texto: 'Elige tu ubicación en el mapa y te lo llevamos.' },
          { icono: 'fa-mobile-screen', titulo: 'Paga con Yape o Plin', texto: 'También transferencia o efectivo contra entrega.' },
        ].map((b) => (
          <div key={b.titulo} className="bg-white border border-orange-100 rounded-2xl p-6 text-left shadow-sm">
            <i className={`fa-solid ${b.icono} text-2xl text-orange-700`}></i>
            <h3 className="font-bold text-stone-800 mt-3">{b.titulo}</h3>
            <p className="text-sm text-stone-500 mt-1">{b.texto}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
