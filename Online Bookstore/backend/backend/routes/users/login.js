const express = require('express');
const router = express.Router();
const pool = require('../../db.js'); 

router.post('/', async (req, res) => {
    const { username_or_email, password } = req.body;

    // Basic validation
    if (!username_or_email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if the user exists
        const {rows} = await pool.query('SELECT * FROM users WHERE (email = $1 OR username = $1) AND is_active = true LIMIT 1', [username_or_email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];

        // Verify the password using bcrypt
        const bcrypt = require('bcrypt');
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const cart_id = await pool.query('SELECT cartid FROM shopping_cart WHERE user_id = $1', [user.id]);
      
        // If login is successful, return the user ID (or any other relevant info)
        req.session.userId = user.id; // Store user ID in session

        const adminCheck = await pool.query(
            'SELECT 1 FROM admin WHERE adminid = $1',
            [user.id]
        )
        const isAdmin = adminCheck.rows.length > 0;

        req.session.admin = isAdmin;
        req.session.username = user.username; // Store username in session
        req.session.cartId = cart_id.rows[0].cartid; // Store cart ID in session
        
        res.status(200).json({ message: 'Login successful', isAdmin});
    } catch (err) {
        console.error('Error during login:', err.stack);
        res.status(500).json({ message: 'Login Failed' });
    }
});

module.exports = router;
// This code defines a route to handle user login, checking credentials against the database and using bcrypt