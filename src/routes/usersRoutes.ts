import { User, UserStore } from '../models/user';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import requiresAuthentication from '../middlewares/requiresAuthentication';
//import requiresAdmin from "../middlewares/requiresAdmin";

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;

const userStore: UserStore = new UserStore();

const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('(1)');
    const Users = await userStore.index();
    res.status(200).json(Users);
  } catch (err) {
    res.sendStatus(500);
  }
};

const getuser = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const user: User | undefined = await userStore.show(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  }
};

const createuser = async (req: Request, res: Response): Promise<void> => {
  const fname: string | undefined = req.body.fname;
  const lname: string | undefined = req.body.lname;
  const username: string | undefined = req.body.username;
  const password: string = req.body.password;
  //const role: string | undefined = req.body.role

  if (
    fname &&
    typeof fname == 'string' &&
    lname &&
    typeof lname == 'string' &&
    username &&
    typeof username == 'string' &&
    password
  ) {
    try {
      const user: User = {
        username,
        fname,
        lname,
        password,
        role: 'user'
      };

      const newUser = await userStore.create(user);

      const token = jwt.sign(
        {
          user: {
            id: newUser.id,
            fname: newUser.fname,
            lname: newUser.lname,
            role: newUser.role
          }
        },
        tokenSecret as string
      );

      res.status(200).json(token);
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.status(400).send('Bad Request');
  }
};
/*
const authentication = async (req: Request, res: Response): Promise<void> => {

    const username = req.body.name
    const password = req.body.password

    if(username && typeof username == 'string' && password && typeof password == 'string')
    {
        try{
            const user = await userStore.authenticate(username, password)
            if(user)
            {
                const token = jwt.sign({
                    user:{
                        id: user.id,
                        fname: user.fname,
                        lname: user.lname,
                        role: user.role,
                    }
                 },tokenSecret as string)
                 res.status(200).json(token)
            }
            else {
                res.sendStatus(401)
            }

        }
        catch(err){
            res.sendStatus(500)
        }
    }
    else{
        res.status(400).send("Bad Request")
    }


}
*/
export const usersHandlers = (app: express.Application): void => {
  /*app.get('/Users',requiresAuthentication,requiresAdmin, getAllUsers)*/
  app.get('/Users', requiresAuthentication, getAllUsers);

  app.get('/Users/:id', requiresAuthentication, getuser);

  app.post('/Users', createuser);
};
