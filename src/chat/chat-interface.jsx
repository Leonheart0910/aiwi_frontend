import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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
import { CartSelectModal } from "@/cart/CartSelectModal";
import { useCart } from "@/cart/cartContext";

export function ChatInterface({ endRef }) {
  const [input, setInput] = useState(""); // 입력 상태
  const messagesEndRef = useRef(null); // 메시지 끝 참조
  const {
    currentChatId,
    chatLogs,
    loadChatLogs,
    startNewChat,
    sendMessage,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
  } = useChat();

  const { addToCart } = useCart();
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleAddButtonClick = (product) => {
    setSelectedProduct(product);
    setShowCartModal(true);
  };
  const handleSelectCart = async (cartId) => {
    if (!selectedProduct) return;
    try {
      await addToCart(cartId, selectedProduct);
      alert("장바구니에 추가되었습니다!");
    } catch (err) {
      alert(err.message || "추가 실패");
    } finally {
      setSelectedProduct(null);
    }
  };

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

  // ✅ currentChatId 변경 시 messages 상태 세팅
  // useEffect(() => {
  //   if (currentChatId) {
  //     loadChat(currentChatId);
  //   }
  // }, [currentChatId, loadChat]);

  // ✅ messages가 바뀔 때 항상 하단으로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  // ✅ 메시지 전송 핸들러
  const handleSendMessage = async () => {
    // (0) 메시지가 없으면 반환
    if (!input.trim()) return;
    // (1) 현재 채팅이 없으면 새로 생성
    if (!currentChatId) {
      await startNewChat();
    }
    // (2) 메세지 응답
    try {
      await sendMessage(input);
      setInput("");
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
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
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
                      }}
                    />
                  ) : message.isStructured ? (
                    <div className="space-y-4">
                      {Object.keys(message.productsByRank)
                        .sort((a, b) => a - b)
                        .map((rankKey) => {
                          const rank = Number(rankKey);
                          const prods = message.productsByRank[rank];
                          const recText = message.recommendByRank[rank];

                          return (
                            <div key={`rank-row-${rank}`} className="space-y-1">
                              <div className="grid grid-cols-3 gap-2">
                                {prods.map((prod) => (
                                  <div
                                    key={prod.product_id}
                                    className="flex flex-col items-center border p-2 rounded-md hover:shadow-sm w-full"
                                  >
                                    <a
                                      href={prod.product_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex flex-col items-center w-full"
                                    >
                                      <img
                                        src={prod.image.image_url}
                                        alt={prod.product_name}
                                        className="w-16 h-16 object-cover mb-1"
                                      />
                                    </a>
                                    <span className="text-sm font-medium w-full text-center break-words">
                                      {prod.product_name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {prod.product_price}
                                    </span>
                                    <button
                                      onClick={() => handleAddButtonClick(prod)}
                                      className="mt-1 text-xs text-blue-600 hover:underline"
                                    >
                                      장바구니에 담기
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="text-sm text-black prose max-w-full">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeRaw]}
                                  components={{
                                    h1: ({ children }) => (
                                      <h1 className="text-2xl font-bold text-blue-700 mt-4 mb-2">
                                        {children}
                                      </h1>
                                    ),
                                    h2: ({ children }) => (
                                      <h2 className="text-xl font-bold text-blue-600 mt-3 mb-2">
                                        {children}
                                      </h2>
                                    ),
                                    h3: ({ children }) => (
                                      <h3 className="text-lg font-semibold text-blue-500 mt-2 mb-1">
                                        {children}
                                      </h3>
                                    ),
                                  }}
                                >
                                  {recText}
                                </ReactMarkdown>
                              </div>
                            </div>
                          );
                        })}
                    </div>
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
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
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
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500"
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
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
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500 h-8 w-8"
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500 h-8 w-8"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500 h-8 w-8"
            >
              <MicIcon className="h-4 w-4" />
            </Button>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요"
              className="flex-1 px-4 py-2 focus:outline-none"
            />
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

      <CartSelectModal
        isOpen={showCartModal}
        onClose={() => {
          setShowCartModal(false);
          setSelectedProduct(null);
        }}
        onSelect={handleSelectCart}
      />
    </div>
  );
}
