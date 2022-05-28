import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  completed: boolean;
};
export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from Orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error();
    }
  }
  /*
  async indexByUser(id: number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from Orders where user_id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error();
    }
  }
*/
  async show(id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from Orders where id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error();
    }
  }
  /*
  async showByUser(id: number, userID: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from Orders where id=$1 and user_id=$2';
      const result = await conn.query(sql, [id, userID]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error();
    }
  }
*/
  async create(o: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO Orders(user_id,completed) VALUES ($1,$2) returning *';

      const result = await conn.query(sql, [o.user_id, o.completed]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error();
    }
  }

  async addProduct(
    quantity: number,
    orderId: number,
    productId: number
  ): Promise<Order> {
    try {
      const orderSQL = 'SELECT * from orders where id=$1';

      const conn = await client.connect();

      const order = (await conn.query(orderSQL, [orderId])).rows[0];

      if (order.status) {
        throw new Error('Cannot add to a completed order');
      }

      const sql =
        'INSERT INTO order_product(order_id,product_id,quantity) VALUES ($1,$2,$3) returning *';

      const result = await conn.query(sql, [orderId, productId, quantity]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error();
    }
  }

  async getUserOrders(id: number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * from Orders where user_id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error();
    }
  }
}
