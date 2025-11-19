import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import { envVars } from './app/config/env';

const app = express();

app.use(express.json());
app.use(cookieParser()); // Parse cookies

// CORS configuration with credentials support
const allowedOrigins = [
    envVars.CORS_ORIGIN,
    'https://smart-task-manager-client-three.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Welcome to Smart Task Manager!'
    })
})

// API routes
app.use('/api/v1', router);

app.use(globalErrorHandler)

app.use(notFound)

export default app;