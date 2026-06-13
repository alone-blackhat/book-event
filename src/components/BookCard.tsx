import React from 'react';
import { Book } from '../types';
import { Star, FileText, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
  key?: string;
}

export default function BookCard({ book, onViewDetails }: BookCardProps) {
  return (
    <motion.div
      id={`book-card-${book.id}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col justify-between immersive-panel hover:immersive-panel-active rounded-2xl p-5 transition-all duration-300 shadow-2xl overflow-hidden backdrop-blur-md"
    >
      {/* Carbon Texture overlay inside card */}
      <div className="absolute inset-0 carbon-overlay opacity-[0.15] pointer-events-none" />
      
      {/* Decorative gradient corners */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{ background: book.coverGradient }}
      />
      
      <div>
        {/* Book cover projection */}
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-5 bg-[#0a0a0c] shadow-xl group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 transform group-hover:-translate-y-2 flex items-center justify-center border border-white/5">
          {/* Cover image or gradient & texture */}
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-105"
            />
          ) : (
            <div 
              className="absolute inset-0 transition-transform duration-700 scale-100 group-hover:scale-105"
              style={{ backgroundImage: book.coverGradient }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-2 border border-white/10 rounded-lg pointer-events-none" />
          
          {/* Subtle pages edge effect */}
          <div className="absolute top-0 bottom-0 right-0 w-1.5 bg-slate-200/20 backdrop-blur-sm shadow-[inset_-1px_0_3px_rgba(0,0,0,0.3)]" />

          {/* Spine indicator line */}
          <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-black/45 shadow-md" />

          {/* Cover details */}
          <div className="absolute inset-x-5 bottom-5 z-10 text-left flex flex-col gap-1">
            <span className="text-[8px] font-mono tracking-widest text-[#6366f1] font-bold uppercase drop-shadow-md bg-white/10 px-1.5 py-0.5 rounded w-fit">
              {book.genre}
            </span>
            <h4 className="text-base font-bold text-white tracking-tight leading-tight line-clamp-2 drop-shadow-lg font-display">
              {book.title}
            </h4>
            <span className="text-[10px] text-white/80 font-sans italic drop-shadow-md">
              by {book.author}
            </span>
          </div>

          {/* Floating rating badglet */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1 z-10">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-bold text-slate-200 font-mono">{book.rating}</span>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2 text-slate-500 text-[10px] font-mono">
            <span className="bg-[#111115] text-slate-300 px-2 py-0.5 rounded border border-white/5">
              {book.year}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" /> {book.pages} pages
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-150 group-hover:text-indigo-400 transition-colors duration-300 font-display truncate">
            {book.title}
          </h3>
          <p className="text-xs text-slate-400 font-sans tracking-wide leading-relaxed line-clamp-3 mt-1.5">
            {book.shortDesc}
          </p>
        </div>
      </div>

      {/* Button footer */}
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-400 italic">
          by {book.author}
        </span>
        <button
          onClick={() => onViewDetails(book)}
          className="bg-zinc-900 text-slate-200 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-300 text-xs font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1.5 border border-white/10 hover:border-transparent select-none cursor-pointer"
        >
          View Book
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
