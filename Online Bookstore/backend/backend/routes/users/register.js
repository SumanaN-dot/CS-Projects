// This file sets up the Express router for user-related routes in the backend.
const express = require('express');
const router = express.Router();
const { UserBuilder } = require('../../models/User');
const { sendConfirmationEmail } = require('./email.js'); // Import the email sending function

router.post('/register', async (req, res) => {
    try {

        const { 
            username, email, password, first_name, last_name, promoOptIn,
            address_line1, address_line2, city, state, zip_code, country,
            card_number, expiry_date, cvv, billing_address
        } = req.body;

        // Basic validation
        if (!username || !email || !password || !first_name || !last_name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Use builder pattern to create user
        let userBuilder = new UserBuilder()
            .setBasicInfo(username, email, password, first_name, last_name)
            .setPromoOptIn(promoOptIn);

        // Add shipping address if provided
        if (address_line1 && city && state && zip_code) {
            userBuilder = userBuilder.setShippingAddress(
                address_line1, address_line2, city, state, zip_code, country
            );
        }

        // Add payment info if provided
        if (card_number && expiry_date && cvv) {
            userBuilder = userBuilder.setPaymentInfo(
                card_number, expiry_date, cvv, billing_address
            );
        }

        // Build and save user
        const user = userBuilder.build();
        const userId = await user.save();

        // Send confirmation email
        await sendConfirmationEmail(email, username, userId);
        res.status(201).json({ message: 'User registered successfully', userId});
    } catch (err) {
        console.error('Error during registration:', err.stack);
        if (err.message === 'Email already exists' || err.message === 'Username already taken') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ message: 'Registration Failed' });
    }
});

module.exports = router;
// This code defines a route to handle user registration.