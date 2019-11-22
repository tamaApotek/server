import { RequestHandler } from "express";

import { verifyToken } from "../helper/jwt";

const authMiddleware: RequestHandler = (req, res, next) => {
  let token = req.headers.token as string;
  if (!token) {
    res.sendStatus(403);
    return;
  }
  if (token.match(/^bearer/i)) {
    token = token.slice("bearer ".length);
  }
  try {
    const decode = verifyToken(token);
    res.locals.user = decode;
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
