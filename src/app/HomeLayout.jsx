import { Sidebar } from "./sidebar";
import { Button } from "@/components/button";
import {
  MenuIcon,
  PenIcon,
  ChevronDownIcon,
  ShareIcon,
  MoreVerticalIcon,
} from "@/components/icons";
import { UserMenu } from "./user-menu";
import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function HomeLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200`}
      >
        <div className="w-64">
          <Sidebar onNavigate={navigate} />
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500"
              onClick={() => navigate("/")}
            >
              <PenIcon className="h-5 w-5" />
            </Button>
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
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full bg-red-500 text-white p-0"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span className="text-xs font-bold">Plus</span>
              </Button>
              {isUserMenuOpen && <UserMenu />}
            </div>
          </div>
        </header>

        {/* Outlet = 실제 페이지 */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// const data = [
//   {
//     collection_id: 1,
//     collection_title: "여름 세일 장바구니",
//   },
//   {
//     collection_id: 2,
//     collection_title: "겨울 세일 장바구니",
//   },
// ];

// const cart = {
//   collection_id: 1,
//   collection_title: "여름 세일 장바구니",
//   user_id: 1,
//   created_at: "2025-05-28T12:45:00",
//   items: [
//     {
//       item_id: 101,
//       product_name: "반팔티",
//       product_info: "면 100%, 흰색",
//       category_name: "상의",
//       created_at: "2025-05-28T12:46:00",
//       image: {
//         image_id: 301,
//         image_url: "https://example.com/images/301.jpg",
//         created_at: "2025-05-28T12:46:00",
//       },
//     },
//     {
//       item_id: 102,
//       product_name: "청바지",
//       product_info: "스키니핏, 블루",
//       category_name: "하의",
//       created_at: "2025-05-28T12:47:00",
//       image: {
//         image_id: 302,
//         image_url: "https://example.com/images/302.jpg",
//         created_at: "2025-05-28T12:47:00",
//       },
//     },
//   ],
// };

// const response = {
//   user_id: "유저 아이디",
//   collection_id: "장바구니 아이디",
//   collection_title: name,
//   created_at: new Date().toISOString(),
//   updated_at: new Date().toISOString(),
// };

// -------------------------------------------
// const chats = [
//   {
//     chat_id: "12412214",
//     title: "채팅 1",
//     updated_at: "2025-06-04 18:50:43.895283",
//   },
//   {
//     chat_id: "4646345",
//     title: "채팅 2",
//     updated_at: "2025-06-05 18:50:43.895283",
//   },
//   {
//     chat_id: "12589065-",
//     title: "채팅 3",
//     updated_at: "2025-06-06 01:30:43.895283",
//   },
// ];

// const botResponse = {
//   chat_id: 1,
//   title: "채팅방 타이틀",
//   chat_log: [
//     {
//       chat_log_id: 10,
//       user_input: "유저의 입력값",
//       keyword_text: "3개의 키워드에 대한 응답값",
//       seo_keyword_text: "seo키워드에 대한 응답값",
//       products: [
//         {
//           product_id: 123,
//           product_name: "상품 이름 1",
//           product_link: "https://example.com/product/123",
//           product_price: "₩10,000",
//           rank: 1,
//           image: {
//             image_id: 32,
//             image_url: "https://example.com/images/32.jpg",
//             created_at: "2025-06-05T10:00:00Z",
//             updated_at: "2025-06-05T10:00:00Z",
//           },
//           created_at: "2025-06-05T10:00:00Z",
//           updated_at: "2025-06-05T10:00:00Z",
//         },
//         {
//           product_id: 124,
//           product_name: "상품 이름 4",
//           product_link: "https://example.com/product/124",
//           product_price: "₩20,000",
//           rank: 2,
//           image: {
//             image_id: 33,
//             image_url: "https://example.com/images/33.jpg",
//             created_at: "2025-06-05T10:00:00Z",
//             updated_at: "2025-06-05T10:00:00Z",
//           },
//           created_at: "2025-06-05T10:00:00Z",
//           updated_at: "2025-06-05T10:00:00Z",
//         },
//         {
//           product_id: 125,
//           product_name: "상품 이름 7",
//           product_link: "https://example.com/product/125",
//           product_price: "₩30,000",
//           rank: 3,
//           image: {
//             image_id: 34,
//             image_url: "https://example.com/images/34.jpg",
//             created_at: "2025-06-05T10:00:00Z",
//             updated_at: "2025-06-05T10:00:00Z",
//           },
//           created_at: "2025-06-05T10:00:00Z",
//           updated_at: "2025-06-05T10:00:00Z",
//         },
//         {
//           product_id: 126,
//           product_name: "상품 이름 2",
//           product_link: "https://example.com/product/126",
//           product_price: "₩11,000",
//           rank: 1,
//           image: {
//             image_id: 35,
//             image_url: "https://example.com/images/35.jpg",
//             created_at: "2025-06-05T10:00:00Z",
//             updated_at: "2025-06-05T10:00:00Z",
//           },
//           created_at: "2025-06-05T10:00:00Z",
//           updated_at: "2025-06-05T10:00:00Z",
//         },
//         {
//           product_id: 127,
//           product_name: "상품 이름 3",
//           product_link: "https://example.com/product/127",
//           product_price: "₩12,000",
//           rank: 1,
//           image: {
//             image_id: 36,
//             image_url: "https://example.com/images/36.jpg",
//             created_at: "2025-06-05T10:00:00Z",
//             updated_at: "2025-06-05T10:00:00Z",
//           },
//           created_at: "2025-06-05T10:00:00Z",
//           updated_at: "2025-06-05T10:00:00Z",
//         },
//         {
//           product_id: 128,
//           product_name: "상품 이름 5",
//           product_link: "https://example.com/product/128",
//           product_price: "₩21,000",
//           rank: 2,
//           image: {
//             image_id: 37,
//             image_url: "https://example.com/images/37.jpg",
//             created_at: "2025-06-05T10:00:00Z",
//             updated_at: "2025-06-05T10:00:00Z",
//           },
//           created_at: "2025-06-05T10:00:00Z",
//           updated_at: "2025-06-05T10:00:00Z",
//         },
//         {
//           product_id: 129,
//           product_name: "상품 이름 6",
//           product_link: "https://example.com/product/129",
//           product_price: "₩22,000",
//           rank: 2,
//           image: {
//             image_id: 38,
//             image_url: "https://example.com/images/38.jpg",
//             created_at: "2025-06-05T10:00:00Z",
//             updated_at: "2025-06-05T10:00:00Z",
//           },
//           created_at: "2025-06-05T10:00:00Z",
//           updated_at: "2025-06-05T10:00:00Z",
//         },
//         {
//           product_id: 130,
//           product_name: "상품 이름 8",
//           product_link: "https://example.com/product/130",
//           product_price: "₩31,000",
//           rank: 3,
//           image: {
//             image_id: 39,
//             image_url: "https://example.com/images/39.jpg",
//             created_at: "2025-06-05T10:00:00Z",
//             updated_at: "2025-06-05T10:00:00Z",
//           },
//           created_at: "2025-06-05T10:00:00Z",
//           updated_at: "2025-06-05T10:00:00Z",
//         },
//         {
//           product_id: 134,
//           product_name: "상품 이름 9",
//           product_link: "https://example.com/product/130",
//           product_price: "₩99,000",
//           rank: 3,
//           image: {
//             image_id: 39,
//             image_url: "https://example.com/images/39.jpg",
//             created_at: "2025-06-05T10:00:00Z",
//             updated_at: "2025-06-05T10:00:00Z",
//           },
//           created_at: "2025-06-05T10:00:00Z",
//           updated_at: "2025-06-05T10:00:00Z",
//         },
//       ],
//       recommend: [
//         {
//           recommend_id: 1,
//           recommend_text: "rank 1 추천 텍스트",
//           rank: 1,
//         },
//         {
//           recommend_id: 2,
//           recommend_text: "rank 2 추천 텍스트",
//           rank: 2,
//         },
//         {
//           recommend_id: 3,
//           recommend_text: "rank 3 추천 텍스트",
//           rank: 3,
//         },
//       ],
//       created_at: "로그 생성 시간",
//       updated_at: "로그 수정 시간",
//     },
//   ],
//   created_at: "채팅 생성 시간",
//   updated_at: "채팅 수정 시간",
// };

// const chats = [
//   {
//     chat_id: 4,
//     title: "채팅방 타이틀",
//     chat_log: [
//       {
//         chat_log_id: 10,
//         user_input: "유저의 입력값asdsadsa",
//         keyword_text: "3개의 키워드에 대한 응답값asdas",
//         seo_keyword_text: "seo키워드에 대한 응답값",
//         products: [
//           {
//             product_id: 123,
//             product_name: "상품 이름",
//             product_link: "상품의 링크",
//             product_price: "상품의 가격",
//             rank: 1,
//             image: {
//               image_id: 32,
//               image_url: "이미지 url",
//               created_at: "생성시간",
//               updated_at: "업데이트시간",
//             },
//             created_at: "생성시간",
//             updated_at: "업데이트시간",
//           },
//         ],
//         recommend: [
//           {
//             recommend_id: 1,
//             recommend_text: "추천하는 상품은...",
//             rank: 1,
//           },
//           {
//             recommend_id: 2,
//             recommend_text: "추천하는 상품은...",
//             rank: 2,
//           },
//           {
//             recommend_id: 3,
//             recommend_text: "추천하는 상품은...",
//             rank: 3,
//           },
//         ],
//         created_at: "로그 생성 시간",
//         updated_at: "로그 수정 시간",
//       },
//     ],
//     created_at: "채팅 생성 시간",
//     updated_at: "채팅 수정 시간",
//   },
//   {
//     chat_id: 4,
//     title: "채팅방 타이틀",
//     chat_log: [
//       {
//         chat_log_id: 10,
//         user_input: "유저의 입력값",
//         keyword_text: "3개의 키워드에 대한 응답값dsadasd",
//         seo_keyword_text: "seo키워드에 대한 응답값",
//         products: [
//           {
//             product_id: 123,
//             product_name: "상품 이름",
//             product_link: "상품의 링크",
//             product_price: "상품의 가격",
//             rank: 1,
//             image: {
//               image_id: 32,
//               image_url: "이미지 url",
//               created_at: "생성시간",
//               updated_at: "업데이트시간",
//             },
//             created_at: "생성시간",
//             updated_at: "업데이트시간",
//           },
//         ],
//         recommend: [
//           {
//             recommend_id: 1,
//             recommend_text: "추천하는 상품은...",
//             rank: 1,
//           },
//           {
//             recommend_id: 2,
//             recommend_text: "추천하는 상품은...",
//             rank: 2,
//           },
//           {
//             recommend_id: 3,
//             recommend_text: "추천하는 상품은...",
//             rank: 3,
//           },
//         ],
//         created_at: "로그 생성 시간",
//         updated_at: "로그 수정 시간",
//       },
//     ],
//     created_at: "채팅 생성 시간",
//     updated_at: "채팅 수정 시간",
//   },
// ];
