import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL, // Load from .env
  socket: {
    reconnectStrategy: (retries) => (retries > 5 ? false : Math.min(retries * 100, 3000)),
  },
});

redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

redisClient.connect()
  .then(() => console.log('✅ Redis Connected Successfully!'))
  .catch((err) => console.error('❌ Redis Connection Failed:', err));

export default redisClient;
