import * as dotenv from "dotenv";

import express from "express";
import * as http from "http";
import * as https from "https";
import cors from "cors";

import createServerHTTPS from "./frameworks/web-server/https";
import createServerHTTP from "./frameworks/web-server/http";
import connectMongoDB from "./frameworks/database/mongodb";
import createSocket from "./frameworks/socket/socket-io";

import errorHandler from "./middleware/errorHandler";

import router from "./routes";

dotenv.config();

const corsHandler = cors({ origin: true });

const app = express();

// SET CORS
app.use(corsHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// io.on('connection', socketio);

app.use("/", router);
app.use(errorHandler);

const main = async () => {
  // Connect to database
  try {
    await connectMongoDB();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  // Run server
  let server: http.Server | https.Server;
  try {
    if (process.env.NODE_ENV === "production") {
      server = await createServerHTTPS(app);
    } else {
      server = await createServerHTTP(app);
    }

    console.log("Server running at:", server.address());
  } catch (error) {
    throw error;
  }

  const io = createSocket(server);
};

main();
