import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { CATEGORIAS } from '../utils/constants';
import { normalizar } from '../utils/helpers';

const Catalogo = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get('categoria') || 'todas';
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('recientes');

  const elegirCategoria = (id) => {
    if (id === 'todas') setSearchParams({});
    else setSearchParams({ categoria: id });
  };

  const filtrados = useMemo(() => {
    const texto = normalizar(busqueda);
    const lista = products.filter((p) => {
      const coincideCategoria = categoria === 'todas' || p.categoria === categoria;
      const coincideTexto =
        !texto || normalizar(p.nombre).includes(texto) || normalizar(p.descripcion).includes(texto);
      return coincideCategoria && coincideTexto;
    });
    if (orden === 'menor') return [...lista].sort((a, b) => a.precio - b.precio);
    if (orden === 'mayor') return [...lista].sort((a, b) => b.precio - a.precio);
    return [...lista].reverse(); // los últimos agregados primero
  }, [products, categoria, busqueda, orden]);

  const botonCategoria = (activo) =>
    `px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
      activo ? 'bg-orange-700 text-white shadow' : 'bg-white text-stone-600 border border-stone-200 hover:border-orange-300'
    }`;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-6 text-left">Catálogo</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"></i>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar manualidades..."
            className="w-full pl-11 pr-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="px-4 py-3 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option value="recientes">Más recientes</option>
          <option value="menor">Precio: menor a mayor</option>
          <option value="mayor">Precio: mayor a menor</option>
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
        <button onClick={() => elegirCategoria('todas')} className={botonCategoria(categoria === 'todas')}>
          Todas
        </button>
        {CATEGORIAS.map((c) => (
          <button key={c.id} onClick={() => elegirCategoria(c.id)} className={botonCategoria(categoria === c.id)}>
            {c.icono} {c.nombre}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader texto="Cargando productos..." />
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          <p className="text-5xl mb-3">🔍</p>
          <p>No encontramos productos con esos filtros.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-stone-500 mb-4 text-left">{filtrados.length} producto(s)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtrados.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default Catalogo;
