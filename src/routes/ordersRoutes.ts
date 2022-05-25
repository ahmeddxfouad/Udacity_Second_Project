import { Order, OrderStore } from '../models/order';
import express, { Request, Response } from 'express';
import requiresAuthentication from '../middlewares/requiresAuthentication';

const orderStore: OrderStore = new OrderStore();

const getAllorders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderStore.index();
    res.status(200).json(orders);
  } catch (err) {
    res.sendStatus(500);
  }
};

const getUserorders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const orders = await orderStore.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (err) {
    res.sendStatus(500);
  }
};

const getorder = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const order: Order | undefined = await orderStore.show(id);
      if (order) {
        res.status(200).json(order);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  }
};

const createorder = async (req: Request, res: Response): Promise<void> => {
  const completed: boolean | undefined = req.body.completed;
  const user_id: number = parseInt(req.body.user_id as string);

  if (typeof completed == 'boolean' && user_id && user_id > 0) {
    try {
      const neworder: Order = await orderStore.create({ completed, user_id });
      if (neworder) {
        res.status(200).json(neworder);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
  const quantity: number = parseInt(req.body.quantity as string);
  const order_id: number = parseInt(req.params.id as string);
  const product_id: number = parseInt(req.body.product_id as string);

  if (
    quantity &&
    quantity > 0 &&
    order_id &&
    order_id > 0 &&
    product_id &&
    product_id > 0
  ) {
    try {
      const neworder: Order = await orderStore.addProduct(
        quantity,
        order_id,
        product_id
      );
      if (neworder) {
        res.status(200).json(neworder);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  }
};

export const ordersHandlers = (app: express.Application): void => {
  app.get('/orders', requiresAuthentication, getAllorders);
  app.get('/orders/:id', requiresAuthentication, getorder);

  app.get('/users/:userId/orders', requiresAuthentication, getUserorders);

  app.post('/orders/:id', requiresAuthentication, addProduct);
  app.post('/orders', requiresAuthentication, createorder);
};
