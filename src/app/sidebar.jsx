import {
  FolderIcon,
  ShoppingCartIcon,
  ClockIcon,
  ExternalLinkIcon,
  PlusIcon,
} from "@/components/icons";
import { useChat } from "@/chat/chatContext";
import { CartProvider } from "@/cart/cart-context";
import { useCart } from "@/cart/cartContext";
import recommendationBook from "@/assets/recommendation_book.png";
import { useState, useEffect } from "react";

// 장바구니 생성 모달 컴포넌트
function CreateCartModal({ isOpen, onClose, onCreate }) {
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

// 장바구니 섹션 컴포넌트
function CartSection() {
  const { carts, createCart } = useCart();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 장바구니 생성
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

// 사이드바 컴포넌트
export function Sidebar() {
  const { chatLogs, loadChat, currentChatId, loadChatLogs } = useChat();

  // 컴포넌트 마운트 시 채팅 로그 불러오기
  useEffect(() => {
    loadChatLogs();
  }, [loadChatLogs]);

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log("chatLogs:", chatLogs);
  }, [chatLogs]);

  // 채팅 로그를 날짜별로 그룹화
  const groupedChats = chatLogs.reduce((groups, chat) => {
    const date = new Date(chat.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let group;
    if (date.toDateString() === today.toDateString()) {
      group = "오늘";
    } else if (date.toDateString() === yesterday.toDateString()) {
      group = "어제";
    } else {
      group = "이전 기록";
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(chat);
    return groups;
  }, {});

  return (
    <aside className="w-64 border-r border-gray-200 flex flex-col h-full bg-white">
      {/* 광고 사이트 링크 */}
      <div className="p-3 space-y-2">
        {/* 쿠팡 링크 */}
        <a
          href="https://www.coupang.com"
          target="_blank"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <ShoppingCartIcon className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex-1">
            <span className="font-medium">쿠팡</span>
          </div>
        </a>
        {/* 무신사 링크 */}
        <a
          href="https://www.musinsa.com"
          target="_blank"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
            <ExternalLinkIcon className="h-4 w-4 text-purple-500" />
          </div>
          <div className="flex-1">
            <span className="font-medium">무신사</span>
          </div>
        </a>
        {/* 추천 상품  */}
        <div className="mt-auto p-3 border-y">
          <h2 className="text-xs font-medium text-gray-500 px-2 mb-2">
            추천 상품
          </h2>
          <div className="p-2 rounded-md hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={recommendationBook}
                  alt="추천 상품"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <p className="text-xs font-medium">프리미엄 상품</p>
                <p className="text-xs text-gray-500">39,900원</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 장바구니 섹션 */}
      <CartProvider>
        <CartSection />
      </CartProvider>

      {/* 채팅 로그 (스크롤 대상용 id 추가) */}
      <div id="chat-logs-section">
        {Object.entries(groupedChats).map(([group, chats]) => (
          <div key={group} className="mt-4 px-3">
            <h2 className="text-xs font-medium text-gray-500 px-2 mb-2">
              {group}
            </h2>
            <div className="space-y-1">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-sm ${
                    chat.id === currentChatId ? "bg-gray-100" : ""
                  }`}
                >
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{chat.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
