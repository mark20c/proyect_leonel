import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getTodosLosPedidos, cambiarEstado, ESTADOS } from '../service/pedidoService';
import { useProducts } from '../hooks/useProducts';
import { formatPrecio } from '../utils/helpers';
import Loader from './Loader';

// Lista de pedidos para el administrador.
// Al marcar "Pago confirmado" se descuenta el stock; al cancelar uno confirmado, se devuelve.
const PedidosAdmin = () => {
  const { products, loadProducts } = useProducts();

  // El total lo calcula el navegador del cliente, así que podría venir alterado.
  // Lo comparamos con los precios actuales del catálogo antes de confirmar el pago.
  const preciosNoCoinciden = (pedido) => {
    const suma = pedido.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    if (Math.abs(suma - pedido.total) > 0.01) return true;
    return pedido.items.some((i) => {
      const actual = products.find((p) => String(p.id) === i.id);
      return actual && Math.abs(actual.precio - i.precio) > 0.009;
    });
  };
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('pendiente');

  const cargar = async () => {
    setLoading(true);
    try {
      setPedidos(await getTodosLosPedidos());
    } catch (e) {
      console.error('Error al cargar pedidos:', e);
      Swal.fire('Error', 'No se pudieron cargar los pedidos. ¿Publicaste las reglas de Firestore?', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEstado = async (pedido, nuevoEstado) => {
    if (nuevoEstado === pedido.estado) return;
    const r = await Swal.fire({
      title: `¿Marcar como "${ESTADOS[nuevoEstado].nombre}"?`,
      text: nuevoEstado === 'confirmado' ? 'Se descontará el stock de los productos.' : '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#c2410c',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });
    if (!r.isConfirmed) return;
    try {
      await cambiarEstado(pedido, nuevoEstado);
      setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? { ...p, estado: nuevoEstado } : p)));
      loadProducts(); // el stock pudo cambiar
    } catch (e) {
      console.error('Error al cambiar estado:', e);
      Swal.fire('Error', 'No se pudo actualizar el pedido', 'error');
    }
  };

  if (loading) return <Loader texto="Cargando pedidos..." />;

  const visibles = filtro === 'todos' ? pedidos : pedidos.filter((p) => p.estado === filtro);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {['pendiente', 'confirmado', 'entregado', 'cancelado', 'todos'].map((e) => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filtro === e ? 'bg-orange-700 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}
          >
            {e === 'todos' ? 'Todos' : ESTADOS[e].nombre} ({e === 'todos' ? pedidos.length : pedidos.filter((p) => p.estado === e).length})
          </button>
        ))}
        <button onClick={cargar} className="ml-auto px-4 py-2 text-sm text-stone-500 hover:text-orange-700" title="Actualizar">
          <i className="fa-solid fa-rotate"></i>
        </button>
      </div>

      {visibles.length === 0 ? (
        <p className="text-stone-500 py-10 text-center">No hay pedidos en este estado.</p>
      ) : (
        <div className="space-y-4">
          {visibles.map((p) => (
            <div key={p.id} className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm grid md:grid-cols-3 gap-4">
              <div>
                <p className="font-bold text-stone-800">N° {p.id.slice(-6).toUpperCase()}</p>
                {preciosNoCoinciden(p) && (
                  <p className="text-xs font-semibold text-red-600 mt-1" title="Los precios o el total no coinciden con el catálogo actual">
                    <i className="fa-solid fa-triangle-exclamation mr-1"></i>Revisar precios antes de confirmar
                  </p>
                )}
                <p className="text-xs text-stone-400">{p.creadoEn ? new Date(p.creadoEn).toLocaleString('es-PE') : ''}</p>
                {p.anonimizado && (
                  <p className="text-xs text-stone-500 mt-1"><i className="fa-solid fa-user-slash mr-1"></i>El cliente eliminó sus datos</p>
                )}
                <p className="mt-2 text-sm text-stone-700">{p.cliente?.nombre}</p>
                <p className="text-sm text-stone-500">{p.cliente?.telefono} · {p.email}</p>
                <p className="text-sm text-stone-500">{p.cliente?.direccion}</p>
                {p.cliente?.notas && <p className="text-sm text-stone-500 italic">“{p.cliente.notas}”</p>}
                {p.ubicacion && (
                  <a
                    href={`https://www.google.com/maps?q=${p.ubicacion.lat},${p.ubicacion.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-orange-700 hover:underline"
                  >
                    <i className="fa-solid fa-location-dot mr-1"></i>Ver ubicación
                  </a>
                )}
              </div>
              <ul className="text-sm text-stone-600">
                {p.items.map((i) => (
                  <li key={i.id} className="flex justify-between py-0.5">
                    <span>{i.nombre} x{i.cantidad}</span>
                    <span>{formatPrecio(i.precio * i.cantidad)}</span>
                  </li>
                ))}
                <li className="flex justify-between font-bold text-stone-800 border-t mt-2 pt-2">
                  <span>{p.metodoPago}</span>
                  <span>{formatPrecio(p.total)}</span>
                </li>
              </ul>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Estado</label>
                <select
                  value={p.estado}
                  onChange={(e) => handleEstado(p, e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                >
                  {Object.entries(ESTADOS).map(([id, e]) => (
                    <option key={id} value={id}>{e.nombre}</option>
                  ))}
                </select>
                {p.cliente?.telefono && (
                  <a
                    href={`https://wa.me/51${p.cliente.telefono}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-700 hover:underline"
                  >
                    <i className="fa-brands fa-whatsapp"></i>Escribir al cliente
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosAdmin;
