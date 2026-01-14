'use client';
import React, { useState, useEffect } from 'react';

const useCountAnimation = (end, duration = 2000, shouldStart) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration, shouldStart]);

  return count;
};

const stats = [
  {
    value: 6,
    suffix: '+',
    label: 'Years Of Experience'
  },
  {
    value: 50,
    prefix: '>',
    label: 'Hiring Campaigns Completed'

  },
  {
    value: 390,
    suffix: '+',
    label: 'Clients Partnered'
  },
  {
    value: 520,
    suffix: '+',
    label: 'Professionals Trained'
  }
];

export function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const animatedValues = stats.map(stat => useCountAnimation(stat.value, 2000, isVisible));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            entry.target.classList.add('show');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    const element = document.querySelector('.stats-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`stats-container mx-3 sm:mx-52 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 shadow-lg mb-16 opacity-0 translate-y-8 transition-all   duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">
              {stat.prefix}{animatedValues[index]}{stat.suffix}
            </div>
            <div className="text-sm md:text-base opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}