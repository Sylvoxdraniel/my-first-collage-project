import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    icon: Icon,
    type = 'text',
    className = '',
    ...props
  },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-dark-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-dark-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full rounded-xl border bg-dark-800/50 text-white placeholder-dark-500
            focus:outline-none focus:ring-2 transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm
            ${error
              ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500'
              : 'border-dark-600/50 focus:ring-primary-500/30 focus:border-primary-500'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
});

export default Input;
