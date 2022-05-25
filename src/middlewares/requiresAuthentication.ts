import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET as Secret;

const requiresAuthetincation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authrizationHeader = req.headers.authorization as string;
    const token = authrizationHeader.split(' ')[1];
    jwt.verify(token, tokenSecret);
    return next();
  } catch (err) {
    res.sendStatus(401);
  }
};

export default requiresAuthetincation;
