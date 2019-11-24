import { RequestHandler } from "express";
import { auth } from "firebase-admin";

const authMiddleware: RequestHandler = async (req, res, next) => {
  let token = req.headers.token as string;
  if (!token) {
    res.sendStatus(403);
    return;
  }
  if (token.match(/^bearer/i)) {
    token = token.slice("bearer ".length);
  }
  try {
    const decode = await auth().verifyIdToken(token);
    res.locals.user = decode;
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
