import { useEffect, useRef } from 'react';
import { Task } from '../types';

export function useTaskAlerts(tasks: Task[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notifiedTasksRef = useRef<Set<string>>(new Set());
  const alertTimeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    // Create audio element for alerts if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-classic-alarm-995.mp3');
      audioRef.current.loop = true;
    }

    // Check for overdue tasks and upcoming deadlines
    const checkDeadlines = () => {
      const now = new Date();
      
      tasks.forEach(task => {
        const deadline = new Date(task.dueDate);
        const timeUntilDeadline = deadline.getTime() - now.getTime();
        
        // Clear existing timeout for this task
        if (alertTimeoutsRef.current[task.id]) {
          clearTimeout(alertTimeoutsRef.current[task.id]);
          delete alertTimeoutsRef.current[task.id];
        }

        // Set up alerts for upcoming deadlines (5 minutes before)
        if (timeUntilDeadline > 0 && timeUntilDeadline <= 300000) { // 5 minutes in milliseconds
          alertTimeoutsRef.current[task.id] = setTimeout(() => {
            if (!notifiedTasksRef.current.has(`${task.id}-upcoming`)) {
              new Notification('Task Deadline Approaching', {
                body: `"${task.title}" is due in 5 minutes!`,
                icon: '/vite.svg'
              });
              notifiedTasksRef.current.add(`${task.id}-upcoming`);
            }
          }, timeUntilDeadline - 300000);
        }
        
        // Check if task is overdue and hasn't been notified yet
        if (deadline < now && !notifiedTasksRef.current.has(task.id)) {
          // Play alarm sound
          audioRef.current?.play();
          
          // Show browser notification if permitted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Task Deadline Passed', {
              body: `The task "${task.title}" is overdue!`,
              icon: '/vite.svg',
              requireInteraction: true
            });
          }
          
          // Mark task as notified
          notifiedTasksRef.current.add(task.id);
          
          // Show alert dialog
          const alertResult = window.confirm(
            `Task Deadline Passed: ${task.title}\n\nWould you like to mark this task as complete?`
          );
          
          // Stop sound after alert is acknowledged
          audioRef.current?.pause();
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }

          // If user chooses to complete the task, trigger completion
          if (alertResult) {
            // We'll handle this in the component
            document.dispatchEvent(new CustomEvent('completeTask', { detail: task }));
          }
        }
      });
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Initial check
    checkDeadlines();

    // Set up interval for checking deadlines
    const intervalId = setInterval(checkDeadlines, 30000); // Check every 30 seconds

    // Cleanup
    return () => {
      clearInterval(intervalId);
      // Clear all timeouts
      Object.values(alertTimeoutsRef.current).forEach(clearTimeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [tasks]);

  // Reset notifications when tasks change
  useEffect(() => {
    notifiedTasksRef.current = new Set();
    // Clear all timeouts
    Object.values(alertTimeoutsRef.current).forEach(clearTimeout);
    alertTimeoutsRef.current = {};
  }, [tasks]);
}