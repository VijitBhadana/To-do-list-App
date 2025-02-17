import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Task } from '../types';
import { TaskForm } from './TaskForm';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  completedTasks: Task[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onBack: () => void;
}

export function TaskList({ tasks, setTasks, completedTasks, setCompletedTasks, onBack }: TaskListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    // Listen for completeTask events from the alert system
    const handleCompleteTask = (event: CustomEvent<Task>) => {
      handleCompleteTask(event.detail);
    };

    document.addEventListener('completeTask', handleCompleteTask as EventListener);
    return () => {
      document.removeEventListener('completeTask', handleCompleteTask as EventListener);
    };
  }, []);

  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
    setShowAddForm(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const handleCompleteTask = (task: Task) => {
    setTasks(prev => prev.filter(t => t.id !== task.id));
    setCompletedTasks(prev => [...prev, { ...task, completedAt: new Date().toISOString() }]);
  };

  const getTimeStatus = (dueDate: string) => {
    const now = new Date();
    const deadline = new Date(dueDate);
    const diff = deadline.getTime() - now.getTime();
    const minutesLeft = Math.floor(diff / 60000);

    if (diff < 0) return { status: 'overdue', text: 'Overdue' };
    if (minutesLeft <= 5) return { status: 'urgent', text: 'Due very soon' };
    if (minutesLeft <= 30) return { status: 'warning', text: 'Due soon' };
    return { status: 'normal', text: new Date(dueDate).toLocaleString() };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-500/90 hover:to-purple-500/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>

      {showAddForm && (
        <TaskForm onSubmit={handleAddTask} onCancel={() => setShowAddForm(false)} />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={handleEditTask}
          onCancel={() => setEditingTask(null)}
        />
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Active Tasks</h2>
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <button
          onClick={() => setShowAddForm(true)}>
              <Plus className="w-8 h-8 text-black/60" />
              </button>
            </div>
            <p className="text-white/70 text-lg">No active tasks. Time to add some! 🎯</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => {
              const timeStatus = getTimeStatus(task.dueDate);
              const statusColors = {
                overdue: 'border-red-500/50 bg-red-500/10',
                urgent: 'border-orange-500/50 bg-orange-500/10',
                warning: 'border-yellow-500/50 bg-yellow-500/10',
                normal: 'border-white/10 bg-white/10'
              };

              return (
                <div
                  key={task.id}
                  className={`border p-4 rounded-lg flex items-center justify-between gap-4 transition-all duration-300 hover:bg-white/20 ${
                    statusColors[timeStatus.status]
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{task.title}</h3>
                      {timeStatus.status !== 'normal' && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          timeStatus.status === 'overdue' ? 'bg-red-500/20 text-red-300' :
                          timeStatus.status === 'urgent' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {timeStatus.text}
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm mt-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Clock size={14} className={`${
                        timeStatus.status === 'overdue' ? 'text-red-400' :
                        timeStatus.status === 'urgent' ? 'text-orange-400' :
                        timeStatus.status === 'warning' ? 'text-yellow-400' :
                        'text-white/70'
                      }`} />
                      <span className={`${
                        timeStatus.status === 'overdue' ? 'text-red-400' :
                        timeStatus.status === 'urgent' ? 'text-orange-400' :
                        timeStatus.status === 'warning' ? 'text-yellow-400' :
                        'text-white/70'
                      }`}>
                        Due: {timeStatus.text}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCompleteTask(task)}
                      className="text-green-400 hover:text-green-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
                      title="Complete Task"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-white hover:text-white/80 transition-colors p-2 hover:bg-white/10 rounded-lg"
                      title="Edit Task"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
                      title="Delete Task"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Completed Tasks</h2>
        {completedTasks.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white/60" />
            </div>
            <p className="text-white/70 text-lg">No completed tasks yet. Keep going! 💪</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedTasks.map(task => (
              <div
                key={task.id}
                className="bg-white/5 border border-white/5 p-4 rounded-lg transition-all duration-300 hover:bg-white/10"
              >
                <h3 className="text-white/50 font-medium line-through">{task.title}</h3>
                <p className="text-white/40 text-sm line-through">{task.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle size={14} className="text-green-400/60" />
                  <p className="text-white/40 text-sm">
                    Completed: {new Date(task.completedAt!).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}