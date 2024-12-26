import express from 'express';
import pg from 'pg';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.APP_PORT;
const app = express();
app.use(express.json());

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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

app.get('/shorten/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM urls WHERE short_code = $1',
            [shortCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        await pool.query(
            'UPDATE urls SET access_count = access_count + 1, updated_at = CURRENT_TIMESTAMP WHERE short_code = $1 RETURNING *',
            [shortCode]
        );

        res.json({ url: result.rows[0].url });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.put('/shorten/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    const { url } = req.body;

    try {
        const result = await pool.query(
            'UPDATE urls SET url = $1, updated_at = CURRENT_TIMESTAMP WHERE short_code = $2 RETURNING *',
            [url, shortCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.delete('/shorten/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM urls WHERE short_code = $1 RETURNING *',
            [shortCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.get('/shorten/:shortCode/stat', async (req, res) => {
    const { shortCode } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM urls WHERE short_code = $1',
            [shortCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.json({ access_count: result.rows[0].access_count });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
