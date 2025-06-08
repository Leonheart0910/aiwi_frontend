import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ 로그인 처리 /api/v1/user/login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const base = import.meta.env.VITE_BACKEND_URL;
    try {
      localStorage.removeItem("user_id");
      const response = await fetch(`${base}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response.ok) {
        throw new Error("로그인에 실패했습니다");
      }
      const data = await response.json();

      // 로그인 성공 시 사용자 정보 저장
      const user_id = data.user_id;
      localStorage.setItem("user_id", user_id);

      setIsLoading(false);
      navigate("/"); // 로그인 성공 후 홈으로 이동
    } catch (error) {
      console.error("로그인 오류:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-md">
        {/* 로고 / 타이틀 */}
        <h1 className="text-3xl font-bold mb-6">aiwi</h1>

        {/* 안내 문구 */}
        <h2 className="text-2xl font-semibold mb-8 text-center">
          다시 오신 걸 환영합니다
        </h2>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full py-2">
            {isLoading ? "처리 중..." : "계속"}
          </Button>
        </form>

        {/* 회원 가입 링크 */}
        <p className="mt-6 text-center text-sm">
          계정이 없으신가요?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            회원 가입
          </a>
        </p>
      </div>

      {/* 이용약관 */}
      <footer className="mt-8 text-sm text-gray-500">
        <a
          href="https://www.notion.so"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          이용약관
        </a>
      </footer>
    </div>
  );
}
