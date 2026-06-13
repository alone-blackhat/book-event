import React, { useState } from 'react';
import { X, User, Mail, Compass, Check, ArrowRight, ShieldCheck, Ticket, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { categories } from '../data';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+919080746103',
    favoriteCategory: 'fiction',
    agreeToNewsletter: true,
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear errors as user types
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors(prev => ({ ...prev, [name]: false }));
      }
    }
  };

  const generateTicketId = () => {
    const prefix = 'BV';
    const year = '2026';
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${year}-${randomNum}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const errors = {
      name: !formData.name.trim(),
      email: !formData.email.trim() || !formData.email.includes('@'),
    };

    setFormErrors(errors);

    if (errors.name || errors.email) {
      return;
    }

    // Success! Generate custom ticket and transition
    setTicketId(generateTicketId());
    setIsSuccess(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '+919080746103',
      favoriteCategory: 'fiction',
      agreeToNewsletter: true,
    });
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        id="registration-modal-window"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Main container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#08080a]/95 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10 p-6 sm:p-10 text-left backdrop-blur-xl"
        >
          {/* Carbon texture overlay inside modal */}
          <div className="absolute inset-0 carbon-overlay opacity-[0.08] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleReset}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-white/10 text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer relative z-30"
            aria-label="Close registration modal"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSuccess ? (
            /* REGISTRATION FORM STAGE */
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1 select-none">
                  <Ticket className="w-4 h-4" />
                  <span>SECURE GATE PASS</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 tracking-tight leading-tight">
                  Register for Bookverse
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access rotating displays, author signings, and custom 3D catalogs.
                </p>
              </div>

              {/* Informative Security banner */}
              <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl flex items-center gap-2 text-[11px] text-slate-400 relative z-10">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant generation. No cost, 100% server-safe local simulation.</span>
              </div>

              {/* Input Name */}
              <div className="flex flex-col gap-2 text-left relative z-10">
                <label className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" /> FULL NAME
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full bg-zinc-950/80 text-sm text-slate-200 border rounded-xl py-3 px-4 outline-none focus:ring-1 transition-all ${
                    formErrors.name 
                      ? 'border-red-500/80 focus:ring-red-500/30 bg-red-500/5' 
                      : 'border-white/10 focus:border-indigo-505 focus:ring-[#6366f1]/20'
                  }`}
                />
                {formErrors.name && (
                  <span className="text-[10px] text-red-400 font-mono">Full name is required.</span>
                )}
              </div>

              {/* Input Email */}
              <div className="flex flex-col gap-2 text-left relative z-10">
                <label className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. student@bookverse.com"
                  className={`w-full bg-zinc-950/80 text-sm text-slate-200 border rounded-xl py-3 px-4 outline-none focus:ring-1 transition-all ${
                    formErrors.email 
                      ? 'border-red-500/80 focus:ring-red-500/30 bg-red-500/5' 
                      : 'border-white/10 focus:border-indigo-550 focus:ring-[#6366f1]/20'
                  }`}
                />
                {formErrors.email && (
                  <span className="text-[10px] text-red-400 font-mono">Please enter a valid email address.</span>
                )}
              </div>

              {/* Input Phone */}
              <div className="flex flex-col gap-2 text-left relative z-10">
                <label className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> CONTACT NUMBER
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 90807 46103"
                  className="w-full bg-zinc-950/80 text-sm text-slate-200 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-550 focus:ring-[#6366f1]/20 transition-all font-sans"
                />
              </div>

              {/* Selected Preferred domain category dropdown */}
              <div className="flex flex-col gap-2 text-left relative z-10">
                <label className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-500" /> PREFERRED GENRE / HOST
                </label>
                <select
                  name="favoriteCategory"
                  value={formData.favoriteCategory}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-950/80 text-sm text-slate-100 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-[#6366f1]/20 transition-all font-sans cursor-pointer text-left"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-zinc-950 text-slate-300 py-2">
                      {cat.name} Showcase — {cat.tagline.split('.')[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-2.5 my-1 relative z-10">
                <input
                  type="checkbox"
                  id="agreeToNewsletter"
                  name="agreeToNewsletter"
                  checked={formData.agreeToNewsletter}
                  onChange={handleInputChange}
                  className="mt-1 accent-indigo-500 rounded focus:ring-transparent w-4 h-4 cursor-pointer"
                />
                <label htmlFor="agreeToNewsletter" className="text-xs text-slate-400 leading-normal select-none cursor-pointer text-left">
                  Notify me of upcoming key panels, schedule anomalies, and signed book giveaways.
                </label>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full py-4 px-6 mt-2 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer select-none relative z-10"
              >
                Assemble Pass & Register
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          ) : (
            /* SUCCESS VIP TICKET STAGE */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center gap-6"
            >
              {/* Animated ticket indicator */}
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-505/20 text-indigo-400 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/5 animate-pulse select-none">
                <Ticket className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex justify-center items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Registration Confirmed
                </span>
                <h3 className="text-2xl font-bold text-slate-100 tracking-tight leading-normal mt-1.5">
                  Welcome to Bookverse!
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Your entry pass is assembled and mapped to your simulated local device.
                </p>
                {formData.phone && (
                  <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-[11px] text-emerald-300 font-mono flex items-center justify-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                    <span>Details shared via SMS to {formData.phone}</span>
                  </div>
                )}
              </div>

              {/* The Visual VIP Ticket Pass with custom graphics */}
              <div className="w-full bg-gradient-to-br from-[#0e0e13] to-[#14141c] border border-white/10 rounded-2xl relative shadow-2xl overflow-hidden flex flex-col justify-between">
                {/* Decorative background watermarks */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/10 to-transparent filter blur-2xl pointer-events-none" />
                
                {/* Visual dotted ticket divider side notches */}
                <div className="absolute top-2/3 -left-3 w-6 h-6 rounded-full bg-[#08080a] border border-white/10 z-25" />
                <div className="absolute top-2/3 -right-3 w-6 h-6 rounded-full bg-[#08080a] border border-white/10 z-25" />
                <div className="absolute top-2/3 left-4 right-4 h-0.5 border-t border-dashed border-white/10 z-10" />

                {/* Ticket Top Portion */}
                <div className="p-6">
                  {/* Branding */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-[#6366f1] font-bold">BOOKVERSE PASS</span>
                    <span className="text-[9px] font-mono text-slate-405 uppercase bg-zinc-900 border border-white/5 px-2 py-0.5 rounded">
                      VIP ADMISSION
                    </span>
                  </div>

                  {/* Registered Name info */}
                  <div className="text-left flex flex-col gap-1.5 mt-3">
                    <span className="text-[8px] font-mono text-slate-505 uppercase tracking-widest block">PASS HOLDER</span>
                    <h4 className="text-lg font-bold text-slate-100 tracking-tight select-all">
                      {formData.name || 'Enthusiastic Reader'}
                    </h4>
                    <span className="text-xs text-slate-450 select-all font-mono">
                      {formData.email || 'guest@bookverse.com'}
                    </span>
                    {formData.phone && (
                      <span className="text-xs text-slate-400 select-all font-mono flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-indigo-400" /> {formData.phone}
                      </span>
                    )}
                  </div>

                  {/* Date & Location summary row */}
                  <div className="grid grid-cols-2 gap-3 mt-5 text-left border-t border-white/5 pt-4">
                    <div>
                      <span className="text-[8px] font-mono text-slate-505 block">DATE</span>
                      <span className="text-xs font-semibold text-slate-300">Oct 14-15, 2026</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-slate-505 block">ACCESS HOST</span>
                      <span className="text-xs font-semibold text-[#6366f1] uppercase tracking-wide">
                        {categories.find(c => c.id === formData.favoriteCategory)?.name || formData.favoriteCategory}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ticket Bottom Portion (The barcode simulator) */}
                <div className="bg-black/30 p-5 pt-7 flex flex-col items-center gap-2 border-t border-white/10">
                  {/* Generated Ticket ID */}
                  <span className="text-[11px] font-mono text-slate-350 tracking-widest select-all font-bold">
                    {ticketId}
                  </span>

                  {/* Barcode artwork lines */}
                  <div className="flex gap-1 items-center h-10 w-full max-w-[240px] opacity-75 mt-1 select-none">
                    <div className="grow-[1] bg-indigo-400/85 h-full" />
                    <div className="grow-[0.3] bg-indigo-400/85 h-full" />
                    <div className="grow-[1.5] bg-[#6366f1]/85 h-full" />
                    <div className="grow-[0.5] bg-[#6366f1]/85 h-full" />
                    <div className="grow-[2] bg-[#6366f1]/85 h-full" />
                    <div className="grow-[0.4] bg-[#6366f1]/85 h-full" />
                    <div className="grow-[1] bg-purple-600 h-full" />
                    <div className="grow-[0.8] bg-purple-600 h-full" />
                    <div className="grow-[1.8] bg-purple-600 h-full" />
                    <div className="grow-[0.2] bg-pink-400 h-full" />
                    <div className="grow-[1.2] bg-pink-400 h-full" />
                  </div>
                </div>
              </div>

              {/* Reset to close */}
              <button
                onClick={handleReset}
                className="w-full py-3.5 px-6 bg-[#0c0c10] hover:bg-zinc-800 hover:text-white text-slate-300 font-bold rounded-xl text-xs select-none cursor-pointer transition-colors mt-2 border border-white/10"
              >
                Complete & Back to Arena
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
