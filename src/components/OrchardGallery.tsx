import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trees } from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
}

const row1Items: GalleryItem[] = [
  {
    id: 'g-1',
    url: 'https://lh3.googleusercontent.com/d/1sHriJDIqG4FQsei9ljq7Oqqsgn_wa1t8',
  },
  {
    id: 'g-2',
    url: 'https://lh3.googleusercontent.com/d/1mmybkuvbETgBk8keAWeYGHte6HWDOnPh',
  },
  {
    id: 'g-3',
    url: 'https://lh3.googleusercontent.com/d/16gB8wwFpBOq50ic35mO6BbNjfbOXSht6',
  },
  {
    id: 'g-4',
    url: 'https://lh3.googleusercontent.com/d/1RhS1wg0Q4nSXkV8l6Xxy6ckE2dj9nvVF',
  },
  {
    id: 'g-5',
    url: 'https://lh3.googleusercontent.com/d/1QCzQGZ9kYMm4sSshWjjR4WWhipOi1Vqe',
  },
  {
    id: 'g-6',
    url: 'https://lh3.googleusercontent.com/d/1SkFf-58Im1N6Vm-VsR_ea271j_W7n2IX',
  },
  {
    id: 'g-7',
    url: 'https://lh3.googleusercontent.com/d/1CHDrBr1A7Y0DcMWF2U0gYSt8H8lyah7_',
  },
  {
    id: 'g-8',
    url: 'https://lh3.googleusercontent.com/d/1feVUb2mBiD0EyWyoxLDboQU_blmW-pvw',
  },
  {
    id: 'g-9',
    url: 'https://lh3.googleusercontent.com/d/1E4s1cQ5jQ5WZ5HU9N0RmasVEK0NfrNhP',
  }
];

const row2Items: GalleryItem[] = [
  {
    id: 'g-2-1',
    url: 'https://lh3.googleusercontent.com/d/1G9Xipl0UGNozf8zFeftukNvaE6u6VBh8',
  },
  {
    id: 'g-2-2',
    url: 'https://lh3.googleusercontent.com/d/1YEUVwpF-662bB3zNmFL8ptzXQnvWRoSn',
  },
  {
    id: 'g-2-3',
    url: 'https://lh3.googleusercontent.com/d/1dBHDGYIYCqyTg_57hvlFXT6MZ3t_FXVn',
  },
  {
    id: 'g-2-4',
    url: 'https://lh3.googleusercontent.com/d/1UC46qkvUWiGs5UWSOCIQM_q9B8FWYNJk',
  },
  {
    id: 'g-2-5',
    url: 'https://lh3.googleusercontent.com/d/12TJu7uubqy-nmARwfjSriNBqKZpUfUYS',
  },
  {
    id: 'g-2-6',
    url: 'https://lh3.googleusercontent.com/d/1gZsFIQVFn1Cxv_8S9FQ7fMcoxbwUPxdq',
  },
  {
    id: 'g-2-7',
    url: 'https://lh3.googleusercontent.com/d/1t3mSUefBPMcIHMoroWvcjrAa0orhZwUp',
  },
  {
    id: 'g-2-8',
    url: 'https://lh3.googleusercontent.com/d/1T1E3HWAh7t4LTRlYmDRBTq8iMGx1shEq',
  },
  {
    id: 'g-2-9',
    url: 'https://lh3.googleusercontent.com/d/1FOCRAshgMOde0WOpTG8UZXqwsPj8W2dP',
  },
  {
    id: 'g-2-10',
    url: 'https://lh3.googleusercontent.com/d/1H8IoUO2kLjuqlPAL9r-xcBlaZLw-duXU',
  },
  {
    id: 'g-2-11',
    url: 'https://lh3.googleusercontent.com/d/1tb-E_wcj6d0IcFgpZyJd_R2n8kDWg0RQ',
  },
  {
    id: 'g-2-12',
    url: 'https://lh3.googleusercontent.com/d/1Mh1G39DYLqnu3Zfz8fKC7_3QM5WCNaNI',
  }
];

export default function OrchardGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  const doubledRow1 = [...row1Items, ...row1Items];
  const doubledRow2 = [...row2Items, ...row2Items];

  return (
    <section 
      ref={containerRef}
      id="gallery" 
      className="scroll-mt-12 bg-brand-green-950 py-20 md:py-28 relative overflow-hidden"
    >
      {/* Decorative ambient blurred backing light beams */}
      <div className="absolute left-[-10%] top-[20%] -z-10 h-96 w-96 rounded-full bg-brand-lime/5 blur-[120px]" />
      <div className="absolute right-[-10%] bottom-[20%] -z-10 h-96 w-96 rounded-full bg-red-650/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 md:px-6 text-center space-y-4 mb-16">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-lime bg-brand-green-900 border border-brand-green-800 px-3 py-1.5 rounded-full w-fit mx-auto flex items-center gap-1.5 select-none">
          <Trees className="h-4 w-4 text-brand-lime" />
          🌳 জীবন্ত বাগান ও চাষাবাদ
        </span>

        <h2 className="font-heading text-3.5xl font-extrabold text-white md:text-5xl tracking-tight leading-tight">
          বাগান থেকে আপনার ঘরে সরাসরি যাত্রা
        </h2>
        
        <p className="text-sm text-gray-350 max-w-xl mx-auto leading-relaxed">
          আপনার প্রিয় অত্যন্ত সুমিষ্টি লিচুর পেছনে থাকা আমাদের নিবিড় ও জৈব প্রাকৃতিক পরিচর্যা, রৌদ্রোজ্জ্বল দিন এবং নিজ হাতে লিচু সংগ্রহের চমৎকার মুহূর্তগুলো দেখে নিন। <br />
          <span className="text-brand-lime font-semibold flex items-center justify-center gap-1 mt-1 text-xs cursor-default">
            <Sparkles className="h-3 w-3" /> উভয় সারিতে ছবিগুলো ভিন্ন অভিমুখে আকর্ষণীয় গতিতে স্লাইড হচ্ছে
          </span>
        </p>

        <div className="mx-auto h-1 w-16 bg-brand-lime/40 rounded-full mt-2"></div>
      </div>

      {/* Infinite Rolling Galleries Container Area */}
      <div className="w-full space-y-6 md:space-y-8 select-none overflow-hidden relative">
        
        {/* Row 1: Moves Leftwards */}
        <div className="w-full relative overflow-hidden flex">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 50,
              repeat: Infinity,
            }}
            className="flex gap-4 md:gap-8 shrink-0 pb-2"
          >
            {doubledRow1.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`}
                className="relative w-80 sm:w-[450px] md:w-[600px] lg:w-[700px] xl:w-[800px] aspect-[16/10] rounded-[32px] overflow-hidden shadow-2xl border-2 border-brand-green-800 bg-[#032014] group shrink-0"
              >
                <img 
                  src={item.url} 
                  alt="Dinajpur Lychee Orchard"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Moves Rightwards */}
        <div className="w-full relative overflow-hidden flex">
          <motion.div 
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              ease: "linear",
              duration: 50,
              repeat: Infinity,
            }}
            className="flex gap-4 md:gap-8 shrink-0 pt-2"
          >
            {doubledRow2.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`}
                className="relative w-80 sm:w-[450px] md:w-[600px] lg:w-[700px] xl:w-[800px] aspect-[16/10] rounded-[32px] overflow-hidden shadow-2xl border-2 border-brand-green-800 bg-[#032014] group shrink-0"
              >
                <img 
                  src={item.url} 
                  alt="Dinajpur Lychee Orchard"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </motion.div>
        </div>

      </div>



    </section>
  );
}
