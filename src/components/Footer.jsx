import React from 'react';
import { Link } from 'react-router-dom';
import { NOMBRE_TIENDA, WHATSAPP, RESPONSABLE } from '../utils/constants';

const Footer = () => (
  <footer className="bg-stone-900 text-stone-300 mt-16">
    <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
      <div>
        <h3 className="text-white text-xl font-bold mb-2">🧶 {NOMBRE_TIENDA}</h3>
        <p className="text-sm text-stone-400">
          Manualidades hechas a mano en Puerto Maldonado. Cada pieza es única.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-2">Navegación</h4>
        <ul className="space-y-1 text-sm">
          <li><Link to="/catalogo" className="hover:text-orange-300">Catálogo</Link></li>
          <li><Link to="/nosotros" className="hover:text-orange-300">Nosotros</Link></li>
          <li><Link to="/carrito" className="hover:text-orange-300">Mi carrito</Link></li>
          <li><Link to="/mi-cuenta" className="hover:text-orange-300">Mi cuenta y mis datos</Link></li>
          <li><Link to="/privacidad" className="hover:text-orange-300">Política de privacidad</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-2">Contacto</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="hover:text-orange-300">
              <i className="fa-brands fa-whatsapp mr-2"></i>Escríbenos por WhatsApp
            </a>
          </li>
          <li><i className="fa-solid fa-location-dot mr-2"></i>Puerto Maldonado, Madre de Dios</li>
          <li>
            <a href={`mailto:${RESPONSABLE.correo}`} className="hover:text-orange-300">
              <i className="fa-solid fa-envelope mr-2"></i>{RESPONSABLE.correo}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <p className="text-center text-xs text-stone-500 pb-6">
      © {new Date().getFullYear()} {NOMBRE_TIENDA}. Proyecto de Desarrollo Web.
    </p>
  </footer>
);

export default Footer;
