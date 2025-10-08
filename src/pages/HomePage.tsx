import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, Category } from '../firebase/services';
import OptimizedImage from '../components/OptimizedImage';
import { 
  Loader2, 
  Store, 
  Sparkles, 
  Clock, 
  Shield, 
  Star, 
  Heart,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Attempting to fetch categories...');
        const fetchedCategories = await getCategories();
        console.log('Fetched categories:', fetchedCategories);
        setCategories(fetchedCategories);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(`Failed to load categories: ${err?.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
        {/* Loading Hero */}
        <div className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 animate-pulse" />
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-8">
              <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bienvenue au Jardin !</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Préparation de vos légumes frais cultivés avec amour...
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-red-600 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-700" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
          <div className="text-center">
            {/* Brand Badge */}
            <div className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4 animate-fade-in">
              <Sparkles className="h-4 w-4 text-white mr-2" />
              <span className="text-white text-sm font-medium">Légumes Frais de La Petite France</span>
            </div>
            
            {/* Main Heading - More compact */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 animate-slide-up leading-relaxed">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">
                Bienvenue au Jardin !
              </span>
            </h1>
            
            {/* Subtitle - More compact */}
            <p className="text-lg sm:text-xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-6 animate-fade-in">
              Retrouvez le vrai goût des légumes: cultivés avec soin dans les hauteurs de La Petite France, ils sont fraîchement récoltés rien que pour vous !
            </p>
            
            {/* CTA Button - More compact */}
            <div className="flex justify-center items-center mb-8 animate-scale-in">
              <a 
                href="tel:0693607683" 
                className="inline-flex items-center px-6 py-3 bg-white text-primary-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
              >
                <Phone className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Appelez pour Commander
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
            
            {/* Stats - More compact */}
            <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto">
              {[
                { icon: Star, label: 'Note Clients', value: '4.9' },
                { icon: Clock, label: 'Livraison', value: '24h' }
              ].map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div id="categories" className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1.5 bg-primary-100 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-primary-600 mr-2" />
              <span className="text-primary-700 text-sm font-medium">Nos Légumes Frais</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Découvrez Nos Produits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des légumes frais cultivés avec passion dans nos jardins.
            </p>
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl p-16 shadow-sm border max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-8">
                  <Store className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Catégories Bientôt Disponibles
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Nous préparons une sélection incroyable de catégories fraîches pour vous. Revenez bientôt !
                </p>
                <button className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium">
                  <Heart className="h-4 w-4 mr-2" />
                  Être Notifié
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group bg-white rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-w-16 aspect-h-12">
                      <OptimizedImage
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-48 sm:h-56 group-hover:scale-105 transition-transform duration-500"
                        lazy={true}
                      />
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Frais
                      </div>
                    </div>
                    
                    {/* Hover Content */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/90 text-sm font-medium mb-1">Qualité Premium</p>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-white/80 text-xs ml-2">4.9</span>
                          </div>
                        </div>
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                          <ArrowRight className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Frais, bio & d'origine locale
                    </p>
                    
                    {/* Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        Découvrir les Produits
                      </span>
                      <div className="p-2 bg-primary-50 rounded-full group-hover:bg-primary-100 transition-colors duration-300">
                        <ArrowRight className="h-4 w-4 text-primary-600 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pourquoi Choisir Les Petites Pépites Vertes ?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous nous engageons à vous livrer les légumes les plus frais et de la plus haute qualité avec un service exceptionnel.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Garantie Qualité',
                description: 'Garantie de satisfaction à 100% avec des produits de qualité livrés par nos soins.',
                color: 'purple'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-3xl p-8 shadow-sm border hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 ${
                  feature.color === 'green' ? 'bg-green-100' : 
                  feature.color === 'blue' ? 'bg-blue-100' : 
                  feature.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  <feature.icon className={`h-8 w-8 ${
                    feature.color === 'green' ? 'text-green-600' : 
                    feature.color === 'blue' ? 'text-blue-600' : 
                    feature.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, white 3px, transparent 3px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <Heart className="h-5 w-5 text-white mr-2" />
            <span className="text-white font-medium">Besoin d'Aide ?</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Restons en Contact
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Des questions sur nos produits ou besoin de recommandations personnalisées ? 
            Notre équipe amicale est là pour vous aider à trouver exactement ce dont vous avez besoin.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <a
              href="tel:0693607683"
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">Appelez-nous</h3>
              <p className="text-white/80 text-sm">06 93 60 76 83</p>
            </a>
            
            <a
              href="mailto:lespetitespepitesvertes@gmail.com"
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">Écrivez-nous</h3>
              <p className="text-white/80 text-xs break-all">lespetitespepitesvertes@gmail.com</p>
            </a>
            
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">Rendez-nous Visite</h3>
              <p className="text-white/80 text-sm">Local & Frais</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;