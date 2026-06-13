import React, { useState, useEffect, useRef } from 'react';
import { Category, Book } from '../types';
import { Star, Compass, GraduationCap, Tv, Bookmark, Feather, Zap } from 'lucide-react';

interface HeroBook3DProps {
  activeCategory: Category;
  activeBook?: Book | null;
  hologramFilter?: 'cyan-pulse' | 'titian-flame' | 'deep-aurora' | 'gold-vintage';
}

export default function HeroBook3D({ activeCategory, activeBook, hologramFilter = 'cyan-pulse' }: HeroBook3DProps) {
  const [rotation, setRotation] = useState({ x: -10, y: 25 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; size: string }[]>([]);
  const dragStart = useRef({ x: 0, y: 0 });
  const bookRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const idleAngle = useRef(25);

  // Dynamic particle config depending on the interactive display projection mode
  const getParticleColor = () => {
    switch (hologramFilter) {
      case 'titian-flame':
        return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
      case 'deep-aurora':
        return 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]';
      case 'gold-vintage':
        return 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
      case 'cyan-pulse':
      default:
        return 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]';
    }
  };

  // Generate magical dust whenever hovered or whenever hologramFilter shifts
  useEffect(() => {
    if (isHovered || hologramFilter) {
      const pCount = isHovered ? 18 : 8; // keep some drifting when idle too
      const newParticles = Array.from({ length: pCount }).map((_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${40 + Math.random() * 45}%`,
        delay: `${Math.random() * 2.5}s`,
        size: Math.random() > 0.45 ? 'w-1.5 h-1.5' : 'w-1 h-1',
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered, hologramFilter]);

  // Auto idle rotation
  useEffect(() => {
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      if (!isHovered && !isDragging) {
        const delta = (time - lastTime) / 1000; // seconds
        idleAngle.current = (idleAngle.current + delta * 15) % 360; // 15 degrees per second
        
        // We float X slowly too
        const floatX = -12 + Math.sin(time / 800) * 5;
        setRotation({
          x: floatX,
          y: idleAngle.current
        });
      }
      lastTime = time;
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isHovered, isDragging]);

  // Handle MouseMove absolute holographic tilts when hovered (but not dragging)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    
    const rect = bookRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Get mouse position relative to the element's center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Max rotation response
    const maxRotX = 25; // degrees tilt
    const maxRotY = 45; // degrees tilt

    const pctX = mouseX / (rect.width / 2);
    const pctY = mouseY / (rect.height / 2);

    setRotation({
      x: -pctY * maxRotX - 8, // slight default forward tilt
      y: pctX * maxRotY + 15
    });
  };

  // Drag Support to view full 360 degrees
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    setRotation(prev => {
      const nextY = (prev.y + dx * 0.6) % 360;
      const nextX = Math.max(-50, Math.min(50, prev.x - dy * 0.6));
      return { x: nextX, y: nextY };
    });

    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleGlobalMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Synchronize back the idle current angle
      idleAngle.current = rotation.y;
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, rotation]);

  // Handle touch events for mobile rotation
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.current.x;
    const dy = touch.clientY - dragStart.current.y;
    
    setRotation(prev => {
      const nextY = (prev.y + dx * 0.8) % 360;
      const nextX = Math.max(-50, Math.min(50, prev.x - dy * 0.8));
      return { x: nextX, y: nextY };
    });

    dragStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    idleAngle.current = rotation.y;
  };

  // Helper icon renderer
  const renderIcon = () => {
    const props = { className: "w-14 h-14 opacity-40 absolute group-hover:scale-110 transition-transform duration-700" };
    switch (activeCategory.icon) {
      case 'Star': return <Star {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'Bookmark': return <Bookmark {...props} />;
      case 'Feather': return <Feather {...props} />;
      case 'Zap': return <Zap {...props} />;
      default: return <Star {...props} />;
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center p-8 select-none relative"
      id="3d-book-hero-display"
    >
      {/* Floating Magic particles */}
      <div className="absolute inset-x-0 bottom-24 top-0 pointer-events-none overflow-hidden z-20">
        {particles.map(sp => (
          <div
            key={sp.id}
            className={`absolute rounded-full animate-float-up ${getParticleColor()}`}
            style={{
              left: sp.left,
              top: sp.top,
              animationDelay: sp.delay,
            }}
          />
        ))}
      </div>

      {/* 3D Container viewport */}
      <div 
        ref={bookRef}
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          width: '240px',
          height: '350px',
          perspective: '1400px',
          perspectiveOrigin: '50% 50%',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsFlipping(false);
          // Set to current rotation smoothly returning inside loop
          idleAngle.current = rotation.y;
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* The Volumetric 3D Book */}
        <div
          className="w-full h-full relative transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* FRONT COVER (translateZ half of thickness) */}
          <div
            className="absolute inset-0 rounded-l-md rounded-r-lg ring-1 ring-white/10 flex flex-col justify-between p-6 shadow-2xl transition-all duration-700 ease-out filter brightness-105 overflow-hidden"
            style={{
              transformOrigin: 'left center',
              transform: isHovered 
                ? 'translateZ(18px) rotateY(-34deg)' 
                : 'translateZ(18px) rotateY(0deg)',
              backgroundImage: activeBook && activeBook.coverImage 
                ? `url(${activeBook.coverImage})` 
                : (activeCategory.image ? `url(${activeCategory.image})` : undefined),
              background: (activeBook && activeBook.coverImage) || activeCategory.image ? undefined : activeCategory.gradient,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backfaceVisibility: 'visible',
              transformStyle: 'preserve-3d',
              zIndex: 30,
            }}
          >
            {/* Texture overlay with subtle canvas pattern */}
            {((activeBook && activeBook.coverImage) || activeCategory.image) && <div className="absolute inset-0 bg-black/55 pointer-events-none" />}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/60 mix-blend-overlay rounded-r-lg pointer-events-none" />
            <div className="absolute inset-x-2 inset-y-2 border border-white/20 rounded-md pointer-events-none" />
            
            {/* Header Badge */}
            <div className="flex justify-between items-center z-10">
              <span className="text-[10px] tracking-[0.25em] text-white/70 font-mono font-medium uppercase">
                Bookverse 2026
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-ping" />
            </div>

            {/* Middle decorative art representing category */}
            <div className="flex flex-col items-center justify-center relative flex-grow my-4 z-10">
              <div className="absolute w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-spin-slow">
                <div className="w-22 h-22 border border-dashed border-white/10 rounded-full" />
              </div>
              {renderIcon()}
            </div>

            {/* Footer with Title and Category Meta */}
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[8px] font-mono tracking-widest text-[#a5b4fc] uppercase font-bold">
                {activeBook ? activeBook.genre : 'VOLUME CATALOGUE'}
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight leading-snug drop-shadow-md font-display line-clamp-2">
                {activeBook ? activeBook.title : activeCategory.name}
              </h3>
              <p className="text-[11px] text-white/85 leading-relaxed font-sans line-clamp-1 italic">
                {activeBook ? `by ${activeBook.author}` : activeCategory.tagline}
              </p>
              <div 
                className="h-0.5 w-12 rounded-full mt-2" 
                style={{ background: activeBook ? activeBook.coverGradient : 'linear-gradient(to-r from-indigo-500 to-purple-500)' }}
              />
            </div>
            
            {/* Highlights indigo foil foil edges */}
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-r from-indigo-500/30 to-transparent pointer-events-none rounded-l-md" />
          </div>

          {/* INNER PAGE 1 (Elegant reading leaflet with high fidelity printed image) */}
          <div
            className="absolute inset-y-1.5 right-1 w-[228px] rounded-r-md flex flex-col justify-between p-5 border border-amber-900/10 shadow-lg transition-all duration-700 ease-out select-none overflow-hidden"
            style={{
              transformOrigin: 'left center',
              transform: isHovered 
                ? (isFlipping ? 'translateZ(12px) rotateY(-74deg)' : 'translateZ(12px) rotateY(-30deg)')
                : 'translateZ(11px) rotateY(0deg)',
              background: '#fefcf6',
              color: '#0f172a',
              boxShadow: 'inset 3px 0 10px rgba(0,0,0,0.05), 5px 0 15px rgba(0,0,0,0.1)',
              zIndex: 20,
            }}
          >
            {/* Subtle vintage book line dividers */}
            <div className="absolute inset-y-10 left-0 w-[1px] bg-amber-900/10" />
            
            <div className="flex flex-col gap-2.5 text-left z-10">
              <div className="flex justify-between items-center border-b border-amber-900/15 pb-1">
                <span className="text-[8px] font-mono tracking-widest text-amber-800 font-bold uppercase">
                  {activeBook ? 'CHAPTER I' : 'CHAPTER I : INTRODUCTION'}
                </span>
                <span className="text-[8px] font-mono text-slate-400">{activeBook ? 'p. 15' : 'p. 07'}</span>
              </div>
              <h4 className="text-xs font-bold font-display text-slate-900 leading-tight line-clamp-1">
                {activeBook ? activeBook.title : `The ${activeCategory.name} Perspective`}
              </h4>
              <p className="text-[9px] text-slate-600 leading-relaxed font-sans mt-0.5 line-clamp-2">
                "{activeBook ? activeBook.shortDesc : (activeCategory.tagline || 'Ascending the gates of literary convergence.')}"
              </p>
              
              {/* Dynamic printed page image snippet matching the request: "add with images in book" */}
              <div className="relative w-full h-[110px] rounded-lg overflow-hidden my-1 shadow-inner border border-amber-900/15 group-hover:scale-[1.02] transition-transform duration-550">
                <img 
                  src={(activeBook && activeBook.coverImage) || activeCategory.image} 
                  alt="Printed Illustration representing book content" 
                  className="w-full h-full object-cover filter sepia-[0.35] brightness-[0.9] contrast-[1.15]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-amber-900/10 mix-blend-color pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fefcf6]/20 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-amber-900/10 pt-1.5 z-10">
              <span className="text-[7px] font-mono tracking-wider text-slate-400 uppercase truncate max-w-[140px]">
                {activeBook ? activeBook.genre : 'BV EXHIBIT DIRECTORY'}
              </span>
              <div className="w-3.5 h-3.5 rounded-full bg-[#6366f1]/10 flex items-center justify-center">
                <Star className="w-2 h-2 text-[#6366f1]" />
              </div>
            </div>
          </div>

          {/* INNER PAGE 2 (Blueprint layout leaflet) */}
          <div
            className="absolute inset-y-2 right-1.5 w-[224px] rounded-r-md flex flex-col justify-between p-5 border border-amber-950/5 shadow-md transition-all duration-700 ease-out select-none overflow-hidden"
            style={{
              transformOrigin: 'left center',
              transform: isHovered 
                ? (isFlipping ? 'translateZ(6px) rotateY(-40deg)' : 'translateZ(6px) rotateY(-14deg)')
                : 'translateZ(5px) rotateY(0deg)',
              background: '#fcfaf0',
              color: '#334155',
              boxShadow: 'inset 3px 0 10px rgba(0,0,0,0.05)',
              zIndex: 10,
            }}
          >
            <div className="flex flex-col gap-2 text-left z-10">
              <div className="flex justify-between items-center border-b border-amber-900/10 pb-1">
                <span className="text-[8px] font-mono tracking-widest text-[#6366f1] font-bold uppercase">BV SCHEMATIC</span>
                <span className="text-[8px] font-mono text-slate-400">{activeBook ? 'p. 16' : 'p. 08'}</span>
              </div>
              
              <div className="w-10 h-10 rounded-full border border-indigo-505/20 border-dashed mx-auto my-3 flex items-center justify-center animate-spin-slow">
                <div className="w-7 h-7 rounded-full bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5 text-indigo-500/60" />
                </div>
              </div>

              <div className="text-center">
                <span className="text-[7px] font-mono text-indigo-600 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10 inline-block font-bold">
                  {activeBook ? `Rating: ${activeBook.rating} / 5` : 'CURATED METRIC ACTIVE'}
                </span>
                <p className="text-[8px] text-slate-500 leading-normal mt-1 max-w-[170px] mx-auto">
                  {activeBook 
                    ? `This volume has ${activeBook.pages} pages, published in ${activeBook.year} by ${activeBook.published}.`
                    : 'Synchronizing active catalog coordinates with the primary event timeline arena.'}
                </p>
              </div>
            </div>

            <div className="text-center z-10">
              <span className="text-[7px] font-mono text-slate-400 font-bold uppercase">
                {activeBook ? activeBook.published : 'EVENT MODULE MATRIX'}
              </span>
            </div>
          </div>

          {/* SPINE SIDE (translateY -50%, rotateY -90deg, translateX half thickness) */}
          <div
            className="absolute top-0 bottom-0 left-0 w-[36px] transition-all duration-1000"
            style={{
              transform: 'translateX(-18px) rotateY(-90deg)',
              background: activeCategory.gradient,
              boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.5)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Cover spine texture with vertical title */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />
            <div className="h-full w-full flex items-center justify-center select-none" style={{ transform: 'rotate(90deg)' }}>
              <span className="text-[9px] tracking-[0.25em] font-mono font-medium text-white/90 whitespace-nowrap uppercase">
                ★ BOOKVERSE 2026 : {activeBook ? activeBook.title : activeCategory.name} ★
              </span>
            </div>
          </div>

          {/* BACK COVER (translateZ -half thickness, rotateY 180deg) */}
          <div
            className="absolute inset-0 rounded-l-lg rounded-r-md ring-1 ring-white/10 flex flex-col justify-between p-6 transition-all duration-1000 filter brightness-95"
            style={{
              transform: 'translateZ(-18px) rotateY(180deg)',
              background: activeCategory.gradient,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="absolute inset-0 bg-black/40 pointer-events-none rounded-md" />
            <div className="absolute inset-x-2 inset-y-2 border border-white/10 rounded-md pointer-events-none" />
            
            <div className="flex flex-col gap-4 text-left z-10 mt-4">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">B</span>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed font-sans line-clamp-5">
                {activeBook ? activeBook.longDesc : 'Bookverse showcases the convergence of human creative typography, cinematic visual assets, and futuristic community panels.'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center z-10 gap-1 opacity-40">
              <div className="w-20 h-8 border border-white/20 bg-white/5 flex gap-1 items-center justify-center rounded">
                <div className="w-1 bg-white h-6" />
                <div className="w-0.5 bg-white h-5" />
                <div className="w-1.5 bg-white h-6" />
                <div className="w-0.5 bg-white h-6" />
                <div className="w-2 bg-white h-6" />
                <div className="w-0.5 bg-white h-4" />
                <div className="w-1 bg-white h-6" />
              </div>
              <span className="text-[8px] font-mono tracking-widest text-white">#{activeBook ? activeBook.id.toUpperCase() : 'BOOKVERSE26'}</span>
            </div>
          </div>

          {/* RIGHT SIDE PAGES (translateY -50%, rotateY 90deg, translateX thickness/2) */}
          <div
            className="absolute top-1 bottom-1 right-0 w-[34px] bg-slate-50 border-y border-slate-250 cursor-pointer overflow-hidden group/pages"
            style={{
              transform: 'translateX(17px) rotateY(90deg)',
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.1) 100%), repeating-linear-gradient(to right, #e2e8f0 0px, #f8fafc 2px, #e2e8f0 4px)',
            }}
            onMouseEnter={() => setIsFlipping(true)}
            onMouseLeave={() => setIsFlipping(false)}
          >
            {/* Visual glow ribbon trigger when browsing pages area */}
            <div className="absolute inset-y-0 left-0 w-1.5 bg-indigo-500/80 transition-all duration-300 transform -translate-x-full group-hover/pages:translate-x-0" />
          </div>

          {/* TOP PAGES (translateX -50%, rotateX 90deg, translateY thickness/2) */}
          <div
            className="absolute inset-x-1 top-0 h-[34px] bg-slate-100"
            style={{
              transform: 'translateY(-17px) rotateX(90deg)',
              backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.15) 100%), repeating-linear-gradient(to bottom, #cbd5e1 0px, #f1f5f9 2px, #cbd5e1 4px)',
            }}
          />

          {/* BOTTOM PAGES (translateX -50%, rotateX -90deg, translateY thickness/2) */}
          <div
            className="absolute inset-x-1 bottom-0 h-[34px] bg-slate-100"
            style={{
              transform: 'translateY(17px) rotateX(-90deg)',
              backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.15) 100%), repeating-linear-gradient(to bottom, #cbd5e1 0px, #f1f5f9 2px, #cbd5e1 4px)',
            }}
          />
        </div>
      </div>

      {/* Holographic glowing plate below the book */}
      <div 
        className={`w-52 h-4 rounded-full filter blur-xl mt-8 transition-all duration-1000 ${isHovered ? 'scale-125 opacity-70' : 'scale-100 opacity-40'}`}
        style={{
          background: hologramFilter === 'titian-flame' 
            ? 'linear-gradient(90deg, #d32f2f, #ef4444)' 
            : hologramFilter === 'deep-aurora' 
            ? 'linear-gradient(90deg, #8b5cf6, #3e1b7a)' 
            : hologramFilter === 'gold-vintage'
            ? 'linear-gradient(90deg, #f59e0b, #d97706)'
            : hologramFilter === 'cyan-pulse'
            ? 'linear-gradient(90deg, #06b6d4, #0891b2)'
            : activeCategory.gradient,
        }}
      />
      <div className="text-center mt-2 group select-none">
        <span className="text-[10px] font-mono tracking-widest text-[#6366f1] group-hover:text-purple-400 transition-colors uppercase font-bold">
          ✦ Hover to reveal active inner prints • Drag to rotate ✦
        </span>
      </div>
    </div>
  );
}
