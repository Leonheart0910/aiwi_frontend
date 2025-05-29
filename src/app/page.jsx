import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { ChatInterface } from "@/chat/chat-interface";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/button";
import { useChat } from "@/chat/chatContext";
import { ChatProvider } from "@/chat/chat-context";
import {
  MenuIcon,
  PenIcon,
  ChevronDownIcon,
  ShareIcon,
  MoreVerticalIcon,
} from "@/components/icons";

// Home 컴포넌트
export default function Home() {
  // 네비게이션 이동
  const navigate = useNavigate();
  // 사용자 메뉴 열림 상태
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // 사이드바 열림 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // 사용자 메뉴 참조
  const userMenuRef = useRef(null);

  // 새 채팅 시작
  const { hash } = useParams();
  const { chatLogs, loadChat, startNewChat } = useChat();
  const messagesEndRef = useRef();

  // URL 에 hash 가 있으면 loadChat
  useEffect(() => {
    if (hash) {
      loadChat(hash);
    }
  }, [hash, loadChat]);

  // 사용자 메뉴 외부 클릭 이벤트 처리
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

  // 인증 체크
  useEffect(() => {
    // 개발 환경에서는 로그인 상태를 true로 설정
    const isAuthenticated = import.meta.env.DEV ? true : false;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  // PenIcon 클릭 핸들러: 메시지가 있으면 새 채팅 시작
  const handlePenClick = async () => {
    const current = chatLogs.find((c) => c.chat_id === hash);
    const hasMessages = current?.messages?.length > 0;
    // console.log(hash);
    if (hasMessages) {
      await startNewChat(); // 내부에서 navigate 수행
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* 사이드바 */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200`}
      >
        <div className="w-64">
          <Sidebar />
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
              onClick={handlePenClick}
            >
              <PenIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center">
            {/* 헤더 타이틀 */}
            <h1 className="text-lg font-medium">쇼핑 챗봇</h1>
            {/* 헤더 타이틀 드롭다운 아이콘 */}
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

        {/* 채팅 영역 */}
        <ChatInterface endRef={messagesEndRef} />
      </main>
    </div>
  );
}
