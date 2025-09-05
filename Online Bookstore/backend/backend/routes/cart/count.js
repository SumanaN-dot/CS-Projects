const express = require('express');
const router = express.Router();
const pool = require('../../db.js');

router.get('/', async (req, res) => {
    if (!req.session.userId) 
        return res.status(401).json({ error: 'User not authenticated' });
    
    try {
        const cartId = req.session.cartId;
        const result = await pool.query(
            'SELECT SUM(quantity) AS itemCount FROM cart_items WHERE cart_id = $1',
            [cartId]
        );
        const itemCount = result.rows[0].itemcount || 0;
        //console.log('Cart item count:', itemCount);
        res.json({ itemCount });
    } catch (error) {
        console.error('Error fetching cart count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
