import { supabase } from '@/lib/supabase';

// Vraća id-jeve proizvoda koji trenutno nisu na stanju.
// Ako čitanje ne uspe, ništa se ne blokira da prodaja ne bi stala.
export async function fetchOutOfStock(): Promise<string[]> {
    const { data, error } = await supabase
        .from('product_stock')
        .select('product_id')
        .eq('in_stock', false);

    if (error) {
        console.error('Failed to fetch stock:', error);
        return [];
    }

    return (data || []).map(row => row.product_id);
}
