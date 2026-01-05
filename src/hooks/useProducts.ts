import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Product, productToUI, ProductUI } from '@/types/product';

export interface UseProductsOptions {
  category?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  nutrientId?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async (): Promise<ProductUI[]> => {
      // If filtering by nutrient, we need to join with product_nutrients
      if (options.nutrientId) {
        // First, get product IDs that have this nutrient
        const { data: productNutrients, error: pnError } = await supabase
          .from('product_nutrients')
          .select('product_id')
          .eq('nutrient_id', options.nutrientId);

        if (pnError) {
          throw new Error(`Failed to fetch product nutrients: ${pnError.message}`);
        }

        const productIds = (productNutrients || []).map(pn => pn.product_id);

        if (productIds.length === 0) {
          return []; // No products with this nutrient
        }

        // Now query products with these IDs
        let query = supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .in('id', productIds)
          .order('created_at', { ascending: false });

        // Apply other filters
        if (options.category && options.category !== 'all') {
          query = query.eq('category', options.category);
        }

        if (options.minPrice !== undefined) {
          query = query.gte('price', options.minPrice);
        }

        if (options.maxPrice !== undefined) {
          query = query.lte('price', options.maxPrice);
        }

        if (options.searchQuery) {
          query = query.or(
            `name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`
          );
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(`Failed to fetch products: ${error.message}`);
        }

        return (data || []).map(productToUI);
      } else {
        // Normal query without nutrient filter
        let query = supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .order('created_at', { ascending: false });

        // Apply filters
        if (options.category && options.category !== 'all') {
          query = query.eq('category', options.category);
        }

        if (options.minPrice !== undefined) {
          query = query.gte('price', options.minPrice);
        }

        if (options.maxPrice !== undefined) {
          query = query.lte('price', options.maxPrice);
        }

        if (options.searchQuery) {
          query = query.or(
            `name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`
          );
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(`Failed to fetch products: ${error.message}`);
        }

        return (data || []).map(productToUI);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<ProductUI | null> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      return data ? productToUI(data as Product) : null;
    },
    enabled: !!id,
  });
}

