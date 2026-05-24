import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  // Free delivery threshold: ৳2500.00
  const FREE_SHIPPING_THRESHOLD = 2500.00;
  
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  const missingForFree = 0;
  const isFreeShipping = true;
  const progressPercent = 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-green-950/80 backdrop-blur-sm"
          />

          {/* Right sliding panel container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-brand-green-950 border-l border-brand-green-800 flex flex-col justify-between shadow-2xl"
              id="cart-drawer-panel"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-green-800 bg-brand-green-900">
                <div className="flex items-center gap-2 text-white">
                  <ShoppingBag className="h-5 w-5 text-brand-lime" />
                  <h3 className="font-heading text-base font-bold tracking-wide">আমার শপিং ব্যাগ</h3>
                  <span className="rounded-full bg-brand-green-800 px-2.5 py-0.5 text-xs text-brand-lime font-mono">
                    {cartItems.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full bg-brand-green-950/80 p-1.5 text-gray-400 hover:text-white border border-brand-green-800 transition"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Progress towards Free Delivery */}
              {cartItems.length > 0 && (
                <div className="bg-brand-green-900/60 p-4 border-b border-brand-green-800 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    {isFreeShipping ? (
                      <span className="text-brand-lime font-medium flex items-center gap-1">
                        🎉 প্রিমিয়াম ডেলিভারি সম্পূর্ণ ফ্রি!
                      </span>
                    ) : (
                      <span className="text-gray-300 font-sans">
                        ফ্রি ডেলিভারি পেতে আর মাত্র <strong className="text-[#eee]">৳{missingForFree.toFixed(2)}</strong> যোগ করুন!
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{Math.round(progressPercent)}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-brand-green-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isFreeShipping ? 'bg-brand-lime' : 'bg-rose-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-green-900 border-2 border-dashed border-brand-green-800">
                      <ShoppingBag className="h-10 w-10 text-gray-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">আপনার শপিং ব্যাগ খালি রয়েছে</h4>
                      <p className="font-sans text-xs text-gray-400 max-w-[220px]">
                        বাগান থেকে সংগৃহীত সদ্য পাকা সুস্বাদু মিষ্টি লিচু কিনুন! কার্ট পূর্ণ করতে অনুগ্রহ করে পণ্যগুলো দেখুন।
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-full bg-brand-lime hover:bg-brand-lime-hover px-5 py-2 text-xs font-bold text-brand-green-950 uppercase tracking-wide cursor-pointer text-center"
                    >
                      আমাদের লিচুগুলো দেখুন
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-3 rounded-xl bg-brand-green-900/40 border border-brand-green-800 relative group text-left"
                    >
                      {/* Product display thumbnail */}
                      <div className="h-16 w-16 bg-brand-green-900 rounded-lg overflow-hidden shrink-0 border border-brand-green-800">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Info cluster */}
                      <div className="flex-1 flex flex-col justify-between py-0.5 space-y-1.5">
                        <div className="space-y-0.5 pr-6">
                          <h4 className="font-heading text-xs font-bold text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                           <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-sans tracking-wide">📦 {item.product.weight}</span>
                            <span className="text-[10px] font-mono text-brand-lime font-bold">
                              ৳{(item.product.price * (item.product.id === 'p2' ? 100 : 200)).toFixed(0)} / {item.product.id === 'p2' ? '১০০' : '২০০'} পিস
                            </span>
                          </div>
                        </div>

                        {/* Quantity adjust tools */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-brand-green-700 bg-brand-green-950 rounded-full h-7 px-1">
                            <button
                              onClick={() => item.quantity > (item.product.id === 'p2' ? 100 : 200) ? onUpdateQty(item.product.id, item.quantity - 100) : onRemoveItem(item.product.id)}
                              className="h-5 w-5 rounded-full flex items-center justify-center text-xs text-gray-400 hover:text-white"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="w-10 text-center text-[11.5px] font-extrabold font-mono text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.quantity + 100)}
                              className="h-5 w-5 rounded-full flex items-center justify-center text-xs text-gray-400 hover:text-white"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>

                          <span className="font-mono text-xs font-bold text-brand-lime">
                            উপমোট: ৳{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove trash trigger */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-red-500 transition-colors p-1"
                        title="Delete from basket"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Checkout Summary */}
              {cartItems.length > 0 && (
                <div className="border-t border-brand-green-800 bg-brand-green-900 p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>পণ্যের মোট দাম:</span>
                      <span className="font-mono text-sm font-semibold text-white">৳{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>শিপিং চার্জ:</span>
                      {isFreeShipping ? (
                        <span className="text-brand-lime uppercase tracking-wider font-bold">ফ্রি</span>
                      ) : (
                        <span className="font-mono text-xs text-gray-300 font-semibold">৳১০০.০০</span>
                      )}
                    </div>
                    
                    <div className="border-t border-brand-green-800 pt-3 flex items-center justify-between text-sm">
                      <span className="font-bold text-white">সর্বমোট মূল্য:</span>
                      <span className="font-heading text-base font-extrabold text-[#FFA0B4]">
                        ৳{(subtotal + (isFreeShipping ? 0 : 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={onProceedToCheckout}
                      className="w-full flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-lime hover:bg-brand-lime-hover text-brand-green-950 font-bold h-12 text-xs tracking-wider uppercase transition-all duration-200 shadow-md"
                    >
                      <span>অর্ডার সম্পন্ন করতে ক্লিক করুন</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={onClose}
                      className="w-full text-center text-xs font-semibold text-gray-400 hover:text-white transition py-1 cursor-pointer"
                    >
                      অথবা, কেনাকাটা অব্যাহত রাখুন
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-mono">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-lime" />
                    <span>১০০% প্রাকৃতিক ও ফরমালিন মুক্ত লিচুর সতেজতার শতভাগ গ্যারান্টি।</span>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
