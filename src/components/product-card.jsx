import { Button } from "../components/ui/button";
import { ShoppingCart } from "lucide-react";

// 상품 카드 컴포넌트 (장바구니에서 사용할 예정)
export function ProductCard({ title, price, imageUrl, store }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="relative h-40 w-full">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500">{store}</p>
        <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
        <p className="font-bold text-sm mt-1">{price}</p>
        <Button size="sm" className="w-full mt-2 flex items-center gap-1">
          <ShoppingCart className="h-4 w-4" />
          <span>장바구니 담기</span>
        </Button>
      </div>
    </div>
  );
}
