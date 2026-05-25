import { Product, Testimonial } from './types';

export const LYCHEE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'প্রিমিয়াম বোম্বাই লিচু',
    description: 'The absolute gold standard of royal Dinajpur orchards. Luscious flesh, incredibly honeyed sweet profile, tiny seed, and fat pulpy lobes.',
    price: 6.00,
    category: 'fresh',
    rating: 4.9,
    reviewsCount: 148,
    weight: '1',
    badge: 'BEST SELLER',
    image: 'https://lh3.googleusercontent.com/d/1RhS1wg0Q4nSXkV8l6Xxy6ckE2dj9nvVF',
    images: [
      'https://lh3.googleusercontent.com/d/1RhS1wg0Q4nSXkV8l6Xxy6ckE2dj9nvVF',
      'https://lh3.googleusercontent.com/d/1E4s1cQ5jQ5WZ5HU9N0RmasVEK0NfrNhP',
      'https://lh3.googleusercontent.com/d/1feVUb2mBiD0EyWyoxLDboQU_blmW-pvw',
      'https://lh3.googleusercontent.com/d/1mmybkuvbETgBk8keAWeYGHte6HWDOnPh',
      'https://lh3.googleusercontent.com/d/1sHriJDIqG4FQsei9ljq7Oqqsgn_wa1t8',
      'https://lh3.googleusercontent.com/d/1QCzQGZ9kYMm4sSshWjjR4WWhipOi1Vqe',
      'https://lh3.googleusercontent.com/d/1CPJpysEINOkzR5k6PcApOOq9MChgpmbc',
      'https://lh3.googleusercontent.com/d/1SkFf-58Im1N6Vm-VsR_ea271j_W7n2IX'
    ],
    detailsDescription: `আমরা আপনার জন্য দিনাজপুরের আমাদের নিজস্ব বাগান থেকে প্রিমিয়াম বোম্বাই লিচু সরবারহ করে থাকি। লিচুর স্কিন খুবই সেন্সিটিভ। পরিবহনের সময় ৩-৫% ক্ষেত্রে চামড়া শুকিয়ে যেতে পারে। তবে এতে লিচুর ভেতরে সাধারণত কোনো সমস্যা হয় না। কুরিয়ার পয়েন্টে পৌঁছে যাওয়ার পর খুব দ্রুত পার্সেল সংগ্রহ করে নিতে হবে। পার্সেল কুরিয়ার পয়েন্টে পৌঁছানোর পর দ্রুত সংগ্রহ করার অনুরোধ রইলো।`,
    benefits: [
      'Rich in Vitamin C: A single portion meets 100%+ of your recommended daily value',
      'Ultra-hydration: Consists of over 82% naturally filtered structured water',
      'Oligonol Active: Packed with metabolic boosting antioxidant compounds',
      'Immediate energy: Clean sucrose and fructose profiles with zero heavy starch overhead'
    ]
  },
  {
    id: 'p2',
    name: 'প্রিমিয়াম চাইনা-৩  লিচু',
    description: 'The legendary "seedless-style" royal lychee. Prized for its unparalleled aromatic rose-sweet perfume and thick white pearlescent flesh.',
    price: 15.00,
    category: 'fresh',
    rating: 5.0,
    reviewsCount: 92,
    weight: '1',
    badge: 'POPULAR',
    image: 'https://lh3.googleusercontent.com/d/1CA06T3Z0v22EYI4TGSyweV4K8GJuA-TK',
    images: [
      'https://lh3.googleusercontent.com/d/1CA06T3Z0v22EYI4TGSyweV4K8GJuA-TK',
      'https://lh3.googleusercontent.com/d/1xqj6yG5tyoEc7BdeTUW1rrE4epHCaYZL',
      'https://lh3.googleusercontent.com/d/1dBHDGYIYCqyTg_57hvlFXT6MZ3t_FXVn',
      'https://lh3.googleusercontent.com/d/1eSobc4-VmiciQR7qpBY1HTSXOI_kMNyy',
      'https://lh3.googleusercontent.com/d/1G9Xipl0UGNozf8zFeftukNvaE6u6VBh8',
      'https://lh3.googleusercontent.com/d/1tb-E_wcj6d0IcFgpZyJd_R2n8kDWg0RQ'
    ],
    detailsDescription: `আমরা আপনার জন্য দিনাজপুরের আমাদের নিজস্ব বাগান থেকে প্রিমিয়াম চাইনা-৩ লিচু সরবারহ করে থাকি। 

লিচুর স্কিন খুবই সেন্সিটিভ। পরিবহনের সময় ৩-৫% ক্ষেত্রে চামড়া শুকিয়ে যেতে পারে। তবে এতে লিচুর ভেতরে সাধারণত কোনো সমস্যা হয় না। 
কুরিয়ার পয়েন্টে পৌঁছে যাওয়ার পর খুব দ্রুত পার্সেল সংগ্রহ করে নিতে হবে।

পার্সেল কুরিয়ার পয়েন্টে পৌঁছানোর পর দ্রুত সংগ্রহ করার অনুরোধ রইলো।`,
    benefits: [
      'High dietary fiber content supporting robust liver and stomach digestion',
      'Superb potassium levels helping normalize healthy arterial blood flow',
      'Zero fat and a balanced glycemic load relative to refined sugar sweets',
      'Natural trace minerals including iron, copper, and magnesium'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'MD. Ashikur Rahman',
    role: 'recommends LichiMart',
    feedback: 'পিওর এন্ড বেস্ট কোয়ালিটি।। ধন্যবাদ 🙏',
    avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    fbDate: 'May 29, 2025',
    fbLikes: 12,
    fbShares: 0,
    fbScreenshot: 'https://lh3.googleusercontent.com/d/1h3aw6e-KHdNUHijRaT0xWo6BcJezqQAb'
  },
  {
    id: 't2',
    name: 'Tanvir Islam',
    role: 'recommends LichiMart',
    feedback: 'Sweet, juicy, and absolutely delicious — highly recommended lychees',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    fbDate: 'May 28, 2025',
    fbLikes: 34,
    fbShares: 1,
    fbScreenshot: 'https://lh3.googleusercontent.com/d/1G-TPcUI33UB2FO132BaWe8vttIW99EVY'
  },
  {
    id: 't3',
    name: 'Rifatul Alam',
    role: 'recommends LichiMart',
    feedback: '5*\n\nQuality was great. Recommended.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    fbDate: 'June 8, 2024',
    fbLikes: 9,
    fbShares: 0,
    fbScreenshot: 'https://lh3.googleusercontent.com/d/1CHp_iQSnUX1vihy92SWpueZdDuEMWA6U'
  },
  {
    id: 't4',
    name: 'Masud Abdullah',
    role: 'recommends LichiMart',
    feedback: 'কেমিক্যাল মুক্ত একদম ফ্রেশ লিচু। কোয়ালিটি এক কথায় অসাধারণ। একদিনের মধ্যেই ডেলিভারি পেয়েছি।',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    fbDate: 'May 27, 2025',
    fbLikes: 156,
    fbShares: 2,
    fbImage: 'https://lh3.googleusercontent.com/d/1gZsFIQVFn1Cxv_8S9FQ7fMcoxbwUPxdq',
    fbScreenshot: 'https://lh3.googleusercontent.com/d/1fbWAKa6QA9pxXcYa4AE4xqJMug1crf4N'
  }
];

export const BLOG_POSTS = [
  {
    id: 'b1',
    title: '12 Science-Backed Health Benefits of Drinking Dynamic Fresh Lychee Water',
    summary: 'Discover how this sweet seasonal powerhouse boosts immune response, drives collagen biosynthesis, and supports steady weight management.',
    date: '2026-05-18',
    image: 'https://images.unsplash.com/photo-1614032400961-d7037f00f0fc?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'b2',
    title: 'Orchard Secrets: How to Tell Real Dinajpur China-3 Apart from Mock Counterfeits',
    summary: 'Learn key identifiers on rind patterns, nectar smell, seed volume ratios, and seasonal harvesting dates so you never get duped at local fruit stands.',
    date: '2026-05-15',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'b3',
    title: 'Dynamic Coolers: 3 Easy Mocktail Recipes to Elevate Your Midsummer Party Vibe',
    summary: 'A simple tutorial on blending organic lychee nectar, sparkling soda water, fresh peppermint, and lime key notes into an elite refresher.',
    date: '2026-05-10',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=500&auto=format&fit=crop'
  }
];
