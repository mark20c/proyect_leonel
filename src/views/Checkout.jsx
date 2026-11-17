import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Swal from 'sweetalert2';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrecio } from '../utils/helpers';
import { METODOS_PAGO, UBICACION_DEFECTO, WHATSAPP } from '../utils/constants';
import { crearPedido } from '../service/pedidoService';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Arregla el icono del marcador de Leaflet cuando se usa con Vite
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Captura el clic en el mapa para mover el marcador
const LocationMarker = ({ setPosition }) => {
  useMapEvents({ click: (e) => setPosition(e.latlng) });
  return null;
};

// Centra el mapa cuando se obtiene la ubicación con el GPS
const CentrarMapa = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 16));
  }, [position, map]);
  return null;
};

const inputClase = 'w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none';

const Checkout = () => {
  const { cart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // La ubicación es OPCIONAL: solo se guarda si el cliente la marca en el mapa
  // o pulsa "Usar mi ubicación actual" (no se pide el GPS al abrir la página).
  const [position, setPosition] = useState(null);
  const [buscandoGps, setBuscandoGps] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false); // nunca pre-marcada
  const [enviando, setEnviando] = useState(false);
  const [datos, setDatos] = useState({
    nombre: user?.displayName || '',
    telefono: '',
    direccion: '',
    metodoPago: METODOS_PAGO[0],
    notas: '',
  });

  // Si el carrito está vacío no hay nada que pagar
  if (cart.length === 0) return <Navigate to="/carrito" replace />;

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) {
      Swal.fire('No disponible', 'Tu navegador no permite obtener la ubicación. Marca el punto en el mapa.', 'info');
      return;
    }
    setBuscandoGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setBuscandoGps(false);
      },
      () => {
        setBuscandoGps(false);
        Swal.fire('No se pudo obtener tu ubicación', 'Puedes marcar el punto en el mapa o dejarlo vacío.', 'info');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const handleConfirmar = async (e) => {
    e.preventDefault();
    if (!/^9\d{8}$/.test(datos.telefono)) {
      Swal.fire('Teléfono inválido', 'Ingresa un celular de 9 dígitos que empiece con 9', 'warning');
      return;
    }
    if (!aceptaPrivacidad) {
      Swal.fire('Falta tu autorización', 'Para registrar el pedido necesitamos que aceptes la Política de privacidad.', 'warning');
      return;
    }

    // 1. Guardar el pedido en la base de datos
    setEnviando(true);
    let pedido;
    try {
      pedido = await crearPedido({ user, cart, total: totalPrice, datos, ubicacion: position, aceptaPrivacidad });
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      Swal.fire('No se pudo registrar el pedido', 'Revisa tu conexión e inténtalo de nuevo.', 'error');
      setEnviando(false);
      return;
    }

    // 2. Ofrecer enviarlo por WhatsApp para coordinar el pago
    const detalle = cart.map((i) => `• ${i.nombre} x${i.quantity} = ${formatPrecio(i.precio * i.quantity)}`).join('\n');
    const mapa = position ? `\nUbicación: https://www.google.com/maps?q=${position.lat},${position.lng}` : '';
    const mensaje =
      `Hola, hice el pedido N° ${pedido.id.slice(-6).toUpperCase()}:\n${detalle}\n\nTotal: ${formatPrecio(totalPrice)}\n` +
      `Nombre: ${datos.nombre}\nCelular: ${datos.telefono}\nDirección: ${datos.direccion}\n` +
      `Pago: ${datos.metodoPago}${mapa}` +
      (datos.notas ? `\nNotas: ${datos.notas}` : '');

    const r = await Swal.fire({
      title: '¡Pedido registrado!',
      html: `Pedido N° <b>${pedido.id.slice(-6).toUpperCase()}</b><br/>Total: <b>${formatPrecio(totalPrice)}</b><br/>Pago: ${datos.metodoPago}<br/><br/>Envíanos el pedido por WhatsApp para coordinar el pago y la entrega. Puedes ver su estado en "Mis pedidos".`,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Enviar por WhatsApp',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#059669',
    });
    if (r.isConfirmed) {
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`, '_blank');
    }
    clearCart();
    navigate('/mis-pedidos');
  };

  return (
    <form onSubmit={handleConfirmar} className="container mx-auto px-4 py-10 grid lg:grid-cols-2 gap-8 text-left">
      <div className="space-y-6">
        <section className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-stone-800 mb-4">1. Datos de entrega</h2>
          <div className="space-y-3">
            <input name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Nombre completo" className={inputClase} required />
            <input name="telefono" value={datos.telefono} onChange={cambiar} placeholder="Celular (9 dígitos)" inputMode="numeric" maxLength={9} className={inputClase} required />
            <input name="direccion" value={datos.direccion} onChange={cambiar} placeholder="Dirección y referencia" className={inputClase} required />
            <textarea name="notas" value={datos.notas} onChange={cambiar} placeholder="Notas (opcional): color preferido, mensaje para regalo..." rows="2" className={`${inputClase} resize-none`} />
          </div>
        </section>

        <section className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-stone-800 mb-4">2. Método de pago</h2>
          <div className="grid grid-cols-2 gap-3">
            {METODOS_PAGO.map((m) => (
              <label key={m} className={`border rounded-xl px-4 py-3 cursor-pointer text-sm font-medium transition ${datos.metodoPago === m ? 'border-orange-600 bg-orange-50 text-orange-800' : 'border-stone-200 text-stone-600'}`}>
                <input type="radio" name="metodoPago" value={m} checked={datos.metodoPago === m} onChange={cambiar} className="sr-only" />
                {m}
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-stone-800 mb-2">
            3. Ubicación de entrega <span className="text-sm font-normal text-stone-400">(opcional)</span>
          </h2>
          <p className="text-sm text-stone-500 mb-3">
            Si quieres, marca en el mapa dónde entregamos tu pedido. Con la dirección también es suficiente.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <button type="button" onClick={usarMiUbicacion} disabled={buscandoGps}
              className="text-sm bg-orange-50 hover:bg-orange-100 text-orange-800 px-4 py-2 rounded-xl font-medium disabled:opacity-50">
              <i className="fa-solid fa-location-crosshairs mr-2"></i>
              {buscandoGps ? 'Buscando...' : 'Usar mi ubicación actual'}
            </button>
            {position && (
              <button type="button" onClick={() => setPosition(null)}
                className="text-sm text-stone-500 hover:text-red-600 px-3 py-2">
                Quitar ubicación
              </button>
            )}
          </div>
          <div className="h-72 rounded-xl overflow-hidden border">
            <MapContainer center={position || UBICACION_DEFECTO} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker setPosition={setPosition} />
              <CentrarMapa position={position} />
              {position && <Marker position={position} />}
            </MapContainer>
          </div>
          <p className="mt-2 text-xs text-stone-400">
            {position
              ? `Ubicación marcada: Lat ${position.lat.toFixed(4)}, Lng ${position.lng.toFixed(4)}`
              : 'Sin ubicación marcada.'}
          </p>
        </section>
      </div>

      <aside className="bg-white border border-orange-100 rounded-2xl p-6 h-fit lg:sticky lg:top-24 shadow-sm">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Resumen del pedido</h2>
        <ul className="divide-y divide-stone-100">
          {cart.map((item) => (
            <li key={item.id} className="py-3 flex justify-between gap-4 text-sm">
              <span className="text-stone-700">{item.nombre} <span className="text-stone-400">x{item.quantity}</span></span>
              <span className="font-semibold">{formatPrecio(item.precio * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-xl font-bold text-stone-800 border-t mt-2 pt-4">
          <span>Total</span><span>{formatPrecio(totalPrice)}</span>
        </div>
        <label className="mt-6 flex items-start gap-3 text-sm text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            checked={aceptaPrivacidad}
            onChange={(e) => setAceptaPrivacidad(e.target.checked)}
            className="mt-1 w-4 h-4 accent-orange-700 shrink-0"
            required
          />
          <span>
            Autorizo el uso de mis datos (nombre, celular, dirección y, si la marqué, ubicación) para
            gestionar y entregar este pedido, según la{' '}
            <Link to="/privacidad" target="_blank" className="text-orange-700 underline">Política de privacidad</Link>.
          </span>
        </label>
        <button type="submit" disabled={enviando} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-lg transition">
          {enviando ? 'Registrando...' : 'Confirmar pedido'}
        </button>
      </aside>
    </form>
  );
};

export default Checkout;
