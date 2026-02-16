export interface AuthState {
  loading: boolean;
  user: unknown;
  isLoggedIn: boolean;
  error: string | null;
}

export interface Address {
  id?: string;
  fullName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phoneNumber?: string;
  latitude?: number;
  longitude?: number;
  pincode?: string;
  isDefault?: boolean;
}

export interface VerifyOtpData {
  phoneNumber: string;
  otp: string;
}

export interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
  loading: boolean;
  error: string | null;
}

export type ProductType = {
  _id: string;
  image: string;
  title: string;
  price: number;
  mrp: number;
  discount: number;
  quantitiy: string;
  brand: string;
  skinType: string;
};

export interface Product {
  packaging?: string | undefined;
  id: string;
  name: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  category?: string;
  subtitle?: string;
  stock?: number;
  description?: string;

  // optional richer fields for detail page
  productImages?: { id: string; url: string }[];
  productHighlights?: string;
  directionsForUse?: string;
  safetyInformation?: string;
}

export interface SearchItem {
  products: ProductType;
  id: string;
  name: string;
  price?: number;
  imageUrl?: string;
  originalPrice?: number;
  discount?: number;
  packaging?: string;
  type: 'medicine' | 'product';
}

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface UserState {
  userDetails: UserDetails | null;
  loading: boolean;
  error: string | null;
}

export type Coupon = {
  id: string;
  name: string;
  code: string;
  discount: number;
  maxUsage: number;
  expiryDate: string;
};

export interface PostOffice {
  Name: string;
  District: string;
  State: string;
}

export interface Scan {
  scan_type: string;
  scan_location: string;
  scan_date: string;
}

export interface TrackingStatus {
  Status: string;
  StatusDateTime: string;
}

export interface TrackingData {
  success: boolean;
  ShipmentData?: Array<{
    Shipment: {
      Status?: TrackingStatus;
      Scans?: Scan[];
    };
  }>;
  error?: string;
}

export interface Medicine {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  manufacturerName?: string;
  packSizeLabel?: string;
  type?: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  category?: string;
  stock?: number;
}

export interface MedicineCardProps {
  medicine: Medicine;
}

export interface PaymentMethodModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  amount: number;
  selectedAddressId?: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open(): void;
}

export interface AddressDetails {
  id: string;
  fullName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phoneNumber?: string;
}

export interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAdding: boolean;
}

export type ProductCardWrapperProps = {
  product: Product;
  favorites: Set<number | string>;
  toggleFavorite: (item: { id: string; name: string; image: string; category: string }) => void;
  handleAddToCart: (productId: string) => void;
  addingProductId: number | string | null;
};

export interface LocationType {
  address:
    | string
    | {
        id: string;
        fullName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        pincode?: string;
        phoneNumber: string;
        isDefault: boolean;
      };
  city?: string;
  state?: string;
  pincode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface LocationContextType {
  location: LocationType | null;
  setLocation: (location: LocationType | null) => void;
  addressId: string | null;
  setAddressId: (id: string | null) => void;
  isLoadingLocation?: boolean;
  setIsLoadingLocation?: (isLoading: boolean) => void;
  locationError?: string | null;
  setLocationError?: (error: string | null) => void;
  setFullAddress?: (newLocation: LocationType) => void;
}

export type CartItem = {
  id: string;
  quantity: number;
  product?: Product;
  medicine?: Medicine;
  productId?: string;
  medicineId?: string;
  combinationId?: string;
  addedAt: string;
};

export interface RawProduct {
  id: string;
  name: string;
  description: string;
  price: string | number;
  stock?: number;
  imageUrl?: string;
  subCategory?: {
    name: string;
  };
  originalPrice?: number;
  packaging?: string;
  discount?: number;
}

export interface UseProductsOptions {
  category?: string;
  limit?: number;
  page?: number;
}

export interface UseMedicinesOptions {
  type?: string;
  limit?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
  identifier?: number;
}

export interface SessionData {
  id: string;
  [key: string]: unknown;
}

export interface Session {
  sessionId: string;
  data: SessionData;
  createdAt: number;
  expiresAt: number;
}

export interface QueueMessage {
  [key: string]: unknown;
}
