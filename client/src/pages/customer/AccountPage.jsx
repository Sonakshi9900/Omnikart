import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logoutUser, setCredentials } from '../../store/authSlice';
import { addToCart } from '../../store/cartSlice';
import MainLayout from '../../components/layout/MainLayout';
import { formatINR } from '../../utils/currency';
import {
  Package,
  Heart,
  MapPin,
  Settings,
  CreditCard,
  LogOut,
  Store,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  User,
  Mail,
  Phone,
  Lock,
  Bell,
} from 'lucide-react';
import { toast } from 'sonner';

// Seeded Orders Data for Multi-Vendor Demonstration
const MOCK_ORDERS = [
  {
    _id: 'ord_101',
    orderNumber: 'OMNI-884920',
    createdAt: '2026-09-02T14:32:00Z',
    status: 'shipped',
    trackingNumber: 'TRK-IN-9823412',
    carrier: 'Express Logistics India',
    estimatedDelivery: 'Sep 08, 2026',
    totalAmount: 37998,
    paymentMethod: 'UPI / Stripe',
    items: [
      {
        product: {
          _id: 'prod_1',
          title: 'Aura Sound Pro Wireless Noise-Canceling Headphones',
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
          price: 24999,
        },
        quantity: 1,
        vendor: { storeName: 'Aura Sound Labs' },
      },
      {
        product: {
          _id: 'prod_2',
          title: 'Kinetix Velocity Ultra-Light Carbon-Plate Running Sneakers',
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
          price: 12999,
        },
        quantity: 1,
        vendor: { storeName: 'Kinetix Footwear' },
      },
    ],
  },
  {
    _id: 'ord_102',
    orderNumber: 'OMNI-771024',
    createdAt: '2026-08-20T09:15:00Z',
    status: 'delivered',
    deliveredAt: 'Aug 23, 2026',
    totalAmount: 6999,
    paymentMethod: 'Credit Card',
    items: [
      {
        product: {
          _id: 'prod_3',
          title: 'Zenith Ambient LED Smart Desk Lamp',
          images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'],
          price: 6999,
        },
        quantity: 1,
        vendor: { storeName: 'Zenith Smart Home' },
      },
    ],
  },
];

const MOCK_SAVED_ADDRESSES = [
  {
    id: 'addr_1',
    name: 'Sonakshi Kumari',
    type: 'Home',
    isDefault: true,
    phone: '+91 98765 43210',
    street: 'Flat 402, Royal Residency, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201309',
  },
  {
    id: 'addr_2',
    name: 'Sonakshi (Tech Park)',
    type: 'Work',
    isDefault: false,
    phone: '+91 98765 43210',
    street: 'Building 12B, Cyber City, Phase III',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
  },
];

const MOCK_WISHLIST = [
  {
    _id: 'prod_5',
    title: 'Minimalist Water-Resistant Full-Grain Leather Urban Backpack',
    price: 8999,
    compareAtPrice: 10999,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
    vendor: { storeName: 'Vance Leatherworks', trustScore: 96 },
    stock: 18,
  },
  {
    _id: 'prod_6',
    title: 'Botanical Organic Cold-Pressed Hydrating Face Serum Set',
    price: 3499,
    compareAtPrice: 4299,
    images: ['https://images.unsplash.com/photo-1608248597261-833258657b45?w=600'],
    vendor: { storeName: 'Lumiere Skincare', trustScore: 99 },
    stock: 3,
  },
];

const MOCK_PAYMENT_METHODS = [
  { id: 'card_1', brand: 'Visa', last4: '4242', expiry: '08/28', isDefault: true },
  { id: 'card_2', brand: 'Mastercard', last4: '8888', expiry: '11/27', isDefault: false },
];

