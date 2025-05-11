import {
  FolderIcon,
  ShoppingCartIcon,
  ClockIcon,
  ExternalLinkIcon,
} from "@/components/icons";
import recommendationBook from "@/assets/recommendation_book.png";

// 사이드바 컴포넌트
export function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-200 flex flex-col h-full bg-white">
      {/* 광고 사이트 링크 */}
      <div className="p-3 space-y-2">
        {/* 쿠팡 링크 */}
        <a
          href="https://www.coupang.com"
          target="_blank"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <ShoppingCartIcon className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex-1">
            <span className="font-medium">쿠팡</span>
          </div>
        </a>
        {/* 무신사 링크 */}
        <a
          href="https://www.musinsa.com"
          target="_blank"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
            <ExternalLinkIcon className="h-4 w-4 text-purple-500" />
          </div>
          <div className="flex-1">
            <span className="font-medium">무신사</span>
          </div>
        </a>
        {/* 추천 상품  */}
        <div className="mt-auto p-3 border-y">
          <h2 className="text-xs font-medium text-gray-500 px-2 mb-2">
            추천 상품
          </h2>
          <div className="p-2 rounded-md hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={recommendationBook}
                  alt="추천 상품"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <p className="text-xs font-medium">프리미엄 상품</p>
                <p className="text-xs text-gray-500">39,900원</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 장바구니 */}
      <div className="mt-4 px-3">
        <h2 className="text-xs font-medium text-gray-500 px-2 mb-2">
          장바구니
        </h2>
        <div className="space-y-1">
          {/* 패션 장바구니 */}
          <a
            href="#"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
          >
            <FolderIcon className="h-4 w-4 text-gray-500" />
            <span>패션 장바구니</span>
          </a>
          {/* 식품 장바구니 */}
          <a
            href="#"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
          >
            <FolderIcon className="h-4 w-4 text-gray-500" />
            <span>식품 장바구니</span>
          </a>
          {/* 가전 장바구니 */}
          <a
            href="#"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
          >
            <FolderIcon className="h-4 w-4 text-gray-500" />
            <span>가전 장바구니</span>
          </a>
        </div>
      </div>

      {/* 채팅 로그 */}
      <div className="mt-4 px-3">
        <h2 className="text-xs font-medium text-gray-500 px-2 mb-2">오늘</h2>
        <div className="space-y-1">
          <a
            href="#"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-sm"
          >
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <span>오늘의 쇼핑</span>
          </a>
        </div>
      </div>

      {/* 이전 기록 */}
      <div className="mt-4 px-3">
        <h2 className="text-xs font-medium text-gray-500 px-2 mb-2">
          이전 기록
        </h2>
        <div className="space-y-1">
          <a
            href="#"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-sm"
          >
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <span>어제의 쇼핑</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-sm"
          >
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <span>지난주 쇼핑</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
