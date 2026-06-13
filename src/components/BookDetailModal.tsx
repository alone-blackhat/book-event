import React, { useState } from 'react';
import { Book } from '../types';
import { X, Star, FileText, Calendar, BookOpen, Warehouse, Check, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
}

export default function BookDetailModal({ book, onClose }: BookDetailModalProps) {
  const [isReserved, setIsReserved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!book) return null;

  const handleReserve = () => {
    setIsReserved(true);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        id={`book-detail-modal-${book.id}`}
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#08080a]/95 border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row text-left backdrop-blur-xl"
        >
          {/* Carbon texture layer inside modal */}
          <div className="absolute inset-0 carbon-overlay opacity-[0.08] pointer-events-none" />

          {/* Left Side: Stunning 3D-feeling Cover representation */}
          <div 
            className="md:w-2/5 p-8 flex flex-col justify-between items-center relative overflow-hidden flex-shrink-0"
            style={{ 
              backgroundImage: book.coverImage ? `url(${book.coverImage})` : book.coverGradient,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-black/65 pointer-events-none" />
            {book.coverImage && <div className="absolute inset-0 bg-gradient-to-b from-[#08080a]/30 via-[#08080a]/70 to-[#08080a] backdrop-blur-md pointer-events-none" />}
            <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/80 pointer-events-none" />
            <div className="absolute inset-3 border border-white/15 rounded-2xl pointer-events-none" />
            
            {/* Back button only on mobile to close */}
            <div className="w-full flex justify-between z-10 mb-8 md:mb-0">
              <span className="text-[10px] tracking-[0.25em] text-white/80 font-mono uppercase bg-black/30 px-2 py-1 rounded border border-white/5">
                Bookverse Catalog
              </span>
            </div>

            {/* Simulated thick 3D volumetric card inside modal */}
            <div className="my-auto py-12 z-10 flex flex-col items-center">
              <div 
                className="w-40 h-56 rounded-r-lg rounded-l-sm bg-gradient-to-r shadow-2xl relative border-y border-r border-white/10 overflow-hidden"
                style={{ 
                  backgroundImage: book.coverImage ? `url(${book.coverImage})` : book.coverGradient,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '15px 20px 45px rgba(0,0,0,0.8)'
                }}
              >
                {/* Book Spine reflection */}
                <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-black/45 shadow-[inset_-1px_0_3px_rgba(0,0,0,0.2)]" />
                <div className="absolute inset-2 border border-white/10 rounded-r-md pointer-events-none" />
                
                {/* Text overlay blur block for image readability */}
                {book.coverImage && <div className="absolute inset-x-0 bottom-0 top-[40%] bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />}

                {/* Text overlay on the spine/cover */}
                <div className="absolute inset-x-4 bottom-4 text-left flex flex-col gap-1 z-10">
                  <span className="text-[8px] font-mono tracking-widest text-indigo-300 font-bold uppercase bg-white/10 px-1.5 py-0.5 rounded w-fit">
                    {book.genre}
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-2 font-display drop-shadow-md">
                    {book.title}
                  </h4>
                  <span className="text-[9px] text-white/80 font-sans italic drop-shadow-sm">
                    {book.author}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer stamp */}
            <div className="text-[10px] font-mono text-white/50 tracking-widest uppercase z-10 font-bold">
              © {book.year} {book.published}
            </div>
          </div>

          {/* Right Side: Detailed descriptive text, reviews, and event reserving logic */}
          <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-between bg-transparent overflow-y-auto max-h-[85vh] md:max-h-none relative z-10">
            {/* Close button top right */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-white/10 text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              {/* Genre badge row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md font-bold">
                  {book.genre}
                </span>
                <span className="text-[10px] font-mono px-2 py-1 bg-zinc-900 border border-white/5 text-slate-400 rounded-md">
                  ID: {book.id.toUpperCase()}
                </span>
              </div>

              {/* Title & Author */}
              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight leading-tight font-display">
                {book.title}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Written by <span className="text-indigo-400 font-semibold">{book.author}</span>
              </p>

              {/* Core stats grid */}
              <div className="grid grid-cols-3 gap-3 my-6">
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-center">
                  <div className="flex justify-center text-amber-400 mb-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span className="block text-[10px] uppercase font-mono text-slate-500 tracking-wider">Rating</span>
                  <span className="text-sm font-bold text-slate-200">{book.rating} / 5.0</span>
                </div>
                
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-center">
                  <div className="flex justify-center text-indigo-400 mb-1">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="block text-[10px] uppercase font-mono text-slate-500 tracking-wider">Pages</span>
                  <span className="text-sm font-bold text-slate-200">{book.pages} Pages</span>
                </div>

                <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-center">
                  <div className="flex justify-center text-purple-400 mb-1">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="block text-[10px] uppercase font-mono text-slate-500 tracking-wider">Year</span>
                  <span className="text-sm font-bold text-slate-200">{book.year}</span>
                </div>
              </div>

              {/* In-depth synopsis */}
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4 text-indigo-450 animate-pulse" />
                <span>Editorial Synopsis</span>
              </div>
              <p className="text-xs text-slate-305 leading-relaxed font-sans mb-5 font-light">
                {book.longDesc}
              </p>

              {/* Additional facts section */}
              <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-mono">Publisher</span>
                  <span className="text-slate-300 font-semibold flex items-center gap-1">
                    <Warehouse className="w-3.5 h-3.5 text-slate-500" /> {book.published}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-505 font-mono">Book Format</span>
                  <span className="text-slate-300 font-semibold">Special Edition Hardcover (Bookverse Promo)</span>
                </div>
              </div>
            </div>

            {/* Booking action panel */}
            <div className="mt-8 pt-5 border-t border-white/5 flex flex-col gap-4 relative">
              {/* Dynamic Toast Feedback inside modal */}
              {showToast && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-2.5 rounded-lg text-xs flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive confirmation: Reservation saved to local storage itinerary successfully!</span>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[10px] font-mono text-slate-505 block uppercase font-bold tracking-wider">
                    EXHIBIT AVAILABILITY
                  </span>
                  <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 mt-0.5 animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-indigo-400 shrink-0" />
                    Limited exclusive signings on site
                  </span>
                </div>

                <button
                  onClick={handleReserve}
                  disabled={isReserved}
                  className={`py-3.5 px-6 rounded-xl font-bold text-xs select-none cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                    isReserved 
                      ? 'bg-zinc-800 text-slate-500 border border-white/5 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:brightness-110 shadow-indigo-500/10'
                  }`}
                >
                  {isReserved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      Reserved in Itinerary
                    </>
                  ) : (
                    "Reserve Physical Signed Copy"
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
