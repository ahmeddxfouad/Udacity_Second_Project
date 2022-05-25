import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error();
    }
  }

  async indexByUser(id: number): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from products where user_id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error();
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from products where id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error();
    }
  }

  async showByUser(id: number, userID: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from products where id=$1 and user_id=$2';
      const result = await conn.query(sql, [id, userID]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error();
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO products(name,price,category) VALUES ($1,$2,$3) returning *';

      const result = await conn.query(sql, [p.name, p.price, p.category]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error();
    }
  }
}
