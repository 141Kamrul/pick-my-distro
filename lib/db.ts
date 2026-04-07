// Database connection and utilities
// Replace with your actual database connection (PostgreSQL, MongoDB, SQLite, etc.)

export interface Distro {
  id: string;
  name: string;
  description: string;
  image?: string;
  website?: string;
  attributes: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterAttribute {
  id: string;
  name: string;
  type: 'select' | 'multi-select' | 'range' | 'boolean' | 'text';
  options?: string[];
  min?: number;
  max?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock database store (replace with real database)
let distros: Distro[] = [];
let attributes: FilterAttribute[] = [];

// Initialize with sample data
export async function initDb() {
  if (distros.length === 0) {
    attributes = [
      {
        id: 'ease-of-use',
        name: 'Ease of Use',
        type: 'select',
        options: ['Beginner Friendly', 'Intermediate', 'Advanced'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'desktop-env',
        name: 'Desktop Environment',
        type: 'multi-select',
        options: ['GNOME', 'KDE Plasma', 'XFCE', 'LXDE', 'i3', 'Cinnamon', 'Budgie'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'package-manager',
        name: 'Package Manager',
        type: 'select',
        options: ['apt', 'pacman', 'dnf', 'zypper', 'xbps'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'iso-size',
        name: 'ISO Size (MB)',
        type: 'range',
        min: 500,
        max: 5000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'is-rolling',
        name: 'Rolling Release',
        type: 'boolean',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    distros = [
      {
        id: 'ubuntu',
        name: 'Ubuntu',
        description: 'The leading Linux distribution for cloud, enterprise, IoT and everything in between.',
        website: 'https://ubuntu.com',
        image: '/distros/ubuntu.png',
        attributes: {
          'ease-of-use': 'Beginner Friendly',
          'desktop-env': ['GNOME'],
          'package-manager': 'apt',
          'iso-size': 2500,
          'is-rolling': false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'fedora',
        name: 'Fedora',
        description: 'Always at the cutting edge of technology.',
        website: 'https://fedoraproject.org',
        image: '/distros/fedora.png',
        attributes: {
          'ease-of-use': 'Intermediate',
          'desktop-env': ['GNOME'],
          'package-manager': 'dnf',
          'iso-size': 1800,
          'is-rolling': false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'arch',
        name: 'Arch Linux',
        description: 'A simple, lightweight Linux distribution.',
        website: 'https://archlinux.org',
        image: '/distros/arch.png',
        attributes: {
          'ease-of-use': 'Advanced',
          'desktop-env': [],
          'package-manager': 'pacman',
          'iso-size': 800,
          'is-rolling': true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}

// Distro operations
export async function getDistros(): Promise<Distro[]> {
  await initDb();
  return distros;
}

export async function getDistroById(id: string): Promise<Distro | null> {
  await initDb();
  return distros.find(d => d.id === id) || null;
}

export async function createDistro(distro: Omit<Distro, 'id' | 'createdAt' | 'updatedAt'>): Promise<Distro> {
  await initDb();
  const newDistro: Distro = {
    ...distro,
    id: `distro-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  distros.push(newDistro);
  return newDistro;
}

export async function updateDistro(id: string, updates: Partial<Omit<Distro, 'id' | 'createdAt'>>): Promise<Distro | null> {
  await initDb();
  const index = distros.findIndex(d => d.id === id);
  if (index === -1) return null;

  distros[index] = {
    ...distros[index],
    ...updates,
    updatedAt: new Date(),
  };
  return distros[index];
}

export async function deleteDistro(id: string): Promise<boolean> {
  await initDb();
  const index = distros.findIndex(d => d.id === id);
  if (index === -1) return false;

  distros.splice(index, 1);
  return true;
}

// Filter attributes operations
export async function getAttributes(): Promise<FilterAttribute[]> {
  await initDb();
  return attributes;
}

export async function getAttribute(id: string): Promise<FilterAttribute | null> {
  await initDb();
  return attributes.find(a => a.id === id) || null;
}

export async function createAttribute(attribute: Omit<FilterAttribute, 'id' | 'createdAt' | 'updatedAt'>): Promise<FilterAttribute> {
  await initDb();
  const newAttribute: FilterAttribute = {
    ...attribute,
    id: `attr-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  attributes.push(newAttribute);
  return newAttribute;
}

export async function updateAttribute(id: string, updates: Partial<Omit<FilterAttribute, 'id' | 'createdAt'>>): Promise<FilterAttribute | null> {
  await initDb();
  const index = attributes.findIndex(a => a.id === id);
  if (index === -1) return null;

  attributes[index] = {
    ...attributes[index],
    ...updates,
    updatedAt: new Date(),
  };
  return attributes[index];
}

export async function deleteAttribute(id: string): Promise<boolean> {
  await initDb();
  const index = attributes.findIndex(a => a.id === id);
  if (index === -1) return false;

  attributes.splice(index, 1);
  return true;
}

// Admin operations
const admins = new Map<string, { email: string; password: string }>();

export async function initAdmin(email: string, password: string): Promise<void> {
  // In production, use proper password hashing
  admins.set(email, { email, password });
}

export async function getAdminByEmail(email: string): Promise<{ email: string } | null> {
  const admin = admins.get(email);
  return admin ? { email: admin.email } : null;
}

export async function verifyAdminPassword(email: string, password: string): Promise<boolean> {
  const admin = admins.get(email);
  if (!admin) return false;
  // In production, use bcrypt to compare hashed passwords
  return admin.password === password;
}
