import React, { useState, useEffect } from 'react';

/**
 * Countdown Timer component
 * @param {Object} props - CountdownTimer properties
 * @param {string|Date} props.targetDate - Target date for countdown
 * @param {function} props.onComplete - Callback when countdown completes
 * @param {string} props.label - Label to display before timer
 */
const CountdownTimer = ({ targetDate, onComplete, label = 'До выселения:' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target - now;
      
      if (difference <= 0) {
        onComplete?.();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };
    
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);
  
  const { days, hours, minutes, seconds } = timeLeft;
  
  // Color based on urgency
  const getColorClass = () => {
    if (days === 0 && hours < 6) return 'text-red-600 bg-red-50 border-red-200';
    if (days === 0) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (days === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border font-mono text-sm ${getColorClass()}`}>
      <span className="font-medium">{label}</span>
      {days > 0 && <span className="font-bold">{days}д</span>}
      <span className="font-bold">
        {String(hours).padStart(2, '0')}:
        {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default CountdownTimer;
