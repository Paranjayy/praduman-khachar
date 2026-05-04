import { useState, useCallback, useRef } from 'react';

export function useTilt(intensity = 10) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * intensity;
    const rotateY = ((centerX - x) / centerX) * intensity;
    
    setTilt({ x: rotateX, y: rotateY });
  }, [intensity]);

  const onMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    onMouseMove,
    onMouseLeave,
    style: {
      transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease-out' : 'none'
    }
  };
}
