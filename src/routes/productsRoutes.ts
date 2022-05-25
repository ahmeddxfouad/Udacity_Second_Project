import { Product, ProductStore } from '../models/product';
import express, { Request, Response } from 'express';
import requiresAuthentication from '../middlewares/requiresAuthentication';

const productStore: ProductStore = new ProductStore();

const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await productStore.index();
    res.status(200).json(products);
  } catch (err) {
    res.sendStatus(500);
  }
};

/*
const getUserProducts = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = parseInt(req.params.userId)
        const products = await productStore.indexByUser(userId)
        res.status(200).json(products)
        
    }
    catch(err)
    {
        res.sendStatus(500)
        
    }

}
*/

const getProduct = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const product: Product | undefined = await productStore.show(id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  } else {
    res.status(400).send('Bad Request');
  }
};

const createProduct = async (req: Request, res: Response): Promise<void> => {
  const name: string | undefined = req.body.name;
  const price: number = parseInt(req.body.price as string);
  const category: string | undefined = req.body.category;

  if (
    name &&
    typeof name == 'string' &&
    price &&
    price > 0 &&
    category &&
    typeof category == 'string'
  ) {
    try {
      const newProduct: Product = await productStore.create({
        name,
        price,
        category
      });
      if (newProduct) {
        res.status(200).json(newProduct);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  }
};

export const productsHandlers = (app: express.Application): void => {
  app.get('/products', getAllProducts);
  app.get('/products/:id', getProduct);
  app.post('/products', requiresAuthentication, createProduct);
};
