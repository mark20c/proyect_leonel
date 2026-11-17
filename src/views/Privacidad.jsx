import React from 'react';
import { Link } from 'react-router-dom';
import { NOMBRE_TIENDA, RESPONSABLE, VERSION_PRIVACIDAD } from '../utils/constants';

// ⚠️ Plantilla para un proyecto académico / emprendimiento pequeño.
// Antes de usarla en un negocio real, completa RESPONSABLE en constants.js
// y haz que la revise alguien con conocimientos legales.

const Seccion = ({ titulo, children }) => (
  <section className="mt-8">
    <h2 className="text-xl font-bold text-stone-800 mb-2">{titulo}</h2>
    <div className="space-y-2 text-stone-600 leading-relaxed">{children}</div>
  </section>
);

const Tabla = ({ filas }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border border-stone-200 rounded-xl overflow-hidden">
      <thead className="bg-orange-50 text-stone-700">
        <tr>
          <th className="text-left p-3">Dato</th>
          <th className="text-left p-3">¿Para qué?</th>
          <th className="text-left p-3">¿Es obligatorio?</th>
        </tr>
      </thead>
      <tbody>
        {filas.map(([dato, para, obligatorio]) => (
          <tr key={dato} className="border-t border-stone-200 align-top">
            <td className="p-3 font-medium text-stone-700">{dato}</td>
            <td className="p-3">{para}</td>
            <td className="p-3">{obligatorio}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Privacidad = () => (
  <div className="container mx-auto px-4 py-12 max-w-3xl text-left">
    <h1 className="text-3xl md:text-4xl font-extrabold text-stone-800">Política de privacidad</h1>
    <p className="text-sm text-stone-400 mt-2">Versión del {VERSION_PRIVACIDAD}</p>

    <p className="mt-6 text-stone-600 leading-relaxed">
      En {NOMBRE_TIENDA} cuidamos tus datos personales conforme a la Ley N.º 29733, Ley de
      Protección de Datos Personales, y su Reglamento (D.S. N.º 016-2024-JUS). Aquí te
      explicamos, en lenguaje simple, qué datos recogemos, para qué y qué puedes hacer con ellos.
    </p>

    <Seccion titulo="1. ¿Quién es el responsable de tus datos?">
      <p>
        <strong>{RESPONSABLE.nombre}</strong> ({RESPONSABLE.documento}), con domicilio en{' '}
        {RESPONSABLE.direccion}.
      </p>
      <p>
        Correo para temas de privacidad:{' '}
        <a href={`mailto:${RESPONSABLE.correo}`} className="text-orange-700 underline">{RESPONSABLE.correo}</a>
      </p>
    </Seccion>

    <Seccion titulo="2. ¿Qué datos recogemos y para qué?">
      <p>Solo pedimos lo necesario para venderte y entregarte tus productos:</p>
      <Tabla
        filas={[
          ['Nombre y correo de tu cuenta de Google', 'Identificarte, mostrarte tus pedidos y contactarte sobre tu compra.', 'Sí, para comprar'],
          ['Nombre para la entrega', 'Saber a quién entregar el pedido.', 'Sí, para comprar'],
          ['Celular', 'Coordinar el pago y la entrega.', 'Sí, para comprar'],
          ['Dirección y referencia', 'Llevar el pedido.', 'Sí, para comprar'],
          ['Ubicación en el mapa', 'Encontrar tu dirección más fácil.', 'No, es opcional'],
          ['Notas del pedido', 'Detalles que quieras darnos (color, mensaje de regalo).', 'No, es opcional'],
          ['Productos, total y método de pago', 'Registrar la venta y emitir comprobantes.', 'Sí, para comprar'],
        ]}
      />
      <p>
        <strong>No</strong> recogemos datos de tu tarjeta (el pago se coordina por Yape, Plin,
        transferencia o en efectivo), <strong>no</strong> usamos tus datos para publicidad y{' '}
        <strong>no</strong> los vendemos.
      </p>
      <p>
        Tu carrito se guarda solo en tu navegador (almacenamiento local) para que no se pierda
        si cierras la página. No usamos cookies de publicidad ni de seguimiento.
      </p>
    </Seccion>

    <Seccion titulo="3. ¿Con qué base legal los usamos?">
      <p>
        Usamos tus datos porque nos das tu <strong>consentimiento</strong> al marcar la casilla
        antes de confirmar tu pedido, y porque son necesarios para <strong>cumplir la compra</strong>{' '}
        que nos pides. Puedes retirar tu consentimiento cuando quieras (ver punto 6).
      </p>
    </Seccion>

    <Seccion titulo="4. ¿Cuánto tiempo los guardamos?">
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Datos de tu cuenta:</strong> mientras tengas la cuenta. Si la eliminas, se borran.</li>
        <li>
          <strong>Pedidos:</strong> el registro de la venta (productos, montos y fecha) se conserva
          durante el plazo que exigen las normas tributarias. Si eliminas tu cuenta, borramos de
          esos pedidos tu nombre, celular, dirección, notas y ubicación.
        </li>
        <li><strong>Pedidos pendientes</strong> (que no llegaste a pagar): se eliminan por completo si eliminas tu cuenta.</li>
      </ul>
    </Seccion>

    <Seccion titulo="5. ¿Con quién los compartimos?">
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Google (Firebase):</strong> es nuestro proveedor de inicio de sesión, base de datos
          y hosting. Tus datos se guardan en sus servidores, que pueden estar fuera del Perú.
          Google actúa como encargado y no los usa para sus propios fines.
        </li>
        <li>
          <strong>WhatsApp:</strong> solo si tú decides enviarnos tu pedido por ese medio.
        </li>
        <li>
          <strong>OpenStreetMap:</strong> carga las imágenes del mapa. Recibe datos técnicos de
          tu conexión (como la dirección IP), no tus datos personales del pedido.
        </li>
        <li>
          <strong>Autoridades:</strong> solo cuando la ley nos lo exija (por ejemplo, SUNAT).
        </li>
      </ul>
    </Seccion>

    <Seccion titulo="6. Tus derechos y cómo ejercerlos">
      <p>Tienes derecho a:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Acceso:</strong> saber qué datos tenemos de ti.</li>
        <li><strong>Rectificación:</strong> corregir datos equivocados.</li>
        <li><strong>Cancelación:</strong> pedir que eliminemos tus datos.</li>
        <li><strong>Oposición:</strong> oponerte a un uso de tus datos.</li>
        <li><strong>Portabilidad</strong> y <strong>revocatoria del consentimiento</strong>.</li>
      </ul>
      <p className="mt-3"><strong>Cómo hacerlo:</strong></p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          En <Link to="/mi-cuenta" className="text-orange-700 underline">Mi cuenta</Link> puedes ver y
          descargar tus datos, y eliminar tu cuenta con un botón.
        </li>
        <li>
          Para corregir un dato u otra solicitud, escribe a{' '}
          <a href={`mailto:${RESPONSABLE.correo}`} className="text-orange-700 underline">{RESPONSABLE.correo}</a>{' '}
          desde el correo de tu cuenta.
        </li>
      </ul>
      <p>
        Respondemos dentro de los plazos de ley. Si no estás conforme con nuestra respuesta,
        puedes acudir a la Autoridad Nacional de Protección de Datos Personales del Ministerio de
        Justicia y Derechos Humanos.
      </p>
    </Seccion>

    <Seccion titulo="7. ¿Cómo protegemos tus datos?">
      <ul className="list-disc pl-6 space-y-1">
        <li>La página funciona solo con conexión cifrada (HTTPS).</li>
        <li>
          La base de datos tiene reglas de acceso: cada cliente solo puede ver sus propios
          pedidos y solo el administrador puede ver todos.
        </li>
        <li>No guardamos contraseñas: el inicio de sesión lo hace Google.</li>
        <li>
          Si ocurriera un incidente que exponga tus datos, lo comunicaremos a la Autoridad y a
          las personas afectadas dentro de las 48 horas de conocerlo.
        </li>
      </ul>
    </Seccion>

    <Seccion titulo="8. Menores de edad">
      <p>La tienda está dirigida a mayores de 18 años. Si eres menor, pide a un adulto que haga la compra.</p>
    </Seccion>

    <Seccion titulo="9. Cambios en esta política">
      <p>
        Si cambiamos esta política, actualizaremos la fecha de versión y te pediremos aceptarla
        de nuevo en tu próxima compra.
      </p>
    </Seccion>
  </div>
);

export default Privacidad;
