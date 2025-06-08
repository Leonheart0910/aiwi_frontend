import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "@/cart/cartContext";
import { Button } from "@/components/button";
import {
  FolderIcon,
  PenIcon,
  ChevronDownIcon,
  ShareIcon,
  MoreVerticalIcon,
} from "@/components/icons";
import { UserMenu } from "@/app/user-menu";
import { useChat } from "@/chat/chatContext";

export default function CartDetail({ onNavigate }) {
  const { collection_id } = useParams();
  const { loadCart, removeFromCart } = useCart();
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { setMessages, setCurrentChatId } = useChat();

  // ✅ 사용자 메뉴 외부 클릭 이벤트 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ 장바구니 불러오기
  const fetchCart = useCallback(async () => {
    try {
      const result = await loadCart(collection_id);
      setCart(result);
    } catch (err) {
      setError(err.message || "장바구니를 불러올 수 없습니다.");
    }
  }, [collection_id, loadCart]);

  // ✅ 장바구니 불러오기
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ✅ 장바구니에서 상품 제거
  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(collection_id, itemId);
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.item_id !== itemId),
      }));
    } catch (err) {
      alert(err.message || "상품 제거에 실패했습니다.");
    }
  };

  const clickPenIcon = () => {
    setMessages([]);
    setCurrentChatId(null);
    onNavigate("/");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 bg-white">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="flex items-center justify-center p-6 bg-white">
        <p className="text-gray-500">장바구니를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={clickPenIcon}
          >
            <PenIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center">
          <h1 className="text-lg sm:text-xl font-medium">쇼핑 챗봇</h1>
          <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-600" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <ShareIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <MoreVerticalIcon className="h-5 w-5" />
          </Button>
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full bg-red-500 text-white p-0"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <span className="text-xs font-bold">Plus</span>
            </Button>
            {isUserMenuOpen && <UserMenu />}
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FolderIcon className="w-6 h-6 text-gray-500" />
            <h2 className="text-xl font-semibold">{cart.collection_title}</h2>
          </div>
          <Button variant="outline" size="sm" onClick={clickPenIcon}>
            홈으로
          </Button>
        </div>

        {cart.items?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto">
            {cart.items.map((item) => (
              <div
                key={item.item_id}
                className="border rounded-lg p-4 flex flex-col gap-2 bg-white"
              >
                <a
                  href={item.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center"
                >
                  <img
                    src={item.image?.image_url || "/placeholder.svg"}
                    alt={item.product_name.split("<b>")[0].trim()}
                    className="w-full aspect-square object-contain rounded-md hover:opacity-90 transition-opacity"
                  />
                </a>
                <p className="text-sm text-gray-500">
                  {item.product_name.split("<b>")[0].trim()}
                </p>
                <a
                  href={item.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline break-words"
                >
                  링크 보기
                </a>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full mt-auto"
                  onClick={() => handleRemove(item.item_id)}
                >
                  제거
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center text-center text-gray-500 text-sm">
            이 장바구니에 담긴 상품이 없습니다.
          </div>
        )}
      </main>
    </div>
  );
}
