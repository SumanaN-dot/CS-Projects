const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.post("/", async (req, res) => {
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ error: "Book ID is required" });
  }

  try {
    // Increase the quantity of the book in the cart
    const result = await pool.query(
      "UPDATE cart_items SET quantity = quantity + 1 WHERE book_id = $1 RETURNING *",
      [bookId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Book not found in cart" });
    }
    const newQuantity = result.rows[0].quantity;
    res.json({ message: "Quantity increased successfully", newQuantity });
  } catch (error) {
    console.error("Error increasing quantity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
