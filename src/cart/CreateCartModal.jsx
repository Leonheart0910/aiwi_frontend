import { useState } from "react";

export function CreateCartModal({ isOpen, onClose, onCreate }) {
  const [cartName, setCartName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartName.trim()) {
      onCreate(cartName.trim());
      setCartName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">새 장바구니 만들기</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={cartName}
            onChange={(e) => setCartName(e.target.value)}
            placeholder="장바구니 이름을 입력하세요"
            className="w-full p-2 border rounded-md mb-4"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
