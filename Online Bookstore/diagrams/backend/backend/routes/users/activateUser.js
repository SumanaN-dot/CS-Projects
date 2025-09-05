// Import Express
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import the database connection
const pool = require('../../db.js');
// Activates a user's account when the click the activation link
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('BEGIN');
        
        // Update users table
        await pool.query(`UPDATE users SET is_active = true WHERE id = $1`, [id]);
        
        // Update customer table
        await pool.query(`UPDATE customer SET is_active = 'Active'::customer_state WHERE customerid = $1`, [id]);
        
        await pool.query('COMMIT');
        res.send("User account successfully activated!");
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Activation error:', err);
        res.status(500).send("User activation failed.");
    }
});

module.exports = router;