import axios from "axios";

// Using a generic mock API URL from mockapi.io
// In a real project, this would be in an environment variable
const BASE_URL = "https://dummyjson.com/";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
  wholesalePrice?: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  showOutOfStock?: boolean;
  onSaleOnly?: boolean;
}

export const productApi = {
  getAll: async (filters: ProductFilters = {}) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      type,
      status,
      showOutOfStock,
      onSaleOnly,
    } = filters;

    // Fetch a larger dataset to perform client-side filtering effectively
    // note: API limitation: dummyjson doesn't support complex combined filters well
    let endpoint = "/products?limit=100";
    if (search) {
      endpoint = `/products/search?q=${search}&limit=100`;
    } else if (category && category !== "Category") {
      endpoint = `/products/category/${category}?limit=100`;
    }

    const response = await api.get<{ products: Product[] }>(endpoint);
    let filteredProducts = response.data.products;

    // Client-side filtering
    filteredProducts = filteredProducts.filter((product) => {
      // Filter by Type (Mock logic based on tags or category)
      if (type && type !== "Type") {
        const productType = product.tags?.some((t) =>
          t.toLowerCase().includes(type.toLowerCase()),
        )
          ? type
          : "physical"; // Default to physical
        if (type === "digital" && !product.tags?.includes("digital"))
          return false;
      }

      // Filter by Status (Mock logic)
      if (status && status !== "All") {
        if (status === "Active" && product.stock === 0) return false;
        if (status === "Draft" && product.stock > 0) return false; // Mock draft as 0 stock? Or customized
        if (status === "Archived" && product.stock > 0) return false;
      }

      // Filter by Stock
      if (!showOutOfStock && product.stock === 0) {
        return false;
      }

      // Filter by Sale
      if (onSaleOnly && product.discountPercentage <= 0) {
        return false;
      }

      return true;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredProducts.slice(startIndex, endIndex);
  },
  getOne: async (id: number | string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
  create: async (product: Partial<Product>) => {
    const response = await api.post<Product>("/products/add", product);
    return response.data;
  },
  update: async (id: number | string, product: Partial<Product>) => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
