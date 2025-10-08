import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryById, getItemsByCategory, Category, Item } from '../firebase/services';
import OptimizedImage from '../components/OptimizedImage';
import { 
  Loader2, 
  ArrowLeft, 
  Package, 
  Star,
  Heart,
  Eye,
  CheckCircle,
  Info
} from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('No category ID provided');
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        console.log('Fetching data for category ID:', id);
        
        const [categoryData, itemsData] = await Promise.all([
          getCategoryById(id),
          getItemsByCategory(id)
        ]);
        
        console.log('Category data:', categoryData);
        console.log('Items data:', itemsData);
        
        if (!categoryData) {
          setError(`Category with ID "${id}" not found. It may have been deleted or doesn't exist.`);
          return;
        }
        
        setCategory(categoryData);
        setItems(itemsData || []);
      } catch (err: any) {
        console.error('Error fetching category data:', err);
        setError(`Failed to load category data: ${err?.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Navigation Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-100 mr-3">
                  <ArrowLeft className="h-4 w-4 text-gray-400" />
                </div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Loading Hero */}
        <div className="h-64 sm:h-80 lg:h-96 bg-gray-200 animate-pulse" />
        
        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Loading Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-100 rounded-xl mr-4 animate-pulse" />
                  <div>
                    <div className="h-6 w-12 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Loading Items Grid */}
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Loading fresh products...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch the latest items
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">
            {error || 'Category not found'}
          </div>
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200 mr-3">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="font-medium">Back to Categories</span>
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{items.filter(item => item.isAvailable).length} items available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 sm:h-80 lg:h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 z-10" />
          <OptimizedImage
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full transform hover:scale-105 transition-transform duration-700"
            lazy={false}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Package className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Fresh Products</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              {category.name}
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Discover our selection of premium {category.name.toLowerCase()} sourced from local suppliers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{items.filter(item => item.isAvailable).length}</p>
                <p className="text-sm text-gray-600">Available Items</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl mr-4">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600">Fresh Guarantee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {items.filter(item => item.isAvailable).length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 shadow-sm border max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No items available
              </h3>
              <p className="text-gray-600 mb-6">
                Please check back later or contact us for availability.
              </p>
              <button className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium">
                <Info className="h-4 w-4 mr-2" />
                Get Notified
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Our Products
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  All items in stock
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.filter(item => item.isAvailable).map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-w-1 aspect-h-1">
                      <OptimizedImage
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-56 group-hover:scale-110 transition-transform duration-500"
                        lazy={true}
                      />
                    </div>
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-3">
                        <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-lg">
                          <Heart className="h-5 w-5 text-gray-700" />
                        </button>
                        <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-lg">
                          <Eye className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-lg">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Available
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {item.name}
                      </h3>
                      <div className="text-right">
                        <div className="flex items-center text-2xl font-bold text-primary-600">
                          €{item.price.toFixed(2)}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          {item.priceUnit}
                        </p>
                      </div>
                    </div>
                    
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                      {item.description}
                    </p>
                    
                    {/* Info Message */}
                    <div className="w-full text-center py-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">
                        Contactez-nous pour commander
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA Section */}
        <div className="mt-16">
          <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 sm:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 text-center text-white">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Package className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Ready to Order?</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Contact Us for Fresh Products
              </h3>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Get in touch with our team to place your order or check current availability and pricing.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
                <a
                  href="tel:0693607683"
                  className="inline-flex items-center justify-center px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors duration-200 font-medium"
                >
                  <div className="p-2 bg-white/20 rounded-full mr-3">
                    📞
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-80">Appelez-nous</div>
                    <div className="font-semibold">06 93 60 76 83</div>
                  </div>
                </a>
                <a
                  href="mailto:lespetitespepitesvertes@gmail.com"
                  className="inline-flex items-center justify-center px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors duration-200 font-medium"
                >
                  <div className="p-2 bg-white/20 rounded-full mr-3">
                    ✉️
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-80">Écrivez-nous</div>
                    <div className="font-semibold">lespetitespepitesvertes@gmail.com</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;