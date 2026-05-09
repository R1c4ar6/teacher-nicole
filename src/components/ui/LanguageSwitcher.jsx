import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSwitcher = ({ variant = 'default' }) => {
  const { language, toggleLanguage } = useLanguage();

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="uppercase">{language}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-all"
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase font-semibold">{language}</span>
    </button>
  );
};
