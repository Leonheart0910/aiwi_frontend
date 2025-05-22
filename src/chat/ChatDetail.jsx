import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "@/chat/chatContext";

// 채팅 상세 페이지
export default function ChatDetail() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const { saveChatLog, error: contextError } = useChat();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 채팅 내역 로드
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 백엔드 API 호출
        const response = await fetch(`/api/chats/${hash}`);
        if (!response.ok) {
          throw new Error("채팅 내역을 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // 해시값이 숫자인지 확인
    if (!/^\d+$/.test(hash)) {
      setError("잘못된 채팅 ID입니다.");
      setIsLoading(false);
      return;
    }

    fetchChatHistory();
  }, [hash]);

  // 메시지가 변경될 때마다 백엔드에 저장
  useEffect(() => {
    if (messages.length > 0) {
      saveChatLog(hash, messages);
    }
  }, [messages, hash, saveChatLog]);

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 오류 발생 시 홈으로 이동
  if (error || contextError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-red-500 mb-4">{error || contextError}</div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-gray-500 hover:text-gray-700"
        >
          ← 돌아가기
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">채팅 내역</h1>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.isUser ? "bg-emerald-50 ml-4" : "bg-gray-50 mr-4"
              }`}
            >
              <div className="font-semibold mb-2">
                {message.isUser ? "사용자" : "AI"}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
