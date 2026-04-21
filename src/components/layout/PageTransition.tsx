import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { motion as motionTokens } from '@/lib/design-tokens';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: motionTokens.normal / 1000,
          ease: motionTokens.easing.easeInOut,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
