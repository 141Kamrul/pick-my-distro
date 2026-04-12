# Database Quick Reference

## Key Commands

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Run migrations
npx prisma db seed         # Seed with sample data

# View/manage database
npx prisma studio         # Open GUI database manager

# Development
npm run dev               # Start Next.js dev server

# Reset database (caution!)
npx prisma migrate reset
```

## Database Schema Overview

```
Admin
├─ id (String, Primary Key)
├─ username (String, Unique)
└─ password (String)

FilterAttribute
├─ id (String, Primary Key)
├─ name (String, Unique)
├─ type (String: select, multi-select, range, boolean, text)
├─ options (String[])
├─ minValue (Int?)
├─ maxValue (Int?)
└─ description (String?)

Distro
├─ id (String, Primary Key)
├─ name (String, Unique)
├─ description (String?)
├─ image (String?)
└─ website (String?)

DistroAttribute (Junction)
├─ id (String, Primary Key)
├─ distroId (Foreign Key → Distro)
├─ attributeId (Foreign Key → FilterAttribute)
└─ value (String)
```

## Environment Variables (.env.local)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pick_my_distro"
JWT_SECRET="your-secret-key-here"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

## Prisma File Locations

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Seed file: `prisma/seed.ts`
- Generated Client: `node_modules/.prisma/client/`

## Connection Issues?

1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify DATABASE_URL in `.env.local`
3. Test connection: `psql $DATABASE_URL`
4. Check port 5432 is available: `netstat -tulpn | grep 5432`

## Next Steps

1. Run `npm install` to install all dependencies
2. Set up PostgreSQL database (see DATABASE_SETUP.md)
3. Update `.env.local` with your database credentials
4. Run `npx prisma migrate dev --name init`
5. Run `npx prisma db seed` to populate with sample data
6. Start development: `npm run dev`
