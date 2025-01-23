// @ts-nocheck

import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv();

const connectionString = process.env.MONGODB_CONNECTION_STRING.replace(
    '<db_password>',
    process.env.MONGODB_PASSWORD
);

export const connectDB = async () => {
    const conn = await mongoose.connect(connectionString);
    console.log(`Mongodb Connected: ${conn.connection.host}`);
};
