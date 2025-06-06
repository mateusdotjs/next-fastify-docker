import { FastifyInstance } from "fastify";
import { staticAssets } from "../data/staticAssets";

export async function assetRoutes(server: FastifyInstance) {
  server.get("/", async (_, reply) => {
    reply.send(staticAssets);
  });
}
