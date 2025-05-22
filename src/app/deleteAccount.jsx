import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md text-center space-y-8">
        <h1 className="text-3xl font-bold">정말 탈퇴하시겠습니까?</h1>

        <div className="space-y-4">
          <a
            href="https://www.notion.so"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-500 hover:underline block"
          >
            탈퇴약관
          </a>

          <button
            onClick={() => navigate("/")}
            className="w-full p-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
