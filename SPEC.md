# Teacher Nicole — Tutoring Platform Specification

## 1. Concept & Vision

A warm, minimal tutoring platform where students discover Teacher Nicole, trust her expertise, and seamlessly book online English lessons. The experience feels like receiving a personal recommendation from a friend—calm, trustworthy, and effortless. The design draws from Notion's clean minimalism with Calendly's frictionless booking UX, creating a space that's professional yet approachable enough for parents booking for their children.

**Core Emotional Promise**: "This is the tutor you've been looking for—and booking her takes less time than writing an email."

---

## 2. Design Language

### Aesthetic Direction
Warm minimalism meets friendly professionalism. Think Notion's calm structure combined with a cozy café's welcoming energy. Soft, inviting colors with generous whitespace. Typography that's readable and warm, not cold and corporate.

### Color Palette
```css
--color-primary: #6B5B4F;        /* Warm taupe - primary actions */
--color-primary-light: #8B7B6F;  /* Lighter taupe - hover states */
--color-secondary: #E8DDD4;      /* Cream - backgrounds, cards */
--color-accent: #C4956A;         /* Warm terracotta - CTAs, highlights */
--color-accent-hover: #B8845A;  /* Darker terracotta - accent hover */
--color-success: #7A9E7E;        /* Sage green - confirmations */
--color-error: #C75D5D;          /* Muted red - errors */
--color-background: #FDFBF8;     /* Off-white - page background */
--color-surface: #FFFFFF;        /* White - cards, modals */
--color-text-primary: #2D2A26;   /* Near-black - headings */
--color-text-secondary: #5C5650; /* Warm gray - body text */
--color-text-muted: #9C9590;    /* Light gray - helper text */
--color-border: #E5DED6;         /* Subtle warm border */
```

### Typography
- **Headings**: "DM Serif Display" (Google Fonts) — warm, friendly serif with personality
- **Body**: "Inter" (Google Fonts) — clean, highly readable sans-serif
- **Scale**: 14px base, 1.5 line-height body, 1.2 line-height headings
- **Weights**: 400 regular, 500 medium, 600 semibold, 700 bold

### Spatial System
- Base unit: 8px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Container max-width: 1200px (content), 720px (text-heavy sections)
- Card padding: 24px standard, 32px large
- Border radius: 8px small, 12px medium, 16px large, 24px pill

### Motion Philosophy
- **Purpose**: Guide attention, confirm actions, create warmth
- **Timing**: 200ms for micro-interactions, 300ms for transitions, 400ms for entrances
- **Easing**: ease-out for most, spring-like for playful moments
- **Key animations**:
  - Page load: fade-in + subtle rise (opacity 0→1, translateY 12px→0, 400ms)
  - Cards: hover lift (translateY -2px, shadow increase)
  - Buttons: subtle scale on press (0.98), color transition on hover
  - Calendar slots: soft highlight transition (150ms)
  - Form inputs: border color transition (200ms)

### Visual Assets
- **Icons**: Lucide React — rounded, friendly style
- **Images**: Soft, warm-toned photography (placeholder strategy initially)
- **Decorative**: Subtle grain texture overlay (optional), gentle gradient backgrounds
- **Illustrations**: Minimal line art for empty states or features

---

## 3. Layout & Structure

### Public Pages

#### Homepage (/ )
**Hero Section**
- Warm welcome headline: "Learn English with a teacher who cares"
- Subheadline explaining the value proposition
- Primary CTA: "Book a Trial Lesson" (links to booking)
- Secondary CTA: "Learn More" (scrolls to about section)
- Right side: Warm, friendly photo of Teacher Nicole

**About Section**
- Full bio with experience highlights
- Credibility markers (years experience, students taught, qualifications)
- Personal touch that builds trust

**Testimonials Section**
- Grid of approved testimonials
- Each card: quote, student name/type, star rating
- Subtle fade-in on scroll

**Pricing Section**
- 3-4 package cards (Trial, Weekly, Monthly, etc.)
- Each card: name, price, duration, included features, CTA button
- Highlighted "Most Popular" badge on recommended package

