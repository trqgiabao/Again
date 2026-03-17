import { useEffect, useRef, useState } from 'react';

const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

export default useScrollReveal;
