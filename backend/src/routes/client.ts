import { FastifyInstance } from "fastify";
import { clientController } from "../controllers/clientController";

export async function clientRoutes(server: FastifyInstance) {
  server.post("/", clientController.create);
  server.get("/", clientController.list);
  server.get("/:id", clientController.listById);
  server.put("/:id", clientController.update);
}
