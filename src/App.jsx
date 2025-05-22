import { Routes, Route, useNavigate } from "react-router-dom";
import { ChatProvider } from "@/chat/chat-context";
import Home from "@/app/page";
import Login from "@/app/login";
import ChatDetail from "@/chat/ChatDetail";
import DeleteAccount from "@/app/deleteAccount";

export default function App() {
  const navigate = useNavigate();

  return (
    <ChatProvider onNavigate={navigate}>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />
        {/* 로그아웃 페이지 */}
        <Route path="/logout" element={<DeleteAccount />} />
        {/* 채팅 내역 상세 페이지 */}
        <Route path="/chat/:hash" element={<ChatDetail />} />
        {/* 채팅 인터페이스 페이지 */}
        <Route path="/" element={<Home />} />
      </Routes>
    </ChatProvider>
  );
}
