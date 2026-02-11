"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    LucideFlame,
    LogOut,
    Package,
    TrendingUp,
    Users,
    Trophy,
    Search,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    MapPin,
    Phone,
    Clock,
    Loader2,
} from 'lucide-react';

interface OrderItem {
    product_name: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Order {
    id: string;
    customer_name: string;
    customer_phone: string;
    customer_city: string;
    customer_address: string;
    total_amount: number;
    status: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Na čekanju', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
    confirmed: { label: 'Potvrđena', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
    shipped: { label: 'Poslata', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
    delivered: { label: 'Isporučena', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
    cancelled: { label: 'Otkazana', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
};

const ALL_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const fetchOrders = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            // Fetch orders
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            // Fetch all order items
            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select('*');

            if (itemsError) throw itemsError;

            // Combine orders with their items
            const ordersWithItems: Order[] = (ordersData || []).map(order => ({
                ...order,
                items: (itemsData || [])
                    .filter(item => item.order_id === order.id)
                    .map(item => ({
                        product_name: item.product_name,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        total_price: item.total_price,
                    })),
            }));

            setOrders(ordersWithItems);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingStatus(orderId);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(prev =>
                prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
            );
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const formatPrice = (price: number) => price.toLocaleString('sr-RS');
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('sr-RS', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Filtrirane narudžbine
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSearch = searchQuery === '' ||
            order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_phone.includes(searchQuery);
        return matchesStatus && matchesSearch;
    });

    // Statistike
    const totalRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total_amount : sum, 0);
    const totalOrders = orders.filter(o => o.status !== 'cancelled').length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Najprodavaniji proizvod
    const productSales: Record<string, { name: string; qty: number }> = {};
    orders.forEach(o => {
        if (o.status === 'cancelled') return;
        o.items.forEach(item => {
            if (!productSales[item.product_id]) {
                productSales[item.product_id] = { name: item.product_name, qty: 0 };
            }
            productSales[item.product_id].qty += item.quantity;
        });
    });
    const topProduct = Object.values(productSales).sort((a, b) => b.qty - a.qty)[0];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Učitavam narudžbine...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LucideFlame size={24} className="text-primary" />
                        <h1 className="text-xl font-black tracking-tight">ZLO ADMIN</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:border-white/20"
                    >
                        <LogOut size={16} />
                        Odjavi se
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                                <TrendingUp size={16} className="text-green-400" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Zarada</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-black">{formatPrice(totalRevenue)} <span className="text-sm font-normal text-gray-500">RSD</span></p>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <Package size={16} className="text-blue-400" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Narudžbine</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-black">{totalOrders}</p>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <Users size={16} className="text-purple-400" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prosek</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-black">{formatPrice(avgOrderValue)} <span className="text-sm font-normal text-gray-500">RSD</span></p>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                                <Trophy size={16} className="text-yellow-400" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Proizvod</span>
                        </div>
                        <p className="text-lg md:text-xl font-black truncate">{topProduct?.name || '—'}</p>
                        {topProduct && <p className="text-xs text-gray-500 mt-1">{topProduct.qty} prodato</p>}
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Pretraži po imenu, gradu ili telefonu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-all placeholder:text-gray-600"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${statusFilter === 'all'
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                                }`}
                        >
                            Sve ({orders.length})
                        </button>
                        {ALL_STATUSES.map(status => {
                            const cfg = STATUS_CONFIG[status];
                            const count = orders.filter(o => o.status === status).length;
                            return (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${statusFilter === status
                                        ? `${cfg.bg} ${cfg.color}`
                                        : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                                        }`}
                                >
                                    {cfg.label} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Refresh */}
                    <button
                        onClick={() => fetchOrders(true)}
                        disabled={refreshing}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all shrink-0"
                    >
                        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-16">
                            <Package size={48} className="mx-auto mb-4 text-gray-700" />
                            <p className="text-gray-500">Nema narudžbina{statusFilter !== 'all' ? ` sa statusom "${STATUS_CONFIG[statusFilter]?.label}"` : ''}</p>
                        </div>
                    ) : (
                        filteredOrders.map(order => {
                            const isExpanded = expandedOrder === order.id;
                            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/15 transition-colors"
                                >
                                    {/* Order Header Row */}
                                    <button
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
                                    >
                                        {/* Status Dot */}
                                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusCfg.color.replace('text-', 'bg-')}`} />

                                        {/* Name & City */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-sm md:text-base truncate">{order.customer_name}</h3>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-0.5">
                                                <MapPin size={12} />
                                                <span>{order.customer_city}</span>
                                            </div>
                                        </div>

                                        {/* Items count */}
                                        <div className="hidden md:block text-center shrink-0 w-20">
                                            <p className="text-xs text-gray-500">Stavke</p>
                                            <p className="font-bold text-sm">{order.items.reduce((s, i) => s + i.quantity, 0)}</p>
                                        </div>

                                        {/* Total */}
                                        <div className="text-right shrink-0 w-24 md:w-32">
                                            <p className="font-black text-sm md:text-base">{formatPrice(order.total_amount)} <span className="text-xs font-normal text-gray-500">RSD</span></p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.color} hidden md:block`}>
                                            {statusCfg.label}
                                        </div>

                                        {/* Date */}
                                        <div className="hidden lg:flex items-center gap-1.5 text-gray-500 text-xs shrink-0 w-36">
                                            <Clock size={12} />
                                            {formatDate(order.created_at)}
                                        </div>

                                        {/* Expand chevron */}
                                        <div className="shrink-0 text-gray-500">
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </button>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-4 md:px-5 pb-5 border-t border-white/5 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Customer Info */}
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kupac</h4>
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-white">{order.customer_name}</p>
                                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                            <Phone size={14} />
                                                            <a href={`tel:${order.customer_phone}`} className="hover:text-white transition-colors">
                                                                {order.customer_phone}
                                                            </a>
                                                        </div>
                                                        <div className="flex items-start gap-2 text-gray-400 text-sm">
                                                            <MapPin size={14} className="mt-0.5 shrink-0" />
                                                            <span>{order.customer_address}, {order.customer_city}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-600 flex items-center gap-1.5">
                                                        <Clock size={12} />
                                                        {formatDate(order.created_at)}
                                                    </p>
                                                </div>

                                                {/* Order Items */}
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stavke</h4>
                                                    <div className="space-y-2">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex items-center justify-between bg-white/[0.03] rounded-lg p-3">
                                                                <div>
                                                                    <p className="text-sm font-bold text-white">{item.product_name}</p>
                                                                    <p className="text-xs text-gray-500">{item.quantity}x {formatPrice(item.unit_price)} RSD</p>
                                                                </div>
                                                                <p className="font-bold text-sm">{formatPrice(item.total_price)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                        <span className="text-gray-400 text-sm font-medium">Ukupno:</span>
                                                        <span className="font-black text-lg">{formatPrice(order.total_amount)} <span className="text-xs font-normal text-gray-500">RSD</span></span>
                                                    </div>
                                                </div>

                                                {/* Status Management */}
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</h4>
                                                    <div className="space-y-2">
                                                        {ALL_STATUSES.map(status => {
                                                            const cfg = STATUS_CONFIG[status];
                                                            const isActive = order.status === status;
                                                            const isUpdating = updatingStatus === order.id;

                                                            return (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => !isActive && handleStatusUpdate(order.id, status)}
                                                                    disabled={isActive || isUpdating}
                                                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${isActive
                                                                        ? `${cfg.bg} ${cfg.color}`
                                                                        : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white hover:border-white/15 cursor-pointer'
                                                                        } disabled:cursor-default`}
                                                                >
                                                                    {isUpdating && !isActive ? (
                                                                        <Loader2 size={14} className="animate-spin" />
                                                                    ) : (
                                                                        <div className={`w-2 h-2 rounded-full ${isActive ? cfg.color.replace('text-', 'bg-') : 'bg-gray-700'}`} />
                                                                    )}
                                                                    {cfg.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="text-center py-8 text-gray-600 text-xs">
                    Zlo i Naopako Admin Panel · {orders.length} narudžbin{orders.length === 1 ? 'a' : 'e'}
                </div>
            </div>
        </div>
    );
}
