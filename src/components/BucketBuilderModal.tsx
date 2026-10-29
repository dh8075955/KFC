import React, { useState } from 'react';
import { X, Check, Plus, Minus, ArrowRight } from 'lucide-react';
import { CartItem, RecipeType } from '../types/kfc';
import { DIPPING_SAUCES } from '../data/kfcMenu';

interface BucketBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomBucket: (bucketItem: CartItem) => void;
}

export const BucketBuilderModal: React.FC<BucketBuilderModalProps> = ({
  isOpen,
  onClose,
  onAddCustomBucket,
}) => {
  const [bucketSize, setBucketSize] = useState<5 | 8 | 12>(8);
  const [recipe, setRecipe] = useState<RecipeType>('crispy_spicy');
  
  // Piece allocation
  const [pieces, setPieces] = useState({
    drumsticks: 3,
    thighs: 3,
    breasts: 1,
    wings: 1,
  });

  // Selected sides (pick 2)
  const availableSides = [
    { id: 'fries', name: 'Khoai tây chiên (Lớn)' },
    { id: 'coleslaw', name: 'Bắp cải trộn Coleslaw' },
    { id: 'tart', name: 'Bánh trứng Egg Tart (2 cái)' },
    { id: 'potatoes', name: 'Khoai tây nghiền & Sốt Gravy' },
  ];
  const [selectedSides, setSelectedSides] = useState<string[]>([
    'Khoai tây chiên (Lớn)',
    'Bắp cải trộn Coleslaw',
  ]);

  // Selected sauces (up to 3)
  const [selectedSauces, setSelectedSauces] = useState<string[]>([
    'Sốt Bí Truyền Colonel',
    'Tương Ớt Cay KFC',
  ]);

  if (!isOpen) return null;

  const totalSelectedPieces = pieces.drumsticks + pieces.thighs + pieces.breasts + pieces.wings;
  const remainingPieces = bucketSize - totalSelectedPieces;

  const getPrice = () => {
    switch (bucketSize) {
      case 5: return 169000;
      case 8: return 259000;
      case 12: return 389000;
      default: return 259000;
    }
  };

  const handleAdjustPiece = (type: 'drumsticks' | 'thighs' | 'breasts' | 'wings', delta: number) => {
    if (delta > 0 && remainingPieces <= 0) return;
    if (delta < 0 && pieces[type] <= 0) return;
    setPieces((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const handleToggleSide = (sideName: string) => {
    if (selectedSides.includes(sideName)) {
      if (selectedSides.length > 1) {
        setSelectedSides(selectedSides.filter((s) => s !== sideName));
      }
    } else {
      if (selectedSides.length < 2) {
        setSelectedSides([...selectedSides, sideName]);
      } else {
        setSelectedSides([selectedSides[1], sideName]);
      }
    }
  };

  const handleToggleSauce = (sauceName: string) => {
    if (selectedSauces.includes(sauceName)) {
      setSelectedSauces(selectedSauces.filter((s) => s !== sauceName));
    } else {
      if (selectedSauces.length < 3) {
        setSelectedSauces([...selectedSauces, sauceName]);
      }
    }
  };

  const handleSaveAndAdd = () => {
    const recipeName =
      recipe === 'crispy_spicy'
        ? 'Giòn Cay'
        : recipe === 'cheese'
        ? 'Lắc Phô Mai'
        : 'Truyền Thống 11 Thảo Mộc';

    const customCartItem: CartItem = {
      cartId: `custom-bucket-${Date.now()}`,
      item: {
        id: `custom-bkt-${bucketSize}`,
        name: `Xô Gà Tự Chọn ${bucketSize} Miếng (${recipeName})`,
        category: 'buckets',
        description: `Xô ${bucketSize} miếng gà ${recipeName} tự chọn đùi/cánh/ức kèm 2 món ăn phụ và sốt chấm độc quyền.`,
        price: getPrice(),
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        pieces: bucketSize,
      },
      quantity: 1,
      recipe,
      selectedPieces: pieces,
      selectedSide: selectedSides.join(', '),
      selectedSauces,
      notes: `Món phụ: ${selectedSides.join(', ')} | Sốt: ${selectedSauces.join(', ')}`,
      totalPrice: getPrice(),
    };

    onAddCustomBucket(customCartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-3xl w-full text-zinc-900 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-700 via-red-600 to-red-700 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 font-display text-2xl flex items-center justify-center shadow-md border-2 border-red-800">
              🪣
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display uppercase text-2xl tracking-wide">
                  TỰ PHỐI XÔ GÀ CỦA BẠN
                </h3>
                <span className="text-[10px] uppercase font-extrabold bg-amber-400 text-zinc-950 px-2 py-0.5 rounded shadow-2xs">
                  Combo Tự Chọn
                </span>
              </div>
              <p className="text-xs text-red-100 font-medium">
                Tự do chọn đùi, cánh, má đùi gà + 2 món ăn phụ và sốt chấm yêu thích
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/35 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-8 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Bucket Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">1</span>
                Chọn Kích Cỡ Xô Gà
              </label>
              <span className="text-xs text-zinc-500 font-medium">Phù hợp từ 1 đến 6 người</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { size: 5, label: 'Xô 5 Miếng', price: '169.000 ₫', sub: 'Cho 1 - 2 người' },
                { size: 8, label: 'Xô 8 Miếng', price: '259.000 ₫', sub: 'Cho 3 - 4 người (Bán chạy ⭐)' },
                { size: 12, label: 'Xô 12 Miếng', price: '389.000 ₫', sub: 'Đại tiệc 5 - 6 người' },
              ].map((opt) => (
                <button
                  key={opt.size}
                  onClick={() => {
                    setBucketSize(opt.size as 5 | 8 | 12);
                    if (opt.size === 5) setPieces({ drumsticks: 2, thighs: 2, breasts: 1, wings: 0 });
                    if (opt.size === 8) setPieces({ drumsticks: 3, thighs: 3, breasts: 1, wings: 1 });
                    if (opt.size === 12) setPieces({ drumsticks: 4, thighs: 4, breasts: 2, wings: 2 });
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    bucketSize === opt.size
                      ? 'bg-red-50 border-red-500 shadow-sm'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <div className="font-extrabold text-base text-zinc-950">{opt.label}</div>
                  <div className="text-red-600 font-mono font-extrabold text-sm">{opt.price}</div>
                  <div className="text-[11px] text-zinc-500 mt-1">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Recipe Coating */}
          <div className="space-y-3">
            <label className="text-sm font-extrabold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">2</span>
              Chọn Vị Gà Rán
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'crispy_spicy',
                  name: 'Gà Giòn Cay',
                  tag: 'Cay Nồng Giòn Rụm',
                  desc: 'Vỏ da giòn tan cay xé lưỡi, vị bán chạy nhất KFC',
                  icon: '🔥',
                },
                {
                  id: 'original',
                  name: 'Gà Truyền Thống',
                  tag: '11 Thảo Mộc',
                  desc: 'Công thức nguyên bản 1939, thịt mềm mọng nước',
                  icon: '🍗',
                },
                {
                  id: 'cheese',
                  name: 'Gà Lắc Phô Mai',
                  tag: 'Béo Ngậy Hấp Dẫn',
                  desc: 'Lắc đẫm bột phô mai bơ sữa thơm nức mũi',
                  icon: '🧀',
                },
              ].map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => setRecipe(rec.id as RecipeType)}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    recipe === rec.id
                      ? 'bg-red-50 border-red-500 shadow-sm'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{rec.icon}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800">
                        {rec.tag}
                      </span>
                    </div>
                    <div className="font-extrabold text-zinc-950 text-sm">{rec.name}</div>
                    <p className="text-[11px] text-zinc-600 mt-1">{rec.desc}</p>
                  </div>
                  <div className="mt-2 text-right">
                    {recipe === rec.id && <Check className="w-4 h-4 text-red-600 inline" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: Customize Piece Distribution */}
          <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-zinc-200">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">3</span>
                Tùy Chọn Từng Miếng Gà
              </label>
              <div className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                remainingPieces === 0
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {remainingPieces === 0 ? '✓ Đã đủ miếng' : `Còn thiếu ${remainingPieces} miếng`}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'drumsticks', name: 'Đùi Gà', icon: '🍗' },
                { key: 'thighs', name: 'Má Đùi Gà', icon: '🥩' },
                { key: 'breasts', name: 'Ức Gà Phi-lê', icon: '🍖' },
                { key: 'wings', name: 'Cánh Gà', icon: '🪶' },
              ].map((p) => {
                const count = pieces[p.key as keyof typeof pieces];
                return (
                  <div
                    key={p.key}
                    className="bg-white border border-zinc-200 p-3 rounded-xl flex flex-col justify-between items-center text-center shadow-2xs"
                  >
                    <div className="text-2xl mb-1">{p.icon}</div>
                    <div className="font-extrabold text-xs text-zinc-900">{p.name}</div>

                    <div className="flex items-center gap-2 mt-3 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-200">
                      <button
                        onClick={() => handleAdjustPiece(p.key as any, -1)}
                        disabled={count <= 0}
                        className="p-1 rounded text-zinc-600 hover:text-zinc-950 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-extrabold text-sm text-zinc-950 w-5 text-center">
                        {count}
                      </span>
                      <button
                        onClick={() => handleAdjustPiece(p.key as any, 1)}
                        disabled={remainingPieces <= 0}
                        className="p-1 rounded text-zinc-600 hover:text-zinc-950 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Choose 2 Large Sides */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">4</span>
                Chọn 2 Món Ăn Phụ (Tặng Kèm Miễn Phí)
              </label>
              <span className="text-xs text-zinc-500 font-semibold">
                {selectedSides.length} / 2 món đã chọn
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableSides.map((s) => {
                const isSelected = selectedSides.includes(s.name);
                return (
                  <button
                    key={s.id}
                    onClick={() => handleToggleSide(s.name)}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between text-xs font-bold ${
                      isSelected
                        ? 'bg-red-50 border-red-500 text-red-950 shadow-2xs'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <span>{s.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-red-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 5: Dipping Sauces */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">5</span>
                Chọn Sốt Chấm Đặc Biệt (Tối đa 3 loại)
              </label>
              <span className="text-xs text-zinc-500 font-semibold">
                {selectedSauces.length} / 3 sốt đã chọn
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DIPPING_SAUCES.map((sauce) => {
                const isSelected = selectedSauces.includes(sauce.name);
                return (
                  <button
                    key={sauce.id}
                    onClick={() => handleToggleSauce(sauce.name)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-red-50 border-red-500 text-red-950 font-bold'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <span className="truncate">{sauce.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-red-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-stone-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-zinc-500 font-bold">Tổng tiền Xô Gà Tự Chọn:</div>
            <div className="text-2xl font-display font-mono text-zinc-950 tracking-wide">
              {getPrice().toLocaleString('vi-VN')} ₫
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-sm transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveAndAdd}
              disabled={remainingPieces !== 0}
              className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-zinc-200 disabled:text-zinc-400 font-extrabold text-sm text-white shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-red-700"
            >
              <span>Thêm Xô Gà Vào Giỏ Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
