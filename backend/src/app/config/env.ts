import dotenv from 'dotenv';

dotenv.config();

interface IEnvConfig {
    PORT: string
    DB_URL: string
    NODE_ENV: string
    CORS_ORIGIN: string
    JWT_SECRET: string
    JWT_EXPIRES_IN: string
    JWT_COOKIE_EXPIRES_IN: string
}

const loadVariables = (): IEnvConfig => {
    const requiredEnvVars: string[] = ['PORT', 'DB_URL', 'NODE_ENV', 'CORS_ORIGIN', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'JWT_COOKIE_EXPIRES_IN']

    requiredEnvVars.forEach(key => {
        if(!process.env[key]){
            throw new Error(`Missing required variable ${key}`);
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as string,
        CORS_ORIGIN: process.env.CORS_ORIGIN as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
        JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN as string
    }
}

export const envVars = loadVariables();
