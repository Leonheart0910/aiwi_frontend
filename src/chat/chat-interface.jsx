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
import { useChat } from "@/chat/chatContext";
import { TypingText } from "@/components/typing-text";

// 채팅 인터페이스 컴포넌트
export function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentChatId, chatLogs, saveChatLog, startNewChat } = useChat();

  // 현재 채팅의 메시지 로드
  useEffect(() => {
    if (currentChatId) {
      const currentChat = chatLogs.find((chat) => chat.id === currentChatId);
      if (currentChat) {
        setMessages(currentChat.messages);
      } else {
        setMessages([]);
      }
    }
  }, [currentChatId, chatLogs]);

  // 메시지 전송 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (!input.trim()) return;

    // 현재 채팅이 없으면 새 채팅 시작
    if (!currentChatId) {
      startNewChat();
    }

    const newMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // 채팅 로그 저장
    if (currentChatId) {
      saveChatLog(currentChatId, updatedMessages);
    }

    // 봇 응답 추가
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "안녕하세요. 무엇을 도와드릴까요?",
        timestamp: new Date().toISOString(),
        isTyping: true,
      };

      const messagesWithBotResponse = [...updatedMessages, botMessage];
      setMessages(messagesWithBotResponse);

      // 봇 응답도 채팅 로그에 저장
      if (currentChatId) {
        saveChatLog(currentChatId, messagesWithBotResponse);
      }
    }, 500);
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 메시지 영역 */}
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
                  {message.role === "assistant" && message.isTyping ? (
                    <TypingText
                      text={message.content}
                      onComplete={() => {
                        setMessages((prevMessages) =>
                          prevMessages.map((msg) =>
                            msg.id === message.id
                              ? { ...msg, isTyping: false }
                              : msg
                          )
                        );
                        setIsLoading(false);
                      }}
                    />
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {/* 로딩 스피너 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            {/* 메시지 끝 참조 */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative"
        >
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
            {/* 음성 버튼 */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500 h-8 w-8"
            >
              <MicIcon className="h-4 w-4" />
            </Button>
            {/* 입력 필드 */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요"
              className="flex-1 px-4 py-2 focus:outline-none"
            />
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
        </form>
      </div>
    </div>
  );
}
