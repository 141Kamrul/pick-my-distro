import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Distro operations
export async function getDistros() {
  return prisma.distro.findMany({
    include: {
      attributes: {
        include: {
          attribute: true,
        },
      },
    },
  });
}

export async function getDistroById(id: string) {
  return prisma.distro.findUnique({
    where: { id },
    include: {
      attributes: {
        include: {
          attribute: true,
        },
      },
    },
  });
}

export async function createDistro(data: {
  name: string;
  description?: string;
  image?: string;
  website?: string;
}) {
  return prisma.distro.create({
    data,
  });
}

export async function updateDistro(
  id: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
    website?: string;
  }
) {
  return prisma.distro.update({
    where: { id },
    data,
    include: {
      attributes: {
        include: {
          attribute: true,
        },
      },
    },
  });
}

export async function deleteDistro(id: string) {
  return prisma.distro.delete({
    where: { id },
  });
}

// Filter attributes operations
export async function getAttributes() {
  return prisma.filterAttribute.findMany();
}

export async function getAttributeById(id: string) {
  return prisma.filterAttribute.findUnique({
    where: { id },
  });
}

export async function createAttribute(data: {
  name: string;
  type: string;
  options?: string[];
  minValue?: number;
  maxValue?: number;
  description?: string;
}) {
  return prisma.filterAttribute.create({
    data,
  });
}

export async function updateAttribute(
  id: string,
  data: {
    name?: string;
    type?: string;
    options?: string[];
    minValue?: number;
    maxValue?: number;
    description?: string;
  }
) {
  return prisma.filterAttribute.update({
    where: { id },
    data,
  });
}

export async function deleteAttribute(id: string) {
  return prisma.filterAttribute.delete({
    where: { id },
  });
}

// Distro attribute operations
export async function setDistroAttribute(
  distroId: string,
  attributeId: string,
  value: string
) {
  return prisma.distroAttribute.upsert({
    where: {
      distroId_attributeId: {
        distroId,
        attributeId,
      },
    },
    update: { value },
    create: {
      distroId,
      attributeId,
      value,
    },
  });
}

export async function getDistroAttributes(distroId: string) {
  return prisma.distroAttribute.findMany({
    where: { distroId },
    include: {
      attribute: true,
    },
  });
}

export async function deleteDistroAttribute(distroId: string, attributeId: string) {
  return prisma.distroAttribute.delete({
    where: {
      distroId_attributeId: {
        distroId,
        attributeId,
      },
    },
  });
}

// Admin operations
export async function getAdminByUsername(username: string) {
  return prisma.admin.findUnique({
    where: { username },
  });
}

export async function createAdmin(username: string, password: string) {
  return prisma.admin.create({
    data: { username, password },
  });
}
