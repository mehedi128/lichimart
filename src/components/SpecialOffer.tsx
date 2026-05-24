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
    <section id="deal" className="relative scroll-mt-12 bg-brand-green-950 border-t border-b border-brand-green-900/40 py-16 md:py-24 px-4 overflow-hidden">
      
      {/* Background elegant floating elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-brand-lime/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-brand-green-800/10 blur-[130px] pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        {/* Modern Premium CTA Container with lichi pink #FFA0B4 background styled based on the Dribbble design */}
        <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-[#FFA0B4] p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(255,160,180,0.25)]">
          
          {/* Concentric ripples exact replica inspired by the reference design */}
          <div className="absolute right-[-180px] md:right-[-280px] top-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] select-none pointer-events-none flex items-center justify-center z-0">
            {/* Outermost Ring */}
            <div className="absolute w-[100%] h-[100%] rounded-full bg-white/[0.04] border border-white/[0.12]" />
            {/* Ring 4 */}
            <div className="absolute w-[82%] h-[82%] rounded-full bg-white/[0.06] border border-white/[0.16]" />
            {/* Ring 3 */}
            <div className="absolute w-[64%] h-[64%] rounded-full bg-white/[0.09] border border-white/[0.22]" />
            {/* Ring 2 */}
            <div className="absolute w-[46%] h-[46%] rounded-full bg-white/[0.14] border border-white/[0.28]" />
            {/* Innermost Ring */}
            <div className="absolute w-[28%] h-[28%] rounded-full bg-white/[0.22] border border-white/[0.38] shadow-[0_0_80px_rgba(255,255,255,0.2)]" />
          </div>

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 text-left">
            
            {/* Column 1: Promo Texts, Status Badges & Modern Timer */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 flex flex-col items-start text-left">
              <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#032014] bg-white/40 border border-white/60 px-3.5 py-1.5 rounded-full select-none shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping" />
                কালবৈশাখী স্পেশাল অফার
              </span>
              
              <div className="space-y-4 w-full text-[#032014]">
                <h2 className="font-heading text-3xl font-black md:text-5xl leading-tight tracking-tight">
                  কালবৈশাখী অফার: <br />
                  <span className="text-[#a8142f] drop-shadow-sm">
                    প্রিমিয়াম চায়না-৩
                  </span> <br />
                  এখন ১০% ছাড়ে!
                </h2>
                <p className="font-sans text-xs text-[#053220]/90 md:text-sm leading-relaxed max-w-xl font-medium">
                  এই সপ্তাহে আমাদের বাগানের চায়না-৩ লিচুতে অসাধারণ মিষ্টির স্বাদ দেখা গেছে! মধুর মতো মিষ্টি, ছোট বীজযুক্ত এবং ঘন রসালো শাঁস। আমরা আমাদের প্রতি পিসের মূল্য <span className="line-through opacity-60">৳১৮.০০</span> থেকে কমিয়ে মাত্র <span className="text-[#a8142f] font-black underline decoration-2">৳১৫.০০</span> করেছি। অফারের সময় শেষ হওয়ার আগে আজই অর্ডার করুন!
                </p>
              </div>

              {/* Countdown Blocks - Styled perfectly for readability on light-pink background */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#053220]/70 uppercase tracking-widest font-mono">অফারের সময় বাকি আছে:</p>
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/45 border border-white/70 font-heading text-base font-black text-[#032014] shadow-sm">
                      {formatNum(timeLeft.hours)}
                    </div>
                    <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#053220]/80 font-bold">ঘণ্টা</span>
                  </div>
                  <span className="text-sm font-bold text-[#032014]/60">:</span>
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/45 border border-white/70 font-heading text-base font-black text-[#032014] shadow-sm">
                      {formatNum(timeLeft.minutes)}
                    </div>
                    <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#053220]/80 font-bold">মিনিট</span>
                  </div>
                  <span className="text-sm font-bold text-[#032014]/60">:</span>
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 border border-red-500/40 font-heading text-base font-black text-rose-800 shadow-sm animate-pulse">
                      {formatNum(timeLeft.seconds)}
                    </div>
                    <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-rose-800 font-bold">সেকেন্ড</span>
                  </div>
                </div>
              </div>

              {/* Clean Action Button */}
              <div className="pt-2 w-full sm:w-auto">
                <a
                  href={`https://wa.me/8801947970939?text=${encodeURIComponent(
                    "আসসালামু আলাইকুম! আমি আপনাদের কালবৈশাখী স্পেশাল অফারের চমৎকার প্রিমিয়াম চায়না-৩ লিচু অর্ডার করতে চাই।"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-between gap-6 pl-7 pr-3 py-3.5 bg-[#032014] hover:bg-black active:scale-95 text-white font-extrabold rounded-full text-sm md:text-base tracking-wide shadow-lg transition-all duration-300 w-full sm:w-auto"
                  title="WhatsApp এ সরাসরি অর্ডার করুন"
                >
                  <span>অর্ডার করুন (WhatsApp)</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#032014] group-hover:scale-105 transition-transform duration-300">
                    <svg
                      className="h-5 w-5 fill-current text-[#25D366]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            {/* Column 2: Large Visual Showcase */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 z-10">
              {/* Premium dark floating promotional product card (High Contrast) */}
              <div className="relative mx-auto max-w-sm p-5 bg-[#032014] border border-brand-green-800/80 rounded-2xl shadow-2xl group hover:border-[#FFA0B4]/60 transition-all duration-500 text-white">
                {/* Special Hot Badge */}
                <div className="absolute -right-4 -top-4 z-10 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-brand-lime text-brand-green-950 font-sans shadow-xl border-2 border-[#032014] rotate-[-12deg] group-hover:rotate-0 transition-all duration-300">
                  <span className="text-[8px] font-extrabold leading-none uppercase tracking-wider">TOP</span>
                  <span className="text-sm font-black leading-none">সেরা</span>
                </div>

                {/* Micro Rating Indicator */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-lg bg-brand-green-950/90 backdrop-blur border border-brand-green-800 p-2.5 shadow-md">
                  <p className="text-[9px] font-bold text-gray-400 font-mono tracking-wider">রিসার্চ রেটিং</p>
                  <div className="flex text-amber-500 items-center justify-center gap-0.5 mt-0.5">
                    <span className="text-xs font-extrabold text-white mr-1">৪.৭</span>
                    <span className="text-[10px] text-yellow-400">★</span>
                  </div>
                </div>

                <img
                  src="https://lh3.googleusercontent.com/d/1VGpfbV57uBb0GP0RWVGzSfAbMg5PS_-L"
                  alt="Premium China-3 Lychees harvest"
                  className="w-full h-auto aspect-square rounded-xl object-cover transition-all duration-500 group-hover:scale-[1.03] border border-brand-green-800/60"
                  referrerPolicy="no-referrer"
                />
                
                <div className="mt-4 text-center">
                  <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wide">প্রিমিয়াম চায়না-৩ লিচু</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">আমাদের বাগান থেকে সরাসরি সেরা ফল</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
