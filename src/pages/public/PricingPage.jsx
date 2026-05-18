import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { getPackages } from '../../lib/supabase';

const formatPrice = (cents, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
};

export const PricingPage = () => {
  const { t } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data } = await getPackages();
      if (data && data.length > 0) {
        setPackages(data);
      }
      setLoading(false);
    };
    fetchPackages();
  }, []);

  const displayPackages = packages.length > 0 ? packages : [
    {
      id: 'trial',
      name: 'Trial Lesson',
      description: 'Perfect for getting started',
      price_cents: 500,
      currency: 'USD',
      duration_minutes: 30,
      features: ['30-minute session', 'Level assessment', 'Personalized learning plan', 'No commitment required'],
      is_active: true,
      sort_order: 1,
    },
    {
      id: 'weekly',
      name: 'Weekly Sessions',
      description: 'Consistent progress every week',
      price_cents: 5500,
      currency: 'USD',
      duration_minutes: 60,
      features: ['4 sessions per month', '60-minute lessons', 'Homework & feedback', 'Progress tracking', 'Email support'],
      is_active: true,
      sort_order: 2,
    },
    {
      id: 'monthly',
      name: 'Intensive Package',
      description: 'Maximum growth in shortest time',
      price_cents: 9000,
      currency: 'USD',
      duration_minutes: 60,
      features: ['8 sessions per month', 'Priority scheduling', 'Custom study materials', 'WhatsApp support', 'Monthly progress report'],
      is_active: true,
      sort_order: 3,
    },
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'I accept PayPal and bank transfers. For bank transfers, please contact me to receive my banking details. Payment must be completed before the lesson.',
    },
    {
      question: 'Can I reschedule a lesson?',
      answer: "Yes! Lessons can be rescheduled with at least 24 hours notice. Just send me a message and we'll find a time that works for both of us.",
    },
    {
      question: 'What if I need to cancel?',
      answer: "Cancellations made at least 48 hours before the lesson will receive a full refund. Cancellations within 48 hours may be subject to a cancellation fee.",
    },
    {
      question: 'How do online lessons work?',
      answer: "Lessons are conducted via Google Meet. You'll receive a link before each session. All you need is a computer/tablet with a stable internet connection and a microphone.",
    },
    {
      question: 'Can I switch between packages?',
      answer: "Absolutely! You can upgrade, downgrade, or pause your package at any time. Just let me know before your next billing cycle.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[var(--color-accent-soft)] to-[var(--color-background)]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-[var(--color-text-primary)] mb-6">
              {t('pricing_title')}
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t('pricing_subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 -mt-8">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {displayPackages.map((pkg, index) => (
              <Card
                key={pkg.id}
                variant={index === 1 ? 'accent' : 'default'}
                className={`relative ${index === 1 ? 'md:-mt-4 md:mb-[-16px]' : ''}`}
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="accent">{t('pricing_mostPopular')}</Badge>
                  </div>
                )}
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-xl font-display text-[var(--color-text-primary)] mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{pkg.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-display text-[var(--color-text-primary)]">
                      {formatPrice(pkg.price_cents, pkg.currency)}
                    </span>
                    <span className="text-[var(--color-text-muted)]"> / {pkg.duration_minutes}min</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                        <div className="w-5 h-5 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[var(--color-success)]" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/auth" className="block">
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
            ))}
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
