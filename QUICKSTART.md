# Quick Start Guide

## 1. Start the Development Server

```bash
npm run dev
```

The app will run at `http://localhost:3000`

## 2. Access the Application

### Frontend (User Interface)
- **URL**: `http://localhost:3000/frontend`
- Browse and filter Linux distributions
- Uses interactive AJAX filters
- No authentication required

### Admin Panel
- **URL**: `http://localhost:3000/admin/login`
- Manage distros and their attributes
- Requires authentication

## 3. First-time Admin Setup

### Option A: Using cURL
```bash
# Register a new admin account
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "action": "register"
  }'
```

### Option B: Using the Login Form
1. Go to `http://localhost:3000/admin/login`
2. The first login attempt will register the account if it doesn't exist
3. Use any email and password

## 4. Navigate the Admin Dashboard

After logging in:

### Manage Distros Tab
- **View**: See all currently added distros
- **Add**: Click "Add Distro" button to add a new distribution
- **Delete**: Remove distros you no longer need

### Fill Distro Form
- **Name**: Distribution name (e.g., "Ubuntu", "Fedora")
- **Description**: Brief description of the distro
- **Website**: Official distro website URL
- **Image**: URL to distro logo/image

The distro will be assigned default attributes like:
- Ease of Use
- Desktop Environment
- Package Manager
- ISO Size
- Rolling Release status

## 5. View Your Changes

1. Go to `http://localhost:3000/frontend`
2. Your newly added distros will appear in the results
3. Use filters to find specific distros

## Available Sample Filters

### Ease of Use
- Beginner Friendly
- Intermediate
- Advanced

### Desktop Environment
- GNOME
- KDE Plasma
- XFCE
- LXDE
- i3
- Cinnamon
- Budgie

### Package Manager
- apt (Debian/Ubuntu)
- pacman (Arch)
- dnf (Fedora)
- zypper (openSUSE)
- xbps (Void)

### ISO Size
- Range: 500 MB - 5000 MB

### Rolling Release
- Yes/No filter

## Sample Data

The app comes pre-loaded with:
- **Ubuntu** - Beginner friendly
- **Fedora** - Intermediate
- **Arch Linux** - Advanced user-focused

## Customization

### Add More Filter Attributes

Edit `lib/db.ts` and modify the `initDb()` function to add more attributes:

```typescript
attributes = [
  {
    id: 'new-attribute',
    name: 'Display Name',
    type: 'select', // or multi-select, range, boolean, text
    options: ['Option 1', 'Option 2'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ...
];
```

### Modify Sample Distros

Edit the `distros` array in `lib/db.ts`:

```typescript
distros = [
  {
    id: 'my-distro',
    name: 'My Linux',
    description: 'Description here',
    website: 'https://example.com',
    image: '/path/to/image.png',
    attributes: {
      'ease-of-use': 'Beginner Friendly',
      'desktop-env': ['GNOME'],
      // ... other attributes
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ...
];
```

## Troubleshooting

### Port Already in Use
If port 3000 is busy, use:
```bash
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### JWT Secret Warning
In production, set the `JWT_SECRET` environment variable:
```bash
export JWT_SECRET="your-secret-key"
npm start
```

## API Testing

### Get All Distros
```bash
curl http://localhost:3000/api/distros
```

### Get All Filter Attributes
```bash
curl http://localhost:3000/api/distros/attributes
```

### Create a New Distro (Requires Auth)
```bash
curl -X POST http://localhost:3000/api/distros \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Linux Mint",
    "description": "Based on Ubuntu",
    "website": "https://linuxmint.com",
    "image": "/distros/mint.png",
    "attributes": {
      "ease-of-use": "Beginner Friendly",
      "desktop-env": ["Cinnamon"],
      "package-manager": "apt",
      "iso-size": 2000,
      "is-rolling": false
    }
  }'
```

## Next Steps

1. **Implement Real Database**: Replace in-memory store with PostgreSQL, MongoDB, etc.
2. **Add Validation**: Implement input validation for forms
3. **Setup Authentication**: Use proper bcrypt password hashing
4. **Deploy**: Deploy to Vercel, AWS, or other hosting
5. **Add More Features**: User accounts, favorites, recommendations

## Support

For more detailed information, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
