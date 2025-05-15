import { createContext, useContext, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatLogs, setChatLogs] = useState([]);

  // 새 채팅 시작
  const startNewChat = useCallback(() => {
    const newChatId = uuidv4();
    setCurrentChatId(newChatId);

    // 새 채팅 로그 추가
    setChatLogs((prev) => [
      {
        id: newChatId,
        title: "새로운 채팅",
        timestamp: new Date().toISOString(),
        messages: [],
      },
      ...prev,
    ]);
  }, []);

  // 채팅 로그 저장
  const saveChatLog = useCallback((chatId, messages) => {
    setChatLogs((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages,
              title: messages[0]?.content?.slice(0, 30) || "새로운 채팅",
            }
          : chat
      )
    );
  }, []);

  // 채팅 로그 불러오기
  const loadChat = useCallback((chatId) => {
    setCurrentChatId(chatId);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        currentChatId,
        chatLogs,
        startNewChat,
        saveChatLog,
        loadChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
