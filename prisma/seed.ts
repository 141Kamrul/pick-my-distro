import { prisma } from '../lib/db';

async function main() {
  console.log('Seeding database...');

  // Create filter attributes
  const attributes = await prisma.filterAttribute.createMany({
    data: [
      {
        name: 'Ease of Use',
        type: 'select',
        options: ['Beginner Friendly', 'Intermediate', 'Advanced'],
        description: 'How beginner-friendly is this distro?',
      },
      {
        name: 'Desktop Environment',
        type: 'multi-select',
        options: ['GNOME', 'KDE Plasma', 'XFCE', 'LXDE', 'i3', 'Cinnamon', 'Budgie', 'MATE'],
        description: 'Available desktop environments',
      },
      {
        name: 'Package Manager',
        type: 'select',
        options: ['apt', 'pacman', 'dnf', 'zypper', 'xbps', 'apk'],
        description: 'Primary package manager',
      },
      {
        name: 'ISO Size (MB)',
        type: 'range',
        minValue: 500,
        maxValue: 5000,
        description: 'Download size in megabytes',
      },
      {
        name: 'Rolling Release',
        type: 'boolean',
        description: 'Is this a rolling release?',
      },
      {
        name: 'Free Software',
        type: 'boolean',
        description: 'Uses only free/open-source software',
      },
    ],
  });

  console.log(`Created ${attributes.count} attributes`);

  // Create sample distros
  const ubuntu = await prisma.distro.create({
    data: {
      name: 'Ubuntu',
      description: 'The leading Linux distribution for cloud, enterprise, IoT and everything in between.',
      website: 'https://ubuntu.com',
      image: '/distros/ubuntu.png',
    },
  });

  const fedora = await prisma.distro.create({
    data: {
      name: 'Fedora',
      description: 'Always at the cutting edge of technology.',
      website: 'https://fedoraproject.org',
      image: '/distros/fedora.png',
    },
  });

  const arch = await prisma.distro.create({
    data: {
      name: 'Arch Linux',
      description: 'A simple, lightweight Linux distribution.',
      website: 'https://archlinux.org',
      image: '/distros/arch.png',
    },
  });

  const debian = await prisma.distro.create({
    data: {
      name: 'Debian',
      description: 'The universal operating system.',
      website: 'https://www.debian.org',
      image: '/distros/debian.png',
    },
  });

  console.log('Created 4 distros');

  // Set attributes for Ubuntu
  const attrs = await prisma.filterAttribute.findMany();
  const attrMap = new Map(attrs.map(a => [a.name, a.id]));

  await prisma.distroAttribute.createMany({
    data: [
      {
        distroId: ubuntu.id,
        attributeId: attrMap.get('Ease of Use')!,
        value: 'Beginner Friendly',
      },
      {
        distroId: ubuntu.id,
        attributeId: attrMap.get('Desktop Environment')!,
        value: JSON.stringify(['GNOME']),
      },
      {
        distroId: ubuntu.id,
        attributeId: attrMap.get('Package Manager')!,
        value: 'apt',
      },
      {
        distroId: ubuntu.id,
        attributeId: attrMap.get('ISO Size (MB)')!,
        value: '2500',
      },
      {
        distroId: ubuntu.id,
        attributeId: attrMap.get('Rolling Release')!,
        value: 'false',
      },
      {
        distroId: fedora.id,
        attributeId: attrMap.get('Ease of Use')!,
        value: 'Intermediate',
      },
      {
        distroId: fedora.id,
        attributeId: attrMap.get('Desktop Environment')!,
        value: JSON.stringify(['GNOME']),
      },
      {
        distroId: fedora.id,
        attributeId: attrMap.get('Package Manager')!,
        value: 'dnf',
      },
      {
        distroId: fedora.id,
        attributeId: attrMap.get('ISO Size (MB)')!,
        value: '1800',
      },
      {
        distroId: fedora.id,
        attributeId: attrMap.get('Rolling Release')!,
        value: 'false',
      },
      {
        distroId: arch.id,
        attributeId: attrMap.get('Ease of Use')!,
        value: 'Advanced',
      },
      {
        distroId: arch.id,
        attributeId: attrMap.get('Desktop Environment')!,
        value: JSON.stringify([]),
      },
      {
        distroId: arch.id,
        attributeId: attrMap.get('Package Manager')!,
        value: 'pacman',
      },
      {
        distroId: arch.id,
        attributeId: attrMap.get('ISO Size (MB)')!,
        value: '800',
      },
      {
        distroId: arch.id,
        attributeId: attrMap.get('Rolling Release')!,
        value: 'true',
      },
      {
        distroId: debian.id,
        attributeId: attrMap.get('Ease of Use')!,
        value: 'Intermediate',
      },
      {
        distroId: debian.id,
        attributeId: attrMap.get('Desktop Environment')!,
        value: JSON.stringify(['GNOME', 'XFCE', 'KDE Plasma']),
      },
      {
        distroId: debian.id,
        attributeId: attrMap.get('Package Manager')!,
        value: 'apt',
      },
      {
        distroId: debian.id,
        attributeId: attrMap.get('ISO Size (MB)')!,
        value: '3500',
      },
      {
        distroId: debian.id,
        attributeId: attrMap.get('Rolling Release')!,
        value: 'false',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
