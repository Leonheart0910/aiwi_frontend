import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import {
  PenIcon,
  ChevronDownIcon,
  ShareIcon,
  MoreVerticalIcon,
} from "@/components/icons";
import { UserMenu } from "@/app/user-menu";

export function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = parseInt(localStorage.getItem("user_id"));
        const base = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${base}/api/v1/user/${userId}`);
        if (!response.ok) {
          throw new Error("사용자 정보를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={() => navigate("/")}
          >
            <PenIcon className="h-5 w-5" />
          </Button>
          <div className="w-10 h-10" />
        </div>

        <div className="flex items-center">
          <h1 className="text-lg font-medium">쇼핑 챗봇</h1>
          <ChevronDownIcon className="h-4 w-4 ml-1" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <ShareIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <MoreVerticalIcon className="h-5 w-5" />
          </Button>
          {/* 사용자 메뉴 */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full bg-red-500 text-white p-0"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <span className="text-xs font-bold">Plus</span>
            </Button>
            {/* 사용자 메뉴 모달 */}
            {isUserMenuOpen && <UserMenu />}
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 p-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            내 계정 정보
          </h2>

          <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
            {[
              { label: "이메일", value: userData?.email },
              { label: "닉네임", value: userData?.nickname },
              { label: "나이", value: userData?.user_info?.age },
              { label: "성별", value: userData?.user_info?.sex },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">{item.label}</span>
                <span className="text-gray-900">{item.value || "-"}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
