import * as dotenv from "dotenv";
import * as http from "http";
import * as https from "https";

import express from "express";
import cors from "cors";

dotenv.config();

import createServerHTTPS from "./frameworks/web-server/https";
import createServerHTTP from "./frameworks/web-server/http";
import connectMongoDB from "./frameworks/database/mongodb";
import createSocket from "./frameworks/socket/socket-io";

import makeUserCredentialRepository from "./userCredential/repository";
import makeUserUsecase from "./user/usecase";
import { comparePassword, hashPassword } from "./helper/bcrypt";
import { generateJWTToken } from "./helper/jwt";
import makeUserRouter from "./routes/user.routes";
import makeUserProfileRepository from "./userProfile/repository";

const main = async () => {
  let mongoose: typeof import("mongoose");
  // Connect to database
  try {
    mongoose = await connectMongoDB();
  } catch (error) {
    console.error(error);
    throw error;
  }

  // Repositories / entities
  const userCredRepository = await makeUserCredentialRepository(mongoose);
  const userProfileRepository = await makeUserProfileRepository(mongoose);

  // Usecases / interactor
  const userUsecase = makeUserUsecase({
    passwordValidator: comparePassword,
    passwordEncriptor: hashPassword,

    tokenGenerator: generateJWTToken,

    userCredRepository,
    userProfileRepository
  });

  // Routes handlers
  const userRouter = makeUserRouter({ userUsecase });

  // Build app
  const app = express();

  // CORS handler
  const corsHandler = cors({ origin: true });
  app.use(corsHandler);

  // EXPRESS parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // SET Routes
  const baseURL = process.env.BASE_URL || "api";

  app.get(`/${baseURL}`, (req, res) => {
    res.sendStatus(200);
  });

  app.use(`/${baseURL}/user`, userRouter);

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
