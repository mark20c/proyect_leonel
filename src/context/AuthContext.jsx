import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firebaseEnabled } from "../config/firebaseConfig";
import { loginWithGoogle, logoutFirebase } from "../service/authService";
import { ADMIN_EMAILS } from "../utils/constants";

export const AuthContext = createContext();

const DEMO_KEY = "manualidades_usuario_demo";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (firebaseEnabled) return null;
    const guardado = localStorage.getItem(DEMO_KEY);
    return guardado ? JSON.parse(guardado) : null;
  });
  // Sin Firebase no hay nada que esperar, así que no empieza cargando
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) return;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Esto solo decide qué se MUESTRA. Quién puede modificar datos lo deciden
  // las reglas de firestore.rules y storage.rules, que se aplican en el servidor.
  const isAdmin = Boolean(
    user && (user.isDemo || (ADMIN_EMAILS.includes(user.email) && user.emailVerified))
  );

  const login = async () => {
    if (firebaseEnabled) return loginWithGoogle();
    // Modo demo: usuario ficticio con permisos de administrador para probar todo
    const demo = { uid: "demo", displayName: "Usuario demo", email: "demo@manoscreativas.pe", isDemo: true };
    localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
    setUser(demo);
    return demo;
  };

  const logout = async () => {
    if (firebaseEnabled) {
      await logoutFirebase();
    } else {
      localStorage.removeItem(DEMO_KEY);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout, firebaseEnabled }}>
      {children}
    </AuthContext.Provider>
  );
};
