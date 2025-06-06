import { FastifyRequest, FastifyReply } from "fastify";
import { allocationSchema } from "../schemas/allocationSchema";
import { allocationService } from "../services/allocationService";
import { staticAssets } from "../data/staticAssets";
import { Allocation } from "../types";

export const allocationController = {
  allocate: async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = allocationSchema.safeParse(req.body);

    if (!parsed.success) return reply.status(400).send(parsed.error);

    const { clientId, assetId, quotas } = parsed.data;

    const assetExists = staticAssets.find((asset) => asset.id === assetId);
    if (!assetExists)
      return reply.status(400).send({ message: "Asset inválido" });

    const allocation = await allocationService.allocate(
      clientId,
      assetId,
      quotas
    );
    return reply.status(201).send(allocation);
  },

  list: async (_: FastifyRequest, reply: FastifyReply) => {
    const allocations = await allocationService.list();

    if (!allocations || allocations.length === 0) return [];

    // Enriquecer alocações com dados do asset
    const detailed = allocations.map((allocation: Allocation) => {
      const asset = staticAssets.find(
        (asset) => asset.id === allocation.assetId
      );
      return {
        allocation,
        asset: {
          ...asset,
        },
      };
    });

    return reply.send(detailed);
  },

  listByClient: async (
    req: FastifyRequest<{ Params: { clientId: string } }>,
    reply: FastifyReply
  ) => {
    const clientId = +req.params.clientId;
    const allocations = await allocationService.listByClient(clientId);

    if (!allocations || allocations.length === 0) return [];

    // Enriquecer alocações com dados do asset
    const detailed = allocations.map((allocation: Allocation) => {
      const asset = staticAssets.find(
        (asset) => asset.id === allocation.assetId
      );
      return {
        allocation,
        asset: {
          ...asset,
        },
      };
    });

    return reply.send(detailed);
  },

  delete: async (req: FastifyRequest<{ Params: { allocationId: string } }>) => {
    return allocationService.delete(+req.params.allocationId);
  },
};
