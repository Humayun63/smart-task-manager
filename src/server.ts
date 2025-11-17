import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';

let server: Server;

const PORT = envVars.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);

        server = app.listen(PORT, () => {
            console.info(`App is listening to port ${PORT}`);
        })
    } catch(error) {
        console.error(error);
    }
};

process.on('unhandledRejection', (error) => {
    console.info('Unhandled Rejection Detected!..Shuting down the server...');
    console.error(error);

    if(server){
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});


process.on('uncaughtException', (error) => {
    console.info('Uncaught Exception detected!... server is shutting down..');
    console.error(error);

    if(server){
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

process.on('SIGTERM', () => {
    console.info('Received SIGTERM!.. Shutting down...');

    if(server){
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
});

process.on('SIGINT', () => {
    console.info('Received SIGINT!.. Shutting down...');

    if(server){
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
})

startServer();