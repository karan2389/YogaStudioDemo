# Project Walkthrough: Ananda Yoga Studio LMS (Client Demo)

> **Document Purpose**: This document provides a complete, granular architectural and functional overview of the **Ananda Yoga Studio LMS Demo (Phases 1–7)**. It is structured so that any AI assistant (such as GPT or Claude) or software engineer can immediately understand the architecture, data models, user personas, UI components, state management engine, and operational workflows.

---

## 1. Executive Summary

* **Project Name**: Ananda Yoga Studio LMS — Client Demo
* **Current Status**: **Phases 1–7 Complete** (Phase 8 planned for accessibility, loading/empty states, and final polish).
* **Domain**: A boutique, mindful yoga and movement studio located in Bengaluru, India.
* **Currency & Localization**: Indian Rupee (`₹` / INR), Indian phone numbering (`+91`), local time format (`IST` / `+05:30`).
* **Design & Execution Goal**: Provide a **100% functional, interactive, zero-backend client demonstration** that showcases the complete lifecycle of a yoga studio across all key stakeholders: **Public Visitors**, **Registered Customers**, **Studio Instructors**, and **Studio Administrators**.
* **Key Characteristic**: Operates **without any external database, serverless function, or third-party API dependencies**. All persistence, session switching, booking management, and campaign dispatching are handled client-side in the visitor's browser via `localStorage` with reactive UI synchronization.

---

## 2. Technology Stack & Tooling

| Layer | Technology | Details / Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.3.4 (App Router)** | Modern React Server/Client architecture, statically exported (`output: "export"`). |
| **Core Library** | **React 19.2.6** | Latest concurrent rendering and hooks. |
| **Language** | **TypeScript 5.9.3** | Strict typing across all domain entities, UI props, and state stores. |
| **Styling** | **Tailwind CSS 4.2.1** | Modern styling with custom aesthetic palettes (`#fbf8f1` warm parchment, `#17362d` forest green, `#a65f3d` terracotta). |
| **UI Components** | **Radix UI & `@shadcn/react`** | Accessible dialogs, drawers, dropdowns, accordions, tabs, sheets, and popovers. |
| **Icons** | **Lucide React 1.31.0** | Clean, minimalist iconography throughout. |
| **Data Viz** | **Recharts 3.8.0** | Administrative analytics, monthly revenue charts, and attendance curves. |
| **Carousel** | **Embla Carousel React 8.6.0** | Class style highlights and image galleries. |
| **Form Handling** | **React Hook Form + Zod** | Type-safe form validation and simulated submission. |
| **OTP Input** | **Input-OTP 1.4.2** | Realistic 6-digit OTP verification interface. |
| **Persistence** | **Browser `localStorage` + Event Bus** | Instant zero-backend reactivity (`ananda-demo-change` window event). |
| **Future Backend** | **Drizzle ORM 0.45.2** | Ready in `db/` and `drizzle/` for SQLite / Cloudflare D1 integration when moving past demo mode. |

---

## 3. Architecture & State Management System

The application is architected around a **Demo-First, Reactive Local State Architecture**:

```
                               ┌─────────────────────────────┐
                               │     Top Demo Controller     │
                               │  (components/shared/...)    │
                               └──────────────┬──────────────┘
                                              │ Switches Role
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Browser LocalStorage                                   │
│  ├─ ananda-demo-session        (Current active persona: customer / instructor / admin) │
│  ├─ ananda-demo-bookings       (User class bookings, cancellations, timestamps)        │
│  ├─ ananda-demo-memberships    (Active & expired monthly passes)                       │
│  ├─ ananda-demo-payments       (Simulated UPI, Card, and Wallet payment transactions)  │
│  ├─ ananda-demo-attendance     (Instructor-marked student attendance records)          │
│  ├─ ananda-demo-notifications  (In-app announcements and alerts)                       │
│  ├─ ananda-demo-promotions     (Simulated WhatsApp marketing campaigns sent)           │
│  └─ ananda-operations-*        (Administrative overrides: classes, pricing, refunds)  │
└─────────────────────────────────────────────┬──────────────────────────────────────────┘
                                              │ Custom Event: "ananda-demo-change"
                                              ▼
       ┌───────────────────────────────────────────────────────────────────────┐
       │                          React Client Hooks                           │
       │   `useDemoSession()` · `useSyncExternalStore` · Local State Hooks     │
       └───────────────────────────────────────────────────────────────────────┘
```

