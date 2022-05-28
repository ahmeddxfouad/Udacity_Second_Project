//your tests
import supertest from 'supertest';
import app from '..';
import client from '../database';
import { User, UserStore } from '../models/user';
import bcrypt from 'bcrypt';
import { ProductStore } from '../models/product';
import { OrderStore } from '../models/order';
import dotenv from 'dotenv';

dotenv.config();

const pepper = process.env.BCRYPT_SECRET;
const rounds = process.env.SALT_SECRET;
const userStore : UserStore = new UserStore()
const productStore : ProductStore = new ProductStore()
const orderStore : OrderStore = new OrderStore()
let hashed: string

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
  //Order
  it('Test Insert Order ', async () => {
    const conn = await client.connect();

    const sql =
      'INSERT INTO Orders(user_id,completed) VALUES (1,false) returning *';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(1);
  });

  it('Test Select Orders ', async () => {
    const conn = await client.connect();

    const sql = 'SELECT * FROM Orders;';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(2);
  });

  it('Test Update Created Order ', async () => {
    const conn = await client.connect();

    const sql = 'UPDATE Orders SET completed=true WHERE id=1 returning *';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rows[0].completed).toBeTruthy();
  });

  it('Test Delete Order from DB ', async () => {
    const conn = await client.connect();

    const sql = 'DELETE FROM order_product WHERE id=2 returning *';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(0);
  });

  //Product
  it('Test Insert Product ', async () => {
    const conn = await client.connect();

    const sql =
      "INSERT INTO products(name,price,category) VALUES ('product2',50,'Food') returning *";

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(1);
  });

  it('Test Select Created Products ', async () => {
    const conn = await client.connect();

    const sql = 'SELECT * FROM products;';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(2);
  });

  it('Test Update Created Products from DB ', async () => {
    const conn = await client.connect();

    const sql = 'UPDATE products SET price=200 WHERE id=1 returning *';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rows[0].price).toEqual(200);
  });

  it('Test Delete Created Product from DB ', async () => {
    const conn = await client.connect();

    const sql = 'DELETE FROM products WHERE  id=2 returning *';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(1);
  });

  //Users
  it('Test Insert User ', async () => {
    const conn = await client.connect();

    const sql =
      "INSERT INTO users(username,fname,lname,password,role) VALUES ('Testt','Testt','Testt','Pass','user') returning *;";

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(1);
  });

  it('Test Update Created User ', async () => {
    const conn = await client.connect();

    const sql = "UPDATE users SET fname='UpdatedName' WHERE id=1 returning *";

    const result = await conn.query(sql);
    conn.release();

    expect(result.rows[0]).toBeTruthy();
    expect(result.rows[0].fname).toEqual('UpdatedName');
  });

  it('Test Select Users ', async () => {
    const conn = await client.connect();

    const sql = 'SELECT * FROM Users;';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(2);
  });

  it('Test Delete Created User from DB ', async () => {
    const conn = await client.connect();

    const sql = 'DELETE FROM Users WHERE id=2 returning *';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(1);
  });

  //OrderProduct
  it('Test Insert Order Product ', async () => {
    const conn = await client.connect();

    const sql =
      'INSERT INTO order_product(order_id,product_id,quantity) VALUES (2,1,6) returning *;';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(1);
  });

  it('Test Update Created Product in Order from DB ', async () => {
    const conn = await client.connect();

    const sql = 'UPDATE order_product SET quantity=100 WHERE id=1 returning *';

    const result = await conn.query(sql);
    conn.release();

    expect(result.rows[0].quantity).toEqual(100);
  });

  it('Test Select Order Products ', async () => {
    const conn = await client.connect();

    const sql = 'SELECT * FROM order_product;';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(2);
  });

  it('Test Delete Created Order Product from DB ', async () => {
    const conn = await client.connect();

    const sql = 'DELETE FROM order_product WHERE id=2 returning *';

    const result = await conn.query(sql);
    conn.release();
    expect(result.rowCount).toEqual(1);
  });
});


describe('Testing model Functions', () => {
  //Users
  it('fetch all users', async () => {
    
    const u: User = {
      username: "UserTest",
      fname: "fTest",
      lname: "lTest",
      password: "PassTest",
      role: "user"
  }

    const hash: string = bcrypt.hashSync(
      (u.password as string) + pepper,
      parseInt(rounds as string)
    );


    const result = await userStore.create({
      username: u.username,
      fname: u.fname,
      lname: u.lname,
      password: hash,
      role: "user"
    })

    
    const users = await userStore.index()
    
    expect(users.length).toBeGreaterThan(0);
    

  });

  it('Test show function', async () => {
    
    
    const result = await userStore.show(1)
    
    expect(result.id).toEqual(1);

  });

 

//products
it('fetch all products', async () => {
    
  await productStore.create({
    name: "Product2",
    price: 300,
    category: "Food",
  })

  const products = await productStore.index()
  
  expect(products.length).toBeGreaterThan(0);

});
it('fetch specific product', async () => {
  
  
  const result = await productStore.show(1)
  
  expect(result.id).toEqual(1);

});



//Order
it('fetch all orders', async () => {
    
  const result = await orderStore.create({
    user_id: 1,
    completed: false,
   
  })

  const orders = await orderStore.index()
  
  expect(orders.length).toBeGreaterThan(0);

});

it('fetch specific order', async () => {
  
  
  const result = await orderStore.show(1)
  
  expect(result.id).toEqual(1);

});

it('Test getUserOrders function', async () => {
  
  
  const result = await orderStore.getUserOrders(1)
  
  expect(result.length).toBeGreaterThan(0);

});
  
it('Test Add Product function', async () => {
  
  
  const result = await orderStore.addProduct(2,2,1)
  
  expect(result).toBeTruthy();

});



});