import { FastifyInstance } from "fastify";
import { allocationController } from "../controllers/allocationController";

export async function allocationRoutes(server: FastifyInstance) {
  server.post("/", allocationController.allocate);
  server.post("/:clientId", allocationController.allocate);
  server.get("/", allocationController.list);
  server.get("/:clientId", allocationController.listByClient);
  server.delete("/:allocationId", allocationController.delete);
}
