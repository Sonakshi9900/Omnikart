import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Image as ImageIcon, Sparkles } from 'lucide-react';
import API from '../../services/api';
import { toast } from 'sonner';

export default function ProductFormModal({ isOpen, onClose, onProductCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    price: '',
    compareAtPrice: '',
    stock: '',
    description: '',
  });

  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
  ]);

  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    toast.success('Simulated drag-and-drop image upload');
    setImages((prev) => [
      ...prev,
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/products', {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        stock: Number(formData.stock),
        images,
      });

      toast.success('Product created successfully!');
      if (onProductCreated) onProductCreated(res.data.product);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Plus className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">List New Product</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400">Product Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Wireless Noise-Canceling Headphones"
                value={formData.title}
                onChange={handleChange}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category & Price Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-400">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Footwear">Footwear</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  placeholder="199.99"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400">Stock Count</label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  placeholder="25"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Drag & Drop Image Uploader */}
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">
                Drag-and-Drop Product Media
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-950/30'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-bounce" />
                <p className="text-xs text-slate-300 font-medium">
                  Drag and drop image assets here, or <span className="text-indigo-400 underline cursor-pointer">browse</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>

              {/* Thumbnails preview */}
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-800">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400">Description</label>
              <textarea
                name="description"
                required
                rows={3}
                placeholder="Detail the technical specifications, warranty, and features..."
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Publishing...' : 'Publish Product to Storefront'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