**FAQ Section**
- Accordion-style expandable questions
- Covers common concerns (payment, scheduling, cancellation)

**Contact Section**
- WhatsApp link
- Email contact
- Social proof reminder

**Footer**
- Navigation links
- Contact info
- Copyright

#### Booking Page (/book)
- Package selection (if not pre-selected)
- Calendar widget showing available time slots
- Timezone selector with auto-detection
- Selected slot summary
- "Continue to Payment/Login" button

#### Login Page (/auth)
- Google OAuth button (primary)
- Email/password option (secondary)
- Clean, minimal card layout

#### Pricing Page (/pricing)
- Expanded view of all packages
- Comparison table optional
- FAQ about payment methods

### Student Dashboard (/dashboard)
**Header**
- Logo/nav back to public site
- User menu (profile, logout)
- Quick link to book more sessions

**Upcoming Classes Section**
- Card list of scheduled lessons
- Each card: date/time (in local timezone), package name, Google Meet link, reschedule/cancel options
- Empty state with CTA to book

**Past Classes Section**
- Booking history
- Each card: date, duration, status (completed/cancelled)
- "Book Again" option

**Profile Section**
- Edit name, email
- Preferred timezone
- Payment history (optional)

### Admin Dashboard (/admin)
**Sidebar Navigation**
- Overview (stats)
- Bookings
- Availability
- Packages
- Testimonials
- Students

**Overview Page**
- Key metrics: upcoming bookings, total students, revenue this month
- Recent activity feed

**Bookings Page**
- Table view of all bookings
- Filters: status, date range, student
- Actions: confirm, cancel, view details
- Add meeting link option

**Availability Page**
- Weekly calendar grid
- Click to toggle slot availability
- Block date ranges
- Set session duration defaults

**Packages Page**
- CRUD for pricing packages
- Drag-to-reorder option
- Enable/disable visibility

**Testimonials Page**
- List of submitted testimonials
- Approve/reject actions
- Edit before publishing

**Students Page**
- Student list with search
- View individual student booking history
- Basic contact info

---

## 4. Features & Interactions

### Booking Flow
1. **Package Selection**: User selects from visible packages (or has preselected)
   - Hover: card lifts slightly, shadow increases
   - Selected: accent border, checkmark icon

2. **Calendar View**:
   - Shows 2-week window initially, "next" arrow to extend
   - Available slots highlighted in primary color
   - Unavailable slots grayed out (not clickable)
   - Selected slot: filled accent color
   - Timezone displayed with option to change

3. **Slot Interaction**:
   - Hover: subtle highlight
   - Click: slot becomes selected (one selection only)
   - Mobile: tap to select, tap again to deselect

4. **Confirmation Step**:
   - Summary card: package, date, time (in local TZ)
   - "Confirm & Pay" button
   - Redirect to login if not authenticated

### Authentication
- **Google OAuth**: One-click, redirects to Google, returns authenticated
- **Email Login**: Email + password, forgot password flow
- **Session**: JWT stored in localStorage, refresh token handled by Supabase
- **Protected routes**: Dashboard, admin routes require auth + role

### Payment Flow
1. **Checkout Page**:
   - Order summary (package, price)
   - Payment method selection:
     - PayPal button → redirects to PayPal checkout
     - Bank transfer → shows bank details, "I've Paid" confirmation button
   - Terms checkbox

2. **PayPal Integration**:
   - Client-side PayPal SDK
   - On approval: create booking record, send confirmation email
   - On cancel: return to checkout page

3. **Bank Transfer**:
   - Display static bank details (admin-configurable)
   - "I've Made the Transfer" button
   - Creates booking in "pending_payment" status
   - Tutor confirms in admin, triggers confirmation email

### Notifications (Email)
- **Booking Confirmation**: "Your lesson is booked!" with details, meeting link (if available)
- **Booking Cancellation**: Confirmation of cancellation, refund info (if applicable)
- **Reschedule Confirmation**: Updated time, meeting link if changed
- **Payment Received** (admin): Notifies tutor of new booking awaiting payment confirmation
- **Reminder**: Optional 24-hour reminder before lesson

