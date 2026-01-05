import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Heart,
  ArrowLeft,
  Star,
  CheckCircle,
  Minus,
  Plus,
  Loader2,
  AlertCircle,
  Truck,
  Zap,
  CreditCard,
  Shield,
  Leaf,
  Sparkles,
  Package,
  Award
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useProduct } from '@/hooks/useProducts';
import { useProductNutrients } from '@/hooks/useNutrients';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: storeSettings } = useStoreSettings();
  const productId = id ? parseInt(id) : 0;
  
  const freeShippingThreshold = storeSettings?.freeShippingThreshold || 50;
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: productNutrients = [], isLoading: isLoadingProductNutrients } = useProductNutrients(productId);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const paymentMethods = [
    {
      name: 'Journey to Pay',
      description: 'Paga en cuotas sin intereses',
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      badge: 'Recomendado'
    },
    {
      name: 'Tarjeta de Crédito/Débito',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard className="h-6 w-6 text-green-600" />
    },
    {
      name: 'PayPal',
      description: 'Pago seguro y rápido',
      icon: <Shield className="h-6 w-6 text-blue-500" />
    }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fafaf9] via-white to-[#fafaf9]">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 animate-ping rounded-full bg-[#7d8768]/20"></div>
              <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#7d8768]/20 border-t-[#7d8768]"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-editorial-new">Cargando producto...</h3>
            <p className="text-gray-600 font-audrey">Por favor espera</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fafaf9] via-white to-[#fafaf9]">
          <Card className="max-w-md border-2 border-red-100 bg-gradient-to-br from-red-50/50 to-white shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="text-red-500 mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                  <AlertCircle className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 font-editorial-new">Producto no encontrado</h2>
              <p className="text-gray-600 mb-8 font-audrey">El producto que buscas no existe o ha sido eliminado.</p>
              <Button 
                onClick={() => navigate('/shop')} 
                className="bg-gradient-to-r from-[#7d8768] to-[#8d756e] hover:from-[#6d7660] hover:to-[#7d655e] text-white shadow-md"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la Tienda
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fafaf9] via-white to-[#fafaf9]">
        {/* Hero Section - Enhanced */}
        <section className="relative bg-gradient-to-br from-[#7d8768] via-[#8d756e] to-[#7a7539] text-white py-16 md:py-20 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/8 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            {/* Subtle botanical pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate('/shop')}
              className="mb-8 text-white hover:bg-white/10 hover:text-white border border-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la Tienda
            </Button>

            {/* Product Header */}
            <div className="text-center md:text-left">
              {product.badge && (
                <Badge className={`mb-4 text-sm px-4 py-1.5 ${
                  product.badge === 'OFERTA' ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30' :
                  product.badge === 'NUEVO' ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30' :
                  product.badge === 'MÁS VENDIDO' ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30' :
                  'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                }`}>
                  {product.badge}
                </Badge>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-editorial-new leading-tight">
                {product.name}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-audrey max-w-3xl">
                {product.description}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20 relative z-20">
          <Card className="border border-gray-200/60 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6 lg:p-12">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image - Enhanced */}
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl border border-gray-200/60">
                    <img 
                      src={product.realImage} 
                      alt={product.name}
                      className="w-full h-[500px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagen%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200/60">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-audrey">SKU: <span className="font-semibold text-gray-900">{product.sku}</span></span>
                    </div>
                    {product.size && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-audrey">{product.size}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details - Enhanced */}
                <div className="space-y-8">
                  {/* Price and Stock */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-4xl md:text-5xl font-bold text-[#7d8768] font-audrey">Q. {product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-xl text-gray-500 line-through font-audrey">
                          Q. {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg w-fit">
                      <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-medium font-audrey ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                        {product.inStock ? 'En stock' : 'Agotado'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-3 font-editorial-new">Descripción</h4>
                    <p className="text-gray-700 leading-relaxed font-audrey">{product.longDescription || product.description}</p>
                  </div>

                  {/* Quantity */}
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-4 font-editorial-new">Cantidad</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="rounded-none border-0 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-bold w-16 text-center font-audrey">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= 10}
                          className="rounded-none border-0 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-sm text-gray-500 font-audrey">Máximo 10 unidades</span>
                    </div>
                  </div>

                  {/* Action Buttons - Enhanced */}
                  <div className="flex gap-4">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-[#7d8768] to-[#8d756e] hover:from-[#6d7660] hover:to-[#7d655e] text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                      disabled={!product.inStock}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      <span className="font-audrey">Agregar al Carrito - Q. {(product.price * quantity).toFixed(2)}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleWishlistToggle}
                      className={`border-2 px-6 ${
                        isInWishlist(product.id)
                          ? 'border-red-400 text-red-600 hover:bg-red-50 bg-red-50/50'
                          : 'border-gray-300 text-gray-700 hover:border-[#7d8768] hover:text-[#7d8768] hover:bg-[#7d8768]/5'
                      } transition-all shadow-sm`}
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  {/* Payment Methods - Enhanced */}
                  <div className="border-t border-gray-200 pt-8">
                    <h4 className="font-bold text-lg text-gray-900 mb-6 font-editorial-new">Métodos de Pago</h4>
                    <div className="space-y-3">
                      {paymentMethods.map((method, index) => (
                        <Card key={index} className="border border-gray-200/60 hover:border-[#7d8768] hover:shadow-md transition-all bg-white">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-gradient-to-br from-[#7d8768]/10 to-[#8d756e]/10 rounded-lg">
                                  {method.icon}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 font-audrey">{method.name}</div>
                                  <div className="text-sm text-gray-600 font-audrey">{method.description}</div>
                                </div>
                              </div>
                              {method.badge && (
                                <Badge className="bg-gradient-to-r from-[#7d8768] to-[#8d756e] text-white border-0">
                                  {method.badge}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info - Enhanced */}
                  <Card className="bg-gradient-to-r from-[#7d8768]/10 via-[#9d627b]/10 to-[#7a7539]/10 border border-[#7d8768]/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#7d8768] rounded-lg">
                          <Truck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 font-audrey">Envío Gratis</div>
                          <div className="text-sm text-gray-700 font-audrey">En pedidos superiores a Q. {freeShippingThreshold}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Product Tabs - Enhanced */}
              <Tabs defaultValue="nutrients" className="mt-12">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 p-1.5 rounded-xl border border-gray-200/60">
                  <TabsTrigger 
                    value="nutrients" 
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7d8768] data-[state=active]:shadow-sm font-audrey font-medium"
                  >
                    <Leaf className="h-4 w-4 mr-2" />
                    Nutrientes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="benefits"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7d8768] data-[state=active]:shadow-sm font-audrey font-medium"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Beneficios
                  </TabsTrigger>
                  <TabsTrigger 
                    value="info"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7d8768] data-[state=active]:shadow-sm font-audrey font-medium"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Información
                  </TabsTrigger>
                </TabsList>
              
                <TabsContent value="nutrients" className="mt-8">
                  {isLoadingProductNutrients ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 animate-ping rounded-full bg-[#7d8768]/20"></div>
                        <Loader2 className="h-6 w-6 animate-spin text-[#7d8768] relative" />
                      </div>
                      <span className="ml-3 text-sm text-gray-600 font-audrey">Cargando nutrientes...</span>
                    </div>
                  ) : productNutrients.length === 0 ? (
                    <Card className="p-12 text-center border border-gray-200/60 bg-gradient-to-br from-gray-50/50 to-white">
                      <div className="text-gray-400 mb-4">
                        <Leaf className="h-12 w-12 mx-auto" />
                      </div>
                      <p className="text-gray-600 font-audrey">Este producto no tiene nutrientes asociados.</p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {productNutrients.map((nutrient) => (
                        <Card key={nutrient.id} className="border border-gray-200/60 hover:border-[#7d8768] hover:shadow-lg transition-all bg-white">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-bold text-lg text-gray-900 font-editorial-new">{nutrient.name}</h4>
                              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 ml-3" />
                            </div>
                            <p className="text-sm text-gray-600 mb-4 font-audrey leading-relaxed">{nutrient.description}</p>
                            {nutrient.benefits && nutrient.benefits.length > 0 && (
                              <div className="pt-4 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-900 mb-2 font-audrey uppercase tracking-wide">Beneficios:</p>
                                <ul className="text-sm text-gray-700 space-y-2 font-audrey">
                                  {nutrient.benefits.slice(0, 3).map((benefit, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <Star className="h-4 w-4 text-[#7d8768] fill-current mr-2 mt-0.5 flex-shrink-0" />
                                      <span>{benefit}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              
                <TabsContent value="benefits" className="mt-8">
                  {product.benefits && product.benefits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.benefits.map((benefit, index) => (
                        <Card key={index} className="border border-gray-200/60 hover:border-[#7d8768] hover:shadow-md transition-all bg-white">
                          <CardContent className="p-5 flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg">
                              <Star className="h-5 w-5 text-yellow-500 fill-current flex-shrink-0" />
                            </div>
                            <span className="text-gray-800 font-audrey leading-relaxed">{benefit}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center border border-gray-200/60 bg-gradient-to-br from-gray-50/50 to-white">
                      <div className="text-gray-400 mb-4">
                        <Sparkles className="h-12 w-12 mx-auto" />
                      </div>
                      <p className="text-gray-600 font-audrey">Este producto no tiene beneficios registrados.</p>
                    </Card>
                  )}
                </TabsContent>
              
                <TabsContent value="info" className="mt-8">
                  <div className="space-y-6">
                    <Card className="border border-gray-200/60 bg-white">
                      <CardContent className="p-6">
                        <h4 className="font-bold text-lg text-gray-900 mb-3 font-editorial-new">SKU</h4>
                        <p className="text-gray-700 font-audrey text-lg">{product.sku}</p>
                      </CardContent>
                    </Card>
                    {product.size && (
                      <Card className="border border-gray-200/60 bg-white">
                        <CardContent className="p-6">
                          <h4 className="font-bold text-lg text-gray-900 mb-3 font-editorial-new">Tamaño</h4>
                          <p className="text-gray-700 font-audrey text-lg">{product.size}</p>
                        </CardContent>
                      </Card>
                    )}
                    {product.longDescription && (
                      <Card className="border border-gray-200/60 bg-white">
                        <CardContent className="p-6">
                          <h4 className="font-bold text-lg text-gray-900 mb-4 font-editorial-new">Descripción Completa</h4>
                          <p className="text-gray-700 leading-relaxed font-audrey">{product.longDescription}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
