import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Flame, ShieldCheck, Star, Sparkles, Award, Leaf } from 'lucide-react';
import heroBanner from '../assets/images/lichi_hero_banner_1779383697884.png';

interface HeroProps {
  onExploreClick: () => void;
  phone: string;
}

export default function Hero({ onExploreClick, phone }: HeroProps) {
  return (
    <section 
      id="home" 
      className="relative overflow-hidden pb-16 pt-20 md:pb-24 lg:pt-28 min-h-[75vh] flex items-center bg-brand-green-950"
    >
      {/* Background image overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src={heroBanner} 
          alt="LichiMart Orchard Banner" 
          className="w-full h-full object-cover opacity-85 filter brightness-[0.6] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Dark radial gradient and linear mask to protect readability of the typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-green-950/15 via-brand-green-950/45 to-brand-green-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#02140d_85%)]" />
      </div>

      {/* Decorative ambient glowing orbs */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-lime/10 blur-[120px] pointer-events-none" />
      <div className="absolute left-10 bottom-10 h-72 w-72 rounded-full bg-red-600/10 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 md:px-6 z-10 w-full text-center flex flex-col items-center justify-center space-y-6 md:space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full bg-brand-green-905 px-4 py-1.5 border border-brand-green-800 text-xs font-semibold text-brand-lime backdrop-blur-sm"
        >
          <Flame className="h-4 w-4 text-red-500 fill-red-500/25 animate-bounce" />
          <span>অত্যন্ত সুমিষ্টি ও রসালো লিচু তোলার মরসুম শুরু হয়েছে!</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-4 max-w-3xl"
        >
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white lg:leading-[1.15]">
            গাছ পাকা <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-[#fafcfa]">
              দিনাজপুরের লিচু
            </span> <br />
            সরাসরি বাগান থেকে
          </h1>
          <p className="font-sans text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
           লিচুপ্রেমী সকলকে LichiMart দিনাজপুরে স্বাগতম । আমাদের লক্ষ্য আপনাদের হাতে পৌঁছে দেওয়া ফরমালিনমুক্ত ও কার্বাইডমুক্ত দিনাজপুরের ফ্রেশ লিচু। দিনাজপুরের সব জনপ্রিয় ও বিখ্যাত লিচু একসাথে পাবেন আমাদের কাছে।
          </p>
        </motion.div>



        {/* Call to Actions Centered */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto"
        >
          <button
            onClick={onExploreClick}
            className="group flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-lime hover:bg-brand-lime-hover px-10 py-4 text-sm font-semibold text-brand-green-950 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <span>লিচুগুলো দেখুন</span>
            <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform text-brand-green-950" />
          </button>

          <a
            href={`https://wa.me/${phone.startsWith('88') ? phone.replace(/[^0-9]/g, '') : `88${phone.replace(/[^0-9]/g, '')}`}?text=${encodeURIComponent(
              "আসসালামু আলাইকুম! আমি তরতাজা প্রিমিয়াম লিচু অর্ডার করতে চাই।"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center justify-center gap-3 rounded-full bg-[#23cc62] hover:bg-[#1ebd54] px-8 py-3.5 text-sm text-white font-bold transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <svg
              className="h-5 w-5 fill-current shrink-0 text-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.09-2.885-6.948C16.828 2.001 14.364 1.001 11.8 1c-5.451 0-9.88 4.372-9.884 9.802-.001 1.77.483 3.5 1.398 5.01L2.3 21.03l5.347-1.4c1.512.825 3.125 1.258 4.757 1.258h.01c-.002 0-.002 0 0 0zm12.516-6.611c-.329-.165-1.948-.962-2.247-1.071-.3-.11-.518-.165-.736.165-.218.329-.844 1.071-1.035 1.29-.19.217-.381.244-.71.079-.329-.165-1.389-.512-2.647-1.635-.978-.873-1.639-1.951-1.831-2.28-.19-.329-.02-.507.144-.671.148-.147.33-.384.495-.577.165-.191.22-.329.33-.548.11-.219.055-.411-.028-.574-.083-.165-.736-1.771-1.008-2.428-.265-.647-.532-.56-.73-.57-.19-.008-.408-.01-.624-.01-.218 0-.573.082-.873.411-.3.329-1.147 1.122-1.147 2.73 0 1.609 1.171 3.162 1.335 3.381.165.219 2.302 3.515 5.578 4.926.779.336 1.388.537 1.861.688.784.249 1.497.214 2.061.13.629-.094 1.948-.797 2.219-1.527.271-.73.271-1.356.19-1.488-.082-.13-.3-.21-.629-.375z" />
            </svg>
            <span>হোয়াটসঅ্যাপ: <strong className="text-white hover:underline">{phone}</strong></span>
          </a>
        </motion.div>

        {/* Trust Badges Centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-brand-lime text-xs md:text-sm font-mono"
        >
          <div className="flex text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-3.5 w-3.5 md:h-4 md:w-4 fill-current text-yellow-400" />
            ))}
          </div>
          <span className="text-gray-400 font-sans text-center text-xs md:text-sm md:leading-relaxed">
            সারা বাংলাদেশের <strong className="text-white">৫০০+ পরিবারে</strong> পরম ভালোবাসায় সমাদৃত
          </span>
        </motion.div>
      </div>
    </section>
  );
}
