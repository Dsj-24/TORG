import jwt from "jsonwebtoken";
import { config } from "../config";
import { NextFunction, Request, Response } from "express";
const SECRET = config.JWTS;
export const Auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["token"];
  const decoded = jwt.verify(token as string, SECRET); if (decoded) {     //@ts-ignore  
    req.id = decoded.id;
    next();
  }
  else { res.json({ message: "You are not logged in" }) }
}