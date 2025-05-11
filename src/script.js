document.addEventListener("DOMContentLoaded", () => {
  // DOM 요소
  const userMenuButton = document.getElementById("userMenuButton");
  const userMenu = document.getElementById("userMenu");
  const chatForm = document.getElementById("chatForm");
  const messageInput = document.getElementById("messageInput");
  const messages = document.getElementById("messages");
  const emptyChat = document.getElementById("emptyChat");
  const suggestionButtons = document.querySelectorAll(".suggestion-button");

  // 메시지 배열
  const chatMessages = [];

  // 사용자 메뉴 토글
  userMenuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("active");
  });

  // 문서 클릭 시 메뉴 닫기
  document.addEventListener("click", (e) => {
    if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.classList.remove("active");
    }
  });

  // 채팅 폼 제출
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();

    if (message) {
      addMessage("user", message);
      messageInput.value = "";

      // 챗봇 응답 시뮬레이션
      setTimeout(() => {
        addMessage(
          "assistant",
          "안녕하세요! 오늘은 어떤 상품을 찾고 계신가요?"
        );
      }, 1000);
    }
  });

  // 추천 버튼 클릭
  suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const message = button.textContent;
      addMessage("user", message);

      // 챗봇 응답 시뮬레이션
      setTimeout(() => {
        let response = "";

        switch (message) {
          case "패션 상품 추천":
            response =
              "패션 상품을 추천해 드릴게요. 어떤 종류의 패션 아이템을 찾고 계신가요? 상의, 하의, 신발 등 카테고리를 알려주시면 더 정확한 추천이 가능합니다.";
            break;
          case "가전 제품 찾기":
            response =
              "가전 제품을 찾아드릴게요. 어떤 종류의 가전 제품을 찾고 계신가요? TV, 냉장고, 세탁기 등 구체적인 제품을 알려주시면 도움드리겠습니다.";
            break;
          case "식품 장바구니":
            response =
              "식품 장바구니를 확인해 드릴게요. 현재 장바구니에 담긴 식품이 없습니다. 어떤 식품을 찾고 계신가요?";
            break;
          case "할인 상품 보기":
            response =
              "현재 할인 중인 상품을 보여드릴게요. 어떤 카테고리의 할인 상품에 관심이 있으신가요?";
            break;
          default:
            response = "안녕하세요! 오늘은 어떤 상품을 찾고 계신가요?";
        }

        addMessage("assistant", response);
      }, 1000);
    });
  });

  // 메시지 추가 함수
  function addMessage(role, content) {
    // 첫 메시지인 경우 빈 채팅 화면 숨기기
    if (chatMessages.length === 0) {
      emptyChat.style.display = "none";
    }

    // 메시지 객체 생성
    const message = {
      id: Date.now().toString(),
      role: role,
      content: content,
      timestamp: new Date(),
    };

    // 메시지 배열에 추가
    chatMessages.push(message);

    // DOM에 메시지 추가
    const messageElement = document.createElement("div");
    messageElement.className = `message ${role}`;

    const messageBubble = document.createElement("div");
    messageBubble.className = "message-bubble";
    messageBubble.textContent = content;

    messageElement.appendChild(messageBubble);
    messages.appendChild(messageElement);

    // 스크롤을 최신 메시지로 이동
    messages.scrollTop = messages.scrollHeight;
  }
});
