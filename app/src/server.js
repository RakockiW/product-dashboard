const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;
const INSTANCE_ID = process.env.INSTANCE_ID;

app.use(express.json());

const pool = new Pool({
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'cache',
        port: parseInt(process.env.REDIS_PORT) || 6379,
    },
});

redisClient.on('error', (err) => console.error('Redis error:', err));

const ITEMS_KEY = 'items';
const HITS_KEY  = 'cache_hits';

async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
            id       SERIAL PRIMARY KEY,
            name     TEXT          NOT NULL,
            quantity INTEGER       NOT NULL DEFAULT 0,
            price    NUMERIC(10,2) NOT NULL DEFAULT 0
        );
    `);
    console.log('DB schema ready');
}


app.get('/', (req, res) => {
    res.json({
        message: 'Response from Node.js backend',
        receivedHeaders: {
            host:            req.headers['host'],
            xRealIp:         req.headers['x-real-ip'],
            xForwardedFor:   req.headers['x-forwarded-for'],
            xForwardedProto: req.headers['x-forwarded-proto'],
        },
        timestamp: new Date().toISOString(),
    });
});

app.get('/items', async (req, res) => {
    try {
        const cached = await redisClient.get(ITEMS_KEY);
        if (cached) {
            await redisClient.incr(HITS_KEY);          
            return res.json({ products: JSON.parse(cached) });
        }

        const { rows } = await pool.query('SELECT * FROM products ORDER BY id');
        await redisClient.setEx(ITEMS_KEY, 30, JSON.stringify(rows)); 

        res.json({ products: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/items', async (req, res) => {
    const { name, quantity, price } = req.body;

    if (!name || price == null) {
        return res.status(400).json({ error: 'name and price are required' });
    }

    try {
        const { rows } = await pool.query(
            'INSERT INTO products (name, quantity, price) VALUES ($1, $2, $3) RETURNING *',
            [name, parseInt(quantity) || 0, parseFloat(price)]
        );
        await redisClient.del(ITEMS_KEY);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/stats', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT COUNT(*) AS products_count, COALESCE(AVG(price), 0) AS avg_price FROM products'
        );
        const { products_count, avg_price } = rows[0];
        const cacheHits = await redisClient.get(HITS_KEY);

        res.json({
            instance: INSTANCE_ID,
            stats: {
                products_count: parseInt(products_count),
                avg_price:      parseFloat(avg_price),
                cache_hits:     parseInt(cacheHits) || 0,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok' });
    } catch {
        res.status(500).json({ status: 'error' });
    }
});

app.get('/hello', (_req, res) => res.json({ message: 'hello' }));

(async () => {
    await redisClient.connect();
    await initDB();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})().catch((err) => {
    console.error('Startup failed:', err);
    process.exit(1);
});