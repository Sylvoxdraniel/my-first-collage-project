import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25',
  secondary: 'bg-dark-700 hover:bg-dark-600 text-dark-100 border border-dark-600',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30',
  ghost: 'bg-transparent hover:bg-dark-700/50 text-dark-300 hover:text-white',
  accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/25',
  gradient: 'gradient-primary text-white shadow-lg shadow-primary-500/25',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-colors duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </motion.button>
  );
}
