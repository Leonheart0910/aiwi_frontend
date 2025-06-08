import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { ChatInterface } from "@/chat/chat-interface";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/button";
import { useChat } from "@/chat/chatContext";
import {
  MenuIcon,
  PenIcon,
  ChevronDownIcon,
  ShareIcon,
  MoreVerticalIcon,
} from "@/components/icons";
import { CreateCartModal } from "@/cart/CreateCartModal";
import { useCart } from "@/cart/cartContext";

// Home 컴포넌트
export default function Home({ onNavigate }) {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userMenuRef = useRef(null);

  // 장바구니 관련 모달
  const { createCart, isCreateModalOpen, setIsCreateModalOpen } = useCart();

  // 새 채팅 시작
  const { chatLogs, startNewChat } = useChat();
  const messagesEndRef = useRef();

  // ✅ 사용자 메뉴 외부 클릭 이벤트 처리
  useEffect(() => {
    // 브라우저 어디를 클릭하든 호출되는 핸들러
    // 클릭한 곳이 userMenu 내부인지 확인하고 외부를 클릭했을 경우 메뉴 닫기
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    // 핸들러 등록
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // 컴포넌트가 언마운트될 때 핸들러 제거
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ 인증 체크
  useEffect(() => {
    // 개발 환경에서는 로그인 상태를 true로 설정
    const isAuthenticated = import.meta.env.DEV ? true : false;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ PenIcon 클릭 핸들러: 메시지가 있으면 새 채팅 시작
  const handlePenClick = async () => {
    if (chatLogs.length > 0) {
      await startNewChat({ shouldNavigate: false });
    }
    navigate("/"); // 수동으로 홈으로만 이동
  };

  // ✅ 장바구니 생성
  const handleCreateCart = async (name) => {
    try {
      await createCart(name);
    } catch (error) {
      console.error("장바구니 생성 실패:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
    fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200
    transform transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <Sidebar onNavigate={onNavigate} />
      </aside>

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      {/* Chat area */}
      <div
        className={`
    flex-1 flex flex-col overflow-hidden transition-all duration-300
    ${isSidebarOpen ? "md:ml-64" : "md:ml-0"}
  `}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between p-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {/* Menu toggle only on small screens */}
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
                onClick={handlePenClick}
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
          {/* Chat area */}
          <ChatInterface endRef={messagesEndRef} />
        </div>
      </div>
      <CreateCartModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCart}
      />
    </div>
  );
}
