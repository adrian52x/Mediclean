'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductDetails } from '@/types';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  volume?: string;
  image: string;
}

interface CartStore {
  cartItems: CartItem[];
  // Computed properties
  cartCount: number;
  totalPrice: number;
  // Actions
  addItem: (product: ProductDetails, quantity?: number, volume?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

// Helper function to calculate computed values
const calculateComputedValues = (cartItems: CartItem[]) => {
  const cartCount = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
  return { cartCount, totalPrice };
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cartItems: [],
            cartCount: 0,
            totalPrice: 0,

            // Actions
            addItem: (product: ProductDetails, quantity = 1, volume?: string) => {
                //console.log('🛒 Zustand addItem called:', { productId: product.id, quantity, volume });
                
                const itemKey = `${product.id}_${volume || 'default'}`;
                
                set((state: CartStore) => {
                    const existingItemIndex = state.cartItems.findIndex((item: CartItem) => item.id === itemKey);
                    
                    let newCartItems: CartItem[];
                    
                    if (existingItemIndex > -1) {
                        // Item exists, update quantity
                        newCartItems = [...state.cartItems];
                        newCartItems[existingItemIndex].quantity += quantity;
                        //console.log(`🛒 Updated existing item: ${newCartItems[existingItemIndex].title} quantity: ${newCartItems[existingItemIndex].quantity}`);
                    } else {
                        // New item, add to cart
                        const newItem: CartItem = {
                        id: itemKey,
                        productId: product.id,
                        title: product.title,
                        price: volume 
                            ? product.product_volumes_price?.find((v: any) => v.volume === volume)?.price || product.price
                            : product.price,
                        quantity,
                        volume,
                        image: product.product_images?.[0]?.url || '/images/mediclean-logo.jpg',
                        };
                        
                        //console.log('🛒 Added new item:', newItem);
                        newCartItems = [...state.cartItems, newItem];
                    }
                    
                    // Calculate computed values with the new cart items
                    const { cartCount, totalPrice } = calculateComputedValues(newCartItems);
                    
                    return { 
                        cartItems: newCartItems,
                        cartCount,
                        totalPrice
                    };
                });
            },

            removeItem: (itemId: string) => {
                //console.log('🗑️ Removing item:', itemId);
                set((state: CartStore) => {
                    const newCartItems = state.cartItems.filter((item: CartItem) => item.id !== itemId);
                    const { cartCount, totalPrice } = calculateComputedValues(newCartItems);
                    
                    return {
                        cartItems: newCartItems,
                        cartCount,
                        totalPrice
                    };
                });
            },

            updateQuantity: (itemId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }

                //console.log('📝 Updating quantity:', itemId, 'to', quantity);
                set((state: CartStore) => {
                    const newCartItems = state.cartItems.map((item: CartItem) =>
                        item.id === itemId ? { ...item, quantity } : item
                    );
                    const { cartCount, totalPrice } = calculateComputedValues(newCartItems);
                    
                    return {
                        cartItems: newCartItems,
                        cartCount,
                        totalPrice
                    };
                });
            },

            clearCart: () => {
                //console.log('🧹 Clearing cart');
                set({ cartItems: [], cartCount: 0, totalPrice: 0 });
            },
        }),
        {
            name: 'mediclean-cart-storage', // localStorage key
            partialize: (state: CartStore) => ({ cartItems: state.cartItems }), // Only persist cartItems
            onRehydrateStorage: () => (state) => {
                // Recalculate computed values after rehydration from localStorage
                if (state) {
                    const { cartCount, totalPrice } = calculateComputedValues(state.cartItems);
                    state.cartCount = cartCount;
                    state.totalPrice = totalPrice;
                }
            },
        }
    )
);
