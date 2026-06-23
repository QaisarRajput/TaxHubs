'use client';

import { useEffect, useRef, useState } from 'react';

export type ScrollDirection = 'up' | 'down';

export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>('up');
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastY.current) < 8) {
        return;
      }
      setDirection(currentY > lastY.current ? 'down' : 'up');
      lastY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return direction;
}
