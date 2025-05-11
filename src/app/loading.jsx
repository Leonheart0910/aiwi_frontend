// 로딩 상태를 표시하는 컴포넌트
export default function Loading() {
  // 녹색 로딩 스피너 애니메이션, Home 컴포넌트가 로딩 중일 때 Loading 컴포넌트가 표시
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
}
