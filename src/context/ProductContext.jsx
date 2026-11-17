import React, { createContext, useState, useEffect } from "react";
import * as productService from "../service/productService";
import { uploadFile } from "../service/uploadService";
import Swal from "sweetalert2";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // La imagen se sube UNA sola vez, aquí (el formulario solo entrega el archivo)
  const saveProduct = async (id, productData, imageFile) => {
    setUploading(true);
    try {
      let foto = productData.foto || "";
      if (imageFile) foto = await uploadFile(imageFile);

      const datos = { ...productData, foto };
      if (id) {
        const updated = await productService.updateProduct(id, datos);
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        Swal.fire("¡Listo!", "Producto actualizado", "success");
        return updated;
      }
      const created = await productService.createProduct(datos);
      setProducts((prev) => [...prev, created]);
      Swal.fire("¡Listo!", "Producto agregado", "success");
      return created;
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      Swal.fire("Error", error.message || "No se pudo guardar el producto", "error");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const addProduct = (productData, imageFile) => saveProduct(null, productData, imageFile);
  const editProduct = (id, productData, imageFile) => saveProduct(id, productData, imageFile);

  const deleteProduct = async (id, nombre = "este producto") => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: `Se eliminará "${nombre}". No podrás deshacerlo.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2410c",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      Swal.fire({ icon: "success", title: "Producto eliminado", timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      Swal.fire("Error", error.message || "No se pudo eliminar el producto", "error");
    }
  };

  return (
    <ProductContext.Provider
      value={{ products, loading, uploading, loadProducts, addProduct, editProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};
