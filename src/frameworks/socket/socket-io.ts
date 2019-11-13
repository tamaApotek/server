import * as http from "http";
import * as https from "https";

import socketIO from "socket.io";
import redis from "socket.io-redis";

const createSocket = (server: http.Server | https.Server) => {
  const io = socketIO(server);
  io.adapter(redis({ host: "localhost", port: 6379 }));
  return io;
};

export default createSocket;
