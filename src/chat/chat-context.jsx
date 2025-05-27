import { useState, useCallback } from "react";
import { ChatContext } from "./chatContext";
import { v4 as uuidv4 } from "uuid";

// mock 서버를 쓸 때는 포트 3001, 실제 API 쓰려면 빈 문자열
const base =
  import.meta.env.VITE_USE_MOCK === "true" ? "http://localhost:3001" : "";

export function ChatProvider({ children, onNavigate }) {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatLogs, setChatLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 새 채팅 시작 /api/v1/input
  const startNewChat = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1) 해시값 생성
      const userId = localStorage.getItem("user_id");
      const hash = uuidv4();

      // 2) 백엔드에 새 채팅 생성 요청
      const response = await fetch(`${base}/input`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, hash, id: hash }),
      });
      if (!response.ok) throw new Error("새 채팅 생성 실패");

      const newChat = await response.json();
      setCurrentChatId(hash);
      setChatLogs((prev) => [newChat, ...prev]);

      // 3) 상태 업데이트 & 리다이렉트
      onNavigate(`/chat/${hash}`);
      setIsLoading(false);
      return hash;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [onNavigate /*, uuidv4, base */]);

  // 채팅 로그 저장
  const saveChatLog = useCallback(async (chatId, messages) => {
    try {
      setIsLoading(true);
      setError(null);

      // 백엔드에 채팅 내용 저장 요청
      const response = await fetch(`${base}/chats/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error("채팅 내용을 저장하는데 실패했습니다.");
      }

      const updatedChat = await response.json();

      // 채팅 목록 업데이트
      setChatLogs((prev) =>
        prev.map((chat) => (chat.id === chatId ? updatedChat : chat))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 채팅 로그 불러오기
  const loadChat = useCallback(async (hash) => {
    setIsLoading(true);
    setError(null);

    // 1) 전체 로그(사이드바) 불러오기
    const listRes = await fetch(`${base}/chats`);
    const all = await listRes.json();
    setChatLogs(all);

    // 2) 해당 hash 채팅 불러오기
    const chatRes = await fetch(`${base}/chats/${hash}`);
    if (!chatRes.ok) throw new Error("불러오기 실패");
    const chat = await chatRes.json(); // { id: hash, user_id, hash, messages: [...] }
    setCurrentChatId(hash);
    setIsLoading(false);
    return chat;
  }, []);

  // 채팅 로그 초기화
  const clearChat = useCallback(() => {
    setChatLogs([]);
    setCurrentChatId(null);
  }, []);

  // 채팅 목록 불러오기
  const loadChatLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 백엔드에서 채팅 목록 요청
      const response = await fetch(`${base}/api/chats`);

      if (!response.ok) {
        throw new Error("채팅 목록을 불러오는데 실패했습니다.");
      }

      const chats = await response.json();
      setChatLogs(chats);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        currentChatId,
        chatLogs,
        isLoading,
        error,
        startNewChat,
        saveChatLog,
        loadChat,
        loadChatLogs,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