### Key Service Modules:
1. `services/demo-storage.ts`: Core storage adapter for session management, booking creation/cancellation, payment generation, notifications, and attendance records.
2. `services/admin-operations.ts`: Administrative data layer that combines initial seed fixtures with dynamic browser modifications for customers, instructors, sessions, memberships, and refunds.
3. `services/demo-settings.ts`: Configurable studio operational settings (cancellation cutoff window in hours, trial session pricing, factory reset).

---

## 4. User Personas & Demonstration Credentials

The app includes a persistent top header bar (`DemoIndicator`) and a `/login` page that allows 1-click role switching without entering passwords:

| Persona | Name | Email | Phone | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | **Aarav Sharma** | `aarav@example.com` | `+91 98111 11111` | Book single/trial/membership sessions, manage cancellations, view payment invoices, edit profile. |
| **Instructor**| **Nikita Verma** | `nikita@anandayoga.demo` | `+91 90000 10001` | View assigned teaching schedule, take live student attendance, trigger automated WhatsApp promotions to trial attendees. |
| **Admin** | **Studio Admin** | `admin@anandayoga.demo` | `+91 90000 00000` | Full studio governance across 15 management modules (classes, schedules, payments, refunds, marketing, reporting). |

*Note: The customer registration flow (`/register`) simulates an SMS OTP. The universal test verification code is `123456`.*

---

## 5. Complete Page & Route Inventory

### 5.1. Public Showcase Pages
* **`/` (Home)**: Hero section, philosophy, 6 class styles overview, 3 featured instructors, trial session promo (₹500), monthly plan preview, and testimonial cards.
* **`/about`**: Studio story, values (breath, community, sustainable practice), physical space description in Bengaluru, and teacher bios.
* **`/classes`**: Filterable catalog of yoga offerings by difficulty and focus.
* **`/classes/[slug]`**: Dynamic static class detail pages displaying difficulty, duration, temperature, prerequisites, assigned instructor, and direct booking CTA.
* **`/schedule`**: Interactive weekly timetable filterable by Day, Class Type, and Teacher.
* **`/plans`**: 3 monthly membership tiers (`Monthly Starter` ₹2,400, `Monthly Wellness` ₹4,200, `Monthly Unlimited` ₹6,500) with feature comparison.
* **`/contact`**: Studio location details (Indiranagar, Bengaluru), operating hours, WhatsApp support link, and interactive inquiry form.

### 5.2. Booking Funnel
* **`/book`**:
  * Step 1: Session selection (class, teacher, date & time slot, remaining seats).
  * Step 2: Booking Type (`Single Session` vs `₹500 First Trial` vs `Membership Entitlement`).
  * Step 3: Payment method simulation (Instant UPI QR/VPA, Credit/Debit Card, Studio Wallet).
  * Step 4: Instant confirmation and receipt generation.
* **`/booking-confirmation`**: Success screen with downloadable summary, calendar add button, and navigation to the customer dashboard.

### 5.3. Customer Dashboard (`/dashboard`)
* **`/dashboard` (Overview)**: Welcome banner, active membership card, next scheduled class card with quick cancellation, recent attendance history.
* **`/dashboard/bookings`**: Tabbed list of `Upcoming` and `Past` classes. Features a **cancellation engine with a strict 2-hour cutoff rule** (sessions under 2 hours cannot be cancelled online; eligible cancellations automatically trigger a simulated refund request).
* **`/dashboard/membership`**: Active membership details, renewal action, plan change options, and billing cycle.
* **`/dashboard/payments`**: Ledger of all single payments, memberships, and refund credits with receipt preview.
* **`/dashboard/notifications`**: Notification center displaying booking alerts, schedule changes, and studio announcements.
* **`/dashboard/profile`**: Client-side editable contact form (Name, Email, Phone) updating the active session.

