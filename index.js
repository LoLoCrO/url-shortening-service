import express from 'express';
import pg from 'pg';
import { nanoid } from 'nanoid';

const app = express();
app.use(express.json());

const pool = new pg.Pool({
    user: 'url_shortener_user',
    host: 'localhost',
    database: 'url_shortener',
    password: 'password',
    port: 5432,
});

(async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        short_code TEXT UNIQUE NOT NULL,
        access_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
})();

app.post('/shorten', async (req, res) => {
    const { url } = req.body;
    const shortCode = nanoid(6);
    console.log(url, shortCode);
    
    try {
        const result = await pool.query(
            'INSERT INTO urls (url, short_code) VALUES ($1, $2) RETURNING *',
            [url, shortCode]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
