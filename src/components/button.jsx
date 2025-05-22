// 버튼 컴포넌트
export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  onClick,
  ...props
}) {
  // 버튼 기본 스타일
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  // 버튼 변형
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 hover:bg-gray-100",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "hover:bg-gray-100",
    link: "underline-offset-4 hover:underline text-blue-600",
  };

  // 버튼 크기
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };

  // 버튼 변형 스타일
  const variantStyle = variants[variant] || variants.default;
  // 버튼 크기 스타일
  const sizeStyle = sizes[size] || sizes.default;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
