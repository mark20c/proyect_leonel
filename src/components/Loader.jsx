import React from 'react';

const Loader = ({ texto = 'Cargando...' }) => (
  <div className="flex flex-col justify-center items-center h-48 gap-3">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-700" />
    <p className="text-stone-500 text-sm">{texto}</p>
  </div>
);

export default Loader;
