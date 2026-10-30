"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { fetchOutOfStock } from '@/lib/stock';
import { pratiDogadjaj } from '@/lib/meta';

export interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    addToCart: (product: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    totalPrice: number;
    totalItems: number;
    isInStock: (id: string) => boolean;
    refreshStock: () => Promise<string[]>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [outOfStock, setOutOfStock] = useState<string[]>([]);

    const refreshStock = useCallback(async () => {
        const ids = await fetchOutOfStock();
        setOutOfStock(ids);
        return ids;
    }, []);

    useEffect(() => {
        let active = true;
        fetchOutOfStock().then(ids => {
            if (active) setOutOfStock(ids);
        });
        return () => { active = false; };
    }, []);

    const isInStock = useCallback((id: string) => !outOfStock.includes(id), [outOfStock]);

    const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
        if (outOfStock.includes(product.id)) return;
        pratiDogadjaj('AddToCart', {
            content_ids: [product.id],
            content_name: product.name,
            content_type: 'product',
            value: product.price,
            currency: 'RSD',
        });
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsOpen(true);
    }, [outOfStock]);

    const removeFromCart = useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(item => item.id !== id));
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => setItems([]), []);
    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, isOpen, addToCart, removeFromCart, updateQuantity,
            clearCart, openCart, closeCart, totalPrice, totalItems,
            isInStock, refreshStock
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}
