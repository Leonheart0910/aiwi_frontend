import { useCart } from "@/cart/cartContext";

export function CartSelectModal({ isOpen, onClose, onSelect }) {
  const { carts } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 space-y-4">
        <h2 className="text-lg font-semibold">장바구니 선택</h2>
        {carts.map((cart) => (
          <button
            key={cart.collection_id}
            onClick={() => {
              onSelect(cart.collection_id);
              onClose();
            }}
            className="w-full p-2 border rounded-md hover:bg-gray-100 text-left"
          >
            {cart.collection_title}
          </button>
        ))}
        <button
          onClick={onClose}
          className="w-full p-2 text-sm text-gray-500 hover:underline"
        >
          취소
        </button>
      </div>
    </div>
  );
}
