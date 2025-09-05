const express = require('express');
const router = express.Router();
const pool = require('../../db.js');

router.get('/', async (req, res) => {
    if (!req.session.userId) 
        return res.status(401).json({ error: 'User not authenticated' });
    
    try {
        const cartId = req.session.cartId;
        const {rows} = await pool.query(
            `SELECT ci.id, ci.book_id, b.title, b.author, b.price, ci.quantity, b.image_url 
             FROM cart_items ci 
             JOIN books b ON ci.book_id = b.id 
             WHERE ci.cart_id = $1`,
            [cartId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;