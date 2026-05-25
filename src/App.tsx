import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import OrganicProducts from './components/OrganicProducts';
import ProductCatalog from './components/ProductCatalog';
import SpecialOffer from './components/SpecialOffer';
import Testimonials from './components/Testimonials';
import OrchardGallery from './components/OrchardGallery';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import SheetsSyncModal from './components/SheetsSyncModal';
import { fetchSheetsConfigFromFirestore } from './sheetsService';

import { LYCHEE_PRODUCTS } from './data';
import { Product, CartItem } from './types';
import { Heart, Search, ShoppingBag, Trash2, X, Plus, Play, Calendar, Link, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const HOTLINE_PHONE = '01752421224';

  // State Management
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSheetsConfigOpen, setIsSheetsConfigOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'landing' | 'checkout'>('landing');

  // Load from local storage upon initial render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('lichimart_cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        setCartItems(parsed);
      }
      const storedWishlist = localStorage.getItem('lichimart_wishlist');
      if (storedWishlist) {
        const parsed = JSON.parse(storedWishlist);
        setWishlist(parsed);
      }
      // Prefetch global Google Sheets config from Firestore
      fetchSheetsConfigFromFirestore();
    } catch (e) {
      console.warn('LocalStorage retrieval failed', e);
    }
  }, []);

  // Save to local storage upon transitions
  useEffect(() => {
    localStorage.setItem('lichimart_cart', JSON.stringify(cartItems));
    const count = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('lichimart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Handler: Add to Cart
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  // Handler: Update product qty
  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Handler: Delete from Cart
  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Handler: Clear current active cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handler: Add or toggle wishlist items
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const isFavorite = prev.some((item) => item.id === product.id);
      if (isFavorite) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Smooth scroll handler
  const handleNavigateToSection = (sectionId: string) => {
    // If in checkout mode, return to landing view first
    if (viewMode !== 'landing') {
      setViewMode('landing');
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
      return;
    }

    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && viewMode !== 'landing') {
      setViewMode('landing');
    }
    // If user types, soft scroll down to catalog area
    if (query.trim() && viewMode === 'landing') {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const wishlistCount = wishlist.length;
  const wishlistIds = wishlist.map((item) => item.id);

  return (
    <div className="min-h-screen bg-brand-green-950 font-sans text-gray-200 flex flex-col justify-between selection:bg-brand-lime selection:text-brand-green-950">
      
      {/* Top sticky responsive navigations */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCartToggle={() => setIsCartOpen(true)}
        onWishlistToggle={() => setIsWishlistOpen(true)}
        onNavigate={handleNavigateToSection}
        onSheetsConfigToggle={() => setIsSheetsConfigOpen(true)}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {viewMode === 'landing' ? (
            <motion.div
              key="landing-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Grand high-conversion hero banner */}
              <Hero
                phone={HOTLINE_PHONE}
                onExploreClick={() => handleNavigateToSection('products')}
              />

              {/* Organic Products and Crops Showcase Section */}
              <OrganicProducts />

              {/* Catalog with search and category filters tabs */}
              <ProductCatalog
                products={LYCHEE_PRODUCTS}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
                searchQuery={searchQuery}
              />

              {/* Seasonal Special Campaign Offer Countdown counter */}
              <SpecialOffer
                onClaimOffer={() => {
                  handleAddToCart(LYCHEE_PRODUCTS[0], 2); // Add Bombai cultivar as promo
                  setIsCartOpen(true);
                }}
              />

              {/* Sliding Reviews Carousel */}
              <Testimonials />

              {/* Double-direction scroll interactive image gallery */}
              <OrchardGallery />
            </motion.div>
          ) : (
            <motion.div
              key="checkout-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Checkout multi-option form panel and checkout actions */}
              <Checkout
                cartItems={cartItems}
                onClearCart={handleClearCart}
                onCloseCheckout={() => setViewMode('landing')}
                phone={HOTLINE_PHONE}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global standard brand footer */}
      <Footer
        onNavigate={handleNavigateToSection}
        onWishlistToggle={() => setIsWishlistOpen(true)}
      />

      {/* Right sliding Cart Drawer Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setViewMode('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Pop-up Wishlist Manager overlay dialog */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark background blur click-overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="absolute inset-0 bg-brand-green-950/80 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-[#032115] border border-brand-green-700 p-6 text-left"
              id="wishlist-modal-panel"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-brand-green-850/80 mb-4 text-white">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  <h3 className="font-heading text-base font-bold tracking-wider">আমার পছন্দের তালিকা</h3>
                  <span className="rounded-full bg-brand-green-900 px-2.5 py-0.5 text-xs text-brand-lime font-mono">
                    {wishlistCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="rounded-full bg-brand-green-950/50 hover:bg-brand-green-800 p-1.5 text-gray-400 hover:text-white transition"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {wishlist.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 space-y-3">
                    <span className="text-4xl block opacity-85">🍃</span>
                    <p className="text-xs font-semibold uppercase tracking-wider font-heading">পছন্দের তালিকা খালি আছে</p>
                    <p className="text-[11px] text-gray-500 max-w-xs mx-auto">নতুন তাজা ফলগুলো দেখুন, হার্ট আইকনে ক্লিক করে আপনার প্রিয় লিচুগুলো তালিকায় যুক্ত করুন যা পরবর্তীতে কিনতে পারবেন।</p>
                  </div>
                ) : (
                  wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl bg-brand-green-900/30 border border-brand-green-800/80"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 object-cover rounded-lg border border-brand-green-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                         <div className="text-left space-y-0.5">
                          <h4 className="font-heading text-xs font-bold text-white line-clamp-1 max-w-[170px]">{item.name}</h4>
                          <p className="text-[10px] text-gray-400">⚖️ {item.weight} প্যাকেজিং</p>
                          <span className="text-xs font-mono text-brand-lime font-bold">৳{item.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Add to Basket button direct */}
                        <button
                          onClick={() => {
                            handleAddToCart(item, item.id === 'p2' ? 100 : 200);
                            setIsWishlistOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="flex items-center gap-1.5 rounded-full bg-brand-lime hover:bg-brand-lime-hover text-brand-green-950 font-bold px-3 py-1.5 text-[10px] uppercase tracking-wide cursor-pointer transition-colors"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          <span>কার্টে যোগ করুন</span>
                        </button>
                        
                        {/* Remove favorite */}
                        <button
                          onClick={() => handleToggleWishlist(item)}
                          className="text-gray-550 hover:text-red-500 p-1.5"
                          title="পছন্দের তালিকা থেকে বাদ দিন"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer info lock */}
              <div className="border-t border-brand-green-855 pt-4 mt-4 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span>🛡️ লোকাল ক্যাশ স্টোরেজ সক্রিয় আছে</span>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="text-brand-lime hover:underline font-bold"
                >
                  ব্রাউজিং চালিয়ে যান
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sheets Sync Settings Modal Overlay */}
      <AnimatePresence>
        {isSheetsConfigOpen && (
          <SheetsSyncModal
            isOpen={isSheetsConfigOpen}
            onClose={() => setIsSheetsConfigOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
