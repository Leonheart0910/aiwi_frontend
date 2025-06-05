import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

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
export function ChatInterface({ endRef }) {
  const { chatId } = useParams(); // URL에서 :chatId 추출
  const [input, setInput] = useState(""); // 입력 상태
  const [messages, setMessages] = useState([]); // 메시지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const messagesEndRef = useRef(null); // 메시지 끝 참조
  // 현재 채팅 hash 값, 채팅 목록 리스트, 채팅 로딩 함수, 채팅 로그 저장 함수, 새 채팅 시작 함수, 메시지 전송 함수
  const {
    currentChatId,
    chatLogs,
    loadChat,
    saveChatLog,
    startNewChat,
    // sendMessage,
  } = useChat();

  // ✅ chatId 기반 loadChat 실행
  useEffect(() => {
    if (chatId && chatId !== currentChatId) {
      loadChat(chatId);
    }
  }, [chatId, currentChatId, loadChat]);

  // ✅ 현재 채팅의 메시지 로드, currentChatId가 바뀔 때 메시지 불러오기
  useEffect(() => {
    if (currentChatId) {
      const currentChat = chatLogs.find(
        (chat) => chat.chat_id === currentChatId
      );
      if (currentChat) {
        setMessages(currentChat.messages);
      } else {
        setMessages([]);
      }
    }
  }, [currentChatId, chatLogs]);

  // ✅ 메시지 전송 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 현재 채팅이 없으면 메시지 목록 초기화
  useEffect(() => {
    if (!currentChatId) {
      setMessages([]);
    }
  }, [currentChatId]);

  // ✅ 메시지 전송
  const handleSendMessage = async () => {
    // 메시지가 없으면 리턴
    if (!input.trim()) return;

    // 현재 채팅이 없으면 새 채팅 시작
    let chatId = currentChatId;
    if (!chatId) {
      chatId = await startNewChat();
    }

    // 새 메시지 생성
    const newMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    // 메시지 목록에 추가
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // 채팅 로그 저장
    if (chatId) {
      saveChatLog(chatId, updatedMessages);
    }

    // 챗봇 응답 요청
    try {
      // const botResponse = await sendMessage(chatId, input);
      const botResponse = {
        chat_id: 4,
        title: "채팅방 타이틀", // 첫 사용자 input 값
        chat_log: [
          {
            chat_log_id: 10,
            user_input: "유저의 입력값",
            keyword_text: "3개의 키워드에 대한 응답값",
            seo_keyword_text: "seo키워드에 대한 응답값",
            products: [
              {
                product_id: 123,
                product_name: "상품 이름",
                product_link: "상품의 링크",
                product_price: "상품의 가격",
                rank: 1,
                image: {
                  image_id: 32,
                  image_url: "이미지 url",
                  created_at: "생성시간",
                  updated_at: "업데이트시간",
                },
                created_at: "생성시간",
                updated_at: "업데이트시간",
              },
              {
                product_id: 123,
                product_name: "상품 이름",
                product_link: "상품의 링크",
                product_price: "상품의 가격",
                rank: 1,
                image: {
                  image_id: 32,
                  image_url: "이미지 url",
                  created_at: "생성시간",
                  updated_at: "업데이트시간",
                },
                created_at: "생성시간",
                updated_at: "업데이트시간",
              },
              {
                product_id: 123,
                product_name: "상품 이름",
                product_link: "상품의 링크",
                product_price: "상품의 가격",
                rank: 1,
                image: {
                  image_id: 32,
                  image_url: "이미지 url",
                  created_at: "생성시간",
                  updated_at: "업데이트시간",
                },
                created_at: "생성시간",
                updated_at: "업데이트시간",
              },
            ],
            recommend: [
              {
                recommend_id: 1,
                recommend_text: "추천하는 상품은...",
                rank: 1,
              },
              {
                recommend_id: 2,
                recommend_text: "추천하는 상품은...",
                rank: 2,
              },
              {
                recommend_id: 3,
                recommend_text: "추천하는 상품은...",
                rank: 3,
              },
            ],
            created_at: "로그 생성 시간",
            updated_at: "로그 수정 시간",
          },
        ],
        created_at: "채팅 생성 시간",
        updated_at: "채팅 수정 시간",
      };

      const botMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: botResponse.message,
        timestamp: new Date().toISOString(),
        isTyping: true,
      };

      const messagesWithBotResponse = [...updatedMessages, botMessage];
      setMessages(messagesWithBotResponse);

      // 봇 응답도 채팅 로그에 저장
      if (chatId) {
        saveChatLog(chatId, messagesWithBotResponse);
      }
    } catch (error) {
      console.error("챗봇 응답 에러:", error);
      setIsLoading(false);
    }
  };

  // ✅ Enter 키로 메시지 전송
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
              오늘은 어떤 상품을 찾고 계신가요?
            </h2>
            <div className="grid grid-cols-2 gap-2 max-w-md">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <span className="text-sm font-medium">패션 상품 추천</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <span className="text-sm font-medium">가전 제품 찾기</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <span className="text-sm font-medium">식품 장바구니</span>
              </Button>
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
            <div ref={endRef ?? messagesEndRef} />
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
            <Input
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
