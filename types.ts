export enum CategoryEnum {
  Disinfectants = 'disinfectants',
  Equipment = 'equipment',
}

export enum DisinfectantSubCategoryEnum {
  Maini = "Dezinfectanți de mâini",
  Suprafete = "Dezinfectanți pt suprafețe",
  Instrumente = "Dezinfectanți instrumente",
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
  doc_url?: string; 
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
  doc_url?: string; // Optional field for PDF upload
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