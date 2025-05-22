import { useState, useCallback } from "react";
import { ChatContext } from "./chatContext";

export function ChatProvider({ children, onNavigate }) {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatLogs, setChatLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 새 채팅 시작
  const startNewChat = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 백엔드에 새 채팅 생성 요청
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("새 채팅을 생성하는데 실패했습니다.");
      }

      const newChat = await response.json();
      setCurrentChatId(newChat.id);

      // 채팅 목록 업데이트
      setChatLogs((prev) => [newChat, ...prev]);

      // 새 채팅 페이지로 리다이렉션
      onNavigate(`/chat/${newChat.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [onNavigate]);

  // 채팅 로그 저장
  const saveChatLog = useCallback(async (chatId, messages) => {
    try {
      setIsLoading(true);
      setError(null);

      // 백엔드에 채팅 내용 저장 요청
      const response = await fetch(`/api/chats/${chatId}`, {
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
  const loadChat = useCallback(
    async (chatId) => {
      try {
        setIsLoading(true);
        setError(null);

        // 백엔드에서 채팅 내용 요청
        const response = await fetch(`/api/chats/${chatId}`);

        if (!response.ok) {
          throw new Error("채팅 내용을 불러오는데 실패했습니다.");
        }

        const chat = await response.json();
        console.log(chat);
        setCurrentChatId(chatId);
        onNavigate(`/chat/${chatId}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [onNavigate]
  );

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
      const response = await fetch("/api/chats");

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
