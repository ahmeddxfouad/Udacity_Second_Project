import morgan from 'morgan';
import { productsHandlers } from './routes/productsRoutes';
import { ordersHandlers } from './routes/ordersRoutes';
import { usersHandlers } from './routes/usersRoutes';
import express, { Request, Response } from 'express';

const app: express.Application = express();
const port = 3000;
/*const address: string = "0.0.0.0:"+(port.toString)
 */

app.use(morgan('tiny'));
app.use(express.json());

productsHandlers(app);
usersHandlers(app);
ordersHandlers(app);

/*app.use(bodyParser.json()) */

app.get('/', async (_req: Request, res: Response): Promise<void> => {
  res.send('Store app root route');
});

app.listen(port, () => {
  console.log(`starting app on port:` + port);
});

export default app;