### 5.4. Instructor Dashboard (`/instructor`)
* **`/instructor` (Overview)**: Summary metrics (Today's classes, total students booked, monthly teaching hours).
* **`/instructor/sessions`**: List of all classes assigned to the logged-in instructor with live capacity meters.
* **`/instructor/sessions/[sessionId]`**:
  * **Interactive Roster**: List of enrolled students with avatars, membership status (`Trial`, `Single`, `Active Member`).
  * **Attendance Controls**: One-click toggles for `Present` / `Absent`, plus a `Mark All Present` button.
  * **Automated Growth Trigger**: Automatically identifies non-member students marked `Present` and generates a simulated personalized WhatsApp membership promotion. Includes duplicate prevention so campaigns are not resent to the same student.

### 5.5. Administrator Suite (`/admin`)
Accessible via the Admin role with 15 dedicated modules:
1. **`/admin` (Overview)**: Top-level studio KPIs (Active Members, Today's Bookings, Monthly Revenue ₹, Average Class Capacity %).
2. **`/admin/customers`**: Customer database with search, filter, detail view, edit details, and mock deletion.
3. **`/admin/instructors`**: Teacher directory, specialties, experience, and assigned workload.
4. **`/admin/classes`**: Course catalog management (titles, descriptions, capacities, prices, images, colors).
5. **`/admin/categories`**: Category tagging (Foundation, Flow, Strength, Restoration).
6. **`/admin/schedules`**: Weekly recurring class scheduling template builder.
7. **`/admin/sessions`**: Specific dated calendar sessions, capacity overrides, and cancellation triggers.
8. **`/admin/plans`**: Membership plan creation and pricing updates, immediately synchronized with public `/plans` and customer renewal screens.
9. **`/admin/memberships`**: Master list of active, expired, and paused student memberships.
10. **`/admin/bookings`**: Master studio booking ledger with status controls (`Confirmed`, `Cancelled`, `Attended`, `No-Show`).
11. **`/admin/payments`**: Financial ledger tracking all incoming payments, transaction methods (UPI/Card), and timestamps.
12. **`/admin/refunds`**: Staged refund management pipeline: review `Requested` refunds, move them to `Processing`, and issue `Completed` refunds.
13. **`/admin/attendance`**: Cross-session attendance audits and teacher completion rates.
14. **`/admin/notifications`**: Multi-channel marketing campaign composer (create and dispatch simulated In-App, Email, or WhatsApp announcements to segmented audiences).
15. **`/admin/reports`**: Visual analytics dashboards (Revenue by category, session attendance trends) with one-click **CSV export**.
16. **`/admin/settings`**: Operational rules editor: adjust the cancellation cutoff window (e.g. 2 hours), configure trial pricing (e.g. ₹500), and a **Protected Factory Reset** button that clears `localStorage` and restores the original seed dataset.

---

## 6. Domain Data Models & Schemas

### Key Types (`types/domain.ts`):
```typescript
export type UserRole = "customer" | "instructor" | "admin";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "attended" | "no-show";
export type MembershipStatus = "active" | "expired" | "cancelled" | "paused";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially-refunded";
export type AttendanceStatus = "present" | "absent" | "not-marked";

export interface YogaClass {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  instructorId: string;
  description: string;
  difficulty: "Beginner" | "All levels" | "Intermediate" | "Advanced";
  durationMinutes: number;
  price: number;
  capacity: number;
  image: string;
  accent: string;
}

export interface Session {
  id: string;
  classId: string;
  instructorId: string;
  startsAt: string; // ISO 8601 string
  capacity: number;
  bookedSeats: number;
  status: "scheduled" | "completed" | "cancelled";
}

export interface Booking {
  id: string;
  customerId: string;
  sessionId: string;
  status: BookingStatus;
  type: "single" | "trial" | "membership";
  amount: number;
  createdAt: string;
}
```

### Pre-Seeded Class Offerings:
1. **Hatha Yoga** (Foundation, 60 mins, ₹650, Instructor: Nikita Verma)
2. **Vinyasa Flow** (Flow, 60 mins, ₹750, Instructor: Ananya Mehta)
3. **Power Yoga** (Strength, 50 mins, ₹800, Instructor: Rohan Kapoor)
4. **Beginner Yoga** (Foundation, 45 mins, ₹500, Instructor: Nikita Verma)
5. **Pranayama & Breathwork** (Restoration, 40 mins, ₹550, Instructor: Nikita Verma)
6. **Mobility & Stretching** (Restoration, 50 mins, ₹600, Instructor: Ananya Mehta)

---

## 7. Directory Structure Reference

```
Yoga_Studio_LMS_Demo_Phase_7/
├── app/                        # Next.js App Router (Public, Dashboard, Instructor, Admin)
│   ├── about/                  # About page
│   ├── admin/                  # 15 Admin submodules (customers, bookings, reports, etc.)
│   ├── book/                   # Multi-step booking funnel
│   ├── booking-confirmation/   # Booking success receipt
│   ├── classes/                # Class catalog and dynamic [slug] details
│   ├── contact/                # Contact and inquiry form
│   ├── dashboard/              # Customer portal (bookings, plans, payments, profile)
│   ├── instructor/             # Instructor portal (sessions, attendance rosters)
│   ├── login/                  # Role-switching demo login
│   ├── plans/                  # Membership plans showcase
│   ├── register/               # Simulated OTP registration
│   ├── schedule/               # Weekly schedule timetable
│   ├── globals.css             # Global styles and Tailwind v4 theme
│   ├── layout.tsx              # Root HTML & font layout
│   └── page.tsx                # Marketing home page
├── components/                 # Reusable UI component modules
│   ├── admin/                  # Admin management panels, data tables, and forms
│   ├── auth/                   # Login & registration forms
│   ├── booking/                # Booking checkout and confirmation widgets
│   ├── contact/                # Contact form
│   ├── dashboard/              # Customer view widgets (bookings, pass, payments)
│   ├── demo/                   # Top demo switcher menu
│   ├── instructor/             # Session list, attendance roster, promo dialog
│   ├── plans/                  # Pricing comparison cards
│   ├── shared/                 # Header, Footer, Brand, ClassCard, SessionCard, etc.
│   └── ui/                     # Radix & shadcn design primitives (dialog, button, table, etc.)
├── data/                       # Initial mock fixtures (mock-data.ts, admin-config.ts)
├── db/                         # Drizzle schema (ready for future SQLite/D1 database)
├── hooks/                      # Custom hooks (useDemoSession, useMobile)
├── lib/                        # Utility helpers (cn, formatting)
├── public/                     # Static imagery (hero.jpg, class.jpg, instructor.jpg, icons)
├── services/                   # Browser storage and admin operations layer
├── types/                      # TypeScript domain, demo, and admin interfaces
├── next.config.ts              # Next.js static export config (output: "export")
├── package.json                # Dependencies and build scripts
└── README.md                   # Project summary and phase tracking
```

---

## 8. Development & Deployment Guide

### Local Development:
```bash
# Install dependencies
pnpm install

# Start development server (port 3000 or 5173)
pnpm dev
```

### Production Build:
```bash
# Generates static export in the "out" directory
pnpm build
```

### Cloud Deployment (Vercel & Netlify):
* **Vercel**: Works out of the box with `pnpm build` (`next build`). The output directory is automatically managed.
* **Netlify**: Configured via `netlify.toml` running `pnpm run build:netlify` and publishing the `out/` folder.

---

## 9. Context for Future AI Development / Phase 8 Scope

When expanding or maintaining this repository:
1. **Preserve Zero-Backend Fidelity**: Keep changes client-compatible with `localStorage` fallback unless explicitly requested to connect a live database.
2. **Phase 8 Focus Areas**:
   - Enhanced WCAG 2.2 accessibility (ARIA attributes, screen-reader cues, keyboard navigation).
   - Polished empty states and loading skeletons for data tables.
   - Granular permission boundaries for multi-tenant staff accounts.
   - Additional automated Cypress / Playwright E2E testing.
