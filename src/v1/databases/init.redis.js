const { createClient } = require('redis');
const client = createClient({url: process.env.REDIS_URL});

client.connect()

client.on('connect', () => {
    console.log('Redis client connected');
}) 
client.on('error', (error) => {
    console.log("error");
    console.error(error);
})

module.exports = client;
