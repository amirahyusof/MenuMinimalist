
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, ChevronDown, CheckCircle2, RotateCcw, UtensilsCrossed, Heart, Calendar, ExternalLink } from 'lucide-react';
import { Recipe } from '../types';

interface WeeklyPlannerProps {
  recipes: Recipe[];
  weeklyPlan: Recipe[];
  setWeeklyPlan: (plan: Recipe[]) => void;
}

// Minimalist Weekly Metadata
const getWeekInfo = () => {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  const weekNum = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);

  // Date Range (Mon - Sun)
  const first = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1);
  const monday = new Date(now.setDate(first));
  const sunday = new Date(now.setDate(first + 6));
  
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const range = `${monday.toLocaleDateString('ms-MY', options)} - ${sunday.toLocaleDateString('ms-MY', options)}`;

  return { weekNum, range };
};

const CozyKitchenIllustration = () => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-64 h-64 mx-auto flex items-center justify-center">
    <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-[#FFCB61]/10 rounded-full" />
    <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
      <motion.path d="M60 120 Q60 150 100 150 Q140 150 140 120 L140 100 L60 100 Z" fill="#EA5B6F" animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      <rect x="55" y="95" width="90" height="8" rx="4" fill="#EA5B6F" />
      <rect x="90" y="85" width="20" height="10" rx="5" fill="#EA5B6F" />
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M${90 + i * 15} 80 Q${85 + i * 15} 70 ${95 + i * 15} 60`} stroke="#77BEF0" strokeWidth="3" strokeLinecap="round" fill="none" initial={{ opacity: 0, pathLength: 0, y: 0 }} animate={{ opacity: [0, 0.5, 0], pathLength: 1, y: -20 }} transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: "linear" }} />
      ))}
      <motion.g animate={{ rotate: [0, 15, -15, 0], x: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="40" y="165" width="120" height="10" rx="5" fill="#FF894F" />
        <rect x="30" y="167" width="10" height="6" rx="3" fill="#D46A3A" />
        <rect x="160" y="167" width="10" height="6" rx="3" fill="#D46A3A" />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.g key={`heart-${i}`} initial={{ scale: 0, x: 100, y: 130 }} animate={{ scale: [0, 1, 0], x: [100, 100 + (i - 1) * 40], y: [130, 80] }} transition={{ duration: 3, delay: i * 1, repeat: Infinity }}>
          <path d="M10 3.22C10 3.22 10 0 6.5 0C3.5 0 1.5 2.5 1.5 4.5C1.5 7.5 5 11 10 14C15 11 18.5 7.5 18.5 4.5C18.5 2.5 16.5 0 13.5 0C10 0 10 3.22 10 3.22Z" fill="#EA5B6F" opacity="0.6" />
        </motion.g>
      ))}
    </svg>
  </motion.div>
);

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ recipes, weeklyPlan, setWeeklyPlan }) => {
  const [isShuffling, setIsShuffling] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const weekInfo = useMemo(() => getWeekInfo(), []);

  const handleShuffle = () => {
    if (recipes.length === 0) return;
    setIsShuffling(true);
    setExpandedId(null);
    setWeeklyPlan([]); 
    setTimeout(() => {
      const shuffled = [...recipes].sort(() => 0.5 - Math.random());
      const count = Math.min(Math.floor(Math.random() * 3) + 3, recipes.length);
      setWeeklyPlan(shuffled.slice(0, count));
      setIsShuffling(false);
    }, 1800);
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <UtensilsCrossed size={160} />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              <Calendar size={14} className="text-white" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">Minggu {weekInfo.weekNum}: {weekInfo.range}</span>
            </div>
            <h2 className="text-3xl font-extrabold leading-tight text-shadow-sm">Tak tahu nak masak apa?</h2>
            <p className="text-white font-medium opacity-90 text-sm">Biarkan kami pilihkan menu terbaik minggu ini.</p>
          </div>
          
          <button 
            disabled={isShuffling || recipes.length < 3} onClick={handleShuffle}
            className={`w-full py-5 rounded-[2.5rem] font-extrabold flex items-center justify-center gap-3 shadow-2xl transition-all relative overflow-hidden ${
              isShuffling ? 'bg-white/40 cursor-not-allowed scale-95' : 'bg-white text-primary hover:bg-gray-50 active:scale-95'
            }`}
          >
            <AnimatePresence mode="wait">
              {isShuffling ? (
                <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Sparkles size={24} />
                  </motion.div>
                  <span className="tracking-wide text-lg">Menyusun Menu...</span>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
                  <Sparkles size={24} />
                  <span className="tracking-wide text-lg">Pilihkan Untuk Saya</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          
          {recipes.length < 3 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[10px] font-extrabold text-white bg-black/10 py-2 rounded-2xl uppercase tracking-widest">
              Sila masukkan 3 menu dalam vault dahulu
            </motion.p>
          )}
        </div>
      </div>

      {/* Plan Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-8 bg-primary rounded-full shadow-lg shadow-primary/20" />
            <div className="flex flex-col">
              <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">Pelan Masakan</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{weeklyPlan.length} Pilihan Terpilih</p>
            </div>
          </div>
          {weeklyPlan.length > 0 && !isShuffling && (
            <button onClick={() => setWeeklyPlan([])} className="text-[10px] font-extrabold text-gray-400 hover:text-primary flex items-center gap-2 transition-all p-3 hover:bg-gray-50 rounded-2xl uppercase tracking-widest">
              <RotateCcw size={14} /> Reset Pelan
            </button>
          )}
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence>
            {isShuffling && (
              <div className="space-y-5 absolute inset-0 w-full">
                {[1, 2, 3].map((i) => (
                  <motion.div key={`skeleton-${i}`} initial={{ opacity: 0, rotateX: -90, y: 20 }} animate={{ opacity: [0.4, 0.7, 0.4], rotateX: 0, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, delay: i * 0.15, repeat: Infinity, repeatDelay: 0.5 }} className="h-28 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100" />
                ))}
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {!isShuffling && weeklyPlan.length > 0 && (
              <div className="space-y-5">
                {weeklyPlan.map((recipe, index) => (
                  <motion.div
                    key={recipe.id} layout
                    initial={{ opacity: 0, rotateX: 90, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 12, delay: index * 0.15 } }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className={`group bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all ${expandedId === recipe.id ? 'ring-4 ring-primary/5' : ''}`}
                  >
                    <button onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)} className="w-full p-7 flex items-center justify-between text-left">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-[2rem] flex items-center justify-center text-lg font-extrabold transition-all shadow-lg ${recipe.category === 'Laju' ? 'bg-info/10 text-info shadow-info/10' : 'bg-primary/10 text-primary shadow-primary/10'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-800 text-xl group-hover:text-primary transition-colors">{recipe.name}</h4>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${recipe.category === 'Laju' ? 'bg-info/5 text-info border-info/20' : 'bg-primary/5 text-primary border-primary/20'}`}>
                              {recipe.category === 'Laju' ? 'Cepat' : 'Renyah'}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{recipe.ingredients.length} Bahan</span>
                          </div>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: expandedId === recipe.id ? 180 : 0 }} className="text-gray-300">
                        <ChevronDown size={28} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {expandedId === recipe.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-[#fafafa] border-t border-gray-50">
                          <div className="p-8 pt-4 space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.4em]">
                                <ShoppingBag size={16} className="text-secondary" />
                                <span>Bahan Masakan</span>
                              </div>
                              {recipe.link && (
                                <a 
                                  href={recipe.link} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-[10px] font-bold text-primary hover:underline"
                                >
                                  <ExternalLink size={14} />
                                  TENGOK RESEPI PENUH
                                </a>
                              )}
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {recipe.ingredients.map((ing, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                                  <div className="w-6 h-6 rounded-full border-2 border-primary/20 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-20" />
                                  </div>
                                  <span className="text-sm font-bold text-gray-700">{ing}</span>
                                </div>
                              ))}
                            </div>
                            <button className="w-full py-4 rounded-[2rem] text-[10px] font-extrabold text-primary border-2 border-primary/20 hover:bg-primary/5 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                              <CheckCircle2 size={18} /> Selesai Masak
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}

            {!isShuffling && weeklyPlan.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <CozyKitchenIllustration />
                <div className="space-y-3 mt-6">
                  <h4 className="text-gray-800 font-extrabold text-2xl flex items-center justify-center gap-3">
                    <Heart size={24} className="text-primary fill-primary" />
                    Dapur Yang Tenang
                  </h4>
                  <p className="text-sm text-gray-400 max-w-[300px] mx-auto leading-relaxed font-medium italic">
                    "Urusan dapur yang tenang membawa keluarga yang senang."
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
