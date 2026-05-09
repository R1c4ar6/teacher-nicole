import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: `
    bg-[var(--color-accent)] text-white 
    hover:bg-[var(--color-accent-hover)] 
    active:scale-[0.98] active:brightness-95
    shadow-[0_2px_8px_rgba(196,165,116,0.25)]
    hover:shadow-[0_4px_16px_rgba(196,165,116,0.35)]
  `,
  secondary: `
    bg-[var(--color-surface)] text-[var(--color-text-primary)] 
    border border-[var(--color-border)]
    hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]
    hover:bg-[var(--color-accent-soft)]
    active:scale-[0.98]
  `,
  ghost: `
    text-[var(--color-text-secondary)]
    hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)]
    active:scale-[0.98]
  `,
  danger: `
    bg-[var(--color-error)] text-white
    hover:brightness-110
    active:scale-[0.98]
  `,
  outline: `
    border-2 border-[var(--color-accent)] text-[var(--color-accent)]
    hover:bg-[var(--color-accent)] hover:text-white
    active:scale-[0.98]
  `,
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs h-7',
  sm: 'px-4 py-2 text-sm h-9',
  md: 'px-5 py-2.5 text-sm h-11',
  lg: 'px-6 py-3 text-base h-12',
  xl: 'px-8 py-4 text-base h-14',
};

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-md)]
        transition-all duration-200 ease-out cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
