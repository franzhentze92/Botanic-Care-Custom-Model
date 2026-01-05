import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  MapPin, 
  CreditCard, 
  Bell, 
  Shield, 
  Star,
  Eye,
  Download,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Plus,
  Search,
  Loader2,
  X,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  useOrders,
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  usePaymentMethods,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
  useUserProfile,
  useUpdateUserProfile,
  Address,
  PaymentMethod,
  CreateAddressData,
  CreatePaymentMethodData,
  Order,
} from '@/hooks/useDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para modales
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [deleteAddressId, setDeleteAddressId] = useState<number | null>(null);
  const [deletePaymentId, setDeletePaymentId] = useState<number | null>(null);

  // Hooks de datos
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const { data: paymentMethods = [], isLoading: paymentMethodsLoading } = usePaymentMethods();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();

  // Hooks de mutaciones
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const createPaymentMutation = useCreatePaymentMethod();
  const updatePaymentMutation = useUpdatePaymentMethod();
  const deletePaymentMutation = useDeletePaymentMethod();
  const updateProfileMutation = useUpdateUserProfile();

  // Estados para formularios
  const [addressForm, setAddressForm] = useState<CreateAddressData>({
    type: 'home',
    name: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'Guatemala',
    is_default: false,
    phone: '',
  });

  const [paymentForm, setPaymentForm] = useState<CreatePaymentMethodData>({
    type: 'card',
    card_brand: '',
    last4: '',
    expiry_month: undefined,
    expiry_year: undefined,
    cardholder_name: '',
    paypal_email: '',
    is_default: false,
  });

  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email_notifications: true,
    newsletter: false,
    language: 'es' as 'es' | 'en',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <AlertCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  // Cargar datos del perfil cuando esté disponible
  React.useEffect(() => {
    if (userProfile) {
      setProfileForm({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        phone: userProfile.phone || '',
        email_notifications: userProfile.email_notifications,
        newsletter: userProfile.newsletter,
        language: userProfile.language,
      });
    }
  }, [userProfile]);

  // Handlers para direcciones
  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      type: 'home',
      name: '',
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'Guatemala',
      is_default: false,
      phone: '',
    });
    setIsAddressDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      type: address.type,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      country: address.country,
      is_default: address.is_default,
      phone: address.phone || '',
    });
    setIsAddressDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!addressForm.name || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zip_code) {
      return;
    }

    try {
      if (editingAddress) {
        await updateAddressMutation.mutateAsync({ id: editingAddress.id, ...addressForm });
      } else {
        await createAddressMutation.mutateAsync(addressForm);
      }
      setIsAddressDialogOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    await deleteAddressMutation.mutateAsync(id);
    setDeleteAddressId(null);
  };

  // Handlers para métodos de pago
  const handleAddPayment = () => {
    setEditingPayment(null);
    setPaymentForm({
      type: 'card',
      card_brand: '',
      last4: '',
      expiry_month: undefined,
      expiry_year: undefined,
      cardholder_name: '',
      paypal_email: '',
      is_default: false,
    });
    setIsPaymentDialogOpen(true);
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setPaymentForm({
      type: payment.type,
      card_brand: payment.card_brand || '',
      last4: payment.last4 || '',
      expiry_month: payment.expiry_month || undefined,
      expiry_year: payment.expiry_year || undefined,
      cardholder_name: payment.cardholder_name || '',
      paypal_email: payment.paypal_email || '',
      is_default: payment.is_default,
    });
    setIsPaymentDialogOpen(true);
  };

  const handleSavePayment = async () => {
    if (paymentForm.type === 'card' && (!paymentForm.card_brand || !paymentForm.last4 || !paymentForm.cardholder_name)) {
      return;
    }
    if (paymentForm.type === 'paypal' && !paymentForm.paypal_email) {
      return;
    }

    try {
      if (editingPayment) {
        await updatePaymentMutation.mutateAsync({ id: editingPayment.id, ...paymentForm });
      } else {
        await createPaymentMutation.mutateAsync(paymentForm);
      }
      setIsPaymentDialogOpen(false);
      setEditingPayment(null);
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const handleDeletePayment = async (id: number) => {
    await deletePaymentMutation.mutateAsync(id);
    setDeletePaymentId(null);
  };

  // Handler para actualizar perfil
  const handleSaveProfile = async () => {
    await updateProfileMutation.mutateAsync({
      first_name: profileForm.first_name || null,
      last_name: profileForm.last_name || null,
      phone: profileForm.phone || null,
      email_notifications: profileForm.email_notifications,
      newsletter: profileForm.newsletter,
      language: profileForm.language,
    });
  };

  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Obtener nombre del usuario
  const userName = userProfile 
    ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || user?.email?.split('@')[0] || 'Usuario'
    : user?.email?.split('@')[0] || 'Usuario';

  const userSince = user?.created_at 
    ? new Date(user.created_at).getFullYear().toString()
    : '2023';

  if (ordersLoading || addressesLoading || paymentMethodsLoading || profileLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#7d8768]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#7d8768]/10 via-[#9d627b]/10 to-[#7a7539]/10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-editorial-new">Mi Cuenta</h1>
            <p className="text-gray-600 font-audrey">Gestiona tus pedidos, direcciones y preferencias</p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#7d8768]" />
                    {userName}
                  </CardTitle>
                  <CardDescription>Cliente desde {userSince}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#7d8768]/10 to-[#9d627b]/10">
                      <span className="text-sm font-medium">Pedidos Totales</span>
                      <Badge variant="secondary">{orders.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#9d627b]/10 to-[#7a7539]/10">
                      <span className="text-sm font-medium">Direcciones</span>
                      <Badge variant="secondary">{addresses.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#7a7539]/10 to-[#7d8768]/10">
                      <span className="text-sm font-medium">Métodos de Pago</span>
                      <Badge variant="secondary">{paymentMethods.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="orders" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Pedidos
                      </TabsTrigger>
                      <TabsTrigger value="invoices" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Facturación
                      </TabsTrigger>
                      <TabsTrigger value="addresses" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Direcciones
                      </TabsTrigger>
                      <TabsTrigger value="payments" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Pagos
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Configuración
                      </TabsTrigger>
                    </TabsList>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold font-editorial-new">Historial de Pedidos</h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar pedidos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                      </div>

                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? 'No se encontraron pedidos' : 'No tienes pedidos aún'}
                          </h3>
                          <p className="text-gray-600">
                            {searchTerm 
                              ? 'Intenta con otro término de búsqueda'
                              : 'Cuando realices tu primera compra, aparecerá aquí'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredOrders.map((order) => (
                            <Card key={order.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle className="text-lg">{order.order_number}</CardTitle>
                                    <CardDescription>
                                      <Calendar className="inline h-4 w-4 mr-1" />
                                      {new Date(order.created_at).toLocaleDateString('es-ES')}
                                    </CardDescription>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl font-bold text-gray-900">Q. {order.total.toFixed(2)}</div>
                                    <Badge className={`mt-2 ${getStatusColor(order.status)}`}>
                                      {getStatusIcon(order.status)}
                                      <span className="ml-1">{getStatusText(order.status)}</span>
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  {/* Order Items */}
                                  <div className="space-y-2">
                                    {order.items.map((item) => (
                                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                        <img 
                                          src={item.product_image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop&crop=center'} 
                                          alt={item.product_name} 
                                          className="w-12 h-12 object-cover rounded" 
                                        />
                                        <div className="flex-1">
                                          <h4 className="font-medium">{item.product_name}</h4>
                                          <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium">Q. {item.unit_price.toFixed(2)}</p>
                                          <p className="text-sm text-gray-500">Total: Q. {item.total_price.toFixed(2)}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Tracking Info - Mostrar siempre que haya tracking o fecha estimada */}
                                  {(order.tracking_number || order.estimated_delivery) && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                      <div className="flex items-start gap-4">
                                        {order.tracking_number && (
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Truck className="h-4 w-4 text-blue-600" />
                                              <p className="text-sm font-semibold text-blue-900">Número de Seguimiento</p>
                                            </div>
                                            <p className="text-sm text-blue-700 font-mono">{order.tracking_number}</p>
                                            {order.status === 'shipped' && (
                                              <p className="text-xs text-blue-600 mt-1">Tu pedido está en camino</p>
                                            )}
                                          </div>
                                        )}
                                        {order.estimated_delivery && (
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Calendar className="h-4 w-4 text-blue-600" />
                                              <p className="text-sm font-semibold text-blue-900">Entrega Estimada</p>
                                            </div>
                                            <p className="text-sm text-blue-700 font-semibold">
                                              {new Date(order.estimated_delivery).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                              })}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Status Updates Info */}
                                  {order.status === 'processing' && !order.tracking_number && (
                                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                        <p className="text-sm text-yellow-800">
                                          Tu pedido está siendo procesado. Recibirás una notificación cuando sea enviado.
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {order.status === 'delivered' && (
                                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <p className="text-sm text-green-800 font-medium">
                                          ¡Tu pedido ha sido entregado! Esperamos que disfrutes tus productos.
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {order.status === 'cancelled' && (
                                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                                      <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        <p className="text-sm text-red-800 font-medium">
                                          Este pedido ha sido cancelado.
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Order Actions */}
                                  <div className="flex items-center justify-between pt-4 border-t flex-wrap gap-2">
                                    <div className="flex space-x-2 flex-wrap">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                                        className="border-[#7d8768] text-[#7d8768] hover:bg-[#7d8768]/10"
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Ver Detalles
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => navigate(`/dashboard/invoices/${order.id}`)}
                                        className="border-[#7d8768] text-[#7d8768] hover:bg-[#7d8768]/10"
                                      >
                                        <Download className="h-4 w-4 mr-2" />
                                        Ver Factura
                                      </Button>
                                      {order.tracking_number && (
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => {
                                            // Abrir enlace de rastreo (puedes personalizar según tu proveedor de envíos)
                                            const trackingUrl = `https://www.google.com/search?q=track+${order.tracking_number}`;
                                            window.open(trackingUrl, '_blank');
                                          }}
                                          className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
                                        >
                                          <Truck className="h-4 w-4 mr-2" />
                                          Rastrear Envío
                                        </Button>
                                      )}
                                    </div>
                                    <div className="flex space-x-2 flex-wrap">
                                      {(order.status === 'delivered' || order.status === 'cancelled') && (
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={async () => {
                                            // Re-agregar productos del pedido al carrito
                                            let addedCount = 0;
                                            let failedCount = 0;
                                            
                                            for (const item of order.items) {
                                              if (item.product_id) {
                                                try {
                                                  // Obtener el producto desde la base de datos
                                                  const { data: product, error } = await supabase
                                                    .from('products')
                                                    .select('*')
                                                    .eq('id', item.product_id)
                                                    .single();
                                                  
                                                  if (!error && product && product.in_stock) {
                                                    // Convertir a formato ProductUI
                                                    const productUI = {
                                                      id: product.id,
                                                      name: product.name,
                                                      price: product.price,
                                                      image: product.image_url,
                                                      category: product.category,
                                                      inStock: product.in_stock,
                                                    };
                                                    addToCart(productUI as any, item.quantity);
                                                    addedCount++;
                                                  } else {
                                                    failedCount++;
                                                  }
                                                } catch (error) {
                                                  console.error('Error adding product to cart:', error);
                                                  failedCount++;
                                                }
                                              } else {
                                                // Producto personalizado o sin product_id
                                                failedCount++;
                                              }
                                            }
                                            
                                            if (addedCount > 0) {
                                              toast.success('Productos agregados al carrito', {
                                                description: `${addedCount} producto(s) agregado(s). ${failedCount > 0 ? `${failedCount} no disponible(s).` : ''}`,
                                              });
                                              setTimeout(() => navigate('/cart'), 1000);
                                            } else {
                                              toast.error('No se pudieron agregar productos', {
                                                description: 'Los productos ya no están disponibles o son personalizados.',
                                              });
                                            }
                                          }}
                                          className="border-[#7d8768] text-[#7d8768] hover:bg-[#7d8768]/10"
                                        >
                                          <Plus className="h-4 w-4 mr-2" />
                                          Re-ordenar
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Invoices Tab */}
                    <TabsContent value="invoices" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold font-editorial-new">Mis Facturas</h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar facturas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                      </div>

                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? 'No se encontraron facturas' : 'No tienes facturas aún'}
                          </h3>
                          <p className="text-gray-600">
                            {searchTerm 
                              ? 'Intenta con otro término de búsqueda'
                              : 'Las facturas aparecerán aquí después de realizar una compra'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredOrders.map((order) => (
                            <Card key={order.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle className="text-lg font-gilda-display">Factura {order.order_number}</CardTitle>
                                    <CardDescription className="font-audrey">
                                      <Calendar className="inline h-4 w-4 mr-1" />
                                      {new Date(order.created_at).toLocaleDateString('es-ES', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </CardDescription>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl font-bold text-gray-900 font-editorial-new">Q. {order.total.toFixed(2)}</div>
                                    <Badge className={`mt-2 ${getStatusColor(order.status)} border-0`}>
                                      {getStatusIcon(order.status)}
                                      <span className="ml-1">{getStatusText(order.status)}</span>
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-gray-600 font-audrey">
                                    {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => navigate(`/dashboard/invoices/${order.id}`)}
                                      className="border-[#7d8768] text-[#7d8768] hover:bg-[#7d8768]/10"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Ver Factura
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => navigate(`/dashboard/invoices/${order.id}`)}
                                      className="border-[#7d8768] text-[#7d8768] hover:bg-[#7d8768]/10"
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Descargar PDF
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Addresses Tab */}
                    <TabsContent value="addresses" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold font-editorial-new">Mis Direcciones</h3>
                        <Button 
                          onClick={handleAddAddress}
                          className="bg-gradient-to-r from-[#7d8768] to-[#9d627b] hover:from-[#7a7539] hover:to-[#9d627b] text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Dirección
                        </Button>
                      </div>

                      {addresses.length === 0 ? (
                        <div className="text-center py-12">
                          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes direcciones guardadas</h3>
                          <p className="text-gray-600 mb-4">Agrega una dirección para facilitar tus compras</p>
                          <Button 
                            onClick={handleAddAddress}
                            className="bg-gradient-to-r from-[#7d8768] to-[#9d627b] hover:from-[#7a7539] hover:to-[#9d627b] text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Primera Dirección
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addresses.map((address) => (
                            <Card key={address.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant={address.type === 'home' ? 'default' : 'secondary'}>
                                      {address.type === 'home' ? 'Casa' : address.type === 'work' ? 'Trabajo' : 'Otro'}
                                    </Badge>
                                    {address.is_default && (
                                      <Badge variant="outline" className="text-green-600 border-green-600">
                                        Predeterminada
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleEditAddress(address)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => setDeleteAddressId(address.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <p className="font-medium font-gilda-display">{address.name}</p>
                                  <p className="text-gray-600 font-audrey">{address.street}</p>
                                  <p className="text-gray-600 font-audrey">
                                    {address.city}, {address.state} {address.zip_code}
                                  </p>
                                  <p className="text-gray-600 font-audrey">{address.country}</p>
                                  {address.phone && (
                                    <p className="text-gray-600 font-audrey">Tel: {address.phone}</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Address Dialog */}
                      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingAddress ? 'Editar Dirección' : 'Agregar Dirección'}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="addressType">Tipo de Dirección *</Label>
                              <Select 
                                value={addressForm.type} 
                                onValueChange={(value: 'home' | 'work' | 'other') => 
                                  setAddressForm({...addressForm, type: value})
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="home">Casa</SelectItem>
                                  <SelectItem value="work">Trabajo</SelectItem>
                                  <SelectItem value="other">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="addressName">Nombre de la Dirección *</Label>
                              <Input
                                id="addressName"
                                value={addressForm.name}
                                onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                                placeholder="Ej: Casa Principal"
                              />
                            </div>
                            <div>
                              <Label htmlFor="street">Calle y Número *</Label>
                              <Input
                                id="street"
                                value={addressForm.street}
                                onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                                placeholder="Calle y número"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="city">Ciudad *</Label>
                                <Input
                                  id="city"
                                  value={addressForm.city}
                                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                  placeholder="Ciudad"
                                />
                              </div>
                              <div>
                                <Label htmlFor="state">Departamento/Estado *</Label>
                                <Input
                                  id="state"
                                  value={addressForm.state}
                                  onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                  placeholder="Departamento/Estado"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="zipCode">Código Postal *</Label>
                                <Input
                                  id="zipCode"
                                  value={addressForm.zip_code}
                                  onChange={(e) => setAddressForm({...addressForm, zip_code: e.target.value})}
                                  placeholder="Código Postal"
                                />
                              </div>
                              <div>
                                <Label htmlFor="country">País *</Label>
                                <Input
                                  id="country"
                                  value={addressForm.country}
                                  onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                                  placeholder="País"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="phone">Teléfono</Label>
                              <Input
                                id="phone"
                                value={addressForm.phone || ''}
                                onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                                placeholder="Teléfono de contacto"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="isDefaultAddress"
                                checked={addressForm.is_default}
                                onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})}
                                className="rounded"
                              />
                              <Label htmlFor="isDefaultAddress">Establecer como dirección predeterminada</Label>
                            </div>
                            <div className="flex gap-4 pt-4">
                              <Button
                                onClick={handleSaveAddress}
                                disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
                                className="bg-gradient-to-r from-[#7d8768] to-[#9d627b] hover:from-[#7a7539] hover:to-[#9d627b] text-white"
                              >
                                {createAddressMutation.isPending || updateAddressMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : null}
                                {editingAddress ? 'Guardar Cambios' : 'Agregar Dirección'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsAddressDialogOpen(false);
                                  setEditingAddress(null);
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Address Confirmation */}
                      <Dialog open={!!deleteAddressId} onOpenChange={(open) => !open && setDeleteAddressId(null)}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar Eliminación</DialogTitle>
                          </DialogHeader>
                          <p className="text-gray-600">
                            ¿Estás seguro de que quieres eliminar esta dirección?
                          </p>
                          <div className="flex gap-4 pt-4">
                            <Button
                              onClick={() => deleteAddressId && handleDeleteAddress(deleteAddressId)}
                              disabled={deleteAddressMutation.isPending}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {deleteAddressMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : null}
                              Eliminar
                            </Button>
                            <Button variant="outline" onClick={() => setDeleteAddressId(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TabsContent>

                    {/* Payments Tab */}
                    <TabsContent value="payments" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold font-editorial-new">Métodos de Pago</h3>
                        <Button 
                          onClick={handleAddPayment}
                          className="bg-gradient-to-r from-[#7d8768] to-[#9d627b] hover:from-[#7a7539] hover:to-[#9d627b] text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Método
                        </Button>
                      </div>

                      {paymentMethods.length === 0 ? (
                        <div className="text-center py-12">
                          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes métodos de pago guardados</h3>
                          <p className="text-gray-600 mb-4">Agrega un método de pago para facilitar tus compras</p>
                          <Button 
                            onClick={handleAddPayment}
                            className="bg-gradient-to-r from-[#7d8768] to-[#9d627b] hover:from-[#7a7539] hover:to-[#9d627b] text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Método de Pago
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {paymentMethods.map((method) => (
                            <Card key={method.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-[#7d8768]/20 to-[#9d627b]/20 rounded-lg">
                                      <CreditCard className="h-6 w-6 text-[#7d8768]" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">
                                        {method.type === 'card' 
                                          ? `${method.card_brand} •••• ${method.last4}`
                                          : method.type === 'paypal'
                                          ? `PayPal - ${method.paypal_email}`
                                          : 'Efectivo contra entrega'
                                        }
                                      </h4>
                                      {method.type === 'card' && method.expiry_month && method.expiry_year && (
                                        <p className="text-sm text-gray-600">
                                          Expira: {method.expiry_month}/{method.expiry_year}
                                        </p>
                                      )}
                                      {method.is_default && (
                                        <Badge variant="outline" className="text-green-600 border-green-600 mt-1">
                                          Predeterminado
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleEditPayment(method)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => setDeletePaymentId(method.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Payment Method Dialog */}
                      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingPayment ? 'Editar Método de Pago' : 'Agregar Método de Pago'}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="paymentType">Tipo de Pago *</Label>
                              <Select 
                                value={paymentForm.type} 
                                onValueChange={(value: 'card' | 'paypal' | 'cash_on_delivery') => 
                                  setPaymentForm({...paymentForm, type: value})
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="card">Tarjeta de Crédito/Débito</SelectItem>
                                  <SelectItem value="paypal">PayPal</SelectItem>
                                  <SelectItem value="cash_on_delivery">Efectivo contra entrega</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {paymentForm.type === 'card' && (
                              <>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="cardBrand">Marca de Tarjeta *</Label>
                                    <Select 
                                      value={paymentForm.card_brand || ''} 
                                      onValueChange={(value) => 
                                        setPaymentForm({...paymentForm, card_brand: value})
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar marca" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Visa">Visa</SelectItem>
                                        <SelectItem value="Mastercard">Mastercard</SelectItem>
                                        <SelectItem value="American Express">American Express</SelectItem>
                                        <SelectItem value="Discover">Discover</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="last4">Últimos 4 dígitos *</Label>
                                    <Input
                                      id="last4"
                                      value={paymentForm.last4 || ''}
                                      onChange={(e) => setPaymentForm({...paymentForm, last4: e.target.value})}
                                      placeholder="1234"
                                      maxLength={4}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label htmlFor="cardholderName">Nombre en la Tarjeta *</Label>
                                    <Input
                                      id="cardholderName"
                                      value={paymentForm.cardholder_name || ''}
                                      onChange={(e) => setPaymentForm({...paymentForm, cardholder_name: e.target.value})}
                                      placeholder="Juan Pérez"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="expiryMonth">Mes</Label>
                                    <Input
                                      id="expiryMonth"
                                      type="number"
                                      min="1"
                                      max="12"
                                      value={paymentForm.expiry_month || ''}
                                      onChange={(e) => setPaymentForm({...paymentForm, expiry_month: parseInt(e.target.value) || undefined})}
                                      placeholder="MM"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="expiryYear">Año</Label>
                                    <Input
                                      id="expiryYear"
                                      type="number"
                                      min={new Date().getFullYear()}
                                      value={paymentForm.expiry_year || ''}
                                      onChange={(e) => setPaymentForm({...paymentForm, expiry_year: parseInt(e.target.value) || undefined})}
                                      placeholder="YYYY"
                                    />
                                  </div>
                                </div>
                              </>
                            )}

                            {paymentForm.type === 'paypal' && (
                              <div>
                                <Label htmlFor="paypalEmail">Email de PayPal *</Label>
                                <Input
                                  id="paypalEmail"
                                  type="email"
                                  value={paymentForm.paypal_email || ''}
                                  onChange={(e) => setPaymentForm({...paymentForm, paypal_email: e.target.value})}
                                  placeholder="usuario@paypal.com"
                                />
                              </div>
                            )}

                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="isDefaultPayment"
                                checked={paymentForm.is_default}
                                onChange={(e) => setPaymentForm({...paymentForm, is_default: e.target.checked})}
                                className="rounded"
                              />
                              <Label htmlFor="isDefaultPayment">Establecer como método predeterminado</Label>
                            </div>
                            <div className="flex gap-4 pt-4">
                              <Button
                                onClick={handleSavePayment}
                                disabled={createPaymentMutation.isPending || updatePaymentMutation.isPending}
                                className="bg-gradient-to-r from-[#7d8768] to-[#9d627b] hover:from-[#7a7539] hover:to-[#9d627b] text-white"
                              >
                                {createPaymentMutation.isPending || updatePaymentMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : null}
                                {editingPayment ? 'Guardar Cambios' : 'Agregar Método'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsPaymentDialogOpen(false);
                                  setEditingPayment(null);
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Payment Confirmation */}
                      <Dialog open={!!deletePaymentId} onOpenChange={(open) => !open && setDeletePaymentId(null)}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar Eliminación</DialogTitle>
                          </DialogHeader>
                          <p className="text-gray-600">
                            ¿Estás seguro de que quieres eliminar este método de pago?
                          </p>
                          <div className="flex gap-4 pt-4">
                            <Button
                              onClick={() => deletePaymentId && handleDeletePayment(deletePaymentId)}
                              disabled={deletePaymentMutation.isPending}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {deletePaymentMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : null}
                              Eliminar
                            </Button>
                            <Button variant="outline" onClick={() => setDeletePaymentId(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                                              <h3 className="text-xl font-semibold font-editorial-new">Configuración de Cuenta</h3>

                      <div className="space-y-6">
                        {/* Profile Information */}
                        <Card className="border-0 shadow-md">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <User className="h-5 w-5 text-[#7d8768]" />
                              Información Personal
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="firstName">Nombre</Label>
                                <Input 
                                  id="firstName" 
                                  value={profileForm.first_name}
                                  onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                                  placeholder="Nombre"
                                />
                              </div>
                              <div>
                                <Label htmlFor="lastName">Apellido</Label>
                                <Input 
                                  id="lastName" 
                                  value={profileForm.last_name}
                                  onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                                  placeholder="Apellido"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                  id="email" 
                                  type="email" 
                                  value={user?.email || ''}
                                  disabled
                                  className="bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                              </div>
                              <div>
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input 
                                  id="phone" 
                                  value={profileForm.phone}
                                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                  placeholder="Teléfono"
                                />
                              </div>
                            </div>
                            <Button 
                              onClick={handleSaveProfile}
                              disabled={updateProfileMutation.isPending}
                              className="bg-gradient-to-r from-[#7d8768] to-[#9d627b] hover:from-[#7a7539] hover:to-[#9d627b] text-white"
                            >
                              {updateProfileMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : null}
                              Guardar Cambios
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Preferences */}
                        <Card className="border-0 shadow-md">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Bell className="h-5 w-5 text-[#7d8768]" />
                              Preferencias
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium font-gilda-display">Notificaciones por Email</h4>
                                  <p className="text-sm text-gray-600 font-audrey">Recibe actualizaciones sobre tus pedidos</p>
                                </div>
                                <Button 
                                  variant={profileForm.email_notifications ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => {
                                    setProfileForm({...profileForm, email_notifications: !profileForm.email_notifications});
                                  }}
                                  className={profileForm.email_notifications ? "bg-[#7d8768] text-white" : ""}
                                >
                                  {profileForm.email_notifications ? 'Activado' : 'Desactivado'}
                                </Button>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium font-gilda-display">Newsletter</h4>
                                  <p className="text-sm text-gray-600 font-audrey">Ofertas especiales y nuevos productos</p>
                                </div>
                                <Button 
                                  variant={profileForm.newsletter ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => {
                                    setProfileForm({...profileForm, newsletter: !profileForm.newsletter});
                                  }}
                                  className={profileForm.newsletter ? "bg-[#7d8768] text-white" : ""}
                                >
                                  {profileForm.newsletter ? 'Suscrito' : 'No Suscrito'}
                                </Button>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium font-gilda-display">Idioma</h4>
                                  <p className="text-sm text-gray-600 font-audrey">
                                    {profileForm.language === 'es' ? 'Español' : 'English'}
                                  </p>
                                </div>
                                <Select 
                                  value={profileForm.language}
                                  onValueChange={(value: 'es' | 'en') => {
                                    setProfileForm({...profileForm, language: value});
                                  }}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="es">Español</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="pt-4">
                                <Button 
                                  onClick={handleSaveProfile}
                                  disabled={updateProfileMutation.isPending}
                                  className="bg-gradient-to-r from-[#7d8768] to-[#9d627b] hover:from-[#7a7539] hover:to-[#9d627b] text-white"
                                >
                                  {updateProfileMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : null}
                                  Guardar Preferencias
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Security */}
                        <Card className="border-0 shadow-md">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Shield className="h-5 w-5 text-[#7d8768]" />
                              Seguridad
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">Cambiar Contraseña</h4>
                                  <p className="text-sm text-gray-600">Actualiza tu contraseña regularmente</p>
                                </div>
                                <Button variant="outline" size="sm">Cambiar</Button>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">Autenticación de Dos Factores</h4>
                                  <p className="text-sm text-gray-600">Añade una capa extra de seguridad</p>
                                </div>
                                <Button variant="outline" size="sm">Configurar</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 