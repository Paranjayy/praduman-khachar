import { useEffect, useRef } from "react";

interface Props {
  items: string[];
  speed?: number; // px per second
  separator?: string;
}

export default function Marquee({ items, speed = 60, separator = "·" }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const fullWidth = track.scrollWidth / 2;
    let start: number | null = null;
    let pos = 0;
    let raf: number;

    function step(ts: number) {
      if (start === null) start = ts;
      pos = ((ts - start) * speed) / 1000;
      if (pos >= fullWidth) start = ts; // loop
      if (track) track.style.transform = `translateX(-${pos % fullWidth}px)`;
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  const all = [...items, ...items]; // duplicate for seamless loop

  return (
    <div className="marquee-outer" aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {all.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <span className="marquee-sep">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
