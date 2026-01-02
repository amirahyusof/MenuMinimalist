
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Heart, Utensils } from 'lucide-react';
import { Recipe } from './../types';

interface CalendarSectionProps {
  weeklyPlan: Recipe[];
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ weeklyPlan }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'];
  const monthNames = [
    "Januari", "Februari", "Mac", "April", "Mei", "Jun",
    "Julai", "Ogos", "September", "Oktober", "November", "Disember"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat
    // We want: 0=Mon, ..., 6=Sun
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayDate = new Date();

  // Calendar cells
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  // Find corresponding recipe for the day in the weekly list
  // Note: App shuffle creates 3-5 recipes. We map them sequentially to the days of current week.
  const currentDayInWeek = todayDate.getDay() === 0 ? 6 : todayDate.getDay() - 1;

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Left Column: Calendar Table */}
      <div className="w-full lg:w-[45%] space-y-6">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
              <CalIcon className="text-[#EA5B6F]" size={20} />
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-[#EA5B6F] transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-[#EA5B6F] transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['I', 'S', 'R', 'K', 'J', 'S', 'A'].map(d => (
              <span key={d} className="text-[10px] font-black text-gray-300 uppercase">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarCells.map((day, idx) => {
              const isToday = day === todayDate.getDate() && month === todayDate.getMonth() && year === todayDate.getFullYear();
              return (
                <div 
                  key={idx} 
                  className={`aspect-square flex items-center justify-center text-sm font-bold rounded-xl transition-all
                    ${day === null ? 'invisible' : 'cursor-default'}
                    ${isToday ? 'bg-[#EA5B6F] text-white shadow-lg shadow-[#EA5B6F]/20 scale-105' : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-4 text-xs font-bold text-gray-400 italic">
            <Heart size={14} className="text-[#EA5B6F]/40 shrink-0" />
            "Dapur yang kemas membawa ketenangan jiwa."
          </div>
        </div>
      </div>

      {/* Right Column: Weekly Schedule List */}
      <div className="w-full lg:w-[55%] space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
            <Utensils className="text-secondary" size={24} />
            Jadual Minggu Ini
          </h2>
        </div>

        <div className="space-y-4">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === currentDayInWeek;
            // Map shuffle recipes to days. If plan has 5, they map to first 5 days.
            const plannedRecipe = weeklyPlan[idx];

            return (
              <motion.div 
                key={day} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-4xl p-5 shadow-sm border border-gray-100 flex items-center gap-6 relative overflow-hidden transition-all group ${isToday ? 'ring-4 ring-[#EA5B6F]/5 border-[#EA5B6F]/20 scale-[1.02]' : ''}`}
              >
                {isToday && <div className="absolute top-0 left-0 w-2 h-full bg-[#EA5B6F]" />}
                
                <div className="flex flex-col items-center justify-center min-w-12.5 border-r border-gray-50 pr-5">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest ${isToday ? 'text-[#EA5B6F]' : 'text-gray-400'}`}>{day.substring(0, 3)}</span>
                  <span className={`text-xl font-black ${isToday ? 'text-[#EA5B6F]' : 'text-gray-700'}`}>{todayDate.getDate() - currentDayInWeek + idx}</span>
                </div>

                <div className="flex-1 overflow-hidden">
                  {plannedRecipe ? (
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-gray-800 text-base leading-tight group-hover:text-[#EA5B6F] transition-colors">{plannedRecipe.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${plannedRecipe.category === 'Laju' ? 'bg-info/10 text-info' : 'bg-[#EA5B6F]/10 text-[#EA5B6F]'}`}>
                            {plannedRecipe.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-full text-gray-300">
                        <Utensils size={14} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-300 font-bold italic">Tiada menu</p>
                      <div className="w-8 h-8 rounded-full border border-dashed border-gray-200" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
