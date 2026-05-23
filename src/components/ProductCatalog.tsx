import React, { useState } from 'react';
import { Product } from '../types';
import { Star, Check, ShoppingBag, Heart, Sparkles, Smile, Flame, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  badge: React.ReactNode;
}

function ProductImageCarousel({ images, productName, badge }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-brand-green-700/60 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1/1] shadow-xl hover:border-brand-lime/40 transition-colors duration-500 group/carousel">
      {/* Container for images */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>

      {/* Slide Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-brand-green-800 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-brand-lime hover:text-brand-green-905 hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-brand-green-800 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-brand-lime hover:text-brand-green-905 hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Bottom pagination dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 bg-black/40 backdrop-blur-sm py-1 px-2.5 rounded-full border border-white/10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`h-1.5 w-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'bg-brand-lime w-3' : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Floating Badge */}
      {badge}

      {/* Own Orchard Indicator */}
      <div className="absolute right-4 bottom-4 z-10 flex flex-col items-end gap-1 select-none">
        <div className="rounded-lg bg-brand-green-950/95 border border-brand-green-800/80 backdrop-blur-sm px-2.5 py-1 font-sans text-[10px] font-semibold text-brand-lime shadow-sm flex items-center gap-1">
          <span>📸 নিজস্ব বাগানের ছবি {images.length > 1 && `(${currentIndex + 1}/${images.length})`}</span>
        </div>
      </div>
    </div>
  );
}

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistIds: string[];
  searchQuery: string;
}

