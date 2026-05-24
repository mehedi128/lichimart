import React, { useState, useEffect } from 'react';
import { 
  X, Database, FileSpreadsheet, Chrome, Copy, Check, 
  RefreshCw, LogOut, ExternalLink, HelpCircle, Save, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getSheetsConfig, saveSheetsConfig, googleSignIn, logout, initAuth, 
  createNewSpreadsheet, getAppsScriptTemplate, SheetsConfig,
  formatOrderRow, appendRowToGoogleSheet, sendOrderToWebhook
} from '../sheetsService';
import { User } from 'firebase/auth';

interface SheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SheetsSyncModal({ isOpen, onClose }: SheetsSyncModalProps) {
  const [config, setConfig] = useState<SheetsConfig>({
    syncMode: 'none',
    spreadsheetId: '',
    webhookUrl: '',
    sheetName: 'Orders',
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Initialize auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );

    // Load saved sheets configuration
    setConfig(getSheetsConfig());

    return () => unsubscribe();
  }, []);

  const handleModeChange = (mode: 'none' | 'oauth' | 'webhook') => {
    setConfig(prev => ({ ...prev, syncMode: mode }));
    setMessage(null);
  };

  const handleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        setMessage({ text: 'গুগল অ্যাকাউন্ট সফলভাবে যুক্ত হয়েছে! 🎉', type: 'success' });
      }
    } catch (error: any) {
      setMessage({ text: 'লগইন ব্যর্থ হয়েছে: ' + (error.message || 'Unknown error'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logout();
      setCurrentUser(null);
      setAccessToken(null);
      setMessage({ text: 'সফলভাবে লগআউট করা হয়েছে।', type: 'success' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSheet = async () => {
    if (!currentUser || !accessToken) {
      setMessage({ text: 'অনুগ্রহ করে প্রথমে গুগল দিয়ে লগইন করুন।', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const sheetId = await createNewSpreadsheet('LichiMart Lychee Orders');
      setConfig(prev => ({ ...prev, spreadsheetId: sheetId }));
      setMessage({ text: 'আপনার গুগল ড্রাইভে "LichiMart Lychee Orders" শিটটি তৈরি করা হয়েছে! 📊', type: 'success' });
    } catch (error: any) {
      setMessage({ text: 'শিট তৈরি করতে ব্যর্থ: ' + (error.message || 'Permissions error'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTestSync = async () => {
    setLoading(true);
    setMessage(null);
    
    // Create an elegant simulated order
    const testOrder = {
      orderId: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        fullName: 'টেস্ট কাস্টমার (Test Customer)',
        phone: '01711111111',
        email: 'test@lichimart.com',
        address: 'দিনাজপুর লিচু বাগান রোড, সদর',
        instructions: 'গুগল শিট টেস্ট কানেকশন সফল হয়েছে!',
        deliveryDate: '2026-05-25',
        deliveryTimeSlot: 'বিকেল ৪:০০ - সন্ধ্যা ৬:০০টা',
        billingMethod: 'bkash' as const,
        transactionIdOrPhone: 'BKASH-TEST-999',
      },
      items: [
        {
          product: {
            id: 'test-1',
            name: 'টেস্ট দিনাজপুরী লিচু (মাদার গাছ)',
            price: 3.5,
            description: 'টেস্ট ডেসক্রিপশন',
            image: '',
            rating: 5,
            reviewsCount: 1,
            category: 'fresh' as const,
            weight: '100 Pcs',
            benefits: [],
          },
          quantity: 100,
        }
      ],
      subtotal: 350,
      shipping: 100,
      discount: 0,
      total: 450,
      placedAt: new Date().toLocaleString(),
    };

    try {
      if (config.syncMode === 'webhook') {
        if (!config.webhookUrl.trim()) {
          throw new Error('অনুগ্রহ করে আগে আপনার গুগল অ্যাপস স্ক্রিপ্ট ওয়েব অ্যাপ URL প্রদান করুন।');
        }
        if (!config.webhookUrl.includes('/exec')) {
          throw new Error('আপনি সরাসরি এডিটর বা ভুল URL ব্যবহার করছেন। URL-এর শেষে অবশ্যই "/exec" থাকতে হবে।');
        }
        await sendOrderToWebhook(config.webhookUrl, testOrder);
        setMessage({
          text: 'অভিনন্দন! টেস্ট অর্ডারটি আপনার গুগল অ্যাপস স্ক্রিপ্টে পাঠানো হয়েছে। আপনার গুগল শিটটি চেক করে দেখুন নতুন রো যুক্ত হয়েছে কিনা! 📊🎉',
          type: 'success'
        });
      } else if (config.syncMode === 'oauth') {
        if (!config.spreadsheetId.trim()) {
          throw new Error('অনুগ্রহ করে আগে গুগল স্প্রেডশিট আইডি প্রদান করুন বা এক ক্লিকে নতুন রো তৈরি করুন।');
        }
        const rowValues = formatOrderRow(testOrder);
        await appendRowToGoogleSheet(config.spreadsheetId, config.sheetName, rowValues);
        setMessage({
          text: 'অভিনন্দন! টেস্ট রো আপনার গুগল ড্রাইভ স্প্রেডশিটে সফলভাবে যুক্ত হয়েছে! স্প্রেডশিট চেক করুন। 📊🎉',
          type: 'success'
        });
      } else {
        throw new Error('দয়া করে প্রথমে সিঙ্ক মোড হিসেবে "ওয়েবহুক সিঙ্ক" বা "গুগল ড্রাইভ সিঙ্ক" নির্বাচন করুন।');
      }
    } catch (error: any) {
      console.error('Test Sync failed:', error);
      setMessage({
        text: 'টেস্ট কানেকশন ব্যর্থ হয়েছে: ' + (error.message || 'নেটওয়ার্ক এরর বা অ্যাপস স্ক্রিপ্ট পারমিশন সঠিক নয়।'),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = () => {
    if (config.syncMode === 'oauth' && !config.spreadsheetId.trim()) {
      setMessage({ text: 'অনুগ্রহ করে গুগল স্প্রেডশিট আইডি প্রদান করুন বা নতুন তৈরি করুন।', type: 'error' });
      return;
    }
    if (config.syncMode === 'webhook' && !config.webhookUrl.trim()) {
      setMessage({ text: 'অনুগ্রহ করে গুগল অ্যাপস স্ক্রিপ্ট ওয়েবহুক URL প্রদান করুন।', type: 'error' });
      return;
    }

    saveSheetsConfig(config);
    setMessage({ text: 'আপনার অর্ডার সিঙ্ক সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে! ✅', type: 'success' });
    
    // Auto clear message after 4s
    setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(getAppsScriptTemplate());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-green-950/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative z-10 w-full max-w-2xl bg-[#032014] border border-brand-green-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-left"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-green-900 bg-brand-green-950/80">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-brand-lime/10 text-brand-lime border border-brand-lime/10">
              <Database className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-black text-white tracking-wide">গুগল শিট রিচ-টাইম সিঙ্ক</h3>
              <p className="text-xs text-brand-lime/80 font-sans mt-0.5">অর্ডার আসার সাথে সাথে গুগল স্প্রেডশিটে জমা হবে</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-brand-green-905 bg-brand-green-950/40 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content Scroll Box */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* Success / Error notification */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border text-xs leading-relaxed font-sans flex items-start gap-2.5 ${
                message.type === 'success' 
                  ? 'bg-brand-lime/10 border-brand-lime/30 text-brand-lime' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              <div className="mt-0.5 font-bold">●</div>
              <p>{message.text}</p>
            </motion.div>
          )}

          {/* Sync mode buttons selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-widest font-sans flex items-center gap-1.5 matches">
              <Settings className="h-4 w-4 text-brand-lime" />
              অর্ডার সিঙ্ক মোড নির্বাচন করুন
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: None */}
              <button
                onClick={() => handleModeChange('none')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-24 ${
                  config.syncMode === 'none'
                    ? 'bg-brand-green-900/45 border-brand-lime/50 text-white shadow-md shadow-brand-lime/5'
                    : 'bg-brand-green-950/40 border-brand-green-900/60 text-gray-400 hover:bg-brand-green-950/70 hover:border-brand-green-800'
                }`}
              >
                <div className="text-xs font-bold">সিঙ্ক নিষ্ক্রিয়</div>
                <div className="text-[11px] text-gray-450 leading-normal">সম্পূর্ণ লোকাল ডাটাবেজে গ্রাহক তথ্য জমা থাকবে।</div>
              </button>

              {/* Option 2: Active Apps Script Webhook */}
              <button
                onClick={() => handleModeChange('webhook')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-24 ${
                  config.syncMode === 'webhook'
                    ? 'bg-brand-green-900/45 border-brand-lime/50 text-white shadow-md shadow-brand-lime/5'
                    : 'bg-brand-green-950/40 border-brand-green-900/60 text-gray-400 hover:bg-brand-green-950/70 hover:border-brand-green-800'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between w-full">
                  <span>ওয়েবহুক সিঙ্ক (চিহ্নিত)</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-brand-lime/10 text-brand-lime font-mono">সহজতম</span>
                </div>
                <div className="text-[11px] text-gray-450 leading-normal">গুগল অ্যাপস স্ক্রিপ্ট ব্যবহার করে সরাসরি ইনস্ট্যান্ট সিঙ্ক।</div>
              </button>

              {/* Option 3: Active OAuth Sheets API */}
              <button
                onClick={() => handleModeChange('oauth')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-24 ${
                  config.syncMode === 'oauth'
                    ? 'bg-brand-green-900/45 border-brand-lime/50 text-white shadow-md shadow-brand-lime/5'
                    : 'bg-brand-green-950/40 border-brand-green-900/60 text-gray-400 hover:bg-brand-green-950/70 hover:border-brand-green-800'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between w-full">
                  <span>গুগল ড্রাইভ সিঙ্ক</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#4285F4]/10 text-[#4285F4] font-mono">OAuth</span>
                </div>
                <div className="text-[11px] text-gray-450 leading-normal">আপোষহীন নিরাপত্তা। আপনার গুগল ড্রাইভে ফোল্ডার হিসেবে থাকবে।</div>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Conditional Content: Apps Script Webhook */}
            {config.syncMode === 'webhook' && (
              <motion.div
                key="webhook-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 pt-1"
              >
                {/* Deployment Web app link input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300">
                    গুগল অ্যাপস স্ক্রিপ্ট ওয়েব অ্যাপ URL প্রদান করুন:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={config.webhookUrl}
                      onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="flex-grow bg-brand-green-950 border border-brand-green-800 focus:border-brand-lime rounded-xl px-4 py-3 text-xs text-gray-100 placeholder-gray-500 outline-none transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleTestSync}
                      disabled={loading || !config.webhookUrl.trim()}
                      className="px-4 py-3 text-xs bg-brand-green-800 hover:bg-brand-green-700 text-brand-lime font-bold rounded-xl border border-brand-green-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 shrink-0"
                    >
                      {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                      <span>টেস্ট সিঙ্ক</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    আপনার গুগল শিটের অ্যাপস স্ক্রিপ্ট থেকে কপি করা <strong className="text-brand-lime">Web App URL</strong> (যা শেষে <strong className="text-brand-lime">/exec</strong> দিয়ে শেষ হয়) টি এখানে পেস্ট করে পাশে <strong className="text-brand-lime">"টেস্ট সিঙ্ক"</strong> বাটনে ক্লিক করে পরীক্ষা করুন।
                  </p>
                </div>

                {/* Instructions Accordion Button */}
                <div className="p-4 rounded-2xl bg-brand-green-950/50 border border-brand-green-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-brand-lime" />
                      <span className="text-xs font-bold text-white">কিভাবে কাজ করে? (অ্যাপস স্ক্রিপ্ট তৈরি করার গাইড)</span>
                    </div>
                    <button
                      onClick={() => setShowInstructions(!showInstructions)}
                      className="text-xs text-brand-lime hover:underline font-bold transition-all focus:outline-none"
                    >
                      {showInstructions ? 'লুকান' : 'নির্দেশনা দেখুন'}
                    </button>
                  </div>

                  {showInstructions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-[11px] leading-relaxed text-gray-350 space-y-3.5 border-t border-brand-green-900/60 pt-3"
                    >
                      <p>
                        ১. নিখরচায় আপনার গুগল ড্রাইভে একটি নতুন স্প্রেডশিট খুলুন।<br />
                        ২. উপরের মেনু থেকে <strong>Extensions &gt; Apps Script</strong> এ ক্লিক করুন।<br />
                        ৩. কোড এডিটরটির ভেতরের সবকিছু ডিলিট করে নিচের কোডটি হুবহু পেস্ট করুন:
                      </p>

                      {/* Code Block */}
                      <div className="relative rounded-xl overflow-hidden bg-brand-green-950/90 border border-brand-green-900 p-3">
                        <button
                          onClick={copyScriptToClipboard}
                          className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-[#032014] text-gray-400 hover:text-white transition flex items-center gap-1 text-[10px]"
                          title="Copy Code"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 text-brand-lime" />
                              <span className="text-brand-lime">কপি হয়েছে</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>কপি কোড</span>
                            </>
                          )}
                        </button>
                        <pre className="font-mono text-[9px] text-gray-350 overflow-x-auto max-h-40 p-1.5 text-left select-all whitespace-pre">
                          {getAppsScriptTemplate()}
                        </pre>
                      </div>

                      <p>
                        ৪. স্ক্রিপ্টটি সেভ করে ডানদিকের কোণায় <strong>Deploy &gt; New deployment</strong> এ ক্লিক করুন।<br />
                        ৫. গিয়ার আইকন থেকে <strong>Web app</strong> পছন্দ করুন।<br />
                        ৬. Execute as-এ <strong className="text-white">"Me"</strong> এবং Who has access-এ <strong className="text-white">"Anyone"</strong> সিলেক্ট করে <strong>Deploy</strong> এ ক্লিক করুন।<br />
                        ৭. গুগল পারমিশন চাইলে এক্সেস অ্যালাউ করুন এবং প্রাপ্ত <strong>Web app URL</strong> টি কপি করে উপরে পেস্ট করুন।
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Conditional Content: OAuth Link directly */}
            {config.syncMode === 'oauth' && (
              <motion.div
                key="oauth-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 pt-1"
              >
                {/* Authorization user state */}
                {!currentUser ? (
                  <div className="p-6 rounded-2xl bg-brand-green-950/60 border border-brand-green-900 text-center space-y-4">
                    <div className="max-w-md mx-auto space-y-2">
                      <Chrome className="h-8 w-8 text-red-500 mx-auto animate-pulse" />
                      <h4 className="text-sm font-bold text-white">গুগল ড্রাইভে অর্ডার সিঙ্ক চালু করুন</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        নিরাপদ গুগল ড্রাইভ এপিআই ব্যবহার করে আপনার অ্যাকাউন্টে সরাসরি তথ্য সংরক্ষণ করুন। প্রথমে আপনার গুগল ড্রাইভ অ্যাকাউন্টে লগইন করতে হবে।
                      </p>
                    </div>

                    <button
                      onClick={handleSignIn}
                      disabled={loading}
                      className="flex items-center justify-center gap-3 bg-white hover:bg-gray-105 active:scale-98 text-gray-800 font-sans font-semibold text-sm py-2.5 px-5 rounded-2xl transition-all shadow-lg shadow-black/20 mx-auto cursor-pointer"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* User Profile Card */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-green-950/60 border border-brand-green-900">
                      <div className="flex items-center gap-3">
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt={currentUser.displayName || ''}
                            className="h-10 w-10 rounded-full border border-brand-lime/25"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-brand-lime/20 flex items-center justify-center font-bold text-brand-lime">
                            {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-white leading-normal">{currentUser.displayName || 'Authorized User'}</h4>
                          <p className="text-[10px] text-gray-400 font-mono select-all">{currentUser.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-red-400 hover:text-red-300 font-bold hover:bg-red-500/10 rounded-xl transition"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>লগআউট</span>
                      </button>
                    </div>

                    {/* Google Sheet ID settings */}
                    <div className="grid grid-cols-1 gap-4 p-5 rounded-2xl bg-brand-green-950/30 border border-brand-green-900">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                          <span>গুগল ড্রাইভ স্প্রেডশিট আইডি (Spreadsheet ID):</span>
                          <button
                            onClick={handleCreateSheet}
                            disabled={loading}
                            className="text-[10px] text-brand-lime hover:underline font-bold flex items-center gap-1 disabled:opacity-50"
                          >
                            <FileSpreadsheet className="h-3 w-3" />
                            <span>১-ক্লিকে নতুন শিট তৈরি করুন</span>
                          </button>
                        </label>
                        <input
                          type="text"
                          value={config.spreadsheetId}
                          onChange={(e) => setConfig({ ...config, spreadsheetId: e.target.value })}
                          placeholder="উদাঃ 1BxiMVs0XRA5nFMdKv1S3_aQWw_B31Ydy3Z5sg_gCg"
                          className="w-full bg-brand-green-950 border border-brand-green-800 focus:border-brand-lime rounded-xl px-4 py-3 text-xs text-gray-100 placeholder-gray-500 outline-none transition-colors font-mono"
                        />
                        <p className="text-[10px] text-gray-440 leading-relaxed">
                          আপনি নিজের তৈরি স্প্রেডশিটের URL থেকে আইডিটি কপি করে দিতে পারেন অথবা উপরোক্ত লিঙ্কে ক্লিক করে সম্পূর্ণ অটোমেটিক ফরম্যাটসহ শিট বানিয়ে নিতে পারেন।
                        </p>
                      </div>

                      {/* Tab Name Optional */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-300">
                            ট্যাব নাম (Sheet Tab Name):
                          </label>
                          <input
                            type="text"
                            value={config.sheetName}
                            onChange={(e) => setConfig({ ...config, sheetName: e.target.value })}
                            placeholder="Orders"
                            className="w-full bg-brand-green-950 border border-brand-green-800 focus:border-brand-lime rounded-xl px-4 py-2.5 text-xs text-gray-200 outline-none transition-colors"
                          />
                        </div>

                        {/* Test Button for OAuth */}
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={handleTestSync}
                            disabled={loading || !config.spreadsheetId.trim()}
                            className="px-4 py-2.5 text-xs bg-brand-green-800 hover:bg-brand-green-700 text-brand-lime font-bold rounded-xl border border-brand-green-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
                          >
                            {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                            <span>স্প্রেডশিট টেস্ট সিঙ্ক</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-brand-green-900 bg-brand-green-950/80 flex items-center justify-between">
          <span className="text-[10px] text-gray-450 flex items-center gap-1 font-mono">
            <span>🛡️ সুরক্ষাকবচ ক্যাশিং সক্রিয়</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs hover:bg-brand-green-905 border border-brand-green-850/60 text-gray-300 transition duration-150 cursor-pointer"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={handleSaveConfig}
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-lime hover:bg-brand-lime-hover text-brand-green-950 font-bold text-xs transition duration-150 shadow-md shadow-brand-lime/10 select-none cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>সেটিংস্ সেভ করুন</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
