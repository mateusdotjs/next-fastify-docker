import { FastifyRequest, FastifyReply } from "fastify";
import { clientSchema } from "../schemas/clientSchema";
import { clientService } from "../services/clientService";
import { Client } from "../types";

export const clientController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = clientSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error);
    const client = await clientService.createClient(parsed.data);
    return reply.status(201).send(client);
  },

  list: async (_: FastifyRequest, reply: FastifyReply) => {
    const clients = await clientService.listClients();
    return reply.send(clients);
  },

  listById: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const client = await clientService.listClientById(+request.params.id);
    return reply.send(client);
  },

  update: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const id = parseInt(request.params.id);
    const data = request.body as Partial<Client>;
    const client = await clientService.updateClient(id, data);
    return reply.send(client);
  },
};
