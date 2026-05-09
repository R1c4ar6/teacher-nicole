const variants = {
  default: 'bg-[var(--color-secondary)] text-[var(--color-text-secondary)]',
  success: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
  error: 'bg-[var(--color-error)]/10 text-[var(--color-error)]',
  warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
  accent: 'bg-[var(--color-accent)] text-white',
  outline: 'border border-[var(--color-border)] text-[var(--color-text-secondary)]',
};

export const Badge = ({
  children,
  variant = 'default',
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
