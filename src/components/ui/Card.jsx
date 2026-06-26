export const Card = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  hover = false,
  ...props
}) => {
  const baseClasses = `
    rounded-[var(--radius-lg)] p-6 
    transition-all duration-300 ease-out
  `;

  const variantClasses = {
    default: `
      bg-[var(--color-surface)] 
      border border-[var(--color-border-light)]
      shadow-sm
    `,
    elevated: `
      bg-[var(--color-surface)] 
      shadow-md hover:shadow-xl
    `,
    outlined: `
      bg-transparent 
      border-2 border-[var(--color-border)]
      hover:border-[var(--color-accent)]
    `,
    accent: `
      bg-[var(--color-surface)] 
      border-2 border-[var(--color-accent)]
      shadow-[0_4px_20px_rgba(196,165,116,0.15)]
    `,
    filled: `
      bg-[var(--color-secondary)]
    `,
  };

  const hoverClasses = hover || onClick ? `
    cursor-pointer
    hover:-translate-y-1 
    hover:shadow-lg
    active:scale-[0.99]
  ` : '';

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${hoverClasses}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-(--color-text-primary) ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-border ${className}`}>
    {children}
  </div>
);
