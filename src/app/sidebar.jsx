import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FolderIcon,
  ShoppingCartIcon,
  ClockIcon,
  ExternalLinkIcon,
  PlusIcon,
} from "@/components/icons";
import { useChat } from "@/chat/chatContext";
import { CartSection } from "@/cart/CartSection";
import recommendationBook from "@/assets/recommendation_book.png";

export function Sidebar() {
  const { chatLogs, loadChat, currentChatId, loadChatLogs, messages } =
    useChat();
  const navigate = useNavigate();

  // ✅ 컴포넌트 마운트 시 채팅 로그 불러오기
  useEffect(() => {
    loadChatLogs();
  }, [loadChatLogs]);

  // ✅ 디버깅을 위한 로그
  useEffect(() => {
    console.log("chatLogs: ", chatLogs);
    console.log("currentChatId: ", currentChatId);
    console.log("messages: ", messages);
  }, [chatLogs, currentChatId, messages]);

  // ✅ 채팅 로그를 날짜별로 그룹화
  const groupedChats = chatLogs.reduce((groups, chat) => {
    const date = new Date(chat.updated_at);

    if (isNaN(date.getTime())) {
      console.warn("유효하지 않은 날짜:", chat.updated_at);
      return groups;
    }

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    let group;
    if (isSameDay(date, today)) {
      group = "오늘";
    } else if (isSameDay(date, yesterday)) {
      group = "어제";
    } else {
      group = "이전 기록";
    }

    if (!groups[group]) groups[group] = [];
    groups[group].push(chat);

    return groups;
  }, {});

  // ✅ 채팅 로그 클릭 시 채팅 로드
  const handleChatClick = (chatId) => {
    loadChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  return (
    <aside className="w-64 flex flex-col h-full bg-white">
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

      <CartSection />

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
                  key={chat.chat_id}
                  onClick={() => handleChatClick(chat.chat_id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-sm ${
                    chat.chat_id === currentChatId ? "bg-gray-100" : ""
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
