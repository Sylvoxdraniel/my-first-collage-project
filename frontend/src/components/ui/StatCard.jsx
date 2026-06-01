import { motion } from 'framer-motion';
import { HiArrowSmUp, HiArrowSmDown } from 'react-icons/hi';

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  delay = 0,
}) {
  const colors = {
    primary: {
      bg: 'from-primary-500/20 to-primary-600/5',
      icon: 'bg-primary-500/20 text-primary-400',
      border: 'border-primary-500/20',
      glow: 'shadow-primary-500/5',
    },
    accent: {
      bg: 'from-accent-500/20 to-accent-600/5',
      icon: 'bg-accent-500/20 text-accent-400',
      border: 'border-accent-500/20',
      glow: 'shadow-accent-500/5',
    },
    blue: {
      bg: 'from-blue-500/20 to-blue-600/5',
      icon: 'bg-blue-500/20 text-blue-400',
      border: 'border-blue-500/20',
      glow: 'shadow-blue-500/5',
    },
    amber: {
      bg: 'from-amber-500/20 to-amber-600/5',
      icon: 'bg-amber-500/20 text-amber-400',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/5',
    },
  };

  const c = colors[color] || colors.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        relative rounded-2xl overflow-hidden
        bg-gradient-to-br ${c.bg}
        border ${c.border}
        backdrop-blur-sm p-6
        shadow-xl ${c.glow}
      `}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-dark-400">{label}</p>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.h3>
          {trendValue && (
            <div className="flex items-center gap-1">
              {trend === 'up' ? (
                <HiArrowSmUp className="w-4 h-4 text-accent-400" />
              ) : (
                <HiArrowSmDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-accent-400' : 'text-red-400'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl ${c.icon}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </motion.div>
  );
}
