import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { CATEGORIAS } from '../utils/constants';
import { uploadsEnabled } from '../config/firebaseConfig';
import ProductImage from './ProductImage';

const VACIO = {
  nombre: '',
  descripcion: '',
  categoria: CATEGORIAS[0].id,
  precio: '',
  stock: '',
  destacado: false,
  foto: '',
};

const inputClase =
  'w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition';

// Formulario para crear o editar un producto.
// Solo entrega los datos y el archivo; la subida la hace ProductContext.
const Modal = ({ isOpen, onClose, onSave, initialData, isUploading }) => {
  const [formData, setFormData] = useState(VACIO);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setFormData(initialData ? { ...VACIO, ...initialData } : VACIO);
    setImagePreview(initialData?.foto || '');
    setImageFile(null);
  }, [initialData, isOpen]);

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Imagen muy pesada', 'Usa una imagen de menos de 2 MB', 'warning');
      e.target.value = '';
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.descripcion.trim() || formData.precio === '') {
      Swal.fire('Faltan datos', 'Completa nombre, descripción y precio', 'error');
      return;
    }
    if (Number(formData.precio) <= 0 || Number(formData.stock) < 0) {
      Swal.fire('Datos inválidos', 'El precio debe ser mayor a 0 y el stock no puede ser negativo', 'error');
      return;
    }
    if (!imageFile && formData.foto && !/^https:\/\//.test(formData.foto) && !formData.foto.startsWith('data:image/')) {
      Swal.fire('Enlace inválido', 'El enlace de la imagen debe empezar con https://', 'error');
      return;
    }
    try {
      await onSave(formData, imageFile);
    } catch {
      // El error ya se mostró en ProductContext; dejamos el formulario abierto
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-extrabold mb-4 text-orange-700 border-b-2 border-orange-200 pb-2">
          {initialData ? 'Editar producto' : 'Nuevo producto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Nombre *</label>
            <input name="nombre" value={formData.nombre} onChange={cambiar} className={inputClase}
              placeholder="Ej. Chalina tejida a crochet" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Descripción *</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={cambiar} rows="3"
              className={`${inputClase} resize-none`} placeholder="Materiales, medidas, cuidados..." required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-stone-700 mb-1">Categoría *</label>
              <select name="categoria" value={formData.categoria} onChange={cambiar} className={inputClase}>
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Precio (S/) *</label>
              <input type="number" name="precio" step="0.10" min="0" value={formData.precio}
                onChange={cambiar} className={inputClase} placeholder="0.00" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
              <input type="number" name="stock" min="0" value={formData.stock}
                onChange={cambiar} className={inputClase} placeholder="0" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" name="destacado" checked={formData.destacado} onChange={cambiar}
              className="w-4 h-4 accent-orange-700" />
            Mostrar en "Destacados" de la página de inicio
          </label>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Foto del producto</label>
            {uploadsEnabled ? (
              <>
                <input type="file" accept="image/*" onChange={handleFileChange}
                  className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer" />
                <p className="text-xs text-stone-400 mt-1">O pega el enlace de una imagen:</p>
              </>
            ) : (
              <p className="text-xs text-stone-400">Pega el enlace (https://...) de la imagen:</p>
            )}
            <input name="foto" value={imageFile ? '' : formData.foto} disabled={Boolean(imageFile)}
              onChange={(e) => { cambiar(e); setImagePreview(e.target.value); }}
              className={`${inputClase} mt-1 text-sm`} placeholder="https://..." />
            <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border border-stone-200">
              <ProductImage producto={{ ...formData, foto: imagePreview }} className="w-full h-full" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button type="button" onClick={onClose} disabled={isUploading}
              className="px-5 py-2.5 bg-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-300 transition disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={isUploading}
              className="px-5 py-2.5 bg-orange-700 text-white font-medium rounded-xl hover:bg-orange-800 transition disabled:opacity-50 flex items-center gap-2">
              {isUploading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {isUploading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
