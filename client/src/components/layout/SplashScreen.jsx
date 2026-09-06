import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import logoImg from '../../assets/omnikart-logo.jpg';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('omnikart_splash_shown');
    if (hasSeenSplash) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('omnikart_splash_shown', 'true');
      if (onComplete) onComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050811] text-white"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center space-y-5"
          >
            {/* Branding Logo Glow */}
            <div className="relative">
              <div className="p-1 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-glow animate-pulse">
                <img
                  src={logoImg}
                  alt="OmniKart Logo"
                  className="h-20 w-auto object-contain rounded-xl bg-[#050811] p-1"
                />
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col items-center text-center">
              <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase mt-1">
                Multi-Source E-Commerce Platform
              </p>
            </div>

            {/* Smooth Progress Bar */}
            <div className="w-36 h-1 bg-slate-800/80 rounded-full overflow-hidden mt-3">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
