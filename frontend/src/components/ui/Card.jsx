import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  gradient = false,
  padding = true,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      className={`
        relative rounded-2xl overflow-hidden
        ${gradient ? 'gradient-border' : ''}
        glass
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-dark-700/50 ${className}`}>
      {children}
    </div>
  );
}
