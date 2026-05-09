export const easings = {
  easeOut: [0, 0, 0.2, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  spring: { type: "spring" as const, stiffness: 400, damping: 25 },
  springSoft: { type: "spring" as const, stiffness: 300, damping: 30 },
  bounce: { type: "spring" as const, stiffness: 500, damping: 15 },
};

export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  slower: 0.5,
  celebratory: 0.8,
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: durations.slow, ease: easings.easeOut },
};

export const slideTransition = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: { duration: durations.slow, ease: easings.easeInOut },
};

export const cardSwipe = {
  drag: {
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 0.9,
  },
  swipeLeft: {
    x: -500,
    opacity: 0,
    rotate: -30,
    transition: { duration: 0.4, ease: easings.easeOut },
  },
  swipeRight: {
    x: 500,
    opacity: 0,
    rotate: 30,
    transition: { duration: 0.4, ease: easings.easeOut },
  },
  snapBack: {
    x: 0,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
};

export const buttonTap = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.02 },
  transition: { duration: durations.instant },
};

export const buttonPress = {
  whileTap: { scale: 0.92, y: 2 },
  transition: { duration: durations.instant },
};

export const matchCelebration = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  modal: {
    initial: { scale: 0.5, opacity: 0, y: 50 },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 400, damping: 20, delay: 0.1 }
    },
  },
  title: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3, duration: 0.4 },
  },
  avatarLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: "spring" as const, stiffness: 300, damping: 20, delay: 0.2 },
  },
  avatarRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: "spring" as const, stiffness: 300, damping: 20, delay: 0.2 },
  },
  floatingHearts: {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [0, -100],
    },
    transition: { duration: 1.5, repeat: Infinity, delay: 0.5 },
  },
};

export const listItem = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: durations.normal },
};

export const staggerList = {
  animate: {
    transition: { staggerChildren: 0.05 },
  },
};

export const skeletonPulse = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};
