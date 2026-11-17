import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

const Login = () => {
  const { user, login, firebaseEnabled } = useAuth();
  const location = useLocation();
  const [cargando, setCargando] = useState(false);
  const destino = location.state?.from || '/';

  // Si ya inició sesión, lo mandamos a donde quería ir
  if (user) return <Navigate to={destino} replace />;

  const handleLogin = async () => {
    setCargando(true);
    try {
      const u = await login();
      Swal.fire({
        icon: 'success',
        title: `¡Hola, ${u?.displayName || 'bienvenido'}!`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Cerrar la ventana de Google no es un error que haya que mostrar
      if (error.code !== 'auth/popup-closed-by-user') {
        Swal.fire('No se pudo iniciar sesión', error.message || 'Inténtalo de nuevo', 'error');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-sm w-full border border-orange-100">
        <p className="text-5xl mb-3">🧶</p>
        <h1 className="text-3xl font-bold text-stone-800">Iniciar sesión</h1>
        <p className="text-stone-500 mt-2 mb-8">
          {firebaseEnabled ? 'Accede con tu cuenta de Google' : 'Firebase no está configurado: puedes probar la tienda en modo demo'}
        </p>

        <button
          onClick={handleLogin}
          disabled={cargando}
          className="w-full bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 px-6 py-3 rounded-xl transition flex items-center justify-center gap-3 shadow-sm font-medium disabled:opacity-50"
        >
          {firebaseEnabled ? (
            <>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
              {cargando ? 'Conectando...' : 'Continuar con Google'}
            </>
          ) : (
            <>
              <i className="fa-solid fa-user-gear text-orange-700"></i>
              Entrar en modo demo (admin)
            </>
          )}
        </button>

        <p className="text-xs text-stone-400 mt-6">
          Al ingresar, usaremos tu nombre y correo de Google solo para gestionar tus pedidos.
          Más información en la{' '}
          <Link to="/privacidad" className="text-orange-700 underline">Política de privacidad</Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;
