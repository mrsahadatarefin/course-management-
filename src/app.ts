import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

//routes

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send(' course reviews server');
});

export default app;
