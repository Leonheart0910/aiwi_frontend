import { useState, useCallback } from "react";
import { ChatContext } from "./chatContext";
import { v4 as uuidv4 } from "uuid";

export function ChatProvider({ children, onNavigate }) {
  const [currentChatId, setCurrentChatId] = useState(null); // 현재 대화 중인 Chat ID
  const [chatLogs, setChatLogs] = useState([]); // 사용자의 모든 채팅 목록
  const [messages, setMessages] = useState([]); // 현재 chat의 대화 내역
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ 채팅 로그 파싱 함수
  function parseChatResponse(chatResponse, options = { typingEffect: false }) {
    // 첫 번째 메시지: user_input
    const userMessage = {
      id: uuidv4(),
      role: "user",
      content: chatResponse.user_input,
    };

    // 두 번째 메시지: keyword_text
    const botMessage1 = {
      id: uuidv4(),
      role: "assistant",
      content: chatResponse.keyword_text,
      isTyping: options.typingEffect,
    };

    // 세 번째 메시지: products + recommend
    const productsByRank =
      chatResponse.products?.reduce((acc, prod) => {
        if (!acc[prod.rank]) acc[prod.rank] = [];
        // product_name에서 <b> 태그 이전의 값만 추출
        const parsedName = prod.product_name.split("<b>")[0].trim();
        acc[prod.rank].push({
          ...prod,
          product_name: parsedName,
        });
        return acc;
      }, {}) || {};
    // rank별 recommend text를 객체 형태로 분리
    const recommendByRank =
      chatResponse.recommend?.reduce((acc, rec) => {
        acc[rec.rank] = rec.recommend_text;
        return acc;
      }, {}) || {};
    // 두 번째 메시지 객체 생성 (JSX를 content에 직접 넣어서 렌더링)
    const botMessage2 = {
      id: uuidv4(),
      role: "assistant",
      content: "",
      productsByRank,
      recommendByRank,
      isStructured: true,
    };
    console.log(recommendByRank);
    // 메시지 세팅 분기
    if (!options.typingEffect) {
      setMessages((prev) => [...prev, userMessage, botMessage1, botMessage2]);
    } else {
      setMessages((prev) => [...prev, userMessage, botMessage1]);
    }
    setIsLoading(false);
    return {
      userMessage,
      botMessage1,
      botMessage2,
    };
  }

  // ✅ 새 채팅 시작
  const startNewChat = useCallback(() => {
    setCurrentChatId(null);
    setMessages([]);
  }, []);

  // ✅ 해당 채팅 로그 불러오기 /api/v1/chat/:id
  const loadChat = useCallback(
    async (hash) => {
      setIsLoading(true);
      setError(null);
      setMessages([]);
      onNavigate(`/chat/${hash}`);
      // 백엔드에서 채팅 로그 GET 요청
      const base =
        import.meta.env.VITE_USE_MOCK === "true" ? "http://localhost:8000" : "";
      const chatRes = await fetch(`${base}/api/v1/chat/${hash}`);
      if (!chatRes.ok) throw new Error("불러오기 실패");
      const chats = await chatRes.json();
      console.log(chats);

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

      for (const chat of chats.chat_log) {
        parseChatResponse(chat, { typingEffect: false });
      }

      setCurrentChatId(hash);
      setIsLoading(false);
    },
    [onNavigate]
  );

  // ✅ 채팅 로그 초기화
  const clearChat = useCallback(() => {
    setChatLogs([]);
    setCurrentChatId(null);
  }, []);

  // ✅ 채팅 목록 불러오기
  const loadChatLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 백엔드에서 채팅 목록 요청
      const base =
        import.meta.env.VITE_USE_MOCK === "true" ? "http://localhost:8000" : "";
      const userId = parseInt(localStorage.getItem("user_id"));
      const response = await fetch(`${base}/api/v1/chat/user/${userId}`);
      if (!response.ok) {
        throw new Error("채팅 목록을 불러오는데 실패했습니다.");
      }
      const chats = await response.json();
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

      setChatLogs(
        chats.map((chat) => ({
          chat_id: chat.chat_id,
          title: chat.title,
          updated_at: chat.updated_at,
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ 채팅방의 title만 갱신
  const updateChatTitle = useCallback((chatId, title) => {
    setChatLogs((prev) =>
      prev.map((chat) => (chat.chat_id === chatId ? { ...chat, title } : chat))
    );
  }, []);

  // ✅ 챗봇에 메시지 전송 및 응답 받기
  const sendMessage = useCallback(
    async (message) => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. 새 채팅 생성
        if (currentChatId === null) {
          const hash = uuidv4();
          setCurrentChatId(hash);
          onNavigate(`/chat/${hash}`);
          setChatLogs((prev) => [
            ...prev,
            {
              chat_id: hash,
              title: "새 채팅",
              updated_at: new Date().toISOString(),
            },
          ]);
        }

        // 2. 챗봇 응답 받기
        const base =
          import.meta.env.VITE_USE_MOCK === "true"
            ? "http://localhost:8000"
            : "";
        const userId = parseInt(localStorage.getItem("user_id"));
        const response = await fetch(
          `${base}/api/v1/chat/${currentChatId}/${userId}/${encodeURIComponent(
            message
          )}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("챗봇 응답을 받는데 실패했습니다.");
        }
        const botResponse = await response.json();
        console.log(botResponse);

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

        // 3. 채팅방 타이틀 업데이트
        updateChatTitle(currentChatId, botResponse.title);

        // 4. 채팅 리턴
        const { botMessage1, botMessage2 } = parseChatResponse(
          botResponse.chat_log[0],
          {
            typingEffect: true,
          }
        );

        // 5. 타이핑 해제 및 두 번째 메시지 추가
        setTimeout(() => {
          setMessages((prev) => {
            const updated = prev.map((msg) =>
              msg.id === botMessage1.id ? { ...msg, isTyping: false } : msg
            );
            return [...updated, botMessage2];
          });
          setIsLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    [currentChatId, onNavigate, updateChatTitle]
  );

  return (
    <ChatContext.Provider
      value={{
        currentChatId,
        chatLogs,
        isLoading,
        error,
        messages,
        startNewChat,
        loadChat,
        loadChatLogs,
        clearChat,
        sendMessage,
        updateChatTitle,
        setMessages,
        setIsLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
