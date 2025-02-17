import React from 'react';
import { Task } from '../types';
import { CheckCircle2, ListTodo } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
  completedTasks: Task[];
}

export function TaskStats({ tasks, completedTasks }: TaskStatsProps) {
  const totalTasks = tasks.length + completedTasks.length;
  const completionRate = totalTasks === 0 ? 0 : (completedTasks.length / totalTasks) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/20 p-4 rounded-lg flex items-center gap-3">
        <ListTodo className="text-white" size={24} />
        <div>
          <p className="text-white/70 text-sm">Active Tasks</p>
          <p className="text-2xl font-bold text-white">{tasks.length}</p>
        </div>
      </div>
      
      <div className="bg-white/20 p-4 rounded-lg flex items-center gap-3">
        <CheckCircle2 className="text-white" size={24} />
        <div>
          <p className="text-white/70 text-sm">Completed Tasks</p>
          <p className="text-2xl font-bold text-white">{completedTasks.length}</p>
        </div>
      </div>

      <div className="bg-white/20 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white/70 text-sm">Completion Rate</p>
          <p className="text-white font-bold">{completionRate.toFixed(0)}%</p>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}