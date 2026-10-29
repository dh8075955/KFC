import React, { useState } from 'react';
import { X, Check, Plus, Minus } from 'lucide-react';
import { MenuItem, CartItem, RecipeType } from '../types/kfc';
import { DIPPING_SAUCES } from '../data/kfcMenu';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [recipe, setRecipe] = useState<RecipeType>(
    item?.allowedRecipes?.[0] || 'crispy_spicy'
  );
  const [selectedSauces, setSelectedSauces] = useState<string[]>([
    'Sốt Bí Truyền Colonel'
  ]);
  const [selectedDrink, setSelectedDrink] = useState<string>('Pepsi tươi mát lạnh');
  const [selectedSide, setSelectedSide] = useState<string>(
    item?.includedSides?.[0] || 'Khoai tây chiên vừa'
  );
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !item) return null;

  const drinksList = [
    'Pepsi tươi mát lạnh',
    'Pepsi không calo (Zero)',
    'Mirinda Cam',
    '7Up thanh mát',
    'Trà đào hạt chia (+10k)',
  ];

  const sidesList = [
    'Khoai tây chiên vừa',
    'Khoai tây nghiền & sốt Gravy',
    'Bắp cải trộn Coleslaw',
    'Bánh trứng Egg Tart (+15k)',
  ];

  const handleToggleSauce = (sauceName: string) => {
    if (selectedSauces.includes(sauceName)) {
      setSelectedSauces(selectedSauces.filter((s) => s !== sauceName));
    } else {
      if (selectedSauces.length < 2) {
        setSelectedSauces([...selectedSauces, sauceName]);
      }
    }
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      cartId: `${item.id}-${Date.now()}`,
      item,
      quantity,
      recipe: item.allowedRecipes ? recipe : undefined,
      selectedSauces,
      selectedDrink: item.includedDrinks ? selectedDrink : undefined,
      selectedSide: item.includedSides ? selectedSide : undefined,
      notes: notes.trim() || undefined,
      totalPrice: item.price * quantity,
    };

    onAddToCart(cartItem);
    onClose();
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'combos': return 'COMBO TIẾT KIỆM';
      case 'buckets': return 'XÔ GÀ TIỆC TÙNG';
      case 'chicken': return 'GÀ RÁN GIÒN TAN';
      case 'burgers': return 'BURGER & WRAP';
      case 'rice': return 'CƠM GÀ KFC';
      case 'sides': return 'MÓN ĂN PHỤ';
      case 'drinks': return 'THỨC UỐNG';
      default: return cat.toUpperCase();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-xl w-full text-zinc-900 shadow-2xl overflow-hidden my-6">
        
        {/* Top Image & close button */}
        <div className="relative h-60 w-full overflow-hidden bg-zinc-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 hover:bg-black/75 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded bg-red-600 text-white shadow-2xs">
                {getCategoryLabel(item.category)}
              </span>
              {item.calories && (
                <span className="text-xs font-mono font-bold text-zinc-200">
                  {item.calories} kcal
                </span>
              )}
            </div>
            <h3 className="text-2xl font-extrabold text-white leading-tight">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-zinc-600 leading-relaxed">
            {item.description}
          </p>

          {/* Recipe options */}
          {item.allowedRecipes && item.allowedRecipes.length > 1 && (
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
                Chọn Vị Gà Rán
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.allowedRecipes.map((r) => {
                  const isSelected = recipe === r;
                  const label =
                    r === 'crispy_spicy'
                      ? 'Gà Giòn Cay 🔥'
                      : r === 'original'
                      ? 'Gà Truyền Thống'
                      : r === 'cheese'
                      ? 'Lắc Phô Mai 🧀'
                      : 'Sốt Chua Ngọt';
                  return (
                    <button
                      key={r}
                      onClick={() => setRecipe(r)}
                      className={`p-3 rounded-xl text-left border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-red-50 border-red-500 text-red-950 shadow-2xs'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      <div>{label}</div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-red-600 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dipping Sauces */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
                Chọn Sốt Chấm (Tối đa 2 loại)
              </label>
              <span className="text-[11px] text-zinc-500 font-semibold">
                {selectedSauces.length}/2
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DIPPING_SAUCES.slice(0, 4).map((s) => {
                const isSelected = selectedSauces.includes(s.name);
                return (
                  <button
                    key={s.id}
                    onClick={() => handleToggleSauce(s.name)}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-red-50 border-red-500 text-red-950 font-bold'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <span className="truncate">{s.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Included Sides if Combo */}
          {item.includedSides && (
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
                Chọn Món Ăn Kèm Trong Combo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sidesList.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSide(s)}
                    className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                      selectedSide === s
                        ? 'bg-red-50 border-red-500 text-red-950 font-bold'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Included Drinks if Combo */}
          {item.includedDrinks && (
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
                Chọn Thức Uống Trong Combo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {drinksList.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDrink(d)}
                    className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                      selectedDrink === d
                        ? 'bg-red-50 border-red-500 text-red-950 font-bold'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Kitchen Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
              Ghi Chú Cho Nhà Bếp (Tùy chọn)
            </label>
            <input
              type="text"
              placeholder="e.g. Nhiều tương ớt, không lấy đá, chiên giòn kỹ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:bg-white"
            />
          </div>

        </div>

        {/* Footer with quantity and Add to Bag */}
        <div className="p-6 bg-stone-50 border-t border-zinc-200 flex items-center justify-between gap-4">
          
          {/* Quantity selector */}
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-zinc-300 shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="text-zinc-500 hover:text-zinc-950 disabled:opacity-30 p-1"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-extrabold text-base text-zinc-950 w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-zinc-500 hover:text-zinc-950 p-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 font-extrabold text-sm text-white shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between border border-red-700"
          >
            <span>Thêm Vào Giỏ Hàng</span>
            <span className="font-mono font-extrabold text-base">
              {(item.price * quantity).toLocaleString('vi-VN')} ₫
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};
