# Teacher Nicole - Online English Tutoring Platform

A warm, minimal tutoring platform where students can discover Teacher Nicole, trust her expertise, and seamlessly book online English lessons.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **State Management**: React Query + React Context
- **Backend**: Supabase (Auth + PostgreSQL)
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd teacher-nicole
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_RESEND_API_KEY=your_resend_api_key
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Run the database schema in `supabase-schema.sql` via the Supabase SQL Editor

3. Enable Google OAuth in Supabase:
   - Go to Authentication > Providers > Google
   - Add your Google OAuth credentials

4. Copy your project URL and anon key to `.env`

### Running the App

Development mode:
```bash
pnpm run dev
```

Production build:
```bash
pnpm run build
```

Preview production build:
```bash
pnpm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable components (Button, Card, Input, Badge)
│   ├── layout/      # Layout components (Header, Footer, PageWrapper)
│   ├── booking/     # Booking widgets
│   ├── dashboard/   # Student dashboard components
│   └── admin/       # Admin dashboard components
├── pages/
│   ├── public/      # Public pages (Home, Pricing)
│   ├── auth/        # Authentication pages
│   ├── booking/     # Booking flow pages
│   ├── dashboard/   # Student dashboard pages
│   └── admin/       # Admin dashboard pages
├── lib/
│   ├── supabase.js  # Supabase client & queries
│   └── utils.js     # Utility functions
├── hooks/           # Custom React hooks
├── context/         # React Context providers
└── styles/          # Global styles
```

## Features

### Public Website
- Tutor profile with bio and credentials
- Student testimonials (admin approval system)
- Pricing packages with FAQ
- Contact information with WhatsApp link

### Booking System
- Package selection
- Calendly-style calendar with available slots
- Timezone auto-detection
- PayPal payment integration
- Bank transfer option (manual confirmation)

### Student Dashboard
- View upcoming lessons
- Google Meet link access
- Reschedule/cancel bookings
- Booking history

### Admin Dashboard
- Overview with statistics
- Booking management
- Availability calendar
- Package management
- Testimonial moderation
- Student management

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#6B5B4F` | Primary text, buttons |
| Secondary | `#E8DDD4` | Backgrounds, cards |
| Accent | `#C4956A` | CTAs, highlights |
| Success | `#7A9E7E` | Success states |
| Error | `#C75D5D` | Error states |
| Background | `#FDFBF8` | Page background |

## Typography

- **Headings**: DM Serif Display (Google Fonts)
- **Body**: Inter (Google Fonts)

## Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint (if configured)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_PAYPAL_CLIENT_ID` | PayPal client ID |
| `VITE_RESEND_API_KEY` | Resend API key for emails |

## License

MIT
