'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedIcon({ children, className }: AnimatedIconProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
