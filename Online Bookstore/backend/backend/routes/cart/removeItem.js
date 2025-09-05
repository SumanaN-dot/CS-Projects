const express = require("express");
const router = express.Router();    
const pool = require("../../db");

router.post("/", async (req, res) => {
    const { bookId } = req.body;
    
    if (!bookId) {
        return res.status(400).json({ error: "Book ID is required" });
    }
    
    try {
        // Remove the book from the cart
        const result = await pool.query(
        "DELETE FROM cart_items WHERE book_id = $1 RETURNING *",
        [bookId]
        );
    
        if (result.rowCount === 0) {
        return res.status(404).json({ error: "Book not found in cart" });
        }

        res.json({ message: "Item removed successfully" });
    } catch (error) {
        console.error("Error removing item:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;