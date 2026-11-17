import { storage } from "../config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB, igual que en storage.rules

// Convierte la imagen a texto base64 (solo en modo demo, sin Firebase)
const leerComoDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const uploadFile = async (file, path = "productos/") => {
  if (!file) throw new Error("No se proporcionó un archivo para subir.");
  if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen.");
  if (file.size > MAX_BYTES) throw new Error("La imagen debe pesar menos de 2 MB.");

  if (!storage) return leerComoDataURL(file);

  const nombreSeguro = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const storageRef = ref(storage, `${path}${Date.now()}_${nombreSeguro}`);
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(snapshot.ref);
};
