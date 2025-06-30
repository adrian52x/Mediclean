'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
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

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  totalPrice: number;
  addItem: (product: ProductDetails, quantity?: number, volume?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addItem = useCallback((product: ProductDetails, quantity: number = 1, volume?: string) => {
    //console.log('🔥 addItem called with:', { productId: product.id, quantity, volume });
    
    const itemKey = `${product.id}-${volume || 'default'}`;
    
    setCartItems(prevItems => {
      //console.log('📋 Previous cart items:', prevItems);
      
      // Check if this exact operation was already applied
      const existingItem = prevItems.find(item => item.id === itemKey);
      
      if (existingItem) {
        // Item exists, ADD the new quantity to existing quantity
        //console.log(`🛒 Updating existing item: ${existingItem.quantity} + ${quantity} = ${existingItem.quantity + quantity}`);
        
        return prevItems.map(item =>
          item.id === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // New item, add to cart
        const newItem: CartItem = {
          id: itemKey,
          productId: product.id,
          title: product.title,
          price: volume ? 
            product.product_volumes_price?.find(v => v.volume === volume)?.price || product.price :
            product.price,
          quantity,
          volume,
          image: product.product_images?.[0]?.url || '/images/mediclean-logo.jpg',
        };
        
        //console.log('🛒 Added new item:', newItem);
        return [...prevItems, newItem];
      }
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== itemId);
      //console.log('🗑️ Removed item:', itemId);
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    //console.log('🧹 Cart cleared');
  }, []);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      totalPrice, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useTestCart must be used within a CartProvider');
  }
  return context;
}