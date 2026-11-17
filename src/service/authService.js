import { auth, googleProvider } from "../config/firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";

export const loginWithGoogle = async () => {
  if (!auth) throw new Error("Firebase no está configurado. Usa el modo demo o completa el archivo .env");
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logoutFirebase = async () => {
  if (auth) await signOut(auth);
};
