import express, { Request, Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Welcome to Smart Task Manager!'
    })
})

// API routes
app.use('/api', router);

app.use(globalErrorHandler)

app.use(notFound)

export default app;