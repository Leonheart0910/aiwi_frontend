import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "@/cart/cartContext";
import { Button } from "@/components/button";
import {
  FolderIcon,
  MenuIcon,
  PenIcon,
  ChevronDownIcon,
  ShareIcon,
  MoreVerticalIcon,
} from "@/components/icons";
import { UserMenu } from "@/app/user-menu";
import { Sidebar } from "@/app/sidebar";

export default function CartDetail({ onNavigate }) {
  const { collection_id } = useParams();
  const { loadCart, removeFromCart } = useCart();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userMenuRef = useRef(null);

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

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">{error}</div>
    );
  }

  if (!cart) {
    return (
      <div className="p-6 text-center text-gray-500">
        장바구니를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* 사이드바 */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200`}
      >
        <div className="w-64">
          <Sidebar onNavigate={onNavigate} />
        </div>
      </div>

      {/* 메인 컨테이너 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <header className="flex items-center justify-between p-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500"
              onClick={() => onNavigate("/")}
            >
              <PenIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center">
            <h1 className="text-lg font-medium">쇼핑 챗봇</h1>
            <ChevronDownIcon className="h-4 w-4 ml-1" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <ShareIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <MoreVerticalIcon className="h-5 w-5" />
            </Button>
            {/* 사용자 메뉴 */}
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full bg-red-500 text-white p-0"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span className="text-xs font-bold">Plus</span>
              </Button>
              {/* 사용자 메뉴 모달 */}
              {isUserMenuOpen && <UserMenu />}
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FolderIcon className="w-6 h-6 text-gray-500" />
              <h1 className="text-xl font-semibold">{cart.collection_title}</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate(`/`)}>
              홈으로
            </Button>
          </div>

          {cart.items?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cart.items.map((item) => (
                <div
                  key={item.item_id}
                  className="border rounded-lg p-4 flex flex-col gap-2"
                >
                  <img
                    src={item.image?.image_url || "/placeholder.svg"}
                    alt={item.product_name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <div className="text-sm text-gray-500">
                    {item.category_name}
                  </div>
                  <div className="font-medium text-base">
                    {item.product_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.product_info}
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-auto"
                    variant="destructive"
                    onClick={() => handleRemove(item.item_id)}
                  >
                    제거
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              이 장바구니에 담긴 상품이 없습니다.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
