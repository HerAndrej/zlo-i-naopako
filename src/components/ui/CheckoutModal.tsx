"use client";

import { X, Check, Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function CheckoutModal() {
    const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const [step, setStep] = useState(1); // 1 = Cart, 2 = Form, 3 = Success
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
    });

    // Reset to cart step when opened
    useEffect(() => {
        if (isOpen) setStep(1);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setStep(3);
            clearCart();
        }, 800);
    };

    const handleAddMore = () => {
        closeCart();
        setTimeout(() => {
            document.getElementById('sosevi')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const formatPrice = (price: number) => price.toLocaleString('sr-RS');

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
                onClick={closeCart}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-t-3xl md:rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.15)] animate-fade-in max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
                    {step === 2 ? (
                        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                            <ArrowLeft size={16} />
                            Nazad na korpu
                        </button>
                    ) : step === 1 ? (
                        <div className="flex items-center gap-2">
                            <ShoppingCart size={18} className="text-primary" />
                            <span className="font-bold text-white">Korpa</span>
                            {items.length > 0 && (
                                <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {items.length}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div />
                    )}
                    <button
                        onClick={closeCart}
                        className="p-2 text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 overscroll-contain">

                    {/* === STEP 1: CART === */}
                    {step === 1 && (
                        <div className="p-6">
                            {items.length === 0 ? (
                                <div className="py-12 text-center">
                                    <ShoppingCart size={48} className="mx-auto mb-4 text-gray-700" />
                                    <p className="text-gray-500 mb-6">Korpa je prazna</p>
                                    <button
                                        onClick={handleAddMore}
                                        className="bg-primary text-white font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform"
                                    >
                                        Pogledaj soseve →
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Cart Items */}
                                    <div className="space-y-4">
                                        {items.map(item => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4 bg-white/[0.03] rounded-2xl p-3 border border-white/5 hover:border-white/10 transition-colors"
                                            >
                                                {/* Product Image */}
                                                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-auto object-contain"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-white text-sm md:text-base truncate">{item.name}</h4>
                                                    <p className="text-gray-500 text-xs md:text-sm">{formatPrice(item.price)} RSD</p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-7 md:w-8 text-center text-white font-bold text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Line Total & Remove */}
                                                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                                    <span className="text-white font-bold text-sm md:text-base whitespace-nowrap">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-600 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="mt-6 pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-gray-400 font-medium">Ukupno:</span>
                                            <span className="text-2xl md:text-3xl font-black text-white">
                                                {formatPrice(totalPrice)} <span className="text-sm font-normal text-gray-500">RSD</span>
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={() => setStep(2)}
                                                className="w-full bg-primary hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                                            >
                                                NASTAVI NA PORUDŽBINU →
                                            </button>
                                            <button
                                                onClick={handleAddMore}
                                                className="w-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 font-medium py-3 rounded-xl transition-all text-sm"
                                            >
                                                + Dodaj još proizvoda
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* === STEP 2: FORM === */}
                    {step === 2 && (
                        <div className="p-6">
                            <div className="mb-6 text-center">
                                <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Brza Isporuka</span>
                                <h3 className="text-2xl font-black text-white mb-1">Unesi podatke</h3>
                                <p className="text-gray-500 text-sm">
                                    {items.length} {items.length === 1 ? 'proizvod' : items.length < 5 ? 'proizvoda' : 'proizvoda'} · <span className="text-white font-bold">{formatPrice(totalPrice)} RSD</span>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Ime i Prezime</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-700"
                                        placeholder="npr. Petar Petrović"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Grad</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                            placeholder="Beograd"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Adresa</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                            placeholder="Ulica i broj"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Telefon</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                        placeholder="06x xxx xxxx"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                {/* Pay on Delivery Info */}
                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 items-start">
                                    <div className="mt-1"><Check size={16} className="text-primary" /></div>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Plaćanje se vrši <strong className="text-white">pouzećem</strong> kuriru prilikom preuzimanja. Isporuka je obično u roku od 1-2 radna dana.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] mt-2"
                                >
                                    POTVRDI NARUDŽBINU
                                </button>
                            </form>
                        </div>
                    )}

                    {/* === STEP 3: SUCCESS === */}
                    {step === 3 && (
                        <div className="p-6 py-12 text-center">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4">Hvala, {formData.name.split(' ')[0]}!</h3>
                            <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                                Tvoja narudžbina je primljena. Spremi nepca, nevolja stiže uskoro.
                            </p>
                            <button
                                onClick={closeCart}
                                className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Zatvori
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
