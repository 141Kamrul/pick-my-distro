# Architecture Overview

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     NEXT.JS APPLICATION                      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴──────────────┐
                │                            │
        ┌───────▼────────┐          ┌──────▼──────────┐
        │   FRONTEND     │          │   ADMIN PANEL   │
        │  /frontend     │          │   /admin        │
        └────────────────┘          └─────────────────┘
                │                            │
                │                      ┌─────▼──────────┐
                │                      │  Login Page    │
                │                      │  /admin/login  │
                │                      └────────────────┘
                │                            │
                │                      ┌─────▼──────────────┐
                │                      │  Dashboard         │
                │                      │  /admin/dashboard  │
                │                      │  (Protected)       │
                │                      └────────────────────┘
                │
                └─────────────────────────────────┐
                                                  │
                ┌─────────────────────────────────▼──────┐
                │        API LAYER (/api)               │
                ├──────────────────────────────────────┤
                │  Distros:                            │
                │  • GET    /api/distros               │
                │  • POST   /api/distros               │
                │  • PUT    /api/distros?id=           │
                │  • DELETE /api/distros?id=           │
                │                                      │
                │  Attributes:                         │
                │  • GET    /api/distros/attributes    │
                │  • POST   /api/distros/attributes    │
                │  • PUT    /api/distros/attributes    │
                │  • DELETE /api/distros/attributes    │
                │                                      │
                │  Auth:                               │
                │  • POST /api/admin/auth              │
                │  • GET  /api/admin/session           │
                │  • POST /api/admin/session (logout)  │
                └──────────────────────────────┬────────┘
                                               │
                          ┌────────────────────▼───────────┐
                          │   LIBRARIES & UTILITIES        │
                          ├────────────────────────────────┤
                          │  lib/auth.ts                   │
                          │  • JWT token management        │
                          │  • Session handling            │
                          │  • Cookie management           │
                          │                                │
                          │  lib/db.ts                     │
                          │  • Data models (Distro)        │
                          │  • Data models (Attribute)     │
                          │  • CRUD operations             │
                          │  • In-memory storage           │
                          └────────────────────────────────┘
```

## Frontend User Flow

```
User Visits /frontend
        │
        ▼
┌─────────────────────────────┐
│  Render Filter Interface    │
│  (DistroFilter Component)   │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐      Fetch via AJAX
│  Load Available Filters     ├─────▶ GET /api/distros/attributes
│  and Distros               │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  User Adjusts Filters       │
│  (Select, Range, etc.)      │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Apply Client-side Filters  │
│  (Instant filtering)        │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Display Matching Distros   │
│  with Details and Links     │
└─────────────────────────────┘
```

## Admin User Flow

```
User Visits /admin
        │
        ▼
┌──────────────────────┐
│ Redirect to /login   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────┐
│  AdminLogin Component    │
│  (Email + Password)      │
└──────────┬───────────────┘
           │
           ▼
    POST /api/admin/auth
  (login or register)
           │
           ├─────────────────┐
           │                 │
      Success            Failure
           │                 │
           ▼                 ▼
  Set Auth Cookie      Show Error
           │
           ▼
  Redirect to /admin/dashboard
           │
           ▼
┌────────────────────────────┐
│  Check Session             │
│  GET /api/admin/session    │
└────────────┬───────────────┘
             │
        ┌────┴────┐
        │          │
   Authenticated  Not Authenticated
        │          │
        ▼          ▼
   Dashboard  Redirect to Login
        │
        ▼
┌─────────────────────────────┐
│  Manage Distros/Attributes  │
│  • View all distros         │
│  • Add new distro           │
│  • Delete distro            │
│  • Manage attributes        │
└─────────────────────────────┘
```

## Component Hierarchy

```
RootLayout (app/layout.tsx)
│
├─ app/page.tsx (redirects to /frontend)
│
├─ app/frontend/page.tsx
│  └─ DistroFilter Component
│     ├─ Filter Sidebar
│     │  ├─ Select Filters
│     │  ├─ Multi-select Filters
│     │  ├─ Range Filters
│     │  └─ Boolean Filters
│     └─ Results Grid
│        └─ Distro Cards (with details)
│
└─ app/admin/
   ├─ login/page.tsx
   │  └─ AdminLogin Component
   │     └─ Login Form
   │
   └─ dashboard/page.tsx
      ├─ Auth Check
      └─ DistroManagement Component
         ├─ Add Distro Form
         └─ Distro Cards Grid
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│           In-Memory Database                │
│  (lib/db.ts - Replace with real DB)        │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ Distros Array                          │ │
│  │ ├─ Ubuntu                              │ │
│  │ ├─ Fedora                              │ │
│  │ └─ Arch Linux                          │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ Attributes Array                       │ │
│  │ ├─ Ease of Use                         │ │
│  │ ├─ Desktop Environment                 │ │
│  │ ├─ Package Manager                     │ │
│  │ ├─ ISO Size                            │ │
│  │ └─ Rolling Release                     │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ Admins Map                             │ │
│  │ └─ {email: password}                   │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
        ▲                           │
        │                           │
        │        ┌──────────────────┴──────────────┐
        │        │                                 │
   CREATE/       │                          READ/UPDATE/
   READ      ┌───▼───┐                      DELETE
        ├────┤       ├────────────────────┐
        │    │  API  │                    │
        │    │Routes │                    │
        │    └───┬───┘                    │
        │        │                        │
        │        ├─ /api/distros          │
        │        │                        │
        │        ├─ /api/distros/attributes
        │        │                        │
        │        ├─ /api/admin/auth       │
        │        │                        │
        │        └─ /api/admin/session    │
        │                                 │
        │                                 │
   ┌────┴──────────────┐      ┌───────────▼──────┐
   │                   │      │                  │
