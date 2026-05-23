import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Phone, Menu, X, Facebook } from 'lucide-react';
import LichiMartLogo from './LichiMartLogo';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartToggle: () => void;
  onWishlistToggle: () => void;
  onNavigate: (sectionId: string) => void;
}

export default function Header({
  cartCount,
  wishlistCount,
  searchQuery,
  onSearchChange,
  onCartToggle,
  onWishlistToggle,
  onNavigate,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'হোম', target: 'home' },
    { label: 'আমাদের বৈশিষ্ট্য', target: 'organic-products' },
    { label: 'আমাদের পণ্য', target: 'products' },
    { label: 'বিশেষ অফার', target: 'deal' },
    { label: 'গ্রাহক মতামত', target: 'testimonials' },
  ];

  const handleNavClick = (target: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(target);
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 w-full border-b border-brand-green-800 bg-brand-green-950/95 backdrop-blur-md transition-all">
      {/* Top Banner with phone and FB */}
      <div className="hidden bg-brand-green-900 px-4 py-2 text-xs text-brand-lime sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              কীভাবে অর্ডার করবেন? কল/হোয়াটসঅ্যাপ: <a href="tel:01947970939" className="hover:underline font-semibold text-white cursor-pointer">01947970939</a>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/lichimart"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Facebook className="h-3.5 w-3.5 fill-current" />
              <span>আমাদের ফেসবুক পেজ ভিজিট করুন: facebook.com/lichimart</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex cursor-pointer items-center gap-1.5 md:gap-2 select-none"
        >
          <LichiMartLogo className="h-9 sm:h-10 md:h-11 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleNavClick(item.target)}
              className="font-heading text-sm font-medium text-gray-300 hover:text-brand-lime transition-all duration-200 relative group py-1"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-lime transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* Dynamic Search & Interaction Tray */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Social Mobile Shortcut (Visible on Mobile) */}
          <a
            href="https://www.facebook.com/lichimart"
            target="_blank"
            rel="noreferrer"
            className="flex sm:hidden p-1.5 text-gray-300 hover:text-brand-lime"
            title="Facebook Page"
          >
            <Facebook className="h-5 w-5 fill-current" />
          </a>

          {/* Wishlist Button */}
          <button
            onClick={onWishlistToggle}
            className="relative p-2 text-gray-300 hover:text-[#ff4a4a] transition-all"
            id="wishlist-trigger-btn"
            title="My Wishlist"
          >
            <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={onCartToggle}
            className="relative flex items-center gap-1.5 rounded-full bg-brand-green-800 hover:bg-brand-green-700 px-3 py-1.5 text-white transition-all cursor-pointer"
            id="cart-trigger-btn"
            title="Cart Drawer"
          >
            <ShoppingBag className="h-4 w-4 text-[#FFA0B4]" />
            <span className="font-heading text-xs font-semibold">{cartCount}</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-brand-lime ring-2 ring-brand-green-950"></span>
            )}
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-gray-300 hover:text-[#FFA0B4] transition-all"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-green-800 bg-brand-green-950 px-4 py-4 space-y-4">

          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => handleNavClick(item.target)}
                className="text-left py-2 font-heading text-sm text-gray-300 hover:text-[#FFA0B4] border-b border-brand-green-900"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-400 pt-2 font-mono gap-1">
            <a href="tel:01947970939" className="hover:text-brand-lime">কল/হোয়াটসঅ্যাপ: 01947970939</a>
            <span>📍 সরাসরি বাগান থেকে তাজা সরবরাহ</span>
          </div>
        </div>
      )}
    </header>
  );
}
