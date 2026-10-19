import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { 
  Smartphone, 
  Laptop, 
  Car, 
  Home, 
  Armchair, 
  ShoppingBag, 
  PawPrint, 
  Briefcase,
  Layers
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-5 h-5 text-sky-600" />,
  Laptop: <Laptop className="w-5 h-5 text-indigo-600" />,
  Car: <Car className="w-5 h-5 text-amber-600" />,
  Home: <Home className="w-5 h-5 text-emerald-600" />,
  Sofa: <Armchair className="w-5 h-5 text-rose-600" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-fuchsia-600" />,
  PawPrint: <PawPrint className="w-5 h-5 text-orange-600" />,
  Briefcase: <Briefcase className="w-5 h-5 text-teal-600" />
};

export const CategoryBar: React.FC = () => {
  const { lang, selectedCategory, setSelectedCategory, ads } = useApp();

  return (
    <section className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 -mt-6 relative z-20 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4">
        
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#007460]" />
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              {lang === 'bn' ? 'ক্যাটাগরি অনুযায়ী ব্রাউজ করুন' : 'Browse by Category'}
            </h2>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-[#007460] hover:underline"
            >
              {lang === 'bn' ? 'সকল ক্যাটাগরি দেখুন' : 'View All Categories'}
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const liveCount = ads.filter(a => a.category === cat.id).length;
            const displayCount = Math.max(liveCount, cat.count);

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`p-3 rounded-lg border text-left flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 shadow-2xs">
                  {iconMap[cat.icon] || <Layers className="w-5 h-5 text-slate-600" />}
                </div>
                <span className="text-xs font-semibold text-slate-800 leading-snug line-clamp-1">
                  {lang === 'bn' ? cat.nameBn : cat.nameEn}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-slate-500 mt-0.5">
                  {displayCount.toLocaleString()} {lang === 'bn' ? 'টি' : 'ads'}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
