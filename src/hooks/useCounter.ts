import { useState, useEffect } from 'react';

export function useCounter(
  start: number = 0, 
  end: number = 100, 
  duration: number = 2000, 
  shouldStart: boolean = true
): number {
  const [count, setCount] = useState(start);
  
  useEffect(() => {
    if (!shouldStart) {
      setCount(start);
      return;
    }
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      
      setCount(currentCount);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    const animationId = window.requestAnimationFrame(step);
    
    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [start, end, duration, shouldStart]);
  
  return count;
}