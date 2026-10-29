import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const HeritageSection: React.FC = () => {
  const pillars = [
    {
      title: '11 Loại Thảo Mộc & Gia Vị',
      desc: 'Công thức độc quyền từ năm 1939 được cất giữ trong két sắt bảo mật tại Kentucky. Sự hòa quyện hoàn hảo giữa vị thơm thảo mộc và hạt tiêu cay nhẹ.',
      icon: '🌿',
      tag: 'CÔNG THỨC BÍ MẬT',
    },
    {
      title: 'Tẩm Bột Thủ Công Tại Bếp',
      desc: 'Gà tại KFC không làm sẵn từ nhà máy. Các đầu bếp lăn và tẩm bột thủ công tươi mới mỗi ngày ngay tại gian bếp cửa hàng trước khi chiên.',
      icon: '👨‍🍳',
      tag: 'TƯƠI MỖI NGÀY',
    },
    {
      title: 'Chiên Áp Suất Độc Quyền',
      desc: 'Nồi chiên áp suất chuyên dụng giúp khóa chặt lớp da giòn rụm bên ngoài và giữ lại toàn bộ độ ẩm mọng nước ngọt ngào của thịt gà bên trong.',
      icon: '🔥',
      tag: 'MỌNG NƯỚC 100%',
    },
    {
      title: 'Thịt Gà Nông Trại Chuẩn Sạch',
      desc: 'Nguồn thịt gà tươi từ các trang trại đạt chuẩn VietGAP, không chất kích thích tăng trọng. Kiểm định nghiêm ngặt an toàn vệ sinh thực phẩm.',
      icon: '🍗',
      tag: 'CHẤT LƯỢNG HÀNG ĐẦU',
    },
  ];

  return (
    <section className="bg-stone-50 border-t border-zinc-200 py-16 relative overflow-hidden text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Di Sản & Nghệ Thuật Nấu Nướng Của Đại Tá Sanders</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display uppercase tracking-wide text-zinc-950">
            TẠI SAO GÀ RÁN KFC VIỆT NAM <br />
            <span className="text-red-600">LUÔN GIÒN TAN & ĐẬM ĐÀ KHÓ CƯỠNG</span>
          </h2>

          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            Từ năm 1939 đến nay, chúng tôi không bao giờ chọn con đường dễ dàng. Từng chiếc đùi, cánh gà đều được làm tỉ mỉ, chiên áp suất nóng hổi phục vụ tận tay người Việt.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between hover:border-red-500 hover:shadow-xl hover:shadow-red-600/10 transition-all group shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 group-hover:scale-110 transition-transform">
                    {p.icon}
                  </span>
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                    {p.tag}
                  </span>
                </div>

                <h3 className="font-extrabold text-zinc-950 text-base sm:text-lg mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-red-600 font-bold">
                <span>Chứng Nhận Chuẩn Vị KFC</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Big Banner Quote */}
        <div className="mt-14 bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white border-2 border-red-800 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-red-600/20">
          <div className="space-y-2 text-center md:text-left">
            <div className="font-display text-2xl sm:text-3xl uppercase tracking-wide">
              &quot;VỊ NGON TRÊN TỪNG NGÓN TAY - CHẤT LƯỢNG TẠO NÊN NIỀM TIN.&quot;
            </div>
            <p className="text-xs text-red-100 font-medium">
              — Đại tá Harland Sanders, Nhà sáng lập thương hiệu Kentucky Fried Chicken
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-white text-zinc-950 px-5 py-3 rounded-2xl shadow-lg border-2 border-red-800">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-display text-2xl flex items-center justify-center shadow-md">
              KFC
            </div>
            <div className="text-left font-display uppercase tracking-wide text-xs text-zinc-900">
              KFC VIỆT NAM <br />
              <span className="text-red-600 font-sans font-bold text-[10px]">HƠN 150 CỬA HÀNG TOÀN QUỐC</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
