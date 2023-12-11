import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

app.use(cors());
app.use(express.json());

//routes

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send(' course reviews server');
});
app.use(globalErrorHandler);
app.use(notFound);

export default app;
