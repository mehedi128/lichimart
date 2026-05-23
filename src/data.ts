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
    image: 'https://lh3.googleusercontent.com/d/1mmybkuvbETgBk8keAWeYGHte6HWDOnPh',
    images: [
      'https://lh3.googleusercontent.com/d/1mmybkuvbETgBk8keAWeYGHte6HWDOnPh',
      'https://lh3.googleusercontent.com/d/1RhS1wg0Q4nSXkV8l6Xxy6ckE2dj9nvVF'
    ],
    detailsDescription: `আমরা আপনার জন্য দিনাজপুরের আমাদের নিজস্ব বাগান থেকে প্রিমিয়াম বোম্বাই লিচু সরবারহ করে থাকি। লিচুর স্কিন খুবই সেন্সিটিভ। পরিবহনের সময় ৩-৫% ক্ষেত্রে চামড়া শুকিয়ে যাওয়া বা ফেটে যেতে পারে। তবে এতে লিচুর ভেতরে সাধারণত কোনো সমস্যা হয় না। কুরিয়ার পয়েন্টে পৌঁছে যাওয়ার পর খুব দ্রুত পার্সেল সংগ্রহ করে নিতে হবে। পার্সেল কুরিয়ার পয়েন্টে পৌঁছানোর পর দ্রুত সংগ্রহ করার অনুরোধ রইলো।`,
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
    image: 'https://lh3.googleusercontent.com/d/16gB8wwFpBOq50ic35mO6BbNjfbOXSht6',
    images: [
      'https://lh3.googleusercontent.com/d/16gB8wwFpBOq50ic35mO6BbNjfbOXSht6',
      'https://lh3.googleusercontent.com/d/1QCzQGZ9kYMm4sSshWjjR4WWhipOi1Vqe',
      'https://lh3.googleusercontent.com/d/1CHDrBr1A7Y0DcMWF2U0gYSt8H8lyah7_'
    ],
    detailsDescription: `আমরা আপনার জন্য দিনাজপুরের আমাদের নিজস্ব বাগান থেকে প্রিমিয়াম চাইনা-৩ লিচু সরবারহ করে থাকি। 

লিচুর স্কিন খুবই সেন্সিটিভ। পরিবহনের সময় ৩-৫% ক্ষেত্রে চামড়া শুকিয়ে যাওয়া বা ফেটে যেতে পারে। তবে এতে লিচুর ভেতরে সাধারণত কোনো সমস্যা হয় না। 
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
    name: 'Sajjad Al Mahmud',
    role: 'Verified Customer, Dhaka',
    feedback: 'Superb quality lychees! Ordered a premium gift basket of China-3 and every single fruit was huge, sweet, and bursting with fresh nectar. Not a single bad piece. LichiMart is now my only source for lychees!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 't2',
    name: 'Fariha Yasmin',
    role: 'Food Critic & Pastry Chef',
    feedback: 'The Bedana lychees from LichiMart are of another world. Seed size is virtually non-existent, leaving purely dense, pristine fruit. Combined with their pure blossom honey, it is an absolute culinary dream!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 't3',
    name: 'Nadim Chowdhury',
    role: 'Corporate Sourcing Manager',
    feedback: 'Sourced over 50 gourmet bamboo cages for our executive client gift list. Delivery was handled on time, and our clients were deeply impressed by the sustainable, artisanal presentation. Highly recommended.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    rating: 5
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
