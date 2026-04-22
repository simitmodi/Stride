# Stride: Seamless Bank Appointments

Stride is a production-ready web application that revolutionizes bank appointment booking. It provides a digital-first platform where customers can view available slots, book appointments, and manage their banking visits with instant confirmation, while bank staff can manage availability, view schedules, and approve or decline requests — all backed by 24/7 AI-powered support.

> 🚀 **Prototype complete. Entering production phase.**  
> Live at: **[https://gostride.online](https://gostride.online)**

---

## 📋 Project Overview

| Field | Value |
|---|---|
| **Name** | Stride: Seamless Bank Appointments |
| **Owner** | simitmodi |
| **Created** | September 23, 2025 |
| **Last Updated** | April 22, 2026 |
| **Version** | 0.1.0 |
| **Status** | ✅ Prototype Ready — Entering Production |
| **Language** | TypeScript (98.5%), Other (1.5%) |
| **Homepage** | https://gostride.online |
| **Repository** | https://github.com/simitmodi/Stride |

---

## 🎯 Project Purpose

Stride eliminates the frustrations of traditional bank visits by:
- Allowing **customers** to view live slot availability, book appointments, and manage their schedule from anywhere
- Enabling **bank staff** to manage their availability, review appointment queues, and approve or decline requests in real time
- Providing a **24/7 AI chat assistant** to answer customer questions instantly
- Offering a **transparent, efficient, and multilingual** experience for all users

---

## 🏗️ Architecture Overview

### **Tech Stack**

#### **Frontend Framework**
- **Next.js 15.5.9** with React 18.3.1
  - Server-side rendering and static generation
  - Turbopack development server (port 9002)
  - Optimized performance with streaming

#### **Backend & Database**
- **Firebase 11.9.1**
  - Authentication & role-based authorization
  - Firestore database with custom indexes
  - Security rules enforcement
  - Real-time data synchronization
  - Push notification delivery via Web Push API

#### **AI Integration**
- **Google Genkit 1.14.1**
  - `@genkit-ai/googleai` — AI model integration (Gemini)
  - `@genkit-ai/next` — Next.js server action integration
  - Genkit CLI for local AI flows development and testing

#### **UI/Styling**
- **Tailwind CSS 3.4.1** — Utility-first CSS framework
- **Radix UI** — 25+ accessible, headless UI components:
  - Accordion, Alert Dialog, Avatar, Checkbox, Collapsible
  - Dialog, Dropdown Menu, Label, Menubar, Popover, Progress
  - Radio Group, Scroll Area, Select, Separator
  - Slider, Slot, Switch, Tabs, Toast, Tooltip
- **shadcn/ui** — Pre-built component patterns built on Radix UI
- **Framer Motion 12.34.5** — Declarative animations and gestures
- **Motion 12.23.26** — Lightweight animation primitives
- **GSAP 3.14.2** — High-performance timeline animations
- **Three.js 0.183.2 & React Three Fiber 9.5.0** — Interactive 3D graphics
- **React Parallax Tilt** — Tilt/hover parallax effects
- **Lenis 1.3.17** — Smooth scroll library

#### **Additional Libraries**
- **Form Management:** React Hook Form 7.54.2, Zod 3.25.x (schema validation)
- **Date Handling:** date-fns 3.6.0, React Day Picker 8.10.1
- **Data Visualization:** Recharts 2.15.1
- **Document Generation:** html2canvas 1.4.1, jspdf 2.5.1
- **Markdown Rendering:** react-markdown 10.1.0
- **Push Notifications:** web-push 3.6.7
- **Carousel:** embla-carousel-react 8.6.0
- **Icons:** lucide-react 0.475.0
- **Analytics:** Vercel Analytics 1.6.1, Vercel Speed Insights 1.3.1
- **Utilities:** class-variance-authority, clsx, tailwind-merge, maath, dotenv

---

## 📁 Directory Structure

```
Stride/
├── src/
│   ├── app/                          → Next.js App Router pages & layouts
│   │   ├── page.tsx                  → Main landing page
│   │   ├── layout.tsx                → Root layout with providers
│   │   ├── about/                    → About Us page
│   │   ├── faq/                      → FAQ page
│   │   ├── contact/                  → Contact page
│   │   ├── privacy/                  → Privacy Policy page
│   │   ├── terms/                    → Terms of Service page
│   │   ├── login/                    → Customer & staff login
│   │   ├── signup/                   → New user registration
│   │   ├── developers/               → Developer portal
│   │   │   └── [slug]/               → Individual developer profiles
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            → Shared dashboard layout
│   │   │   ├── customer/             → Customer dashboard
│   │   │   │   ├── page.tsx          → Customer home
│   │   │   │   ├── appointments/     → Appointments list
│   │   │   │   ├── appointment-scheduling/ → Book new appointment
│   │   │   │   ├── appointment-details/    → View appointment details
│   │   │   │   ├── appointment-confirmation/ → Post-booking confirmation
│   │   │   │   ├── document-checklist/     → Required documents tracker
│   │   │   │   └── profile/          → Customer profile management
│   │   │   └── bank/                 → Bank staff dashboard
│   │   │       ├── page.tsx          → Staff home & schedule view
│   │   │       ├── appointment-confirmation/ → Confirm/manage appointments
│   │   │       └── profile/          → Staff profile management
│   │   └── api/
│   │       ├── chat/                 → AI chat API route (Genkit)
│   │       └── notifications/        → Push notification API route
│   │
│   ├── components/                   → Reusable React components
│   │   ├── ui/                       → shadcn/ui component library
│   │   ├── landing/                  → Landing page sections
│   │   │   ├── HeroMockup.tsx        → Hero with 3D/animated mockup
│   │   │   ├── BackgroundWaves.tsx   → Animated background
│   │   │   ├── FloatingDoodles.tsx   → Decorative floating elements
│   │   │   ├── ProblemSection.tsx    → Problem/Solution showcase
│   │   │   ├── ProcessSection.tsx    → Step-by-step flow demo
│   │   │   ├── FeaturesSection.tsx   → Key features grid
│   │   │   ├── StatsSection.tsx      → Live statistics display
│   │   │   ├── TestimonialSection.tsx → Customer testimonials
│   │   │   ├── SectionBlocks.tsx     → CTA sections
│   │   │   ├── RoadmapModal.tsx      → Product roadmap dialog
│   │   │   ├── LanguageSwitcher.tsx  → Google Translate switcher
│   │   │   ├── DevelopersFloatingBackground.tsx
│   │   │   └── AnimateIn.tsx         → Scroll-triggered animation wrapper
│   │   ├── dashboard/                → Dashboard-specific components
│   │   ├── auth/                     → Authentication components
│   │   ├── notifications/
│   │   │   └── NotificationManager.tsx → Push notification handler
│   │   ├── animate-ui/               → Advanced animation components
│   │   ├── appointment-card.tsx      → Appointment list card
│   │   ├── appointment-details-modal.tsx
│   │   ├── customer-appointment-details-modal.tsx
│   │   ├── bank-upcoming-appointments.tsx
│   │   ├── bank-past-appointments.tsx
│   │   ├── upcoming-appointments.tsx
│   │   ├── past-appointments.tsx
│   │   ├── three-month-calendar.tsx  → 3-month calendar picker
│   │   ├── chat-widget.tsx           → AI chat bubble widget
│   │   ├── greeting.tsx              → Personalized greeting component
│   │   ├── editable-field.tsx        → Inline profile editing
│   │   ├── password-strength.tsx     → Password strength indicator
│   │   ├── root-header.tsx           → Conditional root header
│   │   ├── header.tsx                → Main navigation header
│   │   ├── footer.tsx                → Application footer
│   │   ├── scroll-aware-footer.tsx   → Scroll-aware footer visibility
│   │   ├── FirebaseErrorListener.tsx → Firebase error boundary
│   │   ├── SessionTimeoutHandler.tsx → Auto session timeout
│   │   ├── ThreeBackground.tsx       → Three.js background canvas
│   │   ├── ElectricBorder.tsx        → Animated electric border effect
│   │   ├── ShinyText.tsx             → Shiny/gradient text component
│   │   ├── SplitText.tsx             → Character-split animation text
│   │   ├── ScrollStack.tsx           → Scroll-driven stacked cards
│   │   ├── Stack.tsx                 → Layout stack component
│   │   ├── TermsCheckbox.tsx         → Terms acceptance checkbox
│   │   └── RadixCheckboxDemo.tsx     → Radix checkbox example
│   │
│   ├── firebase/                     → Firebase configuration
│   │   ├── index.ts                  → Firebase app initialization
│   │   ├── provider.ts               → Firebase context provider
│   │   └── client-provider.tsx       → Client-side Firebase wrapper
│   │
│   ├── hooks/                        → Custom React hooks
│   │   └── use-toast.ts              → Toast notification hook
│   │
│   ├── lib/                          → Utilities and static assets
│   │   ├── utils.ts                  → Common utility functions
│   │   └── Logo.png                  → Stride logo asset
│   │
│   └── ai/                           → Genkit AI integration
│       └── dev.ts                    → AI flows development entry point
│
├── public/                           → Static public assets
│   └── icon.png                      → PWA / browser icon
│
├── docs/                             → Documentation directory
│
├── next.config.ts                    → Next.js configuration
├── tailwind.config.ts                → Tailwind CSS theme & plugins
├── tsconfig.json                     → TypeScript configuration
├── components.json                   → shadcn/ui component registry
├── postcss.config.mjs                → PostCSS configuration
├── firebase.json                     → Firebase Hosting configuration
├── .firebaserc                       → Firebase project binding
├── firestore.indexes.json            → Custom Firestore query indexes
├── firestore.rules                   → Firestore security rules
├── apphosting.yaml                   → Google Cloud App Hosting config
├── package.json                      → Project dependencies
└── README.md                         → Project documentation
```

---

## 🎨 Core Features & Functionality

### **Customer Portal**
- View real-time appointment slot availability
- Book, reschedule, and cancel appointments
- Track appointment status (pending / confirmed / declined)
- Download appointment confirmation documents (PDF via jsPDF)
- Document checklist to prepare required items before the visit
- Three-month calendar view for flexible scheduling
- AI-powered chat assistant available 24/7

### **Bank Staff Portal**
- Manage personal availability and working hours
- View upcoming and past appointment schedules
- Approve or decline customer appointment requests
- View detailed appointment information

### **Landing Page Experience**
- Animated hero section with 3D interactive mockup (Three.js)
- Problem/Solution showcase with scroll-triggered animations
- Step-by-step process demonstration
- Feature highlights grid
- Live statistics dashboard
- Customer testimonial carousel
- Product roadmap modal (Phases: Foundation ✅ → Aesthetics ✅ → Universal Sync 🔄 → Global Scale 🔜)
- Call-to-action conversion sections

### **Platform-wide Features**
- **Push Notifications** — Web Push API for appointment reminders and status updates
- **AI Chat** — Genkit + Gemini powered chat widget for instant customer support
- **Multi-language Support** — 10+ languages via Google Translate (English, Hindi, Bengali, Tamil, Telugu, Gujarati, French, Spanish, German, Italian)
- **Session Management** — Automatic session timeout with configurable duration
- **Firebase Error Handling** — Real-time error boundary with user-friendly messages
- **Scroll-Aware Navigation** — Dynamic header/footer visibility based on scroll
- **3D Visualizations** — Interactive Three.js backgrounds and mockups
- **Animation System** — Framer Motion + GSAP + Lenis smooth scroll
- **Accessibility** — WCAG-compliant components via Radix UI primitives

### **Additional Pages**
- `/about` — Mission, vision, and product pillars
- `/faq` — Frequently asked questions
- `/contact` — Contact form and support info
- `/privacy` — Privacy policy
- `/terms` — Terms of service
- `/developers` — Developer portal with individual developer profiles

---

## 📦 Dependencies Summary

### **Production Dependencies**
```
Core Framework:
  next@^15.5.9, react@^18.3.1, react-dom@^18.3.1

AI & Backend:
  firebase@^11.9.1
  genkit@^1.14.1, @genkit-ai/googleai@^1.14.1, @genkit-ai/next@^1.14.1
  web-push@^3.6.7

UI & Styling:
  tailwindcss@^3.4.1, tailwind-merge@^3.0.1, class-variance-authority@^0.7.1
  tailwindcss-animate@^1.0.7, radix-ui@^1.4.3
  @radix-ui/* (25+ components)
  framer-motion@^12.34.5, motion@^12.23.26, gsap@^3.14.2
  lenis@^1.3.17, react-parallax-tilt@^1.7.319

3D Graphics:
  three@^0.183.2, @react-three/fiber@^9.5.0, @react-three/drei@^10.7.7

Form & Validation:
  react-hook-form@^7.54.2, @hookform/resolvers@^4.1.3, zod@^3.25.x

Date & Calendar:
  date-fns@^3.6.0, react-day-picker@^8.10.1

Utilities:
  lucide-react@^0.475.0, clsx@^2.1.1, maath@^0.10.8
  html2canvas@^1.4.1, jspdf@^2.5.1
  react-markdown@^10.1.0, embla-carousel-react@^8.6.0
  recharts@^2.15.1, dotenv@^16.5.0, patch-package@^8.0.0

Analytics:
  @vercel/analytics@^1.6.1, @vercel/speed-insights@^1.3.1
```

### **Development Dependencies**
```
typescript@^5, postcss@^8, tailwindcss@^3.4.1, genkit-cli@^1.14.1
@types/node@^20, @types/react@^18, @types/react-dom@^18
@types/jspdf@^2.0.0, @types/web-push@^3.6.4
```

---

## 🔧 Build & Deployment

### **Firebase Integration**
- **Hosting:** Firebase Hosting with custom rewrite rules
- **Database:** Firestore with custom indexes for optimized queries
- **Security Rules:** Row-level access control in `firestore.rules`
- **Index Configuration:** Custom composite indexes in `firestore.indexes.json`

### **Deployment Infrastructure**
- **Primary Host:** Google Cloud App Hosting (`apphosting.yaml`)
- **Analytics:** Vercel Analytics & Speed Insights
- **CDN:** Global distribution through Firebase CDN
- **Live URL:** https://gostride.online

---

## 🌟 Project Maturity

### **Current Status**
- **Version:** 0.1.0
- **Phase:** Prototype complete → Entering production
- **Development Timeline:** Started September 2025
- **Last Activity:** April 22, 2026

### **Production Readiness Checklist**
✅ Complete customer and bank staff portals  
✅ Full appointment lifecycle (book → confirm → complete)  
✅ AI-powered 24/7 chat assistant  
✅ Push notification system (Web Push API)  
✅ PDF appointment confirmation generation  
✅ Document checklist system  
✅ Comprehensive tech stack (Next.js 15, Firebase, Genkit)  
✅ Professional infrastructure (Firebase Hosting, Google Cloud)  
✅ Firestore security rules and role-based access  
✅ Error handling and session management  
✅ Performance monitoring (Vercel Analytics)  
✅ Multi-language support (10+ languages)  
✅ Accessibility standards (Radix UI primitives)  
✅ TypeScript throughout — full type safety  
✅ Live production URL (https://gostride.online)  

---

## 🔍 Notable Implementation Details

### **Code Standards**
- **Language:** 100% TypeScript across the entire codebase
- **Consistency:** Every source file ends with the comment `// Stride: Professional Financial Connectivity`
- **Type Safety:** Full end-to-end TypeScript including Firebase, API routes, and AI flows

### **Architecture Patterns**
- **Provider Pattern:** Firebase context wraps the entire app for global auth/db state
- **App Router:** Next.js 15 App Router with nested layouts per portal (customer / bank)
- **Component Composition:** Modular, reusable components with clear single responsibilities
- **Custom Hooks:** Shared logic extracted into hooks (`use-toast`, etc.)
- **Server Actions:** Genkit AI flows integrated as Next.js server actions via `@genkit-ai/next`

### **Development Features**
- **Turbopack:** Fast incremental development builds
- **Hot Module Reloading:** Instant page updates during development
- **TypeScript Checking:** `npm run typecheck` for pre-commit validation
- **ESLint:** Code quality enforcement via Next.js built-in ESLint config

### **Product Roadmap** *(from RoadmapModal)*
| Phase | Title | Status |
|---|---|---|
| 01 | Foundation — Financial core, 3D architecture, auth system | ✅ Completed |
| 02 | Aesthetics — Elite glass UI, motion engine, help center | ✅ Completed |
| 03 | Universal Sync — Landing integration, roadmap launch, cross-platform | 🔄 Active |
| 04 | Global Scale — AI scheduling, bank APIs, mobile apps | 🔜 Upcoming |

---

## 📊 Statistics

| Metric | Value |
|---|---|
| Repository Size | 6.6 MB |
| Primary Language | TypeScript (98.5%) |
| Production Dependencies | 60+ |
| Dev Dependencies | 9 |
| Supported Languages | 10+ |
| App Routes | 15+ pages/routes |
| UI Components | 25+ Radix UI + custom components |

---

## 🚀 Roadmap — Next Steps

With the prototype complete, Stride is positioned for:
- 📱 Mobile native applications (iOS & Android)
- 🏦 Direct bank core system API integrations
- 🤖 Advanced AI appointment scheduling (auto-suggest optimal times)
- 📊 Analytics dashboards for bank managers
- 🔗 Multi-tenant deployment for enterprise banking groups
- 🌐 Expanded language support

---

## 📝 Additional Information

- **Live Site:** https://gostride.online
- **Repository:** https://github.com/simitmodi/Stride
- **Deployment Platforms:** Firebase, Google Cloud App Hosting
- **Primary Language:** TypeScript

---

*Last Updated: April 22, 2026*
