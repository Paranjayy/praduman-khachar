import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [cursorText, setCursorText] = useState<string | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const onMouseEnter = () => setHidden(false);
    const onMouseLeave = () => setHidden(true);
    
    const onMouseDown = () => setActive(true);
    const onMouseUp = () => setActive(false);

    // Track interaction with links/buttons and read cues
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, .interactive') as HTMLElement;
      
      if (interactive) {
        setActive(true);
        const cue = interactive.getAttribute('data-cursor-text');
        if (cue) setCursorText(cue);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      setActive(false);
      setCursorText(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (hidden) return null;

  return (
    <div 
      id="custom-cursor" 
      className={`${active ? 'active' : ''} ${hidden ? 'hidden' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }} 
    >
      {cursorText && (
        <span className="cursor-label">{cursorText}</span>
      )}
    </div>
  );
};

export default CustomCursor;
