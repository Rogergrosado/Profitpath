import redisClient from './config/redisClient.js'; // Adjusted path for your structure

(async () => {
    try {
        // Store a test value
        await redisClient.set('testKey', 'Hello from Redis!');

        // Retrieve the test value
        const value = await redisClient.get('testKey');

        console.log('✅ Redis Test Value:', value); // Expected output: "Hello from Redis!"

        // Close Redis connection after test
        await redisClient.quit();
        process.exit(0);
    } catch (error) {
        console.error('❌ Redis Test Failed:', error);
        process.exit(1);
    }
})();
