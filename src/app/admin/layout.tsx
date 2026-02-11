"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        // Ne proveravaj auth na login stranici
        if (pathname === '/admin/login') {
            setIsChecking(false);
            setIsAuthed(true);
            return;
        }

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.replace('/admin/login');
                return;
            }

            // Proveri admin status
            const { data: adminData } = await supabase
                .from('admin_users')
                .select('id')
                .eq('id', session.user.id)
                .single();

            if (!adminData) {
                await supabase.auth.signOut();
                router.replace('/admin/login');
                return;
            }

            setIsAuthed(true);
            setIsChecking(false);
        };

        checkAuth();
    }, [pathname, router]);

    if (isChecking && pathname !== '/admin/login') {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Provera pristupa...</p>
                </div>
            </div>
        );
    }

    if (!isAuthed && pathname !== '/admin/login') return null;

    return <>{children}</>;
}
