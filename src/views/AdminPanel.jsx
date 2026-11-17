import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { formatPrecio } from '../utils/helpers';
import { firebaseEnabled } from '../config/firebaseConfig';
import PedidosAdmin from '../components/PedidosAdmin';

const AdminPanel = () => {
  const { products, loading, uploading, addProduct, editProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pestana, setPestana] = useState('productos');

  const abrirNuevo = () => { setEditingProduct(null); setIsModalOpen(true); };
  const abrirEditar = (p) => { setEditingProduct(p); setIsModalOpen(true); };
  const cerrar = () => { setIsModalOpen(false); setEditingProduct(null); };

  const handleSave = async (productData, imageFile) => {
    if (editingProduct) await editProduct(editingProduct.id, productData, imageFile);
    else await addProduct(productData, imageFile);
    cerrar();
  };

  const agotados = products.filter((p) => p.stock <= 0).length;
  const valorInventario = products.reduce((acc, p) => acc + p.precio * p.stock, 0);

  return (
    <div className="container mx-auto px-4 py-10 text-left">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Panel de administración</h1>
          {!firebaseEnabled && (
            <p className="text-sm text-amber-700 mt-1">
              <i className="fa-solid fa-circle-info mr-1"></i>
              Modo demo: los cambios se guardan solo en este navegador.
            </p>
          )}
        </div>
        {pestana === 'productos' && <button
          onClick={abrirNuevo}
          className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 rounded-xl shadow-sm transition flex items-center gap-2 font-semibold"
        >
          <i className="fa-solid fa-plus"></i> Nuevo producto
        </button>}
      </div>

      <div className="flex gap-6 border-b border-stone-200 mb-6">
        {[['productos', 'fa-box-open', 'Productos'], ['pedidos', 'fa-receipt', 'Pedidos']].map(([id, icono, texto]) => (
          <button
            key={id}
            onClick={() => setPestana(id)}
            className={`pb-3 font-semibold border-b-2 -mb-px transition ${pestana === id ? 'border-orange-700 text-orange-700' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <i className={`fa-solid ${icono} mr-2`}></i>{texto}
          </button>
        ))}
      </div>

      {pestana === 'pedidos' ? <PedidosAdmin /> : <>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-orange-100 rounded-2xl p-5">
          <p className="text-sm text-stone-500">Productos</p>
          <p className="text-3xl font-bold text-stone-800">{products.length}</p>
        </div>
        <div className="bg-white border border-orange-100 rounded-2xl p-5">
          <p className="text-sm text-stone-500">Agotados</p>
          <p className={`text-3xl font-bold ${agotados ? 'text-red-600' : 'text-stone-800'}`}>{agotados}</p>
        </div>
        <div className="bg-white border border-orange-100 rounded-2xl p-5">
          <p className="text-sm text-stone-500">Valor del inventario</p>
          <p className="text-3xl font-bold text-stone-800">{formatPrecio(valorInventario)}</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={abrirEditar}
              onDelete={(p) => deleteProduct(p.id, p.nombre)}
            />
          ))}
        </div>
      )}

      </>}

      <Modal
        isOpen={isModalOpen}
        onClose={cerrar}
        onSave={handleSave}
        initialData={editingProduct}
        isUploading={uploading}
      />
    </div>
  );
};

export default AdminPanel;
