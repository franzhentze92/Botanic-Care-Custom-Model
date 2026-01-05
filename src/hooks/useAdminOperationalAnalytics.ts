import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { subDays, startOfDay, endOfDay, format, parseISO } from 'date-fns';

// ==================== TYPES ====================

export interface MonthlyOrders {
  month: string;
  orders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface ProductSales {
  product_id: number;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
  order_count: number;
  image_url?: string;
}

export interface OrderStatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface OperationalMetrics {
  totalOrders: number;
  monthlyOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  averageProcessingTime: number; // en días
  cancellationRate: number; // porcentaje
  ordersByMonth: MonthlyOrders[];
  topProducts: ProductSales[];
  ordersByStatus: OrderStatusBreakdown[];
  ordersByDayOfWeek: { day: string; count: number }[];
  ordersByHour: { hour: number; count: number }[];
}

// ==================== HOOKS ====================

export const useAdminOperationalAnalytics = (filters?: {
  startDate?: string;
  endDate?: string;
  period?: 'last_24h' | 'last_7d' | 'last_30d' | 'last_90d' | 'last_year' | 'all' | 'custom';
}) => {
  return useQuery<OperationalMetrics, Error>({
    queryKey: ['admin-operational-analytics', filters],
    refetchInterval: 30000, // Refrescar cada 30 segundos
    staleTime: 10000, // Los datos se consideran "stale" después de 10 segundos
    refetchOnWindowFocus: true, // Refrescar cuando la ventana recupera el foco
    refetchOnMount: true, // Refrescar al montar el componente
    queryFn: async () => {
      // Determinar fechas según el período seleccionado
      let startDate: Date;
      let endDate: Date = new Date();

      const today = new Date();
      switch (filters?.period) {
        case 'last_24h':
          startDate = subDays(today, 1);
          break;
        case 'last_7d':
          startDate = subDays(today, 7);
          break;
        case 'last_30d':
          startDate = subDays(today, 30);
          break;
        case 'last_90d':
          startDate = subDays(today, 90);
          break;
        case 'last_year':
          startDate = subDays(today, 365);
          break;
        case 'custom':
          startDate = filters.startDate ? parseISO(filters.startDate) : subDays(today, 30);
          endDate = filters.endDate ? parseISO(filters.endDate) : today;
          break;
        case 'all':
        default:
          startDate = new Date(2020, 0, 1);
          break;
      }

      // Formatear fechas con timezone completo para Supabase
      const startDateStr = startOfDay(startDate).toISOString();
      const endDateStr = endOfDay(endDate).toISOString();

      // Debug: Log de fechas para verificar
      console.log('Operational Analytics Date Range:', {
        period: filters?.period,
        startDate: startDateStr,
        endDate: endDateStr,
        currentYear: new Date().getFullYear()
      });

      let orders: any[] = [];
      let orderItems: any[] = [];

      try {
        // Obtener pedidos
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, status, total, created_at, updated_at, estimated_delivery')
          .gte('created_at', startDateStr)
          .lte('created_at', endDateStr)
          .order('created_at', { ascending: true });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
        } else {
          orders = ordersData || [];
          console.log(`Fetched ${orders.length} orders for operational analytics`);
          if (orders.length > 0) {
            const firstOrder = orders[0];
            const lastOrder = orders[orders.length - 1];
            console.log('Order date range:', {
              first: firstOrder.created_at,
              last: lastOrder.created_at
            });
          }
        }

        // Obtener items de pedidos con información de productos
        if (orders.length > 0) {
          const orderIds = orders.map(o => o.id);
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('order_id, product_id, quantity, unit_price, total_price, product_name, product_image_url')
            .in('order_id', orderIds);

          if (itemsError) {
            console.error('Error fetching order items:', itemsError);
          } else {
            orderItems = itemsData || [];
          }
        }
      } catch (e) {
        console.error('Exception fetching operational data:', e);
      }

      // Calcular métricas básicas
      const totalOrders = orders.length;
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyOrders = orders.filter(o => {
        const orderDate = parseISO(o.created_at);
        return orderDate >= monthStart;
      }).length;

      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + parseFloat(o.total.toString()), 0);

      const monthlyRevenue = orders
        .filter(o => {
          const orderDate = parseISO(o.created_at);
          return orderDate >= monthStart && o.status !== 'cancelled';
        })
        .reduce((sum, o) => sum + parseFloat(o.total.toString()), 0);

      const validOrders = orders.filter(o => o.status !== 'cancelled');
      const averageOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

      // Calcular tiempo promedio de procesamiento (desde created_at hasta updated_at o estimated_delivery)
      let totalProcessingTime = 0;
      let processedOrdersCount = 0;

      orders
        .filter(o => o.status === 'delivered' || o.status === 'shipped')
        .forEach(order => {
          const created = parseISO(order.created_at);
          const completed = order.updated_at ? parseISO(order.updated_at) : null;
          if (completed) {
            const diffDays = (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
            totalProcessingTime += diffDays;
            processedOrdersCount++;
          }
        });

      const averageProcessingTime = processedOrdersCount > 0 ? totalProcessingTime / processedOrdersCount : 0;

      // Tasa de cancelación
      const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
      const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

      // Pedidos por mes
      const ordersByMonthMap = new Map<string, { orders: number; revenue: number }>();
      orders
        .filter(o => o.status !== 'cancelled')
        .forEach(order => {
          const monthKey = format(parseISO(order.created_at), 'yyyy-MM');
          const current = ordersByMonthMap.get(monthKey) || { orders: 0, revenue: 0 };
          ordersByMonthMap.set(monthKey, {
            orders: current.orders + 1,
            revenue: current.revenue + parseFloat(order.total.toString()),
          });
        });

      const ordersByMonth: MonthlyOrders[] = Array.from(ordersByMonthMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          month,
          orders: data.orders,
          totalRevenue: data.revenue,
          averageOrderValue: data.orders > 0 ? data.revenue / data.orders : 0,
        }));

      // Productos más vendidos
      const productSalesMap = new Map<number, {
        product_id: number;
        product_name: string;
        total_quantity: number;
        total_revenue: number;
        order_count: number;
        image_url?: string;
      }>();

      orderItems.forEach(item => {
        const productId = item.product_id || 0;
        const productName = item.product_name || `Producto ${productId || 'N/A'}`;
        const current = productSalesMap.get(productId) || {
          product_id: productId,
          product_name: productName,
          total_quantity: 0,
          total_revenue: 0,
          order_count: 0,
          image_url: item.product_image_url,
        };

        productSalesMap.set(productId, {
          ...current,
          total_quantity: current.total_quantity + (item.quantity || 0),
          total_revenue: current.total_revenue + parseFloat((item.total_price || 0).toString()),
          order_count: current.order_count + 1,
        });
      });

      const topProducts: ProductSales[] = Array.from(productSalesMap.values())
        .filter(p => p.product_id !== 0 || p.product_name !== 'Producto N/A') // Filtrar productos inválidos
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, 10); // Top 10

