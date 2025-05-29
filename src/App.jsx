import { Routes, Route, useNavigate } from "react-router-dom";
import { ChatProvider } from "@/chat/chat-context";
import { CartProvider } from "@/cart/cart-context";
import Home from "@/app/page";
import Login from "@/app/login";
import Signup from "@/app/signup";
import DeleteAccount from "@/app/deleteAccount";
import CartDetail from "@/cart/CartDetail";

export default function App() {
  const navigate = useNavigate();

  return (
    <CartProvider>
      <ChatProvider onNavigate={navigate}>
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login />} />
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<Signup />} />
          {/* 로그아웃 페이지 */}
          <Route path="/logout" element={<DeleteAccount />} />
          {/* 채팅 인터페이스 페이지 */}
          <Route path="/chat/:hash" element={<Home />} />
          <Route path="/" element={<Home />} />
          {/* 장바구니 페이지 */}
          <Route path="/cart/:collection_id" element={<CartDetail />} />
        </Routes>
      </ChatProvider>
    </CartProvider>
  );
}
