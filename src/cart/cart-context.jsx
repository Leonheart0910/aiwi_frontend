import { useState, useCallback, useEffect } from "react";
import { CartContext } from "./cartContext";

// 장바구니 컨텍스트 프로바이더
export function CartProvider({ children }) {
  const [carts, setCarts] = useState([]);
  const [currentCartId, setCurrentCartId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 장바구니 목록 불러오기
  const loadCarts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/carts");
      if (!response.ok) {
        throw new Error("장바구니 목록을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      setCarts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 새 장바구니 생성
  const createCart = useCallback(async (name) => {
    try {
      setIsLoading(true);
      setError(null);

      // 백엔드에 장바구니 생성 요청
      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("장바구니를 생성하는데 실패했습니다.");
      }

      const newCart = await response.json();
      setCarts((prev) => [...prev, newCart]);
      setCurrentCartId(newCart.id);
      return newCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 장바구니 불러오기
  const loadCart = useCallback(async (cartId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/carts/${cartId}`);
      if (!response.ok) {
        throw new Error("장바구니를 불러오는데 실패했습니다.");
      }

      const cart = await response.json();
      setCurrentCartId(cartId);
      return cart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 장바구니에 상품 추가
  const addToCart = useCallback(async (cartId, product) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/carts/${cartId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("상품을 장바구니에 추가하는데 실패했습니다.");
      }

      const updatedCart = await response.json();
      setCarts((prev) =>
        prev.map((cart) => (cart.id === cartId ? updatedCart : cart))
      );
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback(async (cartId, itemId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/carts/${cartId}/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("상품을 장바구니에서 제거하는데 실패했습니다.");
      }

      const updatedCart = await response.json();
      setCarts((prev) =>
        prev.map((cart) => (cart.id === cartId ? updatedCart : cart))
      );
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 장바구니 삭제
  const deleteCart = useCallback(
    async (cartId) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/carts/${cartId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("장바구니를 삭제하는데 실패했습니다.");
        }

        setCarts((prev) => prev.filter((cart) => cart.id !== cartId));
        if (currentCartId === cartId) {
          setCurrentCartId(null);
        }
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentCartId]
  );

  // 컴포넌트 마운트 시 장바구니 목록 로드
  useEffect(() => {
    loadCarts();
  }, [loadCarts]);

  return (
    <CartContext.Provider
      value={{
        carts,
        currentCartId,
        isLoading,
        error,
        createCart,
        loadCart,
        addToCart,
        removeFromCart,
        deleteCart,
        loadCarts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
