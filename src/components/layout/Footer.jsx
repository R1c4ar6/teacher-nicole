import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-text-primary)] text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[var(--color-accent)] rounded-[var(--radius-md)] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl text-white">Teacher Nicole</span>
            </Link>
            <p className="text-white/60 max-w-md leading-relaxed mb-6">
              {t('footer_tagline')}
            </p>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
              <span>{t('accepting_students')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer_quickLinks')}</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: t('nav_home') },
                { to: '/pricing', label: t('nav_pricing') },
                { to: '/#about', label: t('nav_about') },
                { to: '/auth/register', label: t('nav_bookLesson') },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer_contact')}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@teachernicole.com"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {t('footer_email')}
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/34614232170"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {t('footer_phone')}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4" />
                {t('footer_location')}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">
            &copy; {currentYear} Teacher Nicole. {t('footer_copyright')}
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {t('footer_privacy')}
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              {t('footer_terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};