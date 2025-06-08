import { Routes, Route, useNavigate } from "react-router-dom";
import { useCallback } from "react";

import { ChatProvider } from "@/chat/chat-context";
import { CartProvider } from "@/cart/cart-context";
import Home from "@/app/page";
import Login from "@/app/login";
import Signup from "@/app/signup";
import DeleteAccount from "@/app/deleteAccount";
import CartDetail from "@/cart/CartDetail";
import Landing from "@/landing/landing";
import { Profile } from "@/app/profile";
import { ProtectedRoute } from "@/ProtectedRoute";

export default function App() {
  const navigate = useNavigate();
  const onNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <CartProvider onNavigate={onNavigate}>
      <ChatProvider onNavigate={onNavigate}>
        <Routes>
          {/* 랜딩 페이지 라우트 추가 */}
          <Route path="/landing" element={<Landing />} />
          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login />} />
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<Signup />} />
          {/* 보호된 라우트들 */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <DeleteAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:hash"
            element={
              <ProtectedRoute>
                <Home onNavigate={onNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home onNavigate={onNavigate} />
              </ProtectedRoute>
            }
          />
          {/* 장바구니 페이지 */}
          <Route
            path="/cart/:collection_id"
            element={
              <ProtectedRoute>
                <CartDetail onNavigate={onNavigate} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ChatProvider>
    </CartProvider>
  );
}
