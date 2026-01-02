
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Library, Sparkles, Calendar as CalendarIcon, Coffee, Clock } from 'lucide-react';
import { Recipe } from './types';
import { QUOTES } from './constants';
import RecipeForm from './components/RecipeForm';
import MenuVault from './components/MenuVault';
import WeeklyPlanner from './components/WeeklyPlanner';
import CalendarSection from './components/CalendarSection';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<Recipe[]>([]);
  const [activeTab, setActiveTab] = useState<'vault' | 'planner' | 'calendar'>('planner');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [quote, setQuote] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedRecipes = localStorage.getItem('mm_recipes');
    const savedPlan = localStorage.getItem('mm_weeklyPlan');
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
    if (savedPlan) setWeeklyPlan(JSON.parse(savedPlan));
    
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  useEffect(() => {
    localStorage.setItem('mm_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('mm_weeklyPlan', JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  const saveRecipe = (recipe: Recipe) => {
    if (editingRecipe) {
      setRecipes(prev => prev.map(r => r.id === recipe.id ? recipe : r));
    } else {
      setRecipes(prev => [recipe, ...prev]);
    }
    setShowAddForm(false);
    setEditingRecipe(null);
  };

  const deleteRecipe = (id: string) => {
    if (window.confirm('Padam menu ini dari Vault?')) {
      setRecipes(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowAddForm(true);
  };

  const formattedDate = currentTime.toLocaleDateString('ms-MY', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const formattedTime = currentTime.toLocaleTimeString('ms-MY', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32">
      {/* Header with Date/Time */}
      <header className="p-8 md:p-12 text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 text-primary font-bold">
            <Clock size={16} />
            <span className="text-sm">{formattedTime}</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <span className="text-xs font-medium text-gray-500 tracking-wide">{formattedDate}</span>
        </motion.div>
        
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Sabar & Tenang</h1>
          <p className="text-sm italic text-gray-400 max-w-xs mx-auto leading-relaxed">"{quote}"</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'planner' && (
            <motion.div key="planner" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <WeeklyPlanner recipes={recipes} weeklyPlan={weeklyPlan} setWeeklyPlan={setWeeklyPlan} />
            </motion.div>
          )}
          {activeTab === 'vault' && (
            <motion.div key="vault" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <MenuVault recipes={recipes} onDelete={deleteRecipe} onEdit={handleEdit} onAddClick={() => { setEditingRecipe(null); setShowAddForm(true); }} />
            </motion.div>
          )}
          {activeTab === 'calendar' && (
            <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CalendarSection weeklyPlan={weeklyPlan} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <AnimatePresence>
        {activeTab === 'vault' && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => { setEditingRecipe(null); setShowAddForm(true); }}
            className="fixed bottom-32 right-8 p-5 rounded-4xl bg-primary text-white shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all z-40"
          >
            <Plus size={28} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed bottom-8 left-0 right-0 px-6 flex justify-center pointer-events-none z-50">
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-2 border border-white/50 flex items-center gap-1 pointer-events-auto">
          {[
            { id: 'vault', icon: Library, label: 'Vault' },
            { id: 'planner', icon: Sparkles, label: 'Planner' },
            { id: 'calendar', icon: CalendarIcon, label: 'Kalendar' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`cursor-pointer flex items-center gap-2 px-6 py-4 rounded-4xl transition-all duration-500 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              {activeTab === tab.id && <span className="text-sm font-bold tracking-tight">{tab.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddForm(false)} className="absolute inset-0 bg-black/30 backdrop-blur-md" />
            <motion.div initial={{ y: 100, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl overflow-hidden border border-white">
              <RecipeForm onSave={saveRecipe} initialData={editingRecipe || undefined} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
