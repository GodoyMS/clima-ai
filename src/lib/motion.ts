import type { Variants } from 'framer-motion'

// ---------------------------------------------------------------------------
// Basic fade
// ---------------------------------------------------------------------------

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export const fadeInFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

// ---------------------------------------------------------------------------
// Slide variants
// ---------------------------------------------------------------------------

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ---------------------------------------------------------------------------
// Scale
// ---------------------------------------------------------------------------

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
  },
}

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
}

export const scalePop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

// ---------------------------------------------------------------------------
// Stagger containers
// ---------------------------------------------------------------------------

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

// ---------------------------------------------------------------------------
// Page transition
// ---------------------------------------------------------------------------

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

export const pageSlide: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.3 },
  },
}

// ---------------------------------------------------------------------------
// Card / list item
// ---------------------------------------------------------------------------

export const cardVariant: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const listItem: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

// ---------------------------------------------------------------------------
// Notification / toast-like pop
// ---------------------------------------------------------------------------

export const notificationPop: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 22 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -10,
    transition: { duration: 0.2 },
  },
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

export const sidebarVariant: Variants = {
  open: {
    width: '16rem',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  closed: {
    width: '4.5rem',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
}

export const sidebarLabel: Variants = {
  open: {
    opacity: 1,
    x: 0,
    display: 'block',
    transition: { delay: 0.1, duration: 0.2 },
  },
  closed: {
    opacity: 0,
    x: -8,
    transitionEnd: { display: 'none' },
    transition: { duration: 0.15 },
  },
}

// ---------------------------------------------------------------------------
// Progress / number count animation
// ---------------------------------------------------------------------------

export const progressBar: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: (value: number) => ({
    scaleX: value / 100,
    originX: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  }),
}

// ---------------------------------------------------------------------------
// Modal / dialog overlay
// ---------------------------------------------------------------------------

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: { duration: 0.2 },
  },
}

// ---------------------------------------------------------------------------
// Hover / tap helpers (not Variants, but reusable motion props)
// ---------------------------------------------------------------------------

export const hoverScale = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 400, damping: 20 },
}

export const hoverLift = {
  whileHover: { y: -3, boxShadow: '0 8px 30px oklch(0.23 0.09 243 / 15%)' },
  whileTap: { y: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
}

export const tapPress = {
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
}
