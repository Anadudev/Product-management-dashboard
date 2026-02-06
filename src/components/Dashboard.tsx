"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  RotateCcw,
  LayoutGrid,
  List as ListIcon,
  X,
} from "lucide-react";
import { productApi, Product } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { ProductForm } from "./ProductForm";
import { TopNav } from "./TopNav";
import { ProductTable } from "./ProductTable";
import { Select } from "./ui/Select";
import { DropdownMenu } from "./ui/DropdownMenu";
import { toast } from "sonner";
import { AxiosError } from "axios";

const TABS = ["All", "Active", "Draft", "Archived"];

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState("Category");
  const [type, setType] = useState("Type");
  const [bulkIdsToDelete, setBulkIdsToDelete] = useState<number[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const isFiltered =
    search !== "" ||
    category !== "Category" ||
    type !== "Type" ||
    showOutOfStock ||
    onSaleOnly;

  const resetFilters = () => {
    setSearch("");
    setCategory("Category");
    setType("Type");
    setShowOutOfStock(false);
    setOnSaleOnly(false);
    setPage(1);
  };

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "products",
      page,
      search,
      activeTab,
      category,
      type,
      showOutOfStock,
      onSaleOnly,
    ],
    queryFn: () =>
      productApi.getAll({
        page,
        limit: 8,
        search,
        status: activeTab,
        category,
        type,
        showOutOfStock,
        onSaleOnly,
      }),
  });

  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsAddModalOpen(false);
      toast.success("Product created successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) =>
      productApi.update(selectedProduct!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsEditModalOpen(false);
      toast.success("Product updated successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDeleteModalOpen(false);
      toast.success("Product deleted successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    const product = products?.find((p) => p.id === id);
    setSelectedProduct(product || null);
    setIsDeleteModalOpen(true);
  };

  const handleBulkDeleteClick = (ids: number[]) => {
    setBulkIdsToDelete(ids);
    setIsBulkDeleteModalOpen(true);
  };

  const handleBulkStatusChange = async (ids: number[]) => {
    try {
      await Promise.all(
        ids.map((id) => productApi.update(id, { stock: 0 })), // Mocking status change by setting stock to 0
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`${ids.length} products updated successfully`);
    } catch (error) {
      toast.error("Failed to update some products");
    }
  };

  const handleBulkExport = (ids: number[]) => {
    const selectedProducts = products?.filter((p) => ids.includes(p.id)) || [];
    const headers = ["ID", "Title", "Category", "Price", "Stock", "SKU"];
    const csvContent = [
      headers.join(","),
      ...selectedProducts.map((p) =>
        [p.id, p.title, p.category, p.price, p.stock, p.sku].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "products_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${ids.length} products exported successfully`);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          We couldn&apos;t load the products. Please try again.
        </p>
        <Button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["products"] })
          }
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <TopNav />
      <main className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-lg"
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-lg"
              >
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-2 flex-1 sm:flex-initial"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">View Settings</span>
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 flex-1 sm:flex-initial"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8 flex items-center justify-between">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
            <button className="pb-4 text-sm font-medium text-muted-foreground hover:text-foreground">
              + View
            </button>
          </div>
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none bg-white transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Select
              className="w-full sm:w-auto"
              label="Category"
              options={[
                { label: "Electronics", value: "electronics" },
                { label: "Clothing", value: "clothing" },
                { label: "Home", value: "home" },
                { label: "Beauty", value: "beauty" },
                { label: "Fragrances", value: "fragrances" },
                { label: "Furniture", value: "furniture" },
                { label: "Groceries", value: "groceries" },
                { label: "Home Decoration", value: "home-decoration" },
                { label: "Kitchen", value: "kitchen" },
                { label: "Lighting", value: "lighting" },
                { label: "Mattresses", value: "mattresses" },
                { label: "Skincare", value: "skincare" },
                { label: "Sports", value: "sports" },
                { label: "Watches", value: "watches" },
              ]}
              value={category === "Category" ? "" : category}
              onChange={(val) => setCategory(val)}
            />
            <Select
              className="w-full sm:w-auto"
              label="Type"
              options={[
                { label: "Physical", value: "physical" },
                { label: "Digital", value: "digital" },
                { label: "Service", value: "service" },
              ]}
              value={type === "Type" ? "" : type}
              onChange={(val) => setType(val)}
            />
            <DropdownMenu
              trigger={
                <Button
                  variant="outline"
                  className="gap-2 font-semibold h-[42px] w-full sm:w-auto justify-between sm:justify-start"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Advance Filter
                  </div>
                </Button>
              }
            >
              <div className="space-y-4 p-2">
                <h4 className="font-bold text-sm">Filter Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOutOfStock}
                      onChange={(e) => setShowOutOfStock(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    Show out of stock
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={(e) => setOnSaleOnly(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    On Sale only
                  </label>
                </div>
              </div>
            </DropdownMenu>
            {isFiltered && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="gap-2 font-semibold h-[42px] w-full sm:w-auto justify-between sm:justify-start px-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
                Reset
              </Button>
            )}
            <div className="flex border border-border rounded-lg overflow-hidden bg-white w-full sm:w-auto justify-center">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors flex-1 sm:flex-none ${
                  viewMode === "grid"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <LayoutGrid className="w-4 h-4 mx-auto" />
              </button>
              <div className="w-px bg-border" />
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors flex-1 sm:flex-none ${
                  viewMode === "list"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <ListIcon className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-white rounded-xl border border-border p-8">
            <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              No products found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or add a new product.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <ProductTable
            products={products || []}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onBulkDelete={handleBulkDeleteClick}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkExport={handleBulkExport}
          />
        )}

        {/* Pagination */}
        {!isLoading && products && products.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing Page{" "}
              <span className="font-semibold text-foreground">{page}</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg px-4"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg px-4"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
      >
        <ProductForm
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
      >
        {selectedProduct && (
          <ProductForm
            initialData={selectedProduct}
            onSubmit={(data) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

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
                &quot;{selectedProduct?.title}&quot;
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
              onClick={() => deleteMutation.mutate(selectedProduct!.id)}
              disabled={deleteMutation.isPending}
              className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 text-white border-none"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        title="Delete Multiple Products"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto">
            <Filter className="w-6 h-6 text-red-600 rotate-180" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Delete {bulkIdsToDelete.length} Products?
            </h3>
            <p className="text-muted-foreground">
              Are you sure you want to delete these products? This action cannot
              be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteModalOpen(false)}
              className="flex-1 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                try {
                  await Promise.all(
                    bulkIdsToDelete.map((id) => productApi.delete(id)),
                  );
                  queryClient.invalidateQueries({ queryKey: ["products"] });
                  setIsBulkDeleteModalOpen(false);
                  toast.success("Products deleted successfully");
                } catch (error) {
                  toast.error("Failed to delete some products");
                }
              }}
              className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Delete All
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// Helper icons for the Dashboard
function Settings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
