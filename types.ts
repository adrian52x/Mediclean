export enum CategoryEnum {
  Disinfectants = 'disinfectants',
  Equipment = 'equipment',
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
}

export interface InsertProduct {
  title: string;
  description?: string;
  price: number;
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


export interface UploadFileResult {
  url: string | undefined;
  path: string | undefined;
  error: any;
}

export interface ProductType {
  product_type_id: string;
  type_name: string;
}