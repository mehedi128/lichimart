export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: 'fresh' | 'processed' | 'gifts' | 'honey';
  rating: number; // e.g. 4.8
  reviewsCount: number;
  weight: string; // e.g. "1 kg", "500g", "100 Pcs"
  badge?: '15% OFF' | 'BEST SELLER' | 'NEW' | 'LIMIT' | 'POPULAR' | 'OUT OF STOCK';
  image: string; // Image placeholder path or public url
  images?: string[]; // Multiple images for carousel slider
  detailsDescription?: string; // Rich detailed text for quick view
  benefits?: string[]; // Lychee specific health perks
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  avatar: string;
  rating: number;
}

export interface CheckoutDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  instructions?: string;
  deliveryDate: string;
  deliveryTimeSlot: string; // e.g. "Morning (9 AM - 12 PM)" or "Afternoon"
  billingMethod: 'cod' | 'card'; // cod = Cash on Delivery, card = Mock Card details
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  appliedPromo?: string;
}

export interface Order {
  orderId: string;
  customer: CheckoutDetails;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  placedAt: string;
}
