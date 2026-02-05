"use client";

import { MoreHorizontal, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Product } from "@/lib/api";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "./ui/DropdownMenu";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const router = useRouter();
  // Mock data for new design fields if they don't exist in product
  const sku = product.sku || `SKU-${product.id.toString().padStart(4, "0")}`;
  const status = (product.stock || 0) > 0 ? "Active" : "Out of Stock";
  const retailPrice = product.price;
  const wholesalePrice = Number(product.price) * 0.8; // Example calculation
  const stockLevel = Math.min((product.stock || 0) / 100, 1) * 100;
  const stockStatus =
    (product.stock || 0) > 20
      ? "High"
      : (product.stock || 0) > 0
      ? "Low"
      : "Out of Stock";

  return (
    <div className="group relative bg-white rounded-xl border border-border p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden border border-border shrink-0">
          <img
            src={product.thumbnail || "https://via.placeholder.com/64"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 px-4 min-w-0">
          <h3 className="text-sm font-bold text-foreground truncate pr-6 group/title relative">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {sku}
            </span>
            <Badge
              variant={status === "Active" ? "success" : "error"}
              className="scale-75 origin-left"
            >
              {status}
            </Badge>
          </div>
        </div>
        <DropdownMenu
          align="right"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 rounded-lg absolute top-4 right-4"
            >
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </Button>
          }
        >
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onEdit(product)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
              Edit Product
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              Delete Product
            </button>
          </div>
        </DropdownMenu>
      </div>

      <div className="flex gap-2 mb-6">
        <Badge
          variant="neutral"
          className="bg-muted border-none text-[10px] py-0"
        >
          {product.category}
        </Badge>
        {product.brand && (
          <Badge
            variant="neutral"
            className="bg-muted border-none text-[10px] py-0"
          >
            {product.brand}
          </Badge>
        )}
      </div>

      <div className="flex justify-between mb-4">
        <div>
          <span className="text-[10px] text-muted-foreground block mb-1">
            Retail
          </span>
          <span className="text-sm font-bold text-foreground">
            ${retailPrice.toFixed(2)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-muted-foreground block mb-1">
            Wholesale
          </span>
          <span className="text-sm font-bold text-foreground">
            ${wholesalePrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 mb-2">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">
            {product.stock || 0} stock{" "}
            <span className="text-foreground font-medium">· {stockStatus}</span>
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              stockStatus === "High"
                ? "bg-green-500"
                : stockStatus === "Low"
                ? "bg-orange-500"
                : "bg-red-500"
            )}
            style={{ width: `${stockLevel}%` }}
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => router.push(`/products/${product.id}`)}
          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
