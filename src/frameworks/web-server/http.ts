import * as http from "http";
import { Express } from "express";

const createServerHTTP = (app: Express) => {
  const server = http.createServer(app);
  const port = process.env.PORT || 8080;

  return new Promise<http.Server>((resolve, reject) => {
    server.listen(port, () => {
      console.log(`listening on port ${port}`);
      resolve(server);
    });

    server.on("error", error => {
      reject(error);
    });
  });
};

export default createServerHTTP;
