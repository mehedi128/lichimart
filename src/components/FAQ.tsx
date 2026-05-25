import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "LichiMart (লিচুমার্ট) এর লিচু কি শতভাগ কেমিক্যাল ও ফরমালিন মুক্ত?",
    answer: "হ্যাঁ, সম্পূর্ণ নিশ্চিত থাকুন। LichiMart-এর প্রতিটি লিচু শতভাগ ফরমালিন, কীটনাশক এবং ক্ষতিকর রাসায়নিক কেমিক্যাল মুক্ত। দিনাজপুরের আমাদের নিজস্ব বাগান থেকে প্রাকৃতিকভাবে পাকা তাজা লিচু সরাসরি গাছ থেকে পেড়ে ক্যারেটের মাধ্যমে দেশজুড়ে দ্রুত সরবরাহ করা হয়।"
  },
  {
    question: "কিভাবে দিনাজপুরের সেরা লিচু অর্ডার করতে পারি?",
    answer: "অর্ডার করার ৩টি সহজ উপায় রয়েছে: ১. আমাদের ওয়েবসাইটে কাঙ্ক্ষিত লিচুর পরিমান সিলেক্ট করে সরাসরি 'চেকআউট' করুন। ২. অথবা স্ক্রিনে থাকা হোয়াটসঅ্যাপ (WhatsApp) বাটনে ক্লিক করে সরাসরি মেসেজ করুন। ৩. অথবা আমাদের হটলাইন নম্বর ০১৭৫২৪২১২২৪ (01752421224) -এ কল করে আপনার নাম, ঠিকানা ও মোবাইল নম্বর দিয়ে অর্ডার বুকিং করুন।"
  },
  {
    question: "কুরিয়ার সার্ভিসে ডেলিভারি পেতে কতদিন সময় লাগে?",
    answer: "আমরা বাসি বা কোল্ড স্টোরেজের লিচু দেই না। অর্ডার চূড়ান্ত হওয়ার পর সরাসরি সকালবেলা গাছ থেকে তাজা লিচু পেড়ে ওইদিনই কুরিয়ারে বুকিং করে দেওয়া হয়। সাধারণত বুকিং করার ২৪ থেকে ৪৮ ঘণ্টার মধ্যে আপনি আপনার নিকটস্থ কুরিয়ার পয়েন্ট (যেমন সুন্দরবন বা এসএ পরিবহন) থেকে পার্সেলটি সংগ্রহ করতে পারবেন।"
  },
  {
    question: "কুরিয়ার ক্যারেটে পরিবহনের সময় লিচু কি নষ্ট হয় না?",
    answer: "লিচুর স্কিন অত্যন্ত সংবেদনশীল হওয়ায় পরিবহনের সময় গরমে ৩-৫% ক্ষেত্রে লিচুর চামড়া কিছুটা শুকিয়ে বা ফেটে যেতে পারে, তবে ভেতরের লব বা স্বাদে এর কোনো নেতিবাচক প্রভাব পড়ে না। আমরা অত্যন্ত মজবুত ও সুরক্ষিত ক্যারেটে লিচু প্যাক করি যাতে কোনো ক্ষতি ছাড়াই আপনার কাছে পৌঁছায়।"
  },
  {
    question: "LichiMart এ কি কি জাতের লিচু পাওয়া যায়?",
    answer: "আমাদের নিজস্ব বাগানে দিনাজপুরের সর্বশ্রেষ্ঠ রাজকীয় 'বোম্বাই লিচু' এবং বিচিহীন বা অত্যন্ত ছোট বিচির ঘন মিষ্টি শাঁসযুক্ত রাজকীয় সুগন্ধি 'চাইনা-৩' (China-3) লিচু পাওয়া যায়।"
  },
  {
    question: "পেমেন্ট করার নিয়ম কি?",
    answer: "আমরা বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket) এবং ব্যাংক ট্রান্সফার পেমেন্ট গ্রহণ করি। অর্ডার করার সময় নির্দিষ্ট নম্বরে সেন্ড মানি করে ট্রানজেকশন আইডি বা প্রেরক নম্বর ইনপুট করে সহজেই কনফার্ম করতে পারেন।"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="scroll-mt-12 bg-[#02180f] py-16 md:py-24 px-4 border-b border-brand-green-900/40">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green-900/80 border border-brand-green-700/60 text-brand-lime text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>সরাসরি উত্তর (AEO & GEO Optimized)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight mb-4">
            সাধারণ জিজ্ঞাসা ও <span className="text-brand-lime">উত্তর</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            দিনাজপুরের প্রিমিয়াম লিচুর সত্যতা, গুণগত মান এবং ডেলিভারি সম্পর্কে যেকোনো প্রশ্নের পরিষ্কার উত্তর এখানে খুঁজুন।
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-brand-green-950/80 border-brand-green-700/80 shadow-md shadow-brand-green-950/50'
                    : 'bg-[#032115]/55 border-brand-green-900/45 hover:border-brand-green-800'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-lime"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3 text-left">
                    <HelpCircle className={`h-5 w-5 mt-0.5 shrink-0 transition-colors ${isOpen ? 'text-brand-lime' : 'text-gray-400'}`} />
                    <span className="text-xs sm:text-[14.5px] font-bold leading-snug text-gray-100">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-lime' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-4 pb-5 pt-0 sm:px-5 pl-11 text-xs sm:text-[13px] text-gray-300 leading-relaxed border-t border-brand-green-900/30">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Schema Info Footer */}
        <div className="mt-12 text-center text-gray-500 text-[10.5px] font-mono">
          <p>Verified Structured Schema Markup: JSON-LD (FAQPage, Product, LocalBusiness) Enabled</p>
        </div>
      </div>
    </section>
  );
}