### Dashboard Interactions
- **Reschedule**: Opens modal with calendar, same slot selection flow
- **Cancel**: Confirmation modal with optional reason input
- **Meeting Links**: Click to copy, opens in new tab

### Admin Interactions
- **Availability Toggle**: Click slot to toggle availability, visual feedback immediate
- **Booking Actions**: Status dropdown, meeting link input field
- **Package CRUD**: Form modal for add/edit, delete with confirmation
- **Testimonial Moderation**: Approve/reject buttons, inline edit capability

---

## 5. Component Inventory

### Buttons
- **Primary**: Filled with accent color, white text, hover darkens
- **Secondary**: Outlined with primary color border, primary text, hover fills
- **Ghost**: Text only, hover shows subtle background
- **States**: default, hover, active (scale 0.98), disabled (opacity 0.5), loading (spinner)
- **Sizes**: sm (32px height), md (40px), lg (48px)

### Cards
- **Package Card**: Title, price, features list, CTA button, optional badge
- **Testimonial Card**: Quote (italic), attribution, star rating
- **Booking Card**: Date/time, package, status badge, action buttons
- **Stat Card**: Icon, metric value, label

### Form Inputs
- **Text Input**: Label above, placeholder, border transition on focus
- **Select**: Custom styled dropdown, smooth open/close
- **Checkbox**: Custom styled with smooth check animation
- **Date Picker**: Calendar popup, timezone display
- **Time Slot Selector**: Grid of time buttons, toggle selection

### Navigation
- **Header**: Logo, nav links (desktop), hamburger menu (mobile)
- **Sidebar** (admin): Icon + label links, collapsible
- **Breadcrumbs**: For nested pages

### Feedback
- **Toast Notifications**: Slide in from top-right, auto-dismiss, action optional
- **Loading States**: Skeleton loaders for content, spinner for buttons
- **Empty States**: Illustration + message + CTA
- **Error States**: Inline error messages, form-level alerts

### Modals
- **Confirmation Modal**: Title, message, cancel/confirm buttons
- **Form Modal**: Title, form content, cancel/save buttons
- **Backdrop**: Semi-transparent overlay, click-outside-to-close

### Calendar Widget
- **Month View**: Day headers, date grid, availability coloring
- **Week View** (admin): Time slots in columns
- **Slot Button**: Time label, available/unavailable styling

---

## 6. Technical Approach

### Stack
- **Frontend**: React 18 + Vite, React Router v6
- **Styling**: Tailwind CSS with custom theme
- **State**: React Context + hooks (auth state), React Query for server state
- **Backend**: Supabase (Auth, PostgreSQL, Row Level Security)
- **Payments**: PayPal JavaScript SDK
- **Email**: Resend API
- **Calendar**: Custom implementation with date-fns for timezone handling

### Project Structure
```
/src
  /components
    /ui          # Reusable primitives (Button, Card, Input, etc.)
    /layout      # Header, Footer, Sidebar, PageWrapper
    /booking     # BookingWidget, Calendar, TimeSlots
    /dashboard   # StudentDashboard components
    /admin       # AdminDashboard components
  /pages
    /public      # Home, Pricing, About
    /auth        # Login, Register
    /booking     # Booking flow pages
    /dashboard   # Student dashboard pages
    /admin       # Admin dashboard pages
  /lib
    /supabase.js # Supabase client
    /paypal.js   # PayPal integration
    /email.js    # Email service
    /utils.js    # Helpers (formatting, timezone, etc.)
  /hooks         # Custom React hooks
  /context       # AuthContext, ThemeContext
  /styles        # Global styles, Tailwind config
```

### Database Schema (Supabase PostgreSQL)

