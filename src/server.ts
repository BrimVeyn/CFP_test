import Fastify from "fastify";
import routes from "./routes/tasks.routes"

const fastify = Fastify({
  logger: true,
});


fastify.register(routes)

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("🚀 Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

