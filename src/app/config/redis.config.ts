/* eslint-disable no-console */
import { createClient } from 'redis';
import { envVars } from './env.config';

export const redisClient = createClient({
    username: 'default',
    password: envVars.REDIS_OTP.REDIS_PASSWORD,
    socket: {
        host: envVars.REDIS_OTP.REDIS_HOST,
        port: Number(envVars.REDIS_OTP.REDIS_PORT)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)

export const redisConnected = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Redis connected successfully!');
    };
};