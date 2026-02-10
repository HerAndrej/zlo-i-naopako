"use client";

import { X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedProduct: string | null;
}

export default function CheckoutModal({ isOpen, onClose, selectedProduct }: CheckoutModalProps) {
    const [step, setStep] = useState(1); // 1 = Form, 2 = Success
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        email: ''
    });

    // Reset when opened
    useEffect(() => {
        if (isOpen) setStep(1);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setStep(2);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-fade-in overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {step === 1 ? (
                    <>
                        <div className="mb-8 text-center">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Brza Isporuka</span>
                            <h3 className="text-3xl font-black text-white mb-2">Unesi podatke</h3>
                            <p className="text-gray-400 text-sm">
                                Naručujete: <span className="text-white font-bold">{selectedProduct || "Zlo Paket"}</span>
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
                                className="w-full bg-primary hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] mt-4"
                            >
                                POTVRDI NARUDŽBINU
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="py-12 text-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={40} className="text-green-500" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4">Hvala, {formData.name.split(' ')[0]}!</h3>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                            Tvoja narudžbina je primljena. Spremi nepca, nevolja stiže uskoro.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            Zatvori
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