      // Pedidos por estado
      const statusMap = new Map<string, number>();
      orders.forEach(order => {
        const current = statusMap.get(order.status) || 0;
        statusMap.set(order.status, current + 1);
      });

      const ordersByStatus: OrderStatusBreakdown[] = Array.from(statusMap.entries())
        .map(([status, count]) => ({
          status,
          count,
          percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);

      // Pedidos por día de la semana
      const dayOfWeekMap = new Map<string, number>();
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      
      orders.forEach(order => {
        const dayIndex = parseISO(order.created_at).getDay();
        const dayName = dayNames[dayIndex];
        const current = dayOfWeekMap.get(dayName) || 0;
        dayOfWeekMap.set(dayName, current + 1);
      });

      const ordersByDayOfWeek = dayNames.map(day => ({
        day,
        count: dayOfWeekMap.get(day) || 0,
      }));

      // Pedidos por hora del día
      const hourMap = new Map<number, number>();
      orders.forEach(order => {
        const hour = parseISO(order.created_at).getHours();
        const current = hourMap.get(hour) || 0;
        hourMap.set(hour, current + 1);
      });

      const ordersByHour = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: hourMap.get(i) || 0,
      }));

      return {
        totalOrders,
        monthlyOrders,
        totalRevenue,
        monthlyRevenue,
        averageOrderValue,
        averageProcessingTime,
        cancellationRate,
        ordersByMonth,
        topProducts,
        ordersByStatus,
        ordersByDayOfWeek,
        ordersByHour,
      };
    },
  });
};

