import React, { useState } from 'react';
import { Mail, MapPin, Phone, ArrowUp, Send, Check, X, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import aboutFarmerImage from '../assets/images/lichi_about_farmer_1779383720201.png';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onWishlistToggle: () => void;
}

export default function Footer({ onNavigate, onWishlistToggle }: FooterProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsContactModalOpen(false);
      setContactForm({ name: '', email: '', phone: '', message: '' });
    }, 2800);
  };

  return (
    <footer id="footer-section" className="relative bg-[#071610] text-[#8e9f95] pt-0 pb-10 w-full mt-24 md:mt-32 font-sans overflow-visible">
      
      {/* 1. Organic Hand-Painted Brush Border Divider at the Top of Footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] select-none pointer-events-none -translate-y-[98%] h-[32px] z-10">
        <svg className="w-full h-full" viewBox="0 0 1440 32" fill="none" preserveAspectRatio="none">
          {/* Base rough paint wave fill */}
          <path 
            d="M0,32 L0,12 C120,16 240,8 360,13 C480,18 600,10 720,14 C840,17 960,20 1080,13 C1200,7 1320,16 1440,10 L1440,32 Z" 
            fill="#071610" 
          />
          {/* Accent brush splattered strokes for the premium hand-painted feeling */}
          <path 
            d="M5,13 C125,16 245,10 365,14" 
            stroke="#071610" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            opacity="0.85" 
          />
          <path 
            d="M440,16 C560,11 680,13 800,15" 
            stroke="#071610" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity="0.75" 
          />
          <path 
            d="M890,14 C1040,18 1190,11 1340,13" 
            stroke="#071610" 
            strokeWidth="4" 
            strokeLinecap="round" 
            opacity="0.9" 
          />
        </svg>
      </div>

      {/* 2. Overlapping farming community visual card */}
      <div className="relative -translate-y-16 sm:-translate-y-20 md:-translate-y-24 max-w-7xl mx-auto px-4 z-20 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 rounded-[28px] overflow-hidden bg-[#245136] shadow-2xl border border-brand-green-800/40"
        >
          {/* Left panel: Vibrant green market farm produce */}
          <div className="relative h-48 md:h-[300px]">
            <img 
              src={aboutFarmerImage} 
              alt="আমাদের ঐতিহ্যবাহী লিচু বাগান ও কৃষক পরিবার"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Soft dark green aesthetic gradient inside image edge */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#245136]/10" />
          </div>

          {/* Right panel: Bold botanical green join community banner */}
          <div className="p-8 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center items-start text-left bg-[#245136] space-y-5 md:space-y-6">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-tight">
              আমাদের চাষী পরিবারের <br /> অংশ হোন
            </h2>
            
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-white hover:bg-gray-100 text-[#245136] font-heading font-bold px-8 py-3.5 rounded-full transition-transform active:scale-95 duration-150 cursor-pointer text-xs md:text-sm tracking-widest uppercase shadow-md select-none"
            >
              যোগাযোগ করুন
            </button>
          </div>
        </motion.div>
      </div>

      {/* 3. Main Footer details content row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 -mt-6 sm:-mt-10 md:-mt-12 pb-8 grid gap-8 md:grid-cols-12 items-start text-left">
        
        {/* Brand/Playful Logo col - Left */}
        <div className="md:col-span-5 space-y-4">
          <h3 className="font-serif text-3xl sm:text-4xl text-[#6baf86] italic font-semibold tracking-wide select-none">
            তাজা লিচুর বাজার
          </h3>
          <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
            বাংলার অন্যতম সেরা ও বিশুদ্ধ তাজা গাছ পাকা অর্গানিক লিচু সরবরাহের ঐতিহ্য। সরাসরি আমাদের সতেজ ও স্বাস্থ্যকর সেরা কৃষি বাগানের স্বাদ পৌঁছে দিচ্ছি আপনার দ্বারে।
          </p>
        </div>

        {/* Address Col - Middle */}
        <div className="md:col-span-4 pt-1">
          <p className="font-heading text-white text-sm sm:text-base leading-relaxed tracking-wide font-medium">
            দিনাজপু‌রের সুস্বাদু ঐ‌তিহ‌্যবাহী লিচু অর্ডার করুণ <br /> সারা দে‌শের যে কোন প্রান্ত থে‌কে
          </p>
        </div>

        {/* Contacts Col - Right */}
        <div className="md:col-span-3 pt-1 space-y-1">
          <p className="font-heading text-white text-sm sm:text-base tracking-wide font-medium">
            <a href="mailto:mehedix129@gmail.com" className="hover:text-brand-lime transition">
              mehedix129@gmail.com
            </a>
          </p>
          <p className="font-heading text-white text-sm sm:text-base tracking-wide font-medium">
            <a href="tel:01947970939" className="hover:text-brand-lime transition">
              01947970939
            </a>
          </p>
        </div>

      </div>

      {/* Bottom Separator line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="border-t border-[#11241a] w-full my-8"></div>
      </div>

      {/* 4. Bottom Menu links row and Credits matches 128.Digital styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
        
        {/* Standard footer links column */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white font-bold text-xs uppercase tracking-widest">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-brand-lime transition duration-150 cursor-pointer"
          >
            হোম
          </button>
          <button 
            onClick={() => onNavigate('organic-products')} 
            className="hover:text-brand-lime transition duration-150 cursor-pointer"
          >
            আমাদের পরিচিতি
          </button>
          <button 
            onClick={() => onNavigate('products')} 
            className="hover:text-brand-lime transition duration-150 cursor-pointer"
          >
            আমাদের লিচু
          </button>
          <button 
            onClick={() => onNavigate('deal')} 
            className="hover:text-brand-lime transition duration-150 cursor-pointer"
          >
            আজকের ডিল
          </button>
          <button 
            onClick={() => setIsContactModalOpen(true)} 
            className="hover:text-brand-lime transition duration-150 cursor-pointer"
          >
            যোগাযোগ
          </button>
        </div>

        {/* Template copyrights block */}
        <div className="text-[11px] text-[#718278] leading-relaxed font-sans font-medium">
          <div>
            © লিচিমার্ট। সর্বস্বত্ব সংরক্ষিত। {' '}
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[#5da46f] hover:underline hover:text-brand-lime font-bold">
              লাইসেন্স নীতিমালা
            </a>
          </div>
          <div className="text-[10px] mt-0.5 text-gray-550">
            সম্পূর্ণ বিশুদ্ধ ও ফরমালিন মুক্ত লিচুর বিশ্বস্ত ঠিকানা।
          </div>
        </div>

      </div>

      {/* Floating scroll to top key */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 flex justify-end">
        <button
          onClick={handleScrollTop}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-brand-green-900 border border-brand-green-800 text-gray-400 hover:text-[#071610] hover:bg-brand-lime transition-all active:scale-95"
          title="Scroll back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      {/* 5. Contact Form Overlap Dialog Overlay */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactModalOpen(false)}
              className="absolute inset-0 bg-[#020b08]/85 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-[#081f14] border border-[#245136] p-6 sm:p-8 text-left text-white shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#245136]/50 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-lime" />
                  <h3 className="font-heading text-lg font-bold">আমাদের বাগানের সাথে যুক্ত হোন</h3>
                </div>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="rounded-full bg-brand-green-950 hover:bg-[#245136] p-1.5 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-lime/10 border border-brand-lime text-brand-lime animate-bounce">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="font-heading text-base font-bold text-[#FFA0B4]">আপনার তথ্যটি সফলভাবে পাঠানো হয়েছে!</h4>
                  <p className="text-xs text-gray-350 max-w-sm mx-auto leading-relaxed">
                    যোগাযোগ করার জন্য আপনাকে আন্তরিক ধন্যবাদ। আমাদের লজিস্টিকস ও কাস্টমার কেয়ার বিভাগ খুব শীঘ্রই (৬০ মিনিটের মধ্যে) আপনার সাথে যোগাযোগ করবে!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">আপনার নাম</label>
                    <input 
                      type="text" 
                      required
                      placeholder="যেমন: আমিনুল ইসলাম"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full h-11 bg-brand-green-950/80 rounded-xl px-4 border border-brand-green-800 focus:outline-none focus:border-brand-lime font-medium text-white transition text-xs"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">ইমেইল ঠিকানা</label>
                      <input 
                        type="email" 
                        required
                        placeholder="aminul@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full h-11 bg-brand-green-950/80 rounded-xl px-4 border border-brand-green-800 focus:outline-none focus:border-brand-lime font-medium text-white transition text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">মোবাইল নম্বর</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="যেমন: +8801700000000"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full h-11 bg-[#05150d] rounded-xl px-4 border border-brand-green-800 focus:outline-none focus:border-brand-lime font-medium text-white transition text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">আপনার বার্তা বা প্রশ্ন</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="বিশেষ কোনো অর্ডার, কোম্পানির রিকোয়ারমেন্টস অথবা যেকোনো প্রশ্ন থাকলে বিস্তর লিখুন..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full bg-brand-green-950/80 rounded-xl p-4 border border-brand-green-800 focus:outline-none focus:border-brand-lime font-medium text-white transition text-xs resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-1">
                    <ShieldCheck className="h-4.5 w-4.5 text-brand-lime shrink-0" />
                    <span>আপনার মূল্যবান ডেটা সম্পূর্ণ গোপন, নিরাপদ এবং বিশ্বস্ততার সাথে সংরক্ষিত থাকবে।</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-brand-lime hover:bg-brand-lime-hover text-brand-green-950 font-bold tracking-wider uppercase flex items-center justify-center gap-2 text-xs transition cursor-pointer mt-4 select-none"
                  >
                    <Send className="h-4 w-4" />
                    <span>যোগাযোগ করুন</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </footer>
  );
}
