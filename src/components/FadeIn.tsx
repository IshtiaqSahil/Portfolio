import { motion } from 'framer-motion';
import type { CSSProperties, ElementType, ReactNode } from 'react';

type FadeInProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  [key: string]: unknown;
};

// motion.create() returns a new component each call, so cache one per element type.
const motionCache = new Map<ElementType, ElementType>();
function getMotion(as: ElementType): ElementType {
  let component = motionCache.get(as);
  if (!component) {
    component = motion.create(as as never) as unknown as ElementType;
    motionCache.set(as, component);
  }
  return component;
}

export default function FadeIn({ as = 'div', children, delay = 0, duration = 0.7, x = 0, y = 30, ...rest }: FadeInProps) {
  const Component = getMotion(as);
  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
