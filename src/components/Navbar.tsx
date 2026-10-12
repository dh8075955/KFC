import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  PhoneCall, 
  Menu, 
  X, 
  Layers, 
  Calculator, 
  Layout, 
  CheckCircle,
  MessageCircle
} from 'lucide-react';

interface NavbarProps {
  onOpenBuilder: () => void;
  onOpenCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBuilder, onOpenCalculator }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Mẫu Giao Diện', href: '#templates', icon: Layout },
    { name: 'Tự Làm Web Thử', href: '#builder', icon: Sparkles, highlight: true },
    { name: 'Tính Chi Phí Tức Thì', href: '#calculator', icon: Calculator },
    { name: 'Bảng Giá Trọn Gói', href: '#pricing', icon: Layers },
    { name: 'Quy Trình', href: '#workflow', icon: CheckCircle },
    { name: 'Tư Vấn Ngay', href: '#contact', icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  LamWebsite<span className="text-cyan-400">.vn</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Thiết kế website chuẩn SEO & Chuyển đổi</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  link.highlight
                    ? 'text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="tel:0988123456" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <PhoneCall className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-xs tracking-wide">0988.123.456</span>
            </a>

            <a
              href="#builder"
              onClick={onOpenBuilder}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-xl group bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="px-4 py-2 transition-all ease-in duration-75 rounded-[10px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-200" />
                Tự Tạo Web Thử Ngay
              </span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="#builder"
              className="text-xs px-3 py-2 rounded-lg bg-indigo-600 text-white font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tạo Web
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-900"
            >
              <link.icon className="w-5 h-5 text-indigo-400" />
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="tel:0988123456"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 text-emerald-400 font-semibold border border-slate-800"
            >
              <PhoneCall className="w-4 h-4" />
              Hotline: 0988.123.456 (24/7)
            </a>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 text-white font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              Chat Trực Tiếp Qua Zalo
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
