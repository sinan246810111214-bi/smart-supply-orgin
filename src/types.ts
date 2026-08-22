export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  description: string;
  tagline: string;
  features: string[];
  imageUrl: string;
  gallery: string[];
  tag: string;
  rating: number;
  reviewCount: number;
  specs: Record<string, string>;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
  verified: boolean;
}

export interface OrderData {
  name: string;
  phone: string;
  address: string;
  pincode: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  timestamp: string;
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  telegramConfigured: boolean;
  message?: string;
}
