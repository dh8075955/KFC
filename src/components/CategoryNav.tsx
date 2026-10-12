import React from 'react';
import { MenuCategory } from '../types/kfc';
import { Flame, Star } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: MenuCategory;
  onSelectCategory: (cat: MenuCategory) => void;
  onlySpicy: boolean;
  setOnlySpicy: (val: boolean) => void;
  onlyBestSellers: boolean;
  setOnlyBestSellers: (val: boolean) => void;
  totalCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  onlySpicy,
  setOnlySpicy,
  onlyBestSellers,
  setOnlyBestSellers,
  totalCount,
}) => {
  const categories: { id: MenuCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Menu', icon: '🍽️' },
    { id: 'buckets', label: 'Buckets & Feasts', icon: '🪣' },
    { id: 'chicken', label: 'Fried Chicken', icon: '🍗' },
    { id: 'burgers', label: 'Burgers & Wraps', icon: '🍔' },
    { id: 'combos', label: 'Box Meals', icon: '🍱' },
    { id: 'sides', label: 'Sides & Gravy', icon: '🍟' },
    { id: 'drinks', label: 'Drinks & Desserts', icon: '🥤' },
  ];

  return (
    <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Scrollable Categories List */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-105 border border-red-700'
                      : 'bg-zinc-100 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200 border border-zinc-200'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 text-xs">
            <span className="text-zinc-500 font-mono text-[11px] font-bold hidden lg:inline mr-1">
              ({totalCount} items)
            </span>

            {/* Spicy Filter */}
            <button
              onClick={() => setOnlySpicy(!onlySpicy)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                onlySpicy
                  ? 'bg-red-600 text-white border border-red-700 shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${onlySpicy ? 'text-amber-300' : 'text-red-600'}`} />
              <span>Spicy 🔥</span>
            </button>

            {/* Best Sellers Filter */}
            <button
              onClick={() => setOnlyBestSellers(!onlyBestSellers)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                onlyBestSellers
                  ? 'bg-amber-500 text-zinc-950 font-extrabold border border-amber-600 shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyBestSellers ? 'text-zinc-950 fill-zinc-950' : 'text-amber-500'}`} />
              <span>Best Sellers</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
