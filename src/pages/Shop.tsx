import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Star, 
  ShoppingCart, 
  Heart,
  Filter,
  Grid,
  List,
  Search,
  ChevronDown,
  Eye,
  Star as StarFilled,
  Loader2,
  AlertCircle,
  Leaf,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { ProductUI } from '@/types/product';
import { useNutrients } from '@/hooks/useNutrients';

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  
  // Initialize category from URL params or 'all'
  const urlCategory = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  
  const [selectedNutrient, setSelectedNutrient] = useState<number | undefined>(undefined);
  
  // Initialize search query from URL params or empty string
  const urlSearchQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  // Update search query and category when URL params change
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'all';
    setSearchQuery(urlSearch);
    setSelectedCategory(urlCategory);
  }, [searchParams]);
  
  // Fetch nutrients for the filter dropdown
  const { data: nutrients = [], isLoading: isLoadingNutrients, error: nutrientsError } = useNutrients();
  
  // Fetch products from Supabase - MUST be declared before using allProducts
  const { data: allProducts = [], isLoading, error } = useProducts({});
  
  // Calculate dynamic price range from products
  const priceRangeFromProducts = useMemo(() => {
    if (allProducts.length === 0) return [0, 100];
    const prices = allProducts.map(p => p.price);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    return [min, max];
  }, [allProducts]);

  const [priceRange, setPriceRange] = useState([0, 100]);
  
  // Update price range when products load
  useEffect(() => {
    if (allProducts.length > 0 && priceRangeFromProducts[1] > 0) {
      setPriceRange(priceRangeFromProducts);
    }
  }, [priceRangeFromProducts, allProducts.length]);
  
  // Fetch filtered products based on current filters
  const { data: filteredProductsData = [] } = useProducts({
    category: selectedCategory,
    searchQuery: searchQuery,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    nutrientId: selectedNutrient,
  });

  // Calculate category counts from all products
  const categories = useMemo(() => {
    const categoryMap = allProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { id: 'all', name: 'Todos los Productos', count: allProducts.length },
      { id: 'skin-care', name: 'Cuidado de la Piel', count: categoryMap['skin-care'] || 0 },
      { id: 'body-care', name: 'Cuidado Corporal', count: categoryMap['body-care'] || 0 },
      { id: 'baby-care', name: 'Cuidado del Bebé', count: categoryMap['baby-care'] || 0 },
      { id: 'home-care', name: 'Cuidado del Hogar', count: categoryMap['home-care'] || 0 }
    ];
  }, [allProducts]);

  // Use filtered products from Supabase
  const products = filteredProductsData;

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });
  }, [products, sortBy]);


  const handleWishlistToggle = (product: ProductUI) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };


  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fafaf9] via-white to-[#fafaf9]">
        {/* Hero Section - Enhanced */}
        <section className="relative bg-gradient-to-br from-[#7d8768] via-[#8d756e] to-[#7a7539] text-white py-24 md:py-28 overflow-hidden">
          {/* Background decorative elements - enhanced */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/8 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
            {/* Subtle botanical pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                  <Leaf className="h-5 w-5 text-white/95" />
                  <Sparkles className="h-4 w-4 text-white/80" />
                  <span className="text-sm font-medium tracking-wide font-audrey">Productos Naturales</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 font-editorial-new leading-tight tracking-tight animate-slide-in">
                Nuestra Colección
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-3xl mx-auto leading-relaxed font-audrey font-light mb-10">
                Descubre productos premium de cuidado natural formulados con ingredientes 100% naturales
              </p>
              
              {/* Search Bar - Enhanced */}
              <div className="max-w-3xl mx-auto relative">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50"></div>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <Input
                    type="text"
                    placeholder="Buscar productos, ingredientes, categorías..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-14 pr-6 py-6 text-lg rounded-2xl border-0 bg-transparent focus:ring-2 focus:ring-[#7d8768]/20 shadow-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20 relative z-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Enhanced */}
            <div className="lg:w-1/4">
              <Card className="border border-gray-200/60 shadow-xl bg-white/95 backdrop-blur-sm sticky top-24">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <SlidersHorizontal className="h-5 w-5 text-[#7d8768]" />
                      <h3 className="text-xl font-bold text-gray-900 font-editorial-new">Filtros</h3>
                    </div>
                  </div>

                  {/* Categories - Enhanced */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 font-audrey text-base">Categorías</h4>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between group">
                          <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <Checkbox
                              checked={selectedCategory === category.id}
                              onCheckedChange={() => {
                                setSelectedCategory(category.id);
                                // Update URL when category changes
                                const newParams = new URLSearchParams(searchParams);
                                if (category.id === 'all') {
                                  newParams.delete('category');
                                } else {
                                  newParams.set('category', category.id);
                                }
                                // Clear search when changing category
                                newParams.delete('search');
                                navigate(`/shop?${newParams.toString()}`, { replace: true });
                              }}
                              className="border-2 border-gray-300 data-[state=checked]:bg-[#7d8768] data-[state=checked]:border-[#7d8768]"
                            />
                            <span className={`text-sm font-audrey transition-colors ${
                              selectedCategory === category.id 
                                ? 'text-[#7d8768] font-semibold' 
                                : 'text-gray-700 group-hover:text-[#7d8768]'
                            }`}>
                              {category.name}
                            </span>
                          </label>
                          <span className={`text-xs font-audrey transition-colors ${
                            selectedCategory === category.id 
                              ? 'text-[#7d8768] font-semibold' 
                              : 'text-gray-500'
                          }`}>
                            ({category.count})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nutrients Filter - Enhanced */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 font-audrey text-base">Nutrientes</h4>
                    {nutrientsError && (
                      <div className="text-xs text-red-600 mb-3 p-3 bg-red-50 border border-red-200 rounded-lg font-audrey">
                        Error al cargar nutrientes. Verifica que las tablas existan en la base de datos.
                      </div>
                    )}
                    <Select 
                      value={selectedNutrient?.toString() || 'all'} 
                      onValueChange={(value) => {
                        setSelectedNutrient(value === 'all' ? undefined : parseInt(value));
                      }}
                      disabled={isLoadingNutrients}
                    >
                      <SelectTrigger className="w-full border-2 border-gray-200 focus:border-[#7d8768] focus:ring-2 focus:ring-[#7d8768]/20 h-11 rounded-xl">
                        <SelectValue placeholder={isLoadingNutrients ? "Cargando..." : "Seleccionar nutriente"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los nutrientes</SelectItem>
                        {nutrients.length === 0 && !isLoadingNutrients ? (
                          <SelectItem value="no-nutrients" disabled>
                            No hay nutrientes disponibles
                          </SelectItem>
                        ) : (
                          nutrients.map((nutrient) => (
                            <SelectItem key={nutrient.id} value={nutrient.id.toString()}>
                              {nutrient.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {nutrients.length === 0 && !isLoadingNutrients && !nutrientsError && (
                      <p className="text-xs text-gray-500 mt-3 italic font-audrey">
                        💡 Ejecuta los scripts SQL (nutrients-schema.sql e insert-nutrients.sql) para cargar nutrientes
                      </p>
                    )}
                  </div>

                  {/* Price Range - Enhanced */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 font-audrey text-base">Rango de Precio</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="w-24 border-2 border-gray-200 focus:border-[#7d8768] focus:ring-2 focus:ring-[#7d8768]/20 rounded-xl"
                        />
                        <span className="text-gray-500 font-audrey">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
                          className="w-24 border-2 border-gray-200 focus:border-[#7d8768] focus:ring-2 focus:ring-[#7d8768]/20 rounded-xl"
                        />
                      </div>
                      <p className="text-xs text-gray-500 font-audrey">
                        Q. {priceRange[0]} - Q. {priceRange[1]}
                      </p>
                    </div>
                  </div>

                  {/* Clear Filters - Enhanced */}
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-gray-300 text-gray-700 hover:border-[#7d8768] hover:text-[#7d8768] hover:bg-[#7d8768]/5 transition-all shadow-sm font-audrey"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedNutrient(undefined);
                      setPriceRange([0, 100]);
                      setSearchQuery('');
                      // Clear URL params
                      navigate('/shop', { replace: true });
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid - Enhanced */}
            <div className="lg:w-3/4">
              {/* Toolbar - Enhanced */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <p className="text-gray-900 font-semibold font-audrey text-base">
                  {isLoading ? (
                    'Cargando productos...'
                  ) : error ? (
                    'Error al cargar productos'
                  ) : (
                    `Mostrando ${sortedProducts.length} de ${allProducts.length} productos`
                  )}
                </p>
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-2 border-gray-200 focus:border-[#7d8768] focus:ring-2 focus:ring-[#7d8768]/20 rounded-xl h-11">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destacados</SelectItem>
                      <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                      <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                      <SelectItem value="rating">Mejor Valorados</SelectItem>
                      <SelectItem value="newest">Más Nuevos</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`rounded-none border-0 ${
                        viewMode === 'grid' 
                          ? 'bg-[#7d8768] text-white hover:bg-[#6d7660]' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`rounded-none border-0 ${
                        viewMode === 'list' 
                          ? 'bg-[#7d8768] text-white hover:bg-[#6d7660]' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products - Enhanced */}
              {isLoading ? (
                <div className="text-center py-24">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#7d8768]/20"></div>
                    <div className="relative inline-block animate-spin rounded-full h-14 w-14 border-4 border-[#7d8768]/20 border-t-[#7d8768]"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-editorial-new">Cargando productos...</h3>
                  <p className="text-gray-600 font-audrey">Por favor espera mientras cargamos nuestros productos</p>
                </div>
              ) : error ? (
                <Card className="p-12 md:p-16 text-center border-2 border-red-100 bg-gradient-to-br from-red-50/50 to-white shadow-lg">
                  <div className="text-red-500 mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                      <AlertCircle className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-editorial-new">Error al cargar productos</h3>
                  <p className="text-gray-600 mb-8 font-audrey max-w-md mx-auto">No pudimos cargar los productos. Por favor intenta de nuevo más tarde.</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="bg-gradient-to-r from-[#7d8768] to-[#8d756e] hover:from-[#6d7660] hover:to-[#7d655e] text-white shadow-md"
                  >
                    Recargar Página
                  </Button>
                </Card>
              ) : sortedProducts.length === 0 ? (
                <Card className="p-12 md:p-16 text-center border border-gray-200/60 bg-gradient-to-br from-gray-50/50 to-white shadow-lg">
                  <div className="text-gray-300 mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100">
                      <Search className="h-10 w-10" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-editorial-new">No se encontraron productos</h3>
                  <p className="text-gray-600 mb-8 font-audrey max-w-md mx-auto">Intenta ajustar tus filtros o términos de búsqueda para encontrar más productos</p>
                  <Button 
                    variant="outline"
                    className="border-2 border-[#7d8768] text-[#7d8768] hover:bg-[#7d8768] hover:text-white transition-all shadow-sm"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedNutrient(undefined);
                      setPriceRange([0, 100]);
                      setSearchQuery('');
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                </Card>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {sortedProducts.map((product, index) => (
                    <Card 
                      key={product.id} 
                      className="hover:shadow-xl transition-all duration-500 bg-white border border-gray-200/60 hover:-translate-y-2 group h-full flex flex-col"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative flex flex-col h-full">
                        {/* Product Image */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          {product.badge && (
                            <Badge className={`absolute top-3 right-3 text-xs z-10 shadow-lg ${
                              product.badge === 'OFERTA' ? 'bg-gradient-to-r from-[#7d8768] to-[#8d756e]' :
                              product.badge === 'NUEVO' ? 'bg-gradient-to-r from-[#8d756e] to-[#7a7539]' :
                              product.badge === 'MÁS VENDIDO' ? 'bg-gradient-to-r from-[#7a7539] to-[#7d8768]' :
                              'bg-gradient-to-r from-[#7d8768] to-[#8d756e]'
                            } text-white border-0 font-medium`}>
                              {product.badge}
                            </Badge>
                          )}
                          <img 
                            src={product.realImage} 
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagen%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg"
                              onClick={() => navigate(`/shop/product/${product.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-1">
                        
                        {viewMode === 'grid' ? (
                          // Grid View - Enhanced
                          <div className="flex flex-col h-full">
                            <h3 className="font-bold text-lg text-gray-900 mb-3 text-center font-editorial-new group-hover:text-[#7d8768] transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            
                            <div className="flex items-center justify-center mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-[#7d8768] font-audrey">Q. {product.price.toFixed(2)}</span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through font-audrey">
                                    Q. {product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm text-center mb-6 flex-grow min-h-[3rem] font-audrey line-clamp-3">
                              {product.description}
                            </p>
                            <div className="flex gap-2 mt-auto">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-[#7d8768] to-[#8d756e] hover:from-[#6d7660] hover:to-[#7d655e] text-white shadow-md hover:shadow-lg transition-all"
                                onClick={() => {
                                  addToCart(product, 1);
                                }}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                <span className="font-audrey">Agregar</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={`border-2 transition-all duration-300 ${
                                  isInWishlist(product.id) 
                                    ? 'border-red-300 text-red-600 hover:bg-red-50 bg-red-50/50' 
                                    : 'border-gray-300 text-gray-700 hover:border-[#7d8768] hover:text-[#7d8768] hover:bg-[#7d8768]/5'
                                }`}
                                onClick={() => handleWishlistToggle(product)}
                              >
                                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // List View - Enhanced
                          <div className="flex items-center gap-6">
                            <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                              <img 
                                src={product.realImage} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagen%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-xl text-gray-900 mb-2 font-editorial-new group-hover:text-[#7d8768] transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-gray-600 text-sm mb-4 font-audrey line-clamp-2">{product.description}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-[#7d8768] font-audrey">Q. {product.price.toFixed(2)}</span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through font-audrey">
                                    Q. {product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-3 flex-shrink-0">
                              <Button 
                                className="bg-gradient-to-r from-[#7d8768] to-[#8d756e] hover:from-[#6d7660] hover:to-[#7d655e] text-white shadow-md hover:shadow-lg transition-all"
                                onClick={() => {
                                  addToCart(product, 1);
                                }}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                <span className="font-audrey">Agregar al Carrito</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={`border-2 transition-all duration-300 ${
                                  isInWishlist(product.id) 
                                    ? 'border-red-300 text-red-600 hover:bg-red-50 bg-red-50/50' 
                                    : 'border-gray-300 text-gray-700 hover:border-[#7d8768] hover:text-[#7d8768] hover:bg-[#7d8768]/5'
                                }`}
                                onClick={() => handleWishlistToggle(product)}
                              >
                                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default Shop; 