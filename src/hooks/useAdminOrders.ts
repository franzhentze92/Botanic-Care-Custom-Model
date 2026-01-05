import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// ==================== TYPES ====================

export interface AdminOrder {
  id: number;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  tracking_number: string | null;
  estimated_delivery: string | null;
  shipping_address_id: number | null;
  payment_method_id: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminOrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  product_image_url: string | null;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_custom_cream: boolean;
  custom_cream_id: number | null;
  created_at: string;
}

export interface AdminOrderWithItems extends AdminOrder {
  items: AdminOrderItem[];
  user_email?: string;
  user_name?: string;
}

// ==================== HOOKS ====================

export const useAdminOrders = () => {
  return useQuery<AdminOrderWithItems[], Error>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      // Obtener todos los pedidos
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      console.log('Orders fetched:', orders?.length || 0, orders);

      if (!orders || orders.length === 0) {
        console.log('No orders found in database');
        return [];
      }

      // Obtener items para cada pedido
      const orderIds = orders.map(o => o.id);
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) throw itemsError;

      // Obtener información de usuarios desde auth.users (si profiles no existe, usamos user_id directamente)
      const userIds = [...new Set(orders.map(o => o.user_id))];
      let users: any[] = [];
      
      // Intentar obtener desde profiles primero
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .in('id', userIds);
      
      if (profiles) {
        users = profiles;
      } else {
        // Si no hay profiles, intentar desde auth.users (requiere RLS)
        // Por ahora, solo usamos el user_id como referencia
        users = userIds.map(id => ({ id, email: '', first_name: '', last_name: '' }));
      }

      // Combinar orders con sus items y usuarios
      return orders.map(order => {
        const user = users?.find(u => u.id === order.user_id);
        return {
          ...order,
          items: (items || []).filter(item => item.order_id === order.id),
          user_email: user?.email || '',
          user_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
        } as AdminOrderWithItems;
      });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status, trackingNumber, estimatedDelivery }: {
      orderId: number;
      status: AdminOrder['status'];
      trackingNumber?: string;
      estimatedDelivery?: string;
    }): Promise<AdminOrder> => {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (trackingNumber !== undefined) {
        updateData.tracking_number = trackingNumber;
      }

      if (estimatedDelivery !== undefined) {
        updateData.estimated_delivery = estimatedDelivery;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Invalidar análisis cuando se actualiza un pedido
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin-operational-analytics'] });
      toast.success('Estado del pedido actualizado', {
        description: 'El pedido ha sido actualizado exitosamente.',
      });
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar el pedido', {
        description: error.message,
      });
    },
  });
};

