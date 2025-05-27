import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

// mock 서버를 쓸 때는 포트 3001, 실제 API 쓰려면 빈 문자열
const base =
  import.meta.env.VITE_USE_MOCK === "true"
    ? "http://localhost:3001"
    : import.meta.env.REACT_APP_API_URL;

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    age: "",
    sex: "male",
  });
  const [error, setError] = useState("");

  // 회원가입 폼 데이터 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회원가입 요청 /api/v1/user/signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log(formData.age, formData.age.type);
      const response = await fetch(`${base}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
        }),
      });

      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.");
      }

      // 회원가입 성공 시 로그인 페이지로 이동
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="mt-2 text-gray-600">새로운 계정을 만들어보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              name="email"
              label="이메일"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
            />

            <Input
              type="password"
              name="password"
              label="비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Input
              type="text"
              name="nickname"
              label="닉네임"
              value={formData.nickname}
              onChange={handleChange}
              required
              placeholder="닉네임을 입력하세요"
            />

            <Input
              type="number"
              name="age"
              label="나이"
              value={formData.age}
              onChange={handleChange}
              required
              placeholder="나이를 입력하세요"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                성별
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sex"
                    value="male"
                    checked={formData.sex === "male"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  남성
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sex"
                    value="female"
                    checked={formData.sex === "female"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  여성
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="space-y-4">
            <Button type="submit" className="w-full">
              회원가입
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              <span className="mr-1">이미 계정이 있으신가요?</span>
              <span className="text-blue-500">로그인</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
