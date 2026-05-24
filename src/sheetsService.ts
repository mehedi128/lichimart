import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { Order } from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request only spreadsheet scope to manage lychee orders
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Access token is only returned during signInWithPopup, so we might need a re-auth or use the cached one
        const localToken = localStorage.getItem('google_sheets_accessToken');
        const expiry = localStorage.getItem('google_sheets_tokenExpiry');
        if (localToken && expiry && Date.now() < parseInt(expiry, 10)) {
          cachedAccessToken = localToken;
          if (onAuthSuccess) onAuthSuccess(user, localToken);
        } else {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
        }
      }
    } else {
      cachedAccessToken = null;
      localStorage.removeItem('google_sheets_accessToken');
      localStorage.removeItem('google_sheets_tokenExpiry');
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign-In using Google Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Auth');
    }

    cachedAccessToken = credential.accessToken;
    // Save to local storage with a 50-minute expiry (tokens expire in 1 hour)
    localStorage.setItem('google_sheets_accessToken', cachedAccessToken);
    localStorage.setItem('google_sheets_tokenExpiry', (Date.now() + 50 * 60 * 1000).toString());
    
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  localStorage.removeItem('google_sheets_accessToken');
  localStorage.removeItem('google_sheets_tokenExpiry');
};

export const getAccessToken = (): string | null => {
  const localToken = localStorage.getItem('google_sheets_accessToken');
  const expiry = localStorage.getItem('google_sheets_tokenExpiry');
  if (localToken && expiry && Date.now() < parseInt(expiry, 10)) {
    return localToken;
  }
  return null;
};

// Spreadsheet Configuration Keys
export interface SheetsConfig {
  syncMode: 'none' | 'oauth' | 'webhook';
  spreadsheetId: string;
  webhookUrl: string;
  sheetName: string;
}

export const getSheetsConfig = (): SheetsConfig => {
  const stored = localStorage.getItem('lichimart_sheets_config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // Return defaults
    }
  }
  return {
    syncMode: 'none',
    spreadsheetId: '',
    webhookUrl: '',
    sheetName: 'Orders',
  };
};

export const saveSheetsConfig = (config: SheetsConfig) => {
  localStorage.setItem('lichimart_sheets_config', JSON.stringify(config));
};

// Standard order details to flat columns
export const formatOrderRow = (order: Order): any[] => {
  const itemsText = order.items
    .map((item) => `${item.product.name} (${item.quantity} পিস)`)
    .join(', ');
  
  const paymentMethodLabel = 
    order.customer.billingMethod === 'bkash' ? 'bKash (বিকাশ)' :
    order.customer.billingMethod === 'nagad' ? 'Nagad (নগদ)' :
    order.customer.billingMethod === 'rocket' ? 'Rocket (রকেট)' :
    'Bank Transfer';

  return [
    order.orderId,
    order.placedAt,
    order.customer.fullName,
    order.customer.phone,
    order.customer.address,
    paymentMethodLabel,
    order.customer.transactionIdOrPhone || 'N/A',
    itemsText,
    `৳${order.subtotal.toFixed(0)}`,
    order.customer.appliedPromo ? `${order.customer.appliedPromo} (-৳${order.discount.toFixed(0)})` : 'N/A',
    `৳${order.total.toFixed(0)}`,
    order.customer.deliveryDate + ' ' + order.customer.deliveryTimeSlot,
    order.customer.instructions || 'N/A'
  ];
};

export const SHEETS_HEADER = [
  'অর্ডার আইডি',
  'অর্ডারের সময়',
  'ক্রেতার নাম',
  'মোবাইল নম্বর',
  'ডেলিভারি ঠিকানা',
  'পেমেন্ট মেথড',
  'টানজেকশন আইডি / ফোন',
  'পণ্য তালিকা',
  'সাবটোটাল',
  'কুপন ও ডিসকাউন্ট',
  'সর্বমোট বিল',
  'ডেলিভারি সময়',
  'বিশেষ নির্দেশনা'
];

