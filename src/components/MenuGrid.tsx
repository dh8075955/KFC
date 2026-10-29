import React from 'react';
import { MenuItem } from '../types/kfc';
import { Plus, Flame, Sparkles, Star } from 'lucide-react';

interface MenuGridProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  onResetFilters: () => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  onSelectItem,
  onQuickAdd,
  onResetFilters,
}) => {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-zinc-200 p-8 shadow-xs">
        <div className="text-5xl">🍗</div>
        <h3 className="text-xl font-extrabold text-zinc-950">Không Tìm Thấy Món Phù Hợp</h3>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
          Rất tiếc, không có món gà rán nào khớp với từ khóa hoặc bộ lọc của bạn. Thử tìm kiếm tên khác nhé!
        </p>
        <button
          onClick={onResetFilters}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-extrabold text-sm text-white transition-colors shadow-md shadow-red-600/20"
        >
          Đặt Lại Bộ Lọc & Xem Tất Cả
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-red-500 hover:shadow-xl hover:shadow-red-600/10 transition-all duration-300 group shadow-xs"
        >
          {/* Top Image area */}
          <div 
            className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100 cursor-pointer" 
            onClick={() => onSelectItem(item)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              {item.isBestSeller && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-zinc-950 font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-zinc-950" />
                  Bán Chạy Nhất
                </span>
              )}
              {item.isNew && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Món Mới
                </span>
              )}
              {item.isDeal && (
                <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md border border-red-700">
                  Ưu Đãi Hot 🔥
                </span>
              )}
            </div>

            {/* Spicy Indicator */}
            {item.isSpicy && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-red-300 text-[10px] font-extrabold text-red-600 flex items-center gap-1 shadow-xs">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                <span>{'🔥'.repeat(item.spiceLevel || 1)}</span>
              </div>
            )}

            {/* Pieces count pill if chicken */}
            {item.pieces && (
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-zinc-900 text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                {item.pieces} Miếng
              </div>
            )}

            {/* Calories badge */}
            {item.calories && (
              <div className="absolute bottom-3 right-3 text-[11px] font-mono font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                {item.calories} kcal
              </div>
            )}
          </div>

          {/* Details & description */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <h3 
                onClick={() => onSelectItem(item)}
                className="font-extrabold text-zinc-950 text-base sm:text-lg group-hover:text-red-600 transition-colors cursor-pointer leading-snug line-clamp-1"
              >
                {item.name}
              </h3>
              <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom price and add buttons */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-extrabold font-mono text-zinc-950">
                    {item.price.toLocaleString('vi-VN')} ₫
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-zinc-400 line-through font-mono">
                      {item.originalPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-red-600 uppercase font-extrabold">
                  Nóng giòn giao nhanh
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectItem(item)}
                  className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-extrabold transition-colors"
                >
                  Tùy Chọn
                </button>

                <button
                  type="button"
                  onClick={() => onQuickAdd(item)}
                  title="Thêm nhanh vào giỏ hàng"
                  className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/25 hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};
