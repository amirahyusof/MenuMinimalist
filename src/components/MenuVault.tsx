
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ChefHat, Trash2, Library, Edit3, ExternalLink, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Recipe, Category } from './../types';

interface MenuVaultProps {
  recipes: Recipe[];
  onDelete: (id: string) => void;
  onEdit: (recipe: Recipe) => void;
  onAddClick: () => void;
}

const ITEMS_PER_PAGE = 6;

const MenuVault: React.FC<MenuVaultProps> = ({ recipes, onDelete, onEdit, onAddClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'Semua'>('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and search logic
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'Semua' || r.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchTerm, filterCategory]);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecipes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecipes, currentPage]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
            <Library className="text-primary" size={24} />
            Vault Menu
          </h2>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-primary/20">
            {recipes.length} Koleksi
          </span>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari resepi kegemaran..."
              className="w-full bg-white rounded-[2.5rem] pl-14 pr-6 py-5 shadow-sm border border-gray-100 focus:border-primary/20 transition-all outline-none font-bold text-gray-700"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 px-2 custom-scrollbar">
            {(['Semua', 'Laju', 'Lama'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border-2 ${
                  filterCategory === cat 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white border-gray-100 text-gray-400 hover:border-primary/20'
                }`}
              >
                {cat === 'Semua' && <Filter size={14} />}
                {cat === 'Laju' && <Clock size={14} />}
                {cat === 'Lama' && <ChefHat size={14} />}
                {cat === 'Semua' ? 'Semua' : cat === 'Laju' ? 'Cepat' : 'Renyah'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-16 border-2 border-dashed border-gray-100 text-center space-y-6">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Search size={40} className="text-gray-200" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-gray-700 text-xl">Tiada Menu Dijumpai</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">Mungkin masanya untuk menambah menu baru ke dalam koleksi anda.</p>
          </div>
          <button 
            onClick={onAddClick}
            className="px-8 py-4 bg-[#EA5B6F] text-white rounded-4xl font-extrabold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          >
            Tambah Resepi
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {paginatedRecipes.map((recipe) => (
                <motion.div
                  layout
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-4xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-lg hover:border-[#EA5B6F]/10 transition-all min-h-35"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 overflow-hidden">
                      <div className={`p-3 rounded-2xl shadow-inner shrink-0 ${recipe.category === 'Laju' ? 'bg-info/10 text-info' : 'bg-orange-50 text-orange-400'}`}>
                        {recipe.category === 'Laju' ? <Clock size={20} /> : <ChefHat size={20} />}
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <h3 className="font-extrabold text-gray-800 text-base leading-tight truncate group-hover:text-primary transition-colors">{recipe.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">
                            {recipe.category === 'Laju' ? 'Cepat' : 'Renyah'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {recipe.link && (
                      <a 
                        href={recipe.link} target="_blank" rel="noopener noreferrer"
                        className="p-2 bg-gray-50 rounded-xl text-gray-300 hover:text-primary hover:bg-primary/5 transition-all shrink-0"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[9px] font-bold text-[#EA5B6F] bg-[#EA5B6F]/5 px-2 py-1 rounded-md">{recipe.ingredients.length} Bahan</span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => onEdit(recipe)}
                        className="p-2 text-gray-400 hover:text-[#EA5B6F] hover:bg-[#EA5B6F]/5 rounded-full transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(recipe.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-3 rounded-full bg-white border border-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-primary hover:border-primary/20 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all ${
                      currentPage === p 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-3 rounded-full bg-white border border-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-primary hover:border-primary/20 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MenuVault;