// Appending an order directly utilizing Google Sheets API
export const appendRowToGoogleSheet = async (
  spreadsheetId: string,
  sheetName: string,
  rowValues: any[]
): Promise<boolean> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Google authorization expired or unavailable. Please re-authenticate.');
  }

  // Ensure sheet headers exist or append
  try {
    const range = `${sheetName}!A1:M1`;
    // We check if the sheet is empty or has a header
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    const checkData = await checkRes.json();
    if (!checkData.values || checkData.values.length === 0) {
      // Sheet is empty, write header first
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            range: range,
            majorDimension: 'ROWS',
            values: [SHEETS_HEADER],
          }),
        }
      );
    }
  } catch (error) {
    console.error('Failed to create sheet headers, attempting direct append anyway', error);
  }

  // Append new order row
  const appendRange = `${sheetName}!A2`;
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${appendRange}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        range: appendRange,
        majorDimension: 'ROWS',
        values: [rowValues],
      }),
    }
  );

  if (!appendRes.ok) {
    const errText = await appendRes.text();
    console.error('Google Sheets append error response:', errText);
    throw new Error('Failed to append row to Google Sheet');
  }

  return true;
};

// Creating a brand new spreadsheet
export const createNewSpreadsheet = async (title: string): Promise<string> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Google authorization expired. Please log in.');
  }

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
      sheets: [
        {
          properties: {
            title: 'Orders',
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Google Sheets create error:', errText);
    throw new Error('Failed to create Google Sheet');
  }

  const data = await res.json();
  return data.spreadsheetId;
};

// Sending data to customized Apps Script Webhook
export const sendOrderToWebhook = async (webhookUrl: string, order: Order): Promise<boolean> => {
  const rowValues = formatOrderRow(order);
  const payload = {
    orderId: order.orderId,
    placedAt: order.placedAt,
    customerName: order.customer.fullName,
    customerPhone: order.customer.phone,
    customerAddress: order.customer.address,
    paymentMethod: order.customer.billingMethod,
    transactionId: order.customer.transactionIdOrPhone || '',
    items: rowValues[7], // flat text list of items
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    deliverySchedule: rowValues[11],
    instructions: order.customer.instructions || '',
    rowValues, // complete raw row values for simple append
  };

  try {
    // Note: We use no-cors if the merchant has standard Apps Script endpoints which might violate standard cors but still accept post
    const response = await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors', // standard Apps Script redirects trigger CORS errors, no-cors allows payload delivery safely!
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error('Webhook payload delivery failed', error);
    throw error;
  }
};

// Customized Google Apps Script template for merchants
export const getAppsScriptTemplate = () => {
  return `/**
 * Google Apps Script for LichiMart Real-time Order Sync
 * 1. Open Google Sheets (create a new empty sheet).
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete existing template and paste the following script.
 * 4. Click "Deploy" (top-right) > "New deployment".
 * 5. Choose "Web app" as the type.
 * 6. Set "Execute as" to "Me", and "Who has access" to "Anyone" (essential for public chekout access).
 * 7. Click Deploy, copy the "Web app URL" and paste it into the LichiMart Admin Dashboard!
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Set headers if the sheet is brand new and empty
  if (sheet.getLastRow() === 0) {
    var headers = [
      "অর্ডার আইডি",
      "অর্ডারের সময়",
      "ক্রেতার নাম",
      "মোবাইল নম্বর",
      "ডেলিভারি ঠিকানা",
      "পেমেন্ট মেথড",
      "টানজেকশন আইডি / ফোন",
      "পণ্য তালিকা",
      "সাবটোটাল",
      "কুপন ও ডিসকাউন্ট",
      "সর্বমোট বিল",
      "ডেলিভারি সময়",
      "বিশেষ নির্দেশনা"
    ];
    sheet.appendRow(headers);
    
    // Format headers to look elegant
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#032014");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
  }

  try {
    var data = JSON.parse(e.postData.contents);
    var row = data.rowValues;
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Order appended successfully!" }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}`;
};
