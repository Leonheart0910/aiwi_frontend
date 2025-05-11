import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import {
  PlusIcon,
  GlobeIcon,
  PaperclipIcon,
  MicIcon,
  ImageIcon,
  SendIcon,
} from "@/components/icons";

// 채팅 인터페이스 컴포넌트
export function ChatInterface() {
  // 메시지 상태
  const [messages, setMessages] = useState([]);
  // 입력 상태
  const [input, setInput] = useState("");
  // 메시지 끝 참조
  const messagesEndRef = useRef(null);

  // 메시지 끝으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 메시지 변경 시 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // 메시지 배열에 사용자 메시지 추가
    setMessages((prev) => [...prev, userMessage]);
    // 입력 상태 초기화
    setInput("");

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      // 봇 메시지 생성
      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "안녕하세요! 오늘은 어떤 상품을 찾고 계신가요?",
        timestamp: new Date(),
      };
      // 메시지 배열에 봇 메시지 추가
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 채팅 메시지 */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* 메시지가 없을 경우 */}
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-semibold mb-6">
              오늘은 무슨 쇼핑을 하고 계신가요?
            </h2>
            <div className="grid grid-cols-2 gap-2 max-w-md">
              {/* 패션 상품 추천 버튼 */}
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <span className="text-sm font-medium">패션 상품 추천</span>
              </Button>
              {/* 가전 제품 찾기 버튼 */}
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <span className="text-sm font-medium">가전 제품 찾기</span>
              </Button>
              {/* 식품 장바구니 버튼 */}
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <span className="text-sm font-medium">식품 장바구니</span>
              </Button>
              {/* 할인 상품 보기 버튼 */}
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <span className="text-sm font-medium">할인 상품 보기</span>
              </Button>
            </div>
          </div>
        ) : (
          // 메시지가 있을 경우
          <div className="space-y-6">
            {/* 메시지 목록 */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* 메시지 컨테이너 */}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-gray-100"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            {/* 메시지 끝 참조 */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="relative">
          {/* 입력 컨테이너 */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
            {/* 플러스 버튼 */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500"
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
            {/* 검색 버튼 */}
            <div className="flex items-center gap-1 px-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-500 h-8 w-8"
              >
                <GlobeIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">검색</span>
            </div>
            {/* 선 */}
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            {/* 클립 버튼 */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500 h-8 w-8"
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            {/* 이미지 버튼 */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500 h-8 w-8"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            {/* 입력 필드 */}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="무엇이든 물어보세요"
              className="flex-1 border-0 focus:ring-0 focus:outline-none"
            />
            {/* 마이크 버튼 */}
            <div className="flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-500 h-8 w-8"
              >
                <MicIcon className="h-4 w-4" />
              </Button>
              {/* 전송 버튼 */}
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="text-gray-500 h-8 w-8"
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
