import React, { useState } from 'react';
import { TESTIMONIALS } from '../data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handlePrev = () => {
    setIsLightboxOpen(false);
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsLightboxOpen(false);
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="relative scroll-mt-12 bg-brand-green-950 py-16 md:py-24 overflow-hidden px-4 border-b border-brand-green-905/60">
      {/* Curved background decor */}
      <div className="absolute left-[-10%] top-[-10%] -z-10 h-96 w-96 rounded-full bg-brand-lime/5 blur-[120px]" />
      <div className="absolute right-[-10%] bottom-[-10%] -z-10 h-72 w-72 rounded-full bg-red-500/5 blur-[120px]" />

      <div className="mx-auto max-w-5xl text-center">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-lime block bg-brand-green-900/60 px-4 py-1.5 rounded-full border border-brand-green-800 w-fit mx-auto select-none">
          ❤️ ১০০% আসল কাস্টমার রিভিউ
        </span>
        <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl mt-4 mb-12">
          সম্মানিত ক্রেতাদের প্রশংসাপত্র ও রিভিউ
        </h2>

        {/* Carousel Frame */}
        <div className="relative mx-auto max-w-2xl">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto max-w-2xl rounded-2xl border border-brand-green-850 bg-brand-green-900/30 text-left shadow-2xl overflow-hidden cursor-pointer group"
              id={`fb-post-${current.id}`}
              onClick={() => setIsLightboxOpen(true)}
            >
              <div className="relative w-full overflow-hidden bg-brand-green-950 flex items-center justify-center p-1 sm:p-2">
                <img
                  src={current.fbScreenshot}
                  alt={`${current.name}'s verified Facebook review`}
                  className="w-full h-auto object-contain max-h-[440px] sm:max-h-[500px] rounded-xl shadow-lg border border-brand-green-800/50 group-hover:scale-[1.01] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover Zoom badge overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xs font-sans">
                  <span className="bg-brand-green-950/90 border border-brand-lime/60 px-4 py-2 rounded-full text-brand-lime font-medium flex items-center gap-1.5 shadow-xl select-none">
                    🔍 ক্লিক করে বড় আকারে দেখুন / Click to Zoom Feedback
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Overlay Buttons outside of the post */}
          <div className="absolute inset-y-1/2 -translate-y-1/2 -left-4 -right-4 md:-left-8 md:-right-8 flex justify-between pointer-events-none">
            <button
               onClick={handlePrev}
               className="pointer-events-auto h-11 w-11 rounded-full bg-[#242526] border border-[#3e4042]/80 text-gray-300 hover:text-white hover:bg-[#3a3b3c] transition flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95 duration-150"
               title="Previous Feed"
            >
              <ChevronLeft className="h-5.5 w-5.5" />
            </button>
            <button
               onClick={handleNext}
               className="pointer-events-auto h-11 w-11 rounded-full bg-[#242526] border border-[#3e4042]/80 text-gray-300 hover:text-white hover:bg-[#3a3b3c] transition flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95 duration-150"
               title="Next Feed"
            >
              <ChevronRight className="h-5.5 w-5.5" />
            </button>
          </div>

          {/* Carousel Dots / Step navigation indicator */}
          <div className="flex justify-center gap-2 pt-6">
            {TESTIMONIALS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === dotIdx ? 'w-6 bg-brand-lime' : 'w-2 bg-[#3e4042] hover:bg-gray-600'
                }`}
                title={`Slide to review ${dotIdx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* Dynamic bottom highlights */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12 text-xs font-mono text-gray-400 select-none">
          <div className="flex items-center gap-2">
            <span className="text-brand-lime text-lg">✦</span>
            <span>১০০% যাচাইকৃত ফেসবুক কাস্টমার</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand-lime text-lg">✦</span>
            <span>সরাসরি লিচু বাগান থেকে সংগ্রহ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand-lime text-lg">✦</span>
            <span>৫/৫ কাস্টমার সন্তুষ্টির রেটিং</span>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && current.fbScreenshot && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-zoom-out select-none"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center cursor-default"
          >
            {/* Close button */}
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 bg-brand-green-950 border border-brand-lime/40 text-white hover:text-brand-lime font-mono text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 duration-150 shadow-lg cursor-pointer"
              title="Close zoom view"
            >
              <span>✕ বন্ধ করুন (Close)</span>
            </button>
            
            <img
              src={current.fbScreenshot}
              alt={`${current.name}'s verified Facebook review`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg border border-[#3e4042]/50 shadow-2xl bg-[#18191a]"
              referrerPolicy="no-referrer"
            />
            
            <p className="mt-4 text-gray-400 text-xs font-mono text-center">
              {current.name} এর ফেসবুক থেকে সংগৃহীত প্রকৃত স্ক্রিনশট রিভিউ
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
