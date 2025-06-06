import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

const base =
  import.meta.env.VITE_USE_MOCK === "true" ? "http://localhost:8000" : "";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 로그인 처리 /api/v1/user/login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${base}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
    <div className="flex flex-col items-center w-full">
      <div className="w-full text-left mb-8 px-6 pt-6">
        <h1 className="text-xl font-bold">aiwi</h1>
      </div>

      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-8">다시 오신 걸 환영합니다</h2>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "처리 중..." : "계속"}
          </Button>
        </form>

        <div className="mt-4">
          <p>
            계정이 없으신가요?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              회원 가입
            </a>
          </p>
        </div>
      </div>

      <div className="mt-auto pt-8 text-sm text-gray-500">
        <a
          href="https://www.notion.so"
          target="_blank"
          className="hover:underline"
        >
          이용약관
        </a>
      </div>
    </div>
  );
}