export default function ProductCatalog({
  products,
  onAddToCart,
  onAddToWishlist,
  wishlistIds,
  searchQuery,
}: ProductCatalogProps) {
  // Quantities for each of our premium products (p1 and p2)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    p1: 200,
    p2: 200,
  });

  // Success indicator for standard high-tactility UX response
  const [addedProduct, setAddedProduct] = useState<string | null>(null);

  const handleUpdateQty = (pId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [pId]: Math.max(200, (prev[pId] || 200) + delta),
    }));
  };

  const handleTriggerAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 200;
    onAddToCart(product, qty);
    
    // Set a lively visual success feedback
    setAddedProduct(product.id);
    setTimeout(() => {
      setAddedProduct(null);
    }, 2500);
  };

  // Filter to check search relevance if needed
  const matchesSearch = (product: Product) => {
    if (!searchQuery) return true;
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // We have exactly two signature products
  const bombai = products.find((p) => p.id === 'p1');
  const china3 = products.find((p) => p.id === 'p2');

  return (
    <section id="products" className="scroll-mt-12 bg-gradient-to-b from-brand-green-950 to-[#02180f] px-4 py-20 md:px-6 md:py-28 relative overflow-hidden">
      {/* Absolute background accent glares */}
      <div className="absolute right-[-10%] top-[30%] -z-10 h-96 w-96 rounded-full bg-brand-lime/10 blur-[120px]" />
      <div className="absolute left-[-5%] bottom-[10%] -z-10 h-96 w-96 rounded-full bg-red-650/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        
        {/* Intro segments */}
        <div className="text-center space-y-4 mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFA0B4] block bg-brand-green-900/60 px-4 py-1.5 rounded-full border border-brand-green-800 w-fit mx-auto select-none"
          >
            ⭐ আমাদের দুইটি সেরা জাত
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl font-extrabold text-white md:text-5xl tracking-tight"
          >
            বাংলার সেরা বাগানের সেরা লিচু
          </motion.h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            আমরা এক্সক্লুসিভ উপায়ে চাষ করি এবং সরাসরি বাগান থেকে তাজা সতেজ অবস্থায় সরবরাহ করি প্রকৃতির সেরা ও সবচেয়ে সুস্বাদু দুটি অভিজাত লিচুর জাত। প্রতিটি লিচু হাত দিয়ে নিখুঁতভাবে বাছাই করা হয়।
          </p>
          <div className="mx-auto h-1 w-16 bg-brand-lime rounded-full"></div>
        </div>

        {/* Global Search result flag */}
        {searchQuery && (
          <div className="mb-12 max-w-3xl mx-auto text-center rounded-xl border border-brand-green-800 bg-brand-green-900/60 px-5 py-3 text-xs">
            <span className="text-gray-400 font-sans">
              সার্চের ভিত্তিতে ফলাফল ফিল্টার করা হচ্ছে: "<strong className="text-brand-lime">{searchQuery}</strong>"
            </span>
          </div>
        )}

        {/* Double Highlight Sections Showcase block */}
        <div className="space-y-16 md:space-y-24">
          
          {/* Highlight Section 1: Premium Bombay Lychees */}
          {bombai && matchesSearch(bombai) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="group relative overflow-hidden rounded-3xl border border-brand-green-800 bg-gradient-to-br from-brand-green-905 to-brand-green-950/80 p-6 md:p-10 lg:p-12 shadow-2xl hover:border-brand-lime/20 transition-all duration-500"
            >
              {/* Gold gradient background strip */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-yellow-300 rounded-l-3xl" />
              
              <div className="grid gap-8 lg:grid-cols-12 items-center">
                
                {/* Visual image frame Left */}
                <div className="lg:col-span-5 relative">
                  <ProductImageCarousel
                    images={bombai.images || [bombai.image]}
                    productName={bombai.name}
                    badge={
                      <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600 px-3 py-1 text-[10px] font-black text-white uppercase tracking-wider shadow-md">
                        <Flame className="h-3 w-3 fill-white animate-pulse" />
                        <span>{bombai.badge || "সেরা বিক্রেতা"}</span>
                      </div>
                    }
                  />

                  {/* Decorative background circle rings */}
                  <div className="absolute -left-5 -bottom-5 w-24 h-24 rounded-full border border-brand-green-800/60 -z-10" />
                </div>

                {/* Content Details Panel Right */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-brand-lime font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-brand-lime" />
                        সিগনেচার এলিট গ্রেড
                      </span>
                      
                      {/* Wishlist Heart toggle direct */}
                      <button
                        onClick={() => onAddToWishlist(bombai)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-950/80 border border-brand-green-800 text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        title={wishlistIds.includes(bombai.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className={`h-4.5 w-4.5 ${wishlistIds.includes(bombai.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    <h3 className="font-heading text-2xl font-extrabold text-white md:text-3xl lg:text-4xl">
                      {bombai.name}
                    </h3>

                    {/* Quality Ratings Star strip */}
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-450">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-4 w-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                      <span className="font-sans text-xs font-bold text-white">{bombai.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({bombai.reviewsCount} verified reviews)</span>
                    </div>
                  </div>

                  {/* Price display with optional discount markup */}
                  <div className="flex items-baseline gap-3 bg-brand-green-950/60 px-4 py-2 rounded-xl border border-brand-green-850/60 w-fit">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold self-center mr-1">মূল্য:</span>
                    <span className="font-heading text-2xl font-black text-brand-lime">৳{bombai.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-405 font-sans">প্রতি পিস</span>
                    {bombai.oldPrice && (
                       <span className="font-sans text-sm text-gray-400 font-medium line-through ml-2">৳{bombai.oldPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <p className="font-sans text-sm text-gray-300 leading-relaxed md:text-base">
                    {bombai.detailsDescription || bombai.description}
                  </p>


                  {/* Toast local dynamic response action */}
                  <AnimatePresence>
                    {addedProduct === bombai.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 rounded-xl bg-brand-lime/10 border border-brand-lime/20 p-3 text-xs text-brand-lime"
                      >
                        <Check className="h-4 w-4 shrink-0" />
                        <span>চমৎকার পছন্দ! আপনার শপিং কার্টে {quantities[bombai.id] || 200} পিস প্রিমিয়াম বোম্বাই লিচু যুক্ত হয়েছে।</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Buy / Add Interactive controls row */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-brand-green-800 bg-brand-green-950 rounded-full h-12 px-1 text-white">
                      <button
                        onClick={() => handleUpdateQty(bombai.id, -100)}
                        className="h-10 w-10 text-base font-extrabold text-gray-400 hover:text-brand-lime transition-colors duration-150 cursor-pointer"
                        title="Reduce quantity by 100"
                      >
                        -
                      </button>
                      <span className="w-16 text-center text-xs font-bold font-mono">{quantities[bombai.id] || 200} পিস</span>
                      <button
                        onClick={() => handleUpdateQty(bombai.id, 100)}
                        className="h-10 w-10 text-base font-extrabold text-gray-400 hover:text-brand-lime transition-colors duration-150 cursor-pointer"
                        title="Increase quantity by 100"
                      >
                        +
                      </button>
                    </div>

                    {/* Direct Shopping Bag Add cart */}
                    <button
                      onClick={() => handleTriggerAddToCart(bombai)}
                      className="flex-1 min-w-[140px] flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-lime hover:bg-brand-lime-hover text-brand-green-905 font-bold h-12 text-xs tracking-wider uppercase transition-colors shadow-md hover:shadow-lg"
                    >
                      <ShoppingBag className="h-4.5 w-4.5 text-brand-green-905" />
                      <span>কার্টে যোগ করুন</span>
                    </button>

                    {/* WhatsApp Checkout direct CTA */}
                    <a
                      href={`https://wa.me/880123456789?text=${encodeURIComponent(
                        `আসসালামু আলাইকুম! আমি তাজা প্রিমিয়াম বোম্বাই লিচু অর্ডার করতে চাই।\nপরিমাণ: ${quantities[bombai.id] || 200} পিস`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#23cc62] hover:bg-[#1ebd54] text-white font-bold h-12 px-5 text-xs tracking-wider uppercase transition-colors shadow-md hover:shadow-lg"
                      title="WhatsApp এ অর্ডার করুন"
                    >
                      <svg
                        className="h-5 w-5 fill-current shrink-0"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.09-2.885-6.948C16.828 2.001 14.364 1.001 11.8 1c-5.451 0-9.88 4.372-9.884 9.802-.001 1.77.483 3.5 1.398 5.01L2.3 21.03l5.347-1.4c1.512.825 3.125 1.258 4.757 1.258h.01c-.002 0-.002 0 0 0zm12.516-6.611c-.329-.165-1.948-.962-2.247-1.071-.3-.11-.518-.165-.736.165-.218.329-.844 1.071-1.035 1.29-.19.217-.381.244-.71.079-.329-.165-1.389-.512-2.647-1.635-.978-.873-1.639-1.951-1.831-2.28-.19-.329-.02-.507.144-.671.148-.147.33-.384.495-.577.165-.191.22-.329.33-.548.11-.219.055-.411-.028-.574-.083-.165-.736-1.771-1.008-2.428-.265-.647-.532-.56-.73-.57-.19-.008-.408-.01-.624-.01-.218 0-.573.082-.873.411-.3.329-1.147 1.122-1.147 2.73 0 1.609 1.171 3.162 1.335 3.381.165.219 2.302 3.515 5.578 4.926.779.336 1.388.537 1.861.688.784.249 1.497.214 2.061.13.629-.094 1.948-.797 2.219-1.527.271-.73.271-1.356.19-1.488-.082-.13-.3-.21-.629-.375z" />
                      </svg>
                      <span>হোয়াটসঅ্যাপ অর্ডার</span>
                    </a>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* Highlight Section 2: Premium China-3 Lychees */}
          {china3 && matchesSearch(china3) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="group relative overflow-hidden rounded-3xl border border-brand-green-800 bg-gradient-to-br from-brand-green-905 to-brand-green-950/80 p-6 md:p-10 lg:p-12 shadow-2xl hover:border-brand-lime/20 transition-all duration-500"
            >
              {/* Crimson-green gradient background strip */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-600 to-rose-400 rounded-l-3xl" />
              
              <div className="grid gap-8 lg:grid-cols-12 items-center">
                
                {/* Content Details Panel Left - Desktop layout mirrors China-3 layout */}
                <div className="lg:col-span-7 space-y-6 text-left order-2 lg:order-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-brand-lime font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Smile className="h-3.5 w-3.5 text-brand-lime" />
                        বিশেষ অভিজাত ডেজার্ট জাত
                      </span>
                      
                      {/* Wishlist Heart toggle direct */}
                      <button
                        onClick={() => onAddToWishlist(china3)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-950/80 border border-brand-green-800 text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        title={wishlistIds.includes(china3.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className={`h-4.5 w-4.5 ${wishlistIds.includes(china3.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    <h3 className="font-heading text-2xl font-extrabold text-white md:text-3xl lg:text-4xl">
                      {china3.name}
                    </h3>

                    {/* Quality Ratings Star strip */}
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-450">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-4 w-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                      <span className="font-sans text-xs font-bold text-white">{china3.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({china3.reviewsCount} verified reviews)</span>
                    </div>
                  </div>

                  {/* Price display with optional discount markup */}
                  <div className="flex items-baseline gap-3 bg-brand-green-950/60 px-4 py-2 rounded-xl border border-brand-green-850/60 w-fit">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold self-center mr-1">মূল্য:</span>
                    <span className="font-heading text-2xl font-black text-brand-lime">৳{china3.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-405 font-sans">প্রতি পিস</span>
                    {china3.oldPrice && (
                       <span className="font-sans text-sm text-gray-400 font-medium line-through ml-2">৳{china3.oldPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <p className="font-sans text-sm text-gray-300 leading-relaxed md:text-base">
                    {china3.detailsDescription || china3.description}
                  </p>

                  {/* Toast local dynamic response action */}
                  <AnimatePresence>
                    {addedProduct === china3.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 rounded-xl bg-brand-lime/10 border border-brand-lime/20 p-3 text-xs text-brand-lime"
                      >
                        <Check className="h-4 w-4 shrink-0" />
                        <span>চমৎকার পছন্দ! আপনার শপিং কার্টে {quantities[china3.id] || 200} পিস প্রিমিয়াম চায়না-৩ লিচু যুক্ত হয়েছে।</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Buy / Add Interactive controls row */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-brand-green-800 bg-brand-green-950 rounded-full h-12 px-1 text-white">
                      <button
                        onClick={() => handleUpdateQty(china3.id, -100)}
                        className="h-10 w-10 text-base font-extrabold text-gray-400 hover:text-brand-lime transition-colors duration-150 cursor-pointer"
                        title="Reduce quantity by 100"
                      >
                        -
                      </button>
                      <span className="w-16 text-center text-xs font-bold font-mono">{quantities[china3.id] || 200} পিস</span>
                      <button
                        onClick={() => handleUpdateQty(china3.id, 100)}
                        className="h-10 w-10 text-base font-extrabold text-gray-400 hover:text-brand-lime transition-colors duration-150 cursor-pointer"
                        title="Increase quantity by 100"
                      >
                        +
                      </button>
                    </div>

                    {/* Direct Shopping Bag Add cart */}
                    <button
                      onClick={() => handleTriggerAddToCart(china3)}
                      className="flex-1 min-w-[140px] flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-lime hover:bg-brand-lime-hover text-brand-green-905 font-bold h-12 text-xs tracking-wider uppercase transition-colors shadow-md hover:shadow-lg"
                    >
                      <ShoppingBag className="h-4.5 w-4.5 text-brand-green-905" />
                      <span>কার্টে যোগ করুন</span>
                    </button>

                    {/* WhatsApp Checkout direct CTA */}
                    <a
                      href={`https://wa.me/880123456789?text=${encodeURIComponent(
                        `আসসালামু আলাইকুম! আমি তাজা প্রিমিয়াম চাইনা-৩ লিচু অর্ডার করতে চাই।\nপরিমাণ: ${quantities[china3.id] || 200} পিস`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#23cc62] hover:bg-[#1ebd54] text-white font-bold h-12 px-5 text-xs tracking-wider uppercase transition-colors shadow-md hover:shadow-lg"
                      title="WhatsApp এ অর্ডার করুন"
                    >
                      <svg
                        className="h-5 w-5 fill-current shrink-0"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.09-2.885-6.948C16.828 2.001 14.364 1.001 11.8 1c-5.451 0-9.88 4.372-9.884 9.802-.001 1.77.483 3.5 1.398 5.01L2.3 21.03l5.347-1.4c1.512.825 3.125 1.258 4.757 1.258h.01c-.002 0-.002 0 0 0zm12.516-6.611c-.329-.165-1.948-.962-2.247-1.071-.3-.11-.518-.165-.736.165-.218.329-.844 1.071-1.035 1.29-.19.217-.381.244-.71.079-.329-.165-1.389-.512-2.647-1.635-.978-.873-1.639-1.951-1.831-2.28-.19-.329-.02-.507.144-.671.148-.147.33-.384.495-.577.165-.191.22-.329.33-.548.11-.219.055-.411-.028-.574-.083-.165-.736-1.771-1.008-2.428-.265-.647-.532-.56-.73-.57-.19-.008-.408-.01-.624-.01-.218 0-.573.082-.873.411-.3.329-1.147 1.122-1.147 2.73 0 1.609 1.171 3.162 1.335 3.381.165.219 2.302 3.515 5.578 4.926.779.336 1.388.537 1.861.688.784.249 1.497.214 2.061.13.629-.094 1.948-.797 2.219-1.527.271-.73.271-1.356.19-1.488-.082-.13-.3-.21-.629-.375z" />
                      </svg>
                      <span>হোয়াটসঅ্যাপ অর্ডার</span>
                    </a>
                  </div>



                </div>

                {/* Visual image frame Right */}
                <div className="lg:col-span-5 relative order-1 lg:order-2">
                  <ProductImageCarousel
                    images={china3.images || [china3.image]}
                    productName={china3.name}
                    badge={
                      <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-red-650 px-3 py-1 text-[10px] font-black text-white uppercase tracking-wider shadow-md">
                        <Clock className="h-3 w-3 text-white fill-none" />
                        <span>{china3.badge || "রাজকীয় লিচু"}</span>
                      </div>
                    }
                  />

                  {/* Decorative background circle rings */}
                  <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full border border-brand-green-800/60 -z-10" />
                </div>

              </div>
            </motion.div>
          )}

          {/* Fallback segment */}
          {!matchesSearch(bombai!) && !matchesSearch(china3!) && (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-gray-200">
              <p className="text-gray-550 text-sm italic">আপনার খোঁজা শব্দের সাথে কোনো সঠিক ফল বা জাত খুঁজে পাওয়া যায়নি।</p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