Frontend Component   Admin Component  Session Check
(DistroFilter)       (DistroMgmt)    & Auth Tokens
(AdminLogin)
```

## Technology Stack

```
┌────────────────────────────────────────────────┐
│                 CLIENT (Browser)               │
├────────────────────────────────────────────────┤
│  • React 19.2.4                                │
│  • TypeScript                                  │
│  • Tailwind CSS                                │
│  • AJAX (Fetch API)                            │
└─────────────┬──────────────────────────────────┘
              │ HTTP Requests
              ▼
┌────────────────────────────────────────────────┐
│            SERVER (Next.js 16.2.2)             │
├────────────────────────────────────────────────┤
│  • App Router (React Server Components)        │
│  • API Routes (Route Handlers)                 │
│  • Middleware (Auth, Sessions)                 │
│  • Server Actions (optional)                   │
└─────────────┬──────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────┐
│           RUNTIME LIBRARIES                    │
├────────────────────────────────────────────────┤
│  • jsonwebtoken - JWT authentication           │
│  • next/navigation - Routing                   │
│  • next/cookies - Session management           │
└─────────────┬──────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────┐
│      DATA LAYER (In-Memory Store)              │
├────────────────────────────────────────────────┤
│  • Distro Model                                │
│  • FilterAttribute Model                       │
│  • Admin Credentials                           │
│                                                │
│  TODO: Replace with real database              │
│  Options:                                      │
│  • PostgreSQL + Prisma                         │
│  • MongoDB + Mongoose                          │
│  • MySQL + TypeORM                             │
│  • SQLite + Drizzle                            │
└────────────────────────────────────────────────┘
```

## Request/Response Cycle

### Frontend Filter Request
```
1. User selects filters
                │
2. onChange event fires
                │
3. setFilters() updates state
                │
4. useEffect triggers applyFilters()
                │
5. Filters applied client-side (instant)
                │
6. Filtered results displayed
```

### Admin Add Distro Request
```
1. Admin fills form
                │
2. Submits POST request
                │
3. fetch('/api/distros', {method: 'POST'})
                │
4. API route receives request
                │
5. createDistro() adds to database
                │
6. Returns new distro object
                │
7. Component adds to local state
                │
8. UI updates with new distro
```

### Admin Login Request
```
1. Admin submits credentials
                │
2. POST /api/admin/auth
                │
3. Verify password
                │
4. Sign JWT token
                │
5. Set HTTP-only cookie
                │
6. Redirect to dashboard
                │
7. Dashboard checks session
                │
8. Grant access
```

## Security Flow

```
┌──────────────────────────────────────────┐
│         ADMIN ACTION INITIATED            │
│  (Create, Update, Delete Distro)         │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│      JWT TOKEN ATTACHED TO REQUEST       │
│  (HTTP-Only Cookie Auto-included)        │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│        REQUEST REACHES API ROUTE         │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│     AUTH MIDDLEWARE CHECK (Future)       │
│  Option: Protect with getAdminSession()  │
└─────────────┬────────────────────────────┘
              │
         ┌────┴────┐
         │          │
    Valid       Invalid
         │          │
         ▼          ▼
     Proceed    Return 401
         │
         ▼
     Execute
     Operation
         │
         ▼
    Return Result
```

---

## Notes for Production

1. **Database**: Move from in-memory store to real database (PostgreSQL recommended)
2. **Auth Middleware**: Implement proper route protection
3. **Error Handling**: Enhanced validation and error messages
4. **Logging**: Add application logging
5. **Rate Limiting**: Prevent abuse
6. **CORS**: Configure if needed
7. **Monitoring**: Add application monitoring
