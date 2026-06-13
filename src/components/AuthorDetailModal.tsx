import React from 'react';
import { Author } from '../types';
import { X, Award, MapPin, Feather, BookmarkCheck, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthorDetailModalProps {
  author: Author | null;
  onClose: () => void;
  onViewFeaturedBook: (bookTitle: string) => void;
}

export default function AuthorDetailModal({ author, onClose, onViewFeaturedBook }: AuthorDetailModalProps) {
  if (!author) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        id={`author-detail-modal-${author.id}`}
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#08080a]/95 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl z-10 p-8 md:p-12 text-left backdrop-blur-xl"
        >
          {/* Carbon texture layer inside modal */}
          <div className="absolute inset-0 carbon-overlay opacity-[0.08] pointer-events-none" />

          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-white/10 text-slate-400 hover:text-white hover:bg-zinc-850 transition-colors cursor-pointer relative z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Info Layout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-white/5 relative z-10">
            {/* Elegant avatar projection */}
            <div className="relative w-18 h-18 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-400 p-0.5 shadow-xl flex-shrink-0 select-none">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-white/5 overflow-hidden">
                {author.image ? (
                  <img 
                    src={author.image} 
                    alt={author.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 to-pink-300 font-mono">
                    {author.avatar}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center">
                <Feather className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#6366f1] uppercase tracking-widest bg-[#6366f1]/10 border border-[#6366f1]/20 px-2.5 py-0.5 rounded-md w-fit">
                <Award className="w-3.5 h-3.5 text-amber-450" />
                <span>{author.achievement}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight leading-tight mt-1.5 font-display">
                {author.name}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5 font-mono">
                Primary Medium: <span className="text-slate-200 font-semibold">{author.genre}</span>
              </p>
            </div>
          </div>

          {/* Content Biography */}
          <div className="my-6 relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-405 uppercase tracking-widest mb-3 select-none">
              <Newspaper className="w-4 h-4 text-indigo-400" />
              <span>Full Literary Biography</span>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed font-sans mb-6 font-light">
              {author.longBio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl text-left">
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider mb-1">
                  OFFICIAL EVENT PRESENCE
                </span>
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-bounce" />
                  Nebula Panel & Garden Signing
                </span>
              </div>

              <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl text-left flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider mb-1">
                    FEATURED EXHIBIT
                  </span>
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <BookmarkCheck className="w-3.5 h-3.5 text-[#6366f1] shrink-0" />
                    {author.featuredBook}
                  </span>
                </div>
                {/* Button to click and view details of their main book */}
                <button
                  onClick={() => onViewFeaturedBook(author.featuredBook)}
                  className="text-amber-300 hover:text-indigo-400 text-[11px] font-bold font-mono uppercase mt-2 text-left hover:underline cursor-pointer flex items-center gap-1 select-none"
                >
                  View Book Details &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="mt-8 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <p className="text-xs text-slate-500 font-mono">
              Get direct alerts regarding virtual writing workshops led by {author.name.split(' ')[0]}.
            </p>
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-slate-200 font-bold text-xs py-3 px-6 rounded-xl hover:text-white border border-white/10 select-none cursor-pointer transition-colors"
            >
              Close Profile
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
