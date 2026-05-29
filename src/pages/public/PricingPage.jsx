import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { getPackages } from '../../lib/supabase';

const formatPrice = (cents, currency = t('pricing_currency')) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(cents);
};

export const PricingPage = () => {
  const { t } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await getPackages();
        if (data && data.length > 0) {
          setPackages(data);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      }
      setLoading(false);
    };
    fetchPackages();
  }, []);

  const getPackageData = (index) => {
    if (packages.length > 0) {
      return packages[index];
    }
    
    const defaultPackages = [
      {
        id: 'trial',
        name: t('package_trial_name'),
        description: t('package_trial_desc'),
        price_cents: t('package_trial_price'),
        currency: t('pricing_currency'),
        duration_minutes: t('package_trial_duration'),
        features: t('package_trial_features')
      },
      {
        id: 'weekly',
        name: t('package_weekly_name'),
        description: t('package_weekly_desc'),
        price_cents: t('package_weekly_price'),
        currency: t('pricing_currency'),
        duration_minutes: t('package_weekly_duration'),
        features: t('package_weekly_features')
      },
      {
        id: 'intensive',
        name: t('package_intensive_name'),
        description: t('package_intensive_desc'),
        price_cents: t('package_intensive_price'),
        currency: t('pricing_currency'),
        duration_minutes: t('package_intensive_duration'),
        features: t('package_intensive_features')
      },
    ];
    
    return defaultPackages[index];
  };

  const displayPackages = packages.length > 0 ? packages : null;

  const faqs = [
    { question: t('faq_payment_q'), answer: t('faq_payment_a') },
    { question: t('faq_reschedule_q'), answer: t('faq_reschedule_a') },
    { question: t('faq_cancel_q'), answer: t('faq_cancel_a') },
    { question: t('faq_online_q'), answer: t('faq_online_a') },
    { question: t('faq_switch_q'), answer: t('faq_switch_a') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-linear-to-b from-accent-soft to-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-(--color-text-primary) mb-6">
              {t('pricing_title')}
            </h1>
            <p className="text-lg text-text-secondary">
              {t('pricing_subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 -mt-8">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[0, 1, 2].map((index) => {
              const pkg = displayPackages ? displayPackages[index] : getPackageData(index);
              if (!pkg) return null;
              
              return (
                <Card
                  key={pkg.id || index}
                  variant={index === 1 ? 'accent' : 'default'}
                  className={`relative ${index === 1 ? 'md:-mt-4 md:-mb-4' : ''}`}
                >
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="accent">{t('pricing_mostPopular')}</Badge>
                    </div>
                  )}
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-xl font-display text-(--color-text-primary) mb-1">
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-text-muted">{pkg.description}</p>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-display text-(--color-text-primary)">
                        {formatPrice(pkg.price_cents, pkg.currency)}
                      </span>
                      <span className="text-text-muted"> / {pkg.duration_minutes}</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {pkg.features?.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                          <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-success" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Link to="/auth/register" className="block">
                      <Button
                        variant={index === 1 ? 'primary' : 'secondary'}
                        className="w-full gap-2"
                      >
                        {t('pricing_getStarted')}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-sm text-[var(--color-text-muted)] mt-10">
            {t('pricing_custom')}
            <Link to="/#contact" className="text-[var(--color-accent)] hover:underline font-medium">
              {t('pricing_contact')}
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32 bg-[var(--color-secondary)]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display text-[var(--color-text-primary)] mb-4">
                {t('faq_title')}
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                {t('faq_subtitle')}
                <Link to="/#contact" className="text-[var(--color-accent)] hover:underline">
                  {t('faq_contact')}
                </Link>
              </p>
            </div>
            
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-medium text-[var(--color-text-primary)] pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0 transition-transform duration-200 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5 text-[var(--color-text-secondary)] leading-relaxed animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container-custom text-center">
          <div className="max-w-xl mx-auto">
            <HelpCircle className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-display text-[var(--color-text-primary)] mb-4">
              {t('faq_still')}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {t('contact_subtitle')}
            </p>
            <Link to="/#contact">
              <Button variant="secondary">{t('faq_contact')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};