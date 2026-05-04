import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInteractive, setIsInteractive] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, .interactive, [data-cursor-text]') as HTMLElement;
      
      if (interactive) {
        setIsInteractive(true);
        const cue = interactive.getAttribute('data-cursor-text');
        setCursorText(cue);
      } else {
        setIsInteractive(false);
        setCursorText(null);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, []);

  const shouldShowCustom = isInteractive || !!cursorText;

  useEffect(() => {
    if (shouldShowCustom) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }
  }, [shouldShowCustom]);

  if (!shouldShowCustom) return null;

  return (
    <div 
      id="custom-cursor" 
      className={`${isMouseDown ? 'active' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        opacity: shouldShowCustom ? 1 : 0,
        transform: `translate(-50%, -50%) scale(${isMouseDown ? 0.8 : 1})`,
        transition: 'opacity 0.2s, transform 0.1s',
        pointerEvents: 'none',
        zIndex: 99999
      }} 
    >
      {cursorText && (
        <span className="cursor-label">{cursorText}</span>
      )}
    </div>
  );
};

export default CustomCursor;
