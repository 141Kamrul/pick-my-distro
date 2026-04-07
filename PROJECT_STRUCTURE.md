# Pick My Distro - Linux Distribution Filtering Web App

A modern Next.js application for filtering and discovering Linux distributions based on various attributes. Features include an admin panel for managing distros and a frontend for users to filter and browse.

## Project Structure

```
pick-my-distro/
├── app/
│   ├── admin/                 # Admin panel routes
│   │   ├── page.tsx          # Admin root (redirects to login)
│   │   ├── login/            # Login page
│   │   │   └── page.tsx
│   │   └── dashboard/        # Admin dashboard
│   │       └── page.tsx
│   ├── frontend/              # Public-facing pages
│   │   └── page.tsx          # Main filtering interface
│   ├── api/                   # API endpoints
│   │   ├── distros/          # Distro CRUD endpoints
│   │   │   ├── route.ts      # GET, POST, PUT, DELETE distros
│   │   │   └── attributes/   # Filter attributes endpoints
│   │   │       └── route.ts
│   │   └── admin/            # Admin authentication endpoints
│   │       ├── auth/         # Login/register
│   │       │   └── route.ts
│   │       └── session/      # Session management
│   │           └── route.ts
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home (redirects to /frontend)
│   └── globals.css           # Global styles
├── components/               # Reusable React components
│   ├── AdminLogin.tsx        # Admin login component
│   ├── DistroManagement.tsx  # Admin distro management
│   └── DistroFilter.tsx      # Frontend filter interface
├── lib/                       # Utility functions and database
│   ├── auth.ts               # JWT authentication utilities
│   └── db.ts                 # Database models and operations
├── public/                   # Static assets
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.ts            # Next.js config
└── README.md                 # This file
```

## Getting Started

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to the frontend filtering interface.

## Features

### Frontend (`/frontend`)
- Browse all available Linux distributions
- Filter distros by multiple attributes:
  - **Ease of Use**: Select from Beginner Friendly, Intermediate, Advanced
  - **Desktop Environment**: Multi-select from available DE options
  - **Package Manager**: Select package manager type
  - **ISO Size**: Range filter for download size
  - **Rolling Release**: Boolean toggle for rolling release distros
- Real-time filtering with AJAX API calls
- Responsive design for mobile and desktop
- Reset filters functionality

### Admin Panel (`/admin`)
- **Login**: Secure authentication with JWT tokens
- **Dashboard**: Protected admin interface
- **Distro Management**: 
  - View all distros
  - Add new distros with details (name, description, website, image)
  - Delete existing distros
- **Attributes Management**: Coming soon

## API Endpoints

### Distros API
- `GET /api/distros` - Get all distros
- `GET /api/distros?id={id}` - Get single distro
- `POST /api/distros` - Create new distro (requires authentication)
- `PUT /api/distros?id={id}` - Update distro (requires authentication)
- `DELETE /api/distros?id={id}` - Delete distro (requires authentication)

### Attributes API
- `GET /api/distros/attributes` - Get all filter attributes
- `GET /api/distros/attributes?id={id}` - Get single attribute
- `POST /api/distros/attributes` - Create attribute (requires authentication)
- `PUT /api/distros/attributes?id={id}` - Update attribute (requires authentication)
- `DELETE /api/distros/attributes?id={id}` - Delete attribute (requires authentication)

### Admin Authentication API
- `POST /api/admin/auth` - Login/Register admin
  ```json
  {
    "email": "admin@example.com",
    "password": "password",
    "action": "login" // or "register"
  }
  ```
- `GET /api/admin/session` - Check current session
- `POST /api/admin/session` - Logout
  ```json
  {
    "action": "logout"
  }
  ```

## Database Structure

### Distro Model
```typescript
interface Distro {
  id: string;
  name: string;
  description: string;
  image?: string;
  website?: string;
  attributes: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### FilterAttribute Model
```typescript
interface FilterAttribute {
  id: string;
  name: string;
  type: 'select' | 'multi-select' | 'range' | 'boolean' | 'text';
  options?: string[];
  min?: number;
  max?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Sample Distros

The application comes with sample data:
- **Ubuntu** - Beginner friendly, GNOME desktop, apt package manager
- **Fedora** - Intermediate level, GNOME desktop, dnf package manager
- **Arch Linux** - Advanced, no default DE, pacman package manager, rolling release

## Authentication

- JWT-based authentication for admin panel
- Secure HTTP-only cookies for session management
- 24-hour token expiration
- Password stored in-memory (for production, use bcrypt hashing)

### First-time Setup

To create an admin account, use the login form with `action: "register"`:

```bash
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password",
    "action": "register"
  }'
```

Then login with the same credentials.

## Production Notes

Before deploying to production:

1. **Database**: Replace in-memory store in `lib/db.ts` with a real database (PostgreSQL, MongoDB, etc.)
2. **Security**: 
   - Use `bcrypt` for password hashing
   - Set strong `JWT_SECRET` environment variable
   - Enable HTTPS
   - Configure proper CORS policies
3. **Environment Variables**:
   ```
   JWT_SECRET=your-very-secure-secret-key-here
   NODE_ENV=production
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Dependencies

- **next** - React framework
- **react** - UI library
- **jsonwebtoken** - JWT authentication
- **tailwindcss** - Utility-first CSS framework
- **typescript** - Type safety

## License

This project is open source and available under the MIT License.
