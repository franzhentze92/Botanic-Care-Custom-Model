import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Settings,
  Menu, 
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  LogOut,
  LogIn
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useStoreSettings } from '@/hooks/useStoreSettings';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartItemCount, getWishlistCount } = useCart();
  const { user, signOut } = useAuth();
  const { data: storeSettings } = useStoreSettings();
  
  // Email permitido para acceso admin
  const ADMIN_EMAIL = 'admin@botaniccare.com';
  const isAuthorizedAdmin = user?.email === ADMIN_EMAIL;
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const freeShippingThreshold = storeSettings?.freeShippingThreshold || 50;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search after navigation
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre Nosotros', href: '/about' },
    { name: 'Tienda', href: '/shop' },
    { name: 'Personalizar', href: '/custom-cream' },
    { name: 'Nutrición', href: '/nutrition' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contáctanos', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
             {/* Top Banner */}
       <div className="bg-gradient-to-r from-[#7d8768] to-[#9d627b] text-white text-center py-2 px-4">
         <p className="text-sm">
           🌸 Envío gratis en pedidos superiores a Q. {freeShippingThreshold} • Ingredientes 100% Naturales
         </p>
       </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
                         {/* Logo */}
                          <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/BC Brand/2. icono-20250730T203031Z-1-001/2. icono/Icono_BotanicCare_Verde Claro.png" 
                  alt="Botanic Care Logo" 
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold text-[#7d8768] font-editorial-new">Botanic Care</span>
              </Link>

             {/* Desktop Navigation */}
             <nav className="hidden md:flex items-center space-x-8 ml-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                                     className={`text-sm font-medium transition-colors ${
                     isActive(item.href)
                       ? 'text-[#7d8768] border-b-2 border-[#7d8768]'
                       : 'text-gray-700 hover:text-[#7d8768]'
                   }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-[#7d8768]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7d8768] hover:text-[#6d7660] p-1"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden md:flex relative" asChild>
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  {getWishlistCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {getWishlistCount()}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="relative" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {getCartItemCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {getCartItemCount()}
                    </Badge>
                  )}
                </Link>
              </Button>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-semibold font-gilda-display">
                        {user.user_metadata?.name || user.email}
                      </p>
                      <p className="text-xs text-gray-500 font-audrey">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Mi Cuenta
                      </Link>
                    </DropdownMenuItem>
                    {isAuthorizedAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Administración
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
                  <Link to="/login">
                    <LogIn className="h-5 w-5 mr-2" />
                    Iniciar Sesión
                  </Link>
                </Button>
              )}
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            {user ? (
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold font-gilda-display">
                  {user.user_metadata?.name || user.email}
                </p>
                <p className="text-xs text-gray-500 font-audrey">{user.email}</p>
              </div>
            ) : (
              <div className="px-4 py-3 border-b border-gray-200">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
              </div>
            )}
            <form onSubmit={handleSearch} className="px-4 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10 mb-4 bg-gray-50 border-gray-200 focus:border-[#7d8768]"
                />
              </div>
            </form>
            <nav className="px-4 pb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                                     className={`block py-2 text-sm font-medium ${
                     isActive(item.href)
                       ? 'text-[#7d8768]'
                       : 'text-gray-700 hover:text-[#7d8768]'
                   }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`block py-2 text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'text-[#7d8768]'
                        : 'text-gray-700 hover:text-[#7d8768]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Cuenta
                  </Link>
                  {isAuthorizedAdmin && (
                    <Link
                      to="/admin"
                      className={`block py-2 text-sm font-medium ${
                        isActive('/admin')
                          ? 'text-[#7d8768]'
                          : 'text-gray-700 hover:text-[#7d8768]'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Administración
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-sm font-medium text-red-600 hover:text-red-700 w-full text-left"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#7d8768] via-[#9d627b] to-[#7a7539] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/BC Brand/2. icono-20250730T203031Z-1-001/2. icono/Icono_BotanicCare_Verde Claro.png"
                  alt="Botanic Care Logo"
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold font-editorial-new">Botanic Care</span>
              </div>
              <p className="text-white/90 mb-4 max-w-md font-audrey">
                Descubre el poder de los ingredientes naturales. Creamos productos premium de cuidado de la piel 
                a base de plantas que nutren tu piel y respetan el medio ambiente.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 font-gilda-display">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-white/80 hover:text-white transition-colors font-audrey">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-white/80 hover:text-white transition-colors font-audrey">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="text-white/80 hover:text-white transition-colors font-audrey">
                    Tienda
                  </Link>
                </li>
                <li>
                  <Link to="/custom-cream" className="text-white/80 hover:text-white transition-colors font-audrey">
                    Personalizar
                  </Link>
                </li>
                <li>
                  <Link to="/nutrition" className="text-white/80 hover:text-white transition-colors font-audrey">
                    Nutrición
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-white/80 hover:text-white transition-colors font-audrey">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/80 hover:text-white transition-colors font-audrey">
                    Contáctanos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 font-gilda-display">Contáctanos</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-white/80">
                  <Phone className="h-4 w-4" />
                  <span className="font-audrey">+502 57081058</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <Mail className="h-4 w-4" />
                  <span className="font-audrey">info@botaniccare.com</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <MapPin className="h-4 w-4" />
                  <span className="font-audrey">Lun-Vie: 9AM-6PM EST</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
            <p className="font-audrey">
              &copy; 2024 Botanic Care. Todos los derechos reservados. |{' '}
              <Link to="/privacy" className="hover:text-white underline transition-colors">
                Política de Privacidad
              </Link>
              {' '}|{' '}
              <Link to="/terms" className="hover:text-white underline transition-colors">
                Términos de Servicio
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 