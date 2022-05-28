import client from '../database';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const pepper = process.env.BCRYPT_SECRET;
const rounds = process.env.SALT_SECRET;

export type User = {
  id?: number;
  username: string;
  fname: string;
  lname: string;
  password: string;
  role: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT id, fname, lname, role from users;';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error();
    }
  }

  async show(id: number): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT id, fname, lname, role from users where id=$1 ';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error();
    }
  }

  async create(u: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO users(username,fname,lname,password,role) VALUES ($1,$2,$3,$4,$5) returning *;';
      const hash: string = bcrypt.hashSync(
        (u.password as string) + pepper,
        parseInt(rounds as string)
      );

      const result = await conn.query(sql, [
        u.username,
        u.fname,
        u.lname,
        hash,
        u.role
      ]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
  /*
  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from users where username=$1';
      const result = await conn.query(sql, [username]);
      conn.release();

      if (result.rowCount) {
        const user = result.rows[0] as User;
        if (bcrypt.compareSync(password + pepper, user.password as string)) {
          return user;
        }
      }

      return null;
    } catch (err) {
      throw new Error();
    }
  }
  */
}
