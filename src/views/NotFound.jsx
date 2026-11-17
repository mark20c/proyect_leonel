import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container mx-auto px-4 py-24 text-center">
    <p className="text-6xl mb-4">🧶</p>
    <h1 className="text-3xl font-bold text-stone-800">Página no encontrada</h1>
    <p className="text-stone-500 mt-2">Parece que este hilo se enredó.</p>
    <Link to="/" className="inline-block mt-6 bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 rounded-xl font-semibold">
      Volver al inicio
    </Link>
  </div>
);

export default NotFound;
