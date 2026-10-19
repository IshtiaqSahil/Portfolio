import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';

type AnimatedTextProps = { text: string; className?: string; style?: CSSProperties };

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const chars = text.split('');

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((char, i) => {
        const start = i / chars.length;
        return (
          <Char key={i} progress={scrollYProgress} range={[start, start + 1 / chars.length]}>
            {char}
          </Char>
        );
      })}
    </p>
  );
}

function Char({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="invisible">{children}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
}
