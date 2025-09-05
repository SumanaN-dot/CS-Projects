const express = require('express');
const router = express.Router();
const { BookBuilder } = require('../../models/Book.js');

// POST route to add a new book
router.post('/', async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        // Create new book using builder pattern
        const book = new BookBuilder()
            .setBasicInfo(
                req.body.title,
                req.body.author || null,
                req.body.genre || null
            )
            .setPricing(req.body.price || null)
            .setImageUrl(req.body.image_url || null)
            .setReleaseDate(req.body.release_date || null)
            .setInventory(req.body.inventory || 0)
            .setFeaturedStatus(req.body.is_featured || false)
            .setComingSoonStatus(req.body.is_coming_soon || false)
            .build();

        // Save book to database
        const bookId = await book.save();

        res.status(201).json({ 
            message: 'Book added successfully', 
            bookId: bookId,
            book: book
        });

    } catch (error) {
        console.error('Error adding book:', error);
        
        // Handle specific database errors
        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({ error: 'Book with this title already exists' });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
