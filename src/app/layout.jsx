// 전역 스타일 설정
import "../styles.css";

// 메타데이터 설정
export const metadata = {
  title: "쇼핑 챗봇",
  description: "쇼핑 챗봇 인터페이스",
};

// 루트 레이아웃 컴포넌트
export default function RootLayout({ children }) {
  return <div className="min-h-screen">{children}</div>;
}
