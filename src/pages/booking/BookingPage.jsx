import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, startOfWeek, addWeeks, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Globe, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../lib/auth';
import { useLanguage } from '../../context/LanguageContext';
import { getPackages, getBookings, createBooking } from '../../lib/supabase';
import { formatPrice } from '../public/PricingPage';


export const BookingPage = () => {

  const { t } = useLanguage();

  const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const defaultPackages = [
    {
      id: 'trial',
      name: t('package_trial_name'),
      description: t('package_trial_desc'),
      price_cents: t('package_trial_price'),
      currency: t('pricing_currency'),
      duration_minutes: t('package_trial_duration'),
      features: t('package_trial_features'),
    },
    {
      id: 'weekly',
      name: t('package_weekly_name'),
      description: t('package_weekly_desc'),
      price_cents: t('package_weekly_price'),
      currency: t('pricing_currency'),
      duration_minutes: t('package_weekly_duration'),
      features: t('package_weekly_features'),
    },
    {
      id: 'monthly',
      name: t('package_intensive_name'),
      description: t('package_intensive_desc'),
      price_cents: t('package_intensive_price'),
      currency: t('pricing_currency'),
      duration_minutes: t('package_intensive_duration'),
      features: t('package_intensive_features')
    },
  ];

  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState(defaultPackages);
  const [selectedPackage, setSelectedPackage] = useState(defaultPackages[0]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
  const fetchPackages = async () => {
    setLoading(true);

    try {
      const { data } = await getPackages();

      if (data && data.length > 0) {
        setPackages(data);
        setSelectedPackage(data[0]);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchPackages();
}, []);

  useEffect(() => {
    if (user) {
      fetchBookedSlots();
    }
  }, [user]);

  const fetchBookedSlots = async () => {
    if (!user) return;
    try {
      const { data } = await getBookings(user.id);
      if (data) {
        setBookedSlots(data.map(b => ({
          date: b.start_time,
          time: format(parseISO(b.start_time), 'HH:mm'),
          status: b.status
        })));
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  };

  const isSlotAvailable = (date, time) => {
    const slot = bookedSlots.find(s =>
      isSameDay(parseISO(s.date), date) && s.time === time && s.status !== 'cancelled'
    );
    return !slot;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (!user) {
      navigate('/auth/login', { state: { from: '/book' } });
      return;
    }
    if (step === 1 && selectedPackage) {
      setStep(2);
    } else if (step === 2 && selectedDate && selectedTime) {
      setStep(3);
    }
  };

  const handleConfirmBooking = async () => {
    if (!user || !selectedPackage || !selectedDate || !selectedTime) return;

    setIsBooking(true);
    try {
      const startTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + (selectedPackage.duration_minutes || 60));

      const { data, error } = await createBooking({
        student_id: user.id,
        package_id: selectedPackage.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'pending',
        payment_status: 'pending',
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const weekDays = getWeekDays();

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 md:py-16">
      <div className="container-custom max-w-4xl">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-display text-(--color-text-primary) mb-2">{t('booking_title')}</h1>
          <p className="text-text-secondary">
            {step === 1 && t('booking_step1')}
            {step === 2 && t('booking_step2')}
            {step === 3 && t('booking_step3')}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4 mb-8 md:mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 md:gap-4">
              <div
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${s <= step
                  ? 'bg-accent text-white'
                  : 'bg-secondary text-text-muted'
                  }`}
              >
                {s < step ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 max-w-10 md:max-w-20 rounded-full ${s < step ? 'bg-accent' : 'bg-secondary'
                  }`} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  variant={selectedPackage?.id === pkg.id ? 'accent' : 'hover'}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`cursor-pointer ${selectedPackage?.id === pkg.id ? 'ring-2 ring-accent' : ''}`}
                >
                  <CardContent>
                    <h3 className="text-lg font-display text-(--color-text-primary) mb-1">{pkg.name}</h3>
                    <p className="text-sm text-text-muted mb-4">{pkg.description}</p>
                    <div className="mb-4">
                      <span className="text-2xl font-display text-(--color-text-primary)">
                        {formatPrice(pkg.price_cents, pkg.currency)}
                      </span>
                      <span className="text-text-muted"> / {pkg.duration_minutes}min</span>
                    </div>
                    <ul className="space-y-2">
                      {pkg.features?.map((feature, i) => (
                        <li key={i} className="text-sm text-text-secondary flex items-center gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleContinue}
                disabled={!selectedPackage}
              >
                {t('booking_continue')}
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-(--color-text-primary)">{t('booking_dateTime')}</h3>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Globe className="w-4 h-4" />
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="bg-transparent border-none focus:outline-none cursor-pointer text-text-secondary"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, -1))}
                      className="p-2 hover:bg-secondary rounded-md transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-text-secondary" />
                    </button>
                    <span className="font-medium text-(--color-text-primary)">
                      {format(currentWeekStart, 'MMMM yyyy')}
                    </span>
                    <button
                      onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
                      className="p-2 hover:bg-secondary rounded-md transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-text-secondary" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day} className="text-center text-xs md:text-sm font-medium text-text-muted py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {weekDays.map((date) => {
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, new Date());
                      const isPast = date < new Date() && !isToday;

                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => !isPast && handleDateSelect(date)}
                          disabled={isPast}
                          className={`
                            p-2 md:p-3 rounded-md text-center transition-all text-sm
                            ${isSelected
                              ? 'bg-accent text-white'
                              : isToday
                                ? 'bg-secondary text-accent font-medium'
                                : isPast
                                  ? 'text-text-muted/50 cursor-not-allowed'
                                  : 'hover:bg-secondary text-(--color-text-primary)'
                            }
                          `}
                        >
                          <div className="text-sm font-medium">{format(date, 'd')}</div>
                          <div className="text-[10px] md:text-xs opacity-70">{format(date, 'EEE')}</div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {selectedDate && (
                <Card>
                  <CardContent>
                    <h4 className="font-medium text-(--color-text-primary) mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Available Times for {format(selectedDate, 'EEEE, MMMM d')}
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {TIME_SLOTS.map((time) => {
                        const available = isSlotAvailable(selectedDate, time);
                        const isSelected = selectedTime === time;

                        return (
                          <button
                            key={time}
                            onClick={() => available && handleTimeSelect(time)}
                            disabled={!available}
                            className={`
                              py-2.5 px-3 rounded-md text-sm font-medium transition-all
                              ${isSelected
                                ? 'bg-accent text-white'
                                : available
                                  ? 'bg-secondary text-(--color-text-primary) hover:bg-accent/10 hover:text-accent'
                                  : 'bg-secondary/50 text-text-muted/50 line-through cursor-not-allowed'
                              }
                            `}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent>
                  <h4 className="font-semibold text-(--color-text-primary) mb-4">{t('booking_yourSelection')}</h4>
                  {selectedPackage && (
                    <div className="pb-4 mb-4 border-b border-border">
                      <p className="text-xs text-text-muted mb-1">{t('booking_package')}</p>
                      <p className="font-medium text-(--color-text-primary)">{selectedPackage.name}</p>
                      <p className="text-sm text-accent">
                        {formatPrice(selectedPackage.price_cents, selectedPackage.currency)}
                      </p>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="pb-4 mb-4 border-b border-border">
                      <p className="text-xs text-text-muted mb-1">{t('booking_dateTime')}</p>
                      <p className="font-medium text-(--color-text-primary)">
                        {format(selectedDate, 'EEEE, MMMM d')}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {selectedTime || t('booking_selectDate')}
                      </p>
                      <p className="text-xs text-text-muted mt-1">{timezone}</p>
                    </div>
                  )}
                  {!selectedDate && (
                    <p className="text-sm text-text-muted mb-4">
                      {t('booking_selectDate')}
                    </p>
                  )}
                  <Button
                    className="w-full"
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleContinue}
                  >
                    {t('booking_continue')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === 3 && selectedPackage && selectedDate && selectedTime && (
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent>
                  <h3 className="text-xl font-display text-(--color-text-primary) mb-6">{t('booking_confirm')}</h3>

                  <div className="space-y-4 md:space-y-6">
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-xs text-text-muted mb-1">{t('booking_package')}</p>
                      <p className="font-medium text-(--color-text-primary)">{selectedPackage.name}</p>
                      <p className="text-sm text-text-secondary">
                        {selectedPackage.duration_minutes} minutes
                      </p>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-xs text-text-muted mb-1">{t('booking_dateTime')}</p>
                      <p className="font-medium text-(--color-text-primary)">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-sm text-text-secondary">{selectedTime}</p>
                      <p className="text-xs text-text-muted mt-1">
                        Timezone: {timezone}
                      </p>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-xs text-text-muted mb-1">{t('booking_payment')}</p>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 bg-surface border border-border rounded-md cursor-pointer hover:border-accent transition-colors">
                          <input type="radio" name="payment" value="paypal" defaultChecked className="accent-accent" />
                          <span className="text-(--color-text-primary)">{t('booking_paypal')}</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-surface border border-border rounded-md cursor-pointer hover:border-accent transition-colors">
                          <input type="radio" name="payment" value="bank" className="accent-accent" />
                          <span className="text-(--color-text-primary)">{t('booking_bank')}</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 bg-accent-soft rounded-lg border border-accent/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-text-secondary">{t('booking_total')}</span>
                        <span className="text-2xl font-display text-accent">
                          {formatPrice(selectedPackage.price_cents, selectedPackage.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent>
                  <h4 className="font-semibold text-(--color-text-primary) mb-4">{t('booking_summary')}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">{t('booking_package')}</span>
                      <span className="text-[var(--color-text-primary)]">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">{t('booking_duration')}</span>
                      <span className="text-[var(--color-text-primary)]">{selectedPackage.duration_minutes} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">{t('booking_date')}</span>
                      <span className="text-[var(--color-text-primary)]">{format(selectedDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">{t('booking_time')}</span>
                      <span className="text-[var(--color-text-primary)]">{selectedTime}</span>
                    </div>
                    <div className="pt-3 border-t border-[var(--color-border)]">
                      <div className="flex justify-between">
                        <span className="font-semibold text-[var(--color-text-primary)]">{t('booking_total')}</span>
                        <span className="font-semibold text-[var(--color-accent)]">
                          {formatPrice(selectedPackage.price_cents, selectedPackage.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6"
                    onClick={handleConfirmBooking}
                    isLoading={isBooking}
                  >
                    {t('booking_confirmPay')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step > 1 && (
          <div className="mt-6">
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="w-4 h-4" />
              {t('booking_back')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};