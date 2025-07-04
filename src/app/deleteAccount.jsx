import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LogoutPage() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleWithdraw = async () => {
    const userId = parseInt(localStorage.getItem("user_id"));
    // console.log(userId);
    if (!userId) {
      alert("로그인 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setIsDeleting(true);
      const base = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${base}/api/v1/user/withdraw`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error("회원 탈퇴 실패");
      }

      alert("탈퇴가 완료되었습니다.");
      localStorage.removeItem("user_id");
      navigate("/landing");
    } catch (err) {
      console.error("탈퇴 오류:", err);
      alert("탈퇴 중 문제가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto space-y-8 text-center">
        <h1 className="text-3xl font-bold">정말 탈퇴하시겠습니까?</h1>

        <div className="space-y-4">
          <a
            href="https://www.notion.so"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-500 hover:underline"
          >
            탈퇴약관
          </a>

          <button
            onClick={handleWithdraw}
            disabled={isDeleting}
            className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            {isDeleting ? "처리 중..." : "회원 탈퇴"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
