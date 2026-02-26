"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

const variants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
};

export function SectionShell({
  children,
  className,
  delay = 0,
  id,
}: SectionShellProps) {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.18,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
