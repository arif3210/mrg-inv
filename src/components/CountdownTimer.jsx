import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate = '2026-12-24T10:00:00' }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 my-6" data-physics-obstacle="true">
      {units.map((unit, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center w-16 sm:w-20 py-2.5 sm:py-3.5 rounded-2xl bg-white/90 border border-black/[0.06] shadow-apple-card transition-all duration-300 hover:shadow-apple-card-hover hover:-translate-y-0.5"
        >
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#86868b] uppercase tracking-wider font-semibold mt-0.5">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
