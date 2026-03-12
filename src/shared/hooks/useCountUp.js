import { useEffect, useState } from 'react';

const useCountUp = (end, duration = 2000, isActive = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, isActive]);

  return count;
};

export default useCountUp;
