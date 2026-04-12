# Database Setup Guide

## PostgreSQL Installation

### On Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### On macOS (with Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

### On Windows:
Download from https://www.postgresql.org/download/windows/

## Database Configuration

### 1. Create Database and User:

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE pick_my_distro;
CREATE USER pick_user WITH PASSWORD 'secure_password_here';
ALTER ROLE pick_user SET client_encoding TO 'utf8';
ALTER ROLE pick_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE pick_user SET default_transaction_deferrable TO on;
ALTER ROLE pick_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE pick_my_distro TO pick_user;
\q
```

### 2. Update `.env.local`:

```env
DATABASE_URL="postgresql://pick_user:secure_password_here@localhost:5432/pick_my_distro"
```

## Setup Prisma

### 1. Install dependencies:
```bash
npm install
```

### 2. Generate Prisma Client:
```bash
npx prisma generate
```

### 3. Run migrations:
```bash
npx prisma migrate dev --name init
```

### 4. Seed database (optional):
```bash
npx prisma db seed
```

## Prisma Studio (GUI Database Browser)

View and manage your database visually:
```bash
npx prisma studio
```

This opens http://localhost:5555 in your browser.

## Next Steps

1. **Update API Routes** - Use new Prisma functions in your API files
2. **Environment Variables** - Keep `.env.local` secure (add to `.gitignore`)
3. **Testing** - Test database connections with the admin panel

## Troubleshooting

**Connection refused?**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in `.env.local`

**Migration issues?**
- Reset database: `npx prisma migrate reset`
- Check schema.prisma syntax

**Port already in use?**
- PostgreSQL default port is 5432. Check `netstat -tulpn | grep 5432`
