import { useState, useCallback } from "react";
import { CartContext } from "./cartContext";

export function CartProvider({ children }) {
  const [carts, setCarts] = useState([]); // 장바구니 목록
  const [cartItems, setCartItems] = useState([]); // 특정 장바구니 내 아이템 목록
  const [currentCartId, setCurrentCartId] = useState(null); // 현재 선택된 장바구니 ID
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ✅ 장바구니 목록 불러오기
  const loadCarts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const user_id = parseInt(localStorage.getItem("user_id"));
      const base = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${base}/api/v1/collection/list/${user_id}`);
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

  // ✅ 새 장바구니 생성 /api/v1/collection/create
  const createCart = useCallback(async (name) => {
    try {
      setIsLoading(true);
      setError(null);

      // 백엔드에 장바구니 생성 요청
      const user_id = parseInt(localStorage.getItem("user_id"));
      const base = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${base}/api/v1/collection/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user_id, collection_title: name }),
      });
      const data = await response.json();

      const newCart = {
        collection_id: data.collection_id,
        collection_title: data.collection_title,
      };
      setCarts((prev) => [...prev, newCart]);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ 장바구니 불러오기 /api/v1/collection/:collection_id
  const loadCart = useCallback(async (collection_id) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentCartId(collection_id);

      const base = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(
        `${base}/api/v1/collection/${collection_id}`
      );
      if (!response.ok) {
        throw new Error("장바구니를 불러오는데 실패했습니다.");
      }
      const cart = await response.json();
      setCartItems(cart.items);

      return cart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ 장바구니에 상품 추가
  const addToCart = useCallback(async (cartId, product) => {
    try {
      setIsLoading(true);
      setError(null);

      const user_id = parseInt(localStorage.getItem("user_id"));
      const base = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${base}/api/v1/collection/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          collection_id: cartId,
          product_id: product.product_id,
        }),
      });
      if (!response.ok) {
        throw new Error("상품을 장바구니에 추가하는데 실패했습니다.");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ 장바구니에서 상품 제거
  const removeFromCart = useCallback(async (collectionId, itemId) => {
    try {
      setIsLoading(true);
      setError(null);

      const base = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(
        `${base}/api/v1/collection/${collectionId}/${itemId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("상품 제거 실패");
      }
      // 성공 시 로컬 상태 갱신 (loadCart로 재로드 또는 수동 제거)
      const updated = await response.json();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ 장바구니 삭제
  const deleteCart = useCallback(
    async (cartId) => {
      try {
        setIsLoading(true);
        setError(null);

        const base = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${base}/api/v1/collection/${cartId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("장바구니를 삭제하는데 실패했습니다.");
        }

        setCarts((prev) =>
          prev.filter((cart) => cart.collection_id !== cartId)
        );
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

  return (
    <CartContext.Provider
      value={{
        carts,
        cartItems,
        currentCartId,
        isLoading,
        error,
        createCart,
        loadCart,
        addToCart,
        removeFromCart,
        deleteCart,
        loadCarts,
        isCreateModalOpen,
        setIsCreateModalOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
