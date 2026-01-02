
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, ChefHat, Plus, Link as LinkIcon } from 'lucide-react';
import { Recipe, Category } from './../types';

interface RecipeFormProps {
  onSave: (recipe: Recipe) => void;
  initialData?: Recipe;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'Laju');
  const [link, setLink] = useState(initialData?.link || '');
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || []);
  const [isPulse, setIsPulse] = useState(false);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredient.trim()) {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient('');
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    setIsPulse(true);
    setTimeout(() => {
      onSave({
        id: initialData?.id || Date.now().toString(),
        name: name.trim(),
        category,
        ingredients,
        link: link.trim() || undefined
      });
    }, 600);
  };

  return (
    <div className="space-y-8 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-gray-800">{initialData ? 'Kemaskini Menu' : 'Menu Baru'}</h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Lengkapkan butiran masakan</p>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-3 block pl-2">Nama Masakan</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Ayam Masak Kicap"
            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#EA5B6F]/20 focus:bg-white rounded-4xl p-5 transition-all outline-none font-bold text-gray-700"
          />
        </div>

        <div>
          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-3 block pl-2">Gaya Masakan</label>
          <div className="flex gap-3">
            {(['Laju', 'Lama'] as Category[]).map((cat) => (
              <button
                key={cat} onClick={() => setCategory(cat)}
                className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-4xl transition-all border-2 ${
                  category === cat ? 'border-[#EA5B6F] bg-[#EA5B6F]/5 text-[#EA5B6F]' : 'border-gray-50 bg-gray-50 text-gray-400'
                }`}
              >
                {cat === 'Laju' ? <Clock size={24} /> : <ChefHat size={24} />}
                <span className="text-xs font-bold uppercase tracking-widest">{cat === 'Laju' ? 'Cepat' : 'Renyah'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="group">
          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-3 block pl-2">Pautan Resepi (Opsional)</label>
          <div className="relative">
            <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="url" value={link} onChange={(e) => setLink(e.target.value)}
              placeholder="https://contoh-resepi.com"
              className="w-full bg-gray-50 border-2 border-transparent focus:border-[#EA5B6F]/20 focus:bg-white rounded-4xl pl-14 pr-6 py-5 transition-all outline-none font-bold text-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-3 block pl-2">Bahan Utama</label>
          <form onSubmit={handleAddIngredient} className="flex gap-2 mb-4">
            <input
              type="text" value={ingredient} onChange={(e) => setIngredient(e.target.value)}
              placeholder="e.g., Santan"
              className="flex-1 bg-gray-50 border-2 border-transparent focus:border-[#EA5B6F]/20 focus:bg-white rounded-4xl px-6 py-4 transition-all outline-none text-sm font-semibold"
            />
            <button type="submit" className="bg-[#EA5B6F] text-white p-4 rounded-4xl shadow-lg shadow-[#EA5B6F]/20 hover:scale-105 transition-transform">
              <Plus size={24} />
            </button>
          </form>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {ingredients.map((ing, idx) => (
              <motion.span 
                initial={{ scale: 0 }} animate={{ scale: 1 }} key={idx} 
                className="bg-white border border-gray-100 px-4 py-2 rounded-full text-xs font-bold text-gray-600 flex items-center gap-2 shadow-sm"
              >
                {ing}
                <X size={14} className="cursor-pointer text-gray-300 hover:text-red-500 transition-colors" onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))} />
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleSave}
        animate={isPulse ? { 
          scale: [1, 1.05, 1],
          backgroundColor: ["#EA5B6F", "#4ade80", "#4ade80"] 
        } : {}}
        transition={{ duration: 0.5 }}
        className={`w-full py-5 rounded-[2.5rem] font-extrabold flex items-center justify-center gap-3 shadow-2xl transition-all ${
          isPulse ? 'text-white' : 'bg-[#EA5B6F] text-white hover:shadow-[#EA5B6F]/30'
        }`}
      >
        {isPulse ? <Check size={28} strokeWidth={3} /> : (initialData ? 'Simpan Perubahan' : 'Masukkan Ke Vault')}
      </motion.button>
    </div>
  );
};

export default RecipeForm;
