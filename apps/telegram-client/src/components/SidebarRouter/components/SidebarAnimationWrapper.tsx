"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

export default function SidebarAnimationWrapper({
  children,
  isBack,
}: {
  children: ReactNode;
  isBack: boolean;
}) {
  const sidebarVariants: Variants = {
    forwardInitial: { opacity: 0, x: 20 },
    forwardAnimate: { opacity: 1, x: 0 },
    forwardExit: { opacity: 0, x: 0 },

    backInitial: { opacity: 0, x: -20 },
    backAnimate: { opacity: 1, x: 0 },
    backExit: { opacity: 0, x: 0 },
  };

  return (
    <motion.div
      className="w-full h-full absolute"
      variants={sidebarVariants}
      initial={isBack ? "backInitial" : "forwardInitial"}
      animate={isBack ? "backAnimate" : "forwardAnimate"}
      exit={isBack ? "backExit" : "forwardExit"}
      transition={{ duration: 0.1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
