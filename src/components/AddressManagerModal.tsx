import React, { useState } from 'react';
import { X, MapPin, Plus, Check, Trash2, Home, Building2, Phone, User, Compass } from 'lucide-react';
import { DeliveryAddress } from '../types/kfc';

interface AddressManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: DeliveryAddress[];
  activeAddressId: string;
  onSelectAddress: (address: DeliveryAddress) => void;
  onAddAddress: (newAddr: DeliveryAddress) => void;
  onDeleteAddress: (id: string) => void;
}

export const AddressManagerModal: React.FC<AddressManagerModalProps> = ({
  isOpen,
  onClose,
  addresses,
  activeAddressId,
  onSelectAddress,
  onAddAddress,
  onDeleteAddress,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [title, setTitle] = useState('Nhà riêng');
  const [recipientName, setRecipientName] = useState('Nguyễn Văn Minh');
  const [phone, setPhone] = useState('0988 123 456');
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [ward, setWard] = useState('Phường Bến Nghé');
  const [street, setStreet] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim()) return;

    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      title: title.trim() || 'Địa chỉ mới',
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      city,
      district,
      ward,
      street: street.trim(),
      notes: notes.trim(),
      isDefault: addresses.length === 0,
    };

    onAddAddress(newAddr);
    onSelectAddress(newAddr);
    setIsAddingNew(false);
    setStreet('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-lg w-full text-zinc-900 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-display text-2xl shadow-md border-2 border-red-800">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display uppercase tracking-wide text-2xl">
                SỔ ĐỊA CHỈ GIAO HÀNG
              </h3>
              <p className="text-xs text-red-100 font-medium">
                Chọn nơi giao hàng hoặc thêm địa chỉ nhận gà rán mới
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Header Action: Thêm địa chỉ mới */}
          {!isAddingNew && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-red-300 hover:border-red-600 bg-red-50/50 hover:bg-red-50 text-red-600 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Địa Chỉ Giao Hàng Mới</span>
            </button>
          )}

          {/* Form thêm địa chỉ mới */}
          {isAddingNew && (
            <form onSubmit={handleSaveNewAddress} className="bg-stone-50 border border-zinc-200 p-5 rounded-2xl space-y-3.5 animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <span className="font-extrabold text-xs text-zinc-900 uppercase">
                  Nhập Thông Tin Địa Chỉ Mới
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-800 font-bold"
                >
                  Hủy
                </button>
              </div>

              {/* Loại địa chỉ */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  Tên gợi nhớ địa chỉ
                </label>
                <div className="flex gap-2">
                  {['Nhà riêng', 'Văn phòng', 'Nhà bạn bè'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTitle(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        title === t
                          ? 'bg-red-600 text-white'
                          : 'bg-white border border-zinc-300 text-zinc-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tên & Số điện thoại */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Người nhận
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>
              </div>

              {/* Tỉnh / Thành phố */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Tỉnh / Thành phố
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="Đồng Nai">Đồng Nai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Quận / Huyện
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Phường Xã & Số nhà */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  Phường / Xã
                </label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  Số nhà, Tên đường
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Số 128 Đường Lê Lợi, Chung cư Vinhome..."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  Ghi chú cho tài xế giao hàng (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bấm chuông tầng 3, gọi trước 5 phút..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 font-extrabold text-xs text-white shadow-md shadow-red-600/30 transition-all border border-red-700"
              >
                Lưu Địa Chỉ & Đặt Làm Nơi Giao Hàng
              </button>
            </form>
          )}

          {/* Danh sách địa chỉ đã lưu */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700">
              Địa Chỉ Đã Lưu ({addresses.length})
            </h4>

            {addresses.map((addr) => {
              const isSelected = activeAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => onSelectAddress(addr)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-50 border-red-500 shadow-sm ring-2 ring-red-500/20'
                      : 'bg-stone-50 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-red-600 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
                        {addr.title.includes('Văn phòng') ? (
                          <Building2 className="w-4 h-4" />
                        ) : (
                          <Home className="w-4 h-4" />
                        )}
                      </div>
                      <span className="font-extrabold text-sm text-zinc-900">
                        {addr.title}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Mặc định
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-xs font-extrabold text-red-600 bg-white px-2 py-0.5 rounded-full border border-red-200 shadow-2xs">
                          <Check className="w-3.5 h-3.5" /> Đang chọn
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-zinc-500 hover:text-red-600">
                          Chọn
                        </span>
                      )}

                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAddress(addr.id);
                          }}
                          className="text-zinc-400 hover:text-red-600 p-1"
                          title="Xóa địa chỉ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 space-y-0.5 text-xs text-zinc-600">
                    <div className="font-bold text-zinc-900">
                      {addr.recipientName} • <span className="font-mono">{addr.phone}</span>
                    </div>
                    <div>
                      {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                    </div>
                    {addr.notes && (
                      <div className="text-[11px] text-zinc-500 italic mt-1">
                        &quot;{addr.notes}&quot;
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-zinc-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-extrabold text-xs shadow-md transition-colors"
          >
            Xác Nhận & Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
