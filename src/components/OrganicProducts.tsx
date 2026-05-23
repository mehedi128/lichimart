import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X } from 'lucide-react';
import lichiVideoPlaceholder from '../assets/images/lichi_video_placeholder_1779545654903.png';

export default function OrganicProducts() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Custom premium inline thin-line SVGs representing premium lychee harvesting, handling, and organic cultivation
  const treeFreshIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-10 w-10 text-brand-lime stroke-[1.5]" fill="none" stroke="currentColor">
      <circle cx="24" cy="24" r="18" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 23l5 5 10-10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 28c1-1.5 2.5-3 4-3.5" />
    </svg>
  );

  const brixSweetnessIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-10 w-10 text-brand-lime stroke-[1.5]" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M24 7C24 7 13 21 13 29a11 11 0 0 0 22 0c0-8-11-22-11-22z" />
      <circle cx="21" cy="25" r="2" />
      <circle cx="27" cy="31" r="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M27 23l-6 10" />
    </svg>
  );

  const chemicalFreeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-10 w-10 text-brand-lime stroke-[1.5]" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M24 6c11 0 14 4 14 14 0 10-9 18-14 22-5-4-14-12-14-22 0-10 3-14 14-14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M24 14v16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M24 18c3-3 6-3 8-7-4 0-6 2-8 7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M24 22c-3-2-6-2-8-5 4 0 6 1 8 5z" />
    </svg>
  );

  return (
    <section id="organic-products" className="bg-brand-green-950 text-gray-200 py-16 md:py-24 border-y border-brand-green-900/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
          
          {/* Left Column: Title & Action Button */}
          <div className="flex-1 space-y-6 md:space-y-8 max-w-xl text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-heading leading-[1.15]">
              লিচিমার্ট এর বাগানে <br className="hidden sm:inline" /> আপনাকে স্বাগতম
            </h2>
            <div>
              <button 
                id="view-about-us-btn"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center rounded-full bg-brand-lime hover:bg-brand-lime-hover text-brand-green-950 px-8 py-3 text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-0.5 shadow-md active:translate-y-0 cursor-pointer"
              >
                আমাদের সম্পর্কে
              </button>
            </div>
          </div>

          {/* Right Column: Stats (৩ লক্ষ+ Delivered and ৫০০+ Happy Customers) */}
          <div className="lg:w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 text-left">
            
            {/* Stat 1 */}
            <div className="space-y-3">
              <span className="block text-4xl sm:text-5xl font-extrabold text-brand-lime tracking-tight font-heading leading-none">
                ৩ লক্ষ+
              </span>
              <h4 className="text-sm font-bold text-white tracking-wide uppercase font-sans">লিচু সরবরাহ করা হয়েছে</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-sans mt-1">
                বাছাই করা প্রিমিয়াম মানের সতেজ লিচু, সম্পূর্ণ সতর্কতার সাথে পরীক্ষা করে সরাসরি আমাদের বাগান থেকে সতেজ অবস্থায় সরবরাহ করা হয়ে থাকে।
              </p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-3">
              <span className="block text-4xl sm:text-5xl font-extrabold text-brand-lime tracking-tight font-heading leading-none">
                ৫০০+
              </span>
              <h4 className="text-sm font-bold text-white tracking-wide uppercase font-sans">সুখী গ্রাহক</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-sans mt-1">
                দেশের শত শত সচেতন পরিবার ও খাদ্যরসিক যারা আমাদের সম্পূর্ণ প্রাকৃতিক পদ্ধতিতে উৎপাদিত মধুর মতো মিষ্টি লিচুর পরম প্রশংসা করছেন।
              </p>
            </div>

          </div>

        </div>

        {/* Video Banner Wrapper with Play Button */}
        <div className="relative">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-[24px] sm:rounded-[36px] shadow-2xl group border border-brand-green-800">
            {/* Main Picture representing the organic farming fields & worker */}
            <img 
              src={lichiVideoPlaceholder} 
              alt="Organic Lychee Orchard Dawn Harvest Video" 
              className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
            {/* Hover overlay pattern */}
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-300" />

            {/* Pristine White Centered Play Control Button */}
            <button 
              id="trigger-organic-video-btn"
              onClick={() => setIsVideoOpen(true)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-brand-lime rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 z-10 group animate-pulse"
              aria-label="Play video"
            >
              <Play className="h-6 w-6 sm:h-8 sm:w-8 text-brand-green-950 fill-brand-green-950 ml-1 transition-transform group-hover:scale-110" />
              {/* Outer wave ring effect */}
              <span className="absolute inset-0 rounded-full bg-brand-lime/40 -z-10 animate-ping opacity-75" />
            </button>
          </div>
        </div>

        {/* Three Columns features below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-4">
          
          {/* Card 1 */}
          <div className="space-y-4 text-left group">
            <div className="p-1.5 inline-block bg-brand-green-900/60 rounded-2xl border border-brand-green-800 group-hover:border-brand-lime/30 group-hover:bg-brand-green-900 transition-all duration-300">
              {treeFreshIcon}
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white font-heading block">
              ১০০% সতেজতার গ্যারান্টি
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed font-sans">
              ভোরের প্রথম শিশির ভেজা তাজা সোনালী সময়ে আমাদের বাগান থেকে যত্ন সহকারে সংগৃহীত এবং সর্বোচ্চ সতেজতা ও গুণমান বজায় রেখে সোজাসুজি আপনার কাছে পৌঁছে দেওয়া হয়।
            </p>
          </div>

          {/* Card 2 */}
          <div className="space-y-4 text-left group">
            <div className="p-1.5 inline-block bg-brand-green-900/60 rounded-2xl border border-brand-green-800 group-hover:border-brand-lime/30 group-hover:bg-brand-green-900 transition-all duration-300">
              {brixSweetnessIcon}
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white font-heading block">
              সর্বোচ্চ মিষ্টি পরিমাপক মানদণ্ড
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed font-sans">
              প্রতিটি লিচু বিশেষভাবে পরীক্ষিত — নিশ্চিত করা হয় যেন প্রতিটি কামড়ে পাওয়া যায় খাঁটি মিষ্টি ও রসালো স্বাদ।
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-4 text-left group">
            <div className="p-1.5 inline-block bg-brand-green-900/60 rounded-2xl border border-brand-green-800 group-hover:border-brand-lime/30 group-hover:bg-brand-green-900 transition-all duration-300">
              {chemicalFreeIcon}
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white font-heading block">
              পোকামুক্ত লিচু
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed font-sans">
              বাজারের অনেক লিচুতেই পোকার সমস্যা থাকে, যা স্বাস্থ্যের জন্য ক্ষতিকর। আমার পোকামুক্ত লিচু সরবারহ করে থাকি, যেন আপনি ও আপনার পরিবার পান সম্পূর্ণ নিরাপদ ও পরিষ্কার লিচু।
            </p>
          </div>

        </div>

      </div>

      {/* Embedded Video Showcase Pop-up Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal opaque background dark sheet */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Video container card popup styled for vertical Shorts video */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[380px] rounded-3xl overflow-hidden bg-black aspect-[9/16] max-h-[85vh] z-10 border border-brand-green-800 shadow-2xl"
            >
              {/* Close Button top-right */}
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-20 rounded-full bg-black/60 hover:bg-black/90 p-2.5 text-white hover:text-brand-lime transition shadow-md cursor-pointer"
                aria-label="Close video player"
              >
                <X className="h-5 w-5" />
              </button>

              {/* LichiMart Orchard Short Video Embed */}
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/WVyXlzMFMko?autoplay=1" 
                title="LichiMart Lychee Orchard Harvest"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

