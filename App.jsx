import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All', color: 'bg-stone-100 text-stone-700' },
  { id: 'routine', label: 'Routine', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'health', label: 'Health', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'personal', label: 'Personal', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 'chores', label: 'Home / Chores', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 'errands', label: 'Errands', color: 'bg-purple-100 text-purple-800 border-purple-200' }
];

export default function App() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'habits'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('09:00');
  const [taskPeriod, setTaskPeriod] = useState('morning'); // 'morning' | 'afternoon' | 'evening'
  const [taskCategory, setTaskCategory] = useState('routine');

  // Stored Data
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('planner_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: '1', title: 'Morning walk & deep breaths', date: new Date().toISOString().split('T')[0], time: '06:30', period: 'morning', category: 'health', completed: true },
      { id: '2', title: 'Healthy breakfast & green tea', date: new Date().toISOString().split('T')[0], time: '08:30', period: 'morning', category: 'routine', completed: false },
      { id: '3', title: 'Grocery run & market visit', date: new Date().toISOString().split('T')[0], time: '16:00', period: 'afternoon', category: 'errands', completed: false },
      { id: '4', title: 'Light stretching or reading', date: new Date().toISOString().split('T')[0], time: '20:30', period: 'evening', category: 'personal', completed: false },
    ];
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('planner_habits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 'h1', title: 'Drink 8 glasses of water', streak: 4, completedDates: [] },
      { id: 'h2', title: '30 mins walking / exercise', streak: 6, completedDates: [] },
      { id: 'h3', title: 'Daily vitamins / medicine', streak: 12, completedDates: [] },
      { id: 'h4', title: 'Quiet meditation / reading', streak: 3, completedDates: [] }
    ];
  });

  useEffect(() => {
    localStorage.setItem('planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('planner_habits', JSON.stringify(habits));
  }, [habits]);

  // Date controls
  const shiftDate = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const formattedDateString = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Actions
  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      date: selectedDate,
      time: taskTime,
      period: taskPeriod,
      category: taskCategory,
      completed: false
    };

    setTasks(prev => [...prev, newTask]);
    setTaskTitle('');
    setShowAddModal(false);
  };

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isDone = h.completedDates.includes(selectedDate);
        const updatedDates = isDone
          ? h.completedDates.filter(d => d !== selectedDate)
          : [...h.completedDates, selectedDate];
        return {
          ...h,
          streak: isDone ? Math.max(0, h.streak - 1) : h.streak + 1,
          completedDates: updatedDates
        };
      }
      return h;
    }));
  };

  // Filter tasks
  const currentTasks = tasks.filter(t => {
    const matchesDate = t.date === selectedDate;
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesDate && matchesCat;
  });

  const completedCount = currentTasks.filter(t => t.completed).length;
  const progressPercent = currentTasks.length ? Math.round((completedCount / currentTasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex justify-center selection:bg-amber-200">
      <div className="w-full max-w-md min-h-screen bg-white shadow-xl flex flex-col relative pb-28">
        
        {/* Top Header */}
        <header className="p-5 pb-3 border-b border-stone-100 bg-white sticky top-0 z-20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                Daily Focus
              </span>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 mt-1">Schedule & Routines</h1>
            </div>

            <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl">
              <button 
                onClick={() => shiftDate(-1)} 
                className="p-1.5 rounded-lg hover:bg-white text-stone-600 transition"
                aria-label="Previous day"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white shadow-sm text-stone-800"
              >
                {isToday ? 'Today' : 'Go to Today'}
              </button>
              <button 
                onClick={() => shiftDate(1)} 
                className="p-1.5 rounded-lg hover:bg-white text-stone-600 transition"
                aria-label="Next day"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Current Date Display */}
          <div className="flex items-center justify-between text-stone-600 text-sm py-1">
            <span className="font-medium flex items-center gap-1.5">
              <CalendarIcon size={16} className="text-amber-600" />
              {formattedDateString}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {completedCount} of {currentTasks.length} done ({progressPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-amber-600 h-full rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-2 gap-2 mt-4 bg-stone-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'schedule' ? 'bg-white shadow text-stone-900' : 'text-stone-500'
              }`}
            >
              Timeline Schedule
            </button>
            <button 
              onClick={() => setActiveTab('habits')}
              className={`py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'habits' ? 'bg-white shadow text-stone-900' : 'text-stone-500'
              }`}
            >
              Daily Habits & Streaks
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 space-y-4 overflow-y-auto">
          {activeTab === 'schedule' ? (
            <>
              {/* Category Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap transition ${
                      selectedCategory === c.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Tasks List */}
              {currentTasks.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={22} />
                  </div>
                  <h3 className="font-semibold text-stone-800 text-sm">Clear schedule for this day!</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-[200px] mx-auto">
                    Tap the <b>+</b> button below to add activities or reminders.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {['morning', 'afternoon', 'evening'].map(period => {
                    const periodTasks = currentTasks.filter(t => t.period === period);
                    if (periodTasks.length === 0) return null;

                    const periodLabels = {
                      morning: 'Morning (Rise & Focus)',
                      afternoon: 'Afternoon (Midday & Tasks)',
                      evening: 'Evening (Unwind & Relax)'
                    };

                    return (
                      <div key={period} className="space-y-1.5">
                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider ml-1">
                          {periodLabels[period]}
                        </span>
                        {periodTasks.map(t => {
                          const catInfo = CATEGORIES.find(c => c.id === t.category);
                          return (
                            <div 
                              key={t.id} 
                              className={`flex items-center justify-between p-3 rounded-xl border transition ${
                                t.completed 
                                  ? 'bg-stone-50 border-stone-200/60 opacity-60' 
                                  : 'bg-white border-stone-200 shadow-sm hover:border-amber-300'
                              }`}
                            >
                              <div 
                                className="flex items-center space-x-3 flex-1 cursor-pointer"
                                onClick={() => toggleTask(t.id)}
                              >
                                <button className="text-stone-400 hover:text-amber-600 transition">
                                  {t.completed ? (
                                    <CheckCircle2 size={20} className="text-emerald-600" />
                                  ) : (
                                    <Circle size={20} />
                                  )}
                                </button>
                                <div>
                                  <p className={`text-sm font-semibold leading-tight ${t.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                                    {t.title}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="flex items-center text-[11px] text-stone-400 font-medium">
                                      <Clock size={11} className="mr-1" />
                                      {t.time}
                                    </span>
                                    {catInfo && (
                                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${catInfo.color}`}>
                                        {catInfo.label}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => deleteTask(t.id)}
                                className="text-stone-300 hover:text-rose-500 p-1.5 transition ml-2"
                                aria-label="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Habits Section */
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start space-x-2">
                <Sparkles size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  Consistent daily routines build lifelong wellness. Tap each habit to mark it completed for today.
                </span>
              </div>

              {habits.map(h => {
                const isDone = h.completedDates.includes(selectedDate);
                return (
                  <div 
                    key={h.id} 
                    onClick={() => toggleHabit(h.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      isDone 
                        ? 'bg-emerald-50 border-emerald-300 shadow-sm' 
                        : 'bg-white border-stone-200 hover:border-amber-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button className="text-stone-400">
                        {isDone ? (
                          <CheckCircle2 size={22} className="text-emerald-600" />
                        ) : (
                          <Circle size={22} />
                        )}
                      </button>
                      <div>
                        <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                          {h.title}
                        </h4>
                        <span className="text-[11px] text-stone-400">Repeats every day</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold">
                      <Flame size={14} className="text-amber-600 fill-amber-500" />
                      <span>{h.streak}d streak</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Floating Add Task Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-amber-700 hover:bg-amber-800 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all z-30"
          aria-label="Add task"
        >
          <Plus size={28} />
        </button>

        {/* Add Task Modal / Bottom Sheet */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 z-40 flex items-end justify-center">
            <div className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-stone-900">Add Schedule Item</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-stone-400 hover:text-stone-700 font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={addTask} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    Activity Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Morning walk, Take medicines, Call family"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={taskTime}
                      onChange={(e) => setTaskTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
                      Period of Day
                    </label>
                    <select
                      value={taskPeriod}
                      onChange={(e) => setTaskPeriod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                    >
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setTaskCategory(cat.id)}
                        className={`text-xs py-2 px-2 rounded-lg border font-medium transition text-center truncate ${
                          taskCategory === cat.id
                            ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-sm shadow-md transition active:scale-98 mt-2"
                >
                  Save Activity
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}