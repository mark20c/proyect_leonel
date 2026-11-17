import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMisPedidos, ESTADOS } from '../service/pedidoService';
import { formatPrecio } from '../utils/helpers';
import Loader from '../components/Loader';

const MisPedidos = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMisPedidos(user.uid)
      .then(setPedidos)
      .catch((e) => {
        console.error('Error al cargar pedidos:', e);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [user.uid]);

  if (loading) return <Loader texto="Cargando tus pedidos..." />;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl text-left">
      <h1 className="text-3xl font-bold text-stone-800 mb-6">Mis pedidos</h1>

      {error && <p className="text-red-600">No se pudieron cargar tus pedidos. Inténtalo más tarde.</p>}

      {!error && pedidos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-3">📦</p>
          <p className="text-stone-500">Todavía no has hecho pedidos.</p>
          <Link to="/catalogo" className="inline-block mt-4 text-orange-700 font-semibold hover:underline">Ir al catálogo</Link>
        </div>
      )}

      <div className="space-y-4">
        {pedidos.map((p) => {
          const estado = ESTADOS[p.estado] || ESTADOS.pendiente;
          return (
            <div key={p.id} className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <p className="font-bold text-stone-800">Pedido N° {p.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-stone-400">
                    {p.creadoEn ? new Date(p.creadoEn).toLocaleString('es-PE') : 'Recién creado'}
                  </p>
                </div>
                <span className={`${estado.color} text-xs font-semibold px-3 py-1 rounded-full`}>{estado.nombre}</span>
              </div>
              <ul className="mt-3 text-sm text-stone-600 divide-y divide-stone-100">
                {p.items.map((i) => (
                  <li key={i.id} className="py-1.5 flex justify-between">
                    <span>{i.nombre} x{i.cantidad}</span>
                    <span>{formatPrecio(i.precio * i.cantidad)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-3 pt-3 border-t font-bold text-stone-800">
                <span>Total · {p.metodoPago}</span>
                <span>{formatPrecio(p.total)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MisPedidos;
