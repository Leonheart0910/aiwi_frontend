import { useState, useEffect } from "react";
import { useCart } from "@/cart/cartContext";
import { PlusIcon, FolderIcon, TrashIcon } from "@/components/icons";
import { CreateCartModal } from "./CreateCartModal";
import { useNavigate } from "react-router-dom";

export function CartSection() {
  const navigate = useNavigate();
  const { carts, createCart, loadCarts, deleteCart } = useCart();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ✅ 컴포넌트 마운트 시 장바구니 목록 로드
  useEffect(() => {
    loadCarts();
  }, [loadCarts]);

  // ✅ 장바구니 생성
  const handleCreateCart = async (name) => {
    try {
      await createCart(name);
    } catch (error) {
      console.error("장바구니 생성 실패:", error);
    }
  };

  // ✅ 장바구니 삭제
  const handleDeleteCart = async (e, cartId) => {
    e.stopPropagation(); // 버튼 클릭 이벤트가 상위로 전파되는 것을 방지
    if (window.confirm("정말로 이 장바구니를 삭제하시겠습니까?")) {
      try {
        await deleteCart(cartId);
      } catch (error) {
        console.error("장바구니 삭제 실패:", error);
      }
    }
    loadCarts();
  };

  return (
    <>
      <div className="mt-4 px-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium text-gray-500 px-2">장바구니</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <PlusIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="space-y-1">
          {carts.map((cart) => (
            <button
              key={cart.collection_id}
              onClick={() => {
                navigate(`/cart/${cart.collection_id}`);
              }}
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 group"
            >
              <div className="flex items-center gap-2">
                <FolderIcon className="h-4 w-4 text-gray-500" />
                <span>{cart.collection_title}</span>
              </div>
              <div
                onClick={(e) => handleDeleteCart(e, cart.collection_id)}
                className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <TrashIcon className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <CreateCartModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCart}
      />
    </>
  );
}
