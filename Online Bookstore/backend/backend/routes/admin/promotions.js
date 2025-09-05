const express = require('express');
const router = express.Router();
const pool = require('../../db.js');
const { EmailService } = require('../users/email');

// Promotion Service class (handles DB operations)
class PromotionService {
  constructor(pool) {
    this.pool = pool;
  }

  async getAllPromotions() {
  const query = `
    SELECT promotionid, name, code, discountpercentage, expirationdate
    FROM promotion
    ORDER BY expirationdate ASC
  `;
  const { rows } = await this.pool.query(query);
  return rows;
}

  async addPromotion(name, code, discount, expiration) {
  const query = `
    INSERT INTO promotion (name, code, discountpercentage, expirationdate)
    VALUES ($1, $2, $3, $4)
    RETURNING promotionid
  `;
  const { rows } = await this.pool.query(query, [name, code, discount, expiration]);
  return rows[0].promotionid;
}

  async getPromoRecipients() {
    const query = `
      SELECT u.email, u.username 
      FROM users u
      JOIN customer c ON u.id = c.customerid
      WHERE c.send_promo = true
    `;
    const { rows } = await this.pool.query(query);
    return rows;
  }
}

// Instantiate service
const promotionService = new PromotionService(pool);

// Routes using the service
router.get('/', async (req, res) => {
  try {
    const promotions = await promotionService.getAllPromotions();
    res.json(promotions);
  } catch (err) {
    console.error('Error fetching promotions:', err);
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});

router.post('/', async (req, res) => {
  const { name, code, discount, expiration } = req.body;

  try {
    const promotionId = await promotionService.addPromotion(name, code, discount, expiration);

    // Send promo emails
    const recipients = await promotionService.getPromoRecipients();
    const emailService = new EmailService(process.env.EMAIL_USER, process.env.EMAIL_PASS);

    for (const customer of recipients) {
      await emailService.sendPromoEmail(
        customer.email,
        customer.username,
        discount,
        expiration,
        name,
        code
      );
    }

    res.status(201).json({ message: 'Promotion created and emails sent', promotionId });
  } catch (err) {
    console.error('Error adding promotion:', err);
    res.status(500).json({ error: 'Failed to add promotion' });
  }
});

module.exports = router;