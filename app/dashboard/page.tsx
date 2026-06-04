'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task, Status } from '../types';
import { initialTasks } from '../data/tasks';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const statusConfig: Record<Status, { badge: string; dot: string; glow: string }> = {
  'Todo': { badge: 'bg-slate-700/60 text-slate-300 border-slate-600/40', dot: 'bg-slate-400', glow: 'rgba(148,163,184,0.3)' },
  'In Progress': { badge: 'bg-blue-900/60 text-blue-300 border-blue-500/30', dot: 'bg-blue-400', glow: 'rgba(96,165,250,0.4)' },
  'Completed': { badge: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400', glow: 'rgba(52,211,153,0.4)' },
};

const statusConfigLight: Record<Status, { badge: string; dot: string; glow: string }> = {
  'Todo': { badge: 'bg-slate-100 text-slate-600 border-slate-300', dot: 'bg-slate-400', glow: 'rgba(148,163,184,0.3)' },
  'In Progress': { badge: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500', glow: 'rgba(96,165,250,0.4)' },
  'Completed': { badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500', glow: 'rgba(52,211,153,0.4)' },
};

const TASKS_PER_PAGE = 4;

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [username, setUsername] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ title: '', description: '', status: 'Todo' as Status, dueDate: '' });

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) router.push('/login');
    else setUsername(localStorage.getItem('username') || '');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const resetForm = () => {
    setForm({ title: '', description: '', status: 'Todo', dueDate: '' });
    setEditingTask(null);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description, status: task.status, dueDate: task.dueDate });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.dueDate) return;
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...form } : t));
    } else {
      setTasks([...tasks, { id: Date.now().toString(), ...form }]);
    }
    setIsDialogOpen(false);
    resetForm();
    setCurrentPage(1);
  };

  const filteredTasks = tasks
    .filter(t => filterStatus === 'All' || t.status === filterStatus)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortOrder === 'asc'
      ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );

  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * TASKS_PER_PAGE, currentPage * TASKS_PER_PAGE);

  const counts = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  };

  const completionPct = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;
  const dm = darkMode;

  return (
    <div className={`min-h-screen ${dm ? 'text-white' : 'text-slate-800'} relative`}>
      {/* Background - Pure CSS, no image */}
      {dm ? (
        <div className="fixed inset-0 bg-[#0d0d1a] overflow-hidden">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-purple-900/35 rounded-full filter blur-[130px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/30 rounded-full filter blur-[130px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-900/15 rounded-full filter blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      ) : (
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-slate-50" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/60 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/60 rounded-full filter blur-[100px]" />
        </div>
      )}

      {/* Header */}
      <header className={`relative z-10 border-b ${dm ? 'border-white/8 bg-white/3' : 'border-slate-200 bg-white/80'} backdrop-blur-xl sticky top-0`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className={`text-xl font-bold tracking-tight ${dm ? 'text-white' : 'text-slate-800'}`}>TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggle */}
            <button
              onClick={() => setDarkMode(!dm)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${dm ? 'bg-purple-600' : 'bg-slate-200'} flex items-center px-1`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 flex items-center justify-center text-xs ${dm ? 'translate-x-7' : 'translate-x-0'}`}>
                {dm ? '🌙' : '☀️'}
              </div>
            </button>
            <div className={`flex items-center gap-2 ${dm ? 'bg-white/8 border-white/10' : 'bg-white border-slate-200'} border rounded-full pl-1 pr-3 py-1`}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                {username[0]?.toUpperCase()}
              </div>
              <span className={`text-sm ${dm ? 'text-white/60' : 'text-slate-600'}`}>{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className={`text-sm border px-4 py-2 rounded-xl transition-all ${dm ? 'text-white/40 hover:text-white border-white/10 hover:border-white/20' : 'text-slate-500 hover:text-slate-800 border-slate-200 hover:border-slate-300'}`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h2 className={`text-3xl font-bold ${dm ? 'text-white' : 'text-slate-800'}`}>My Workspace</h2>
          <p className={`text-sm mt-1 ${dm ? 'text-white/35' : 'text-slate-400'}`}>Track, manage and crush your tasks 🚀</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Tasks', value: counts.total, icon: '📋', darkBg: 'bg-white/5 border-white/8', lightBg: 'bg-white border-slate-200 shadow-sm' },
            { label: 'Todo', value: counts.todo, icon: '⏳', darkBg: 'bg-slate-800/50 border-slate-600/20', lightBg: 'bg-slate-50 border-slate-200 shadow-sm' },
            { label: 'In Progress', value: counts.inProgress, icon: '⚡', darkBg: 'bg-blue-950/60 border-blue-500/20', lightBg: 'bg-blue-50 border-blue-200 shadow-sm' },
            { label: 'Completed', value: counts.completed, icon: '✅', darkBg: 'bg-emerald-950/60 border-emerald-500/20', lightBg: 'bg-emerald-50 border-emerald-200 shadow-sm' },
          ].map((stat) => (
            <div key={stat.label} className={`${dm ? stat.darkBg : stat.lightBg} backdrop-blur-md border rounded-2xl p-5`}>
              <div className="text-2xl mb-3">{stat.icon}</div>
              <p className={`text-3xl font-bold ${dm ? 'text-white' : 'text-slate-800'}`}>{stat.value}</p>
              <p className={`text-sm mt-1 ${dm ? 'text-white/40' : 'text-slate-500'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className={`${dm ? 'bg-white/5 border-white/8' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-md border rounded-2xl p-5`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-sm font-medium ${dm ? 'text-white/45' : 'text-slate-500'}`}>Overall Progress</span>
            <span className={`text-sm font-bold ${dm ? 'text-white' : 'text-slate-800'}`}>{completionPct}% Complete</span>
          </div>
          <div className={`h-2.5 ${dm ? 'bg-white/8' : 'bg-slate-100'} rounded-full overflow-hidden`}>
            <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-700" style={{ width: `${completionPct}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${dm ? 'text-white/25' : 'text-slate-400'}`}>{counts.completed} of {counts.total} done</span>
            <span className={`text-xs ${dm ? 'text-white/25' : 'text-slate-400'}`}>{counts.total - counts.completed} remaining</span>
          </div>
        </div>

        {/* Filters */}
        <div className={`${dm ? 'bg-white/5 border-white/8' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-md border rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between`}>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dm ? 'text-white/25' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className={`pl-9 w-52 rounded-xl ${dm ? 'bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-400'}`}
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
              <SelectTrigger className={`w-40 rounded-xl ${dm ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${dm ? 'bg-[#1a1a2e] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                <SelectItem value="All">All Tasks</SelectItem>
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'asc' | 'desc')}>
              <SelectTrigger className={`w-48 rounded-xl ${dm ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${dm ? 'bg-[#1a1a2e] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                <SelectItem value="asc">Due Date ↑ Earliest</SelectItem>
                <SelectItem value="desc">Due Date ↓ Latest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => { resetForm(); setIsDialogOpen(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 hover:scale-[1.02]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          {paginatedTasks.length === 0 && (
            <div className={`${dm ? 'bg-white/3 border-white/8' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-md border rounded-2xl p-16 text-center`}>
              <p className="text-5xl mb-4">🔍</p>
              <p className={`text-lg font-medium ${dm ? 'text-white/35' : 'text-slate-400'}`}>No tasks found</p>
              <p className={`text-sm mt-1 ${dm ? 'text-white/20' : 'text-slate-300'}`}>Try a different filter or add a new task</p>
            </div>
          )}
          {paginatedTasks.map((task) => {
            const cfg = dm ? statusConfig[task.status] : statusConfigLight[task.status];
            return (
              <div key={task.id} className={`group ${dm ? 'bg-white/4 hover:bg-white/7 border-white/8 hover:border-white/15' : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'} backdrop-blur-md border rounded-2xl p-5 flex flex-wrap gap-4 items-center justify-between transition-all duration-200`}>
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`} style={{ boxShadow: `0 0 8px 2px ${cfg.glow}` }} />
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold ${dm ? 'text-white/85 group-hover:text-white' : 'text-slate-800'} transition-colors`}>{task.title}</h3>
                    <p className={`text-sm mt-0.5 truncate ${dm ? 'text-white/35' : 'text-slate-400'}`}>{task.description}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <svg className={`w-3 h-3 ${dm ? 'text-white/20' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className={`text-xs ${dm ? 'text-white/25' : 'text-slate-400'}`}>{task.dueDate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${cfg.badge}`}>{task.status}</span>
                  <Select value={task.status} onValueChange={(v) => setTasks(tasks.map(t => t.id === task.id ? { ...t, status: v as Status } : t))}>
                    <SelectTrigger className={`w-36 rounded-xl text-sm h-9 ${dm ? 'bg-white/5 border-white/10 text-white/60' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`${dm ? 'bg-[#1a1a2e] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                      <SelectItem value="Todo">Todo</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <button onClick={() => handleOpenEdit(task)} className={`text-sm border px-3 py-1.5 rounded-xl transition-all ${dm ? 'text-white/35 hover:text-purple-300 border-white/8 hover:border-purple-500/40' : 'text-slate-500 hover:text-purple-600 border-slate-200 hover:border-purple-300'}`}>Edit</button>
                  <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className={`text-sm border px-3 py-1.5 rounded-xl transition-all ${dm ? 'text-white/35 hover:text-red-400 border-white/8 hover:border-red-500/40' : 'text-slate-500 hover:text-red-500 border-slate-200 hover:border-red-300'}`}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pb-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${currentPage === page
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                  : dm ? 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/8' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className={`${dm ? 'bg-[#13131f] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'} backdrop-blur-2xl rounded-2xl sm:max-w-md shadow-2xl`}>
          <DialogHeader>
            <DialogTitle className={`text-lg ${dm ? 'text-white' : 'text-slate-800'}`}>
              {editingTask ? '✏️ Edit Task' : '✨ Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-slate-500'}`}>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" className={`rounded-xl ${dm ? 'bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-400'}`} />
            </div>
            <div className="space-y-1.5">
              <Label className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-slate-500'}`}>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add some details..." className={`rounded-xl ${dm ? 'bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-400'}`} />
            </div>
            <div className="space-y-1.5">
              <Label className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-slate-500'}`}>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
                <SelectTrigger className={`rounded-xl ${dm ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${dm ? 'bg-[#1a1a2e] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                  <SelectItem value="Todo">Todo</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-slate-500'}`}>Due Date</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className={`rounded-xl ${dm ? 'bg-white/5 border-white/10 text-white focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-400'}`} />
            </div>
            <button onClick={handleSave} className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 hover:scale-[1.02]">
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}