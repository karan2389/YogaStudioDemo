# Ananda Yoga Studio LMS — Client Demo

Phases 1–7 establish the reusable foundation, customer and instructor journeys, core studio management, and the complete browser-local admin operations layer for the Yoga Studio LMS demo.

## Included

- Responsive home page and mobile navigation
- Shared public layout and card components
- Reusable TypeScript domain models
- Seeded demo instructors, customers, classes, sessions and membership plans
- Demo-only data service layer
- About, Classes, Class Details, Schedule, Monthly Plans and Contact pages
- Static generation for every public route and class-detail page
- Netlify configuration with long-lived static asset caching
- Demo login for customer, instructor and administrator roles
- Simulated customer registration and OTP verification (`123456`)
- Persistent browser-local role switching
- Individual and ₹500 trial-session booking
- Simulated payment success/failure and booking confirmation
- Customer dashboard with upcoming activity and membership status
- Booking cancellation with a two-hour cutoff and simulated refunds
- Membership activation, payment history and notification center
- Editable browser-local customer profile
- Instructor dashboard with assigned classes and sessions
- Per-session student rosters and attendance progress
- Present/absent attendance marking with bulk completion
- Simulated WhatsApp membership promotion for eligible present non-members
- Active-member exclusion and campaign-level duplicate prevention
- Role-protected admin dashboard and navigation
- Browser-local add, edit, search and delete workflows for customers and instructors
- Class catalogue and category management
- Recurring schedule and dated-session management
- Membership-plan management with public-site and customer-dashboard synchronization
- Membership and booking operations with status controls
- Payment ledger and staged refund processing
- Cross-session attendance and promotion visibility
- Simulated in-app, email and WhatsApp campaign composer
- Studio reporting dashboard with CSV export
- Configurable booking cutoff, trial pricing and delivery channels
- Protected reset back to the original seeded demo state
- No real authentication, payments, messaging or production integrations

## Run locally

Requires Node.js 22.13 or newer.

```bash
pnpm install
pnpm dev
```

Create a production build with:

```bash
pnpm build
```

## Deploy on Netlify

Connect the repository in Netlify. The included `netlify.toml` automatically uses:

- Build command: `pnpm run build:netlify`
- Publish directory: `out`
- Node.js 22

No environment variables, database or server functions are required for the current demo. Demo access and bookings are stored only in the visitor's browser.

Phase 8 should complete responsive refinement, accessibility, permissions, loading and empty states, demo journeys and final quality assurance.
