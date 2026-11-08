import { supabase } from '@/lib/supabase';

// Vraća id-jeve proizvoda koji se trenutno prave: mogu da se poruče, ali je rok isporuke 7 dana.
// Ako čitanje ne uspe, vraća praznu listu.
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
