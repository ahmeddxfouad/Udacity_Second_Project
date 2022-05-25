import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user';

dotenv.config();

const requiresAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authrizationHeader = req.headers.authorization as string;
    const token = authrizationHeader.split(' ')[1];

    const user: User | null = (jwt.decode(token) as JwtPayload).user as User;
    if (user.role == 'admin') {
      return next();
    }

    throw new Error();
  } catch (err) {
    res.sendStatus(401);
  }
};

export default requiresAdmin;
