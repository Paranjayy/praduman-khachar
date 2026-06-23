import { useEffect, useRef, useState } from "react";

interface Props {
  target: number;
  suffix?: string;
  duration?: number;
  /** Number of decimal places to display (0 = integer, 1 = one decimal like 1.2K) */
  decimal?: number;
}

export default function AnimatedCounter({ target, suffix = "", duration = 1800, decimal = 0 }: Props) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const totalFrames = duration / 16;
    const timer = setInterval(() => {
      frame++;
      // Ease-out curve
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      const current = Math.round(target * progress);
      setCount(current);
      if (frame >= totalFrames) {
        setCount(target);
        clearInterval(timer);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  const displayValue = decimal > 0
    ? (count / Math.pow(10, decimal)).toFixed(decimal)
    : count.toLocaleString();

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}
