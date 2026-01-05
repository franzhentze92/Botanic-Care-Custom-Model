import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  Heart, 
  Shield, 
  Users, 
  Award, 
  Globe, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const About: React.FC = () => {
  const values = [
    {
      icon: <Leaf className="h-8 w-8 text-white" />,
      title: 'Ingredientes Naturales',
      description: 'Usamos solo los ingredientes a base de plantas más puros, cuidadosamente obtenidos de granjas sostenibles alrededor del mundo.'
    },
    {
      icon: <Heart className="h-8 w-8 text-white" />,
      title: 'Libre de Crueldad',
      description: 'Nuestros productos nunca se prueban en animales. Creemos en la belleza ética que respeta a todos los seres vivos.'
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: 'Seguro y Efectivo',
      description: 'Cada producto está formulado pensando en la seguridad, usando ingredientes que están probados para funcionar sin efectos secundarios dañinos.'
    },
    {
      icon: <Globe className="h-8 w-8 text-white" />,
      title: 'Sostenible',
      description: 'Estamos comprometidos a reducir nuestro impacto ambiental a través de empaques ecológicos y abastecimiento responsable.'
    }
  ];


  const commitments = [
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: 'Calidad Garantizada',
      description: 'Cada producto pasa por rigurosos controles de calidad para asegurar su eficacia y seguridad.'
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      title: 'Ingredientes Certificados',
      description: 'Trabajamos solo con proveedores certificados que comparten nuestros valores de sostenibilidad.'
    },
    {
      icon: <Leaf className="h-8 w-8 text-white" />,
      title: '100% Natural',
      description: 'Sin parabenos, sulfatos, ni ingredientes sintéticos. Solo lo mejor que la naturaleza ofrece.'
    },
    {
      icon: <Heart className="h-8 w-8 text-white" />,
      title: 'Libre de Crueldad',
      description: 'Nunca probamos en animales. Todos nuestros productos son cruelty-free certificados.'
    },
    {
      icon: <Globe className="h-8 w-8 text-white" />,
      title: 'Empaques Sostenibles',
      description: 'Comprometidos con el medio ambiente usando materiales reciclables y biodegradables.'
    },
    {
      icon: <Sparkles className="h-8 w-8 text-white" />,
      title: 'Personalización',
      description: 'Crea tu producto ideal con nuestro constructor personalizado adaptado a tus necesidades.'
    }
  ];

  

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#fafaf9] via-white to-[#fafaf9]">
        {/* Hero Section - Enhanced */}
        <section className="relative bg-gradient-to-br from-[#7d8768] via-[#8d756e] to-[#7a7539] text-white py-24 md:py-32 overflow-hidden">
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
                  <span className="text-sm font-medium tracking-wide font-audrey">Nuestra Historia</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 font-editorial-new leading-tight tracking-tight animate-slide-in">
                Sobre Botanic Care
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-3xl mx-auto leading-relaxed font-audrey font-light mb-8">
                Estamos en una misión para llevar el poder de la naturaleza a tu rutina diaria de cuidado de la piel
              </p>
              <div className="flex items-center justify-center gap-6 text-white/80 text-sm font-audrey flex-wrap">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  <span>100% Natural</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Libre de Crueldad</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Sostenible</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section - Enhanced */}
        <section className="py-20 bg-white -mt-12 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 font-editorial-new leading-tight">Nuestra Misión</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed font-audrey">
                  En Botanic Care, creemos que todos merecen acceso a productos de cuidado de la piel seguros, efectivos 
                  y naturales. Nuestra misión es cerrar la brecha entre la belleza tradicional y el bienestar natural, 
                  creando productos que no solo funcionan sino que también respetan tu piel y el medio ambiente.
                </p>
                <p className="text-lg text-gray-700 mb-10 leading-relaxed font-audrey">
                  Comenzamos con una pregunta simple: "¿Por qué el cuidado de la piel no puede ser tanto efectivo 
                  como completamente natural?" Esta pregunta nos llevó en un viaje para descubrir 
                  los ingredientes a base de plantas más poderosos y crear formulaciones que 
                  entregan resultados reales sin compromiso.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link to="/shop">
                    <Button className="bg-gradient-to-r from-[#7d8768] to-[#8d756e] hover:from-[#6d7660] hover:to-[#7d655e] text-white shadow-lg hover:shadow-xl transition-all">
                      <span className="font-audrey">Comprar Nuestros Productos</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/blog">
                    <Button variant="outline" className="border-2 border-[#7d8768] text-[#7d8768] hover:bg-[#7d8768] hover:text-white transition-all shadow-sm">
                      <span className="font-audrey">Leer Nuestro Blog</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <Card className="border border-gray-200/60 shadow-xl bg-gradient-to-br from-[#7d8768]/5 via-[#8d756e]/5 to-[#7a7539]/5 backdrop-blur-sm">
                  <CardContent className="p-10">
                    <div className="text-6xl mb-6 text-center">🌿</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 font-editorial-new text-center">Por Qué Hacemos Lo Que Hacemos</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-[#7d8768] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-audrey leading-relaxed">Tu piel merece lo mejor que la naturaleza tiene para ofrecer</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-[#8d756e] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-audrey leading-relaxed">El medio ambiente no debería sufrir por la belleza</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-[#7a7539] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-audrey leading-relaxed">Todos deberían tener acceso al cuidado de la piel natural</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-[#7d8768] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-audrey leading-relaxed">La ciencia y la naturaleza pueden trabajar juntas</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - Enhanced */}
        <section className="py-20 bg-gradient-to-b from-white via-[#fafaf9] to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-editorial-new">Nuestros Valores</h2>
              <p className="text-xl text-gray-600 font-audrey max-w-2xl mx-auto">Los principios que guían todo lo que hacemos</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card 
                  key={index} 
                  className="text-center hover:shadow-xl transition-all duration-500 bg-white border border-gray-200/60 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-[#7d8768] to-[#8d756e] rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300">
                        {value.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-editorial-new">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-audrey">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section - Enhanced */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-editorial-new">Nuestra Fundadora</h2>
              <p className="text-xl text-gray-600 font-audrey max-w-2xl mx-auto">La pasión y visión detrás de Botanic Care</p>
            </div>
            
            <Card className="border border-gray-200/60 shadow-xl bg-white hover:shadow-2xl transition-all duration-500">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center text-center">
                  {/* Founder Image */}
                  <div className="mb-8 relative">
                    <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#7d8768]/20 shadow-2xl bg-gradient-to-br from-[#7d8768]/10 to-[#8d756e]/10">
                      <img 
                        src="/ana_cristina.png" 
                        alt="Ana Cristina Hentze Movil - Fundadora de Botanic Care"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EFoto%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  </div>

                  {/* Founder Info */}
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-editorial-new">Ana Cristina Hentze Movil</h3>
                  <p className="text-xl text-[#7d8768] font-semibold mb-6 font-audrey">Fundadora y Creadora</p>
                  
                  {/* Founder Message */}
                  <div className="max-w-2xl mx-auto space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed font-audrey italic">
                      "Creé Botanic Care con un sueño simple: ofrecer productos de cuidado natural que realmente funcionen, 
                      formulados con amor y respeto tanto por tu piel como por nuestro planeta. Cada ingrediente es elegido 
                      cuidadosamente, cada producto es creado con pasión, y cada cliente es parte de nuestra familia."
                    </p>
                    <p className="text-base text-gray-600 leading-relaxed font-audrey">
                      Con años de experiencia en formulaciones naturales y una pasión genuina por el bienestar, 
                      Ana Cristina Hentze Movil combina ciencia y naturaleza para crear productos que nutren tu piel mientras 
                      respetan el medio ambiente. Su visión es hacer que el cuidado natural de calidad sea 
                      accesible para todos.
                    </p>
                  </div>

                  {/* Decorative Leaf */}
                  <div className="mt-8 text-[#7d8768] opacity-30">
                    <Leaf className="h-12 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Commitments Section - Enhanced */}
        <section className="py-20 bg-gradient-to-b from-white via-[#fafaf9] to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-editorial-new">Nuestro Compromiso</h2>
              <p className="text-xl text-gray-600 font-audrey max-w-2xl mx-auto">Lo que nos distingue y nuestra promesa para contigo</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {commitments.map((commitment, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-xl transition-all duration-500 bg-white border border-gray-200/60 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#7d8768] to-[#8d756e] rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300">
                        {commitment.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-editorial-new text-center">{commitment.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-audrey text-center">{commitment.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default About; 