import { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helper,
  className = '',
  inputClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-3 
          bg-[var(--color-surface)] 
          border border-[var(--color-border)]
          rounded-[var(--radius-md)]
          text-[var(--color-text-primary)] 
          placeholder:text-[var(--color-text-muted)]
          transition-all duration-200
          focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20
          hover:border-[var(--color-text-muted)]
          ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20' : ''}
          ${inputClassName}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({
  label,
  error,
  helper,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`
          w-full px-4 py-3 
          bg-[var(--color-surface)] 
          border border-[var(--color-border)]
          rounded-[var(--radius-md)]
          text-[var(--color-text-primary)] 
          placeholder:text-[var(--color-text-muted)]
          transition-all duration-200
          focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20
          hover:border-[var(--color-text-muted)]
          resize-none
          ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{helper}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
