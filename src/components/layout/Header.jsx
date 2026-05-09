import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, User, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isUserMenuOpen && !e.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  const navLinks = [
    { to: '/', label: t('nav_home') },
    { to: '/pricing', label: t('nav_pricing') },
    { to: '/#about', label: t('nav_about') },
    { to: '/#contact', label: t('nav_contact') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)]">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-[var(--color-accent)] rounded-[var(--radius-md)] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-lg text-[var(--color-text-primary)] hidden sm:block">
              Teacher Nicole
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  px-4 py-2 text-sm font-medium rounded-[var(--radius-md)]
                  transition-colors duration-200
                  ${location.pathname === link.to
                    ? 'text-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)]'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            
            {user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] transition-colors"
                >
                  <div className="w-8 h-8 bg-[var(--color-accent-soft)] rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-[var(--color-accent)]">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:block">{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-lg py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-[var(--color-border)]">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">{profile?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {t('nav_dashboard')}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] transition-colors"
                      >
                        {t('nav_admin')}
                      </Link>
                    )}
                    <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--color-error)] hover:bg-[var(--color-error)]/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav_signOut')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">{t('nav_signIn')}</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">{t('nav_bookLesson')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--color-border)] animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-4 py-3 text-base font-medium rounded-[var(--radius-md)]
                    transition-colors
                    ${location.pathname === link.to
                      ? 'text-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <div className="px-4 mb-4">
                <LanguageSwitcher variant="dropdown" />
              </div>
              
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <Link to="/dashboard" className="px-4 py-3 text-base font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)] rounded-[var(--radius-md)]">
                      {t('nav_dashboard')}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="px-4 py-3 text-base font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] rounded-[var(--radius-md)]">
                        {t('nav_admin')}
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-3 text-base font-medium text-[var(--color-error)] hover:bg-[var(--color-error)]/5 rounded-[var(--radius-md)] text-left"
                    >
                      {t('nav_signOut')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="secondary" className="w-full">{t('nav_signIn')}</Button>
                    </Link>
                    <Link to="/auth">
                      <Button className="w-full">{t('nav_bookLesson')}</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
