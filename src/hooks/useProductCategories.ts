import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductCategoryData {
  id: string; // slug
  name: string;
  description?: string | null;
  image_url?: string | null;
  icon?: string | null;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateProductCategoryData extends Partial<CreateProductCategoryData> {
  id: string;
}

// Hook para obtener todas las categorías
export const useProductCategories = () => {
  return useQuery<ProductCategory[], Error>({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Hook para obtener solo categorías activas (para uso público)
export const useActiveProductCategories = () => {
  return useQuery<ProductCategory[], Error>({
    queryKey: ['active-product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Hook para crear una categoría
export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: CreateProductCategoryData): Promise<ProductCategory> => {
      const { data, error } = await supabase
        .from('product_categories')
        .insert([{
          ...categoryData,
          display_order: categoryData.display_order ?? 0,
          is_active: categoryData.is_active ?? true,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      queryClient.invalidateQueries({ queryKey: ['active-product-categories'] });
      toast.success('Categoría creada exitosamente', {
        description: 'La categoría ha sido agregada a la base de datos',
      });
    },
    onError: (error: Error) => {
      toast.error('Error al crear categoría', {
        description: error.message,
      });
    },
  });
};

// Hook para actualizar una categoría
export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateProductCategoryData): Promise<ProductCategory> => {
      const { data, error } = await supabase
        .from('product_categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      queryClient.invalidateQueries({ queryKey: ['active-product-categories'] });
      toast.success('Categoría actualizada exitosamente', {
        description: 'Los cambios han sido guardados',
      });
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar categoría', {
        description: error.message,
      });
    },
  });
};

// Hook para eliminar una categoría
export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      queryClient.invalidateQueries({ queryKey: ['active-product-categories'] });
      toast.success('Categoría eliminada exitosamente', {
        description: 'La categoría ha sido removida de la base de datos',
      });
    },
    onError: (error: Error) => {
      toast.error('Error al eliminar categoría', {
        description: error.message,
      });
    },
  });
};

