"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Trash2,
  Download,
  RefreshCw,
  Edit,
  Eye,
} from "lucide-react";
import { Product } from "@/lib/api";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { DropdownMenu } from "./ui/DropdownMenu";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
  onBulkStatusChange?: (ids: number[]) => void;
  onBulkExport?: (ids: number[]) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkStatusChange,
  onBulkExport,
}: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  };

  const toggleOne = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const isAllSelected =
    products.length > 0 && selectedIds.size === products.length;
  const isSomeSelected = selectedIds.size > 0 && !isAllSelected;

  return (
    <div className="bg-white border border-border rounded-xl overflow-x-auto shadow-sm relative">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#F9FAFB] border-b border-border">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <input
                type="checkbox"
                className="rounded-sm border-border cursor-pointer"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected;
                }}
                onChange={toggleAll}
              />
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Product Name
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Retail Price
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Wholesale
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Stock Level
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => {
            const sku =
              product.sku || `SKU-${product.id.toString().padStart(4, "0")}`;
            const status = (product.stock || 0) > 0 ? "Active" : "Out of Stock";
            const retailPrice = product.price;
            const wholesalePrice = Number(product.price) * 0.8;
            const stockLevel = Math.min((product.stock || 0) / 100, 1) * 100;
            const stockStatus =
              (product.stock || 0) > 20
                ? "High"
                : (product.stock || 0) > 0
                  ? "Low"
                  : "Out of Stock";

            return (
              <tr
                key={product.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded-sm border-border cursor-pointer"
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleOne(product.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="w-10 h-10 bg-muted rounded border border-border shrink-0 overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {product.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground font-medium uppercase tracking-wider whitespace-nowrap">
                  {sku}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={status === "Active" ? "success" : "error"}
                    className="whitespace-nowrap"
                  >
                    {status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="neutral"
                      className="bg-muted border-none text-[10px] whitespace-nowrap"
                    >
                      {product.category}
                    </Badge>
                    {product.brand && (
                      <span className="text-[10px] text-muted-foreground">
                        +1
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-foreground whitespace-nowrap">
                  ${retailPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-xs font-bold text-foreground whitespace-nowrap">
                  ${wholesalePrice.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 min-w-[100px]">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-foreground font-semibold">
                        {product.stock || 0}
                      </span>
                      <div className="h-1 w-24 bg-muted rounded-full overflow-hidden mx-2">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            stockStatus === "High"
                              ? "bg-green-500"
                              : stockStatus === "Low"
                                ? "bg-orange-500"
                                : "bg-red-500",
                          )}
                          style={{ width: `${stockLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu
                    align="right"
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-lg"
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    }
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start h-8 px-2 text-xs font-medium w-full"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                        Edit
                      </Button>
                      <Link
                        href={`/products/${product.id}`}
                        className="flex items-center w-full h-8 px-2 text-xs font-medium hover:bg-muted rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                        View Details
                      </Link>
                      <div className="h-px bg-border my-0.5" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start h-8 px-2 text-xs font-medium w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="px-6 py-4 bg-[#F9FAFB] border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing 1 to {products.length} of {products.length} results
        </span>
        <div className="flex items-center gap-2">
          {/* Pagination dots/numbers would go here */}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[#1C1C1C] text-white px-2 py-2 rounded-full shadow-2xl flex items-center gap-1 min-w-[400px]">
            <div className="flex items-center gap-2 px-4 border-r border-white/10 mr-2">
              <span className="bg-[#FF7000] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-sm">
                {selectedIds.size}
              </span>
              <span className="text-xs font-medium whitespace-nowrap">
                {selectedIds.size} products selected
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 h-9 gap-2 text-xs font-semibold px-4"
                onClick={() => onBulkStatusChange?.(Array.from(selectedIds))}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change Status
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 h-9 gap-2 text-xs font-semibold px-4"
                onClick={() => onBulkExport?.(Array.from(selectedIds))}
              >
                <Download className="w-3.5 h-3.5" />
                Export to CSV
              </Button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                className="text-[#FF4D4D] hover:bg-red-500/10 h-9 gap-2 text-xs font-semibold px-4"
                onClick={() => onBulkDelete?.(Array.from(selectedIds))}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
