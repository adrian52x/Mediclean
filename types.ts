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
  category: 'disinfectants' | 'equipment';
  stomatologie: boolean;
  medicina_generala: boolean;
  created_at: Date;
}

export interface InsertProduct {
  title: string;
  description?: string;
  price: number;
  image: string;
  doc_url?: string; // Optional field for PDF upload
  category: 'disinfectants' | 'equipment';
  stomatologie: boolean;
  medicina_generala: boolean;
}
