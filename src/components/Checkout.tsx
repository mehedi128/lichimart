import React, { useState, useEffect } from 'react';
import { CartItem, Product, CheckoutDetails, Order } from '../types';
import { 
  ArrowLeft, CheckCircle2, Ticket, Gift, Trash2, ShieldCheck, 
  Search, Truck, Calendar, CreditCard, ChevronRight, Download, Package, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getSheetsConfig, appendRowToGoogleSheet, sendOrderToWebhook, formatOrderRow, 
  fetchSheetsConfigFromFirestore, SheetsConfig, 
  sendOrderToTelegram 
} from '../sheetsService';

// Custom SVG Logos for bKash, Nagad (Nogod) and Rocket
const BkashLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className} fill="none">
    <path d="M174.4 46.4L37.1 154.6l37.8 14.5 174.5 69.8L174.4 46.4z" fill="#D12053"/>
    <path d="M174.4 46.4l260.6 154.5-359.8-46.3 99.2-108.2z" fill="#E2136E"/>
    <path d="M255.4 270.2L174.4 46.4l117.6 112 143.6 111.8-250.2.1z" fill="#E2136E"/>
    <path d="M255.4 270.2l56.6 96.1 50-67.9L485.6 209l-230.2 61.2z" fill="#D12053"/>
    <path d="M255.4 270.2l280.2-61.2v31.4l-75 51.1-205.2-21.3z" fill="#C00E4E"/>
    <path d="M255.4 270.2L204.8 465.6l107.2-107.8-56.6-87.6z" fill="#E2136E"/>
    <path d="M435.6 142.9L482.4 82l41.6 8.5-23.4 31.9-65 20.5z" fill="#D12053"/>
  </svg>
);

const NagadLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50,10 C65,10 80,18 88,32 C80,24 68,20 50,22 C32,24 20,35 15,50 C10,40 12,28 22,18 C30,10 40,10 50,10 Z" fill="#F04923" />
    <path d="M88,32 C95,45 94,62 84,74 C86,58 80,44 68,36 C56,28 38,30 24,40 C34,30 48,26 62,28 C76,30 84,31 88,32 Z" fill="#F26522" />
    <path d="M84,74 C74,86 58,92 42,88 C54,88 68,82 74,70 C80,58 76,40 64,28 C70,38 72,52 68,66 C64,80 54,84 42,88 Z" fill="#F6921E" />
    <path d="M42,88 C26,84 14,72 10,54 C16,68 28,76 44,72 C60,68 68,50 66,32 C60,46 48,54 34,54 C20,54 12,44 10,54 Z" fill="#F04923" />
    <circle cx="50" cy="52" r="14" fill="#E6E6E6" />
    <path d="M48,58 L46,55 C46,54 48,50 51,50 C54,50 56,54 54,56 L52,58 Z" fill="#F04923" />
    <circle cx="50" cy="46" r="3" fill="#F04923" />
  </svg>
);

const RocketLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15,50 L85,15 L55,85 L48,56 L15,50 Z" fill="#8C388C" />
    <path d="M48,56 L85,15 L55,85 L48,56 Z" fill="#752275" />
    <path d="M48,56 L72,25 L35,46 L48,56 Z" fill="#A84CA8" />
  </svg>
);

interface CheckoutProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  onCloseCheckout: () => void;
  phone: string;
}

