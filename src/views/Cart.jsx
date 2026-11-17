import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrecio } from '../utils/helpers';
import ProductImage from '../components/ProductImage';
import Swal from 'sweetalert2';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      Swal.fire('Inicia sesión', 'Necesitas ingresar para completar tu compra', 'info');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  const handleVaciar = async () => {
    const r = await Swal.fire({
      title: '¿Vaciar el carrito?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#c2410c',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
    });
    if (r.isConfirmed) clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🧺</p>
        <h1 className="text-2xl font-bold text-stone-800">Tu carrito está vacío</h1>
        <p className="text-stone-500 mt-2">Descubre nuestras manualidades hechas a mano.</p>
        <Link to="/catalogo" className="inline-block mt-6 bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 rounded-xl font-semibold">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8 text-left">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold text-stone-800 mb-6">Mi carrito</h1>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white border border-orange-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link to={`/producto/${item.id}`} className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                <ProductImage producto={item} className="w-full h-full" />
              </Link>
              <div className="flex-1">
                <h3 className="font-semibold text-stone-800">{item.nombre}</h3>
                <p className="text-sm text-stone-500">{formatPrecio(item.precio)} c/u</p>
              </div>
              <div className="flex items-center border border-stone-300 rounded-xl w-fit">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg" aria-label="Quitar uno">−</button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.stock !== undefined && item.quantity >= item.stock}
                  className="px-3 py-1 text-lg disabled:opacity-30"
                  aria-label="Agregar uno"
                >+</button>
              </div>
              <p className="font-bold text-stone-800 sm:w-24 sm:text-right">{formatPrecio(item.precio * item.quantity)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-600 p-2" title="Quitar">
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))}
        </div>
        <button onClick={handleVaciar} className="mt-4 text-sm text-stone-500 hover:text-red-600">
          <i className="fa-solid fa-broom mr-1"></i>Vaciar carrito
        </button>
      </div>

      <aside className="bg-white border border-orange-100 rounded-2xl p-6 h-fit lg:sticky lg:top-24 shadow-sm">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Resumen</h2>
        <div className="flex justify-between text-stone-600"><span>Productos ({totalItems})</span><span>{formatPrecio(totalPrice)}</span></div>
        <div className="flex justify-between text-stone-600 mt-2"><span>Envío</span><span className="text-emerald-700">Se coordina</span></div>
        <div className="flex justify-between text-xl font-bold text-stone-800 border-t mt-4 pt-4">
          <span>Total</span><span>{formatPrecio(totalPrice)}</span>
        </div>
        <button onClick={handleCheckout} className="mt-6 w-full bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-xl font-semibold transition">
          Continuar con la compra
        </button>
        <Link to="/catalogo" className="block text-center mt-3 text-sm text-orange-700 hover:underline">Seguir comprando</Link>
      </aside>
    </div>
  );
};

export default Cart;
