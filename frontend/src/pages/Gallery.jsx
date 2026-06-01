import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ZoomIn, X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import axios from 'axios';

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('cat') || 'all';

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(null); // Lightbox index

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'campus', label: 'Campus Infrastructure' },
    { id: 'event', label: 'Events & Functions' },
    { id: 'sports', label: 'Sports Tournaments' },
    { id: 'cultural', label: 'Cultural Fests' },
  ];

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/public/gallery?category=${category}`)
      .then((res) => {
        setImages(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback images if database is empty
        setImages([
          { id: 1, title: 'Gold Medalists Convocation Ceremony', category: 'event', image_path: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop' },
          { id: 2, title: 'Modern Biology Laboratory Setup', category: 'campus', image_path: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=600&auto=format&fit=crop' },
          { id: 3, title: 'Central College Library Reading Room', category: 'campus', image_path: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop' },
          { id: 4, title: 'Annual Cricket Tournament Match', category: 'sports', image_path: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=600&auto=format&fit=crop' },
          { id: 5, title: 'Umang Cultural Dance Competition', category: 'cultural', image_path: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop' },
          { id: 6, title: 'Science Exhibition Working Models', category: 'event', image_path: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop' },
        ]);
        setLoading(false);
      });
  }, [category]);

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Media Gallery
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          Campus Media Gallery
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Explore snapshots of academic functions, college infrastructures, sports achievements, and cultural programs.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 w-fit mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSearchParams({ cat: cat.id })}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              category === cat.id
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Masonry Image Grid */}
      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Loading gallery photos...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-xs text-slate-400">No photos found in this category.</div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {images.map((img, idx) => (
            <div 
              key={img.id} 
              className="break-inside-avoid bg-white border border-slate-200 rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 relative cursor-pointer"
              onClick={() => setActiveImageIdx(idx)}
            >
              <img 
                src={img.image_path.startsWith('/') ? `/api${img.image_path}` : img.image_path} 
                alt={img.title || 'Gallery item'} 
                className="w-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6 text-white">
                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <ZoomIn size={16} />
                  </div>
                </div>
                <div>
                  <span className="text-[9px] bg-yellow-500 text-slate-950 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    {img.category}
                  </span>
                  <h4 className="font-bold text-xs mt-2 drop-shadow">{img.title || 'Gautam Budha Mahila College'}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeImageIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close */}
            <button 
              onClick={() => setActiveImageIdx(null)} 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 w-10 h-10 rounded-full flex items-center justify-center border border-white/25 focus:outline-none"
            >
              <X size={20} />
            </button>

            {/* Navigation Left */}
            <button 
              onClick={handlePrevImage} 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 w-12 h-12 rounded-full flex items-center justify-center border border-white/10 focus:outline-none"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Main Visual */}
            <div className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4">
              <img 
                src={images[activeImageIdx].image_path.startsWith('/') ? `/api${images[activeImageIdx].image_path}` : images[activeImageIdx].image_path} 
                alt={images[activeImageIdx].title} 
                className="max-w-full max-h-[70vh] object-contain rounded border border-white/10 shadow-2xl"
              />
              <div className="text-center text-white space-y-1">
                <span className="text-[10px] bg-yellow-500 text-slate-950 font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {images[activeImageIdx].category}
                </span>
                <p className="text-xs font-bold mt-2">{images[activeImageIdx].title || 'Gautam Budha Mahila College Gaya'}</p>
              </div>
            </div>

            {/* Navigation Right */}
            <button 
              onClick={handleNextImage} 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 w-12 h-12 rounded-full flex items-center justify-center border border-white/10 focus:outline-none"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
