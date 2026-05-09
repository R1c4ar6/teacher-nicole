import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, isPast, parseISO } from 'date-fns';
import { Calendar, Video, Clock, X, RefreshCw, LogOut, User } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getBookings, updateBooking } from '../../lib/supabase';

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'default',
  cancelled: 'error',
};

const paymentStatusColors = {
  pending: 'warning',
  paid: 'success',
  refunded: 'error',
};

export const DashboardPage = () => {
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        const { data } = await getBookings(user.id);
        setBookings(data || []);
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const upcomingBookings = bookings.filter(
    (b) => !isPast(parseISO(b.start_time)) && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(
    (b) => isPast(parseISO(b.start_time)) || b.status === 'cancelled'
  );

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setActionLoading(bookingId);
    try {
      const { error } = await updateBooking(bookingId, { status: 'cancelled' });
      if (!error) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleReschedule = (booking) => {
    window.alert(
      `To reschedule, please contact Teacher Nicole. Your current booking is on ${format(
        parseISO(booking.start_time),
        'MMMM d, yyyy'
      )} at ${format(parseISO(booking.start_time), 'h:mm a')}`
    );
  };

  const getStatusLabel = (status) => {
    const key = `status_${status}`;
    return t(key) || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 md:py-16">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-display text-[var(--color-text-primary)] mb-2">
              {t('dashboard_welcome')}{profile?.full_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-[var(--color-text-secondary)]">{t('dashboard_subtitle')}</p>
          </div>
          <Link to="/book">
            <Button>
              <Calendar className="w-4 h-4" />
              {t('dashboard_bookNew')}
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Upcoming Lessons */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">{t('dashboard_upcoming')}</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent>
                        <div className="h-24 bg-[var(--color-secondary)]/50 rounded-[var(--radius-md)]" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <Card className="text-center py-12">
                  <Calendar className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">{t('dashboard_noUpcoming')}</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">{t('dashboard_noUpcomingDesc')}</p>
                  <Link to="/book">
                    <Button>{t('dashboard_bookLesson')}</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <Badge variant={statusColors[booking.status]}>
                                {getStatusLabel(booking.status)}
                              </Badge>
                              {booking.payment_status === 'pending' && (
                                <Badge variant="warning">{t('payment_pending')}</Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-1">
                              {booking.package?.name || 'English Lesson'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {format(parseISO(booking.start_time), 'EEEE, MMMM d, yyyy')}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {format(parseISO(booking.start_time), 'h:mm a')}
                              </span>
                              <span>{booking.package?.duration_minutes || 60} minutes</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {booking.meeting_link && (
                              <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" size="sm">
                                  <Video className="w-4 h-4" />
                                  {t('dashboard_join')}
                                </Button>
                              </a>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReschedule(booking)}
                            >
                              <RefreshCw className="w-4 h-4" />
                              {t('dashboard_reschedule')}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={actionLoading === booking.id}
                            >
                              <X className="w-4 h-4" />
                              {t('dashboard_cancel')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Past Lessons */}
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">{t('dashboard_past')}</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent>
                        <div className="h-20 bg-[var(--color-secondary)]/50 rounded-[var(--radius-md)]" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : pastBookings.length === 0 ? (
                <Card className="text-center py-8">
                  <p className="text-[var(--color-text-muted)]">{t('dashboard_noPast')}</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastBookings.slice(0, 5).map((booking) => (
                    <Card key={booking.id}>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <Badge variant={statusColors[booking.status]}>
                                {getStatusLabel(booking.status)}
                              </Badge>
                              <Badge variant={paymentStatusColors[booking.payment_status]}>
                                {booking.payment_status}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-[var(--color-text-primary)]">
                              {booking.package?.name || 'English Lesson'}
                            </h3>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              {format(parseISO(booking.start_time), 'MMMM d, yyyy')} at{' '}
                              {format(parseISO(booking.start_time), 'h:mm a')}
                            </p>
                          </div>
                          <Link to="/book" className="flex-shrink-0">
                            <Button variant="ghost" size="sm">
                              {t('dashboard_bookAgain')}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text-primary)] truncate">
                      {profile?.full_name || 'Student'}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)] truncate">{profile?.email}</p>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">{t('dashboard_total')}</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">{t('dashboard_completed')}</span>
                    <span className="font-medium text-[var(--color-success)]">
                      {bookings.filter((b) => b.status === 'completed').length}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-6"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav_signOut')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
