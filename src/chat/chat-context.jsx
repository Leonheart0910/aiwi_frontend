import { useState, useCallback } from "react";
import { ChatContext } from "./chatContext";
import { v4 as uuidv4 } from "uuid";

// mock 서버를 쓸 때는 포트 3001, 실제 API 쓰려면 빈 문자열
const base =
  import.meta.env.VITE_USE_MOCK === "true" ? "http://localhost:3001" : "";

// 채팅 관련 API 호출 함수
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

      // 2) 백엔드에 새 채팅 생성 POST 요청
      // const response = await fetch(`${base}/input`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ user_id: userId, hash, id: hash }),
      // });
      // if (!response.ok) throw new Error("새 채팅 생성 실패");
      // const newChat = await response.json();

      const newChat = {
        chat_id: hash,
        user_id: userId,
        title: "채팅 제목",
        messages: [],
      };
      console.log(newChat);

      // 3) 상태 업데이트 & 리다이렉트
      setCurrentChatId(hash);
      setChatLogs((prev) => [newChat, ...prev]);

      onNavigate(`/chat/${hash}`);
      setIsLoading(false);
      return hash;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [onNavigate /*, uuidv4, base */]);

  // 해당 채팅 로그 저장 /api/v1/chats/:id
  const saveChatLog = useCallback(async (chatId, messages) => {
    try {
      setIsLoading(true);
      setError(null);

      // 백엔드에 채팅 내용 저장 PUT 요청
      // const response = await fetch(`${base}/chats/${chatId}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ messages }),
      // });
      // if (!response.ok) {
      //   throw new Error("채팅 내용을 저장하는데 실패했습니다.");
      // }
      // const updatedChat = await response.json();

      const updatedChat = {
        chat_id: chatId,
        messages,
      };

      // 채팅 목록 업데이트
      setChatLogs((prev) =>
        prev.map((chat) => (chat.chat_id === chatId ? updatedChat : chat))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 사용자의 특정 채팅 불러오기 (로그인 이후)
  const loadAllChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const userId = localStorage.getItem("user_id");
    const listRes = await fetch(`${base}/chats/${userId}`);
    const all = await listRes.json();
    console.log(all);
    setChatLogs(all);

    return all;
  }, []);

  // 해당 채팅 로그 불러오기 /api/v1/chats/:id
  const loadChat = useCallback(async (hash) => {
    setIsLoading(true);
    setError(null);

    // 백엔드에서 채팅 로그 GET 요청
    // const chatRes = await fetch(`${base}/chats/${hash}`);
    // if (!chatRes.ok) throw new Error("불러오기 실패");
    // const chat = await chatRes.json();
    // console.log(chat);

    const chat = {
      chat_id: hash,
      title: "채팅 제목",
      messages: [
        {
          id: 1,
          role: "user",
          content: "안녕 이건 테스트야.",
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          role: "assistant",
          content: "알고있어.",
          timestamp: new Date().toISOString(),
        },
        {
          id: 3,
          role: "user",
          content: "그래그래.",
          timestamp: new Date().toISOString(),
        },
        {
          id: 4,
          role: "assistant",
          content: "화이팅 !",
          timestamp: new Date().toISOString(),
        },
      ],
    };

    console.log(chat);
    setChatLogs((prev) => {
      const exists = prev.find((c) => c.chat_id === hash);
      if (exists) {
        return prev.map((c) => (c.chat_id === hash ? chat : c));
      } else {
        return [chat, ...prev];
      }
    });

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
      // const userId = localStorage.getItem("user_id");
      // const response = await fetch(`${base}/api/chats/${userId}`);
      // if (!response.ok) {
      //   throw new Error("채팅 목록을 불러오는데 실패했습니다.");
      // }
      // const chats = await loadAllChats();

      const chats = [
        {
          chat_id: "1",
          title: "채팅 제목",
          user_id: 1,
          last_message: "채팅 내용",
          created_at: "2025-01-01",
        },
        {
          chat_id: "2",
          title: "채팅 제목",
          user_id: 1,
          last_message: "채팅 내용",
          created_at: "2025-01-02",
        },
        {
          chat_id: "3",
          title: "채팅 제목",
          user_id: 1,
          last_message: "채팅 내용",
          created_at: "2025-01-03",
        },
      ];

      setChatLogs(
        chats.map((chat) => ({
          chat_id: chat.chat_id, // id로 통일
          title: chat.title,
          user_id: chat.user_id,
        }))
      );

      console.log(chats);
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
        loadAllChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
