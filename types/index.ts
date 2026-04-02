// ============================================================
// User & Auth Types
// ============================================================

export type Role = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  image: string | null;
  createdAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  image?: string | null;
}

// ============================================================
// Category Types
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count?: {
    products: number;
  };
  createdAt: Date;
}

// ============================================================
// Product Types
// ============================================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  featured: boolean;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface ProductFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "price_asc" | "price_desc" | "newest" | "name_asc";
}

export interface PaginatedProducts {
  products: ProductWithCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Cart Types
// ============================================================

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// ============================================================
// Order Types
// ============================================================

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  stripeId: string | null;
  shippingAddress: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// ============================================================
// Form Types
// ============================================================

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  featured: boolean;
  categoryId: string;
}

// ============================================================
// Dashboard Types
// ============================================================

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  revenueByMonth: Array<{ month: string; revenue: number }>;
}
