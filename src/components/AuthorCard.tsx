import React from 'react';
import { Author } from '../types';
import { Award, BookOpen, Quote } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthorCardProps {
  author: Author;
  onViewAuthor: (author: Author) => void;
  key?: string;
}

export default function AuthorCard({ author, onViewAuthor }: AuthorCardProps) {
  return (
    <motion.div
      id={`author-card-${author.id}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="group relative flex flex-col justify-between immersive-panel hover:immersive-panel-active rounded-2xl p-6 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-md text-left"
    >
      {/* Carbon Texture overlay inside card */}
      <div className="absolute inset-0 carbon-overlay opacity-[0.12] pointer-events-none" />
      
      <div>
        {/* Quote watermark icon */}
        <Quote className="w-16 h-16 opacity-5 absolute right-4 top-4 rotate-185 text-indigo-400 pointer-events-none" />

        <div className="flex items-center gap-4.5 mb-5 select-none relative z-10">
          {/* Circular vector avatar with custom gradients and initial */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-305 p-0.5 shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-500">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-white/5 overflow-hidden">
              {author.image ? (
                <img 
                  src={author.image} 
                  alt={author.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 to-pink-300 font-mono">
                  {author.avatar}
                </span>
              )}
            </div>
            
            {/* Tiny live online active dot representation */}
            <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050505] animate-pulse" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#6366f1] font-bold uppercase">
              <Award className="w-3.5 h-3.5 shrink-0 text-amber-450" />
              <span>{author.achievement}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors duration-300 font-display">
              {author.name}
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {author.genre}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-sans tracking-wide leading-relaxed mt-2 line-clamp-3 relative z-10">
          "{author.shortBio}"
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
        <span className="text-[10px] font-mono text-slate-550 uppercase flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-slate-500" /> Key Book: {author.featuredBook}
        </span>
        <button
          onClick={() => onViewAuthor(author)}
          className="text-amber-300 hover:text-indigo-400 text-xs font-bold font-mono transition-colors tracking-wider select-none cursor-pointer flex items-center gap-1"
        >
          READ BIO &rarr;
        </button>
      </div>
    </motion.div>
  );
}
