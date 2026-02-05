"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit,
  MoreVertical,
  Plus,
  Loader2,
  AlertCircle,
  Package,
  Filter,
} from "lucide-react";
import { productApi, Product } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TopNav } from "@/components/TopNav";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { ProductForm } from "@/components/ProductForm";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getOne(id as string),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => productApi.delete(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) =>
      productApi.update(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      setIsEditModalOpen(false);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.push("/")}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNav items={[{ label: product.title }]} />
      <div className="min-w-0">
        <main className="p-4 lg:p-8 pb-12 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">
                  {product.title}
                </h1>
                <Badge
                  variant="success"
                  className="bg-[#DCFCE7] text-[#166534] border-none px-3 py-1"
                >
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  SKU:{" "}
                  <span className="text-foreground font-medium">
                    {product.sku || "N/A"}
                  </span>
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>
                  Added on{" "}
                  {product.meta?.createdAt
                    ? new Date(product.meta.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex-1 md:flex-none text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 font-semibold h-11 px-6 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 md:flex-none bg-[#F97316] hover:bg-[#EA580C] text-white border-none font-semibold h-11 px-6 rounded-xl shadow-lg shadow-orange-200"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Product
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Image Section */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="aspect-square rounded-2xl bg-[#FFF8F1] overflow-hidden mb-6 flex items-center justify-center p-8">
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {(product.images?.slice(0, 3) || []).map((img, i) => (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square rounded-xl bg-slate-50 overflow-hidden cursor-pointer border-2",
                        i === 0 ? "border-[#F97316]" : "border-transparent"
                      )}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {(!product.images || product.images.length === 0) && (
                    <>
                      <div className="aspect-square rounded-xl bg-slate-50 border-2 border-transparent" />
                      <div className="aspect-square rounded-xl bg-slate-50 border-2 border-transparent" />
                      <div className="aspect-square rounded-xl bg-slate-50 border-2 border-transparent" />
                    </>
                  )}
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                    Total Sold
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-foreground">
                      1,204
                    </span>
                    <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +12%{" "}
                      <span className="text-muted-foreground font-normal">
                        this month
                      </span>
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                    Revenue
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-foreground">
                      $284k
                    </span>
                    <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +8%{" "}
                      <span className="text-muted-foreground font-normal">
                        this month
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags & Categories */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                  Tags & Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="neutral"
                    className="bg-slate-50 border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg capitalize"
                  >
                    {product.category}
                  </Badge>
                  {product.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="neutral"
                      className="bg-slate-50 border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg"
                    >
                      {tag}
                    </Badge>
                  ))}
                  <Badge
                    variant="info"
                    className="bg-[#EFF6FF] border-[#DBEAFE] text-[#1D4ED8] px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Dropship
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Pricing & Inventory Section */}
              <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    Pricing & Inventory
                  </h3>
                  <button className="text-primary text-xs font-bold hover:underline">
                    View History
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  <div className="space-y-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      Retail Price
                    </span>
                    <div className="space-y-1">
                      <div className="text-2xl font-extrabold text-foreground">
                        ${(product.price * 0.8).toFixed(2)} - $
                        {product.price.toFixed(2)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Inc. VAT
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      Wholesale Price
                    </span>
                    <div className="space-y-1">
                      <div className="text-2xl font-extrabold text-foreground">
                        ${(product.price * 0.5).toFixed(2)} - $
                        {(product.price * 0.7).toFixed(2)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Minimum order: 10
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Current Stock
                      </span>
                      <Badge className="px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#166534] text-[10px] font-bold border-none uppercase">
                        High
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="text-2xl font-extrabold text-foreground">
                        {product.stock}
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${Math.min(product.stock, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description card */}
              <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-foreground tracking-tight">
                  Description
                </h3>
                <div className="text-slate-600 leading-relaxed space-y-4 text-[15px]">
                  <p>{product.description}</p>
                  <ul className="space-y-3 list-disc pl-5">
                    <li className="pl-2">
                      High performance computing with {product.brand} quality
                    </li>
                    <li className="pl-2">
                      Premium warranty: {product.warrantyInformation}
                    </li>
                    <li className="pl-2">
                      Shipping: {product.shippingInformation}
                    </li>
                    <li className="pl-2">
                      Return Policy: {product.returnPolicy}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Variants Section */}
              <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
                <div className="p-6 lg:p-10 flex items-center justify-between border-b border-slate-50">
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    Variants (2)
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-9 px-4 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left px-8 py-4">
                          Variant
                        </th>
                        <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left px-8 py-4">
                          SKU
                        </th>
                        <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left px-8 py-4">
                          Price
                        </th>
                        <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left px-8 py-4">
                          Stock
                        </th>
                        <th className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right px-8 py-4">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[1, 2].map((v) => (
                        <tr
                          key={v}
                          className="hover:bg-slate-50/30 transition-colors"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-slate-300" />
                              <span className="text-sm font-bold text-foreground capitalize">
                                {product.brand} - Option {v}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-medium text-slate-500">
                            {product.sku}-{v}
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-foreground">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-8 py-5">
                            <Badge
                              variant="success"
                              className="bg-[#DCFCE7] text-[#166534] border-none px-2 py-0.5 text-[10px]"
                            >
                              {Math.floor(product.stock / 2)} avail
                            </Badge>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                              <Edit className="w-4 h-4 text-slate-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Product"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto">
              <Filter className="w-6 h-6 text-red-600 rotate-180" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-foreground mb-2">
                Delete Product?
              </h3>
              <p className="text-muted-foreground">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  "{product.title}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 text-white border-none"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Product"
        >
          <ProductForm
            initialData={product}
            onSubmit={(data) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
}
