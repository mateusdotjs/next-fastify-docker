import { prisma } from "../lib/prismaClient";

type ClientInput = {
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
};

export const clientService = {
  createClient: async (data: ClientInput) => {
    try {
      const result = await prisma.client.create({ data });
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  listClients: async () => {
    try {
      const result = await prisma.client.findMany();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  listClientById: async (id: number) => {
    try {
      const result = await prisma.client.findUnique({ where: { id } });
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updateClient: async (id: number, data: Partial<ClientInput>) => {
    try {
      const result = await prisma.client.update({
        where: { id },
        data,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
