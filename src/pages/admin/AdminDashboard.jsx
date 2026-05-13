import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Package,
  MessageSquare,
  Users,
  Clock,
  DollarSign,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../lib/auth';
import { getBookings, getPackages, getApprovedTestimonials, updateBooking, supabase } from '../../lib/supabase';
import { format, addDays, startOfWeek, addWeeks, isSameDay, parseISO } from 'date-fns';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
  { icon: Clock, label: 'Availability', path: '/admin/availability' },
  { icon: Package, label: 'Packages', path: '/admin/packages' },
  { icon: MessageSquare, label: 'Testimonials', path: '/admin/testimonials' },
  { icon: Users, label: 'Students', path: '/admin/students' },
];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'default',
  cancelled: 'error',
};

export const AdminDashboardPage = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent>
            <h2 className="text-xl font-display text-[var(--color-text-primary)] mb-2">Access Denied</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--color-background)]">
      <div className="flex">
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-80px)] bg-[var(--color-surface)] border-r border-[var(--color-border)] p-4 fixed">
          <div className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[var(--color-accent)] rounded-[var(--radius-md)] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-lg text-[var(--color-text-primary)]">Admin</span>
            </Link>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors
                  ${isActive(item.path)
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-text-primary)]'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8 overflow-auto">
          {location.pathname === '/admin' ? <OverviewPage /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};

