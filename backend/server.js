#!/usr/bin/env node
"use strict";

const fastify = require("fastify")({ logger: false });
const cors = require("@fastify/cors");
const routes = require("./routes");

const PORT = parseInt(process.env.PORT, 10) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

fastify.register(routes);

fastify.get("/", async () => ({ status: "ok", server: "CheckDin Backend", version: "1.0" }));

fastify.setNotFoundHandler(async (request, reply) => reply.code(404).send({ error: "Not found" }));
fastify.setErrorHandler(async (error, request, reply) => { console.error(error); return reply.code(500).send({ error: error.message }); });

fastify.listen({ port: PORT, host: HOST }, (err) => {
  if (err) { console.error(err); process.exit(1); }
  console.log(`CheckDin Backend running on http://${HOST}:${PORT}`);
});
