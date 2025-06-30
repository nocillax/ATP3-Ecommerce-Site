// IN: src/types/index.ts
// ACTION: Create this new file and add this code.

export interface OrderItem {
  name: string;
  variantInfo: string;
  imageUrl: string;
  quantity: number;
  originalPrice: number;
  discount: number;
  price: number; // final price per item
  subtotal: number;
}

export interface Order {
  id: string;
  databaseId: number;
  customer: string;
  date: string | Date; // Can be a string or Date object
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  shippingAddress: string;
  paymentStatus: "UNPAID" | "PAID";
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface BrandForm {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string; // Add optional imageUrl
  isFeatured?: boolean; // Add optional isFeatured
  createdAt?: string; // Add optional createdAt for sorting
  updatedAt?: string; // Add optional updatedAt for sorting
}

export interface CategoryForm {
  name: string;
  description?: string;
  isFeatured?: boolean;
}

export interface ProductVariant {
  id: number;
  color: string;
  imageUrls: string[]; // This is now a clean array of strings
  stock: number;
  priceOverride?: number | null; // This is now a number or null
}

export interface Product {
  id: number;
  name: string;
  subtitle: string;
  brand: Brand;
  price: number; // This is now a number
  cost: number; // This is now a number
  rating: number; // This is now a number
  reviewCount: number;
  imageUrls: string[]; // This is now a clean array of strings
  isOnSale: boolean;
  discountPercent: number; // This is now a number
  isFeatured: boolean;
  isActive: boolean;
  categories: Category[];
  variants: ProductVariant[];
  reviews?: any[]; // Define a Review type later if needed
  createdAt: string;
  updatedAt: string;
  description?: string; // Optional description field
}

export interface VariantForm {
  id?: number;
  color: string;
  stock: number; // The form will manage this as a number
  priceOverride?: number; // This is also a number
  imageUrls?: string[];
  newImages?: File[];
}

export interface ProductForm {
  name: string;
  subtitle: string;
  description: string;
  brandId: number; // The form will manage this as a number
  categoryIds: number[]; // An array of numbers
  price: number; // The form will manage this as a number
  cost: number; // The form will manage this as a number
  discountPercent: number; // The form will manage this as a number
  isActive: boolean;
  isOnSale: boolean;
  isFeatured: boolean;
  imageUrls?: string[];
  newImages?: File[];
  variants: VariantForm[];
}

export interface ReviewUser {
  id: number;
  name: string;
}

// Represents a single review object
export interface Review {
  id: number;
  rating: number | string; // API sends a string, so we allow both
  comment: string;
  user: ReviewUser;
  createdAt: string;
  updatedAt: string;
}

export interface CartProduct {
  id: number;
  name: string;
  imageUrls: string[];
  brand: {
    name: string;
  };
}

// A simplified version of ProductVariant for use in the cart
export interface CartProductVariant {
  id: number;
  color: string;
  priceOverride: number | null;
  product: CartProduct; // This will be a simplified Product type
  imageUrls: string[]; // Array of image URLs for the variant
}

// Represents a single item within the cart
export interface CartItem {
  id: number;
  quantity: number;
  price: number; // This is the line total (unit price * quantity)
  productVariant: CartProductVariant;
  unitPrice: number; // The effective unit price for this item
  originalUnitPrice: number; // The original unit price before any discounts
}

// Represents the entire cart object
export interface Cart {
  id: number;
  totalPrice: number;
  cartItems: CartItem[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
  phone: string | null;
  defaultShippingAddress: string | null;
}

export interface HeroImage {
  id: number;
  title: string;
  imageUrl: string; // The path to the uploaded image
  linkUrl: string; // The URL the "Shop Now" button will go to
  isActive: boolean; // Toggle to easily show/hide banners
  displayOrder: number; // To control the order in the slideshow
}

export interface HeroImageForm {
  title: string;
  linkUrl: string;
  isActive?: boolean;
  displayOrder?: number;
  imageUrl?: string; // Optional for updates
  newImage?: File; // Optional for new uploads
}
