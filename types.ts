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
  discount: number;
  created_at: Date;
}
