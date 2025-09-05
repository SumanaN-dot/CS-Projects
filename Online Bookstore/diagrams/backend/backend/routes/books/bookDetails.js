const express = require('express');
const router = express.Router();
const pool = require('../../db.js');

router.get('/', async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'book id is required' });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM books 
             WHERE id = $1`,
            [id] // Use wildcards for partial matches
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