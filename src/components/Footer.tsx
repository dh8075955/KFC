import React from 'react';
import { Phone, MapPin, Clock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800">
      {/* Iconic KFC Stripe divider */}
      <div className="w-full h-3 kfc-stripes-horizontal" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-red-600 px-3.5 py-1.5 rounded-lg font-display text-2xl tracking-wider text-white border-2 border-red-500 shadow-md">
                KFC
              </div>
              <div>
                <span className="font-display tracking-wide text-xl text-white block">
                  KFC VIỆT NAM
                </span>
                <span className="text-[10px] uppercase font-bold text-red-500 tracking-widest">
                  Vị ngon trên từng ngón tay®
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Thương hiệu gà rán số 1 thế giới có mặt tại Việt Nam từ năm 1997. 
              Công thức 11 loại thảo mộc và gia vị bí truyền mang đến hương vị giòn rụm khó quên.
            </p>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                <span className="font-bold">Tổng đài đặt hàng miễn phí: 1900 6886</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Giao hàng: 09:30 – 22:30 mỗi ngày (Kể cả lễ, Tết)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Hơn 150+ nhà hàng tại TP.HCM, Hà Nội, Đà Nẵng, Cần Thơ, Hải Phòng</span>
              </div>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="space-y-3">
            <h4 className="font-display uppercase tracking-wider text-sm text-zinc-200">
              THỰC ĐƠN PHỔ BIẾN
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Combo Gà Rán Tiết Kiệm</a></li>
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Xô Gà 5 & 8 Miếng</a></li>
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Burger Zinger Giòn Cay</a></li>
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Cơm Gà Giòn Cay KFC</a></li>
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Bánh Trứng Nướng Egg Tart</a></li>
              <li><a href="#menu-section" className="hover:text-red-400 transition-colors">Khoai Tây Chiên Lớn</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-display uppercase tracking-wider text-sm text-zinc-200">
              CHĂM SÓC KHÁCH HÀNG
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a href="#deals-section" className="hover:text-red-400 transition-colors">Kho Voucher & Khuyến Mãi</a></li>
              <li><span className="hover:text-red-400 cursor-pointer">Bảng giá & Dinh dưỡng calo</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Chính sách giao hàng 30 phút</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Tìm nhà hàng KFC gần bạn nhất</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Thẻ thành viên KFC VIP Rewards</span></li>
              <li><span className="hover:text-red-400 cursor-pointer">Liên hệ & Khiếu nại dịch vụ</span></li>
            </ul>
          </div>

          {/* App download */}
          <div className="space-y-3">
            <h4 className="font-display uppercase tracking-wider text-sm text-zinc-200">
              ỨNG DỤNG KFC VIỆT NAM
            </h4>
            <p className="text-xs text-zinc-400">
              Tải app KFC để tích điểm đổi quà và đặt hàng nhận ưu đãi bí mật.
            </p>
            <div className="space-y-2">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-3 cursor-pointer hover:border-zinc-700 transition-colors">
                <span className="text-2xl">📱</span>
                <div>
                  <div className="text-[10px] text-zinc-400 leading-none">Tải trên</div>
                  <div className="font-bold text-xs text-white">Apple App Store</div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-3 cursor-pointer hover:border-zinc-700 transition-colors">
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="text-[10px] text-zinc-400 leading-none">Cài đặt trên</div>
                  <div className="font-bold text-xs text-white">Google Play Store</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 KFC Việt Nam - Bản quyền thuộc Công ty Liên doanh KFC Việt Nam. Đã đăng ký nhãn hiệu.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Chính Sách Bảo Mật</span>
            <span>•</span>
            <span>Điều Khoản Sử Dụng</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-red-500 font-bold">
              Phục vụ với <Heart className="w-3.5 h-3.5 fill-red-500" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
