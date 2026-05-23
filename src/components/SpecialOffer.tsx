import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Tag, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SpecialOfferProps {
  onClaimOffer: () => void;
}

export default function SpecialOffer({ onClaimOffer }: SpecialOfferProps) {
  // Let's set a countdown timer target: e.g., 2 days or 18 hours from now
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 48,
    seconds: 53,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer to keep demo lively
          return { hours: 12, minutes: 48, seconds: 53 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, '0');

  return (
    <section id="deal" className="relative scroll-mt-12 bg-brand-green-950 border-b border-brand-green-900/60 py-16 md:py-24 overflow-hidden px-4">
      {/* Decorative gradient orb */}
      <div className="absolute right-[-10%] top-[-10%] -z-10 h-96 w-96 rounded-full bg-brand-lime/10 blur-[130px]" />
      <div className="absolute left-[-5%] bottom-[-5%] -z-10 h-80 w-80 rounded-full bg-brand-green-800/20 blur-[110px]" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-12 text-center lg:text-left">
          
          {/* Column 1: Promo Texts & Timer */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-lime block bg-brand-green-900/60 px-4 py-1.5 rounded-full border border-brand-green-800 w-fit select-none">
              ⭐ বিশেষ গ্রীষ্মকালীন অফার
            </span>
            
            <div className="space-y-3 w-full">
              <h2 className="font-heading text-3xl font-extrabold text-white md:text-5xl lg:leading-tight">
                তাত্ক্ষণিক অফার: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-brand-lime to-amber-500">
                  প্রিমিয়াম চায়না-৩
                </span> <br />
                এখন ১৫% ছাড়ে!
              </h2>
              <p className="font-sans text-xs text-gray-300 md:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                এই সপ্তাহে আমাদের বাগানের চায়না-৩ লিচুতে অসাধারণ মিষ্টির স্বাদ দেখা গেছে! মধুর মতো মিষ্টি, ছোট বীজযুক্ত এবং ঘন রসালো শাঁস। আমরা আমাদের প্রতি পিসের মূল্য <span className="line-through text-gray-405">৳১৮.০০</span> থেকে কমিয়ে মাত্র <strong className="text-brand-lime">৳১৫.০০</strong> করেছি। অফারের সময় শেষ হওয়ার আগে আজই অর্ডার করুন!
              </p>
            </div>

            {/* Countdown Blocks - Styled matching example circular countdowns */}
            <div className="flex items-center gap-3 md:gap-4 pt-2">
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-green-900/60 border border-brand-green-800 font-heading text-lg font-extrabold text-white shadow-sm md:h-16 md:w-16 md:text-xl">
                  {formatNum(timeLeft.hours)}
                </div>
                <span className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400">ঘণ্টা</span>
              </div>
              <span className="text-lg font-bold text-brand-lime">:</span>
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-green-900/60 border border-brand-green-800 font-heading text-lg font-extrabold text-white shadow-sm md:h-16 md:w-16 md:text-xl">
                  {formatNum(timeLeft.minutes)}
                </div>
                <span className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400">মিনিট</span>
              </div>
              <span className="text-lg font-bold text-brand-lime">:</span>
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-950/60 border border-red-900/60 font-heading text-lg font-extrabold text-[#f43f5e] shadow-sm md:h-16 md:w-16 md:text-xl animate-pulse">
                  {formatNum(timeLeft.seconds)}
                </div>
                <span className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-rose-450">সেকেন্ড</span>
              </div>
            </div>

            {/* Claim list benefits */}
            <div className="grid gap-2.5 max-w-md pt-2 text-left">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-lime" />
                <span>লিমিটেড কুপন ব্যবহার করুন: <strong className="text-white font-mono bg-brand-green-900 border border-brand-green-800 px-1.5 py-0.5 rounded">LICHIMART10</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-lime" />
                <span>সরাসরি এক্সপ্রেস হোম ডেলিভারি অন্তর্ভুক্ত</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={onClaimOffer}
                className="group flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-lime hover:bg-brand-lime-hover px-7 h-12 text-xs font-bold text-brand-green-950 uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>অফারটি গ্রহণ করুন</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-green-800 bg-brand-green-900/50 rounded-full text-xs text-gray-300 shadow-sm">
                <Clock className="h-4 w-4 text-brand-lime" />
                <span>ডেলিভারি: আগামী কাল ভোর ৫:০০ টায় নির্ধারিত</span>
              </div>
            </div>
          </div>

          {/* Column 2: Large Visual Showcase */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            {/* Visual background rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-80 w-80 rounded-full border border-dashed border-brand-green-800/45 animate-spin [animation-duration:40s]" />
              <div className="absolute h-64 w-64 rounded-full border border-brand-green-900/30" />
            </div>

            {/* Main floating promotional product */}
            <div className="relative mx-auto max-w-xs p-6 bg-[#032014] border border-brand-green-800 rounded-2xl shadow-2xl backdrop-blur-sm group hover:border-brand-lime transition-all duration-500">
              {/* Spinning 60% badge */}
              <div className="absolute -right-4 -top-4 z-10 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-yellow-450 text-gray-950 shadow-xl border-3 border-[#032014] font-heading rotate-[-12deg] group-hover:rotate-0 transition-all duration-300">
                <span className="text-[9px] font-extrabold font-mono leading-none">হট</span>
                <span className="text-base font-black leading-none">সেরা</span>
                <span className="text-[8px] font-extrabold leading-none">বিক্রেতা</span>
              </div>

              <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-lg bg-brand-green-950 shadow-md border border-brand-green-800 p-2.5">
                <p className="text-[9px] font-bold text-gray-400 font-mono uppercase tracking-wider">রিসার্চ রেটিং</p>
                <div className="flex text-amber-500 items-center justify-center gap-0.5 mt-1">
                  <span className="text-xs font-bold text-white mr-1">৪.৭</span>
                  <span className="text-[10px] text-yellow-400">★</span>
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=500&auto=format&fit=crop"
                alt="Premium China-3 Lychees harvest"
                className="w-full h-auto aspect-square rounded-xl object-cover transition-transform duration-500 group-hover:scale-105 border border-brand-green-800"
                referrerPolicy="no-referrer"
              />
              
              <div className="mt-4 text-center">
                <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wide">প্রিমিয়াম চায়না-৩ লিচু</h4>
                <p className="text-[10px] text-gray-400 mt-1">আমাদের সর্বাধিক কাঙ্ক্ষিত চমৎকার ফল</p>
              </div>
            </div>

            <div className="absolute right-4 bottom-4 z-10 rounded-full bg-brand-lime text-brand-green-955 font-bold px-3 py-1.5 text-[10px] font-mono shadow-md animate-bounce">
              🚚 ৬০ মিনিটে এক্সপ্রেস ডেলিভারি প্রস্তুত
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
