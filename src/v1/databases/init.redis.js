const { createClient } = require('redis');
const client = createClient({url: process.env.REDIS_URL});

// client.config("SET","notify-keyspace-events", "KEA");
client.connect()

client.on('connect', () => {
    console.log('Redis client connected');
}) 
client.on('error', (error) => {
    console.log("error");
    console.error(error);
})

module.exports = client;
