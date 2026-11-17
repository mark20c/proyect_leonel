import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("manualidades_carrito");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("manualidades_carrito", JSON.stringify(cart));
  }, [cart]);

  // Si el producto ya está en el carrito, SUMA la cantidad (sin pasar el stock)
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const max = product.stock ?? Infinity;
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, max) }
            : item
        );
      }
      return [...prev, { ...product, quantity: Math.min(quantity, max) }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const max = item.stock ?? Infinity;
          return { ...item, quantity: Math.min(Math.max(quantity, 0), max) };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + Number(item.precio) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};
