const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // Destroy the session to log out the user
        if (!req.session) {
            return res.status(400).json({ message: 'No active session found' });
        }
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Logout failed' });
            }

            // Send a success response
            res.status(200).json({ message: 'Logout successful' });
        });
    } catch (err) {
        console.error('Error during logout:', err.stack);
        res.status(500).json({ message: 'Logout failed' });
    }
});

module.exports = router;