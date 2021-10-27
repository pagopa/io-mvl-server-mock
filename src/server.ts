import { IncomingMessage, Server, ServerResponse } from "http";
import { fastify, FastifyInstance } from "fastify";
import { getLegalMessageHandler } from "./handlers/message";
import { getConfigOrThrow } from "./utils/config";

// eslint-disable-next-line no-console
console.log("Setup fastify server");

const config = getConfigOrThrow();

// Create a http server. We pass the relevant typings for our http version used.
// By passing types we get correctly typed access to the underlying http objects in routes.
// If using http2 we'd pass <http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>
const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({});

server.get("/messages/:id", {}, getLegalMessageHandler());

server.listen(config.SERVER_PORT, "0.0.0.0", (err, address) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(`server listening on ${address}`);
});