const OverviewPage = () => {
  const [stats, setStats] = useState({
    upcoming: 0,
    totalStudents: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: bookings } = await getBookings('');
      const { data: profiles } = await supabase.from('profiles').select('*').eq('role', 'student');
      const pendingBookings = bookings?.filter((b) => b.payment_status === 'pending' || b.status === 'pending') || [];
      const confirmedThisMonth = bookings?.filter((b) => {
        const bookingDate = parseISO(b.start_time);
        const now = new Date();
        return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear() && b.status !== 'cancelled';
      }) || [];

      setStats({
        upcoming: bookings?.filter((b) => !isPast(parseISO(b.start_time)) && b.status !== 'cancelled').length || 0,
        totalStudents: profiles?.length || 0,
        pendingPayments: pendingBookings.length,
        monthlyRevenue: confirmedThisMonth.length * 5500,
      });
      setRecentBookings(bookings?.slice(0, 5) || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-text-primary">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-serif text-text-primary">{stats.upcoming}</p>
              <p className="text-sm text-text-muted">Upcoming Lessons</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-serif text-text-primary">{stats.totalStudents}</p>
              <p className="text-sm text-text-muted">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-serif text-text-primary">{stats.pendingPayments}</p>
              <p className="text-sm text-text-muted">Pending Payments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-serif text-text-primary">
                ${(stats.monthlyRevenue / 100).toLocaleString()}
              </p>
              <p className="text-sm text-text-muted">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-text-muted text-center py-8">No bookings yet</p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">
                      {booking.student_id || 'Student'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {format(parseISO(booking.start_time), 'MMM d, yyyy')} at{' '}
                      {format(parseISO(booking.start_time), 'h:mm a')}
                    </p>
                  </div>
                  <Badge variant={statusColors[booking.status]}>{booking.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, package:packages(*), student:profiles!bookings_student_id_fkey(*)')
        .order('start_time', { ascending: false });
      setBookings(data || []);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, status) => {
    await updateBooking(bookingId, { status });
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
  };

  const handleAddMeetingLink = async () => {
    if (!selectedBooking || !meetingLink) return;
    await updateBooking(selectedBooking, { meeting_link: meetingLink });
    setBookings((prev) =>
      prev.map((b) => (b.id === selectedBooking ? { ...b, meeting_link: meetingLink } : b))
    );
    setSelectedBooking(null);
    setMeetingLink('');
  };

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-text-primary">Manage Bookings</h1>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Package</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Meeting</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4 text-sm text-text-primary">
                      {booking.student?.full_name || booking.student?.email || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {booking.package?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {format(parseISO(booking.start_time), 'MMM d, yyyy')}
                      <br />
                      {format(parseISO(booking.start_time), 'h:mm a')}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                        className="text-sm border border-border rounded px-2 py-1 bg-surface"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={booking.payment_status === 'paid' ? 'success' : 'warning'}>
                        {booking.payment_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {booking.meeting_link ? (
                        <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                          Link
                        </a>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking.id);
                            setMeetingLink('');
                          }}
                          className="text-accent hover:underline"
                        >
                          Add Link
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking.id);
                          setMeetingLink('');
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add Meeting Link</CardTitle>
              <button onClick={() => setSelectedBooking(null)}>
                <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Google Meet Link"
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setSelectedBooking(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddMeetingLink} className="flex-1">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export const AdminAvailabilityPage = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      const { data } = await supabase.from('availability').select('*');
      const availMap = {};
      data?.forEach((a) => {
        const key = `${a.day_of_week}-${a.start_time}`;
        availMap[key] = true;
      });
      setAvailability(availMap);
      setLoading(false);
    };
    fetchAvailability();
  }, []);

  const toggleSlot = async (dayOfWeek, time) => {
    const key = `${dayOfWeek}-${time}`;
    const isAvailable = availability[key];

    if (isAvailable) {
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('day_of_week', dayOfWeek)
        .eq('start_time', time);
      if (!error) {
        setAvailability((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    } else {
      const { error } = await supabase.from('availability').insert({
        day_of_week: dayOfWeek,
        start_time: time,
        tutor_id: null,
        timezone: 'UTC',
      });
      if (!error) {
        setAvailability((prev) => ({ ...prev, [key]: true }));
      }
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-text-primary">Manage Availability</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Weekly Schedule</CardTitle>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, -1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-text-primary">
              {format(currentWeekStart, 'MMMM yyyy')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date, dayIndex) => (
              <div key={dayIndex} className="text-center">
                <p className="text-sm font-medium text-text-primary mb-2">
                  {format(date, 'EEE')}
                </p>
                <p className="text-xs text-text-muted mb-4">{format(date, 'MMM d')}</p>
                <div className="space-y-2">
                  {TIME_SLOTS.map((time) => {
                    const key = `${dayIndex}-${time}`;
                    const isAvailable = availability[key];
                    return (
                      <button
                        key={time}
                        onClick={() => toggleSlot(dayIndex, time)}
                        className={`
                          w-full py-2 text-xs rounded-lg transition-all
                          ${isAvailable
                            ? 'bg-accent text-white'
                            : 'bg-secondary text-text-secondary hover:bg-secondary/70'
                          }
                        `}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h4 className="font-medium text-text-primary mb-2">Instructions</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Click on a time slot to toggle availability</li>
            <li>• Green slots are available for booking</li>
            <li>• Gray slots are unavailable</li>
            <li>• Changes are saved automatically</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export const AdminPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_cents: 0,
    duration_minutes: 60,
    features: [],
  });

  useEffect(() => {
    const fetchPackages = async () => {
      const { data } = await getPackages();
      setPackages(data || []);
      setLoading(false);
    };
    fetchPackages();
  }, []);

  const handleSave = async () => {
    if (editingPackage) {
      await supabase.from('packages').update(formData).eq('id', editingPackage.id);
      setPackages((prev) => prev.map((p) => (p.id === editingPackage.id ? { ...p, ...formData } : p)));
    } else {
      const { data } = await supabase.from('packages').insert(formData).select().single();
      if (data) setPackages((prev) => [...prev, data]);
    }
    setShowModal(false);
    setEditingPackage(null);
    setFormData({ name: '', description: '', price_cents: 0, duration_minutes: 60, features: [] });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    await supabase.from('packages').delete().eq('id', id);
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price_cents: pkg.price_cents,
      duration_minutes: pkg.duration_minutes,
      features: pkg.features || [],
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-text-primary">Manage Packages</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Add Package
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardContent>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-text-primary">{pkg.name}</h3>
                <Badge variant={pkg.is_active ? 'success' : 'default'}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-text-muted mb-2">{pkg.description}</p>
              <p className="text-lg font-serif text-accent mb-4">
                ${(pkg.price_cents / 100).toFixed(2)} / {pkg.duration_minutes}min
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEditModal(pkg)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingPackage ? 'Edit' : 'Add'} Package</CardTitle>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-text-muted hover:text-text-primary" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Package Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (USD)"
                  type="number"
                  value={formData.price_cents / 100}
                  onChange={(e) => setFormData({ ...formData, price_cents: e.target.value * 100 })}
                />
                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export const AdminTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      setTestimonials(data || []);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const updates = { status };
    if (status === 'approved') updates.approved_at = new Date().toISOString();
    await supabase.from('testimonials').update(updates).eq('id', id);
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const pendingTestimonials = testimonials.filter((t) => t.status === 'pending');
  const approvedTestimonials = testimonials.filter((t) => t.status === 'approved');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-text-primary">Manage Testimonials</h1>

      {pendingTestimonials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval ({pendingTestimonials.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTestimonials.map((t) => (
                <div key={t.id} className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-text-primary italic mb-2">"{t.content}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{t.display_name}</p>
                      <p className="text-xs text-text-muted">{t.student_type}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateStatus(t.id, 'approved')}>
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(t.id, 'rejected')}>
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Testimonials ({approvedTestimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {approvedTestimonials.length === 0 ? (
            <p className="text-text-muted text-center py-8">No approved testimonials</p>
          ) : (
            <div className="space-y-4">
              {approvedTestimonials.map((t) => (
                <div key={t.id} className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-text-primary italic mb-2">"{t.content}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{t.display_name}</p>
                      <p className="text-xs text-text-muted">{t.student_type}</p>
                    </div>
                    <Badge variant="success">Approved</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });
      setStudents(data || []);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-text-primary">Students ({students.length})</h1>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Timezone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Joined</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4 text-sm text-text-primary">
                      {student.full_name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{student.email}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{student.timezone}</td>
                    <td className="py-3 px-4 text-sm text-text-muted">
                      {format(parseISO(student.created_at), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