export default function Checkout({
  cartItems,
  onClearCart,
  onCloseCheckout,
  phone,
}: CheckoutProps) {
  // Coupon state
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0); // value in dollars
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Tomorrow's date helper for default delivery date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState(tomorrowFormatted);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('Morning (8:30 AM - 12:00 PM)');

  // Billing and Card
  const [billingMethod, setBillingMethod] = useState<'bank' | 'bkash' | 'nagad' | 'rocket'>('bkash');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [transactionIdOrPhone, setTransactionIdOrPhone] = useState('');

  // Order state machine: 'idle' | 'processing' | 'confirmed'
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'confirmed'>('idle');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'failed' | 'none'>('idle');
  const [processingStep, setProcessingStep] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [sheetsConfig, setSheetsConfig] = useState<SheetsConfig>(getSheetsConfig());

  // Dynamic Google Sheets and Telegram config synchronization on mount
  useEffect(() => {
    // 1. Instantly read immediate cached settings from localStorage
    const local = getSheetsConfig();
    setSheetsConfig(local);

    // 2. Fetch fresh dynamic settings from Firebase Firestore shared cloud state
    const syncConfig = async () => {
      try {
        const fresh = await fetchSheetsConfigFromFirestore();
        if (fresh) {
          setSheetsConfig(fresh);
        }
      } catch (error) {
        console.error('Failed to load shared SheetsConfig:', error);
      }
    };
    syncConfig();
  }, []);

  // Form Validations
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = true;
  const shippingCharge = 0;
  const total = subtotal + shippingCharge - promoDiscount;

  // Handle coupon checks
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'LICHIMART10' || cleanCode === 'WELCOME') {
      const discountVal = subtotal * 0.10; // 10% off
      setPromoDiscount(discountVal);
      setPromoSuccess(`Success! Code applied: 10% discount (-৳${discountVal.toFixed(2)})`);
    } else {
      setPromoError('Incorrect limit coupon. Try a valid code such as "LICHIMART10".');
      setPromoDiscount(0);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoSuccess('');
    setPromoError('');
  };

  // Run checkout validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = 'Please enter your full name';
    
    if (!customerPhone.trim()) {
      errors.phone = 'Please enter your contact phone number';
    } else if (!/^\d+$/.test(customerPhone)) {
      errors.phone = 'Phone number must be numeric (only numbers are allowed)';
    } else if (customerPhone.length < 11) {
      errors.phone = 'Phone number must be at least 11 digits';
    }

    if (!address.trim()) errors.address = 'Please specify your physical shipping address';

    if (!transactionIdOrPhone.trim()) {
      errors.transactionIdOrPhone = 'Transaction ID or sender phone number is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit and run simulated steps
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setCheckoutStatus('processing');
    setSyncStatus('idle');
    
    // Build final invoice early so we can sync it during processing screen
    const invoiceId = `LM-${Math.floor(1000 + Math.random() * 9005)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
    const newOrder: Order = {
      orderId: invoiceId,
      customer: {
        fullName,
        phone: customerPhone,
        email: email || 'anonymous@lichimart.com',
        address,
        instructions,
        deliveryDate,
        deliveryTimeSlot,
        billingMethod,
        transactionIdOrPhone: ['bank', 'bkash', 'nagad', 'rocket'].includes(billingMethod) ? transactionIdOrPhone : undefined,
        appliedPromo: promoDiscount > 0 ? promoCode : undefined,
      },
      items: [...cartItems],
      subtotal,
      shipping: shippingCharge,
      discount: promoDiscount,
      total,
      placedAt: new Date().toLocaleString(),
    };

    // Trigger async sheet and telegram sync in parallel in the background!
    const performSheetsSync = async () => {
      let activeConfig = sheetsConfig;

      try {
        // Fetch fresh dynamic settings from Firestore right before submitting to guarantee absolute reliability
        const fresh = await fetchSheetsConfigFromFirestore();
        if (fresh) {
          activeConfig = fresh;
          setSheetsConfig(fresh);
        }
      } catch (e) {
        console.warn('Failed to pre-fetch fresh config from Firestore:', e);
      }

      // Handle Telegram notification delivery if configured
      if (activeConfig.telegramEnabled && activeConfig.telegramBotToken && activeConfig.telegramChatId) {
        try {
          await sendOrderToTelegram(activeConfig.telegramBotToken, activeConfig.telegramChatId, newOrder);
          console.log('Order notification sent to Telegram successfully!');
        } catch (tgError) {
          console.error('Failed to send Telegram notification:', tgError);
        }
      }

      if (activeConfig.syncMode === 'none') {
        setSyncStatus('none');
        return;
      }
      setSyncStatus('syncing');
      try {
        if (activeConfig.syncMode === 'webhook' && activeConfig.webhookUrl) {
          await sendOrderToWebhook(activeConfig.webhookUrl, newOrder);
          setSyncStatus('success');
        } else if (activeConfig.syncMode === 'oauth' && activeConfig.spreadsheetId) {
          const rowValues = formatOrderRow(newOrder);
          await appendRowToGoogleSheet(activeConfig.spreadsheetId, activeConfig.sheetName, rowValues);
          setSyncStatus('success');
        } else {
          setSyncStatus('none');
        }
      } catch (error) {
        console.error('LichiMart Order Sync failed:', error);
        setSyncStatus('failed');
      }
    };

    performSheetsSync();

    // Animate simulated backend operations step-by-step
    const steps = [
      'Authenticating secured gateway interface session...',
      'Reserving elite tree-fresh lychees from Dinajpur orchards...',
      'Scheduling custom pluck harvest extraction at 4:30 AM...',
      'Assigning rapid express logistics agent courier...',
      ...(sheetsConfig.syncMode !== 'none' ? ['সিঙ্ক্রোনাইজিং: গুগল শিটে অর্ডার রেকর্ড সংরক্ষণ করা হচ্ছে...'] : []),
      'Generating digital tax invoice ledger and receipt...'
    ];

    let currentStepIndex = 0;
    setProcessingStep(steps[currentStepIndex]);

    const stepInterval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setProcessingStep(steps[currentStepIndex]);
      } else {
        clearInterval(stepInterval);
        setCompletedOrder(newOrder);
        setCheckoutStatus('confirmed');
        onClearCart();
      }
    }, 850);
  };

  // Generate and trigger download of ASCII formatted receipt
  const handleDownloadInvoice = () => {
    if (!completedOrder) return;

    const o = completedOrder;
    const itemLines = o.items.map((item) => {
      const itemSub = item.product.price * item.quantity;
      return `| ${item.product.name.padEnd(28)} | ${item.quantity.toString().padEnd(4)} | ৳${item.product.price.toFixed(2).padEnd(6)} | ৳${itemSub.toFixed(2).padEnd(8)} |`;
    }).join('\n');

    const paymentMethodLabel = 
      o.customer.billingMethod === 'bkash' ? 'bKash (বিকাশ)' :
      o.customer.billingMethod === 'nagad' ? 'Nagad (নগদ)' :
      o.customer.billingMethod === 'rocket' ? 'Rocket (রকেট)' :
      'Bank Transfer';

    const transactionLine = o.customer.transactionIdOrPhone 
      ? `Transaction ID/Phone: ${o.customer.transactionIdOrPhone}` 
      : '';

    const receiptContent = `
========================================
             LICHIMART INVOICE          
========================================
Order ID:     ${o.orderId}
Placed At:    ${o.placedAt}
Status:       CONFIRMED / Mode: ${paymentMethodLabel}
${transactionLine ? `${transactionLine}\n` : ''}
----------------------------------------
CUSTOMER DETAILS
----------------------------------------
Name:         ${o.customer.fullName}
Phone:        ${o.customer.phone}
Email:        ${o.customer.email}
Address:      ${o.customer.address}
Instructions: ${o.customer.instructions || 'N/A'}

----------------------------------------
PURCHASED ITEMS
----------------------------------------
| Product Name                 | Qty  | Price   | Subtotal   |
----------------------------------------
${itemLines}
----------------------------------------
Subtotal:                    ৳${o.subtotal.toFixed(2)}
Express Delivery Charge:     ৳${o.shipping.toFixed(2)}
========================================
GRAND TOTAL BILL:            ৳${o.total.toFixed(2)}
========================================

Thank you for choosing LichiMart!
Your lychees are plucking tree-fresh at 
5:00 AM, ready for swift dispatch.

Hotline & WhatsApp support: ${phone}
Website: https://www.facebook.com/lichimart
========================================
`;

    // Create blobs and trigger click simulation
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Invoice_${o.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  if (checkoutStatus === 'processing') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center space-y-8">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-green-900 border-2 border-brand-lime mx-auto animate-spin">
          <div className="h-16 w-16 rounded-full border-t-2 border-dashed border-red-500 animate-pulse" />
        </div>
        <div className="space-y-3">
          <h3 className="font-heading text-xl font-bold text-white tracking-widest uppercase">Securing Harvest Slot</h3>
          <p className="font-mono text-xs text-brand-lime tracking-wide animate-pulse">{processingStep}</p>
          <p className="text-gray-400 font-sans text-xs max-w-sm mx-auto">Please do not refresh or close this panel until your secure order is documented and finalized.</p>
        </div>
      </div>
    );
  }

  if (checkoutStatus === 'confirmed' && completedOrder) {
    const o = completedOrder;
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-left space-y-8">
        {/* Banner */}
        <div className="rounded-2xl bg-brand-green-900 border border-brand-green-800 p-6 text-center space-y-3 shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-lime text-brand-green-950 mx-auto shadow-md">
            <CheckCircle2 className="h-10 w-10 fill-current" />
          </div>
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-black text-white">Order Placed Successfully!</h2>
            <p className="font-sans text-xs text-brand-lime">Your fresh lychee harvest schedule is registered in our records.</p>
          </div>
          <p className="font-sans text-xs text-gray-300 max-w-lg mx-auto">
            Thank you, <strong className="text-white">{o.customer.fullName}</strong>. Our logistics manager will ring your contact <strong className="text-brand-lime">{o.customer.phone}</strong> shortly to align the exact delivery coordinate dispatch.
          </p>
        </div>

        {/* Breakdown Display */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Section 1: Customer Data */}
          <div className="rounded-2xl border border-brand-green-800 bg-brand-green-950 p-5 space-y-4">
            <h3 className="font-heading text-xs font-bold text-brand-lime uppercase tracking-wider font-mono">Delivery & Invoice Details</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-brand-green-900 pb-1.5">
                <span className="text-gray-400">Order Identifier:</span>
                <span className="font-bold font-mono text-white text-xs">{o.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-brand-green-900 pb-1.5">
                <span className="text-gray-400">Shipping Location:</span>
                <span className="font-semibold text-white max-w-[180px] text-right line-clamp-2">{o.customer.address}</span>
              </div>
              <div className="flex justify-between border-b border-brand-green-900 pb-1.5">
                <span className="text-gray-400">Payment Method Status:</span>
                <span className="font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded tracking-wide font-mono">
                  {o.customer.billingMethod === 'bkash' && 'bKash (বিকাশ) - Paid'}
                  {o.customer.billingMethod === 'nagad' && 'Nagad (নগদ) - Paid'}
                  {o.customer.billingMethod === 'rocket' && 'Rocket (রকেট) - Paid'}
                  {o.customer.billingMethod === 'bank' && 'Bank Transfer - Paid'}
                </span>
              </div>
              {o.customer.transactionIdOrPhone && (
                <div className="flex justify-between border-b border-brand-green-900 pb-1.5">
                  <span className="text-gray-400 font-mono text-xs">Transaction ID / Phone:</span>
                  <span className="font-bold font-mono text-brand-lime text-xs">{o.customer.transactionIdOrPhone}</span>
                </div>
              )}
              {syncStatus !== 'idle' && syncStatus !== 'none' && (
                <div className="flex justify-between border-b border-brand-green-900 pb-1.5 align-middle">
                  <span className="text-gray-400">গুগল শিট সিঙ্ক (গ্যারান্টি):</span>
                  {syncStatus === 'syncing' && (
                    <span className="font-bold text-yellow-400 flex items-center gap-1 animate-pulse">
                      <RefreshCw className="h-3 w-3 animate-spin text-yellow-400" /> সিঙ্ক হচ্ছে...
                    </span>
                  )}
                  {syncStatus === 'success' && (
                    <span className="font-bold text-brand-lime flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-lime" /> সিঙ্কড সফল! 📊✅
                    </span>
                  )}
                  {syncStatus === 'failed' && (
                    <span className="font-bold text-red-400 flex items-center gap-1" title="গুগল শিট সেটিংস পুনরায় চেক করুন।">
                      ✖ সিঙ্ক স্থগিত (লোকাল ব্যাকআপ সংরক্ষিত)
                    </span>
                  )}
                </div>
              )}
            </div>

            {sheetsConfig.syncMode === 'none' && (
              <div className="mt-4 p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-xs text-yellow-350 space-y-1 text-left">
                <p className="font-bold flex items-center gap-1 text-yellow-400 text-[11px]">
                  ⚠️ গুগল শিট সিঙ্ক কনফিগার করা নেই!
                </p>
                <p className="leading-relaxed text-[10px] text-gray-300">
                  আপনার এই গুরুত্বপূর্ণ অর্ডার ডেটাটি কোনো গুগল শিটে সেভ হয়নি। অর্ডারগুলো স্বয়ংক্রিয়ভাবে গুগল শিটে সেভ করতে অনুগ্রহ করে স্ক্রিনের উপরে <strong className="text-brand-lime font-bold">"গুগল শিট সিঙ্ক" (Sheets Sync)</strong> বাটনে ক্লিক করে সেটিংস অন করুন।
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Financial receipts */}
          <div className="rounded-2xl border border-brand-green-800 bg-brand-green-950 p-5 flex flex-col justify-between space-y-4">
            <h3 className="font-heading text-xs font-bold text-brand-lime uppercase tracking-wider font-mono">Receipt Ledger</h3>
            
            <div className="space-y-2 text-xs">
              {o.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-gray-300 font-sans">
                  <span>{item.product.name} (x{item.quantity})</span>
                  <span className="font-mono text-white">৳{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="border-t border-brand-green-900 pt-2 flex justify-between text-xs text-gray-400">
                <span>Products Subtotal:</span>
                <span className="font-mono text-white">৳{o.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>Express Transport Charge:</span>
                {o.shipping === 0 ? (
                  <span className="text-brand-lime uppercase font-bold tracking-wider">FREE</span>
                ) : (
                  <span className="font-mono text-white">৳{o.shipping.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="border-t-2 border-brand-green-800 pt-3 flex justify-between text-sm">
              <span className="font-extrabold text-white">Total Balance:</span>
              <span className="font-heading text-base font-extrabold text-brand-lime">৳{o.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Call-to-actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
          <button
            onClick={handleDownloadInvoice}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-lime hover:bg-brand-lime-hover px-6 py-3.5 text-xs font-bold text-brand-green-950 uppercase tracking-wider transition-all"
          >
            <Download className="h-4.5 w-4.5" />
            Download Receipt (.TXT Version)
          </button>
          
          <button
            onClick={onCloseCheckout}
            className="rounded-full border border-brand-green-700 bg-brand-green-900 hover:bg-brand-green-800 px-6 py-3.5 text-xs font-bold text-white uppercase tracking-wider transition-all"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      
      {/* Return Back Button */}
      <div className="mb-6">
        <button
          onClick={onCloseCheckout}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-gray-400 hover:text-brand-lime transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Orchard Shop</span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Form Box */}
        <div className="lg:col-span-7 rounded-2xl border border-brand-green-800 bg-brand-green-900/60 p-5 md:p-6 text-left">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-brand-green-800/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-800 text-[#FFA0B4]">
              <Package className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-white uppercase tracking-wider">Secure Checkout & Booking</h2>
              <p className="text-[10px] text-gray-400">Provide precise courier coordinate information to ensure your Dinajpur lychees arrive tree-fresh.</p>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Input Row 1 - Full name */}
            <div>
              <label htmlFor="fnInput" className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1.5 font-mono">
                Your Real Full Name <strong className="text-red-500">*</strong>
              </label>
              <input
                id="fnInput"
                type="text"
                placeholder="e.g., Aminul Islam"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full rounded-lg border bg-brand-green-950 px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none transition ${
                  formErrors.fullName ? 'border-red-500 focus:border-red-500' : 'border-brand-green-700 focus:border-[#FFA0B4]'
                }`}
              />
              {formErrors.fullName && (
                <p className="mt-1 text-[11px] text-red-400 font-medium">{formErrors.fullName}</p>
              )}
            </div>

            {/* Input Row 2 - Phone/Email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phInput" className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1.5 font-mono">
                  Phone / WhatsApp Number <strong className="text-red-500">*</strong>
                </label>
                <input
                  id="phInput"
                  type="tel"
                  placeholder="e.g., 01947970939"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  className={`w-full rounded-lg border bg-brand-green-950 px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none transition ${
                    formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-brand-green-700 focus:border-[#FFA0B4]'
                  }`}
                />
                {formErrors.phone ? (
                  <p className="mt-1 text-[11px] text-red-400 font-medium">{formErrors.phone}</p>
                ) : (
                  <span className="text-[10px] text-gray-400 font-sans block pt-1">Used to coordinate your tree-fresh harvest delivery.</span>
                )}
              </div>
              
              <div>
                <label htmlFor="emInput" className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1.5 font-mono">
                  Email Address <span className="text-gray-550 text-[10px]">(Optional)</span>
                </label>
                <input
                  id="emInput"
                  type="email"
                  placeholder="e.g., anonymous@lichimart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-brand-green-700 bg-brand-green-950 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-[#FFA0B4] focus:outline-none focus:ring-0 transition"
                />
              </div>
            </div>

            {/* Input Row 3 - Physical Address */}
            <div>
              <label htmlFor="addInput" className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1.5 font-mono">
                Physical Delivery Address <strong className="text-red-500">*</strong>
              </label>
              <textarea
                id="addInput"
                rows={3}
                placeholder="e.g., Apartment 4B, 23 West Orchard Lane, Dinajpur"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full rounded-lg border bg-brand-green-950 px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none transition ${
                  formErrors.address ? 'border-red-500 focus:border-red-500' : 'border-brand-green-700 focus:border-[#FFA0B4]'
                }`}
              />
              {formErrors.address && (
                <p className="mt-1 text-[11px] text-red-400 font-medium">{formErrors.address}</p>
              )}
            </div>
                

            {/* Input Row 4 - Speical Instructions */}
            <div>
              <label htmlFor="instInput" className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1.5 font-mono">
                Order Note / Delivery Instructions <span className="text-gray-500 text-[10px]">(Optional)</span>
              </label>
              <input
                id="instInput"
                type="text"
                placeholder="e.g., Deliver to gate directly / ring bell only / write 'Happy Summer' on card"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full rounded-lg border border-brand-green-700 bg-brand-green-950 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-[#FFA0B4] focus:outline-none transition"
              />
            </div>

            {/* Billing Selection Toggle Grid */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-[#FFA0B4] sm:text-gray-300 uppercase tracking-wide font-mono">
                Select Payment Method / পেমেন্ট মাধ্যম নির্বাচন করুন <strong className="text-red-500">*</strong>
              </label>
              
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                {/* bKash card */}
                <div
                  id="pay-bkash"
                  onClick={() => {
                    setFormErrors(prev => {
                      const copy = { ...prev };
                      delete copy.transactionIdOrPhone;
                      return copy;
                    });
                    setBillingMethod('bkash');
                  }}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 ${
                    billingMethod === 'bkash'
                      ? 'border-[#E2136E] bg-[#E2136E]/10 ring-1 ring-[#E2136E]/50 shadow-[0_0_15px_rgba(226,19,110,0.15)] scale-[1.02]'
                      : 'border-brand-green-800 bg-brand-green-950/40 hover:border-[#E2136E]/40 hover:bg-brand-green-950/70'
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-2 shadow-md mb-2.5 transition-transform duration-300 hover:scale-110">
                    <BkashLogo className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-extrabold text-white tracking-wide font-sans text-center">bKash</span>
                  <span className="text-[10px] font-bold text-gray-400 font-sans text-center mt-0.5">বিকাশ</span>
                  {billingMethod === 'bkash' && (
                    <div className="absolute top-1.5 right-1.5 bg-[#E2136E] text-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-[#E2136E] text-white stroke-2" />
                    </div>
                  )}
                </div>

                {/* Nagad card */}
                <div
                  id="pay-nagad"
                  onClick={() => {
                    setFormErrors(prev => {
                      const copy = { ...prev };
                      delete copy.transactionIdOrPhone;
                      return copy;
                    });
                    setBillingMethod('nagad');
                  }}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 ${
                    billingMethod === 'nagad'
                      ? 'border-[#FA541C] bg-[#FA541C]/10 ring-1 ring-[#FA541C]/50 shadow-[0_0_15px_rgba(250,84,28,0.15)] scale-[1.02]'
                      : 'border-brand-green-800 bg-brand-green-950/40 hover:border-[#FA541C]/40 hover:bg-brand-green-950/70'
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-2 shadow-md mb-2.5 transition-transform duration-300 hover:scale-110">
                    <NagadLogo className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-extrabold text-white tracking-wide font-sans text-center">Nagad</span>
                  <span className="text-[10px] font-bold text-gray-400 font-sans text-center mt-0.5">নগদ</span>
                  {billingMethod === 'nagad' && (
                    <div className="absolute top-1.5 right-1.5 bg-[#FA541C] text-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-[#FA541C] text-white stroke-2" />
                    </div>
                  )}
                </div>

                {/* Rocket card */}
                <div
                  id="pay-rocket"
                  onClick={() => {
                    setFormErrors(prev => {
                      const copy = { ...prev };
                      delete copy.transactionIdOrPhone;
                      return copy;
                    });
                    setBillingMethod('rocket');
                  }}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 ${
                    billingMethod === 'rocket'
                      ? 'border-[#8C388C] bg-[#8C388C]/15 ring-1 ring-[#8C388C]/50 shadow-[0_0_15px_rgba(140,56,140,0.15)] scale-[1.02]'
                      : 'border-brand-green-800 bg-brand-green-950/40 hover:border-[#8C388C]/40 hover:bg-brand-green-950/70'
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-2 shadow-md mb-2.5 transition-transform duration-300 hover:scale-110">
                    <RocketLogo className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-extrabold text-white tracking-wide font-sans text-center">Rocket</span>
                  <span className="text-[10px] font-bold text-gray-400 font-sans text-center mt-0.5">রকেট</span>
                  {billingMethod === 'rocket' && (
                    <div className="absolute top-1.5 right-1.5 bg-[#8C388C] text-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-[#8C388C] text-white stroke-2" />
                    </div>
                  )}
                </div>

                {/* Bank Card (Transfer) */}
                <div
                  id="pay-bank"
                  onClick={() => {
                    setFormErrors(prev => {
                      const copy = { ...prev };
                      delete copy.transactionIdOrPhone;
                      return copy;
                    });
                    setBillingMethod('bank');
                  }}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 ${
                    billingMethod === 'bank'
                      ? 'border-brand-lime bg-brand-lime/10 ring-1 ring-brand-lime/50 shadow-[0_0_15px_rgba(164,220,110,0.15)] scale-[1.02]'
                      : 'border-brand-green-800 bg-brand-green-950/40 hover:border-brand-lime/40 hover:bg-brand-green-950/70'
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-brand-green-900 rounded-full border border-brand-green-700 p-2 shadow-md mb-2.5 transition-transform duration-300 hover:scale-110 text-brand-lime">
                    <span className="text-2xl md:text-3xl">🏛️</span>
                  </div>
                  <span className="text-xs font-extrabold text-white tracking-wide font-sans text-center">Bank Pay</span>
                  <span className="text-[10px] font-bold text-gray-400 font-sans text-center mt-0.5">ব্যাংক ট্রান্সফার</span>
                  {billingMethod === 'bank' && (
                    <div className="absolute top-1.5 right-1.5 bg-brand-lime text-brand-green-950 rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-brand-lime text-brand-green-950 stroke-2" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Conditional Mobile Financial Service (MFS) / Bank Instructions & Input */}
            <AnimatePresence>
              {['bkash', 'nagad', 'rocket', 'bank'].includes(billingMethod) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-brand-green-800 bg-brand-green-950/85 p-4 space-y-4 overflow-hidden"
                >
                  {/* Quick Payment Details helper box */}
                  <div className="rounded-lg bg-brand-green-900/40 p-3.5 text-xs sm:text-sm text-gray-200 leading-relaxed space-y-2 border border-brand-green-800/50">
                    <p className="font-extrabold text-white text-sm sm:text-base">
                      {billingMethod === 'bkash' && 'bKash Payment Guide (বিকাশ গাইড)'}
                      {billingMethod === 'nagad' && 'Nagad Payment Guide (নগদ গাইড)'}
                      {billingMethod === 'rocket' && 'Rocket Payment Guide (রকেট গাইড)'}
                      {billingMethod === 'bank' && 'Bank Transfer Guide (ব্যাংক গাইড)'}
                    </p>
                    
                    {billingMethod === 'bkash' && (
                      <p>দয়া করে এই বিকাশ নম্বরে সেন্ড মানি করুন: <strong className="text-brand-lime font-mono text-sm sm:text-base font-extrabold underline decoration-dashed decoration-brand-lime/50 mb-1">01947970939 (Personal)</strong> এবং নিচে আপনার ট্রানজেকশন আইডি অথবা যে নম্বর থেকে পাঠিয়েছেন তা লিখুন।</p>
                    )}
                    {billingMethod === 'nagad' && (
                      <p>দয়া করে এই নগদ নম্বরে সেন্ড মানি করুন: <strong className="text-brand-lime font-mono text-sm sm:text-base font-extrabold underline decoration-dashed decoration-brand-lime/50 mb-1">01947970939 (Personal)</strong> এবং নিচে আপনার ট্রানজেকশন আইডি অথবা যে নম্বর থেকে পাঠিয়েছেন তা লিখুন।</p>
                    )}
                    {billingMethod === 'rocket' && (
                      <p>দয়া করে এই রকেট নম্বরে সেন্ড মানি করুন: <strong className="text-brand-lime font-mono text-sm sm:text-base font-extrabold underline decoration-dashed decoration-brand-lime/50 mb-1">01947970939 (Personal)</strong> এবং নিচে আপনার ট্রানজেকশন আইডি অথবা যে নম্বর থেকে পাঠিয়েছেন তা লিখুন।</p>
                    )}
                    {billingMethod === 'bank' && (
                      <div className="space-y-1.5 font-sans">
                        <p>Please transfer the total bill to the following Bank Account:</p>
                        <ul className="list-disc pl-5 space-y-1 font-mono text-xs sm:text-sm text-brand-lime font-bold">
                          <li>Bank Name: The City Bank Limited</li>
                          <li>Account Name: MD. MEHEDI HASAN</li>
                          <li>Account Number: 2104118949001</li>
                          <li>Branch Name: GAZIPUR BRANCH</li>
                          <li>District Name: 225330526</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Transaction ID or phone field */}
                  <div>
                    <label htmlFor="txInput" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">
                      Your Transaction ID or phone number <strong className="text-red-500">*</strong>
                    </label>
                    <input
                      id="txInput"
                      type="text"
                      placeholder="e.g., TRX9823423 or 017XXXXXXXX"
                      value={transactionIdOrPhone}
                      onChange={(e) => setTransactionIdOrPhone(e.target.value)}
                      className={`w-full rounded-lg border bg-brand-green-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-lime/30 ${
                        formErrors.transactionIdOrPhone ? 'border-red-500' : 'border-brand-green-700'
                      }`}
                    />
                    {formErrors.transactionIdOrPhone && (
                      <p className="mt-1 text-[11px] text-red-400 font-semibold">{formErrors.transactionIdOrPhone}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions inside form */}
            <div className="pt-4 border-t border-brand-green-800">
              <button
                type="submit"
                className="w-full h-12 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-lime hover:bg-brand-lime-hover text-brand-green-950 font-bold uppercase tracking-wider text-xs shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <span>PLACE SECURE ORDER (৳{total.toFixed(2)})</span>
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>

          </form>
        </div>

        {/* Right order summary card columns */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-brand-green-800 bg-brand-green-950 p-5 md:p-6 text-left space-y-5 shadow-lg">
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider border-b border-brand-green-900 pb-3">
              Order Basket Breakdown
            </h3>

            {/* Small list */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center justify-between text-xs">
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-10 w-10 object-cover rounded-lg border border-brand-green-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-white line-clamp-1 max-w-[170px]">{item.product.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">Qty: {item.quantity} x ৳{item.product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-brand-lime">৳{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Direct pricing details */}
             <div className="border-t border-brand-green-900 pt-4 space-y-2 border-b pb-4 text-xs">
              <div className="flex items-center justify-between text-gray-400">
                <span>Products Subtotal:</span>
                <span className="font-mono text-white font-semibold">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Freight Shipping Charge:</span>
                {isFreeShipping ? (
                  <span className="text-brand-lime font-bold uppercase tracking-wider">FREE</span>
                ) : (
                  <span className="font-mono text-white font-semibold">৳100.00</span>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="font-extrabold text-white text-sm uppercase tracking-wide">Grand Total</span>
                <p className="text-[10px] text-gray-400 block font-mono">Duties and taxes inclusive</p>
              </div>
              <span className="font-heading text-xl font-black text-brand-lime">
                ৳{total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Secure lock trust card */}
          <div className="rounded-xl border border-brand-green-800 bg-brand-green-950/40 p-4 flex items-center gap-3 text-left">
            <ShieldCheck className="h-8 w-8 text-[#FFA0B4] shrink-0" />
            <div>
              <h5 className="text-xs font-bold text-white uppercase font-heading leading-tight">100% Secure Farm Gateways</h5>
              <p className="text-[10px] text-gray-400">We do not store mock debit credentials.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
