//your tests

import supertest from 'supertest';
import app from '..';

const test = supertest(app);

describe('Testing Enviroment', () => {
  //Testing Root
  it('Test Root ', async () => {
    const res = await test.get('/');
    expect(res.text).toBe('Store app root route');
  });

  //Testing APIs
  it('Test Create User with empty body', async () => {
    const res = await test.post('/users');
    expect(res.status).toBe(400);
    expect(res.text).toBe('Bad Request');
  });

  it('Test Get Users Without Token', async () => {
    const res = await test.get('/users/:id');
    expect(res.status).toBe(401);
  });

  it('Test Get All Products ', async () => {
    const res = await test.get('/products');
    expect(res.status).toBe(200);
  });

  it('Test Get All Order Without Authentication ', async () => {
    const res = await test.get('/orders');
    expect(res.status).toBe(401);
  });

  it('Test Get Specific Order Without Authentication', async () => {
    const res = await test.get('/orders/:id');
    expect(res.status).toBe(401);
  });
});