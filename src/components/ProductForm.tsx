import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/lib/api";
import { Button } from "./ui/Button";
import { Switch } from "./ui/Switch";
import { ImageIcon, UploadIcon, X } from "lucide-react";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  wholesalePrice: z
    .number()
    .positive("Wholesale price must be positive")
    .optional(),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  thumbnail: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Thumbnail URL is required"),
  stock: z.number().int().min(0, "Stock must be at least 0"),
  status: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: ProductFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.thumbnail || null
  );

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          price: Number(initialData.price),
          wholesalePrice: initialData.wholesalePrice
            ? Number(initialData.wholesalePrice)
            : undefined,
          sku: initialData.sku || "",
          category: initialData.category,
          thumbnail: initialData.thumbnail,
          stock: initialData.stock || 0,
          status: initialData.availabilityStatus === "In Stock" || true,
        }
      : {
          title: "",
          description: "",
          price: 0,
          wholesalePrice: undefined,
          sku: "",
          category: "",
          thumbnail: "",
          stock: 0,
          status: true,
        },
  });

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  const handlePreview = () => {
    const url = getValues("thumbnail");
    if (url) {
      setPreviewUrl(url);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col h-full overflow-hidden"
    >
      <div className="grow overflow-y-auto px-1 py-4 space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Image Section */}
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Product Image
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-0 overflow-hidden flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group h-48 relative">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewUrl(null)}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white text-gray-500 shadow-sm transition-all hover:scale-110"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="p-8 flex flex-col items-center">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-primary mb-1">
                    Upload a file
                  </p>
                  <p className="text-[10px] text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <div className="relative flex items-center py-2">
                <div className="grow border-t border-gray-200"></div>
                <span className="shrink mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  OR
                </span>
                <div className="grow border-t border-gray-200"></div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <input
                    {...register("thumbnail")}
                    placeholder="https://exa..."
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-10"
                  />
                  <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-9 px-4"
                  onClick={handlePreview}
                >
                  Preview
                </Button>
              </div>
              {errors.thumbnail && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Basic Info */}
          <div className="flex-1 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="e.g. Wireless Noise Cancelling Headphones"
              />
              {errors.title && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  {...register("sku")}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="SKU-1234"
                />
                {errors.sku && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.sku.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  {...register("category")}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat"
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home</option>
                  <option value="Books">Books</option>
                  <option value="Sports">Sports</option>
                  <option value="beauty">Beauty</option>
                  <option value="fragrances">Fragrances</option>
                  <option value="furniture">Furniture</option>
                  <option value="groceries">Groceries</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            Pricing & Inventory
          </h3>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Retail Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-12 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold uppercase">
                  USD
                </span>
              </div>
              {errors.price && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Wholesale Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <input
                  {...register("wholesalePrice", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-12 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              {errors.wholesalePrice && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.wholesalePrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Product Status
              </label>
              <div className="flex items-center gap-3 bg-gray-50/50 border border-gray-100 rounded-lg p-2 px-4 h-[46px]">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <span className="text-[10px] font-medium text-gray-500">
                  Visible in store
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <label className="block text-xs font-semibold text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            placeholder="Enter product description..."
          />
          {errors.description && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 bg-white sticky bottom-0 z-10">
        <Button
          type="button"
          variant="outline"
          className="px-8"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="px-8 shadow-sm" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : initialData
            ? "Update Product"
            : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
