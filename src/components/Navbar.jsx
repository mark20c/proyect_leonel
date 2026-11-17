import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { NOMBRE_TIENDA } from '../utils/constants';
import Swal from 'sweetalert2';

const enlace = ({ isActive }) =>
  `font-medium transition ${isActive ? 'text-orange-700' : 'text-stone-600 hover:text-orange-700'}`;

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);

  const handleLogout = async () => {
    await logout();
    setAbierto(false);
    navigate('/');
    Swal.fire({ icon: 'info', title: 'Sesión cerrada', text: '¡Vuelve pronto!', timer: 1500, showConfirmButton: false });
  };

  const links = (
    <>
      <NavLink to="/" end className={enlace} onClick={() => setAbierto(false)}>Inicio</NavLink>
      <NavLink to="/catalogo" className={enlace} onClick={() => setAbierto(false)}>Catálogo</NavLink>
      <NavLink to="/nosotros" className={enlace} onClick={() => setAbierto(false)}>Nosotros</NavLink>
      {user && (
        <NavLink to="/mis-pedidos" className={enlace} onClick={() => setAbierto(false)}>Mis pedidos</NavLink>
      )}
      {isAdmin && (
        <NavLink to="/admin" className={enlace} onClick={() => setAbierto(false)}>Panel Admin</NavLink>
      )}
    </>
  );

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-stone-800">
          <span className="text-3xl">🧶</span>
          <span>{NOMBRE_TIENDA}</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">{links}</div>

        <div className="flex items-center gap-3">
          <Link
            to="/carrito"
            className="relative text-stone-700 hover:text-orange-700 p-2"
            aria-label="Ver carrito"
          >
            <i className="fa-solid fa-basket-shopping text-xl"></i>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-700 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/mi-cuenta" className="text-sm text-stone-600 hover:text-orange-700 max-w-40 truncate" title="Mi cuenta">
                <i className="fa-solid fa-circle-user mr-1"></i>{user.displayName || user.email}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-xl text-sm font-medium transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-block bg-orange-700 hover:bg-orange-800 text-white px-5 py-2 rounded-xl font-medium transition"
            >
              Ingresar
            </Link>
          )}

          <button
            className="md:hidden text-stone-700 p-2"
            onClick={() => setAbierto(!abierto)}
            aria-label="Abrir menú"
          >
            <i className={`fa-solid ${abierto ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {abierto && (
        <div className="md:hidden border-t border-orange-100 px-4 py-4 flex flex-col gap-4 bg-white">
          {links}
          {user && (
            <Link to="/mi-cuenta" onClick={() => setAbierto(false)} className="text-stone-600 font-medium">Mi cuenta</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-left text-stone-600 font-medium">
              Salir ({user.displayName || user.email})
            </button>
          ) : (
            <Link to="/login" onClick={() => setAbierto(false)} className="text-orange-700 font-semibold">
              Ingresar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
