//your tests
import supertest from 'supertest';
import app from '..';
import client from '../database';

const test = supertest(app);
let token: string;
describe('Testing Enviroment', () => {
  //Testing Root
  it('Test Root ', async () => {
    const res = await test.get('/');
    expect(res.text).toBe('Store app root route');
  });

  //Testing APIs
  //Users
  it('Test Create User with empty body', async () => {
    const res = await test.post('/users');
    expect(res.status).toBe(400);
    expect(res.text).toBe('Bad Request');
  });

  it('Test Create User with correct body', async () => {
    const res = await test
      .post('/users')
      .send({
        fname: 'First',
        lname: 'Last',
        username: 'User',
        password: 'Pass',
        role: 'user'
      })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    token = res.body;
  });

  it('Test Get Specific User Without Authentication Token', async () => {
    const res = await test.get('/users/:id');
    expect(res.status).toBe(401);
  });

  it('Test Get Specific User With Authentication Token', async () => {
    const res = await test
      .get('/users/1')
      .set('Authorization', 'bearer ' + token);
    expect(res.status).toEqual(200);
  });

  it('Test Get All Users With Authentication Token', async () => {
    const res = await test
      .get('/users')
      .set('Authorization', 'bearer ' + token);
    expect(res.status).toEqual(200);
  });

  it('Create User With a Missing Field/s', async () => {
    const res = await test.post('/users');
    expect(res.status).toBe(400);
  });

  //Products
  it('Test Create Product Without Authentication Token', async () => {
    const res = await test.post('/products');
    expect(res.status).toBe(401);
  });

  it('Test Create Product With Authentication Token', async () => {
    const res = await test
      .post('/products')
      .send({
        name: 'Product1',
        price: 10,
        category: 'Food'
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });

  it('Test Get All Products', async () => {
    const res = await test.get('/products');
    expect(res.status).toBe(200);
  });

  it('Test Get Specific Product With invalid parameter', async () => {
    const res = await test.get('/products/a');
    expect(res.status).toBe(400);
  });

  it('Test Get Specific Product With valid parameter', async () => {
    /*const productStore: ProductStore = new ProductStore()
    const name: string | undefined = "Product1";
    const price: number = 20;
    const category: string | undefined = "Food";

    const newProduct: Product = await productStore.create({
      name,
      price,
      category
    });*/

    const res = await test.get('/products/1');
    expect(res.status).toBe(200);
    expect(res.type).toContain('json');
  });

  //Orders
  it('Test Create Order Without Authentication', async () => {
    const res = await test.post('/orders');
    expect(res.status).toBe(401);
  });

  it('Test Create Order With Authentication', async () => {
    const res = await test
      .post('/orders')
      .send({
        completed: false,
        user_id: 1
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });

  it('Test Get All Order Without Authentication Token', async () => {
    const res = await test.get('/orders');
    expect(res.status).toBe(401);
  });

  it('Test Get All Order With Authentication Token', async () => {
    const res = await test
      .get('/orders')
      .set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });

  it('Test Get Specific Order Without Authentication', async () => {
    const res = await test.get('/orders/:id');
    expect(res.status).toBe(401);
  });

  it('Test Get Specific Order With Authentication', async () => {
    const res = await test
      .get('/orders/1')
      .set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
    expect(res.type).toContain('json');
  });

  it('Test Get Orders for specific User Without Authentication', async () => {
    const res = await test.get('/users/1/orders');
    expect(res.status).toBe(401);
  });

  it('Test Get Orders for specific User With Authentication', async () => {
    const res = await test
      .get('/users/1/orders')
      .set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });

  it('Test Add Product to Specific Order Without Authentication', async () => {
    const res = await test.post('/orders/1');
    expect(res.status).toBe(401);
  });

  it('Test Add Product to Specific Order With Authentication', async () => {
    const res = await test
      .post('/orders/1')
      .send({
        product_id: 1,
        quantity: 2
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
  });
});

describe('Testing CRUD Operations', () => {
  it('Test Delete Created Order from DB ', async () => {
    const conn = await client.connect();

    const sql = 'DELETE FROM order_product WHERE id=1 returning *';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rows[0]).toBeNull;
  });

  it('Test Delete Created Product from DB ', async () => {
    const conn = await client.connect();

    const sql = 'DELETE FROM products WHERE id=1 returning *';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rows[0]).toBeNull;
  });

  it('Test Update Created User from DB ', async () => {
    const conn = await client.connect();

    const sql = "UPDATE users SET fname='UpdatedName' WHERE id=1 returning *";

    const result = await conn.query(sql);
    conn.release();

    expect(result.rows[0]).toBeTruthy();
    expect(result.rows[0].fname).toEqual('UpdatedName');
  });
});
