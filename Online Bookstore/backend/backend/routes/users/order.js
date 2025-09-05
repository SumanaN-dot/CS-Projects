const express = require("express");
const router = express.Router();
const pool = require("../../db"); // Adjust if your pool is elsewhere


router.get("/", async (req, res) => {
  try {
    const userId = req.session.userId;
     
    // Get all orders for the user
    const ordersResult = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    const orders = ordersResult.rows;

    // For each order, fetch its items and their associated book details
    for (let order of orders) {
      const itemsResult = await pool.query(
        `SELECT 
          oi.*, 
          b.title, 
          b.author, 
          b.image_url 
         FROM order_items oi
         JOIN books b ON oi.book_id = b.id
         WHERE oi.order_id = $1`,
        [order.id]
      );

      order.items = itemsResult.rows;
    }
    
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error retrieving orders" });
  }
});

module.exports = router;
