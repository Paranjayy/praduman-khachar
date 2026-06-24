import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggeredRevealProps {
  children: ReactNode[];
  className?: string;
  delay?: number;
  stagger?: number;
}

export function StaggeredReveal({ 
  children, 
  className = '', 
  delay = 0, 
  stagger = 0.1 
}: StaggeredRevealProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
