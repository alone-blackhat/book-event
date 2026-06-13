/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { categories, books, authors } from './data';
import { Category, Book, Author } from './types';
import HeroBook3D from './components/HeroBook3D';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';
import AuthorCard from './components/AuthorCard';
import AuthorDetailModal from './components/AuthorDetailModal';
import TimelineSection from './components/TimelineSection';
import RegistrationModal from './components/RegistrationModal';
import AudioSoundscapePlayer from './components/AudioSoundscapePlayer';
// @ts-ignore
import bgImage from './assets/images/bookverse_bg_1781331133377.jpg';
import { 
  BookOpen, 
  Globe, 
  CalendarDays, 
  ArrowRight, 
  Compass, 
  GraduationCap, 
  Tv, 
  Bookmark, 
  Feather, 
  Zap, 
  Users, 
  Flame, 
  Star,
  Layers,
  MapPin,
  Home,
  Clock,
  Sparkles,
  Search,
  BookMarked,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);
  const [activeBook, setActiveBook] = useState<Book | null>(books[0]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [bookFilter, setBookFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [timeStr, setTimeStr] = useState('10:24 PM');
  const [hologramFilter, setHologramFilter] = useState<'cyan-pulse' | 'titian-flame' | 'deep-aurora' | 'gold-vintage'>('cyan-pulse');

  // Interactive Live Clock specific to simulated status bar and mobile widgets
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // '0' is mapped to '12'
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll helper operating perfectly on full viewport sections
  const scrollToMobileId = (id: string, tabName?: string) => {
    if (tabName) {
      setActiveTab(tabName);
    }
    const target = document.getElementById(id);
    if (target) {
      const offset = 80; // offset for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Seamless author featured book connector helper
  const handleViewFeaturedBookByTitle = (bookTitle: string) => {
    const found = books.find(b => b.title.toLowerCase() === bookTitle.toLowerCase());
    if (found) {
      setSelectedAuthor(null);
      setSelectedBook(found);
    }
  };

  // Keep bottom navigation tab bar synchronized with scroll progress (Scroll Spy on window)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      
      const heroSec = document.getElementById('hero-display-viewport');
      const catSec = document.getElementById('categories-section');
      const bookSec = document.getElementById('featured-books-section');
      const authSec = document.getElementById('authors-section');
      const schedSec = document.getElementById('timeline-section');

      const threshold = 250;
      if (schedSec && scrollTop >= (schedSec.offsetTop - threshold)) {
        setActiveTab('schedule');
      } else if (authSec && scrollTop >= (authSec.offsetTop - threshold)) {
        setActiveTab('authors');
      } else if (bookSec && scrollTop >= (bookSec.offsetTop - threshold)) {
        setActiveTab('books');
      } else if (catSec && scrollTop >= (catSec.offsetTop - threshold)) {
        setActiveTab('categories');
      } else if (heroSec) {
        setActiveTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredBooks = bookFilter === 'all' 
    ? books 
    : books.filter(b => b.categoryId === bookFilter);

  // Maps Category Icons to Lucide vectors dynamically
  const getCategoryIcon = (iconName: string, active: boolean) => {
    const cls = `w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-300'}`;
    switch (iconName) {
      case 'Star': return <Star className={cls} />;
      case 'Compass': return <Compass className={cls} />;
      case 'GraduationCap': return <GraduationCap className={cls} />;
      case 'Tv': return <Tv className={cls} />;
      case 'Bookmark': return <Bookmark className={cls} />;
      case 'Feather': return <Feather className={cls} />;
      case 'Zap': return <Zap className={cls} />;
      case 'Cpu': return <Cpu className={cls} />;
      default: return <Star className={cls} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#040406] text-slate-100 font-sans relative overflow-x-hidden selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      
      {/* PROFESSIONAL CINEMATIC BOOK-THEMED BACKDROP FOR GENERAL PAGE DESKTOP */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* CSS background-image container with slow zoom atmospheric animation */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-[12px] sm:blur-[6px] scale-105 opacity-25 sm:opacity-35 animate-cinematic-zoom transition-transform will-change-transform"
          style={{ 
            backgroundImage: `url(${bgImage})`,
          }}
        />
        {/* Dark overlay with optimal elite contrast */}
        <div className="absolute inset-0 bg-slate-950/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040406] via-transparent to-[#040406] opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040406] via-transparent to-[#040406] opacity-95" />
 
        {/* Dynamic floating literary magic dust particles */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          {[
            { id: 1, left: '6%', delay: '0s', duration: '28s', size: 'w-1 h-1', color: 'bg-indigo-300/30' },
            { id: 2, left: '18%', delay: '4s', duration: '22s', size: 'w-1.5 h-1.5', color: 'bg-indigo-400/20' },
            { id: 3, left: '29%', delay: '8s', duration: '26s', size: 'w-1 h-1', color: 'bg-purple-300/30' },
            { id: 4, left: '40%', delay: '2s', duration: '31s', size: 'w-1.5 h-1.5', color: 'bg-amber-400/15' },
            { id: 5, left: '52%', delay: '11s', duration: '24s', size: 'w-1 h-1', color: 'bg-indigo-300/30' },
            { id: 6, left: '62%', delay: '5s', duration: '29s', size: 'w-1.5 h-1.5', color: 'bg-amber-400/20' },
            { id: 7, left: '72%', delay: '1s', duration: '21s', size: 'w-1 h-1', color: 'bg-indigo-400/25' },
            { id: 8, left: '84%', delay: '7s', duration: '33s', size: 'w-2 h-2', color: 'bg-purple-400/15' },
            { id: 9, left: '92%', delay: '3s', duration: '25s', size: 'w-1 h-1', color: 'bg-indigo-300/35' },
          ].map(particle => (
            <div
              key={particle.id}
              className={`absolute rounded-full animate-ambient-dust ${particle.size} ${particle.color} shadow-[0_0_8px_rgba(129,140,248,0.35)]`}
              style={{
                left: particle.left,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
                top: '-5vh',
              }}
            />
          ))}
        </div>
      </div>
 
      {/* BACKGROUND DECORATIVE GRID OVERLAYS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
 
      {/* PREMIUM TOP STICKY NAVIGATION BAR */}
      <header className="sticky top-0 w-full z-50 bg-[#040406]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between select-none">
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-500 p-[1px] shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center border border-white/5">
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <span className="text-sm tracking-[0.25em] font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400 uppercase">
            Bookverse
          </span>
        </div>
 
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider font-semibold text-slate-400">
          <button onClick={() => scrollToMobileId('hero-display-viewport', 'home')} className={`hover:text-amber-305 transition-colors uppercase ${activeTab === 'home' ? 'text-amber-400 font-bold' : ''}`}>Hub</button>
          <button onClick={() => scrollToMobileId('categories-section', 'categories')} className={`hover:text-amber-305 transition-colors uppercase ${activeTab === 'categories' ? 'text-amber-400 font-bold' : ''}`}>Spectrums</button>
          <button onClick={() => scrollToMobileId('featured-books-section', 'books')} className={`hover:text-amber-305 transition-colors uppercase ${activeTab === 'books' ? 'text-amber-400 font-bold' : ''}`}>Curations</button>
          <button onClick={() => scrollToMobileId('authors-section', 'authors')} className={`hover:text-amber-305 transition-colors uppercase ${activeTab === 'authors' ? 'text-amber-400 font-bold' : ''}`}>Guild</button>
          <button onClick={() => scrollToMobileId('timeline-section', 'schedule')} className={`hover:text-amber-305 transition-colors uppercase ${activeTab === 'schedule' ? 'text-amber-400 font-bold' : ''}`}>Deck</button>
        </nav>
 
        <div className="flex items-center gap-4">
          {/* Time widget */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-full px-3 py-1 text-[10px] font-mono text-slate-350 select-none">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">{timeStr}</span>
          </div>
 
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="py-1.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white text-[11px] font-bold font-mono tracking-wider rounded-lg shadow-md transition-transform active:scale-95"
          >
            GET PASS
          </button>
        </div>
      </header>
 
      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-6 relative md:pt-10">
        
        {/* Radial soft glow backdrop matching active selection */}
        <div 
          className="absolute top-24 left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full filter blur-[100px] opacity-20 pointer-events-none transition-all duration-1000 z-0"
          style={{ background: activeCategory.gradient }}
        />
 
        {/* 1. HERO SECTION (HOLOGRAPHIC 3D BOOK PREVIEW) */}
        <section id="hero-display-viewport" className="py-8 md:py-16 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
            
            {/* Left Col: Cinematic Typography details & instructions */}
            <div className="md:col-span-5 flex flex-col justify-center text-center md:text-left z-10">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-full px-3 py-1 w-fit select-none">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-[9.5px] font-mono tracking-widest text-[#a5b4fc] uppercase">
                    Active Spectrum: {activeCategory.name} Style
                  </span>
                </div>

                <div 
                  onClick={() => {
                    const cppCat = categories.find(c => c.id === 'cpp-programming');
                    if (cppCat) {
                      setActiveCategory(cppCat);
                      const b = books.find(bk => bk.categoryId === 'cpp-programming');
                      if (b) setActiveBook(b);
                    }
                  }}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-[#d32f2f]/20 via-[#4f46e5]/10 to-[#3e1b7a]/20 border border-red-500/20 hover:border-indigo-400/40 rounded-full px-3 py-1 w-fit select-none shadow-[0_0_15px_rgba(211,47,47,0.15)] transition-all cursor-pointer group active:scale-95"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9.5px] font-mono font-bold text-rose-200 tracking-wider group-hover:text-white transition-colors uppercase">
                    C++ Systems & Titian-Violet Track
                  </span>
                  <Sparkles className="w-2.5 h-2.5 text-indigo-300 group-hover:scale-110 transition-transform" />
                </div>
              </div>
 
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] font-display mb-4">
                Where Every Book <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-indigo-400 to-purple-400 drop-shadow-md">
                  Comes Alive
                </span>
              </h2>
              
              <p className="text-sm text-slate-350 leading-relaxed font-light mb-6 max-w-md mx-auto md:mx-0">
                Welcome to Bookverse. Rotate the holographic 3D model, swipe dynamic cover patterns, review synopses, and meet our guild of converged artists.
              </p>
 
              {/* Stacked functional full-width buttons */}
              <div className="flex flex-col gap-3 w-full max-w-[340px] mx-auto md:mx-0">
                <button
                  onClick={() => scrollToMobileId('categories-section', 'categories')}
                  className="w-full py-3.5 px-4 bg-zinc-900/80 hover:bg-zinc-800 text-slate-200 font-bold text-xs font-mono tracking-wide rounded-xl border border-white/5 active:scale-98 transition-all flex items-center justify-between shadow-md"
                >
                  <span>1. EXPLORE SPECTRUMS</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={() => scrollToMobileId('featured-books-section', 'books')}
                  className="w-full py-3.5 px-4 bg-zinc-900/80 hover:bg-zinc-800 text-slate-200 font-bold text-xs font-mono tracking-wide rounded-xl border border-white/5 active:scale-98 transition-all flex items-center justify-between shadow-md"
                >
                  <span>2. CURATION CATALOGS</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={() => scrollToMobileId('authors-section', 'authors')}
                  className="w-full py-3.5 px-4 bg-zinc-900/80 hover:bg-zinc-800 text-slate-200 font-bold text-xs font-mono tracking-wide rounded-xl border border-white/5 active:scale-98 transition-all flex items-all justify-between shadow-md"
                >
                  <span>3. GUILD OF AUTHORS</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
 
            {/* Right Col: Holographic Arena View */}
            <div className="md:col-span-7 flex flex-col items-center justify-center relative py-6 md:py-10 z-10 w-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent filter blur-3xl pointer-events-none" />
              <div className="scale-100 sm:scale-105 transition-transform duration-500">
                <HeroBook3D 
                  activeCategory={activeCategory} 
                  activeBook={activeBook} 
                  hologramFilter={hologramFilter} 
                />
              </div>

              {/* HIGH TECH INTERACTIVE CONSOLE PLATFORM & SOUND DECK */}
              <div className="w-full max-w-lg mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 bg-zinc-900/60 border border-white/5 backdrop-blur-xl p-5 rounded-2xl relative overflow-hidden shadow-2xl">
                
                {/* Console controller */}
                <div className="flex flex-col gap-2.5 text-left select-none">
                  <div className="flex items-center gap-1.5 border-b border-white/5 pb-2.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <div>
                      <h4 className="text-[11px] font-mono font-bold text-slate-200 tracking-wider uppercase">Projection Console</h4>
                      <p className="text-[8.5px] font-sans text-slate-400 leading-none">Holographic Particle Modulator</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1">
                    {[
                      { id: 'cyan-pulse', label: 'Cyber Neon', border: 'border-cyan-500/20 hover:border-cyan-555/40', text: 'text-cyan-300', dot: 'bg-cyan-400', desc: 'Liquid cyan pulse streams' },
                      { id: 'titian-flame', label: 'Titian Flame', border: 'border-red-500/20 hover:border-red-555/40', text: 'text-rose-300', dot: 'bg-red-500', desc: 'Warm structural compiler sparks' },
                      { id: 'deep-aurora', label: 'Cosmos Aurora', border: 'border-purple-500/20 hover:border-purple-555/40', text: 'text-purple-300', dot: 'bg-purple-400', desc: 'Ethereal solar magnetosphere' },
                      { id: 'gold-vintage', label: 'Luxury Gold', border: 'border-amber-500/20 hover:border-amber-555/40', text: 'text-amber-300', dot: 'bg-amber-400', desc: 'Champagne gold dust floaters' },
                    ].map((opt) => {
                      const active = hologramFilter === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setHologramFilter(opt.id as any)}
                          className={`w-full py-1.5 px-2 bg-black/40 hover:bg-black/80 rounded-xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                            active 
                              ? 'border-indigo-500/50 bg-[#09090d]/90 shadow-[0_4px_12px_rgba(99,102,241,0.15)]' 
                              : `border-white/5`
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${opt.dot} ${active ? 'animate-ping' : ''}`} />
                            <div>
                              <span className={`text-[10px] font-mono font-bold tracking-wider block ${active ? opt.text : 'text-slate-400'}`}>
                                {opt.label}
                              </span>
                              <span className="text-[7.5px] text-slate-500 leading-none block font-light">
                                {opt.desc}
                              </span>
                            </div>
                          </div>
                          
                          {active && (
                            <span className="text-[6px] font-mono font-bold text-[#6366f1] border border-[#6366f1]/20 bg-[#6366f1]/5 px-1.5 py-0.5 rounded tracking-widest uppercase">
                              MODULATING
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Synthesis soundscape player */}
                <div className="flex items-center justify-center">
                  <AudioSoundscapePlayer />
                </div>

              </div>

            </div>
 
          </div>
        </section>

          {/* 2. BOOK SPECTRUMS CAROUSEL SECTION (Adapted for widescreen grid) */}
          <section id="categories-section" className="py-12 md:py-16 select-none relative z-10 border-t border-white/5">
            <div className="text-left mb-8">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>EXHIBIT SPECTRUMS</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white font-display">
                Interactive Spectrums
              </h3>
              <p className="text-sm text-slate-400 mt-1.5 font-light leading-relaxed max-w-2xl">
                Tap a spectrum style card below. Each category triggers a physical theme shift on our central 3D holographic book model above.
              </p>
            </div>

            {/* RESPONSIVE LAYOUT CAROUSEL / GRID (Grid on widescreen, horizontal scroll on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
              {categories.map((cat) => {
                const isActive = activeCategory.id === cat.id;

                return (
                  <motion.div
                    key={cat.id}
                    id={`cat-card-${cat.id}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveCategory(cat);
                      setBookFilter(cat.id);
                      const matchingBook = books.find(b => b.categoryId === cat.id);
                      if (matchingBook) {
                        setActiveBook(matchingBook);
                      }
                      scrollToMobileId('hero-display-viewport', 'home');
                    }}
                    className={`relative w-full h-[260px] rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between p-5 overflow-hidden ${
                      isActive 
                        ? 'bg-zinc-900/90 border-indigo-500/50 shadow-[0_10px_30px_rgba(99,102,241,0.2)]' 
                        : 'bg-[#08080c]/60 border-white/5 hover:border-white/10 hover:scale-[1.01]'
                    }`}
                  >
                    {/* Immersive Background Category Image */}
                    {cat.image && (
                      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity rounded-2xl">
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover filter brightness-[0.4] contrast-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                      </div>
                    )}

                    {/* Active indicators inside card overlay */}
                    <div className="flex justify-between items-start z-10">
                      <div className={`p-2 rounded-xl backdrop-blur-md ${isActive ? 'bg-indigo-500/20 border border-indigo-550/30' : 'bg-white/5 border border-white/10'}`}>
                        {getCategoryIcon(cat.icon, isActive)}
                      </div>
                      
                      {isActive && (
                        <span className="text-[8px] font-mono font-bold text-amber-300 tracking-wider bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase">
                          Active Model
                        </span>
                      )}
                    </div>

                    {/* Meta values at the bottom */}
                    <div className="z-10 text-left">
                      <h4 className={`text-base font-extrabold tracking-tight mb-1 transition-colors ${isActive ? 'text-indigo-305' : 'text-slate-200'}`}>
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-slate-350 leading-relaxed font-sans line-clamp-3">
                        {cat.tagline}
                      </p>
                      
                      {/* Gradient tag line */}
                      <div 
                        className="h-[3px] w-10 rounded-full mt-3.5 transition-all duration-500"
                        style={{ background: cat.gradient }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* 3. FEATURED BOOKS SHOWCASES (RESPONSIVE GRID) */}
          <section id="featured-books-section" className="py-12 md:py-16 border-t border-white/5 relative z-10">
            <div className="flex flex-col gap-2.5 mb-6 text-left">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>BOOKVERSE CURATIONS</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white font-display">
                Featured Books Catalog
              </h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed max-w-2xl">
                Review available hardcover descriptions and reader grades. Tap any card below to read the synopsis & reserve.
              </p>
            </div>

            {/* Filter bar controls */}
            <div className="flex gap-1.5 pb-4 select-none overflow-x-auto scrollbar-none [scrollbar-width:none]">
              <button
                onClick={() => setBookFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase font-bold transition-all border shrink-0 cursor-pointer ${
                  bookFilter === 'all'
                    ? 'bg-indigo-550 text-white border-transparent bg-[#4f46e5] shadow-md'
                    : 'bg-[#08080c]/50 text-slate-400 border-white/5'
                }`}
              >
                All Spectrums
              </button>
              
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setBookFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase font-bold transition-all border shrink-0 cursor-pointer ${
                    bookFilter === cat.id
                      ? 'bg-indigo-550 text-white border-transparent bg-[#4f46e5] shadow-md'
                      : 'bg-[#08080c]/50 text-slate-400 border-white/5'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* RESPONSIVE CATALOG GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
              {filteredBooks.map((book) => (
                <div key={book.id} className="active:scale-[0.98] transition-transform">
                  <BookCard 
                    book={book} 
                    onViewDetails={(bk) => {
                      setSelectedBook(bk);
                      setActiveBook(bk);
                      const parentCat = categories.find(c => c.id === bk.categoryId);
                      if (parentCat) {
                        setActiveCategory(parentCat);
                      }
                    }} 
                  />
                </div>
              ))}
            </div>

            {/* Counter status badges */}
            <div className="mt-4 bg-[#0a0a0f] border border-white/5 p-2.5 rounded-xl text-[10px] font-mono text-slate-400 flex justify-between select-none">
              <span>FILTERED MATCHES:</span>
              <span className="text-indigo-400 font-bold">{filteredBooks.length} / {books.length} VOLUMES</span>
            </div>
          </section>

          {/* 4. MEET THE AUTHORS SECTION */}
          <section id="authors-section" className="py-12 md:py-16 border-t border-white/5 relative z-10">
            <div className="text-left mb-6">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>LITERARY CONVERGENTS</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white font-display">
                Showcase Authors Guild
              </h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed max-w-2xl">
                Connect directly with award winning novelists. Tap the profile block below to read full literary bios.
              </p>
            </div>

            {/* RESPONSIVE AUTHORS GRID (1 column on mobile, up to 3 on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authors.map((author) => (
                <div key={author.id} className="active:scale-[0.99] transition-transform">
                  <AuthorCard 
                    author={author} 
                    onViewAuthor={(auth) => setSelectedAuthor(auth)} 
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 5. EVENT TIMELINE GUIDELINE */}
          <section id="timeline-section" className="py-12 md:py-16 border-t border-white/5 relative z-10">
            <div className="text-left mb-8">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">
                <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                <span>ARENA DECK SCHEDULER</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white font-display">
                Schedule & VIP Sessions
              </h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed max-w-2xl">
                Pin keynote speaking segments, front-end visual workshops, and book signing soirée timings into your pass.
              </p>
            </div>

            <TimelineSection />
          </section>

          {/* 6. CALL TO ACTION CONTAINER */}
          <section id="cta-section" className="py-12 md:py-16 border-t border-white/5 relative z-10 text-center">
            <div className="bg-gradient-to-br from-[#0a0a0f] to-[#12121a] border border-white/10 p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl select-none max-w-4xl mx-auto">
              
              {/* background vector glowing overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full bg-indigo-500 filter blur-[60px]" />
              </div>

              <div className="flex justify-center items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest mb-2 z-10 relative">
                <Flame className="w-4 h-4 fill-indigo-400/20 animate-pulse" />
                <span>LIMITED PASS OPEN</span>
              </div>

              <h3 className="text-lg font-bold tracking-tight text-white leading-tight font-display z-10 relative">
                Join the ultimate <br />
                Bookverse Experience
              </h3>

              <p className="text-[10.5px] text-slate-400 mt-2 leading-relaxed font-sans font-light z-10 relative">
                Don't miss direct panels, 3D interactive reading experiments, and signings. Secure your simulated ticket pass.
              </p>

              {/* Full-width call to action buttons */}
              <div className="mt-5 flex flex-col gap-2 z-10 relative">
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs font-mono tracking-widest rounded-xl transition-all shadow-md active:scale-98"
                >
                  SECURE PASS NOW
                </button>
                <button
                  onClick={() => scrollToMobileId('timeline-section', 'schedule')}
                  className="w-full py-3 bg-zinc-950/80 border border-white/5 text-slate-350 font-bold text-xs font-mono tracking-wider rounded-xl hover:text-white transition-colors"
                >
                  VIEW TIMELINE DECK
                </button>
              </div>
            </div>

            {/* MINI EVENT CREDITING */}
            <div className="mt-8 text-center select-none text-[10px] text-slate-500 font-mono tracking-wide leading-relaxed">
              <span className="font-bold text-slate-400">© 2026 BOOKVERSE</span><br />
              Digital Experience Arena • Version 3.4
            </div>
          </section>
        </main>
 
        {/* FLOATING GLASS BOTTOM NAVIGATION TAB BAR */}
        {/* Floating neatly like a premium, floating high-end centered widget dock across desktop or mobile viewport */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 h-[60px] rounded-2xl bg-[#09090d]/80 border border-white/10 backdrop-blur-xl shadow-[0_20px_45px_rgba(0,0,0,0.85)] z-40 flex items-center justify-around px-2 select-none max-w-lg w-[calc(100%-2rem)]">
          <button 
            onClick={() => scrollToMobileId('hero-display-viewport', 'home')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all grow ${activeTab === 'home' ? 'text-indigo-405 scale-102 font-bold' : 'text-slate-400 hover:text-slate-205'}`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-[#6366f1] fill-[#6366f1]/20' : 'text-slate-400'}`} />
            <span className="text-[8px] font-mono mt-0.5 tracking-wider uppercase">HUB</span>
          </button>
          
          <button 
            onClick={() => scrollToMobileId('categories-section', 'categories')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all grow ${activeTab === 'categories' ? 'text-indigo-405 scale-102 font-bold' : 'text-slate-400 hover:text-slate-205'}`}
          >
            <Layers className={`w-5 h-5 ${activeTab === 'categories' ? 'text-[#6366f1] fill-[#6366f1]/10' : 'text-slate-400'}`} />
            <span className="text-[8px] font-mono mt-0.5 tracking-wider uppercase">SPECTRUMS</span>
          </button>
 
          <button 
            onClick={() => scrollToMobileId('featured-books-section', 'books')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all grow ${activeTab === 'books' ? 'text-indigo-405 scale-102 font-bold' : 'text-slate-400 hover:text-slate-205'}`}
          >
            <Search className={`w-5 h-5 ${activeTab === 'books' ? 'text-[#6366f1]' : 'text-slate-400'}`} />
            <span className="text-[8px] font-mono mt-0.5 tracking-wider uppercase">CURATIONS</span>
          </button>
 
          <button 
            onClick={() => scrollToMobileId('authors-section', 'authors')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all grow ${activeTab === 'authors' ? 'text-indigo-405 scale-102 font-bold' : 'text-slate-400 hover:text-slate-205'}`}
          >
            <Users className={`w-5 h-5 ${activeTab === 'authors' ? 'text-[#6366f1] fill-[#6366f1]/10' : 'text-slate-405'}`} />
            <span className="text-[8px] font-mono mt-0.5 tracking-wider uppercase">GUILD</span>
          </button>
          
          <button 
            onClick={() => scrollToMobileId('timeline-section', 'schedule')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all grow ${activeTab === 'schedule' ? 'text-indigo-450 scale-102 font-bold' : 'text-slate-400 hover:text-slate-205'}`}
          >
            <Clock className={`w-5 h-5 ${activeTab === 'schedule' ? 'text-[#6366f1]' : 'text-slate-400'}`} />
            <span className="text-[8px] font-mono mt-0.5 tracking-wider uppercase">DECK</span>
          </button>
        </div>

      {/* DETAILED DRAWERS & OVERLAPPING FULL-SCREEN SHEETS (MODALS) */}
      
      {/* Book details slide-up panel */}
      {selectedBook && (
        <BookDetailModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}

      {/* Author biography drawer */}
      {selectedAuthor && (
        <AuthorDetailModal 
          author={selectedAuthor} 
          onClose={() => setSelectedAuthor(null)} 
          onViewFeaturedBook={handleViewFeaturedBookByTitle}
        />
      )}

      {/* VIP pass gate pass registration */}
      <RegistrationModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />

    </div>
  );
}
