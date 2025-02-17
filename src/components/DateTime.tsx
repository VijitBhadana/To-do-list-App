import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function DateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex items-center gap-2 text-white/80">
      <Clock size={16} />
      <span>{formatDate(dateTime)}</span>
      <span>•</span>
      <span>{formatTime(dateTime)}</span>
    </div>
  );
}