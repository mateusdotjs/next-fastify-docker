import { prisma } from "../lib/prismaClient";

export const allocationService = {
  allocate: async (clientId: number, assetId: number, quotas: number) => {
    try {
      const result = prisma.allocation.upsert({
        where: {
          clientId_assetId: { clientId, assetId },
        },
        update: { quotas },
        create: { clientId, assetId, quotas },
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  list: async () => {
    try {
      const result = await prisma.allocation.findMany();
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  listByClient: async (clientId: number) => {
    try {
      const result = await prisma.allocation.findMany({
        where: { clientId },
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  delete: async (allocationId: number) => {
    try {
      await prisma.allocation.delete({
        where: { id: allocationId },
      });

      return true;
    } catch (error) {
      console.log(error);
    }
  },
};
