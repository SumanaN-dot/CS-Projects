const express = require('express');
const router = express.Router();
const pool = require('../../db.js');

router.post('/', async (req, res) => {
    const { bookId } = req.body;

    // Check if user is authenticated
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized: Please log in to add items to your cart.' });
    }

    // Basic validation
    if (!bookId) {
        return res.status(400).json({ message: 'Book ID is required' });
    }

    try {
        // Check if the book exists
        const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
        if (bookResult.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Add the book to the user's shopping cart
        const existingItem = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = (SELECT cartid FROM shopping_cart WHERE user_id = $1) AND book_id = $2',
            [req.session.userId, bookId]
        );

        if (existingItem.rows.length > 0) {
            // If the item already exists in the cart, increment the quantity
            await pool.query(
                'UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = (SELECT cartid FROM shopping_cart WHERE user_id = $1) AND book_id = $2',
                [req.session.userId, bookId]
            );
        } else {
            // If the item does not exist, insert it with quantity 1
            await pool.query(
                'INSERT INTO cart_items (cart_id, book_id, quantity) VALUES ((SELECT cartid FROM shopping_cart WHERE user_id = $1), $2, 1)',
                [req.session.userId, bookId]
            );
        }

        res.status(200).json({ message: 'Book added to cart successfully' });
    } catch (err) {
        console.error('Error adding book to cart:', err.stack);
        res.status(500).json({ message: 'Failed to add book to cart' });
    }
});

module.exports = router;