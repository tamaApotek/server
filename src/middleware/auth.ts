import { RequestHandler } from "express";
import admin from "firebase-admin";

const auth: RequestHandler = async (req, res, next) => {
  let token = req.headers.token as string;
  if (!token) {
    res.sendStatus(403);
    return;
  }
  if (token.match(/^bearer/i)) {
    token = token.slice("bearer ".length);
  }
  try {
    const decode = await admin.auth().verifyIdToken(token);
    res.locals.user = decode;
    next();
  } catch (err) {
    next(err);
  }
};

export default auth;
