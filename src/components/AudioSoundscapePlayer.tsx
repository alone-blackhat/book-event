import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles, Terminal } from 'lucide-react';

type Soundtrack = 'none' | 'titian-waves' | 'violet-noise' | 'celestial';

export default function AudioSoundscapePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState<Soundtrack>('titian-waves');
  const [volume, setVolume] = useState(35); // percentage (0-100)

  // Web Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  
  // Generators / Oscillators
  const activeNodesRef = useRef<AudioNode[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Initialize Audio Context lazily upon first interaction
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(volume / 100, ctx.currentTime);
      mainGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      mainGainRef.current = mainGain;
    } catch (e) {
      console.warn('Web Audio API not supported in this browser environment.', e);
    }
  };

  const stopAllGenerators = () => {
    // Clear any running sequencers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Stop all active audio nodes safely
    activeNodesRef.current.forEach((node) => {
      try {
        if ('stop' in node) {
          (node as any).stop();
        }
        node.disconnect();
      } catch (err) {
        // Already stopped or disconnected
      }
    });
    activeNodesRef.current = [];
  };

  // Build the deep Titian drone pad synthesized at a therapeutic frequency (432Hz and sub-harmonics)
  const playTitianDrone = () => {
    const ctx = audioCtxRef.current;
    const gainNode = mainGainRef.current;
    if (!ctx || !gainNode) return;

    // Frequencies: 108Hz (ground), 216Hz, and 432Hz
    const freqs = [108, 216, 432];
    
    freqs.forEach((freq, idx) => {
      // Oscillators
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      // Detune slightly for lush wide stereo chorus feel
      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq + (idx === 0 ? 0 : (idx === 1 ? 0.4 : -0.6)), ctx.currentTime);
      
      // Filter out high sizzle for warm cinema mood
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(idx === 0 ? 300 : 800, ctx.currentTime);
      filter.Q.setValueAtTime(5, ctx.currentTime);

      // Connect
      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(gainNode);

      // Configure slow LFO (Low Frequency Swells)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.05, ctx.currentTime); // very slow swell
      lfoGain.gain.setValueAtTime(0.08, ctx.currentTime); // subtle volume modulation
      
      // Connect LFO to gain scale
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);

      // Set base gain
      const baseGain = idx === 0 ? 0.35 : (idx === 1 ? 0.25 : 0.15);
      oscGain.gain.setValueAtTime(baseGain, ctx.currentTime);

      osc.start();
      lfo.start();
      
      activeNodesRef.current.push(osc, lfo, oscGain, lfoGain, filter);
    });
  };

  // Build high-performance compile systems retro synth (arpeggios/notes blips)
  const playSystemsCompSynth = () => {
    const ctx = audioCtxRef.current;
    const gainNode = mainGainRef.current;
    if (!ctx || !gainNode) return;

    // Sound base pad (steady soft compile drone at 150Hz)
    const baseDrone = ctx.createOscillator();
    const baseGain = ctx.createGain();
    baseDrone.type = 'triangle';
    baseDrone.frequency.setValueAtTime(150, ctx.currentTime);
    baseGain.gain.setValueAtTime(0.12, ctx.currentTime);
    baseDrone.connect(baseGain);
    baseGain.connect(gainNode);
    baseDrone.start();
    activeNodesRef.current.push(baseDrone, baseGain);

    // Minor pentatonic scale offsets matching high-performance C++ track identity
    const notes = [220, 247, 293, 330, 392, 440, 494, 587, 660, 784];

    // Create an elegant sequence interval mimicking digital processor compilers
    intervalRef.current = window.setInterval(() => {
      if (ctx.state === 'suspended') return;
      
      // Add randomness but controlled intervals
      if (Math.random() > 0.45) {
        const selectedNote = notes[Math.floor(Math.random() * notes.length)];
        const pulseOsc = ctx.createOscillator();
        const pulseGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        pulseOsc.type = 'sine';
        pulseOsc.frequency.setValueAtTime(selectedNote, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        filter.Q.setValueAtTime(2, ctx.currentTime);

        pulseGain.gain.setValueAtTime(0, ctx.currentTime);
        pulseGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
        pulseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        pulseOsc.connect(filter);
        filter.connect(pulseGain);
        pulseGain.connect(gainNode);

        try {
          pulseOsc.start();
          pulseOsc.stop(ctx.currentTime + 1.3);
          
          activeNodesRef.current.push(pulseOsc, pulseGain, filter);
          
          // Cleanup finished nodes to prevent storage buildup
          setTimeout(() => {
            activeNodesRef.current = activeNodesRef.current.filter(n => n !== pulseOsc && n !== pulseGain && n !== filter);
          }, 1500);
        } catch (e) {
          // Safeguard
        }
      }
    }, 380);
  };

  // Celestial Stardust - Soft cosmic wind using resonant lowpass on warm noise or slow pads
  const playCelestialCelestial = () => {
    const ctx = audioCtxRef.current;
    const gainNode = mainGainRef.current;
    if (!ctx || !gainNode) return;

    // Harmonic crystalline fifths: 261.63Hz (C4), 392.00Hz (G4), 523.25Hz (C5), 783.99Hz (G5)
    const freqs = [261.63, 392.00, 523.25, 783.99];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Slower sweep oscillators
      const sweep = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweep.frequency.setValueAtTime(0.03 + idx * 0.02, ctx.currentTime);
      sweepGain.gain.setValueAtTime(0.06, ctx.currentTime);

      sweep.connect(sweepGain);
      sweepGain.connect(oscGain.gain);

      oscGain.gain.setValueAtTime(idx === 0 ? 0.15 : (idx === 1 ? 0.1 : 0.05), ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(gainNode);
      
      osc.start();
      sweep.start();

      activeNodesRef.current.push(osc, oscGain, sweep, sweepGain);
    });
  };

  // Re-configure audio states upon play state or tracks alteration
  useEffect(() => {
    if (!isPlaying) {
      stopAllGenerators();
      return;
    }

    initAudio();
    stopAllGenerators();

    // Ensure audio context is resumed
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (track === 'titian-waves') {
      playTitianDrone();
    } else if (track === 'violet-noise') {
      playSystemsCompSynth();
    } else if (track === 'celestial') {
      playCelestialCelestial();
    }
  }, [isPlaying, track]);

  // Handle live volume sliding
  useEffect(() => {
    if (mainGainRef.current && audioCtxRef.current) {
      mainGainRef.current.gain.setValueAtTime(volume / 100, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Stop everything on unmount
  useEffect(() => {
    return () => {
      stopAllGenerators();
    };
  }, []);

  const handleTogglePlay = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      id="bookverse-audio-deck"
      className="p-4 bg-zinc-950/80 border border-white/10 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] text-left select-none max-w-sm w-full mx-auto"
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
            <Music className={`w-3.5 h-3.5 text-amber-400 ${isPlaying ? 'animate-spin-slow' : ''}`} />
          </div>
          <div>
            <h4 className="text-[11px] font-mono font-bold text-slate-200 tracking-wider uppercase">Atmospheric Deck</h4>
            <p className="text-[8.5px] font-sans text-slate-400 leading-none">Binaural Synthesis Engine</p>
          </div>
        </div>

        {/* Live dynamic sound bar wave indicators */}
        <div className="flex items-end gap-[2px] h-3.5">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div 
              key={idx} 
              className={`w-[2px] bg-indigo-400 rounded-full transition-all duration-305 ${isPlaying ? 'animate-audio-bar' : 'h-1 opacity-40'}`} 
              style={{
                animationDelay: `${idx * 0.15}s`,
                height: isPlaying ? undefined : '3px'
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Play trigger */}
        <button
          onClick={handleTogglePlay}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95 ${
            isPlaying 
              ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
              : 'bg-zinc-900 border border-white/10 text-slate-350 hover:border-white/20'
          }`}
          title="Toggle Ambient Audio Synth"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Preset choices */}
        <div className="grid grid-cols-3 gap-1.5 grow">
          <button
            onClick={() => { setTrack('titian-waves'); if (!isPlaying) setIsPlaying(true); }}
            className={`px-2 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase border text-center transition-all ${
              track === 'titian-waves' && isPlaying
                ? 'bg-gradient-to-r from-red-500/20 to-indigo-500/10 border-red-500/35 text-rose-200'
                : 'bg-[#08080c]/60 border-white/5 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="block truncate">Titian 432Hz</span>
          </button>
          
          <button
            onClick={() => { setTrack('violet-noise'); if (!isPlaying) setIsPlaying(true); }}
            className={`px-2 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase border text-center transition-all ${
              track === 'violet-noise' && isPlaying
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border-indigo-500/35 text-indigo-200'
                : 'bg-[#08080c]/60 border-white/5 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="block truncate">C++ Compiler</span>
          </button>

          <button
            onClick={() => { setTrack('celestial'); if (!isPlaying) setIsPlaying(true); }}
            className={`px-2 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase border text-center transition-all ${
              track === 'celestial' && isPlaying
                ? 'bg-gradient-to-r from-cyan-500/20 to-amber-500/10 border-amber-500/35 text-amber-200'
                : 'bg-[#08080c]/60 border-white/5 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="block truncate">Aurora Wind</span>
          </button>
        </div>
      </div>

      {/* Volume slider control */}
      <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-white/5">
        <button 
          onClick={() => setVolume(v => v === 0 ? 35 : 0)}
          className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
        >
          {volume === 0 ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="grow h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <span className="text-[8px] font-mono text-slate-500 w-6 text-right font-bold">{volume}%</span>
      </div>
    </div>
  );
}
