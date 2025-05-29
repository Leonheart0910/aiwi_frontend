import { useState } from "react";
import { useCart } from "@/cart/cartContext";
import { PlusIcon, FolderIcon } from "@/components/icons";
import { CreateCartModal } from "./CreateCartModal";

export function CartSection() {
  const { carts, createCart } = useCart();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateCart = async (name) => {
    try {
      await createCart(name);
    } catch (error) {
      console.error("장바구니 생성 실패:", error);
    }
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
            <a
              key={cart.id}
              href="#"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
            >
              <FolderIcon className="h-4 w-4 text-gray-500" />
              <span>{cart.name}</span>
            </a>
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
