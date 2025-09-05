const express = require('express');
const router = express.Router();
const pool = require('../../db.js'); 

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM books WHERE release_date >= '2005-01-01' ORDER BY id ASC LIMIT 10`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
