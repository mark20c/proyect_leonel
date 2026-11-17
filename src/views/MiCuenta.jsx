import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { descargarMisDatos, eliminarMiCuenta } from '../service/cuentaService';
import { RESPONSABLE } from '../utils/constants';

const Tarjeta = ({ icono, titulo, children }) => (
  <section className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm">
    <h2 className="text-lg font-bold text-stone-800 mb-2">
      <i className={`fa-solid ${icono} text-orange-700 mr-2`}></i>{titulo}
    </h2>
    <div className="text-sm text-stone-600 space-y-3">{children}</div>
  </section>
);

const MiCuenta = () => {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [trabajando, setTrabajando] = useState(false);

  const handleDescargar = async () => {
    setTrabajando(true);
    try {
      await descargarMisDatos(user);
    } catch (e) {
      console.error('Error al descargar datos:', e);
      Swal.fire('Error', 'No se pudieron descargar tus datos. Inténtalo de nuevo.', 'error');
    } finally {
      setTrabajando(false);
    }
  };

  const handleEliminar = async () => {
    const r = await Swal.fire({
      title: '¿Eliminar tu cuenta?',
      html: `
        <div style="text-align:left;font-size:14px">
          <p>Esto hará lo siguiente:</p>
          <ul style="margin:8px 0 0 18px;list-style:disc">
            <li>Se eliminan tus <b>pedidos pendientes</b>.</li>
            <li>En tus pedidos ya pagados se borran tu nombre, celular, dirección, notas y ubicación.
                Solo se conserva el registro de la venta (productos y montos), como exige la ley tributaria.</li>
            <li>Se elimina tu cuenta y se cierra tu sesión.</li>
          </ul>
          <p style="margin-top:8px"><b>No se puede deshacer.</b></p>
        </div>`,
      icon: 'warning',
      input: 'text',
      inputPlaceholder: 'Escribe ELIMINAR para confirmar',
      inputValidator: (v) => (v !== 'ELIMINAR' ? 'Escribe ELIMINAR en mayúsculas' : undefined),
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Eliminar mi cuenta',
      cancelButtonText: 'Cancelar',
    });
    if (!r.isConfirmed) return;

    setTrabajando(true);
    try {
      await eliminarMiCuenta(user);
      clearCart();
      await logout();
      navigate('/');
      Swal.fire('Cuenta eliminada', 'Tus datos personales fueron eliminados.', 'success');
    } catch (e) {
      console.error('Error al eliminar la cuenta:', e);
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
        Swal.fire('Cancelado', 'No se eliminó nada.', 'info');
      } else {
        Swal.fire(
          'No se pudo eliminar la cuenta',
          `Inténtalo de nuevo o escríbenos a ${RESPONSABLE.correo} y lo hacemos por ti.`,
          'error'
        );
      }
    } finally {
      setTrabajando(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl text-left">
      <h1 className="text-3xl font-bold text-stone-800">Mi cuenta</h1>
      <p className="text-stone-500 mt-1">Tus datos son tuyos: aquí puedes verlos, descargarlos o eliminarlos.</p>

      <div className="grid gap-5 mt-8">
        <Tarjeta icono="fa-user" titulo="Mis datos">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="text-stone-400">Nombre</dt><dd>{user.displayName || '—'}</dd>
            <dt className="text-stone-400">Correo</dt><dd>{user.email || '—'}</dd>
          </dl>
          <p>
            Los datos de entrega (celular, dirección, ubicación) están en cada pedido.
            Puedes verlos en <Link to="/mis-pedidos" className="text-orange-700 underline">Mis pedidos</Link>.
          </p>
        </Tarjeta>

        <Tarjeta icono="fa-download" titulo="Descargar mis datos">
          <p>Descarga un archivo con todos los datos que tenemos de ti y de tus pedidos.</p>
          <button
            onClick={handleDescargar}
            disabled={trabajando}
            className="bg-orange-700 hover:bg-orange-800 text-white px-5 py-2.5 rounded-xl font-medium disabled:opacity-50"
          >
            Descargar (.json)
          </button>
        </Tarjeta>

        <Tarjeta icono="fa-pen" titulo="Corregir un dato">
          <p>
            Si un dato de un pedido está mal, escríbenos desde el correo de tu cuenta a{' '}
            <a href={`mailto:${RESPONSABLE.correo}?subject=Corrección de datos`} className="text-orange-700 underline">
              {RESPONSABLE.correo}
            </a>{' '}
            indicando el número de pedido y el dato correcto.
          </p>
        </Tarjeta>

        <Tarjeta icono="fa-user-xmark" titulo="Eliminar mi cuenta">
          <p>
            Borra tu cuenta y tus datos personales. Más detalles en la{' '}
            <Link to="/privacidad" className="text-orange-700 underline">Política de privacidad</Link>.
          </p>
          <button
            onClick={handleEliminar}
            disabled={trabajando}
            className="border-2 border-red-600 text-red-700 hover:bg-red-50 px-5 py-2.5 rounded-xl font-medium disabled:opacity-50"
          >
            {trabajando ? 'Procesando...' : 'Eliminar mi cuenta'}
          </button>
        </Tarjeta>
      </div>
    </div>
  );
};

export default MiCuenta;
