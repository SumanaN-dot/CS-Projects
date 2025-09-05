const express = require('express');
const router = express.Router();
const pool = require('../../db.js');

router.get('/', async (req, res) => {
    const { query } = req.query; // Get the search query from the request

    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // Use ILIKE for case-insensitive search in title and author
        const result = await pool.query(
            `SELECT * FROM books 
             WHERE title ILIKE $1 OR author ILIKE $1 or genre ILIKE $1 
             ORDER BY id ASC`,
            [`%${query}%`] // Use wildcards for partial matches
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No books found matching your search criteria.' });
        }

        res.json(result.rows);
    } catch (err) {
        console.error('Error during search:', err.stack);
        res.status(500).json({ error: 'Server error during search' });
    }
});

module.exports = router;
