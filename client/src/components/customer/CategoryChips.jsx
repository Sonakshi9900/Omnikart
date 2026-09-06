import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shirt, Home, Headphones, Footprints, Flame } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Products', icon: Sparkles },
  { id: 'Electronics', label: 'Electronics', icon: Zap },
  { id: 'Fashion', label: 'Fashion & Wearables', icon: Shirt },
  { id: 'Home & Living', label: 'Home & Living', icon: Home },
  { id: 'Accessories', label: 'Tech Accessories', icon: Headphones },
  { id: 'Footwear', label: 'Sneakers & Shoes', icon: Footprints },
  { id: 'Beauty', label: 'Beauty & Skincare', icon: Flame },
];

export default function CategoryChips({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 pt-1 touch-pan-x">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const IconComponent = cat.icon;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`snap-start relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-2xl transition-all duration-200 shrink-0 border min-h-[40px] ${
              isSelected
                ? 'text-white bg-indigo-600/90 border-indigo-500/60 shadow-glow'
                : 'text-slate-300 bg-slate-900/60 hover:bg-slate-800/80 hover:text-white border-slate-800/80'
            }`}
          >
            <IconComponent
              className={`w-3.5 h-3.5 transition-colors ${
                isSelected ? 'text-white' : 'text-indigo-400'
              }`}
            />
            <span>{cat.label}</span>
            {isSelected && (
              <motion.div
                layoutId="activeCategoryGlow"
                className="absolute inset-0 rounded-2xl bg-indigo-500/20 border border-indigo-400/40"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
