import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";

async function routes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.get("/tasks", (req: FastifyRequest, rep: FastifyReply) => {
    rep.send({ message: "hello world" });
  });
}

export default routes;
