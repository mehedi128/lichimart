import React, { useState } from 'react';
import { CartItem, Product, CheckoutDetails, Order } from '../types';
import { 
  ArrowLeft, CheckCircle2, Ticket, Gift, Trash2, ShieldCheck, 
  Search, Truck, Calendar, CreditCard, ChevronRight, Download, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [billingMethod, setBillingMethod] = useState<'cod' | 'card'>('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // Order state machine: 'idle' | 'processing' | 'confirmed'
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'confirmed'>('idle');
  const [processingStep, setProcessingStep] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

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
    } else if (customerPhone.length < 8) {
      errors.phone = 'The phone number provided is too short';
    }

    if (!address.trim()) errors.address = 'Please specify your physical shipping address';
    if (!deliveryDate) errors.deliveryDate = 'Please select a delivery date';

    if (billingMethod === 'card') {
      if (!cardNumber.trim()) errors.cardNumber = 'Card number is required';
      if (!cardExpiry.trim()) errors.cardExpiry = 'Expiry date is required';
      if (!cardCVV.trim()) errors.cardCVV = 'CVV code is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit and run simulated steps
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setCheckoutStatus('processing');
    
    // Animate simulated backend operations step-by-step
    const steps = [
      'Authenticating secured gateway interface session...',
      'Reserving elite tree-fresh lychees from Dinajpur orchards...',
      'Scheduling custom pluck harvest extraction at 4:30 AM...',
      'Assigning rapid express logistics agent courier...',
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
        
        // Build final invoice
        const invoiceId = `LM-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
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
            appliedPromo: promoDiscount > 0 ? promoCode : undefined,
          },
          items: [...cartItems],
          subtotal,
          shipping: shippingCharge,
          discount: promoDiscount,
          total,
          placedAt: new Date().toLocaleString(),
        };

        setCompletedOrder(newOrder);
        setCheckoutStatus('confirmed');
        onClearCart();
      }
    }, 900);
  };

  // Generate and trigger download of ASCII formatted receipt
  const handleDownloadInvoice = () => {
    if (!completedOrder) return;

    const o = completedOrder;
    const itemLines = o.items.map((item) => {
      const itemSub = item.product.price * item.quantity;
      return `| ${item.product.name.padEnd(28)} | ${item.quantity.toString().padEnd(4)} | ৳${item.product.price.toFixed(2).padEnd(6)} | ৳${itemSub.toFixed(2).padEnd(8)} |`;
    }).join('\n');

    const receiptContent = `
========================================
             LICHIMART INVOICE          
========================================
Order ID:     ${o.orderId}
Placed At:    ${o.placedAt}
Status:       CONFIRMED / PAID via COD

----------------------------------------
CUSTOMER DETAILS
----------------------------------------
Name:         ${o.customer.fullName}
Phone:        ${o.customer.phone}
Email:        ${o.customer.email}
Address:      ${o.customer.address}
Instructions: ${o.customer.instructions || 'N/A'}

----------------------------------------
DELIVERY SCHEDULE
----------------------------------------
Requested Date: ${o.customer.deliveryDate}
Requested Slot: ${o.customer.deliveryTimeSlot}

----------------------------------------
PURCHASED ITEMS
----------------------------------------
| Product Name                 | Qty  | Price   | Subtotal   |
----------------------------------------
${itemLines}
----------------------------------------
Subtotal:                    ৳${o.subtotal.toFixed(2)}
Express Delivery Charge:     ৳${o.shipping.toFixed(2)}
Discount Deductions:         -৳${o.discount.toFixed(2)}
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
            Thank you, <strong className="text-white">{o.customer.fullName}</strong>. We have dispatched a purchase confirmation email to <strong className="text-white">{o.customer.email}</strong>. Our logistics manager will ring your contact <strong className="text-brand-lime">{o.customer.phone}</strong> shortly to align the exact delivery coordinate dispatch.
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
                <span className="text-gray-400">Requested Harvest Date:</span>
                <span className="font-bold text-white">{o.customer.deliveryDate}</span>
              </div>
              <div className="flex justify-between border-b border-brand-green-900 pb-1.5">
                <span className="text-gray-400">Preferred Time Slot:</span>
                <span className="font-bold text-white">{o.customer.deliveryTimeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-brand-green-900 pb-1.5">
                <span className="text-gray-400">Shipping Location:</span>
                <span className="font-semibold text-white max-w-[180px] text-right line-clamp-2">{o.customer.address}</span>
              </div>
              <div className="flex justify-between border-b border-brand-green-900 pb-1.5">
                <span className="text-gray-400">Payment Method Status:</span>
                <span className="font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded tracking-wide font-mono">
                  {o.customer.billingMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Mock Card Gateway'}
                </span>
              </div>
            </div>
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

              {o.discount > 0 && (
                <div className="flex justify-between text-xs text-rose-400 font-medium">
                  <span>Applied Promo Discount:</span>
                  <span className="font-mono">-৳{o.discount.toFixed(2)}</span>
                </div>
              )}
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
                  placeholder="e.g., +1 (555) 019-2834"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
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
                            {/* Date Picker & Time slot Picker */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1.5 font-mono">
                  Requested Delivery Date <strong className="text-red-500">*</strong>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={tomorrowFormatted}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full rounded-lg border border-brand-green-700 bg-brand-green-950 px-4 py-3 text-xs text-white focus:border-[#FFA0B4] focus:outline-none transition pl-10"
                  />
                  <Calendar className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1.5 font-mono">
                  Delivery Time Slot
                </label>
                <select
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                  className="w-full rounded-lg border border-brand-green-700 bg-brand-green-950 px-4 py-3 text-xs text-white focus:border-[#FFA0B4] focus:outline-none transition appearance-none"
                >
                  <option value="Morning (8:30 AM - 12:00 PM)">☀️ Morning (8:30 AM - 12:00 PM)</option>
                  <option value="Afternoon (1:30 PM - 5:00 PM)">⛅ Afternoon (1:30 PM - 5:00 PM)</option>
                  <option value="Evening (6:00 PM - 9:00 PM)">🌙 Evening (6:00 PM - 9:00 PM)</option>
                </select>
              </div>
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
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide font-mono">
                Billing & Payment Mode
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                
                {/* Option 1: Cash on Delivery */}
                <div 
                  onClick={() => setBillingMethod('cod')}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition ${
                    billingMethod === 'cod' 
                      ? 'border-[#FFA0B4] bg-[#FFA0B4]/5' 
                      : 'border-brand-green-800 bg-brand-green-950/20 hover:border-brand-green-750'
                  }`}
                >
                  <div className="mt-0.5 min-w-4 flex items-center justify-center">
                    {billingMethod === 'cod' ? (
                      <div className="h-4 w-4 rounded-full border-4 border-[#FFA0B4] bg-transparent" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-500 bg-transparent" />
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">Cash on Delivery (COD)</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Pay with physical currency to our logistics officer when your lychees arrive at your door.</p>
                  </div>
                </div>

                {/* Option 2: Mock Card Gateway */}
                <div 
                  onClick={() => setBillingMethod('card')}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition ${
                    billingMethod === 'card' 
                      ? 'border-[#FFA0B4] bg-[#FFA0B4]/5' 
                      : 'border-brand-green-800 bg-brand-green-950/20 hover:border-brand-green-750'
                  }`}
                >
                  <div className="mt-0.5 min-w-4 flex items-center justify-center">
                    {billingMethod === 'card' ? (
                      <div className="h-4 w-4 rounded-full border-4 border-[#FFA0B4] bg-transparent" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-500 bg-transparent" />
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">Mock Card Gateway</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Simulate secure card transaction right here. Enter mock numbers to test order invoice flow.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Conditional card input form fields */}
            <AnimatePresence>
              {billingMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-brand-green-800 bg-brand-green-950/80 p-4 space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Mock Credit Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4111 8888 9999 1111"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className={`w-full rounded-lg border bg-brand-green-900/40 px-4 py-2.5 text-xs text-white focus:outline-none pl-10 ${
                          formErrors.cardNumber ? 'border-red-500' : 'border-brand-green-700 focus:border-brand-lime'
                        }`}
                      />
                      <CreditCard className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Expiry MM/YY</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className={`w-full rounded-lg border bg-brand-green-900/40 px-4 py-2.5 text-xs text-white focus:outline-none ${
                          formErrors.cardExpiry ? 'border-red-500' : 'border-brand-green-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">CVV Security Code</label>
                      <input
                        type="password"
                        placeholder="***"
                        maxLength={4}
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        className={`w-full rounded-lg border bg-brand-green-900/40 px-4 py-2.5 text-xs text-white focus:outline-none ${
                          formErrors.cardCVV ? 'border-red-500' : 'border-brand-green-700'
                        }`}
                      />
                    </div>
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

            {/* Coupon Promo Field */}
            <form onSubmit={handleApplyPromo} className="border-t border-brand-green-900 pt-4">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-1.5">Apply Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., LICHIMART10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoDiscount > 0}
                  className="flex-1 rounded-lg border border-brand-green-700 bg-brand-green-900/40 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-brand-lime focus:outline-none uppercase"
                />
                {promoDiscount > 0 ? (
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="rounded-lg bg-red-600/10 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-3.5 text-xs font-semibold transition"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-lime hover:bg-brand-lime-hover text-brand-green-950 font-bold px-4 text-xs transition cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </div>
              {promoError && (
                <p className="mt-1 text-[11px] text-rose-400 font-semibold">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="mt-1 text-[11px] text-brand-lime font-bold">{promoSuccess}</p>
              )}
            </form>

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
              {promoDiscount > 0 && (
                <div className="flex items-center justify-between text-rose-400 font-semibold">
                  <span>Discount Subtraction:</span>
                  <span className="font-mono">-৳{promoDiscount.toFixed(2)}</span>
                </div>
              )}
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
              <p className="text-[10px] text-gray-400">Your information is protected by industry standard SSL. We do not store mock debit credentials.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
