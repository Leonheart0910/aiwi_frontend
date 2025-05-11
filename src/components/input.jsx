// 입력 컴포넌트 (채팅 인터페이스)
export function Input({
  className = "",
  type = "text",
  value,
  onChange,
  placeholder,
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
