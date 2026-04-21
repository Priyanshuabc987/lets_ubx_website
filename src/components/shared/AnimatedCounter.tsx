
"use client";

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  animationOptions?: object;
  format?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({ 
  from = 0, 
  to, 
  animationOptions,
  format = (value) => Math.round(value).toLocaleString(),
  className
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !inViewRef.current) {
            inViewRef.current = true;

            const controls = animate(from, to, {
              duration: 2,
              ease: 'easeOut',
              ...animationOptions,
              onUpdate(value) {
                if (node) {
                  node.textContent = format(value);
                }
              },
            });

            observer.disconnect(); 
          }
        });
      },
      { threshold: 0.1 } 
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [from, to, animationOptions, format]);

  return <span ref={nodeRef} className={className} />; 
}
