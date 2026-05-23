import React, { useState } from 'react';
import { TESTIMONIALS } from '../data';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
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
          ❤️ ক্রেতাদের মতামত
        </span>
        <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl mt-4 mb-12">
          সম্মানিত ক্রেতাদের প্রশংসাপত্র ও রিভিউ
        </h2>

        {/* Carousel Frame */}
        <div className="relative mx-auto max-w-3xl rounded-2xl border border-brand-green-800 bg-[#032014] p-6 md:p-10 shadow-2xl">
          {/* Quote icon banner background */}
          <div className="absolute left-6 top-6 text-brand-green-900/40 pr-4">
            <Quote className="h-10 w-10 md:h-14 md:w-14 shrink-0 stroke-[1.5]" />
          </div>

          <div className="relative z-10 space-y-6">
            
            {/* Star ratings */}
            <div className="flex justify-center text-yellow-450 gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4.5 w-4.5 fill-current text-yellow-400" />
              ))}
            </div>

            {/* Quote feedback */}
            <p className="font-sans text-sm md:text-base text-gray-305 max-w-2xl mx-auto italic leading-relaxed">
              "{current.feedback}"
            </p>

            {/* User Profile Frame */}
            <div className="flex flex-col items-center space-y-2 pt-2">
              <div className="h-14 w-14 rounded-full border border-brand-lime/20 p-0.5 overflow-hidden">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="h-full w-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center">
                <h4 className="font-heading text-sm font-extrabold text-white">{current.name}</h4>
                <p className="font-mono text-[10px] text-brand-lime tracking-wider uppercase">{current.role}</p>
              </div>
            </div>

          </div>

          {/* Carousel Buttons */}
          <div className="absolute inset-y-1/2 -translate-y-1/2 left-2 right-2 md:-left-6 md:-right-6 flex justify-between pointers-none">
            <button
               onClick={handlePrev}
               className="pointer-events-auto h-10 w-10 rounded-full bg-brand-green-900 border border-brand-green-800 text-gray-300 hover:text-white hover:bg-brand-green-800 transition flex items-center justify-center cursor-pointer shadow-md"
               title="Previous Feed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
               onClick={handleNext}
               className="pointer-events-auto h-10 w-10 rounded-full bg-brand-green-900 border border-brand-green-800 text-gray-300 hover:text-white hover:bg-brand-green-800 transition flex items-center justify-center cursor-pointer shadow-md"
               title="Next Feed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 pt-8">
            {TESTIMONIALS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === dotIdx ? 'w-6 bg-brand-lime' : 'w-2 bg-brand-green-800 hover:bg-brand-green-700'
                }`}
                title={`Slide to ${dotIdx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* Dynamic bottom highlights */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-brand-lime text-lg">✦</span>
            <span>১০০% যাচাইকৃত আসল কাস্টমার</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand-lime text-lg">✦</span>
            <span>সরাসরি লিচু বাগান থেকে সংগ্রহ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand-lime text-lg">✦</span>
            <span>৪.৯/৫ সার্বিক সন্তুষ্টির রেটিং</span>
          </div>
        </div>

      </div>
    </section>
  );
}