export default function AccountPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useSelector(selectCurrentUser);
  const activeTab = searchParams.get('tab') || 'orders';

  // Auth Guard: Redirect non-logged-in users
  useEffect(() => {
    if (!user) {
      toast.info('Please sign in to access your account dashboard');
      navigate('/auth');
    }
  }, [user, navigate]);

  // Tab State
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);
  const [addresses, setAddresses] = useState(MOCK_SAVED_ADDRESSES);
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);

  // Address Modal State
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: '',
    type: 'Home',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Settings State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
  });
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    vendorBroadcasts: true,
  });

  if (!user) return null;

  const setActiveTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.info('Logged out successfully');
    navigate('/');
  };

  // Address Handlers
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.street || !newAddr.pincode) {
      toast.error('Please fill in required address fields');
      return;
    }
    const created = { ...newAddr, id: `addr_${Date.now()}`, isDefault: addresses.length === 0 };
    setAddresses([...addresses, created]);
    setShowAddrModal(false);
    setNewAddr({ name: '', type: 'Home', phone: '', street: '', city: '', state: '', pincode: '' });
    toast.success('Shipping address added successfully');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success('Address removed');
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success('Default address updated');
  };

  // Wishlist Handlers
  const handleRemoveWishlist = (id) => {
    setWishlist(wishlist.filter((w) => w._id !== id));
    toast.success('Item removed from wishlist');
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    setWishlist(wishlist.filter((w) => w._id !== product._id));
    toast.success(`Moved "${product.title}" to cart`);
  };

  // Reorder Handler
  const handleReorder = (item) => {
    dispatch(addToCart({ product: item.product, quantity: item.quantity }));
    toast.success(`Added "${item.product.title}" to cart`);
  };

  // Profile Update Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(setCredentials({ ...user, name: profileForm.name, email: profileForm.email }));
    toast.success('Profile settings updated');
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold">
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/30 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            Order Placed
          </span>
        );
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 my-2 md:my-4">
        {/* Page Header */}
        <div className="glass-panel p-6 rounded-2xl md:rounded-3xl border border-teal-500/20 bg-slate-900/60 bg-grid-pattern flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user.name}
              className="w-14 h-14 rounded-2xl border-2 border-teal-400 object-cover shadow-glow shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded bg-teal-950 border border-teal-500/30 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {user.role === 'vendor' && (
              <Link
                to="/vendor/dashboard"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-glow transition-all"
              >
                <Store className="w-4 h-4" />
                <span>Vendor Dashboard</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content: Sidebar Tabs & Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-1 space-y-2">
            <div className="glass-panel p-2 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-teal-600 text-white shadow-glow'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/60 border border-slate-700">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'wishlist'
                    ? 'bg-teal-600 text-white shadow-glow'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/60 border border-slate-700">
                  {wishlist.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-teal-600 text-white shadow-glow'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>Saved Addresses</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/60 border border-slate-700">
                  {addresses.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-teal-600 text-white shadow-glow'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'payments'
                    ? 'bg-teal-600 text-white shadow-glow'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment Methods</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </aside>

          {/* Main Tab Panel Display */}
          <main className="lg:col-span-3">
            {/* TAB 1: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold font-heading text-white">Order History & Tracking</h2>
                  <span className="text-xs text-slate-400">{orders.length} order(s) found</span>
                </div>

                {orders.length === 0 ? (
                  <div className="glass-panel p-10 rounded-2xl text-center space-y-3 border border-slate-800">
                    <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold text-slate-200">No orders placed yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Explore multi-vendor listings from verified independent creators and enjoy 100% buyer protection.
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-glow transition-all"
                    >
                      <span>Browse Products</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="glass-panel rounded-2xl border border-slate-800/90 bg-slate-900/50 p-4 sm:p-5 space-y-4"
                      >
                        {/* Order Top Summary Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">Order ID</span>
                            <span className="font-mono font-bold text-white text-sm">{order.orderNumber}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">Placed On</span>
                            <span className="text-slate-300 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">Total</span>
                            <span className="font-bold text-teal-400 text-sm">{formatINR(order.totalAmount)}</span>
                          </div>

                          <div>{renderStatusBadge(order.status)}</div>
                        </div>

                        {/* Order Items Breakdown per Vendor */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.title}
                                  className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                                />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-slate-100 truncate">{item.product.title}</h4>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                    <span className="text-teal-400 font-semibold flex items-center gap-1">
                                      <Store className="w-3 h-3" />
                                      {item.vendor?.storeName || 'Verified Vendor'}
                                    </span>
                                    <span>•</span>
                                    <span>Qty: {item.quantity}</span>
                                    <span>•</span>
                                    <span className="font-bold text-slate-200">{formatINR(item.product.price)}</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleReorder(item)}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-200 hover:text-white text-xs font-semibold transition-all shrink-0 min-h-[36px]"
                              >
                                Reorder
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Real-time Logistics Tracking Bar if Shipped */}
                        {order.status === 'shipped' && order.trackingNumber && (
                          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-cyan-300 font-medium">
                              <Truck className="w-4 h-4 text-cyan-400" />
                              <span>Carrier: {order.carrier} ({order.trackingNumber})</span>
                            </div>
                            <span className="text-slate-400">Est. Delivery: <strong className="text-white">{order.estimatedDelivery}</strong></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold font-heading text-white">My Saved Wishlist</h2>
                  <span className="text-xs text-slate-400">{wishlist.length} item(s) saved</span>
                </div>

                {wishlist.length === 0 ? (
                  <div className="glass-panel p-10 rounded-2xl text-center space-y-3 border border-slate-800">
                    <Heart className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold text-slate-200">Your wishlist is empty</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Save products while browsing to compare prices and buy when ready.
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-glow transition-all"
                    >
                      <span>Explore Catalog</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item._id}
                        className="glass-panel p-4 rounded-2xl border border-slate-800/90 bg-slate-900/50 flex flex-col justify-between space-y-3"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0 space-y-1">
                            <span className="text-[10px] font-bold text-teal-400 flex items-center gap-1">
                              <Store className="w-3 h-3" />
                              {item.vendor?.storeName}
                            </span>
                            <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                              {item.title}
                            </h4>
                            <div className="flex items-baseline gap-2 pt-0.5">
                              <span className="text-sm font-extrabold text-white">{formatINR(item.price)}</span>
                              {item.compareAtPrice && (
                                <span className="text-[11px] text-slate-500 line-through">
                                  {formatINR(item.compareAtPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-1.5 min-h-[38px]"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Move to Cart</span>
                          </button>
                          <button
                            onClick={() => handleRemoveWishlist(item._id)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold font-heading text-white">Saved Shipping Addresses</h2>
                  <button
                    onClick={() => setShowAddrModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-glow transition-all min-h-[38px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`glass-panel p-4 rounded-2xl border ${
                        addr.isDefault ? 'border-teal-500/50 bg-teal-950/10' : 'border-slate-800 bg-slate-900/50'
                      } flex flex-col justify-between space-y-3 relative`}
                    >
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{addr.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 rounded bg-teal-950 border border-teal-500/40 text-teal-300 font-bold text-[10px]">
                                DEFAULT
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-300 leading-relaxed">{addr.street}</p>
                        <p className="text-slate-400">
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p className="text-slate-400">Phone: {addr.phone}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-teal-400 hover:underline font-semibold text-[11px]"
                          >
                            Set as Default
                          </button>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Address Modal */}
                {showAddrModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <form
                      onSubmit={handleAddAddress}
                      className="glass-panel bg-slate-900 border border-teal-500/30 p-6 rounded-3xl w-full max-w-md space-y-4 shadow-2xl"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <h3 className="font-bold text-white font-heading text-base">Add Shipping Address</h3>
                        <button onClick={() => setShowAddrModal(false)} type="button">
                          <XCircle className="w-5 h-5 text-slate-400 hover:text-white" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Recipient's Name"
                            value={newAddr.name}
                            onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 mb-1">Address Type</label>
                            <select
                              value={newAddr.type}
                              onChange={(e) => setNewAddr({ ...newAddr, type: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                            >
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">Phone</label>
                            <input
                              type="text"
                              required
                              placeholder="+91 98765..."
                              value={newAddr.phone}
                              onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Street Address</label>
                          <textarea
                            required
                            rows="2"
                            placeholder="House / Flat No, Building, Street"
                            value={newAddr.street}
                            onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-slate-400 mb-1">City</label>
                            <input
                              type="text"
                              required
                              placeholder="City"
                              value={newAddr.city}
                              onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">State</label>
                            <input
                              type="text"
                              required
                              placeholder="State"
                              value={newAddr.state}
                              onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">PIN Code</label>
                            <input
                              type="text"
                              required
                              placeholder="201301"
                              value={newAddr.pincode}
                              onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setShowAddrModal(false)}
                          className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-glow"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ACCOUNT SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold font-heading text-white">Account & Profile Settings</h2>

                {/* Profile Edit Form */}
                <form
                  onSubmit={handleSaveProfile}
                  className="glass-panel p-5 rounded-2xl border border-slate-800/90 bg-slate-900/50 space-y-4"
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-glow transition-all"
                  >
                    Save Changes
                  </button>
                </form>

                {/* Notification Preferences */}
                <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 bg-slate-900/50 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notification Preferences
                  </h3>

                  <div className="space-y-3 text-xs">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                      <div>
                        <span className="font-bold text-white block">Order & Delivery Alerts</span>
                        <span className="text-slate-400 text-[11px]">Real-time SMS & Email tracking notifications</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.orderUpdates}
                        onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
                        className="w-4 h-4 accent-teal-500 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                      <div>
                        <span className="font-bold text-white block">Promotional Deals & Flash Sales</span>
                        <span className="text-slate-400 text-[11px]">Exclusive seller discounts and seasonal drops</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.promotions}
                        onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                        className="w-4 h-4 accent-teal-500 rounded"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PAYMENT METHODS */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold font-heading text-white">Saved Payment Methods</h2>
                  <button
                    onClick={() => toast.info('Stripe card management integration active')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-glow transition-all min-h-[38px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Card</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      className="glass-panel p-4 rounded-2xl border border-slate-800/90 bg-slate-900/50 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-teal-400">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{pm.brand} ending in {pm.last4}</span>
                            {pm.isDefault && (
                              <span className="px-2 py-0.5 rounded bg-teal-950 border border-teal-500/40 text-teal-300 font-bold text-[9px]">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">Expires {pm.expiry}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setPaymentMethods(paymentMethods.filter((p) => p.id !== pm.id));
                          toast.success('Payment method removed');
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remove Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
