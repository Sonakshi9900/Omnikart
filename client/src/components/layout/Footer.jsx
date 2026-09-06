import React, { useState } from 'react';
import { Truck, Layers, Headphones, ShieldCheck, Mail, ArrowRight, Sparkles, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { toast } from 'sonner';
import logoImg from '../../assets/omnikart-logo.png';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed to omniKart Newsletter!', {
      description: 'You will receive exclusive vendor deals and launch updates.',
    });
    setEmail('');
  };

  return (
    <footer className="bg-[#070C1E] text-slate-300 border-t border-slate-800/80 pt-12 pb-8 px-4 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* a) Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-3xl glass-panel bg-card/60 border border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-brand-blue/20 text-brand-blue-light border border-brand-blue/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">Free Express Shipping</h4>
              <p className="text-[11px] text-slate-400">All India delivery on orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-brand-orange/20 text-brand-orange-light border border-brand-orange/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">Multi-Source Aggregation</h4>
              <p className="text-[11px] text-slate-400">Verified independent sellers & brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-brand-blue/20 text-brand-blue-light border border-brand-blue/30">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">24/7 Priority Support</h4>
              <p className="text-[11px] text-slate-400">Dedicated phone & WhatsApp support</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-brand-orange/20 text-brand-orange-light border border-brand-orange/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">Instant UPI Refunds</h4>
              <p className="text-[11px] text-slate-400">100% money back protection guarantee</p>
            </div>
          </div>
        </div>

        {/* b) Newsletter Signup Box & Brand Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="OmniKart Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's premier multi-source e-commerce platform. Connecting independent sellers, artisans, and tech vendors under one unified marketplace.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter your email for deals..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-blue"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-light text-white font-semibold text-xs shadow-glow transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* c) 4-Column Structured Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <div className="space-y-3">
              <h5 className="font-bold uppercase tracking-wider text-[11px] text-brand-blue-light">
                Categories
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Electronics & Audio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fashion & Apparel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Home & Living</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tech Accessories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Footwear</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold uppercase tracking-wider text-[11px] text-brand-blue-light">
                Customer Support
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold uppercase tracking-wider text-[11px] text-brand-blue-light">
                Vendor Hub
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/auth" className="hover:text-white transition-colors">Sell on omniKart</a></li>
                <li><a href="/vendor/dashboard" className="hover:text-white transition-colors">Vendor Portal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Stripe Connect Setup</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Commission Rates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seller Policies</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold uppercase tracking-wider text-[11px] text-brand-blue-light">
                Company
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About omniKart</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press & Media</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* d) Bottom Bar with Indian Payment Badges & Social Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <p>© 2026 omniKart Technologies Private Limited. All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-brand-blue-light transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-brand-blue-light transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-brand-blue-light transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="hover:text-brand-blue-light transition-colors"><Instagram className="w-4 h-4" /></a>
          </div>

          {/* Indian Payment Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">Accepted Payments:</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-brand-blue-light">UPI</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-brand-orange-light">RuPay</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-brand-blue-light">Paytm</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-brand-orange-light">PhonePe</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-brand-blue-light">NetBanking</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">VISA</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
