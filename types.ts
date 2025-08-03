export enum CategoryEnum {
  Disinfectants = 'disinfectants',
  Equipment = 'equipment',
}

export enum DisinfectantVolumeEnum {
  V100ml = "100ml",
  V500ml = "500ml",
  V750ml = "750ml",
  V1L = "1L",
  V1_5L = "1.5L",
  V2L = "2L",
  V5L = "5L",
}

export enum PriceTypeEnum {
  Fixed = 'fixed',
  Volume = 'volume',
}

export interface UserDetails {
  id: string;
  email: string;
}

export interface ProductDetails {
  id: string;
  title: string;
  description: string | null; // Nullable field in supabase
  price: number;
  image: string;
  doc_url?: string | null; 
  category: CategoryEnum;
  stomatologie: boolean;
  medicina_generala: boolean;
  created_at: Date;
  updated_at: Date;
  product_type: { type_name: string };
  product_images: { url: string }[];
  product_volumes_price: { volume: string; price: number }[];
}

export interface InsertProduct {
  title: string;
  description?: string;
  price: number | null; // Nullable field for price
  doc_url?: string | null; // Nullable field for document URL
  category: CategoryEnum;
  product_type: string; // UUID of the product type
  stomatologie: boolean;
  medicina_generala: boolean;
}

export interface InsertProductImage {
  product_id: string;
  url: string;
}

export interface InsertProductVolumePrice {
  product_id: string;
  volume: string;
  price: number;
}


export interface UploadFileResult {
  url: string | undefined;
  path: string | undefined;
  error: any;
}

export interface ProductType {
  product_type_id: string;
  type_name: string;
}


export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number | null; // Nullable field for price
  quantity: number;
  volume?: string; // For disinfectants with different volumes
  image: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Product filtering utilities
export interface ProductFilters {
    categories: string[];
    productTypes: string[];
    medicalFields: string[];
}

export type DeliveryMethod = 'delivery' | 'postalDelivery';
export interface OrderFormData {
    // Customer Info
    name: string;
    phone: string;
    email: string;
    bankDetails: string;
    // Delivery
    deliveryMethod: DeliveryMethod;
    address: string;
    city: string;
    postalCode: string;
    notes: string;
}

export interface OrderDetails {
  orderId: string;
  timestamp: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    bankDetails: string;
  };
  delivery: {
    method: string;
    address: any;
    notes: string;
  };
  items: Array<{
    productId: string;
    title: string;
    volume?: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  summary: {
    totalItems: number;
    totalPrice: number;
    deliveryFee: number;
    finalTotal: number;
    currency: string;
  };
}