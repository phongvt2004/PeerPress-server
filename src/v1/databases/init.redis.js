const { createClient } = require('redis');
const client = createClient({url: process.env.REDIS_URL});

try {
    await client.connect()
    console.log('Redis client connected');
} catch (err) {
    console.log("error");
    console.error(err);
}

module.exports = createClient