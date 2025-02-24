import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  cart: string[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<string[]>([]);

  const addToCart = (id: string) => {
    setCart(prevCart => [...prevCart, id]);
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
