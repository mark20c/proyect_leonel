import React from 'react';
import { Link } from 'react-router-dom';
import { NOMBRE_TIENDA, WHATSAPP } from '../utils/constants';

const Nosotros = () => (
  <div className="container mx-auto px-4 py-12 max-w-3xl text-left">
    <h1 className="text-4xl font-extrabold text-stone-800">Sobre {NOMBRE_TIENDA}</h1>
    <p className="text-lg text-stone-600 mt-6 leading-relaxed">
      Somos un emprendimiento de Puerto Maldonado que reúne el trabajo de artesanas y artesanos
      locales. Tejemos, modelamos, tallamos y pintamos cada pieza a mano, usando materiales
      naturales de la región como semillas amazónicas, barro y madera reciclada.
    </p>
    <p className="text-lg text-stone-600 mt-4 leading-relaxed">
      Cada compra apoya directamente a quienes las hacen. Y si buscas algo especial, también
      hacemos pedidos personalizados.
    </p>

    <div className="grid sm:grid-cols-3 gap-4 mt-10">
      {[
        { n: '🧵', t: 'Materiales naturales' },
        { n: '🤝', t: 'Comercio justo' },
        { n: '🎁', t: 'Pedidos personalizados' },
      ].map((v) => (
        <div key={v.t} className="bg-orange-50 rounded-2xl p-6 text-center">
          <p className="text-4xl">{v.n}</p>
          <p className="font-semibold text-stone-700 mt-2">{v.t}</p>
        </div>
      ))}
    </div>

    <div className="flex flex-wrap gap-3 mt-10">
      <Link to="/catalogo" className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 rounded-xl font-semibold">
        Ver catálogo
      </Link>
      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold">
        <i className="fa-brands fa-whatsapp mr-2"></i>Pedido personalizado
      </a>
    </div>
  </div>
);

export default Nosotros;
