import * as https from "https";
import * as fs from "fs";
import * as path from "path";

import { Express } from "express";

const createServerHTTPS = (app: Express) => {
  /**
   * Create HTTPS server.
   */
  const cert = process.env.CERT as string;
  const privkey = process.env.PRIVKEY as string;

  const option = {
    cert: fs.readFileSync(path.join(__dirname, cert)),
    key: fs.readFileSync(path.join(__dirname, privkey))
  };

  const server = https.createServer(option, app);
  const port = process.env.PORT || 8080;

  return new Promise<https.Server>((resolve, reject) => {
    server.listen(port, () => {
      console.log(`listening on port ${port}`);
      resolve(server);
    });

    server.on("error", error => {
      reject(error);
    });
  });
};

export default createServerHTTPS;
