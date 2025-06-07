import {
  UserIcon,
  SettingsIcon,
  UploadIcon,
  FileQuestionIcon,
  ExternalLinkIcon,
  LogOutIcon,
  UserXIcon,
} from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/chat/chatContext";

// 사용자 메뉴 컴포넌트
export function UserMenu() {
  const navigate = useNavigate();
  const { clearChat } = useChat();

  // ✅ 로그아웃
  const handleLogout = () => {
    // 로컬 스토리지 데이터 정리
    localStorage.removeItem("user_id");
    // 채팅 상태 초기화
    clearChat();
    // 로그인 페이지로 이동
    navigate("/login");
  };

  return (
    <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-2 space-y-1">
        <a
          href="#"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
        >
          <UserIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm">내 계정</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
        >
          <SettingsIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm">설정</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
        >
          <FileQuestionIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm">도움말 및 자주 묻는 질문(FAQ)</span>
        </a>

        <a
          href="https://your-release-notes-url.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
        >
          <ExternalLinkIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm">릴리즈 노트</span>
        </a>

        <div className="border-t border-gray-200 my-1"></div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-left"
        >
          <LogOutIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm">로그아웃</span>
        </button>

        <button
          onClick={() => navigate("/logout")}
          className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-left"
        >
          <UserXIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm">회원탈퇴</span>
        </button>
      </div>
    </div>
  );
}
