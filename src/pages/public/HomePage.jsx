import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Users, Award, MessageCircle, Play, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useLanguage } from '../../context/LanguageContext';

const testimonials = [
  {
    id: 1,
    content: "Nicole helped my daughter improve her English grades from a C to an A in just three months. Her patient teaching style made learning enjoyable.",
    name: "Sarah M.",
    type: "Parent",
    rating: 5,
  },
  {
    id: 2,
    content: "I was nervous about speaking English at work, but after six months with Nicole, I confidently lead meetings. She's an amazing teacher!",
    name: "Kenji T.",
    type: "Business Professional",
    rating: 5,
  },
  {
    id: 3,
    content: "The trial lesson was so engaging that I immediately signed up for weekly sessions. Nicole makes every class feel tailored to my goals.",
    name: "Emily R.",
    type: "University Student",
    rating: 5,
  },
];

const stats = [
  { icon: Clock, value: "8+", key: 'stats_years' },
  { icon: Users, value: "500+", key: 'stats_students' },
  { icon: Award, value: "50K+", key: 'stats_hours' },
  { icon: Star, value: "4.9", key: 'stats_rating' },
];

const features = [
  {
    icon: Play,
    key: 'features_personalized',
    descKey: 'features_personalized_desc',
  },
  {
    icon: MessageCircle,
    key: 'features_conversations',
    descKey: 'features_conversations_desc',
  },
  {
    icon: Sparkles,
    key: 'features_flexible',
    descKey: 'features_flexible_desc',
  },
];

export const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--color-background)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-soft)] via-transparent to-[var(--color-secondary)] opacity-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
        
        <div className="relative container-custom py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] rounded-full border border-[var(--color-border)] mb-6">
                <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
                <span className="text-sm text-[var(--color-text-secondary)]">{t('accepting_students')}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display text-[var(--color-text-primary)] mb-6 leading-[1.1]">
                {t('hero_title')}<span className="gradient-text">{t('hero_title_accent')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 max-w-lg">
                {t('hero_subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/login">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    {t('hero_bookTrial')}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t('hero_viewPricing')}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-secondary)] rounded-[var(--radius-2xl)]" />
                <div className="absolute inset-4 bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)] rounded-full mb-6 flex items-center justify-center shadow-lg">
                      <span className="text-6xl md:text-7xl">👩‍🏫</span>
                    </div>
                    <p className="text-lg font-medium text-[var(--color-text-primary)]">Nicole Shanté</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Your English Tutor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[var(--color-accent-soft)] rounded-[var(--radius-lg)] mb-4">
                  <stat.icon className="w-7 h-7 text-[var(--color-accent)]" />
                </div>
                <div className="text-3xl md:text-4xl font-display text-[var(--color-text-primary)] mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{t(stat.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-[var(--color-background)]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-[var(--color-text-primary)] mb-4">
              {t('features_title')}
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t('features_subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <Card key={i} hover className="text-center">
                <CardContent>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-accent-soft)] rounded-[var(--radius-xl)] mb-6">
                    <feature.icon className="w-8 h-8 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-xl font-display text-[var(--color-text-primary)] mb-3">{t(feature.key)}</h3>
                  <p className="text-[var(--color-text-secondary)]">{t(feature.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-[var(--color-secondary)]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-4">
                <Award className="w-4 h-4" />
                {t('about_certified')}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-[var(--color-text-primary)] mb-6">
                {t('about_title')}
              </h2>
              <div className="space-y-4 text-[var(--color-text-secondary)]">
                <p>{t('about_desc1')}</p>
                <p>{t('about_desc2')}</p>
              </div>
              
              <div className="mt-8 space-y-3">
                <h4 className="font-semibold text-[var(--color-text-primary)]">{t('about_qualifications')}</h4>
                <ul className="space-y-2">
                  {t('about_qualifications_array').map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <div className="w-5 h-5 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-[var(--color-success)] rounded-full" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <Card className="max-w-sm mx-auto">
                <CardContent className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)] rounded-full mb-6 flex items-center justify-center shadow-lg">
                    <span className="text-5xl">👩‍🏫</span>
                  </div>
                  <h3 className="text-xl font-display text-[var(--color-text-primary)] mb-1">Nicole Shanté</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">TESOL Certified English Teacher</p>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[var(--color-accent)] fill-[var(--color-accent)]" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-[var(--color-background)]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-[var(--color-text-primary)] mb-4">
                {t('testimonials_title')}
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)]">
                {t('testimonials_subtitle')}
              </p>
            </div>
            <Link to="/pricing">
              <Button variant="ghost" className="gap-2">
                {t('testimonials_viewAll')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} hover>
                <CardContent>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[var(--color-accent)] fill-[var(--color-accent)]" />
                    ))}
                  </div>
                  <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center">
                      <span className="text-lg font-medium text-[var(--color-accent)]">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text-primary)]">{testimonial.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{testimonial.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[var(--color-text-primary)] to-[var(--color-primary-soft)]">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-6">
            {t('cta_title')}
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
            {t('cta_subtitle')}
          </p>
          <Link to="/auth/login">
            <Button size="xl" className=" text-(--color-text-primary) hover:bg-white/90 hover:text-(--color-text-primary) gap-2">
              {t('cta_button')}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[var(--color-surface)]">
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display text-[var(--color-text-primary)] mb-4">
              {t('contact_title')}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8">
              {t('contact_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/34614232170" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {t('contact_whatsapp')}
                </Button>
              </a>
              <a href="mailto:hello@teachernicole.com">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  {t('contact_email')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
