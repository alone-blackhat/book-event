import React, { useState } from 'react';
import { EventSession } from '../types';
import { sessions } from '../data';
import { Clock, MapPin, Check, Plus, CalendarDays, Footprints, Ticket, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

export default function TimelineSection() {
  const [bookmarkedSessions, setBookmarkedSessions] = useState<string[]>([]);
  const [justHappened, setJustHappened] = useState<string | null>(null);

  const toggleBookmark = (sessionId: string) => {
    if (bookmarkedSessions.includes(sessionId)) {
      setBookmarkedSessions(prev => prev.filter(id => id !== sessionId));
    } else {
      setBookmarkedSessions(prev => [...prev, sessionId]);
      setJustHappened(sessionId);
      setTimeout(() => setJustHappened(null), 2500);
    }
  };

  return (
    <div className="relative">
      {/* Event General Metadata Info plate */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 relative z-10"
      >
        <div className="immersive-panel p-5 rounded-2xl text-left flex items-start gap-4 relative overflow-hidden">
          <div className="absolute inset-0 carbon-overlay opacity-[0.1] pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
            <CalendarDays className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider">EVENT DATE</span>
            <span className="text-base font-bold text-slate-200 font-display">October 14-15, 2026</span>
            <span className="text-xs text-slate-400 block mt-0.5">Doors open 9:00 AM daily</span>
          </div>
        </div>

        <div className="immersive-panel p-5 rounded-2xl text-left flex items-start gap-4 relative overflow-hidden">
          <div className="absolute inset-0 carbon-overlay opacity-[0.1] pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
            <MapPin className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider">VENUE HALL</span>
            <span className="text-base font-bold text-slate-200 font-display">The Atrium Continuum</span>
            <span className="text-xs text-slate-400 block mt-0.5">Vessel 4, New Horizon Gathers</span>
          </div>
        </div>

        <div className="immersive-panel p-5 rounded-2xl text-left flex items-start gap-4 relative overflow-hidden">
          <div className="absolute inset-0 carbon-overlay opacity-[0.1] pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shrink-0">
            <Ticket className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider">ADMISSION</span>
            <span className="text-base font-bold text-slate-200 font-display">Free / RSVP Pass</span>
            <span className="text-xs text-slate-400 block mt-0.5">Requires confirmation signature</span>
          </div>
        </div>
      </motion.div>

      {/* Floating bookmark dynamic notification */}
      {bookmarkedSessions.length > 0 && (
        <div className="max-w-xl mx-auto mb-8 bg-zinc-950/80 border border-indigo-500/20 rounded-xl p-3 flex items-center justify-between text-xs backdrop-blur-md relative z-10 shadow-[0_4px_20px_rgba(99,102,241,0.1)]">
          <span className="text-slate-300 font-sans flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-[#6366f1] animate-pulse shrink-0" />
            Active customized itinerary: <strong className="text-indigo-450 font-mono">{bookmarkedSessions.length} session{bookmarkedSessions.length > 1 ? 's' : ''}</strong> pinned.
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">SAVED LOCALLY</span>
        </div>
      )}

      {/* Timeline graphical layout */}
      <div className="max-w-3xl mx-auto relative pl-6 sm:pl-10 text-left">
        {/* Glow vertical thread line */}
        <div className="absolute top-2 bottom-6 left-6 sm:left-10 w-[2px] bg-gradient-to-b from-indigo-500/50 via-purple-900/30 to-transparent pointer-events-none" />

        {sessions.map((session, index) => {
          const isBookmarked = bookmarkedSessions.includes(session.id);
          const isJustSelected = justHappened === session.id;

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative mb-12 sm:mb-16 last:mb-2 group"
            >
              {/* Timeline bubble joint node */}
              <div className={`absolute -left-[31px] sm:-left-[45px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${
                isBookmarked 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-400 shadow-lg shadow-indigo-500/30 text-white'
                  : 'bg-black border-zinc-800 text-slate-500 group-hover:border-[#6366f1]'
              }`}>
                {isBookmarked ? (
                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-[#6366f1] transition-colors" />
                )}
              </div>

              {/* Box frame */}
              <div className="immersive-panel hover:immersive-panel-active rounded-2xl p-6 transition-all duration-300 shadow-xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 carbon-overlay opacity-[0.1] pointer-events-none" />
                
                {isBookmarked && (
                  <div className="absolute top-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-600 left-0" />
                )}

                {/* Main Session Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 select-none relative z-10">
                  {/* Time + Location Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-mono text-[#6366f1] font-bold tracking-wide bg-[#6366f1]/10 px-2.5 py-1 border border-[#6366f1]/20 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-indigo-450" />
                      {session.time}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-zinc-900 border border-white/5 px-2.5 py-1 rounded-md">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {session.location}
                    </span>
                  </div>

                  {/* Bookmark Button (Fully Functional) */}
                  <button
                    onClick={() => toggleBookmark(session.id)}
                    className={`text-[10px] uppercase font-mono tracking-widest px-3 py-1.5 rounded-lg font-bold select-none cursor-pointer transition-all ${
                      isBookmarked
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-zinc-900 text-slate-300 hover:bg-[#6366f1] hover:text-white border border-white/10 hover:border-transparent'
                    }`}
                  >
                    {isBookmarked ? (
                      <span className="flex items-center gap-1 font-semibold">
                        <Check className="w-3 h-3 stroke-[3]" /> Added to Itinerary Pass
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold">
                        <Plus className="w-3 h-3 text-amber-400" /> PIN TO PASS
                      </span>
                    )}
                  </button>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors duration-300 tracking-tight leading-snug font-display relative z-10">
                  {session.title}
                </h3>
                <p className="text-xs text-slate-400 font-sans tracking-wide leading-relaxed mt-2 relative z-10">
                  {session.desc}
                </p>

                {/* Speaker profile snippet */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs relative z-10">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">SEGMENT SPEAKER</span>
                    <span className="text-xs font-bold text-slate-205">{session.speaker}</span>
                    <span className="text-[10px] text-slate-400 italic block mt-0.5">{session.role}</span>
                  </div>

                  {isJustSelected && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] text-[#6366f1] font-mono font-bold animate-pulse font-semibold"
                    >
                      ★ ITINERARY UPDATED ★
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
