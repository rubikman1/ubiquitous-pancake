# Beyond The Blades (ASD Foundation) — PRD

## Original Problem Statement
Build a non-profit website for "Beyond The Blades (ASD Foundation)" — an autism care foundation running hockey, badminton, and hiking. Pages required: Main, About Us, Impact (with the quote "Different, not less." — Dr. Temple Grandin), Get Involved (donate, activity sign-up, volunteer). Every page bottom needs a Donate button + "© 2026 Beyond The Blades | Non-Profit Organization" copyright. Palette: shades of blue + white.

## User Choices
- Imagery: user will provide photos later; placeholders used for now (Unsplash/Pexels)
- Donate: Stripe real donations (sk_test_emergent shared key)
- Volunteer & activity sign-up: functional, persisted to MongoDB
- Contact email: forceflee.exe@yahoo.com
- Design vibe: Clean & modern + Warm & inviting

## Architecture
- Frontend: React 19 + React Router, Tailwind CSS, shadcn/ui components, lucide icons, sonner toasts. Fonts: Outfit (display) + Work Sans (body).
- Backend: FastAPI with /api prefix; MongoDB via motor. Stripe via `emergentintegrations.payments.stripe.checkout`.
- Collections: `volunteers`, `activity_signups`, `contact_messages`, `payment_transactions`.

## Implemented (Dec 2025)
- Home, About, Impact, Get Involved, Donate Success pages
- Global header with nav + Donate CTA; global footer with large Donate band + copyright on every page
- Stripe Checkout flow (fixed packages $25/$50/$100/$250 + custom amount) with server-side price enforcement, polling-based status page, graceful fallback if Stripe status lookup fails
- Volunteer sign-up form (name, email, phone, interests multi-select, message)
- Activity sign-up form (hockey / badminton / hiking) with participant age + notes
- Contact email link + share page utility
- Temple Grandin quote prominently on Impact page
- Responsive mobile nav, micro-interactions, soft blue/white palette

## Backend Endpoints
- `GET /api/` — health
- `GET /api/donations/packages`
- `POST /api/donations/checkout` — { package_id | custom_amount, origin_url, donor_name?, donor_email? }
- `GET /api/donations/status/{session_id}` — polling endpoint with DB fallback
- `POST /api/webhook/stripe`
- `POST /api/volunteers` / `GET /api/volunteers`
- `POST /api/activity-signups` / `GET /api/activity-signups`
- `POST /api/contact`

## Testing
- Backend: 18/18 passing (iteration_1 had 17/18 due to upstream Stripe status lookup; fixed with graceful DB fallback → now verified 200 OK)
- Frontend: visual verification via screenshot

## Backlog (P1 / P2)
- P1: Admin view to export volunteer/activity/donation submissions
- P1: Email receipts via Resend/SendGrid on successful donation + volunteer confirmation
- P2: Recurring monthly donations (Stripe subscriptions)
- P2: Real photos from the foundation replacing placeholders
- P2: Rate limiting on public POSTs (spam protection)
- P2: Events calendar / session schedule
