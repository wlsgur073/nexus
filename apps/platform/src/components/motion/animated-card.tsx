"use client";

import { motion } from "motion/react";

type AnimatedCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function AnimatedCard({
  children,
  className,
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
