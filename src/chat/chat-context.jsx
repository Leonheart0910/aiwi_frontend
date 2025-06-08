import { useState, useCallback } from "react";
import { ChatContext } from "./chatContext";
import { v4 as uuidv4 } from "uuid";

export function ChatProvider({ children, onNavigate }) {
  const [currentChatId, setCurrentChatId] = useState(null); // 현재 대화 중인 Chat ID
  const [chatLogs, setChatLogs] = useState([]); // 사용자의 모든 채팅 목록
  const [messages, setMessages] = useState([]); // 현재 chat의 대화 내역
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ 채팅 로그 파싱 함수
  function parseChatResponse(chatResponse, options = { typingEffect: false }) {
    // 첫 번째 메시지: user_input
    const userMessage = {
      id: uuidv4(),
      role: "user",
      content: chatResponse.user_input,
    };

    // 두 번째 메시지: keyword_text
    const botMessage1 = {
      id: uuidv4(),
      role: "assistant",
      content: chatResponse.keyword_text,
      isTyping: options.typingEffect,
    };

    // 세 번째 메시지: products + recommend
    const productsByRank =
      chatResponse.products?.reduce((acc, prod) => {
        if (!acc[prod.rank]) acc[prod.rank] = [];
        // product_name에서 <b> 태그 이전의 값만 추출
        const parsedName = prod.product_name.split("<b>")[0].trim();
        acc[prod.rank].push({
          ...prod,
          product_name: parsedName,
        });
        return acc;
      }, {}) || {};
    // rank별 recommend text를 객체 형태로 분리
    const recommendByRank =
      chatResponse.recommend?.reduce((acc, rec) => {
        acc[rec.rank] = rec.recommend_text;
        return acc;
      }, {}) || {};
    // 두 번째 메시지 객체 생성 (JSX를 content에 직접 넣어서 렌더링)
    const botMessage2 = {
      id: uuidv4(),
      role: "assistant",
      content: "",
      productsByRank,
      recommendByRank,
      isStructured: true,
    };
    // 메시지 세팅 분기
    if (!options.typingEffect) {
      setMessages((prev) => [...prev, userMessage, botMessage1, botMessage2]);
    } else {
      setMessages((prev) => [...prev, userMessage, botMessage1]);
    }
    setIsLoading(false);
    return {
      userMessage,
      botMessage1,
      botMessage2,
    };
  }

  // ✅ 새 채팅 시작
  const startNewChat = useCallback(() => {
    setCurrentChatId(null);
    setMessages([]);
  }, []);

  // ✅ 해당 채팅 로그 불러오기 /api/v1/chat/:id
  const loadChat = useCallback(
    async (hash) => {
      setIsLoading(true);
      setError(null);
      setMessages([]);
      onNavigate(`/chat/${hash}`);

      // 백엔드에서 채팅 로그 GET 요청
      const base = import.meta.env.VITE_BACKEND_URL;
      const chatRes = await fetch(`${base}/api/v1/chat/${hash}`);
      if (!chatRes.ok) throw new Error("불러오기 실패");
      const chats = await chatRes.json();

      for (const chat of chats.chat_log) {
        parseChatResponse(chat, { typingEffect: false });
      }

      setCurrentChatId(hash);
      setIsLoading(false);
    },
    [onNavigate]
  );

  // ✅ 채팅 로그 초기화
  const clearChat = useCallback(() => {
    setChatLogs([]);
    setCurrentChatId(null);
  }, []);

  // ✅ 채팅 목록 불러오기
  const loadChatLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 백엔드에서 채팅 목록 요청
      const base = import.meta.env.VITE_BACKEND_URL;
      const userId = parseInt(localStorage.getItem("user_id"));
      const response = await fetch(`${base}/api/v1/chat/user/${userId}`);
      if (!response.ok) {
        throw new Error("채팅 목록을 불러오는데 실패했습니다.");
      }
      const chats = await response.json();

      setChatLogs(
        chats.map((chat) => ({
          chat_id: chat.chat_id,
          title: chat.title,
          updated_at: chat.updated_at,
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ 채팅방의 title만 갱신
  const updateChatTitle = useCallback((chatId, title) => {
    setChatLogs((prev) =>
      prev.map((chat) => (chat.chat_id === chatId ? { ...chat, title } : chat))
    );
  }, []);

  // ✅ 챗봇에 메시지 전송 및 응답 받기
  const sendMessage = useCallback(
    async (message) => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. 새 채팅 생성
        let chatIdToUse = currentChatId;
        if (currentChatId === null) {
          const hash = uuidv4();
          setCurrentChatId(hash);
          onNavigate(`/chat/${hash}`);
          setChatLogs((prev) => [
            ...prev,
            {
              chat_id: hash,
              title: message,
              updated_at: new Date().toISOString(),
            },
          ]);
          chatIdToUse = hash;
        }

        // 2. 챗봇 응답 받기
        const base = import.meta.env.VITE_BACKEND_URL;
        const userId = parseInt(localStorage.getItem("user_id"));
        console.log(
          `${base}/api/v1/chat/${chatIdToUse}/${userId}/${encodeURIComponent(
            message
          )}`
        );

        const response = await fetch(
          `${base}/api/v1/chat/${chatIdToUse}/${userId}/${encodeURIComponent(
            message
          )}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("챗봇 응답을 받는데 실패했습니다.");
        }
        const botResponse = await response.json();
        console.log(botResponse);

        // 3. 채팅방 타이틀 업데이트
        updateChatTitle(currentChatId, botResponse.title);

        // 4. 채팅 리턴
        const { botMessage1, botMessage2 } = parseChatResponse(
          botResponse.chat_log[0],
          {
            typingEffect: true,
          }
        );

        // 5. 타이핑 해제 및 두 번째 메시지 추가
        setTimeout(() => {
          setMessages((prev) => {
            const updated = prev.map((msg) =>
              msg.id === botMessage1.id ? { ...msg, isTyping: false } : msg
            );
            return [...updated, botMessage2];
          });
          setIsLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    [currentChatId, onNavigate, updateChatTitle]
  );

  // ✅ 채팅 로그 삭제
  const deleteChat = useCallback(async (chatId) => {
    try {
      setIsLoading(true);
      setError(null);

      const base = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${base}/api/v1/chat/${chatId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("채팅 로그를 삭제하는데 실패했습니다.");
      }
      setChatLogs((prev) => prev.filter((chat) => chat.chat_id !== chatId));
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        currentChatId,
        chatLogs,
        isLoading,
        error,
        messages,
        startNewChat,
        loadChat,
        loadChatLogs,
        clearChat,
        sendMessage,
        updateChatTitle,
        setMessages,
        setIsLoading,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
