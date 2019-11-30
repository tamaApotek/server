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

import makeAuthRepository from "./auth/repository";
import makeUserUsecase from "./user/usecase";
import makeUserRouter from "./routes/user.routes";
import makeUserRepository from "./user/repository";
import makeDoctorRepository from "./doctor/repository";
import makeDoctorUsecase from "./doctor/usecase";
import makeDoctorRouter from "./routes/doctor.routes";
import makeEmailRepository from "./email/repository";
import setSendgrid from "./frameworks/email/sendgrid";
import initFirebase from "./frameworks/firebase/firebase";
import makeAuthUsecase from "./auth/usecase";

const main = async () => {
  const firebase = initFirebase();

  let mongoose: typeof import("mongoose");
  // Connect to database
  try {
    mongoose = await connectMongoDB();
  } catch (error) {
    console.error(error);
    throw error;
  }

  let sendGrid: typeof import("@sendgrid/mail");
  try {
    sendGrid = setSendgrid();
  } catch (error) {
    throw error;
  }

  // Repositories / entities
  const emailRepository = makeEmailRepository(sendGrid);

  const authRepository = await makeAuthRepository(firebase.auth());
  const userRepository = await makeUserRepository(mongoose);
  const doctorRepository = await makeDoctorRepository(mongoose);

  // Usecases / interactor
  const userUsecase = makeUserUsecase({
    authRepository,
    userRepository,
    doctorRepository
  });
  const doctorUsecase = makeDoctorUsecase({ doctorRepository });
  const authUsecase = makeAuthUsecase({ authRepository });

  // Routes handlers
  const userRouter = makeUserRouter({ userUsecase, authUsecase });
  const doctorRouter = makeDoctorRouter({ userUsecase, doctorUsecase });

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

  app.use(`/${baseURL}/users`, userRouter);
  app.use(`/${baseURL}/doctors`, doctorRouter);

  // Run server
  let server: http.Server | https.Server;
  try {
    if (process.env.NODE_ENV === "production") {
      const port = process.env.PORT;
      if (port === "443") {
        server = await createServerHTTPS(app);
      } else if (port === "80") {
        server = await createServerHTTP(app);
      } else {
        throw new Error("Invalid port");
      }
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
