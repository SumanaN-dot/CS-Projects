const express = require('express');
const router = express.Router();
const pool = require('../../db.js');
const { EmailService } = require('./email.js');
const { User } = require('../../models/User.js');




// Instantiate EmailService with Gmail credentials
const emailService = new EmailService('team9bookstore@gmail.com', 'vgyv liya ywuu bvco');

class ProfileService {
    constructor(pool, emailService) {
        this.pool = pool;
        this.emailService = emailService;
    }

    // Only update first and last name — no email/password allowed
    async updateUser(userId, { firstName, lastName }) {
        const query = `
            UPDATE users 
            SET first_name=$1, last_name=$2
            WHERE id=$3
        `;
        const values = [firstName, lastName, userId];
        await this.pool.query(query, values);
    }

    async updateCustomerPromo(userId, promoOptIn) {
        await this.pool.query(
            `UPDATE customer SET send_promo=$1 WHERE customerid=$2`,
            [promoOptIn, userId]
        );
    }

    async updateShipping(userId, { street, city, state, zip }) {
        await this.pool.query(
            `UPDATE shipping_addresses
             SET address_line1=$1, city=$2, state=$3, zip_code=$4
             WHERE user_id=$5`,
            [street, city, state, zip, userId]
        );
    }

    async updatePaymentCard(userId, { card, exp, cvv }) {
        await this.pool.query(
            `UPDATE payment_cards
             SET card_number=$1, expiry_date=$2, cvv=$3
             WHERE user_id=$4`,
            [card, exp, cvv, userId]
        );
    }

    async updateProfile(userId, profileData) {
        try {
            await this.pool.query('BEGIN');

            // Update only allowed fields
            await this.updateUser(userId, profileData);
            await this.updateCustomerPromo(userId, profileData.promoOptIn);
            await this.updateShipping(userId, profileData);
            await this.updatePaymentCard(userId, profileData);

            await this.pool.query('COMMIT');

            // Fetch the current email from DB to avoid spoofing from req.body
            const { rows } = await this.pool.query(
                `SELECT email FROM users WHERE id=$1`,
                [userId]
            );
            const currentEmail = rows[0].email;

            // Send confirmation email
            await this.emailService.sendProfileUpdateEmail(
                currentEmail,
                profileData.firstName
            );

            return { success: true, message: "Profile updated successfully" };
        } catch (err) {
            await this.pool.query('ROLLBACK');
            console.error("Error updating profile:", err);
            return { success: false, message: "Profile update failed." };
        }
    }
}

// Instantiate ProfileService
const profileService = new ProfileService(pool, emailService);



router.get('/', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  try {
    
    const profile = await User.getProfile(userId);

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    const { rows: cards } = await pool.query(
      "SELECT id, card_number, expiry_date, is_default FROM payment_cards WHERE user_id=$1",
      [userId]
    );

    
    const safeCards = cards.map(card => ({
        
      id: card.id,
      last4: card.card_number.slice(-4),
      expiry_date: card.expiry_date,
      is_default: card.is_default
    }));

    
    profile.cards = safeCards;

    res.json(profile);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST route for updating profile
router.post('/add-card', async (req, res) => {
    const userId = req.session.userId;
    
    // Check if user is logged in
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    
    const profileData = req.body;

    const result = await profileService.updateProfile(userId, profileData);

    if (result.success) {
        res.json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
});

router.put('/set-default/:cardId', async (req, res) => {
    const cardId = req.params.cardId;
    const userId = req.session.userId;
    // Unset all, then set chosen as default
    await pool.query(
      "UPDATE payment_cards SET is_default=false WHERE user_id=$1", [userId]
    );
    await pool.query(
      "UPDATE payment_cards SET is_default=true WHERE id=$1 AND user_id=$2", [cardId, userId]
    );
    res.json({ message: "Default card set." });
});


router.delete('/delete-card/:cardId', async (req, res) => {
    const cardId = req.params.cardId;
    const userId = req.session.userId;
    await pool.query(
      "DELETE FROM payment_cards WHERE id=$1 AND user_id=$2", [cardId, userId]
    );
    res.json({ message: "Card deleted." });
});

module.exports = router;
