import dotenv from 'dotenv';
dotenv.config();

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
initMongoConnection();
setupServer();
console.log('MONGODB_USER:', process.env.MONGODB_USER);
