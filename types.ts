export interface UserDetails {
    id: number;
    email: string;
}

export interface ProductDetails {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    discount: number;
    created_at: Date;
}