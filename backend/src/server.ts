import Fastify from "fastify";
import { clientRoutes } from "./routes/client";
import { allocationRoutes } from "./routes/allocation";
import { assetRoutes } from "./routes/asset";
import fastifyCors from "@fastify/cors";

const server = Fastify();
server.register(fastifyCors, {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE",
});

server.register(clientRoutes, { prefix: "/clients" });
server.register(allocationRoutes, { prefix: "/allocations" });
server.register(assetRoutes, { prefix: "/assets" });

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server rodando em ${address}`);
});
