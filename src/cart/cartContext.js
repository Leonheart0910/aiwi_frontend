import { createContext, useContext } from "react";

// Context 정의
export const CartContext = createContext();

// Context 소비 훅
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