```sql
-- Users (extends Supabase auth.users)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student', -- 'student' | 'admin'
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ
)

-- Packages
packages (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  price_cents INTEGER,
  currency TEXT DEFAULT 'USD',
  duration_minutes INTEGER,
  features JSONB,
  sort_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ
)

-- Availability
availability (
  id UUID PRIMARY KEY,
  tutor_id UUID REFERENCES profiles,
  day_of_week INTEGER, -- 0-6 (Sunday-Saturday)
  start_time TIME,
  end_time TIME,
  timezone TEXT,
  is_recurring BOOLEAN DEFAULT true,
  specific_date DATE, -- for one-off availability
  created_at TIMESTAMPTZ
)

-- Blocked Dates
blocked_dates (
  id UUID PRIMARY KEY,
  tutor_id UUID REFERENCES profiles,
  start_date DATE,
  end_date DATE,
  reason TEXT,
  created_at TIMESTAMPTZ
)

-- Bookings
bookings (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES profiles,
  package_id UUID REFERENCES packages,
  tutor_id UUID REFERENCES profiles,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_status TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'refunded'
  payment_method TEXT, -- 'paypal' | 'bank_transfer'
  paypal_order_id TEXT,
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ
)

-- Testimonials
testimonials (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES profiles,
  content TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  display_name TEXT,
  student_type TEXT, -- 'school' | 'university' | 'adult' | 'professional' | 'child'
  created_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ
)

-- Bank Details (for manual transfers)
settings (
  id UUID PRIMARY KEY,
  key TEXT UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ
)
```

### API Design

Using Supabase client directly with RLS policies:

**Public reads (no auth required):**
- `packages` (active only)
- `testimonials` (approved only)
- `profiles` (tutor profile, minimal fields)

**Authenticated student reads:**
- Own profile
- Own bookings
- Own testimonials

**Authenticated admin:**
- All tables full access
- Availability management
- Booking management
- Testimonial moderation

**Key Supabase functions:**
```javascript
// Book a slot
const bookSlot = async (packageId, startTime) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ package_id: packageId, start_time: startTime, student_id: user.id })
  return { data, error }
}

// Get available slots for date range
const getAvailableSlots = async (startDate, endDate) => {
  const { data, error } = await supabase
    .rpc('get_available_slots', { start_date: startDate, end_date: endDate })
  return { data, error }
}

// Update booking status
const updateBookingStatus = async (bookingId, status, meetingLink) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, meeting_link: meetingLink })
    .eq('id', bookingId)
  return { data, error }
}
```

### Row Level Security

```sql
-- Students can only read their own bookings
CREATE POLICY "Students read own bookings" ON bookings
  FOR SELECT USING (auth.uid() = student_id);

-- Students can only read their own profile
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can manage all bookings
CREATE POLICY "Admins manage bookings" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### PayPal Integration

```javascript
// Initialize PayPal button
const createOrder = (package) => {
  return fetch('/api/create-paypal-order', {
    method: 'POST',
    body: JSON.stringify({ packageId: package.id })
  }).then(res => res.json());
};

const onApprove = async (details, bookingId) => {
  // Capture payment, update booking status, send confirmation email
  await supabase.from('bookings')
    .update({ payment_status: 'paid', status: 'confirmed' })
    .eq('id', bookingId);
  await sendConfirmationEmail(bookingId);
};
```

### Email Templates (Resend)

1. **Booking Confirmation**: Template ID stored in settings, dynamic data injected
2. **Cancellation Notice**: Similar structure
3. **Reschedule Notice**: With old and new times

---

## 7. MVP Scope

### Must Have (MVP)
- Landing page with tutor profile
- Testimonials display
- Package listing
- Calendar with available slots
- Google login
- Booking creation (without meeting link initially)
- PayPal checkout
- Bank transfer option (manual confirmation)
- Student dashboard (view bookings, cancel)
- Admin dashboard (view bookings, confirm payment, add meeting links)
- Basic email notifications (confirmation only)

### Not MVP (Post-launch)
- WhatsApp integration
- FAQ section
- Progress tracking
- AI features
- Mobile app
- Referral system
- Subscription billing

---

## 8. Success Metrics

- **Conversion**: Time from landing to first booking < 5 minutes
- **Booking completion rate**: > 80% of users who start booking flow complete it
- **Return rate**: Students who book again within 2 weeks
- **Support load**: < 5% of bookings require manual intervention
