import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ZoomIn, X, ChevronLeft, ChevronRight, ImageIcon, Download } from 'lucide-react';
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
    { id: 'faculty', label: 'Faculty Members' },
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

  const handleDownload = async (e, imageUrl, title) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const filename = title 
        ? `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg` 
        : imageUrl.split('/').pop().split('?')[0] || 'photo.jpg';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download image, opening in new tab instead', error);
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">


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
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
          {images.map((img, idx) => (
            <div 
              key={img.id} 
              className="bg-white border border-slate-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 relative cursor-pointer aspect-square"
              onClick={() => setActiveImageIdx(idx)}
            >
              <img 
                src={img.image_path.startsWith('/') ? `/api${img.image_path}` : img.image_path} 
                alt={img.title || 'Gallery item'} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Floating Download Button in Corner */}
              <button
                onClick={(e) => handleDownload(e, img.image_path.startsWith('/') ? `/api${img.image_path}` : img.image_path, img.title)}
                className="absolute top-1.5 right-1.5 z-20 w-7 h-7 rounded-md bg-slate-900/80 backdrop-blur-md flex items-center justify-center border border-slate-700/50 text-white hover:bg-slate-800 hover:scale-105 transition-all shadow-md"
                title="Download Photo"
              >
                <Download size={12} />
              </button>

              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 sm:p-3 text-white z-10">
                <div />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 scale-75 group-hover:scale-100 transition-all duration-300">
                    <ZoomIn size={16} />
                  </div>
                </div>
                <div>
                  <span className="text-[7px] sm:text-[8px] bg-yellow-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {img.category}
                  </span>
                  <h4 className="font-bold text-[8px] sm:text-[10px] mt-1 drop-shadow line-clamp-2">{img.title || 'Gautam Budha Mahila College'}</h4>
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
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 w-10 h-10 rounded-full flex items-center justify-center border border-white/25 focus:outline-none z-10"
            >
              <X size={20} />
            </button>

            {/* Download */}
            <button 
              onClick={(e) => handleDownload(e, images[activeImageIdx].image_path.startsWith('/') ? `/api${images[activeImageIdx].image_path}` : images[activeImageIdx].image_path, images[activeImageIdx].title)}
              className="absolute top-6 right-20 text-white/70 hover:text-white bg-white/10 w-10 h-10 rounded-full flex items-center justify-center border border-white/25 focus:outline-none z-10"
              title="Download Photo"
            >
              <Download size={20} />
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
