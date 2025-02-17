import React, { useState, useEffect } from 'react';
import { Clock, Plus, List, CheckCircle2, Trash2, Edit, RotateCcw, CheckCircle } from 'lucide-react';
import { Welcome } from './components/Welcome';
import { TaskList } from './components/TaskList';
import { TaskStats } from './components/TaskStats';
import { DateTime } from './components/DateTime';
import { useTaskAlerts } from './hooks/useTaskAlerts';

function App() {
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('userName') || '';
  });
  const [showWelcome, setShowWelcome] = useState(!userName);
  const [tasks, setTasks] = useState<Task[]>(() => {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  });
  const [completedTasks, setCompletedTasks] = useState<Task[]>(() => {
    return JSON.parse(localStorage.getItem('completedTasks') || '[]');
  });
  const [showTaskList, setShowTaskList] = useState(false);

  // Initialize task alerts
  useTaskAlerts(tasks);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    setShowWelcome(false);
  };

  const resetApp = () => {
    if (window.confirm('Are you sure you want to reset the app? This will remove all tasks and your name.')) {
      localStorage.clear();
      setUserName('');
      setTasks([]);
      setCompletedTasks([]);
      setShowWelcome(true);
      setShowTaskList(false);
    }
  };

  if (showWelcome) {
    return <Welcome onSubmit={handleNameSubmit} />;
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2940')] bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen backdrop-blur-sm bg-gradient-to-br from-indigo-900/80 to-purple-900/80">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  Welcome back, {userName}! 👋
                </h1>
                <DateTime />
              </div>
              <button
                onClick={resetApp}
                className="text-white/80 hover:text-red-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
                title="Reset App"
              >
                <RotateCcw size={24} />
              </button>
            </div>

            <TaskStats tasks={tasks} completedTasks={completedTasks} />

            {!showTaskList ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <button
                  onClick={() => setShowTaskList(true)}
                  className="group flex items-center justify-center gap-3 p-8 bg-gradient-to-br from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/10 hover:border-white/20"
                >
                  <Plus className="text-white group-hover:rotate-90 transition-transform duration-300" size={32} />
                  <span className="text-2xl font-semibold text-white">Add New Task</span>
                </button>
                <button
                  onClick={() => setShowTaskList(true)}
                  className="group flex items-center justify-center gap-3 p-8 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/10 hover:border-white/20"
                >
                  <List className="text-white group-hover:translate-x-2 transition-transform duration-300" size={32} />
                  <span className="text-2xl font-semibold text-white">View Task List</span>
                </button>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                setTasks={setTasks}
                completedTasks={completedTasks}
                setCompletedTasks={setCompletedTasks}
                onBack={() => setShowTaskList(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;