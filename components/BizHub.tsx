import React from 'react';
import { Product } from '../types';
import { MessageCircle, MapPin, Filter } from 'lucide-react';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', sellerId: 'u5', title: 'Accounting 101 Textbook', price: 25, image: 'https://picsum.photos/400/400?random=20', description: 'Used but in good condition. No highlights.' },
  { id: '2', sellerId: 'u6', title: 'Casio Scientific Calculator', price: 15, image: 'https://picsum.photos/400/400?random=21', description: 'Works perfectly. Needed for advanced modules.' },
  { id: '3', sellerId: 'u7', title: 'Semester 1 Notes Bundle', price: 10, image: 'https://picsum.photos/400/400?random=22', description: 'Handwritten notes, very detailed.' },
  { id: '4', sellerId: 'u8', title: 'Backpack (Waterproof)', price: 30, image: 'https://picsum.photos/400/400?random=23', description: 'Good for rainy days. Black color.' },
  { id: '5', sellerId: 'u9', title: 'Drafting Table (Mini)', price: 45, image: 'https://picsum.photos/400/400?random=24', description: 'Great for geometry and charts.' },
];

export const BizHub: React.FC<{ onContact: () => void }> = ({ onContact }) => {
  return (
    <div className="pb-24 p-4 md:p-0 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900">BizHub Marketplace</h1>
          <p className="text-sm text-gray-500">Buy & Sell within Campus</p>
        </div>
        <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {MOCK_PRODUCTS.map(product => (
          <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col border border-gray-100 group">
            <div className="h-32 md:h-48 bg-gray-200 relative overflow-hidden">
               <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
               <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 font-bold text-xs px-2 py-1 rounded shadow-sm">
                 ${product.price}
               </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 leading-tight mb-2">{product.title}</h3>
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <MapPin size={12} className="mr-1 text-gray-400" />
                  <span>Library Block</span>
                </div>
              </div>
              <button 
                onClick={onContact}
                className="w-full bg-indigo-50 text-indigo-600 text-xs md:text-sm font-bold py-2.5 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors"
              >
                <MessageCircle size={16} className="mr-2" />
                Contact Seller
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};