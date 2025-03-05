import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => (retries > 5 ? false : Math.min(retries * 100, 3000)),
  },
});

redisClient.on("error", (err) => console.error("❌ Redis Connection Error:", err));

(async () => {
  if (!redisClient.isOpen) { // ✅ Prevent duplicate connections
    try {
      await redisClient.connect();
      console.log("✅ Redis Connected Successfully!");
    } catch (error) {
      console.error("❌ Redis Connection Failed:", error);
    }
  }
})();

export default redisClient;
