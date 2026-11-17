import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Si no hay claves en el .env, la app funciona en modo demo (sin Firebase).
export const firebaseEnabled = Boolean(firebaseConfig.apiKey);

// Cloud Storage necesita el plan Blaze. Actívalo solo si tu proyecto lo tiene.
const storageEnabled = firebaseEnabled && import.meta.env.VITE_USE_STORAGE === "true";

// Se pueden subir fotos en modo demo (se guardan en el navegador) o con Storage activo.
// Si no, el admin pega el enlace de la imagen.
export const uploadsEnabled = !firebaseEnabled || storageEnabled;

const app = firebaseEnabled ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;
export const db = app ? getFirestore(app) : null;
export const storage = storageEnabled ? getStorage(app) : null;
