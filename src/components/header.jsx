import { MenuIcon } from "@/components/icons";

// 헤더 컴포넌트
export function Header({ onToggleSidebar }) {
  return (
    <header className="h-14 border-b border-gray-200 flex items-center px-4 bg-white">
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-md"
      >
        <MenuIcon className="h-5 w-5 text-gray-500" />
      </button>
      <div className="flex-1" />
    </header>
  );
}
